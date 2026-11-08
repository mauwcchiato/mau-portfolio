/* ==========================================================================
   Memory Match — a small game made for this site.
   Sixteen cards, eight pairs. Flip two at a time; fewer moves is better.
   ========================================================================== */
(function () {
  "use strict";
  window.GAMES = window.GAMES || {};

  var FACES = ["☕", "🐱", "💻", "🐞", "🍪", "🌙", "⭐", "🎧"];
  var BEST_KEY = "jm-memory-best";

  function readBest() { try { return +localStorage.getItem(BEST_KEY) || 0; } catch (e) { return 0; } }
  function saveBest(n) { try { localStorage.setItem(BEST_KEY, String(n)); } catch (e) {} }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) { var k = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[k]; a[k] = t; }
    return a;
  }

  window.GAMES.memory = {
    title: "Memory Match",
    subtitle: "Find all eight pairs",
    origin: "Made for this site · 2026",
    mini: true,

    mount: function (root, helpers) {
      var deck, open, matched, moves, lock, timer = 0, secs;

      function shell() {
        var best = readBest();
        root.innerHTML =
          '<div class="mm">' +
            '<div class="bc-bar"><span>MOVES <b id="mm-moves">0</b></span><span>TIME <b id="mm-time">0s</b></span><span>BEST <b id="mm-best">' + (best ? best + " moves" : "–") + '</b></span></div>' +
            '<div class="mm-grid" id="mm-grid"></div>' +
            '<p class="mn-msg" id="mm-msg" role="status">Flip two cards to find a pair.</p>' +
            '<button class="btn btn--ghost btn--sm" type="button" id="mm-new">NEW GAME</button>' +
          '</div>';
        root.querySelector("#mm-new").addEventListener("click", deal);
        deal();
      }
      function deal() {
        clearInterval(timer); timer = 0; secs = 0;
        deck = shuffle(FACES.concat(FACES)); open = []; matched = 0; moves = 0; lock = false;
        root.querySelector("#mm-moves").textContent = "0";
        root.querySelector("#mm-time").textContent = "0s";
        root.querySelector("#mm-msg").textContent = "Flip two cards to find a pair.";
        root.querySelector("#mm-msg").className = "mn-msg";
        var g = root.querySelector("#mm-grid");
        g.innerHTML = deck.map(function (f, i) {
          return '<button class="mm-card" type="button" data-i="' + i + '" aria-label="Card ' + (i + 1) + '">' +
            '<span class="mm-face mm-back">&lt;/&gt;</span><span class="mm-face mm-front">' + f + '</span></button>';
        }).join("");
        g.querySelectorAll(".mm-card").forEach(function (b) { b.addEventListener("click", function () { flip(b); }); });
      }
      function flip(b) {
        if (lock || b.classList.contains("is-up")) return;
        if (!timer) timer = setInterval(function () { secs += 1; root.querySelector("#mm-time").textContent = secs + "s"; }, 1000);
        b.classList.add("is-up"); open.push(b);
        if (open.length < 2) return;
        moves += 1; root.querySelector("#mm-moves").textContent = moves;
        var a = open[0], c = open[1]; open = [];
        if (deck[+a.dataset.i] === deck[+c.dataset.i]) {
          a.classList.add("is-done"); c.classList.add("is-done"); a.disabled = c.disabled = true;
          matched += 1;
          if (matched === FACES.length) win();
        } else {
          lock = true;
          setTimeout(function () { a.classList.remove("is-up"); c.classList.remove("is-up"); lock = false; }, 750);
        }
      }
      function win() {
        clearInterval(timer); timer = 0;
        var best = readBest(), isBest = !best || moves < best;
        if (isBest) { saveBest(moves); root.querySelector("#mm-best").textContent = moves + " moves"; }
        var m = root.querySelector("#mm-msg");
        m.textContent = "All pairs found in " + moves + " moves and " + secs + "s" + (isBest ? " · new best!" : ".");
        m.className = "mn-msg is-ok";
        if (isBest && helpers.confetti) helpers.confetti();
      }

      shell();
      return function () { clearInterval(timer); };
    },

    help: "Tap a card to flip it, then find its match. Two cards that don't match flip back. Finish with as few moves as you can; your best is saved on this device."
  };
})();
