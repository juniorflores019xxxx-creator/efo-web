<?php
// E.F.O. Ltda. · Recibe las solicitudes del formulario de la web y las guarda en el CRM.
declare(strict_types=1);
require __DIR__ . '/../crm/_lib.php';

header('Content-Type: application/json; charset=utf-8');
header('X-Robots-Tag: noindex');
header('Cache-Control: no-store');
function responder(int $code, array $r): void { http_response_code($code); echo json_encode($r, JSON_UNESCAPED_UNICODE); exit; }

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') responder(405, ['ok' => false, 'error' => 'Método no permitido.']);
// Formulario demasiado grande: PHP descarta los datos y $_POST llega vacío
if (empty($_POST) && (int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 0) responder(413, ['ok' => false, 'error' => 'El archivo es demasiado grande. Envía una foto o PDF de hasta 8 MB.']);
// Trampa para robots: el campo oculto debe venir vacío
if (trim((string)($_POST['web_empresa'] ?? '')) !== '') responder(200, ['ok' => true, 'codigo' => 'recibida']);

try {
  if (demasiados('form', 8, 3600)) responder(429, ['ok' => false, 'error' => 'Recibimos varias solicitudes desde tu conexión. Intenta más tarde o escríbenos por WhatsApp.']);

  $P = fn(string $k, int $max = 200) => una_linea((string)($_POST[$k] ?? ''), $max);
  $nombre = $P('nombre', 120); $empresa = $P('empresa', 120); $tel = $P('telefono', 30); $correo = $P('correo', 120);
  $tipo = $P('tipo', 60); $ciudad = $P('ciudad', 40); $mensaje = texto_largo((string)($_POST['mensaje'] ?? ''), 1500);
  $grupo = grupo_de($tipo);

  $err = null;
  if (mb_strlen($nombre) < 2) $err = 'Escribe tu nombre.';
  elseif (strlen(preg_replace('/\D/', '', $tel) ?? '') < 7) $err = 'Escribe un número de teléfono válido.';
  elseif ($correo !== '' && !filter_var($correo, FILTER_VALIDATE_EMAIL)) $err = 'Revisa el correo electrónico.';
  elseif (!in_array($tipo, TIPOS, true)) $err = 'Elige el tipo de consulta.';
  elseif (!in_array($ciudad, DEPTOS, true)) $err = 'Elige el departamento.';
  elseif (($_POST['acepto'] ?? '') !== '1') $err = 'Para enviar la solicitud, acepta la Política de privacidad.';
  elseif ($grupo === '' && mb_strlen($mensaje) < 10) $err = 'Cuéntanos un poco más en el mensaje (al menos 10 caracteres).';

  // Datos propios del servicio (solo los campos conocidos)
  $datos = [];
  if ($grupo !== '' && !$err) {
    foreach (CAMPOS[$grupo] as $k => $label) {
      $v = $P($k, 200);
      if ($v === '') continue;
      if (in_array($k, NUMERICOS, true)) { $n = num($v); if ($n < 0) continue; $v = (string)(floor($n) == $n ? (int)$n : $n); }
      $datos[$k] = $v;
    }
    foreach (REQUERIDOS[$grupo] as $k) if (empty($datos[$k]) || (in_array($k, NUMERICOS, true) && num($datos[$k]) <= 0)) { $err = 'Completa el campo «' . CAMPOS[$grupo][$k] . '».'; break; }
  }

  // Factura adjunta (solo en energía solar)
  $f = $_FILES['factura'] ?? null; $archivo = null;
  if (!$err && $grupo === 'solar' && $f && ($f['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE) {
    $tipos = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp', 'application/pdf' => 'pdf'];
    if (in_array($f['error'], [UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE], true) || $f['size'] > 8 * 1024 * 1024) $err = 'El archivo es demasiado grande. Envía una foto o PDF de hasta 8 MB.';
    elseif ($f['error'] !== UPLOAD_ERR_OK || !is_uploaded_file($f['tmp_name'])) $err = 'No pudimos recibir el archivo. Intenta de nuevo o envía la solicitud sin la factura.';
    else {
      $mime = (new finfo(FILEINFO_MIME_TYPE))->file($f['tmp_name']) ?: '';
      if (!isset($tipos[$mime])) $err = 'La factura debe ser una foto (JPG, PNG o WEBP) o un PDF.';
      else $archivo = ['tmp' => $f['tmp_name'], 'mime' => $mime, 'ext' => $tipos[$mime], 'tam' => (int)$f['size'], 'nombre' => una_linea(basename((string)$f['name']), 120)];
    }
  }
  if ($err) responder(422, ['ok' => false, 'error' => $err]);

  anotar_intento('form');
  $pdo = db();
  $pdo->beginTransaction();
  $t = ahora();
  q('INSERT INTO leads (creado, actualizado, tipo, grupo, nombre, empresa, telefono, correo, ciudad, mensaje, datos, estado, origen, ip)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, \'nuevo\', ?, ?)',
    [$t, $t, $tipo, $grupo, $nombre, $empresa, $tel, $correo, $ciudad, $mensaje, json_encode($datos, JSON_UNESCAPED_UNICODE), $P('origen', 120), ip()]);
  $id = (int)$pdo->lastInsertId();
  $codigo = 'EFO-' . date('y') . '-' . str_pad((string)$id, 4, '0', STR_PAD_LEFT);
  q('UPDATE leads SET codigo = ? WHERE id = ?', [$codigo, $id]);
  if ($archivo) {
    $rel = 'archivos/' . $id . '-' . bin2hex(random_bytes(8)) . '.' . $archivo['ext'];
    if (!move_uploaded_file($archivo['tmp'], data_dir() . '/' . $rel)) throw new RuntimeException('No se pudo guardar el archivo');
    q('INSERT INTO archivos (lead_id, nombre, ruta, mime, tamano, creado) VALUES (?, ?, ?, ?, ?, ?)', [$id, $archivo['nombre'] ?: 'factura.' . $archivo['ext'], $rel, $archivo['mime'], $archivo['tam'], $t]);
  }
  $pdo->commit();

  // Aviso por correo a E.F.O. (si falla, la solicitud igual queda guardada)
  $para = (string)ajuste('correo_aviso', cfg('correo_aviso', ''));
  if ($para !== '' && filter_var($para, FILTER_VALIDATE_EMAIL)) {
    $host = preg_replace('/[^a-z0-9.\-]/i', '', (string)($_SERVER['HTTP_HOST'] ?? 'efo.com.bo')) ?: 'efo.com.bo';
    $dominio = preg_replace('/^www\./', '', $host);
    $L = ["Nueva solicitud desde la web: $codigo", '', "Tipo: $tipo", "Nombre: $nombre"];
    if ($empresa !== '') $L[] = "Empresa: $empresa";
    $L[] = "Teléfono: $tel";
    if ($correo !== '') $L[] = "Correo: $correo";
    $L[] = "Departamento: $ciudad";
    foreach ($datos as $k => $v) $L[] = CAMPOS[$grupo][$k] . ": $v";
    if ($archivo) $L[] = 'Factura adjunta: sí (ver en el CRM)';
    if ($mensaje !== '') { $L[] = ''; $L[] = $mensaje; }
    $L[] = ''; $L[] = "Ver en el CRM: https://$host/crm/ver.php?id=$id";
    $cab = ['From: Web E.F.O. <no-responder@' . $dominio . '>', 'MIME-Version: 1.0', 'Content-Type: text/plain; charset=UTF-8', 'Content-Transfer-Encoding: 8bit'];
    if ($correo !== '') $cab[] = 'Reply-To: ' . $correo;
    @mail($para, mb_encode_mimeheader("Nueva solicitud $codigo · $tipo · $nombre", 'UTF-8'), implode("\r\n", $L), implode("\r\n", $cab));
  }

  responder(200, ['ok' => true, 'codigo' => $codigo]);
} catch (Throwable $e) {
  if (isset($pdo) && $pdo->inTransaction()) $pdo->rollBack();
  error_log('EFO lead: ' . $e->getMessage());
  responder(500, ['ok' => false, 'net' => true]);
}
