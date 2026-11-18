<?php
declare(strict_types=1);
require __DIR__ . '/_lib.php';
requiere_login();
requiere('usuarios');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
  csrf_ok();
  $acc = (string)($_POST['accion'] ?? '');
  $admins = fn() => (int)q("SELECT COUNT(*) FROM usuarios WHERE rol = 'admin' AND activo = 1")->fetchColumn();
  if ($acc === 'crear') {
    $usr = mb_strtolower(preg_replace('/[^a-z0-9._\-]/i', '', (string)($_POST['usuario'] ?? '')) ?? '');
    $nom = una_linea((string)($_POST['nombre'] ?? ''), 80);
    $cor = una_linea((string)($_POST['correo'] ?? ''), 120);
    $rol = array_key_exists((string)($_POST['rol'] ?? ''), ROLES) ? (string)$_POST['rol'] : 'ventas';
    $cla = (string)($_POST['clave'] ?? '');
    if (strlen($usr) < 3 || $nom === '') aviso('Escribe un nombre y un usuario de al menos 3 letras (sin espacios).');
    elseif (mb_strlen($cla) < 10) aviso('La contraseña debe tener al menos 10 caracteres.');
    elseif (q('SELECT 1 FROM usuarios WHERE usuario = ?', [$usr])->fetchColumn()) aviso('Ese usuario ya existe.');
    elseif ($cor !== '' && !filter_var($cor, FILTER_VALIDATE_EMAIL)) aviso('Revisa el correo.');
    else {
      q('INSERT INTO usuarios (usuario, nombre, correo, rol, hash, creado) VALUES (?, ?, ?, ?, ?, ?)', [$usr, $nom, $cor, $rol, password_hash($cla, PASSWORD_DEFAULT), ahora()]);
      registrar(null, 'usuario', 'Usuario creado: ' . $nom . ' (' . ROLES[$rol] . ')');
      aviso("Usuario «$usr» creado. Pásale su contraseña por un medio privado.");
    }
  } elseif ($acc === 'editar') {
    $u = q('SELECT * FROM usuarios WHERE id = ?', [(int)($_POST['uid'] ?? 0)])->fetch();
    if ($u) {
      $rol = array_key_exists((string)($_POST['rol'] ?? ''), ROLES) ? (string)$_POST['rol'] : $u['rol'];
      $act = ($_POST['activo'] ?? '') === '1' ? 1 : 0;
      $quitaAdmin = $u['rol'] === 'admin' && $u['activo'] && ($rol !== 'admin' || !$act);
      if ($quitaAdmin && $admins() <= 1) aviso('Debe quedar al menos un administrador activo.');
      else {
        q('UPDATE usuarios SET rol = ?, activo = ?, nombre = ? WHERE id = ?', [$rol, $act, una_linea((string)($_POST['nombre'] ?? $u['nombre']), 80) ?: $u['nombre'], $u['id']]);
        $cla = (string)($_POST['clave'] ?? '');
        if ($cla !== '') {
          if (mb_strlen($cla) < 10) aviso('La nueva contraseña debe tener al menos 10 caracteres. No se cambió.');
          else { q('UPDATE usuarios SET hash = ? WHERE id = ?', [password_hash($cla, PASSWORD_DEFAULT), $u['id']]); aviso('Usuario actualizado y contraseña cambiada.'); }
        } else aviso('Usuario actualizado.');
      }
    }
  }
  redirigir('usuarios.php');
}
$us = q('SELECT * FROM usuarios ORDER BY activo DESC, nombre')->fetchAll();
$acc = q('SELECT * FROM accesos ORDER BY id DESC LIMIT 25')->fetchAll();
cabecera('Usuarios', 'usuarios.php');
?>
<h1>Usuarios y roles</h1>
<p class="muted"><b>Administrador:</b> todo, incluidos precios, usuarios, copias de seguridad y eliminar clientes. <b>Ventas:</b> clientes, cotizaciones y tareas. <b>Solo lectura:</b> puede ver, pero no cambiar nada.</p>
<div class="cols">
  <section class="panel">
    <h2>Equipo</h2>
    <?php foreach ($us as $u): ?>
      <details class="usuario<?= $u['activo'] ? '' : ' inactivo' ?>">
        <summary><span class="avatar"><?= h(mb_strtoupper(mb_substr($u['nombre'], 0, 1))) ?></span><span><b><?= h($u['nombre']) ?></b><small><?= h($u['usuario']) ?> · <?= h(ROLES[$u['rol']] ?? $u['rol']) ?><?= $u['activo'] ? '' : ' · desactivado' ?> · último ingreso: <?= $u['ultimo'] ? h(hace($u['ultimo'])) : 'nunca' ?></small></span></summary>
        <form method="post" class="grid dos"><?= csrf_campo() ?><input type="hidden" name="accion" value="editar"><input type="hidden" name="uid" value="<?= (int)$u['id'] ?>">
          <label>Nombre<input name="nombre" value="<?= h($u['nombre']) ?>"></label>
          <label>Rol<select name="rol"><?php foreach (ROLES as $k => $t): ?><option value="<?= $k ?>"<?= $u['rol'] === $k ? ' selected' : '' ?>><?= $t ?></option><?php endforeach; ?></select></label>
          <label>Estado<select name="activo"><option value="1"<?= $u['activo'] ? ' selected' : '' ?>>Activo</option><option value="0"<?= $u['activo'] ? '' : ' selected' ?>>Desactivado</option></select></label>
          <label>Nueva contraseña (opcional)<input name="clave" type="password" autocomplete="new-password" minlength="10"></label>
          <div class="ancho"><button class="btn" type="submit">Guardar</button></div>
        </form>
      </details>
    <?php endforeach; ?>
  </section>
  <section class="panel">
    <h2>Agregar usuario</h2>
    <form method="post" class="apilado"><?= csrf_campo() ?><input type="hidden" name="accion" value="crear">
      <label>Nombre completo<input name="nombre" required maxlength="80"></label>
      <label>Usuario para ingresar (sin espacios)<input name="usuario" required maxlength="40" autocapitalize="none" placeholder="ej.: maria.lopez"></label>
      <label>Correo (opcional)<input name="correo" type="email"></label>
      <label>Rol<select name="rol"><?php foreach (ROLES as $k => $t): ?><option value="<?= $k ?>"<?= $k === 'ventas' ? ' selected' : '' ?>><?= $t ?></option><?php endforeach; ?></select></label>
      <label>Contraseña inicial (mínimo 10 caracteres)<input name="clave" type="password" autocomplete="new-password" minlength="10" required></label>
      <button class="btn" type="submit">Crear usuario</button>
    </form>
  </section>
</div>
<section class="panel">
  <h2>Registro de accesos</h2>
  <div class="tabla"><table><thead><tr><th>Fecha</th><th>Usuario</th><th>Resultado</th><th>IP</th></tr></thead><tbody>
    <?php foreach ($acc as $a): ?><tr><td><?= h(fecha($a['ts'])) ?></td><td><?= h($a['usuario']) ?></td><td><?= $a['ok'] ? '<span class="estado e-ganado">Correcto</span>' : '<span class="estado e-perdido">Fallido</span>' ?></td><td><?= h($a['ip']) ?></td></tr><?php endforeach; ?>
    <?php if (!$acc): ?><tr><td colspan="4" class="muted">Sin registros todavía.</td></tr><?php endif; ?>
  </tbody></table></div>
</section>
<?php pie();
