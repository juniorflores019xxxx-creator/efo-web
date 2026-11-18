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
  nit: "710528026",
  anh: "ANH15196",
  horario: "Lunes a viernes, de 8:30 a 16:30",
  maps: "https://maps.app.goo.gl/QxnyoJD3i1cC6VEr5",
  lat: -17.7628127,
  lng: -63.1114668,
  mapsEmbed: "https://maps.google.com/maps?q=Energ%C3%ADa+y+Fuerza+del+Oriente+E.F.O.+Ltda,+Santa+Cruz+de+la+Sierra&ftid=0x93f1e7000f1efadf:0xe01388ee9b6e1ff8&z=16&hl=es&output=embed",
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

export const SOCIALS = [
  ["Facebook", "https://www.facebook.com/share/18zpmEWnNK/", '<path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.6 1.6-1.6h1.7V3.8c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V10H7.3v3h2.8v8h3.4Z"/>'],
  ["TikTok", "https://www.tiktok.com/@efoenergia?_r=1&_t=ZS-9B8NApyhLym", '<path d="M19.6 8.2a6.1 6.1 0 0 1-3.7-1.3v7.4a5.4 5.4 0 1 1-4.7-5.3v3a2.4 2.4 0 1 0 1.7 2.3V3.2h3a6.1 6.1 0 0 0 3.7 3.7v1.3Z"/>'],
  ["Instagram", "https://www.instagram.com/energiafuerzadeloriente?mdxt=ZGt4dGtkdDZueGt0", '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle class="social-icon-dot" cx="17.6" cy="6.8" r="1"/>'],
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
  sol: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6"/>',
  panel: '<path d="M4.5 4h15l1.5 11H3Z"/><path d="M3.8 9.5h16.4M9.5 4l-.6 11M14.5 4l.6 11M12 15v5M8 20h8"/>',
  bandera: '<path d="M5 21V4M5 4.5h11l-2 3.7 2 3.8H5"/>',
  maletin: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 12.5h18"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/>',
  pin: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.4"/>',
  flecha: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  menu: '<path d="M4 8h16M4 16h16"/>',
  cerrar: '<path d="M6 6l12 12M18 6 6 18"/>',
  sonido: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>',
  silencio: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="m16 9.5 5 5M21 9.5l-5 5"/>',
  reloj: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  escudo: '<path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.2 7.5 9.5 4.3-1.3 7.5-4.9 7.5-9.5V6Z"/><path d="m8.8 12 2.3 2.3 4.2-4.6"/>',
  pago: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18M7 14.5h4"/>',
  musica: '<path d="M9 18V5.5l11-2.5v12.5"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="15.5" r="2.5"/>',
};
const WA_PATH = '<path class="ico-fill" d="M12 2.2a9.7 9.7 0 0 0-8.4 14.6L2.3 21.7l5-1.3A9.7 9.7 0 1 0 12 2.2Zm0 17.7a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 19.9Zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1 4.9 4.9 0 0 0 1 2.6 11.2 11.2 0 0 0 4.3 3.8c1.6.7 2.2.7 3 .6a2.6 2.6 0 0 0 1.7-1.2 2.1 2.1 0 0 0 .1-1.2c0-.1-.2-.2-.4-.3Z"/>';

export const icon = (name, cls = "") =>
  name === "whatsapp"
    ? `<svg class="ico ${cls}" viewBox="0 0 24 24" aria-hidden="true">${WA_PATH}</svg>`
    : `<svg class="ico ${name === "flecha" ? "ico-arrow" : ""} ${cls}" viewBox="0 0 24 24" aria-hidden="true">${P[name]}</svg>`;

/* ---------- Fotos ---------- */
const DIM = { coaster: [2200, 1325], "biotil-render": [1792, 1027], "biotil-aerea": [2200, 1292], "biotil-plano": [2200, 2213], camion: [2200, 3919], "carga-blanco": [2200, 1650], carga: [2200, 2933], carretera: [2200, 1650], electrolinera: [2200, 1650], "estacion-noche": [2200, 1238], flota: [2200, 1181], "refineria-noche": [2200, 1478], "refineria-tarde": [2200, 2324], silos: [2200, 1466], subestacion: [2200, 1650], torres: [2200, 1468], "tranvia-scz": [2200, 1467], "diesel-cisterna": [2200, 1466], "diesel-tanques": [2200, 1560], "diesel-surtidor": [2200, 2248], "solar-campo": [2200, 2368], "solar-aereo": [2200, 1466], "solar-evaluacion": [2200, 1466], "solar-diseno": [2200, 1466], "solar-equipos": [2200, 2934], "solar-montaje": [2200, 1470], "solar-conexion": [2200, 1370], "solar-puesta": [2200, 1467], "solar-mantenimiento": [2200, 1466] };
export const pic = (name, alt, { sizes = "100vw", lazy = true, attrs = "" } = {}) => {
  const [w, h] = DIM[name];
  return `<img src="/assets/foto/${name}-xl.webp" srcset="/assets/foto/${name}-md.webp 1100w, /assets/foto/${name}-xl.webp 2200w" sizes="${sizes}" alt="${alt}" width="${w}" height="${h}"${lazy ? ' loading="lazy" decoding="async"' : ' fetchpriority="high"'}${attrs ? " " + attrs : ""}>`;
};
export const lines = (...ls) => ls.map((l) => `<span class="ln"><span>${l}</span></span>`).join("");
export const words = (html) => html.replace(/(<[^>]+>)|([^\s<]+)/g, (m, tag, w) => (tag ? tag : `<span class="w">${w}</span>`));

/* ---------- Componentes ---------- */
export const TIPOS = ["Combustibles", "Diésel ULSD", "Importación", "Energía solar", "Soluciones energéticas", "Electromovilidad", "Electrolineras", "Cargadores", "Conversión de vehículos", "Proyectos", "Otro"];

const DEPTOS = ["Santa Cruz", "La Paz", "Cochabamba", "Chuquisaca", "Oruro", "Potosí", "Tarija", "Beni", "Pando"];
export const CARGADORES = ["AC22 Turbo (7, 11 o 22 kW)", "DA30 Compact (30 kW DC)", "DA60 Fast (60 kW DC)", "DA180 Fast (180 kW DC)", "DA240 Fast (240 kW DC)", "DA480 Ultra-fast (480 kW DC)", "DC480 Cabinet + DD300 (carga distribuida)", "Almacenamiento de energía (baterías)", "No sé, necesito asesoría"];
// Campos extra que pide cada tipo de consulta (grupo -> tipos). El CRM (crm/_lib.php) usa los mismos grupos.
export const GRUPOS = { diesel: ["Combustibles", "Diésel ULSD", "Importación"], solar: ["Energía solar"], cargadores: ["Electromovilidad", "Electrolineras", "Cargadores"], conversion: ["Conversión de vehículos"] };
const opts = (a, ph = "Elige una opción", sel = "") => `<option value="">${ph}</option>` + a.map((t) => `<option${t === sel ? " selected" : ""}>${t}</option>`).join("");
const fld = (id, name, label, input, { full = false, opt = false, err = "" } = {}) =>
  `<div class="field${full ? " full" : ""}"><label for="${id}-${name}">${label}${opt ? ' <span class="opt">(opcional)</span>' : ""}</label>${input}${err ? `<span class="err">${err}</span>` : ""}</div>`;

export const contactForm = (id = "f", { tipo = "" } = {}) => `
<form class="form" data-reveal data-contact novalidate aria-label="Formulario de solicitud de cotización" enctype="multipart/form-data">
  <div class="hp" aria-hidden="true"><label>No completar <input name="web_empresa" tabindex="-1" autocomplete="off"></label></div>
  <div class="field"><label for="${id}-nombre">Nombre</label><input id="${id}-nombre" name="nombre" autocomplete="name" maxlength="120" required><span class="err">Escribe tu nombre.</span></div>
  <div class="field"><label for="${id}-empresa">Empresa <span class="opt">(opcional)</span></label><input id="${id}-empresa" name="empresa" autocomplete="organization" maxlength="120"></div>
  <div class="field"><label for="${id}-tel">Teléfono o WhatsApp</label><input id="${id}-tel" name="telefono" type="tel" inputmode="tel" autocomplete="tel" placeholder="+591 7…" maxlength="30" required><span class="err">Escribe un número válido.</span></div>
  <div class="field"><label for="${id}-correo">Correo electrónico <span class="opt">(opcional)</span></label><input id="${id}-correo" name="correo" type="email" autocomplete="email" maxlength="120"><span class="err">Revisa el correo.</span></div>
  <div class="field"><label for="${id}-tipo">Tipo de consulta</label><select id="${id}-tipo" name="tipo" required>${opts(TIPOS, "Elige una opción", tipo)}</select><span class="err">Elige el tipo de consulta.</span></div>
  <div class="field"><label for="${id}-ciudad">Departamento</label><select id="${id}-ciudad" name="ciudad" required>${opts(DEPTOS)}</select><span class="err">Elige el departamento.</span></div>

  <fieldset class="grupo full" data-grupo="diesel" hidden><legend>Datos para cotizar diésel ULSD</legend><div class="grupo-in">
    ${fld(id, "d_litros", "Litros por mes", `<input id="${id}-d_litros" name="d_litros" type="number" inputmode="numeric" min="1" step="1" placeholder="Ej.: 20000" data-req>`, { err: "Escribe los litros que necesitas por mes." })}
    ${fld(id, "d_frecuencia", "Frecuencia de compra", `<select id="${id}-d_frecuencia" name="d_frecuencia" data-req>${opts(["Compra única", "Semanal", "Quincenal", "Mensual"])}</select>`, { err: "Elige la frecuencia." })}
    ${fld(id, "d_uso", "Uso principal", `<select id="${id}-d_uso" name="d_uso">${opts(["Transporte y flotas", "Maquinaria agrícola o de construcción", "Minería", "Generación eléctrica", "Industria", "Otro"])}</select>`, { opt: true })}
    ${fld(id, "d_tanque", "¿Tienes tanque propio?", `<select id="${id}-d_tanque" name="d_tanque">${opts(["Sí", "No"])}</select>`, { opt: true })}
    ${fld(id, "d_lugar", "Lugar de entrega (localidad o dirección)", `<input id="${id}-d_lugar" name="d_lugar" maxlength="200" placeholder="Ej.: Parque Industrial, Santa Cruz">`, { full: true, opt: true })}
    <p class="note full">Pedido mínimo: 10.000 litros (10 m³).</p>
  </div></fieldset>

  <fieldset class="grupo full" data-grupo="solar" hidden><legend>Datos de tu factura de luz</legend><div class="grupo-in">
    ${fld(id, "s_kwh", "Consumo mensual (kWh)", `<input id="${id}-s_kwh" name="s_kwh" type="number" inputmode="decimal" min="1" step="any" placeholder="Ej.: 650" data-req>`, { err: "Escribe el consumo en kWh que dice tu factura." })}
    ${fld(id, "s_dias", "Días del período facturado", `<input id="${id}-s_dias" name="s_dias" type="number" inputmode="numeric" min="1" max="62" step="1" value="30">`, { opt: true })}
    ${fld(id, "s_distribuidora", "Distribuidora", `<select id="${id}-s_distribuidora" name="s_distribuidora">${opts(["CRE", "DELAPAZ", "ELFEC", "ENDE", "SEPSA", "SETAR", "Otra"])}</select>`, { opt: true })}
    ${fld(id, "s_modalidad", "Tipo de sistema", `<select id="${id}-s_modalidad" name="s_modalidad">${opts(["On-Grid (conectado a la red, sin baterías)", "Híbrido (red + baterías de respaldo)", "Off-Grid (aislado, sin red eléctrica)", "No sé, necesito asesoría"])}</select>`, { opt: true })}
    ${fld(id, "s_inmueble", "Tipo de inmueble", `<select id="${id}-s_inmueble" name="s_inmueble">${opts(["Vivienda", "Comercio u oficina", "Industria", "Propiedad rural o agrícola", "Otro"])}</select>`, { opt: true })}
    ${fld(id, "s_techo", "Dónde se instalarían los paneles", `<select id="${id}-s_techo" name="s_techo">${opts(["Techo de losa", "Techo de calamina", "Techo de teja", "En el suelo", "No sé"])}</select>`, { opt: true })}
    <div class="field full"><label for="${id}-factura">Foto o PDF de tu factura de luz <span class="opt">(opcional, recomendado)</span></label><input id="${id}-factura" name="factura" type="file" accept="image/jpeg,image/png,image/webp,application/pdf"><span class="err">El archivo debe ser JPG, PNG, WEBP o PDF de hasta 8 MB.</span></div>
    <p class="note full">El consumo en kWh aparece en tu factura como «Consumo» o «Energía consumida».</p>
    <div class="estimado full" data-estimado hidden aria-live="polite">
      <p class="est-t">${icon("sol")} Tu sistema estimado</p>
      <ul class="est-d"><li><b data-e="paneles">—</b><span>paneles de 550 W</span></li><li><b data-e="kwp">—</b><span>kWp de potencia</span></li><li><b data-e="inv">—</b><span>kW de inversor</span></li><li data-e-bat><b data-e="bat">—</b><span>baterías de respaldo</span></li></ul>
      <p class="est-n">Estimado referencial calculado con tu consumo. E.F.O. confirma el diseño y el precio final con una visita técnica.</p>
    </div>
  </div></fieldset>

  <fieldset class="grupo full" data-grupo="cargadores" hidden><legend>Datos para tu proyecto de carga</legend><div class="grupo-in">
    ${fld(id, "c_equipo", "Equipo de interés", `<select id="${id}-c_equipo" name="c_equipo" data-req>${opts(CARGADORES)}</select>`, { err: "Elige un equipo." })}
    ${fld(id, "c_cantidad", "Cantidad de cargadores", `<input id="${id}-c_cantidad" name="c_cantidad" type="number" inputmode="numeric" min="1" step="1" value="1">`, { opt: true })}
    ${fld(id, "c_lugar", "Dónde se instalaría", `<select id="${id}-c_lugar" name="c_lugar">${opts(["Vivienda", "Empresa u oficina", "Flota de vehículos", "Estación de carga pública", "Hotel o comercio", "Otro"])}</select>`, { opt: true })}
    ${fld(id, "c_vehiculo", "Vehículo(s) a cargar", `<input id="${id}-c_vehiculo" name="c_vehiculo" maxlength="160" placeholder="Ej.: BYD Dolphin, buses eléctricos…">`, { opt: true })}
    ${fld(id, "c_distancia", "Distancia aproximada al tablero eléctrico (m)", `<input id="${id}-c_distancia" name="c_distancia" type="number" inputmode="numeric" min="0" step="1">`, { opt: true })}
    ${fld(id, "c_red", "Conexión eléctrica disponible", `<select id="${id}-c_red" name="c_red">${opts(["Monofásica (220 V)", "Trifásica (380 V)", "No sé"])}</select>`, { opt: true })}
  </div></fieldset>

  <fieldset class="grupo full" data-grupo="conversion" hidden><legend>Datos de tu vehículo</legend><div class="grupo-in">
    ${fld(id, "v_marca", "Marca y modelo", `<input id="${id}-v_marca" name="v_marca" maxlength="120" placeholder="Ej.: Toyota Hiace" data-req>`, { err: "Escribe la marca y el modelo." })}
    ${fld(id, "v_anio", "Año", `<input id="${id}-v_anio" name="v_anio" type="number" inputmode="numeric" min="1950" max="2030" step="1">`, { opt: true })}
    ${fld(id, "v_uso", "Uso del vehículo", `<select id="${id}-v_uso" name="v_uso">${opts(["Particular", "Flota de empresa", "Transporte público", "Carga o reparto", "Otro"])}</select>`, { opt: true })}
    ${fld(id, "v_km", "Kilómetros por día (aprox.)", `<input id="${id}-v_km" name="v_km" type="number" inputmode="numeric" min="0" step="1">`, { opt: true })}
    ${fld(id, "v_cantidad", "Cantidad de vehículos", `<input id="${id}-v_cantidad" name="v_cantidad" type="number" inputmode="numeric" min="1" step="1" value="1">`, { opt: true })}
  </div></fieldset>

  <div class="field full"><label for="${id}-msg">Mensaje <span class="opt" data-msg-opt hidden>(opcional)</span></label><textarea id="${id}-msg" name="mensaje" rows="4" maxlength="1500" placeholder="Cuéntanos qué necesitas: tipo de operación, ubicación, plazos…"></textarea><span class="err">Cuéntanos un poco más (al menos 10 caracteres).</span></div>
  <div class="field full chk-field"><label class="chk" for="${id}-acepto"><input id="${id}-acepto" name="acepto" type="checkbox" value="1" required><span>He leído y acepto la <a href="/privacidad/">Política de privacidad</a> y los <a href="/terminos/">Términos y condiciones</a>, y autorizo a E.F.O. a usar mis datos para responder esta solicitud.</span></label><span class="err">Para enviar la solicitud, marca esta casilla.</span></div>
  <div class="form-foot full">
    <div class="btns">
      <button class="btn btn-cyan btn-lg" type="submit" value="web">Enviar solicitud ${icon("flecha")}</button>
      <button class="btn btn-wa btn-lg" type="submit" value="whatsapp">${icon("whatsapp")} Enviar y abrir WhatsApp</button>
    </div>
    <p class="note">Tu solicitud llega directo al correo del equipo comercial de E.F.O. Usamos tus datos solo para responderte y enviarte tu cotización.</p>
    <p class="status" role="status" aria-live="polite"></p>
  </div>
</form>`;

export const contactData = () => `
<div class="card-data" data-reveal>
  <a href="${WA_URL}" target="_blank" rel="noopener"><span class="ci">${icon("whatsapp")}</span><span><small>WhatsApp</small><strong>${SITE.waDisplay}</strong></span></a>
  <a href="mailto:${SITE.mail}"><span class="ci">${icon("mail")}</span><span><small>Correo</small><strong>${SITE.mail}</strong></span></a>
  <a href="${SITE.maps}" target="_blank" rel="noopener"><span class="ci">${icon("pin")}</span><span><small>Dirección</small><strong>${SITE.addr1}<br>${SITE.addr2}</strong></span></a>
  <div><span class="ci">${icon("reloj")}</span><span><small>Horario de atención</small><strong>${SITE.horario}</strong></span></div>
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
<link rel="preload" href="/assets/fonts/manrope-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/efo.css?v=29">
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
        <p class="foot-legal">${SITE.legal}<br>NIT ${SITE.nit}<br>Registro ANH ${SITE.anh}</p>
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
          <span>${icon("reloj")}${SITE.horario}</span>
        </address>
        <h2 class="social-title">Redes sociales</h2>
        <nav class="social-links" aria-label="Redes sociales">${SOCIALS.map(([name, url, path]) => `<a href="${url}" target="_blank" rel="noopener noreferrer"><svg class="social-icon" viewBox="0 0 24 24" aria-hidden="true">${path}</svg><span>${name}</span></a>`).join("")}</nav>
      </div>
    </div>
  </div>
  <div class="wrap foot-bottom">
    <span>© <span data-year>2026</span> E.F.O. Ltda. · NIT ${SITE.nit} · Todos los derechos reservados.</span>
    <nav class="legal-links" aria-label="Información legal"><a href="/privacidad/">Privacidad</a><a href="/terminos/">Términos y condiciones</a><a href="/cookies/">Cookies</a><a href="/devoluciones/">Devoluciones y reembolsos</a><button type="button" class="linkbtn" data-consent-open>Configurar cookies</button></nav>
    <span class="made">Sitio web creado por <a href="https://sibnova.com.bo" target="_blank" rel="noopener">SIBNOVA LTDA.</a> · <a href="https://sibnova.com.bo" target="_blank" rel="noopener">sibnova.com.bo</a></span>
  </div>
</footer>
<aside class="floats" aria-label="Música y contacto rápido">
<div class="player" id="player" aria-label="Música de fondo">
  <div class="player-frame"><div id="yt"></div></div>
  <a class="player-link" href="https://youtu.be/hbCTWzxubbU?si=-p4NW8wQTXVIAHj-" target="_blank" rel="noopener"><b>Patria Inmortal</b> · Salomé Rock Band ${icon("flecha")}</a>
  <p class="player-error" role="status" aria-live="polite" hidden></p>
</div>
<button class="music" type="button" aria-label="Silenciar música">${icon("musica")}<span class="music-x" aria-hidden="true"><svg viewBox="0 0 12 12"><path d="M3.2 3.2l5.6 5.6M8.8 3.2l-5.6 5.6"/></svg></span><span class="music-tip" aria-hidden="true">Silenciar música</span></button>
<a class="wa" href="${WA_URL}" target="_blank" rel="noopener" aria-label="Escribir a E.F.O. por WhatsApp">${icon("whatsapp")}</a>
</aside>
<section class="consent" id="consent" aria-labelledby="consent-t" hidden>
  <div class="consent-in">
    <h2 id="consent-t" class="consent-h">Contenido de terceros y cookies</h2>
    <p>Este sitio no usa cookies de publicidad ni de medición. La música de fondo (YouTube) y el mapa (Google Maps) son servicios de Google que pueden guardar cookies en tu navegador. ¿Los permites? <a href="/cookies/">Política de cookies</a></p>
    <div class="consent-b"><button type="button" class="btn btn-cyan" data-consent="all">Aceptar</button><button type="button" class="btn btn-line" data-consent="none">Rechazar</button></div>
  </div>
</section>
<script src="/assets/vendor/gsap.min.js" defer></script>
<script src="/assets/vendor/ScrollTrigger.min.js" defer></script>
<script src="/assets/vendor/lenis.min.js" defer></script>
<script src="/assets/js/efo.js?v=24" defer></script>
<script>document.querySelectorAll("[data-year]").forEach(function(e){e.textContent=new Date().getFullYear()})</script>
</body>
</html>
`;
}
