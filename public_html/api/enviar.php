<?php
// E.F.O. Ltda. · Envía por correo a E.F.O. las solicitudes del formulario de la web (con la factura adjunta).
// No guarda datos en una base de datos: solo los manda al correo de E.F.O.
declare(strict_types=1);
mb_internal_encoding('UTF-8');
date_default_timezone_set('America/La_Paz');
header('Content-Type: application/json; charset=utf-8');
header('X-Robots-Tag: noindex');
header('Cache-Control: no-store');

const PARA = 'gerencia@efo.com.bo';  // correo que recibe las solicitudes
const TIPOS = ['Combustibles', 'Diésel ULSD', 'Importación', 'Energía solar', 'Soluciones energéticas', 'Electromovilidad', 'Electrolineras', 'Cargadores', 'Conversión de vehículos', 'Proyectos', 'Otro'];
const DEPTOS = ['Santa Cruz', 'La Paz', 'Cochabamba', 'Chuquisaca', 'Oruro', 'Potosí', 'Tarija', 'Beni', 'Pando'];
const GRUPOS = ['diesel' => ['Combustibles', 'Diésel ULSD', 'Importación'], 'solar' => ['Energía solar'], 'cargadores' => ['Electromovilidad', 'Electrolineras', 'Cargadores'], 'conversion' => ['Conversión de vehículos']];
const CAMPOS = [
  'diesel' => ['d_litros' => 'Litros por mes', 'd_frecuencia' => 'Frecuencia de compra', 'd_uso' => 'Uso principal', 'd_tanque' => 'Tanque propio', 'd_lugar' => 'Lugar de entrega'],
  'solar' => ['s_kwh' => 'Consumo mensual (kWh)', 's_dias' => 'Días del período', 's_distribuidora' => 'Distribuidora', 's_modalidad' => 'Tipo de sistema', 's_inmueble' => 'Tipo de inmueble', 's_techo' => 'Lugar de instalación'],
  'cargadores' => ['c_equipo' => 'Equipo de interés', 'c_cantidad' => 'Cantidad', 'c_lugar' => 'Lugar de instalación', 'c_vehiculo' => 'Vehículo(s)', 'c_distancia' => 'Distancia al tablero (m)', 'c_red' => 'Conexión eléctrica'],
  'conversion' => ['v_marca' => 'Marca y modelo', 'v_anio' => 'Año', 'v_uso' => 'Uso', 'v_km' => 'Km por día', 'v_cantidad' => 'Cantidad de vehículos'],
];
const REQUERIDOS = ['diesel' => ['d_litros', 'd_frecuencia'], 'solar' => ['s_kwh'], 'cargadores' => ['c_equipo'], 'conversion' => ['v_marca']];
const NUMERICOS = ['d_litros', 's_kwh', 's_dias', 'c_cantidad', 'c_distancia', 'v_anio', 'v_km', 'v_cantidad'];

function responder(int $code, array $r): void { http_response_code($code); echo json_encode($r, JSON_UNESCAPED_UNICODE); exit; }
function linea(string $s, int $max = 200): string { return mb_substr(trim(preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $s) ?? ''), 0, $max); }
function num(string $v): float { $v = str_replace([' ', ','], ['', '.'], trim($v)); return is_numeric($v) ? (float)$v : 0.0; }

/* Límite simple de envíos por conexión (fuera de la carpeta pública) */
function demasiados(): bool {
  $dir = dirname(__DIR__, 2) . '/efo-data';
  if (!is_dir($dir) && !@mkdir($dir, 0750, true)) return false;
  $f = $dir . '/limite-envios.json';
  $ip = hash('sha256', (string)($_SERVER['REMOTE_ADDR'] ?? ''));
  $h = @fopen($f, 'c+');
  if (!$h) return false;
  flock($h, LOCK_EX);
  $d = json_decode((string)stream_get_contents($h), true) ?: [];
  $ahora = time();
  foreach ($d as $k => $ts) { $d[$k] = array_values(array_filter((array)$ts, fn($t) => $t > $ahora - 3600)); if (!$d[$k]) unset($d[$k]); }
  $exceso = count($d[$ip] ?? []) >= 8;
  if (!$exceso) $d[$ip][] = $ahora;
  ftruncate($h, 0); rewind($h); fwrite($h, json_encode($d)); flock($h, LOCK_UN); fclose($h);
  return $exceso;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') responder(405, ['ok' => false, 'error' => 'Método no permitido.']);
if (empty($_POST) && (int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 0) responder(413, ['ok' => false, 'error' => 'El archivo es demasiado grande. Envía una foto o PDF de hasta 8 MB.']);
if (trim((string)($_POST['web_empresa'] ?? '')) !== '') responder(200, ['ok' => true, 'codigo' => 'recibida']); // trampa para robots

$P = fn(string $k, int $max = 200) => linea((string)($_POST[$k] ?? ''), $max);
$nombre = $P('nombre', 120); $empresa = $P('empresa', 120); $tel = $P('telefono', 30); $correo = $P('correo', 120);
$tipo = $P('tipo', 60); $ciudad = $P('ciudad', 40);
$mensaje = mb_substr(trim(preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]+/u', '', (string)($_POST['mensaje'] ?? '')) ?? ''), 0, 1500);
$grupo = ''; foreach (GRUPOS as $g => $t) if (in_array($tipo, $t, true)) $grupo = $g;

$err = null;
if (mb_strlen($nombre) < 2) $err = 'Escribe tu nombre.';
elseif (strlen(preg_replace('/\D/', '', $tel) ?? '') < 7) $err = 'Escribe un número de teléfono válido.';
elseif ($correo !== '' && !filter_var($correo, FILTER_VALIDATE_EMAIL)) $err = 'Revisa el correo electrónico.';
elseif (!in_array($tipo, TIPOS, true)) $err = 'Elige el tipo de consulta.';
elseif (!in_array($ciudad, DEPTOS, true)) $err = 'Elige el departamento.';
elseif (($_POST['acepto'] ?? '') !== '1') $err = 'Para enviar la solicitud, acepta la Política de privacidad.';
elseif ($grupo === '' && mb_strlen($mensaje) < 10) $err = 'Cuéntanos un poco más en el mensaje (al menos 10 caracteres).';

$datos = [];
if (!$err && $grupo !== '') {
  foreach (CAMPOS[$grupo] as $k => $label) {
    $v = $P($k);
    if ($v === '') continue;
    if (in_array($k, NUMERICOS, true)) { $n = num($v); if ($n < 0) continue; $v = floor($n) == $n ? (string)(int)$n : (string)$n; }
    $datos[$k] = $v;
  }
  foreach (REQUERIDOS[$grupo] as $k) if (empty($datos[$k]) || (in_array($k, NUMERICOS, true) && num($datos[$k]) <= 0)) { $err = 'Completa el campo «' . CAMPOS[$grupo][$k] . '».'; break; }
}

$adj = null;
$f = $_FILES['factura'] ?? null;
if (!$err && $grupo === 'solar' && $f && ($f['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE) {
  $tipos = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp', 'application/pdf' => 'pdf'];
  if (in_array($f['error'], [UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE], true) || $f['size'] > 8 * 1024 * 1024) $err = 'El archivo es demasiado grande. Envía una foto o PDF de hasta 8 MB.';
  elseif ($f['error'] !== UPLOAD_ERR_OK || !is_uploaded_file($f['tmp_name'])) $err = 'No pudimos recibir el archivo. Intenta de nuevo o envía la solicitud sin la factura.';
  else {
    $mime = (new finfo(FILEINFO_MIME_TYPE))->file($f['tmp_name']) ?: '';
    if (!isset($tipos[$mime])) $err = 'La factura debe ser una foto (JPG, PNG o WEBP) o un PDF.';
    else $adj = ['mime' => $mime, 'nombre' => 'factura-' . trim(preg_replace('/[^a-z0-9]+/', '-', strtr(mb_strtolower($nombre), ['á' => 'a', 'é' => 'e', 'í' => 'i', 'ó' => 'o', 'ú' => 'u', 'ü' => 'u', 'ñ' => 'n'])) ?? '', '-') . '.' . $tipos[$mime], 'datos' => (string)file_get_contents($f['tmp_name'])];
  }
}
if ($err) responder(422, ['ok' => false, 'error' => $err]);
if (demasiados()) responder(429, ['ok' => false, 'error' => 'Recibimos varias solicitudes desde tu conexión. Intenta más tarde o escríbenos por WhatsApp.']);

// Código para que el cliente y E.F.O. identifiquen la solicitud
$codigo = 'EFO-' . date('ymd') . '-' . strtoupper(substr(bin2hex(random_bytes(3)), 0, 4));

// Correo a E.F.O.
$L = ["Nueva solicitud desde efo.com.bo — $codigo", '', "Tipo: $tipo", "Nombre: $nombre"];
if ($empresa !== '') $L[] = "Empresa: $empresa";
$L[] = "Teléfono / WhatsApp: $tel";
$wa = preg_replace('/\D/', '', $tel) ?? '';
if (strlen($wa) === 8) $wa = '591' . $wa;
if (strlen($wa) >= 8) $L[] = "Responder por WhatsApp: https://wa.me/$wa";
if ($correo !== '') $L[] = "Correo: $correo";
$L[] = "Departamento: $ciudad";
foreach ($datos as $k => $v) $L[] = CAMPOS[$grupo][$k] . ": $v";
if ($adj) { $L[] = ''; $L[] = 'Factura de luz adjunta a este correo.'; }
if ($mensaje !== '') { $L[] = ''; $L[] = 'Mensaje:'; $L[] = $mensaje; }
$L[] = ''; $L[] = 'Página: ' . $P('origen', 120) . ' · Fecha: ' . date('d/m/Y H:i');
$cuerpo = implode("\r\n", $L);

$host = preg_replace('/^www\./', '', preg_replace('/[^a-z0-9.\-]/i', '', (string)($_SERVER['HTTP_HOST'] ?? 'efo.com.bo')) ?: 'efo.com.bo');
$desde = str_contains($host, '.') && !preg_match('/^[\d.]+$/', $host) ? "no-responder@$host" : 'no-responder@efo.com.bo';
$cab = ['From: =?UTF-8?B?' . base64_encode('Web E.F.O.') . "?= <$desde>", 'MIME-Version: 1.0'];
if ($correo !== '') $cab[] = 'Reply-To: ' . $correo;
if ($adj) {
  $b = 'efo-' . bin2hex(random_bytes(8));
  $cab[] = "Content-Type: multipart/mixed; boundary=\"$b\"";
  $cuerpo = "--$b\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n" . chunk_split(base64_encode($cuerpo))
    . "--$b\r\nContent-Type: {$adj['mime']}; name=\"{$adj['nombre']}\"\r\nContent-Transfer-Encoding: base64\r\nContent-Disposition: attachment; filename=\"{$adj['nombre']}\"\r\n\r\n"
    . chunk_split(base64_encode($adj['datos'])) . "--$b--\r\n";
} else {
  $cab[] = 'Content-Type: text/plain; charset=UTF-8';
  $cab[] = 'Content-Transfer-Encoding: base64';
  $cuerpo = chunk_split(base64_encode($cuerpo));
}
$asunto = '=?UTF-8?B?' . base64_encode("Nueva solicitud $codigo · $tipo · $nombre") . '?=';
$ok = @mail(PARA, $asunto, $cuerpo, implode("\r\n", $cab), '-f' . $desde);
if (!$ok) { error_log("EFO: no se pudo enviar el correo de la solicitud $codigo"); responder(502, ['ok' => false, 'net' => true]); }
responder(200, ['ok' => true, 'codigo' => $codigo]);
