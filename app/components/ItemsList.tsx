"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PledgeButton from "./PledgeButton";

const CATEGORIES = ["All", "Clothing", "Food", "Hygiene", "School supplies", "Household"];
const CONDITIONS = ["All", "New only", "New or used"];

type Item = {
  id: string;
  name: string;
  icon: string;
  category: string;
  condition: string;
  note: string;
  highNeed: boolean;
};

function chipStyle(active: boolean): React.CSSProperties {
  return {
    background: active ? "#152238" : "#fff",
    border: `1px solid ${active ? "#152238" : "#dbe3ee"}`,
    color: active ? "#ffffff" : "#44526a",
    borderRadius: 999,
    padding: "6px 13px",
    fontSize: 12.5,
    fontWeight: 700,
    cursor: "pointer",
  };
}

export default function ItemsList({
  items,
  loggedIn,
  pledgedItemIds,
  initialQuery,
  initialCategory,
  initialCondition,
}: {
  items: Item[];
  loggedIn: boolean;
  pledgedItemIds: string[];
  initialQuery: string;
  initialCategory: string;
  initialCondition: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [condition, setCondition] = useState(initialCondition);

  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    const params = new URLSearchParams();
    if (query.trim()) params.set("items_q", query.trim());
    if (category !== "All") params.set("category", category);
    if (condition !== "All") params.set("condition", condition);
    const qs = params.toString();
    router.replace(qs ? `?${qs}` : "?", { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, category, condition]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(
      (it) =>
        (category === "All" || it.category === category) &&
        (condition === "All" || it.condition === condition) &&
        (!q ||
          it.name.toLowerCase().includes(q) ||
          it.category.toLowerCase().includes(q) ||
          it.note.toLowerCase().includes(q))
    );
  }, [items, query, category, condition]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <h2 style={{ margin: 0, fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 20, color: "#152238" }}>
          Donations we&apos;re accepting
        </h2>
        <span style={{ fontSize: 13.5, color: "#5a6a84" }}>{filtered.length} items</span>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          background: "#fff",
          border: "1px solid #e6ebf2",
          borderRadius: 14,
          padding: "16px 18px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "#f2f5f9",
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
            placeholder="Search items (e.g. socks)…"
            style={{ flex: 1, border: "none", font: "600 14px 'Source Sans 3', sans-serif", color: "#152238", background: "transparent" }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".06em", color: "#8fa2bd", marginRight: 2 }}>CATEGORY</span>
          {CATEGORIES.map((c) => (
            <span key={c} onClick={() => setCategory(c)} style={chipStyle(category === c)}>
              {c}
            </span>
          ))}
          <span style={{ width: 1, height: 20, background: "#e6ebf2", margin: "0 6px" }} />
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".06em", color: "#8fa2bd", marginRight: 2 }}>CONDITION</span>
          {CONDITIONS.map((c) => (
            <span key={c} onClick={() => setCondition(c)} style={chipStyle(condition === c)}>
              {c}
            </span>
          ))}
        </div>
      </div>

      {filtered.map((it) => (
        <div
          key={it.id}
          className="item-row-hover"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            background: "#fff",
            border: "1px solid #e6ebf2",
            borderRadius: 12,
            padding: "14px 18px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: "oklch(0.93 0.02 250)",
              display: "grid",
              placeItems: "center",
              fontSize: 19,
              flex: "none",
            }}
          >
            {it.icon}
          </div>
          <div style={{ flex: 1, minWidth: 160 }}>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 15.5, color: "#152238" }}>{it.name}</div>
            <div style={{ fontSize: 12.5, color: "#8fa2bd", marginTop: 2 }}>{it.note}</div>
          </div>
          <span
            style={{
              fontSize: 11.5,
              fontWeight: 700,
              color: "#1c3557",
              background: "oklch(0.93 0.03 250)",
              borderRadius: 999,
              padding: "4px 11px",
              flex: "none",
            }}
          >
            {it.category}
          </span>
          <span
            style={{
              fontSize: 11.5,
              fontWeight: 700,
              color: it.condition === "New only" ? "#8a4a5e" : "#1e7f4f",
              background: it.condition === "New only" ? "#faeaef" : "#e3f5ec",
              borderRadius: 999,
              padding: "4px 11px",
              flex: "none",
            }}
          >
            {it.condition}
          </span>
          {it.highNeed && (
            <span
              style={{
                fontSize: 11.5,
                fontWeight: 700,
                color: "#8a5a00",
                background: "#fdf1dc",
                borderRadius: 999,
                padding: "4px 11px",
                flex: "none",
              }}
            >
              HIGH NEED
            </span>
          )}
          <PledgeButton itemId={it.id} loggedIn={loggedIn} initiallyPledged={pledgedItemIds.includes(it.id)} />
        </div>
      ))}

      {filtered.length === 0 && (
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
          No items match — try clearing the filters.
        </div>
      )}
    </div>
  );
}
