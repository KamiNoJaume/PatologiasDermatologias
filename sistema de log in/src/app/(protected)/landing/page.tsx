import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function LandingPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900">Veterinaria</h1>
          <nav className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {session.user.name || session.user.email}
            </span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button
                type="submit"
                className="rounded-lg bg-danger px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Cerrar sesion
              </button>
            </form>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-4 py-24 text-center">
          <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Bienvenido a Veterinaria
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            Plataforma de gestion veterinaria con busqueda de medicamentos,
            patologias por zona y demos interactivas de productos.
          </p>
          <Link
            href="/demo"
            className="mt-10 inline-block rounded-xl bg-primary px-10 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-primary-dark"
          >
            Ir a la Demo
          </Link>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              {
                title: "Busqueda de Medicamentos",
                desc: "Encuentra medicamentos con busqueda en tiempo real y filtros avanzados.",
              },
              {
                title: "Patologias por Zona",
                desc: "Visualiza patologias frecuentes segun la zona geografica.",
              },
              {
                title: "Demos de Productos",
                desc: "Explora demos interactivas de nuestros productos veterinarios.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl bg-white p-6 shadow-md"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-6 px-4 py-6 text-sm text-gray-600">
          <Link href="/legal/terms" className="hover:text-gray-900">
            Terminos
          </Link>
          <Link href="/legal/privacy" className="hover:text-gray-900">
            Privacidad
          </Link>
          <Link href="/legal/cookies" className="hover:text-gray-900">
            Cookies
          </Link>
          <Link href="/legal/legal-notice" className="hover:text-gray-900">
            Aviso Legal
          </Link>
        </div>
      </footer>
    </div>
  );
}
