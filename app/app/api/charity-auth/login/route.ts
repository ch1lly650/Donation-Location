import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/auth";
import { createCharitySessionCookie } from "@/lib/charityAuth";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 }
    );
  }

  const account = await prisma.charityAccount.findUnique({
    where: { email },
    include: { charity: true },
  });
  if (!account || !(await verifyPassword(password, account.passwordHash))) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  await createCharitySessionCookie(account.id);

  return NextResponse.json({ charity: { slug: account.charity.slug, name: account.charity.name } });
}
