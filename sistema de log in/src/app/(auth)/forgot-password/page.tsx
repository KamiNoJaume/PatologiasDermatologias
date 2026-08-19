import { Suspense } from "react";
import { ForgotPasswordForm } from "@/components/forms/ForgotPasswordForm";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Recuperar contrasena
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Introduce tu email y te enviaremos un enlace para restablecerla
          </p>
        </div>
        <Suspense>
          <ForgotPasswordForm />
        </Suspense>
        <p className="text-center text-sm text-gray-600">
          Recordaste tu contrasena?{" "}
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