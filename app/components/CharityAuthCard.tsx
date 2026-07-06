"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ALL_CAUSES } from "@/lib/causes";

const inputStyle: React.CSSProperties = {
  border: "1.5px solid #dbe3ee",
  borderRadius: 9,
  padding: "12px 14px",
  font: "14.5px 'Source Sans 3', sans-serif",
  color: "#152238",
  width: "100%",
};

const labelStyle: React.CSSProperties = {
  fontSize: 12.5,
  fontWeight: 700,
  color: "#8fa2bd",
  marginBottom: 6,
  display: "block",
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span style={labelStyle}>{label}</span>
      {children}
    </div>
  );
}

export default function CharityAuthCard({ initialTab }: { initialTab: "signup" | "login" }) {
  const router = useRouter();
  const [tab, setTab] = useState<"signup" | "login">(initialTab);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [charityName, setCharityName] = useState("");
  const [cause, setCause] = useState<string>(ALL_CAUSES[0]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [hours, setHours] = useState("");
  const [foundingYear, setFoundingYear] = useState("");
  const [bio, setBio] = useState("");
  const [is501c3, setIs501c3] = useState(true);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  function switchTab(next: "signup" | "login") {
    setTab(next);
    setError(null);
    router.replace(`/for-nonprofits?tab=${next}`, { scroll: false });
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/charity-auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        charityName,
        cause,
        email,
        password,
        street,
        city,
        state,
        zip,
        phone,
        website,
        hours,
        foundingYear,
        bio,
        is501c3,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Something went wrong.");
      return;
    }
    router.push("/charity/dashboard");
    router.refresh();
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/charity-auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: loginEmail, password: loginPassword }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Something went wrong.");
      return;
    }
    router.push("/charity/dashboard");
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
      <div
        style={{
          width: signupActive ? 480 : 400,
          maxWidth: "92vw",
          background: "#fff",
          borderRadius: 18,
          boxShadow: "0 20px 50px rgba(20,45,90,.15)",
          padding: "32px 32px 28px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginBottom: 22 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "oklch(0.35 0.09 255)",
              display: "grid",
              placeItems: "center",
              color: "#fff",
              fontSize: 20,
            }}
          >
            🏛
          </div>
          <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 18, color: "#152238" }}>
            Donation Location for Nonprofits
          </div>
          <div style={{ fontSize: 13, color: "#5a6a84", textAlign: "center" }}>
            Create and manage your charity&apos;s public profile and wishlist.
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
            Register charity
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
            <Field label="Charity name">
              <input required value={charityName} onChange={(e) => setCharityName(e.target.value)} className="field-input" style={inputStyle} />
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Primary cause">
                <select required value={cause} onChange={(e) => setCause(e.target.value)} className="field-input" style={inputStyle}>
                  {ALL_CAUSES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Founding year">
                <input
                  type="number"
                  placeholder="2011"
                  value={foundingYear}
                  onChange={(e) => setFoundingYear(e.target.value)}
                  className="field-input"
                  style={inputStyle}
                />
              </Field>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Login email">
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field-input" style={inputStyle} />
              </Field>
              <Field label="Password">
                <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="field-input" style={inputStyle} />
              </Field>
            </div>
            <Field label="Street address">
              <input value={street} onChange={(e) => setStreet(e.target.value)} className="field-input" style={inputStyle} />
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 12 }}>
              <Field label="City">
                <input required value={city} onChange={(e) => setCity(e.target.value)} className="field-input" style={inputStyle} />
              </Field>
              <Field label="State">
                <input required value={state} onChange={(e) => setState(e.target.value)} className="field-input" style={inputStyle} />
              </Field>
              <Field label="ZIP">
                <input value={zip} onChange={(e) => setZip(e.target.value)} className="field-input" style={inputStyle} />
              </Field>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Phone">
                <input value={phone} onChange={(e) => setPhone(e.target.value)} className="field-input" style={inputStyle} />
              </Field>
              <Field label="Website">
                <input placeholder="yourcharity.org" value={website} onChange={(e) => setWebsite(e.target.value)} className="field-input" style={inputStyle} />
              </Field>
            </div>
            <Field label="Hours">
              <input placeholder="Mon–Fri, 9am–5pm" value={hours} onChange={(e) => setHours(e.target.value)} className="field-input" style={inputStyle} />
            </Field>
            <Field label="Mission / about">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="field-input"
                style={{ ...inputStyle, resize: "vertical", font: "14.5px 'Source Sans 3', sans-serif" }}
              />
            </Field>
            <label onClick={() => setIs501c3((v) => !v)} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, color: "#44526a", cursor: "pointer" }}>
              {is501c3 ? (
                <span style={{ width: 16, height: 16, borderRadius: 4, background: "oklch(0.55 0.15 250)", display: "grid", placeItems: "center", color: "#fff", fontSize: 11, fontWeight: 800, flex: "none" }}>
                  ✓
                </span>
              ) : (
                <span style={{ width: 16, height: 16, borderRadius: 4, border: "1.5px solid #c6d1e0", flex: "none" }} />
              )}
              We are a registered 501(c)(3)
            </label>
            <p style={{ margin: 0, fontSize: 12, color: "#8fa2bd", lineHeight: 1.5 }}>
              New charity profiles start unverified and appear near San Jose, CA by
              default — precise location geocoding isn&apos;t set up yet.
            </p>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ background: "oklch(0.55 0.15 250)", border: "none", color: "#fff", font: "800 15px Nunito, sans-serif", padding: 13, borderRadius: 9, cursor: "pointer" }}
            >
              {loading ? "Please wait…" : "Create charity profile"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input required type="email" placeholder="Email address" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="field-input" style={inputStyle} />
            <input required type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="field-input" style={inputStyle} />
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ background: "oklch(0.55 0.15 250)", border: "none", color: "#fff", font: "800 15px Nunito, sans-serif", padding: 13, borderRadius: 9, cursor: "pointer" }}
            >
              {loading ? "Please wait…" : "Log in"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
