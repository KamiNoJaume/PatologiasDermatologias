import { auth } from "@/lib/auth";

export default auth((req) => {
  try {
    const { pathname } = req.nextUrl;
    const isLoggedIn = !!req.auth;

    const protectedRoutes = ["/landing", "/demo"];
    const isProtected = protectedRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (!isLoggedIn && isProtected) {
      const url = new URL("/login", req.url);
      url.searchParams.set("callbackUrl", pathname);
      return Response.redirect(url);
    }

    if (isLoggedIn && pathname === "/login") {
      return Response.redirect(new URL("/landing", req.url));
    }

    return;
  } catch (error) {
    console.error("Proxy error:", error);
    return Response.redirect(new URL("/login", req.url));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|legal).*)"],
};
