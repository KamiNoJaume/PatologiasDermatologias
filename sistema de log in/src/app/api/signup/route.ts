import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { signupSchema } from "@/lib/validations";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";
    const limit = rateLimit(`signup:${ip}`, 10, 60_000);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes. Intentalo de nuevo mas tarde." },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((limit.resetAt - Date.now()) / 1000)),
          },
        }
      );
    }

    const body = await req.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos invalidos", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "El email ya esta registrado" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        email,
        passwordHash,
        emailVerified: new Date(),
      },
    });

    return NextResponse.json(
      { message: "Usuario registrado correctamente" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
