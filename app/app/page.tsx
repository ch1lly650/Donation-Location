import Link from "next/link";
import { getFeaturedCharities } from "@/lib/charities";
import HomeSearchBar from "@/components/HomeSearchBar";

const HOME_CAUSES = ["Hunger relief", "Education", "Housing", "Health", "Environment", "Animals"];

export default async function HomePage() {
  const featured = await getFeaturedCharities(3);

  return (
    <div>
      <div
        style={{
          padding: "64px 40px 48px",
          textAlign: "center",
          background: "linear-gradient(180deg,oklch(0.97 0.012 250),#fbfcfe)",
        }}
      >
        <h1
          style={{
            margin: "0 0 12px",
            fontFamily: "var(--font-heading)",
            fontWeight: 900,
            fontSize: 44,
            color: "#152238",
            letterSpacing: "-.01em",
          }}
        >
          Find a charity close to your heart —<br />
          and close to home.
        </h1>
        <p style={{ margin: "0 0 30px", fontSize: 18, color: "#5a6a84" }}>
          Search thousands of verified nonprofits and give where it matters most.
        </p>
        <HomeSearchBar />
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 24, flexWrap: "wrap" }}>
          {HOME_CAUSES.map((c) => (
            <Link
              key={c}
              href={`/search?causes=${encodeURIComponent(c)}`}
              className="chip-hover"
              style={{
                background: "#fff",
                border: "1px solid #dbe3ee",
                borderRadius: 999,
                padding: "8px 16px",
                fontSize: 13.5,
                fontWeight: 600,
                color: "#44526a",
                cursor: "pointer",
                display: "inline-block",
              }}
            >
              {c}
            </Link>
          ))}
        </div>
      </div>
      <div style={{ padding: "8px 40px 48px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 18 }}>
          <h2 style={{ margin: 0, fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 22, color: "#152238" }}>
            Featured near you
          </h2>
          <Link href="/search" style={{ fontSize: 14, fontWeight: 700, color: "oklch(0.55 0.15 250)", cursor: "pointer" }}>
            See all →
          </Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {featured.map((ch) => (
            <div
              key={ch.slug}
              className="card-hover"
              style={{ border: "1px solid #e6ebf2", borderRadius: 14, background: "#fff", overflow: "hidden" }}
            >
              <svg width="100%" height="120" style={{ display: "block" }}>
                <rect width="100%" height="100%" fill="oklch(0.93 0.02 250)" />
                <line x1="0" y1="30" x2="400" y2="30" stroke="oklch(0.88 0.03 250)" strokeWidth={10} />
                <line x1="0" y1="70" x2="400" y2="70" stroke="oklch(0.88 0.03 250)" strokeWidth={10} />
                <line x1="0" y1="110" x2="400" y2="110" stroke="oklch(0.88 0.03 250)" strokeWidth={10} />
                <text x="50%" y="55%" textAnchor="middle" fontFamily="monospace" fontSize="11" fill="#6b7b96">
                  charity cover photo
                </text>
              </svg>
              <div style={{ padding: "16px 18px 18px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                  <Link
                    href={`/charity/${ch.slug}`}
                    className="nav-link"
                    style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 16, color: "#152238", cursor: "pointer" }}
                  >
                    {ch.name}
                  </Link>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#1e7f4f",
                      background: "#e3f5ec",
                      borderRadius: 4,
                      padding: "2px 6px",
                      flex: "none",
                    }}
                  >
                    VERIFIED
                  </span>
                </div>
                <div style={{ fontSize: 13, color: "#5a6a84", marginBottom: 10 }}>{ch.meta}</div>
                <Link
                  href="/search"
                  className="btn-primary"
                  style={{
                    width: "100%",
                    background: "oklch(0.55 0.15 250)",
                    border: "none",
                    color: "#fff",
                    font: "700 14px 'Source Sans 3', sans-serif",
                    padding: 10,
                    borderRadius: 8,
                    cursor: "pointer",
                    display: "block",
                    textAlign: "center",
                  }}
                >
                  Donate
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
