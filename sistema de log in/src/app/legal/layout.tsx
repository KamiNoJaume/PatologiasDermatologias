import Link from "next/link";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Veterinaria
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-16">
        <article className="prose prose-gray max-w-none">{children}</article>
      </main>
    </div>
  );
}
