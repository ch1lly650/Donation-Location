"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      style={{
        background: "none",
        border: "none",
        font: "600 14.5px 'Source Sans 3', sans-serif",
        color: "#44526a",
        cursor: "pointer",
      }}
      className="nav-link"
    >
      Log out
    </button>
  );
}
