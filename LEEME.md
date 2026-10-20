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

1. Sube el **contenido** de `public_html/` (no la carpeta) a `public_html/` del hosting. `index.html` debe quedar en la raíz.
2. En Cloudflare **no** toques los registros MX, SPF, DKIM, DMARC, autodiscover ni autoconfig.
3. Cuando el certificado SSL del hosting esté activo, configura SSL/TLS en **Full (strict)** y activa **Always Use HTTPS**. Después, quita el `#` de la línea `Strict-Transport-Security` en `.htaccess`.
4. Registra el sitio en Google Search Console y envía `https://efo.com.bo/sitemap.xml`.

## Pendiente con el cliente

- Saber qué proyectos están ejecutados, para cambiar su sello, y conseguir fotos reales.
- Las imágenes son ilustraciones generadas con IA y se recortaron para quitar texto y logos deformados. Conviene reemplazarlas por fotos reales.
- Habilitar las redes sociales cuando existan.

## Vista previa para el cliente

- Enlace: https://juniorflores019xxxx-creator.github.io/efo-web/
- Se genera con `node build.mjs && node build-preview.mjs`, que copia el sitio a `docs/` con la ruta `/efo-web`. Luego se sube a GitHub con `git add -A && git commit && git push`.
- La vista previa no se indexa en Google (`noindex`). El sitio oficial será https://efo.com.bo.
