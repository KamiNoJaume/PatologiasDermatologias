import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;

const hasRealSmtp =
  !!smtpHost && !!smtpUser && !!smtpPass && !smtpUser.includes("tu-") && smtpPass !== "tu-app-password";

function getTransporter() {
  if (hasRealSmtp) {
    return nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: false,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });
  }

  return nodemailer.createTransport({
    jsonTransport: true,
  });
}

async function sendMail(options: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  const transporter = getTransporter();
  const mail = await transporter.sendMail({
    from: `"Veterinaria" <${hasRealSmtp ? smtpUser : "no-reply@localhost"}>`,
    ...options,
  });

  if (!hasRealSmtp) {
    console.log("========================================");
    console.log("[EMAIL EN MODO DEV - no enviado]");
    console.log("Para:", options.to);
    console.log("Asunto:", options.subject);
    console.log("Contenido:");
    console.log(options.html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
    console.log("========================================");
  }
}

export async function sendPasswordResetEmail(
  email: string,
  token: string
): Promise<void> {
  const baseUrl = process.env.AUTH_URL || "http://localhost:3000";
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;

  await sendMail({
    to: email,
    subject: "Recupera tu contrasena",
    html: `
      <h1>Recupera tu contrasena</h1>
      <p>Has solicitado restablecer tu contrasena. Haz clic en el siguiente enlace para elegir una nueva:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>Este enlace expirara en 1 hora. Si no has solicitado este cambio, ignora este correo.</p>
    `,
  });
}