/* ==========================================================================
   Bean Catcher — a small game made for this site.
   Slide the mug to catch falling coffee beans; golden beans are worth more.
   Catch a bug and you lose a life. Three lives, and it gets faster.
   ========================================================================== */
(function () {
  "use strict";
  window.GAMES = window.GAMES || {};

  var W = 480, H = 360, MUG_W = 64, MUG_H = 44;
  var BEST_KEY = "jm-beancatcher-best";

  function readBest() { try { return +localStorage.getItem(BEST_KEY) || 0; } catch (e) { return 0; } }
  function saveBest(n) { try { localStorage.setItem(BEST_KEY, String(n)); } catch (e) {} }

  window.GAMES.beancatcher = {
    title: "Bean Catcher",
    subtitle: "Catch the coffee, dodge the bugs",
    origin: "Made for this site · 2026",
    mini: true,

    mount: function (root, helpers) {
      root.innerHTML =
        '<div class="bc">' +
          '<div class="bc-bar"><span>SCORE <b id="bc-score">0</b></span><span id="bc-lives">❤️❤️❤️</span><span>BEST <b id="bc-best">' + readBest() + '</b></span></div>' +
          '<div class="bc-wrap"><canvas class="bc-canvas" id="bc-canvas" width="' + W + '" height="' + H + '" aria-label="Bean Catcher playfield"></canvas>' +
            '<div class="bc-over" id="bc-over"><p id="bc-msg">Catch the beans. Dodge the bugs.</p>' +
            '<button class="btn btn--play" type="button" id="bc-start">START</button></div></div>' +
        '</div>';

      var cv = root.querySelector("#bc-canvas"), ctx = cv.getContext("2d");
      var over = root.querySelector("#bc-over");
      var mugX = W / 2, keys = {}, items = [], score = 0, lives = 3, running = false;
      var spawnIn = 0, elapsed = 0, last = 0, raf = 0;

      function paintBar() {
        root.querySelector("#bc-score").textContent = score;
        root.querySelector("#bc-lives").textContent = lives > 0 ? new Array(lives + 1).join("❤️") : "💔";
      }
      function spawn() {
        var r = Math.random(), kind = r < .2 ? "bug" : r < .27 ? "gold" : "bean";
        var speed = 110 + elapsed * 6 + Math.random() * 50;     /* gets faster the longer you last */
        items.push({ x: 20 + Math.random() * (W - 40), y: -20, v: speed, kind: kind, spin: Math.random() * 6 });
      }
      function drawMug() {
        var x = mugX - MUG_W / 2, y = H - MUG_H - 8;
        ctx.fillStyle = "#FFF4E6"; ctx.beginPath();
        ctx.roundRect(x, y, MUG_W, MUG_H, [4, 4, 14, 14]); ctx.fill();
        ctx.strokeStyle = "#FFF4E6"; ctx.lineWidth = 6; ctx.beginPath();
        ctx.arc(x + MUG_W + 2, y + MUG_H / 2, 11, -Math.PI / 2, Math.PI / 2); ctx.stroke();
        ctx.fillStyle = "#8B5E3C"; ctx.fillRect(x + 5, y + 4, MUG_W - 10, 8);  /* the coffee */
        ctx.fillStyle = "#C026D3"; ctx.font = "bold 14px monospace"; ctx.textAlign = "center";
        ctx.fillText("</>", mugX, y + 32);
      }
      function drawItem(it) {
        ctx.save(); ctx.translate(it.x, it.y);
        if (it.kind === "bug") {
          ctx.font = "24px serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("🐞", 0, 0);
        } else {
          ctx.rotate(it.spin);
          ctx.fillStyle = it.kind === "gold" ? "#FACC15" : "#8B5E3C";
          ctx.beginPath(); ctx.ellipse(0, 0, 9, 12, 0, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = it.kind === "gold" ? "#A16207" : "#4A2E1A"; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(0, -9); ctx.quadraticCurveTo(-4, 0, 0, 9); ctx.stroke();
        }
        ctx.restore();
      }
      function draw() {
        ctx.clearRect(0, 0, W, H);
        items.forEach(drawItem);
        drawMug();
      }
      function end() {
        running = false;
        var best = readBest();
        if (score > best) { saveBest(score); root.querySelector("#bc-best").textContent = score; }
        root.querySelector("#bc-msg").textContent = "Game over · " + score + " points" + (score > best && score > 0 ? " · new best!" : "");
        root.querySelector("#bc-start").textContent = "PLAY AGAIN";
        over.hidden = false;
        if (score > best && score > 0 && helpers.confetti) helpers.confetti();
      }
      function tick(t) {
        if (!running) return;
        var dt = Math.min(.05, (t - last) / 1000 || 0); last = t; elapsed += dt;
        if (keys.left) mugX -= 380 * dt;
        if (keys.right) mugX += 380 * dt;
        mugX = Math.max(MUG_W / 2, Math.min(W - MUG_W / 2, mugX));
        spawnIn -= dt;
        if (spawnIn <= 0) { spawn(); spawnIn = Math.max(.32, .9 - elapsed * .02); }
        var top = H - MUG_H - 8;
        items = items.filter(function (it) {
          it.y += it.v * dt; it.spin += dt * 3;
          if (it.y > top - 8 && it.y < top + 14 && Math.abs(it.x - mugX) < MUG_W / 2 + 6) {
            if (it.kind === "bug") { lives -= 1; } else { score += it.kind === "gold" ? 5 : 1; }
            paintBar();
            return false;
          }
          return it.y < H + 20;
        });
        draw();
        if (lives <= 0) { end(); return; }
        raf = requestAnimationFrame(tick);
      }
      function start() {
        items = []; score = 0; lives = 3; elapsed = 0; spawnIn = 0; mugX = W / 2;
        paintBar(); over.hidden = true; running = true;
        last = performance.now(); raf = requestAnimationFrame(tick);
      }

      /* mouse or finger moves the mug; arrow keys or A/D work too */
      function pointer(e) {
        var r = cv.getBoundingClientRect();
        mugX = (e.clientX - r.left) / r.width * W;
      }
      function keyDown(e) {
        if (e.key === "ArrowLeft" || e.key === "a") { keys.left = true; e.preventDefault(); }
        if (e.key === "ArrowRight" || e.key === "d") { keys.right = true; e.preventDefault(); }
      }
      function keyUp(e) {
        if (e.key === "ArrowLeft" || e.key === "a") keys.left = false;
        if (e.key === "ArrowRight" || e.key === "d") keys.right = false;
      }
      cv.addEventListener("pointermove", pointer);
      cv.addEventListener("pointerdown", pointer);
      document.addEventListener("keydown", keyDown);
      document.addEventListener("keyup", keyUp);
      root.querySelector("#bc-start").addEventListener("click", start);
      draw();

      return function () {
        running = false; cancelAnimationFrame(raf);
        document.removeEventListener("keydown", keyDown);
        document.removeEventListener("keyup", keyUp);
      };
    },

    help: "Move the mug with your mouse, finger or the arrow keys. Beans are 1 point, golden beans are 5. Catch a bug and you lose a life. It speeds up the longer you last."
  };
})();
