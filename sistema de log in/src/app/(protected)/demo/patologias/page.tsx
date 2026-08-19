import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DemoPatologiasPage() {
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
          Patologias por Zona
        </h2>
        <p className="mt-2 text-gray-600">
          Explora las patologias veterinarias mas frecuentes segun la zona geografica.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { zone: "Zona Norte", pathologies: ["Brucelosis", "Tuberculosis bovina", "Fasciolosis"], count: 12 },
            { zone: "Zona Centro", pathologies: ["Leishmaniosis", "Ehrlichiosis", "Parvovirosis"], count: 18 },
            { zone: "Zona Sur", pathologies: ["Babesiosis", "Dirofilariosis", "Leptospirosis"], count: 15 },
          ].map((zone) => (
            <div key={zone.zone} className="rounded-xl bg-white p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900">{zone.zone}</h3>
              <p className="mt-1 text-sm text-gray-500">
                {zone.count} casos reportados
              </p>
              <ul className="mt-4 space-y-2">
                {zone.pathologies.map((p) => (
                  <li
                    key={p}
                    className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700"
                  >
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
