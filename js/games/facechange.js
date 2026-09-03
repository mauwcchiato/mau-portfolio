/* ==========================================================================
   Face Change Cube — browser recreation of my Xamarin.Android original.
   ROLL a target made of four quadrants, START the clock, tap each corner
   to cycle its six variants. The round ends the moment all four match.
   ========================================================================== */
(function () {
  "use strict";
  window.GAMES = window.GAMES || {};

  var DIR = "assets/img/game/facechange/";
  var PARTS = ["upperleft", "upperright", "bottomleft", "bottomright"];
  var SETS = 6;

  function src(part, n) { return DIR + part + n + ".png"; }
  function bestTime() {
    try { var v = parseFloat(localStorage.getItem("fc-best")); return isFinite(v) ? v : null; } catch (e) { return null; }
  }
  function setBest(v) { try { localStorage.setItem("fc-best", String(v)); } catch (e) {} }

  window.GAMES.facechange = {
    title: "Face Change Cube",
    subtitle: "Speed pattern matching · web recreation",
    origin: "Original: Android, C# / Xamarin (2025)",

    mount: function (root, helpers) {
      var target = null;
      var quads = [1, 2, 3, 4];
      var running = false;
      var t0 = 0, raf = null;
      var best = bestTime();

      function quadImgs(id, clickable) {
        return PARTS.map(function (p, i) {
          if (clickable) {
            return '<button class="fc-q" type="button" data-i="' + i + '" aria-label="Cycle ' + p + ' quadrant">' +
                   '<img src="' + src(p, quads[i]) + '" alt="" draggable="false"></button>';
          }
          return '<div class="fc-q fc-q--static"><img src="' + src(p, 1) + '" alt="" draggable="false"></div>';
        }).join("");
      }

      root.innerHTML =
        '<div class="fc">' +
          '<div class="fc-top">' +
            '<div class="fc-target is-empty" id="fc-target" aria-label="Target face">' +
              '<div class="fc-face" id="fc-target-face">' + quadImgs("t", false) + '</div>' +
              '<span class="fc-target__empty" id="fc-empty">ROLL a target</span>' +
            '</div>' +
            '<div class="fc-stats">' +
              '<div><span>TIME</span><b id="fc-time">0.0s</b></div>' +
              '<div><span>BEST</span><b id="fc-best">' + (best == null ? "–" : best.toFixed(1) + "s") + '</b></div>' +
            '</div>' +
          '</div>' +
          '<div class="fc-cube" id="fc-cube">' + quadImgs("c", true) + '</div>' +
          '<div class="fc-ctrl">' +
            '<button class="btn btn--ghost btn--sm" type="button" id="fc-roll">ROLL</button>' +
            '<button class="btn btn--play" type="button" id="fc-start">START</button>' +
            '<button class="btn btn--ghost btn--sm" type="button" id="fc-reset">RESET</button>' +
          '</div>' +
          '<p class="fc-msg" id="fc-msg" role="status">Roll a target face, then press START. Tap the four corners until they match.</p>' +
        '</div>';

      var targetEl = root.querySelector("#fc-target");
      var targetImgs = root.querySelectorAll("#fc-target-face img");
      var cubeBtns = root.querySelectorAll("#fc-cube .fc-q");
      var startBtn = root.querySelector("#fc-start");

      cubeBtns.forEach(function (b) {
        b.addEventListener("click", function () { cycle(+b.dataset.i); });
      });
      root.querySelector("#fc-roll").addEventListener("click", roll);
      startBtn.addEventListener("click", toggle);
      root.querySelector("#fc-reset").addEventListener("click", reset);

      function matched() {
        return target != null && quads.every(function (q) { return q === target; });
      }

      function scramble(avoid) {
        var guard = 0;
        do {
          quads = PARTS.map(function () { return 1 + Math.floor(Math.random() * SETS); });
          guard++;
        } while (avoid && quads.every(function (q) { return q === avoid; }) && guard < 20);
      }

      function paintTarget() {
        if (target == null) {
          targetEl.classList.add("is-empty");
          return;
        }
        targetEl.classList.remove("is-empty");
        targetImgs.forEach(function (img, i) { img.src = src(PARTS[i], target); });
      }

      function paintCube() {
        cubeBtns.forEach(function (b, i) {
          var img = b.querySelector("img");
          if (img) img.src = src(PARTS[i], quads[i]);
        });
      }

      function msg(t, kind) {
        var m = root.querySelector("#fc-msg");
        m.textContent = t;
        m.className = "fc-msg" + (kind ? " is-" + kind : "");
      }

      function stopClock() {
        running = false;
        if (raf) { cancelAnimationFrame(raf); raf = null; }
        startBtn.textContent = "START";
      }

      function tick() {
        if (!running) return;
        var s = (Date.now() - t0) / 1000;
        root.querySelector("#fc-time").textContent = s.toFixed(1) + "s";
        raf = requestAnimationFrame(tick);
      }

      function roll() {
        if (running) stopClock();
        var next;
        do { next = 1 + Math.floor(Math.random() * SETS); } while (next === target && SETS > 1);
        target = next;
        scramble(target);
        paintTarget();
        paintCube();
        root.querySelector("#fc-time").textContent = "0.0s";
        msg("Target is set " + target + " of " + SETS + ". Press START, then tap the corners.");
      }

      function cycle(i) {
        if (target == null) { msg("Roll a target first.", "warn"); return; }
        if (!running) {
          running = true;
          t0 = Date.now();
          startBtn.textContent = "STOP";
          msg("Match all four corners to the target.");
          tick();
        }
        quads[i] = quads[i] % SETS + 1;
        paintCube();
        if (matched()) finish(true);
      }

      function toggle() {
        if (running) { finish(matched()); return; }
        if (target == null) { msg("Roll a target face first.", "warn"); return; }
        if (matched()) scramble(target), paintCube();
        running = true;
        t0 = Date.now();
        startBtn.textContent = "STOP";
        msg("Match all four corners to the target.");
        tick();
      }

      function finish(didMatch) {
        var s = running || t0 ? (Date.now() - t0) / 1000 : 0;
        stopClock();
        root.querySelector("#fc-time").textContent = s.toFixed(1) + "s";
        if (didMatch) {
          if (best == null || s < best) {
            best = s; setBest(s);
            root.querySelector("#fc-best").textContent = best.toFixed(1) + "s";
            msg("Matched in " + s.toFixed(1) + "s. New best.", "ok");
            helpers.confetti && helpers.confetti();
          } else {
            msg("Matched in " + s.toFixed(1) + "s. Best is still " + best.toFixed(1) + "s.", "ok");
          }
        } else {
          msg("Stopped at " + s.toFixed(1) + "s. The cube did not match.", "warn");
        }
      }

      function reset() {
        stopClock();
        target = null;
        scramble(null);
        paintTarget();
        paintCube();
        root.querySelector("#fc-time").textContent = "0.0s";
        msg("Roll a target face, then press START.");
      }

      scramble(null);
      paintTarget();
      paintCube();

      return function () { stopClock(); };
    },

    help: "ROLL picks a random target face. START begins the clock (or tap a corner after rolling). Cycle each quadrant through its six variants. The round ends the moment all four line up with the target."
  };
})();
