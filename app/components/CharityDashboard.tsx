"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ALL_CAUSES } from "@/lib/causes";

type Item = {
  id: string;
  name: string;
  icon: string;
  category: string;
  condition: string;
  note: string;
  highNeed: boolean;
};

type Charity = {
  id: string;
  slug: string;
  name: string;
  cause: string;
  foundingYear: number;
  is501c3: boolean;
  bio: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  website: string;
  hours: string;
  verified: boolean;
  items: Item[];
};

const CATEGORIES = ["Clothing", "Food", "Hygiene", "School supplies", "Household"];
const CONDITIONS = ["New only", "New or used"];

const inputStyle: React.CSSProperties = {
  border: "1.5px solid #dbe3ee",
  borderRadius: 9,
  padding: "10px 12px",
  font: "14px 'Source Sans 3', sans-serif",
  color: "#152238",
  width: "100%",
};

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: "#8fa2bd",
  marginBottom: 5,
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

function emptyItemForm() {
  return { name: "", icon: "📦", category: CATEGORIES[0], condition: CONDITIONS[0], note: "", highNeed: false };
}

export default function CharityDashboard({ charity }: { charity: Charity }) {
  const router = useRouter();

  const [profile, setProfile] = useState({
    name: charity.name,
    cause: charity.cause,
    foundingYear: String(charity.foundingYear),
    is501c3: charity.is501c3,
    bio: charity.bio,
    street: charity.street,
    city: charity.city,
    state: charity.state,
    zip: charity.zip,
    phone: charity.phone,
    email: charity.email,
    website: charity.website,
    hours: charity.hours,
  });
  const [profileStatus, setProfileStatus] = useState<string | null>(null);
  const [profileSaving, setProfileSaving] = useState(false);

  const [items, setItems] = useState(charity.items);
  const [newItem, setNewItem] = useState(emptyItemForm());
  const [addingItem, setAddingItem] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(emptyItemForm());
  const [itemsError, setItemsError] = useState<string | null>(null);

  async function handleLogout() {
    await fetch("/api/charity-auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileSaving(true);
    setProfileStatus(null);
    const res = await fetch("/api/charity/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    setProfileSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setProfileStatus(data?.error ?? "Something went wrong.");
      return;
    }
    setProfileStatus("Saved.");
    router.refresh();
  }

  async function addItem(e: React.FormEvent) {
    e.preventDefault();
    setItemsError(null);
    setAddingItem(true);
    const res = await fetch("/api/charity/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    });
    const data = await res.json();
    setAddingItem(false);
    if (!res.ok) {
      setItemsError(data.error ?? "Something went wrong.");
      return;
    }
    setItems((prev) => [...prev, data.item].sort((a, b) => a.name.localeCompare(b.name)));
    setNewItem(emptyItemForm());
  }

  function startEdit(item: Item) {
    setEditingId(item.id);
    setEditForm({
      name: item.name,
      icon: item.icon,
      category: item.category,
      condition: item.condition,
      note: item.note,
      highNeed: item.highNeed,
    });
  }

  async function saveEdit(id: string) {
    setItemsError(null);
    const res = await fetch(`/api/charity/items/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    const data = await res.json();
    if (!res.ok) {
      setItemsError(data.error ?? "Something went wrong.");
      return;
    }
    setItems((prev) => prev.map((it) => (it.id === id ? data.item : it)));
    setEditingId(null);
  }

  async function deleteItem(id: string) {
    if (!window.confirm("Remove this item from your wishlist?")) return;
    setItemsError(null);
    const res = await fetch(`/api/charity/items/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setItemsError(data?.error ?? "Something went wrong.");
      return;
    }
    setItems((prev) => prev.filter((it) => it.id !== id));
  }

  const cardStyle: React.CSSProperties = {
    background: "#fff",
    border: "1px solid #e6ebf2",
    borderRadius: 14,
    padding: 22,
  };

  return (
    <div style={{ background: "#f7f9fc", flex: 1 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          padding: "20px 40px",
          background: "#fff",
          borderBottom: "1px solid #e6ebf2",
        }}
      >
        <div>
          <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 20, color: "#152238" }}>
            Managing: {charity.name}
          </div>
          <div style={{ fontSize: 13, color: "#5a6a84", marginTop: 2 }}>
            {charity.verified ? "Verified" : "Not yet verified"} · <Link href={`/charity/${charity.slug}`} style={{ color: "oklch(0.5 0.15 250)", fontWeight: 600 }}>View public profile →</Link>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{ background: "#fff", border: "1.5px solid #dbe3ee", borderRadius: 8, padding: "9px 16px", font: "700 13.5px 'Source Sans 3', sans-serif", color: "#152238", cursor: "pointer" }}
        >
          Log out
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "420px 1fr", gap: 24, padding: "24px 40px 44px" }}>
        <form onSubmit={saveProfile} style={{ ...cardStyle, display: "flex", flexDirection: "column", gap: 12, height: "fit-content" }}>
          <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 16, color: "#152238" }}>Profile</div>

          <Field label="Charity name">
            <input required value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="field-input" style={inputStyle} />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="Primary cause">
              <select value={profile.cause} onChange={(e) => setProfile({ ...profile, cause: e.target.value })} className="field-input" style={inputStyle}>
                {ALL_CAUSES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Founding year">
              <input type="number" value={profile.foundingYear} onChange={(e) => setProfile({ ...profile, foundingYear: e.target.value })} className="field-input" style={inputStyle} />
            </Field>
          </div>
          <Field label="Mission / about">
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              rows={4}
              className="field-input"
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </Field>
          <Field label="Street address">
            <input value={profile.street} onChange={(e) => setProfile({ ...profile, street: e.target.value })} className="field-input" style={inputStyle} />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 10 }}>
            <Field label="City">
              <input value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })} className="field-input" style={inputStyle} />
            </Field>
            <Field label="State">
              <input value={profile.state} onChange={(e) => setProfile({ ...profile, state: e.target.value })} className="field-input" style={inputStyle} />
            </Field>
            <Field label="ZIP">
              <input value={profile.zip} onChange={(e) => setProfile({ ...profile, zip: e.target.value })} className="field-input" style={inputStyle} />
            </Field>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="Phone">
              <input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="field-input" style={inputStyle} />
            </Field>
            <Field label="Public contact email">
              <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="field-input" style={inputStyle} />
            </Field>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="Website">
              <input value={profile.website} onChange={(e) => setProfile({ ...profile, website: e.target.value })} className="field-input" style={inputStyle} />
            </Field>
            <Field label="Hours">
              <input value={profile.hours} onChange={(e) => setProfile({ ...profile, hours: e.target.value })} className="field-input" style={inputStyle} />
            </Field>
          </div>
          <label onClick={() => setProfile({ ...profile, is501c3: !profile.is501c3 })} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, color: "#44526a", cursor: "pointer" }}>
            {profile.is501c3 ? (
              <span style={{ width: 16, height: 16, borderRadius: 4, background: "oklch(0.55 0.15 250)", display: "grid", placeItems: "center", color: "#fff", fontSize: 11, fontWeight: 800, flex: "none" }}>
                ✓
              </span>
            ) : (
              <span style={{ width: 16, height: 16, borderRadius: 4, border: "1.5px solid #c6d1e0", flex: "none" }} />
            )}
            Registered 501(c)(3)
          </label>

          {profileStatus && (
            <div style={{ fontSize: 13, fontWeight: 600, color: profileStatus === "Saved." ? "#1e7f4f" : "#8a4a5e" }}>{profileStatus}</div>
          )}
          <button
            type="submit"
            disabled={profileSaving}
            className="btn-primary"
            style={{ background: "oklch(0.55 0.15 250)", border: "none", color: "#fff", font: "700 14px 'Source Sans 3', sans-serif", padding: 12, borderRadius: 9, cursor: "pointer" }}
          >
            {profileSaving ? "Saving…" : "Save profile"}
          </button>
        </form>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ ...cardStyle, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 16, color: "#152238" }}>Add a wishlist item</div>
            <form onSubmit={addItem} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "grid", gridTemplateColumns: "56px 1fr", gap: 10 }}>
                <Field label="Icon">
                  <input value={newItem.icon} onChange={(e) => setNewItem({ ...newItem, icon: e.target.value })} className="field-input" style={{ ...inputStyle, textAlign: "center", fontSize: 18 }} />
                </Field>
                <Field label="Item name">
                  <input required value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} className="field-input" style={inputStyle} />
                </Field>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Field label="Category">
                  <select value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })} className="field-input" style={inputStyle}>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Condition">
                  <select value={newItem.condition} onChange={(e) => setNewItem({ ...newItem, condition: e.target.value })} className="field-input" style={inputStyle}>
                    {CONDITIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
              <Field label="Note (e.g. 'All sizes — kids and adult')">
                <input value={newItem.note} onChange={(e) => setNewItem({ ...newItem, note: e.target.value })} className="field-input" style={inputStyle} />
              </Field>
              <label onClick={() => setNewItem({ ...newItem, highNeed: !newItem.highNeed })} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, color: "#44526a", cursor: "pointer" }}>
                {newItem.highNeed ? (
                  <span style={{ width: 16, height: 16, borderRadius: 4, background: "oklch(0.55 0.15 250)", display: "grid", placeItems: "center", color: "#fff", fontSize: 11, fontWeight: 800, flex: "none" }}>
                    ✓
                  </span>
                ) : (
                  <span style={{ width: 16, height: 16, borderRadius: 4, border: "1.5px solid #c6d1e0", flex: "none" }} />
                )}
                Mark as high need
              </label>
              {itemsError && <div style={{ fontSize: 13, fontWeight: 600, color: "#8a4a5e" }}>{itemsError}</div>}
              <button
                type="submit"
                disabled={addingItem}
                style={{ background: "oklch(0.55 0.15 250)", border: "none", color: "#fff", font: "700 13.5px 'Source Sans 3', sans-serif", padding: 10, borderRadius: 8, cursor: "pointer" }}
              >
                {addingItem ? "Adding…" : "Add item"}
              </button>
            </form>
          </div>

          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 16, color: "#152238" }}>
              Your wishlist ({items.length})
            </div>
          </div>

          {items.map((item) =>
            editingId === item.id ? (
              <div key={item.id} style={{ ...cardStyle, borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "grid", gridTemplateColumns: "56px 1fr", gap: 10 }}>
                  <input value={editForm.icon} onChange={(e) => setEditForm({ ...editForm, icon: e.target.value })} className="field-input" style={{ ...inputStyle, textAlign: "center", fontSize: 18 }} />
                  <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="field-input" style={inputStyle} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <select value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} className="field-input" style={inputStyle}>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <select value={editForm.condition} onChange={(e) => setEditForm({ ...editForm, condition: e.target.value })} className="field-input" style={inputStyle}>
                    {CONDITIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <input value={editForm.note} onChange={(e) => setEditForm({ ...editForm, note: e.target.value })} className="field-input" style={inputStyle} />
                <label onClick={() => setEditForm({ ...editForm, highNeed: !editForm.highNeed })} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, color: "#44526a", cursor: "pointer" }}>
                  {editForm.highNeed ? (
                    <span style={{ width: 16, height: 16, borderRadius: 4, background: "oklch(0.55 0.15 250)", display: "grid", placeItems: "center", color: "#fff", fontSize: 11, fontWeight: 800, flex: "none" }}>
                      ✓
                    </span>
                  ) : (
                    <span style={{ width: 16, height: 16, borderRadius: 4, border: "1.5px solid #c6d1e0", flex: "none" }} />
                  )}
                  Mark as high need
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => saveEdit(item.id)}
                    style={{ background: "oklch(0.55 0.15 250)", border: "none", color: "#fff", font: "700 13px 'Source Sans 3', sans-serif", padding: "8px 16px", borderRadius: 8, cursor: "pointer" }}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    style={{ background: "#fff", border: "1.5px solid #dbe3ee", color: "#152238", font: "700 13px 'Source Sans 3', sans-serif", padding: "8px 16px", borderRadius: 8, cursor: "pointer" }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div
                key={item.id}
                className="item-row-hover"
                style={{ display: "flex", alignItems: "center", gap: 14, background: "#fff", border: "1px solid #e6ebf2", borderRadius: 12, padding: "14px 18px", flexWrap: "wrap" }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 10, background: "oklch(0.93 0.02 250)", display: "grid", placeItems: "center", fontSize: 19, flex: "none" }}>
                  {item.icon}
                </div>
                <div style={{ flex: 1, minWidth: 160 }}>
                  <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 15.5, color: "#152238" }}>{item.name}</div>
                  <div style={{ fontSize: 12.5, color: "#8fa2bd", marginTop: 2 }}>
                    {item.category} · {item.condition}
                    {item.highNeed ? " · HIGH NEED" : ""}
                  </div>
                </div>
                <button
                  onClick={() => startEdit(item)}
                  style={{ background: "#fff", border: "1.5px solid #dbe3ee", color: "#152238", font: "700 13px 'Source Sans 3', sans-serif", padding: "8px 14px", borderRadius: 8, cursor: "pointer", flex: "none" }}
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteItem(item.id)}
                  style={{ background: "#fff", border: "1.5px solid #faeaef", color: "#8a4a5e", font: "700 13px 'Source Sans 3', sans-serif", padding: "8px 14px", borderRadius: 8, cursor: "pointer", flex: "none" }}
                >
                  Delete
                </button>
              </div>
            )
          )}

          {items.length === 0 && (
            <div style={{ textAlign: "center", padding: 36, color: "#8fa2bd", fontSize: 14.5, background: "#fff", border: "1px dashed #dbe3ee", borderRadius: 12 }}>
              No wishlist items yet — add your first one above.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
