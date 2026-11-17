<?php
declare(strict_types=1);
require __DIR__ . '/_lib.php';
requiere_login();

$lid = (int)($_GET['lead'] ?? $_POST['lead'] ?? 0);
$lead = q('SELECT * FROM leads WHERE id = ?', [$lid])->fetch();
if (!$lead) redirigir('index.php');
$datos = json_decode((string)$lead['datos'], true) ?: [];
$solarOn = $lead['grupo'] === 'solar';
$post = ($_SERVER['REQUEST_METHOD'] ?? '') === 'POST';
if ($post) csrf_ok();
$acc = $post ? (string)($_POST['accion'] ?? '') : '';

// Parámetros solares: los del catálogo + los datos de la factura del cliente (o lo que se editó aquí)
$ps = parametros();
$ps['kwh'] = num($datos['s_kwh'] ?? 0);
$ps['dias'] = num($datos['s_dias'] ?? 30) ?: 30;
$ps['modalidad'] = modalidad_de((string)($datos['s_modalidad'] ?? ''));
if ($post && $solarOn) {
  foreach (array_keys(parametros_inicial()) as $k) if (isset($_POST['ps'][$k])) $ps[$k] = num($_POST['ps'][$k]);
  $ps['kwh'] = num($_POST['ps']['kwh'] ?? $ps['kwh']);
  $ps['dias'] = num($_POST['ps']['dias'] ?? $ps['dias']) ?: 30;
  $m = (string)($_POST['ps']['modalidad'] ?? '');
  if (in_array($m, ['On-Grid', 'Híbrido', 'Off-Grid'], true)) $ps['modalidad'] = $m;
}
$solar = $solarOn ? calculo_solar($ps) : null;

// Condiciones comerciales
$com = comercial();
$com['notas'] = '';
if ($post) {
  foreach (['margen', 'impuesto', 'validez'] as $k) if (isset($_POST['com'][$k])) $com[$k] = num($_POST['com'][$k]);
  foreach (['plazo', 'pago', 'garantia'] as $k) if (isset($_POST['com'][$k])) $com[$k] = una_linea((string)$_POST['com'][$k], 200);
  foreach (['alcance', 'notas'] as $k) if (isset($_POST['com'][$k])) $com[$k] = texto_largo((string)$_POST['com'][$k], 1500);
}

// Líneas: sugeridas al entrar o al recalcular el sistema solar; si no, las que se editaron
if (!$post || $acc === 'calcular') {
  $lineas = lineas_sugeridas($lead, $solar, $ps);
} else {
  $lineas = [];
  foreach ((array)($_POST['l']['desc'] ?? []) as $i => $desc) {
    $desc = una_linea((string)$desc, 200);
    $cant = num($_POST['l']['cant'][$i] ?? 0);
    if ($desc === '' || $cant <= 0) continue;
    $lineas[] = ['cod' => una_linea((string)($_POST['l']['cod'][$i] ?? ''), 20), 'desc' => $desc, 'unidad' => una_linea((string)($_POST['l']['unidad'][$i] ?? 'unidad'), 20) ?: 'unidad', 'cant' => $cant, 'precio' => max(0, num($_POST['l']['precio'][$i] ?? 0))];
  }
}
$tot = totales($lineas, (float)$com['margen'], (float)$com['impuesto']);
$ceros = array_filter($lineas, fn($l) => $l['precio'] <= 0);

if ($acc === 'guardar') {
  if (!$lineas) aviso('Agrega al menos un ítem con descripción y cantidad.');
  elseif ($tot['total'] <= 0) aviso('El total es Bs 0. Carga los precios en «Precios y parámetros» o escríbelos en la tabla.');
  else {
    $numero = siguiente_numero();
    $snap = ['cliente' => array_intersect_key($lead, array_flip(['codigo', 'nombre', 'empresa', 'telefono', 'correo', 'ciudad', 'tipo'])),
      'grupo' => $lead['grupo'], 'parametros' => $solarOn ? $ps : null, 'solar' => $solar, 'lineas' => $lineas, 'comercial' => $com, 'totales' => $tot];
    q('INSERT INTO cotizaciones (lead_id, numero, creado, datos, total) VALUES (?, ?, ?, ?, ?)', [$lid, $numero, ahora(), json_encode($snap, JSON_UNESCAPED_UNICODE), $tot['total']]);
    $cid = (int)db()->lastInsertId();
    q("UPDATE leads SET estado = CASE WHEN estado IN ('nuevo','contactado') THEN 'cotizado' ELSE estado END, actualizado = ? WHERE id = ?", [ahora(), $lid]);
    aviso("Cotización $numero guardada.");
    redirigir('cotizacion.php?id=' . $cid);
  }
}

$cat = catalogo();
$filas = array_merge($lineas, array_fill(0, 4, ['cod' => '', 'desc' => '', 'unidad' => 'unidad', 'cant' => '', 'precio' => '']));
$n = fn($v, $d = 2) => rtrim(rtrim(number_format((float)$v, $d, '.', ''), '0'), '.');
cabecera('Cotizar ' . $lead['codigo']);
?>
<p class="migas"><a href="ver.php?id=<?= $lid ?>">← <?= h($lead['codigo']) ?> · <?= h($lead['nombre']) ?></a></p>
<h1>Preparar cotización <small><?= h($lead['tipo']) ?></small></h1>
<form method="post" id="cot">
<?= csrf_campo() ?><input type="hidden" name="lead" value="<?= $lid ?>">

<?php if ($solarOn): ?>
<section class="panel">
  <h2>1. Dimensionamiento solar</h2>
  <p class="muted">Mismas fórmulas que el Excel «Sistema comercial de cotización solar». Si cambias un dato, presiona «Calcular sistema».</p>
  <div class="grid">
    <label>Consumo mensual (kWh)<input name="ps[kwh]" type="number" step="any" min="0" value="<?= h($n($ps['kwh'])) ?>"></label>
    <label>Días del período<input name="ps[dias]" type="number" step="1" min="1" value="<?= h($n($ps['dias'])) ?>"></label>
    <label>Modalidad<select name="ps[modalidad]"><?php foreach (['On-Grid', 'Híbrido', 'Off-Grid'] as $m): ?><option<?= $ps['modalidad'] === $m ? ' selected' : '' ?>><?= $m ?></option><?php endforeach; ?></select></label>
    <label>Horas sol pico (h/día)<input name="ps[hsp]" type="number" step="any" value="<?= h($n($ps['hsp'])) ?>"></label>
    <label>Cobertura (fracción, 1 = 100 %)<input name="ps[cob]" type="number" step="any" value="<?= h($n($ps['cob'])) ?>"></label>
    <label>Potencia del panel (W)<input name="ps[panel_w]" type="number" step="any" value="<?= h($n($ps['panel_w'])) ?>"></label>
  </div>
  <details><summary>Parámetros técnicos avanzados</summary><div class="grid">
    <label>Rendimiento global<input name="ps[rend]" type="number" step="any" value="<?= h($n($ps['rend'])) ?>"></label>
    <label>Relación DC/AC<input name="ps[dcac]" type="number" step="any" value="<?= h($n($ps['dcac'])) ?>"></label>
    <label>Autonomía de batería (días)<input name="ps[aut]" type="number" step="any" value="<?= h($n($ps['aut'])) ?>"></label>
    <label>Fracción diaria a respaldar<input name="ps[frac]" type="number" step="any" value="<?= h($n($ps['frac'])) ?>"></label>
    <label>Profundidad de descarga<input name="ps[dod]" type="number" step="any" value="<?= h($n($ps['dod'])) ?>"></label>
    <label>Eficiencia batería/inversor<input name="ps[ef]" type="number" step="any" value="<?= h($n($ps['ef'])) ?>"></label>
    <label>Tensión módulo batería (V)<input name="ps[bat_v]" type="number" step="any" value="<?= h($n($ps['bat_v'])) ?>"></label>
    <label>Capacidad módulo batería (Ah)<input name="ps[bat_ah]" type="number" step="any" value="<?= h($n($ps['bat_ah'])) ?>"></label>
    <label>Isc del panel (A)<input name="ps[isc]" type="number" step="any" value="<?= h($n($ps['isc'])) ?>"></label>
    <label>Paneles por cadena<input name="ps[serie]" type="number" step="1" min="1" value="<?= h($n($ps['serie'])) ?>"></label>
    <label>Factor de corriente FV<input name="ps[factor]" type="number" step="any" value="<?= h($n($ps['factor'])) ?>"></label>
  </div></details>
  <button class="btn btn-sec" name="accion" value="calcular" type="submit">Calcular sistema</button>
  <div class="resultados">
    <div><small>Consumo diario</small><b><?= bs($solar['diario']) ?> kWh</b></div>
    <div><small>Potencia FV requerida</small><b><?= bs($solar['kwp_req']) ?> kWp</b></div>
    <div><small>Paneles</small><b><?= $solar['paneles'] ?> × <?= kw_txt((float)$ps['panel_w']) ?> W</b></div>
    <div><small>Potencia instalada</small><b><?= bs($solar['kwp']) ?> kWp</b></div>
    <div><small>Inversor estimado</small><b><?= bs($solar['kw_ac']) ?> kW</b></div>
    <div><small>Baterías</small><b><?= $solar['baterias'] ?> (<?= bs($solar['e_bat_inst']) ?> kWh)</b></div>
    <div><small>Corriente FV preliminar</small><b><?= bs($solar['i_fv'], 1) ?> A</b></div>
    <div><small>Protección FV estimada</small><b><?= bs($solar['i_prot'], 1) ?> A</b></div>
  </div>
  <p class="nota-tec"><b>Aviso técnico:</b> <?= h($solar['aviso']) ?> La factura no muestra la demanda máxima ni el consumo por hora: el inversor, las baterías y las protecciones son preliminares.</p>
</section>
<?php endif; ?>

<section class="panel">
  <h2><?= $solarOn ? '2' : '1' ?>. Ítems de la cotización</h2>
  <p class="muted">El <b>costo unitario</b> es lo que le cuesta a E.F.O.; el sistema le suma el margen comercial. Al cliente le llegan los precios ya con margen.</p>
  <?php if ($ceros): ?><p class="alerta">Hay <?= count($ceros) ?> ítem(s) con costo Bs 0. Carga los precios en <a href="catalogo.php">Precios y parámetros</a> o escríbelos aquí.</p><?php endif; ?>
  <div class="tabla"><table class="items">
    <thead><tr><th>Código</th><th>Descripción</th><th>Unidad</th><th>Cantidad</th><th>Costo unit. Bs</th><th>Subtotal Bs</th></tr></thead>
    <tbody>
    <?php foreach ($filas as $l): ?>
      <tr>
        <td><select name="l[cod][]" class="cod"><option value=""></option>
          <?php foreach ($cat as $c): ?><option value="<?= h($c[0]) ?>"<?= $l['cod'] === $c[0] ? ' selected' : '' ?>><?= h($c[0]) ?></option><?php endforeach; ?>
          <?php if ($l['cod'] !== '' && !in_array($l['cod'], array_column($cat, 0), true)): ?><option selected><?= h($l['cod']) ?></option><?php endif; ?>
        </select></td>
        <td><input name="l[desc][]" value="<?= h($l['desc']) ?>" class="desc"></td>
        <td><input name="l[unidad][]" value="<?= h($l['unidad']) ?>" class="uni"></td>
        <td><input name="l[cant][]" type="number" step="any" min="0" value="<?= h($l['cant'] === '' ? '' : $n($l['cant'], 3)) ?>" class="cant"></td>
        <td><input name="l[precio][]" type="number" step="any" min="0" value="<?= h($l['precio'] === '' ? '' : $n($l['precio'])) ?>" class="precio"></td>
        <td class="sub num"><?= $l['cant'] === '' ? '' : bs((float)$l['cant'] * (float)$l['precio']) ?></td>
      </tr>
    <?php endforeach; ?>
    </tbody>
  </table></div>
  <p class="muted">Para agregar más filas, guarda los cambios con «Recalcular» y aparecerán filas vacías nuevas.</p>
</section>

<section class="panel">
  <h2><?= $solarOn ? '3' : '2' ?>. Condiciones y totales</h2>
  <div class="grid">
    <label>Margen comercial (%)<input name="com[margen]" type="number" step="any" value="<?= h($n($com['margen'])) ?>" id="margen"></label>
    <label>Impuestos (%)<input name="com[impuesto]" type="number" step="any" value="<?= h($n($com['impuesto'])) ?>" id="impuesto"></label>
    <label>Validez (días)<input name="com[validez]" type="number" step="1" value="<?= h($n($com['validez'])) ?>"></label>
    <label>Plazo de entrega<input name="com[plazo]" value="<?= h($com['plazo']) ?>"></label>
    <label>Forma de pago<input name="com[pago]" value="<?= h($com['pago']) ?>"></label>
    <label>Garantía<input name="com[garantia]" value="<?= h($com['garantia']) ?>"></label>
    <label class="ancho">Alcance<textarea name="com[alcance]" rows="2"><?= h($com['alcance']) ?></textarea></label>
    <label class="ancho">Observaciones para el cliente (opcional)<textarea name="com[notas]" rows="2"><?= h($com['notas']) ?></textarea></label>
  </div>
  <table class="totales">
    <tr><th>Costo directo</th><td id="t-costo">Bs <?= bs($tot['costo']) ?></td></tr>
    <tr><th>Utilidad (margen)</th><td id="t-util">Bs <?= bs($tot['utilidad']) ?></td></tr>
    <tr><th>Subtotal al cliente</th><td id="t-sub">Bs <?= bs($tot['subtotal']) ?></td></tr>
    <tr><th>Impuestos</th><td id="t-imp">Bs <?= bs($tot['impuestos']) ?></td></tr>
    <tr class="grande"><th>Total propuesto</th><td id="t-total">Bs <?= bs($tot['total']) ?></td></tr>
    <?php if ($solarOn && $solar['kwp'] > 0): ?><tr><th>Precio por kWp</th><td>Bs <?= bs($tot['total'] / $solar['kwp']) ?></td></tr><?php endif; ?>
  </table>
  <div class="acciones">
    <button class="btn btn-sec" name="accion" value="recalcular" type="submit">Recalcular</button>
    <button class="btn" name="accion" value="guardar" type="submit">Guardar y ver cotización</button>
  </div>
</section>
</form>
<script>
(function () {
  var cat = <?= json_encode(array_map(fn($c) => ['cod' => $c[0], 'desc' => $c[2], 'unidad' => $c[3], 'precio' => (float)$c[4]], $cat), JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP) ?>;
  var f = document.getElementById('cot');
  function fmt(n) { return 'Bs ' + n.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function v(el) { var x = parseFloat(String(el.value).replace(',', '.')); return isNaN(x) ? 0 : x; }
  function total() {
    var c = 0;
    f.querySelectorAll('table.items tbody tr').forEach(function (tr) {
      var q = v(tr.querySelector('.cant')), p = v(tr.querySelector('.precio')), s = q * p;
      tr.querySelector('.sub').textContent = q ? s.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '';
      if (tr.querySelector('.desc').value.trim()) c += s;
    });
    var u = c * v(document.getElementById('margen')) / 100, s = c + u, i = s * v(document.getElementById('impuesto')) / 100;
    document.getElementById('t-costo').textContent = fmt(c); document.getElementById('t-util').textContent = fmt(u);
    document.getElementById('t-sub').textContent = fmt(s); document.getElementById('t-imp').textContent = fmt(i);
    document.getElementById('t-total').textContent = fmt(s + i);
  }
  f.addEventListener('input', total);
  f.addEventListener('change', function (e) {
    if (!e.target.classList.contains('cod')) return;
    var tr = e.target.closest('tr'), it = cat.filter(function (c) { return c.cod === e.target.value; })[0];
    if (!it) return;
    tr.querySelector('.desc').value = it.desc; tr.querySelector('.uni').value = it.unidad; tr.querySelector('.precio').value = it.precio;
    if (!tr.querySelector('.cant').value) tr.querySelector('.cant').value = 1;
    total();
  });
})();
</script>
<?php pie();
