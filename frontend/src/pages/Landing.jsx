import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const TICKER = [
  "🌧️ Rain >8mm detected in Mumbai — ₹500 auto-paid to 234 workers",
  "⛈️ Cyclone alert in Chennai — ₹750 credited via UPI instantly",
  "📡 Platform outage in Delhi — 112 claims auto-approved",
  "🌊 Flash flood in Hyderabad — ₹625 credited to Full Shield holders",
];

export default function Landing() {
  const nav = useNavigate();
  const [tick, setTick] = useState(0);
  const [count, setCount] = useState({ workers: 0, payouts: 0, cities: 0 });

  useEffect(() => {
    const t = setInterval(() => setTick(p => (p + 1) % TICKER.length), 3000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const targets = { workers: 10000, payouts: 45, cities: 6 };
    let frame = 0;
    const iv = setInterval(() => {
      frame++;
      const p = Math.min(frame / 60, 1);
      setCount({ workers: Math.floor(targets.workers * p), payouts: Math.floor(targets.payouts * p), cities: Math.floor(targets.cities * p) });
      if (frame >= 60) clearInterval(iv);
    }, 20);
    return () => clearInterval(iv);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4FF", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* NAVBAR */}
      <nav style={{ background: "white", borderBottom: "1.5px solid #E2E8FF", padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 8px rgba(79,70,229,0.07)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, background: "linear-gradient(135deg,#4F46E5,#7C3AED)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🛡️</div>
          <span style={{ fontWeight: 800, fontSize: 20, color: "#4F46E5", letterSpacing: "-0.5px" }}>Gig<span style={{ color: "#F59E0B" }}>Shield</span></span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => nav("/login")} style={{ padding: "8px 18px", fontSize: 13, fontWeight: 700, border: "1.5px solid #E2E8FF", borderRadius: 10, background: "white", color: "#4F46E5", cursor: "pointer", fontFamily: "inherit" }}>
            Sign In
          </button>
          <button onClick={() => nav("/onboard")} style={{ padding: "8px 20px", fontSize: 13, fontWeight: 700, border: "none", borderRadius: 10, background: "linear-gradient(135deg,#4F46E5,#7C3AED)", color: "white", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 14px rgba(79,70,229,0.35)" }}>
            Protect My Income →
          </button>
        </div>
      </nav>

      {/* LIVE TICKER */}
      <div style={{ background: "#FFFBEB", borderBottom: "1.5px solid #FDE68A", padding: "10px 32px" }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#92400E", fontFamily: "'DM Mono', monospace" }}>
          🔴 LIVE &nbsp;·&nbsp; {TICKER[tick]}
        </div>
      </div>

      {/* HERO */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 32px 60px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#EEF2FF", border: "1.5px solid #C7D2FE", borderRadius: 20, padding: "5px 14px", fontSize: 12, fontWeight: 700, color: "#4F46E5", marginBottom: 20 }}>
            🏆 Guidewire DEVTrails 2026
          </div>
          <h1 style={{ fontWeight: 800, fontSize: 52, lineHeight: 1.08, letterSpacing: "-2px", color: "#1E1B4B", marginBottom: 20 }}>
            Secure Your<br />
            <span style={{ background: "linear-gradient(135deg,#4F46E5,#7C3AED)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Weekly Income,</span><br />
            No Matter the<br />Weather.
          </h1>
          <p style={{ color: "#6B7280", fontSize: 17, lineHeight: 1.7, marginBottom: 32, maxWidth: 460 }}>
            AI-powered parametric income protection for Zomato, Swiggy, Zepto & Amazon delivery partners. Auto-payouts when it rains. No forms. No delays.
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => nav("/onboard")} style={{ padding: "15px 36px", fontSize: 16, fontWeight: 700, border: "none", borderRadius: 12, background: "linear-gradient(135deg,#4F46E5,#7C3AED)", color: "white", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 6px 20px rgba(79,70,229,0.4)" }}>
              Get Your Quote Now →
            </button>
            <button onClick={() => nav("/admin")} style={{ padding: "15px 24px", fontSize: 15, fontWeight: 700, border: "1.5px solid #E2E8FF", borderRadius: 12, background: "white", color: "#4B5563", cursor: "pointer", fontFamily: "inherit" }}>
              Insurer Admin Portal
            </button>
          </div>
          <div style={{ display: "flex", gap: 40, marginTop: 40 }}>
            {[
              { n: count.workers.toLocaleString() + "+", l: "Delivery Partners" },
              { n: "₹" + count.payouts + "L+", l: "Payouts This Month" },
              { n: count.cities + " Cities", l: "Live Monitoring" },
            ].map(s => (
              <div key={s.l}>
                <div style={{ fontWeight: 800, fontSize: 22, color: "#F59E0B" }}>{s.n}</div>
                <div style={{ fontSize: 12, color: "#9CA3AF", fontFamily: "'DM Mono', monospace", marginTop: 2 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* HERO CARD */}
        <div style={{ position: "relative" }}>
          <div style={{ background: "white", border: "1.5px solid #E2E8FF", borderRadius: 20, padding: 28, boxShadow: "0 8px 32px rgba(79,70,229,0.12)" }}>
            {/* Live alert */}
            <div style={{ background: "#ECFDF5", border: "1.5px solid #6EE7B7", borderRadius: 14, padding: "14px 18px", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 8, height: 8, background: "#10B981", borderRadius: "50%", display: "block" }} />
                <div>
                  <div style={{ fontSize: 11, color: "#059669", fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>DISRUPTION DETECTED</div>
                  <div style={{ fontSize: 13, color: "#374151", marginTop: 2 }}>Rain &gt;10mm · Auto payout initiated via UPI</div>
                </div>
              </div>
              <div style={{ fontWeight: 800, fontSize: 20, color: "#10B981" }}>₹500</div>
            </div>

            {[
              { icon: "📍", title: "Register in 2 minutes", desc: "Name, phone, zone, delivery persona" },
              { icon: "🤖", title: "AI calculates your premium", desc: "Zone risk × seasonal factor × persona" },
              { icon: "⚡", title: "Auto-payout when triggered", desc: "Rain >8mm? Money hits UPI instantly" },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 14, padding: "12px 0", borderBottom: i < 2 ? "1px solid #F3F4F6" : "none" }}>
                <div style={{ width: 36, height: 36, background: "#EEF2FF", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>{s.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#1E1B4B" }}>{s.title}</div>
                  <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Floating badge */}
          <div style={{ position: "absolute", bottom: -16, right: 24, background: "linear-gradient(135deg,#F59E0B,#F97316)", borderRadius: 12, padding: "8px 16px", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 14px rgba(245,158,11,0.4)" }}>
            <span style={{ fontSize: 16 }}>⚡</span>
            <span style={{ fontWeight: 700, fontSize: 12, color: "white" }}>Avg payout in &lt;5 min</span>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={{ borderTop: "1.5px solid #E2E8FF", padding: "64px 32px", background: "white" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontWeight: 800, fontSize: 32, textAlign: "center", color: "#1E1B4B", marginBottom: 8, letterSpacing: "-0.5px" }}>How GigShield Works</h2>
          <p style={{ textAlign: "center", color: "#6B7280", marginBottom: 40, fontSize: 15 }}>Three steps from signup to payout — fully automated.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
            {[
              { icon: "🌦️", title: "Parametric Triggers", desc: "Live weather data from Open-Meteo API. When rain exceeds 8mm/hr or temperature hits 42°C — trigger fires automatically.", color: "#EFF6FF", border: "#BFDBFE" },
              { icon: "🤖", title: "AI Premium Pricing", desc: "Your premium is calculated using zone risk × seasonal factor × delivery persona. Transparent, fair, and dynamic.", color: "#F5F3FF", border: "#DDD6FE" },
              { icon: "💸", title: "Instant UPI Payout", desc: "No claim forms. No waiting. No rejection. When a trigger fires, ₹ hits your UPI in under 5 minutes — guaranteed.", color: "#ECFDF5", border: "#A7F3D0" },
            ].map((c, i) => (
              <div key={i} style={{ background: c.color, border: `1.5px solid ${c.border}`, borderRadius: 16, padding: 24 }}>
                <div style={{ fontSize: 36, marginBottom: 14 }}>{c.icon}</div>
                <div style={{ fontWeight: 800, fontSize: 17, color: "#1E1B4B", marginBottom: 8 }}>{c.title}</div>
                <div style={{ color: "#4B5563", fontSize: 14, lineHeight: 1.6 }}>{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA STRIP */}
      <div style={{ background: "linear-gradient(135deg,#4F46E5,#7C3AED)", padding: "48px 32px", textAlign: "center" }}>
        <h2 style={{ fontWeight: 800, fontSize: 28, color: "white", marginBottom: 8, letterSpacing: "-0.5px" }}>Ready to protect your income?</h2>
        <p style={{ color: "rgba(255,255,255,0.75)", marginBottom: 24, fontSize: 15 }}>Join 10,000+ delivery workers already covered by GigShield.</p>
        <button onClick={() => nav("/onboard")} style={{ padding: "14px 36px", fontSize: 15, fontWeight: 700, border: "none", borderRadius: 12, background: "white", color: "#4F46E5", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
          Get Protected Now →
        </button>
      </div>

      {/* FOOTER */}
      <div style={{ borderTop: "1.5px solid #E2E8FF", padding: "20px 32px", textAlign: "center", color: "#9CA3AF", fontSize: 12, fontFamily: "'DM Mono', monospace", background: "white" }}>
        GigShield · Guidewire DEVTrails Hackathon 2026 · Simulated demo
      </div>
    </div>
  );
}