<?php
declare(strict_types=1);
require __DIR__ . '/_lib.php';
requiere_login();

$id = (int)($_GET['id'] ?? $_POST['id'] ?? 0);
$lead = q('SELECT * FROM leads WHERE id = ?', [$id])->fetch();
if (!$lead) { http_response_code(404); cabecera('No encontrada'); echo '<p class="vacio">Esa solicitud no existe o fue eliminada. <a href="index.php">Volver a la lista</a></p>'; pie(); exit; }

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
  csrf_ok();
  $acc = (string)($_POST['accion'] ?? '');
  if ($acc === 'estado' && array_key_exists((string)($_POST['estado'] ?? ''), ESTADOS)) {
    q('UPDATE leads SET estado = ?, actualizado = ? WHERE id = ?', [$_POST['estado'], ahora(), $id]);
    aviso('Estado actualizado: ' . ESTADOS[$_POST['estado']] . '.');
  } elseif ($acc === 'nota') {
    $t = texto_largo((string)($_POST['texto'] ?? ''), 3000);
    if ($t !== '') { q('INSERT INTO notas (lead_id, creado, texto) VALUES (?, ?, ?)', [$id, ahora(), $t]); q('UPDATE leads SET actualizado = ? WHERE id = ?', [ahora(), $id]); aviso('Nota guardada.'); }
  } elseif ($acc === 'borrar_nota') {
    q('DELETE FROM notas WHERE id = ? AND lead_id = ?', [(int)($_POST['nota'] ?? 0), $id]);
    aviso('Nota eliminada.');
  } elseif ($acc === 'eliminar' && ($_POST['confirmar'] ?? '') === $lead['codigo']) {
    foreach (q('SELECT ruta FROM archivos WHERE lead_id = ?', [$id])->fetchAll() as $a) @unlink(data_dir() . '/' . $a['ruta']);
    q('DELETE FROM leads WHERE id = ?', [$id]);
    aviso('Se eliminó la solicitud ' . $lead['codigo'] . ' con todos sus datos y archivos.');
    redirigir('index.php');
  } elseif ($acc === 'eliminar') {
    aviso('Para eliminar, escribe el código exacto de la solicitud.');
  }
  redirigir('ver.php?id=' . $id);
}

$datos = json_decode((string)$lead['datos'], true) ?: [];
$archivos = q('SELECT * FROM archivos WHERE lead_id = ? ORDER BY id', [$id])->fetchAll();
$notas = q('SELECT * FROM notas WHERE lead_id = ? ORDER BY id DESC', [$id])->fetchAll();
$cots = q('SELECT id, numero, creado, total FROM cotizaciones WHERE lead_id = ? ORDER BY id DESC', [$id])->fetchAll();
$wa = wa_numero((string)$lead['telefono']);
$saludo = 'Hola ' . $lead['nombre'] . ', le saludamos de E.F.O. Ltda. por su solicitud ' . $lead['codigo'] . ' (' . $lead['tipo'] . ').';

cabecera($lead['codigo']);
?>
<p class="migas"><a href="index.php">← Solicitudes</a></p>
<div class="titulo">
  <h1><?= h($lead['nombre']) ?> <small><?= h($lead['codigo']) ?></small></h1>
  <div class="acciones">
    <a class="btn" href="cotizar.php?lead=<?= $id ?>">Preparar cotización</a>
    <?php if ($wa): ?><a class="btn btn-wa" href="https://wa.me/<?= h($wa) ?>?text=<?= rawurlencode($saludo) ?>" target="_blank" rel="noopener">WhatsApp al cliente</a><?php endif; ?>
    <?php if ($lead['correo']): ?><a class="btn btn-sec" href="mailto:<?= h($lead['correo']) ?>?subject=<?= rawurlencode('E.F.O. Ltda. · Solicitud ' . $lead['codigo']) ?>">Correo</a><?php endif; ?>
  </div>
</div>

<div class="cols">
  <section class="panel">
    <h2>Datos de la solicitud</h2>
    <dl class="datos">
      <dt>Fecha</dt><dd><?= h(fecha($lead['creado'])) ?></dd>
      <dt>Tipo de consulta</dt><dd><?= h($lead['tipo']) ?></dd>
      <?php if ($lead['empresa']): ?><dt>Empresa</dt><dd><?= h($lead['empresa']) ?></dd><?php endif; ?>
      <dt>Teléfono</dt><dd><?= h($lead['telefono']) ?></dd>
      <dt>Correo</dt><dd><?= $lead['correo'] ? h($lead['correo']) : '—' ?></dd>
      <dt>Departamento</dt><dd><?= h($lead['ciudad']) ?></dd>
      <?php foreach ($datos as $k => $v): ?><dt><?= h(CAMPOS[$lead['grupo']][$k] ?? $k) ?></dt><dd><?= h($v) ?></dd><?php endforeach; ?>
      <?php if ($lead['mensaje']): ?><dt>Mensaje</dt><dd class="msg"><?= nl2br(h($lead['mensaje'])) ?></dd><?php endif; ?>
      <dt>Página de origen</dt><dd><?= h($lead['origen'] ?: '—') ?></dd>
    </dl>
    <?php if ($archivos): ?>
      <h3>Archivos adjuntos</h3>
      <ul class="archivos"><?php foreach ($archivos as $a): ?>
        <li><a href="archivo.php?id=<?= (int)$a['id'] ?>" target="_blank" rel="noopener"><?= h($a['nombre']) ?></a> <small><?= bs($a['tamano'] / 1048576, 1) ?> MB</small></li>
      <?php endforeach; ?></ul>
    <?php endif; ?>
  </section>

  <div>
    <section class="panel">
      <h2>Estado</h2>
      <form method="post" class="fila"><?= csrf_campo() ?><input type="hidden" name="accion" value="estado">
        <label class="sr" for="estado">Estado</label>
        <select id="estado" name="estado"><?php foreach (ESTADOS as $k => $t): ?><option value="<?= $k ?>"<?= $lead['estado'] === $k ? ' selected' : '' ?>><?= h($t) ?></option><?php endforeach; ?></select>
        <button class="btn" type="submit">Guardar</button>
      </form>
    </section>

    <section class="panel">
      <h2>Cotizaciones</h2>
      <?php if (!$cots): ?><p class="muted">Todavía no hay cotizaciones para este cliente.</p><?php else: ?>
        <ul class="lista"><?php foreach ($cots as $c): ?>
          <li><a href="cotizacion.php?id=<?= (int)$c['id'] ?>" target="_blank"><b><?= h($c['numero']) ?></b></a> · <?= h(fecha($c['creado'])) ?> · Bs <?= bs($c['total']) ?></li>
        <?php endforeach; ?></ul>
      <?php endif; ?>
      <p><a class="btn btn-sec" href="cotizar.php?lead=<?= $id ?>">Nueva cotización</a></p>
    </section>

    <section class="panel">
      <h2>Notas internas</h2>
      <form method="post"><?= csrf_campo() ?><input type="hidden" name="accion" value="nota">
        <label class="sr" for="texto">Nueva nota</label>
        <textarea id="texto" name="texto" rows="3" placeholder="Ej.: Llamé al cliente, pide visita el lunes."></textarea>
        <button class="btn" type="submit">Agregar nota</button>
      </form>
      <?php foreach ($notas as $n): ?>
        <div class="nota"><small><?= h(fecha($n['creado'])) ?></small><p><?= nl2br(h($n['texto'])) ?></p>
          <form method="post"><?= csrf_campo() ?><input type="hidden" name="accion" value="borrar_nota"><input type="hidden" name="nota" value="<?= (int)$n['id'] ?>"><button class="link" type="submit" onclick="return confirm('¿Eliminar esta nota?')">Eliminar</button></form>
        </div>
      <?php endforeach; ?>
    </section>

    <details class="panel peligro">
      <summary>Eliminar esta solicitud</summary>
      <p>Borra para siempre los datos del cliente, sus archivos, notas y cotizaciones. Úsalo cuando el cliente pida que borren sus datos.</p>
      <form method="post"><?= csrf_campo() ?><input type="hidden" name="accion" value="eliminar">
        <label for="confirmar">Escribe <b><?= h($lead['codigo']) ?></b> para confirmar</label>
        <input id="confirmar" name="confirmar" autocomplete="off">
        <button class="btn btn-peligro" type="submit">Eliminar definitivamente</button>
      </form>
    </details>
  </div>
</div>
<?php pie();
