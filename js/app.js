/* ==========================================================================
   app.js — rendering, navigation, overlays, terminal and easter eggs.
   No framework, no build step. Everything reads from window.SITE.
   ========================================================================== */
(function () {
  "use strict";

  var S = window.SITE;
  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function overlaySync() {
    var on = false;
    ["modal", "lightbox", "term-modal"].forEach(function (id) {
      var n = document.getElementById(id);
      if (n && n.classList.contains("is-open")) on = true;
    });
    document.body.classList.toggle("is-overlay", on);
  }

  function afterSplash(fn) {
    if (!document.documentElement.classList.contains("splash-lock")) { fn(); return; }
    document.addEventListener("jm-splash-done", fn, { once: true });
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c];
    });
  }
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function keycapEl(t) {
    var b = el("button", "keycap");
    b.type = "button";
    b.dataset.skill = t.name;
    b.style.setProperty("--key", "#" + (t.color || "6B5B95"));
    b.setAttribute("aria-label", t.name);
    if (t.slug) {
      b.innerHTML = '<img src="https://cdn.simpleicons.org/' + esc(t.slug) + '/ffffff" alt="" width="28" height="28">';
      var img = b.querySelector("img");
      img.addEventListener("error", function () {
        img.replaceWith(el("span", "keycap__mark", esc(t.mark || t.name.slice(0, 3))));
      });
    } else {
      b.appendChild(el("span", "keycap__mark", esc(t.mark || t.name.slice(0, 3))));
    }
    return b;
  }

  function runMauType(opts) {
    var keys = opts.keys || [];
    var i = 0;
    var timer = 0;
    function hit() {
      if (!keys.length) return;
      keys.forEach(function (k) { k.classList.remove("is-down", "is-on"); });
      var key = keys[i % keys.length];
      key.classList.add("is-down", "is-on");
      if (opts.typed) opts.typed.textContent = key.dataset.skill || "";
      if (opts.typer) {
        opts.typer.classList.add("is-typing");
        opts.typer.classList.toggle("is-left", i % 2 === 0);
        opts.typer.classList.toggle("is-right", i % 2 !== 0);
      }
      i += 1;
    }
    if (reduceMotion || !keys.length) {
      if (keys[0]) {
        keys[0].classList.add("is-on");
        if (opts.typed) opts.typed.textContent = keys[0].dataset.skill || "";
      }
      return function () {};
    }
    hit();
    timer = setInterval(hit, opts.ms || 300);
    return function () {
      clearInterval(timer);
      keys.forEach(function (k) { k.classList.remove("is-down"); });
    };
  }

  /* ======================================================== SPLASH */
  (function splash() {
    var root = document.documentElement;
    var screen = $("#splash");
    var skip = $("#splash-skip");
    var done = false;
    var stopType = function () {};

    function onKey(e) {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        if (e.key === " ") e.preventDefault();
        skipNow();
      }
    }

    function finish() {
      if (done) return;
      done = true;
      stopType();
      document.removeEventListener("keydown", onKey);
      root.classList.remove("splash-lock");
      if (screen) {
        screen.classList.add("is-out");
        screen.setAttribute("aria-hidden", "true");
        setTimeout(function () {
          screen.hidden = true;
        }, reduceMotion ? 0 : 560);
      }
      document.dispatchEvent(new CustomEvent("jm-splash-done"));
    }

    if (!screen) {
      root.classList.remove("splash-lock");
      document.dispatchEvent(new CustomEvent("jm-splash-done"));
      return;
    }

    var bed = $("#splash-keys");
    var typed = $("#splash-typed");
    var typer = $(".mau-typer", screen);
    var icons = (S.techIcons || []).slice(0, 12);
    if (bed) {
      icons.forEach(function (t) { bed.appendChild(keycapEl(t)); });
      stopType = runMauType({
        keys: $$(".keycap", bed),
        typed: typed,
        typer: typer,
        ms: 320
      });
    }

    var wait = reduceMotion ? 280 : 3800;
    var timer = setTimeout(finish, wait);

    function skipNow() {
      clearTimeout(timer);
      finish();
    }

    if (skip) skip.addEventListener("click", function (e) { e.stopPropagation(); skipNow(); });
    screen.addEventListener("click", skipNow);
    document.addEventListener("keydown", onKey);
  })();

  /* ====================================================== TOAST + CONFETTI */
  var toastEl = $("#toast"), toastTimer;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("is-on"); }, 2600);
  }

  function confetti() {
    if (reduceMotion) return;
    var colors = ["#B49CFF", "#6FE3BE", "#FFAC8C", "#FFD166"];
    var host = el("div", "confetti");
    for (var i = 0; i < 34; i++) {
      var p = el("i");
      p.style.left = (Math.random() * 100) + "%";
      p.style.background = colors[i % colors.length];
      p.style.animationDelay = (Math.random() * .35) + "s";
      p.style.animationDuration = (1.1 + Math.random() * .9) + "s";
      host.appendChild(p);
    }
    document.body.appendChild(host);
    setTimeout(function () { host.remove(); }, 2400);
  }

  /* ============================================================ THEME */
  (function theme() {
    var btn = $("#theme-toggle");
    var root = document.documentElement;

    function isDark() {
      var t = root.getAttribute("data-theme");
      if (t) return t === "dark";
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    function sync() {
      var dark = isDark();
      btn.setAttribute("aria-pressed", String(dark));
      btn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
    }
    btn.addEventListener("click", function () {
      var next = isDark() ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("jm-theme", next); } catch (e) {}
      sync();
    });
    if (window.matchMedia) {
      var mq = window.matchMedia("(prefers-color-scheme: dark)");
      (mq.addEventListener ? mq.addEventListener.bind(mq, "change") : mq.addListener.bind(mq))(sync);
    }
    sync();
  })();

  /* ================================================== SCROLL CHROME */
  (function scrollChrome() {
    var bar = $("#progress"), topbar = $("#topbar");
    var ticking = false;
    function update() {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var p = h > 0 ? window.scrollY / h : 0;
      bar.style.transform = "scaleX(" + p.toFixed(4) + ")";
      topbar.classList.toggle("is-stuck", window.scrollY > 12);
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  })();

  /* ====================================================== SCROLLSPY */
  function scrollspy() {
    var links = $$("#topnav a");
    var map = {};
    links.forEach(function (a) {
      var id = a.getAttribute("href").slice(1);
      var sec = document.getElementById(id);
      if (sec) map[id] = { a: a, sec: sec };
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var rec = map[e.target.id];
        if (!rec) return;
        if (e.isIntersecting) {
          links.forEach(function (l) { l.removeAttribute("aria-current"); });
          rec.a.setAttribute("aria-current", "true");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(map).forEach(function (k) { io.observe(map[k].sec); });
  }

  /* ========================================================= REVEAL */
  function reveal() {
    var items = $$(".reveal");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (n) { n.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: .06 });
    items.forEach(function (n) { io.observe(n); });
  }

  /* ========================================================= DRAWER */
  (function drawer() {
    var d = $("#drawer"), open = $("#nav-toggle"), close = $("#drawer-close");
    function set(state) {
      if (state) d.hidden = false;
      requestAnimationFrame(function () { d.classList.toggle("is-open", state); });
      open.setAttribute("aria-expanded", String(state));
      document.body.style.overflow = state ? "hidden" : "";
      if (!state) setTimeout(function () { if (!d.classList.contains("is-open")) d.hidden = true; }, 260);
      if (state) close.focus();
    }
    open.addEventListener("click", function () { set(true); });
    close.addEventListener("click", function () { set(false); open.focus(); });
    $$("#drawer a").forEach(function (a) { a.addEventListener("click", function () { set(false); }); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && d.classList.contains("is-open")) { set(false); open.focus(); }
    });
  })();

  /* ==================================================== HERO TYPING */
  (function heroType() {
    var target = $("#hero-role");
    if (!target) return;
    var roles = S.profile.roles;
    var cursor = el("span", "cursor");
    var text = document.createTextNode("");
    target.textContent = "";
    target.appendChild(text);
    target.appendChild(cursor);

    if (reduceMotion) { text.nodeValue = roles.join(" · "); return; }

    var i = 0, j = 0, deleting = false;
    (function step() {
      var full = roles[i];
      j += deleting ? -1 : 1;
      text.nodeValue = full.slice(0, j);
      var wait = deleting ? 26 : 52;
      if (!deleting && j === full.length) { deleting = true; wait = 1500; }
      else if (deleting && j === 0) { deleting = false; i = (i + 1) % roles.length; wait = 260; }
      setTimeout(step, wait);
    })();
  })();

  /* =============================================== HERO PIXEL CANVAS */
  (function heroCanvas() {
    var canvas = $("#hero-canvas");
    if (!canvas || !window.ASM_ART || !window.ASM_RENDERER) return;
    var label = $("#crt-label");
    var current = "burger", r = null;

    function load(key, animate) {
      var art = window.ASM_ART[key];
      if (!art) return;
      current = key;
      if (r) r.stop();
      r = window.ASM_RENDERER(canvas, art, { interval: 18, perTick: 1, cell: 10 });
      if (animate && !reduceMotion) {
        r.reset();
        label.textContent = "DRAWING…";
        r.play(null, function () { label.textContent = art.ops.length + " CALLS"; });
      } else {
        r.drawAll();
        label.textContent = art.ops.length + " CALLS";
      }
      $$(".crt__switch button").forEach(function (b) {
        b.setAttribute("aria-pressed", String(b.dataset.art === key));
      });
    }

    $$(".crt__switch button").forEach(function (b) {
      b.addEventListener("click", function () { load(b.dataset.art, true); });
    });
    canvas.addEventListener("click", function () { load(current, true); });
    canvas.style.cursor = "pointer";

    load("burger", true);
  })();

  /* ============================================ FLOATING PIXEL SPRITES
     Drawn from the same assembly data as the CRT, so they are the real
     artwork rather than a screenshot of the emulator window. */
  (function sprites() {
    if (!window.ASM_ART || !window.ASM_RENDERER) return;
    $$("[data-sprite]").forEach(function (host) {
      var art = window.ASM_ART[host.dataset.sprite];
      if (!art) return;
      var c = document.createElement("canvas");
      c.className = "pixelated";
      c.setAttribute("aria-hidden", "true");
      window.ASM_RENDERER(c, art, { cell: 4 }).drawAll();
      host.appendChild(c);
    });
  })();

  /* ======================================================== JOURNEY */
  function renderJourney() {
    var rail = $("#journey-rail"), panel = $("#journey-panel");
    if (!rail) return;

    S.journey.forEach(function (c, i) {
      var b = el("button", "chapter-btn",
        '<span class="chapter-btn__i">' + c.idx + '</span>' +
        '<span class="chapter-btn__t">' + esc(c.title) + '</span>' +
        '<span class="chapter-btn__y">' + esc(c.years) + '</span>' +
        '<span class="chapter-btn__bar"><i></i></span>');
      b.type = "button";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-selected", String(i === 0));
      b.id = "chap-" + c.id;
      b.addEventListener("click", function () { select(i); });
      b.addEventListener("keydown", function (e) {
        var n = null;
        if (e.key === "ArrowRight") n = (i + 1) % S.journey.length;
        if (e.key === "ArrowLeft") n = (i - 1 + S.journey.length) % S.journey.length;
        if (n != null) { e.preventDefault(); select(n); rail.children[n].focus(); }
      });
      rail.appendChild(b);
    });

    function select(i) {
      var c = S.journey[i];
      $$(".chapter-btn", rail).forEach(function (b, k) { b.setAttribute("aria-selected", String(k === i)); });
      panel.setAttribute("aria-labelledby", "chap-" + c.id);
      panel.innerHTML =
        '<span class="mono-label">' + esc(c.years) + '</span>' +
        '<h3>' + esc(c.lede) + '</h3>' +
        '<p>' + esc(c.body) + '</p>' +
        '<div class="journey__items">' +
          c.items.map(function (it) {
            return '<div class="journey__item"><b>' + esc(it.t) + '</b><span>' + esc(it.s) + '</span><p>' + esc(it.p) + '</p></div>';
          }).join("") +
        '</div>';
    }
    select(0);
  }

  /* ======================================================= PROJECTS */
  function projById(id) {
    for (var i = 0; i < S.projects.length; i++) if (S.projects[i].id === id) return S.projects[i];
    return null;
  }

  function renderFeatured() {
    var list = S.projects.filter(function (p) { return p.featured; });
    var stage = $("#coverflow-stage");
    var meta = $("#coverflow-meta");
    var dots = $("#coverflow-dots");
    if (!stage || !list.length) return;
    var i = 0;

    list.forEach(function (p, n) {
      var card = el("button", "cover-card");
      card.type = "button";
      card.setAttribute("aria-label", p.name);
      card.innerHTML = '<img src="' + esc(p.hero) + '" alt="" loading="lazy" decoding="async"' +
        (p.heroFit === "contain" ? ' style="object-fit:contain;padding:8%;background:var(--bg-3)"' : "") +
        (p.heroPixel ? ' class="pixelated"' : "") + '>';
      card.addEventListener("click", function () {
        if (window.matchMedia && window.matchMedia("(max-width: 720px)").matches) {
          openProject(p.id);
          return;
        }
        if (n === i) openProject(p.id);
        else { i = n; paint(); }
      });
      stage.appendChild(card);
    });

    list.forEach(function (p, n) {
      var d = el("button");
      d.type = "button";
      d.setAttribute("aria-label", "Show " + p.name);
      d.addEventListener("click", function () { i = n; paint(); });
      dots.appendChild(d);
    });

    function paint() {
      $$(".cover-card", stage).forEach(function (card, n) {
        var d = n - i;
        var abs = Math.abs(d);
        card.style.setProperty("--x", String(d * 235));
        card.style.setProperty("--z", String(abs === 0 ? 90 : -abs * 110));
        card.style.setProperty("--ry", String(d === 0 ? 0 : (d < 0 ? 38 : -38)));
        card.style.setProperty("--s", String(abs === 0 ? 1 : Math.max(0.58, 1 - abs * 0.16)));
        card.style.setProperty("--o", String(abs > 3 ? 0 : (abs === 0 ? 1 : 0.48)));
        card.style.zIndex = String(24 - abs);
        card.classList.toggle("is-active", n === i);
        card.setAttribute("aria-current", n === i ? "true" : "false");
      });
      $$("#coverflow-dots button").forEach(function (b, n) {
        b.classList.toggle("is-on", n === i);
      });
      var p = list[i];
      meta.innerHTML =
        '<span class="coverflow__kicker">' + esc(p.kicker) + " · " + esc(p.year) + "</span>" +
        "<h3>" + esc(p.name) + "</h3>" +
        "<p>" + esc(p.blurb) + "</p>" +
        '<button class="btn btn--primary" type="button" id="cover-open">View case study</button>';
      var go = $("#cover-open");
      if (go) go.addEventListener("click", function () { openProject(p.id); });
    }

    function step(d) {
      i = (i + d + list.length) % list.length;
      paint();
    }
    var prev = $("#cover-prev"), next = $("#cover-next");
    if (prev) prev.addEventListener("click", function () { step(-1); });
    if (next) next.addEventListener("click", function () { step(1); });
    stage.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
      if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
    });
    paint();
  }

  function renderMore() {
    var grid = $("#more-grid");
    S.projects.filter(function (p) { return !p.featured; }).forEach(function (p, i) {
      var card = el("button", "mini reveal");
      card.type = "button";
      card.style.setProperty("--d", (i % 4) * 55 + "ms");
      card.setAttribute("aria-label", "Open details: " + p.name);
      card.innerHTML =
        '<span class="mini__top">' +
          '<span class="mini__icon" aria-hidden="true">' + esc(p.icon || "··") + '</span>' +
          '<span class="mini__year">' + esc(p.year) + '</span>' +
        '</span>' +
        '<h4>' + esc(p.name) + '</h4>' +
        '<p>' + esc(p.blurb) + '</p>' +
        '<span class="chips">' + p.tech.slice(0, 3).map(function (t) { return '<span class="chip">' + esc(t) + '</span>'; }).join("") + '</span>';
      card.addEventListener("click", function () { openProject(p.id); });
      grid.appendChild(card);
    });
  }

  /* ---------------------------------------------- project modal body */
  function projectHTML(p) {
    var h = "";

    if (p.hero) {
      h += '<div class="pm__hero"><img src="' + esc(p.hero) + '" alt=""' +
           (p.heroFit === "contain" ? ' style="object-fit:contain;padding:3%;background:var(--bg-3)"' : "") +
           (p.heroPixel ? ' class="pixelated"' : "") + '></div>';
    }

    h += '<div class="modal__body">';
    h += '<div class="pm__head">' +
           '<div><span class="mono-label">' + esc(p.kicker) + '</span>' +
           '<h3 id="modal-title">' + esc(p.name) + '</h3>' +
           (p.sub ? '<span class="mono-label" style="text-transform:none;letter-spacing:.02em">' + esc(p.sub) + '</span>' : "") + '</div>' +
           '<div class="pm__meta">' + esc(p.year) + '<br>' + esc(p.course) + '<br>' + esc(p.team) + '</div>' +
         '</div>';

    h += '<p class="pm__tagline">' + esc(p.tagline || p.blurb) + '</p>';

    h += '<div class="pm__cols">';
    if (p.problem)  h += '<div class="pm__block"><h4>The problem</h4><p>' + esc(p.problem) + '</p></div>';
    if (p.solution) h += '<div class="pm__block"><h4>What we built</h4><p>' + esc(p.solution) + '</p></div>';
    h += '</div>';

    h += '<div class="pm__section"><div class="pm__cols">';
    if (p.role || p.contribution) {
      h += '<div class="pm__block"><h4>My role</h4>' +
           (p.role ? '<p style="color:var(--ink);font-weight:500;margin-bottom:10px">' + esc(p.role) + '</p>' : "") +
           (p.contribution ? '<ul>' + p.contribution.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join("") + '</ul>' : "") +
           '</div>';
    }
    if (p.features) {
      h += '<div class="pm__block"><h4>Key features</h4><ul>' +
           p.features.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join("") + '</ul></div>';
    }
    h += '</div></div>';

    if (p.process || p.outcome) {
      h += '<div class="pm__section"><div class="pm__cols">';
      if (p.process) h += '<div class="pm__block"><h4>How it was built</h4><p>' + esc(p.process) + '</p></div>';
      if (p.outcome) h += '<div class="pm__block"><h4>Outcome</h4><p>' + esc(p.outcome) + '</p></div>';
      h += '</div></div>';
    }

    h += '<div class="pm__section"><div class="pm__cols">' +
         '<div class="pm__block"><h4>Technologies</h4><div class="chips">' +
         p.tech.map(function (t) { return '<span class="chip chip--lilac">' + esc(t) + '</span>'; }).join("") +
         '</div></div>';
    if (p.skills) {
      h += '<div class="pm__block"><h4>Skills demonstrated</h4><div class="chips">' +
           p.skills.map(function (t) { return '<span class="chip chip--mint">' + esc(t) + '</span>'; }).join("") +
           '</div></div>';
    }
    h += '</div></div>';

    if (p.gallery && p.gallery.length) {
      h += '<div class="pm__section"><h4 style="font-family:var(--f-mono);font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--lilac)">Gallery</h4>' +
           '<div class="pm__gallery" data-gal="' + esc(p.id) + '">' +
           p.gallery.map(function (g, i) {
             return '<figure class="pm__shot" role="button" tabindex="0" data-i="' + i + '">' +
                    '<img src="' + esc(g.src) + '" alt="' + esc(g.cap) + '" loading="lazy"' + (g.pixel ? ' class="pixelated"' : "") + '>' +
                    '<figcaption>' + esc(g.cap) + '</figcaption></figure>';
           }).join("") + '</div></div>';
    }

    if (p.video) {
      h += '<div class="pm__section"><h4 style="font-family:var(--f-mono);font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--lilac)">Demo video</h4>' +
           '<video class="pm__video" controls preload="none" playsinline src="' + esc(p.video.src) + '"></video>' +
           '<p class="mono-label" style="margin-top:8px;text-transform:none;letter-spacing:.02em">' + esc(p.video.cap) + '</p></div>';
    }

    if (p.note) h += '<div class="note" style="margin-top:22px"><span>' + esc(p.note) + '</span></div>';

    h += '<div class="pm__links">';
    if (p.playable) {
      h += '<button class="btn btn--play" type="button" data-play="' + esc(p.playable) + '">▶ PLAY IT</button>';
    }
    if (p.figma) {
      h += '<a class="btn btn--ghost" href="' + esc(p.figma) + '" target="_blank" rel="noopener noreferrer">Open in Figma</a>';
    }
    if (p.repo) {
      h += '<a class="btn btn--ghost" href="' + esc(p.repo) + '" target="_blank" rel="noopener noreferrer">' +
           '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.9 10.9c.6.1.8-.2.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.4-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 1.8 2.7 1.3 3.4 1 .1-.7.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .4.2.7.8.6A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5z"/></svg>' +
           'GitHub</a>';
    } else if (p.githubSoon) {
      h += '<span class="btn btn--ghost" aria-disabled="true" title="Uploading soon">GitHub (soon)</span>';
    }
    h += '</div>';

    h += '<p class="mono-label" style="margin-top:20px;text-transform:none;letter-spacing:.02em;line-height:1.6">' +
         'Source files and full documentation are held in my academic archive and can be shared on request.</p>';

    h += '</div>';
    return h;
  }

  /* ========================================================== MODAL */
  var modal = $("#modal"), modalPanel = $("#modal-panel"), modalBody = $("#modal-body");
  var lastFocus = null, activeGameCleanup = null;

  function openModal(html, label) {
    lastFocus = document.activeElement;
    modalPanel.innerHTML =
      '<button class="icon-btn modal__close" id="modal-close" type="button" aria-label="Close">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg></button>' + html;
    modal.hidden = false;
    modal.setAttribute("aria-label", label || "Details");
    requestAnimationFrame(function () { modal.classList.add("is-open"); overlaySync(); });
    document.body.style.overflow = "hidden";
    $("#modal-close").addEventListener("click", closeModal);
    modal.scrollTop = 0;
    var h = $("#modal-title") || $("#modal-close");
    if (h) h.setAttribute("tabindex", "-1"), h.focus({ preventScroll: true });
  }

  function closeModal() {
    if (activeGameCleanup) { try { activeGameCleanup(); } catch (e) {} activeGameCleanup = null; }
    modal.classList.remove("is-open");
    overlaySync();
    document.body.style.overflow = "";
    setTimeout(function () {
      if (!modal.classList.contains("is-open")) { modal.hidden = true; modalPanel.innerHTML = ""; }
    }, 260);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });

  function openProject(id) {
    var p = projById(id);
    if (!p) return;
    openModal(projectHTML(p), p.name);

    $$(".pm__shot", modalPanel).forEach(function (fig) {
      function go() { openLightbox(p.gallery.map(toItem), +fig.dataset.i, p.name); }
      fig.addEventListener("click", go);
      fig.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); }
      });
    });
    var pb = $("[data-play]", modalPanel);
    if (pb) pb.addEventListener("click", function () { openGame(pb.dataset.play); });
  }
  function toItem(g) { return { type: "img", src: g.src, cap: g.cap, pixel: g.pixel }; }

  /* =========================================================== GAMES */
  function renderPlayable() {
    var grid = $("#play-grid");
    S.playable.forEach(function (g, i) {
      var card = el("button", "play-card reveal");
      card.type = "button";
      card.style.setProperty("--d", (i % 3) * 70 + "ms");
      card.setAttribute("aria-label", "Play " + g.title);
      var art = g.art && g.art.length
        ? (g.art.length > 1
            ? '<span class="stack">' + g.art.map(function (a) { return '<img class="pixelated" src="' + esc(a) + '" alt="" loading="lazy">'; }).join("") + '</span>'
            : '<img class="pixelated" src="' + esc(g.art[0]) + '" alt="" loading="lazy">')
        : '<span style="font-family:var(--f-pixel);font-size:26px;color:var(--mint)">' + (g.id === "mines" ? "💎" : "&lt;/&gt;") + '</span>';

      card.innerHTML =
        '<span class="play-card__art">' + art + '</span>' +
        '<span class="play-card__body">' +
          '<h3>' + esc(g.title) + '</h3>' +
          '<span class="play-card__tag">' + esc(g.sub) + '</span>' +
          '<p>' + esc(g.desc) + '</p>' +
          '<span class="play-card__foot">' +
            '<span class="chip chip--mint">' + esc(g.tag) + '</span>' +
            '<span class="play-card__go">▶ PLAY</span>' +
          '</span>' +
        '</span>';
      card.addEventListener("click", function () { openGame(g.id); });
      grid.appendChild(card);
    });
  }

  function openGame(id) {
    var g = window.GAMES && window.GAMES[id];
    if (!g) { toast("That demo could not be loaded."); return; }
    var meta = null;
    S.playable.forEach(function (p) { if (p.id === id) meta = p; });

    openModal(
      '<div class="modal__body">' +
        '<div class="pm__head">' +
          '<div><span class="mono-label">Web recreation</span>' +
          '<h3 id="modal-title">' + esc(g.title) + '</h3>' +
          '<span class="mono-label" style="text-transform:none;letter-spacing:.02em">' + esc(g.subtitle) + '</span></div>' +
          '<div class="pm__meta">' + esc(g.origin) + '</div>' +
        '</div>' +
        '<div class="game-shell">' +
          '<div class="game-stage" id="game-stage"></div>' +
          '<p class="game-help">' + esc(g.help || "") + '</p>' +
          '<div class="note"><span>This is a browser recreation of my college project. Same rules and same assets, ' +
          'rebuilt in JavaScript. It is not the original ' + esc((meta && meta.origin) ? meta.origin.replace(/^Original:\s*/, "") : "build") + ' binary.</span></div>' +
        '</div>' +
      '</div>', g.title);

    var stage = $("#game-stage");
    activeGameCleanup = g.mount(stage, { toast: toast, confetti: confetti }) || null;
  }

  /* ======================================================= LIGHTBOX */
  var lb = $("#lightbox"), lbStage = $("#lb-stage"), lbTitle = $("#lb-title"),
      lbMeta = $("#lb-meta"), lbFoot = $("#lb-foot");
  var lbItems = [], lbIdx = 0, lbLabel = "", lbLastFocus = null;

  function openLightbox(items, idx, label) {
    lbItems = items; lbIdx = idx || 0; lbLabel = label || "";
    lbLastFocus = document.activeElement;
    lb.hidden = false;
    requestAnimationFrame(function () { lb.classList.add("is-open"); overlaySync(); });
    document.body.style.overflow = "hidden";
    paintLightbox();
    $("#lb-close").focus();
  }
  function closeLightbox() {
    lb.classList.remove("is-open");
    overlaySync();
    setTimeout(function () {
      if (!lb.classList.contains("is-open")) { lb.hidden = true; lbStage.innerHTML = ""; }
    }, 260);
    if (!modal.classList.contains("is-open")) document.body.style.overflow = "";
    if (lbLastFocus && lbLastFocus.focus) lbLastFocus.focus();
  }
  function paintLightbox() {
    var it = lbItems[lbIdx];
    if (!it) return;
    lbTitle.textContent = it.title || lbLabel;
    lbMeta.textContent = (lbItems.length > 1 ? (lbIdx + 1) + " of " + lbItems.length + " · " : "") + (it.sub || "");
    lbStage.innerHTML = it.type === "pdf"
      ? '<iframe src="' + esc(it.src) + '#view=FitH" title="' + esc(it.cap || it.title || "Document") + '"></iframe>'
      : '<img src="' + esc(it.src) + '" alt="' + esc(it.cap || "") + '"' + (it.pixel ? ' class="pixelated"' : "") + '>';
    var foot = it.cap ? '<span>' + esc(it.cap) + '</span>' : "";
    if (it.link) foot += '<a class="btn btn--ghost btn--sm" href="' + esc(it.link) + '" target="_blank" rel="noopener noreferrer">' + esc(it.linkLabel || "Open") + '</a>';
    if (it.type === "pdf") foot += '<a class="btn btn--ghost btn--sm" href="' + esc(it.src) + '" target="_blank" rel="noopener noreferrer">Open PDF in a new tab</a>';
    lbFoot.innerHTML = foot;
    $("#lb-prev").hidden = lbItems.length < 2;
    $("#lb-next").hidden = lbItems.length < 2;
  }
  function lbStep(d) {
    if (lbItems.length < 2) return;
    lbIdx = (lbIdx + d + lbItems.length) % lbItems.length;
    paintLightbox();
  }
  $("#lb-close").addEventListener("click", closeLightbox);
  $("#lb-prev").addEventListener("click", function () { lbStep(-1); });
  $("#lb-next").addEventListener("click", function () { lbStep(1); });
  lb.addEventListener("click", function (e) { if (e.target === lb || e.target === lbStage) closeLightbox(); });

  /* ======================================================== GALLERY */
  function buildGallery() {
    return (S.designGallery || []).map(function (it) {
      return {
        type: "img", src: it.src, cap: it.cap, pixel: it.pixel,
        title: it.title, sub: it.sub, cat: it.cat, wide: it.wide
      };
    });
  }

  function renderGallery() {
    var grid = $("#gal-grid"), filters = $("#gal-filters");
    var items = buildGallery();
    var cats = ["All"];
    items.forEach(function (i) { if (cats.indexOf(i.cat) === -1) cats.push(i.cat); });

    cats.forEach(function (c, i) {
      var b = el("button", "filter", esc(c));
      b.type = "button";
      b.setAttribute("aria-pressed", String(i === 0));
      b.addEventListener("click", function () {
        $$(".filter", filters).forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true");
        $$(".gal", grid).forEach(function (fig) {
          fig.classList.toggle("is-hidden", c !== "All" && fig.dataset.cat !== c);
        });
      });
      filters.appendChild(b);
    });

    items.forEach(function (it, i) {
      var fig = el("figure", "gal reveal" + (it.wide ? " gal--wide" : ""));
      fig.dataset.cat = it.cat;
      fig.setAttribute("role", "button");
      fig.setAttribute("tabindex", "0");
      fig.style.setProperty("--d", (i % 4) * 45 + "ms");
      fig.innerHTML =
        '<img src="' + esc(it.src) + '" alt="' + esc(it.cap) + '" loading="lazy" decoding="async"' + (it.pixel ? ' class="pixelated"' : "") + '>' +
        '<figcaption><b>' + esc(it.title) + '</b><span>' + esc(it.sub) + '</span></figcaption>';
      function go() { openLightbox(items, i, it.title); }
      fig.addEventListener("click", go);
      fig.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
      grid.appendChild(fig);
    });
  }

  /* ========================================================= SKILLS */
  function normSkill(s) {
    return String(s || "").toLowerCase().replace(/[^a-z0-9.+#]+/g, " ").trim();
  }
  function skillHitsProject(skill, p) {
    var needle = normSkill(skill);
    if (!needle) return false;
    var hay = (p.tech || []).concat(p.skills || []).concat([p.name, p.kicker, p.sub]);
    return hay.some(function (t) {
      var h = normSkill(t);
      return h === needle || h.indexOf(needle) !== -1 || needle.indexOf(h) !== -1;
    });
  }
  function projectsForSkill(skill) {
    return S.projects.filter(function (p) { return skillHitsProject(skill, p); });
  }

  function renderSkills() {
    var grid = $("#tech-grid");
    var roles = $("#cap-roles");
    var deck = $("#soft-deck");
    var hit = $("#skill-hit");
    var q = $("#skill-q");
    var icons = S.techIcons || [];

    function clearOn() {
      $$(".keycap.is-on", grid).forEach(function (n) { n.classList.remove("is-on"); });
    }
    function showHits(skill) {
      if (!hit) return;
      var hits = projectsForSkill(skill).slice(0, 5);
      hit.hidden = false;
      if (!hits.length) {
        hit.innerHTML = esc(skill) + " is in the archive (coursework, labs, or leadership), not a featured case study.";
        return;
      }
      hit.innerHTML = esc(skill) + " shows up in " +
        hits.map(function (p, i) {
          var sep = i === hits.length - 1 ? "" : (i === hits.length - 2 ? " and " : ", ");
          return '<button type="button" data-pid="' + esc(p.id) + '">' + esc(p.name) + '</button>' + sep;
        }).join("") + ".";
      $$("button[data-pid]", hit).forEach(function (b) {
        b.addEventListener("click", function () { openProject(b.dataset.pid); });
      });
    }

    var board = $("#skill-board");
    var typed = $("#skill-typed");
    var typer = board ? $(".mau-typer", board) : null;
    var stopIdle = function () {};
    var idleTimer = 0;

    function visibleKeys() {
      return $$(".keycap", grid).filter(function (k) { return !k.classList.contains("is-hidden"); });
    }
    function startIdle() {
      stopIdle();
      stopIdle = runMauType({
        keys: visibleKeys(),
        typed: typed,
        typer: typer,
        ms: 420
      });
    }

    if (grid) {
      icons.forEach(function (t) {
        var b = keycapEl(t);
        b.addEventListener("click", function () {
          clearOn();
          stopIdle();
          clearTimeout(idleTimer);
          b.classList.add("is-on", "is-down");
          if (typed) typed.textContent = t.name;
          if (typer) {
            typer.classList.add("is-typing");
            typer.classList.toggle("is-left");
            typer.classList.toggle("is-right");
          }
          showHits(t.name);
          setTimeout(function () { b.classList.remove("is-down"); }, 160);
          idleTimer = setTimeout(startIdle, 2200);
        });
        grid.appendChild(b);
      });
      if (!reduceMotion && board && "IntersectionObserver" in window) {
        var io = new IntersectionObserver(function (ents) {
          if (ents[0] && ents[0].isIntersecting) startIdle();
          else stopIdle();
        }, { threshold: 0.2 });
        io.observe(board);
      }
    }

    if (roles && S.skillRoles) {
      roles.innerHTML = S.skillRoles.map(function (r, i) {
        var chip = i === 0 ? "chip chip--lilac" : "chip chip--mint";
        return '<article class="cap-role">' +
          '<div class="cap-role__top"><span class="cap-role__n">' + esc(r.n) + '</span>' +
          '<span class="cap-role__k">' + esc(r.k) + '</span></div>' +
          '<div class="cap-role__ico" aria-hidden="true">' + esc(r.ico) + '</div>' +
          '<p>' + esc(r.p) + '</p>' +
          '<div class="chips">' + r.tags.map(function (t) {
            return '<button class="' + chip + '" type="button" data-skill="' + esc(t) + '">' + esc(t) + '</button>';
          }).join("") + '</div></article>';
      }).join("");
      $$("[data-skill]", roles).forEach(function (b) {
        b.addEventListener("click", function () { showHits(b.dataset.skill); });
      });
    }

    if (deck && S.softSkills) {
      var hues = ["lilac", "mint", "peach", "sun", "lilac"];
      S.softSkills.forEach(function (s, n) {
        var card = el("article", "soft-card soft-card--" + hues[n % hues.length]);
        card.innerHTML =
          '<span class="soft-card__k">Trait</span>' +
          '<h4>' + esc(s.t) + '</h4>' +
          '<p>' + esc(s.p) + '</p>';
        deck.appendChild(card);
      });
      var top = 0;
      function layout() {
        var cards = $$(".soft-card", deck);
        var rot = [-7, 9, -3, 5, 2];
        var tx = [0, 14, -10, 8, -4];
        cards.forEach(function (c, n) {
          var d = (n - top + cards.length) % cards.length;
          c.style.zIndex = String(cards.length - d);
          c.style.setProperty("--rot", (d === 0 ? -6 : rot[d] || 4) + "deg");
          c.style.setProperty("--tx", (d === 0 ? "0px" : (tx[d] || 6) + "px"));
          c.style.setProperty("--ty", (d === 0 ? "0px" : d * 6 + "px"));
        });
      }
      layout();
      deck.addEventListener("click", function () {
        top = (top + 1) % S.softSkills.length;
        layout();
      });
      deck.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); deck.click(); }
      });
    }

    if (q) {
      q.addEventListener("input", function () {
        var term = q.value.trim().toLowerCase();
        $$(".keycap", grid).forEach(function (tile) {
          var ok = !term || tile.dataset.skill.toLowerCase().indexOf(term) !== -1;
          tile.classList.toggle("is-hidden", !ok);
        });
        startIdle();
      });
    }
  }

  /* ========================================================== CERTS */
  function certColor(t) {
    return ({ pro: "var(--lilac)", spec: "var(--lilac)", training: "var(--mint)", academy: "var(--peach)", seminar: "var(--ink-3)", org: "var(--sun)" })[t] || "var(--lilac)";
  }
  function certItems() {
    return S.certs.map(function (c) {
      return {
        type: "pdf", src: c.file,
        title: c.name,
        sub: c.issuer + (c.via ? " · " + c.via : ""),
        cap: c.date + " · " + S.certTypes[c.type].label + (c.note ? ": " + c.note : ""),
        link: c.verify || "", linkLabel: "Verify credential"
      };
    });
  }

  function renderCerts() {
    var feat = $("#cert-featured"), list = $("#cert-list"), filters = $("#cert-filters"), count = $("#cert-count");
    var items = certItems();

    S.certs.forEach(function (c, i) {
      if (!c.featured) return;
      var b = el("button", "cert reveal");
      b.type = "button";
      b.style.setProperty("--seal-c", certColor(c.type));
      b.style.setProperty("--d", (i % 3) * 55 + "ms");
      b.setAttribute("aria-label", "View certificate: " + c.name);
      b.innerHTML =
        '<span class="cert__seal"><span class="cert__issuer">' + esc(c.issuer) + '</span></span>' +
        '<span class="cert__body">' +
          '<span class="cert__title">' + esc(c.name) + '</span>' +
          '<span class="cert__meta">' + esc(c.date) + (c.via ? ' · ' + esc(c.via) : "") + '</span>' +
          '<span class="cert__type">' + esc(S.certTypes[c.type].label) + '</span>' +
        '</span>';
      b.addEventListener("click", function () { openLightbox(items, S.certs.indexOf(c), c.name); });
      feat.appendChild(b);
    });

    var cats = ["All"];
    S.certs.forEach(function (c) { if (cats.indexOf(c.cat) === -1) cats.push(c.cat); });
    cats.forEach(function (cat, i) {
      var b = el("button", "filter", esc(cat));
      b.type = "button";
      b.setAttribute("aria-pressed", String(i === 0));
      b.addEventListener("click", function () {
        $$(".filter", filters).forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true");
        var shown = 0;
        $$(".cert-row", list).forEach(function (row) {
          var hit = cat === "All" || row.dataset.cat === cat;
          row.classList.toggle("is-hidden", !hit);
          if (hit) shown++;
        });
        count.textContent = "Showing " + shown + " of " + S.certs.length + " credentials.";
      });
      filters.appendChild(b);
    });

    S.certs.forEach(function (c, i) {
      var row = el("button", "cert-row");
      row.type = "button";
      row.dataset.cat = c.cat;
      row.style.setProperty("--row-c", certColor(c.type));
      row.setAttribute("aria-label", "View certificate: " + c.name);
      row.innerHTML =
        '<span class="cert-row__dot" aria-hidden="true"></span>' +
        '<span class="cert-row__txt"><b>' + esc(c.name) + '</b><span>' + esc(c.issuer) + ' · ' + esc(S.certTypes[c.type].label) + '</span></span>' +
        '<span class="cert-row__yr">' + esc(c.date) + '</span>';
      row.addEventListener("click", function () { openLightbox(items, i, c.name); });
      list.appendChild(row);
    });

    count.textContent = "Showing " + S.certs.length + " of " + S.certs.length + " credentials.";

    $("#badge-note").innerHTML =
      '<strong>' + esc(S.badges.title) + ': ' + S.badges.count + ' badges.</strong> ' + esc(S.badges.note) +
      ' <a href="' + esc(S.badges.profile) + '" target="_blank" rel="noopener noreferrer">View public profile</a>.';

    var g = $("#badge-grid");
    if (g && S.badges.items) {
      g.innerHTML = S.badges.items.map(function (b, i) {
        return '<article class="gbadge" style="--d:' + (i % 4) * 40 + 'ms">' +
          '<span class="gbadge__kind">' + esc(b.kind) + '</span>' +
          '<h3>' + esc(b.name) + '</h3>' +
          '<p>' + esc(b.track) + '</p>' +
          '<span class="gbadge__date">' + esc(b.date) + '</span></article>';
      }).join("");
    }
  }

  /* ===================================================== LEADERSHIP */
  function renderLeadership() {
    var L = S.leadership;
    var shots = L.photos || [];
    var film = $("#lead-film");
    if (film && shots.length) {
      film.innerHTML = shots.map(function (p, i) {
        return '<figure class="lead-shot' + (p.hero ? " lead-shot--hero" : "") + (p.wide ? " lead-shot--wide" : "") +
          '" role="button" tabindex="0" data-i="' + i + '">' +
          '<img src="' + esc(p.src) + '" alt="' + esc(p.cap) + '" loading="lazy" decoding="async">' +
          '<figcaption><b>' + esc(p.title) + '</b><span>' + esc(p.sub) + '</span></figcaption></figure>';
      }).join("");
      var items = shots.map(function (p) {
        return { type: "img", src: p.src, cap: p.cap, title: p.title, sub: p.sub };
      });
      $$(".lead-shot", film).forEach(function (fig) {
        function go() { openLightbox(items, +fig.dataset.i, "ITSOC presidency"); }
        fig.addEventListener("click", go);
        fig.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); }
        });
      });
    }

    $("#lead-card").innerHTML =
      '<span class="lead-card__crown">★ ELECTED ROLE</span>' +
      '<h3>' + esc(L.role) + '</h3>' +
      '<p class="lead-card__org">' + esc(L.org) + '</p>' +
      '<p class="lead-card__term">' + esc(L.where) + ' · ' + esc(L.term) + '</p>' +
      '<p>' + esc(L.body) + '</p>' +
      '<ul style="margin:18px 0 0;padding-left:17px;color:var(--ink-2);font-size:.9em;line-height:1.65">' +
      L.also.map(function (a) { return '<li style="margin-bottom:5px">' + esc(a) + '</li>'; }).join("") + '</ul>';

    $("#lead-events").innerHTML = L.events.map(function (e) {
      return '<article class="event">' +
        '<div class="event__date"><b>' + esc(e.d) + '</b>' + esc(e.m) + '</div>' +
        '<div><h4>' + esc(e.t) + '</h4><p>' + esc(e.p) + '</p>' +
        (e.win ? '<span class="event__win">✔ ' + esc(e.win) + '</span>' : "") + '</div>' +
      '</article>';
    }).join("");
  }

  /* ====================================================== EDUCATION */
  function renderEducation() {
    $("#edu-grid").innerHTML = S.education.map(function (e) {
      var klass = "edu-card" + (e.img ? " edu-card--photo" : "") + (e.mark ? " edu-card--degree" : "");
      return '<div class="' + klass + '">' +
        (e.mark ? '<span class="edu-card__mark" aria-hidden="true">' + esc(e.mark) + '</span>' : "") +
        (e.img
          ? '<button class="edu-card__media" type="button" data-src="' + esc(e.img) + '" data-title="' + esc(e.t) + '" data-cap="' + esc(e.cap || e.t) + '">' +
            '<img src="' + esc(e.img) + '" alt="' + esc(e.t) + '" loading="lazy" decoding="async"></button>'
          : "") +
        '<div class="edu-card__body"><span class="edu-card__k">' + esc(e.k) + '</span>' +
        '<h3>' + esc(e.t) + '</h3><p>' + esc(e.p) + '</p>' +
        '<p class="edu-card__meta">' + esc(e.m) + '</p></div></div>';
    }).join("");
    $$(".edu-card__media").forEach(function (b) {
      b.addEventListener("click", function () {
        openLightbox([{ type: "img", src: b.dataset.src, cap: b.dataset.cap, title: b.dataset.title }], 0, b.dataset.title);
      });
    });
    $("#honors").innerHTML = S.honors.map(function (h) { return '<span class="honor">' + esc(h) + '</span>'; }).join("");

    var wall = $("#proof-wall");
    var proofs = S.proofs || [];
    if (wall && proofs.length) {
      wall.innerHTML = proofs.map(function (p, i) {
        return '<figure class="proof' + (p.wide ? " proof--wide" : "") + (p.tall ? " proof--tall" : "") +
          '" role="button" tabindex="0" data-i="' + i + '">' +
          '<img src="' + esc(p.src) + '" alt="' + esc(p.cap) + '" loading="lazy" decoding="async">' +
          '<figcaption>' + esc(p.title) + '<span>' + esc(p.sub) + '</span></figcaption></figure>';
      }).join("");
      var items = proofs.map(function (p) {
        return { type: "img", src: p.src, cap: p.cap, title: p.title, sub: p.sub };
      });
      $$(".proof", wall).forEach(function (fig) {
        function go() { openLightbox(items, +fig.dataset.i, "Awards and proof"); }
        fig.addEventListener("click", go);
        fig.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); }
        });
      });
    }
  }

  /* ======================================================== CONTACT */
  function renderContact() {
    var P = S.profile;
    var ico = {
      mail: '<path d="M4 4h16v16H4z" fill="none"/><path d="M22 6l-10 7L2 6"/><rect x="2" y="4" width="20" height="16" rx="2"/>',
      phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
      gh: '',
      li: '<rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/><path d="M10 9h4v2a4 4 0 0 1 4-2c3 0 4 2 4 5v7h-4v-6c0-1.5-.5-2.5-2-2.5S14 13.5 14 15v6h-4z"/>'
    };
    var rows = [
      { t: "Email", v: P.email, href: "mailto:" + P.email, copy: P.email, i: ico.mail },
      { t: "Phone", v: P.phone, href: "tel:+63" + P.phone.replace(/\D/g, "").replace(/^0/, ""), copy: P.phone, i: ico.phone },
      { t: "GitHub", v: "github.com/" + P.githubHandle, href: P.github, copy: P.github, i: null, gh: true },
      { t: "LinkedIn", v: "linkedin.com/in/jm-de-roxas", href: P.linkedin, copy: P.linkedin, i: ico.li }
    ];
    $("#contact-links").innerHTML = rows.map(function (r) {
      var svg = r.gh
        ? '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.9 10.9c.6.1.8-.2.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.4-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 1.8 2.7 1.3 3.4 1 .1-.7.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .4.2.7.8.6A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5z"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + r.i + '</svg>';
      var ext = r.href.indexOf("http") === 0 ? ' target="_blank" rel="noopener noreferrer"' : "";
      return '<div class="contact-row">' +
        '<a class="contact-link" href="' + esc(r.href) + '"' + ext + '>' +
          '<span class="contact-link__ico" aria-hidden="true">' + svg + '</span>' +
          '<span class="contact-link__t"><b>' + esc(r.t) + '</b><span>' + esc(r.v) + '</span></span>' +
          '<span class="contact-link__go" aria-hidden="true">→</span></a>' +
        '<button class="contact-link__copy" type="button" data-copy="' + esc(r.copy || r.v) + '" aria-label="Copy ' + esc(r.t) + '">Copy</button>' +
      '</div>';
    }).join("");

    $$(".contact-link__copy").forEach(function (b) {
      b.addEventListener("click", function () {
        var text = b.dataset.copy;
        var done = function () {
          b.textContent = "OK";
          b.classList.add("is-ok");
          toast("Copied " + text);
          setTimeout(function () { b.textContent = "Copy"; b.classList.remove("is-ok"); }, 1400);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done).catch(done);
        } else {
          done();
        }
      });
    });

    var card = $(".contact__card");
    if (card && !reduceMotion) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100) + "%");
        card.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100) + "%");
      });
    }
  }

  /* =========================================== RESUME FALLBACK */
  (function fallbacks() {
    var rb = $("#resume-btn");
    if (rb) {
      fetch(rb.getAttribute("href"), { method: "HEAD" })
        .then(function (r) { if (!r.ok) throw 0; })
        .catch(function () {
          rb.removeAttribute("download");
          rb.setAttribute("href", "mailto:" + S.profile.email + "?subject=Résumé%20request");
          rb.lastChild.nodeValue = " Request résumé by email";
          rb.title = "Résumé PDF not yet added. Drop it at assets/docs/resume.pdf";
        });
    }
  })();

  /* ======================================================= TERMINAL */
  (function terminal() {
    var m = $("#term-modal"), out = $("#term-out"), input = $("#term-in");
    var openBtn = $("#term-open"), closeBtn = $("#term-close");
    var last = null;

    function line(html, cls) {
      var s = el("span", "term__line" + (cls ? " " + cls : ""), html);
      out.appendChild(s);
      out.scrollTop = out.scrollHeight;
    }
    function banner() {
      out.innerHTML = "";
      line('<span class="term__ok">jm-portfolio v1.0</span> · type <span class="term__prompt">help</span> for commands.', "term__dim");
      line("&nbsp;");
    }
    function open() {
      last = document.activeElement;
      m.hidden = false;
      requestAnimationFrame(function () { m.classList.add("is-open"); overlaySync(); });
      document.body.style.overflow = "hidden";
      if (!out.childNodes.length) banner();
      setTimeout(function () { input.focus(); }, 60);
    }
    function close() {
      m.classList.remove("is-open");
      overlaySync();
      document.body.style.overflow = modal.classList.contains("is-open") ? "hidden" : "";
      setTimeout(function () { if (!m.classList.contains("is-open")) m.hidden = true; }, 260);
      if (last && last.focus) last.focus();
    }

    var CMDS = {
      help: function () {
        line("Available commands:", "term__ok");
        [["whoami", "who is behind this site"],
         ["skills", "the technical stack, grouped"],
         ["projects", "everything on this page"],
         ["certs", "certificate counts by category"],
         ["play <name>", "launch a game: kusinakode, facechange, mines, pixelplot, cipher"],
         ["contact", "how to reach me"],
         ["goto <section>", "jump to a section"],
         ["theme", "flip light / dark"],
         ["sudo", "…try it"],
         ["mau", "say hi to the cat"],
         ["clear", "wipe the screen"]
        ].forEach(function (c) {
          line("  <span class='term__prompt'>" + c[0] + "</span>  <span class='term__dim'>" + c[1] + "</span>");
        });
      },
      whoami: function () {
        var P = S.profile;
        line(P.name);
        line(P.program + " · " + P.school, "term__dim");
        line("Graduating " + P.gradYear + " · OJT window " + P.ojt, "term__dim");
        line("President, Information Technology Society (A.Y. 2024–2025)", "term__dim");
        line("Currently: capstone project manager, and the person who writes the API docs.", "term__dim");
      },
      skills: function () {
        S.skills.forEach(function (s) {
          line("<span class='term__prompt'>" + esc(s.cat) + "</span> <span class='term__dim'>" + esc(s.items.join(", ")) + "</span>");
        });
      },
      projects: function () {
        S.projects.forEach(function (p) {
          line((p.featured ? "<span class='term__ok'>★</span> " : "  ") +
               "<span class='term__prompt'>" + esc(p.name) + "</span> " +
               "<span class='term__dim'>" + esc(p.year) + " · " + esc(p.kicker) + "</span>");
        });
        line("&nbsp;");
        line("Type <span class='term__prompt'>goto work</span> to see the case studies.", "term__dim");
      },
      certs: function () {
        var by = {};
        S.certs.forEach(function (c) { by[c.cat] = (by[c.cat] || 0) + 1; });
        line(S.certs.length + " credentials on file:", "term__ok");
        Object.keys(by).forEach(function (k) {
          line("  <span class='term__prompt'>" + esc(k) + "</span> <span class='term__dim'>× " + by[k] + "</span>");
        });
        line("  <span class='term__prompt'>Google Cloud Skills Boost</span> <span class='term__dim'>× " + S.badges.count + " badges</span>");
      },
      contact: function () {
        line("email    <span class='term__prompt'>" + S.profile.email + "</span>");
        line("phone    <span class='term__prompt'>" + S.profile.phone + "</span>");
        line("github   <span class='term__prompt'>" + S.profile.github + "</span>");
        line("linkedin <span class='term__prompt'>" + S.profile.linkedin + "</span>");
      },
      theme: function () { $("#theme-toggle").click(); line("Theme flipped.", "term__ok"); },
      clear: function () { banner(); },
      sudo: function () {
        line("Nice try. You already have full access. Everything here is public.", "term__dim");
        line("(Mau is in the bottom-right corner. Click her.)", "term__dim");
      },
      ls: function () { CMDS.projects(); },
      cat: function () { line("🐈 Mau says hello. She was drawn in 113 assembly draw calls.", "term__ok"); },
      mau: function () { CMDS.cat(); },
      exit: function () { close(); }
    };

    function run(raw) {
      var parts = raw.trim().split(/\s+/);
      var cmd = (parts[0] || "").toLowerCase();
      var arg = (parts[1] || "").toLowerCase();
      line('<span class="term__prompt">jm@portfolio:~$</span> ' + esc(raw));
      if (!cmd) return;

      if (cmd === "play") {
        if (window.GAMES && window.GAMES[arg]) { close(); openGame(arg); return; }
        line("Unknown game. Try: kusinakode, facechange, mines, pixelplot, cipher", "term__dim");
        return;
      }
      if (cmd === "goto") {
        var sec = document.getElementById(arg);
        if (sec) { close(); sec.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" }); return; }
        line("No section called '" + esc(arg) + "'.", "term__dim");
        return;
      }
      if (CMDS[cmd]) { CMDS[cmd](); line("&nbsp;"); return; }
      line("command not found: " + esc(cmd) + ". Type <span class='term__prompt'>help</span>", "term__dim");
      line("&nbsp;");
    }

    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { run(input.value); input.value = ""; }
    });
    openBtn.addEventListener("click", open);
    closeBtn.addEventListener("click", close);
    m.addEventListener("click", function (e) { if (e.target === m) close(); });
    window.__openTerminal = open;
    window.__terminalOpen = function () { return m.classList.contains("is-open"); };
  })();

  /* ================================================== KEYBOARD + EGGS */
  (function shortcuts() {
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        if (lb.classList.contains("is-open")) return closeLightbox();
        if (modal.classList.contains("is-open")) return closeModal();
      }
      if (lb.classList.contains("is-open")) {
        if (e.key === "ArrowLeft") return lbStep(-1);
        if (e.key === "ArrowRight") return lbStep(1);
      }
      var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName) || document.activeElement.isContentEditable;
      if (typing) return;

      if (e.key === "t" || e.key === "T") { e.preventDefault(); window.__openTerminal(); }
      if (e.key === "/") { e.preventDefault(); window.__openTerminal(); }
    });

    /* Konami */
    var seq = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    var pos = 0;
    document.addEventListener("keydown", function (e) {
      var k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      pos = (k === seq[pos]) ? pos + 1 : (k === seq[0] ? 1 : 0);
      if (pos === seq.length) {
        pos = 0;
        confetti();
        toast("↑↑↓↓←→←→BA. Here's Mines. Good luck.");
        setTimeout(function () { openGame("mines"); }, 500);
      }
    });

    /* pixel cat */
    var cat = $("#pixel-cat"), pokes = 0;
    var lines = [
      "Mau. She is a she. 113 assembly draw calls.",
      "She supervised most of these projects.",
      "Try pressing T for a terminal.",
      "↑↑↓↓←→←→BA does something.",
      "Okay, that's enough poking."
    ];
    cat.addEventListener("click", function () {
      toast(lines[Math.min(pokes, lines.length - 1)]);
      pokes++;
      if (!reduceMotion) {
        cat.animate(
          [{ transform: "translateY(0) rotate(0)" }, { transform: "translateY(-16px) rotate(-12deg)" }, { transform: "translateY(0) rotate(0)" }],
          { duration: 420, easing: "cubic-bezier(.3,1.4,.5,1)" }
        );
      }
      if (pokes === 5) { confetti(); openGame("pixelplot"); }
    });
  })();

  /* ========================================================= MOTION */
  function motion() {
    var fine = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (reduceMotion || !fine) return;

    var cur = $("#fx-cursor");
    var mx = window.innerWidth / 2, my = 140;
    var cx = mx, cy = my;
    var trail = [];
    var i;
    for (i = 0; i < 7; i++) {
      var dot = el("i", "fx-trail");
      document.body.appendChild(dot);
      trail.push({ el: dot, x: mx, y: my });
    }

    document.addEventListener("pointermove", function (e) {
      mx = e.clientX;
      my = e.clientY;
      document.body.classList.add("has-cursor");
      if (cur) cur.classList.add("is-on");
      var t = e.target;
      var typing = !!(t.closest && t.closest("input, textarea, select, [contenteditable]"));
      var hot = !typing && !!(t.closest && t.closest("a, button, [role='button'], .chip, .filter, .honor, .cover-card, .keycap, .soft-card, .pass__card, .proof, .proj, .mini, .play-card, .gal, .cert, .gbadge, .contact-link, .chapter-btn"));
      if (cur) {
        cur.classList.toggle("is-text", typing);
        cur.classList.toggle("is-hot", hot);
      }
    }, { passive: true });

    document.addEventListener("pointerdown", function (e) {
      if (cur) cur.classList.add("is-down");
      if (e.pointerType !== "mouse") return;
      if (e.target.closest && e.target.closest("input, textarea, select, [contenteditable]")) return;
      var burst = el("i", "fx-burst");
      burst.style.left = e.clientX + "px";
      burst.style.top = e.clientY + "px";
      document.body.appendChild(burst);
      setTimeout(function () { burst.remove(); }, 560);
    });
    document.addEventListener("pointerup", function () {
      if (cur) cur.classList.remove("is-down");
    });
    document.addEventListener("pointerleave", function () {
      if (cur) cur.classList.remove("is-on");
    });

    (function tick() {
      cx += (mx - cx) * 0.22;
      cy += (my - cy) * 0.22;
      if (cur) cur.style.transform = "translate3d(" + cx + "px," + cy + "px,0)";
      var shown = cur && cur.classList.contains("is-on") && !document.body.classList.contains("is-overlay");
      var px = cx, py = cy;
      for (i = 0; i < trail.length; i++) {
        var node = trail[i];
        var lag = 0.2 - i * 0.02;
        node.x += (px - node.x) * lag;
        node.y += (py - node.y) * lag;
        node.el.style.transform = "translate3d(" + node.x + "px," + node.y + "px,0)";
        node.el.style.opacity = shown ? String(Math.max(0.06, 0.4 - i * 0.05)) : "0";
        px = node.x;
        py = node.y;
      }
      requestAnimationFrame(tick);
    })();

    $$(".proj, .mini, .play-card, .skill-card, .cert, .gal, .gbadge, .chapter-btn, .edu-card, .lead-shot, .honor, .journey__item, .about__quick div, .contact-link, .cap-role").forEach(function (n) {
      n.classList.add("is-tilt");
      n.addEventListener("pointermove", function (e) {
        if (n.classList.contains("is-dim")) return;
        var r = n.getBoundingClientRect();
        var px = (e.clientX - r.left) / Math.max(r.width, 1);
        var py = (e.clientY - r.top) / Math.max(r.height, 1);
        n.style.setProperty("--rx", ((0.5 - py) * 12).toFixed(2) + "deg");
        n.style.setProperty("--ry", ((px - 0.5) * 14).toFixed(2) + "deg");
        n.style.setProperty("--mx", (px * 100).toFixed(2) + "%");
        n.style.setProperty("--my", (py * 100).toFixed(2) + "%");
      });
      n.addEventListener("pointerleave", function () {
        n.style.setProperty("--rx", "0deg");
        n.style.setProperty("--ry", "0deg");
      });
    });

    var idStage = $("#id-stage");
    if (idStage) {
      var hang = $(".pass__hang", idStage);
      idStage.addEventListener("pointermove", function (e) {
        if (!hang) return;
        var r = idStage.getBoundingClientRect();
        var px = (e.clientX - r.left) / Math.max(r.width, 1) - 0.5;
        var py = (e.clientY - r.top) / Math.max(r.height, 1) - 0.5;
        idStage.classList.add("is-held");
        hang.style.setProperty("--idy", (px * 24).toFixed(1) + "deg");
        hang.style.setProperty("--idz", (7 + px * 12).toFixed(1) + "deg");
      }, { passive: true });
      idStage.addEventListener("pointerleave", function () {
        idStage.classList.remove("is-held");
        if (hang) {
          hang.style.setProperty("--idy", "-14deg");
          hang.style.setProperty("--idz", "7deg");
        }
      });
    }

    var magEl = null;
    document.addEventListener("pointermove", function (e) {
      var n = e.target.closest && e.target.closest(".btn--primary, .btn--play, .brand");
      if (magEl && magEl !== n) magEl.style.transform = "";
      magEl = n || null;
      if (!n) return;
      n.classList.add("is-mag");
      var r = n.getBoundingClientRect();
      var dx = (e.clientX - (r.left + r.width / 2)) * 0.32;
      var dy = (e.clientY - (r.top + r.height / 2)) * 0.36;
      n.style.transform = "translate3d(" + dx.toFixed(1) + "px," + dy.toFixed(1) + "px,0)";
    }, { passive: true });

    var hero = $("#hero");
    if (hero) {
      var sprites = $$(".sprite", hero);
      var crt = $(".crt", hero);
      hero.addEventListener("pointermove", function (e) {
        var r = hero.getBoundingClientRect();
        var px = (e.clientX - r.left) / Math.max(r.width, 1) - 0.5;
        var py = (e.clientY - r.top) / Math.max(r.height, 1) - 0.5;
        hero.classList.add("is-tracking");
        hero.style.setProperty("--hx", (px * 36).toFixed(1) + "px");
        hero.style.setProperty("--hy", (py * 22).toFixed(1) + "px");
        sprites.forEach(function (s, idx) {
          var k = (idx + 1) * 14;
          s.style.setProperty("--sx", (px * k).toFixed(1) + "px");
          s.style.setProperty("--sy", (py * k).toFixed(1) + "px");
        });
        if (crt) {
          crt.style.setProperty("--crx", (-py * 8).toFixed(2) + "deg");
          crt.style.setProperty("--cry", (px * 10).toFixed(2) + "deg");
        }
      }, { passive: true });
    }

    $$(".hero__fact b").forEach(function (b) {
      var end = parseInt(b.textContent, 10);
      if (!isFinite(end) || end < 1) return;
      b.textContent = "0";
      var t0 = null;
      var dur = 980;
      requestAnimationFrame(function step(now) {
        if (t0 == null) t0 = now;
        var p = Math.min(1, (now - t0) / dur);
        var eased = 1 - Math.pow(1 - p, 3);
        b.textContent = String(Math.round(end * eased));
        if (p < 1) requestAnimationFrame(step);
      });
    });
  }

  /* ============================================================ BOOT */
  $("#year").textContent = new Date().getFullYear();
  renderJourney();
  renderFeatured();
  renderPlayable();
  renderGallery();
  renderMore();
  renderSkills();
  renderCerts();
  renderLeadership();
  renderEducation();
  renderContact();
  reveal();
  scrollspy();
  afterSplash(motion);
})();
