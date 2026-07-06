import { prisma } from "@/lib/db";

export default async function AdBanner() {
  const ads = await prisma.ad.findMany({ where: { slot: "banner", active: true } });
  if (ads.length === 0) return null;

  const ad = ads[Math.floor(Math.random() * ads.length)];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        background: "oklch(0.35 0.09 255)",
        color: "#fff",
        padding: "9px 20px",
        fontSize: 13.5,
        flexWrap: "wrap",
        textAlign: "center",
      }}
    >
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: ".08em",
          background: "rgba(255,255,255,.18)",
          borderRadius: 4,
          padding: "2px 7px",
        }}
      >
        {ad.label}
      </span>
      <span>{ad.text}</span>
      {ad.ctaText && (
        <a
          href={ad.linkUrl ?? "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="underline-link"
          style={{ color: "#fff", fontWeight: 700, textDecoration: "underline" }}
        >
          {ad.ctaText}
        </a>
      )}
    </div>
  );
}
