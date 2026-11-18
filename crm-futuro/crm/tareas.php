<?php
declare(strict_types=1);
require __DIR__ . '/_lib.php';
requiere_login();

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
  csrf_ok();
  requiere('tareas');
  $acc = (string)($_POST['accion'] ?? '');
  if ($acc === 'nueva') {
    $t = una_linea((string)($_POST['titulo'] ?? ''), 160);
    $v = preg_match('/^\d{4}-\d{2}-\d{2}$/', (string)($_POST['vence'] ?? '')) ? (string)$_POST['vence'] : null;
    $lead = ctype_digit((string)($_POST['lead'] ?? '')) ? (int)$_POST['lead'] : null;
    if ($lead && !q('SELECT 1 FROM leads WHERE id = ?', [$lead])->fetchColumn()) $lead = null;
    $resp = ctype_digit((string)($_POST['usuario'] ?? '')) ? (int)$_POST['usuario'] : uid();
    if ($t !== '') {
      q('INSERT INTO tareas (lead_id, titulo, vence, usuario_id, creado, creador_id) VALUES (?, ?, ?, ?, ?, ?)', [$lead, $t, $v, $resp, ahora(), uid()]);
      if ($lead) registrar($lead, 'tarea', 'Tarea: ' . $t . ($v ? ' (para el ' . date('d/m/Y', strtotime($v)) . ')' : ''));
      aviso('Tarea creada.');
    }
  } elseif ($acc === 'hecha' || $acc === 'reabrir') {
    $t = q('SELECT * FROM tareas WHERE id = ?', [(int)($_POST['tarea'] ?? 0)])->fetch();
    if ($t) {
      q('UPDATE tareas SET hecha = ? WHERE id = ?', [$acc === 'hecha' ? 1 : 0, $t['id']]);
      if ($t['lead_id']) registrar((int)$t['lead_id'], 'tarea', ($acc === 'hecha' ? 'Tarea completada: ' : 'Tarea reabierta: ') . $t['titulo']);
    }
  } elseif ($acc === 'borrar') {
    $t = q('SELECT * FROM tareas WHERE id = ?', [(int)($_POST['tarea'] ?? 0)])->fetch();
    if ($t && ((int)$t['creador_id'] === uid() || puede('eliminar'))) { q('DELETE FROM tareas WHERE id = ?', [$t['id']]); aviso('Tarea eliminada.'); }
  }
  redirigir('tareas.php' . (isset($_GET['ver']) ? '?ver=' . rawurlencode(texto_get('ver', 10)) : ''));
}

$ver = texto_get('ver', 10) ?: 'mias';
$w = $ver === 'mias' ? 'AND t.usuario_id = ' . (int)uid() : '';
$hoy = date('Y-m-d');
$pend = q("SELECT t.*, l.nombre, l.empresa FROM tareas t LEFT JOIN leads l ON l.id = t.lead_id WHERE t.hecha = 0 $w ORDER BY t.vence IS NULL, t.vence, t.id")->fetchAll();
$hechas = q("SELECT t.*, l.nombre FROM tareas t LEFT JOIN leads l ON l.id = t.lead_id WHERE t.hecha = 1 $w ORDER BY t.id DESC LIMIT 15")->fetchAll();
$grupos = ['Vencidas' => [], 'Hoy' => [], 'Próximos 7 días' => [], 'Más adelante' => [], 'Sin fecha' => []];
$sem = date('Y-m-d', strtotime('+7 days'));
foreach ($pend as $t) {
  $v = $t['vence'];
  $k = !$v ? 'Sin fecha' : ($v < $hoy ? 'Vencidas' : ($v === $hoy ? 'Hoy' : ($v <= $sem ? 'Próximos 7 días' : 'Más adelante')));
  $grupos[$k][] = $t;
}
$abiertos = q("SELECT id, nombre, empresa FROM leads WHERE estado NOT IN ('ganado', 'perdido') ORDER BY actualizado DESC LIMIT 300")->fetchAll();
$fila = function (array $t, bool $hecha) {
  $o = '<li class="' . ($hecha ? 'hecha' : ($t['vence'] && $t['vence'] < date('Y-m-d') ? 'vencida' : '')) . '">';
  if (puede('tareas')) $o .= '<form method="post" class="check">' . csrf_campo() . '<input type="hidden" name="accion" value="' . ($hecha ? 'reabrir' : 'hecha') . '"><input type="hidden" name="tarea" value="' . (int)$t['id'] . '"><button type="submit" class="' . ($hecha ? 'on' : '') . '" title="' . ($hecha ? 'Reabrir' : 'Marcar como hecha') . '" aria-label="' . ($hecha ? 'Reabrir tarea' : 'Marcar como hecha') . '"></button></form>';
  $o .= '<span><b>' . h($t['titulo']) . '</b><small>' . ($t['vence'] ? date('d/m/Y', strtotime($t['vence'])) : 'Sin fecha')
    . ($t['lead_id'] ? ' · <a href="ver.php?id=' . (int)$t['lead_id'] . '">' . h($t['nombre'] ?? '') . '</a>' : '')
    . ($t['usuario_id'] ? ' · ' . h(nombre_usuario((int)$t['usuario_id'])) : '') . '</small></span>';
  if (puede('tareas') && ((int)$t['creador_id'] === uid() || puede('eliminar'))) $o .= '<form method="post" class="borrar">' . csrf_campo() . '<input type="hidden" name="accion" value="borrar"><input type="hidden" name="tarea" value="' . (int)$t['id'] . '"><button class="link" type="submit" onclick="return confirm(\'¿Eliminar esta tarea?\')">Eliminar</button></form>';
  return $o . '</li>';
};
cabecera('Tareas y seguimientos', 'tareas.php');
?>
<div class="titulo"><div><h1>Tareas y seguimientos</h1><p class="muted"><?= count($pend) ?> pendiente(s)</p></div>
  <nav class="chips"><a href="?ver=mias"<?= $ver === 'mias' ? ' aria-current="true"' : '' ?>>Mis tareas</a><a href="?ver=todas"<?= $ver === 'todas' ? ' aria-current="true"' : '' ?>>De todo el equipo</a></nav></div>
<div class="cols">
  <div>
    <?php $alguna = false; foreach ($grupos as $g => $lista): if (!$lista) continue; $alguna = true; ?>
      <section class="panel"><h2 class="<?= $g === 'Vencidas' ? 'rojo' : '' ?>"><?= $g ?> <small class="muted">(<?= count($lista) ?>)</small></h2>
        <ul class="lista-t"><?php foreach ($lista as $t) echo $fila($t, false); ?></ul></section>
    <?php endforeach; ?>
    <?php if (!$alguna): ?><div class="vacio"><h2>Todo al día</h2><p>No hay tareas pendientes<?= $ver === 'mias' ? ' asignadas a ti' : '' ?>.</p></div><?php endif; ?>
    <?php if ($hechas): ?><details class="panel"><summary>Completadas recientemente (<?= count($hechas) ?>)</summary><ul class="lista-t"><?php foreach ($hechas as $t) echo $fila($t, true); ?></ul></details><?php endif; ?>
  </div>
  <?php if (puede('tareas')): ?>
  <section class="panel">
    <h2>Nueva tarea</h2>
    <form method="post" class="apilado"><?= csrf_campo() ?><input type="hidden" name="accion" value="nueva">
      <label>¿Qué hay que hacer?<input name="titulo" required maxlength="160" placeholder="Ej.: Enviar cotización del sistema híbrido"></label>
      <label>Fecha<input name="vence" type="date" value="<?= date('Y-m-d', strtotime('+1 day')) ?>"></label>
      <label>Cliente (opcional)<select name="lead"><option value="">Sin cliente</option><?php foreach ($abiertos as $l): ?><option value="<?= (int)$l['id'] ?>"><?= h($l['nombre'] . ($l['empresa'] ? ' · ' . $l['empresa'] : '')) ?></option><?php endforeach; ?></select></label>
      <label>Responsable<select name="usuario"><?php foreach (usuarios_activos() as $us): ?><option value="<?= (int)$us['id'] ?>"<?= (int)$us['id'] === uid() ? ' selected' : '' ?>><?= h($us['nombre']) ?></option><?php endforeach; ?></select></label>
      <button class="btn" type="submit">Crear tarea</button>
    </form>
  </section>
  <?php endif; ?>
</div>
<?php pie();
