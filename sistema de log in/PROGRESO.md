# Estado del Proyecto — Sistema de Login Veterinaria

## Stack y versiones

| Capa | Tecnologia | Version |
|------|-----------|---------|
| Framework | Next.js (App Router) | 16.2.10 |
| UI | React | 19.2.7 |
| Auth | NextAuth.js v5 (Credentials Provider) | 5.0.0-beta.31 |
| ORM | Prisma + pg adapter | 7.8.0 |
| DB | PostgreSQL | — |
| Estilos | Tailwind CSS v4 | 4.3.2 |
| Validacion | Zod | 4.4.3 |
| Toasts | sonner | — |
| Email | Nodemailer | 7.0.13 |
| Hash | bcryptjs | 3.0.3 |
| TypeScript | — | 5.7.x |

## Lo que ya funciona

- Build de Next.js compila sin errores (`npm run build`)
- `npm run dev` arranca el servidor de desarrollo
- `npx tsc --noEmit` pasa sin errores

### Paginas implementadas

| Ruta | Tipo | Descripcion |
|------|------|-------------|
| `/` | Dinamica | Redirect a `/login` o `/dermvet` segun sesion |
| `/login` | Estatica | Formulario login (email + password) con enlace de recuperacion |
| `/signup` | Estatica | Formulario registro (email + password) |
| `/forgot-password` | Estatica | Formulario solicitud de recuperacion de contrasena |
| `/reset-password` | Dinamica | Formulario nueva contrasena (valida token del email) |
| `/dermvet` | Dinamica | App de Patologias Dermatologicas (servida tras login, archivos protegidos) |
| `/verify-email` | Dinamica | Verificacion por token de email (sin flujo conectado) |
| `/landing` | Dinamica | Landing page protegida con portal a demo |
| `/demo` | Dinamica | Portal de demos (indice) |
| `/demo/medicamentos` | Dinamica | Busqueda de medicamentos |
| `/demo/patologias` | Dinamica | Patologias por zona |
| `/demo/productos` | Dinamica | Catalogo de productos |
| `/legal/terms` | Estatica | Terminos y Condiciones |
| `/legal/privacy` | Estatica | Politica de Privacidad |
| `/legal/cookies` | Estatica | Politica de Cookies |
| `/legal/legal-notice` | Estatica | Aviso Legal |
| `/api/auth/[...nextauth]` | API | NextAuth handlers |
| `/api/signup` | API | Registro (auto-verificado) + rate limiting |
| `/api/forgot-password` | API | Solicita enlace de recuperacion (email + token) |
| `/api/reset-password` | API | Cambia la contrasena validando el token |
| `not-found.tsx` | — | Pagina 404 personalizada |
| `error.tsx` | — | Error boundary global |
| `loading.tsx` (3 variantes) | — | Skeleton loaders (root, auth, protected) |

### Mejoras de UX implementadas

| Mejora | Descripcion |
|--------|-------------|
| **Toast notifications** (sonner) | Feedback visual de login/registro exitoso o fallido. Sustituye texto inline. |
| **Toggle mostrar/ocultar contraseña** | Icono de ojo en campos password para alternar visibilidad. SVG inline sin dependencias. |
| **Barra de fortaleza de contraseña** | Indicador visual en tiempo real (Debil/Aceptable/Buena/Fuerte) con colores y barra de progreso. |
| **Spinner animado en botones** | Icono de carga giratorio en botones durante envio de formularios. |
| **Skeleton loaders** | Placeholders animados en carga de paginas de auth y protected. |
| **Error boundary** | Pagina de error con boton de reintentar. |
| **Banner de consentimiento RGPD** | Overlay obligatorio antes del registro con enlaces a Privacidad, Terminos y Aviso Legal. Bloquea el formulario hasta aceptar. |

### Flujo de autenticacion

1. Usuario llega a `/` → redirect a `/login` (sin sesion) o a `/dermvet` (con sesion)
2. Sin cuenta → `/signup` → POST `/api/signup` → usuario creado y auto-verificado
3. Login con credenciales → NextAuth crea JWT → redirect a `/dermvet` (app de Patologias)
4. Proxy (`src/proxy.ts`) protege `/dermvet`, `/landing` y `/demo/*`
5. Olvido de contrasena → `/forgot-password` → email con enlace (en dev se imprime en consola) → `/reset-password?token=...` → nueva contrasena

### Esquema Prisma

Modelos: `User`, `Account`, `Session`, `VerificationToken` (reutilizado para los tokens de reseteo de contrasena). Migracion base regenerada y limpia (`20260819124459_init`).

### Seed — Usuario de prueba

Para no tener que crear usuarios manualmente cada vez, existe un seed con un usuario pre-creado y verificado:

| Campo | Valor |
|-------|-------|
| Email | `test@vet.com` |
| Password | `Test1234!` |
| Verificado | Si (emailVerified) |

El seed es idempotente: solo crea el usuario si no existe.

## App de Patologias (DermVet) tras el login

Tras login OK se muestra la app de Patologias Dermatologicas que vive en la carpeta `Patologias_Dermatologicas_v5_dev/` (HTML/CSS/JS vanilla). Se sirve directamente desde esa carpeta a traves de la ruta protegida `src/app/dermvet/[[...path]]/route.ts`:

- Comprueba sesion con `auth()`; sin sesion redirige a `/login`.
- Sirve cualquier archivo de la carpeta (html, js, css, imagenes) con su MIME correcto.
- Protegido contra path traversal (`..` nunca sale de la carpeta).
- Sin sesion no se accede ni a los archivos ni a las imagenes.
- **Importante:** se sirve desde la carpeta original, asi que cualquier cambio en `Patologias_Dermatologicas_v5_dev/index.html`, `js/app.js`, `styles/` o `data-seborreico.js` se refleja inmediatamente tras el login.

## Configuracion de email (recuperacion de contrasena)

- En modo desarrollo (sin SMTP real configurado en `.env`), los emails se imprimen por consola con el enlace de reseteo (JSON transport de nodemailer).
- En produccion se usan las variables `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`.

## Lo que falta

### Critico (antes de produccion)
- [x] PostgreSQL corriendo y `DATABASE_URL` configurada en `.env`
- [x] `npx prisma migrate dev` para crear las tablas en la DB (migracion base limpia)
- [x] Usuario de prueba en BD (seed: `test@vet.com` / `Test1234!`)
- [x] Recuperacion de contrasena (forgot/reset password)
- [ ] Generar `AUTH_SECRET` real: `npx auth secret` o `openssl rand -base64 32`
- [ ] Configurar SMTP real en `.env` (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS) para produccion
- [ ] Definir `AUTH_URL` con el dominio real (ahora `http://localhost:3000`)

### Mejoras pendientes
- [ ] Pagina de perfil con opcion "Eliminar cuenta" (derecho al olvido)
- [ ] Account lockout con backoff exponencial
- [ ] Migrar rate limiter a Redis (en memoria no escala horizontalmente)
- [ ] Content-Security-Policy header
- [ ] Banner de cookies funcional (actualmente solo pagina de texto legal)
- [ ] CSS responsive completo (ahora es funcional pero basico)

### Notas tecnicas

- **Prisma 7** requiere el adapter `@prisma/adapter-pg` y `prisma.config.ts`. No se usa `url` en `schema.prisma`.
- **Zod v4** usa `.issues` en vez de `.errors` para acceder a los errores de validacion.
- **Tailwind v4** usa `@tailwindcss/postcss` y `@import "tailwindcss"` en CSS. No usa `tailwind.config.ts`.
- **Next.js 16** muestra warning de que `middleware.ts` esta deprecado a favor de `proxy.ts`, pero aun funciona.
- **NextAuth v5** con JWT strategy: `adapter: PrismaAdapter(prisma)` + `session: { strategy: "jwt" }`.
- **TypeScript 7.0.x** tiene incompatibilidades con Zod v4 y Next.js 16. Se usa TypeScript 5.7.x.
- **Icons** (ojo, ojo tachado, spinner) son componentes SVG inline en `src/components/ui/Icons.tsx`. Sin dependencias externas.

## Comandos utiles

```bash
# Desarrollo
npm run dev

# Build produccion
npm run build

# Base de datos
npm run db:migrate       # crear/actualizar tablas
npm run db:seed          # crear usuario de prueba (test@vet.com / Test1234!)
npm run db:setup         # migrar + seed en un paso

# TypeScript check
npx tsc --noEmit
```

> **Nota:** los scripts que usan `tsx` necesitan el flag `--env-file=.env` para cargar `DATABASE_URL`.
