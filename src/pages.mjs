// Contenido de cada página del sitio E.F.O. Textos del documento maestro; nada de cifras, clientes ni países no confirmados.
import { readFileSync } from "node:fs";
import { SITE, WA_URL, icon, pylon, contactForm, contactData, cta, pageHero } from "./layout.mjs";

const svg = (f) => readFileSync(new URL(`../public_html/assets/img/${f}`, import.meta.url), "utf8").replace(/<\?xml[^>]*>/, "");
const MUNDO = svg("mundo-bolivia.svg");
const BOLIVIA = svg("bolivia-red.svg");
const img = (f, alt, w, h, lazy = true) => `<img src="/assets/img/${f}.webp" alt="${alt}" width="${w}" height="${h}"${lazy ? ' loading="lazy" decoding="async"' : ""}>`;
const ILUS = "Imagen ilustrativa";

/* ---------- Bloques compartidos ---------- */
const PROYECTOS = [
  { nombre: "Electrolinera para carga rápida", sector: "Electromovilidad", ubic: "Bolivia", tipo: "Electrolinera con cargadores AC y DC", desc: "Diseño e implementación de un punto de carga para vehículos eléctricos de clientes, empresas y flotas.", f: "proyecto-electrolinera", w: 555, h: 415 },
  { nombre: "Conversión de un Toyota Coaster 2005", sector: "Transporte de pasajeros", ubic: "Bolivia", tipo: "Conversión de combustión a eléctrico", desc: "Bus de 30 pasajeros: evaluación del vehículo, su uso diario, la autonomía necesaria y la operación para pasarlo a propulsión eléctrica.", f: "proyecto-bus", w: 310, h: 380 },
  { nombre: "Infraestructura energética para industria", sector: "Industria", ubic: "Bolivia", tipo: "Infraestructura y suministro eléctrico", desc: "Soluciones de infraestructura y suministro energético adaptadas a la operación de empresas e industrias.", f: "proyecto-infraestructura", w: 450, h: 415 },
  { nombre: "Carga centralizada para flotas", sector: "Flotas empresariales", ubic: "Bolivia", tipo: "Sistema de carga y gestión", desc: "Sistema de carga y gestión para empresas que operan múltiples vehículos eléctricos.", f: "electromovilidad", w: 380, h: 700 },
];
const proyectos = (list = PROYECTOS) => `
<div class="projects">
  ${list.map((p) => `<article class="proj rv">
    <div class="ph">${img(p.f, `${ILUS}: ${p.nombre.toLowerCase()}`, p.w, p.h)}<span class="stamp">Proyecto conceptual</span></div>
    <div class="proj-in">
      <b>${p.nombre}</b>
      <p>${p.desc}</p>
      <dl><dt>Sector</dt><dd>${p.sector}</dd><dt>Ubicación</dt><dd>${p.ubic}</dd><dt>Solución</dt><dd>${p.tipo}</dd><dt>Estado</dt><dd>Proyecto conceptual</dd></dl>
    </div>
  </article>`).join("\n  ")}
</div>`;

const ejes = () => `
<div class="axes">
  <a class="axis rv" href="/combustibles/">
    ${img("combustibles", `${ILUS}: buque tanquero en un puerto`, 880, 380)}
    <div class="axis-in">
      <h3 class="d3">Energía y combustibles</h3>
      <p>Soluciones relacionadas con la comercialización, suministro e importación de combustibles y proyectos energéticos para diferentes sectores productivos.</p>
      <span class="btn btn-line">Ver soluciones ${icon("flecha")}</span>
    </div>
  </a>
  <a class="axis ev rv" href="/electromovilidad/">
    ${img("electromovilidad", `${ILUS}: vehículo eléctrico conectado a un cargador`, 380, 700)}
    <div class="axis-in">
      <h3 class="d3">Energía y electromovilidad</h3>
      <p>Infraestructura de carga eléctrica y soluciones de movilidad eléctrica para hogares, empresas, industrias y flotas.</p>
      <span class="btn btn-line">Conocer electromovilidad ${icon("flecha")}</span>
    </div>
  </a>
</div>`;

const cadena = () => `
<ol class="chain">
  <li class="rv">${icon("barco")}<b>Importación</b><span>Mercados internacionales hacia Bolivia.</span></li>
  <li class="rv">${icon("camion")}<b>Logística</b><span>Transporte y distribución.</span></li>
  <li class="rv">${icon("maletin")}<b>Comercialización</b><span>Atención a empresas y consumidores.</span></li>
  <li class="rv">${icon("fabrica")}<b>Industria</b><span>El combustible como elemento fundamental para la producción y el transporte.</span></li>
</ol>`;

const mapa = () => `
<section class="sec deep mapsec" aria-labelledby="mapa-t">
  <div class="wrap">
    <div class="head-split">
      <h2 id="mapa-t" class="d2 node">Conectamos mercados <span class="c">con Bolivia</span></h2>
      <p class="lead rv">Mercados internacionales, logística y abastecimiento al servicio de la industria, el transporte y el desarrollo del país.</p>
    </div>
    <figure class="worldmap rv" style="margin:0">${MUNDO}</figure>
    <ol class="flow">
      <li>${"<b>" + icon("globo") + "Mercados internacionales</b>"}<span>Abastecimiento desde el exterior</span></li>
      <li>${"<b>" + icon("bandera") + "Bolivia</b>"}<span>Llegada al país</span></li>
      <li>${"<b>" + icon("pin") + "Santa Cruz</b>"}<span>Eje logístico del Oriente</span></li>
      <li>${"<b>" + icon("fabrica") + "Industria y transporte</b>"}<span>Energía para producir y mover</span></li>
    </ol>
    <p class="note">Rutas ilustrativas: el mapa no indica países de origen.</p>
  </div>
</section>`;

const cargadores = () => `
<ul class="erows">
  ${[
    ["casa", "Carga doméstica", "Soluciones para cargar vehículos eléctricos en hogares."],
    ["edificio", "Carga empresarial", "Infraestructura para empresas y establecimientos."],
    ["cargador", "Electrolineras", "Diseño e implementación de puntos de carga."],
    ["flota", "Flotas eléctricas", "Soluciones para empresas con múltiples vehículos."],
  ].map(([ic, t, d]) => `<li class="rv"><a class="prow ev" href="/contacto/?tipo=Electromovilidad#cotizar"><span class="pi">${icon(ic)}</span><span><b>${t}</b><small>${d}</small></span>${icon("flecha")}</a></li>`).join("\n  ")}
</ul>`;

const conversion = (day = true) => `
<section class="sec ${day ? "day" : ""}" aria-labelledby="conv-t">
  <div class="wrap convert">
    <div style="display:grid;gap:22px;justify-items:start">
      <h2 id="conv-t" class="d2 node n-g">Transformamos vehículos de combustión en <span class="g">eléctricos</span></h2>
      <p class="lead rv">E.F.O. desarrolla proyectos de conversión de vehículos de combustión interna a propulsión eléctrica, evaluando las características del vehículo, uso, autonomía y necesidades operativas.</p>
      <ul class="spec rv" style="width:100%">
        <li>${icon("ajustes")}<span><b>Características del vehículo</b><span>Estado, chasis, peso y espacio disponible.</span></span></li>
        <li>${icon("ruta")}<span><b>Uso</b><span>Recorridos, horarios y tipo de servicio.</span></span></li>
        <li>${icon("bateria")}<span><b>Autonomía</b><span>Distancia que necesita recorrer entre cargas.</span></span></li>
        <li>${icon("engranaje")}<span><b>Necesidades operativas</b><span>Carga, mantenimiento y continuidad del servicio.</span></span></li>
      </ul>
      <div class="uses rv"><span>Automóviles</span><span>Vehículos comerciales</span><span>Buses</span><span>Flotas empresariales</span></div>
    </div>
    <article class="case rv">
      <figure class="photo" style="margin:0">${img("proyecto-bus", `${ILUS}: bus de pasajeros`, 310, 380)}<figcaption>${ILUS}</figcaption></figure>
      <div class="case-in">
        <span class="stamp">Proyecto conceptual</span>
        <b class="d3">Toyota Coaster 2005</b>
        <dl><dt>Capacidad</dt><dd>30 pasajeros</dd><dt>Aplicación</dt><dd>Transporte de pasajeros</dd><dt>Solución</dt><dd>Conversión a propulsión eléctrica</dd></dl>
        <a class="btn btn-cyan" href="/contacto/?tipo=Conversi%C3%B3n%20de%20veh%C3%ADculos#cotizar">Evaluar mi vehículo ${icon("flecha")}</a>
      </div>
    </article>
  </div>
</section>`;

const oriente = () => `
<section class="sec" aria-labelledby="ori-t">
  <div class="wrap">
    <div class="oriente">
      <figure class="bomap rv" style="margin:0">${BOLIVIA}</figure>
      <div style="display:grid;gap:22px;justify-items:start">
        <h2 id="ori-t" class="d2">Desde el Oriente para <span class="c">todo Bolivia</span></h2>
        <p class="lead rv">Desde Santa Cruz de la Sierra, uno de los principales centros productivos, industriales y logísticos de Bolivia, E.F.O. proyecta soluciones energéticas orientadas al crecimiento de empresas y sectores productivos en todo el país.</p>
        <a class="btn btn-line rv" href="/empresa/">Conocer la empresa ${icon("flecha")}</a>
      </div>
    </div>
    <ul class="strip" aria-label="Sectores productivos">
      <li>${img("industria", `${ILUS}: planta de silos industriales`, 790, 460)}<b>Industria</b></li>
      <li>${img("agroindustria", `${ILUS}: silos agroindustriales junto a un cultivo`, 735, 480)}<b>Agroindustria</b></li>
      <li>${img("transporte", `${ILUS}: camión de carga en carretera`, 450, 430)}<b>Transporte y logística</b></li>
      <li>${img("construccion", `${ILUS}: edificio en construcción con grúa`, 680, 465)}<b>Construcción</b></li>
      <li>${img("comercio", `${ILUS}: cargadores frente a un edificio comercial`, 800, 495)}<b>Empresas y comercio</b></li>
    </ul>
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
const operaciones = () => `
<section class="sec day" aria-labelledby="ops-t">
  <div class="wrap">
    <div class="head-split">
      <h2 id="ops-t" class="d2 node">Energía pensada para cada operación</h2>
      <p class="lead rv">Desde una casa hasta una flota o una institución: cada operación necesita una solución distinta.</p>
    </div>
    <ul class="ops rv">
      ${OPS.map(([ic, t, d]) => `<li><span class="oi">${icon(ic)}</span><span><b>${t}</b><span>${d}</span></span></li>`).join("\n      ")}
    </ul>
  </div>
</section>`;

const porque = () => `
<section class="sec deep" aria-labelledby="pq-t">
  <div class="wrap">
    <div class="head"><h2 id="pq-t" class="d2 node">¿Por qué <span class="c">E.F.O.</span>?</h2></div>
    <ul class="signs">
      <li class="sign rv">${icon("rayo")}<b>Visión energética</b><p>Integramos diferentes soluciones relacionadas con la energía.</p></li>
      <li class="sign rv">${icon("maletin")}<b>Visión empresarial</b><p>Entendemos las necesidades operativas de las empresas.</p></li>
      <li class="sign rv">${icon("idea")}<b>Innovación</b><p>Incorporamos nuevas tecnologías y soluciones de movilidad.</p></li>
      <li class="sign rv">${icon("bandera")}<b>Visión nacional</b><p>Desde Santa Cruz proyectamos soluciones para Bolivia.</p></li>
    </ul>
  </div>
</section>`;

const contacto = (id) => `
<section class="sec day" id="cotizar" aria-labelledby="${id}-t">
  <div class="wrap contact">
    <div style="display:grid;gap:22px;align-content:start">
      <h2 id="${id}-t" class="d2 node">Hablemos de tu <span class="b">proyecto</span></h2>
      <p class="lead">Escríbenos y te respondemos personalmente. Para una cotización, cuéntanos tu operación, ubicación y plazos.</p>
      ${contactData()}
    </div>
    ${contactForm(id)}
  </div>
</section>`;

/* ---------- Datos estructurados ---------- */
const ORG = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.legal,
  alternateName: SITE.name,
  url: SITE.url,
  logo: `${SITE.url}/assets/img/logo-efo.webp`,
  slogan: "Energía que mueve Bolivia",
  email: SITE.mail,
  telephone: "+59169540072",
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
    title: "E.F.O. Ltda. | Energía, Combustibles y Electromovilidad en Bolivia",
    desc: "E.F.O. Ltda. desarrolla soluciones energéticas, comercialización de combustibles, infraestructura eléctrica y proyectos de electromovilidad en Bolivia.",
    ld: [ORG],
    body: `
<section class="hero" aria-labelledby="hero-t">
  <picture class="hero-photo">
    <source media="(max-width: 1023px)" srcset="/assets/img/hero-movil.webp" width="700" height="605">
    <img src="/assets/img/hero.webp" alt="${ILUS}: camión cisterna en carretera y un vehículo eléctrico cargando al atardecer" width="1320" height="605" fetchpriority="high">
  </picture>
  <div class="wrap hero-grid">
    <div class="hero-copy">
      <h1 id="hero-t" class="d1">Energía que mueve <span class="c">Bolivia</span></h1>
      <p class="lead">E.F.O. desarrolla soluciones energéticas, comercialización de combustibles y proyectos de electromovilidad para empresas, industrias y organizaciones en Bolivia.</p>
      <div class="btns">
        <a class="btn btn-cyan btn-lg" href="/contacto/#cotizar">Cotizar ahora ${icon("flecha")}</a>
        <a class="btn btn-line btn-lg" href="/empresa/">Conoce E.F.O.</a>
      </div>
      <p class="hero-note">${ILUS}</p>
    </div>
    <div>${pylon()}</div>
  </div>
</section>

<section class="sec day" aria-labelledby="qs-t">
  <div class="wrap about">
    <div class="about-copy">
      <h2 id="qs-t" class="d2 node">Una empresa energética con visión de futuro</h2>
      <p class="answer rv">E.F.O. es una <em>empresa energética boliviana</em> que desarrolla soluciones de combustibles, energía, infraestructura y electromovilidad.</p>
      <p class="lead rv">E.F.O. Ltda. – Energía y Fuerza del Oriente es una empresa boliviana orientada al desarrollo de soluciones relacionadas con energía, combustibles, infraestructura y electromovilidad.</p>
      <p class="lead rv">Nuestra visión integra las necesidades energéticas actuales con las nuevas oportunidades que ofrece la transición hacia tecnologías más eficientes y sostenibles.</p>
      <a class="btn btn-line rv" href="/empresa/">Conocer la empresa ${icon("flecha")}</a>
    </div>
    <ul class="four rv" aria-label="Las cuatro áreas de E.F.O.">
      <li>${icon("gota")}<b>Combustibles</b><span>Importación y comercialización de combustibles.</span></li>
      <li>${icon("rayo")}<b>Energía</b><span>Infraestructura y suministro energético.</span></li>
      <li>${icon("fabrica")}<b>Industria</b><span>Soluciones para empresas, transporte y proyectos.</span></li>
      <li class="ev">${icon("cargador")}<b>Electromovilidad</b><span>Electrolineras, cargadores y conversión de vehículos.</span></li>
    </ul>
  </div>
</section>

<section class="sec deep" aria-labelledby="ejes-t">
  <div class="wrap">
    <div class="head"><h2 id="ejes-t" class="d2 node">Dos ejes, <span class="c">una sola energía</span></h2></div>
    ${ejes()}
  </div>
</section>

<section class="sec" aria-labelledby="comb-t">
  <div class="wrap">
    <div class="fuel">
      <figure class="photo rv" style="margin:0;aspect-ratio:880/380">${img("combustibles", `${ILUS}: buque tanquero en un puerto`, 880, 380)}<figcaption>${ILUS}</figcaption></figure>
      <div style="display:grid;gap:22px;justify-items:start">
        <h2 id="comb-t" class="d2">Combustibles para mover <span class="c">la economía</span></h2>
        <p class="lead rv">E.F.O. desarrolla actividades relacionadas con la importación y comercialización de combustibles, conectando mercados, logística e infraestructura para atender las necesidades energéticas de Bolivia.</p>
        <a class="btn btn-line rv" href="/combustibles/">Ver combustibles ${icon("flecha")}</a>
      </div>
    </div>
    ${cadena()}
  </div>
</section>

${mapa()}

<section class="sec" aria-labelledby="ev-t">
  <div class="wrap">
    <div class="head-split">
      <h2 id="ev-t" class="d2 node n-g">La energía del futuro ya está en <span class="g">movimiento</span></h2>
      <p class="lead rv">E.F.O. desarrolla soluciones de electromovilidad adaptadas a las necesidades de hogares, empresas, industrias y flotas.</p>
    </div>
    ${cargadores()}
    <div class="btns" style="margin-top:32px"><a class="btn btn-line" href="/electromovilidad/">Conocer electromovilidad ${icon("flecha")}</a></div>
  </div>
</section>

${conversion()}

${oriente()}

${operaciones()}

<section class="sec deep" aria-labelledby="pr-t">
  <div class="wrap">
    <div class="head-split">
      <h2 id="pr-t" class="d2 node">Proyectos que transforman energía en <span class="c">soluciones</span></h2>
      <p class="lead rv">Soluciones que E.F.O. propone y desarrolla. Cada proyecto indica su estado.</p>
    </div>
    ${proyectos()}
    <div class="btns" style="margin-top:32px"><a class="btn btn-line" href="/proyectos/">Ver proyectos ${icon("flecha")}</a></div>
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
${pageHero({ title: "E.F.O. – Energía y Fuerza del <span class=\"c\">Oriente</span>", lead: "Somos una empresa boliviana orientada al desarrollo de soluciones energéticas, combustibles, infraestructura y electromovilidad.", img: "hero", alt: "", crumb: "Empresa" })}

<section class="sec day" aria-labelledby="emp-t">
  <div class="wrap split">
    <div style="display:grid;gap:22px;justify-items:start">
      <h2 id="emp-t" class="d2 node">Una sola empresa, <span class="b">cuatro áreas</span></h2>
      <p class="lead rv">Nuestra propuesta integra las necesidades actuales del mercado energético con nuevas tecnologías que permitan a empresas y organizaciones avanzar hacia soluciones más eficientes y sostenibles.</p>
      <p class="lead rv">Combustibles, energía, industria y electromovilidad forman parte de una misma visión: dar a Bolivia la energía que necesita para producir, transportar y crecer.</p>
    </div>
    <ul class="four rv" aria-label="Las cuatro áreas de E.F.O.">
      <li>${icon("gota")}<b>Combustibles</b><span>Importación y comercialización.</span></li>
      <li>${icon("rayo")}<b>Energía</b><span>Infraestructura y suministro.</span></li>
      <li>${icon("fabrica")}<b>Industria</b><span>Soluciones para operaciones productivas.</span></li>
      <li class="ev">${icon("cargador")}<b>Electromovilidad</b><span>Carga y conversión eléctrica.</span></li>
    </ul>
  </div>
</section>

<section class="sec-tight day" style="padding-top:0" aria-label="Visión y misión">
  <div class="wrap mv">
    <div class="rv"><h3>Nuestra visión</h3><p>Ser una empresa energética boliviana reconocida por desarrollar soluciones confiables, innovadoras y orientadas al crecimiento productivo del país.</p></div>
    <div class="rv"><h3>Nuestra misión</h3><p>Proporcionar soluciones energéticas y tecnológicas que respondan a las necesidades de nuestros clientes, contribuyendo al desarrollo de Bolivia.</p></div>
  </div>
</section>

${porque()}

${oriente()}

${cta()}`,
  },

  {
    path: "/combustibles/", file: "combustibles/index.html",
    title: "Combustibles | Importación y comercialización en Bolivia | E.F.O.",
    desc: "Importación, comercialización y logística de combustibles para empresas, industrias, transporte y sectores productivos de Bolivia.",
    ld: [ORG, crumbsLd("Combustibles", "/combustibles/")],
    body: `
${pageHero({ title: "Combustibles para mover <span class=\"c\">la economía</span>", lead: "Importación y comercialización de combustibles, conectando mercados, logística e infraestructura para atender las necesidades energéticas de Bolivia.", img: "combustibles", alt: "", crumb: "Combustibles" })}

<section class="sec" aria-labelledby="cb-t">
  <div class="wrap">
    <div class="head"><h2 id="cb-t" class="d2 node">Lo que hacemos en combustibles</h2></div>
    <ul class="rows">
      <li class="rv"><span class="ri">${icon("barco")}</span><h3>Importación de combustibles</h3><p>Abastecimiento desde mercados internacionales para atender la demanda energética del país.</p></li>
      <li class="rv"><span class="ri">${icon("maletin")}</span><h3>Comercialización</h3><p>Atención a empresas y consumidores que necesitan un suministro confiable.</p></li>
      <li class="rv"><span class="ri">${icon("camion")}</span><h3>Logística</h3><p>Transporte y distribución para que el combustible llegue a donde se necesita.</p></li>
      <li class="rv"><span class="ri">${icon("edificio")}</span><h3>Atención empresarial</h3><p>Propuestas a la medida de cada empresa, según su consumo y su operación.</p></li>
      <li class="rv"><span class="ri">${icon("fabrica")}</span><h3>Soluciones para sectores productivos</h3><p>Industria, agroindustria, construcción y transporte: el combustible como elemento fundamental para producir y mover el país.</p></li>
    </ul>
  </div>
</section>

<section class="sec-tight" style="padding-top:0" aria-label="Cadena del combustible">
  <div class="wrap">${cadena()}</div>
</section>

${mapa()}

${oriente()}

${cta("¿Tu operación necesita <span class=\"c\">combustible</span>?", "Cuéntanos tu consumo, ubicación y frecuencia, y te enviamos una propuesta.")}`,
  },

  {
    path: "/soluciones-energeticas/", file: "soluciones-energeticas/index.html",
    title: "Soluciones energéticas para empresas e industrias | E.F.O.",
    desc: "Infraestructura energética, soluciones eléctricas, integración de sistemas y proyectos especiales para empresas, industrias e instituciones en Bolivia.",
    ld: [ORG, crumbsLd("Soluciones energéticas", "/soluciones-energeticas/")],
    body: `
${pageHero({ title: "Soluciones <span class=\"c\">energéticas</span>", lead: "E.F.O. no se limita a combustibles ni a electromovilidad: desarrolla infraestructura y soluciones energéticas para empresas, industrias e instituciones.", img: "industria", alt: "", crumb: "Soluciones energéticas" })}

<section class="sec day" aria-labelledby="se-t">
  <div class="wrap">
    <div class="head-split">
      <h2 id="se-t" class="d2 node">Infraestructura y energía para <span class="b">operar</span></h2>
      <p class="lead rv">Cada proyecto parte de la operación del cliente: qué energía necesita, dónde y cómo crecerá.</p>
    </div>
    <ul class="rows">
      <li class="rv"><span class="ri">${icon("torre")}</span><h3>Infraestructura energética</h3><p>Soluciones de infraestructura y suministro energético para empresas e industrias.</p></li>
      <li class="rv"><span class="ri">${icon("rayo")}</span><h3>Soluciones eléctricas</h3><p>Instalaciones y soluciones eléctricas adaptadas a cada operación.</p></li>
      <li class="rv"><span class="ri">${icon("maletin")}</span><h3>Proyectos empresariales</h3><p>Proyectos energéticos pensados para el crecimiento de empresas y organizaciones.</p></li>
      <li class="rv" id="industria"><span class="ri">${icon("fabrica")}</span><h3>Infraestructura para industrias</h3><p>Energía para plantas, agroindustria y operaciones productivas.</p></li>
      <li class="rv"><span class="ri">${icon("red")}</span><h3>Integración de sistemas energéticos</h3><p>Combustibles, electricidad y carga eléctrica trabajando como un solo sistema.</p></li>
      <li class="rv"><span class="ri">${icon("idea")}</span><h3>Proyectos especiales</h3><p>Soluciones a la medida para necesidades que no encajan en un catálogo.</p></li>
    </ul>
  </div>
</section>

<section class="sec" aria-label="Infraestructura energética">
  <div class="wrap split rev">
    <figure class="photo rv" style="margin:0;aspect-ratio:450/415">${img("proyecto-infraestructura", `${ILUS}: subestación eléctrica con transformador`, 450, 415)}<figcaption>${ILUS}</figcaption></figure>
    <div style="display:grid;gap:22px;justify-items:start">
      <h2 class="d2">Un solo socio para <span class="c">toda la energía</span></h2>
      <p class="lead rv">Combustibles, infraestructura eléctrica y movilidad eléctrica bajo una misma empresa: menos proveedores y una visión de conjunto para tu operación.</p>
      <a class="btn btn-cyan rv" href="/contacto/?tipo=Soluciones%20energ%C3%A9ticas#cotizar">Solicitar información ${icon("flecha")}</a>
    </div>
  </div>
</section>

${operaciones()}

${cta()}`,
  },

  {
    path: "/electromovilidad/", file: "electromovilidad/index.html",
    title: "Electromovilidad en Bolivia: electrolineras, cargadores y conversión | E.F.O.",
    desc: "Electrolineras, cargadores AC y DC, carga doméstica, empresarial y para flotas, y conversión de vehículos de combustión a eléctricos en Bolivia.",
    ld: [ORG, crumbsLd("Electromovilidad", "/electromovilidad/")],
    body: `
${pageHero({ title: "La energía del futuro ya está en <span class=\"c\">movimiento</span>", lead: "Soluciones de electromovilidad para hogares, empresas, industrias y flotas: carga, infraestructura y conversión de vehículos.", img: "electromovilidad", alt: "", crumb: "Electromovilidad" })}

<section class="sec" aria-labelledby="cg-t">
  <div class="wrap">
    <div class="head-split">
      <h2 id="cg-t" class="d2 node n-g">Carga para cada <span class="g">necesidad</span></h2>
      <p class="lead rv">Del garaje de una casa a la base de una flota: diseñamos la carga según dónde y cuánto se usa el vehículo.</p>
    </div>
    ${cargadores()}
  </div>
</section>

<section class="sec day" aria-labelledby="eq-t">
  <div class="wrap">
    <div class="head"><h2 id="eq-t" class="d2 node">Equipos e infraestructura</h2></div>
    <ul class="rows">
      <li class="rv"><span class="ri">${icon("cargador")}</span><h3>Electrolineras</h3><p>Diseño e implementación de puntos de carga para el público, empresas y flotas.</p></li>
      <li class="rv"><span class="ri">${icon("rayo")}</span><h3>Cargadores DC</h3><p>Carga rápida en corriente continua, pensada para electrolineras y vehículos que necesitan volver pronto a operar.</p></li>
      <li class="rv"><span class="ri">${icon("casa")}</span><h3>Cargadores AC</h3><p>Carga en corriente alterna para hogares, oficinas y estacionamientos donde el vehículo permanece varias horas.</p></li>
      <li class="rv"><span class="ri">${icon("casa")}</span><h3>Carga doméstica</h3><p>Instalación de carga en el hogar, adaptada a la instalación eléctrica existente.</p></li>
      <li class="rv"><span class="ri">${icon("edificio")}</span><h3>Carga empresarial</h3><p>Puntos de carga para empleados, clientes y vehículos de la empresa.</p></li>
      <li class="rv"><span class="ri">${icon("flota")}</span><h3>Carga para flotas</h3><p>Carga centralizada y gestión para múltiples vehículos.</p></li>
      <li class="rv"><span class="ri">${icon("torre")}</span><h3>Infraestructura eléctrica</h3><p>La infraestructura que la carga necesita para funcionar de forma segura.</p></li>
      <li class="rv"><span class="ri">${icon("red")}</span><h3>Proyectos de movilidad eléctrica</h3><p>Proyectos integrales para empresas, instituciones y transporte.</p></li>
    </ul>
  </div>
</section>

${conversion(false)}

${cta("¿Listo para pasar a la <span class=\"c\">carga eléctrica</span>?", "Cuéntanos dónde quieres cargar o qué vehículo quieres convertir, y te preparamos una propuesta.")}`,
  },

  {
    path: "/proyectos/", file: "proyectos/index.html",
    title: "Proyectos de energía y electromovilidad | E.F.O.",
    desc: "Electrolineras, conversión eléctrica de vehículos, infraestructura energética y carga para flotas: soluciones que E.F.O. propone y desarrolla en Bolivia.",
    ld: [ORG, crumbsLd("Proyectos", "/proyectos/")],
    body: `
${pageHero({ title: "Proyectos que transforman energía en <span class=\"c\">soluciones</span>", lead: "Electrolineras, conversión eléctrica, infraestructura energética y flotas. Cada proyecto indica su estado.", img: "proyecto-electrolinera", alt: "", crumb: "Proyectos" })}

<section class="sec" aria-labelledby="pj-t">
  <div class="wrap">
    <div class="head-split">
      <h2 id="pj-t" class="d2 node">Soluciones en desarrollo</h2>
      <div class="rv" style="display:grid;gap:12px">
        <p class="lead">Mostramos con claridad en qué etapa está cada proyecto.</p>
        <p style="display:flex;flex-wrap:wrap;gap:10px"><span class="stamp">Proyecto conceptual</span><span class="stamp real">Proyecto ejecutado</span></p>
      </div>
    </div>
    ${proyectos()}
    <p class="note">Las imágenes de los proyectos son ilustrativas.</p>
  </div>
</section>

${cta("¿Tienes un proyecto <span class=\"c\">energético</span>?", "Hablemos de la solución que necesita tu empresa.")}`,
  },

  {
    path: "/contacto/", file: "contacto/index.html",
    title: "Contacto y cotizaciones | E.F.O. Ltda.",
    desc: "Cotiza combustibles, soluciones energéticas o electromovilidad con E.F.O. Ltda. WhatsApp +591 69540072 · gerencia@efo.com.bo · Av. Montecristo No. 205, Santa Cruz de la Sierra.",
    ld: [LOCAL, crumbsLd("Contacto", "/contacto/")],
    body: `
${pageHero({ title: "Contacta a <span class=\"c\">E.F.O.</span>", lead: "Solicita información o una cotización. Te respondemos personalmente.", img: "comercio", alt: "", crumb: "Contacto" })}

${contacto("ct")}

<section class="sec-tight day" style="padding-top:0" aria-label="Ubicación">
  <div class="wrap">
    <div class="mapframe"><iframe title="Mapa: ${SITE.addr1}, ${SITE.addr2}" src="https://www.google.com/maps?q=${encodeURIComponent("Avenida Montecristo 205, Santa Cruz de la Sierra, Bolivia")}&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
    <p class="note">${SITE.addr1}, ${SITE.addr2}. <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.addr1 + ", " + SITE.addr2)}" target="_blank" rel="noopener">Abrir en Google Maps</a></p>
  </div>
</section>`,
  },

  {
    path: "/privacidad/", file: "privacidad/index.html",
    title: "Política de privacidad | E.F.O. Ltda.",
    desc: "Cómo E.F.O. Ltda. usa y protege los datos que envías por el formulario de consulta, WhatsApp o correo.",
    body: `
<section class="sec day" style="padding-top:calc(var(--header) + 64px)">
  <div class="wrap legal">
    <h1 class="d2">Política de privacidad</h1>
    <p>Vigente desde octubre de 2026.</p>
    <h2>Responsable</h2>
    <p>${SITE.legal} (E.F.O.), ${SITE.addr1}, ${SITE.addr2}. Contacto: <a href="mailto:${SITE.mail}">${SITE.mail}</a> o WhatsApp ${SITE.waDisplay}.</p>
    <h2>Qué datos recibimos</h2>
    <p>Los que nos envías: nombre, empresa, teléfono, correo, tipo de consulta y mensaje. El sitio no guarda estos datos: al enviar el formulario se abre WhatsApp o tu correo con la consulta escrita, y nos llega solo si tú la envías.</p>
    <h2>Para qué los usamos</h2>
    <ul><li>Responder tu consulta.</li><li>Preparar una propuesta o cotización si la pides.</li><li>Dar seguimiento a esa conversación.</li></ul>
    <p>No vendemos ni compartimos tus datos con terceros para publicidad.</p>
    <h2>Servicios de terceros</h2>
    <p>Los mensajes por WhatsApp pasan por los servicios de WhatsApp (Meta). La página de contacto muestra un mapa de Google Maps. El sitio no usa cookies de publicidad ni herramientas de medición de visitas.</p>
    <h2>Tus derechos</h2>
    <p>Puedes pedirnos saber qué datos tenemos, corregirlos o eliminarlos, escribiendo a <a href="mailto:${SITE.mail}">${SITE.mail}</a>.</p>
    <h2>Cambios</h2>
    <p>Si cambiamos esta política, publicaremos la nueva versión en esta página con su fecha.</p>
  </div>
</section>`,
  },

  {
    path: "/404", file: "404.html", noindex: true,
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
