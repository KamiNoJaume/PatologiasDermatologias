"use client";

import Link from "next/link";

interface GdprConsentBannerProps {
  onAccept: () => void;
}

export function GdprConsentBanner({ onAccept }: GdprConsentBannerProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 pb-8">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4 text-primary"
            >
              <path
                fillRule="evenodd"
                d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900">
              Proteccion de Datos
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-gray-600">
              Tratamos tus datos personales conforme a la normativa de proteccion
              de datos (RGPD y LOPDGDD). Al registrarte consientes el tratamiento
              de tus datos segun nuestra{" "}
              <Link
                href="/legal/privacy"
                target="_blank"
                className="font-medium text-primary underline hover:text-primary-dark"
              >
                Politica de Privacidad
              </Link>
              , los{" "}
              <Link
                href="/legal/terms"
                target="_blank"
                className="font-medium text-primary underline hover:text-primary-dark"
              >
                Terminos y Condiciones
              </Link>{" "}
              y el{" "}
              <Link
                href="/legal/legal-notice"
                target="_blank"
                className="font-medium text-primary underline hover:text-primary-dark"
              >
                Aviso Legal
              </Link>
              .
            </p>
          </div>
        </div>
        <button
          onClick={onAccept}
          className="mt-4 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Aceptar y continuar
        </button>
      </div>
    </div>
  );
}
