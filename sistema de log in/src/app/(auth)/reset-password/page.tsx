import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/forms/ResetPasswordForm";
import Link from "next/link";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg text-center">
          <h1 className="text-2xl font-bold text-gray-900">Enlace no valido</h1>
          <p className="mt-4 text-gray-600">
            No se ha proporcionado un token de recuperacion.
          </p>
          <Link
            href="/forgot-password"
            className="mt-6 inline-block font-semibold text-primary hover:text-primary-dark"
          >
            Solicitar un nuevo enlace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Nueva contrasena
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Elige una nueva contrasena para tu cuenta
          </p>
        </div>
        <Suspense>
          <ResetPasswordForm token={token} />
        </Suspense>
        <p className="text-center text-sm text-gray-600">
          Ya la recordaste?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary hover:text-primary-dark"
          >
            Inicia sesion
          </Link>
        </p>
      </div>
    </div>
  );
}