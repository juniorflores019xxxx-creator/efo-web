<?php
// Acciones rápidas del CRM por fetch (embudo y tareas). Responde JSON.
declare(strict_types=1);
require __DIR__ . '/_lib.php';
cabeceras_crm();
header('Content-Type: application/json; charset=utf-8');
sesion();
$fin = function (bool $ok, string $m) { echo json_encode($ok ? ['ok' => true, 'mensaje' => $m] : ['ok' => false, 'error' => $m], JSON_UNESCAPED_UNICODE); exit; };
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST' || !hash_equals(csrf(), (string)($_POST['csrf'] ?? ''))) { http_response_code(400); $fin(false, 'Sesión expirada.'); }
$u = !empty($_SESSION['uid']) ? q('SELECT * FROM usuarios WHERE id = ? AND activo = 1', [(int)$_SESSION['uid']])->fetch() : false;
if (!$u || ($_SESSION['h'] ?? '') !== huella($u['hash']) || ($_SESSION['t'] ?? 0) < time() - 8 * 3600) { http_response_code(401); $fin(false, 'Inicia sesión de nuevo.'); }
$_SESSION['t'] = time();
$GLOBALS['USUARIO'] = $u;

$acc = (string)($_POST['accion'] ?? '');
if ($acc === 'estado') {
  if (!puede('editar')) $fin(false, 'Sin permiso.');
  $lead = q('SELECT * FROM leads WHERE id = ?', [(int)($_POST['id'] ?? 0)])->fetch();
  $e = (string)($_POST['estado'] ?? '');
  if (!$lead || !array_key_exists($e, ESTADOS)) $fin(false, 'Datos no válidos.');
  if ($e !== $lead['estado']) {
    q('UPDATE leads SET estado = ?, actualizado = ? WHERE id = ?', [$e, ahora(), $lead['id']]);
    registrar((int)$lead['id'], 'estado', 'Estado: ' . ESTADOS[$lead['estado']] . ' → ' . ESTADOS[$e]);
  }
  $fin(true, $lead['nombre'] . ' pasó a «' . ESTADOS[$e] . '».');
}
if ($acc === 'tarea_hecha') {
  if (!puede('tareas')) $fin(false, 'Sin permiso.');
  $t = q('SELECT * FROM tareas WHERE id = ?', [(int)($_POST['id'] ?? 0)])->fetch();
  if (!$t) $fin(false, 'La tarea no existe.');
  $hecha = ($_POST['hecha'] ?? '1') === '1' ? 1 : 0;
  q('UPDATE tareas SET hecha = ? WHERE id = ?', [$hecha, $t['id']]);
  if ($t['lead_id']) registrar((int)$t['lead_id'], 'tarea', ($hecha ? 'Tarea completada: ' : 'Tarea reabierta: ') . $t['titulo']);
  $fin(true, $hecha ? 'Tarea completada.' : 'Tarea reabierta.');
}
http_response_code(400);
$fin(false, 'Acción desconocida.');
