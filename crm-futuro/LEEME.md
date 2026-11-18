# CRM y cotizador de E.F.O. (para una etapa futura)

Sistema completo y probado (PHP + SQLite) que **no se sube por ahora** a Hostinger: E.F.O. decidió empezar solo con el formulario que envía las solicitudes por correo y WhatsApp (`public_html/api/enviar.php`).

Incluye un panel con indicadores, un embudo kanban, las fichas de clientes con historial, tareas, usuarios con roles, un cotizador solar con las fórmulas del Excel de E.F.O., cotizaciones en PDF con membrete y copias de seguridad.

Para activarlo:

1. Copiar `crm/` a `public_html/crm/` y `api/lead.php` a `public_html/api/lead.php`.
2. En `public_html/assets/js/efo.js`, cambiar `apiUrl()` para que devuelva `/api/lead.php`.
3. Volver a poner en la política de privacidad y en la de cookies los textos del CRM (ver el historial de git, commit 3695d04).
4. Configurar `crm/_config.php` con el hash de la contraseña inicial (ver `_config.example.php`). El primer usuario es `admin`.

Proforma relacionada: SN-20261117-EFO (opción Profesional).
