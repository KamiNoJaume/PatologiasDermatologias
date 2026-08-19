import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(
  email: string,
  token: string
): Promise<void> {
  const baseUrl = process.env.AUTH_URL || "http://localhost:3000";
  const verificationUrl = `${baseUrl}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `"Veterinaria" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Verifica tu cuenta",
    html: `
      <h1>Verifica tu cuenta</h1>
      <p>Gracias por registrarte. Haz clic en el siguiente enlace para verificar tu cuenta:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
      <p>Este enlace expirara en 24 horas.</p>
    `,
  });
}
