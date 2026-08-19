"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validations";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof ForgotPasswordInput, string>>
  >({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get("email") as string,
    };

    const parsed = forgotPasswordSchema.safeParse(data);
    if (!parsed.success) {
      const errors: Partial<Record<keyof ForgotPasswordInput, string>> = {};
      parsed.error.issues.forEach((err) => {
        const field = err.path[0] as keyof ForgotPasswordInput;
        errors[field] = err.message;
      });
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    const res = await fetch("/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });

    const json = await res.json();

    if (res.ok) {
      toast.success(json.message || "Solicitud procesada");
      router.push("/login");
    } else {
      toast.error(json.error || "Error al procesar la solicitud");
      setLoading(false);
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

      <Button type="submit" loading={loading}>
        Enviar enlace de recuperacion
      </Button>
    </form>
  );
}