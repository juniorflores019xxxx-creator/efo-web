// Contenido de cada página del sitio E.F.O. Textos del documento maestro; sin cifras, clientes ni países no confirmados.
// Fotografías y videos: Pexels (licencia libre). Mapas generados con geografía real (Natural Earth).
import { readFileSync } from "node:fs";
import { SITE, WA_URL, SOCIALS, icon, pic, lines, words, contactForm, contactData, cta, pageHero } from "./layout.mjs";

const svg = (f) => readFileSync(new URL(`../public_html/assets/img/${f}`, import.meta.url), "utf8").replace(/<\?xml[^>]*>/, "");
const MUNDO = svg("mundo-bolivia.svg");
const BOLIVIA = svg("bolivia-red.svg");

/* ---------- Bloques compartidos ---------- */
const AREAS = [
  { t: "Combustibles", d: "Importación y venta de diésel ULSD para empresas, industria y transporte.", ic: "gota", f: "refineria-tarde", href: "/combustibles/" },
  { t: "Energía", d: "Energía solar fotovoltaica e infraestructura eléctrica para operaciones que no pueden detenerse.", ic: "rayo", f: "torres", href: "/soluciones-energeticas/" },
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

const SOLAR_PASOS = [
  ["solar-evaluacion", "Técnico revisando una instalación solar en una cubierta", "Visita y evaluación", "Revisamos el lugar, la orientación, la sombra, el techo o terreno y tu consumo de energía en las facturas."],
  ["solar-diseno", "Ingeniero con planos junto a paneles solares", "Diseño del sistema", "Calculamos la potencia, la cantidad de paneles, el inversor y las baterías, y te entregamos una propuesta clara."],
  ["solar-equipos", "Técnico sosteniendo un panel solar", "Suministro de equipos", "Llevamos los paneles, el inversor, las baterías, la estructura y las protecciones al lugar de la obra."],
  ["solar-montaje", "Técnicos con equipo de seguridad montando paneles solares", "Montaje de estructura y paneles", "Fijamos la estructura y montamos los paneles con equipo de seguridad y la inclinación correcta."],
  ["solar-conexion", "Tablero eléctrico con protecciones y cableado ordenado", "Conexión eléctrica", "Instalamos el inversor, el tablero, las protecciones y el cableado, y conectamos todo a tu red."],
  ["solar-puesta", "Ingeniero con casco y chaleco entre paneles solares", "Pruebas y puesta en marcha", "Medimos, probamos y encendemos el sistema. Te enseñamos a usarlo y a revisar su producción."],
  ["solar-mantenimiento", "Equipo técnico revisando paneles solares en un techo", "Mantenimiento y soporte", "Limpieza, revisión periódica y soporte técnico para que el sistema rinda durante muchos años."],
];

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
  knowsAbout: ["Diésel ULSD", "Combustibles", "Energía solar fotovoltaica", "Soluciones energéticas", "Electromovilidad", "Electrolineras", "Cargadores para vehículos eléctricos", "Conversión de vehículos eléctricos"],
  sameAs: SOCIALS.map(([, url]) => url.split("?")[0]),
};
const LOCAL = { ...ORG, "@type": "LocalBusiness", image: `${SITE.url}/assets/img/compartir.jpg`, hasMap: SITE.maps,
  geo: { "@type": "GeoCoordinates", latitude: SITE.lat, longitude: SITE.lng },
  openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:30", closes: "16:30" }] };
const crumbsLd = (name, path) => ({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Inicio", item: SITE.url + "/" }, { "@type": "ListItem", position: 2, name, item: SITE.url + path }] });

/* ---------- Páginas ---------- */
export const PAGES = [
  {
    path: "/", file: "index.html",
    title: "E.F.O. Ltda. · Energía y combustibles en Bolivia",
    desc: "E.F.O. Ltda. importa y vende diésel ULSD, instala sistemas de energía solar y desarrolla proyectos de electromovilidad para empresas e industrias de Bolivia.",
    ld: [ORG],
    body: `
<section class="hero" aria-labelledby="hero-t">
  <div class="hero-media">
    <video data-src="/assets/video/plaza-720.mp4" data-src-sm="/assets/video/plaza-540.mp4" poster="/assets/video/plaza-poster.webp" muted loop playsinline autoplay preload="none" aria-hidden="true"></video>
  </div>
  <div class="wrap hero-in">
    <h1 id="hero-t" class="d1" data-lines>${lines("Energía", "que mueve", "<span style=\"color:var(--cyan-soft)\">Bolivia</span>")}</h1>
    <div class="hero-foot">
      <div style="display:grid;gap:24px">
        <p class="lead">E.F.O. importa y vende diésel ULSD, instala sistemas de energía solar y desarrolla proyectos de electromovilidad para empresas, industrias y organizaciones en Bolivia.</p>
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
    <p class="big" data-words>${words("E.F.O. es una <em class=\"hl\">empresa energética boliviana</em> que importa diésel ULSD, instala energía solar y desarrolla infraestructura y electromovilidad para empresas, industrias y organizaciones.")}</p>
    <ul class="pillars">
      <li data-reveal>${icon("gota")}<b>Combustibles</b><span>Importación y venta de diésel ULSD.</span></li>
      <li data-reveal>${icon("rayo")}<b>Energía</b><span>Energía solar e infraestructura eléctrica.</span></li>
      <li data-reveal>${icon("fabrica")}<b>Industria</b><span>Soluciones para operaciones productivas.</span></li>
      <li data-reveal>${icon("cargador")}<b>Electromovilidad</b><span>Carga y conversión eléctrica.</span></li>
    </ul>
    <div class="btns" style="margin-top:40px" data-reveal><a class="btn btn-line btn-lg" href="/empresa/">Conocer la empresa ${icon("flecha")}</a></div>
  </div>
</section>

<div class="marquee" aria-hidden="true">
  <div class="mq-track">${"<span>Combustibles</span><i></i><span>Energía</span><i></i><span>Industria</span><i></i><span>Electromovilidad</span><i></i><span>Santa Cruz · Bolivia</span><i></i>".repeat(4)}</div>
</div>

${areas()}

${buque()}

<section class="sec" aria-label="Cadena del combustible">
  <div class="wrap">
    <div class="head head-split">
      <h2 class="d2" data-lines>${lines("Combustibles para", "mover <span class=\"c\">la economía</span>")}</h2>
      <p class="lead" data-reveal>E.F.O. importa y comercializa diésel ULSD, conectando mercados, logística e infraestructura hasta tu operación.</p>
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
    desc: "E.F.O. Ltda. es una empresa energética de Santa Cruz de la Sierra: importación y venta de diésel ULSD, energía solar, infraestructura y electromovilidad.",
    ld: [ORG, crumbsLd("Empresa", "/empresa/")],
    body: `
${pageHero({ title: lines("Energía y Fuerza", "del <span class=\"c\">Oriente</span>"), lead: "Somos una empresa boliviana que importa y vende diésel ULSD, instala sistemas de energía solar y desarrolla infraestructura y electromovilidad.", foto: "tranvia-scz", crumb: "Empresa" })}

<section class="statement" aria-label="Nuestra propuesta">
  <div class="wrap">
    <p class="big" data-words>${words("Nuestra propuesta integra las necesidades actuales del mercado energético con <em class=\"hl\">nuevas tecnologías</em> que permiten a empresas y organizaciones avanzar hacia soluciones más eficientes y sostenibles.")}</p>
  </div>
</section>

<section class="sec-tight mist" aria-label="Visión y misión">
  <div class="wrap mv">
    <h2 class="sr-only">Nuestra visión y misión</h2>
    <div data-reveal><h3>Nuestra visión</h3><p>Ser una empresa energética boliviana reconocida por desarrollar soluciones confiables, innovadoras y orientadas al crecimiento productivo del país.</p></div>
    <div data-reveal><h3>Nuestra misión</h3><p>Proporcionar soluciones energéticas y tecnológicas que respondan a las necesidades de nuestros clientes, contribuyendo al desarrollo de Bolivia.</p></div>
  </div>
</section>

<section class="sec" aria-labelledby="hab-t">
  <div class="wrap">
    <div class="head head-split">
      <h2 id="hab-t" class="d2" data-lines>${lines("Una empresa", "<span class=\"c\">habilitada</span>")}</h2>
      <p class="lead" data-reveal>Operamos con los registros que exige la ley y con equipo técnico propio.</p>
    </div>
    <ul class="rows">
      <li data-reveal><span class="ri">${icon("escudo")}</span><h3>Registro ANH</h3><p>Código único de registro ${SITE.anh} ante la Agencia Nacional de Hidrocarburos para la comercialización de diésel.</p></li>
      <li data-reveal><span class="ri">${icon("maletin")}</span><h3>Empresa legalmente constituida</h3><p>${SITE.legal}, NIT ${SITE.nit}, con oficinas en ${SITE.addr1}, Santa Cruz de la Sierra.</p></li>
      <li data-reveal><span class="ri">${icon("engranaje")}</span><h3>Personal técnico propio</h3><p>Las instalaciones solares las realiza el personal técnico de E.F.O., que también ofrece mantenimiento.</p></li>
      <li data-reveal><span class="ri">${icon("rayo")}</span><h3>Equipos de marcas reconocidas</h3><p>Equipos Lumosenergy y Huawei, con garantía.</p></li>
    </ul>
  </div>
</section>

${areas()}

${porque()}

${oriente()}

${cta()}`,
  },

  {
    path: "/combustibles/", file: "combustibles/index.html",
    title: "Importación y venta de diésel ULSD en Bolivia | E.F.O.",
    desc: "E.F.O. importa y vende diésel ULSD (ultra bajo azufre) para empresas, industrias y transporte en Bolivia, con entrega en los nueve departamentos.",
    ld: [ORG, crumbsLd("Combustibles", "/combustibles/")],
    body: `
${pageHero({ title: lines("Combustibles", "para mover", "<span class=\"c\">la economía</span>"), lead: "Importamos y comercializamos diésel ULSD (ultra bajo azufre), conectando mercados internacionales, logística e infraestructura para atender las necesidades energéticas de Bolivia.", foto: "refineria-tarde", crumb: "Combustibles" })}

<section class="sec" aria-labelledby="cb-t">
  <div class="wrap">
    <div class="head"><h2 id="cb-t" class="d2" data-lines>${lines("Lo que hacemos", "en combustibles")}</h2></div>
    <ul class="rows">
      <li data-reveal><span class="ri">${icon("barco")}</span><h3>Importación de diésel ULSD</h3><p>Importamos diésel de ultra bajo azufre desde mercados internacionales para atender la demanda energética del país.</p></li>
      <li data-reveal><span class="ri">${icon("maletin")}</span><h3>Venta de diésel ULSD</h3><p>Comercializamos diésel ULSD a empresas, industrias y consumidores que necesitan un suministro confiable.</p></li>
      <li data-reveal><span class="ri">${icon("camion")}</span><h3>Logística</h3><p>Transporte y distribución para que el combustible llegue a donde se necesita.</p></li>
      <li data-reveal><span class="ri">${icon("edificio")}</span><h3>Atención empresarial</h3><p>Propuestas a la medida de cada empresa, según su consumo y su operación.</p></li>
      <li data-reveal><span class="ri">${icon("fabrica")}</span><h3>Soluciones para sectores productivos</h3><p>Industria, agroindustria, construcción y transporte: el combustible como elemento fundamental para producir y mover el país.</p></li>
    </ul>
  </div>
</section>

<section class="sec mist" aria-labelledby="ulsd-t" id="diesel-ulsd">
  <div class="wrap feature">
    <figure class="photo tall" data-reveal><div class="par" data-speed="0.18">${pic("diesel-surtidor", "Picos de surtidor de combustible en una estación de servicio", { sizes: "(min-width: 980px) 55vw, 100vw" })}</div></figure>
    <div class="copy">
      <span class="kicker">Nuestro producto</span>
      <h2 id="ulsd-t" class="d2" data-lines>${lines("Diésel ULSD", "de <span class=\"c\">ultra bajo azufre</span>")}</h2>
      <p class="lead" data-reveal>El diésel ULSD (<i lang="en">Ultra Low Sulfur Diesel</i>) tiene un contenido de azufre ultra bajo: el que importa E.F.O. tiene un máximo de 10 ppm. Es el combustible que piden los motores diésel modernos: rinde mejor, protege el sistema de inyección y reduce las emisiones.</p>
      <ul class="spec" data-reveal>
        <li>${icon("gota")}<span><b>Azufre ultra bajo</b><span>Máximo 10 partes por millón; el último lote analizado dio 9,5 ppm.</span></span></li>
        <li>${icon("engranaje")}<span><b>Cuida los motores</b><span>Compatible con inyección <i lang="en">common rail</i>, filtros de partículas y motores de última generación.</span></span></li>
        <li>${icon("globo")}<span><b>Menos emisiones</b><span>Reduce el humo, el hollín y los gases contaminantes.</span></span></li>
        <li>${icon("camion")}<span><b>Para operaciones exigentes</b><span>Transporte pesado, maquinaria, generadores y equipos industriales.</span></span></li>
      </ul>
      <div class="chips" data-reveal><span>Transporte</span><span>Agroindustria</span><span>Construcción</span><span>Minería</span><span>Industria</span><span>Generación eléctrica</span></div>
      <a class="btn btn-cyan btn-lg" href="/contacto/?tipo=Di%C3%A9sel%20ULSD#cotizar" data-reveal>Cotizar diésel ULSD ${icon("flecha")}</a>
      <p class="note">Fotografías referenciales.</p>
    </div>
  </div>
</section>

<section class="sec" aria-labelledby="cond-t" id="condiciones">
  <div class="wrap">
    <div class="head head-split">
      <h2 id="cond-t" class="d2" data-lines>${lines("Condiciones", "de <span class=\"c\">venta</span>")}</h2>
      <p class="lead" data-reveal>Importamos y vendemos diésel ULSD con registro de la Agencia Nacional de Hidrocarburos y entrega en todo el país.</p>
    </div>
    <ul class="rows">
      <li data-reveal><span class="ri">${icon("escudo")}</span><h3>Registro ANH</h3><p>Código único de registro ${SITE.anh} ante la Agencia Nacional de Hidrocarburos.</p></li>
      <li data-reveal><span class="ri">${icon("gota")}</span><h3>Pedido mínimo</h3><p>10.000 litros (10 m³) por pedido.</p></li>
      <li data-reveal><span class="ri">${icon("camion")}</span><h3>Entrega en toda Bolivia</h3><p>Llevamos el diésel a los nueve departamentos del país.</p></li>
      <li data-reveal><span class="ri">${icon("pago")}</span><h3>Formas de pago</h3><p>Transferencia bancaria, contado, pago con QR y crédito a empresas.</p></li>
    </ul>
  </div>
</section>

<section class="sec mist" aria-labelledby="ficha-t" id="ficha-tecnica">
  <div class="wrap">
    <div class="head head-split">
      <h2 id="ficha-t" class="d2" data-lines>${lines("Ficha", "<span class=\"c\">técnica</span>")}</h2>
      <p class="lead" data-reveal>Resultados de laboratorio del diésel ULSD que importa E.F.O., según análisis de un lote de junio de 2026.</p>
    </div>
    <div class="ficha" data-reveal>
      <table>
        <thead><tr><th scope="col">Ensayo</th><th scope="col">Resultado</th><th scope="col">Método</th></tr></thead>
        <tbody>
          <tr><th scope="row">Azufre total</th><td>9,5 mg/kg (ppm)</td><td>ASTM D5453</td></tr>
          <tr><th scope="row">Densidad a 15 °C</th><td>0,838 kg/l</td><td>ASTM D4052</td></tr>
          <tr><th scope="row">Índice de cetano calculado</th><td>50,3</td><td>ASTM D976</td></tr>
          <tr><th scope="row">Punto de inflamación</th><td>58 °C</td><td>ASTM D93</td></tr>
          <tr><th scope="row">Viscosidad a 40 °C</th><td>2,433 cSt</td><td>ASTM D445</td></tr>
          <tr><th scope="row">Punto de fluidez</th><td>Menor a −21 °C</td><td>ASTM D97</td></tr>
          <tr><th scope="row">Destilación, 90 % recuperado</th><td>331,9 °C</td><td>ASTM D86</td></tr>
          <tr><th scope="row">Agua y sedimentos</th><td>Menor a 0,05 % vol</td><td>ASTM D2709</td></tr>
          <tr><th scope="row">Corrosión a la lámina de cobre</th><td>1A</td><td>ASTM D130</td></tr>
          <tr><th scope="row">Cenizas</th><td>Menor a 0,010 % m/m</td><td>ASTM D482</td></tr>
          <tr><th scope="row">Residuo de carbón</th><td>0,02 % peso</td><td>ASTM D189</td></tr>
          <tr><th scope="row">Biodiésel (FAME)</th><td>No detectado</td><td>EN 14078</td></tr>
          <tr><th scope="row">Aspecto</th><td>Cristalino</td><td>Visual</td></tr>
        </tbody>
      </table>
    </div>
    <p class="ficha-nota" data-reveal>Los valores corresponden a un lote analizado y pueden variar ligeramente entre importaciones. Solicita el certificado del lote al cotizar.</p>
    <div class="btns" style="margin-top:24px" data-reveal><a class="btn btn-line btn-lg" href="/assets/docs/ficha-tecnica-diesel-ulsd-efo.pdf" download="Ficha-tecnica-diesel-ULSD-EFO.pdf">Descargar ficha técnica en PDF</a><a class="btn btn-cyan btn-lg" href="/contacto/?tipo=Di%C3%A9sel%20ULSD#cotizar">Cotizar diésel ULSD ${icon("flecha")}</a></div>
  </div>
</section>

<section class="sec" aria-labelledby="ruta-t">
  <div class="wrap">
    <div class="head head-split">
      <h2 id="ruta-t" class="d2" data-lines>${lines("Del tanque", "a tu <span class=\"c\">operación</span>")}</h2>
      <p class="lead" data-reveal>Coordinamos el almacenamiento y el transporte del diésel ULSD para que llegue a tiempo y en las condiciones correctas.</p>
    </div>
    <div class="gal">
      <figure data-reveal>${pic("diesel-tanques", "Tanques de almacenamiento de combustible en una planta", { sizes: "(min-width: 760px) 50vw, 100vw" })}<figcaption><b>Almacenamiento</b><span>Tanques para resguardar el combustible importado.</span></figcaption></figure>
      <figure data-reveal>${pic("diesel-cisterna", "Camión cisterna de combustible", { sizes: "(min-width: 760px) 50vw, 100vw" })}<figcaption><b>Transporte en cisterna</b><span>Distribución hasta tu planta, obra o flota.</span></figcaption></figure>
    </div>
    <p class="note">Fotografías referenciales.</p>
  </div>
</section>

${buque(undefined, "Un buque tanquero en la terminal: el inicio de la cadena que lleva el diésel ULSD hasta la industria y el transporte.")}

<section class="sec" aria-label="Cadena del combustible">
  <div class="wrap">${cadena()}</div>
</section>

${mapa()}

${cta("¿Tu operación necesita <span class=\"c\">diésel ULSD</span>?", "Cuéntanos tu consumo, ubicación y frecuencia, y te enviamos una propuesta.", "refineria-noche")}`,
  },

  {
    path: "/soluciones-energeticas/", file: "soluciones-energeticas/index.html",
    title: "Soluciones energéticas para empresas e industrias | E.F.O.",
    desc: "Energía solar fotovoltaica, paneles solares, infraestructura energética y soluciones eléctricas para hogares, empresas, industrias e instituciones en Bolivia.",
    ld: [ORG, crumbsLd("Soluciones energéticas", "/soluciones-energeticas/")],
    body: `
${pageHero({ title: lines("Soluciones", "<span class=\"c\">energéticas</span>"), lead: "E.F.O. no se limita a combustibles ni a electromovilidad: instala sistemas de energía solar fotovoltaica y desarrolla infraestructura y soluciones eléctricas para empresas, industrias e instituciones.", foto: "subestacion", crumb: "Soluciones energéticas" })}

<section class="sec" aria-labelledby="se-t">
  <div class="wrap">
    <div class="head head-split">
      <h2 id="se-t" class="d2" data-lines>${lines("Infraestructura y energía", "para <span class=\"c\">operar</span>")}</h2>
      <p class="lead" data-reveal>Cada proyecto parte de la operación del cliente: qué energía necesita, dónde y cómo crecerá.</p>
    </div>
    <ul class="rows">
      <li data-reveal><span class="ri">${icon("torre")}</span><h3>Infraestructura energética</h3><p>Soluciones de infraestructura y suministro energético para empresas e industrias.</p></li>
      <li data-reveal><span class="ri">${icon("sol")}</span><h3>Energía solar fotovoltaica</h3><p>Paneles solares, inversores y baterías para generar tu propia energía. <a href="#solar">Ver equipos e instalación</a></p></li>
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

<section class="sec" aria-labelledby="solar-t" id="solar">
  <div class="wrap feature rev">
    <figure class="photo tall" data-reveal><div class="par" data-speed="0.18">${pic("solar-campo", "Planta de paneles solares al atardecer", { sizes: "(min-width: 980px) 55vw, 100vw" })}</div></figure>
    <div class="copy">
      <span class="kicker">Energía solar</span>
      <h2 id="solar-t" class="d2" data-lines>${lines("Equipos", "<span class=\"c\">fotovoltaicos</span>")}</h2>
      <p class="lead" data-reveal>Diseñamos, suministramos e instalamos sistemas de paneles solares para hogares, empresas e industrias, con personal técnico propio. Menos gasto en energía y un suministro propio, limpio y estable.</p>
      <ul class="spec" data-reveal>
        <li>${icon("panel")}<span><b>Paneles solares</b><span>Módulos fotovoltaicos elegidos según el diseño de cada proyecto.</span></span></li>
        <li>${icon("rayo")}<span><b>Inversores</b><span>Conectados a la red o híbridos con baterías, según tu necesidad.</span></span></li>
        <li>${icon("bateria")}<span><b>Baterías</b><span>Almacenamiento para tener energía de noche o durante cortes.</span></span></li>
        <li>${icon("torre")}<span><b>Estructuras de montaje</b><span>Para techo, suelo o cubiertas industriales.</span></span></li>
        <li>${icon("ajustes")}<span><b>Protecciones y tableros</b><span>Seguridad eléctrica en cada punto del sistema.</span></span></li>
        <li>${icon("idea")}<span><b>Monitoreo</b><span>Seguimiento de la producción de energía, según el equipo elegido.</span></span></li>
        <li>${icon("escudo")}<span><b>Marcas y garantía</b><span>Equipos Huawei y Lumosenergy, con 2 años de garantía.</span></span></li>
      </ul>
      <div class="chips" data-reveal><span>Conectado a la red</span><span>Híbrido con baterías</span><span>Huawei</span><span>Lumosenergy</span></div>
      <a class="btn btn-cyan btn-lg" href="/contacto/?tipo=Energ%C3%ADa%20solar#cotizar" data-reveal>Cotizar sistema solar ${icon("flecha")}</a>
      <p class="note">Fotografías referenciales.</p>
    </div>
  </div>
</section>

<section class="sec mist" aria-labelledby="inst-t">
  <div class="wrap">
    <div class="head head-split">
      <h2 id="inst-t" class="d2" data-lines>${lines("Cómo instalamos", "tu <span class=\"c\">sistema solar</span>")}</h2>
      <p class="lead" data-reveal>Un proceso claro, de la primera visita a la puesta en marcha, a cargo del personal técnico de E.F.O. y con equipos de seguridad en cada etapa.</p>
    </div>
    <ol class="steps">
      ${SOLAR_PASOS.map(([f, alt, t, d], i) => `<li class="step" data-reveal>
        <figure>${pic(f, alt, { sizes: "(min-width: 1100px) 33vw, (min-width: 700px) 50vw, 100vw" })}<span class="n">${String(i + 1).padStart(2, "0")}</span></figure>
        <div class="step-in"><h3>${t}</h3><p>${d}</p></div>
      </li>`).join("\n      ")}
      <li class="step step-cta" data-reveal>
        <div class="step-in">${icon("sol")}<h3>¿Listo para generar tu propia energía?</h3><p>Agenda una visita técnica y recibe tu propuesta. Te explicamos las condiciones de la visita al coordinarla.</p><a class="btn btn-cyan" href="/contacto/?tipo=Energ%C3%ADa%20solar#cotizar">Cotizar ahora ${icon("flecha")}</a></div>
      </li>
    </ol>
    <p class="note">Fotografías referenciales.</p>
  </div>
</section>

${operaciones()}

${cta("¿Quieres generar tu propia <span class=\"c\">energía</span>?", "Cuéntanos tu consumo mensual y dónde está tu instalación, y te enviamos una propuesta.", "solar-aereo")}`,
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

<section class="sec" aria-labelledby="lumos-t" id="cargadores">
  <div class="wrap">
    <div class="head head-split">
      <h2 id="lumos-t" class="d2" data-lines>${lines("Cargadores", "<span class=\"c\">Lumosenergy</span>")}</h2>
      <p class="lead" data-reveal>Trabajamos con equipos Lumosenergy. Según el fabricante, es uno de los tres mayores fabricantes de cargadores de China y ha entregado más de 200.000 puntos de carga en más de 40 países.</p>
    </div>
    <ul class="eqs">
      <li class="eq" data-reveal>
        <figure><img src="/assets/foto/cargadores/ac22.webp" alt="AC22 Turbo, equipo Lumosenergy" width="104" height="640" loading="lazy" decoding="async"></figure>
        <div class="eq-in"><span class="eq-k">Cargador AC</span><h3>AC22 Turbo</h3><p class="eq-p">7, 11 o 22 kW</p><p>Conector Tipo 2, de pared o pedestal.</p><small>Hogares, oficinas y hoteles</small><a class="eq-a" href="/assets/docs/catalogo-cargadores-efo.pdf#page=2" target="_blank" rel="noopener">Ver ficha técnica (PDF)</a></div>
      </li>
      <li class="eq" data-reveal>
        <figure><img src="/assets/foto/cargadores/da30.webp" alt="DA30 Compact, equipo Lumosenergy" width="365" height="640" loading="lazy" decoding="async"></figure>
        <div class="eq-in"><span class="eq-k">Cargador DC compacto</span><h3>DA30 Compact</h3><p class="eq-p">30 kW</p><p>Salida DC de 150 a 1000 V y pantalla táctil.</p><small>Comercios y estacionamientos</small><a class="eq-a" href="/assets/docs/catalogo-cargadores-efo.pdf#page=3" target="_blank" rel="noopener">Ver ficha técnica (PDF)</a></div>
      </li>
      <li class="eq" data-reveal>
        <figure><img src="/assets/foto/cargadores/da60.webp" alt="DA60 Fast, equipo Lumosenergy" width="450" height="640" loading="lazy" decoding="async"></figure>
        <div class="eq-in"><span class="eq-k">Cargador DC rápido</span><h3>DA60 Fast</h3><p class="eq-p">60 kW</p><p>Dos conectores CCS2.</p><small>Electrolineras y flotas</small><a class="eq-a" href="/assets/docs/catalogo-cargadores-efo.pdf#page=4" target="_blank" rel="noopener">Ver ficha técnica (PDF)</a></div>
      </li>
      <li class="eq" data-reveal>
        <figure><img src="/assets/foto/cargadores/da180.webp" alt="DA180 Fast, equipo Lumosenergy" width="440" height="640" loading="lazy" decoding="async"></figure>
        <div class="eq-in"><span class="eq-k">Cargador DC rápido</span><h3>DA180 Fast</h3><p class="eq-p">120 o 180 kW</p><p>Dos conectores CCS2; versión CHAdeMO disponible.</p><small>Carga pública y vehículos pesados</small><a class="eq-a" href="/assets/docs/catalogo-cargadores-efo.pdf#page=5" target="_blank" rel="noopener">Ver ficha técnica (PDF)</a></div>
      </li>
      <li class="eq" data-reveal>
        <figure><img src="/assets/foto/cargadores/da240.webp" alt="DA240 Fast, equipo Lumosenergy" width="465" height="640" loading="lazy" decoding="async"></figure>
        <div class="eq-in"><span class="eq-k">Cargador DC rápido</span><h3>DA240 Fast</h3><p class="eq-p">240 kW</p><p>Dos conectores CCS2, hasta 400 A.</p><small>Sitios de alta demanda</small><a class="eq-a" href="/assets/docs/catalogo-cargadores-efo.pdf#page=6" target="_blank" rel="noopener">Ver ficha técnica (PDF)</a></div>
      </li>
      <li class="eq" data-reveal>
        <figure><img src="/assets/foto/cargadores/da480.webp" alt="DA480 Ultra-fast, equipo Lumosenergy" width="538" height="640" loading="lazy" decoding="async"></figure>
        <div class="eq-in"><span class="eq-k">Cargador DC ultrarrápido</span><h3>DA480 Ultra-fast</h3><p class="eq-p">480 kW</p><p>Carga hasta 4 vehículos a la vez.</p><small>Electrolineras de alto tráfico</small><a class="eq-a" href="/assets/docs/catalogo-cargadores-efo.pdf#page=7" target="_blank" rel="noopener">Ver ficha técnica (PDF)</a></div>
      </li>
      <li class="eq" data-reveal>
        <figure><img src="/assets/foto/cargadores/dd300.webp" alt="DC480 Cabinet + DD300, equipo Lumosenergy" width="362" height="640" loading="lazy" decoding="async"></figure>
        <div class="eq-in"><span class="eq-k">Carga distribuida</span><h3>DC480 Cabinet + DD300</h3><p class="eq-p">480 a 1440 kW</p><p>Gabinete de potencia con dispensadores de hasta 300 kW por conector.</p><small>Terminales de buses y grandes flotas</small><a class="eq-a" href="/assets/docs/catalogo-cargadores-efo.pdf#page=8" target="_blank" rel="noopener">Ver ficha técnica (PDF)</a></div>
      </li>
      <li class="eq" data-reveal>
        <figure><img src="/assets/foto/cargadores/ess.webp" alt="Almacenamiento de energía, equipo Lumosenergy" width="383" height="640" loading="lazy" decoding="async"></figure>
        <div class="eq-in"><span class="eq-k">Sistema de baterías</span><h3>Almacenamiento de energía</h3><p class="eq-p">125 kW · 261 kWh</p><p>Baterías LFP con refrigeración líquida.</p><small>Respaldo, picos de demanda y energía solar</small><a class="eq-a" href="/assets/docs/catalogo-cargadores-efo.pdf#page=9" target="_blank" rel="noopener">Ver ficha técnica (PDF)</a></div>
      </li>
    </ul>
    <div class="chips" data-reveal><span>Protocolo OCPP 1.6J y 2.0.1</span><span>Certificación CE</span><span>Monitoreo remoto</span><span>Gestión dinámica de carga</span><span>Pago con app, tarjeta RFID o QR</span></div>
    <div class="btns" data-reveal>
      <a class="btn btn-cyan btn-lg" href="/contacto/?tipo=Cargadores#cotizar">Cotizar cargadores ${icon("flecha")}</a>
      <a class="btn btn-line btn-lg" href="/assets/docs/catalogo-cargadores-efo.pdf" download="Catalogo-cargadores-EFO.pdf">Descargar catálogo en PDF</a>
    </div>
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
    <div class="mapframe" data-reveal><iframe title="Mapa con la ubicación de E.F.O. Ltda. en ${SITE.addr1}, ${SITE.addr2}" data-consent-src="${SITE.mapsEmbed}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
      <div class="map-ph"><p>El mapa se muestra con Google Maps, que puede guardar cookies en tu navegador.</p><div class="btns"><button type="button" class="btn btn-cyan" data-map-load>Mostrar mapa</button><a class="btn btn-line" href="${SITE.maps}" target="_blank" rel="noopener">Abrir en Google Maps</a></div></div>
    </div>
    <p class="note">${SITE.addr1}, ${SITE.addr2}. <a href="${SITE.maps}" target="_blank" rel="noopener">Ver la ubicación de E.F.O. en Google Maps</a></p>
  </div>
</section>`,
  },

  {
    path: "/privacidad/", file: "privacidad/index.html", light: true,
    title: "Política de privacidad | E.F.O. Ltda.",
    desc: "Cómo E.F.O. Ltda. trata los datos que envías por el formulario, WhatsApp o correo, con quién se comparten y cómo ejercer tus derechos.",
    body: `
<section class="sec" style="padding-top:calc(var(--header) + 72px)">
  <div class="wrap legal">
    <h1 class="d2">Política de privacidad</h1>
    <p>Última actualización: 5 de noviembre de 2026.</p>
    <h2>1. Responsable</h2>
    <div class="datos">
      <p><b>${SITE.legal}</b> (nombre comercial: E.F.O. Ltda.)</p>
      <p>NIT ${SITE.nit} · Registro ANH ${SITE.anh}</p>
      <p>${SITE.addr1}, ${SITE.addr2}</p>
      <p>WhatsApp ${SITE.waDisplay} · <a href="mailto:${SITE.mail}">${SITE.mail}</a></p>
      <p>Horario de atención: ${SITE.horario}</p>
    </div>
    <h2>2. Marco legal</h2>
    <p>Tratamos tus datos según la Constitución Política del Estado (artículo 21, derecho a la privacidad e intimidad, y artículo 130, Acción de Protección de Privacidad), la Ley N.° 164 General de Telecomunicaciones, Tecnologías de Información y Comunicación, su reglamento, y la Ley N.° 453 General de los Derechos de las Usuarias y los Usuarios y de las Consumidoras y los Consumidores.</p>
    <h2>3. Qué datos recibimos</h2>
    <ul>
      <li><b>Formulario de consulta:</b> nombre, empresa (opcional), teléfono, correo (opcional), tipo de consulta y mensaje. El sitio no guarda estos datos: al enviar se abre WhatsApp o tu correo con la consulta escrita, y nos llega solo si tú la envías.</li>
      <li><b>Mensajes directos:</b> lo que nos escribas por WhatsApp o correo.</li>
      <li><b>Datos técnicos:</b> el servidor del sitio (Hostinger) y el servicio de seguridad (Cloudflare) registran datos como la dirección IP, el navegador y la fecha de visita, para que el sitio funcione y para protegerlo de ataques.</li>
    </ul>
    <p>No pedimos datos sensibles ni datos de tarjetas. El sitio no cobra pagos.</p>
    <h2>4. Para qué los usamos y con qué base</h2>
    <ul><li>Responder tu consulta y preparar una cotización si la pides (tu consentimiento, que das al marcar la casilla del formulario, y los pasos previos a un contrato).</li><li>Dar seguimiento a esa conversación y, si compras, cumplir el contrato y las obligaciones tributarias.</li><li>Mantener el sitio seguro (interés legítimo).</li></ul>
    <p>No vendemos ni cedemos tus datos, y no los usamos para publicidad.</p>
    <h2>5. Con quién se comparten</h2>
    <table>
      <thead><tr><th>Servicio</th><th>Para qué</th><th>Cuándo</th></tr></thead>
      <tbody>
        <tr><td>WhatsApp (Meta)</td><td>Recibir las consultas que envías por WhatsApp</td><td>Cuando nos escribes por WhatsApp</td></tr>
        <tr><td>Hostinger</td><td>Alojamiento del sitio y del correo</td><td>Siempre</td></tr>
        <tr><td>Cloudflare</td><td>DNS, conexión segura y protección contra ataques</td><td>Siempre</td></tr>
        <tr><td>YouTube (Google)</td><td>Música de fondo</td><td>Solo si aceptas el contenido de terceros</td></tr>
        <tr><td>Google Maps</td><td>Mapa de la página de Contacto</td><td>Solo si aceptas, o si tocas «Mostrar mapa»</td></tr>
      </tbody>
    </table>
    <p>Estos proveedores pueden tratar datos fuera de Bolivia, con sus propias políticas de privacidad. La tipografía del sitio está alojada en nuestro propio servidor: no se carga desde Google Fonts.</p>
    <h2>6. Cuánto tiempo los guardamos</h2>
    <p>El tiempo necesario para atender tu consulta y la relación comercial, y el que exijan las normas tributarias y comerciales. Después los eliminamos.</p>
    <h2>7. Tus derechos</h2>
    <p>Puedes pedirnos saber qué datos tenemos sobre ti, corregirlos, actualizarlos o eliminarlos, y retirar tu consentimiento en cualquier momento, escribiendo a <a href="mailto:${SITE.mail}">${SITE.mail}</a>. Respondemos en un plazo máximo de 10 días hábiles. También puedes acudir a la Acción de Protección de Privacidad prevista en la Constitución.</p>
    <h2>8. Seguridad y menores</h2>
    <p>El sitio funciona con conexión cifrada (HTTPS). El sitio está dirigido a empresas y personas adultas; no recogemos a sabiendas datos de menores de edad.</p>
    <h2>9. Cookies</h2>
    <p>Lo explicamos en la <a href="/cookies/">Política de cookies</a>.</p>
    <h2>10. Cambios</h2>
    <p>Si cambiamos esta política, publicaremos la nueva versión en esta página con su fecha.</p>
  </div>
</section>`,
  },

  {
    path: "/terminos/", file: "terminos/index.html", light: true,
    title: "Términos y condiciones | E.F.O. Ltda.",
    desc: "Condiciones de uso del sitio de E.F.O. Ltda.: datos de la empresa, información de productos, cotizaciones, marcas, créditos de imágenes y ley aplicable.",
    body: `
<section class="sec" style="padding-top:calc(var(--header) + 72px)">
  <div class="wrap legal">
    <h1 class="d2">Términos y condiciones</h1>
    <p>Última actualización: 5 de noviembre de 2026.</p>
    <h2>1. Datos de la empresa</h2>
    <div class="datos">
      <p><b>${SITE.legal}</b> (nombre comercial: E.F.O. Ltda.)</p>
      <p>NIT ${SITE.nit} · Registro ANH ${SITE.anh}</p>
      <p>${SITE.addr1}, ${SITE.addr2}</p>
      <p>WhatsApp ${SITE.waDisplay} · <a href="mailto:${SITE.mail}">${SITE.mail}</a></p>
      <p>Horario de atención: ${SITE.horario}</p>
    </div>
    <h2>2. Uso del sitio</h2>
    <p>Este sitio presenta los productos y servicios de E.F.O.: importación y venta de diésel ULSD, energía solar fotovoltaica, soluciones energéticas y electromovilidad. Al usarlo aceptas estos términos. Te pedimos usarlo de buena fe y no intentar dañarlo, copiarlo de forma masiva ni usarlo para fines ilícitos.</p>
    <h2>3. Información de productos</h2>
    <ul>
      <li>La información del sitio es referencial y no es una oferta vinculante. El sitio no publica precios.</li>
      <li>Precio, cantidades, plazos, lugar de entrega, forma de pago y garantía se fijan por escrito en cada cotización o contrato, que prevalece sobre lo que dice el sitio.</li>
      <li>Las fichas técnicas de los equipos se traducen de los catálogos de sus fabricantes y pueden cambiar sin previo aviso.</li>
      <li>Los resultados de laboratorio del diésel ULSD corresponden a un lote analizado y pueden variar entre importaciones. El certificado de cada lote está disponible a pedido.</li>
    </ul>
    <h2>4. Cotizaciones y contratación</h2>
    <p>Las consultas enviadas por el sitio no obligan a ninguna de las partes. La venta se concreta cuando aceptas por escrito una cotización o firmas un contrato. Para el diésel ULSD, el pedido mínimo es de 10.000 litros (10 m³). Las devoluciones y reembolsos siguen la <a href="/devoluciones/">Política de devoluciones y reembolsos</a>.</p>
    <h2>5. Fotografías y proyectos</h2>
    <p>Varias fotografías del sitio son referenciales: provienen de bancos de imágenes y no muestran instalaciones, personal ni clientes de E.F.O. Los proyectos indican su estado; los marcados como «conceptuales» son propuestas, no obras terminadas.</p>
    <h2>6. Propiedad intelectual y marcas</h2>
    <p>Los textos, el diseño y el logotipo de E.F.O. pertenecen a E.F.O. Ltda. Lumosenergy, Huawei, YouTube, Google Maps y WhatsApp son marcas de sus respectivos titulares. Las mencionamos para identificar los equipos y servicios que usamos o comercializamos; su mención no significa que esas empresas respalden este sitio.</p>
    <h2>7. Créditos de imágenes, música y mapas</h2>
    <table>
      <thead><tr><th>Contenido</th><th>Origen y licencia</th></tr></thead>
      <tbody>
        <tr><td>Fotografías y videos de ambiente</td><td>Pexels (pexels.com), licencia de uso libre de Pexels. Son imágenes referenciales.</td></tr>
        <tr><td>Foto del minibús Toyota Coaster</td><td>Dinkun Chen, Wikimedia Commons, licencia <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.es" target="_blank" rel="noopener">CC BY-SA 4.0</a>.</td></tr>
        <tr><td>Imágenes y datos de los cargadores</td><td>Catálogo del fabricante Lumosenergy, usado para presentar los equipos que comercializa E.F.O.</td></tr>
        <tr><td>Mapas de Bolivia y del mundo</td><td>Elaborados con datos de Natural Earth (dominio público).</td></tr>
        <tr><td>Música de fondo</td><td>«Patria Inmortal», Salomé Rock Band, reproducida con el reproductor oficial de YouTube. Los derechos pertenecen a sus autores.</td></tr>
        <tr><td>Tipografía</td><td>Manrope, licencia SIL Open Font License.</td></tr>
      </tbody>
    </table>
    <h2>8. Enlaces y servicios externos</h2>
    <p>El sitio enlaza a WhatsApp, redes sociales, YouTube y Google Maps. No controlamos esos servicios ni respondemos por su contenido o sus políticas.</p>
    <h2>9. Responsabilidad</h2>
    <p>Cuidamos que la información sea correcta y esté actualizada, pero puede contener errores o quedar desactualizada; si encuentras uno, avísanos y lo corregimos. No garantizamos que el sitio esté disponible sin interrupciones. Nada de lo dicho aquí limita los derechos que la Ley N.° 453 reconoce a usuarios y consumidores.</p>
    <h2>10. Ley aplicable</h2>
    <p>Estos términos se rigen por las leyes del Estado Plurinacional de Bolivia. Cualquier controversia se tratará primero de forma directa y, si no hay acuerdo, ante las autoridades competentes de Santa Cruz de la Sierra, sin perjuicio de los derechos del consumidor.</p>
    <h2>11. Cambios</h2>
    <p>Podemos actualizar estos términos. La versión vigente es la publicada en esta página.</p>
  </div>
</section>`,
  },

  {
    path: "/cookies/", file: "cookies/index.html", light: true,
    title: "Política de cookies | E.F.O. Ltda.",
    desc: "Qué guarda el sitio de E.F.O. en tu navegador, qué servicios de terceros usan cookies y cómo aceptar o rechazar su uso.",
    body: `
<section class="sec" style="padding-top:calc(var(--header) + 72px)">
  <div class="wrap legal">
    <h1 class="d2">Política de cookies</h1>
    <p>Última actualización: 5 de noviembre de 2026.</p>
    <h2>1. Qué son</h2>
    <p>Las cookies y el almacenamiento local son pequeños datos que un sitio guarda en tu navegador para recordar información entre visitas o entre páginas.</p>
    <h2>2. ¿Hace falta tu consentimiento?</h2>
    <p>En Bolivia no existe por ahora una ley específica de cookies. Aun así, por respeto a tu privacidad y para cumplir también con las reglas de otros países, no cargamos ningún servicio de terceros que pueda usar cookies hasta que lo aceptas. Puedes aceptar o rechazar con la misma facilidad.</p>
    <h2>3. Lo que guarda este sitio</h2>
    <p>E.F.O. no usa cookies propias de publicidad ni de medición de visitas. Solo guarda en tu navegador:</p>
    <table>
      <thead><tr><th>Nombre</th><th>Tipo</th><th>Para qué</th><th>Duración</th></tr></thead>
      <tbody>
        <tr><td>efo-consent</td><td>Almacenamiento local</td><td>Recordar si aceptaste o rechazaste el contenido de terceros</td><td>Hasta que lo borres</td></tr>
        <tr><td>efo-musica-t, efo-musica-mute</td><td>Almacenamiento de sesión</td><td>Seguir la música en el mismo minuto al cambiar de página y recordar si la silenciaste</td><td>Hasta cerrar la pestaña</td></tr>
        <tr><td>__cf_bm u otras de Cloudflare</td><td>Cookie técnica</td><td>Seguridad: distinguir personas de robots y frenar ataques. Solo aparece si Cloudflare la necesita</td><td>Hasta 30 minutos</td></tr>
      </tbody>
    </table>
    <p>Estas son necesarias para que el sitio funcione y sea seguro, y no requieren consentimiento.</p>
    <h2>4. Servicios de terceros (solo si aceptas)</h2>
    <table>
      <thead><tr><th>Servicio</th><th>Dónde</th><th>Qué puede guardar</th></tr></thead>
      <tbody>
        <tr><td>YouTube, en modo de privacidad mejorada (youtube-nocookie.com)</td><td>Música de fondo, en todas las páginas</td><td>Al reproducir, datos en tu navegador para el funcionamiento y las estadísticas del reproductor</td></tr>
        <tr><td>Google Maps</td><td>Mapa de la página de Contacto</td><td>Cookies de Google, como NID, para preferencias y seguridad</td></tr>
      </tbody>
    </table>
    <p>Google explica su uso de cookies en <a href="https://policies.google.com/technologies/cookies?hl=es" target="_blank" rel="noopener">policies.google.com/technologies/cookies</a>.</p>
    <h2>5. Medición de visitas</h2>
    <p>Por ahora el sitio no usa Google Analytics ni otra herramienta de medición. Si en el futuro activamos una, lo indicaremos en esta página antes de hacerlo.</p>
    <h2>6. Cómo cambiar tu elección</h2>
    <p>Puedes cambiarla cuando quieras con el botón «Configurar cookies» del pie de página, o aquí mismo:</p>
    <p><button type="button" class="btn btn-cyan" data-consent-open>Configurar cookies</button></p>
    <p>También puedes borrar las cookies y el almacenamiento del sitio desde la configuración de tu navegador.</p>
  </div>
</section>`,
  },

  {
    path: "/devoluciones/", file: "devoluciones/index.html", light: true,
    title: "Devoluciones y reembolsos | E.F.O. Ltda.",
    desc: "Condiciones de E.F.O. Ltda. para reclamos, garantías, cancelaciones, devoluciones y reembolsos de diésel ULSD, equipos e instalaciones.",
    body: `
<section class="sec" style="padding-top:calc(var(--header) + 72px)">
  <div class="wrap legal">
    <h1 class="d2">Política de devoluciones y reembolsos</h1>
    <p>Última actualización: 5 de noviembre de 2026.</p>
    <h2>1. Alcance</h2>
    <p>Esta política se aplica a las compras de diésel ULSD, equipos (cargadores para vehículos eléctricos, sistemas solares y baterías) y servicios de instalación de E.F.O. El sitio no vende en línea ni cobra pagos: cada compra se hace con una cotización aceptada o un contrato, que puede fijar condiciones particulares. Lo que diga la cotización o el contrato prevalece, sin reducir tus derechos según la Ley N.° 453.</p>
    <h2>2. Diésel ULSD</h2>
    <ul>
      <li>Revisa la cantidad y el estado del producto al momento de la entrega, y anota cualquier observación en la nota de entrega.</li>
      <li>Por ser un combustible entregado a granel, no se aceptan devoluciones por cambio de opinión una vez descargado en tus tanques.</li>
      <li>Si la cantidad entregada es menor a la facturada, o la calidad no cumple las especificaciones acordadas, avísanos de inmediato y antes de usar o mezclar el producto. Tomaremos muestras, revisaremos el caso y, si corresponde, repondremos la diferencia o te devolveremos el importe proporcional.</li>
    </ul>
    <h2>3. Equipos e instalaciones</h2>
    <ul>
      <li>Los equipos de energía solar tienen 2 años de garantía. Los demás equipos tienen la garantía del fabricante que se indique en la cotización.</li>
      <li>Si un equipo llega dañado o presenta una falla de fábrica dentro de la garantía, lo reparamos, lo reemplazamos o te devolvemos lo pagado por él.</li>
      <li>Los defectos de instalación hechos por E.F.O. se corrigen sin costo durante el plazo de garantía de la instalación indicado en la cotización.</li>
      <li>La garantía no cubre el mal uso, las modificaciones o instalaciones hechas por terceros, ni los daños por causas externas (golpes, agua o fallas de la red eléctrica), salvo que la cotización diga otra cosa.</li>
    </ul>
    <h2>4. Cancelaciones</h2>
    <p>Puedes cancelar un pedido antes de su despacho. Te devolvemos lo pagado, descontando solo los costos ya realizados y justificados con documentos, como el transporte o la importación de equipos traídos a pedido, según la cotización.</p>
    <h2>5. Reembolsos</h2>
    <p>Cuando corresponda un reembolso, lo haremos por el mismo medio de pago o por transferencia bancaria, en un plazo máximo de 30 días calendario (un mes) desde que aprobemos el caso.</p>
    <h2>6. Cómo hacer un reclamo</h2>
    <p>Escríbenos por WhatsApp al ${SITE.waDisplay} o a <a href="mailto:${SITE.mail}">${SITE.mail}</a> con tu factura o número de pedido, una descripción del problema y fotos si es posible. Te respondemos en un plazo máximo de 10 días hábiles. Si no quedas conforme, puedes acudir al Viceministerio de Defensa de los Derechos del Usuario y del Consumidor.</p>
    <h2>7. Datos de la empresa</h2>
    <div class="datos">
      <p><b>${SITE.legal}</b> (nombre comercial: E.F.O. Ltda.)</p>
      <p>NIT ${SITE.nit} · Registro ANH ${SITE.anh}</p>
      <p>${SITE.addr1}, ${SITE.addr2}</p>
      <p>WhatsApp ${SITE.waDisplay} · <a href="mailto:${SITE.mail}">${SITE.mail}</a></p>
      <p>Horario de atención: ${SITE.horario}</p>
    </div>
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
