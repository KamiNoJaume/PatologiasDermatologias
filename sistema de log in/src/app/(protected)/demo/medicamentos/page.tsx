import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DemoMedicamentosPage() {
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
        <h2 className="text-3xl font-bold text-gray-900">
          Busqueda de Medicamentos
        </h2>
        <p className="mt-2 text-gray-600">
          Busca medicamentos veterinarios en tiempo real con filtros avanzados.
        </p>

        <div className="mt-8 rounded-xl bg-white p-8 shadow-md">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Buscar medicamento..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark">
              Buscar
            </button>
          </div>

          <div className="mt-8 space-y-4">
            {[
              { name: "Amoxicilina 250mg", category: "Antibiotico", stock: "En stock" },
              { name: "Prednisona 5mg", category: "Antiinflamatorio", stock: "En stock" },
              { name: "Metronidazol 500mg", category: "Antiparasitario", stock: "Agotado" },
              { name: "Fenbendazol 100mg", category: "Antiparasitario", stock: "En stock" },
              { name: "Enrofloxacina 50mg", category: "Antibiotico", stock: "En stock" },
            ].map((med) => (
              <div
                key={med.name}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
              >
                <div>
                  <p className="font-semibold text-gray-900">{med.name}</p>
                  <p className="text-sm text-gray-500">{med.category}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    med.stock === "En stock"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {med.stock}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
