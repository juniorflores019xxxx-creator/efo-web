/* E.F.O. Ltda. · experiencia del sitio
   Desplazamiento suave (Lenis), animaciones al hacer scroll (GSAP + ScrollTrigger),
   transiciones entre páginas, videos que se reproducen solo cuando se ven, menú y formulario. */
(function () {
  "use strict";
  var WA = "59169540072";
  var MAIL = "gerencia@efo.com.bo";
  var root = document.documentElement;
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = !!(window.gsap && window.ScrollTrigger);
  window.__efo = true;
  if (reduce) root.classList.add("reduce");

  /* ---------- Videos: fuente según pantalla y reproducción solo en pantalla ---------- */
  var small = window.matchMedia("(max-width: 900px)").matches;
  $$("video[data-src]").forEach(function (v) {
    var src = small && v.dataset.srcSm ? v.dataset.srcSm : v.dataset.src;
    if (v.dataset.webm && v.canPlayType('video/webm; codecs="vp9"') === "probably") src = v.dataset.webm;
    var cx = navigator.connection;
    if (reduce || (cx && (cx.saveData || /(^|-)2g$/.test(cx.effectiveType || "")))) return; // se queda la imagen fija
    // En celulares (sobre todo iPhone) el video debe estar silenciado e "inline" ANTES de asignar la fuente
    v.muted = true;
    v.defaultMuted = true;
    v.playsInline = true;
    v.setAttribute("muted", "");
    v.setAttribute("playsinline", "");
    v.setAttribute("webkit-playsinline", "");
    if (v.hasAttribute("autoplay")) v.preload = small ? "metadata" : "auto"; // en celular no se precarga completo
    v.src = src;
    v.load();
    var visible = false;
    var tryPlay = function () {
      if (!visible) return;
      var p = v.play();
      if (p && p.catch) p.catch(function () {
        // Autoplay bloqueado (p. ej. modo de ahorro de batería): se reintenta con el primer toque o scroll
        var retry = function () {
          ["touchstart", "click", "scroll", "keydown"].forEach(function (t) { window.removeEventListener(t, retry, true); });
          if (visible) { var q = v.play(); if (q && q.catch) q.catch(function () {}); }
        };
        ["touchstart", "click", "scroll", "keydown"].forEach(function (t) { window.addEventListener(t, retry, { capture: true, passive: true }); });
      });
    };
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) { visible = e.isIntersecting; if (visible) tryPlay(); else v.pause(); });
      }, { threshold: 0.05 }).observe(v);
    } else { visible = true; tryPlay(); }
    // Si el navegador tarda en tener datos, se vuelve a intentar cuando ya puede reproducir
    v.addEventListener("canplay", tryPlay);
  });

  /* ---------- Permiso para contenido de terceros (YouTube y Google Maps) ----------
     Nada de Google se carga hasta que la persona acepta. La elección se guarda en este navegador
     ("efo-consent": "all" o "none") y se puede cambiar con «Configurar cookies» en el pie. */
  var consent = (function () {
    var KEY = "efo-consent", box = $("#consent"), waiting = [];
    function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
    function put(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
    function open() { if (!box) return; box.hidden = false; var b = $("[data-consent=all]", box); if (b) b.focus(); }
    function run() { var list = waiting; waiting = []; list.forEach(function (cb) { try { cb(); } catch (e) { console.error(e); } }); }
    if (box) {
      $$("[data-consent]", box).forEach(function (b) {
        b.addEventListener("click", function () {
          var before = get(), v = b.getAttribute("data-consent");
          put(v); box.hidden = true;
          if (v === "all") run();
          else if (before === "all") location.reload(); // retira YouTube y Maps ya cargados
        });
      });
      if (!get()) box.hidden = false;
    }
    $$("[data-consent-open]").forEach(function (b) { b.addEventListener("click", open); });
    return { ok: function () { return get() === "all"; }, on: function (cb) { if (get() === "all") cb(); else waiting.push(cb); }, open: open };
  })();

  /* Mapa de Google: se carga con permiso, o solo esta vez con el botón «Mostrar mapa» */
  $$("iframe[data-consent-src]").forEach(function (f) {
    var ph = f.parentNode.querySelector(".map-ph");
    function load() { if (f.src) return; f.src = f.getAttribute("data-consent-src"); if (ph) ph.hidden = true; }
    consent.on(load);
    if (ph) { var b = ph.querySelector("[data-map-load]"); if (b) b.addEventListener("click", load); }
  });

  /* ---------- Música de fondo: «Patria Inmortal» desde el segundo 35, en todas las páginas ----------
     Se intenta sonar al entrar. Si el navegador lo bloquea (exigen un toque previo), arranca en
     silencio y suena con el primer toque/clic/tecla en cualquier parte. La nota musical, con su X roja,
     corta la música; tocándola de nuevo vuelve. El minuto y el silencio se conservan entre páginas. */
  (function () {
    var box = $("#player"), mBtn = $(".music"), errorBox = $(".player-error", box), tip = $(".music-tip", mBtn);
    if (!box || !mBtn) return;
    var START = 35, KT = "efo-musica-t", KM = "efo-musica-mute";
    var ss = { get: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }, set: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} } };
    var userMute = ss.get(KM) === "1", player = null, ready = false, playing = false;
    function showError(msg) { if (errorBox) { errorBox.textContent = msg; errorBox.hidden = false; } }
    function audible() { try { return ready && playing && !player.isMuted(); } catch (e) { return false; } }
    function ui() {
      var off = userMute || !consent.ok();
      mBtn.classList.toggle("muted", off);
      mBtn.classList.toggle("playing", audible());
      var t = off ? "Activar música" : "Silenciar música";
      mBtn.setAttribute("aria-label", t); mBtn.title = t; if (tip) tip.textContent = t;
    }
    function hint() { mBtn.classList.add("hint"); clearTimeout(hint.t); hint.t = setTimeout(function () { mBtn.classList.remove("hint"); }, 5000); }
    function sound() {
      if (!player || !ready || userMute) return;
      try { player.unMute(); player.setVolume(55); player.playVideo(); } catch (e) { console.error("No se pudo activar el sonido.", e); }
      setTimeout(ui, 300);
    }
    // Eventos que los navegadores aceptan como "interacción" para permitir sonido (en celular cuenta al soltar el dedo)
    var EV = ["pointerdown", "pointerup", "mousedown", "touchend", "click", "keydown"];
    function gesture(e) {
      if (e && e.target && e.target.closest && e.target.closest(".music")) return; // la nota decide por sí misma
      if (!ready) return; // aún cargando: se espera el siguiente toque
      EV.forEach(function (ev) { document.removeEventListener(ev, gesture, true); });
      sound();
    }
    EV.forEach(function (ev) { document.addEventListener(ev, gesture, true); });
    mBtn.addEventListener("click", function () {
      if (!consent.ok()) { consent.open(); return; } // la música usa YouTube: primero se pide permiso
      userMute = !userMute; ss.set(KM, userMute ? "1" : "0");
      if (userMute) { try { player.mute(); } catch (e) {} } else sound();
      ui(); hint();
    });
    function playbackError(e) {
      var code = e && e.data;
      showError(code === 101 || code === 150 ? "Este video no permite reproducirse dentro de la página."
        : code === 153 ? "YouTube no recibió la dirección de esta página. Revisa la conexión segura del sitio."
        : "No se pudo cargar la música. Intenta nuevamente más tarde.");
      playing = false; ui();
      console.error("Error del reproductor de música de YouTube:", code);
    }
    window.onYouTubeIframeAPIReady = function () {
      var t = parseFloat(ss.get(KT)); if (!(t >= START)) t = START;
      player = new YT.Player("yt", {
        host: "https://www.youtube-nocookie.com", videoId: "hbCTWzxubbU",
        playerVars: { start: Math.floor(t), autoplay: 1, mute: 1, controls: 0, rel: 0, playsinline: 1, modestbranding: 1, disablekb: 1 },
        events: {
          onReady: function () {
            ready = true;
            player.playVideo();
            // Intento con sonido desde el inicio; si el navegador lo impide, sigue en silencio hasta el primer toque
            if (!userMute) sound();
            setTimeout(function () { if (!playing) { player.mute(); player.playVideo(); } ui(); }, 1500);
            ui(); hint();
          },
          onStateChange: function (e) {
            if (e.data === YT.PlayerState.PLAYING) { playing = true; if (errorBox) errorBox.hidden = true; }
            else if (e.data === YT.PlayerState.ENDED) { player.seekTo(START, true); player.playVideo(); }
            else if (e.data === YT.PlayerState.PAUSED) playing = false;
            ui();
          },
          onError: playbackError,
        },
      });
      setInterval(function () { try { var c = player.getCurrentTime(); if (c) ss.set(KT, String(c)); } catch (e) {} ui(); }, 1500);
    };
    window.addEventListener("pagehide", function () { try { ss.set(KT, String(player.getCurrentTime())); } catch (e) {} });
    consent.on(function () {
      box.classList.add("on");
      var s = document.createElement("script"); s.src = "https://www.youtube.com/iframe_api"; s.async = true;
      s.onerror = function () { showError("No se pudo cargar la música. Revisa tu conexión e inténtalo nuevamente."); };
      document.head.appendChild(s);
      ui();
    });
    ui();
  })();

  /* ---------- Menú ---------- */
  var burger = $(".burger"), drawer = $("#menu");
  var lenis = null;
  function setMenu(open) {
    document.body.classList.toggle("menu-open", open);
    if (burger) { burger.setAttribute("aria-expanded", String(open)); burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú"); }
    if (drawer) drawer.toggleAttribute("inert", !open);
    if (lenis) { if (open) lenis.stop(); else lenis.start(); }
    root.style.overflow = open ? "hidden" : "";
  }
  if (burger && drawer) {
    setMenu(false);
    burger.addEventListener("click", function () { setMenu(!document.body.classList.contains("menu-open")); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && document.body.classList.contains("menu-open")) { setMenu(false); burger.focus(); } });
    window.matchMedia("(min-width: 1200px)").addEventListener("change", function (m) { if (m.matches) setMenu(false); });
  }

  /* ---------- Encabezado: sólido al bajar, se oculta al bajar rápido y vuelve al subir ---------- */
  var top = $(".top"), lastY = 0;
  function onScroll(y) {
    if (!top) return;
    top.classList.toggle("solid", y > 40);
    if (!document.body.classList.contains("menu-open")) top.classList.toggle("hide", y > 600 && y > lastY + 4);
    if (y < lastY - 4) top.classList.remove("hide");
    lastY = y;
  }
  onScroll(window.scrollY);

  /* ---------- Transiciones entre páginas ---------- */
  function ready() { root.classList.add("ready"); }
  if (document.readyState === "complete") requestAnimationFrame(ready); else window.addEventListener("load", ready);
  setTimeout(ready, 1800);
  window.addEventListener("pageshow", function (e) { if (e.persisted) { root.classList.remove("leaving"); ready(); } });
  if (!reduce) {
    document.addEventListener("click", function (e) {
      var a = e.target.closest("a");
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (a.target === "_blank" || a.hasAttribute("download")) return;
      var url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      if (!/\/$|\.html$/.test(url.pathname)) return;
      e.preventDefault();
      setMenu(false);
      root.classList.add("leaving");
      setTimeout(function () { location.href = url.href; }, 520);
    });
  }

  /* ---------- Sin GSAP o con movimiento reducido: todo visible ---------- */
  if (!hasGsap || reduce) {
    root.classList.add("nogsap");
    window.addEventListener("scroll", function () { onScroll(window.scrollY); }, { passive: true });
    sceneFallback();
    initForms();
    return;
  }

  var gsap = window.gsap, ST = window.ScrollTrigger;
  gsap.registerPlugin(ST);

  /* Desplazamiento suave */
  if (window.Lenis) {
    lenis = new window.Lenis({ duration: 1.15, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, smoothWheel: true });
    lenis.on("scroll", function (e) { ST.update(); onScroll(e.scroll); });
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) { var t = $(a.getAttribute("href")); if (t) { e.preventDefault(); lenis.scrollTo(t, { offset: -70 }); } });
    });
  } else {
    window.addEventListener("scroll", function () { onScroll(window.scrollY); }, { passive: true });
  }

  /* Títulos por líneas: suben desde abajo */
  $$("[data-lines]").forEach(function (el) {
    gsap.from($$(".ln > span", el), {
      yPercent: 115, duration: 1.3, ease: "expo.out", stagger: 0.09,
      delay: el.closest(".hero, .phero") ? 0.55 : 0,
      scrollTrigger: el.closest(".hero, .phero") ? null : { trigger: el, start: "top 85%" },
    });
  });

  /* Textos: las palabras aparecen suavemente al llegar a ellas */
  $$(".lead").forEach(function (p) {
    p.removeAttribute("data-reveal");
    p.classList.add("split");
    var walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT), nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (n) {
      var frag = document.createDocumentFragment();
      n.nodeValue.split(/(\s+)/).forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
        var w = document.createElement("span"); w.className = "wd"; w.textContent = part; frag.appendChild(w);
      });
      n.parentNode.replaceChild(frag, n);
    });
    var inHero = !!p.closest(".hero, .phero");
    gsap.from($$(".wd", p), {
      opacity: 0, y: 14, duration: 0.8, ease: "power2.out", stagger: 0.018,
      delay: inHero ? 0.9 : 0,
      scrollTrigger: inHero ? null : { trigger: p, start: "top 88%", once: true },
    });
  });

  /* Imágenes y tarjetas: se inclinan en 3D siguiendo el mouse o el toque */
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  $$(".photo, .proj, .depth figure, .bio-main, .gal figure, .step").forEach(function (el) {
    var glare = document.createElement("span");
    glare.className = "tilt-glare"; glare.setAttribute("aria-hidden", "true");
    el.appendChild(glare);
    el.classList.add("tilt");
    gsap.set(el, { transformPerspective: 1000 });
    var rx = gsap.quickTo(el, "rotationX", { duration: 0.7, ease: "power3.out" });
    var ry = gsap.quickTo(el, "rotationY", { duration: 0.7, ease: "power3.out" });
    var sc = gsap.quickTo(el, "scale", { duration: 0.7, ease: "power3.out" });
    var timer = null;
    function at(x, y) {
      var r = el.getBoundingClientRect(), px = (x - r.left) / r.width, py = (y - r.top) / r.height;
      rx((0.5 - py) * 9); ry((px - 0.5) * 11); sc(1.015);
      el.style.setProperty("--gx", (px * 100).toFixed(1) + "%"); el.style.setProperty("--gy", (py * 100).toFixed(1) + "%");
      el.classList.add("tilting");
    }
    function reset() { rx(0); ry(0); sc(1); el.classList.remove("tilting"); }
    if (fine) {
      el.addEventListener("pointermove", function (e) { at(e.clientX, e.clientY); });
      el.addEventListener("pointerleave", reset);
    } else {
      el.addEventListener("touchstart", function (e) {
        var t = e.touches[0]; if (!t) return;
        at(t.clientX, t.clientY);
        clearTimeout(timer); timer = setTimeout(reset, 650);
      }, { passive: true });
    }
  });

  /* Aparición de bloques */
  if ($$("[data-reveal]").length) {
    gsap.set("[data-reveal]", { opacity: 0, y: 44 });
    ST.batch("[data-reveal]", {
      start: "top 88%",
      onEnter: function (b) { gsap.to(b, { opacity: 1, y: 0, duration: 1.1, ease: "expo.out", stagger: 0.09, overwrite: true }); },
    });
  }

  /* Portada: el video se acerca y el texto se aleja al bajar */
  $$(".hero, .phero").forEach(function (h) {
    var media = $(".hero-media, .phero-media", h), inner = $(".hero-in, .wrap", h);
    gsap.fromTo(media, { scale: 1.12 }, { scale: 1, duration: 2.4, ease: "expo.out" });
    gsap.to(media, { yPercent: 14, ease: "none", scrollTrigger: { trigger: h, start: "top top", end: "bottom top", scrub: true } });
    if (inner) gsap.to(inner, { yPercent: -18, opacity: 0, ease: "none", scrollTrigger: { trigger: h, start: "35% top", end: "bottom top", scrub: true } });
  });

  /* Declaración: las palabras se encienden al leer */
  $$("[data-words]").forEach(function (p) {
    var words = $$(".w", p);
    gsap.to(words, { opacity: 1, stagger: 0.06, ease: "none", scrollTrigger: { trigger: p, start: "top 80%", end: "bottom 50%", scrub: true } });
  });

  /* Recorrido horizontal de las áreas (escritorio) */
  var mm = gsap.matchMedia();
  mm.add("(min-width: 1024px)", function () {
    var sec = $(".areas"), track = $(".areas-track");
    if (!sec || !track) return;
    sec.classList.add("h-scroll");
    var dist = function () { return Math.max(0, track.scrollWidth - window.innerWidth); };
    var tween = gsap.to(track, { x: function () { return -dist(); }, ease: "none", scrollTrigger: { trigger: sec, pin: true, scrub: 1, start: "top top", end: function () { return "+=" + dist(); }, invalidateOnRefresh: true } });
    $$(".panel-media", track).forEach(function (m) {
      gsap.fromTo(m, { xPercent: 6 }, { xPercent: -6, ease: "none", scrollTrigger: { trigger: m.parentNode, containerAnimation: tween, start: "left right", end: "right left", scrub: true } });
    });
    return function () { sec.classList.remove("h-scroll"); gsap.set(track, { clearProps: "x" }); };
  });

  /* Video que se abre como telón */
  $$(".reveal-media").forEach(function (s) {
    var f = $(".rm-frame", s);
    gsap.fromTo(f, { clipPath: "inset(16% 12% 16% 12% round 28px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none", scrollTrigger: { trigger: s, start: "top 90%", end: "top 10%", scrub: true } });
    gsap.fromTo($("video, img", f), { scale: 1.25 }, { scale: 1, ease: "none", scrollTrigger: { trigger: s, start: "top bottom", end: "bottom top", scrub: true } });
  });

  /* Profundidad: fotos que se desplazan a distinta velocidad */
  $$("[data-speed]").forEach(function (el) {
    var sp = parseFloat(el.dataset.speed) || 0.2;
    gsap.fromTo(el, { yPercent: -sp * 40 }, { yPercent: sp * 40, ease: "none", scrollTrigger: { trigger: el.parentNode, start: "top bottom", end: "bottom top", scrub: true } });
  });
  $$("[data-zoom]").forEach(function (el) {
    gsap.fromTo(el, { scale: 1.18 }, { scale: 1, ease: "none", scrollTrigger: { trigger: el.parentNode, start: "top bottom", end: "center center", scrub: true } });
  });

  /* Rutas de los mapas: se dibujan al bajar */
  $$(".worldmap .ruta, .bomap .linea").forEach(function (p) {
    var L = p.getTotalLength ? p.getTotalLength() : 600;
    gsap.fromTo(p, { strokeDasharray: L, strokeDashoffset: L }, { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: p.closest("figure"), start: "top 80%", end: "center 45%", scrub: true } });
  });

  /* Escena de electromovilidad: la foto cambia según el punto que se lee */
  var imgs = $$(".scene-media img");
  $$(".scene-step").forEach(function (step, i) {
    ST.create({
      trigger: step, start: "top 60%", end: "bottom 60%",
      onToggle: function (st) {
        if (!st.isActive) return;
        $$(".scene-step").forEach(function (s) { s.classList.toggle("on", s === step); });
        imgs.forEach(function (im, k) { im.classList.toggle("on", k === i); });
      },
    });
  });

  window.addEventListener("load", function () { ST.refresh(); });
  initForms();

  function sceneFallback() {
    $$(".scene-media img").forEach(function (im, k) { im.classList.toggle("on", k === 0); });
  }

  /* ---------- Formulario: se guarda en el CRM de E.F.O. (api/lead.php); si falla, sigue por WhatsApp ---------- */
  // (funciones, no variables: initForms() se llama antes de esta línea)
  function apiUrl() { return "/api/enviar.php"; }
  // Estimado solar con las fórmulas del Excel de E.F.O. (HSP 5, rendimiento 0,75, panel 550 W, DC/AC 1,2, baterías 5,12 kWh)
  function estimadoSolar(kwh, dias, mod) {
    if (!(kwh > 0)) return null;
    var diario = kwh / (dias > 0 ? dias : 30), r6 = function (x) { return Math.ceil(Math.round(x * 1e6) / 1e6); };
    var paneles = r6(diario / (5 * 0.75) * 1000 / 550), kwp = paneles * 0.55;
    var bat = /^(Híbrido|Off)/.test(mod || "") ? r6((diario * 0.5 / (0.8 * 0.9)) / 5.12) : 0;
    return { paneles: paneles, kwp: kwp, inv: kwp / 1.2, bat: bat };
  }
  function nf(n, d) { return n.toLocaleString("es-BO", { minimumFractionDigits: d, maximumFractionDigits: d }); }
  function grupoDe(tipo) {
    var G = { diesel: ["Combustibles", "Diésel ULSD", "Importación"], solar: ["Energía solar"], cargadores: ["Electromovilidad", "Electrolineras", "Cargadores"], conversion: ["Conversión de vehículos"] };
    for (var g in G) if (G[g].indexOf(tipo) > -1) return g;
    return "";
  }
  function initForms() {
    $$("form[data-contact]").forEach(function (form) {
      var status = $(".status", form), sending = false;
      function val(n) { var el = form.elements[n]; return el && !el.disabled ? String(el.value || "").trim() : ""; }
      function bad(el, on) { var f = el && el.closest && el.closest(".field"); if (f) f.classList.toggle("bad", on); }
      function grupo() { return grupoDe(val("tipo")); }
      function sync() {
        var g = grupo();
        $$("fieldset[data-grupo]", form).forEach(function (fs) {
          var on = fs.getAttribute("data-grupo") === g;
          fs.hidden = !on;
          $$("input,select,textarea", fs).forEach(function (el) { el.disabled = !on; if (!on) bad(el, false); });
        });
        var mo = $("[data-msg-opt]", form); if (mo) mo.hidden = !g;
        estimar();
      }
      function est() { return grupo() === "solar" ? estimadoSolar(Number(val("s_kwh").replace(",", ".")), Number(val("s_dias")), val("s_modalidad")) : null; }
      function estimar() {
        var box = $("[data-estimado]", form); if (!box) return;
        var e = est(); box.hidden = !e; if (!e) return;
        $("[data-e=paneles]", box).textContent = e.paneles;
        $("[data-e=kwp]", box).textContent = nf(e.kwp, 2);
        $("[data-e=inv]", box).textContent = "~" + nf(e.inv, 1);
        $("[data-e=bat]", box).textContent = e.bat;
        $("[data-e-bat]", box).hidden = !e.bat;
      }
      function valid() {
        var ok = true, first = null;
        function chk(el, cond) { if (!el) return; bad(el, !cond); if (!cond) { ok = false; if (!first) first = el; } }
        var E = form.elements;
        chk(E.nombre, val("nombre").length >= 2);
        chk(E.telefono, val("telefono").replace(/\D/g, "").length >= 7);
        chk(E.correo, !val("correo") || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val("correo")));
        chk(E.tipo, !!val("tipo"));
        chk(E.ciudad, !!val("ciudad"));
        var g = grupo();
        if (g) {
          $$("fieldset[data-grupo=" + g + "] [data-req]", form).forEach(function (el) { chk(el, String(el.value || "").trim() !== "" && (el.type !== "number" || Number(el.value) > 0)); });
          var f = E.factura;
          if (f && !f.disabled && f.files && f.files[0]) chk(f, f.files[0].size <= 8 * 1024 * 1024 && /^(image\/(jpeg|png|webp)|application\/pdf)$/.test(f.files[0].type));
        } else chk(E.mensaje, val("mensaje").length >= 10);
        chk(E.acepto, !E.acepto || E.acepto.checked);
        if (first) first.focus();
        return ok;
      }
      function texto(codigo) {
        var L = ["Hola E.F.O., quisiera solicitar una cotización." + (codigo ? " (Solicitud " + codigo + ")" : ""), "",
          "Nombre: " + val("nombre"), val("empresa") ? "Empresa: " + val("empresa") : null, "Teléfono: " + val("telefono"),
          val("correo") ? "Correo: " + val("correo") : null, "Tipo de consulta: " + val("tipo"), "Departamento: " + val("ciudad")];
        var g = grupo();
        if (g) $$("fieldset[data-grupo=" + g + "] .field", form).forEach(function (fd) {
          var el = $("input,select", fd), lb = $("label", fd);
          if (!el || el.type === "file" || !String(el.value || "").trim()) return;
          L.push(lb.childNodes[0].textContent.trim() + ": " + String(el.value).trim());
        });
        var e = est();
        if (e) L.push("", "Sistema estimado en la web: " + e.paneles + " paneles de 550 W, " + nf(e.kwp, 2) + " kWp" + (e.bat ? ", " + e.bat + " baterías" : "") + ".");
        if (val("mensaje")) L.push("", val("mensaje"));
        return L.filter(function (x) { return x !== null; }).join("\n");
      }
      form.addEventListener("input", function (e) { bad(e.target, false); if (/^s_/.test(e.target.name || "")) estimar(); });
      form.addEventListener("change", function (e) { bad(e.target, false); if (e.target.name === "tipo") sync(); else if (/^s_/.test(e.target.name || "")) estimar(); });
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (sending) return;
        if (form.elements.web_empresa && form.elements.web_empresa.value) return;
        if (!valid()) return;
        var via = (e.submitter && e.submitter.value) || "web";
        var win = via === "whatsapp" ? window.open("about:blank", "_blank") : null; // se abre ya para que el navegador no la bloquee
        var btns = $$("button[type=submit]", form);
        sending = true; btns.forEach(function (b) { b.disabled = true; });
        status.textContent = "Enviando tu solicitud…";
        var fd = new FormData(form); fd.append("origen", location.pathname);
        fetch(apiUrl(), { method: "POST", body: fd, headers: { Accept: "application/json" } })
          .then(function (r) { return r.json().catch(function () { return { ok: false, net: true }; }).then(function (j) { if (!r.ok && !j.error) j.net = true; return j; }); }, function () { return { ok: false, net: true }; })
          .then(function (j) {
            sending = false; btns.forEach(function (b) { b.disabled = false; });
            if (j.ok) {
              var wa = "https://wa.me/" + WA + "?text=" + encodeURIComponent(texto(j.codigo));
              if (win) { win.opener = null; win.location.href = wa; }
              status.innerHTML = "<b>¡Listo! Recibimos tu solicitud " + j.codigo + ".</b> E.F.O. revisará tus datos y te enviará tu cotización por WhatsApp o correo, en horario de atención. " +
                (win ? "También abrimos WhatsApp con tu solicitud escrita." : "Si quieres, también puedes <a href=\"" + wa + "\" target=\"_blank\" rel=\"noopener\">escribirnos por WhatsApp</a>.");
              form.reset(); sync();
            } else if (j.error && !j.net) {
              if (win) win.close();
              status.textContent = j.error;
            } else {
              var url = "https://wa.me/" + WA + "?text=" + encodeURIComponent(texto());
              if (win) { win.opener = null; win.location.href = url; } else window.open(url, "_blank", "noopener");
              status.innerHTML = "No pudimos enviar la solicitud en este momento, así que abrimos WhatsApp con tu solicitud escrita: solo presiona <b>Enviar</b>. Si no se abrió, <a href=\"" + url + "\" target=\"_blank\" rel=\"noopener\">toca aquí</a>.";
            }
          });
      });
      var q = new URLSearchParams(location.search).get("tipo");
      if (q && form.elements.tipo) Array.prototype.forEach.call(form.elements.tipo.options, function (o) { if (o.value === q) form.elements.tipo.value = q; });
      sync();
    });
  }
})();
