import { prisma } from "@/lib/db";

export type AdRow = {
  id: string;
  slot: string;
  label: string;
  text: string;
  ctaText: string | null;
  linkUrl: string | null;
};

export async function getRandomAd(slot: "banner" | "inline"): Promise<AdRow | null> {
  const rows = await prisma.$queryRaw<AdRow[]>`
    SELECT id, slot, label, text, ctaText, linkUrl
    FROM Ad
    WHERE slot = ${slot} AND active = 1
    ORDER BY RANDOM()
    LIMIT 1
  `;
  return rows[0] ?? null;
}
