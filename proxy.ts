import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const isGuruRoute =
    req.nextUrl.pathname.startsWith("/guru") &&
    !req.nextUrl.pathname.startsWith("/guru/login");

  if (isGuruRoute && !req.cookies.get("guru_auth")) {
    return NextResponse.redirect(new URL("/guru/login", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/guru/:path*"],
};
