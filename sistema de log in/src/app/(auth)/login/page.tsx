import { Suspense } from "react";
import { LoginForm } from "@/components/forms/LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Iniciar Sesion</h1>
          <p className="mt-2 text-sm text-gray-600">
            Accede a tu cuenta de Veterinaria
          </p>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
        <p className="text-center text-sm text-gray-600">
          No tienes cuenta?{" "}
          <Link
            href="/signup"
            className="font-semibold text-primary hover:text-primary-dark"
          >
            Registrate
          </Link>
        </p>
      </div>
    </div>
  );
}
