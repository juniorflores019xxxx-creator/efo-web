<?php
declare(strict_types=1);
require __DIR__ . '/_lib.php';
cabeceras_crm();
sesion();
$error = '';
if (clave_hash() === '') $error = 'Falta configurar la contraseña del CRM (archivo crm/_config.php).';
elseif (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
  csrf_ok();
  if (demasiados('login', 5, 900)) $error = 'Demasiados intentos. Espera 15 minutos e intenta de nuevo.';
  elseif (password_verify((string)($_POST['clave'] ?? ''), clave_hash())) {
    session_regenerate_id(true);
    $_SESSION = ['ok' => 1, 't' => time(), 'h' => substr(hash('sha256', clave_hash()), 0, 16)];
    q('DELETE FROM intentos WHERE tipo = ? AND ip = ?', ['login', ip()]);
    redirigir('index.php');
  } else { anotar_intento('login'); $error = 'Contraseña incorrecta.'; }
}
?><!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>Ingresar · CRM E.F.O.</title><link rel="icon" href="/assets/img/favicon-192.png"><link rel="stylesheet" href="crm.css?v=1"></head>
<body class="login"><main class="caja">
<img src="/assets/img/logo-efo.webp" alt="E.F.O. Ltda." width="140" height="56">
<h1>CRM de solicitudes</h1>
<form method="post">
  <?= csrf_campo() ?>
  <label for="clave">Contraseña</label>
  <input id="clave" name="clave" type="password" autocomplete="current-password" required autofocus>
  <?php if ($error): ?><p class="error" role="alert"><?= h($error) ?></p><?php endif; ?>
  <button class="btn" type="submit">Ingresar</button>
</form>
</main></body></html>
