import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "DermVet Pro — Acceso clínico",
  description: "Acceso seguro a DermVet Pro",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
