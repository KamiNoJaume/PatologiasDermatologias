import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DemoPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/landing" className="text-xl font-bold text-gray-900">
            Veterinaria
          </Link>
          <nav className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {session.user.name || session.user.email}
            </span>
            <Link
              href="/landing"
              className="text-sm font-semibold text-primary hover:text-primary-dark"
            >
              Volver al inicio
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900">Portal de Demos</h2>
        <p className="mt-2 text-gray-600">
          Selecciona una demo para explorar las funcionalidades.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Medicamentos",
              desc: "Busqueda y filtrado de medicamentos veterinarios en tiempo real.",
              href: "/demo/medicamentos",
            },
            {
              title: "Patologias",
              desc: "Explora patologias frecuentes por zona geografica.",
              href: "/demo/patologias",
            },
            {
              title: "Productos",
              desc: "Catalogo interactivo de productos veterinarios.",
              href: "/demo/productos",
            },
          ].map((demo) => (
            <Link
              key={demo.title}
              href={demo.href}
              className="rounded-xl bg-white p-6 shadow-md transition hover:shadow-lg"
            >
              <h3 className="text-lg font-semibold text-gray-900">
                {demo.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600">{demo.desc}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-primary">
                Explorar demo →
              </span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
