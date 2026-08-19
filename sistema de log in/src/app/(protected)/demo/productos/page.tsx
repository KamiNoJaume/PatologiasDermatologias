import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DemoProductosPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/landing" className="text-xl font-bold text-gray-900">
            Veterinaria
          </Link>
          <Link
            href="/demo"
            className="text-sm font-semibold text-primary hover:text-primary-dark"
          >
            ← Volver a Demos
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900">Productos</h2>
        <p className="mt-2 text-gray-600">
          Catalogo interactivo de productos veterinarios.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              name: "Vacuna Polivalente V8",
              desc: "Proteccion contra 8 enfermedades caninas. Dosis unica anual.",
              price: "24.99",
            },
            {
              name: "Antiparasitario Spot-On",
              desc: "Pipeta mensual antipulgas y garrapatas para perros de 10-25kg.",
              price: "12.50",
            },
            {
              name: "Suplemento Articular",
              desc: "Glucosamina + condroitina para salud articular en perros senior.",
              price: "18.90",
            },
            {
              name: "Champu Dermatologico",
              desc: "Tratamiento topico para dermatitis y afecciones cutaneas.",
              price: "14.99",
            },
            {
              name: "Probiotico Digestivo",
              desc: "Restaurador de flora intestinal para perros y gatos.",
              price: "9.99",
            },
            {
              name: "Collar Antiparasitario",
              desc: "Proteccion continua durante 6 meses contra pulgas y garrapatas.",
              price: "19.99",
            },
          ].map((product) => (
            <div
              key={product.name}
              className="rounded-xl bg-white p-6 shadow-md transition hover:shadow-lg"
            >
              <h3 className="text-lg font-semibold text-gray-900">
                {product.name}
              </h3>
              <p className="mt-2 text-sm text-gray-600">{product.desc}</p>
              <p className="mt-4 text-xl font-bold text-primary">
                {product.price} EUR
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
