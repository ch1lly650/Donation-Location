"use client";

import { useState } from "react";

export default function FollowButton() {
  const [following, setFollowing] = useState(false);

  return (
    <button
      onClick={() => setFollowing((f) => !f)}
      className="outline-hover"
      style={{
        background: following ? "oklch(0.93 0.03 250)" : "#fff",
        border: "1.5px solid #dbe3ee",
        color: "#152238",
        font: "700 14px 'Source Sans 3', sans-serif",
        padding: "11px 20px",
        borderRadius: 999,
        cursor: "pointer",
      }}
    >
      {following ? "♥ Following" : "♡ Follow"}
    </button>
  );
}
