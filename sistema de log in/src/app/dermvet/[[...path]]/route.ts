import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { auth } from "@/lib/auth";

const DERMVET_ROOT = path.join(process.cwd(), "Patologias_Dermatologicas_v5_dev");

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".htm": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".tif": "image/tiff",
  ".tiff": "image/tiff",
  ".bmp": "image/bmp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
};

function mimeFor(filePath: string): string {
  return MIME_TYPES[path.extname(filePath).toLowerCase()] ?? "application/octet-stream";
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  const session = await auth();
  if (!session?.user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", new URL(request.url).pathname);
    return Response.redirect(loginUrl, 302);
  }

  const { path: segments = [] } = await params;
  const relative = path.join(...segments);
  const resolved = path.resolve(DERMVET_ROOT, relative);

  if (resolved !== DERMVET_ROOT && !resolved.startsWith(DERMVET_ROOT + path.sep)) {
    return new Response("Not found", { status: 404 });
  }

  let filePath = resolved;
  try {
    let fileStat = await stat(filePath);
    if (fileStat.isDirectory()) {
      filePath = path.join(filePath, "index.html");
      fileStat = await stat(filePath);
    }
    if (!fileStat.isFile()) {
      return new Response("Not found", { status: 404 });
    }
  } catch {
    return new Response("Not found", { status: 404 });
  }

  const body = await readFile(filePath);
  const isHtml = path.extname(filePath).toLowerCase() === ".html";
  const content = isHtml ? injectHtmlIntegration(body.toString("utf8")) : body;

  return new Response(content, {
    headers: {
      "Content-Type": mimeFor(filePath),
      "Cache-Control": "private, no-store",
    },
  });
}

const LOGOUT_INJECTION = `
<div id="dermvet-logout" style="position:fixed;top:12px;right:12px;z-index:99999;display:flex;gap:8px;align-items:center;">
  <button id="dermvet-logout-btn" style="background:#dc2626;color:#fff;border:none;border-radius:8px;padding:8px 14px;font:600 13px/1 'Plus Jakarta Sans',system-ui,sans-serif;cursor:pointer;box-shadow:0 2px 10px rgba(0,0,0,.25);">Cerrar sesión</button>
</div>
<script>
(function(){
  var btn=document.getElementById('dermvet-logout-btn');
  if(!btn) return;
  btn.addEventListener('click',function(){
    btn.disabled=true; btn.textContent='Cerrando...';
    fetch('/api/auth/csrf',{credentials:'same-origin'})
      .then(function(r){return r.json();})
      .then(function(d){
        var f=document.createElement('form');
        f.method='POST'; f.action='/api/auth/signout'; f.style.display='none';
        var i=document.createElement('input'); i.type='hidden'; i.name='csrfToken'; i.value=d.csrfToken;
        var c=document.createElement('input'); c.type='hidden'; c.name='callbackUrl'; c.value='/login';
        f.appendChild(i); f.appendChild(c);
        document.body.appendChild(f); f.submit();
      })
      .catch(function(){ btn.disabled=false; btn.textContent='Cerrar sesión'; });
  });
})();
</script>
`;

function injectHtmlIntegration(html: string): string {
  let integratedHtml = html;

  // The app is served at /dermvet without a trailing slash after login.  A
  // base URL keeps all of its relative scripts, styles and images under the
  // protected /dermvet route instead of resolving them from the site root.
  if (!integratedHtml.includes('<base href="/dermvet/">')) {
    integratedHtml = integratedHtml.replace(
      /<head(\s[^>]*)?>/i,
      (head) => `${head}\n<base href="/dermvet/">`
    );
  }

  if (integratedHtml.includes('id="dermvet-logout-btn"')) return integratedHtml;
  if (integratedHtml.includes("</body>")) {
    return integratedHtml.replace("</body>", `${LOGOUT_INJECTION}\n</body>`);
  }
  return integratedHtml + LOGOUT_INJECTION;
}
