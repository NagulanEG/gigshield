import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";

const ZONES = ["Adyar","T Nagar","Anna Nagar","Velachery","OMR","Tambaram","Porur","Guindy","Chromepet","Sholinganallur"];

const PLANS = [
  {
    id: "Basic", emoji: "🛡️", price: "₹49", period: "/week",
    max: "₹375 max payout",
    color: "border-blue-500/30 bg-blue-500/5",
    active: "border-blue-400 bg-blue-500/10 shadow-blue-500/20",
    badge: "bg-blue-500/15 text-blue-300",
    desc: "Rain & platform outage cover",
  },
  {
    id: "Full", emoji: "⚡", price: "₹79", period: "/week",
    max: "₹625 max payout",
    color: "border-amber-500/30 bg-amber-500/5",
    active: "border-amber-400 bg-amber-500/10 shadow-amber-500/20",
    badge: "bg-amber-500/15 text-amber-300",
    desc: "Full weather + platform cover",
    recommended: true,
  },
  {
    id: "Pro", emoji: "🚀", price: "₹119", period: "/week",
    max: "₹900 max payout",
    color: "border-purple-500/30 bg-purple-500/5",
    active: "border-purple-400 bg-purple-500/10 shadow-purple-500/20",
    badge: "bg-purple-500/15 text-purple-300",
    desc: "All risks + cyclone & flood",
  },
];

export default function Register() {
  const nav = useNavigate();
  const [form, setForm] = useState({ phoneNumber:"", name:"", zone:"", dailyIncome:"", selectedPlan:"Full" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.name || !form.phoneNumber || !form.zone || !form.dailyIncome) {
      setError("Please fill in all fields."); return;
    }
    if (!/^\d{10}$/.test(form.phoneNumber)) {
      setError("Enter a valid 10-digit phone number."); return;
    }
    setLoading(true); setError("");
    try {
      const data = await api.register(form);
      if (data.error) { setError(data.error); return; }
      localStorage.setItem("workerId", data.workerId);
      nav("/dashboard");
    } catch {
      setError("Cannot connect to server. Make sure backend is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  const selectedPlan = PLANS.find(p => p.id === form.selectedPlan);

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"32px 16px" }}>

      {/* Logo */}
      <div className="anim-up" style={{ textAlign:"center", marginBottom:"36px" }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:"12px", marginBottom:"8px" }}>
          <div style={{ width:44, height:44, background:"linear-gradient(135deg,#F5A623,#F7C05A)", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>🛡️</div>
          <span style={{ fontFamily:"Syne,sans-serif", fontSize:28, fontWeight:800, letterSpacing:"-0.02em" }}>GigShield</span>
        </div>
        <p style={{ color:"rgba(255,255,255,0.35)", fontSize:14, fontFamily:"JetBrains Mono,monospace" }}>AI-Powered Income Protection for Delivery Workers</p>
      </div>

      {/* Card */}
      <div className="glass anim-up-2" style={{ width:"100%", maxWidth:460, padding:"36px 32px" }}>
        <h2 style={{ fontFamily:"Syne,sans-serif", fontSize:22, fontWeight:700, marginBottom:4 }}>Create your account</h2>
        <p style={{ color:"rgba(255,255,255,0.35)", fontSize:14, marginBottom:28 }}>Get protected in under 2 minutes — no paperwork.</p>

        <div style={{ display:"flex", flexDirection:"column", gap:18 }}>

          {/* Name */}
          <div>
            <label className="label">Full Name</label>
            <input className="input" placeholder="Ravi Kumar" value={form.name} onChange={e => set("name", e.target.value)} />
          </div>

          {/* Phone */}
          <div>
            <label className="label">Mobile Number</label>
            <input className="input" placeholder="9876543210" maxLength={10} value={form.phoneNumber} onChange={e => set("phoneNumber", e.target.value.replace(/\D/g,""))} />
          </div>

          {/* Zone */}
          <div>
            <label className="label">Delivery Zone</label>
            <select className="input" value={form.zone} onChange={e => set("zone", e.target.value)} style={{ cursor:"pointer" }}>
              <option value="">Select your zone</option>
              {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
            </select>
          </div>

          {/* Income */}
          <div>
            <label className="label">Average Daily Income (₹)</label>
            <input className="input" type="number" placeholder="750" min={100} value={form.dailyIncome} onChange={e => set("dailyIncome", e.target.value)} />
          </div>

          {/* Plans */}
          <div>
            <label className="label">Protection Plan</label>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
              {PLANS.map(p => (
                <button key={p.id} onClick={() => set("selectedPlan", p.id)}
                  style={{
                    position:"relative", border:`1.5px solid`, borderRadius:14, padding:"14px 10px",
                    textAlign:"left", cursor:"pointer", transition:"all 0.2s ease",
                    borderColor: form.selectedPlan === p.id ? (p.id==="Basic"?"#60a5fa":p.id==="Full"?"#f5a623":"#a78bfa") : "rgba(255,255,255,0.1)",
                    background: form.selectedPlan === p.id ? (p.id==="Basic"?"rgba(96,165,250,0.08)":p.id==="Full"?"rgba(245,166,35,0.08)":"rgba(167,139,250,0.08)") : "rgba(255,255,255,0.02)",
                    boxShadow: form.selectedPlan === p.id ? `0 4px 20px ${p.id==="Basic"?"rgba(96,165,250,0.15)":p.id==="Full"?"rgba(245,166,35,0.15)":"rgba(167,139,250,0.15)"}` : "none",
                    transform: form.selectedPlan === p.id ? "translateY(-1px)" : "none",
                  }}>
                  {p.recommended && (
                    <div style={{ position:"absolute", top:-10, left:"50%", transform:"translateX(-50%)", background:"linear-gradient(135deg,#F5A623,#F7C05A)", color:"#0A0D14", fontSize:9, fontFamily:"JetBrains Mono,monospace", fontWeight:700, padding:"2px 8px", borderRadius:20, whiteSpace:"nowrap" }}>POPULAR</div>
                  )}
                  <div style={{ fontSize:18, marginBottom:6 }}>{p.emoji}</div>
                  <div style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:14, color:"#fff" }}>{p.id}</div>
                  <div style={{ fontFamily:"Syne,sans-serif", fontWeight:600, fontSize:16, color: p.id==="Basic"?"#60a5fa":p.id==="Full"?"#F5A623":"#a78bfa", marginTop:2 }}>{p.price}<span style={{ fontSize:11, fontWeight:400, color:"rgba(255,255,255,0.4)" }}>{p.period}</span></div>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", fontFamily:"JetBrains Mono,monospace", marginTop:4 }}>{p.max}</div>
                </button>
              ))}
            </div>
            {selectedPlan && (
              <p style={{ fontFamily:"JetBrains Mono,monospace", fontSize:11, color:"rgba(255,255,255,0.3)", marginTop:8 }}>
                {selectedPlan.emoji} {selectedPlan.desc}
              </p>
            )}
          </div>

          {/* Error */}
          {error && (
            <div style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.25)", borderRadius:12, padding:"12px 16px", color:"#fca5a5", fontSize:13, fontFamily:"DM Sans,sans-serif" }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <button className="btn-gold" onClick={submit} disabled={loading} style={{ width:"100%", fontSize:16, marginTop:4 }}>
            {loading ? "Setting up your shield…" : "Get Protected Now →"}
          </button>
        </div>
      </div>

      <p style={{ color:"rgba(255,255,255,0.15)", fontSize:11, fontFamily:"JetBrains Mono,monospace", marginTop:20 }}>
        Hackathon Demo · Simulated data only
      </p>
    </div>
  );
}