// Free geocoding via OpenStreetMap's Nominatim API -- no API key required.
// Used sparingly (once per charity signup/profile address edit, and once
// per manual "change location" search on the client), well within
// Nominatim's usage policy (max ~1 req/sec, no bulk use).
// https://operations.osmfoundation.org/policies/nominatim/

export type GeocodeResult = { lat: number; lng: number; label: string };

export async function geocodeAddress(query: string): Promise<GeocodeResult | null> {
  const q = query.trim();
  if (!q) return null;

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&addressdetails=0&q=${encodeURIComponent(
      q
    )}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "DonationLocation/1.0 (demo charity-search app)",
        Accept: "application/json",
      },
    });
    if (!res.ok) return null;

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;

    const first = data[0];
    const lat = Number(first.lat);
    const lng = Number(first.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

    return { lat, lng, label: first.display_name ?? q };
  } catch {
    return null;
  }
}

// Full street addresses often fail to resolve (typos, informal street
// names, placeholder text like "Address not yet provided"). Fall back to
// progressively less specific queries so a charity still lands in roughly
// the right place instead of silently keeping stale/default coordinates.
export async function geocodeAddressParts(parts: {
  street?: string;
  city: string;
  state: string;
  zip?: string;
}): Promise<GeocodeResult | null> {
  const attempts = [
    [parts.street, parts.city, parts.state, parts.zip],
    [parts.city, parts.state, parts.zip],
    [parts.city, parts.state],
  ]
    .map((fields) => fields.filter(Boolean).join(", "))
    .filter(Boolean);

  const uniqueAttempts = Array.from(new Set(attempts));

  for (let i = 0; i < uniqueAttempts.length; i++) {
    if (i > 0) await new Promise((r) => setTimeout(r, 1100)); // Nominatim: max ~1 req/sec
    const result = await geocodeAddress(uniqueAttempts[i]);
    if (result) return result;
  }
  return null;
}
