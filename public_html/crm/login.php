<?php
declare(strict_types=1);
require __DIR__ . '/_lib.php';
cabeceras_crm();
sesion();
$error = '';
$usr = '';
if ((int)q('SELECT COUNT(*) FROM usuarios')->fetchColumn() === 0) $error = 'Falta configurar el primer usuario (archivo crm/_config.php).';
elseif (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
  csrf_ok();
  $usr = mb_strtolower(una_linea((string)($_POST['usuario'] ?? ''), 60));
  if (demasiados('login', 5, 900)) $error = 'Demasiados intentos. Espera 15 minutos e intenta de nuevo.';
  else {
    $u = q('SELECT * FROM usuarios WHERE usuario = ? AND activo = 1', [$usr])->fetch();
    $ok = $u && password_verify((string)($_POST['clave'] ?? ''), $u['hash']);
    q('INSERT INTO accesos (usuario, usuario_id, ts, ip, ok) VALUES (?, ?, ?, ?, ?)', [$usr, $u ? (int)$u['id'] : null, ahora(), ip(), $ok ? 1 : 0]);
    if ($ok) {
      if (password_needs_rehash($u['hash'], PASSWORD_DEFAULT)) q('UPDATE usuarios SET hash = ? WHERE id = ?', [$u['hash'] = password_hash((string)$_POST['clave'], PASSWORD_DEFAULT), $u['id']]);
      session_regenerate_id(true);
      $_SESSION = ['uid' => (int)$u['id'], 't' => time(), 'h' => huella($u['hash'])];
      q('UPDATE usuarios SET ultimo = ? WHERE id = ?', [ahora(), $u['id']]);
      q('DELETE FROM intentos WHERE tipo = ? AND ip = ?', ['login', ip()]);
      redirigir('index.php');
    }
    anotar_intento('login');
    $error = 'Usuario o contraseña incorrectos.';
  }
}
?><!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="#031F36"><title>Ingresar · CRM E.F.O.</title>
<link rel="icon" href="/assets/img/favicon-192.png"><link rel="stylesheet" href="crm.css?v=2"></head>
<body class="login">
<div class="login-arte" aria-hidden="true"><img src="/assets/img/logo-efo-claro.webp" alt="" width="200" height="80"><p>Energía que mueve Bolivia</p></div>
<main class="caja">
  <img class="solo-movil" src="/assets/img/logo-efo.webp" alt="E.F.O. Ltda." width="150" height="60">
  <h1>CRM comercial</h1>
  <p class="muted">Ingresa con tu usuario para ver solicitudes, cotizaciones y seguimientos.</p>
  <form method="post">
    <?= csrf_campo() ?>
    <label for="usuario">Usuario</label>
    <input id="usuario" name="usuario" autocomplete="username" autocapitalize="none" value="<?= h($usr) ?>" required autofocus>
    <label for="clave">Contraseña</label>
    <input id="clave" name="clave" type="password" autocomplete="current-password" required>
    <?php if ($error): ?><p class="error" role="alert"><?= h($error) ?></p><?php endif; ?>
    <button class="btn btn-cyan" type="submit">Ingresar</button>
  </form>
  <p class="muted pequeno">Acceso solo para el personal autorizado de E.F.O. Ltda.</p>
</main>
</body></html>
