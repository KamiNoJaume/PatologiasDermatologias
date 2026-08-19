import { SignUpForm } from "@/components/forms/SignUpForm";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Crear Cuenta</h1>
          <p className="mt-2 text-sm text-gray-600">
            Registrate para acceder al portal
          </p>
        </div>
        <SignUpForm />
        <p className="text-center text-sm text-gray-600">
          Ya tienes cuenta?{" "}
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
