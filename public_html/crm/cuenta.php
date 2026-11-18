<?php
declare(strict_types=1);
require __DIR__ . '/_lib.php';
requiere_login();
$yo = usuario();

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
  csrf_ok();
  $acc = (string)($_POST['accion'] ?? '');
  if ($acc === 'clave') {
    $nueva = (string)($_POST['nueva'] ?? '');
    if (!password_verify((string)($_POST['actual'] ?? ''), $yo['hash'])) aviso('La contraseña actual no es correcta.');
    elseif (mb_strlen($nueva) < 10) aviso('La nueva contraseña debe tener al menos 10 caracteres.');
    elseif ($nueva !== (string)($_POST['repite'] ?? '')) aviso('Las dos contraseñas nuevas no coinciden.');
    else {
      $h = password_hash($nueva, PASSWORD_DEFAULT);
      q('UPDATE usuarios SET hash = ? WHERE id = ?', [$h, $yo['id']]);
      $_SESSION['h'] = huella($h); // las otras sesiones abiertas de este usuario se cierran
      aviso('Contraseña cambiada.');
    }
  } elseif ($acc === 'perfil') {
    $nom = una_linea((string)($_POST['nombre'] ?? ''), 80);
    $cor = una_linea((string)($_POST['correo'] ?? ''), 120);
    if ($nom === '' || ($cor !== '' && !filter_var($cor, FILTER_VALIDATE_EMAIL))) aviso('Revisa el nombre y el correo.');
    else { q('UPDATE usuarios SET nombre = ?, correo = ? WHERE id = ?', [$nom, $cor, $yo['id']]); aviso('Datos actualizados.'); }
  } elseif ($acc === 'aviso' && puede('usuarios')) {
    $c = una_linea((string)($_POST['correo_aviso'] ?? ''), 120);
    if ($c !== '' && !filter_var($c, FILTER_VALIDATE_EMAIL)) aviso('Ese correo no es válido.');
    else { guardar_ajuste('correo_aviso', $c); aviso($c ? "Los avisos de solicitudes nuevas llegarán a $c." : 'Avisos por correo desactivados.'); }
  }
  redirigir('cuenta.php');
}
$correo = (string)ajuste('correo_aviso', cfg('correo_aviso', ''));
cabecera('Mi cuenta', 'cuenta.php');
?>
<h1>Mi cuenta</h1>
<div class="cols">
  <div>
    <section class="panel">
      <h2>Mis datos</h2>
      <form method="post" class="apilado"><?= csrf_campo() ?><input type="hidden" name="accion" value="perfil">
        <label>Nombre<input name="nombre" value="<?= h($yo['nombre']) ?>" required></label>
        <label>Correo<input name="correo" type="email" value="<?= h($yo['correo']) ?>"></label>
        <p class="muted">Usuario: <b><?= h($yo['usuario']) ?></b> · Rol: <b><?= h(ROLES[$yo['rol']] ?? $yo['rol']) ?></b></p>
        <button class="btn" type="submit">Guardar</button>
      </form>
    </section>
    <section class="panel">
      <h2>Cambiar contraseña</h2>
      <form method="post" class="apilado"><?= csrf_campo() ?><input type="hidden" name="accion" value="clave">
        <label>Contraseña actual<input name="actual" type="password" autocomplete="current-password" required></label>
        <label>Nueva contraseña (mínimo 10 caracteres)<input name="nueva" type="password" autocomplete="new-password" minlength="10" required></label>
        <label>Repite la nueva contraseña<input name="repite" type="password" autocomplete="new-password" minlength="10" required></label>
        <button class="btn" type="submit">Cambiar contraseña</button>
      </form>
    </section>
  </div>
  <?php if (puede('usuarios')): ?>
  <div>
    <section class="panel">
      <h2>Aviso de solicitudes nuevas</h2>
      <form method="post" class="apilado"><?= csrf_campo() ?><input type="hidden" name="accion" value="aviso">
        <label>Correo que recibe el aviso<input name="correo_aviso" type="email" value="<?= h($correo) ?>" placeholder="gerencia@efo.com.bo"></label>
        <button class="btn" type="submit">Guardar</button>
      </form>
      <p class="muted">Cada vez que un cliente envía el formulario de la web, llega un correo con sus datos y el enlace a su ficha. Déjalo vacío para no recibir avisos.</p>
    </section>
    <section class="panel">
      <h2>Copia de seguridad</h2>
      <p class="muted">Descarga la base de datos completa del CRM (clientes, historial, tareas, cotizaciones y precios). Guárdala en un lugar seguro: contiene datos personales.</p>
      <a class="btn btn-sec" href="respaldo.php"><?= ico('respaldo') ?><span>Descargar copia de seguridad</span></a>
    </section>
  </div>
  <?php endif; ?>
</div>
<?php pie();
