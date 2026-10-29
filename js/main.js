/* ==========================================================================
   main.js — brand intro, night sky, hero, sections, overlays and games.
   No framework, no build step. Everything reads from window.SITE.
   ========================================================================== */
(function () {
  "use strict";

  var S = window.SITE;
  /* projects flagged hide: true stay in data.js but never reach the page */
  S.projects = S.projects.filter(function (p) { return !p.hide; });
  var root = document.documentElement;
  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

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
  function onView(nodes, fn, opts) {
    if (!("IntersectionObserver" in window)) { nodes.forEach(fn); return; }
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (e) {
        if (e.isIntersecting) { fn(e.target); io.unobserve(e.target); }
      });
    }, opts || { rootMargin: "0px 0px -10% 0px", threshold: .12 });
    nodes.forEach(function (n) { io.observe(n); });
  }

  var ICON = {
    gh: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.9 10.9c.6.1.8-.2.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.4-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 1.8 2.7 1.3 3.4 1 .1-.7.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .4.2.7.8.6A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5z"/></svg>',
    li: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.2c0-1.3 0-2.9-1.8-2.9s-2 1.4-2 2.8V21h-4z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="M22 7l-10 6L2 7"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>'
  };

  /* ============================================================ TOAST */
  var toastEl = $("#toast"), toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("is-on"); }, 2400);
  }
  function confetti() {
    if (calm) return;
    var colors = ["#A78BFA", "#E879F9", "#22D3EE", "#FDE68A"];
    var host = el("div", "confetti");
    for (var i = 0; i < 40; i++) {
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

  /* ============================================================ SPLASH
     The brand intro (the look is all CSS). A click, "Skip intro",
     Esc/Enter/Space or the auto timer ends it, then the hero rises in. */
  function splash(done) {
    var box = $("#splash");
    if (!root.classList.contains("is-intro") || !box) {
      if (box) box.remove();
      done();
      return;
    }
    var finished = false, timer = setTimeout(finish, 3700);
    function finish() {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      document.removeEventListener("keydown", onKey);
      try { sessionStorage.setItem("jm-intro", "1"); } catch (e) {}
      box.classList.add("is-out");
      root.classList.remove("is-intro");
      setTimeout(function () { box.remove(); }, 650);
      done();
    }
    function onKey(e) { if (e.key === "Escape" || e.key === "Enter" || e.key === " ") { e.preventDefault(); finish(); } }
    box.addEventListener("click", finish);
    document.addEventListener("keydown", onKey);
  }

  /* ============================================================ NIGHT SKY
     Twinkling stars plus shooting stars that streak down to the left,
     drawn on one fixed canvas behind every section. */
  (function sky() {
    var c = $("#sky"), ctx = c.getContext("2d");
    var w = 0, h = 0, dpr = 1, stars = [], meteors = [], next = 0, running = true;

    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      c.width = w * dpr; c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.round(w * h / 9000);
      stars = [];
      for (var i = 0; i < count; i++) {
        stars.push({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.2 + .2, t: Math.random() * 6.28, s: Math.random() * .02 + .005 });
      }
      if (calm) draw(0);
    }
    function spawn() {
      var fromTop = Math.random() < .6;
      meteors.push({
        x: fromTop ? Math.random() * w * 1.1 + w * .1 : w + 20,
        y: fromTop ? -20 : Math.random() * h * .6,
        v: Math.random() * 6 + 9,
        len: Math.random() * 120 + 90,
        life: 1
      });
    }
    function draw(t) {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        s.t += s.s;
        ctx.globalAlpha = .25 + Math.abs(Math.sin(s.t)) * .6;
        ctx.fillStyle = i % 7 === 0 ? "#C4B5FD" : "#FFFFFF";
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.283); ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (calm) return;
      if (t > next) { spawn(); next = t + 500 + Math.random() * 1100; }
      var dx = -Math.cos(.62), dy = Math.sin(.62);
      for (var m = meteors.length - 1; m >= 0; m--) {
        var o = meteors[m];
        o.x += dx * o.v; o.y += dy * o.v; o.life -= .006;
        var g = ctx.createLinearGradient(o.x, o.y, o.x - dx * o.len, o.y - dy * o.len);
        g.addColorStop(0, "rgba(255,255,255," + (.9 * o.life) + ")");
        g.addColorStop(.3, "rgba(196,181,253," + (.45 * o.life) + ")");
        g.addColorStop(1, "rgba(124,58,237,0)");
        ctx.strokeStyle = g; ctx.lineWidth = 1.6; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(o.x, o.y); ctx.lineTo(o.x - dx * o.len, o.y - dy * o.len); ctx.stroke();
        ctx.fillStyle = "rgba(255,255,255," + o.life + ")";
        ctx.beginPath(); ctx.arc(o.x, o.y, 1.6, 0, 6.283); ctx.fill();
        if (o.life <= 0 || o.x < -200 || o.y > h + 200) meteors.splice(m, 1);
      }
    }
    function loop(t) {
      if (!running) return;
      draw(t);
      requestAnimationFrame(loop);
    }
    size();
    window.addEventListener("resize", size);
    if (!calm) {
      document.addEventListener("visibilitychange", function () {
        running = !document.hidden;
        if (running) requestAnimationFrame(loop);
      });
      requestAnimationFrame(loop);
    }
  })();

  /* ============================================================ NAV */
  (function nav() {
    var side = $("#nav"), prog = $("#progress"), toggle = $("#nav-toggle"), links = $("#nav-links"), scrim = $("#side-scrim");
    var ticking = false;
    function update() {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      prog.style.transform = "scaleX(" + (max > 0 ? window.scrollY / max : 0).toFixed(4) + ")";
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();

    /* on phones the sidebar is a drawer */
    function setOpen(on) {
      side.classList.toggle("is-open", on);
      scrim.hidden = !on;
      toggle.setAttribute("aria-expanded", String(on));
      toggle.setAttribute("aria-label", on ? "Close menu" : "Open menu");
      document.body.style.overflow = on ? "hidden" : "";
    }
    toggle.addEventListener("click", function () { setOpen(!side.classList.contains("is-open")); });
    scrim.addEventListener("click", function () { setOpen(false); });
    $$("a", side).forEach(function (a) {
      a.addEventListener("click", function () { if (side.classList.contains("is-open")) setOpen(false); });
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && side.classList.contains("is-open")) setOpen(false); });

    var P = S.profile;
    $("#side-social").innerHTML =
      '<a href="' + esc(P.github) + '" target="_blank" rel="noopener noreferrer" aria-label="GitHub">' + ICON.gh + '</a>' +
      '<a href="' + esc(P.linkedin) + '" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">' + ICON.li + '</a>' +
      '<a href="mailto:' + esc(P.email) + '" aria-label="Email">' + ICON.mail + '</a>';

    var map = {};
    $$("a", links).forEach(function (a) {
      var sec = document.getElementById(a.getAttribute("href").slice(1));
      if (sec) map[sec.id] = a;
    });
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (ents) {
        ents.forEach(function (e) {
          if (!e.isIntersecting) return;
          $$("a", links).forEach(function (a) { a.removeAttribute("aria-current"); });
          map[e.target.id].setAttribute("aria-current", "true");
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      Object.keys(map).forEach(function (id) { io.observe(document.getElementById(id)); });
    }
  })();

  /* ============================================================ THEME
     Dark by default; the sidebar switch flips to light and remembers it. */
  (function theme() {
    var btn = $("#theme-toggle"), label = $("#theme-label"), meta = $('meta[name="theme-color"]');
    function sync() {
      var light = root.getAttribute("data-theme") === "light";
      btn.setAttribute("aria-pressed", String(light));
      btn.setAttribute("aria-label", light ? "Switch to dark mode" : "Switch to light mode");
      label.textContent = light ? "Dark mode" : "Light mode";
      if (meta) meta.setAttribute("content", light ? "#F5F2FB" : "#07050D");
    }
    btn.addEventListener("click", function () {
      var light = root.getAttribute("data-theme") !== "light";
      if (light) root.setAttribute("data-theme", "light"); else root.removeAttribute("data-theme");
      try { localStorage.setItem("jm-theme", light ? "light" : "dark"); } catch (e) {}
      sync();
    });
    sync();
  })();

  /* ============================================================ HERO */
  function typeWhoami() {
    var out = $("#hero-out");
    var P = S.profile;
    var script = [
      ['<span class="p">$</span> ./introduce.sh', 0],
      ['<span class="d">› loading profile… done</span>', 0],
      ['<span class="k">name</span>:   <span class="n">' + esc(P.name.replace(" C.", "")) + '</span>', 1],
      ['<span class="k">role</span>:   Full-stack &amp; Android dev', 1],
      ['<span class="k">school</span>: Mapúa MCL · BSIT', 1],
      ['<span class="k">stack</span>:', 1],
      ['  - Kotlin + Jetpack Compose', 1],
      ['  - PHP / REST · MySQL', 1],
      ['  - AWS · Arduino / ESP8266', 1],
      ['<span class="p">$</span> <span class="caret"></span>', 0]
    ];
    if (calm) { out.innerHTML = script.map(function (r) { return r[0]; }).join("\n"); return; }
    var n = 0;
    (function line() {
      if (n >= script.length) return;
      out.innerHTML += (n ? "\n" : "") + script[n][0];
      n += 1;
      setTimeout(line, n < 2 ? 420 : 170);
    })();
  }

  function heroSocial() {
    var P = S.profile;
    $("#hero-social").innerHTML =
      '<a href="' + esc(P.github) + '" target="_blank" rel="noopener noreferrer" aria-label="GitHub">' + ICON.gh + '</a>' +
      '<a href="' + esc(P.linkedin) + '" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">' + ICON.li + '</a>' +
      '<a href="mailto:' + esc(P.email) + '" aria-label="Email">' + ICON.mail + '</a>';

    $("#foot-social").innerHTML = [
      { t: "GitHub", v: "@" + P.githubHandle, href: P.github, i: ICON.gh, c: "#A78BFA" },
      { t: "LinkedIn", v: "in/jm-de-roxas", href: P.linkedin, i: ICON.li, c: "#0A66C2" },
      { t: "Email", v: P.email, href: "mailto:" + P.email, i: ICON.mail, c: "#E879F9" }
    ].map(function (s) {
      var ext = s.href.indexOf("http") === 0 ? ' target="_blank" rel="noopener noreferrer"' : "";
      return '<li><a href="' + esc(s.href) + '"' + ext + ' style="--c:' + s.c + '">' +
        '<span class="foot__ico">' + s.i + '</span>' +
        '<span><b>' + esc(s.t) + '</b><small>' + esc(s.v) + '</small></span>' +
        '<span class="foot__go" aria-hidden="true">↗</span></a></li>';
    }).join("");
  }

  function heroParallax() {
    if (calm || !finePointer) return;
    var hero = $("#home"), scene = $("#hero-scene"), vis = $("#hero-visual");
    hero.addEventListener("pointermove", function (e) {
      var r = hero.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - .5;
      var y = (e.clientY - r.top) / r.height - .5;
      scene.style.setProperty("--px", (x * -24).toFixed(1) + "px");
      scene.style.setProperty("--py", (y * -16).toFixed(1) + "px");
      vis.style.setProperty("--vx", (x * 18).toFixed(1) + "px");
      vis.style.setProperty("--vy", (y * 12).toFixed(1) + "px");
    }, { passive: true });
  }

  /* ============================================================ ABOUT */
  /* ============================================================ ABOUT FX
     How I work cycles through its traits on its own (hover pauses it, a click
     or hover picks one). Phrases in the bio and the badges/facts/traits share
     data-link values, so pointing at one lights up the others. The bio card
     carries a soft spotlight that follows the mouse. */
  function aboutInteractions() {
    var list = $("#traits"), items = $$("li", list), open = -1, timer = 0, paused = false;
    var CYCLE = 4200;

    function show(k) {
      open = k;
      items.forEach(function (li, i) {
        var on = i === k;
        li.classList.toggle("is-open", on);
        $("button", li).setAttribute("aria-expanded", String(on));
        var bar = $(".traits__bar", li);
        bar.style.animation = "none";
        if (on && !calm && !paused) { void bar.offsetWidth; bar.style.animation = "traitFill " + CYCLE + "ms linear forwards"; }
      });
    }
    function schedule() {
      clearTimeout(timer);
      if (calm || paused) return;
      timer = setTimeout(function () { show((open + 1) % items.length); schedule(); }, CYCLE);
    }
    items.forEach(function (li, i) {
      $("button", li).addEventListener("click", function () { show(i); schedule(); });
      li.addEventListener("pointerenter", function () { show(i); });
    });
    list.addEventListener("pointerenter", function () { paused = true; clearTimeout(timer); show(open); });
    list.addEventListener("pointerleave", function () { paused = false; show(open); schedule(); });
    show(0);
    /* only start cycling once the list is actually on screen */
    onView([list], function () { schedule(); });

    /* linked highlights */
    var about = $("#about");
    function light(key, on) {
      $$('[data-link="' + key + '"]', about).forEach(function (n) { n.classList.toggle("is-linked", on); });
      if (on) {
        var t = $('#traits li[data-link="' + key + '"]');
        if (t) { show(items.indexOf(t)); clearTimeout(timer); }
      } else if (!paused) {
        schedule();
      }
    }
    $$("[data-link]", about).forEach(function (n) {
      n.addEventListener("pointerenter", function () { light(n.dataset.link, true); });
      n.addEventListener("pointerleave", function () { light(n.dataset.link, false); });
      n.addEventListener("focus", function () { light(n.dataset.link, true); });
      n.addEventListener("blur", function () { light(n.dataset.link, false); });
    });

    /* spotlight on the bio card */
    var bio = $(".about__bio");
    if (bio && finePointer && !calm) {
      bio.addEventListener("pointermove", function (e) {
        var r = bio.getBoundingClientRect();
        bio.style.setProperty("--mx", (e.clientX - r.left).toFixed(0) + "px");
        bio.style.setProperty("--my", (e.clientY - r.top).toFixed(0) + "px");
      }, { passive: true });
    }
  }

  function renderAbout() {
    /* badges pick up a data-link from their wording, so the bio can point at them */
    $("#honors").innerHTML = (S.honors || []).map(function (h) {
      var link = /ITSOC/.test(h) ? "itsoc" : /Ambassador/.test(h) ? "amb" : /Scholar/.test(h) ? "scholar" : /Lister/.test(h) ? "lister" : "";
      return '<li' + (link ? ' data-link="' + link + '"' : "") + ">" + esc(h) + "</li>";
    }).join("");

    $("#traits").innerHTML = (S.traits || []).map(function (t, n) {
      return '<li data-link="' + esc(t.t.toLowerCase()) + '"><button type="button" aria-expanded="false">' +
        '<span class="traits__n">0' + (n + 1) + '</span><b>' + esc(t.t) + '</b><i class="traits__bar" aria-hidden="true"></i></button>' +
        '<div class="traits__body"><p>' + esc(t.p) + '</p></div></li>';
    }).join("");
    aboutInteractions();

    /* personal milestones, alternating sides of a glowing line */
    $("#timeline").innerHTML = (S.milestones || []).map(function (m, n) {
      return '<li class="mile reveal" style="--d:' + (n % 2) * 80 + 'ms">' +
        '<span class="mile__dot" aria-hidden="true"></span>' +
        '<div class="glass mile__card"><small>' + esc(m.when) + '</small><b>' + esc(m.t) + '</b><p>' + esc(m.p) + '</p></div>' +
      '</li>';
    }).join("");

    var L = S.leadership;
    if (L) {
      $("#lead-card").innerHTML =
        '<span class="chip">' + esc(L.term) + '</span>' +
        '<h4>' + esc(L.role) + '</h4>' +
        '<p class="org">' + esc(L.org) + ' · ' + esc(L.where) + '</p>' +
        '<p>' + esc(L.body) + '</p>';
    }
    var RECOG_ICON = {
      list: '<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2"/>',
      cap: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/><path d="M22 9v6"/>',
      star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>'
    };
    /* a recognition with a photo becomes a big picture card; the rest stay compact */
    var recog = S.recognition || [];
    $("#recog").innerHTML = recog.map(function (r, i) {
      if (r.img) {
        return '<li class="recog__photo"><button type="button" data-r="' + i + '" aria-label="View photo: ' + esc(r.t) + '">' +
          '<img src="' + esc(r.img) + '" alt="" loading="lazy">' +
          '<span class="recog__over"><span class="recog__ico"><svg viewBox="0 0 24 24" aria-hidden="true">' + (RECOG_ICON[r.icon] || RECOG_ICON.star) + '</svg></span>' +
          '<span><b>' + esc(r.t) + '</b><small>' + esc(r.p) + '</small></span></span></button></li>';
      }
      return '<li class="glass"><span class="recog__ico"><svg viewBox="0 0 24 24" aria-hidden="true">' + (RECOG_ICON[r.icon] || RECOG_ICON.star) + '</svg></span>' +
        '<span><b>' + esc(r.t) + '</b><small>' + esc(r.p) + '</small></span></li>';
    }).join("");
    $$("[data-r]").forEach(function (b) {
      var r = recog[+b.dataset.r];
      var shots = [{ type: "img", src: r.img, title: r.t, sub: r.p, cap: r.cap }].concat((r.more || []).map(function (x) {
        return { type: "img", src: x.src, title: r.t, sub: r.p, cap: x.cap };
      }));
      b.addEventListener("click", function () { openLightbox(shots, 0, r.t); });
    });

    /* what people say: only rendered when data.js has real quotes */
    var recs = S.recommendations || [];
    if (recs.length) {
      $("#recs").innerHTML = recs.map(function (r, i) {
        var initials = r.name.split(/\s+/).filter(Boolean).map(function (w) { return w[0]; }).slice(0, 2).join("").toUpperCase();
        return '<figure class="glass rec reveal" style="--d:' + (i % 3) * 80 + 'ms">' +
          '<blockquote>' + esc(r.quote) + '</blockquote>' +
          '<figcaption>' +
            (r.photo ? '<img src="' + esc(r.photo) + '" alt="" loading="lazy">' : '<span class="rec__av" aria-hidden="true">' + esc(initials) + '</span>') +
            '<span><b>' + esc(r.name) + '</b><small>' + esc([r.role, r.relation].filter(Boolean).join(" · ")) + '</small></span>' +
          '</figcaption></figure>';
      }).join("");
      $("#recs-wrap").hidden = false;
    }

    /* photos already shown on a recognition card stay out of the strip */
    var used = recog.map(function (r) { return r.img; });
    var shots = (S.proofs || []).filter(function (p) { return used.indexOf(p.src) === -1; }).slice(0, 4);
    var strip = $("#lead-strip");
    strip.innerHTML = shots.map(function (p, i) {
      return '<button type="button" data-i="' + i + '" aria-label="View photo: ' + esc(p.title) + '">' +
        '<img src="' + esc(p.src) + '" alt="" loading="lazy"><span>' + esc(p.title) + '</span></button>';
    }).join("");
    var items = shots.map(function (p) { return { type: "img", src: p.src, title: p.title, sub: p.sub, cap: p.cap }; });
    $$("button", strip).forEach(function (b) {
      b.addEventListener("click", function () { openLightbox(items, +b.dataset.i, "Leadership"); });
    });
  }

  function countUp() {
    onView($$(".stat b"), function (b) {
      var end = parseInt(b.dataset.count, 10);
      if (calm || !end) return;
      var t0 = null;
      requestAnimationFrame(function step(now) {
        if (t0 == null) t0 = now;
        var p = Math.min(1, (now - t0) / 1200);
        b.textContent = String(Math.round(end * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(step);
      });
    });
  }

  /* ============================================================ STACK */
  function renderStack() {
    var grid = $("#stack-grid");
    grid.innerHTML = (S.techIcons || []).map(function (t, n) {
      var mark = '<b>' + esc(t.mark || t.name.slice(0, 3)) + '</b>';
      var img = t.slug ? '<img src="https://cdn.simpleicons.org/' + esc(t.slug) + '/' + esc(t.color || "ffffff") + '" alt="" width="26" height="26" loading="lazy" data-mark="' + esc(t.mark || t.name.slice(0, 3)) + '">' : mark;
      return '<div class="tile" style="--n:' + n + ';--c:#' + esc(t.color || "8B5CF6") + '">' +
        '<span class="tile__ico">' + img + '</span><span>' + esc(t.name) + '</span></div>';
    }).join("");
    $$("img", grid).forEach(function (img) {
      img.addEventListener("error", function () { img.replaceWith(el("b", null, esc(img.dataset.mark))); });
    });
    onView([grid], function (g) { g.classList.add("is-in"); });

    $("#roles").innerHTML = (S.skillRoles || []).map(function (r, i) {
      return '<article class="glass role reveal" style="--d:' + i * 90 + 'ms">' +
        '<div class="role__top"><span class="role__n">' + esc(r.n) + '</span><h4>' + esc(r.k) + '</h4></div>' +
        '<p>' + esc(r.p) + '</p>' +
        '<div class="chips">' + r.tags.map(function (t) { return '<span class="chip' + (i ? ' chip--alt' : '') + '">' + esc(t) + '</span>'; }).join("") + '</div>' +
        '</article>';
    }).join("");
  }

  /* ============================================================ PROJECTS */
  var ordered = S.projects.filter(function (p) { return p.featured; })
    .concat(S.projects.filter(function (p) { return !p.featured; }));
  function projById(id) {
    for (var i = 0; i < S.projects.length; i++) if (S.projects[i].id === id) return S.projects[i];
    return null;
  }

  /* "ask me for the APK": a prefilled email, for projects flagged apk: true */
  function apkMail(p) {
    var subject = p.name + " APK request";
    var body = "Hi Jhan Maurice,\n\nI'd like to try " + p.name + " on my Android phone. Could you send me the APK?\n\nThanks!";
    return "mailto:" + S.profile.email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  }
  function apkButton(p, cls) {
    return p.apk ? '<a class="btn ' + (cls || "btn--glass") + '" href="' + apkMail(p) + '">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12M7 10l5 5 5-5M5 21h14"/></svg>Request the APK</a>' : "";
  }

  /* The picture for a project: a laptop for websites, two phones for apps
     with real screens, otherwise its cover image. */
  function projFace(p) {
    if (p.laptop && p.face !== "phone") {
      return '<span class="card-dev card-dev--laptop"><span class="mini-lap"><span><img src="' + esc(p.laptop[0].src) + '" alt="" draggable="false"></span></span></span>';
    }
    if (p.phone) {
      var n = p.phone.length, c = p.cover || [Math.min(2, n - 1), n > 4 ? 4 : 0];   /* [front, back] */
      return '<span class="card-dev"><span class="mini-phone is-back"><img src="' + esc(p.phone[c[1]].src) + '" alt="" draggable="false"></span>' +
        '<span class="mini-phone"><img src="' + esc(p.phone[c[0]].src) + '" alt="" draggable="false"></span></span>';
    }
    return p.hero ? '<img src="' + esc(p.hero) + '" alt="" draggable="false"' + (p.heroPixel ? ' class="pixelated"' : "") + '>' : "";
  }
  function chipsHTML(list, cls) {
    return '<div class="chips">' + list.map(function (t) { return '<span class="chip' + (cls ? " " + cls : "") + '">' + esc(t) + '</span>'; }).join("") + '</div>';
  }
  var ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  /* Selected work: one card per featured project, opening its case study. */
  var work = ordered.filter(function (p) { return p.featured; });
  function renderProjects() {
    $("#work").innerHTML = work.map(function (p, i) {
      var num = (i + 1 < 10 ? "0" : "") + (i + 1);
      return '<article class="work__item reveal">' +
        '<button class="work__media' + (p.heroFit === "contain" && !p.phone && !p.laptop ? " is-contain" : "") + '" type="button" data-open="' + esc(p.id) + '" aria-label="Open the ' + esc(p.name) + ' case study">' +
          projFace(p) + '<span class="work__num">' + num + '</span><span class="work__open">View case study</span></button>' +
        '<div class="work__copy">' +
          '<span class="work__kicker">' + esc(p.kicker) + ' · ' + esc(p.year) + '</span>' +
          '<h3>' + esc(p.name) + '</h3>' +
          (p.sub ? '<p class="work__sub">' + esc(p.sub) + '</p>' : "") +
          '<p class="work__blurb">' + esc(p.blurb || p.tagline) + '</p>' +
          (p.role ? '<p class="work__role"><b>My role:</b> ' + esc(p.role) + '</p>' : "") +
          chipsHTML(p.tech.slice(0, 6)) +
          '<div class="work__actions">' +
            '<button class="btn btn--primary" type="button" data-open="' + esc(p.id) + '">View case study ' + ARROW + '</button>' +
            (p.live ? '<a class="btn btn--glass" href="' + esc(p.live) + '" target="_blank" rel="noopener noreferrer">' + esc(p.liveLabel || "Visit live site") + ' ↗</a>' : "") +
            (p.playable ? '<button class="btn btn--play" type="button" data-play="' + esc(p.playable) + '">▶ PLAY</button>' : "") +
            apkButton(p) +
          '</div>' +
        '</div></article>';
    }).join("");
    $$("#work [data-open]").forEach(function (b) {
      b.addEventListener("click", function () { openProject(b.dataset.open); });
    });
    $$("#work [data-play]").forEach(function (b) {
      b.addEventListener("click", function () { openGame(b.dataset.play); });
    });
  }

  /* ============================================================ CASE STUDY
     One page per project over the site. Prev/next and the "next project"
     card walk through the featured work; Esc or the back button closes. */
  var cs = $("#cs"), csPage = $("#cs-page"), csAt = 0, csLastFocus = null;

  function caseHTML(p) {
    var n = 0;
    function sec(title, body) { return body ? '<section class="cs__sec"><h3><span>' + (++n < 10 ? "0" : "") + n + '</span>' + title + '</h3>' + body + '</section>' : ""; }
    function para(t) { return t ? '<p>' + esc(t) + '</p>' : ""; }
    function list(a, cls) { return a && a.length ? '<ul class="' + (cls || "cs__list") + '">' + a.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join("") + '</ul>' : ""; }
    var vids = p.videos || (p.video ? [p.video] : []);
    var pic = p.phone || p.laptop ? projFace(p) : (p.hero ? '<img src="' + esc(p.hero) + '" alt="' + esc(p.name) + '" data-shot="0"' + (p.heroPixel ? ' class="pixelated"' : "") + '>' : "");

    var h = '<header class="cs__hero"><div>' +
      '<p class="cs__kicker">' + esc(p.kicker) + ' · ' + esc(p.year) + '</p>' +
      '<h2 id="cs-title" tabindex="-1">' + esc(p.name) + '</h2>' +
      (p.sub ? '<p class="cs__sub">' + esc(p.sub) + '</p>' : "") +
      '<p class="cs__lead">' + esc(p.tagline || p.blurb) + '</p>' +
      '<div class="cs__actions">' +
        (p.live ? '<a class="btn btn--primary" href="' + esc(p.live) + '" target="_blank" rel="noopener noreferrer">' + esc(p.liveLabel || "Visit live site") + ' ↗</a>' : "") +
        (vids.length ? '<button class="btn ' + (p.live ? "btn--glass" : "btn--primary") + '" type="button" data-watch>▶ Watch ' + (vids.length > 1 ? "walkthroughs" : "demo") + '</button>' : "") +
        (p.playable ? '<button class="btn btn--play" type="button" data-play="' + esc(p.playable) + '">▶ PLAY IT</button>' : "") +
        apkButton(p) +
        (p.figma ? '<a class="btn btn--glass" href="' + esc(p.figma) + '" target="_blank" rel="noopener noreferrer">Open in Figma</a>' : "") +
        (p.repo ? '<a class="btn btn--glass" href="' + esc(p.repo) + '" target="_blank" rel="noopener noreferrer">GitHub</a>' :
          p.githubSoon ? '<span class="btn btn--glass" aria-disabled="true">GitHub (soon)</span>' : "") +
      '</div></div>' +
      (pic ? '<figure class="cs__media' + (p.heroFit === "contain" && !p.phone && !p.laptop ? " is-contain" : "") + '">' + pic + '</figure>' : "") +
      '</header>';

    var facts = [["My role", p.role], ["Year", p.year], ["Team", p.team], ["Course", p.course]].filter(function (f) { return f[1]; });
    h += '<dl class="cs__facts">' + facts.map(function (f) { return '<div><dt>' + f[0] + '</dt><dd>' + esc(f[1]) + '</dd></div>'; }).join("") + '</dl>';

    if (p.problem || p.solution) {
      h += sec("Overview", '<div class="cs__two">' +
        (p.problem ? '<div><h4>The problem</h4>' + para(p.problem) + '</div>' : "") +
        (p.solution ? '<div><h4>What we built</h4>' + para(p.solution) + '</div>' : "") + '</div>');
    }
    if (p.phone) {
      h += sec(p.phoneTitle || "The app", '<div class="cs__screens">' + p.phone.map(function (s, j) {
        return '<figure class="cs__phone" role="button" tabindex="0" data-phone="' + j + '">' +
          '<div class="phone"><div class="phone__screen"><img src="' + esc(s.src) + '" alt="' + esc(s.cap || p.name + " screen " + (j + 1)) + '" loading="lazy"></div><i class="phone__island" aria-hidden="true"></i></div>' +
          (s.cap ? '<figcaption>' + esc(s.cap) + '</figcaption>' : "") + '</figure>';
      }).join("") + '</div>');
    }
    if (p.laptop) {
      h += sec(p.laptopTitle || "The website", '<div class="cs__screens">' + p.laptop.map(function (s, j) {
        return '<figure class="cs__lap" role="button" tabindex="0" data-lap="' + j + '">' +
          '<div class="lap"><div class="lap__lid"><div class="lap__screen"><img src="' + esc(s.src) + '" alt="' + esc(s.cap || p.name + " page " + (j + 1)) + '" loading="lazy"' + (s.scroll ? ' class="is-scroll"' : "") + '></div></div><div class="lap__base"></div></div>' +
          (s.cap ? '<figcaption>' + esc(s.cap) + '</figcaption>' : "") + '</figure>';
      }).join("") + '</div>');
    }
    h += sec("My role", (p.role ? '<p class="cs__role">' + esc(p.role) + '</p>' : "") + list(p.contribution));
    h += sec("Key features", list(p.features, "cs__feats"));
    if (p.process || p.outcome) {
      h += sec("How it came together", para(p.process) +
        (p.outcome ? '<div class="cs__outcome"><b>Outcome</b>' + para(p.outcome) + '</div>' : ""));
    }
    h += sec("Built with", '<div class="cs__tech"><div><h4>Technologies</h4>' + chipsHTML(p.tech) + '</div>' +
      (p.skills ? '<div><h4>Skills</h4>' + chipsHTML(p.skills, "chip--alt") + '</div>' : "") + '</div>');
    if (p.gallery && p.gallery.length) {
      h += sec("Gallery", '<div class="cs__gallery' + (p.heroFit === "contain" ? " is-contain" : "") + '">' + p.gallery.map(function (g, i) {
        return '<figure class="cs__shot" role="button" tabindex="0" data-shot="' + i + '">' +
          '<img src="' + esc(g.src) + '" alt="' + esc(g.cap) + '" loading="lazy"' + (g.pixel ? ' class="pixelated"' : "") + '>' +
          '<figcaption>' + esc(g.cap) + '</figcaption></figure>';
      }).join("") + '</div>');
    }
    if (vids.length) {
      h += sec(vids.length > 1 ? "Walkthrough videos" : "Demo video", '<div class="cs__videos">' + vids.map(function (v) {
        return '<div>' + (v.title ? '<h4>' + esc(v.title) + '</h4>' : "") +
          '<video class="cs__video" controls preload="metadata" playsinline src="' + esc(v.src) + '"' + (v.poster || p.hero ? ' poster="' + esc(v.poster || p.hero) + '"' : "") + '></video>' +
          (v.cap ? '<p class="cs__fine">' + esc(v.cap) + '</p>' : "") + '</div>';
      }).join("") + '</div>');
    }
    if (p.note) h += '<div class="note cs__note"><span>' + esc(p.note) + '</span></div>';

    var next = work[(work.indexOf(p) + 1) % work.length];
    h += '<button class="cs__next" type="button" data-next><span><small>Next project</small><b>' + esc(next.name) + '</b></span>' + ARROW + '</button>';
    h += '<p class="cs__fine">Source files and full documentation are in my academic archive and can be shared on request.</p>';
    return h;
  }

  function csFill(i) {
    csAt = ((i % work.length) + work.length) % work.length;
    var p = work[csAt];
    csPage.innerHTML = caseHTML(p);
    $("#cs-path").textContent = "~/projects/" + p.id;
    cs.scrollTop = 0;
    var shots = (p.gallery || []).map(function (g) { return { type: "img", src: g.src, cap: g.cap, pixel: g.pixel }; });
    $$("[data-shot]", csPage).forEach(function (el) {
      function go() { if (shots.length) openLightbox(shots, +el.dataset.shot, p.name); }
      el.addEventListener("click", go);
      el.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
    });
    var screens = (p.phone || []).map(function (s) { return { type: "img", src: s.src, cap: s.cap }; });
    $$("[data-phone]", csPage).forEach(function (el) {
      function go() { openLightbox(screens, +el.dataset.phone, p.name); }
      el.addEventListener("click", go);
      el.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
    });
    var pages = (p.laptop || []).map(function (s) { return { type: "img", src: s.src, cap: s.cap }; });
    $$("[data-lap]", csPage).forEach(function (el) {
      function go() { openLightbox(pages, +el.dataset.lap, p.name); }
      el.addEventListener("click", go);
      el.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
    });
    var vids = p.videos || (p.video ? [p.video] : []);
    var watch = $("[data-watch]", csPage);
    if (watch) watch.addEventListener("click", function () {
      openLightbox(vids.map(function (v) {
        return { type: "video", src: v.src, poster: v.poster || p.hero, title: p.name, sub: v.title || "Demo video", cap: v.cap };
      }), 0, p.name);
    });
    var play = $("[data-play]", csPage);
    if (play) play.addEventListener("click", function () { openGame(play.dataset.play); });
    $("[data-next]", csPage).addEventListener("click", function () { csFill(csAt + 1); csFocus(); });
    /* the cover replays its entrance on every project */
    cs.classList.remove("is-open"); void cs.offsetWidth; cs.classList.add("is-open");
  }
  function csFocus() { var t = $("#cs-title"); if (t) t.focus({ preventScroll: true }); }

  function openProject(id) {
    var p = projById(id);
    if (!p || work.indexOf(p) < 0) return;
    csLastFocus = document.activeElement;
    cs.hidden = false;
    csFill(work.indexOf(p));
    document.body.style.overflow = "hidden";
    csFocus();
  }
  function closeProject() {
    cs.classList.remove("is-open");
    document.body.style.overflow = "";
    $$("video", csPage).forEach(function (v) { v.pause(); });
    setTimeout(function () { if (!cs.classList.contains("is-open")) { cs.hidden = true; csPage.innerHTML = ""; } }, 400);
    if (csLastFocus && csLastFocus.focus) csLastFocus.focus({ preventScroll: true });
  }
  $("#cs-close").addEventListener("click", closeProject);
  $("#cs-prev").addEventListener("click", function () { csFill(csAt - 1); csFocus(); });
  $("#cs-next").addEventListener("click", function () { csFill(csAt + 1); csFocus(); });
  document.addEventListener("keydown", function (e) {
    if (cs.hidden || !modal.hidden || !lb.hidden) return;
    if (e.key === "Escape") closeProject();
  });

  /* ============================================================ SCROLL FX
     Motion tied to scroll position, not just a one-off fade: each target gets
     sp, its distance from the middle of the screen in screen heights
     (-1 above, 0 centred, 1 below). Reads happen first, writes after. */
  function scrollFx() {
    if (calm) return;
    var items = [];
    function add(sel, fn) { $$(sel).forEach(function (el, i) { items.push({ el: el, fn: fn, i: i }); }); }

    add(".sec__head", function (el, sp) {
      el.style.translate = "0 " + (sp * -70).toFixed(1) + "px";
    });
    add(".stack", function (el, sp) {
      var t = Math.max(0, sp);
      el.style.transform = "perspective(1100px) rotateX(" + (t * 32).toFixed(2) + "deg) scale(" + (1 - t * .12).toFixed(3) + ")";
      el.style.opacity = String(Math.max(.2, 1 - t * .9));
    });
    add(".game", function (el, sp, i) {
      el.style.translate = "0 " + (sp * (i % 2 ? 70 : 30)).toFixed(1) + "px";
      el.style.rotate = (sp * (i % 2 ? -3 : 3)).toFixed(2) + "deg";
    });
    add(".mile__card", function (el, sp, i) {
      var amp = Math.min(60, window.innerWidth * .04);
      el.style.translate = (Math.max(0, sp) * (i % 2 ? amp : -amp)).toFixed(1) + "px 0";
    });
    add(".traits__list li", function (el, sp, i) {
      el.style.translate = (Math.max(0, sp) * (24 + i * 10)).toFixed(1) + "px 0";
    });
    add(".lead__strip img", function (el, sp) {
      el.style.translate = "0 " + (sp * 30).toFixed(1) + "px";
      el.style.scale = "1.15";
    });
    add(".contact__card", function (el, sp) {
      el.style.rotate = "y " + (sp * 25).toFixed(2) + "deg";
    });

    var profile = $(".profile"), hero = $("#home");
    function frame() {
      var vh = window.innerHeight;
      var rects = items.map(function (it) { return it.el.getBoundingClientRect(); });
      items.forEach(function (it, k) {
        var r = rects[k];
        if (r.bottom < -vh || r.top > vh * 2) return;
        var sp = (r.top + r.height / 2 - vh / 2) / vh;
        it.fn(it.el, Math.max(-1.5, Math.min(1.5, sp)), it.i);
      });
      if (profile) {   /* the whoami card tips back and drifts away as you leave the hero */
        var p = Math.max(0, Math.min(1, window.scrollY / (hero.offsetHeight * .9)));
        profile.style.transform = "perspective(1200px) rotateX(" + (p * 28).toFixed(2) + "deg) translateY(" + (p * -60).toFixed(1) + "px) scale(" + (1 - p * .18).toFixed(3) + ")";
        profile.style.opacity = String(1 - p * .9);
      }
    }
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { frame(); ticking = false; });
    }, { passive: true });
    window.addEventListener("resize", frame);
    frame();
  }

  /* ============================================================ MODAL */
  var modal = $("#modal"), panel = $("#modal-panel");
  var lastFocus = null, gameCleanup = null;

  function openModal(html, label) {
    if (gameCleanup) { try { gameCleanup(); } catch (e) {} gameCleanup = null; }
    lastFocus = lastFocus || document.activeElement;
    panel.innerHTML = '<button class="icon-btn modal__close" id="modal-close" type="button" aria-label="Close">✕</button>' + html;
    modal.hidden = false;
    modal.setAttribute("aria-label", label || "Details");
    void modal.offsetWidth;
    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
    modal.scrollTop = 0;
    $("#modal-close").addEventListener("click", closeModal);
    var t = $("#modal-title") || $("#modal-close");
    t.focus({ preventScroll: true });
  }
  function closeModal() {
    if (gameCleanup) { try { gameCleanup(); } catch (e) {} gameCleanup = null; }
    modal.classList.remove("is-open");
    document.body.style.overflow = cs.hidden ? "" : "hidden";
    setTimeout(function () { if (!modal.classList.contains("is-open")) { modal.hidden = true; panel.innerHTML = ""; } }, 280);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    lastFocus = null;
  }
  modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });

  /* ============================================================ GAMES */
  function renderGames() {
    $("#games").innerHTML = S.playable.map(function (g, i) {
      var art = g.art && g.art.length
        ? (g.art.length > 1
            ? '<span class="stack2">' + g.art.map(function (a) { return '<img class="pixelated" src="' + esc(a) + '" alt="" loading="lazy">'; }).join("") + '</span>'
            : '<img class="pixelated" src="' + esc(g.art[0]) + '" alt="" loading="lazy">')
        : g.glyph ? '<span class="glyph glyph--emoji">' + esc(g.glyph) + '</span>'
        : '<span class="glyph">' + (g.id === "mines" ? "💎" : "&lt;/&gt;") + '</span>';
      return '<button class="game reveal" type="button" data-game="' + esc(g.id) + '" style="--d:' + (i % 4) * 70 + 'ms" aria-label="Play ' + esc(g.title) + '">' +
        '<span class="game__art">' + art + '</span>' +
        '<span class="game__body"><small>' + esc(g.sub) + '</small><h3>' + esc(g.title) + '</h3>' +
        '<p>' + esc(g.desc) + '</p><span class="game__go">▶ PRESS START</span></span></button>';
    }).join("");
    $$("[data-game]").forEach(function (b) { b.addEventListener("click", function () { openGame(b.dataset.game); }); });
  }

  function openGame(id) {
    var g = window.GAMES && window.GAMES[id];
    if (!g) { toast("That demo could not be loaded."); return; }
    var meta = null;
    S.playable.forEach(function (p) { if (p.id === id) meta = p; });
    openModal(
      '<div class="win__bar"><i></i><i></i><i></i><span>~/play/' + esc(id) + '</span></div>' +
      '<div class="modal__body">' +
        '<div class="pm__head"><div><span class="pm__kicker">' + (g.mini ? "Mini game" : "Web recreation") + '</span>' +
          '<h3 id="modal-title" tabindex="-1">' + esc(g.title) + '</h3><span class="pm__sub">' + esc(g.subtitle) + '</span></div>' +
          '<div class="pm__meta">' + esc(g.origin) + '</div></div>' +
        '<div class="game-shell"><div class="game-stage" id="game-stage"></div>' +
          '<p class="game-help">' + esc(g.help || "") + '</p>' +
          (g.mini ? "" : '<div class="note"><span>A browser recreation of my college project: same rules and assets, rebuilt in JavaScript. Not the original ' +
            esc(meta && meta.origin ? meta.origin.split(" · ")[0] : "") + ' build.</span></div>') +
        '</div></div>', g.title);
    gameCleanup = g.mount($("#game-stage"), { toast: toast, confetti: confetti }) || null;
  }

  /* ============================================================ LIGHTBOX */
  var lb = $("#lightbox"), lbStage = $("#lb-stage"), lbItems = [], lbIdx = 0, lbLabel = "", lbFocus = null;
  function openLightbox(items, idx, label) {
    lbItems = items; lbIdx = idx || 0; lbLabel = label || "";
    lbFocus = document.activeElement;
    lb.hidden = false;
    void lb.offsetWidth;
    lb.classList.add("is-open");
    document.body.style.overflow = "hidden";
    paintLightbox();
    $("#lb-close").focus();
  }
  function closeLightbox() {
    $$("video", lbStage).forEach(function (v) { v.pause(); });
    lb.classList.remove("is-open");
    setTimeout(function () { if (!lb.classList.contains("is-open")) { lb.hidden = true; lbStage.innerHTML = ""; } }, 260);
    if (modal.hidden && cs.hidden) document.body.style.overflow = "";
    if (lbFocus && lbFocus.focus) lbFocus.focus({ preventScroll: true });
  }
  function paintLightbox() {
    var it = lbItems[lbIdx];
    $("#lb-title").textContent = it.title || lbLabel;
    $("#lb-meta").textContent = (lbItems.length > 1 ? (lbIdx + 1) + " of " + lbItems.length : "") + (it.sub ? " · " + it.sub : "");
    lbStage.innerHTML = it.type === "video"
      ? '<video src="' + esc(it.src) + '" controls autoplay playsinline' + (it.poster ? ' poster="' + esc(it.poster) + '"' : "") + '></video>'
      : it.type === "pdf"
      ? '<iframe src="' + esc(it.src) + '#view=FitH" title="' + esc(it.title || "Document") + '"></iframe>'
      : '<img src="' + esc(it.src) + '" alt="' + esc(it.cap || "") + '"' + (it.pixel ? ' class="pixelated"' : "") + '>';
    var foot = it.cap ? '<span>' + esc(it.cap) + '</span>' : "";
    if (it.link) foot += '<a class="btn btn--glass btn--sm" href="' + esc(it.link) + '" target="_blank" rel="noopener noreferrer">Verify</a>';
    if (it.type === "pdf") foot += '<a class="btn btn--glass btn--sm" href="' + esc(it.src) + '" target="_blank" rel="noopener noreferrer">Open PDF in a new tab</a>';
    $("#lb-foot").innerHTML = foot;
    $("#lb-prev").hidden = $("#lb-next").hidden = lbItems.length < 2;
  }
  function lbStep(d) { lbIdx = (lbIdx + d + lbItems.length) % lbItems.length; paintLightbox(); }
  $("#lb-close").addEventListener("click", closeLightbox);
  $("#lb-prev").addEventListener("click", function () { lbStep(-1); });
  $("#lb-next").addEventListener("click", function () { lbStep(1); });
  lb.addEventListener("click", function (e) { if (e.target === lb || e.target === lbStage) closeLightbox(); });
  document.addEventListener("keydown", function (e) {
    if (!lb.hidden) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft" && lbItems.length > 1) lbStep(-1);
      if (e.key === "ArrowRight" && lbItems.length > 1) lbStep(1);
    } else if (!modal.hidden && e.key === "Escape") closeModal();
  });

  /* ============================================================ CERTIFICATES */
  var CERT_GROUPS = [
    ["Cloud", ["Cloud", "Cloud & DevOps", "Architecture"]],
    ["DevOps", ["DevOps"]],
    ["Data", ["Data", "Data & BI", "Database"]],
    ["Product & Design", ["Product", "Design", "UI/UX", "Mobile UI", "Analysis & Design"]],
    ["Security & Networking", ["Security", "Networking"]]
  ];
  function certGroup(c) {
    for (var i = 0; i < CERT_GROUPS.length; i++) if (CERT_GROUPS[i][1].indexOf(c.cat) !== -1) return CERT_GROUPS[i][0];
    return "Other";
  }
  function thumb(c) { return "assets/img/certs/thumbs/" + c.id + ".webp"; }
  function certItem(c) {
    var type = (S.certTypes[c.type] || {}).label || "";
    return { type: "pdf", src: c.file, title: c.name, sub: c.issuer + " · " + c.date, cap: type + (c.via ? " · via " + c.via : ""), link: c.verify || "" };
  }
  var certsByDate = S.certs.slice().sort(function (a, b) {
    if (!!b.featured !== !!a.featured) return b.featured ? 1 : -1;
    return (b.year || 0) - (a.year || 0);
  });

  function renderRing() {
    var stage = $("#ring-stage"), ring = $("#ring");
    var picks = certsByDate.slice(0, 14);
    var n = picks.length;
    var small = window.innerWidth < 640;
    var w = small ? 170 : 260, h = Math.round(w * .7);
    var r = Math.round((w + (small ? 14 : 26)) * n / (2 * Math.PI));
    ring.style.setProperty("--w", w + "px");
    ring.style.setProperty("--h", h + "px");
    ring.style.setProperty("--r", r + "px");
    stage.style.height = (h + 44) + "px";
    ring.innerHTML = picks.map(function (c, i) {
      return '<button class="ring__card" type="button" data-i="' + i + '" style="--a:' + (360 / n * i).toFixed(2) + 'deg" aria-label="Open certificate: ' + esc(c.name) + '">' +
        '<img src="' + thumb(c) + '" alt="" loading="lazy" draggable="false"><span>' + esc(c.name) + '</span></button>';
    }).join("");

    var angle = 0, vel = calm ? 0 : -.12, dragging = false, moved = 0, lastX = 0, visible = false, hover = false;
    var items = picks.map(certItem);
    $$(".ring__card", ring).forEach(function (b) {
      b.addEventListener("click", function () { if (moved < 6) openLightbox(items, +b.dataset.i, "Certificates"); });
    });
    stage.addEventListener("pointerdown", function (e) {
      dragging = true; moved = 0; lastX = e.clientX;
      stage.classList.add("is-drag");
    });
    window.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      var dx = e.clientX - lastX; lastX = e.clientX; moved += Math.abs(dx);
      angle += dx * .25; vel = dx * .25;
    });
    window.addEventListener("pointerup", function () {
      if (!dragging) return;
      dragging = false; stage.classList.remove("is-drag");
    });
    stage.addEventListener("pointerenter", function () { hover = true; });
    stage.addEventListener("pointerleave", function () { hover = false; });
    var lastY = window.scrollY;   /* scrolling the page gives the ring a push */
    window.addEventListener("scroll", function () {
      var dy = window.scrollY - lastY;
      lastY = window.scrollY;
      if (visible && !calm) vel = Math.max(-4, Math.min(4, vel - dy * .04));
    }, { passive: true });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (ents) { visible = ents[0].isIntersecting; if (visible) requestAnimationFrame(spin); }).observe(stage);
    } else { visible = true; }

    function spin() {
      if (!visible) return;
      if (!dragging) {
        var target = calm ? 0 : (hover ? -.03 : -.12);
        vel += (target - vel) * .04;
        angle += vel;
      }
      ring.style.setProperty("--ry", angle.toFixed(2) + "deg");
      requestAnimationFrame(spin);
    }
    ring.style.setProperty("--ry", "0deg");
  }

  function renderCertList() {
    var grid = $("#cert-grid"), bar = $("#cert-filters");
    var groups = ["All"].concat(CERT_GROUPS.map(function (g) { return g[0]; }), ["Other"]);
    var counts = {};
    S.certs.forEach(function (c) { var g = certGroup(c); counts[g] = (counts[g] || 0) + 1; });
    counts.All = S.certs.length;
    bar.innerHTML = groups.filter(function (g) { return counts[g]; }).map(function (g, i) {
      return '<button class="filter" type="button" data-g="' + esc(g) + '" aria-pressed="' + (i === 0) + '">' + esc(g) + '<b>' + counts[g] + '</b></button>';
    }).join("");

    var items = certsByDate.map(certItem);
    grid.innerHTML = certsByDate.map(function (c, i) {
      return '<button class="cert" type="button" data-i="' + i + '" data-g="' + esc(certGroup(c)) + '" style="--n:' + i + '">' +
        '<img src="' + thumb(c) + '" alt="" loading="lazy">' +
        '<span><b>' + esc(c.name) + '</b><small>' + esc(c.issuer) + ' · ' + esc(c.date) + '</small></span></button>';
    }).join("");
    $$(".cert", grid).forEach(function (b) {
      b.addEventListener("click", function () { openLightbox(items, +b.dataset.i, "Certificates"); });
    });
    $$(".filter", bar).forEach(function (f) {
      f.addEventListener("click", function () {
        $$(".filter", bar).forEach(function (x) { x.setAttribute("aria-pressed", String(x === f)); });
        var n = 0;
        $$(".cert", grid).forEach(function (c) {
          var show = f.dataset.g === "All" || c.dataset.g === f.dataset.g;
          c.hidden = !show;
          if (show) { c.style.setProperty("--n", n++); c.style.animation = "none"; void c.offsetWidth; c.style.animation = ""; }
        });
      });
    });

    var B = S.badges;
    if (B) {
      $("#badges").innerHTML = "Plus " + B.count + " " + esc(B.title) + " skill badges · " +
        '<a href="' + esc(B.profile) + '" target="_blank" rel="noopener noreferrer">see the public profile ↗</a>';
    }
  }

  /* ============================================================ CONTACT */
  function renderContact() {
    var P = S.profile;
    var rows = [
      { t: "Email", v: P.email, href: "mailto:" + P.email, i: ICON.mail },
      { t: "Phone", v: P.phone, href: "tel:+63" + P.phone.replace(/\D/g, "").replace(/^0/, ""), i: ICON.phone },
      { t: "GitHub", v: "github.com/" + P.githubHandle, href: P.github, i: ICON.gh },
      { t: "LinkedIn", v: "linkedin.com/in/jm-de-roxas", href: P.linkedin, i: ICON.li },
      { t: "Location", v: P.location, href: "", i: ICON.pin }
    ];
    $("#contact-list").innerHTML = rows.map(function (r, n) {
      var ext = r.href.indexOf("http") === 0 ? ' target="_blank" rel="noopener noreferrer"' : "";
      var inner = '<span class="clink__ico">' + r.i + '</span><span class="clink__t"><b>' + esc(r.t) + '</b><span>' + esc(r.v) + '</span></span>';
      return '<div class="crow reveal" style="--d:' + n * 60 + 'ms">' +
        (r.href ? '<a class="clink" href="' + esc(r.href) + '"' + ext + '>' + inner + '</a>' : '<div class="clink">' + inner + '</div>') +
        (r.href ? '<button class="copy" type="button" data-copy="' + esc(r.href.indexOf("http") === 0 ? r.href : r.v) + '" aria-label="Copy ' + esc(r.t) + '">Copy</button>' : "") +
        '</div>';
    }).join("");
    $$(".copy").forEach(function (b) {
      b.addEventListener("click", function () {
        var text = b.dataset.copy;
        function ok() {
          b.textContent = "Copied"; b.classList.add("is-ok"); toast("Copied " + text);
          setTimeout(function () { b.textContent = "Copy"; b.classList.remove("is-ok"); }, 1400);
        }
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, ok);
        else ok();
      });
    });
  }

  /* ============================================================ GUIDE
     A second cursor glides to each feature and types a short tip into its
     name tag. Plays once per visit after the intro; desktop with a mouse
     only. Scrolling away or pressing Esc ends it, then a pill offers a replay. */
  function guideTour() {
    var box = $("#guide"), text = $("#guide-text"), prompt = $("#guide-prompt");
    var able = window.matchMedia && window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)").matches;
    var steps = [
      { el: ".profile__photo", at: "right", say: "Hi! I'm Jhan, welcome to my portfolio!" },
      { el: "#hero-social", say: "These are my socials." },
      { el: ".profile__actions .btn--primary", say: "Start here to see my projects." },
      { el: ".profile__actions .btn--glass", say: "Have a project in mind? Start here." },
      { el: ".profile__cv", say: "My résumé is right here too." },
      { el: '#nav-links a[href="#about"]', say: "Hover the sidebar to jump to any section." },
      { el: "#theme-toggle", say: "Prefer light mode? Switch it here." },
      { el: ".hero__scroll", say: "Scroll down, the page moves with you." },
      { el: null, say: "That's the tour. Enjoy looking around!" }
    ];
    var run = 0, startY = 0;

    function wait(ms, id) {
      return new Promise(function (ok, no) { setTimeout(function () { id === run ? ok() : no(); }, ms); });
    }
    function moveTo(x, y) {
      box.classList.toggle("is-flip", x + 400 > window.innerWidth);
      box.style.setProperty("--gx", (x - 4).toFixed(1) + "px");
      box.style.setProperty("--gy", (y - 3).toFixed(1) + "px");
    }
    function pointFor(step) {
      if (!step.el) return [window.innerWidth * .55, window.innerHeight * .45];
      var n = $(step.el);
      if (!n) return null;
      var r = n.getBoundingClientRect();
      if (!r.width || r.bottom < 0 || r.top > window.innerHeight) return null;   /* off screen: skip */
      return step.at === "right" ? [r.right - 10, r.top + r.height * .35] : [r.left + r.width / 2, r.top + r.height / 2];
    }
    function type(say, id) {
      text.textContent = "";
      var chars = Array.from(say), k = 0;
      return new Promise(function (ok, no) {
        (function tick() {
          if (id !== run) return no();
          if (k >= chars.length) return ok();
          text.textContent += chars[k++];
          setTimeout(tick, 26);
        })();
      });
    }

    function stop(showPrompt) {
      run += 1;
      box.classList.remove("is-on");
      text.textContent = "";
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("keydown", onKey);
      if (showPrompt) prompt.hidden = false;
    }
    function onScroll() { if (Math.abs(window.scrollY - startY) > 140) stop(true); }
    function onKey(e) { if (e.key === "Escape") stop(true); }

    function play() {
      if (!able || calm) return;
      var id = ++run;
      prompt.hidden = true;
      startY = window.scrollY;
      window.addEventListener("scroll", onScroll, { passive: true });
      document.addEventListener("keydown", onKey);
      moveTo(window.innerWidth * .7, window.innerHeight * .85);
      box.classList.add("is-on");

      var chain = wait(500, id);
      steps.forEach(function (step) {
        chain = chain.then(function () {
          var pt = pointFor(step);
          if (!pt) return;
          text.textContent = "";
          moveTo(pt[0], pt[1]);
          return wait(1050, id)
            .then(function () { box.classList.add("is-tap"); return wait(160, id); })
            .then(function () { box.classList.remove("is-tap"); return type(step.say, id); })
            .then(function () { return wait(800 + step.say.length * 18, id); });
        });
      });
      chain.then(function () {
        try { sessionStorage.setItem("jm-guide", "1"); } catch (e) {}
        stop(true);
      }, function () {});
    }

    $("#guide-replay").addEventListener("click", function () {
      prompt.hidden = true;
      window.scrollTo({ top: 0, behavior: calm ? "auto" : "smooth" });
      setTimeout(play, 700);
    });
    $("#guide-close").addEventListener("click", function () { prompt.hidden = true; });

    return {
      auto: function () {
        var seen = false;
        try { seen = sessionStorage.getItem("jm-guide") === "1"; } catch (e) {}
        if (seen) return;
        try { sessionStorage.setItem("jm-guide", "1"); } catch (e) {}
        setTimeout(function () { if (window.scrollY < 80) play(); }, 2600);
      }
    };
  }

  /* ============================================================ REVEALS */
  function reveals() {
    var items = $$(".reveal, .sec__title[data-title]");
    if (calm) { items.forEach(function (n) { n.classList.add("is-in"); }); return; }
    onView(items, function (n) { n.classList.add("is-in"); });
  }

  /* ============================================================ BOOT ORDER */
  $("#year").textContent = new Date().getFullYear();
  /* One broken section must never leave the intro stuck. */
  [heroSocial, renderAbout, renderStack, renderProjects, renderGames,
   renderRing, renderCertList, renderContact, reveals, countUp, heroParallax, scrollFx].forEach(function (fn) {
    try { fn(); } catch (e) { if (window.console) console.error(fn.name + " failed:", e); }
  });

  var tour = guideTour();
  splash(function () {
    document.body.classList.add("is-ready");
    setTimeout(typeWhoami, calm ? 0 : 500);
    tour.auto();
  });
})();
