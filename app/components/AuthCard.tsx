"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const inputStyle: React.CSSProperties = {
  border: "1.5px solid #dbe3ee",
  borderRadius: 9,
  padding: "12px 14px",
  font: "14.5px 'Source Sans 3', sans-serif",
  color: "#152238",
};

export default function AuthCard({ initialTab }: { initialTab: "signup" | "login" }) {
  const router = useRouter();
  const [tab, setTab] = useState<"signup" | "login">(initialTab);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [zip, setZip] = useState("");
  const [emailOptIn, setEmailOptIn] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function switchTab(next: "signup" | "login") {
    setTab(next);
    setError(null);
    router.replace(`/auth?tab=${next}`, { scroll: false });
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, zip, emailOptIn }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Something went wrong.");
      return;
    }
    router.push("/");
    router.refresh();
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Something went wrong.");
      return;
    }
    router.push("/");
    router.refresh();
  }

  const signupActive = tab === "signup";

  return (
    <div
      style={{
        background: "linear-gradient(160deg,oklch(0.96 0.015 250),oklch(0.9 0.035 250))",
        padding: "56px 0",
        display: "grid",
        placeItems: "center",
        flex: 1,
      }}
    >
      <div style={{ width: 400, maxWidth: "90vw", background: "#fff", borderRadius: 18, boxShadow: "0 20px 50px rgba(20,45,90,.15)", padding: "32px 32px 28px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginBottom: 22 }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "oklch(0.55 0.15 250)", display: "grid", placeItems: "center", color: "#fff", fontSize: 20 }}>
            ♥
          </div>
          <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 18, color: "#152238" }}>
            Welcome to Donation Location
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", background: "#f2f5f9", borderRadius: 10, padding: 4, marginBottom: 22 }}>
          <span
            onClick={() => switchTab("signup")}
            style={{
              textAlign: "center",
              padding: 9,
              borderRadius: 8,
              background: signupActive ? "#ffffff" : "transparent",
              fontSize: 13.5,
              fontWeight: 700,
              color: signupActive ? "#152238" : "#8fa2bd",
              boxShadow: signupActive ? "0 1px 4px rgba(0,0,0,.08)" : "none",
              cursor: "pointer",
            }}
          >
            Create account
          </span>
          <span
            onClick={() => switchTab("login")}
            style={{
              textAlign: "center",
              padding: 9,
              borderRadius: 8,
              background: !signupActive ? "#ffffff" : "transparent",
              fontSize: 13.5,
              fontWeight: 700,
              color: !signupActive ? "#152238" : "#8fa2bd",
              boxShadow: !signupActive ? "0 1px 4px rgba(0,0,0,.08)" : "none",
              cursor: "pointer",
            }}
          >
            Log in
          </span>
        </div>

        {error && (
          <div style={{ background: "#faeaef", color: "#8a4a5e", fontSize: 13, fontWeight: 600, borderRadius: 8, padding: "10px 12px", marginBottom: 12 }}>
            {error}
          </div>
        )}

        {signupActive ? (
          <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input required placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} className="field-input" style={inputStyle} />
            <input required type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="field-input" style={inputStyle} />
            <input required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="field-input" style={inputStyle} />
            <input placeholder="ZIP code (for charities near you)" value={zip} onChange={(e) => setZip(e.target.value)} className="field-input" style={inputStyle} />
            <label onClick={() => setEmailOptIn((v) => !v)} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, color: "#44526a", cursor: "pointer" }}>
              {emailOptIn ? (
                <span style={{ width: 16, height: 16, borderRadius: 4, background: "oklch(0.55 0.15 250)", display: "grid", placeItems: "center", color: "#fff", fontSize: 11, fontWeight: 800, flex: "none" }}>
                  ✓
                </span>
              ) : (
                <span style={{ width: 16, height: 16, borderRadius: 4, border: "1.5px solid #c6d1e0", flex: "none" }} />
              )}
              Email me about charities near me
            </label>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ background: "oklch(0.55 0.15 250)", border: "none", color: "#fff", font: "800 15px Nunito, sans-serif", padding: 13, borderRadius: 9, cursor: "pointer" }}
            >
              {loading ? "Please wait…" : "Get started — it's free"}
            </button>
            <button type="button" style={{ background: "#fff", border: "1.5px solid #dbe3ee", borderRadius: 9, padding: 11, font: "700 13.5px 'Source Sans 3', sans-serif", color: "#152238", cursor: "pointer" }}>
              Continue with Google
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input required type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="field-input" style={inputStyle} />
            <input required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="field-input" style={inputStyle} />
            <span style={{ fontSize: 13, fontWeight: 700, color: "oklch(0.55 0.15 250)", cursor: "pointer" }}>Forgot password?</span>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ background: "oklch(0.55 0.15 250)", border: "none", color: "#fff", font: "800 15px Nunito, sans-serif", padding: 13, borderRadius: 9, cursor: "pointer" }}
            >
              {loading ? "Please wait…" : "Log in"}
            </button>
            <button type="button" style={{ background: "#fff", border: "1.5px solid #dbe3ee", borderRadius: 9, padding: 11, font: "700 13.5px 'Source Sans 3', sans-serif", color: "#152238", cursor: "pointer" }}>
              Continue with Google
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
