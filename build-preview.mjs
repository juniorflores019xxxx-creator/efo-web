// Vista previa para el cliente en GitHub Pages (https://juniorflores019xxxx-creator.github.io/efo-web/).
// Copia public_html/ a docs/ y antepone la ruta base a los enlaces internos.
// La vista previa no se indexa en Google: el sitio oficial será https://efo.com.bo.
// Uso: node build.mjs && node build-preview.mjs
import { cpSync, rmSync, readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join } from "node:path";

const BASE = "/efo-web";
const SRC = join(import.meta.dirname, "public_html");
const OUT = join(import.meta.dirname, "docs");

rmSync(OUT, { recursive: true, force: true });
cpSync(SRC, OUT, { recursive: true });
rmSync(join(OUT, ".htaccess"), { force: true });
writeFileSync(join(OUT, ".nojekyll"), "");
writeFileSync(join(OUT, "robots.txt"), "User-agent: *\nDisallow: /\n");
rmSync(join(OUT, "sitemap.xml"), { force: true });

const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
let n = 0;
for (const file of walk(OUT).filter((f) => f.endsWith(".html") || f.endsWith(".webmanifest"))) {
  let h = readFileSync(file, "utf8");
  h = h
    .replace(/(href|src|srcset|poster|data-src|data-src-sm|data-webm)="\/(?!\/)/g, `$1="${BASE}/`)
    .replace(/srcset="[^"]*"/g, (m) => m.replace(/, \/assets/g, `, ${BASE}/assets`))
    .replace(/"(src|start_url)": "\/(?!\/)/g, `"$1": "${BASE}/`)
    .replace(/<link rel="canonical"[^>]*>/, '<meta name="robots" content="noindex, nofollow">');
  writeFileSync(file, h);
  n++;
}
console.log(`vista previa: ${n} archivos en docs/ con base ${BASE}`);
