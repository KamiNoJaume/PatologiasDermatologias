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
  const externalPortal = process.env.NEXT_PUBLIC_EXTERNAL_PORTAL_URL;
  const defaultRedirect = externalPortal || "/landing";

  function getSafeCallbackUrl(raw: string | null): string {
    if (!raw) return defaultRedirect;
    if (raw.startsWith("/")) return raw;
    if (externalPortal && raw.startsWith(externalPortal)) return raw;
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Email"
        name="email"
        type="email"
        placeholder="tu@email.com"
        autoComplete="email"
        error={fieldErrors.email}
      />

      <Input
        label="Contrasena"
        name="password"
        type="password"
        placeholder="Tu contrasena"
        autoComplete="current-password"
        error={fieldErrors.password}
      />

      <Button type="submit" loading={loading}>
        Iniciar sesion
      </Button>
    </form>
  );
}
