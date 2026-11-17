<?php
// E.F.O. Ltda. · CRM y cotizador — funciones comunes (base de datos, sesión, seguridad, cálculo solar).
// No se abre directo: lo usan las páginas del CRM y api/lead.php.
declare(strict_types=1);
if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) { http_response_code(404); exit; }

mb_internal_encoding('UTF-8');
date_default_timezone_set('America/La_Paz');

$GLOBALS['CFG'] = is_file(__DIR__ . '/_config.php') ? (require __DIR__ . '/_config.php') : [];
function cfg(string $k, $d = null) { return $GLOBALS['CFG'][$k] ?? $d; }

/* ---------- Datos fijos (iguales a los del formulario de la web) ---------- */
const TIPOS = ['Combustibles', 'Diésel ULSD', 'Importación', 'Energía solar', 'Soluciones energéticas', 'Electromovilidad', 'Electrolineras', 'Cargadores', 'Conversión de vehículos', 'Proyectos', 'Otro'];
const DEPTOS = ['Santa Cruz', 'La Paz', 'Cochabamba', 'Chuquisaca', 'Oruro', 'Potosí', 'Tarija', 'Beni', 'Pando'];
const GRUPOS = [
  'diesel' => ['Combustibles', 'Diésel ULSD', 'Importación'],
  'solar' => ['Energía solar'],
  'cargadores' => ['Electromovilidad', 'Electrolineras', 'Cargadores'],
  'conversion' => ['Conversión de vehículos'],
];
const GRUPO_NOMBRE = ['diesel' => 'Diésel', 'solar' => 'Energía solar', 'cargadores' => 'Cargadores', 'conversion' => 'Conversión', '' => 'General'];
const CAMPOS = [
  'diesel' => ['d_litros' => 'Litros por mes', 'd_frecuencia' => 'Frecuencia de compra', 'd_uso' => 'Uso principal', 'd_tanque' => 'Tanque propio', 'd_lugar' => 'Lugar de entrega'],
  'solar' => ['s_kwh' => 'Consumo mensual (kWh)', 's_dias' => 'Días del período', 's_distribuidora' => 'Distribuidora', 's_modalidad' => 'Tipo de sistema', 's_inmueble' => 'Tipo de inmueble', 's_techo' => 'Lugar de instalación'],
  'cargadores' => ['c_equipo' => 'Equipo de interés', 'c_cantidad' => 'Cantidad', 'c_lugar' => 'Lugar de instalación', 'c_vehiculo' => 'Vehículo(s)', 'c_distancia' => 'Distancia al tablero (m)', 'c_red' => 'Conexión eléctrica'],
  'conversion' => ['v_marca' => 'Marca y modelo', 'v_anio' => 'Año', 'v_uso' => 'Uso', 'v_km' => 'Km por día', 'v_cantidad' => 'Cantidad de vehículos'],
];
const REQUERIDOS = ['diesel' => ['d_litros', 'd_frecuencia'], 'solar' => ['s_kwh'], 'cargadores' => ['c_equipo'], 'conversion' => ['v_marca']];
const NUMERICOS = ['d_litros', 's_kwh', 's_dias', 'c_cantidad', 'c_distancia', 'v_anio', 'v_km', 'v_cantidad'];
const ESTADOS = ['nuevo' => 'Nuevo', 'contactado' => 'Contactado', 'cotizado' => 'Cotizado', 'visita' => 'Visita técnica', 'ganado' => 'Ganado', 'perdido' => 'Perdido'];
// Equipo elegido en el formulario -> código del catálogo
const EQUIPO_CODIGO = [
  'AC22 Turbo' => 'CAR-AC22', 'DA30 Compact' => 'CAR-DA30', 'DA60 Fast' => 'CAR-DA60', 'DA180 Fast' => 'CAR-DA180',
  'DA240 Fast' => 'CAR-DA240', 'DA480 Ultra-fast' => 'CAR-DA480', 'DC480 Cabinet' => 'CAR-DC480', 'Almacenamiento' => 'CAR-BESS',
];

function grupo_de(string $tipo): string { foreach (GRUPOS as $g => $t) if (in_array($tipo, $t, true)) return $g; return ''; }

/* ---------- Utilidades ---------- */
function h($s): string { return htmlspecialchars((string)$s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }
function ahora(): string { return date('Y-m-d H:i:s'); }
function fecha(string $s): string { $t = strtotime($s); return $t ? date('d/m/Y H:i', $t) : $s; }
function fecha_larga(string $s): string {
  $m = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  $t = strtotime($s) ?: time(); return date('j', $t) . ' de ' . $m[(int)date('n', $t) - 1] . ' de ' . date('Y', $t);
}
function bs($n, int $dec = 2): string { return number_format((float)$n, $dec, ',', '.'); }
function num($v): float { $v = str_replace([' ', ','], ['', '.'], trim((string)$v)); return is_numeric($v) ? (float)$v : 0.0; }
function una_linea(string $s, int $max = 200): string { return mb_substr(trim(preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $s) ?? ''), 0, $max); }
function texto_largo(string $s, int $max = 1500): string { return mb_substr(trim(preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]+/u', '', $s) ?? ''), 0, $max); }
function ip(): string { return substr((string)($_SERVER['REMOTE_ADDR'] ?? ''), 0, 45); }
function wa_numero(string $tel): string {
  $d = preg_replace('/\D/', '', $tel) ?? '';
  if (strlen($d) === 8 && in_array($d[0], ['6', '7', '2', '3', '4'], true)) $d = '591' . $d; // número boliviano sin código de país
  return $d;
}
function redirigir(string $url): void { header('Location: ' . $url); exit; }

/* ---------- Carpeta de datos (fuera de public_html si se puede) ---------- */
function data_dir(): string {
  static $d = null;
  if ($d !== null) return $d;
  foreach ([dirname(__DIR__, 2) . '/efo-data', __DIR__ . '/_data'] as $c) {
    if ((is_dir($c) || @mkdir($c, 0750, true)) && is_writable($c)) { $d = $c; break; }
  }
  if ($d === null) { http_response_code(500); exit('No se pudo crear la carpeta de datos del CRM.'); }
  if (!is_file("$d/.htaccess")) @file_put_contents("$d/.htaccess", "Require all denied\nDeny from all\n");
  if (!is_dir("$d/archivos")) @mkdir("$d/archivos", 0750, true);
  return $d;
}

/* ---------- Base de datos (SQLite) ---------- */
function db(): PDO {
  static $pdo = null;
  if ($pdo) return $pdo;
  $pdo = new PDO('sqlite:' . data_dir() . '/crm.sqlite', null, null, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
  ]);
  $pdo->exec('PRAGMA busy_timeout = 5000');
  $pdo->exec('PRAGMA foreign_keys = ON');
  $pdo->exec('PRAGMA journal_mode = WAL');
  $pdo->exec('CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT, codigo TEXT UNIQUE, creado TEXT NOT NULL, actualizado TEXT NOT NULL,
    tipo TEXT, grupo TEXT, nombre TEXT, empresa TEXT, telefono TEXT, correo TEXT, ciudad TEXT, mensaje TEXT,
    datos TEXT, estado TEXT NOT NULL DEFAULT \'nuevo\', origen TEXT, ip TEXT)');
  $pdo->exec('CREATE TABLE IF NOT EXISTS archivos (
    id INTEGER PRIMARY KEY AUTOINCREMENT, lead_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    nombre TEXT, ruta TEXT, mime TEXT, tamano INTEGER, creado TEXT)');
  $pdo->exec('CREATE TABLE IF NOT EXISTS notas (
    id INTEGER PRIMARY KEY AUTOINCREMENT, lead_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    creado TEXT, texto TEXT)');
  $pdo->exec('CREATE TABLE IF NOT EXISTS cotizaciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT, lead_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    numero TEXT UNIQUE, creado TEXT, datos TEXT, total REAL)');
  $pdo->exec('CREATE TABLE IF NOT EXISTS ajustes (clave TEXT PRIMARY KEY, valor TEXT)');
  $pdo->exec('CREATE TABLE IF NOT EXISTS intentos (id INTEGER PRIMARY KEY AUTOINCREMENT, tipo TEXT, ip TEXT, ts INTEGER)');
  $pdo->exec('CREATE INDEX IF NOT EXISTS i_leads_estado ON leads(estado)');
  $pdo->exec('CREATE INDEX IF NOT EXISTS i_intentos ON intentos(tipo, ip, ts)');
  return $pdo;
}
function q(string $sql, array $p = []): PDOStatement { $s = db()->prepare($sql); $s->execute($p); return $s; }

function ajuste(string $k, $def = null) {
  $v = q('SELECT valor FROM ajustes WHERE clave = ?', [$k])->fetchColumn();
  if ($v === false) return $def;
  $d = json_decode((string)$v, true);
  return $d === null ? $def : $d;
}
function guardar_ajuste(string $k, $v): void {
  q('INSERT INTO ajustes (clave, valor) VALUES (?, ?) ON CONFLICT(clave) DO UPDATE SET valor = excluded.valor', [$k, json_encode($v, JSON_UNESCAPED_UNICODE)]);
}

/* Límite de intentos por IP (formulario y acceso al CRM) */
function demasiados(string $tipo, int $max, int $seg): bool {
  q('DELETE FROM intentos WHERE ts < ?', [time() - 86400]);
  return (int)q('SELECT COUNT(*) FROM intentos WHERE tipo = ? AND ip = ? AND ts > ?', [$tipo, ip(), time() - $seg])->fetchColumn() >= $max;
}
function anotar_intento(string $tipo): void { q('INSERT INTO intentos (tipo, ip, ts) VALUES (?, ?, ?)', [$tipo, ip(), time()]); }

/* ---------- Sesión, acceso y protección CSRF ---------- */
function es_https(): bool {
  return (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https' || ($_SERVER['SERVER_PORT'] ?? '') === '443';
}
function cabeceras_crm(): void {
  header('X-Robots-Tag: noindex, nofollow');
  header('Cache-Control: no-store, private');
  header('X-Frame-Options: DENY');
  header('X-Content-Type-Options: nosniff');
  header('Referrer-Policy: same-origin');
}
function sesion(): void {
  if (session_status() === PHP_SESSION_ACTIVE) return;
  session_name('efo_crm');
  session_set_cookie_params(['lifetime' => 0, 'path' => '/crm/', 'secure' => es_https(), 'httponly' => true, 'samesite' => 'Lax']);
  session_start();
}
function clave_hash(): string { return (string)ajuste('clave_hash', cfg('clave_hash', '')); }
function requiere_login(): void {
  cabeceras_crm();
  sesion();
  $ok = !empty($_SESSION['ok']) && ($_SESSION['t'] ?? 0) > time() - 8 * 3600 && ($_SESSION['h'] ?? '') === substr(hash('sha256', clave_hash()), 0, 16);
  if (!$ok) { $_SESSION = []; redirigir('login.php'); }
  $_SESSION['t'] = time();
}
function csrf(): string { sesion(); if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(16)); return $_SESSION['csrf']; }
function csrf_campo(): string { return '<input type="hidden" name="csrf" value="' . h(csrf()) . '">'; }
function csrf_ok(): void {
  if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST' || !hash_equals(csrf(), (string)($_POST['csrf'] ?? ''))) {
    http_response_code(400); exit('La sesión expiró. Vuelve atrás y recarga la página.');
  }
}
function aviso(?string $m = null): ?string { sesion(); if ($m !== null) { $_SESSION['aviso'] = $m; return null; } $a = $_SESSION['aviso'] ?? null; unset($_SESSION['aviso']); return $a; }

/* ---------- Catálogo y parámetros (precios en Bs; se editan en catalogo.php) ---------- */
function catalogo_inicial(): array {
  return [
    ['PAN', 'Panel', 'Panel fotovoltaico 550 W', 'unidad', 0],
    ['BAT', 'Batería', 'Módulo de batería LiFePO4 51,2 V · 100 Ah', 'unidad', 0],
    ['MPPT', 'Controlador', 'Controlador MPPT independiente', 'unidad', 0],
    ['PDC', 'Protección', 'Protecciones lado DC (lote)', 'lote', 0],
    ['PAC', 'Protección', 'Protecciones lado AC (lote)', 'lote', 0],
    ['EST', 'Estructura', 'Estructura de montaje', 'lote', 0],
    ['CAB', 'Cableado', 'Cableado, conectores y canalización', 'lote', 0],
    ['TIE', 'Puesta a tierra', 'Sistema de puesta a tierra', 'lote', 0],
    ['INS', 'Servicio', 'Instalación y puesta en marcha', 'servicio', 0],
    ['ING', 'Servicio', 'Ingeniería y documentación', 'servicio', 0],
    ['TRA', 'Servicio', 'Transporte y logística', 'servicio', 0],
    ['DIE', 'Diésel', 'Diésel ULSD (ultra bajo azufre)', 'litro', 0],
    ['DIE-FLE', 'Diésel', 'Flete de entrega de diésel', 'servicio', 0],
    ['CAR-AC22', 'Cargador', 'Cargador AC22 Turbo (7, 11 o 22 kW)', 'unidad', 0],
    ['CAR-DA30', 'Cargador', 'Cargador DC DA30 Compact (30 kW)', 'unidad', 0],
    ['CAR-DA60', 'Cargador', 'Cargador DC DA60 Fast (60 kW)', 'unidad', 0],
    ['CAR-DA180', 'Cargador', 'Cargador DC DA180 Fast (180 kW)', 'unidad', 0],
    ['CAR-DA240', 'Cargador', 'Cargador DC DA240 Fast (240 kW)', 'unidad', 0],
    ['CAR-DA480', 'Cargador', 'Cargador DC DA480 Ultra-fast (480 kW)', 'unidad', 0],
    ['CAR-DC480', 'Cargador', 'Sistema de carga distribuida DC480 Cabinet + DD300', 'unidad', 0],
    ['CAR-BESS', 'Batería', 'Sistema de almacenamiento de energía (baterías)', 'unidad', 0],
    ['CAR-INS', 'Servicio', 'Instalación de cargador', 'servicio', 0],
    ['CONV', 'Servicio', 'Conversión de vehículo a eléctrico', 'vehículo', 0],
  ];
}
function inversores_inicial(): array {
  $r = [];
  foreach (['On-Grid' => [3, 5, 10, 15, 20, 30], 'Híbrido' => [3, 5, 8, 10, 12], 'Off-Grid' => [3, 5, 8, 10]] as $t => $kws)
    foreach ($kws as $kw) $r[] = [$t, $kw, 0];
  return $r;
}
function parametros_inicial(): array {
  return [ // valores de la hoja DIMENSIONAMIENTO del Excel
    'hsp' => 5, 'rend' => 0.75, 'cob' => 1, 'panel_w' => 550, 'dcac' => 1.2, 'aut' => 1, 'frac' => 0.5,
    'dod' => 0.8, 'ef' => 0.9, 'bat_v' => 51.2, 'bat_ah' => 100, 'isc' => 14, 'serie' => 1, 'factor' => 1.56,
  ];
}
function comercial_inicial(): array {
  return [ // valores de la hoja COTIZACION del Excel
    'margen' => 25, 'impuesto' => 0, 'validez' => 15, 'plazo' => 'A confirmar tras visita técnica', 'pago' => 'A convenir',
    'garantia' => 'Según fabricante y contrato', 'alcance' => 'Oferta preliminar sujeta a visita técnica y diseño ejecutivo.',
  ];
}
function catalogo(): array {
  $c = ajuste('catalogo', null);
  return is_array($c) ? $c : catalogo_inicial();
}
function catalogo_por_codigo(): array { $r = []; foreach (catalogo() as $i) $r[$i[0]] = $i; return $r; }
function inversores(): array { $c = ajuste('inversores', null); return is_array($c) ? $c : inversores_inicial(); }
function parametros(): array { return array_merge(parametros_inicial(), (array)ajuste('parametros', [])); }
function comercial(): array { return array_merge(comercial_inicial(), (array)ajuste('comercial', [])); }

/* ---------- Cálculo solar (mismas fórmulas que el Excel) ---------- */
function modalidad_de(string $v): string {
  if (stripos($v, 'híbrido') === 0 || stripos($v, 'hibrido') === 0) return 'Híbrido';
  if (stripos($v, 'off') === 0) return 'Off-Grid';
  return 'On-Grid';
}
function techo(float $x): int { return (int)ceil(round($x, 6)); }
function calculo_solar(array $p): array {
  $kwh = max(0, (float)$p['kwh']); $dias = max(1, (float)$p['dias']);
  $mod = $p['modalidad'];
  $diario = $kwh / $dias;
  $objetivo = $diario * $p['cob'];
  $kwp_req = ($p['hsp'] * $p['rend']) > 0 ? $objetivo / ($p['hsp'] * $p['rend']) : 0;
  $paneles = $p['panel_w'] > 0 ? techo($kwp_req * 1000 / $p['panel_w']) : 0;
  $kwp = $paneles * $p['panel_w'] / 1000;
  $kw_ac = $p['dcac'] > 0 ? $kwp / $p['dcac'] : 0;
  $e_bat = $mod === 'On-Grid' ? 0 : (($p['dod'] * $p['ef']) > 0 ? $objetivo * $p['aut'] * $p['frac'] / ($p['dod'] * $p['ef']) : 0);
  $e_mod = $p['bat_v'] * $p['bat_ah'] / 1000;
  $baterias = $mod === 'On-Grid' || $e_mod <= 0 ? 0 : techo($e_bat / $e_mod);
  $serie = max(1, (int)$p['serie']);
  $cadenas = techo($paneles / $serie);
  $i_fv = $cadenas * $p['isc'];
  $aviso = $mod === 'Off-Grid' ? 'La factura sola no basta: validar cargas y picos de arranque mediante visita técnica.'
    : ($mod === 'Híbrido' ? 'Validar cargas críticas, potencia de respaldo y autonomía.' : 'Validar demanda, sombras y condiciones de interconexión.');
  return [
    'diario' => $diario, 'objetivo' => $objetivo, 'kwp_req' => $kwp_req, 'paneles' => $paneles, 'kwp' => $kwp, 'kw_ac' => $kw_ac,
    'e_bat' => $e_bat, 'e_mod' => $e_mod, 'baterias' => $baterias, 'e_bat_inst' => $baterias * $e_mod,
    'cadenas' => $cadenas, 'i_fv' => $i_fv, 'i_prot' => $i_fv * $p['factor'], 'aviso' => $aviso,
  ];
}
/* Inversor: el más chico de la tabla que alcance la potencia; si ninguno alcanza, varios del más grande */
function elegir_inversor(string $mod, float $kw_ac): array {
  $filas = array_values(array_filter(inversores(), fn($r) => $r[0] === $mod && (float)$r[1] > 0));
  usort($filas, fn($a, $b) => $a[1] <=> $b[1]);
  if (!$filas) return ['cant' => 1, 'kw' => round($kw_ac, 1), 'precio' => 0, 'falta' => true];
  foreach ($filas as $f) if ((float)$f[1] + 1e-9 >= $kw_ac) return ['cant' => 1, 'kw' => (float)$f[1], 'precio' => (float)$f[2], 'falta' => false];
  $g = end($filas);
  return ['cant' => techo($kw_ac / (float)$g[1]), 'kw' => (float)$g[1], 'precio' => (float)$g[2], 'falta' => false];
}
function kw_txt(float $kw): string { return rtrim(rtrim(number_format($kw, 1, ',', ''), '0'), ','); }

/* Líneas sugeridas para una cotización según el servicio de la solicitud */
function lineas_sugeridas(array $lead, ?array $solar = null, ?array $ps = null): array {
  $cat = catalogo_por_codigo();
  $d = json_decode((string)$lead['datos'], true) ?: [];
  $L = [];
  $add = function (string $cod, float $cant, ?string $desc = null, ?float $precio = null) use (&$L, $cat) {
    if ($cant <= 0) return;
    $i = $cat[$cod] ?? [$cod, '', $desc ?? $cod, 'unidad', 0];
    $L[] = ['cod' => $cod, 'desc' => $desc ?? $i[2], 'unidad' => $i[3], 'cant' => $cant, 'precio' => $precio ?? (float)$i[4]];
  };
  switch ($lead['grupo']) {
    case 'solar':
      if (!$solar) break;
      $inv = elegir_inversor($ps['modalidad'], $solar['kw_ac']);
      $add('PAN', $solar['paneles'], 'Panel fotovoltaico ' . kw_txt((float)$ps['panel_w']) . ' W');
      $add('INV', $inv['cant'], 'Inversor ' . $ps['modalidad'] . ' ' . kw_txt($inv['kw']) . ' kW', $inv['precio']);
      $add('BAT', $solar['baterias']);
      foreach (['PDC', 'PAC', 'EST', 'CAB', 'TIE', 'INS', 'ING', 'TRA'] as $c) $add($c, 1);
      break;
    case 'diesel':
      $add('DIE', num($d['d_litros'] ?? 0));
      $add('DIE-FLE', 1);
      break;
    case 'cargadores':
      $n = max(1, num($d['c_cantidad'] ?? 1));
      foreach (EQUIPO_CODIGO as $k => $cod) if (str_starts_with((string)($d['c_equipo'] ?? ''), $k)) { $add($cod, $n); break; }
      $add('CAR-INS', $n);
      break;
    case 'conversion':
      $add('CONV', max(1, num($d['v_cantidad'] ?? 1)), 'Conversión a eléctrico · ' . una_linea((string)($d['v_marca'] ?? ''), 80));
      break;
  }
  if (!$L) $L[] = ['cod' => '', 'desc' => '', 'unidad' => 'unidad', 'cant' => 1, 'precio' => 0];
  return $L;
}
/* Totales: el costo del catálogo + margen comercial; luego impuestos. Igual que el Excel. */
function totales(array $lineas, float $margen, float $impuesto): array {
  $costo = 0.0;
  foreach ($lineas as $l) $costo += $l['cant'] * $l['precio'];
  $util = $costo * $margen / 100;
  $sub = $costo + $util;
  $imp = $sub * $impuesto / 100;
  return ['costo' => $costo, 'utilidad' => $util, 'subtotal' => $sub, 'impuestos' => $imp, 'total' => $sub + $imp];
}
function siguiente_numero(): string {
  $pdo = db();
  $pdo->beginTransaction();
  $n = (int)ajuste('contador_cot', 0) + 1;
  guardar_ajuste('contador_cot', $n);
  $pdo->commit();
  return 'EFO-COT-' . date('Y') . '-' . str_pad((string)$n, 4, '0', STR_PAD_LEFT);
}

/* ---------- Plantilla de las páginas del CRM ---------- */
function cabecera(string $titulo, string $activo = ''): void {
  $menu = ['index.php' => 'Solicitudes', 'catalogo.php' => 'Precios y parámetros', 'cuenta.php' => 'Cuenta'];
  echo '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">';
  echo '<meta name="robots" content="noindex,nofollow"><title>' . h($titulo) . ' · CRM E.F.O.</title>';
  echo '<link rel="icon" href="/assets/img/favicon-192.png"><link rel="stylesheet" href="crm.css?v=1"></head><body>';
  echo '<header class="top"><a class="logo" href="index.php"><img src="/assets/img/logo-efo.webp" alt="E.F.O." width="90" height="36"><span>CRM</span></a><nav>';
  foreach ($menu as $u => $t) echo '<a href="' . $u . '"' . ($activo === $u ? ' aria-current="page"' : '') . '>' . $t . '</a>';
  echo '<a href="salir.php">Salir</a></nav></header><main class="wrap">';
  if ($a = aviso()) echo '<p class="aviso" role="status">' . h($a) . '</p>';
}
function pie(): void { echo '</main></body></html>'; }
