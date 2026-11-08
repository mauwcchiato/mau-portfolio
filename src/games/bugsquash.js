/* ==========================================================================
   Bug Squash — a small game made for this site.
   Bugs pop out of the code for a moment; tap them before they escape.
   Leave the cat alone: tapping it costs points. Thirty seconds a round.
   ========================================================================== */
(function () {
  "use strict";
  window.GAMES = window.GAMES || {};

  var HOLES = 9, ROUND = 30;
  var BEST_KEY = "jm-bugsquash-best";
  var LINES = ["fn()", "if (x)", "let y", "return", "for (;;)", "await", "null", "i++", "{ }"];

  function readBest() { try { return +localStorage.getItem(BEST_KEY) || 0; } catch (e) { return 0; } }
  function saveBest(n) { try { localStorage.setItem(BEST_KEY, String(n)); } catch (e) {} }

  window.GAMES.bugsquash = {
    title: "Bug Squash",
    subtitle: "Fix the bugs before they ship",
    origin: "Made for this site · 2026",
    mini: true,

    mount: function (root, helpers) {
      var score = 0, left = ROUND, running = false, clock = 0, popper = 0, timeouts = [];

      root.innerHTML =
        '<div class="bs">' +
          '<div class="bc-bar"><span>SCORE <b id="bs-score">0</b></span><span>TIME <b id="bs-time">' + ROUND + 's</b></span><span>BEST <b id="bs-best">' + readBest() + '</b></span></div>' +
          '<div class="bs-grid" id="bs-grid">' +
            LINES.map(function (l, i) {
              return '<button class="bs-hole" type="button" data-i="' + i + '" aria-label="Line ' + (i + 1) + '"><code>' + l + '</code><span class="bs-who"></span></button>';
            }).join("") +
          '</div>' +
          '<p class="mn-msg" id="bs-msg" role="status">Squash 🐞, spare 🐱. 30 seconds.</p>' +
          '<button class="btn btn--play" type="button" id="bs-start">START</button>' +
        '</div>';

      var holes = root.querySelectorAll(".bs-hole");
      function paint() {
        root.querySelector("#bs-score").textContent = score;
        root.querySelector("#bs-time").textContent = left + "s";
      }
      function later(fn, ms) { timeouts.push(setTimeout(fn, ms)); }
      function hide(h) { h.classList.remove("is-up", "is-bug", "is-cat", "is-hit"); h.querySelector(".bs-who").textContent = ""; }

      function pop() {
        if (!running) return;
        var free = [].filter.call(holes, function (h) { return !h.classList.contains("is-up"); });
        if (free.length) {
          var h = free[Math.floor(Math.random() * free.length)];
          var cat = Math.random() < .18;
          h.classList.add("is-up", cat ? "is-cat" : "is-bug");
          h.querySelector(".bs-who").textContent = cat ? "🐱" : "🐞";
          var stay = Math.max(520, 1100 - (ROUND - left) * 18);   /* bugs get quicker as time runs out */
          later(function () { if (!h.classList.contains("is-hit")) hide(h); }, stay);
        }
        popper = setTimeout(pop, Math.max(330, 700 - (ROUND - left) * 10));
      }
      function hit(h) {
        if (!running || !h.classList.contains("is-up") || h.classList.contains("is-hit")) return;
        if (h.classList.contains("is-cat")) { score = Math.max(0, score - 3); h.querySelector(".bs-who").textContent = "😾"; }
        else { score += 1; h.querySelector(".bs-who").textContent = "💥"; }
        h.classList.add("is-hit"); paint();
        later(function () { hide(h); }, 260);
      }
      function stop() {
        running = false; clearInterval(clock); clearTimeout(popper);
        timeouts.forEach(clearTimeout); timeouts = [];
        [].forEach.call(holes, hide);
      }
      function end() {
        stop();
        var best = readBest(), isBest = score > best;
        if (isBest) { saveBest(score); root.querySelector("#bs-best").textContent = score; }
        var m = root.querySelector("#bs-msg");
        m.textContent = "Time! " + score + " bugs squashed" + (isBest && score > 0 ? " · new best!" : ".");
        m.className = "mn-msg is-ok";
        root.querySelector("#bs-start").textContent = "PLAY AGAIN";
        root.querySelector("#bs-start").disabled = false;
        if (isBest && score > 0 && helpers.confetti) helpers.confetti();
      }
      function start() {
        stop(); score = 0; left = ROUND; running = true; paint();
        root.querySelector("#bs-msg").textContent = "Go!"; root.querySelector("#bs-msg").className = "mn-msg";
        root.querySelector("#bs-start").disabled = true;
        clock = setInterval(function () { left -= 1; paint(); if (left <= 0) end(); }, 1000);
        pop();
      }

      [].forEach.call(holes, function (h) { h.addEventListener("pointerdown", function () { hit(h); }); });
      root.querySelector("#bs-start").addEventListener("click", start);

      return stop;
    },

    help: "Bugs pop out of the code for a moment. Tap them to squash them (+1). The cat is a friend: tapping it costs 3 points. You have 30 seconds, and the bugs get faster."
  };
})();
