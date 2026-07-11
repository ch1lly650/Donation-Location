import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

// No example charities are seeded -- charities are created by charities
// themselves via /for-nonprofits. This script only manages ad content, and
// intentionally never touches Charity/WishlistItem/Pledge/User, since those
// now hold real data.
const ads = [
  {
    slot: "banner",
    label: "SPONSORED",
    text: "Double your impact this July — GiveWell Partners matches every first donation up to $100.",
    ctaText: "Learn more",
    linkUrl: "https://example.org/givewell-match",
    weight: 2,
  },
  {
    slot: "banner",
    label: "SPONSORED",
    text: "New: track every donation's impact in real time with the Donation Location mobile app.",
    ctaText: "Get the app",
    linkUrl: "https://example.org/mobile-app",
    weight: 1,
  },
  {
    slot: "inline",
    label: "PROMOTED",
    text: "Employers can match your gifts automatically. Check if yours participates →",
    ctaText: null,
    linkUrl: "https://example.org/employer-match",
    weight: 2,
  },
  {
    slot: "inline",
    label: "PROMOTED",
    text: "Set up a recurring monthly gift and 3x your yearly impact on the causes you love →",
    ctaText: null,
    linkUrl: "https://example.org/recurring-gift",
    weight: 1,
  },
];

async function main() {
  console.log("Seeding ads...");
  await prisma.ad.deleteMany();

  for (const ad of ads) {
    await prisma.ad.create({ data: ad });
  }

  console.log(`Seeded ${ads.length} ads.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
