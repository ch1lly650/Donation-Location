"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomeSearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function goSearch(extra?: Record<string, string>) {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (extra) {
      for (const [k, v] of Object.entries(extra)) params.set(k, v);
    }
    router.push(`/search${params.toString() ? `?${params.toString()}` : ""}`);
  }

  function handleNearMe() {
    if (!navigator.geolocation) {
      goSearch();
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        goSearch({
          lat: String(pos.coords.latitude),
          lng: String(pos.coords.longitude),
        });
      },
      () => goSearch(),
      { timeout: 5000 }
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        maxWidth: 720,
        margin: "0 auto",
        background: "#fff",
        border: "2px solid oklch(0.55 0.15 250)",
        borderRadius: 999,
        boxShadow: "0 8px 28px rgba(30,70,140,.12)",
        overflow: "hidden",
      }}
    >
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") goSearch();
        }}
        placeholder="Search charities, causes, or keywords…"
        style={{
          flex: 1,
          border: "none",
          padding: "16px 24px",
          font: "16px 'Source Sans 3', sans-serif",
          color: "#152238",
          background: "transparent",
          minWidth: 0,
        }}
      />
      <div style={{ width: 1, height: 30, background: "#e0e6ef" }} />
      <div
        onClick={handleNearMe}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "16px 20px",
          color: "#44526a",
          fontSize: 15,
          fontWeight: 600,
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        <span
          style={{
            width: 12,
            height: 12,
            borderRadius: "50% 50% 50% 0",
            background: "oklch(0.55 0.15 250)",
            transform: "rotate(-45deg)",
            flex: "none",
          }}
        />
        Near me
      </div>
      <button
        onClick={() => goSearch()}
        className="btn-primary"
        style={{
          background: "oklch(0.55 0.15 250)",
          border: "none",
          color: "#fff",
          font: "700 16px 'Source Sans 3', sans-serif",
          padding: "16px 30px",
          cursor: "pointer",
        }}
      >
        Search
      </button>
    </div>
  );
}
