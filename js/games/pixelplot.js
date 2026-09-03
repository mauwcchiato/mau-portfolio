/* ==========================================================================
   Assembly Plotter — replays "Pixels of Meaning" (CS125, Nov 2025).
   The draw calls in asm-art-data.js were parsed straight out of my original
   .asm files: every entry is one INT 10h / AH=06h call, in execution order.
   ========================================================================== */
(function () {
  "use strict";
  window.GAMES = window.GAMES || {};

  /* Standard 16-colour text-mode palette. The visible colour of an AH=06h
     "scroll window" call is the background nibble of BH. */
  var PALETTE = [
    "#000000", "#0000AA", "#00AA00", "#00AAAA",
    "#AA0000", "#AA00AA", "#AA5500", "#AAAAAA",
    "#555555", "#5555FF", "#55FF55", "#55FFFF",
    "#FF5555", "#FF55FF", "#FFFF55", "#FFFFFF"
  ];

  /* Bounding box of the artwork itself, ignoring op 0 (the full-screen clear). */
  function bbox(art) {
    var ops = art.ops, minX = 1e9, minY = 1e9, maxX = -1, maxY = -1;
    for (var i = 1; i < ops.length; i++) {
      var o = ops[i];
      if (o[1] < minX) minX = o[1];
      if (o[2] < minY) minY = o[2];
      if (o[3] > maxX) maxX = o[3];
      if (o[4] > maxY) maxY = o[4];
    }
    if (maxX < 0) return { x: 0, y: 0, w: art.cols, h: art.rows };
    var pad = 1;
    minX = Math.max(0, minX - pad); minY = Math.max(0, minY - pad);
    maxX = Math.min(art.cols - 1, maxX + pad); maxY = Math.min(art.rows - 1, maxY + pad);
    return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
  }

  /* Shared renderer, also used by the hero CRT and the floating sprites.
     `cell` sizes the canvas from the artwork's bounding box so the subject
     fills the frame instead of floating in an 80×25 text screen. */
  function makeRenderer(canvas, art, opts) {
    opts = opts || {};
    var box = opts.crop === false
      ? { x: 0, y: 0, w: art.cols || 80, h: art.rows || 25 }
      : bbox(art);

    /* Text-mode cells are about twice as tall as they are wide; compensate
       so the artwork keeps the proportions it had on the original screen. */
    var cell = opts.cell || 8;
    var cellW = cell, cellH = Math.round(cell * 1.9);
    canvas.width = box.w * cellW;
    canvas.height = box.h * cellH;

    var ctx = canvas.getContext("2d", { alpha: false });
    var i = 0, raf = null, last = 0;
    var perTick = opts.perTick || 1;
    var interval = opts.interval == null ? 26 : opts.interval;
    var bg = PALETTE[(art.ops[0] ? art.ops[0][0] : 0) & 15];

    function drawOp(op) {
      ctx.fillStyle = PALETTE[op[0] & 15];
      var x = (op[1] - box.x) * cellW, y = (op[2] - box.y) * cellH;
      var w = (op[3] - op[1] + 1) * cellW;
      var h = (op[4] - op[2] + 1) * cellH;
      ctx.fillRect(Math.round(x), Math.round(y), Math.ceil(w), Math.ceil(h));
    }

    function clear() {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    return {
      total: art.ops.length,
      progress: function () { return i; },
      reset: function () { i = art.ops.length > 1 ? 1 : 0; clear(); },
      drawAll: function () { clear(); art.ops.forEach(drawOp); i = art.ops.length; },
      step: function (n) {
        n = n || 1;
        while (n-- > 0 && i < art.ops.length) drawOp(art.ops[i++]);
        return i < art.ops.length;
      },
      play: function (onTick, onDone) {
        this.stop();
        var self = this;
        function frame(ts) {
          if (ts - last >= interval) {
            last = ts;
            var more = self.step(perTick);
            if (onTick) onTick(i, art.ops.length);
            if (!more) { raf = null; if (onDone) onDone(); return; }
          }
          raf = requestAnimationFrame(frame);
        }
        raf = requestAnimationFrame(frame);
      },
      stop: function () { if (raf) { cancelAnimationFrame(raf); raf = null; } },
      setSpeed: function (ms, per) { interval = ms; perTick = per || 1; }
    };
  }

  window.ASM_RENDERER = makeRenderer;

  window.GAMES.pixelplot = {
    title: "Assembly Plotter",
    subtitle: "Watch the code draw · replay of my original source",
    origin: "Original: x86 Assembly, emu8086 (Nov 2025)",

    mount: function (root) {
      var art = window.ASM_ART || {};
      var keys = Object.keys(art);
      if (!keys.length) { root.innerHTML = '<p class="game-help">Assembly data failed to load.</p>'; return function () {}; }
      var current = "burger";
      var r = null, playing = false;

      root.innerHTML =
        '<div class="pp">' +
          '<div class="pp-pick" role="group" aria-label="Choose artwork">' +
            keys.map(function (k) {
              return '<button class="pp-btn" type="button" data-a="' + k + '" aria-pressed="' + (k === current) + '">' +
                     art[k].title + '</button>';
            }).join("") +
          '</div>' +
          '<div class="pp-screen"><canvas id="pp-canvas" role="img" aria-label="Pixel art being drawn"></canvas></div>' +
          '<div class="pp-bar">' +
            '<button class="btn btn--play" type="button" id="pp-play">▶ REPLAY</button>' +
            '<div class="pp-meter"><i id="pp-fill"></i></div>' +
            '<span class="pp-count" id="pp-count">0 / 0</span>' +
          '</div>' +
          '<div class="pp-speed">' +
            '<label for="pp-speed-in">Speed</label>' +
            '<input id="pp-speed-in" type="range" min="1" max="10" value="5" aria-label="Playback speed">' +
          '</div>' +
          '<p class="pp-note" id="pp-note"></p>' +
        '</div>';

      var canvas = root.querySelector("#pp-canvas");
      var fill = root.querySelector("#pp-fill");
      var count = root.querySelector("#pp-count");
      var note = root.querySelector("#pp-note");
      var playBtn = root.querySelector("#pp-play");
      var speed = root.querySelector("#pp-speed-in");

      function speedMs() { return 62 - (+speed.value) * 6; }

      function load(k) {
        current = k;
        if (r) r.stop();
        r = makeRenderer(canvas, art[k], { interval: speedMs(), perTick: 1, cell: 10 });
        r.reset();
        count.textContent = "0 / " + r.total;
        fill.style.width = "0%";
        note.innerHTML = art[k].note + ' <span class="pp-src">' + r.total + ' draw calls · ' + art[k].src + '</span>';
        root.querySelectorAll(".pp-btn").forEach(function (b) {
          b.setAttribute("aria-pressed", String(b.dataset.a === k));
        });
        play();
      }

      function play() {
        if (!r) return;
        playing = true;
        playBtn.textContent = "■ STOP";
        r.reset();
        r.setSpeed(speedMs(), 1);
        r.play(function (i, total) {
          count.textContent = i + " / " + total;
          fill.style.width = (i / total * 100).toFixed(1) + "%";
        }, function () {
          playing = false;
          playBtn.textContent = "▶ REPLAY";
        });
      }

      playBtn.addEventListener("click", function () {
        if (playing) { r.stop(); r.drawAll(); count.textContent = r.total + " / " + r.total; fill.style.width = "100%"; playing = false; playBtn.textContent = "▶ REPLAY"; }
        else play();
      });
      speed.addEventListener("input", function () { if (r) r.setSpeed(speedMs(), 1); });
      root.querySelectorAll(".pp-btn").forEach(function (b) {
        b.addEventListener("click", function () { load(b.dataset.a); });
      });

      var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        r = makeRenderer(canvas, art[current], { interval: speedMs(), cell: 10 });
        r.drawAll();
        count.textContent = r.total + " / " + r.total;
        fill.style.width = "100%";
        note.innerHTML = art[current].note + ' <span class="pp-src">' + r.total + ' draw calls · ' + art[current].src + '</span>';
      } else {
        load(current);
      }

      return function () { if (r) r.stop(); };
    },

    help: "Each step is one INT 10h call from the original assembly file. BH holds the colour attribute, CH/CL the top-left corner, DH/DL the bottom-right. Nothing here is a stored bitmap; the drawing is the code."
  };
})();
