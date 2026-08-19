import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Enlace no valido
          </h1>
          <p className="mt-4 text-gray-600">
            No se ha proporcionado un token de verificacion.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block font-semibold text-primary hover:text-primary-dark"
          >
            Ir al login
          </Link>
        </div>
      </div>
    );
  }

  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!verificationToken || verificationToken.expires < new Date()) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg text-center">
          <h1 className="text-2xl font-bold text-red-600">Token expirado</h1>
          <p className="mt-4 text-gray-600">
            El enlace de verificacion no es valido o ha expirado.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block font-semibold text-primary hover:text-primary-dark"
          >
            Ir al login
          </Link>
        </div>
      </div>
    );
  }

  await prisma.user.update({
    where: { email: verificationToken.identifier },
    data: { emailVerified: new Date() },
  });

  await prisma.verificationToken.delete({
    where: { token },
  });

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg text-center">
        <h1 className="text-2xl font-bold text-green-600">
          Cuenta verificada
        </h1>
        <p className="mt-4 text-gray-600">
          Tu cuenta ha sido verificada correctamente. Ya puedes iniciar sesion.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block rounded-lg bg-primary px-6 py-2 font-semibold text-white hover:bg-primary-dark"
        >
          Iniciar sesion
        </Link>
      </div>
    </div>
  );
}
