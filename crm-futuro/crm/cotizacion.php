<?php
declare(strict_types=1);
require __DIR__ . '/_lib.php';
requiere_login();

$c = q('SELECT c.*, l.id AS lid, c.estado, l.telefono AS tel_actual FROM cotizaciones c JOIN leads l ON l.id = c.lead_id WHERE c.id = ?', [(int)($_GET['id'] ?? 0)])->fetch();
if (!$c) { http_response_code(404); exit('Cotización no encontrada.'); }
$d = json_decode((string)$c['datos'], true);
$cli = $d['cliente']; $com = $d['comercial']; $tot = $d['totales']; $m = 1 + (float)$com['margen'] / 100;
$validez = (int)$com['validez'];
$vence = date('Y-m-d', strtotime($c['creado'] . " +$validez days"));
$wa = wa_numero((string)$c['tel_actual']);
$msg = 'Hola ' . $cli['nombre'] . ', le enviamos la cotización ' . $c['numero'] . ' de E.F.O. Ltda. por un total de Bs ' . bs($c['total']) . ' (válida hasta el ' . date('d/m/Y', strtotime($vence)) . '). Le adjuntamos el PDF. Quedamos atentos a sus consultas.';
$aviso = aviso();
?><!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title><?= h($c['numero']) ?> · <?= h($cli['nombre']) ?></title>
<link rel="icon" href="/assets/img/favicon-192.png">
<style>
@page { size: A4; margin: 14mm 14mm 16mm; }
* { box-sizing: border-box; }
body { margin: 0; font: 10pt/1.45 "Segoe UI", Arial, sans-serif; color: #031F36; background: #e9eef3; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.barra { position: sticky; top: 0; display: flex; flex-wrap: wrap; gap: 8px; align-items: center; padding: 10px 16px; background: #031F36; color: #fff; }
.barra a, .barra button { font: 600 14px "Segoe UI", Arial, sans-serif; padding: 9px 14px; border-radius: 8px; border: 0; cursor: pointer; text-decoration: none; background: #fff; color: #031F36; }
.barra .wa { background: #25D366; color: #04210f; } .barra .pri { background: #00AEEF; color: #031F36; }
.barra span { font-size: 13px; opacity: .85; flex: 1 1 260px; }
.hoja { width: 210mm; max-width: 100%; min-height: 297mm; margin: 18px auto; padding: 14mm; background: #fff; box-shadow: 0 10px 40px rgba(3,31,54,.15); }
header { display: flex; justify-content: space-between; gap: 16px; align-items: center; border-bottom: 3px solid #00AEEF; padding-bottom: 8px; }
header img { height: 14mm; } header .r { text-align: right; font-size: 8.5pt; color: #52697D; } header .r b { color: #031F36; font-size: 9.5pt; }
h1 { margin: 7mm 0 1mm; font-size: 19pt; letter-spacing: -.01em; } .sub { margin: 0 0 5mm; color: #52697D; }
.meta { display: grid; grid-template-columns: 1fr 1fr; gap: 4mm; margin-bottom: 5mm; }
.meta div { background: #F1F5F9; border-radius: 3mm; padding: 3mm 4mm; } .meta small { display: block; font-size: 7.5pt; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: #52697D; }
.sist { display: grid; grid-template-columns: repeat(4, 1fr); gap: 3mm; margin-bottom: 5mm; }
.sist div { border: 1px solid #E3EBF2; border-radius: 3mm; padding: 2.5mm 3mm; } .sist small { display: block; font-size: 7.3pt; color: #52697D; } .sist b { font-size: 10.5pt; }
table { width: 100%; border-collapse: collapse; } th, td { padding: 5px 7px; border-bottom: 1px solid #E3EBF2; text-align: left; vertical-align: top; }
thead th { background: #063B66; color: #fff; font-size: 8pt; letter-spacing: .06em; text-transform: uppercase; }
.n { text-align: right; white-space: nowrap; }
.tot { width: 60%; margin: 4mm 0 0 auto; } .tot th { font-weight: 600; } .tot .g th, .tot .g td { font-size: 12.5pt; font-weight: 800; color: #063B66; border-top: 2px solid #063B66; }
h2 { font-size: 11pt; margin: 6mm 0 2mm; } ul { margin: 0; padding-left: 16px; }
.cond { display: grid; grid-template-columns: 1fr 1fr; gap: 1mm 6mm; } .cond p { margin: 0; }
.nota { margin-top: 5mm; padding: 3mm 4mm; border-left: 3px solid #F2A900; background: #FFF8E6; font-size: 8.8pt; }
footer { margin-top: 8mm; padding-top: 3mm; border-top: 1px solid #E3EBF2; font-size: 8pt; color: #52697D; display: flex; justify-content: space-between; gap: 6mm; }
@media print { body { background: #fff; } .barra { display: none; } .hoja { margin: 0; padding: 0; width: auto; min-height: 0; box-shadow: none; } }
@media (max-width: 700px) { .meta, .cond { grid-template-columns: 1fr; } .sist { grid-template-columns: 1fr 1fr; } .tot { width: 100%; } .hoja { padding: 16px; } }
</style></head><body>
<div class="barra">
  <a href="ver.php?id=<?= (int)$c['lid'] ?>">← Volver</a>
  <button class="pri" type="button" onclick="window.print()">Imprimir / Guardar PDF</button>
  <?php if (puede('cotizar') && $c['estado'] === 'borrador'): ?><form method="post" action="ver.php?id=<?= (int)$c['lid'] ?>" style="margin:0"><?= csrf_campo() ?><input type="hidden" name="accion" value="cot_estado"><input type="hidden" name="cot" value="<?= (int)$c['id'] ?>"><input type="hidden" name="estado" value="enviada"><button type="submit">Marcar como enviada</button></form><?php endif; ?>
  <?php if ($wa): ?><a class="wa" href="https://wa.me/<?= h($wa) ?>?text=<?= rawurlencode($msg) ?>" target="_blank" rel="noopener">Enviar por WhatsApp</a><?php endif; ?>
  <?php if ($cli['correo']): ?><a href="mailto:<?= h($cli['correo']) ?>?subject=<?= rawurlencode('Cotización ' . $c['numero'] . ' · E.F.O. Ltda.') ?>&body=<?= rawurlencode($msg) ?>">Enviar por correo</a><?php endif; ?>
  <span><?= $aviso ? h($aviso) . ' ' : '' ?>Primero guarda el PDF («Guardar como PDF» en la ventana de impresión) y luego adjúntalo en WhatsApp o en el correo.</span>
</div>
<article class="hoja">
  <header>
    <img src="/assets/img/logo-efo.webp" alt="E.F.O. Ltda.">
    <div class="r"><b>Energía y Fuerza del Oriente Ltda.</b><br>NIT 710528026 · Registro ANH ANH15196<br>Av. Montecristo No. 205, Santa Cruz de la Sierra, Bolivia<br>WhatsApp +591 69540072 · gerencia@efo.com.bo</div>
  </header>
  <h1>Cotización <?= h($c['numero']) ?></h1>
  <p class="sub"><?= h($cli['tipo']) ?> · Santa Cruz de la Sierra, <?= h(fecha_larga($c['creado'])) ?></p>
  <div class="meta">
    <div><small>Cliente</small><b><?= h($cli['nombre']) ?></b><?= $cli['empresa'] ? '<br>' . h($cli['empresa']) : '' ?><br><?= h($cli['telefono']) ?><?= $cli['correo'] ? ' · ' . h($cli['correo']) : '' ?><br><?= h($cli['ciudad']) ?></div>
    <div><small>Datos de la propuesta</small>Solicitud: <?= h($cli['codigo']) ?><br>Fecha: <?= date('d/m/Y', strtotime($c['creado'])) ?><br>Válida hasta: <b><?= date('d/m/Y', strtotime($vence)) ?></b> (<?= $validez ?> días)</div>
  </div>
  <?php if (!empty($d['solar'])): $s = $d['solar']; $p = $d['parametros']; ?>
  <h2>Sistema propuesto · <?= h($p['modalidad']) ?></h2>
  <div class="sist">
    <div><small>Consumo mensual</small><b><?= bs($p['kwh'], 0) ?> kWh</b></div>
    <div><small>Paneles</small><b><?= (int)$s['paneles'] ?> × <?= kw_txt((float)$p['panel_w']) ?> W</b></div>
    <div><small>Potencia instalada</small><b><?= bs($s['kwp']) ?> kWp</b></div>
    <div><small>Baterías</small><b><?= (int)$s['baterias'] ? (int)$s['baterias'] . ' (' . bs($s['e_bat_inst'], 1) . ' kWh)' : 'No incluye' ?></b></div>
  </div>
  <?php endif; ?>
  <table>
    <thead><tr><th>#</th><th>Descripción</th><th class="n">Cantidad</th><th class="n">Precio unit. Bs</th><th class="n">Subtotal Bs</th></tr></thead>
    <tbody>
    <?php foreach ($d['lineas'] as $i => $l): $pu = $l['precio'] * $m; ?>
      <tr><td><?= $i + 1 ?></td><td><?= h($l['desc']) ?></td><td class="n"><?= h(rtrim(rtrim(number_format((float)$l['cant'], 3, ',', '.'), '0'), ',')) ?> <?= h($l['unidad']) ?></td><td class="n"><?= bs($pu) ?></td><td class="n"><?= bs($pu * $l['cant']) ?></td></tr>
    <?php endforeach; ?>
    </tbody>
  </table>
  <table class="tot">
    <?php if ((float)$tot['impuestos'] > 0): ?>
      <tr><th>Subtotal</th><td class="n">Bs <?= bs($tot['subtotal']) ?></td></tr>
      <tr><th>Impuestos (<?= h(rtrim(rtrim(number_format((float)$com['impuesto'], 2, ',', ''), '0'), ',')) ?> %)</th><td class="n">Bs <?= bs($tot['impuestos']) ?></td></tr>
    <?php endif; ?>
    <tr class="g"><th>Total</th><td class="n">Bs <?= bs($tot['total']) ?></td></tr>
  </table>
  <h2>Condiciones</h2>
  <div class="cond">
    <p><b>Plazo:</b> <?= h($com['plazo']) ?></p>
    <p><b>Forma de pago:</b> <?= h($com['pago']) ?></p>
    <p><b>Garantía:</b> <?= h($com['garantia']) ?></p>
    <p><b>Validez:</b> <?= $validez ?> días desde la fecha de emisión</p>
  </div>
  <?php if (trim((string)$com['alcance']) !== ''): ?><h2>Alcance</h2><p><?= nl2br(h($com['alcance'])) ?></p><?php endif; ?>
  <?php if (trim((string)($com['notas'] ?? '')) !== ''): ?><h2>Observaciones</h2><p><?= nl2br(h($com['notas'])) ?></p><?php endif; ?>
  <?php if (!empty($d['solar'])): ?>
    <p class="nota"><b>Propuesta preliminar.</b> Calculada a partir del consumo de su factura de electricidad. Antes de instalar, E.F.O. realiza una visita técnica para verificar sombras, orientación, superficie, tablero, puesta a tierra, demanda y cargas críticas; el diseño final puede ajustar equipos, cantidades y precio.</p>
  <?php endif; ?>
  <footer><span>E.F.O. Ltda. · efo.com.bo · Lunes a viernes, de 8:30 a 16:30</span><span><?= h($c['numero']) ?></span></footer>
</article>
</body></html>
