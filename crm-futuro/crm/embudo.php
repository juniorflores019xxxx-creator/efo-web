<?php
declare(strict_types=1);
require __DIR__ . '/_lib.php';
requiere_login();

$grupo = texto_get('grupo', 20);
$w = ''; $p = [];
if ($grupo !== '' && array_key_exists($grupo, GRUPO_NOMBRE)) { $w = 'AND grupo = ?'; $p[] = $grupo; }
$col = [];
foreach (ESTADOS as $k => $t) {
  // Ganados y perdidos: solo los de los últimos 60 días, para que el tablero no se llene
  $extra = in_array($k, ['ganado', 'perdido'], true) ? "AND actualizado >= '" . date('Y-m-d', strtotime('-60 days')) . "'" : '';
  $col[$k] = q("SELECT * FROM leads WHERE estado = ? $extra $w ORDER BY CASE prioridad WHEN 'alta' THEN 0 WHEN 'media' THEN 1 ELSE 2 END, id DESC LIMIT 100", array_merge([$k], $p))->fetchAll();
}
$hoy = date('Y-m-d');
$mover = puede('editar');
cabecera('Embudo de ventas', 'embudo.php');
?>
<div class="titulo"><div><h1>Embudo de ventas</h1><p class="muted"><?= $mover ? 'Arrastra las tarjetas para cambiar la etapa. En el celular, usa el selector de cada tarjeta.' : 'Vista del avance de cada cliente.' ?></p></div>
  <form method="get" class="fila"><label class="sr" for="eg">Servicio</label><select id="eg" name="grupo" onchange="this.form.submit()"><option value="">Todos los servicios</option><?php foreach (GRUPO_NOMBRE as $k => $t): if ($k === '') continue; ?><option value="<?= $k ?>"<?= $grupo === $k ? ' selected' : '' ?>><?= h($t) ?></option><?php endforeach; ?></select><noscript><button class="btn" type="submit">Filtrar</button></noscript></form></div>
<p class="status-embudo" role="status" aria-live="polite"></p>
<div class="kanban" data-csrf="<?= h(csrf()) ?>">
  <?php foreach (ESTADOS as $k => $t): $suma = array_sum(array_map(fn($r) => (float)$r['valor'], $col[$k])); ?>
  <section class="kcol" data-estado="<?= $k ?>" aria-label="<?= h($t) ?>">
    <header class="e-<?= $k ?>"><b><?= h($t) ?></b><span class="kcount"><?= count($col[$k]) ?></span><?php if ($suma > 0): ?><small>Bs <?= bs($suma, 0) ?></small><?php endif; ?></header>
    <div class="kzona">
      <?php foreach ($col[$k] as $r): $venc = $r['proximo'] && $r['proximo'] < $hoy && !in_array($r['estado'], ['ganado', 'perdido'], true); ?>
        <article class="kcard p-borde-<?= h($r['prioridad']) ?>" data-id="<?= (int)$r['id'] ?>"<?= $mover ? ' draggable="true"' : '' ?>>
          <a href="ver.php?id=<?= (int)$r['id'] ?>"><span class="g-ico g-<?= h($r['grupo'] ?: 'general') ?>"><?= ico_grupo((string)$r['grupo']) ?></span><b><?= h($r['nombre']) ?></b></a>
          <small><?= h($r['empresa'] ?: $r['tipo']) ?> · <?= h($r['ciudad']) ?></small>
          <div class="kmeta">
            <?php if ((float)$r['valor'] > 0): ?><span class="valor">Bs <?= bs($r['valor'], 0) ?></span><?php endif; ?>
            <?php if ($r['proximo']): ?><span class="<?= $venc ? 'rojo' : '' ?>" title="Próximo seguimiento">📅 <?= date('d/m', strtotime($r['proximo'])) ?></span><?php endif; ?>
            <?php if ($r['asignado']): ?><span class="avatar mini" title="<?= h(nombre_usuario((int)$r['asignado'])) ?>"><?= h(mb_strtoupper(mb_substr(nombre_usuario((int)$r['asignado']), 0, 1))) ?></span><?php endif; ?>
          </div>
          <?php if ($mover): ?><label class="sr" for="m<?= (int)$r['id'] ?>">Mover a</label>
          <select class="kmover" id="m<?= (int)$r['id'] ?>"><?php foreach (ESTADOS as $k2 => $t2): ?><option value="<?= $k2 ?>"<?= $k2 === $k ? ' selected' : '' ?>><?= h($t2) ?></option><?php endforeach; ?></select><?php endif; ?>
        </article>
      <?php endforeach; ?>
      <?php if (!$col[$k]): ?><p class="kvacio">Sin clientes</p><?php endif; ?>
    </div>
  </section>
  <?php endforeach; ?>
</div>
<?php if ($mover): ?>
<script>
(function () {
  var tablero = document.querySelector('.kanban'), csrf = tablero.dataset.csrf, st = document.querySelector('.status-embudo'), arr = null;
  function contar() {
    tablero.querySelectorAll('.kcol').forEach(function (c) {
      var n = c.querySelectorAll('.kcard').length; c.querySelector('.kcount').textContent = n;
      var v = c.querySelector('.kvacio'); if (v) v.hidden = n > 0;
    });
  }
  function mover(card, estado) {
    var origen = card.closest('.kcol'), destino = tablero.querySelector('.kcol[data-estado="' + estado + '"]');
    if (!destino || origen === destino) return;
    destino.querySelector('.kzona').prepend(card); card.querySelector('.kmover').value = estado; contar();
    var fd = new FormData(); fd.append('csrf', csrf); fd.append('accion', 'estado'); fd.append('id', card.dataset.id); fd.append('estado', estado);
    fetch('accion.php', { method: 'POST', body: fd, credentials: 'same-origin' }).then(function (r) { return r.json(); }).then(function (j) {
      if (!j.ok) throw new Error(j.error || 'error');
      st.textContent = j.mensaje;
    }).catch(function () {
      origen.querySelector('.kzona').prepend(card); card.querySelector('.kmover').value = origen.dataset.estado; contar();
      st.textContent = 'No se pudo guardar el cambio. Recarga la página e intenta de nuevo.';
    });
  }
  tablero.addEventListener('dragstart', function (e) { var c = e.target.closest('.kcard'); if (!c) return; arr = c; c.classList.add('arrastrando'); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', c.dataset.id); });
  tablero.addEventListener('dragend', function () { if (arr) arr.classList.remove('arrastrando'); arr = null; tablero.querySelectorAll('.kcol').forEach(function (c) { c.classList.remove('sobre'); }); });
  tablero.addEventListener('dragover', function (e) { var c = e.target.closest('.kcol'); if (!c || !arr) return; e.preventDefault(); tablero.querySelectorAll('.kcol').forEach(function (x) { x.classList.toggle('sobre', x === c); }); });
  tablero.addEventListener('drop', function (e) { var c = e.target.closest('.kcol'); if (!c || !arr) return; e.preventDefault(); mover(arr, c.dataset.estado); });
  tablero.addEventListener('change', function (e) { if (e.target.classList.contains('kmover')) mover(e.target.closest('.kcard'), e.target.value); });
  contar();
})();
</script>
<?php endif; ?>
<?php pie();
