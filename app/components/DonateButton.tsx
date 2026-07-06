"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { CSSProperties } from "react";

export default function DonateButton({
  loggedIn,
  style,
  className,
  children,
}: {
  loggedIn: boolean;
  style?: CSSProperties;
  className?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);

  function handleClick() {
    if (!loggedIn) {
      router.push("/auth?tab=signup");
      return;
    }
    setMessage("Thanks for your support! Donation checkout is coming soon.");
    setTimeout(() => setMessage(null), 3500);
  }

  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <button onClick={handleClick} className={className} style={style}>
        {children}
      </button>
      {message && (
        <span
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            background: "#152238",
            color: "#fff",
            fontSize: 12.5,
            fontWeight: 600,
            padding: "8px 12px",
            borderRadius: 8,
            whiteSpace: "nowrap",
            zIndex: 10,
            boxShadow: "0 8px 20px rgba(20,45,90,.2)",
          }}
        >
          {message}
        </span>
      )}
    </span>
  );
}
