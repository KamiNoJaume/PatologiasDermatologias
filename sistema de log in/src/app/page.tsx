import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  if (session) {
    redirect(
      process.env.NEXT_PUBLIC_EXTERNAL_PORTAL_URL || "/landing"
    );
  } else {
    redirect("/login");
  }
}
