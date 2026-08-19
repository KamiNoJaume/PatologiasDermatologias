import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <p className="text-7xl font-bold text-primary">404</p>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Pagina no encontrada
        </h1>
        <p className="mt-2 text-gray-600">
          La pagina que buscas no existe o ha sido movida.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
