<?php
declare(strict_types=1);
require __DIR__ . '/_lib.php';
requiere_login();

$id = (int)($_GET['id'] ?? $_POST['id'] ?? 0);
$lead = q('SELECT * FROM leads WHERE id = ?', [$id])->fetch();
if (!$lead) { http_response_code(404); cabecera('No encontrada'); echo '<div class="vacio"><h2>Esa solicitud no existe o fue eliminada</h2><p><a class="btn" href="solicitudes.php">Volver a la lista</a></p></div>'; pie(); exit; }
$TIPOS_NOTA = ['nota' => 'Nota', 'llamada' => 'Llamada', 'whatsapp' => 'WhatsApp', 'visita' => 'Visita', 'correo' => 'Correo', 'reunion' => 'Reunión'];

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
  csrf_ok();
  $acc = (string)($_POST['accion'] ?? '');
  if ($acc === 'gestion' && puede('editar')) {
    $nuevo = [
      'estado' => array_key_exists((string)($_POST['estado'] ?? ''), ESTADOS) ? (string)$_POST['estado'] : $lead['estado'],
      'prioridad' => array_key_exists((string)($_POST['prioridad'] ?? ''), PRIORIDADES) ? (string)$_POST['prioridad'] : $lead['prioridad'],
      'asignado' => ctype_digit((string)($_POST['asignado'] ?? '')) ? (int)$_POST['asignado'] : null,
      'proximo' => preg_match('/^\d{4}-\d{2}-\d{2}$/', (string)($_POST['proximo'] ?? '')) ? (string)$_POST['proximo'] : null,
      'valor' => max(0, num($_POST['valor'] ?? 0)),
    ];
    if ($nuevo['asignado'] && !q('SELECT 1 FROM usuarios WHERE id = ? AND activo = 1', [$nuevo['asignado']])->fetchColumn()) $nuevo['asignado'] = null;
    q('UPDATE leads SET estado = ?, prioridad = ?, asignado = ?, proximo = ?, valor = ?, actualizado = ? WHERE id = ?',
      [$nuevo['estado'], $nuevo['prioridad'], $nuevo['asignado'], $nuevo['proximo'], $nuevo['valor'], ahora(), $id]);
    $cambios = [];
    if ($nuevo['estado'] !== $lead['estado']) $cambios[] = 'Estado: ' . ESTADOS[$lead['estado']] . ' → ' . ESTADOS[$nuevo['estado']];
    if ($nuevo['prioridad'] !== $lead['prioridad']) $cambios[] = 'Prioridad: ' . PRIORIDADES[$nuevo['prioridad']];
    if ($nuevo['asignado'] !== ($lead['asignado'] === null ? null : (int)$lead['asignado'])) $cambios[] = 'Responsable: ' . ($nuevo['asignado'] ? nombre_usuario($nuevo['asignado']) : 'sin asignar');
    if ($nuevo['proximo'] !== $lead['proximo']) $cambios[] = 'Próximo seguimiento: ' . ($nuevo['proximo'] ? date('d/m/Y', strtotime($nuevo['proximo'])) : 'sin fecha');
    if (abs($nuevo['valor'] - (float)$lead['valor']) > 0.001) $cambios[] = 'Valor estimado: Bs ' . bs($nuevo['valor'], 0);
    if ($cambios) { registrar($id, $nuevo['estado'] !== $lead['estado'] ? 'estado' : 'cambio', implode(' · ', $cambios)); aviso('Cambios guardados.'); }
    else aviso('No había cambios para guardar.');
  } elseif ($acc === 'nota' && puede('editar')) {
    $t = texto_largo((string)($_POST['texto'] ?? ''), 3000);
    $tipo = array_key_exists((string)($_POST['tipo'] ?? ''), $TIPOS_NOTA) ? (string)$_POST['tipo'] : 'nota';
    if ($t !== '') {
      registrar($id, $tipo, ($tipo === 'nota' ? '' : $TIPOS_NOTA[$tipo] . ': ') . $t);
      if ($lead['estado'] === 'nuevo' && $tipo !== 'nota') { q("UPDATE leads SET estado = 'contactado' WHERE id = ?", [$id]); registrar($id, 'estado', 'Estado: Nuevo → Contactado'); }
      aviso('Guardado en el historial.');
    }
  } elseif ($acc === 'tarea' && puede('tareas')) {
    $t = una_linea((string)($_POST['titulo'] ?? ''), 160);
    $v = preg_match('/^\d{4}-\d{2}-\d{2}$/', (string)($_POST['vence'] ?? '')) ? (string)$_POST['vence'] : null;
    $resp = ctype_digit((string)($_POST['usuario'] ?? '')) ? (int)$_POST['usuario'] : uid();
    if ($t !== '') {
      q('INSERT INTO tareas (lead_id, titulo, vence, usuario_id, creado, creador_id) VALUES (?, ?, ?, ?, ?, ?)', [$id, $t, $v, $resp, ahora(), uid()]);
      if ($v && (!$lead['proximo'] || $v < $lead['proximo'] || $lead['proximo'] < date('Y-m-d'))) q('UPDATE leads SET proximo = ? WHERE id = ?', [$v, $id]);
      registrar($id, 'tarea', 'Tarea: ' . $t . ($v ? ' (para el ' . date('d/m/Y', strtotime($v)) . ')' : ''));
      aviso('Tarea creada.');
    }
  } elseif ($acc === 'tarea_hecha' && puede('tareas')) {
    $t = q('SELECT * FROM tareas WHERE id = ? AND lead_id = ?', [(int)($_POST['tarea'] ?? 0), $id])->fetch();
    if ($t && !$t['hecha']) { q('UPDATE tareas SET hecha = 1 WHERE id = ?', [$t['id']]); registrar($id, 'tarea', 'Tarea completada: ' . $t['titulo']); aviso('Tarea completada.'); }
  } elseif ($acc === 'cot_estado' && puede('cotizar')) {
    $c = q('SELECT * FROM cotizaciones WHERE id = ? AND lead_id = ?', [(int)($_POST['cot'] ?? 0), $id])->fetch();
    $e = (string)($_POST['estado'] ?? '');
    if ($c && array_key_exists($e, ESTADOS_COT) && $e !== $c['estado']) {
      q('UPDATE cotizaciones SET estado = ? WHERE id = ?', [$e, $c['id']]);
      registrar($id, 'cotizacion', 'Cotización ' . $c['numero'] . ': ' . ESTADOS_COT[$e]);
      if ($e === 'aceptada' && $lead['estado'] !== 'ganado') { q("UPDATE leads SET estado = 'ganado', valor = ? WHERE id = ?", [$c['total'], $id]); registrar($id, 'estado', 'Estado: ' . ESTADOS[$lead['estado']] . ' → Ganado'); }
      aviso('Cotización marcada como ' . mb_strtolower(ESTADOS_COT[$e]) . '.');
    }
  } elseif ($acc === 'eliminar' && puede('eliminar')) {
    if (($_POST['confirmar'] ?? '') === $lead['codigo']) {
      foreach (q('SELECT ruta FROM archivos WHERE lead_id = ?', [$id])->fetchAll() as $a) @unlink(data_dir() . '/' . $a['ruta']);
      q('DELETE FROM leads WHERE id = ?', [$id]);
      registrar(null, 'eliminado', 'Se eliminó la solicitud ' . $lead['codigo'] . ' a pedido del cliente o por depuración.');
      aviso('Se eliminó la solicitud ' . $lead['codigo'] . ' con todos sus datos y archivos.');
      redirigir('solicitudes.php');
    }
    aviso('Para eliminar, escribe el código exacto de la solicitud.');
  }
  redirigir('ver.php?id=' . $id);
}

$datos = json_decode((string)$lead['datos'], true) ?: [];
$archivos = q('SELECT * FROM archivos WHERE lead_id = ? ORDER BY id', [$id])->fetchAll();
$act = q('SELECT * FROM actividad WHERE lead_id = ? ORDER BY id DESC LIMIT 200', [$id])->fetchAll();
$tareas = q('SELECT * FROM tareas WHERE lead_id = ? ORDER BY hecha, vence IS NULL, vence', [$id])->fetchAll();
$cots = q('SELECT id, numero, creado, total, estado FROM cotizaciones WHERE lead_id = ? ORDER BY id DESC', [$id])->fetchAll();
$wa = wa_numero((string)$lead['telefono']);
$saludo = 'Hola ' . $lead['nombre'] . ', le saludamos de E.F.O. Ltda. por su solicitud ' . $lead['codigo'] . ' (' . $lead['tipo'] . ').';
$hoy = date('Y-m-d');
$ed = puede('editar');

cabecera($lead['nombre'] . ' · ' . $lead['codigo'], 'solicitudes.php');
?>
<p class="migas"><a href="solicitudes.php">← Solicitudes y clientes</a></p>
<section class="ficha-top">
  <span class="g-ico grande g-<?= h($lead['grupo'] ?: 'general') ?>"><?= ico_grupo((string)$lead['grupo']) ?></span>
  <div class="ficha-nombre">
    <h1><?= h($lead['nombre']) ?></h1>
    <p><?= $lead['empresa'] ? '<b>' . h($lead['empresa']) . '</b> · ' : '' ?><?= h($lead['codigo']) ?> · <?= h($lead['tipo']) ?> · <?= h($lead['ciudad']) ?> · <?= h($lead['fuente']) ?></p>
    <p class="chips-fila"><?= chip_estado($lead['estado']) ?> <?= chip_prioridad($lead['prioridad']) ?><?= (float)$lead['valor'] > 0 ? ' <span class="valor">Bs ' . bs($lead['valor'], 0) . '</span>' : '' ?></p>
  </div>
  <div class="acciones">
    <?php if (puede('cotizar')): ?><a class="btn btn-cyan" href="cotizar.php?lead=<?= $id ?>"><?= ico('cotiz') ?><span>Cotizar</span></a><?php endif; ?>
    <?php if ($wa): ?><a class="btn btn-wa" href="https://wa.me/<?= h($wa) ?>?text=<?= rawurlencode($saludo) ?>" target="_blank" rel="noopener"><?= ico('wa') ?><span>WhatsApp</span></a>
    <a class="btn btn-sec" href="tel:+<?= h($wa) ?>"><?= ico('tel') ?><span>Llamar</span></a><?php endif; ?>
    <?php if ($lead['correo']): ?><a class="btn btn-sec" href="mailto:<?= h($lead['correo']) ?>?subject=<?= rawurlencode('E.F.O. Ltda. · Solicitud ' . $lead['codigo']) ?>"><?= ico('mail') ?><span>Correo</span></a><?php endif; ?>
    <?php if ($ed): ?><a class="btn btn-sec" href="cliente.php?id=<?= $id ?>"><?= ico('editar') ?><span>Editar datos</span></a><?php endif; ?>
  </div>
</section>

<div class="cols">
  <div>
    <section class="panel">
      <h2>Datos de la solicitud</h2>
      <dl class="datos">
        <dt>Recibida</dt><dd><?= h(fecha($lead['creado'])) ?> <small class="muted">(<?= h(hace($lead['creado'])) ?>)</small></dd>
        <dt>Teléfono</dt><dd><?= h($lead['telefono']) ?></dd>
        <dt>Correo</dt><dd><?= $lead['correo'] ? h($lead['correo']) : '—' ?></dd>
        <dt>Departamento</dt><dd><?= h($lead['ciudad']) ?></dd>
        <?php foreach ($datos as $k => $v): ?><dt><?= h(CAMPOS[$lead['grupo']][$k] ?? $k) ?></dt><dd><?= h($v) ?></dd><?php endforeach; ?>
        <?php if ($lead['mensaje']): ?><dt>Mensaje</dt><dd class="msg"><?= nl2br(h($lead['mensaje'])) ?></dd><?php endif; ?>
        <?php if ($lead['origen']): ?><dt>Página de origen</dt><dd><?= h($lead['origen']) ?></dd><?php endif; ?>
      </dl>
      <?php if ($archivos): ?>
        <h3>Archivos adjuntos</h3>
        <ul class="archivos"><?php foreach ($archivos as $a): ?>
          <li><a href="archivo.php?id=<?= (int)$a['id'] ?>" target="_blank" rel="noopener"><?= h($a['nombre']) ?></a> <small class="muted"><?= bs($a['tamano'] / 1048576, 1) ?> MB</small></li>
        <?php endforeach; ?></ul>
      <?php endif; ?>
    </section>

    <section class="panel">
      <div class="panel-t"><h2>Cotizaciones</h2><?php if (puede('cotizar')): ?><a href="cotizar.php?lead=<?= $id ?>">+ Nueva</a><?php endif; ?></div>
      <?php if (!$cots): ?><p class="muted">Todavía no hay cotizaciones para este cliente.</p><?php else: ?>
      <div class="tabla"><table>
        <thead><tr><th>Número</th><th>Fecha</th><th class="num">Total Bs</th><th>Estado</th><th></th></tr></thead>
        <tbody><?php foreach ($cots as $c): ?>
          <tr><td><a href="cotizacion.php?id=<?= (int)$c['id'] ?>" target="_blank"><b><?= h($c['numero']) ?></b></a></td><td><?= date('d/m/Y', strtotime($c['creado'])) ?></td><td class="num"><?= bs($c['total']) ?></td>
            <td><?php if (puede('cotizar')): ?><form method="post" class="mini"><?= csrf_campo() ?><input type="hidden" name="accion" value="cot_estado"><input type="hidden" name="cot" value="<?= (int)$c['id'] ?>">
              <label class="sr" for="ce<?= (int)$c['id'] ?>">Estado</label><select id="ce<?= (int)$c['id'] ?>" name="estado" onchange="this.form.submit()"><?php foreach (ESTADOS_COT as $k => $t): ?><option value="<?= $k ?>"<?= $c['estado'] === $k ? ' selected' : '' ?>><?= $t ?></option><?php endforeach; ?></select></form>
              <?php else: ?><?= chip_cot($c['estado']) ?><?php endif; ?></td>
            <td><?php if (puede('cotizar')): ?><a href="cotizar.php?lead=<?= $id ?>&amp;desde=<?= (int)$c['id'] ?>" title="Duplicar y editar"><?= ico('copiar') ?><span class="sr">Duplicar</span></a><?php endif; ?></td></tr>
        <?php endforeach; ?></tbody>
      </table></div><?php endif; ?>
    </section>

    <section class="panel">
      <div class="panel-t"><h2>Tareas</h2></div>
      <?php if ($tareas): ?><ul class="lista-t">
        <?php foreach ($tareas as $t): $venc = !$t['hecha'] && $t['vence'] && $t['vence'] < $hoy; ?>
          <li class="<?= $t['hecha'] ? 'hecha' : ($venc ? 'vencida' : '') ?>">
            <?php if (!$t['hecha'] && puede('tareas')): ?><form method="post" class="check"><?= csrf_campo() ?><input type="hidden" name="accion" value="tarea_hecha"><input type="hidden" name="tarea" value="<?= (int)$t['id'] ?>"><button type="submit" title="Marcar como hecha" aria-label="Marcar como hecha"></button></form><?php endif; ?>
            <span><b><?= h($t['titulo']) ?></b><small><?= $t['vence'] ? ($t['hecha'] ? 'Para el ' : ($venc ? 'Venció el ' : 'Vence el ')) . date('d/m/Y', strtotime($t['vence'])) : 'Sin fecha' ?><?= $t['usuario_id'] ? ' · ' . h(nombre_usuario((int)$t['usuario_id'])) : '' ?></small></span>
          </li>
        <?php endforeach; ?></ul><?php else: ?><p class="muted">Sin tareas.</p><?php endif; ?>
      <?php if (puede('tareas')): ?>
      <form method="post" class="form-tarea"><?= csrf_campo() ?><input type="hidden" name="accion" value="tarea">
        <label class="sr" for="tt">Nueva tarea</label><input id="tt" name="titulo" placeholder="Ej.: Llamar para coordinar la visita técnica" required>
        <label class="sr" for="tv">Fecha</label><input id="tv" name="vence" type="date" value="<?= date('Y-m-d', strtotime('+1 day')) ?>">
        <label class="sr" for="tu">Responsable</label><select id="tu" name="usuario"><?php foreach (usuarios_activos() as $us): ?><option value="<?= (int)$us['id'] ?>"<?= (int)$us['id'] === uid() ? ' selected' : '' ?>><?= h($us['nombre']) ?></option><?php endforeach; ?></select>
        <button class="btn" type="submit">Agregar</button>
      </form><?php endif; ?>
    </section>
  </div>

  <div>
    <?php if ($ed): ?>
    <section class="panel">
      <h2>Gestión comercial</h2>
      <form method="post" class="grid dos"><?= csrf_campo() ?><input type="hidden" name="accion" value="gestion">
        <label>Estado<select name="estado"><?php foreach (ESTADOS as $k => $t): ?><option value="<?= $k ?>"<?= $lead['estado'] === $k ? ' selected' : '' ?>><?= $t ?></option><?php endforeach; ?></select></label>
        <label>Prioridad<select name="prioridad"><?php foreach (PRIORIDADES as $k => $t): ?><option value="<?= $k ?>"<?= $lead['prioridad'] === $k ? ' selected' : '' ?>><?= $t ?></option><?php endforeach; ?></select></label>
        <label>Responsable<select name="asignado"><option value="">Sin asignar</option><?php foreach (usuarios_activos() as $us): ?><option value="<?= (int)$us['id'] ?>"<?= (int)$lead['asignado'] === (int)$us['id'] ? ' selected' : '' ?>><?= h($us['nombre']) ?></option><?php endforeach; ?></select></label>
        <label>Próximo seguimiento<input type="date" name="proximo" value="<?= h($lead['proximo']) ?>"></label>
        <label class="ancho">Valor estimado de la venta (Bs)<input type="number" name="valor" min="0" step="any" value="<?= (float)$lead['valor'] > 0 ? h(rtrim(rtrim(number_format((float)$lead['valor'], 2, '.', ''), '0'), '.')) : '' ?>" placeholder="Se completa solo al guardar una cotización"></label>
        <div class="ancho"><button class="btn" type="submit">Guardar cambios</button></div>
      </form>
    </section>
    <?php endif; ?>

    <section class="panel">
      <h2>Historial</h2>
      <?php if ($ed): ?>
      <form method="post" class="form-nota"><?= csrf_campo() ?><input type="hidden" name="accion" value="nota">
        <div class="tipos" role="radiogroup" aria-label="Tipo de registro"><?php $i = 0; foreach ($TIPOS_NOTA as $k => $t): ?><label class="tipo"><input type="radio" name="tipo" value="<?= $k ?>"<?= $i++ === 0 ? ' checked' : '' ?>><span><?= $t ?></span></label><?php endforeach; ?></div>
        <label class="sr" for="texto">Detalle</label>
        <textarea id="texto" name="texto" rows="3" placeholder="Ej.: Hablé con el cliente; quiere la visita técnica el lunes a las 10:00." required></textarea>
        <button class="btn" type="submit">Guardar en el historial</button>
      </form><?php endif; ?>
      <ul class="linea grande">
        <?php foreach ($act as $a): ?>
          <li class="t-<?= h($a['tipo']) ?>"><span><?= nl2br(h($a['texto'])) ?></span><small><?= $a['usuario_id'] ? h(nombre_usuario((int)$a['usuario_id'])) . ' · ' : 'Sistema · ' ?><?= h(fecha($a['creado'])) ?></small></li>
        <?php endforeach; ?>
        <?php if (!$act): ?><li class="t-creado"><span>Solicitud recibida.</span><small><?= h(fecha($lead['creado'])) ?></small></li><?php endif; ?>
      </ul>
    </section>

    <?php if (puede('eliminar')): ?>
    <details class="panel peligro">
      <summary>Eliminar esta solicitud</summary>
      <p>Borra para siempre los datos del cliente, sus archivos, su historial, sus tareas y sus cotizaciones. Úsalo cuando el cliente pida que se borren sus datos.</p>
      <form method="post"><?= csrf_campo() ?><input type="hidden" name="accion" value="eliminar">
        <label for="confirmar">Escribe <b><?= h($lead['codigo']) ?></b> para confirmar</label>
        <input id="confirmar" name="confirmar" autocomplete="off">
        <button class="btn btn-peligro" type="submit">Eliminar definitivamente</button>
      </form>
    </details>
    <?php endif; ?>
  </div>
</div>
<?php pie();
