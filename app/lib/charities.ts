import { prisma } from "@/lib/db";
import { milesBetween, SAN_JOSE } from "@/lib/geo";

export async function getFeaturedCharities(limit = 3) {
  const charities = await prisma.charity.findMany();

  return charities
    .map((c) => ({ ...c, distanceMi: milesBetween(SAN_JOSE, { lat: c.lat, lng: c.lng }) }))
    .sort((a, b) => a.distanceMi - b.distanceMi)
    .slice(0, limit)
    .map((c) => ({
      slug: c.slug,
      name: c.name,
      verified: c.verified,
      meta: `${c.cause} · ${c.distanceMi.toFixed(1)} mi away · ${c.city}, ${c.state}`,
    }));
}

export type SearchFilters = {
  q?: string;
  radius?: number;
  causes?: string[];
  verifiedOnly?: boolean;
  origin?: { lat: number; lng: number };
};

export async function searchCharities(filters: SearchFilters) {
  const {
    q = "",
    radius = 10,
    causes = [],
    verifiedOnly = false,
    origin = SAN_JOSE,
  } = filters;
  const query = q.trim().toLowerCase();

  const charities = await prisma.charity.findMany();

  const withDistance = charities.map((c) => ({
    ...c,
    distanceMi: milesBetween(origin, { lat: c.lat, lng: c.lng }),
  }));

  const filtered = withDistance.filter((c) => {
    if (c.distanceMi > radius) return false;
    if (causes.length > 0 && !causes.includes(c.cause)) return false;
    if (verifiedOnly && !c.verified) return false;
    if (
      query &&
      !c.name.toLowerCase().includes(query) &&
      !c.cause.toLowerCase().includes(query) &&
      !c.bio.toLowerCase().includes(query) &&
      !c.city.toLowerCase().includes(query)
    ) {
      return false;
    }
    return true;
  });

  filtered.sort((a, b) => a.distanceMi - b.distanceMi);

  return filtered.map((c, i) => ({
    slug: c.slug,
    name: c.name,
    cause: c.cause,
    verified: c.verified,
    is501c3: c.is501c3,
    rating: c.rating,
    reviewCount: c.reviewCount,
    city: c.city,
    state: c.state,
    logoInitial: c.logoInitial,
    desc: c.bio,
    dist: `${c.distanceMi.toFixed(1)} mi`,
    distanceMi: c.distanceMi,
    topMatch: i === 0,
  }));
}
