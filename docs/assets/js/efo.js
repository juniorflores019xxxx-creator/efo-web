/* E.F.O. Ltda. · comportamiento del sitio (sin dependencias) */
(function () {
  "use strict";
  var WA = "59169540072";
  var MAIL = "gerencia@efo.com.bo";
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Menú móvil ---------- */
  var burger = $(".burger");
  var drawer = $("#menu");
  function setMenu(open) {
    document.body.classList.toggle("menu-open", open);
    if (burger) burger.setAttribute("aria-expanded", String(open));
    if (drawer) drawer.toggleAttribute("inert", !open);
    document.documentElement.style.overflow = open ? "hidden" : "";
  }
  if (burger && drawer) {
    setMenu(false);
    burger.addEventListener("click", function () { setMenu(!document.body.classList.contains("menu-open")); });
    $$("a", drawer).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && document.body.classList.contains("menu-open")) { setMenu(false); burger.focus(); } });
    window.matchMedia("(min-width: 1180px)").addEventListener("change", function (m) { if (m.matches) setMenu(false); });
  }

  /* ---------- Apariciones y encendidos ---------- */
  var targets = $$(".rv, .pylon, .worldmap, .bomap");
  if (!("IntersectionObserver" in window) || reduce) {
    targets.forEach(function (el) { el.classList.add("in", "on"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("in", "on");
        io.unobserve(en.target);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.12 });
    targets.forEach(function (el) { io.observe(el); });
  }

  /* El tótem enciende sus filas en secuencia una vez, y después la fila activa sigue al puntero */
  $$(".pylon").forEach(function (py) {
    var rows = $$(".prow", py);
    if (!rows.length || reduce) return;
    var i = 0;
    var t = setInterval(function () {
      rows.forEach(function (r, k) { r.classList.toggle("lit", k === i); });
      i++;
      if (i > rows.length) { clearInterval(t); rows.forEach(function (r) { r.classList.remove("lit"); }); }
    }, 520);
  });

  /* ---------- Formulario: WhatsApp o correo ---------- */
  $$("form[data-contact]").forEach(function (form) {
    var status = $(".status", form);
    function val(n) { var el = form.elements[n]; return el ? String(el.value || "").trim() : ""; }
    function bad(name, on) { var f = form.elements[name] && form.elements[name].closest(".field"); if (f) f.classList.toggle("bad", on); }
    function valid() {
      var ok = true, first = null;
      var checks = [
        ["nombre", val("nombre").length >= 2],
        ["telefono", val("telefono").replace(/\D/g, "").length >= 7],
        ["correo", !val("correo") || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val("correo"))],
        ["tipo", !!val("tipo")],
        ["mensaje", val("mensaje").length >= 10]
      ];
      checks.forEach(function (c) { bad(c[0], !c[1]); if (!c[1]) { ok = false; if (!first) first = form.elements[c[0]]; } });
      if (first) first.focus();
      return ok;
    }
    function texto() {
      return [
        "Hola E.F.O., quisiera solicitar información / cotización.",
        "",
        "Nombre: " + val("nombre"),
        val("empresa") ? "Empresa: " + val("empresa") : null,
        "Teléfono: " + val("telefono"),
        val("correo") ? "Correo: " + val("correo") : null,
        "Tipo de consulta: " + val("tipo"),
        "",
        val("mensaje")
      ].filter(function (x) { return x !== null; }).join("\n");
    }
    form.addEventListener("input", function (e) { var f = e.target.closest(".field"); if (f) f.classList.remove("bad"); });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (form.elements.web_empresa && form.elements.web_empresa.value) return; // trampa anti-spam
      if (!valid()) return;
      var via = (e.submitter && e.submitter.value) || "whatsapp";
      var url;
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

  /* Preselección del tipo de consulta desde enlaces ?tipo=… */
  var q = new URLSearchParams(location.search).get("tipo");
  if (q) $$("select[name=tipo]").forEach(function (s) { Array.prototype.forEach.call(s.options, function (o) { if (o.value === q) s.value = q; }); });
})();
