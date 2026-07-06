import { prisma } from "@/lib/db";

export function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function uniqueCharitySlug(name: string) {
  const base = slugify(name) || "charity";
  let slug = base;
  let suffix = 1;
  while (await prisma.charity.findUnique({ where: { slug } })) {
    suffix += 1;
    slug = `${base}-${suffix}`;
  }
  return slug;
}
