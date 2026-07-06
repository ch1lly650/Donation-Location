"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ALL_CAUSES } from "@/lib/causes";

type Result = {
  slug: string;
  name: string;
  cause: string;
  verified: boolean;
  is501c3: boolean;
  rating: number;
  reviewCount: number;
  city: string;
  state: string;
  desc: string;
  dist: string;
  distanceMi: number;
  topMatch: boolean;
};

type InlineAd = {
  label: string;
  text: string;
} | null;

export default function SearchPageClient({
  initialResults,
  initialQuery,
  initialRadius,
  initialCauses,
  initialVerifiedOnly,
  initialLocationLabel,
  inlineAd,
}: {
  initialResults: Result[];
  initialQuery: string;
  initialRadius: number;
  initialCauses: string[];
  initialVerifiedOnly: boolean;
  initialLocationLabel: string;
  inlineAd: InlineAd;
}) {
  const router = useRouter();

  const [query, setQuery] = useState(initialQuery);
  const [radius, setRadius] = useState(initialRadius);
  const [selectedCauses, setSelectedCauses] = useState<string[]>(initialCauses);
  const [verifiedOnly, setVerifiedOnly] = useState(initialVerifiedOnly);
  const [results, setResults] = useState(initialResults);
  const [locationLabel] = useState(initialLocationLabel);

  const isFirstRun = useRef(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      params.set("radius", String(radius));
      params.set("causes", selectedCauses.join(","));
      params.set("verified", String(verifiedOnly));

      router.replace(`/search?${params.toString()}`, { scroll: false });

      const res = await fetch(`/api/charities?${params.toString()}`);
      const data = await res.json();
      setResults(data.results);
    }, 150);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, radius, selectedCauses, verifiedOnly]);

  function toggleCause(name: string) {
    setSelectedCauses((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  }

  function clearFilters() {
    setSelectedCauses([]);
    setRadius(50);
    setVerifiedOnly(false);
    setQuery("");
  }

  const labelStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: ".06em",
    color: "#8fa2bd",
    marginBottom: 10,
  };

  return (
    <div style={{ background: "#f7f9fc", flex: 1 }}>
      <div style={{ display: "grid", gridTemplateColumns: "250px 1fr", gap: 24, padding: "24px 32px 36px" }}>
        {/* Filter rail */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 22,
            background: "#fff",
            border: "1px solid #e6ebf2",
            borderRadius: 14,
            padding: 20,
            height: "fit-content",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 15, color: "#152238" }}>
              Filters
            </span>
            <span
              onClick={clearFilters}
              style={{ fontSize: 12.5, fontWeight: 700, color: "oklch(0.55 0.15 250)", cursor: "pointer" }}
            >
              Clear all
            </span>
          </div>
          <div>
            <div style={labelStyle}>DISTANCE</div>
            <input
              type="range"
              min={1}
              max={50}
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              style={{ width: "100%", accentColor: "oklch(0.55 0.15 250)" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#8fa2bd" }}>
              <span>0 mi</span>
              <span style={{ color: "#152238", fontWeight: 700 }}>{radius} mi</span>
              <span>50 mi</span>
            </div>
          </div>
          <div>
            <div style={labelStyle}>CAUSE</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9, fontSize: 14, color: "#44526a" }}>
              {ALL_CAUSES.map((name) => {
                const on = selectedCauses.includes(name);
                return (
                  <label
                    key={name}
                    onClick={() => toggleCause(name)}
                    style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer" }}
                  >
                    {on ? (
                      <span
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: 4,
                          background: "oklch(0.55 0.15 250)",
                          display: "grid",
                          placeItems: "center",
                          color: "#fff",
                          fontSize: 11,
                          fontWeight: 800,
                          flex: "none",
                        }}
                      >
                        ✓
                      </span>
                    ) : (
                      <span style={{ width: 16, height: 16, borderRadius: 4, border: "1.5px solid #c6d1e0", flex: "none" }} />
                    )}
                    {name}
                  </label>
                );
              })}
            </div>
          </div>
          <div>
            <div style={labelStyle}>VERIFICATION</div>
            <label
              onClick={() => setVerifiedOnly((v) => !v)}
              style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 14, color: "#44526a", cursor: "pointer" }}
            >
              {verifiedOnly ? (
                <span
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 4,
                    background: "oklch(0.55 0.15 250)",
                    display: "grid",
                    placeItems: "center",
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: 800,
                    flex: "none",
                  }}
                >
                  ✓
                </span>
              ) : (
                <span style={{ width: 16, height: 16, borderRadius: 4, border: "1.5px solid #c6d1e0", flex: "none" }} />
              )}
              Verified only
            </label>
          </div>
          <button
            className="btn-primary"
            style={{
              background: "oklch(0.55 0.15 250)",
              border: "none",
              color: "#fff",
              font: "700 14px 'Source Sans 3', sans-serif",
              padding: 11,
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Apply filters
          </button>
        </div>

        {/* Results column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                flex: 1,
                maxWidth: 560,
                minWidth: 240,
                background: "#fff",
                border: "1.5px solid #dbe3ee",
                borderRadius: 999,
                padding: "10px 18px",
              }}
            >
              <span style={{ width: 14, height: 14, border: "2px solid #8fa2bd", borderRadius: "50%", position: "relative", flex: "none" }}>
                <span
                  style={{
                    position: "absolute",
                    width: 2,
                    height: 6,
                    background: "#8fa2bd",
                    transform: "rotate(-45deg)",
                    right: -3,
                    bottom: -5,
                    borderRadius: 2,
                  }}
                />
              </span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search charities…"
                style={{ flex: 1, border: "none", font: "600 14.5px 'Source Sans 3', sans-serif", color: "#152238", background: "transparent" }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13.5, fontWeight: 600, color: "#44526a" }}>
              <span style={{ width: 10, height: 10, borderRadius: "50% 50% 50% 0", background: "oklch(0.55 0.15 250)", transform: "rotate(-45deg)" }} />
              {locationLabel}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span style={{ fontSize: 14.5, color: "#5a6a84" }}>
              <b style={{ color: "#152238" }}>{results.length} charities</b> within {radius} miles of {locationLabel}
            </span>
            <span
              style={{
                fontSize: 13.5,
                color: "#44526a",
                fontWeight: 600,
                border: "1px solid #dbe3ee",
                background: "#fff",
                borderRadius: 8,
                padding: "7px 12px",
                cursor: "pointer",
              }}
            >
              Sort: Closest first ▾
            </span>
          </div>
          {results.map((r) => (
            <div
              key={r.slug}
              className="result-card-hover"
              style={{ display: "flex", gap: 18, background: "#fff", border: "1px solid #e6ebf2", borderRadius: 14, padding: 18, flexWrap: "wrap" }}
            >
              <svg width="150" height="110" style={{ borderRadius: 10, flex: "none" }}>
                <rect width="100%" height="100%" fill="oklch(0.93 0.02 250)" />
                <line x1="0" y1="28" x2="150" y2="28" stroke="oklch(0.88 0.03 250)" strokeWidth={9} />
                <line x1="0" y1="60" x2="150" y2="60" stroke="oklch(0.88 0.03 250)" strokeWidth={9} />
                <line x1="0" y1="92" x2="150" y2="92" stroke="oklch(0.88 0.03 250)" strokeWidth={9} />
                <text x="50%" y="55%" textAnchor="middle" fontFamily="monospace" fontSize="10" fill="#6b7b96">
                  logo/photo
                </text>
              </svg>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <Link
                    href={`/charity/${r.slug}`}
                    className="nav-link"
                    style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 17, color: "#152238", cursor: "pointer" }}
                  >
                    {r.name}
                  </Link>
                  {r.verified && (
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#1e7f4f", background: "#e3f5ec", borderRadius: 4, padding: "2px 6px" }}>
                      VERIFIED
                    </span>
                  )}
                  {r.topMatch && (
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#8a5a00", background: "#fdf1dc", borderRadius: 4, padding: "2px 6px" }}>
                      TOP MATCH
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 13, color: "#5a6a84", margin: "5px 0 8px" }}>
                  {r.cause} · ★ {r.rating.toFixed(1)} ({r.reviewCount} reviews){r.is501c3 ? " · 501(c)(3)" : ""}
                </div>
                <div style={{ fontSize: 14, color: "#44526a", lineHeight: 1.5 }}>{r.desc}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "space-between", flex: "none" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#5a6a84" }}>{r.dist}</span>
                <Link
                  href="/auth?tab=signup"
                  className="btn-primary"
                  style={{
                    background: "oklch(0.55 0.15 250)",
                    border: "none",
                    color: "#fff",
                    font: "700 14px 'Source Sans 3', sans-serif",
                    padding: "10px 22px",
                    borderRadius: 8,
                    cursor: "pointer",
                    display: "inline-block",
                  }}
                >
                  Donate
                </Link>
              </div>
            </div>
          ))}
          {results.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: 36,
                color: "#8fa2bd",
                fontSize: 14.5,
                background: "#fff",
                border: "1px dashed #dbe3ee",
                borderRadius: 12,
              }}
            >
              No charities match — try clearing the filters.
            </div>
          )}
          {inlineAd && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                flexWrap: "wrap",
                background: "oklch(0.96 0.015 65)",
                border: "1px dashed oklch(0.8 0.06 65)",
                borderRadius: 14,
                padding: "14px 18px",
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: ".08em",
                  color: "#8a5a00",
                  background: "#fff",
                  borderRadius: 4,
                  padding: "3px 7px",
                }}
              >
                {inlineAd.label}
              </span>
              <span style={{ fontSize: 14, color: "#5c4a22" }}>{inlineAd.text}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
