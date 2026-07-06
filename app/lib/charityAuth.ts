import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { prisma } from "@/lib/db";

const CHARITY_SESSION_COOKIE = "dl_charity_session";
const secretKey = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? "dev-only-insecure-secret"
);

export async function createCharitySessionCookie(charityAccountId: string) {
  const token = await new SignJWT({ charityAccountId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secretKey);

  const store = await cookies();
  store.set(CHARITY_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function destroyCharitySessionCookie() {
  const store = await cookies();
  store.delete(CHARITY_SESSION_COOKIE);
}

export async function getCurrentCharityAccount() {
  const store = await cookies();
  const token = store.get(CHARITY_SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secretKey);
    const charityAccountId = payload.charityAccountId as string;
    if (!charityAccountId) return null;
    return prisma.charityAccount.findUnique({
      where: { id: charityAccountId },
      include: { charity: true },
    });
  } catch {
    return null;
  }
}
