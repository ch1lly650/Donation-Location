import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { milesBetween, SAN_JOSE } from "@/lib/geo";
import FollowButton from "@/components/FollowButton";
import DonateButton from "@/components/DonateButton";
import ItemsList from "@/components/ItemsList";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const charity = await prisma.charity.findUnique({ where: { slug } });
  return { title: charity ? `${charity.name} — Donation Location` : "Donation Location" };
}

export default async function CharityProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const get = (key: string) => {
    const v = sp[key];
    return Array.isArray(v) ? v[0] : v;
  };

  const charity = await prisma.charity.findUnique({
    where: { slug },
    include: { items: true },
  });
  if (!charity) notFound();

  const user = await getCurrentUser();
  const pledges = user
    ? await prisma.pledge.findMany({ where: { userId: user.id, charityId: charity.id } })
    : [];
  const pledgedItemIds = pledges.map((p) => p.itemId);

  const distanceMi = milesBetween(SAN_JOSE, { lat: charity.lat, lng: charity.lng });

  const badgeStyle = (bg: string, color: string): React.CSSProperties => ({
    fontSize: 10,
    fontWeight: 700,
    color,
    background: bg,
    borderRadius: 4,
    padding: "3px 7px",
  });

  return (
    <div style={{ background: "#f7f9fc", flex: 1 }}>
      <div style={{ position: "relative" }}>
        <svg width="100%" height="220" style={{ display: "block" }}>
          <rect width="100%" height="100%" fill="oklch(0.88 0.03 250)" />
          <line x1="0" y1="55" x2="1600" y2="55" stroke="oklch(0.82 0.04 250)" strokeWidth={18} />
          <line x1="0" y1="130" x2="1600" y2="130" stroke="oklch(0.82 0.04 250)" strokeWidth={18} />
          <line x1="0" y1="205" x2="1600" y2="205" stroke="oklch(0.82 0.04 250)" strokeWidth={18} />
          <text x="50%" y="50%" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="#5a6a84">
            charity cover photo
          </text>
        </svg>
        <div
          style={{
            position: "absolute",
            left: 40,
            bottom: -44,
            width: 112,
            height: 112,
            borderRadius: 24,
            background: "oklch(0.55 0.15 250)",
            border: "5px solid #fff",
            display: "grid",
            placeItems: "center",
            color: "#fff",
            fontFamily: "var(--font-heading)",
            fontWeight: 900,
            fontSize: 36,
            boxShadow: "0 8px 24px rgba(20,45,90,.18)",
          }}
        >
          {charity.logoInitial}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 24,
          padding: "56px 40px 24px 176px",
          background: "#fff",
          borderBottom: "1px solid #e6ebf2",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1, minWidth: 280 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <h1 style={{ margin: 0, fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 26, color: "#152238" }}>
              {charity.name}
            </h1>
            {charity.verified && <span style={badgeStyle("#e3f5ec", "#1e7f4f")}>VERIFIED</span>}
            {charity.is501c3 && <span style={badgeStyle("oklch(0.93 0.03 250)", "#1c3557")}>501(c)(3)</span>}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: "#5a6a84", marginTop: 8 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50% 50% 50% 0",
                background: "oklch(0.55 0.15 250)",
                transform: "rotate(-45deg)",
                flex: "none",
              }}
            />
            {charity.street}, {charity.city}, {charity.state} {charity.zip} · {distanceMi.toFixed(1)} mi from you
          </div>
          <div style={{ display: "flex", gap: 22, fontSize: 13.5, color: "#44526a", marginTop: 10, flexWrap: "wrap" }}>
            <span>
              <b style={{ color: "#152238" }}>★ {charity.rating.toFixed(1)}</b> ({charity.reviewCount} reviews)
            </span>
            <span>
              <b style={{ color: "#152238" }}>{charity.supportersCount.toLocaleString()}</b> supporters
            </span>
            <span>
              <b style={{ color: "#152238" }}>Since {charity.foundingYear}</b>
            </span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, flex: "none", paddingTop: 4 }}>
          <FollowButton />
          <DonateButton
            loggedIn={Boolean(user)}
            className="btn-primary"
            style={{
              background: "oklch(0.55 0.15 250)",
              border: "none",
              color: "#fff",
              font: "700 14px 'Source Sans 3', sans-serif",
              padding: "11px 24px",
              borderRadius: 999,
              cursor: "pointer",
            }}
          >
            Donate
          </DonateButton>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 24, padding: "24px 40px 44px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ background: "#fff", border: "1px solid #e6ebf2", borderRadius: 14, padding: 22 }}>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 15, color: "#152238", marginBottom: 10 }}>
              Our mission
            </div>
            <p style={{ margin: 0, fontSize: 14.5, color: "#44526a", lineHeight: 1.6 }}>{charity.bio}</p>
          </div>
          <div style={{ background: "#fff", border: "1px solid #e6ebf2", borderRadius: 14, padding: 22 }}>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 15, color: "#152238", marginBottom: 12 }}>
              Contact
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 14, color: "#44526a" }}>
              <div style={{ display: "flex", gap: 10 }}>
                <span style={{ color: "#8fa2bd", width: 56, flex: "none", fontWeight: 700, fontSize: 12.5 }}>PHONE</span>
                {charity.phone}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <span style={{ color: "#8fa2bd", width: 56, flex: "none", fontWeight: 700, fontSize: 12.5 }}>EMAIL</span>
                <a href={`mailto:${charity.email}`} style={{ color: "oklch(0.5 0.15 250)", fontWeight: 600 }}>
                  {charity.email}
                </a>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <span style={{ color: "#8fa2bd", width: 56, flex: "none", fontWeight: 700, fontSize: 12.5 }}>WEB</span>
                <a href={`https://${charity.website}`} target="_blank" rel="noopener noreferrer" style={{ color: "oklch(0.5 0.15 250)", fontWeight: 600 }}>
                  {charity.website}
                </a>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <span style={{ color: "#8fa2bd", width: 56, flex: "none", fontWeight: 700, fontSize: 12.5 }}>HOURS</span>
                {charity.hours}
              </div>
            </div>
          </div>
          <div style={{ background: "#fff", border: "1px solid #e6ebf2", borderRadius: 14, padding: 22 }}>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 15, color: "#152238", marginBottom: 12 }}>
              Drop-off location
            </div>
            <svg width="100%" height="130" style={{ display: "block", borderRadius: 10 }}>
              <rect width="100%" height="100%" fill="oklch(0.94 0.015 250)" />
              <line x1="60" y1="0" x2="60" y2="130" stroke="#fff" strokeWidth={8} />
              <line x1="180" y1="0" x2="180" y2="130" stroke="#fff" strokeWidth={12} />
              <line x1="0" y1="45" x2="340" y2="45" stroke="#fff" strokeWidth={8} />
              <line x1="0" y1="95" x2="340" y2="95" stroke="#fff" strokeWidth={10} />
              <text x="50%" y="55%" textAnchor="middle" fontFamily="monospace" fontSize="10" fill="#6b7b96">
                map
              </text>
            </svg>
          </div>
        </div>

        <ItemsList
          items={charity.items}
          loggedIn={Boolean(user)}
          pledgedItemIds={pledgedItemIds}
          initialQuery={get("items_q") ?? ""}
          initialCategory={get("category") ?? "All"}
          initialCondition={get("condition") ?? "All"}
        />
      </div>
    </div>
  );
}
