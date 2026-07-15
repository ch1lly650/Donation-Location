import { searchCharities } from "@/lib/charities";
import { getRandomAd } from "@/lib/ads";
import { SAN_JOSE } from "@/lib/geo";
import SearchPageClient from "@/components/SearchPageClient";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const get = (key: string) => {
    const v = sp[key];
    return Array.isArray(v) ? v[0] : v;
  };

  const q = get("q") ?? "";
  const radius = Number(get("radius") ?? 10) || 10;
  const causesParam = get("causes");
  const causes =
    causesParam === undefined
      ? []
      : causesParam.split(",").map((c) => c.trim()).filter(Boolean);
  const verifiedOnly = get("verified") === "true";
  const lat = Number(get("lat"));
  const lng = Number(get("lng"));
  const hasGeo = Number.isFinite(lat) && Number.isFinite(lng);
  const origin = hasGeo ? { lat, lng } : SAN_JOSE;
  const locLabel = get("loc");

  const results = await searchCharities({ q, radius, causes, verifiedOnly, origin });

  const inlineAd = await getRandomAd("inline");

  return (
    <SearchPageClient
      initialResults={results}
      initialQuery={q}
      initialRadius={radius}
      initialCauses={causes}
      initialVerifiedOnly={verifiedOnly}
      initialLocationLabel={locLabel ?? (hasGeo ? "your location" : SAN_JOSE.label)}
      initialLat={hasGeo ? lat : SAN_JOSE.lat}
      initialLng={hasGeo ? lng : SAN_JOSE.lng}
      inlineAd={inlineAd ? { label: inlineAd.label, text: inlineAd.text } : null}
    />
  );
}
