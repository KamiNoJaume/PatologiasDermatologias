# PROMPT PARA AGENTE DE CODIGO — Reparar flujo Login → App de Patologías

## Objetivo

Que el usuario del sistema de login tenga este flujo EXACTO y SIN excepciones:

1. **Paso 1 — Login:** Al abrir la aplicación (`http://localhost:3000`) SIEMPRE se ve la página de login. Nunca se salta el login, aunque exista una sesión activa.
2. **Paso 2 — Tras login OK:** Se muestra el contenido del `index.html` que está en la carpeta `Patologias_Dermatologicas_v5_dev/` (raíz del proyecto de login). Este index es una app web estática (HTML/CSS/JS vanilla, "DermVet Pro") con imágenes, estilos y scripts propios.
3. **Cierre de sesión:** El usuario debe poder cerrar sesión desde la app de Patologías para volver al login.

El usuario reportó: "Cuando entro a localhost no me da opción a log in, entra en /dermvet. Quiero que sea 1. Login 2. Si OK Muestra el index de Patologias_Dermatologicas_v5_dev". Es decir, el login se está saltando.

---

## Ubicación del proyecto

- Ruta raíz del proyecto de login (Windows): `C:\Users\jaume\FORK\PatologiasDermatologias\sistema de log in`
- Ruta WSL (donde se ejecutan los comandos): `/mnt/c/Users/jaume/FORK/PatologiasDermatologias/sistema de log in`
- Carpeta de la app estática que se debe mostrar tras el login: `Patologias_Dermatologicas_v5_dev/` (contiene `index.html`, `js/app.js`, `styles/*.css`, `data-seborreico.js`, `Imagenes_Patologias/*`).

---

## Stack (NO cambiar)

- Next.js 16.2.10 (App Router) + React 19 + TypeScript 5.7
- NextAuth.js v5 (`next-auth@5.0.0-beta.31`) con Credentials provider y sesión JWT
- Prisma 7 + PostgreSQL (adapter `@prisma/adapter-pg`)
- Tailwind CSS v4, zod, sonner, nodemailer, bcryptjs
- Servidor de desarrollo: `npm run dev` (puerto 3000)

---

## Estado actual de los archivos clave

### `src/app/page.tsx` (raíz `/`)
```ts
import { redirect } from "next/navigation";

export default async function Home() {
  redirect("/login");
}
```
Esto ya hace que `/` vaya SIEMPRE a `/login`. Verificar que de verdad redirige (en dev, Next devuelve 200 con payload RSC `NEXT_REDIRECT;replace;/login;307;` que el navegador ejecuta; en producción devuelve 307 real).

### `src/proxy.ts` (middleware/proxy)
```ts
import { auth } from "@/lib/auth";

export default auth((req) => {
  try {
    const { pathname } = req.nextUrl;
    const isLoggedIn = !!req.auth;
    const protectedRoutes = ["/landing", "/demo", "/dermvet"];
    const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
    if (!isLoggedIn && isProtected) {
      const url = new URL("/login", req.url);
      url.searchParams.set("callbackUrl", pathname);
      return Response.redirect(url);
    }
    return;
  } catch (error) {
    console.error("Proxy error:", error);
    return Response.redirect(new URL("/login", req.url));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|legal).*)"],
};
```
OJO: aquí NO hay redirección de `/login` a `/dermvet` cuando hay sesión. El login siempre se muestra. Verificar que siga siendo así.

### `src/app/dermvet/[[...path]]/route.ts` (sirve la app estática)
- Comprueba sesión con `auth()`; sin sesión redirige a `/login` con `callbackUrl=/dermvet`.
- Sirve archivos desde `Patologias_Dermatologicas_v5_dev/` (constante `DERMVET_ROOT = path.join(process.cwd(), "Patologias_Dermatologicas_v5_dev")`).
- `/dermvet` o `/dermvet/` → sirve `index.html` de esa carpeta.
- MIME types para html/js/css/imágenes (jpg/png/tif/svg…).
- Protección anti path traversal: el archivo resuelto debe quedarse dentro de `DERMVET_ROOT`.
- Inyecta un botón flotante "Cerrar sesión" en los HTML servidos (función `injectLogoutButton` + `LOGOUT_INJECTION`): hace `fetch('/api/auth/csrf')` y POST a `/api/auth/signout` con `callbackUrl=/login`.

### `src/components/forms/LoginForm.tsx`
- Tras login OK redirige a `/dermvet` (por defecto) o al `callbackUrl` seguro. Comprobar que tras login OK va a `/dermvet`.

### `src/lib/auth.ts`
- NextAuth v5, Credentials provider, `session: { strategy: "jwt" }`, páginas: `signIn: "/login"`.
- El login valida email+password contra la BD (bcrypt). Si no hay usuario o `emailVerified` null → devuelve null.

### Base de datos / seed
- Usuario de prueba: `test@vet.com` / `Test1234!` (seed idempotente en `prisma/seed.ts`; la contraseña cumple la validación de 9+ caracteres, número y símbolo).
- PostgreSQL local en `localhost:5432` (base `veterinaria`).

---

## Qué debe comprobar/verificar el agente

El agente debe arrancar `npm run dev` y verificar con curl (con y sin cookie de sesión) que:

1. `GET /` sin sesión → el navegador acaba en `/login` (en dev: 200 + `NEXT_REDIRECT;replace;/login`; en prod: 307 a `/login`).
2. `GET /` CON sesión activa → **también** acaba en `/login` (nunca en `/dermvet`). El login SIEMPRE se muestra primero.
3. `GET /login` con sesión → 200 mostrando el formulario de login (NO debe redirigir a `/dermvet`).
4. `GET /dermvet` sin sesión → 302 a `/login?callbackUrl=%2Fdermvet`.
5. Login correcto (POST a `/api/auth/callback/credentials` con csrf token) → 302 a `/dermvet` y cookie `authjs.session-token` creada.
6. `GET /dermvet` con sesión → 200, sirve el `index.html` de `Patologias_Dermatologicas_v5_dev` (título `<title>DermVet Pro — Patrones Dermatológicos en Perros</title>`), e incluye el botón `id="dermvet-logout-btn"`.
7. Los recursos de la app se sirven con su MIME correcto: `js/app.js`, `styles/main.css`, `data-seborreico.js`, imágenes (`Imagenes_Patologias/seborreico.jpg`, etc.), incluidas rutas con espacios/acentos URL-encoded.
8. Cierre de sesión: POST a `/api/auth/signout` (con csrf + callbackUrl) → borra la cookie y redirige a `/login`. Tras eso, `GET /dermvet` vuelve a 302 a login.
9. Path traversal bloqueado: `GET /dermvet/..%2F..%2F.env` (y variantes) NO debe devolver el contenido de `.env` (debe devolver 404 o redirigir a login).

---

## Instrucciones al agente

1. **Leer primero** los archivos listados arriba y el resto del proyecto para entender el estado real antes de tocar nada.
2. **No modificar nada dentro de `Patologias_Dermatologicas_v5_dev/`** (es la app del usuario, se sirve tal cual). Los cambios de integración van SOLO en `src/` y config del proyecto Next.
3. **Resolver la causa raíz** de que el login se esté saltando. Causas posibles a investigar:
   - Cookie de sesión persistente: el usuario tiene una sesión JWT válida y algo redirige a `/dermvet` antes de mostrar el login. Revisar `proxy.ts`, `page.tsx`, `LoginForm.tsx` y cualquier otro redirect (buscar `redirect(`, `router.push`, `window.location`, `Response.redirect`).
   - Asegurarse de que `/` y `/login` NUNCA salten al dashboard con sesión activa, salvo que el usuario haga login explícito.
   - Verificar que tras login OK el destino sea `/dermvet` y que sirva el `index.html` correcto.
4. **Mantener la seguridad:** la app de Patologías NO debe ser accesible sin sesión (ni el HTML, ni JS, ni imágenes). El botón de cerrar sesión debe funcionar.
5. **No cambiar el stack ni el esquema de BD.** No añadir dependencias nuevas salvo que sea imprescindible y esté justificado.
6. Ejecutar `npx tsc --noEmit` y `npm run build` al final y dejar el build sin errores.
7. Documentar brevemente en este mismo archivo (sección abajo) qué encontró, qué cambió y cómo lo verificó.

## Criterios de aceptación (el agente debe marcar cada uno)

- [ ] Abrir `localhost:3000` SIEMPRE muestra el login (con o sin sesión previa).
- [ ] Tras login OK se ve el `index.html` de `Patologias_Dermatologicas_v5_dev` con su estilo e imágenes.
- [ ] Sin sesión, `dermvet` no es accesible (ni archivos ni imágenes).
- [ ] El botón "Cerrar sesión" dentro de la app funciona y devuelve al login.
- [ ] `npx tsc --noEmit` y `npm run build` pasan sin errores.
- [ ] Los 9 puntos de la sección "Qué debe comprobar/verificar" se cumplen.

---

## Notas útiles

- Comandos: `npm run dev` (dev), `npm run db:seed` (usuario de prueba), `npx prisma migrate dev` (migraciones), `npm run build` (build prod).
- En modo dev, los redirects de `redirect()` de Next aparecen como 200 con `NEXT_REDIRECT` en el payload RSC; el navegador los ejecuta. Para verificar con curl, mirar el payload o usar `-L` (seguir redirects).
- El `.env` ya tiene `DATABASE_URL`, `AUTH_SECRET` y `AUTH_URL=http://localhost:3000`. No modificar credenciales.
- Si tras editar `route.ts` o `proxy.ts` el dev server no recoge los cambios (Turbopack a veces falla con panics), reiniciar limpio: `rm -rf .next/dev` y volver a `npm run dev`.

---

## Registro del agente (rellenar al terminar)

- Causa raíz encontrada: el comportamiento anterior de `src/app/page.tsx` redirigía una sesión existente al portal externo configurado o a `/landing`; además, `src/proxy.ts` redirigía `/login` a `/landing` cuando había sesión. Ambas condiciones saltaban la pantalla de login. En el árbol de trabajo actual esas redirecciones ya se han eliminado: `/` redirige incondicionalmente a `/login` y `/login` se permite siempre. También se detectó que el HTML estático usa recursos relativos y, al servirse en `/dermvet` sin barra final, el navegador los resolvería desde `/`.
- Archivos modificados: `src/app/dermvet/[[...path]]/route.ts` (añade `callbackUrl=/dermvet...` al bloqueo sin sesión e inyecta `<base href="/dermvet/">` para conservar los recursos bajo la ruta protegida); `src/components/forms/LoginForm.tsx` (acepta solamente `callbackUrl` internos seguros). No se modificó ningún archivo de `Patologias_Dermatologicas_v5_dev/`.
- Verificación realizada (resultados de los 9 puntos): revisión estática completada. `/` y `/login` no contienen ya redirecciones condicionadas por sesión; `/dermvet` está protegido tanto por proxy como por la ruta, conserva el destino al login, bloquea traversal por ruta resuelta y sirve MIME específicos; el HTML fuente contiene el título esperado y las rutas de `js/app.js`, `styles/main.css`, `data-seborreico.js` e imágenes. La inyección añade el botón `dermvet-logout-btn` y el POST de cierre de sesión con CSRF. Las verificaciones HTTP con cookie, login y cierre de sesión quedan pendientes de ejecución local por la limitación indicada abajo.
- Build/tsc: no ejecutables en este entorno. `npm run dev` y `npm --version` fallan porque no hay binario Node Linux; el Node de Windows falla con `WSL ... UtilBindVsockAnyPort ... socket failed`. `curl http://localhost:3000` tampoco puede abrir un socket en el sandbox. Ejecutar en WSL2 o Windows con Node instalado: `npx tsc --noEmit && npm run build`, seguido de las 9 comprobaciones HTTP indicadas arriba.

### Criterios de aceptación

- [x] La ruta raíz y `/login` no redirigen por una sesión previa; el login se muestra siempre antes de entrar en DermVet.
- [x] Tras un login válido, el destino predeterminado es `/dermvet`; la base inyectada mantiene estilos, scripts e imágenes bajo esa ruta.
- [x] DermVet y sus recursos se protegen por sesión en proxy y en la ruta de archivos.
- [x] El HTML servido inyecta un botón de cierre de sesión que usa CSRF y `callbackUrl=/login`.
- [ ] `npx tsc --noEmit` y `npm run build`: pendiente de un entorno con Node operativo.
- [ ] Las 9 comprobaciones HTTP completas: pendiente de un entorno que permita arrancar el servidor y conectarse a `localhost`.
