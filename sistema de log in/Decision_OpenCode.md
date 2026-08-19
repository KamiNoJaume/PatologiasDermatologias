# Decisión de Arquitectura: Next.js + React + Prisma + PostgreSQL

## Contexto

Proyecto para una veterinaria que necesita:

- Sistema de login y sign up con verificación por email
- Landing page interactiva post-login
- Datos mostrados de forma dinámica e interactiva
- Futuras funcionalidades: búsqueda de medicamentos, patologías por zonas, demos de productos
- Escalabilidad a medio/largo plazo

---

## Opciones Evaluadas

### A) Express + EJS (HTML server-rendered)

- Páginas HTML puras renderizadas en servidor
- Baja interactividad sin recargas completas
- JS vanilla para cualquier dinámica
- Añadir features requiere rutas y partials manuales

### B) Next.js + React + Prisma + PostgreSQL (elegida)

- React para componentes interactivos
- Rutas protegidas nativas con middleware
- Navegación cliente-side sin recargas
- Escalable por arquitectura file-based routing

---

## Razones de la Decisión

| Necesidad del proyecto | Por qué Next.js/React |
|---|---|
| **Datos interactivos y dinámicos** | React maneja estado, filtros, búsquedas asíncronas y renderizado condicional sin recargar la página |
| **Búsqueda de medicamentos** | Search-as-you-type con debounce, resultados en tiempo real |
| **Patologías por zonas** | Tablas filtrables, gráficos, mapas interactivos — componentes React reutilizables |
| **Demos de productos** | Catálogo con filtros, paginación, vistas de detalle con navegación instantánea |
| **Crecimiento futuro** | File-based routing: añadir una sección nueva es crear un archivo `page.tsx` |
| **Autenticación** | NextAuth.js v5 integrado — sesiones server-side seguras + protección de rutas |

---

## Stack Tecnológico Final

| Capa | Tecnología |
|------|-----------|
| **Frontend** | Next.js 14 con App Router |
| **UI Components** | React + shadcn/ui |
| **Estilos** | Tailwind CSS |
| **Autenticación** | NextAuth.js v5 (Credentials provider: email + password) |
| **ORM** | Prisma |
| **Base de datos** | PostgreSQL 16 |
| **Validación** | Zod (formularios + API) |
| **Email** | Nodemailer / Resend (verificación, recuperación) |
| **Hosting** | Vercel / Railway |

---

## Ventajas frente a Express + EJS

| Aspecto | Express + EJS | Next.js + React |
|---------|--------------|-----------------|
| Interactividad | JS vanilla o recargas completas | React — reactivo, transiciones suaves |
| Añadir features | Rutas manuales, partials sueltos | `page.tsx` en carpeta nueva |
| Búsqueda dinámica | AJAX manual + manipular DOM | `useState` + `useEffect` + `fetch` |
| Velocidad percibida | Recarga completa por acción | Navegación cliente-side |
| TypeScript | Setup extra requerido | Nativo, tipado end-to-end con Prisma |
| Escalabilidad | Tiende a desordenarse | Componentes encapsulados y reutilizables |

---

## Conclusión

Express + EJS cubriría un caso simple de login + landing HTML estático, pero con búsquedas dinámicas, catálogos de medicamentos, patologías por zonas y demos interactivas de productos, **Next.js + React es la opción correcta desde el día 1**. La inversión inicial es marginalmente mayor y el retorno en escalabilidad, mantenibilidad y UX es muy superior para un proyecto con vocación de crecimiento.

---

*Documento generado como decisión de arquitectura para el proyecto de la veterinaria.*
