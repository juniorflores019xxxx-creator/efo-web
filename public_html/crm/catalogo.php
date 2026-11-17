<?php
declare(strict_types=1);
require __DIR__ . '/_lib.php';
requiere_login();

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
  csrf_ok();
  $C = $_POST['c'] ?? []; $cat = []; $vistos = [];
  foreach ((array)($C['cod'] ?? []) as $i => $cod) {
    $cod = strtoupper(preg_replace('/[^A-Za-z0-9\-]/', '', (string)$cod) ?? '');
    $desc = una_linea((string)($C['desc'][$i] ?? ''), 200);
    if ($cod === '' || $desc === '' || isset($vistos[$cod])) continue;
    $vistos[$cod] = 1;
    $cat[] = [$cod, una_linea((string)($C['cat'][$i] ?? ''), 40), $desc, una_linea((string)($C['uni'][$i] ?? 'unidad'), 20) ?: 'unidad', max(0, num($C['precio'][$i] ?? 0))];
  }
  $I = $_POST['i'] ?? []; $inv = [];
  foreach ((array)($I['tipo'] ?? []) as $i => $t) {
    $kw = num($I['kw'][$i] ?? 0);
    if (!in_array($t, ['On-Grid', 'Híbrido', 'Off-Grid'], true) || $kw <= 0) continue;
    $inv[] = [$t, $kw, max(0, num($I['precio'][$i] ?? 0))];
  }
  $ps = [];
  foreach (parametros_inicial() as $k => $def) $ps[$k] = isset($_POST['ps'][$k]) && trim((string)$_POST['ps'][$k]) !== '' ? num($_POST['ps'][$k]) : $def;
  $com = comercial();
  foreach (['margen', 'impuesto', 'validez'] as $k) $com[$k] = num($_POST['com'][$k] ?? $com[$k]);
  foreach (['plazo', 'pago', 'garantia'] as $k) $com[$k] = una_linea((string)($_POST['com'][$k] ?? $com[$k]), 200);
  $com['alcance'] = texto_largo((string)($_POST['com']['alcance'] ?? $com['alcance']), 1500);
  guardar_ajuste('catalogo', $cat);
  guardar_ajuste('inversores', $inv);
  guardar_ajuste('parametros', $ps);
  guardar_ajuste('comercial', $com);
  aviso('Precios y parámetros guardados. Las cotizaciones nuevas ya usan estos valores.');
  redirigir('catalogo.php');
}

$cat = array_merge(catalogo(), array_fill(0, 5, ['', '', '', 'unidad', '']));
$inv = array_merge(inversores(), array_fill(0, 4, ['', '', '']));
$ps = parametros(); $com = comercial();
$ceros = count(array_filter(catalogo(), fn($r) => (float)$r[4] <= 0)) + count(array_filter(inversores(), fn($r) => (float)$r[2] <= 0));
$n = fn($v) => $v === '' ? '' : rtrim(rtrim(number_format((float)$v, 4, '.', ''), '0'), '.');
$etq = ['hsp' => 'Horas sol pico (h/día)', 'rend' => 'Rendimiento global (0 a 1)', 'cob' => 'Cobertura objetivo (1 = 100 %)', 'panel_w' => 'Potencia del panel (W)',
  'dcac' => 'Relación DC/AC', 'aut' => 'Autonomía de batería (días)', 'frac' => 'Fracción diaria a respaldar', 'dod' => 'Profundidad de descarga',
  'ef' => 'Eficiencia batería/inversor', 'bat_v' => 'Tensión módulo batería (V)', 'bat_ah' => 'Capacidad módulo batería (Ah)', 'isc' => 'Isc del panel (A)',
  'serie' => 'Paneles por cadena', 'factor' => 'Factor de corriente FV'];
cabecera('Precios y parámetros', 'catalogo.php');
?>
<h1>Precios y parámetros</h1>
<?php if ($ceros): ?><p class="alerta">Hay <?= $ceros ?> precio(s) en Bs 0. Mientras no los cargues, las cotizaciones saldrán incompletas.</p><?php endif; ?>
<form method="post">
<?= csrf_campo() ?>
<section class="panel">
  <h2>Catálogo de equipos y servicios</h2>
  <p class="muted">Escribe el <b>costo para E.F.O.</b> en bolivianos. El margen comercial se suma en cada cotización. Para quitar un ítem, borra su código. Para agregar uno, usa las filas vacías del final.</p>
  <div class="tabla"><table class="items">
    <thead><tr><th>Código</th><th>Categoría</th><th>Descripción</th><th>Unidad</th><th>Costo Bs</th></tr></thead>
    <tbody><?php foreach ($cat as $r): ?>
      <tr><td><input name="c[cod][]" value="<?= h($r[0]) ?>" class="uni"></td><td><input name="c[cat][]" value="<?= h($r[1]) ?>" class="uni"></td>
      <td><input name="c[desc][]" value="<?= h($r[2]) ?>" class="desc"></td><td><input name="c[uni][]" value="<?= h($r[3]) ?>" class="uni"></td>
      <td><input name="c[precio][]" type="number" step="any" min="0" value="<?= h($n($r[4])) ?>" class="precio"></td></tr>
    <?php endforeach; ?></tbody>
  </table></div>
</section>

<section class="panel">
  <h2>Inversores por potencia</h2>
  <p class="muted">El cotizador elige el inversor más chico que alcance la potencia calculada. Si ninguno alcanza, cotiza varios del más grande.</p>
  <div class="tabla"><table class="items">
    <thead><tr><th>Modalidad</th><th>Potencia (kW)</th><th>Costo Bs</th></tr></thead>
    <tbody><?php foreach ($inv as $r): ?>
      <tr><td><select name="i[tipo][]"><option value=""></option><?php foreach (['On-Grid', 'Híbrido', 'Off-Grid'] as $t): ?><option<?= $r[0] === $t ? ' selected' : '' ?>><?= $t ?></option><?php endforeach; ?></select></td>
      <td><input name="i[kw][]" type="number" step="any" min="0" value="<?= h($n($r[1])) ?>" class="cant"></td>
      <td><input name="i[precio][]" type="number" step="any" min="0" value="<?= h($n($r[2])) ?>" class="precio"></td></tr>
    <?php endforeach; ?></tbody>
  </table></div>
</section>

<section class="panel">
  <h2>Parámetros del dimensionamiento solar</h2>
  <p class="muted">Valores por defecto (los mismos del Excel). En cada cotización se pueden ajustar.</p>
  <div class="grid"><?php foreach ($etq as $k => $t): ?><label><?= h($t) ?><input name="ps[<?= $k ?>]" type="number" step="any" value="<?= h($n($ps[$k])) ?>"></label><?php endforeach; ?></div>
</section>

<section class="panel">
  <h2>Condiciones comerciales por defecto</h2>
  <div class="grid">
    <label>Margen comercial (%)<input name="com[margen]" type="number" step="any" value="<?= h($n($com['margen'])) ?>"></label>
    <label>Impuestos (%)<input name="com[impuesto]" type="number" step="any" value="<?= h($n($com['impuesto'])) ?>"></label>
    <label>Validez (días)<input name="com[validez]" type="number" step="1" value="<?= h($n($com['validez'])) ?>"></label>
    <label>Plazo de entrega<input name="com[plazo]" value="<?= h($com['plazo']) ?>"></label>
    <label>Forma de pago<input name="com[pago]" value="<?= h($com['pago']) ?>"></label>
    <label>Garantía<input name="com[garantia]" value="<?= h($com['garantia']) ?>"></label>
    <label class="ancho">Alcance<textarea name="com[alcance]" rows="2"><?= h($com['alcance']) ?></textarea></label>
  </div>
</section>
<p><button class="btn" type="submit">Guardar precios y parámetros</button></p>
</form>
<?php pie();
