"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <p className="text-7xl font-bold text-red-500">!</p>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Algo salio mal
        </h1>
        <p className="mt-2 text-gray-600">
          Ha ocurrido un error inesperado. Intenta de nuevo.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={reset}
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
          >
            Reintentar
          </button>
          <Link
            href="/"
            className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
