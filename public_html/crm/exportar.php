<?php
declare(strict_types=1);
require __DIR__ . '/_lib.php';
requiere_login();
$campos = [];
foreach (CAMPOS as $g) foreach ($g as $k => $t) $campos[$k] = $t;
header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename="solicitudes-efo-' . date('Y-m-d') . '.csv"');
$out = fopen('php://output', 'w');
fwrite($out, "\xEF\xBB\xBF"); // para que Excel lea bien las tildes
fputcsv($out, array_merge(['Código', 'Fecha', 'Estado', 'Prioridad', 'Responsable', 'Cómo llegó', 'Próximo seguimiento', 'Valor estimado Bs', 'Tipo', 'Nombre', 'Empresa', 'Teléfono', 'Correo', 'Departamento', 'Mensaje'], array_values($campos), ['Cotizaciones', 'Último total Bs']), ';');
$rows = q('SELECT l.*, (SELECT COUNT(*) FROM cotizaciones c WHERE c.lead_id = l.id) ncot, (SELECT total FROM cotizaciones c WHERE c.lead_id = l.id ORDER BY id DESC LIMIT 1) ultimo FROM leads l ORDER BY l.id DESC');
// Evita que Excel interprete como fórmula lo que escribió un visitante
$seguro = fn($v) => preg_match('/^[=+\-@\t\r]/', (string)$v) ? "'" . $v : (string)$v;
while ($r = $rows->fetch()) {
  $d = json_decode((string)$r['datos'], true) ?: [];
  $fila = [$r['codigo'], $r['creado'], ESTADOS[$r['estado']] ?? $r['estado'], PRIORIDADES[$r['prioridad']] ?? $r['prioridad'], nombre_usuario($r['asignado'] === null ? null : (int)$r['asignado']), $r['fuente'], $r['proximo'] ?? '', (float)$r['valor'] > 0 ? bs($r['valor']) : '', $r['tipo'], $r['nombre'], $r['empresa'], $r['telefono'], $r['correo'], $r['ciudad'], $r['mensaje']];
  foreach (array_keys($campos) as $k) $fila[] = $d[$k] ?? '';
  $fila[] = $r['ncot']; $fila[] = $r['ultimo'] !== null ? bs($r['ultimo']) : '';
  fputcsv($out, array_map($seguro, $fila), ';');
}
fclose($out);
