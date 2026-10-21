// Plantilla común del sitio E.F.O.: <head>, encabezado, telón de transición, pie, íconos y componentes compartidos.
export const SITE = {
  url: "https://efo.com.bo",
  name: "E.F.O. Ltda.",
  legal: "Energía y Fuerza del Oriente Ltda.",
  slogan: "Energía que mueve Bolivia",
  wa: "59169540072",
  waDisplay: "+591 69540072",
  mail: "gerencia@efo.com.bo",
  addr1: "Av. Montecristo No. 205",
  addr2: "Santa Cruz de la Sierra, Bolivia",
  waText: "Hola E.F.O., estoy interesado en conocer sus soluciones energéticas y quisiera solicitar información/cotización.",
};
export const WA_URL = `https://wa.me/${SITE.wa}?text=${encodeURIComponent(SITE.waText)}`;

export const NAV = [
  ["Inicio", "/"],
  ["Empresa", "/empresa/"],
  ["Combustibles", "/combustibles/"],
  ["Soluciones energéticas", "/soluciones-energeticas/"],
  ["Electromovilidad", "/electromovilidad/"],
  ["Proyectos", "/proyectos/"],
  ["Contacto", "/contacto/"],
];

/* Íconos propios, un solo grosor de trazo (1.75) */
const P = {
  gota: '<path d="M12 3.5c3.2 4 5.5 7.2 5.5 10.1A5.5 5.5 0 0 1 6.5 13.6C6.5 10.7 8.8 7.5 12 3.5Z"/><path d="M9.6 14.4a2.6 2.6 0 0 0 2.4 2.4"/>',
  rayo: '<path d="M13.2 2.8 5.6 13.4h5.6l-1 7.8 7.6-10.6h-5.6l1-7.8Z"/>',
  fabrica: '<path d="M3 20.5h18M4.5 20.5V11l5 3V11l5 3V7.5l5 2.6v10.4"/><path d="M8 17.5h1.5M12.5 17.5H14M17 17.5h1.5"/><path d="M17.5 7.5V3.5h1.8v5"/>',
  cargador: '<rect x="4" y="3" width="10" height="18" rx="2"/><path d="M7 7h4v4H7z"/><path d="M14 9.5h2.2a2 2 0 0 1 2 2v5.2a1.6 1.6 0 0 0 3.2 0V8.5l-2-2"/><path d="m9.6 13.6-1.2 2h2l-1.2 2"/>',
  camion: '<path d="M2.5 6.5h11v9.5h-11z"/><path d="M13.5 9.5h4l3.5 3.7v2.8h-7.5"/><circle cx="6.5" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
  barco: '<path d="M3 15.5h18l-2.6 4.3H5.6L3 15.5Z"/><path d="M6 15.5V10h12v5.5M9.5 10V6.5h5V10M12 6.5V3.5"/><path d="M2.5 21.5c1.5 0 1.5-.8 3-.8s1.5.8 3 .8 1.5-.8 3-.8 1.5.8 3 .8 1.5-.8 3-.8 1.5.8 3 .8"/>',
  globo: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.4 2.3 3.6 5.2 3.6 8.5s-1.2 6.2-3.6 8.5c-2.4-2.3-3.6-5.2-3.6-8.5S9.6 5.8 12 3.5Z"/>',
  casa: '<path d="M3.5 11 12 4l8.5 7"/><path d="M5.5 9.5v10h13v-10"/><path d="M10 19.5v-5h4v5"/>',
  edificio: '<path d="M4.5 20.5V5.5l8-2.5v17.5M12.5 8.5h7v12"/><path d="M3 20.5h18M7.5 8.5h2M7.5 12h2M7.5 15.5h2M15.5 12h1.5M15.5 15.5h1.5"/>',
  hotel: '<path d="M3 18.5V7M3 14.5h18v4M21 14.5v-2.5a3 3 0 0 0-3-3h-6.5v5.5"/><circle cx="7" cy="11.5" r="1.8"/>',
  bus: '<rect x="4" y="3.5" width="16" height="14" rx="2.5"/><path d="M4 11h16M8 3.5v7.5M16 3.5v7.5"/><path d="M6.5 17.5v2.5M17.5 17.5v2.5"/><path d="M7 14.5h.01M17 14.5h.01"/>',
  flota: '<path d="M3 15.5V12l1.8-3.5h8.4L15 12v3.5H3Z"/><path d="M15 12h3.4l1.6 2.2v1.3"/><circle cx="6" cy="16.5" r="1.5"/><circle cx="12" cy="16.5" r="1.5"/><circle cx="18" cy="16.5" r="1.5"/><path d="M5.5 8.5 6.6 5.5h4.8l1 3"/>',
  institucion: '<path d="M3 9 12 4l9 5"/><path d="M4.5 9.5h15M5.5 9.5v8M9.5 9.5v8M14.5 9.5v8M18.5 9.5v8M3.5 20h17M4.5 17.5h15"/>',
  tienda: '<path d="M4 9.5 5.5 4h13L20 9.5"/><path d="M4 9.5a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0"/><path d="M5.5 11.5v9h13v-9M10 20.5v-5h4v5"/>',
  red: '<circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M11 6.8 6 17.2M13 6.8l5 10.4M7 19h10"/>',
  torre: '<path d="m8 21 4-18 4 18M9.3 15h5.4M10.2 10.5h3.6M6 8.5h12M7 12h10"/>',
  engranaje: '<circle cx="12" cy="12" r="3"/><path d="M12 2.8v2.6M12 18.6v2.6M21.2 12h-2.6M5.4 12H2.8M18.5 5.5l-1.8 1.8M7.3 16.7l-1.8 1.8M18.5 18.5l-1.8-1.8M7.3 7.3 5.5 5.5"/>',
  ruta: '<path d="M5 20.5c0-4 4-4 4-8s-4-4-4-8"/><path d="M19 3.5c0 4-4 4-4 8s4 4 4 8"/><path d="M12 5v2M12 11v2M12 17v2"/>',
  bateria: '<rect x="3" y="7" width="16" height="10" rx="2"/><path d="M21 10.5v3"/><path d="m11.5 9-2.3 3h3.6l-2.3 3"/>',
  ajustes: '<path d="M4 6.5h9M17 6.5h3M4 12h3M11 12h9M4 17.5h11M19 17.5h1"/><circle cx="15" cy="6.5" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="17.5" r="2"/>',
  idea: '<path d="M9 18.5h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.4 1.1 2.2V16h5v-.1c0-.8.4-1.6 1.1-2.2A6 6 0 0 0 12 3Z"/>',
  bandera: '<path d="M5 21V4M5 4.5h11l-2 3.7 2 3.8H5"/>',
  maletin: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 12.5h18"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/>',
  pin: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.4"/>',
  flecha: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  menu: '<path d="M4 8h16M4 16h16"/>',
  musica: '<path d="M9 18V5.5l11-2.5v12.5"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="15.5" r="2.5"/>',
  cerrar: '<path d="M6 6l12 12M18 6 6 18"/>',
};
const WA_PATH = '<path class="ico-fill" d="M12 2.2a9.7 9.7 0 0 0-8.4 14.6L2.3 21.7l5-1.3A9.7 9.7 0 1 0 12 2.2Zm0 17.7a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 19.9Zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1 4.9 4.9 0 0 0 1 2.6 11.2 11.2 0 0 0 4.3 3.8c1.6.7 2.2.7 3 .6a2.6 2.6 0 0 0 1.7-1.2 2.1 2.1 0 0 0 .1-1.2c0-.1-.2-.2-.4-.3Z"/>';

export const icon = (name, cls = "") =>
  name === "whatsapp"
    ? `<svg class="ico ${cls}" viewBox="0 0 24 24" aria-hidden="true">${WA_PATH}</svg>`
    : `<svg class="ico ${name === "flecha" ? "ico-arrow" : ""} ${cls}" viewBox="0 0 24 24" aria-hidden="true">${P[name]}</svg>`;

/* ---------- Fotos ---------- */
const DIM = { camion: [2200, 3919], "carga-blanco": [2200, 1650], carga: [2200, 2933], carretera: [2200, 1650], electrolinera: [2200, 1650], "estacion-noche": [2200, 1238], flota: [2200, 1181], "refineria-noche": [2200, 1478], "refineria-tarde": [2200, 2324], silos: [2200, 1466], subestacion: [2200, 1650], torres: [2200, 1468], "tranvia-scz": [2200, 1467] };
export const pic = (name, alt, { sizes = "100vw", lazy = true, attrs = "" } = {}) => {
  const [w, h] = DIM[name];
  return `<img src="/assets/foto/${name}-xl.webp" srcset="/assets/foto/${name}-md.webp 1100w, /assets/foto/${name}-xl.webp 2200w" sizes="${sizes}" alt="${alt}" width="${w}" height="${h}"${lazy ? ' loading="lazy" decoding="async"' : ' fetchpriority="high"'}${attrs ? " " + attrs : ""}>`;
};
export const lines = (...ls) => ls.map((l) => `<span class="ln"><span>${l}</span></span>`).join("");
export const words = (html) => html.replace(/(<[^>]+>)|([^\s<]+)/g, (m, tag, w) => (tag ? tag : `<span class="w">${w}</span>`));

/* ---------- Componentes ---------- */
export const TIPOS = ["Combustibles", "Importación", "Soluciones energéticas", "Electromovilidad", "Electrolineras", "Cargadores", "Conversión de vehículos", "Proyectos", "Otro"];

export const contactForm = (id = "f") => `
<form class="form" data-reveal data-contact novalidate aria-label="Formulario de consulta">
  <div class="hp" aria-hidden="true"><label>No completar <input name="web_empresa" tabindex="-1" autocomplete="off"></label></div>
  <div class="field"><label for="${id}-nombre">Nombre</label><input id="${id}-nombre" name="nombre" autocomplete="name" required><span class="err">Escribe tu nombre.</span></div>
  <div class="field"><label for="${id}-empresa">Empresa <span class="opt">(opcional)</span></label><input id="${id}-empresa" name="empresa" autocomplete="organization"></div>
  <div class="field"><label for="${id}-tel">Teléfono o WhatsApp</label><input id="${id}-tel" name="telefono" type="tel" inputmode="tel" autocomplete="tel" placeholder="+591 7…" required><span class="err">Escribe un número válido.</span></div>
  <div class="field"><label for="${id}-correo">Correo electrónico <span class="opt">(opcional)</span></label><input id="${id}-correo" name="correo" type="email" autocomplete="email"><span class="err">Revisa el correo.</span></div>
  <div class="field full"><label for="${id}-tipo">Tipo de consulta</label><select id="${id}-tipo" name="tipo" required><option value="">Elige una opción</option>${TIPOS.map((t) => `<option>${t}</option>`).join("")}</select><span class="err">Elige el tipo de consulta.</span></div>
  <div class="field full"><label for="${id}-msg">Mensaje</label><textarea id="${id}-msg" name="mensaje" rows="5" maxlength="1500" placeholder="Cuéntanos qué necesitas: tipo de operación, ubicación, plazos…" required></textarea><span class="err">Cuéntanos un poco más (al menos 10 caracteres).</span></div>
  <div class="form-foot full">
    <div class="btns">
      <button class="btn btn-wa btn-lg" type="submit" value="whatsapp">${icon("whatsapp")} Enviar consulta</button>
      <button class="btn btn-line btn-lg" type="submit" value="correo">${icon("mail")} Enviar por correo</button>
    </div>
    <p class="note">Al enviar se abre WhatsApp o tu correo con la consulta ya escrita. Usamos tus datos solo para responderte (<a href="/privacidad/">Política de privacidad</a>).</p>
    <p class="status" role="status" aria-live="polite"></p>
  </div>
</form>`;

export const contactData = () => `
<div class="card-data" data-reveal>
  <a href="${WA_URL}" target="_blank" rel="noopener"><span class="ci">${icon("whatsapp")}</span><span><small>WhatsApp</small><strong>${SITE.waDisplay}</strong></span></a>
  <a href="mailto:${SITE.mail}"><span class="ci">${icon("mail")}</span><span><small>Correo</small><strong>${SITE.mail}</strong></span></a>
  <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.addr1 + ", " + SITE.addr2)}" target="_blank" rel="noopener"><span class="ci">${icon("pin")}</span><span><small>Dirección</small><strong>${SITE.addr1}<br>${SITE.addr2}</strong></span></a>
</div>`;

export const cta = (title = "¿Necesitas una solución <span class=\"c\">energética</span>?", text = "Cuéntanos tu operación y te respondemos con una propuesta: combustibles, infraestructura energética o electromovilidad.", foto = "estacion-noche") => `
<section class="cta" aria-labelledby="cta-t">
  <div class="cta-media" data-speed="0.25">${pic(foto, "")}</div>
  <div class="wrap">
    <h2 id="cta-t" class="d2" data-reveal>${title}</h2>
    <p class="lead" data-reveal>${text}</p>
    <div class="btns" data-reveal>
      <a class="btn btn-cyan btn-lg" href="/contacto/#cotizar">Cotizar ahora ${icon("flecha")}</a>
      <a class="btn btn-wa btn-lg" href="${WA_URL}" target="_blank" rel="noopener">${icon("whatsapp")} Hablar con E.F.O.</a>
    </div>
  </div>
</section>`;

export const pageHero = ({ title, lead, foto, crumb }) => `
<section class="phero">
  <div class="phero-media">${pic(foto, "", { lazy: false })}</div>
  <div class="wrap">
    <nav class="crumbs" aria-label="Ruta"><a href="/">Inicio</a><span aria-hidden="true">/</span><span aria-current="page">${crumb}</span></nav>
    <h1 class="d1" data-lines>${title}</h1>
    <p class="lead">${lead}</p>
    <div class="btns">
      <a class="btn btn-cyan btn-lg" href="/contacto/#cotizar">Cotizar ahora ${icon("flecha")}</a>
      <a class="btn btn-line btn-lg" href="${WA_URL}" target="_blank" rel="noopener">${icon("whatsapp")} WhatsApp</a>
    </div>
  </div>
</section>`;

/* ---------- Documento ---------- */
export function layout({ path, title, desc, body, ld = [], noindex = false, light = false, ogImg = "/assets/img/compartir.jpg" }) {
  const canonical = SITE.url + path;
  const nav = NAV.map(([t, h]) => `<a href="${h}"${h === path ? ' aria-current="page"' : ""}>${t}</a>`).join("");
  const drawer = NAV.map(([t, h]) => `<a class="row" href="${h}"${h === path ? ' aria-current="page"' : ""}>${t}${icon("flecha")}</a>`).join("");
  return `<!DOCTYPE html>
<html lang="es-BO">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title}</title>
<meta name="description" content="${desc}">
${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${canonical}">`}
<meta name="theme-color" content="#063B66">
<meta property="og:type" content="website">
<meta property="og:locale" content="es_BO">
<meta property="og:site_name" content="${SITE.name}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${SITE.url}${ogImg}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/img/favicon-32.png">
<link rel="icon" type="image/png" sizes="192x192" href="/assets/img/favicon-192.png">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap">
<link rel="stylesheet" href="/assets/css/efo.css?v=4">
<script>document.documentElement.classList.add("js");setTimeout(function(){var r=document.documentElement;r.classList.add("ready");if(!window.__efo)r.classList.add("nogsap")},2600)</script>
<style>.nogsap [data-reveal]{opacity:1!important;transform:none!important}.nogsap .statement .w,.nogsap .scene-step{opacity:1!important}</style>
${ld.map((j) => `<script type="application/ld+json">${JSON.stringify(j)}</script>`).join("\n")}
</head>
<body${light ? ' class="page-light"' : ""}>
<a class="skip" href="#contenido">Saltar al contenido</a>
<div class="curtain" aria-hidden="true"><img src="/assets/img/logo-efo-claro.webp" alt="" width="720" height="169"></div>
<header class="top">
  <div class="wrap top-in">
    <a class="brand" href="/" aria-label="E.F.O. Ltda., ir al inicio"><img class="b-light" src="/assets/img/logo-efo-claro.webp" alt="E.F.O. Ltda. Energía y Fuerza del Oriente" width="720" height="169"><img class="b-dark" src="/assets/img/logo-efo.webp" alt="" width="720" height="169"></a>
    <nav class="nav" aria-label="Principal">${nav}</nav>
    <a class="btn btn-cyan" href="/contacto/#cotizar">Cotizar ahora</a>
    <button class="burger" type="button" aria-label="Abrir menú" aria-expanded="false" aria-controls="menu">${icon("menu", "m")}${icon("cerrar", "x")}</button>
  </div>
</header>
<nav class="drawer" id="menu" aria-label="Menú móvil">
  ${drawer}
  <div class="btns">
    <a class="btn btn-cyan btn-lg" href="/contacto/#cotizar">Cotizar ahora ${icon("flecha")}</a>
    <a class="btn btn-wa btn-lg" href="${WA_URL}" target="_blank" rel="noopener">${icon("whatsapp")} WhatsApp</a>
  </div>
</nav>
<main id="contenido">
${body}
</main>
<footer class="foot">
  <div class="wrap">
    <p class="foot-big" aria-hidden="true">Energía que mueve <span class="c">Bolivia</span></p>
    <div class="foot-grid">
      <div>
        <a class="brand-f" href="/" aria-label="E.F.O. Ltda., ir al inicio"><img src="/assets/img/logo-efo-claro.webp" alt="E.F.O. Ltda." width="720" height="169" loading="lazy"></a>
        <p class="foot-legal">${SITE.legal}</p>
      </div>
      <div>
        <h2>Sitio</h2>
        <nav aria-label="Pie de página">${NAV.map(([t, h]) => `<a href="${h}">${t}</a>`).join("")}</nav>
      </div>
      <div>
        <h2>Contacto</h2>
        <address>
          <a href="${WA_URL}" target="_blank" rel="noopener">${icon("whatsapp")}${SITE.waDisplay}</a>
          <a href="mailto:${SITE.mail}">${icon("mail")}${SITE.mail}</a>
          <span>${icon("pin")}${SITE.addr1}, ${SITE.addr2}</span>
        </address>
      </div>
    </div>
  </div>
  <div class="wrap foot-bottom">
    <span>© <span data-year>2026</span> E.F.O. Ltda. Todos los derechos reservados.</span>
    <span>Fotografías y videos: <a href="https://www.pexels.com" target="_blank" rel="noopener">Pexels</a> · <a href="/privacidad/">Política de privacidad</a></span>
    <span class="made">Sitio web creado por <a href="https://sibnova.com.bo" target="_blank" rel="noopener">SIBNOVA LTDA.</a> · <a href="https://sibnova.com.bo" target="_blank" rel="noopener">sibnova.com.bo</a></span>
  </div>
</footer>
<button class="music" type="button" aria-label="Música: Patria Inmortal" aria-expanded="false" aria-controls="player">${icon("musica")}</button>
<div class="player" id="player" role="dialog" aria-label="Música de fondo" hidden>
  <div class="player-head"><span><b>Patria Inmortal</b><small>Salomé Rock Band · 1 minuto</small></span><button class="player-x" type="button" aria-label="Cerrar música">${icon("cerrar")}</button></div>
  <div class="player-frame" data-yt="hbCTWzxubbU"></div>
  <a class="player-link" href="https://youtu.be/hbCTWzxubbU?si=-p4NW8wQTXVIAHj-" target="_blank" rel="noopener">Abrir en YouTube ${icon("flecha")}</a>
</div>
<a class="wa" href="${WA_URL}" target="_blank" rel="noopener" aria-label="Escribir a E.F.O. por WhatsApp">${icon("whatsapp")}</a>
<script src="/assets/vendor/gsap.min.js" defer></script>
<script src="/assets/vendor/ScrollTrigger.min.js" defer></script>
<script src="/assets/vendor/lenis.min.js" defer></script>
<script src="/assets/js/efo.js?v=4" defer></script>
<script>document.querySelectorAll("[data-year]").forEach(function(e){e.textContent=new Date().getFullYear()})</script>
</body>
</html>
`;
}
