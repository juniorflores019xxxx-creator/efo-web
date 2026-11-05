// Genera la ficha técnica del diésel ULSD de E.F.O. (PDF A4, una página)
// Uso: node tools/ficha-diesel.mjs  -> public_html/assets/docs/ficha-tecnica-diesel-ulsd-efo.pdf
// Los valores salen del análisis de laboratorio de un lote importado (junio de 2026).
// Es la ficha del producto de E.F.O.; no reemplaza ni reproduce el certificado de análisis del laboratorio.
import { spawn } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUB = join(ROOT, "public_html");
const OUT = join(PUB, "assets", "docs", "ficha-tecnica-diesel-ulsd-efo.pdf");
const logo = `data:image/webp;base64,${readFileSync(join(PUB, "assets/img/logo-efo.webp")).toString("base64")}`;

// [ensayo, método, límite de referencia, resultado, unidad]
const F = [
  ["Azufre total", "ASTM D5453", "Máx. 50", "9,5", "mg/kg (ppm)"],
  ["Densidad a 15 °C", "ASTM D4052", "—", "0,838", "kg/l"],
  ["Gravedad específica 15,6/15,6 °C", "ASTM D4052", "0,800 – 0,880", "0,8384", "—"],
  ["Índice de cetano calculado", "ASTM D976", "Mín. 45,0", "50,3", "—"],
  ["Punto de inflamación", "ASTM D93", "Mín. 38,0", "58,0", "°C"],
  ["Viscosidad cinemática a 40 °C", "ASTM D445", "1,3 – 5,5", "2,433", "cSt"],
  ["Punto de fluidez", "ASTM D97", "Máx. −1", "< −21", "°C"],
  ["Destilación, 90 % recuperado", "ASTM D86", "282 – 382", "331,9", "°C"],
  ["Agua y sedimentos", "ASTM D2709", "Máx. 0,05", "< 0,05", "% vol"],
  ["Corrosión a la lámina de cobre (3 h a 100 °C)", "ASTM D130", "Máx. 1", "1A", "—"],
  ["Cenizas", "ASTM D482", "Máx. 0,02", "< 0,010", "% m/m"],
  ["Residuo de carbón Conradson (10 % fondo)", "ASTM D189", "Máx. 0,30", "0,02", "% peso"],
  ["Contenido de biodiésel (FAME)", "EN 14078", "0", "No detectado", "% v/v"],
  ["Aspecto", "Visual", "Cristalino", "Cristalino", "—"],
];

const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Ficha técnica · Diésel ULSD · E.F.O. Ltda.</title>
<style>
@page { size: A4; margin: 0; }
* { box-sizing: border-box; }
body { margin: 0; font: 9.4pt/1.45 "Segoe UI", Arial, sans-serif; color: #031F36; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.pg { width: 210mm; height: 297mm; padding: 14mm 15mm 16mm; position: relative; overflow: hidden; }
header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #00AEEF; padding-bottom: 7px; }
header img { height: 13mm; }
header .r { text-align: right; font-size: 8pt; color: #52697D; line-height: 1.5; }
header .r b { color: #031F36; font-size: 9pt; }
.kick { margin: 8mm 0 0; font-size: 8pt; font-weight: 800; letter-spacing: .18em; text-transform: uppercase; color: #0079B8; }
h1 { margin: 2px 0 2px; font-size: 24pt; line-height: 1.1; letter-spacing: -.02em; }
.sub { margin: 0 0 5mm; font-size: 11pt; color: #063B66; font-weight: 700; }
.desc { margin: 0 0 5mm; color: #33536E; }
.cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 3mm; margin-bottom: 6mm; }
.cards div { background: #F1F5F9; border-radius: 3mm; padding: 3mm 3.5mm; }
.cards small { display: block; font-size: 7pt; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; color: #52697D; }
.cards b { font-size: 10.5pt; }
h2 { margin: 0 0 2mm; font-size: 11pt; }
table { width: 100%; border-collapse: collapse; }
th, td { text-align: left; padding: 4px 7px; border-bottom: 1px solid #E3EBF2; vertical-align: top; }
thead th { background: #063B66; color: #fff; font-size: 7.6pt; letter-spacing: .1em; text-transform: uppercase; }
tbody th { font-weight: 600; }
td.res { font-weight: 800; color: #063B66; white-space: nowrap; }
td.m, td.l, td.u { color: #52697D; white-space: nowrap; }
.apps { margin-top: 5mm; display: grid; grid-template-columns: 1fr 1fr; gap: 5mm; }
.apps ul { margin: 0; padding-left: 14px; } .apps li::marker { color: #39A935; }
.nota { margin-top: 5mm; font-size: 7.8pt; color: #52697D; }
footer { position: absolute; left: 15mm; right: 15mm; bottom: 8mm; display: flex; justify-content: space-between; gap: 6mm; font-size: 7.4pt; color: #52697D; border-top: 1px solid #E3EBF2; padding-top: 4px; }
</style></head><body><section class="pg">
<header><img src="${logo}" alt="E.F.O. Ltda."><div class="r"><b>Energía y Fuerza del Oriente Ltda.</b><br>NIT 710528026 · Registro ANH ANH15196<br>Av. Montecristo No. 205, Santa Cruz de la Sierra, Bolivia</div></header>
<p class="kick">Ficha técnica de producto</p>
<h1>Diésel ULSD</h1>
<p class="sub">Ultra Low Sulfur Diesel · Diésel de ultra bajo contenido de azufre</p>
<p class="desc">Combustible diésel importado por E.F.O. Ltda. para transporte, maquinaria, generación eléctrica e industria. Su contenido de azufre ultra bajo protege los sistemas de inyección <i>common rail</i> y los filtros de partículas de los motores modernos, y reduce el humo, el hollín y las emisiones.</p>
<div class="cards">
  <div><small>Azufre</small><b>9,5 ppm</b></div>
  <div><small>Índice de cetano</small><b>50,3</b></div>
  <div><small>Punto de inflamación</small><b>58 °C</b></div>
  <div><small>Biodiésel (FAME)</small><b>No contiene</b></div>
</div>
<h2>Resultados de laboratorio</h2>
<table>
  <thead><tr><th>Ensayo</th><th>Método</th><th>Límite de referencia</th><th>Resultado</th><th>Unidad</th></tr></thead>
  <tbody>${F.map(([a, m, l, r, u]) => `<tr><th>${a}</th><td class="m">${m}</td><td class="l">${l}</td><td class="res">${r}</td><td class="u">${u}</td></tr>`).join("")}</tbody>
</table>
<div class="apps">
  <div><h2>Usos recomendados</h2><ul><li>Transporte pesado y flotas</li><li>Maquinaria agrícola, de construcción y minería</li><li>Generadores y equipos industriales</li><li>Motores diésel de última generación</li></ul></div>
  <div><h2>Condiciones de venta</h2><ul><li>Pedido mínimo: 10.000 litros (10 m³)</li><li>Entrega en los nueve departamentos de Bolivia</li><li>Pago por transferencia, contado, QR o crédito a empresas</li><li>Horario: lunes a viernes, de 8:30 a 16:30</li></ul></div>
</div>
<p class="nota">Valores obtenidos en el análisis de laboratorio independiente de un lote de diésel ULSD importado por E.F.O. (muestra tomada el 12 de junio de 2026, tras la descarga del buque). Los resultados pueden variar ligeramente entre lotes. El certificado de análisis de cada lote está disponible a pedido del cliente.</p>
<footer><span>E.F.O. Ltda. · WhatsApp +591 69540072 · gerencia@efo.com.bo · efo.com.bo</span><span>Ficha técnica · Diésel ULSD · Noviembre 2026</span></footer>
</section></body></html>`;

const tmp = mkdtempSync(join(tmpdir(), "ficha-"));
const htmlPath = join(tmp, "ficha.html");
writeFileSync(htmlPath, html);
const port = 9600 + Math.floor(Math.random() * 200);
const chrome = spawn("C:/Program Files/Google/Chrome/Application/chrome.exe", ["--headless=new", "--disable-gpu", `--remote-debugging-port=${port}`, `--user-data-dir=${join(tmp, "u")}`, "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let list; for (let i = 0; i < 40; i++) { try { list = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); if (list.length) break; } catch {} await sleep(250); }
const ws = new WebSocket(list.find((t) => t.type === "page").webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r));
let id = 0; const pend = new Map();
ws.addEventListener("message", (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } });
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
await send("Page.enable");
await send("Page.navigate", { url: "file:///" + htmlPath.replace(/\\/g, "/") });
await sleep(2000);
const r = await send("Page.printToPDF", { printBackground: true, preferCSSPageSize: true });
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, Buffer.from(r.result.data, "base64"));
ws.close(); chrome.kill();
console.log("PDF:", OUT, Math.round(readFileSync(OUT).length / 1024), "KB");
process.exit(0);
