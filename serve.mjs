// Servidor local para revisar public_html/ como lo verá el hosting. Uso: node serve.mjs [puerto]
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
const root = join(import.meta.dirname, "public_html");
const port = Number(process.argv[2]) || 4300;
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".xml": "application/xml", ".txt": "text/plain", ".webmanifest": "application/manifest+json" };
createServer(async (req, res) => {
  let p = normalize(join(root, decodeURIComponent(new URL(req.url, "http://x").pathname)));
  if (!p.startsWith(root)) return res.writeHead(403).end();
  if ((await stat(p).catch(() => null))?.isDirectory()) p = join(p, "index.html");
  const body = await readFile(p).catch(() => null);
  if (body) res.writeHead(200, { "content-type": types[extname(p)] || "application/octet-stream" }).end(body);
  else res.writeHead(404, { "content-type": types[".html"] }).end(await readFile(join(root, "404.html")));
}).listen(port, () => console.log(`http://localhost:${port}`));
