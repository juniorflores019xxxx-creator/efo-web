// Arma el sitio estático de E.F.O. en public_html/ (lo que se sube a Hostinger).
// Uso: node build.mjs
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { layout, SITE } from "./src/layout.mjs";
import { PAGES } from "./src/pages.mjs";

const OUT = join(import.meta.dirname, "public_html");
const today = new Date().toISOString().slice(0, 10);

for (const p of PAGES) {
  const file = join(OUT, p.file);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, layout(p));
}

const indexables = PAGES.filter((p) => !p.noindex);
writeFileSync(join(OUT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexables.map((p) => `  <url><loc>${SITE.url}${p.path}</loc><lastmod>${today}</lastmod><priority>${p.path === "/" ? "1.0" : p.path === "/privacidad/" ? "0.3" : "0.8"}</priority></url>`).join("\n")}
</urlset>
`);

writeFileSync(join(OUT, "robots.txt"), `User-agent: *
Allow: /

Sitemap: ${SITE.url}/sitemap.xml
`);

writeFileSync(join(OUT, "site.webmanifest"), JSON.stringify({
  name: "E.F.O. Ltda. – Energía y Fuerza del Oriente",
  short_name: "E.F.O.",
  start_url: "/",
  display: "standalone",
  background_color: "#031F36",
  theme_color: "#063B66",
  icons: [
    { src: "/assets/img/favicon-192.png", sizes: "192x192", type: "image/png" },
    { src: "/assets/img/favicon-512.png", sizes: "512x512", type: "image/png" },
  ],
}, null, 2));

writeFileSync(join(OUT, ".htaccess"), `# E.F.O. Ltda. · reglas para Hostinger (Apache/LiteSpeed)
ErrorDocument 404 /404.html
Options -Indexes
DirectoryIndex index.html

<IfModule mod_rewrite.c>
  RewriteEngine On
  # Una sola dirección: https://efo.com.bo (www → sin www). HTTPS lo fuerza Cloudflare (Always Use HTTPS).
  RewriteCond %{HTTP_HOST} ^www\\.efo\\.com\\.bo$ [NC]
  RewriteRule ^(.*)$ https://efo.com.bo/$1 [R=301,L]
</IfModule>

<IfModule mod_headers.c>
  Header always set X-Content-Type-Options "nosniff"
  Header always set X-Frame-Options "SAMEORIGIN"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
  # Activar cuando HTTPS funcione de punta a punta (Cloudflare en Full strict):
  # Header always set Strict-Transport-Security "max-age=31536000"
</IfModule>

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript image/svg+xml application/xml text/plain application/manifest+json
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/html "access plus 0 seconds"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType image/webp "access plus 6 months"
  ExpiresByType image/png "access plus 6 months"
  ExpiresByType image/jpeg "access plus 6 months"
  ExpiresByType image/svg+xml "access plus 6 months"
</IfModule>
`);

console.log(`ok · ${PAGES.length} páginas en public_html/`);
