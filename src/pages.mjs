// Contenido de cada página del sitio E.F.O. Textos del documento maestro; sin cifras, clientes ni países no confirmados.
// Fotografías y videos: Pexels (licencia libre). Mapas generados con geografía real (Natural Earth).
import { readFileSync } from "node:fs";
import { SITE, WA_URL, icon, pic, lines, words, contactForm, contactData, cta, pageHero } from "./layout.mjs";

const svg = (f) => readFileSync(new URL(`../public_html/assets/img/${f}`, import.meta.url), "utf8").replace(/<\?xml[^>]*>/, "");
const MUNDO = svg("mundo-bolivia.svg");
const BOLIVIA = svg("bolivia-red.svg");

/* ---------- Bloques compartidos ---------- */
const AREAS = [
  { t: "Combustibles", d: "Importación y comercialización de combustibles para empresas, industria y transporte.", ic: "gota", f: "refineria-tarde", href: "/combustibles/" },
  { t: "Energía", d: "Infraestructura y suministro energético para operaciones que no pueden detenerse.", ic: "rayo", f: "torres", href: "/soluciones-energeticas/" },
  { t: "Industria", d: "Soluciones energéticas para plantas, agroindustria y sectores productivos.", ic: "fabrica", f: "silos", href: "/soluciones-energeticas/#industria" },
  { t: "Electromovilidad", d: "Electrolineras, cargadores AC y DC, carga para flotas y conversión de vehículos.", ic: "cargador", f: "carga", href: "/electromovilidad/", ev: true },
];
const areas = () => `
<section class="areas" aria-labelledby="areas-t">
  <div class="wrap areas-head">
    <div class="head head-split">
      <h2 id="areas-t" class="d2" data-lines>${lines("Cuatro áreas,", "<span class=\"c\" style=\"color:var(--cyan-soft)\">una sola energía</span>")}</h2>
      <p class="lead" data-reveal style="color:rgba(255,255,255,.82)">Combustibles, energía, industria y electromovilidad, integrados en una misma empresa boliviana.</p>
    </div>
  </div>
  <div class="areas-track">
    ${AREAS.map((a) => `<a class="panel${a.ev ? " ev" : ""}" href="${a.href}">
      <div class="panel-media">${pic(a.f, "", { sizes: "(min-width: 1024px) 75vw, 100vw" })}</div>
      <div class="panel-in">
        ${icon(a.ic, "ico-area")}
        <h3>${a.t}</h3>
        <p>${a.d}</p>
        <span class="more">Conocer más ${icon("flecha")}</span>
      </div>
    </a>`).join("\n    ")}
  </div>
</section>`;

const cadena = () => `
<ol class="chain">
  <li data-reveal>${icon("barco")}<b>Importación</b><span>Mercados internacionales hacia Bolivia.</span></li>
  <li data-reveal>${icon("camion")}<b>Logística</b><span>Transporte y distribución.</span></li>
  <li data-reveal>${icon("maletin")}<b>Comercialización</b><span>Atención a empresas y consumidores.</span></li>
  <li data-reveal>${icon("fabrica")}<b>Industria</b><span>El combustible como elemento fundamental para la producción y el transporte.</span></li>
</ol>`;

const buque = (title = lines("Del mundo", "a <span class=\"c\" style=\"color:var(--cyan-soft)\">Bolivia</span>"), text = "Importación y comercialización de combustibles, conectando mercados, logística e infraestructura para atender las necesidades energéticas del país.") => `
<section class="reveal-media" aria-labelledby="bq-t">
  <div class="rm-frame">
    <video data-src="/assets/video/buque-720.mp4" data-webm="/assets/video/buque-720.webm" poster="/assets/video/buque-poster.webp" muted loop playsinline preload="none" aria-hidden="true"></video>
  </div>
  <div class="wrap">
    <h2 id="bq-t" class="d1" data-lines>${title}</h2>
    <p class="lead" style="color:rgba(255,255,255,.92)" data-reveal>${text}</p>
    <a class="btn btn-cyan btn-lg" href="/combustibles/" data-reveal>Ver combustibles ${icon("flecha")}</a>
  </div>
</section>`;

const mapa = () => `
<section class="sec blue" aria-labelledby="mapa-t">
  <div class="wrap">
    <div class="head head-split">
      <h2 id="mapa-t" class="d2" data-lines>${lines("Conectamos mercados", "<span class=\"c\">con Bolivia</span>")}</h2>
      <p class="lead" data-reveal>Mercados internacionales, logística y abastecimiento al servicio de la industria, el transporte y el desarrollo del país.</p>
    </div>
    <figure class="worldmap" data-reveal>${MUNDO}</figure>
    <ol class="flow" data-reveal>
      <li><b>${icon("globo")}Mercados internacionales</b><span>Abastecimiento desde el exterior</span></li>
      <li><b>${icon("bandera")}Bolivia</b><span>Llegada al país</span></li>
      <li><b>${icon("pin")}Santa Cruz</b><span>Eje logístico del Oriente</span></li>
      <li><b>${icon("fabrica")}Industria y transporte</b><span>Energía para producir y mover</span></li>
    </ol>
    <p class="note">Rutas ilustrativas: el mapa no indica países de origen.</p>
  </div>
</section>`;

const EV = [
  ["casa", "Carga doméstica", "Soluciones para cargar vehículos eléctricos en el hogar, adaptadas a la instalación eléctrica existente.", "carga-blanco", "Vehículo eléctrico conectado a su cargador"],
  ["edificio", "Carga empresarial", "Infraestructura de carga para empresas y establecimientos: empleados, clientes y vehículos de la empresa.", "electrolinera", "Estacionamiento con cargadores y techo solar"],
  ["cargador", "Electrolineras", "Diseño e implementación de puntos de carga con cargadores AC y DC.", "carga", "Conector de carga eléctrica enchufado a un vehículo"],
  ["flota", "Flotas eléctricas", "Carga centralizada y gestión para empresas que operan múltiples vehículos.", "flota", "Flota de camiones estacionados vista desde arriba"],
];
const escena = () => `
<section class="sec" aria-labelledby="ev-t">
  <div class="wrap">
    <div class="head head-split">
      <h2 id="ev-t" class="d2" data-lines>${lines("La energía del futuro", "ya está en <span class=\"g\">movimiento</span>")}</h2>
      <p class="lead" data-reveal>Soluciones de electromovilidad adaptadas a las necesidades de hogares, empresas, industrias y flotas.</p>
    </div>
    <div class="scene">
      <div class="scene-media" aria-hidden="true">
        ${EV.map(([, , , f], i) => pic(f, "", { sizes: "(min-width: 1024px) 50vw, 100vw", attrs: i === 0 ? 'class="on"' : "" })).join("\n        ")}
      </div>
      <div class="scene-steps">
        ${EV.map(([ic, t, d, f, alt], i) => `<article class="scene-step${i === 0 ? " on" : ""}">
          <div class="mini">${pic(f, alt, { sizes: "100vw" })}</div>
          ${icon(ic)}
          <h3>${t}</h3>
          <p>${d}</p>
        </article>`).join("\n        ")}
      </div>
    </div>
  </div>
</section>`;

const conversion = () => `
<section class="sec mist" aria-labelledby="conv-t">
  <div class="wrap feature">
    <figure class="photo tall" data-reveal>
      <div class="par coaster" data-speed="0.18">${pic("coaster", "Bus Toyota Coaster de tercera generación, como el modelo 2005", { sizes: "(min-width: 980px) 55vw, 100vw" })}</div>
      <figcaption class="credit">Foto: Dinkun Chen · <a href="https://commons.wikimedia.org/wiki/File:TOYOTA_COASTER_(B40_B50)_China_(7).jpg" target="_blank" rel="noopener">CC BY-SA 4.0</a></figcaption>
      <div class="float-card">
        <span class="stamp">Proyecto conceptual</span>
        <b>Toyota Coaster 2005</b>
        <dl><dt>Capacidad</dt><dd>30 pasajeros</dd><dt>Solución</dt><dd>Conversión a propulsión eléctrica</dd></dl>
      </div>
    </figure>
    <div class="copy">
      <h2 id="conv-t" class="d2" data-lines>${lines("Transformamos vehículos", "de combustión en", "<span class=\"g\">eléctricos</span>")}</h2>
      <p class="lead" data-reveal>E.F.O. desarrolla proyectos de conversión de vehículos de combustión interna a propulsión eléctrica, evaluando las características del vehículo, uso, autonomía y necesidades operativas.</p>
      <ul class="spec" data-reveal>
        <li>${icon("ajustes")}<span><b>Características del vehículo</b><span>Estado, chasis, peso y espacio disponible.</span></span></li>
        <li>${icon("ruta")}<span><b>Uso</b><span>Recorridos, horarios y tipo de servicio.</span></span></li>
        <li>${icon("bateria")}<span><b>Autonomía</b><span>Distancia que necesita recorrer entre cargas.</span></span></li>
        <li>${icon("engranaje")}<span><b>Necesidades operativas</b><span>Carga, mantenimiento y continuidad del servicio.</span></span></li>
      </ul>
      <div class="chips" data-reveal><span>Automóviles</span><span>Vehículos comerciales</span><span>Buses</span><span>Flotas empresariales</span></div>
      <a class="btn btn-cyan btn-lg" href="/contacto/?tipo=Conversi%C3%B3n%20de%20veh%C3%ADculos#cotizar" data-reveal>Evaluar mi vehículo ${icon("flecha")}</a>
    </div>
  </div>
</section>`;

const par = (f, alt, sp, sizes) => `<div class="par" style="position:absolute;inset:-10% 0" data-speed="${sp}">${pic(f, alt, { sizes })}</div>`;
const oriente = () => `
<section class="sec blue" aria-labelledby="ori-t">
  <div class="wrap">
    <div class="oriente">
      <figure class="bomap" data-reveal>${BOLIVIA}</figure>
      <div class="copy">
        <h2 id="ori-t" class="d2" data-lines>${lines("Desde el Oriente", "para <span class=\"c\">todo Bolivia</span>")}</h2>
        <p class="lead" data-reveal>Desde Santa Cruz de la Sierra, uno de los principales centros productivos, industriales y logísticos de Bolivia, E.F.O. proyecta soluciones energéticas orientadas al crecimiento de empresas y sectores productivos en todo el país.</p>
        <a class="btn btn-line btn-lg" href="/empresa/" data-reveal>Conocer la empresa ${icon("flecha")}</a>
      </div>
    </div>
    <div class="depth">
      <figure class="d-a" data-reveal>${par("tranvia-scz", "Estación de tranvía moderna en Santa Cruz de la Sierra", 0.12, "(min-width: 760px) 58vw, 50vw")}<figcaption>Santa Cruz de la Sierra</figcaption></figure>
      <figure class="d-b" data-reveal>${par("silos", "Silos agroindustriales junto a campos de cultivo", 0.3, "(min-width: 760px) 42vw, 50vw")}<figcaption>Agroindustria</figcaption></figure>
      <figure class="d-c" data-reveal>${par("carretera", "Camión en una carretera entre bosques, vista aérea", 0.22, "(min-width: 760px) 34vw, 50vw")}<figcaption>Transporte y logística</figcaption></figure>
      <figure class="d-d" data-reveal>${par("refineria-noche", "Planta industrial iluminada de noche", 0.1, "(min-width: 760px) 50vw, 50vw")}<figcaption>Industria</figcaption></figure>
    </div>
  </div>
</section>`;

const OPS = [
  ["casa", "Hogares", "Carga de vehículos eléctricos."],
  ["edificio", "Empresas", "Puntos de carga para empleados y clientes."],
  ["fabrica", "Industrias", "Infraestructura energética y electromovilidad."],
  ["tienda", "Centros comerciales", "Cargadores para clientes."],
  ["hotel", "Hoteles", "Servicios de carga para huéspedes."],
  ["flota", "Flotas", "Carga centralizada de vehículos."],
  ["bus", "Transporte", "Soluciones para buses y vehículos comerciales."],
  ["institucion", "Instituciones", "Infraestructura energética y movilidad eléctrica."],
];
const operaciones = (cls = "") => `
<section class="sec ${cls}" aria-labelledby="ops-t">
  <div class="wrap">
    <div class="head head-split">
      <h2 id="ops-t" class="d2" data-lines>${lines("Energía pensada", "para cada operación")}</h2>
      <p class="lead" data-reveal>Desde una casa hasta una flota o una institución: cada operación necesita una solución distinta.</p>
    </div>
    <ul class="ops">
      ${OPS.map(([ic, t, d]) => `<li data-reveal>${icon(ic)}<b>${t}</b><span>${d}</span></li>`).join("\n      ")}
    </ul>
  </div>
</section>`;

const PROYECTOS = [
  { n: "Surtidor BIOTIL Srl", s: "Combustibles", t: "Punto de venta de combustibles líquidos", d: "Municipio de San Julián, departamento de Santa Cruz. Capacidad de 100.000 litros al mes.", f: "biotil-render", ub: "San Julián, Santa Cruz", st: "Proyecto en desarrollo", href: "/proyectos/#biotil" },
  { n: "Electrolinera para carga rápida", s: "Electromovilidad", t: "Electrolinera con cargadores AC y DC", d: "Diseño e implementación de un punto de carga para vehículos eléctricos de clientes, empresas y flotas.", f: "electrolinera" },
  { n: "Conversión de un Toyota Coaster 2005", s: "Transporte de pasajeros", t: "Conversión de combustión a eléctrico", d: "Bus de 30 pasajeros: evaluación del vehículo, su uso diario, la autonomía necesaria y la operación para pasarlo a propulsión eléctrica.", f: "coaster" },
  { n: "Infraestructura energética para industria", s: "Industria", t: "Infraestructura y suministro eléctrico", d: "Soluciones de infraestructura y suministro energético adaptadas a la operación de empresas e industrias.", f: "subestacion" },
  { n: "Carga centralizada para flotas", s: "Flotas empresariales", t: "Sistema de carga y gestión", d: "Sistema de carga y gestión para empresas que operan múltiples vehículos eléctricos.", f: "flota" },
];
const proyectos = () => `
<div class="projects">
  ${PROYECTOS.map((p) => `<article class="proj${p.st ? " proj-dev" : ""}" data-reveal>
    <div class="ph">${pic(p.f, "", { sizes: "(min-width: 1100px) 25vw, (min-width: 600px) 50vw, 100vw" })}<span class="stamp${p.st ? " dev" : ""}">${p.st || "Proyecto conceptual"}</span></div>
    <div class="proj-in">
      <b>${p.n}</b>
      <p>${p.d}</p>
      <dl><dt>Sector</dt><dd>${p.s}</dd><dt>Ubicación</dt><dd>${p.ub || "Bolivia"}</dd><dt>Solución</dt><dd>${p.t}</dd><dt>Estado</dt><dd>${p.st || "Proyecto conceptual"}</dd></dl>
      ${p.href ? `<a class="proj-more" href="${p.href}">Ver proyecto ${icon("flecha")}</a>` : ""}
    </div>
  </article>`).join("\n  ")}
</div>`;

const porque = () => `
<section class="sec dark" aria-labelledby="pq-t">
  <div class="wrap">
    <div class="head"><h2 id="pq-t" class="d2" data-lines>${lines("¿Por qué <span class=\"c\">E.F.O.</span>?")}</h2></div>
    <ul class="why">
      <li data-reveal>${icon("rayo")}<b>Visión energética</b><p>Integramos diferentes soluciones relacionadas con la energía.</p></li>
      <li data-reveal>${icon("maletin")}<b>Visión empresarial</b><p>Entendemos las necesidades operativas de las empresas.</p></li>
      <li data-reveal>${icon("idea")}<b>Innovación</b><p>Incorporamos nuevas tecnologías y soluciones de movilidad.</p></li>
      <li data-reveal>${icon("bandera")}<b>Visión nacional</b><p>Desde Santa Cruz proyectamos soluciones para Bolivia.</p></li>
    </ul>
  </div>
</section>`;

const contacto = (id) => `
<section class="sec mist" id="cotizar" aria-labelledby="${id}-t">
  <div class="wrap contact">
    <div class="copy" style="align-content:start">
      <h2 id="${id}-t" class="d2" data-lines>${lines("Hablemos de", "tu <span class=\"c\">proyecto</span>")}</h2>
      <p class="lead" data-reveal>Escríbenos y te respondemos personalmente. Para una cotización, cuéntanos tu operación, ubicación y plazos.</p>
      ${contactData()}
    </div>
    ${contactForm(id)}
  </div>
</section>`;

/* ---------- Datos estructurados ---------- */
const ORG = {
  "@context": "https://schema.org", "@type": "Organization", name: SITE.legal, alternateName: SITE.name, url: SITE.url,
  logo: `${SITE.url}/assets/img/logo-efo.webp`, slogan: "Energía que mueve Bolivia", email: SITE.mail, telephone: "+59169540072", taxID: SITE.nit,
  address: { "@type": "PostalAddress", streetAddress: SITE.addr1, addressLocality: "Santa Cruz de la Sierra", addressCountry: "BO" },
  areaServed: { "@type": "Country", name: "Bolivia" },
  knowsAbout: ["Combustibles", "Soluciones energéticas", "Electromovilidad", "Electrolineras", "Conversión de vehículos eléctricos"],
};
const LOCAL = { ...ORG, "@type": "LocalBusiness", image: `${SITE.url}/assets/img/compartir.jpg` };
const crumbsLd = (name, path) => ({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Inicio", item: SITE.url + "/" }, { "@type": "ListItem", position: 2, name, item: SITE.url + path }] });

/* ---------- Páginas ---------- */
export const PAGES = [
  {
    path: "/", file: "index.html",
    title: "E.F.O. Ltda. · Energía y combustibles en Bolivia",
    desc: "E.F.O. Ltda. desarrolla soluciones energéticas, comercialización de combustibles, infraestructura eléctrica y proyectos de electromovilidad en Bolivia.",
    ld: [ORG],
    body: `
<section class="hero" aria-labelledby="hero-t">
  <div class="hero-media">
    <video data-src="/assets/video/plaza-720.mp4" data-webm="/assets/video/plaza-720.webm" poster="/assets/video/plaza-poster.webp" muted loop playsinline autoplay preload="none" aria-hidden="true"></video>
  </div>
  <div class="wrap hero-in">
    <h1 id="hero-t" class="d1" data-lines>${lines("Energía", "que mueve", "<span style=\"color:var(--cyan-soft)\">Bolivia</span>")}</h1>
    <div class="hero-foot">
      <div style="display:grid;gap:24px">
        <p class="lead">E.F.O. desarrolla soluciones energéticas, comercialización de combustibles y proyectos de electromovilidad para empresas, industrias y organizaciones en Bolivia.</p>
        <div class="btns on-photo">
          <a class="btn btn-cyan btn-lg" href="/contacto/#cotizar">Cotizar ahora ${icon("flecha")}</a>
          <a class="btn btn-line btn-lg" href="/empresa/">Conoce E.F.O.</a>
        </div>
      </div>
      <span class="cue"><i></i>Desliza · Plaza 24 de Septiembre, Santa Cruz</span>
    </div>
  </div>
</section>

<section class="statement" aria-labelledby="st-t">
  <div class="wrap">
    <h2 id="st-t" class="sr-only">Quiénes somos</h2>
    <p class="big" data-words>${words("E.F.O. es una <em class=\"hl\">empresa energética boliviana</em> que desarrolla soluciones de combustibles, energía, infraestructura y electromovilidad para empresas, industrias y organizaciones.")}</p>
    <ul class="pillars">
      <li data-reveal>${icon("gota")}<b>Combustibles</b><span>Importación y comercialización.</span></li>
      <li data-reveal>${icon("rayo")}<b>Energía</b><span>Infraestructura y suministro.</span></li>
      <li data-reveal>${icon("fabrica")}<b>Industria</b><span>Soluciones para operaciones productivas.</span></li>
      <li data-reveal>${icon("cargador")}<b>Electromovilidad</b><span>Carga y conversión eléctrica.</span></li>
    </ul>
    <div class="btns" style="margin-top:40px" data-reveal><a class="btn btn-line btn-lg" href="/empresa/">Conocer la empresa ${icon("flecha")}</a></div>
  </div>
</section>

${areas()}

${buque()}

<section class="sec" aria-label="Cadena del combustible">
  <div class="wrap">
    <div class="head head-split">
      <h2 class="d2" data-lines>${lines("Combustibles para", "mover <span class=\"c\">la economía</span>")}</h2>
      <p class="lead" data-reveal>E.F.O. desarrolla actividades relacionadas con la importación y comercialización de combustibles, conectando mercados, logística e infraestructura.</p>
    </div>
    ${cadena()}
  </div>
</section>

${mapa()}

${escena()}

${conversion()}

${oriente()}

${operaciones()}

<section class="sec mist" aria-labelledby="pr-t">
  <div class="wrap">
    <div class="head head-split">
      <h2 id="pr-t" class="d2" data-lines>${lines("Proyectos que transforman", "energía en <span class=\"c\">soluciones</span>")}</h2>
      <p class="lead" data-reveal>Soluciones que E.F.O. propone y desarrolla. Cada proyecto indica su estado.</p>
    </div>
    ${proyectos()}
    <p class="note">Las fotografías son referenciales y no corresponden a instalaciones de E.F.O.</p>
    <div class="btns" style="margin-top:32px" data-reveal><a class="btn btn-line btn-lg" href="/proyectos/">Ver proyectos ${icon("flecha")}</a></div>
  </div>
</section>

${cta()}

${contacto("home")}`,
  },

  {
    path: "/empresa/", file: "empresa/index.html",
    title: "Empresa | E.F.O. – Energía y Fuerza del Oriente",
    desc: "E.F.O. Ltda. es una empresa energética boliviana de Santa Cruz de la Sierra: combustibles, soluciones energéticas, infraestructura y electromovilidad.",
    ld: [ORG, crumbsLd("Empresa", "/empresa/")],
    body: `
${pageHero({ title: lines("Energía y Fuerza", "del <span class=\"c\">Oriente</span>"), lead: "Somos una empresa boliviana orientada al desarrollo de soluciones energéticas, combustibles, infraestructura y electromovilidad.", foto: "tranvia-scz", crumb: "Empresa" })}

<section class="statement" aria-label="Nuestra propuesta">
  <div class="wrap">
    <p class="big" data-words>${words("Nuestra propuesta integra las necesidades actuales del mercado energético con <em class=\"hl\">nuevas tecnologías</em> que permiten a empresas y organizaciones avanzar hacia soluciones más eficientes y sostenibles.")}</p>
  </div>
</section>

<section class="sec-tight mist" aria-label="Visión y misión">
  <div class="wrap mv">
    <div data-reveal><h3>Nuestra visión</h3><p>Ser una empresa energética boliviana reconocida por desarrollar soluciones confiables, innovadoras y orientadas al crecimiento productivo del país.</p></div>
    <div data-reveal><h3>Nuestra misión</h3><p>Proporcionar soluciones energéticas y tecnológicas que respondan a las necesidades de nuestros clientes, contribuyendo al desarrollo de Bolivia.</p></div>
  </div>
</section>

${areas()}

${porque()}

${oriente()}

${cta()}`,
  },

  {
    path: "/combustibles/", file: "combustibles/index.html",
    title: "Importación de combustibles en Bolivia | E.F.O.",
    desc: "Importación, comercialización y logística de combustibles para empresas, industrias, transporte y sectores productivos de Bolivia.",
    ld: [ORG, crumbsLd("Combustibles", "/combustibles/")],
    body: `
${pageHero({ title: lines("Combustibles", "para mover", "<span class=\"c\">la economía</span>"), lead: "Importación y comercialización de combustibles, conectando mercados, logística e infraestructura para atender las necesidades energéticas de Bolivia.", foto: "refineria-tarde", crumb: "Combustibles" })}

<section class="sec" aria-labelledby="cb-t">
  <div class="wrap">
    <div class="head"><h2 id="cb-t" class="d2" data-lines>${lines("Lo que hacemos", "en combustibles")}</h2></div>
    <ul class="rows">
      <li data-reveal><span class="ri">${icon("barco")}</span><h3>Importación de combustibles</h3><p>Abastecimiento desde mercados internacionales para atender la demanda energética del país.</p></li>
      <li data-reveal><span class="ri">${icon("maletin")}</span><h3>Comercialización</h3><p>Atención a empresas y consumidores que necesitan un suministro confiable.</p></li>
      <li data-reveal><span class="ri">${icon("camion")}</span><h3>Logística</h3><p>Transporte y distribución para que el combustible llegue a donde se necesita.</p></li>
      <li data-reveal><span class="ri">${icon("edificio")}</span><h3>Atención empresarial</h3><p>Propuestas a la medida de cada empresa, según su consumo y su operación.</p></li>
      <li data-reveal><span class="ri">${icon("fabrica")}</span><h3>Soluciones para sectores productivos</h3><p>Industria, agroindustria, construcción y transporte: el combustible como elemento fundamental para producir y mover el país.</p></li>
    </ul>
  </div>
</section>

${buque(undefined, "Un buque tanquero en la terminal: el inicio de la cadena que lleva la energía hasta la industria y el transporte.")}

<section class="sec" aria-label="Cadena del combustible">
  <div class="wrap">${cadena()}</div>
</section>

${mapa()}

${cta("¿Tu operación necesita <span class=\"c\">combustible</span>?", "Cuéntanos tu consumo, ubicación y frecuencia, y te enviamos una propuesta.", "refineria-noche")}`,
  },

  {
    path: "/soluciones-energeticas/", file: "soluciones-energeticas/index.html",
    title: "Soluciones energéticas para empresas e industrias | E.F.O.",
    desc: "Infraestructura energética, soluciones eléctricas, integración de sistemas y proyectos especiales para empresas, industrias e instituciones en Bolivia.",
    ld: [ORG, crumbsLd("Soluciones energéticas", "/soluciones-energeticas/")],
    body: `
${pageHero({ title: lines("Soluciones", "<span class=\"c\">energéticas</span>"), lead: "E.F.O. no se limita a combustibles ni a electromovilidad: desarrolla infraestructura y soluciones energéticas para empresas, industrias e instituciones.", foto: "subestacion", crumb: "Soluciones energéticas" })}

<section class="sec" aria-labelledby="se-t">
  <div class="wrap">
    <div class="head head-split">
      <h2 id="se-t" class="d2" data-lines>${lines("Infraestructura y energía", "para <span class=\"c\">operar</span>")}</h2>
      <p class="lead" data-reveal>Cada proyecto parte de la operación del cliente: qué energía necesita, dónde y cómo crecerá.</p>
    </div>
    <ul class="rows">
      <li data-reveal><span class="ri">${icon("torre")}</span><h3>Infraestructura energética</h3><p>Soluciones de infraestructura y suministro energético para empresas e industrias.</p></li>
      <li data-reveal><span class="ri">${icon("rayo")}</span><h3>Soluciones eléctricas</h3><p>Instalaciones y soluciones eléctricas adaptadas a cada operación.</p></li>
      <li data-reveal><span class="ri">${icon("maletin")}</span><h3>Proyectos empresariales</h3><p>Proyectos energéticos pensados para el crecimiento de empresas y organizaciones.</p></li>
      <li data-reveal id="industria"><span class="ri">${icon("fabrica")}</span><h3>Infraestructura para industrias</h3><p>Energía para plantas, agroindustria y operaciones productivas.</p></li>
      <li data-reveal><span class="ri">${icon("red")}</span><h3>Integración de sistemas energéticos</h3><p>Combustibles, electricidad y carga eléctrica trabajando como un solo sistema.</p></li>
      <li data-reveal><span class="ri">${icon("idea")}</span><h3>Proyectos especiales</h3><p>Soluciones a la medida para necesidades que no encajan en un catálogo.</p></li>
    </ul>
  </div>
</section>

<section class="sec mist" aria-labelledby="socio-t">
  <div class="wrap feature rev">
    <figure class="photo tall" data-reveal><div class="par" data-speed="0.18">${pic("torres", "Torres de alta tensión al atardecer", { sizes: "(min-width: 980px) 55vw, 100vw" })}</div></figure>
    <div class="copy">
      <h2 id="socio-t" class="d2" data-lines>${lines("Un solo socio", "para <span class=\"c\">toda la energía</span>")}</h2>
      <p class="lead" data-reveal>Combustibles, infraestructura eléctrica y movilidad eléctrica bajo una misma empresa: menos proveedores y una visión de conjunto para tu operación.</p>
      <a class="btn btn-cyan btn-lg" href="/contacto/?tipo=Soluciones%20energ%C3%A9ticas#cotizar" data-reveal>Solicitar información ${icon("flecha")}</a>
    </div>
  </div>
</section>

${operaciones()}

${cta(undefined, undefined, "refineria-noche")}`,
  },

  {
    path: "/electromovilidad/", file: "electromovilidad/index.html",
    title: "Electrolineras y cargadores en Bolivia | E.F.O.",
    desc: "Electrolineras, cargadores AC y DC, carga doméstica, empresarial y para flotas, y conversión de vehículos de combustión a eléctricos en Bolivia.",
    ld: [ORG, crumbsLd("Electromovilidad", "/electromovilidad/")],
    body: `
${pageHero({ title: lines("La energía", "del futuro ya está", "en <span class=\"c\">movimiento</span>"), lead: "Soluciones de electromovilidad para hogares, empresas, industrias y flotas: carga, infraestructura y conversión de vehículos.", foto: "electrolinera", crumb: "Electromovilidad" })}

${escena()}

<section class="sec mist" aria-labelledby="eq-t">
  <div class="wrap">
    <div class="head"><h2 id="eq-t" class="d2" data-lines>${lines("Equipos e", "infraestructura")}</h2></div>
    <ul class="rows">
      <li data-reveal><span class="ri">${icon("cargador")}</span><h3>Electrolineras</h3><p>Diseño e implementación de puntos de carga para el público, empresas y flotas.</p></li>
      <li data-reveal><span class="ri">${icon("rayo")}</span><h3>Cargadores DC</h3><p>Carga rápida en corriente continua, pensada para electrolineras y vehículos que necesitan volver pronto a operar.</p></li>
      <li data-reveal><span class="ri">${icon("casa")}</span><h3>Cargadores AC</h3><p>Carga en corriente alterna para hogares, oficinas y estacionamientos donde el vehículo permanece varias horas.</p></li>
      <li data-reveal><span class="ri">${icon("edificio")}</span><h3>Carga empresarial</h3><p>Puntos de carga para empleados, clientes y vehículos de la empresa.</p></li>
      <li data-reveal><span class="ri">${icon("flota")}</span><h3>Carga para flotas</h3><p>Carga centralizada y gestión para múltiples vehículos.</p></li>
      <li data-reveal><span class="ri">${icon("torre")}</span><h3>Infraestructura eléctrica</h3><p>La infraestructura que la carga necesita para funcionar de forma segura.</p></li>
      <li data-reveal><span class="ri">${icon("red")}</span><h3>Proyectos de movilidad eléctrica</h3><p>Proyectos integrales para empresas, instituciones y transporte.</p></li>
    </ul>
  </div>
</section>

${conversion()}

${cta("¿Listo para la <span class=\"c\">carga eléctrica</span>?", "Cuéntanos dónde quieres cargar o qué vehículo quieres convertir, y te preparamos una propuesta.", "carga")}`,
  },

  {
    path: "/proyectos/", file: "proyectos/index.html",
    title: "Proyectos de energía y electromovilidad | E.F.O.",
    desc: "Electrolineras, conversión eléctrica de vehículos, infraestructura energética y carga para flotas: soluciones que E.F.O. propone y desarrolla en Bolivia.",
    ld: [ORG, crumbsLd("Proyectos", "/proyectos/")],
    body: `
${pageHero({ title: lines("Proyectos que", "transforman <span class=\"c\">energía</span>"), lead: "Electrolineras, conversión eléctrica, infraestructura energética y flotas. Cada proyecto indica su estado.", foto: "refineria-noche", crumb: "Proyectos" })}

<section class="sec mist" id="biotil" aria-labelledby="bio-t">
  <div class="wrap">
    <div class="bio">
      <div class="copy">
        <img class="bio-logo" src="/assets/img/biotil-logo.webp" alt="Logo de Surtidor BIOTIL Srl: Energía que impulsa tu camino" width="900" height="600" loading="lazy">
        <span class="stamp dev">Proyecto en desarrollo</span>
        <h2 id="bio-t" class="d2" data-lines>${lines("Punto de venta de", "combustibles <span class=\"c\">líquidos</span>")}</h2>
        <p class="lead" data-reveal>Estación de venta de combustibles líquidos para el Surtidor BIOTIL Srl, con tanques de almacenamiento, dispensador bajo cubierta metálica y áreas de ingreso, salida y estacionamiento temporal.</p>
        <dl class="bio-data" data-reveal>
          <dt>Proyecto</dt><dd>Punto de venta de combustibles líquidos para el Surtidor BIOTIL Srl</dd>
          <dt>Ubicación</dt><dd>Municipio de San Julián, departamento de Santa Cruz</dd>
          <dt>Capacidad</dt><dd>100.000 litros/mensual</dd>
          <dt>Propietario</dt><dd>Surtidor Biotil Srl</dd>
        </dl>
      </div>
      <div class="bio-gal">
        <figure class="bio-main" data-reveal>${pic("biotil-render", "Render del surtidor: cubierta metálica con dispensador, camión y maquinaria", { sizes: "(min-width: 980px) 55vw, 100vw" })}<figcaption>Render del proyecto</figcaption></figure>
        <a class="bio-thumb" href="/assets/foto/biotil-aerea-xl.webp" target="_blank" rel="noopener" data-reveal>${pic("biotil-aerea", "Vista aérea 3D del terreno con dispensador, tanques y vegetación", { sizes: "(min-width: 980px) 27vw, 50vw" })}<span>Vista aérea</span></a>
        <a class="bio-thumb plano" href="/assets/foto/biotil-plano-xl.webp" target="_blank" rel="noopener" data-reveal>${pic("biotil-plano", "Plano de planta baja del surtidor", { sizes: "(min-width: 980px) 27vw, 50vw" })}<span>Plano de planta (ampliar)</span></a>
      </div>
    </div>
  </div>
</section>

<section class="sec" aria-labelledby="pj-t">
  <div class="wrap">
    <div class="head head-split">
      <h2 id="pj-t" class="d2" data-lines>${lines("Soluciones", "en desarrollo")}</h2>
      <div data-reveal style="display:grid;gap:14px">
        <p class="lead">Mostramos con claridad en qué etapa está cada proyecto.</p>
        <p style="display:flex;flex-wrap:wrap;gap:10px"><span class="stamp">Proyecto conceptual</span><span class="stamp real">Proyecto ejecutado</span></p>
      </div>
    </div>
    ${proyectos()}
    <p class="note">Salvo el proyecto BIOTIL (render y plano del proyecto), las fotografías son referenciales y no corresponden a instalaciones de E.F.O.</p>
  </div>
</section>

${cta("¿Tienes un proyecto <span class=\"c\">energético</span>?", "Hablemos de la solución que necesita tu empresa.", "estacion-noche")}`,
  },

  {
    path: "/contacto/", file: "contacto/index.html",
    title: "Contacto y cotizaciones | E.F.O. Ltda.",
    desc: "Cotiza combustibles, energía o electromovilidad con E.F.O. WhatsApp +591 69540072 · Av. Montecristo 205, Santa Cruz de la Sierra.",
    ld: [LOCAL, crumbsLd("Contacto", "/contacto/")],
    body: `
${pageHero({ title: lines("Hablemos", "con <span class=\"c\">E.F.O.</span>"), lead: "Solicita información o una cotización. Te respondemos personalmente.", foto: "tranvia-scz", crumb: "Contacto" })}

${contacto("ct")}

<section class="sec-tight mist" style="padding-top:0" aria-label="Ubicación">
  <div class="wrap">
    <div class="mapframe" data-reveal><iframe title="Mapa: ${SITE.addr1}, ${SITE.addr2}" src="https://www.google.com/maps?q=${encodeURIComponent("Avenida Montecristo 205, Santa Cruz de la Sierra, Bolivia")}&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
    <p class="note">${SITE.addr1}, ${SITE.addr2}. <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.addr1 + ", " + SITE.addr2)}" target="_blank" rel="noopener">Abrir en Google Maps</a></p>
  </div>
</section>`,
  },

  {
    path: "/privacidad/", file: "privacidad/index.html", light: true,
    title: "Política de privacidad | E.F.O. Ltda.",
    desc: "Cómo E.F.O. Ltda. usa y protege los datos que envías por el formulario de consulta, WhatsApp o correo.",
    body: `
<section class="sec" style="padding-top:calc(var(--header) + 72px)">
  <div class="wrap legal">
    <h1 class="d2">Política de privacidad</h1>
    <p>Vigente desde octubre de 2026.</p>
    <h2>Responsable</h2>
    <p>${SITE.legal} (E.F.O.), NIT ${SITE.nit}, ${SITE.addr1}, ${SITE.addr2}. Contacto: <a href="mailto:${SITE.mail}">${SITE.mail}</a> o WhatsApp ${SITE.waDisplay}.</p>
    <h2>Qué datos recibimos</h2>
    <p>Los que nos envías: nombre, empresa, teléfono, correo, tipo de consulta y mensaje. El sitio no guarda estos datos: al enviar el formulario se abre WhatsApp o tu correo con la consulta escrita, y nos llega solo si tú la envías.</p>
    <h2>Para qué los usamos</h2>
    <ul><li>Responder tu consulta.</li><li>Preparar una propuesta o cotización si la pides.</li><li>Dar seguimiento a esa conversación.</li></ul>
    <p>No vendemos ni compartimos tus datos con terceros para publicidad.</p>
    <h2>Servicios de terceros</h2>
    <p>Los mensajes por WhatsApp pasan por los servicios de WhatsApp (Meta). La página de contacto muestra un mapa de Google Maps y en todas las páginas se carga un reproductor de YouTube (modo de privacidad mejorada) para la música de fondo. El sitio no usa cookies de publicidad ni herramientas de medición de visitas.</p>
    <h2>Tus derechos</h2>
    <p>Puedes pedirnos saber qué datos tenemos, corregirlos o eliminarlos, escribiendo a <a href="mailto:${SITE.mail}">${SITE.mail}</a>. Respondemos en un plazo máximo de 10 días hábiles.</p>
    <h2>Cambios</h2>
    <p>Si cambiamos esta política, publicaremos la nueva versión en esta página con su fecha.</p>
  </div>
</section>`,
  },

  {
    path: "/404", file: "404.html", noindex: true, light: true,
    title: "Página no encontrada | E.F.O. Ltda.",
    desc: "La página que buscas no existe.",
    body: `
<section class="nf">
  <div class="wrap" style="display:grid;gap:22px;justify-items:start">
    <p class="code" aria-hidden="true">404</p>
    <h1 class="d2">Esta página <span class="c">no existe</span></h1>
    <p class="lead">El enlace está mal escrito o la página se movió. Desde aquí puedes seguir:</p>
    <div class="btns">
      <a class="btn btn-cyan btn-lg" href="/">Volver al inicio ${icon("flecha")}</a>
      <a class="btn btn-wa btn-lg" href="${WA_URL}" target="_blank" rel="noopener">${icon("whatsapp")} Escribirnos</a>
    </div>
  </div>
</section>`,
  },
];
