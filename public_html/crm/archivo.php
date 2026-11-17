<?php
declare(strict_types=1);
require __DIR__ . '/_lib.php';
requiere_login();
$a = q('SELECT * FROM archivos WHERE id = ?', [(int)($_GET['id'] ?? 0)])->fetch();
$ruta = $a ? data_dir() . '/' . $a['ruta'] : '';
if (!$a || !preg_match('#^archivos/[\w.\-]+$#', $a['ruta']) || !is_file($ruta)) { http_response_code(404); exit('Archivo no encontrado.'); }
$mime = in_array($a['mime'], ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'], true) ? $a['mime'] : 'application/octet-stream';
header('Content-Type: ' . $mime);
header('Content-Length: ' . filesize($ruta));
header("Content-Disposition: inline; filename*=UTF-8''" . rawurlencode($a['nombre']));
readfile($ruta);
