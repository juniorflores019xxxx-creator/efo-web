<?php
declare(strict_types=1);
require __DIR__ . '/_lib.php';
requiere_login();

$hoy = date('Y-m-d');
$mes = date('Y-m-01');
$mesAnt = date('Y-m-01', strtotime('first day of last month'));
$n = fn(string $sql, array $p = []) => (float)q($sql, $p)->fetchColumn();

$delMes = (int)$n('SELECT COUNT(*) FROM leads WHERE creado >= ?', [$mes]);
$mesPasado = (int)$n('SELECT COUNT(*) FROM leads WHERE creado >= ? AND creado < ?', [$mesAnt, $mes]);
$nuevas = (int)$n("SELECT COUNT(*) FROM leads WHERE estado = 'nuevo'");
$enJuego = $n("SELECT COALESCE(SUM(valor), 0) FROM leads WHERE estado IN ('cotizado', 'visita')");
$nJuego = (int)$n("SELECT COUNT(*) FROM leads WHERE estado IN ('cotizado', 'visita')");
$ganadoMes = $n("SELECT COALESCE(SUM(valor), 0) FROM leads WHERE estado = 'ganado' AND actualizado >= ?", [$mes]);
$nGanadoMes = (int)$n("SELECT COUNT(*) FROM leads WHERE estado = 'ganado' AND actualizado >= ?", [$mes]);
$g = (int)$n("SELECT COUNT(*) FROM leads WHERE estado = 'ganado'");
$p = (int)$n("SELECT COUNT(*) FROM leads WHERE estado = 'perdido'");
$conv = $g + $p > 0 ? round($g * 100 / ($g + $p)) : null;
$total = (int)$n('SELECT COUNT(*) FROM leads');

// Por servicio
$porGrupo = [];
foreach (q("SELECT COALESCE(grupo, '') g, COUNT(*) n FROM leads GROUP BY COALESCE(grupo, '')")->fetchAll() as $r) $porGrupo[$r['g']] = (int)$r['n'];
// Por estado
$porEstado = array_fill_keys(array_keys(ESTADOS), 0);
foreach (q('SELECT estado, COUNT(*) n FROM leads GROUP BY estado')->fetchAll() as $r) if (isset($porEstado[$r['estado']])) $porEstado[$r['estado']] = (int)$r['n'];
// Últimos 30 días
$dias = [];
for ($i = 29; $i >= 0; $i--) $dias[date('Y-m-d', strtotime("-$i days"))] = 0;
foreach (q('SELECT substr(creado, 1, 10) d, COUNT(*) n FROM leads WHERE creado >= ? GROUP BY d', [array_key_first($dias)])->fetchAll() as $r) if (isset($dias[$r['d']])) $dias[$r['d']] = (int)$r['n'];

$tareas = q('SELECT t.*, l.nombre, l.codigo FROM tareas t LEFT JOIN leads l ON l.id = t.lead_id WHERE t.hecha = 0 AND (t.vence IS NULL OR t.vence <= ?) ORDER BY t.vence IS NULL, t.vence LIMIT 7', [date('Y-m-d', strtotime('+2 days'))])->fetchAll();
$ultimas = q('SELECT * FROM leads ORDER BY id DESC LIMIT 6')->fetchAll();
$act = q('SELECT a.*, l.nombre, l.codigo FROM actividad a LEFT JOIN leads l ON l.id = a.lead_id ORDER BY a.id DESC LIMIT 8')->fetchAll();

$u = usuario();
$h = (int)date('G');
$saludo = $h < 12 ? 'Buenos días' : ($h < 19 ? 'Buenas tardes' : 'Buenas noches');
cabecera('Inicio', 'index.php');
?>
<div class="titulo"><div><h1><?= $saludo ?>, <?= h(explode(' ', $u['nombre'])[0]) ?></h1><p class="muted"><?= h(fecha_larga($hoy)) ?> · Resumen comercial de E.F.O.</p></div>
  <div class="acciones"><a class="btn btn-sec" href="embudo.php"><?= ico('embudo') ?><span>Ver embudo</span></a></div></div>

<section class="kpis" aria-label="Indicadores">
  <article class="kpi"><span class="kpi-ico"><?= ico('clientes') ?></span><small>Solicitudes este mes</small><b><?= $delMes ?></b>
    <span class="kpi-pie"><?php if ($mesPasado): $d = $delMes - $mesPasado; ?><span class="<?= $d >= 0 ? 'sube' : 'baja' ?>"><?= $d >= 0 ? '▲' : '▼' ?> <?= abs($d) ?></span> vs. mes anterior<?php else: ?><?= $total ?> en total<?php endif; ?></span></article>
  <article class="kpi alerta-kpi"><span class="kpi-ico"><?= ico('chat') ?></span><small>Sin atender</small><b><?= $nuevas ?></b><span class="kpi-pie"><a href="solicitudes.php?estado=nuevo">Ver solicitudes nuevas →</a></span></article>
  <article class="kpi"><span class="kpi-ico"><?= ico('cotiz') ?></span><small>En negociación</small><b>Bs <?= bs($enJuego, 0) ?></b><span class="kpi-pie"><?= $nJuego ?> cliente(s) cotizados o en visita</span></article>
  <article class="kpi verde"><span class="kpi-ico"><?= ico('tareas') ?></span><small>Ganado este mes</small><b>Bs <?= bs($ganadoMes, 0) ?></b><span class="kpi-pie"><?= $nGanadoMes ?> venta(s) · conversión <?= $conv === null ? '—' : $conv . ' %' ?></span></article>
</section>

<div class="tablero">
  <section class="panel">
    <div class="panel-t"><h2>Solicitudes de los últimos 30 días</h2></div>
    <?php $max = max(1, max($dias)); $w = 100 / count($dias); ?>
    <svg class="grafico" viewBox="0 0 300 120" preserveAspectRatio="none" role="img" aria-label="Solicitudes por día en los últimos 30 días">
      <line x1="0" y1="110" x2="300" y2="110" class="eje"/>
      <?php $i = 0; foreach ($dias as $d => $v): $alto = $v / $max * 100; ?>
        <rect x="<?= round($i * 10 + 1.5, 2) ?>" y="<?= round(110 - $alto, 2) ?>" width="7" height="<?= round(max($alto, $v ? 2 : 0.6), 2) ?>" rx="1.5" class="<?= $v ? 'barra-v' : 'barra-0' ?>"><title><?= date('d/m', strtotime($d)) ?>: <?= $v ?> solicitud(es)</title></rect>
      <?php $i++; endforeach; ?>
    </svg>
    <div class="eje-x"><span><?= date('d/m', strtotime(array_key_first($dias))) ?></span><span>Hoy</span></div>
  </section>

  <section class="panel">
    <div class="panel-t"><h2>Por servicio</h2></div>
    <?php $maxG = max(1, $porGrupo ? max($porGrupo) : 1); ?>
    <ul class="barras">
      <?php foreach (GRUPO_NOMBRE as $k => $t): $v = $porGrupo[$k] ?? 0; ?>
        <li><span class="b-et"><?= ico_grupo($k) ?><?= h($t) ?></span><span class="b-bar"><i class="g-<?= $k ?: 'general' ?>" style="width:<?= round($v / $maxG * 100) ?>%"></i></span><b><?= $v ?></b></li>
      <?php endforeach; ?>
    </ul>
  </section>

  <section class="panel">
    <div class="panel-t"><h2>Embudo de ventas</h2><a href="embudo.php">Abrir tablero</a></div>
    <?php $maxE = max(1, max($porEstado)); ?>
    <ul class="barras embudo-mini">
      <?php foreach (ESTADOS as $k => $t): ?>
        <li><a class="b-et" href="solicitudes.php?estado=<?= $k ?>"><?= h($t) ?></a><span class="b-bar"><i class="e-<?= $k ?>" style="width:<?= round($porEstado[$k] / $maxE * 100) ?>%"></i></span><b><?= $porEstado[$k] ?></b></li>
      <?php endforeach; ?>
    </ul>
  </section>

  <section class="panel">
    <div class="panel-t"><h2>Tareas para hoy y vencidas</h2><a href="tareas.php">Todas</a></div>
    <?php if (!$tareas): ?><p class="muted">No hay tareas pendientes para estos días. 👍</p><?php else: ?>
    <ul class="lista-t">
      <?php foreach ($tareas as $t): $venc = $t['vence'] && $t['vence'] < $hoy; ?>
        <li class="<?= $venc ? 'vencida' : '' ?>"><b><?= h($t['titulo']) ?></b>
          <small><?= $t['vence'] ? ($venc ? 'Venció el ' : 'Vence el ') . date('d/m', strtotime($t['vence'])) : 'Sin fecha' ?><?= $t['lead_id'] ? ' · <a href="ver.php?id=' . (int)$t['lead_id'] . '">' . h($t['nombre']) . '</a>' : '' ?><?= $t['usuario_id'] ? ' · ' . h(nombre_usuario((int)$t['usuario_id'])) : '' ?></small></li>
      <?php endforeach; ?>
    </ul><?php endif; ?>
  </section>

  <section class="panel">
    <div class="panel-t"><h2>Últimas solicitudes</h2><a href="solicitudes.php">Ver todas</a></div>
    <?php if (!$ultimas): ?><p class="muted">Todavía no llegaron solicitudes. Cuando un cliente llene el formulario de efo.com.bo, aparecerá aquí.</p><?php else: ?>
    <ul class="lista-c">
      <?php foreach ($ultimas as $r): ?>
        <li><span class="g-ico g-<?= h($r['grupo'] ?: 'general') ?>"><?= ico_grupo((string)$r['grupo']) ?></span>
          <span><a href="ver.php?id=<?= (int)$r['id'] ?>"><b><?= h($r['nombre']) ?></b></a><small><?= h($r['tipo']) ?> · <?= h($r['ciudad']) ?> · <?= h(hace($r['creado'])) ?></small></span><?= chip_estado($r['estado']) ?></li>
      <?php endforeach; ?>
    </ul><?php endif; ?>
  </section>

  <section class="panel">
    <div class="panel-t"><h2>Actividad reciente</h2></div>
    <?php if (!$act): ?><p class="muted">Aquí verás lo que va haciendo el equipo: estados, notas, cotizaciones y tareas.</p><?php else: ?>
    <ul class="linea">
      <?php foreach ($act as $a): ?>
        <li class="t-<?= h($a['tipo']) ?>"><span><?= h($a['texto']) ?></span><small><?= $a['lead_id'] ? '<a href="ver.php?id=' . (int)$a['lead_id'] . '">' . h($a['nombre'] ?? '') . '</a> · ' : '' ?><?= $a['usuario_id'] ? h(nombre_usuario((int)$a['usuario_id'])) . ' · ' : '' ?><?= h(hace($a['creado'])) ?></small></li>
      <?php endforeach; ?>
    </ul><?php endif; ?>
  </section>
</div>
<?php pie();
