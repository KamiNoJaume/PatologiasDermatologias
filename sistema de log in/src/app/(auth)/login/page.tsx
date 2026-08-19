import { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "@/components/forms/LoginForm";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f3f6fb] font-[family:Inter,system-ui,sans-serif] text-slate-900">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_12%_15%,rgba(8,145,178,0.12),transparent_22rem),radial-gradient(circle_at_88%_85%,rgba(79,70,229,0.13),transparent_26rem)]"
      />

      <header className="relative z-10 border-b border-white/10 bg-gradient-to-br from-[#0b193c] to-[#1e3a8a] px-5 py-4 shadow-[0_4px_20px_rgba(11,25,60,0.25)] sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-gradient-to-br from-[#4f46e5] to-[#0891b2] text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]">
              <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v8M8 12h8" strokeLinecap="round" />
              </svg>
            </div>
            <div className="min-w-0 text-white">
              <p className="font-[family:'Plus_Jakarta_Sans',Inter,sans-serif] text-base font-extrabold tracking-tight sm:text-lg">
                DERMVET PRO
              </p>
              <p className="truncate text-xs font-medium text-white/75">
                Patrones dermatológicos en perros
              </p>
            </div>
          </div>
          <span className="hidden rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-white/80 sm:block">
            Acceso clínico
          </span>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-76px)] max-w-6xl items-center px-5 py-10 sm:px-8 lg:py-14">
        <div className="grid w-full overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.10)] lg:grid-cols-[1.05fr_0.95fr]">
          <section className="relative hidden overflow-hidden bg-gradient-to-br from-[#102552] via-[#1e3a8a] to-[#4f46e5] p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div aria-hidden="true" className="absolute -right-24 -top-24 size-72 rounded-full border border-white/10" />
            <div aria-hidden="true" className="absolute -bottom-28 -left-20 size-80 rounded-full border border-cyan-200/15" />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-200/25 bg-cyan-300/10 px-3 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.1em] text-cyan-100">
                <span className="size-1.5 rounded-full bg-cyan-300" />
                Terminal clínico
              </span>
              <h1 className="mt-7 max-w-sm font-[family:'Plus_Jakarta_Sans',Inter,sans-serif] text-4xl font-extrabold leading-[1.08] tracking-tight">
                Orientación dermatológica, con rigor clínico.
              </h1>
              <p className="mt-5 max-w-md text-sm leading-6 text-blue-100/85">
                Accede a la herramienta de apoyo para explorar patrones, pruebas y abordajes dermatológicos caninos.
              </p>
            </div>

            <div className="relative mt-12 grid gap-3">
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 p-3 backdrop-blur-sm">
                <span className="flex size-8 items-center justify-center rounded-lg bg-cyan-300/15 text-cyan-100">✓</span>
                <span className="text-sm font-medium text-white/90">Acceso protegido para profesionales</span>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 p-3 backdrop-blur-sm">
                <span className="flex size-8 items-center justify-center rounded-lg bg-indigo-300/20 text-indigo-100">+</span>
                <span className="text-sm font-medium text-white/90">Flujo clínico claro e interactivo</span>
              </div>
            </div>
          </section>

          <section className="flex min-h-[560px] items-center p-6 sm:p-10 lg:p-12">
            <div className="w-full">
              <div className="mb-8">
                <span className="inline-flex rounded-full border border-cyan-700/15 bg-cyan-700/5 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.1em] text-cyan-700">
                  Bienvenido de nuevo
                </span>
                <h2 className="mt-4 font-[family:'Plus_Jakarta_Sans',Inter,sans-serif] text-3xl font-extrabold tracking-tight text-slate-900">
                  Iniciar sesión
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Introduce tus credenciales para continuar a DermVet Pro.
                </p>
              </div>
              <Suspense>
                <LoginForm />
              </Suspense>
              <div className="mt-7 space-y-3 border-t border-slate-100 pt-6 text-center text-sm text-slate-500">
                <p>
                  ¿Olvidaste tu contraseña?{" "}
                  <Link href="/forgot-password" className="font-semibold text-[#4f46e5] transition hover:text-[#3730a3]">
                    Recuperarla
                  </Link>
                </p>
                <p>
                  ¿No tienes cuenta?{" "}
                  <Link href="/signup" className="font-semibold text-[#4f46e5] transition hover:text-[#3730a3]">
                    Regístrate
                  </Link>
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
