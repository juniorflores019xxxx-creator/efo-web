<?php
// Descarga una copia de la base de datos del CRM (solo administradores).
declare(strict_types=1);
require __DIR__ . '/_lib.php';
requiere_login();
requiere('respaldo');
$dest = data_dir() . '/respaldo-' . bin2hex(random_bytes(6)) . '.sqlite';
try {
  db()->exec('VACUUM INTO ' . db()->quote($dest)); // copia consistente (SQLite 3.27+)
} catch (Throwable $e) {
  db()->exec('PRAGMA wal_checkpoint(TRUNCATE)');
  copy(data_dir() . '/crm.sqlite', $dest);
}
registrar(null, 'respaldo', 'Se descargó una copia de seguridad del CRM.');
header('Content-Type: application/octet-stream');
header('Content-Disposition: attachment; filename="crm-efo-' . date('Y-m-d-His') . '.sqlite"');
header('Content-Length: ' . filesize($dest));
readfile($dest);
@unlink($dest);
