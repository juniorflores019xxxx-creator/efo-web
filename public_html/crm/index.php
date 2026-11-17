<?php
declare(strict_types=1);
require __DIR__ . '/_lib.php';
requiere_login();

$estado = (string)($_GET['estado'] ?? '');
$grupo = (string)($_GET['grupo'] ?? '');
$buscar = una_linea((string)($_GET['q'] ?? ''), 80);
$pag = max(1, (int)($_GET['p'] ?? 1));
$por = 50;

$w = []; $p = [];
if (array_key_exists($estado, ESTADOS)) { $w[] = 'estado = ?'; $p[] = $estado; }
if ($grupo !== '' && array_key_exists($grupo, GRUPO_NOMBRE)) { $w[] = 'grupo = ?'; $p[] = $grupo; }
elseif ($grupo === 'general') { $w[] = "(grupo = '' OR grupo IS NULL)"; }
if ($buscar !== '') {
  $w[] = '(nombre LIKE ? OR empresa LIKE ? OR telefono LIKE ? OR correo LIKE ? OR codigo LIKE ?)';
  array_push($p, ...array_fill(0, 5, '%' . $buscar . '%'));
}
$where = $w ? 'WHERE ' . implode(' AND ', $w) : '';
$total = (int)q("SELECT COUNT(*) FROM leads $where", $p)->fetchColumn();
$filas = q("SELECT l.*, (SELECT COUNT(*) FROM cotizaciones c WHERE c.lead_id = l.id) AS ncot FROM leads l $where ORDER BY l.id DESC LIMIT $por OFFSET " . (($pag - 1) * $por), $p)->fetchAll();
$conteo = [];
foreach (q('SELECT estado, COUNT(*) n FROM leads GROUP BY estado')->fetchAll() as $r) $conteo[$r['estado']] = (int)$r['n'];
$todos = array_sum($conteo);
$url = fn(array $x) => 'index.php?' . http_build_query(array_filter(array_merge(['estado' => $estado, 'grupo' => $grupo, 'q' => $buscar], $x), fn($v) => $v !== '' && $v !== null));

cabecera('Solicitudes', 'index.php');
?>
<div class="titulo"><h1>Solicitudes</h1><a class="btn btn-sec" href="exportar.php">Descargar en Excel (CSV)</a></div>
<nav class="chips" aria-label="Filtrar por estado">
  <a href="<?= h($url(['estado' => '', 'p' => ''])) ?>"<?= $estado === '' ? ' aria-current="true"' : '' ?>>Todas <b><?= $todos ?></b></a>
  <?php foreach (ESTADOS as $k => $t): ?>
    <a class="e-<?= $k ?>" href="<?= h($url(['estado' => $k, 'p' => ''])) ?>"<?= $estado === $k ? ' aria-current="true"' : '' ?>><?= h($t) ?> <b><?= $conteo[$k] ?? 0 ?></b></a>
  <?php endforeach; ?>
</nav>
<form class="filtros" method="get">
  <input type="hidden" name="estado" value="<?= h($estado) ?>">
  <label class="sr" for="q">Buscar</label><input id="q" name="q" value="<?= h($buscar) ?>" placeholder="Buscar por nombre, empresa, teléfono, correo o código">
  <label class="sr" for="grupo">Servicio</label>
  <select id="grupo" name="grupo"><option value="">Todos los servicios</option>
    <?php foreach (GRUPO_NOMBRE as $k => $t): $v = $k === '' ? 'general' : $k; ?><option value="<?= $v ?>"<?= $grupo === $v ? ' selected' : '' ?>><?= h($t) ?></option><?php endforeach; ?>
  </select>
  <button class="btn" type="submit">Filtrar</button>
</form>

<?php if (!$filas): ?>
  <p class="vacio"><?= $todos ? 'No hay solicitudes con ese filtro.' : 'Todavía no llegaron solicitudes. Cuando un cliente llene el formulario de la web, aparecerá aquí.' ?></p>
<?php else: ?>
<div class="tabla"><table>
  <thead><tr><th>Código</th><th>Fecha</th><th>Cliente</th><th>Servicio</th><th>Departamento</th><th>Estado</th><th>Cotiz.</th></tr></thead>
  <tbody>
  <?php foreach ($filas as $r): ?>
    <tr>
      <td><a href="ver.php?id=<?= (int)$r['id'] ?>"><b><?= h($r['codigo']) ?></b></a></td>
      <td><?= h(fecha($r['creado'])) ?></td>
      <td><a href="ver.php?id=<?= (int)$r['id'] ?>"><?= h($r['nombre']) ?></a><?= $r['empresa'] ? '<small>' . h($r['empresa']) . '</small>' : '' ?><small><?= h($r['telefono']) ?></small></td>
      <td><?= h($r['tipo']) ?></td>
      <td><?= h($r['ciudad']) ?></td>
      <td><span class="estado e-<?= h($r['estado']) ?>"><?= h(ESTADOS[$r['estado']] ?? $r['estado']) ?></span></td>
      <td><?= (int)$r['ncot'] ?: '—' ?></td>
    </tr>
  <?php endforeach; ?>
  </tbody>
</table></div>
<?php if ($total > $por): ?>
  <nav class="pags"><?php for ($i = 1; $i <= (int)ceil($total / $por); $i++): ?><a href="<?= h($url(['p' => $i])) ?>"<?= $i === $pag ? ' aria-current="page"' : '' ?>><?= $i ?></a><?php endfor; ?></nav>
<?php endif; ?>
<?php endif; ?>
<?php pie();
