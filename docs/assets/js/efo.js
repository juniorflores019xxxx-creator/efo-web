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
    if (reduce) return; // con movimiento reducido se queda la imagen fija
    v.src = src;
    v.muted = true;
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } else v.pause(); });
      }, { threshold: 0.05 }).observe(v);
    } else v.play();
  });

  /* ---------- Música: reproductor de YouTube, 1 minuto, solo al tocar ---------- */
  var mBtn = $(".music"), mBox = $("#player");
  if (mBtn && mBox) {
    var frame = $(".player-frame", mBox), timer = null;
    var stop = function () { frame.innerHTML = ""; mBox.hidden = true; mBtn.classList.remove("playing"); mBtn.setAttribute("aria-expanded", "false"); clearTimeout(timer); };
    mBtn.addEventListener("click", function () {
      if (!mBox.hidden) { stop(); return; }
      var id = frame.dataset.yt;
      frame.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&start=0&end=60&rel=0&playsinline=1" title="Patria Inmortal, Salomé Rock Band" allow="autoplay; encrypted-media; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin"></iframe>';
      mBox.hidden = false; mBtn.classList.add("playing"); mBtn.setAttribute("aria-expanded", "true");
      clearTimeout(timer); timer = setTimeout(stop, 62000);
    });
    $(".player-x", mBox).addEventListener("click", stop);
  }

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

  /* Aparición de bloques */
  gsap.set("[data-reveal]", { opacity: 0, y: 44 });
  ST.batch("[data-reveal]", {
    start: "top 88%",
    onEnter: function (b) { gsap.to(b, { opacity: 1, y: 0, duration: 1.1, ease: "expo.out", stagger: 0.09, overwrite: true }); },
  });

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

  /* ---------- Formulario: WhatsApp o correo ---------- */
  function initForms() {
    $$("form[data-contact]").forEach(function (form) {
      var status = $(".status", form);
      function val(n) { var el = form.elements[n]; return el ? String(el.value || "").trim() : ""; }
      function bad(name, on) { var f = form.elements[name] && form.elements[name].closest(".field"); if (f) f.classList.toggle("bad", on); }
      function valid() {
        var ok = true, first = null;
        [["nombre", val("nombre").length >= 2], ["telefono", val("telefono").replace(/\D/g, "").length >= 7],
         ["correo", !val("correo") || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val("correo"))], ["tipo", !!val("tipo")], ["mensaje", val("mensaje").length >= 10]
        ].forEach(function (c) { bad(c[0], !c[1]); if (!c[1]) { ok = false; if (!first) first = form.elements[c[0]]; } });
        if (first) first.focus();
        return ok;
      }
      function texto() {
        return ["Hola E.F.O., quisiera solicitar información / cotización.", "", "Nombre: " + val("nombre"),
          val("empresa") ? "Empresa: " + val("empresa") : null, "Teléfono: " + val("telefono"),
          val("correo") ? "Correo: " + val("correo") : null, "Tipo de consulta: " + val("tipo"), "", val("mensaje")
        ].filter(function (x) { return x !== null; }).join("\n");
      }
      form.addEventListener("input", function (e) { var f = e.target.closest(".field"); if (f) f.classList.remove("bad"); });
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (form.elements.web_empresa && form.elements.web_empresa.value) return;
        if (!valid()) return;
        var via = (e.submitter && e.submitter.value) || "whatsapp", url;
        if (via === "correo") {
          url = "mailto:" + MAIL + "?subject=" + encodeURIComponent("Consulta web: " + val("tipo")) + "&body=" + encodeURIComponent(texto());
          window.location.href = url;
          status.innerHTML = "Abrimos tu aplicación de correo con la consulta escrita. Si no se abrió, escríbenos a <a href=\"mailto:" + MAIL + "\">" + MAIL + "</a>.";
        } else {
          url = "https://wa.me/" + WA + "?text=" + encodeURIComponent(texto());
          window.open(url, "_blank", "noopener");
          status.innerHTML = "Abrimos WhatsApp con tu consulta escrita: solo presiona <b>Enviar</b>. Si no se abrió, <a href=\"" + url + "\" target=\"_blank\" rel=\"noopener\">toca aquí</a>.";
        }
      });
    });
    var q = new URLSearchParams(location.search).get("tipo");
    if (q) $$("select[name=tipo]").forEach(function (s) { Array.prototype.forEach.call(s.options, function (o) { if (o.value === q) s.value = q; }); });
  }
})();
