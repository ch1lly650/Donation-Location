import { NextRequest, NextResponse } from "next/server";
import { geocodeAddress } from "@/lib/geocode";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";
  if (!q.trim()) {
    return NextResponse.json({ error: "Missing q." }, { status: 400 });
  }

  const result = await geocodeAddress(q);
  if (!result) {
    return NextResponse.json(
      { error: "Couldn't find that location. Try a city, ZIP code, or full address." },
      { status: 404 }
    );
  }

  return NextResponse.json(result);
}
