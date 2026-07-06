"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PledgeButton({
  itemId,
  loggedIn,
  initiallyPledged,
}: {
  itemId: string;
  loggedIn: boolean;
  initiallyPledged: boolean;
}) {
  const router = useRouter();
  const [pledged, setPledged] = useState(initiallyPledged);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (!loggedIn) {
      router.push("/auth?tab=signup");
      return;
    }
    if (pledged || loading) return;
    setLoading(true);
    const res = await fetch("/api/pledge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId }),
    });
    if (res.ok) setPledged(true);
    setLoading(false);
  }

  return (
    <button
      onClick={handleClick}
      disabled={pledged || loading}
      className={pledged ? "" : "pledge-btn"}
      style={{
        background: pledged ? "oklch(0.93 0.03 250)" : "#fff",
        border: pledged ? "1.5px solid oklch(0.93 0.03 250)" : "1.5px solid oklch(0.55 0.15 250)",
        color: pledged ? "#1c3557" : "oklch(0.5 0.15 250)",
        font: "700 13px 'Source Sans 3', sans-serif",
        padding: "8px 16px",
        borderRadius: 8,
        cursor: pledged ? "default" : "pointer",
        flex: "none",
      }}
    >
      {pledged ? "Pledged ✓" : "Pledge"}
    </button>
  );
}
