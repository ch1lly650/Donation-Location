import { NextResponse } from "next/server";
import { destroyCharitySessionCookie } from "@/lib/charityAuth";

export async function POST() {
  await destroyCharitySessionCookie();
  return NextResponse.json({ ok: true });
}
