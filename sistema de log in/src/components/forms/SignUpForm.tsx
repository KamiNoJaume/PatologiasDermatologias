"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { signupSchema, type SignupInput } from "@/lib/validations";

export function SignUpForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof SignupInput, string>>
  >({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const parsed = signupSchema.safeParse(data);
    if (!parsed.success) {
      const errors: Partial<Record<keyof SignupInput, string>> = {};
      parsed.error.issues.forEach((err) => {
        const field = err.path[0] as keyof SignupInput;
        if (!errors[field]) errors[field] = err.message;
      });
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });

    if (res.ok) {
      toast.success("Cuenta creada correctamente");
      router.push("/login");
    } else {
      const json = await res.json();
      toast.error(json.error || "Error al crear la cuenta");
      setLoading(false);
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
      />

      <Input
        label="Contrasena"
        name="password"
        type="password"
        placeholder="Tu contrasena"
        autoComplete="new-password"
        error={fieldErrors.password}
      />

      <Button type="submit" loading={loading}>
        Crear cuenta
      </Button>
    </form>
  );
}
