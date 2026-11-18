<?php
declare(strict_types=1);
require __DIR__ . '/_lib.php';
requiere_login();

$estado = texto_get('estado', 20);
$grupo = texto_get('grupo', 20);
$prio = texto_get('prio', 10);
$resp = texto_get('resp', 10);
$buscar = texto_get('q', 80);
$orden = texto_get('orden', 12);
$pag = max(1, (int)texto_get('p', 6));
$por = 40;

$w = []; $p = [];
if (array_key_exists($estado, ESTADOS)) { $w[] = 'l.estado = ?'; $p[] = $estado; }
elseif ($estado === 'abiertas') { $w[] = "l.estado NOT IN ('ganado', 'perdido')"; }
if ($grupo === 'general') $w[] = "(l.grupo = '' OR l.grupo IS NULL)";
elseif ($grupo !== '' && array_key_exists($grupo, GRUPO_NOMBRE)) { $w[] = 'l.grupo = ?'; $p[] = $grupo; }
if (array_key_exists($prio, PRIORIDADES)) { $w[] = 'l.prioridad = ?'; $p[] = $prio; }
if ($resp === 'sin') $w[] = 'l.asignado IS NULL';
elseif ($resp === 'yo') { $w[] = 'l.asignado = ?'; $p[] = uid(); }
elseif (ctype_digit($resp)) { $w[] = 'l.asignado = ?'; $p[] = (int)$resp; }
if ($buscar !== '') {
  $w[] = '(l.nombre LIKE ? OR l.empresa LIKE ? OR l.telefono LIKE ? OR l.correo LIKE ? OR l.codigo LIKE ?)';
  array_push($p, ...array_fill(0, 5, '%' . $buscar . '%'));
}
$where = $w ? 'WHERE ' . implode(' AND ', $w) : '';
$ordenes = ['recientes' => 'l.id DESC', 'antiguas' => 'l.id ASC', 'valor' => 'l.valor DESC, l.id DESC', 'seguimiento' => 'l.proximo IS NULL, l.proximo ASC', 'actividad' => 'l.actualizado DESC'];
$ordSql = $ordenes[$orden] ?? $ordenes['recientes'];
$total = (int)q("SELECT COUNT(*) FROM leads l $where", $p)->fetchColumn();
$filas = q("SELECT l.*, (SELECT COUNT(*) FROM cotizaciones c WHERE c.lead_id = l.id) AS ncot FROM leads l $where ORDER BY $ordSql LIMIT $por OFFSET " . (($pag - 1) * $por), $p)->fetchAll();
$conteo = [];
foreach (q('SELECT estado, COUNT(*) n FROM leads GROUP BY estado')->fetchAll() as $r) $conteo[$r['estado']] = (int)$r['n'];
$todos = array_sum($conteo);
$url = fn(array $x) => 'solicitudes.php?' . http_build_query(array_filter(array_merge(['estado' => $estado, 'grupo' => $grupo, 'prio' => $prio, 'resp' => $resp, 'q' => $buscar, 'orden' => $orden], $x), fn($v) => $v !== '' && $v !== null));
$hoy = date('Y-m-d');

cabecera('Solicitudes y clientes', 'solicitudes.php');
?>
<div class="titulo"><div><h1>Solicitudes y clientes</h1><p class="muted"><?= $total ?> resultado(s)<?= $buscar !== '' ? ' para «' . h($buscar) . '»' : '' ?></p></div>
  <div class="acciones"><a class="btn btn-sec" href="exportar.php"><?= ico('respaldo') ?><span>Descargar en Excel</span></a><?php if (puede('editar')): ?><a class="btn" href="cliente.php"><?= ico('mas') ?><span>Nuevo cliente</span></a><?php endif; ?></div></div>
<nav class="chips" aria-label="Filtrar por estado">
  <a href="<?= h($url(['estado' => '', 'p' => ''])) ?>"<?= $estado === '' ? ' aria-current="true"' : '' ?>>Todas <b><?= $todos ?></b></a>
  <a href="<?= h($url(['estado' => 'abiertas', 'p' => ''])) ?>"<?= $estado === 'abiertas' ? ' aria-current="true"' : '' ?>>Abiertas <b><?= $todos - ($conteo['ganado'] ?? 0) - ($conteo['perdido'] ?? 0) ?></b></a>
  <?php foreach (ESTADOS as $k => $t): ?>
    <a class="e-<?= $k ?>" href="<?= h($url(['estado' => $k, 'p' => ''])) ?>"<?= $estado === $k ? ' aria-current="true"' : '' ?>><?= h($t) ?> <b><?= $conteo[$k] ?? 0 ?></b></a>
  <?php endforeach; ?>
</nav>
<form class="filtros" method="get">
  <input type="hidden" name="estado" value="<?= h($estado) ?>">
  <label class="sr" for="fq">Buscar</label><input id="fq" name="q" value="<?= h($buscar) ?>" placeholder="Nombre, empresa, teléfono, correo o código">
  <label class="sr" for="fg">Servicio</label>
  <select id="fg" name="grupo"><option value="">Todos los servicios</option><?php foreach (GRUPO_NOMBRE as $k => $t): $v = $k === '' ? 'general' : $k; ?><option value="<?= $v ?>"<?= $grupo === $v ? ' selected' : '' ?>><?= h($t) ?></option><?php endforeach; ?></select>
  <label class="sr" for="fp">Prioridad</label>
  <select id="fp" name="prio"><option value="">Toda prioridad</option><?php foreach (PRIORIDADES as $k => $t): ?><option value="<?= $k ?>"<?= $prio === $k ? ' selected' : '' ?>><?= $t ?></option><?php endforeach; ?></select>
  <label class="sr" for="fr">Responsable</label>
  <select id="fr" name="resp"><option value="">Todo responsable</option><option value="yo"<?= $resp === 'yo' ? ' selected' : '' ?>>Asignados a mí</option><option value="sin"<?= $resp === 'sin' ? ' selected' : '' ?>>Sin asignar</option>
    <?php foreach (usuarios_activos() as $us): ?><option value="<?= (int)$us['id'] ?>"<?= $resp === (string)$us['id'] ? ' selected' : '' ?>><?= h($us['nombre']) ?></option><?php endforeach; ?></select>
  <label class="sr" for="fo">Orden</label>
  <select id="fo" name="orden"><?php foreach (['recientes' => 'Más recientes', 'antiguas' => 'Más antiguas', 'actividad' => 'Última actividad', 'seguimiento' => 'Próximo seguimiento', 'valor' => 'Mayor valor'] as $k => $t): ?><option value="<?= $k ?>"<?= $orden === $k ? ' selected' : '' ?>><?= $t ?></option><?php endforeach; ?></select>
  <button class="btn" type="submit">Filtrar</button>
  <?php if ($grupo . $prio . $resp . $buscar !== ''): ?><a class="btn btn-sec" href="solicitudes.php">Limpiar</a><?php endif; ?>
</form>

<?php if (!$filas): ?>
  <div class="vacio"><h2><?= $todos ? 'No hay resultados con ese filtro' : 'Todavía no hay solicitudes' ?></h2><p><?= $todos ? 'Prueba con otro filtro o búsqueda.' : 'Cuando un cliente llene el formulario de efo.com.bo aparecerá aquí. También puedes cargar clientes que llegan por llamada o visita.' ?></p><?php if (puede('editar')): ?><p><a class="btn" href="cliente.php">Cargar un cliente</a></p><?php endif; ?></div>
<?php else: ?>
<div class="tabla"><table class="lista">
  <thead><tr><th>Cliente</th><th>Servicio</th><th>Estado</th><th>Prioridad</th><th>Responsable</th><th>Seguimiento</th><th class="num">Valor Bs</th></tr></thead>
  <tbody>
  <?php foreach ($filas as $r): $venc = $r['proximo'] && $r['proximo'] < $hoy && !in_array($r['estado'], ['ganado', 'perdido'], true); ?>
    <tr>
      <td><a class="cli" href="ver.php?id=<?= (int)$r['id'] ?>"><span class="g-ico g-<?= h($r['grupo'] ?: 'general') ?>"><?= ico_grupo((string)$r['grupo']) ?></span><span><b><?= h($r['nombre']) ?></b><small><?= h($r['empresa'] ? $r['empresa'] . ' · ' : '') ?><?= h($r['codigo']) ?> · <?= h(hace($r['creado'])) ?></small></span></a></td>
      <td><?= h($r['tipo']) ?><small><?= h($r['ciudad']) ?><?= $r['fuente'] !== 'Formulario web' ? ' · ' . h($r['fuente']) : '' ?></small></td>
      <td><?= chip_estado($r['estado']) ?></td>
      <td><?= chip_prioridad($r['prioridad']) ?></td>
      <td><?= $r['asignado'] ? h(nombre_usuario((int)$r['asignado'])) : '<span class="muted">Sin asignar</span>' ?></td>
      <td class="<?= $venc ? 'rojo' : '' ?>"><?= $r['proximo'] ? date('d/m/Y', strtotime($r['proximo'])) : '—' ?></td>
      <td class="num"><?= (float)$r['valor'] > 0 ? bs($r['valor'], 0) : '—' ?><?= $r['ncot'] ? '<small>' . (int)$r['ncot'] . ' cotiz.</small>' : '' ?></td>
    </tr>
  <?php endforeach; ?>
  </tbody>
</table></div>
<?php if ($total > $por): ?>
  <nav class="pags" aria-label="Páginas"><?php for ($i = 1; $i <= (int)ceil($total / $por); $i++): ?><a href="<?= h($url(['p' => $i])) ?>"<?= $i === $pag ? ' aria-current="page"' : '' ?>><?= $i ?></a><?php endfor; ?></nav>
<?php endif; ?>
<?php endif; ?>
<?php pie();
