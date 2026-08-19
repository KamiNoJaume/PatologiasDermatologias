import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  }),
});

async function main() {
  const email = "test@vet.com";
  const password = "Test123!";

  const existing = await prisma.user.findUnique({ where: { email } });

  if (!existing) {
    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.user.create({
      data: {
        email,
        passwordHash,
        emailVerified: new Date(),
      },
    });
    console.log(`Usuario de prueba creado: ${email} / ${password}`);
  } else {
    console.log(`El usuario ${email} ya existe, no se crea de nuevo.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
