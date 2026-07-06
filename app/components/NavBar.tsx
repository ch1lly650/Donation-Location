import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import LogoutButton from "./LogoutButton";

export default async function NavBar() {
  const user = await getCurrentUser();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 28,
        padding: "16px 40px",
        borderBottom: "1px solid #e6ebf2",
        background: "#fff",
        flexWrap: "wrap",
      }}
    >
      <Link
        href="/"
        style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: "oklch(0.55 0.15 250)",
            display: "grid",
            placeItems: "center",
            color: "#fff",
            fontFamily: "var(--font-heading)",
            fontWeight: 900,
            fontSize: 16,
          }}
        >
          DL
        </div>
        <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 18, color: "#152238" }}>
          Donation<span style={{ color: "oklch(0.55 0.15 250)" }}>Location</span>
        </div>
      </Link>
      <div style={{ display: "flex", gap: 24, fontSize: 14.5, color: "#44526a", fontWeight: 600, marginLeft: 12, flexWrap: "wrap" }}>
        <Link href="/search" className="nav-link" style={{ cursor: "pointer" }}>
          Browse charities
        </Link>
        <span className="nav-link" style={{ cursor: "pointer" }}>
          Causes
        </span>
        <span className="nav-link" style={{ cursor: "pointer" }}>
          How it works
        </span>
        <span className="nav-link" style={{ cursor: "pointer" }}>
          For nonprofits
        </span>
      </div>
      <div style={{ display: "flex", gap: 12, marginLeft: "auto", alignItems: "center" }}>
        {user ? (
          <>
            <span style={{ fontSize: 14.5, fontWeight: 600, color: "#152238" }}>Hi, {user.name.split(" ")[0]}</span>
            <LogoutButton />
          </>
        ) : (
          <>
            <Link
              href="/auth?tab=login"
              className="nav-link"
              style={{ background: "none", border: "none", font: "600 14.5px 'Source Sans 3', sans-serif", color: "#44526a", cursor: "pointer" }}
            >
              Log in
            </Link>
            <Link
              href="/auth?tab=signup"
              className="btn-primary"
              style={{
                background: "oklch(0.55 0.15 250)",
                border: "none",
                color: "#fff",
                font: "700 14.5px 'Source Sans 3', sans-serif",
                padding: "10px 18px",
                borderRadius: 999,
                cursor: "pointer",
                display: "inline-block",
              }}
            >
              Create account
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
