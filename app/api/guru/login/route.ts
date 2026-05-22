import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (
    email === process.env.TEACHER_EMAIL &&
    password === process.env.TEACHER_PASSWORD
  ) {
    const cookieStore = await cookies();
    cookieStore.set("guru_auth", "1", {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 8, // 8 hours
      sameSite: "lax",
    });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false }, { status: 401 });
}
