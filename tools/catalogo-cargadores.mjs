// Genera el catálogo en español de los cargadores Lumosenergy que vende E.F.O. (PDF A4)
// Uso: node tools/catalogo-cargadores.mjs  -> public_html/assets/docs/catalogo-cargadores-efo.pdf
// Datos traducidos del catálogo del fabricante ("Overseas Compressed Catalogs.pdf").
import { spawn } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUB = join(ROOT, "public_html");
const OUT = join(PUB, "assets", "docs", "catalogo-cargadores-efo.pdf");
const img = (rel, type = "webp") => `data:image/${type};base64,${readFileSync(join(PUB, rel)).toString("base64")}`;

const AMB = (op = "−25 a 50 °C (de 50 a 65 °C con reducción de potencia)") => [
  ["Temperatura de operación", op],
  ["Temperatura de almacenamiento", "−40 a 70 °C"],
  ["Humedad", "5 % a 95 % sin condensación"],
  ["Altitud", "Hasta 2000 m (de 2000 a 4000 m con reducción de potencia)"],
  ["Refrigeración", "Aire forzado"],
];
const AUT = "App, tarjeta RFID, código QR, MAC Autocharge y Plug and Charge";
const COM = "ISO 15118 / ISO 15118-2 / DIN 70121 / VDV 261";
const CERT = "CE, UKCA, RCM, RoHS, REACH, EU RED Ciberseguridad";

const P = [
  {
    f: "ac22", n: "AC22 Turbo", k: "Cargador AC", pot: "7, 11 o 22 kW",
    d: "Cargador inteligente y flexible para hogares, oficinas, comercios, hoteles, flotas y estacionamientos públicos. Se instala en pared o sobre pedestal.",
    h: ["Versiones de 7, 11 y 22 kW, con cable (Case C) o con toma (Case B)", "Conexión WiFi, con LAN y 4G opcionales", "Protocolos OCPP 1.6J y OCPP 2.0.1", "Gestión dinámica local de la carga", "Protección IP65 (Case C) e IP54 (Case B)", "Protección diferencial Tipo A de 30 mA"],
    s: [
      ["Entrada", [["Modelos", "LCNA-7E · LCNA-11E · LCNA-22E (C: con cable / B: con toma)"], ["Potencia nominal", "7 kW · 11 kW · 22 kW"], ["Tensión de entrada", "AC 230/240 V (7 kW) · AC 400/415 V (11 y 22 kW)"], ["Corriente de entrada", "32 A · 16 A · 32 A"], ["Frecuencia", "50 / 60 Hz"]]],
      ["Salida", [["Tensión de salida", "AC 196–264 V (7 kW) · AC 340–457 V (11 y 22 kW)"], ["Corriente de salida", "Hasta 32 A · 16 A · 32 A"], ["Conector", "Case C: cable Tipo 2 de 5 m · Case B: toma Tipo 2"]]],
      ["Protección", [["Diferencial", "Tipo A + DC 6 mA"], ["Protecciones eléctricas", "Sobretensión y subtensión, sobrecarga, cortocircuito, fuga a tierra, puesta a tierra, sobretemperatura y sobretensiones transitorias"]]],
      ["Control", [["Autenticación", "Plug and Charge, tarjeta RFID o app"], ["Pantalla", "4,3 pulgadas (opcional)"], ["Conectividad", "WiFi / LAN / 4G (opcional) · RS485"], ["Protocolo", "OCPP 1.6J, OCPP 2.0.1"]]],
      ["Mecánica y ambiente", [["Dimensiones", "Cargador 240 × 145 × 460 mm · Pedestal 165 × 115 × 1450 mm"], ["Peso", "Case B 4,3 kg · Case C 6,85 kg · Pedestal 6,5 kg"], ["Material", "PC + ASA"], ["Grado de protección", "IP65 (Case C) / IP54 (Case B) · IK08"], ["Temperatura de operación", "−30 a 50 °C"], ["Humedad", "5 % a 95 % sin condensación"], ["Altitud", "Hasta 2000 m"], ["Refrigeración", "Natural"]]],
      ["Otros", [["Opcionales", "Medidor MID, pantalla de 4,3\", luz giratoria, LAN, 4G, pedestal, toma con obturador, módulo O-PEN"], ["Certificaciones", "CE, CB, UKCA, RoHS, REACH, EU RED Ciberseguridad"]]],
    ],
  },
  {
    f: "da30", n: "DA30 Compact", k: "Cargador DC compacto", pot: "30 kW",
    d: "Integra control inteligente, medición precisa y comunicación remota, con instalación sencilla. Ideal para comercios, hoteles y carga en destino.",
    h: ["Salida DC de 150 a 1000 V", "Eficiencia de carga de hasta 95 %", "Terminal de pago con tarjeta integrado", "Medidor DC certificado PTB (opcional)", "Conexión LAN, 4G y WiFi", "Protocolos OCPP 1.6J y 2.0.1"],
    s: [
      ["Entrada", [["Modelo", "F1-EU30-C"], ["Potencia nominal", "30 kW"], ["Tensión de entrada", "AC 400 V ±10 %"], ["Corriente nominal / máxima", "49 A / 58 A"], ["Frecuencia", "50 / 60 Hz"], ["Red", "TN-S / TN-C-S / TT · 3F + N + PE"]]],
      ["Salida y eficiencia", [["Tensión de salida DC", "150–1000 V"], ["Rango a potencia constante", "300–1000 V"], ["Corriente de salida", "100 A"], ["Eficiencia pico", "≥ 95 %"], ["Factor de potencia", "≥ 0,99 · THDi ≤ 5 %"]]],
      ["Control", [["Autenticación", AUT], ["Pantalla", "Táctil de 7 pulgadas"], ["Conectividad", "LAN / 4G / WiFi"], ["Protocolo", "OCPP 1.6J, OCPP 2.0.1"], ["Comunicación con el vehículo", COM]]],
      ["Mecánica", [["Largo del cable", "4,5 m"], ["Dimensiones", "Cargador 600 × 260 × 750 mm · Pedestal 240 × 240 × 1610 mm"], ["Peso", "Cargador 71 kg · Pedestal 16 kg"], ["Grado de protección", "IP54 · IK10 (pantalla IK08)"]]],
      ["Ambiente", AMB()],
      ["Otros", [["Opcionales", "Terminal de pago, medidor MID, pedestal"], ["Certificaciones", CERT]]],
    ],
  },
  {
    f: "da60", n: "DA60 Fast", k: "Cargador DC rápido", pot: "60 kW",
    d: "Dos conectores CCS2 para una carga confiable y eficiente, con monitoreo del estado de carga en tiempo real. Pensado para electrolineras y flotas.",
    h: ["Dos conectores CCS2", "Persiana de aluminio en Z con tecnología patentada", "Indicador visible del nivel de carga (SOC)", "Protección contra el sol e iluminación de apoyo", "Rango a potencia constante de 300 a 1000 V", "Eficiencia de carga de hasta 95 %"],
    s: [
      ["Entrada", [["Modelo", "F2-EU60-CC"], ["Potencia nominal", "60 kW"], ["Tensión de entrada", "AC 400 V ±10 %"], ["Corriente nominal / máxima", "97 A / 108 A"], ["Frecuencia", "50 / 60 Hz"], ["Red", "TN-S / TN-C-S / TT · 3F + N + PE"]]],
      ["Salida y eficiencia", [["Conectores", "2 × CCS2"], ["Tensión de salida DC", "150–1000 V"], ["Rango a potencia constante", "300–1000 V"], ["Corriente de salida", "200 A"], ["Eficiencia pico", "≥ 95 %"], ["Factor de potencia", "≥ 0,99 · THDi ≤ 5 %"], ["Reparto dinámico de potencia", "Pasos mínimos de 30 kW"]]],
      ["Control", [["Autenticación", AUT], ["Pantalla", "Táctil de 7 pulgadas"], ["Conectividad", "LAN / 4G / WiFi"], ["Protocolo", "OCPP 1.6J, OCPP 2.0.1"], ["Comunicación con el vehículo", COM]]],
      ["Mecánica", [["Largo del cable", "4,5 m"], ["Dimensiones", "700 × 400 × 1550 mm"], ["Peso", "195 kg"], ["Grado de protección", "IP54 · IK10 (pantalla IK08)"]]],
      ["Ambiente", AMB()],
      ["Otros", [["Opcionales", "Terminal de pago, sistema de gestión de cables"], ["Certificaciones", CERT]]],
    ],
  },
  {
    f: "da180", n: "DA180 Fast", k: "Cargador DC rápido", pot: "120 o 180 kW",
    d: "Dos conectores CCS2 con reparto dinámico de potencia entre ambos. Una solución económica para carga pública y para vehículos comerciales pesados. También disponible con conectores CHAdeMO.",
    h: ["Versiones de 120 kW y 180 kW", "Reparto dinámico de potencia entre los 2 conectores", "Pantalla táctil de 10,1 pulgadas", "Indicador visible del nivel de carga (SOC)", "Rango a potencia constante de 300 a 1000 V", "Versión CHAdeMO: 2 × CHAdeMO, 150–450 V, 125 / 200 A"],
    s: [
      ["Entrada", [["Modelos", "F3-EU180/4-CC (120 kW) · F3-EU180-CC (180 kW)"], ["Tensión de entrada", "AC 400 V ±10 %"], ["Corriente nominal", "184 A · 276 A"], ["Corriente máxima", "205 A · 307 A"], ["Frecuencia", "50 / 60 Hz"], ["Red", "TN-S / TN-C-S / TT · 3F + N + PE"]]],
      ["Salida y eficiencia", [["Conectores", "2 × CCS2"], ["Tensión de salida DC", "150–1000 V"], ["Rango a potencia constante", "300–1000 V"], ["Corriente de salida", "300 A"], ["Eficiencia pico", "≥ 95 %"], ["Factor de potencia", "≥ 0,99 · THDi ≤ 5 %"], ["Reparto dinámico de potencia", "Pasos mínimos de 30 kW"]]],
      ["Control", [["Autenticación", AUT], ["Pantalla", "Táctil de 10,1 pulgadas"], ["Conectividad", "LAN / 4G / WiFi"], ["Protocolo", "OCPP 1.6J, OCPP 2.0.1"], ["Comunicación con el vehículo", COM]]],
      ["Mecánica", [["Largo del cable", "4,5 m"], ["Dimensiones", "800 × 600 × 1700 mm"], ["Peso", "310 kg (120 kW) · 355 kg (180 kW)"], ["Grado de protección", "IP54 · IK10 (pantalla IK08)"]]],
      ["Ambiente", AMB()],
      ["Otros", [["Opcionales", "Terminal de pago, sistema de gestión de cables"], ["Certificaciones", CERT]]],
    ],
  },
  {
    f: "da240", n: "DA240 Fast", k: "Cargador DC rápido", pot: "240 kW",
    d: "Carga rápida, segura y estable para vehículos con estándar CCS2 (GB/T opcional). Integra control de carga, medición y facturación, pantalla y comunicaciones. Para carga pública y flotas de alta demanda.",
    h: ["240 kW de carga rápida DC", "Corriente de salida de hasta 400 A", "Módulos de potencia de 40 kW con asignación inteligente", "Compartimentos de control y de potencia separados", "Módulos encapsulados resistentes a viento, arena y niebla salina", "Plug and Charge según ISO 15118-2"],
    s: [
      ["Entrada", [["Modelo", "LCND-240E"], ["Potencia nominal", "240 kW"], ["Tensión de entrada", "AC 400 V"], ["Corriente de entrada", "≤ 433 A"], ["Frecuencia", "50 / 60 Hz"], ["Red", "TN-S / TN-C-S / TT · 3F + N + PE"]]],
      ["Salida y eficiencia", [["Conectores", "2 × CCS2 (GB/T opcional)"], ["Tensión de salida DC", "150–1000 V"], ["Rango a potencia constante", "300–1000 V"], ["Corriente de salida", "300 A (400 A durante 15 min)"], ["Eficiencia pico", "≥ 97 %"], ["Factor de potencia", "≥ 0,99"]]],
      ["Control", [["Autenticación", "App, tarjeta RFID, código QR, MAC Autocharge, terminal POS (opcional) y Plug and Charge"], ["Pantalla", "Táctil de 10,1 pulgadas"], ["Conectividad", "Ethernet (LAN) / 4G (ranura SIM)"], ["Protocolo", "OCPP 1.6J, OCPP 2.0.1"], ["Comunicación con el vehículo", "ISO 15118 / DIN 70121"]]],
      ["Mecánica", [["Largo del cable", "5 m"], ["Dimensiones", "750 × 600 × 1700 mm"], ["Peso", "335 kg"], ["Grado de protección", "IP54 · IK10 (pantalla IK08)"]]],
      ["Ambiente", [["Temperatura de operación", "−25 a 65 °C (potencia reducida sobre 50 °C)"], ["Humedad", "5 % a 95 % sin condensación"], ["Altitud", "Hasta 2000 m"], ["Refrigeración", "Aire forzado"]]],
      ["Otros", [["Opcionales", "Lector de tarjetas, terminal POS, medidor MID, gestión de cables"], ["Certificaciones", "CE"]]],
    ],
  },
  {
    f: "da480", n: "DA480 Ultra-fast", k: "Cargador DC ultrarrápido", pot: "480 kW",
    d: "Carga ultrarrápida para hasta cuatro vehículos eléctricos al mismo tiempo, con reparto de potencia integrado. Para electrolineras de alto tráfico y vehículos comerciales pesados.",
    h: ["Carga simultánea de hasta 4 vehículos", "Salidas: 2 × HPC + 2 × CCS2", "Hasta 800 A en el conector HPC", "Dos pantallas táctiles de 32 pulgadas", "Sistema de gestión de cables", "Configuración por web"],
    s: [
      ["Entrada", [["Modelo", "LCND-480E-4"], ["Potencia nominal", "480 kW"], ["Tensión de entrada", "AC 400 V ±15 %"], ["Corriente nominal / máxima", "736 A (2 × 368 A) / 866 A (2 × 433 A)"], ["Frecuencia", "50 / 60 Hz"], ["Red", "TN-S / TN-C-S / TT · 3F + N + PE"]]],
      ["Salida y eficiencia", [["Conectores", "2 × HPC + 2 × CCS2"], ["Tensión de salida DC", "150–1000 V"], ["Rango a potencia constante", "300–1000 V"], ["Corriente de salida", "HPC: 600 A (800 A durante 5 min) · CCS2: 400 A (500 A durante 60 min)"], ["Eficiencia pico", "≥ 95 %"], ["Factor de potencia", "≥ 0,99 · THDi ≤ 5 %"]]],
      ["Control", [["Autenticación", AUT], ["Pantalla", "2 pantallas táctiles de 32 pulgadas"], ["Conectividad", "LAN / 4G / WiFi"], ["Protocolo", "OCPP 1.6J, OCPP 2.0.1"], ["Comunicación con el vehículo", COM]]],
      ["Mecánica", [["Dimensiones", "1100 × 1150 × 2300 mm"], ["Peso", "1200 kg"], ["Grado de protección", "IP54 · IK10 (pantalla IK08)"]]],
      ["Ambiente", AMB()],
      ["Otros", [["Opcionales", "Terminal de pago, medidor PTB (< 650 A)"], ["Certificaciones", "CE, UKCA, RED, RoHS, REACH, EU RED Ciberseguridad"]]],
    ],
  },
  {
    f: "dd300", n: "DC480 Cabinet + DD300", k: "Sistema de carga distribuida", pot: "480 a 1440 kW",
    d: "Un gabinete de potencia central alimenta varios dispensadores de carga. Se configura en 480, 960 o 1440 kW y reparte la energía de forma flexible. Para terminales de buses, flotas grandes y electrolineras.",
    h: ["Gabinete de 480 kW ampliable a 960 y 1440 kW", "Hasta 12 salidas de carga", "Reparto dinámico de potencia en pasos de 40 kW", "Se integra con baterías y energía solar", "Dispensador DD300: hasta 300 kW por conector", "Actualizaciones y mantenimiento remotos"],
    s: [
      ["Gabinete DC480", [["Modelo", "LCSD-480E"], ["Potencia nominal", "480 kW"], ["Tensión / corriente de entrada", "AC 400 V ±15 % · ≤ 2 × 433 A"], ["Salida DC", "150–1000 V · 400 A · potencia constante 300–1000 V"], ["Salidas", "8 (máximo 12)"], ["Eficiencia pico", "≥ 95 % · THDi ≤ 5 %"], ["Pantalla y conectividad", "Táctil de 10\" · 4G / Ethernet / WiFi · OCPP 1.6J y 2.0.1"], ["Dimensiones y peso", "1300 × 900 × 1800 mm · 660 kg"], ["Grado de protección", "IP54 · IK10"], ["Certificaciones", "CE, UKCA, RoHS, REACH, EU RED Ciberseguridad"]]],
      ["Dispensador DD300", [["Modelo", "LCTD-300E"], ["Salida", "150–1000 V DC · 300 A y 300 kW por conector"], ["Conectores", "2 × CCS2, cable de 4,5 m con refrigeración por aire"], ["Autenticación", "App, tarjeta RFID, código QR, MAC Autocharge, terminal POS (opcional) y Plug and Charge"], ["Estándares", "VDV 261 y Plug and Charge (ISO 15118-2)"], ["Pantalla", "Táctil LCD de 10,1 pulgadas"], ["Protecciones", "Sobretensión y subtensión, sobrecarga, cortocircuito, falla de conexión, corriente residual, falla a tierra, sobretemperatura y apertura de puerta"], ["Dimensiones y peso", "750 × 300 × 2100 mm · 150 kg"], ["Grado de protección", "IP54"], ["Ambiente", "−30 a 50 °C · 5 % a 95 % de humedad · hasta 2000 m"], ["Opcionales", "Terminal POS, medidor certificado PTB"], ["Certificaciones", "CE, CB, UKCA, RoHS, REACH, EU RED Ciberseguridad"]]],
    ],
  },
  {
    f: "ess", n: "Sistema de almacenamiento de energía", k: "Baterías", pot: "125 kW · 261 kWh",
    d: "Integra en una sola unidad el convertidor de potencia (PCS), las baterías, su sistema de gestión (BMS y EMS), la refrigeración y la protección contra incendios. Para respaldo, reducción de picos de demanda y uso con energía solar.",
    h: ["Baterías de litio ferrofosfato (LFP)", "Protección contra incendio en tres niveles: módulo, rack y sistema", "Módulos IP67 dentro de un gabinete IP54", "Convertidor con eficiencia de hasta 98,5 %", "Diseño modular, ampliable con varios gabinetes en paralelo", "Actualización y mantenimiento remotos, con registro de fallas"],
    s: [
      ["Lado DC (baterías)", [["Modelo", "LSDNB-LA261EU"], ["Capacidad nominal", "125 kW / 261 kWh"], ["Tensión nominal", "832 V"], ["Rango de tensión", "728–936 V"], ["Tipo de batería", "LFP (LiFePO4)"], ["Capacidad de celda", "314 Ah"]]],
      ["Lado AC", [["Potencia nominal", "125 kW"], ["Corriente nominal", "190 A"], ["Tensión nominal", "380 V AC (3F + N + PE)"], ["Frecuencia", "50 Hz"], ["Distorsión armónica (THDi)", "< 3 %"], ["Factor de potencia", "Ajustable de −1 a +1"], ["Modos de operación", "Generador síncrono virtual (VSG), potencia constante (PQ) y tensión y frecuencia constantes (VF)"]]],
      ["Generales", [["Grado de protección", "IP54"], ["Temperatura de operación", "−20 a 50 °C"], ["Humedad", "5 % a 95 % sin condensación"], ["Ruido", "≤ 70 dB"], ["Refrigeración", "Líquida inteligente"], ["Altitud", "Hasta 2000 m (con reducción por encima)"], ["Comunicación BMS / EMS", "Ethernet / RS485 / CAN"], ["Dimensiones", "1000 × 1350 × 2350 mm"], ["Peso", "2700 kg"]]],
    ],
  },
];

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
const logo = img("assets/img/logo-efo.webp");
const pie = (n) => `<footer><span>E.F.O. Ltda. · Energía y Fuerza del Oriente · WhatsApp +591 69540072 · gerencia@efo.com.bo · efo.com.bo</span><span>${n}</span></footer>`;

const portada = `<section class="pg cover">
  <img class="logo" src="${logo}" alt="E.F.O. Ltda.">
  <div class="cv">
    <p class="kick">Catálogo técnico</p>
    <h1>Cargadores para vehículos eléctricos</h1>
    <p class="sub">Equipos Lumosenergy · Fichas técnicas en español</p>
  </div>
  <div class="grid8">${P.map((p) => `<figure><img src="${img(`assets/foto/cargadores/${p.f}.webp`)}" alt=""><figcaption>${esc(p.n)}</figcaption></figure>`).join("")}</div>
  <div class="about">
    <p><b>E.F.O. Ltda.</b> suministra, instala y da soporte a equipos de carga Lumosenergy en Bolivia: desde cargadores para el hogar hasta electrolineras de alta potencia y sistemas de baterías.</p>
    <p><b>Lumosenergy</b> (antes Gresgying) es un fabricante chino que cotiza en la Bolsa de Shanghái, entre los tres mayores fabricantes de cargadores de China, con más de 200.000 puntos de carga entregados en más de 40 países y más de 300 patentes.</p>
  </div>
  <table class="idx"><tbody>${P.map((p, i) => `<tr><td>${String(i + 1).padStart(2, "0")}</td><td><b>${esc(p.n)}</b> · ${esc(p.k)}</td><td>${esc(p.pot)}</td><td>pág. ${i + 2}</td></tr>`).join("")}</tbody></table>
  ${pie(1)}
</section>`;

const fichas = P.map((p, i) => `<section class="pg">
  <header><img src="${logo}" alt="E.F.O."><span>Catálogo de cargadores · Equipos Lumosenergy</span></header>
  <div class="top">
    <figure><img src="${img(`assets/foto/cargadores/${p.f}.webp`)}" alt="${esc(p.n)}"></figure>
    <div>
      <p class="kick">${esc(p.k)}</p>
      <h2>${esc(p.n)}</h2>
      <p class="pot">${esc(p.pot)}</p>
      <p class="desc">${esc(p.d)}</p>
      <ul>${p.h.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
    </div>
  </div>
  <div class="specs">${p.s.map(([g, rows]) => `<table class="spec"><tbody><tr class="g"><th colspan="2">${esc(g)}</th></tr>${rows.map(([a, b]) => `<tr><th>${esc(a)}</th><td>${esc(b)}</td></tr>`).join("")}</tbody></table>`).join("")}</div>
  <p class="nota">Información técnica traducida del catálogo del fabricante Lumosenergy. Las especificaciones pueden cambiar sin previo aviso; confirma el modelo y la configuración al cotizar.</p>
  ${pie(i + 2)}
</section>`).join("\n");

const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Catálogo de cargadores E.F.O. · Lumosenergy</title>
<style>
@page { size: A4; margin: 0; }
* { box-sizing: border-box; }
body { margin: 0; font: 9.2pt/1.4 "Segoe UI", Arial, sans-serif; color: #031F36; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.pg { width: 210mm; height: 297mm; padding: 14mm 14mm 16mm; position: relative; page-break-after: always; overflow: hidden; }
header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #00AEEF; padding-bottom: 6px; margin-bottom: 8mm; }
header img { height: 9mm; } header span { font-size: 8pt; color: #52697D; letter-spacing: .06em; text-transform: uppercase; font-weight: 700; }
footer { position: absolute; left: 14mm; right: 14mm; bottom: 8mm; display: flex; justify-content: space-between; font-size: 7.4pt; color: #52697D; border-top: 1px solid #E3EBF2; padding-top: 4px; }
.kick { margin: 0; font-size: 8pt; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; color: #0079B8; }
.top { display: grid; grid-template-columns: 58mm 1fr; gap: 9mm; align-items: center; margin-bottom: 5mm; }
.top figure { margin: 0; height: 64mm; border-radius: 4mm; background: linear-gradient(180deg, #F1F5F9, #fff); display: grid; place-items: center; padding: 5mm; }
.top figure img { max-height: 56mm; max-width: 100%; }
h2 { margin: 2px 0 0; font-size: 22pt; line-height: 1.1; letter-spacing: -.02em; }
.pot { margin: 3px 0 8px; font-size: 13pt; font-weight: 800; color: #063B66; }
.desc { margin: 0 0 8px; color: #33536E; }
ul { margin: 0; padding-left: 14px; font-size: 9pt; } li { margin: 2px 0; } li::marker { color: #39A935; }
.specs { columns: 2; column-gap: 7mm; }
.spec { width: 100%; border-collapse: collapse; font-size: 8.3pt; break-inside: avoid; margin-bottom: 4mm; }
.spec th, .spec td { text-align: left; vertical-align: top; padding: 2px 8px; border-bottom: 1px solid #E3EBF2; }
.spec tr:not(.g) th { width: 40%; font-weight: 600; color: #33536E; }
.spec tr.g th { background: #063B66; color: #fff; font-size: 8pt; letter-spacing: .12em; text-transform: uppercase; padding: 4px 8px; }
.nota { margin: 3mm 0 0; font-size: 7.6pt; color: #52697D; }
.cover .logo { height: 16mm; }
.cv { margin: 12mm 0 8mm; } .cv h1 { margin: 4px 0; font-size: 30pt; line-height: 1.05; letter-spacing: -.02em; } .cv .sub { margin: 0; font-size: 13pt; color: #0079B8; font-weight: 700; }
.grid8 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4mm; margin-bottom: 8mm; }
.grid8 figure { margin: 0; height: 44mm; border-radius: 3mm; background: #F1F5F9; display: grid; grid-template-rows: 1fr auto; place-items: center; padding: 3mm; }
.grid8 img { max-height: 32mm; max-width: 100%; } .grid8 figcaption { font-size: 7.6pt; font-weight: 700; text-align: center; }
.about p { margin: 0 0 6px; color: #33536E; }
.idx { width: 100%; border-collapse: collapse; margin-top: 5mm; } .idx td { padding: 4px 6px; border-bottom: 1px solid #E3EBF2; } .idx td:first-child { color: #0079B8; font-weight: 800; width: 9mm; } .idx td:last-child { text-align: right; color: #52697D; width: 18mm; }
</style></head><body>${portada}${fichas}</body></html>`;

const tmp = mkdtempSync(join(tmpdir(), "cat-"));
const htmlPath = join(tmp, "catalogo.html");
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
await sleep(2500);
const r = await send("Page.printToPDF", { printBackground: true, preferCSSPageSize: true, marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0 });
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, Buffer.from(r.result.data, "base64"));
if (process.argv.includes("--png")) writeFileSync(join(tmp, "x"), "");
ws.close(); chrome.kill();
console.log("PDF:", OUT, Math.round(readFileSync(OUT).length / 1024), "KB");
process.exit(0);
