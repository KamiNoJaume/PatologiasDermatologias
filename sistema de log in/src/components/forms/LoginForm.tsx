"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { loginSchema, type LoginInput } from "@/lib/validations";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRedirect = "/dermvet";

  function getSafeCallbackUrl(raw: string | null): string {
    if (!raw) return defaultRedirect;
    if (raw.startsWith("/") && !raw.startsWith("//") && !raw.includes("\\")) {
      return raw;
    }
    return defaultRedirect;
  }

  const callbackUrl = getSafeCallbackUrl(searchParams.get("callbackUrl"));

  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof LoginInput, string>>
  >({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const parsed = loginSchema.safeParse(data);
    if (!parsed.success) {
      const errors: Partial<Record<keyof LoginInput, string>> = {};
      parsed.error.issues.forEach((err) => {
        const field = err.path[0] as keyof LoginInput;
        errors[field] = err.message;
      });
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      toast.error("Email o contrasena incorrectos");
      setLoading(false);
    } else {
      toast.success("Inicio de sesion correcto");
      if (callbackUrl.startsWith("/")) {
        router.push(callbackUrl);
      } else {
        window.location.href = callbackUrl;
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="Email"
        name="email"
        type="email"
        placeholder="tu@email.com"
        autoComplete="email"
        error={fieldErrors.email}
        className="rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 hover:border-slate-300 focus:border-[#4f46e5] focus:ring-[#4f46e5]/20"
      />

      <Input
        label="Contraseña"
        name="password"
        type="password"
        placeholder="Tu contraseña"
        autoComplete="current-password"
        error={fieldErrors.password}
        className="rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 hover:border-slate-300 focus:border-[#4f46e5] focus:ring-[#4f46e5]/20"
      />

      <Button
        type="submit"
        loading={loading}
        className="mt-2 rounded-xl bg-[#4f46e5] py-3 text-[0.9rem] shadow-[0_8px_18px_rgba(79,70,229,0.22)] hover:bg-[#4338ca] focus:ring-[#4f46e5]"
      >
        Entrar en DermVet Pro
      </Button>
    </form>
  );
}
