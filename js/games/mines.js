/* ==========================================================================
   Mines — browser recreation of my Tkinter original.
   Same rules as the Python version: 5×5 grid, 1–24 mines, the bet is taken
   up front, every safe tile pays the bet back again, and one mine ends it.
   You start on 100 coins.
   ========================================================================== */
(function () {
  "use strict";
  window.GAMES = window.GAMES || {};

  var SIZE = 25;

  window.GAMES.mines = {
    title: "Mines",
    subtitle: "Press your luck · web recreation",
    origin: "Original: Python + Tkinter (2024)",

    mount: function (root, helpers) {
      var coins = 100;
      var bet = 10;
      var mineCount = 3;
      var mines = [];
      var revealed = [];
      var live = false;
      var roundGain = 0;

      function shell() {
        root.innerHTML =
          '<div class="mn">' +
            '<div class="mn-bar">' +
              '<label class="mn-field"><span>Mines (1–24)</span>' +
                '<input id="mn-mines" type="number" min="1" max="24" value="' + mineCount + '" inputmode="numeric"></label>' +
              '<label class="mn-field"><span>Bet</span>' +
                '<input id="mn-bet" type="number" min="1" value="' + bet + '" inputmode="numeric"></label>' +
              '<div class="mn-coins"><span>COINS</span><b id="mn-coins">' + coins + '</b></div>' +
            '</div>' +
            '<div class="mn-grid" id="mn-grid" role="grid" aria-label="Mines grid"></div>' +
            '<div class="mn-ctrl">' +
              '<button class="btn btn--play" type="button" id="mn-start">START ROUND</button>' +
              '<button class="btn btn--ghost btn--sm" type="button" id="mn-cash" disabled>CASH OUT</button>' +
              '<button class="btn btn--ghost btn--sm" type="button" id="mn-reset">RESET BANK</button>' +
            '</div>' +
            '<p class="mn-msg" id="mn-msg" role="status">Set your mines and bet, then start a round.</p>' +
          '</div>';

        var g = root.querySelector("#mn-grid");
        var html = "";
        for (var i = 0; i < SIZE; i++) {
          html += '<button class="mn-tile" type="button" data-i="' + i + '" disabled aria-label="Tile ' + (i + 1) + '">?</button>';
        }
        g.innerHTML = html;
        g.querySelectorAll(".mn-tile").forEach(function (b) {
          b.addEventListener("click", function () { pick(+b.dataset.i); });
        });

        root.querySelector("#mn-start").addEventListener("click", start);
        root.querySelector("#mn-cash").addEventListener("click", function () { cashOut(true); });
        root.querySelector("#mn-reset").addEventListener("click", function () {
          coins = 100; live = false; paintCoins(); resetTiles();
          setBtns(false);
          msg("Bank reset to 100 coins.");
        });
      }

      function msg(t, kind) {
        var m = root.querySelector("#mn-msg");
        m.textContent = t; m.className = "mn-msg" + (kind ? " is-" + kind : "");
      }
      function paintCoins() { root.querySelector("#mn-coins").textContent = coins; }
      function setBtns(running) {
        root.querySelector("#mn-start").disabled = running;
        root.querySelector("#mn-cash").disabled = !running;
        root.querySelector("#mn-mines").disabled = running;
        root.querySelector("#mn-bet").disabled = running;
      }
      function resetTiles() {
        root.querySelectorAll(".mn-tile").forEach(function (b) {
          b.className = "mn-tile"; b.textContent = "?"; b.disabled = true;
        });
      }

      function start() {
        var m = parseInt(root.querySelector("#mn-mines").value, 10);
        var b = parseInt(root.querySelector("#mn-bet").value, 10);
        if (!isFinite(m) || m < 1 || m > 24) { msg("Enter a valid number of mines (1–24).", "warn"); return; }
        if (!isFinite(b) || b < 1) { msg("Enter a bet of at least 1 coin.", "warn"); return; }
        if (b > coins) { msg("You only have " + coins + " coins.", "warn"); return; }

        mineCount = m; bet = b;
        coins -= bet; paintCoins();
        roundGain = 0;

        var pool = [];
        for (var i = 0; i < SIZE; i++) pool.push(i);
        for (var j = pool.length - 1; j > 0; j--) {
          var k = Math.floor(Math.random() * (j + 1));
          var tmp = pool[j]; pool[j] = pool[k]; pool[k] = tmp;
        }
        mines = pool.slice(0, mineCount);
        revealed = [];
        live = true;

        resetTiles();
        root.querySelectorAll(".mn-tile").forEach(function (b2) { b2.disabled = false; });
        setBtns(true);
        msg(mineCount + " mines hidden. Each safe tile pays " + bet + " coins.");
      }

      function pick(i) {
        if (!live) return;
        if (revealed.indexOf(i) !== -1) { msg("Already revealed. Pick another tile.", "warn"); return; }
        var tile = root.querySelector('.mn-tile[data-i="' + i + '"]');

        if (mines.indexOf(i) !== -1) {
          live = false;
          revealAll();
          setBtns(false);
          msg("Boom. You hit a mine and lost " + (bet + roundGain) + " coins this round.", "bad");
          return;
        }
        revealed.push(i);
        tile.className = "mn-tile is-gem";
        tile.textContent = "💎";
        tile.disabled = true;
        coins += bet;
        roundGain += bet;
        paintCoins();

        var safeLeft = SIZE - mineCount - revealed.length;
        if (safeLeft === 0) {
          live = false; revealAll(); setBtns(false);
          msg("Perfect clear. Every safe tile found. " + roundGain + " coins this round.", "ok");
          helpers.confetti && helpers.confetti();
        } else {
          msg("Safe. +" + bet + " coins · " + safeLeft + " safe tiles left.", "ok");
        }
      }

      function revealAll() {
        root.querySelectorAll(".mn-tile").forEach(function (b) {
          var i = +b.dataset.i;
          b.disabled = true;
          if (mines.indexOf(i) !== -1) { b.className = "mn-tile is-mine"; b.textContent = "💥"; }
          else if (b.className.indexOf("is-gem") === -1) { b.className = "mn-tile is-safe"; b.textContent = "💎"; }
        });
      }

      function cashOut() {
        if (!live) return;
        live = false;
        revealAll();
        setBtns(false);
        msg("Cashed out with " + coins + " coins. +" + roundGain + " this round.", "ok");
      }

      shell();
      return function () {};
    },

    help: "Choose how many of the 25 tiles are mines and how much to bet. The bet is taken up front; every safe tile pays it back again. Hit a mine and the round is over. Cash out while you're ahead. Same rules as the Tkinter original."
  };
})();
