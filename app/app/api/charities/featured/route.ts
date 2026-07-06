import { NextResponse } from "next/server";
import { getFeaturedCharities } from "@/lib/charities";

export async function GET() {
  const featured = await getFeaturedCharities(3);
  return NextResponse.json({ featured });
}
