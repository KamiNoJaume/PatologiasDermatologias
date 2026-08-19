import { z } from "zod";

const passwordSchema = z
  .string()
  .min(9, "La contrasena debe tener al menos 9 caracteres")
  .regex(/[0-9]/, "Debe contener al menos un numero")
  .regex(/[^a-zA-Z0-9]/, "Debe contener al menos un caracter especial");

export const loginSchema = z.object({
  email: z.string().email("Email invalido"),
  password: z.string().min(1, "La contrasena es requerida"),
});

export const signupSchema = z.object({
  email: z.string().email("Email invalido"),
  password: passwordSchema,
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
