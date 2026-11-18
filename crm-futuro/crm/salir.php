<?php
declare(strict_types=1);
require __DIR__ . '/_lib.php';
sesion();
$_SESSION = [];
session_destroy();
redirigir('login.php');
