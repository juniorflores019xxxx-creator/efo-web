<?php
declare(strict_types=1);
require __DIR__ . '/_lib.php';
requiere_login();
requiere('editar');

$id = (int)($_GET['id'] ?? $_POST['id'] ?? 0);
$lead = $id ? q('SELECT * FROM leads WHERE id = ?', [$id])->fetch() : null;
if ($id && !$lead) redirigir('solicitudes.php');
$v = $lead ?: ['nombre' => '', 'empresa' => '', 'telefono' => '', 'correo' => '', 'ciudad' => 'Santa Cruz', 'tipo' => '', 'mensaje' => '', 'fuente' => 'WhatsApp', 'prioridad' => 'media', 'asignado' => uid(), 'datos' => '{}'];
$datos = json_decode((string)$v['datos'], true) ?: [];
$error = '';

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
  csrf_ok();
  $P = fn(string $k, int $m = 200) => una_linea((string)($_POST[$k] ?? ''), $m);
  $v = array_merge($v, ['nombre' => $P('nombre', 120), 'empresa' => $P('empresa', 120), 'telefono' => $P('telefono', 30), 'correo' => $P('correo', 120),
    'ciudad' => $P('ciudad', 40), 'tipo' => $P('tipo', 60), 'mensaje' => texto_largo((string)($_POST['mensaje'] ?? ''), 3000), 'fuente' => $P('fuente', 40),
    'prioridad' => array_key_exists($P('prioridad', 10), PRIORIDADES) ? $P('prioridad', 10) : 'media', 'asignado' => ctype_digit($P('asignado', 10)) ? (int)$P('asignado', 10) : null]);
  $grupo = grupo_de($v['tipo']);
  $datos = [];
  if ($grupo !== '') foreach (CAMPOS[$grupo] as $k => $t) { $x = $P($k); if ($x !== '') $datos[$k] = $x; }
  if (mb_strlen($v['nombre']) < 2) $error = 'Escribe el nombre del cliente.';
  elseif (strlen(preg_replace('/\D/', '', $v['telefono']) ?? '') < 7) $error = 'Escribe un teléfono válido.';
  elseif ($v['correo'] !== '' && !filter_var($v['correo'], FILTER_VALIDATE_EMAIL)) $error = 'Revisa el correo.';
  elseif (!in_array($v['tipo'], TIPOS, true)) $error = 'Elige el tipo de consulta.';
  elseif (!in_array($v['ciudad'], DEPTOS, true)) $error = 'Elige el departamento.';
  if (!in_array($v['fuente'], FUENTES, true)) $v['fuente'] = 'Otro';
  if (!$error) {
    $json = json_encode($datos, JSON_UNESCAPED_UNICODE);
    if ($lead) {
      q('UPDATE leads SET nombre = ?, empresa = ?, telefono = ?, correo = ?, ciudad = ?, tipo = ?, grupo = ?, mensaje = ?, datos = ?, fuente = ?, prioridad = ?, asignado = ?, actualizado = ? WHERE id = ?',
        [$v['nombre'], $v['empresa'], $v['telefono'], $v['correo'], $v['ciudad'], $v['tipo'], $grupo, $v['mensaje'], $json, $v['fuente'], $v['prioridad'], $v['asignado'], ahora(), $id]);
      registrar($id, 'cambio', 'Se editaron los datos del cliente.');
      aviso('Datos actualizados.');
    } else {
      $t = ahora();
      q("INSERT INTO leads (creado, actualizado, tipo, grupo, nombre, empresa, telefono, correo, ciudad, mensaje, datos, estado, origen, ip, fuente, prioridad, asignado)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'nuevo', 'Carga manual', '', ?, ?, ?)",
        [$t, $t, $v['tipo'], $grupo, $v['nombre'], $v['empresa'], $v['telefono'], $v['correo'], $v['ciudad'], $v['mensaje'], $json, $v['fuente'], $v['prioridad'], $v['asignado']]);
      $id = (int)db()->lastInsertId();
      q('UPDATE leads SET codigo = ? WHERE id = ?', ['EFO-' . date('y') . '-' . str_pad((string)$id, 4, '0', STR_PAD_LEFT), $id]);
      registrar($id, 'creado', 'Cliente cargado manualmente (' . $v['fuente'] . ').');
      aviso('Cliente creado.');
    }
    redirigir('ver.php?id=' . $id);
  }
}
$opts = fn(array $a, string $sel) => implode('', array_map(fn($o) => '<option' . ($o === $sel ? ' selected' : '') . '>' . h($o) . '</option>', $a));
cabecera($lead ? 'Editar cliente' : 'Nuevo cliente', 'solicitudes.php');
?>
<p class="migas"><a href="<?= $lead ? 'ver.php?id=' . $id : 'solicitudes.php' ?>">← <?= $lead ? h($lead['nombre']) : 'Solicitudes y clientes' ?></a></p>
<h1><?= $lead ? 'Editar datos del cliente' : 'Cargar un cliente nuevo' ?></h1>
<?php if (!$lead): ?><p class="muted">Para clientes que llegan por WhatsApp, llamada, visita o recomendación. Los que llenan el formulario de la web se cargan solos.</p><?php endif; ?>
<?php if ($error): ?><p class="alerta" role="alert"><?= h($error) ?></p><?php endif; ?>
<form method="post" class="panel" id="fcli"><?= csrf_campo() ?><input type="hidden" name="id" value="<?= $id ?>">
  <div class="grid">
    <label>Nombre *<input name="nombre" value="<?= h($v['nombre']) ?>" required maxlength="120"></label>
    <label>Empresa<input name="empresa" value="<?= h($v['empresa']) ?>" maxlength="120"></label>
    <label>Teléfono o WhatsApp *<input name="telefono" type="tel" value="<?= h($v['telefono']) ?>" required maxlength="30"></label>
    <label>Correo<input name="correo" type="email" value="<?= h($v['correo']) ?>" maxlength="120"></label>
    <label>Tipo de consulta *<select name="tipo" id="ftipo" required><option value="">Elige una opción</option><?= $opts(TIPOS, (string)$v['tipo']) ?></select></label>
    <label>Departamento *<select name="ciudad" required><?= $opts(DEPTOS, (string)$v['ciudad']) ?></select></label>
    <label>¿Cómo llegó?<select name="fuente"><?= $opts(FUENTES, (string)$v['fuente']) ?></select></label>
    <label>Prioridad<select name="prioridad"><?php foreach (PRIORIDADES as $k => $t): ?><option value="<?= $k ?>"<?= $v['prioridad'] === $k ? ' selected' : '' ?>><?= $t ?></option><?php endforeach; ?></select></label>
    <label>Responsable<select name="asignado"><option value="">Sin asignar</option><?php foreach (usuarios_activos() as $us): ?><option value="<?= (int)$us['id'] ?>"<?= (int)$v['asignado'] === (int)$us['id'] ? ' selected' : '' ?>><?= h($us['nombre']) ?></option><?php endforeach; ?></select></label>
  </div>
  <?php foreach (CAMPOS as $g => $campos): ?>
    <fieldset class="grupo-crm" data-grupo="<?= $g ?>"><legend>Datos de <?= h(mb_strtolower(GRUPO_NOMBRE[$g])) ?></legend><div class="grid">
      <?php foreach ($campos as $k => $t): ?><label><?= h($t) ?><input name="<?= $k ?>" value="<?= h($datos[$k] ?? '') ?>"<?= in_array($k, NUMERICOS, true) ? ' type="number" step="any" min="0"' : '' ?>></label><?php endforeach; ?>
    </div></fieldset>
  <?php endforeach; ?>
  <label class="ancho">Detalle o mensaje<textarea name="mensaje" rows="4"><?= h($v['mensaje']) ?></textarea></label>
  <p><button class="btn" type="submit"><?= $lead ? 'Guardar cambios' : 'Crear cliente' ?></button></p>
</form>
<script>
(function () {
  var G = <?= json_encode(GRUPOS, JSON_UNESCAPED_UNICODE | JSON_HEX_TAG) ?>, sel = document.getElementById('ftipo');
  function sync() {
    var g = ''; for (var k in G) if (G[k].indexOf(sel.value) > -1) g = k;
    document.querySelectorAll('.grupo-crm').forEach(function (f) { var on = f.dataset.grupo === g; f.hidden = !on; f.querySelectorAll('input').forEach(function (i) { i.disabled = !on; }); });
  }
  sel.addEventListener('change', sync); sync();
})();
</script>
<?php pie();
