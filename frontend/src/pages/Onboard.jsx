import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";

const STEPS = ["Personal Info", "Work Profile", "AI Quote", "You're Protected!"];
const ZONES = ["Adyar","T Nagar","Anna Nagar","Velachery","OMR","Tambaram","Porur","Guindy","Chromepet","Sholinganallur"];
const PERSONAS = [
  { id: "Food Delivery",    icon: "🍔", platforms: "Zomato / Swiggy" },
  { id: "Grocery Delivery", icon: "🛒", platforms: "Zepto / Blinkit" },
  { id: "E-commerce",       icon: "📦", platforms: "Amazon / Flipkart" },
  { id: "Two-Wheeler",      icon: "🏍️", platforms: "Dunzo / Porter" },
];
const PLANS = [
  { id: "Basic", emoji: "🛡️", price: "₹49",  period: "/week", max: "₹375 max", color: "#3B82F6", bg: "#EFF6FF", border: "#BFDBFE", desc: "Essential cover for light rain" },
  { id: "Full",  emoji: "⚡", price: "₹79",  period: "/week", max: "₹625 max", color: "#4F46E5", bg: "#EEF2FF", border: "#A5B4FC", desc: "Full weather + platform protection", best: true },
  { id: "Pro",   emoji: "🚀", price: "₹119", period: "/week", max: "₹900 max", color: "#8B5CF6", bg: "#F5F3FF", border: "#DDD6FE", desc: "All risks including cyclone" },
];

const S = {
  wrap:    { minHeight: "100vh", background: "#F0F4FF", fontFamily: "'Plus Jakarta Sans', sans-serif", display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 16px 60px" },
  card:    { background: "white", border: "1.5px solid #E2E8FF", borderRadius: 20, padding: "32px 28px", width: "100%", maxWidth: 560, boxShadow: "0 8px 32px rgba(79,70,229,0.10)" },
  label:   { display: "block", fontSize: 12, fontWeight: 700, color: "#4B5563", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.06em" },
  input:   { width: "100%", padding: "10px 14px", border: "1.5px solid #E2E8FF", borderRadius: 10, fontSize: 14, background: "#F7F9FF", color: "#1E1B4B", fontFamily: "inherit", outline: "none", boxSizing: "border-box" },
  btnPrimary: { padding: "12px 24px", fontWeight: 700, fontSize: 14, border: "none", borderRadius: 10, background: "linear-gradient(135deg,#4F46E5,#7C3AED)", color: "white", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 14px rgba(79,70,229,0.3)" },
  btnOutline: { padding: "12px 24px", fontWeight: 700, fontSize: 14, border: "1.5px solid #E2E8FF", borderRadius: 10, background: "white", color: "#4B5563", cursor: "pointer", fontFamily: "inherit" },
};

export default function Onboard() {
  const nav = useNavigate();
  const [step, setStep]     = useState(0);
  const [form, setForm]     = useState({ name: "", phoneNumber: "", email: "", zone: "Adyar", city: "Chennai", dailyIncome: "", deliveryPersona: "Food Delivery", selectedPlan: "Full" });
  const [quote, setQuote]   = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const getQuote = async () => {
    if (!form.dailyIncome) { setError("Please enter your daily income"); return; }
    setLoading(true); setError("");
    try {
      const q = await api.getQuote({ zone: form.zone, city: form.city, dailyIncome: form.dailyIncome, selectedPlan: form.selectedPlan, deliveryPersona: form.deliveryPersona });
      setQuote(q); setStep(2);
    } catch { setError("Cannot connect to server."); }
    finally { setLoading(false); }
  };

  const activate = async () => {
    if (!form.name || !form.phoneNumber) { setError("Please complete Step 1 first"); return; }
    setLoading(true); setError("");
    try {
      const data = await api.register(form);
      if (data.error) { setError(data.error); return; }
      localStorage.setItem("workerId", data.workerId);
      setResult(data); setStep(3);
    } catch { setError("Cannot connect to server."); }
    finally { setLoading(false); }
  };

  return (
    <div style={S.wrap}>
      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginBottom: 8 }}>
          <div style={{ width: 36, height: 36, background: "linear-gradient(135deg,#4F46E5,#7C3AED)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🛡️</div>
          <span style={{ fontWeight: 800, fontSize: 20, color: "#4F46E5" }}>Gig<span style={{ color: "#F59E0B" }}>Shield</span></span>
        </div>
        <div style={{ fontWeight: 700, fontSize: 18, color: "#1E1B4B" }}>Get Insured in 2 Minutes</div>
        <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>AI-powered weekly income protection</div>
      </div>

      {/* Step indicators */}
      <div style={{ width: "100%", maxWidth: 560, marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ flex: 1, height: 4, borderRadius: 4, background: i <= step ? (i < step ? "#10B981" : "#4F46E5") : "#E2E8FF", transition: "background 0.3s" }} />
          ))}
        </div>
        <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 6, fontFamily: "'DM Mono', monospace" }}>
          STEP {step + 1} OF {STEPS.length} — {STEPS[step].toUpperCase()}
        </div>
      </div>

      <div style={S.card}>

        {/* STEP 0 — Personal Info */}
        {step === 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Header icon="👤" title="Personal Details" sub="Tell us about yourself" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={S.label}>Full Name</label>
                <input style={S.input} placeholder="Ravi Kumar" value={form.name} onChange={e => set("name", e.target.value)} />
              </div>
              <div>
                <label style={S.label}>Phone Number</label>
                <input style={S.input} placeholder="9876543210" maxLength={10} value={form.phoneNumber} onChange={e => set("phoneNumber", e.target.value.replace(/\D/g, ""))} />
              </div>
            </div>
            <div>
              <label style={S.label}>Email (optional)</label>
              <input style={S.input} placeholder="ravi@example.com" value={form.email} onChange={e => set("email", e.target.value)} />
            </div>
            {error && <ErrBox msg={error} />}
            <button style={{ ...S.btnPrimary, width: "100%", marginTop: 4 }} onClick={() => {
              if (!form.name || !form.phoneNumber) { setError("Name and phone are required"); return; }
              if (!/^\d{10}$/.test(form.phoneNumber)) { setError("Enter a valid 10-digit phone"); return; }
              setError(""); setStep(1);
            }}>Continue →</button>
          </div>
        )}

        {/* STEP 1 — Work Profile */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Header icon="📍" title="Your Work Profile" sub="Select your delivery type and city" />

            <div>
              <label style={S.label}>Delivery Persona</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {PERSONAS.map(p => (
                  <button key={p.id} onClick={() => set("deliveryPersona", p.id)} style={{
                    display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", borderRadius: 12,
                    border: `1.5px solid ${form.deliveryPersona === p.id ? "#4F46E5" : "#E2E8FF"}`,
                    background: form.deliveryPersona === p.id ? "#EEF2FF" : "#F7F9FF",
                    cursor: "pointer", textAlign: "left", fontFamily: "inherit", transition: "all .2s",
                  }}>
                    <span style={{ fontSize: 22 }}>{p.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "#1E1B4B" }}>{p.id}</div>
                      <div style={{ fontSize: 11, color: "#9CA3AF" }}>{p.platforms}</div>
                    </div>
                    {form.deliveryPersona === p.id && <span style={{ color: "#4F46E5", fontWeight: 800 }}>✓</span>}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={S.label}>Operating City</label>
                <select style={S.input} value={form.city} onChange={e => set("city", e.target.value)}>
                  {["Mumbai","Delhi","Bangalore","Hyderabad","Chennai","Kolkata"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={S.label}>Zone / Area</label>
                <select style={S.input} value={form.zone} onChange={e => set("zone", e.target.value)}>
                  {ZONES.map(z => <option key={z}>{z}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label style={S.label}>Average Daily Income (₹)</label>
              <input style={S.input} type="number" placeholder="750" min={100} value={form.dailyIncome} onChange={e => set("dailyIncome", e.target.value)} />
            </div>

            <div>
              <label style={S.label}>Protection Plan</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                {PLANS.map(p => (
                  <button key={p.id} onClick={() => set("selectedPlan", p.id)} style={{
                    position: "relative", border: `2px solid ${form.selectedPlan === p.id ? p.color : "#E2E8FF"}`,
                    borderRadius: 14, padding: "14px 10px", textAlign: "left", cursor: "pointer",
                    background: form.selectedPlan === p.id ? p.bg : "white",
                    transform: form.selectedPlan === p.id ? "translateY(-2px)" : "none",
                    boxShadow: form.selectedPlan === p.id ? `0 6px 20px ${p.color}30` : "none",
                    transition: "all .2s", fontFamily: "inherit",
                  }}>
                    {p.best && <div style={{ position: "absolute", top: -9, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg,#4F46E5,#7C3AED)", color: "white", fontSize: 8, fontWeight: 700, padding: "2px 8px", borderRadius: 20, whiteSpace: "nowrap" }}>POPULAR</div>}
                    <div style={{ fontSize: 18, marginBottom: 6 }}>{p.emoji}</div>
                    <div style={{ fontWeight: 800, fontSize: 13, color: "#1E1B4B" }}>{p.id}</div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: p.color }}>{p.price}<span style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 400 }}>{p.period}</span></div>
                    <div style={{ fontSize: 9, color: "#9CA3AF", marginTop: 3, fontFamily: "'DM Mono', monospace" }}>{p.max}</div>
                  </button>
                ))}
              </div>
            </div>

            {error && <ErrBox msg={error} />}
            <div style={{ display: "flex", gap: 10 }}>
              <button style={{ ...S.btnOutline, flex: 1 }} onClick={() => { setError(""); setStep(0); }}>← Back</button>
              <button style={{ ...S.btnPrimary, flex: 2 }} onClick={getQuote} disabled={loading}>
                {loading ? "Generating AI Quote…" : "Get My AI Quote →"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 — AI Quote */}
        {step === 2 && quote && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Header icon="🤖" title="Your AI Quote" sub="Personalised premium based on your risk profile" />

            <div style={{ background: "linear-gradient(135deg,#EEF2FF,#F5F3FF)", border: "1.5px solid #C7D2FE", borderRadius: 16, padding: "24px", textAlign: "center" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", marginBottom: 8, letterSpacing: "0.08em", fontFamily: "'DM Mono', monospace" }}>AI-GENERATED QUOTE</div>
              <div style={{ fontWeight: 800, fontSize: 52, color: "#4F46E5", lineHeight: 1, letterSpacing: "-2px" }}>₹{quote.weeklyPremium}</div>
              <div style={{ color: "#6B7280", fontSize: 14, marginTop: 6 }}>per week · {form.selectedPlan} Plan</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <StatBox label="Daily Coverage" value={`₹${quote.dailyCoverage}/day`} />
              <StatBox label="Max Payout"     value={`₹${quote.maxPayout}`} highlight />
              <StatBox label="City"           value={form.city} />
              <StatBox label="Persona"        value={form.deliveryPersona} />
            </div>

            <div style={{ background: "#F7F9FF", border: "1.5px solid #E2E8FF", borderRadius: 10, padding: "14px 16px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Premium Formula</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#4B5563", lineHeight: 1.8 }}>{quote.breakdown?.formula}</div>
            </div>

            {(quote.riskFactors || []).length > 0 && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>Risk Factors</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {quote.riskFactors.map((r, i) => (
                    <span key={i} style={{ background: "#FFFBEB", border: "1.5px solid #FDE68A", borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 600, color: "#92400E" }}>{r}</span>
                  ))}
                </div>
              </div>
            )}

            <div style={{ background: "#F7F9FF", border: "1.5px solid #E2E8FF", borderRadius: 10, padding: "14px 16px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>AI Explanation</div>
              <p style={{ fontSize: 13, color: "#4B5563", lineHeight: 1.7 }}>{quote.aiExplanation}</p>
            </div>

            {error && <ErrBox msg={error} />}
            <div style={{ display: "flex", gap: 10 }}>
              <button style={{ ...S.btnOutline, flex: 1 }} onClick={() => { setError(""); setStep(1); }}>← Revise</button>
              <button style={{ ...S.btnPrimary, flex: 2 }} onClick={activate} disabled={loading}>
                {loading ? "Activating…" : "✓ Activate My Policy"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — Success */}
        {step === 3 && result && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16, textAlign: "center" }}>
            <div style={{ background: "linear-gradient(135deg,#ECFDF5,#D1FAE5)", border: "1.5px solid #6EE7B7", borderRadius: 16, padding: "28px 24px" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
              <div style={{ fontWeight: 800, fontSize: 26, color: "#065F46", marginBottom: 6 }}>You're Protected!</div>
              <div style={{ color: "#059669", fontSize: 14 }}>Your weekly income protection is now active</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, textAlign: "left" }}>
              <StatBox label="Policy ID"      value={result.policyId} />
              <StatBox label="Weekly Premium" value={`₹${result.weeklyPremium}`} highlight />
              <StatBox label="Worker"         value={result.name} />
              <StatBox label="City"           value={result.city} />
            </div>

            <div style={{ background: "#EEF2FF", border: "1.5px solid #C7D2FE", borderRadius: 10, padding: "16px", textAlign: "left" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#4F46E5", marginBottom: 8, letterSpacing: "0.06em" }}>🎉 WHAT'S NEXT?</div>
              <div style={{ fontSize: 13, color: "#4B5563", lineHeight: 1.7 }}>
                Your policy auto-monitors weather & disruptions. If a parametric trigger fires (e.g., rain &gt;8mm), you'll get an instant ₹{result.dailyCoverage} payout via UPI — no forms, no delays.
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button style={{ ...S.btnPrimary, flex: 2 }} onClick={() => nav("/dashboard")}>Go to My Dashboard →</button>
              <button style={{ ...S.btnOutline, flex: 1 }} onClick={() => nav("/triggers")}>Live Triggers</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Header({ icon, title, sub }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <span style={{ fontWeight: 800, fontSize: 18, color: "#1E1B4B" }}>{title}</span>
      </div>
      <p style={{ color: "#9CA3AF", fontSize: 13 }}>{sub}</p>
    </div>
  );
}

function StatBox({ label, value, highlight }) {
  return (
    <div style={{ background: "#F7F9FF", border: "1.5px solid #E2E8FF", borderRadius: 10, padding: "12px 14px" }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{label}</div>
      <div style={{ fontWeight: 700, fontSize: 14, color: highlight ? "#4F46E5" : "#1E1B4B" }}>{value}</div>
    </div>
  );
}

function ErrBox({ msg }) {
  return (
    <div style={{ background: "#FEF2F2", border: "1.5px solid #FECACA", borderRadius: 10, padding: "12px 14px", fontSize: 13, color: "#B91C1C", fontWeight: 600 }}>{msg}</div>
  );
}