<?php
declare(strict_types=1);
require __DIR__ . '/_lib.php';
requiere_login();

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
  csrf_ok();
  if (($_POST['accion'] ?? '') === 'clave') {
    $nueva = (string)($_POST['nueva'] ?? '');
    if (!password_verify((string)($_POST['actual'] ?? ''), clave_hash())) aviso('La contraseña actual no es correcta.');
    elseif (mb_strlen($nueva) < 10) aviso('La nueva contraseña debe tener al menos 10 caracteres.');
    elseif ($nueva !== (string)($_POST['repite'] ?? '')) aviso('Las dos contraseñas nuevas no coinciden.');
    else {
      guardar_ajuste('clave_hash', password_hash($nueva, PASSWORD_DEFAULT));
      $_SESSION['h'] = substr(hash('sha256', clave_hash()), 0, 16); // las demás sesiones abiertas se cierran
      aviso('Contraseña cambiada.');
    }
  } elseif (($_POST['accion'] ?? '') === 'correo') {
    $c = una_linea((string)($_POST['correo'] ?? ''), 120);
    if ($c !== '' && !filter_var($c, FILTER_VALIDATE_EMAIL)) aviso('Ese correo no es válido.');
    else { guardar_ajuste('correo_aviso', $c); aviso($c ? "Los avisos de solicitudes nuevas llegarán a $c." : 'Avisos por correo desactivados.'); }
  }
  redirigir('cuenta.php');
}
$correo = (string)ajuste('correo_aviso', cfg('correo_aviso', ''));
cabecera('Cuenta', 'cuenta.php');
?>
<h1>Cuenta</h1>
<div class="cols">
  <section class="panel">
    <h2>Cambiar contraseña</h2>
    <form method="post" class="apilado"><?= csrf_campo() ?><input type="hidden" name="accion" value="clave">
      <label>Contraseña actual<input name="actual" type="password" autocomplete="current-password" required></label>
      <label>Nueva contraseña (mínimo 10 caracteres)<input name="nueva" type="password" autocomplete="new-password" minlength="10" required></label>
      <label>Repite la nueva contraseña<input name="repite" type="password" autocomplete="new-password" minlength="10" required></label>
      <button class="btn" type="submit">Cambiar contraseña</button>
    </form>
  </section>
  <section class="panel">
    <h2>Aviso de solicitudes nuevas</h2>
    <form method="post" class="apilado"><?= csrf_campo() ?><input type="hidden" name="accion" value="correo">
      <label>Correo que recibe el aviso<input name="correo" type="email" value="<?= h($correo) ?>" placeholder="gerencia@efo.com.bo"></label>
      <button class="btn" type="submit">Guardar</button>
    </form>
    <p class="muted">Cada vez que un cliente envía el formulario, llega un correo con sus datos y el enlace a su ficha. Déjalo vacío para no recibir avisos.</p>
  </section>
</div>
<?php pie();
