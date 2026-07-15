import { NextRequest, NextResponse } from "next/server";
import { searchCharities } from "@/lib/charities";
import { SAN_JOSE } from "@/lib/geo";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const q = params.get("q") ?? "";
  const radius = Number(params.get("radius") ?? 10) || 10;
  const causes = (params.get("causes") ?? "")
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);
  const verifiedOnly = params.get("verified") === "true";
  const latParam = params.get("lat");
  const lngParam = params.get("lng");
  const lat = latParam !== null ? Number(latParam) : NaN;
  const lng = lngParam !== null ? Number(lngParam) : NaN;
  const origin =
    Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : SAN_JOSE;

  const results = await searchCharities({ q, radius, causes, verifiedOnly, origin });

  return NextResponse.json({
    results,
    count: results.length,
    location: origin === SAN_JOSE ? SAN_JOSE.label : "your location",
  });
}
