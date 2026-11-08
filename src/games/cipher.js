/* ==========================================================================
   Kama Sutra Cipher — browser recreation of my Python module (IT129, 2025).
   The mapping is the one from the original source: A↔N, B↔O … M↔Z.
   Encryption and decryption are the same operation, which is the point.
   ========================================================================== */
(function () {
  "use strict";
  window.GAMES = window.GAMES || {};

  var LEFT = "ABCDEFGHIJKLM".split("");
  var RIGHT = "NOPQRSTUVWXYZ".split("");
  var MAP = {};
  LEFT.forEach(function (a, i) { MAP[a] = RIGHT[i]; MAP[RIGHT[i]] = a; });

  function transform(text) {
    var out = "", steps = [];
    for (var i = 0; i < text.length; i++) {
      var c = text[i].toUpperCase();
      if (MAP[c]) { out += MAP[c]; steps.push([text[i], MAP[c], true]); }
      else { out += text[i]; steps.push([text[i], text[i], false]); }
    }
    return { out: out, steps: steps };
  }

  window.GAMES.cipher = {
    title: "Kama Sutra Cipher",
    subtitle: "Paired-substitution cipher · web recreation",
    origin: "Original: Python terminal application (IT129, 2025)",

    mount: function (root) {
      function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]; }); }

      var pairRows = LEFT.map(function (a, i) {
        return '<div class="cy-pair"><b>' + a + '</b><span>↔</span><b>' + RIGHT[i] + '</b></div>';
      }).join("");

      root.innerHTML =
        '<div class="cy">' +
          '<div class="term" style="border-radius:12px">' +
            '<div class="term__bar">' +
              '<span class="term__dot"></span><span class="term__dot"></span><span class="term__dot"></span>' +
              '<span class="term__title">kamasutra_cipher.py</span>' +
            '</div>' +
            '<div class="term__body">' +
              '<span class="term__line term__dim">╔══════════════════════════════════════╗</span>' +
              '<span class="term__line term__dim">║      KAMA SUTRA CIPHER SYSTEM        ║</span>' +
              '<span class="term__line term__dim">╚══════════════════════════════════════╝</span>' +
              '<span class="term__line">&nbsp;</span>' +
              '<span class="term__line"><span class="term__prompt">&gt;</span> enter text to transform:</span>' +
            '</div>' +
          '</div>' +

          '<label class="sr-only" for="cy-in">Text to encrypt or decrypt</label>' +
          '<textarea id="cy-in" class="cy-in" rows="3" spellcheck="false" placeholder="Kusina Kode">Kusina Kode</textarea>' +

          '<div class="cy-out-wrap">' +
            '<div class="cy-out-head"><span>OUTPUT</span>' +
              '<button class="btn btn--ghost btn--sm" type="button" id="cy-copy">Copy</button>' +
              '<button class="btn btn--ghost btn--sm" type="button" id="cy-again">Run again ↺</button>' +
            '</div>' +
            '<output class="cy-out" id="cy-out" for="cy-in"></output>' +
          '</div>' +

          '<p class="cy-note">Run it twice and you get your original text back. The cipher is its own inverse.</p>' +

          '<details class="cy-table"><summary>Mapping table (from the original source)</summary>' +
            '<div class="cy-pairs">' + pairRows + '</div></details>' +

          '<details class="cy-table" open><summary>Step-by-step transformation</summary>' +
            '<div class="cy-steps" id="cy-steps"></div></details>' +
        '</div>';

      var input = root.querySelector("#cy-in");
      var out = root.querySelector("#cy-out");
      var stepsBox = root.querySelector("#cy-steps");

      function run() {
        var r = transform(input.value);
        out.textContent = r.out || "—";
        stepsBox.innerHTML = r.steps.slice(0, 120).map(function (s) {
          var shown = s[0] === " " ? "␣" : esc(s[0]);
          var to = s[1] === " " ? "␣" : esc(s[1]);
          return '<span class="cy-step' + (s[2] ? " is-swap" : "") + '">' +
                 shown + '<i>→</i>' + to + '</span>';
        }).join("") + (r.steps.length > 120 ? '<span class="cy-step">…</span>' : "");
      }

      input.addEventListener("input", run);
      root.querySelector("#cy-again").addEventListener("click", function () {
        input.value = out.textContent === "—" ? "" : out.textContent;
        run();
      });
      root.querySelector("#cy-copy").addEventListener("click", function () {
        var t = out.textContent;
        if (navigator.clipboard && t) navigator.clipboard.writeText(t);
      });

      run();
      return function () {};
    },

    help: "The alphabet is split in half and paired: A with N, B with O, and so on to M with Z. Encrypting swaps each letter for its partner. Because swapping is symmetric, the same function decrypts, which makes it a clean involution to demonstrate."
  };
})();
