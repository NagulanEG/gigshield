import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";

export default function Login() {
  const nav = useNavigate();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async () => {
    if (!/^\d{10}$/.test(phone)) { setError("Enter a valid 10-digit phone number"); return; }
    setLoading(true); setError("");
    try {
      const data = await api.login({ phoneNumber: phone });
      if (data.error) { setError(data.error); return; }
      localStorage.setItem("workerId", data.workerId);
      nav("/dashboard");
    } catch { setError("Cannot connect to server. Make sure backend is running on port 5000."); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4FF", fontFamily: "'Plus Jakarta Sans', sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>

      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <div style={{ width: 48, height: 48, background: "linear-gradient(135deg,#4F46E5,#7C3AED)", borderRadius: 13, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🛡️</div>
          <span style={{ fontWeight: 800, fontSize: 26, color: "#4F46E5" }}>Gig<span style={{ color: "#F59E0B" }}>Shield</span></span>
        </div>
        <p style={{ color: "#9CA3AF", fontSize: 13 }}>Sign in to manage your gig insurance</p>
      </div>

      {/* Card */}
      <div style={{ background: "white", border: "1.5px solid #E2E8FF", borderRadius: 20, padding: "36px 32px", width: "100%", maxWidth: 420, boxShadow: "0 8px 32px rgba(79,70,229,0.10)" }}>
        <h2 style={{ fontWeight: 800, fontSize: 22, color: "#1E1B4B", marginBottom: 4 }}>Welcome Back</h2>
        <p style={{ color: "#9CA3AF", fontSize: 14, marginBottom: 28 }}>Enter your registered phone number to continue</p>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#4B5563", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.06em" }}>Mobile Number</label>
          <input
            style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #E2E8FF", borderRadius: 10, fontSize: 15, background: "#F7F9FF", color: "#1E1B4B", fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
            placeholder="9876543210"
            maxLength={10}
            value={phone}
            onChange={e => setPhone(e.target.value.replace(/\D/g, ""))}
            onKeyDown={e => e.key === "Enter" && login()}
          />
        </div>

        {error && (
          <div style={{ background: "#FEF2F2", border: "1.5px solid #FECACA", borderRadius: 10, padding: "12px 14px", marginBottom: 16, fontSize: 13, color: "#B91C1C", fontWeight: 600 }}>
            {error}
          </div>
        )}

        <button
          style={{ width: "100%", padding: "13px", fontSize: 15, fontWeight: 700, border: "none", borderRadius: 10, background: "linear-gradient(135deg,#4F46E5,#7C3AED)", color: "white", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 14px rgba(79,70,229,0.3)" }}
          onClick={login}
          disabled={loading}
        >
          {loading ? "Signing in…" : "→ Sign In"}
        </button>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <span style={{ color: "#9CA3AF", fontSize: 13 }}>New to GigShield? </span>
          <button
            style={{ background: "none", border: "none", fontSize: 13, fontWeight: 700, color: "#4F46E5", cursor: "pointer", fontFamily: "inherit" }}
            onClick={() => nav("/onboard")}
          >
            Create Account →
          </button>
        </div>
      </div>

      <button
        style={{ marginTop: 16, background: "none", border: "1.5px solid #E2E8FF", borderRadius: 10, padding: "8px 18px", fontSize: 13, fontWeight: 600, color: "#4B5563", cursor: "pointer", fontFamily: "inherit" }}
        onClick={() => nav("/")}
      >
        ← Back to Home
      </button>
    </div>
  );
}