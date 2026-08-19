"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validations";

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof ResetPasswordInput, string>>
  >({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    const data = {
      token,
      password: formData.get("password") as string,
    };

    const parsed = resetPasswordSchema.safeParse(data);
    if (!parsed.success) {
      const errors: Partial<Record<keyof ResetPasswordInput, string>> = {};
      parsed.error.issues.forEach((err) => {
        const field = err.path[0] as keyof ResetPasswordInput;
        errors[field] = err.message;
      });
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    const res = await fetch("/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });

    const json = await res.json();

    if (res.ok) {
      toast.success(json.message || "Contrasena actualizada");
      router.push("/login");
    } else {
      toast.error(json.error || "Error al restablecer la contrasena");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Nueva contrasena"
        name="password"
        type="password"
        placeholder="Minimo 9 caracteres, un numero y un simbolo"
        autoComplete="new-password"
        error={fieldErrors.password}
      />

      <Button type="submit" loading={loading}>
        Restablecer contrasena
      </Button>
    </form>
  );
}