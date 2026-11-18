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
  // Versión 2: usuarios, historial, tareas, accesos y campos comerciales
  $pdo->exec('CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT, usuario TEXT UNIQUE NOT NULL, nombre TEXT NOT NULL, correo TEXT,
    rol TEXT NOT NULL DEFAULT \'ventas\', hash TEXT NOT NULL, activo INTEGER NOT NULL DEFAULT 1, creado TEXT, ultimo TEXT)');
  $pdo->exec('CREATE TABLE IF NOT EXISTS actividad (
    id INTEGER PRIMARY KEY AUTOINCREMENT, lead_id INTEGER REFERENCES leads(id) ON DELETE CASCADE,
    usuario_id INTEGER, creado TEXT NOT NULL, tipo TEXT NOT NULL, texto TEXT)');
  $pdo->exec('CREATE TABLE IF NOT EXISTS tareas (
    id INTEGER PRIMARY KEY AUTOINCREMENT, lead_id INTEGER REFERENCES leads(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL, vence TEXT, usuario_id INTEGER, hecha INTEGER NOT NULL DEFAULT 0, creado TEXT, creador_id INTEGER)');
  $pdo->exec('CREATE TABLE IF NOT EXISTS accesos (id INTEGER PRIMARY KEY AUTOINCREMENT, usuario TEXT, usuario_id INTEGER, ts TEXT, ip TEXT, ok INTEGER)');
  $pdo->exec('CREATE INDEX IF NOT EXISTS i_act_lead ON actividad(lead_id, id)');
  $pdo->exec('CREATE INDEX IF NOT EXISTS i_tareas ON tareas(hecha, vence)');
  $col = function (string $t, string $c, string $def) use ($pdo) {
    $cols = array_column($pdo->query("PRAGMA table_info($t)")->fetchAll(), 'name');
    if (!in_array($c, $cols, true)) $pdo->exec("ALTER TABLE $t ADD COLUMN $c $def");
  };
  $col('leads', 'prioridad', "TEXT NOT NULL DEFAULT 'media'");
  $col('leads', 'asignado', 'INTEGER');
  $col('leads', 'valor', 'REAL NOT NULL DEFAULT 0');
  $col('leads', 'proximo', 'TEXT');
  $col('leads', 'fuente', "TEXT NOT NULL DEFAULT 'Formulario web'");
  $col('cotizaciones', 'estado', "TEXT NOT NULL DEFAULT 'borrador'");
  $col('cotizaciones', 'usuario_id', 'INTEGER');
  // Notas de la versión 1 pasan al historial (una sola vez)
  if (!$pdo->query("SELECT 1 FROM ajustes WHERE clave = 'migr_notas'")->fetchColumn()) {
    $pdo->exec("INSERT INTO actividad (lead_id, creado, tipo, texto) SELECT lead_id, creado, 'nota', texto FROM notas");
    $pdo->exec("INSERT INTO ajustes (clave, valor) VALUES ('migr_notas', '1')");
  }
  // Primer usuario: administrador con la contraseña inicial de _config.php
  if ((int)$pdo->query('SELECT COUNT(*) FROM usuarios')->fetchColumn() === 0) {
    $h = (string)cfg('clave_hash', '');
    $v = $pdo->query("SELECT valor FROM ajustes WHERE clave = 'clave_hash'")->fetchColumn();
    if ($v !== false) $h = (string)json_decode((string)$v, true);
    if ($h !== '') $pdo->prepare('INSERT INTO usuarios (usuario, nombre, correo, rol, hash, creado) VALUES (?, ?, ?, ?, ?, ?)')
      ->execute(['admin', 'Administrador', (string)cfg('correo_aviso', ''), 'admin', $h, date('Y-m-d H:i:s')]);
  }
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
/* Usuarios y roles */
const ROLES = ['admin' => 'Administrador', 'ventas' => 'Ventas', 'lectura' => 'Solo lectura'];
const PERMISOS = [
  'admin' => ['ver', 'editar', 'cotizar', 'tareas', 'eliminar', 'precios', 'usuarios', 'respaldo'],
  'ventas' => ['ver', 'editar', 'cotizar', 'tareas'],
  'lectura' => ['ver'],
];
const PRIORIDADES = ['alta' => 'Alta', 'media' => 'Media', 'baja' => 'Baja'];
const FUENTES = ['Formulario web', 'WhatsApp', 'Llamada', 'Visita a oficina', 'Correo', 'Referido', 'Feria o evento', 'Redes sociales', 'Otro'];
const ESTADOS_COT = ['borrador' => 'Borrador', 'enviada' => 'Enviada', 'aceptada' => 'Aceptada', 'rechazada' => 'Rechazada'];

function huella(string $hash): string { return substr(hash('sha256', $hash), 0, 16); }
function usuario(): ?array { return $GLOBALS['USUARIO'] ?? null; }
function uid(): ?int { $u = usuario(); return $u ? (int)$u['id'] : null; }
function puede(string $p): bool { $u = usuario(); return $u && in_array($p, PERMISOS[$u['rol']] ?? [], true); }
function requiere_login(): void {
  cabeceras_crm();
  sesion();
  $u = !empty($_SESSION['uid']) ? q('SELECT * FROM usuarios WHERE id = ? AND activo = 1', [(int)$_SESSION['uid']])->fetch() : false;
  $ok = $u && ($_SESSION['t'] ?? 0) > time() - 8 * 3600 && ($_SESSION['h'] ?? '') === huella($u['hash']);
  if (!$ok) { $_SESSION = []; redirigir('login.php'); }
  $_SESSION['t'] = time();
  $GLOBALS['USUARIO'] = $u;
}
function requiere(string $p): void {
  if (puede($p)) return;
  http_response_code(403);
  cabecera('Sin permiso');
  echo '<div class="vacio"><h2>No tienes permiso para esta sección</h2><p>Pide a un administrador que te dé acceso.</p><p><a class="btn" href="index.php">Volver al inicio</a></p></div>';
  pie(); exit;
}
function usuarios_activos(): array { return q('SELECT id, nombre FROM usuarios WHERE activo = 1 ORDER BY nombre')->fetchAll(); }
function nombre_usuario(?int $id): string {
  static $c = null;
  if ($c === null) { $c = []; foreach (q('SELECT id, nombre FROM usuarios')->fetchAll() as $r) $c[(int)$r['id']] = $r['nombre']; }
  return $id ? ($c[$id] ?? '—') : '';
}
/* Historial de cada cliente */
function registrar(?int $lead, string $tipo, string $texto): void {
  q('INSERT INTO actividad (lead_id, usuario_id, creado, tipo, texto) VALUES (?, ?, ?, ?, ?)', [$lead, uid(), ahora(), $tipo, $texto]);
  if ($lead) q('UPDATE leads SET actualizado = ? WHERE id = ?', [ahora(), $lead]);
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
function ico(string $n): string {
  $p = [
    'inicio' => '<path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
    'embudo' => '<path d="M3 4h18l-7 8v6l-4 2v-8z"/>',
    'clientes' => '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.6-3.6 3.2-5.5 6.5-5.5s5.9 1.9 6.5 5.5"/><circle cx="17" cy="9" r="2.5"/><path d="M16.5 14.6c2.6.2 4.4 1.9 5 5.4"/>',
    'tareas' => '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
    'cotiz' => '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5"/><path d="M10 13h6M10 17h4"/>',
    'precios' => '<path d="M20 12 12 20l-8-8V4h8z"/><circle cx="8.5" cy="8.5" r="1.5"/>',
    'usuarios' => '<circle cx="12" cy="8" r="4"/><path d="M4 21c.8-4.4 4-7 8-7s7.2 2.6 8 7"/>',
    'cuenta' => '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
    'salir' => '<path d="M15 4h4v16h-4"/><path d="M10 8l-4 4 4 4"/><path d="M6 12h10"/>',
    'mas' => '<path d="M12 5v14M5 12h14"/>',
    'buscar' => '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    'menu' => '<path d="M4 7h16M4 12h16M4 17h16"/>',
    'wa' => '<path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z"/><path d="M9 9.5c.3 2 2.5 4.2 4.5 4.5l1.2-1.2 1.8.8-.3 1.5c-3.8.4-7.5-3.3-7.1-7.1l1.5-.3.8 1.8z"/>',
    'mail' => '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/>',
    'tel' => '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
    'respaldo' => '<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/>',
    'sol' => '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    'gota' => '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
    'rayo' => '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    'auto' => '<path d="M5 16V11l2-5h10l2 5v5"/><path d="M3 16h18v3H3z"/><circle cx="7.5" cy="16" r="1.5"/><circle cx="16.5" cy="16" r="1.5"/>',
    'chat' => '<path d="M4 5h16v11H8l-4 4z"/>',
    'editar' => '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
    'copiar' => '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
  ][$n] ?? '';
  return '<svg class="ico" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' . $p . '</svg>';
}
function ico_grupo(string $g): string { return ico(['solar' => 'sol', 'diesel' => 'gota', 'cargadores' => 'rayo', 'conversion' => 'auto'][$g] ?? 'chat'); }
function cabecera(string $titulo, string $activo = ''): void {
  $u = usuario();
  $nuevas = $u ? (int)q("SELECT COUNT(*) FROM leads WHERE estado = 'nuevo'")->fetchColumn() : 0;
  $vencidas = $u ? (int)q('SELECT COUNT(*) FROM tareas WHERE hecha = 0 AND vence IS NOT NULL AND vence <= ?', [date('Y-m-d')])->fetchColumn() : 0;
  $menu = [
    ['index.php', 'Inicio', 'inicio', 0, 'ver'], ['embudo.php', 'Embudo de ventas', 'embudo', 0, 'ver'],
    ['solicitudes.php', 'Solicitudes y clientes', 'clientes', $nuevas, 'ver'], ['tareas.php', 'Tareas y seguimientos', 'tareas', $vencidas, 'ver'],
    ['cotizaciones.php', 'Cotizaciones', 'cotiz', 0, 'ver'], ['catalogo.php', 'Precios y parámetros', 'precios', 0, 'precios'],
    ['usuarios.php', 'Usuarios', 'usuarios', 0, 'usuarios'], ['cuenta.php', 'Mi cuenta', 'cuenta', 0, 'ver'],
  ];
  echo '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">';
  echo '<meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="#031F36"><title>' . h($titulo) . ' · CRM E.F.O.</title>';
  echo '<link rel="icon" href="/assets/img/favicon-192.png"><link rel="preload" href="/assets/fonts/manrope-latin.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="crm.css?v=2"></head><body class="app">';
  echo '<aside class="side" id="side"><a class="marca" href="index.php"><img src="/assets/img/logo-efo-claro.webp" alt="E.F.O. Ltda." width="120" height="48"><span>CRM comercial</span></a><nav aria-label="Menú del CRM">';
  foreach ($menu as [$url, $txt, $ic, $badge, $perm]) {
    if (!puede($perm)) continue;
    echo '<a href="' . $url . '"' . ($activo === $url ? ' aria-current="page"' : '') . '>' . ico($ic) . '<span>' . $txt . '</span>' . ($badge ? '<b class="badge">' . $badge . '</b>' : '') . '</a>';
  }
  echo '</nav>';
  if ($u) echo '<div class="yo"><span class="avatar">' . h(mb_strtoupper(mb_substr($u['nombre'], 0, 1))) . '</span><span><b>' . h($u['nombre']) . '</b><small>' . h(ROLES[$u['rol']] ?? $u['rol']) . '</small></span><a href="salir.php" title="Cerrar sesión" aria-label="Cerrar sesión">' . ico('salir') . '</a></div>';
  echo '</aside><div class="velo" id="velo" hidden></div><div class="principal"><header class="barra">';
  echo '<button class="menu-btn" type="button" id="menu-btn" aria-label="Abrir menú" aria-controls="side" aria-expanded="false">' . ico('menu') . '</button>';
  echo '<form class="busca" action="solicitudes.php" method="get" role="search">' . ico('buscar') . '<label class="sr" for="busca-q">Buscar clientes</label><input id="busca-q" name="q" placeholder="Buscar cliente, empresa, teléfono o código" value="' . h(is_string($_GET['q'] ?? null) ? $_GET['q'] : '') . '"></form>';
  if (puede('editar')) echo '<a class="btn btn-cyan" href="cliente.php">' . ico('mas') . '<span>Nuevo cliente</span></a>';
  echo '</header><main class="wrap" id="contenido">';
  if ($a = aviso()) echo '<p class="aviso" role="status">' . h($a) . '</p>';
}
function pie(): void {
  echo '</main><footer class="pie">E.F.O. Ltda. · CRM comercial · <a href="/" target="_blank" rel="noopener">efo.com.bo</a></footer></div>';
  echo '<script>(function(){var b=document.getElementById("menu-btn"),s=document.getElementById("side"),v=document.getElementById("velo");if(!b)return;function t(o){s.classList.toggle("abierto",o);v.hidden=!o;b.setAttribute("aria-expanded",o?"true":"false");}b.addEventListener("click",function(){t(!s.classList.contains("abierto"));});v.addEventListener("click",function(){t(false);});})();</script>';
  echo '</body></html>';
}
/* Insignias reutilizables */
function chip_estado(string $e): string { return '<span class="estado e-' . h($e) . '">' . h(ESTADOS[$e] ?? $e) . '</span>'; }
function chip_prioridad(string $p): string { return '<span class="prio p-' . h($p) . '">' . h(PRIORIDADES[$p] ?? $p) . '</span>'; }
function chip_cot(string $e): string { return '<span class="estado c-' . h($e) . '">' . h(ESTADOS_COT[$e] ?? $e) . '</span>'; }
function hace(string $f): string {
  $s = time() - (strtotime($f) ?: time());
  if ($s < 60) return 'hace un momento';
  if ($s < 3600) return 'hace ' . (int)floor($s / 60) . ' min';
  if ($s < 86400) return 'hace ' . (int)floor($s / 3600) . ' h';
  if ($s < 86400 * 30) { $d = (int)floor($s / 86400); return $d === 1 ? 'ayer' : "hace $d días"; }
  return date('d/m/Y', strtotime($f));
}
function texto_get(string $k, int $max = 80): string { $v = $_GET[$k] ?? ''; return is_string($v) ? una_linea($v, $max) : ''; }
