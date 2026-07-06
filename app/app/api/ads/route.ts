import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const slot = request.nextUrl.searchParams.get("slot") ?? "banner";

  const ads = await prisma.ad.findMany({ where: { slot, active: true } });
  if (ads.length === 0) {
    return NextResponse.json({ ad: null });
  }

  const totalWeight = ads.reduce((sum, a) => sum + a.weight, 0);
  let roll = Math.random() * totalWeight;
  let chosen = ads[0];
  for (const ad of ads) {
    if (roll < ad.weight) {
      chosen = ad;
      break;
    }
    roll -= ad.weight;
  }

  return NextResponse.json({ ad: chosen });
}
