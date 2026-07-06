import { useEffect } from "react";

/**
 * Only normalizes /leads -> /leads/
 * Does NOT reload when already on /leads/ (prevents infinite loop
 * when Nginx still serves the main TrippyJiffy app).
 */
const LeadsGateway = () => {
  useEffect(() => {
    if (window.location.pathname === "/leads") {
      window.location.replace("/leads/");
    }
  }, []);

  if (window.location.pathname.startsWith("/leads/")) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          textAlign: "center",
          gap: "1rem",
        }}
      >
        <h1>Leads panel is not deployed yet</h1>
        <p style={{ maxWidth: "560px", color: "#64748b", lineHeight: 1.6 }}>
          Server par Leads app build aur Nginx <code>/leads/</code> block missing hai.
          VPS par <code>npm run build:all</code> chalao aur Nginx config update karo.
        </p>
        <a
          href="/"
          style={{
            padding: "0.6rem 1.2rem",
            borderRadius: "8px",
            background: "var(--primary-color, #d35400)",
            color: "#fff",
            textDecoration: "none",
          }}
        >
          Back to Home
        </a>
      </div>
    );
  }

  return null;
};

export default LeadsGateway;
