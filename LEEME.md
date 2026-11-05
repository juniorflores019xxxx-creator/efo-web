# Web de E.F.O. Ltda. (efo.com.bo)

Sitio estático en HTML, CSS y JavaScript, sin dependencias. La carpeta **`public_html/`** es exactamente lo que se sube a Hostinger.

## Estructura

- `public_html/`: el sitio listo para subir. Contiene `index.html` (portada), `empresa/`, `combustibles/`, `soluciones-energeticas/`, `electromovilidad/`, `proyectos/`, `contacto/`, `privacidad/`, `404.html`, `assets/`, `sitemap.xml`, `robots.txt`, `site.webmanifest` y `.htaccess`.
- `src/layout.mjs`: la plantilla común: encabezado, pie, íconos, formulario y datos de contacto.
- `src/pages.mjs`: el texto de cada página.
- `build.mjs`: arma las páginas en `public_html/`.
- `serve.mjs`: servidor para revisar el sitio en la computadora.

## Cambiar un texto

1. Edita `src/pages.mjs`. Los datos de contacto están en `src/layout.mjs`, en `SITE`.
2. Ejecuta `node build.mjs`.
3. Revisa los cambios con `node serve.mjs` y abre http://localhost:4300.

## Marcar un proyecto como ejecutado

En `src/pages.mjs`, lista `PROYECTOS`: cambia el sello `Proyecto conceptual` por `<span class="stamp real">Proyecto ejecutado</span>` y el campo «Estado». Usa fotos reales y datos confirmados.

## Publicar en Hostinger

1. En Hostinger, agrega `efo.com.bo` al sitio correcto y confirma que la raíz web sea `public_html/`.
2. Sube el **contenido** de la carpeta local `public_html/` (no la carpeta misma) a la raíz del sitio. `index.html` debe quedar directamente en esa raíz.
3. Comprueba primero que el servidor de origen entregue el sitio y tenga un certificado SSL válido para `efo.com.bo` y `www.efo.com.bo`.
4. En Cloudflare, usa SSL/TLS **Full (strict)** solo cuando el certificado del origen esté activo. Luego activa **Always Use HTTPS** y redirige `www.efo.com.bo` a `https://efo.com.bo`.
5. **No cambies** los registros de correo MX, SPF, DKIM, DMARC, `autodiscover` ni `autoconfig`.
6. Cuando HTTPS funcione de extremo a extremo, quita el `#` de la línea `Strict-Transport-Security` en `.htaccess`.
7. Registra el sitio en Google Search Console y envía `https://efo.com.bo/sitemap.xml`.

En la revisión del 5 de noviembre de 2026, el DNS estaba en Cloudflare (`cody` y `marge`), con el correo en Hostinger (MX `mx1`/`mx2.hostinger.com` y SPF). Por HTTP se veía la página aparcada de Hostinger y por HTTPS daba error 525: el dominio aún no estaba vinculado a un sitio del plan de hosting y el origen no tenía certificado. Antes de anunciar la web, confirma en Hostinger el dominio asignado, la raíz del sitio y el certificado del servidor de origen; conserva intactos los registros de correo.

## Pendiente con el cliente

- Saber qué proyectos están ejecutados, para cambiar su sello, y conseguir fotos reales.
- Las imágenes son ilustraciones generadas con IA y se recortaron para quitar texto y logos deformados. Conviene reemplazarlas por fotos reales.
- Los enlaces de Facebook, TikTok e Instagram están en el pie de página de todas las secciones.

## Vista previa para el cliente

- Enlace: https://juniorflores019xxxx-creator.github.io/efo-web/
- Se genera con `node build.mjs && node build-preview.mjs`, que copia el sitio a `docs/` con la ruta `/efo-web`. Luego se sube a GitHub con `git add -A && git commit && git push`.
- La vista previa no se indexa en Google (`noindex`). El sitio oficial será https://efo.com.bo.
