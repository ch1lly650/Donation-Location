export default function Footer() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12,
        padding: "20px 40px",
        background: "#152238",
        color: "#a8b6cc",
        fontSize: 13,
        marginTop: "auto",
      }}
    >
      <span>© 2026 Donation Location</span>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <span>About</span>
        <span>Trust &amp; safety</span>
        <span>Advertise with us</span>
        <span>Contact</span>
      </div>
    </div>
  );
}
