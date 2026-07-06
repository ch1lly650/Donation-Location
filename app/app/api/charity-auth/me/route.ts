import { NextResponse } from "next/server";
import { getCurrentCharityAccount } from "@/lib/charityAuth";

export async function GET() {
  const account = await getCurrentCharityAccount();
  if (!account) return NextResponse.json({ charity: null });
  return NextResponse.json({
    charity: { slug: account.charity.slug, name: account.charity.name, email: account.email },
  });
}
