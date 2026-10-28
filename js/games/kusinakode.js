/* ==========================================================================
   Kusina Kode — browser recreation of my Android original.
   Same 20-level dataset, same artwork, same rules: six letters, six tries,
   three hints, and a trivia card as the reward.
   ========================================================================== */
(function () {
  "use strict";
  window.GAMES = window.GAMES || {};

  /* The level data, lifted verbatim from LevelProvider.kt in the Android app. */
  var LEVELS = [
    ["lechon", "A fiesta staple: crispy roast pig.", "Lechon"],
    ["lumpia", "Filipino spring rolls, perfect for snacking.", "Lumpia"],
    ["pancit", "Festive noodle dish symbolizing long life.", "Pancit", "pansit"],
    ["menudo", "Stewed pork & liver in rich tomato sauce.", "Menudo"],
    ["pakbet", "Hearty veggie stew from the Ilocos region.", "Pakbet"],
    ["pastil", "Rice topped with shredded meat in banana leaf.", "Pastil"],
    ["tinola", "Ginger-and-papaya chicken soup, soothing & light.", "Tinola"],
    ["tinapa", "Smoked fish: salty, savory, and utterly delicious.", "Tinapa"],
    ["bulalo", "Beef shank & marrow soup, perfect for rainy days.", "Bulalo"],
    ["bagnet", "Deep-fried pork belly with crackling skin.", "Bagnet"],
    ["bangus", "Milkfish fried until crispy, served with rice.", "Bangus"],
    ["bukayo", "Soft coconut strips simmered in sweet brown sugar syrup.", "Bukayo"],
    ["lengua", "Ox tongue simmered until fork-tender in rich gravy.", "Lengua"],
    ["paksiw", "Pork stewed in tangy vinegar broth with garlic and peppercorns.", "Paksiw"],
    ["pangat", "Meat or fish gently poached in a sour tamarind broth.", "Pangat"],
    ["morcon", "Beef roulade stuffed with egg, carrot, and pickles.", "Morcon"],
    ["proben", "Icy milk popsicle studded with chewy jelly bits.", "Proben"],
    ["sambal", "Garlicky pork sausage lightly sweetened with brown sugar.", "Sambal"],
    ["shakoy", "Twisted fried dough, golden and dusted with granulated sugar.", "Shakoy"],
    ["pagpag", "Street snack of battered scraps, deep-fried until crunchy.", "Pagpag"]
  ];

  var IMG = "assets/img/game/kusinakode/";
  var ROWS = 6, COLS = 6, MAX_HINTS = 3;
  var KEYS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

  function imgFor(i) { return IMG + (LEVELS[i][3] || LEVELS[i][0]) + ".png"; }

  function loadProgress() {
    try {
      var raw = localStorage.getItem("kk-progress");
      var n = raw ? parseInt(raw, 10) : 1;
      return (isFinite(n) && n >= 1 && n <= LEVELS.length) ? n : 1;
    } catch (e) { return 1; }
  }
  function saveProgress(n) { try { localStorage.setItem("kk-progress", String(n)); } catch (e) {} }

  window.GAMES.kusinakode = {
    title: "Kusina Kode",
    subtitle: "Filipino cuisine word puzzle · web recreation",
    origin: "Original: Android, Kotlin + Jetpack Compose (2025–2026)",

    mount: function (root, helpers) {
      var unlocked = loadProgress();
      var view = "select";
      var level = 0;
      var rows, cur, done, hints, letterState, t0, timerId, revealed;
      var cleanupFns = [];

      function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]; }); }

      /* ------------------------------------------------ level select */
      function renderSelect() {
        var html = '<div class="kk">' +
          '<div class="kk-head">' +
            '<img src="' + IMG + 'kk-logo.png" alt="Kusina Kode" class="kk-logo">' +
            '<div><h3>Pick a level</h3><p>Guess the six-letter Filipino dish in six tries. ' +
            unlocked + ' of ' + LEVELS.length + ' unlocked.</p></div>' +
          '</div><div class="kk-levels">';

        for (var i = 0; i < LEVELS.length; i++) {
          var open = (i + 1) <= unlocked;
          html += '<button class="kk-lvl' + (open ? "" : " is-locked") + '" type="button" data-lvl="' + i + '"' +
            (open ? "" : " disabled aria-disabled=\"true\"") + '>' +
            '<img src="' + imgFor(i) + '" alt="" loading="lazy">' +
            '<span class="kk-lvl__n">' + (i + 1) + '</span>' +
            (open ? "" : '<span class="kk-lvl__lock" aria-hidden="true">🔒</span>') +
            '<span class="sr-only">Level ' + (i + 1) + (open ? "" : ", locked") + '</span>' +
            '</button>';
        }
        html += '</div>' +
          '<p class="kk-reset"><button type="button" class="kk-link" id="kk-reset">Reset progress</button></p>' +
          '</div>';
        root.innerHTML = html;

        root.querySelectorAll("[data-lvl]").forEach(function (b) {
          b.addEventListener("click", function () { startLevel(+b.dataset.lvl); });
        });
        var rb = root.querySelector("#kk-reset");
        if (rb) rb.addEventListener("click", function () {
          unlocked = 1; saveProgress(1); renderSelect();
          helpers.toast("Progress reset. Back to level 1.");
        });
      }

      /* ------------------------------------------------ play */
      function startLevel(i) {
        level = i; view = "play";
        rows = []; cur = ""; done = false; hints = 0; revealed = {};
        letterState = {};
        renderPlay();
        t0 = Date.now();
        clearInterval(timerId);
        timerId = setInterval(tick, 250);
        cleanupFns.push(function () { clearInterval(timerId); });
      }

      function elapsed() { return Math.max(0, Math.round((Date.now() - t0) / 1000)); }
      function tick() {
        var el = root.querySelector("#kk-timer");
        if (el) el.textContent = elapsed() + "s";
      }

      function renderPlay() {
        var answer = LEVELS[level][0].toUpperCase();
        var html = '<div class="kk">' +
          '<div class="kk-bar">' +
            '<button class="kk-link" type="button" id="kk-back">← Levels</button>' +
            '<span class="kk-bar__lvl">Level ' + (level + 1) + ' / ' + LEVELS.length + '</span>' +
            '<span class="kk-bar__t">⏱ <b id="kk-timer">0s</b></span>' +
            '<button class="kk-hint" type="button" id="kk-hint">🎁 Hint <b>' + (MAX_HINTS - hints) + '</b></button>' +
          '</div>' +
          '<div class="kk-grid" id="kk-grid" role="grid" aria-label="Guess grid">';

        for (var r = 0; r < ROWS; r++) {
          html += '<div class="kk-row" role="row">';
          for (var c = 0; c < COLS; c++) {
            var ch = "", st = "";
            if (r < rows.length) { ch = rows[r].word[c]; st = rows[r].marks[c]; }
            else if (r === rows.length) {
              ch = cur[c] || (revealed[c] || "");
              if (!cur[c] && revealed[c]) st = "hinted";
            }
            html += '<div class="kk-tile' + (st ? " is-" + st : "") + (ch ? " has-ch" : "") + '" role="gridcell">' + esc(ch) + '</div>';
          }
          html += '</div>';
        }
        html += '</div><div class="kk-kb" id="kk-kb">';
        for (var k = 0; k < KEYS.length; k++) {
          html += '<div class="kk-kb__row">';
          if (k === 2) html += '<button class="kk-key kk-key--wide" type="button" data-k="ENTER">ENTER</button>';
          for (var j = 0; j < KEYS[k].length; j++) {
            var L = KEYS[k][j];
            html += '<button class="kk-key' + (letterState[L] ? " is-" + letterState[L] : "") + '" type="button" data-k="' + L + '">' + L + '</button>';
          }
          if (k === 2) html += '<button class="kk-key kk-key--wide" type="button" data-k="BACK">⌫</button>';
          html += '</div>';
        }
        html += '</div><p class="kk-msg" id="kk-msg" role="status"></p></div>';
        root.innerHTML = html;

        root.querySelector("#kk-back").addEventListener("click", function () {
          clearInterval(timerId); view = "select"; renderSelect();
        });
        root.querySelector("#kk-hint").addEventListener("click", useHint);
        root.querySelectorAll("[data-k]").forEach(function (b) {
          b.addEventListener("click", function () { key(b.dataset.k); });
        });
        void answer;
      }

      function msg(text, kind) {
        var m = root.querySelector("#kk-msg");
        if (!m) return;
        m.textContent = text || "";
        m.className = "kk-msg" + (kind ? " is-" + kind : "");
      }

      function useHint() {
        if (done) return;
        if (hints >= MAX_HINTS) { msg("No hints left for this level.", "warn"); return; }
        var answer = LEVELS[level][0].toUpperCase();
        var free = [];
        for (var i = 0; i < COLS; i++) if (!revealed[i]) free.push(i);
        if (!free.length) { msg("Every letter is already revealed.", "warn"); return; }
        var pick = free[Math.floor(Math.random() * free.length)];
        revealed[pick] = answer[pick];
        hints++;
        renderPlay();
        msg("Position " + (pick + 1) + " is " + answer[pick] + ".", "ok");
      }

      function key(k) {
        if (done) return;
        if (k === "BACK") { cur = cur.slice(0, -1); return renderPlay(); }
        if (k === "ENTER") return submit();
        if (cur.length < COLS && /^[A-Z]$/.test(k)) { cur += k; renderPlay(); }
      }

      /* Wordle marking: greens first, then yellows against the remaining pool. */
      function mark(guess, answer) {
        var marks = new Array(COLS).fill("absent");
        var pool = {};
        var i;
        for (i = 0; i < COLS; i++) {
          if (guess[i] === answer[i]) marks[i] = "correct";
          else pool[answer[i]] = (pool[answer[i]] || 0) + 1;
        }
        for (i = 0; i < COLS; i++) {
          if (marks[i] === "correct") continue;
          if (pool[guess[i]] > 0) { marks[i] = "present"; pool[guess[i]]--; }
        }
        return marks;
      }

      function submit() {
        if (cur.length < COLS) { msg("Six letters needed.", "warn"); return; }
        var answer = LEVELS[level][0].toUpperCase();
        var marks = mark(cur, answer);
        rows.push({ word: cur, marks: marks });

        var rank = { absent: 0, present: 1, correct: 2 };
        for (var i = 0; i < COLS; i++) {
          var L = cur[i];
          if (!letterState[L] || rank[marks[i]] > rank[letterState[L]]) letterState[L] = marks[i];
        }

        var won = cur === answer;
        var guessed = cur;
        cur = "";
        renderPlay();

        if (won) { done = true; clearInterval(timerId); setTimeout(win, 420); return; }
        if (rows.length >= ROWS) {
          done = true; clearInterval(timerId);
          setTimeout(function () { lose(answer); }, 420);
          return;
        }
        msg(ROWS - rows.length + " tries left.", "");
        void guessed;
      }

      function win() {
        var d = LEVELS[level];
        var secs = elapsed();
        if (level + 1 >= unlocked && unlocked < LEVELS.length) {
          unlocked = level + 2; saveProgress(unlocked);
        }
        root.innerHTML =
          '<div class="kk kk-win">' +
            '<img class="kk-win__img" src="' + imgFor(level) + '" alt="' + esc(d[2]) + '">' +
            '<span class="kk-win__badge">Level ' + (level + 1) + ' cleared · ' + secs + 's · ' + rows.length + '/' + ROWS + ' tries</span>' +
            '<h3>' + esc(d[2].toUpperCase()) + '</h3>' +
            '<p class="kk-win__trivia">' + esc(d[1]) + '</p>' +
            '<div class="kk-win__cta">' +
              (level + 1 < LEVELS.length ? '<button class="btn btn--play" type="button" id="kk-next">NEXT LEVEL</button>' : '<span class="kk-win__done">You finished all 20 dishes.</span>') +
              '<button class="btn btn--ghost btn--sm" type="button" id="kk-menu">All levels</button>' +
            '</div>' +
          '</div>';
        var n = root.querySelector("#kk-next");
        if (n) n.addEventListener("click", function () { startLevel(level + 1); });
        root.querySelector("#kk-menu").addEventListener("click", function () { view = "select"; renderSelect(); });
        helpers.confetti && helpers.confetti();
      }

      function lose(answer) {
        var d = LEVELS[level];
        root.innerHTML =
          '<div class="kk kk-win kk-win--lose">' +
            '<img class="kk-win__img" src="' + imgFor(level) + '" alt="' + esc(d[2]) + '">' +
            '<span class="kk-win__badge">Out of tries</span>' +
            '<h3>' + esc(answer) + '</h3>' +
            '<p class="kk-win__trivia">' + esc(d[1]) + '</p>' +
            '<div class="kk-win__cta">' +
              '<button class="btn btn--play" type="button" id="kk-retry">TRY AGAIN</button>' +
              '<button class="btn btn--ghost btn--sm" type="button" id="kk-menu">All levels</button>' +
            '</div>' +
          '</div>';
        root.querySelector("#kk-retry").addEventListener("click", function () { startLevel(level); });
        root.querySelector("#kk-menu").addEventListener("click", function () { view = "select"; renderSelect(); });
      }

      /* physical keyboard */
      function onKey(e) {
        if (view !== "play" || done) return;
        if (e.key === "Enter") { e.preventDefault(); key("ENTER"); }
        else if (e.key === "Backspace") { e.preventDefault(); key("BACK"); }
        else if (/^[a-zA-Z]$/.test(e.key)) { e.preventDefault(); key(e.key.toUpperCase()); }
      }
      document.addEventListener("keydown", onKey);
      cleanupFns.push(function () { document.removeEventListener("keydown", onKey); });

      renderSelect();

      return function () { cleanupFns.forEach(function (f) { f(); }); clearInterval(timerId); };
    },

    help: "Type or tap letters, then ENTER. Green = right letter, right place. Yellow = right letter, wrong place. Brown = not in the word. Three hints per level."
  };
})();
