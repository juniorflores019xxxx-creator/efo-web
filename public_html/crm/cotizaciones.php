<?php
declare(strict_types=1);
require __DIR__ . '/_lib.php';
requiere_login();

$estado = texto_get('estado', 12);
$buscar = texto_get('q', 80);
$w = []; $p = [];
if (array_key_exists($estado, ESTADOS_COT)) { $w[] = 'c.estado = ?'; $p[] = $estado; }
if ($buscar !== '') { $w[] = '(c.numero LIKE ? OR l.nombre LIKE ? OR l.empresa LIKE ?)'; array_push($p, ...array_fill(0, 3, '%' . $buscar . '%')); }
$where = $w ? 'WHERE ' . implode(' AND ', $w) : '';
$filas = q("SELECT c.id, c.numero, c.creado, c.total, c.estado, c.usuario_id, l.id lid, l.nombre, l.empresa, l.tipo, l.grupo FROM cotizaciones c JOIN leads l ON l.id = c.lead_id $where ORDER BY c.id DESC LIMIT 300", $p)->fetchAll();
$res = [];
foreach (q('SELECT estado, COUNT(*) n, COALESCE(SUM(total), 0) s FROM cotizaciones GROUP BY estado')->fetchAll() as $r) $res[$r['estado']] = $r;
$tot = fn(string $e) => (float)($res[$e]['s'] ?? 0);
$cnt = fn(string $e) => (int)($res[$e]['n'] ?? 0);
$cerradas = $cnt('aceptada') + $cnt('rechazada');
cabecera('Cotizaciones', 'cotizaciones.php');
?>
<div class="titulo"><div><h1>Cotizaciones</h1><p class="muted">Para crear una cotización, entra a la ficha del cliente y presiona «Cotizar».</p></div></div>
<section class="kpis">
  <article class="kpi"><span class="kpi-ico"><?= ico('cotiz') ?></span><small>Borradores</small><b><?= $cnt('borrador') ?></b><span class="kpi-pie">Bs <?= bs($tot('borrador'), 0) ?></span></article>
  <article class="kpi"><span class="kpi-ico"><?= ico('mail') ?></span><small>Enviadas, esperando respuesta</small><b><?= $cnt('enviada') ?></b><span class="kpi-pie">Bs <?= bs($tot('enviada'), 0) ?></span></article>
  <article class="kpi verde"><span class="kpi-ico"><?= ico('tareas') ?></span><small>Aceptadas</small><b><?= $cnt('aceptada') ?></b><span class="kpi-pie">Bs <?= bs($tot('aceptada'), 0) ?></span></article>
  <article class="kpi"><span class="kpi-ico"><?= ico('embudo') ?></span><small>Tasa de aceptación</small><b><?= $cerradas ? round($cnt('aceptada') * 100 / $cerradas) . ' %' : '—' ?></b><span class="kpi-pie"><?= $cnt('rechazada') ?> rechazada(s)</span></article>
</section>
<form class="filtros" method="get">
  <label class="sr" for="cq">Buscar</label><input id="cq" name="q" value="<?= h($buscar) ?>" placeholder="Número de cotización, cliente o empresa">
  <label class="sr" for="ce">Estado</label><select id="ce" name="estado"><option value="">Todos los estados</option><?php foreach (ESTADOS_COT as $k => $t): ?><option value="<?= $k ?>"<?= $estado === $k ? ' selected' : '' ?>><?= $t ?></option><?php endforeach; ?></select>
  <button class="btn" type="submit">Filtrar</button>
</form>
<?php if (!$filas): ?>
  <div class="vacio"><h2>Todavía no hay cotizaciones</h2><p>Abre la ficha de un cliente y presiona «Cotizar». El sistema calcula el sistema solar y arma el PDF con el membrete de E.F.O.</p></div>
<?php else: ?>
<div class="tabla"><table class="lista">
  <thead><tr><th>Número</th><th>Cliente</th><th>Fecha</th><th>Preparada por</th><th>Estado</th><th class="num">Total Bs</th></tr></thead>
  <tbody><?php foreach ($filas as $c): ?>
    <tr><td><a href="cotizacion.php?id=<?= (int)$c['id'] ?>" target="_blank"><b><?= h($c['numero']) ?></b></a></td>
      <td><a class="cli" href="ver.php?id=<?= (int)$c['lid'] ?>"><span class="g-ico g-<?= h($c['grupo'] ?: 'general') ?>"><?= ico_grupo((string)$c['grupo']) ?></span><span><b><?= h($c['nombre']) ?></b><small><?= h($c['empresa'] ?: $c['tipo']) ?></small></span></a></td>
      <td><?= date('d/m/Y', strtotime($c['creado'])) ?></td><td><?= $c['usuario_id'] ? h(nombre_usuario((int)$c['usuario_id'])) : '—' ?></td>
      <td><?= chip_cot($c['estado']) ?></td><td class="num"><b><?= bs($c['total']) ?></b></td></tr>
  <?php endforeach; ?></tbody>
</table></div>
<?php endif; ?>
<?php pie();
