import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const API = "http://localhost:5000";

export default function Dashboard() {
  const navigate = useNavigate();
  const [worker, setWorker] = useState(null);
  const [claims, setClaims] = useState([]);
  const [simulating, setSimulating] = useState(false);
  const [payout, setPayout] = useState(null);
  const workerId = localStorage.getItem("workerId");

  useEffect(() => {
    if (!workerId) { navigate("/onboard"); return; }
    fetch(`${API}/worker/${workerId}`).then(r => r.json()).then(setWorker);
    fetch(`${API}/claims/${workerId}`).then(r => r.json()).then(setClaims);
  }, [workerId]);

  const simulate = async () => {
    setSimulating(true); setPayout(null);
    try {
      const r = await fetch(`${API}/simulate-trigger`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workerId }),
      });
      const d = await r.json();
      setPayout(d);
      fetch(`${API}/claims/${workerId}`).then(r => r.json()).then(setClaims);
    } catch (e) { console.error(e); }
    setSimulating(false);
  };

  if (!worker) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
      <div style={{ textAlign: "center", color: "var(--text-3)" }}>
        <div style={{ fontSize: "2rem", marginBottom: "8px" }}>⚡</div>
        <div style={{ fontWeight: 600 }}>Loading GigShield...</div>
      </div>
    </div>
  );

  const premium = worker.premium || 99.94;
  const totalPaid = claims.filter(c => c.status === "approved").reduce((s, c) => s + (c.payout || 0), 0);
  const fraudFlag = claims.length >= 3;

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div className="page-title">Welcome back, {worker.name?.split(" ")[0]} 👋</div>
          <div className="page-subtitle">Your income is protected · Policy active since today</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, var(--primary), var(--purple))", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1rem" }}>
            {worker.name?.[0] || "W"}
          </div>
          <div>
            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text)" }}>{worker.name}</div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-3)" }}>{worker.platform || "Delivery Worker"}</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card purple">
          <div className="stat-icon purple">🛡️</div>
          <div className="stat-value">₹{(worker.coverage || 5000).toLocaleString()}</div>
          <div className="stat-label">Monthly Coverage</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon green">💸</div>
          <div className="stat-value">₹{totalPaid.toFixed(0)}</div>
          <div className="stat-label">Total Received</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-icon amber">📋</div>
          <div className="stat-value">{claims.length}</div>
          <div className="stat-label">Total Claims</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-icon blue">⚡</div>
          <div className="stat-value">₹{premium.toFixed(2)}</div>
          <div className="stat-label">Monthly Premium</div>
        </div>
      </div>

      {/* Payout notification */}
      {payout && (
        <div className="payout-card" style={{ marginBottom: "1.25rem" }}>
          <div className="payout-icon">💸</div>
          <div style={{ flex: 1 }}>
            <div className="payout-amount">₹{payout.payout} Credited!</div>
            <div className="payout-label">UPI Simulated · {payout.claimId}</div>
            <div className="payout-txn">TXN-{payout.txnId || Math.random().toString(36).slice(2,10).toUpperCase()}</div>
          </div>
          <span className="badge green">✅ Auto-Approved</span>
        </div>
      )}

      <div className="grid-2" style={{ marginBottom: "1.25rem" }}>
        {/* Policy Card */}
        <div className="policy-card">
          <div className="policy-badge">🛡️ ACTIVE POLICY</div>
          <div className="policy-amount">₹{(worker.coverage || 5000).toLocaleString()}/mo</div>
          <div className="policy-meta">{worker.plan || "Full Shield"} Plan · Parametric Coverage</div>
          <div className="policy-details">
            <div className="policy-detail-row">
              <span className="label">Policy ID</span>
              <span className="value" style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem" }}>POL-{workerId?.slice(-6).toUpperCase()}</span>
            </div>
            <div className="policy-detail-row">
              <span className="label">Platform</span>
              <span className="value">{worker.platform || "Zomato"}</span>
            </div>
            <div className="policy-detail-row">
              <span className="label">City</span>
              <span className="value">{worker.city || "Mumbai"}</span>
            </div>
            <div className="policy-detail-row">
              <span className="label">Triggers</span>
              <span className="value">Rain · Outage · Low Demand</span>
            </div>
          </div>
          <button className="btn btn-accent" style={{ marginTop: "1.25rem", width: "100%", justifyContent: "center" }} onClick={simulate} disabled={simulating}>
            {simulating ? "⏳ Processing..." : "🌧️ Simulate Rain / Outage"}
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Fraud Check */}
          <div className="card">
            <div className="card-title">Fraud Detection</div>
            {fraudFlag ? (
              <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px", background: "var(--red-light)", borderRadius: "10px" }}>
                <span style={{ fontSize: "1.3rem" }}>⚠️</span>
                <div>
                  <div style={{ fontWeight: 700, color: "var(--red)", fontSize: "0.875rem" }}>Review Flagged</div>
                  <div style={{ fontSize: "0.75rem", color: "#B91C1C" }}>3+ claims in 7 days · Manual check</div>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px", background: "var(--green-light)", borderRadius: "10px" }}>
                <span style={{ fontSize: "1.3rem" }}>✅</span>
                <div>
                  <div style={{ fontWeight: 700, color: "#065F46", fontSize: "0.875rem" }}>Account Verified</div>
                  <div style={{ fontSize: "0.75rem", color: "#059669" }}>No suspicious activity detected</div>
                </div>
              </div>
            )}
          </div>

          {/* Risk Factors */}
          <div className="card" style={{ flex: 1 }}>
            <div className="card-title">Active Risk Factors</div>
            <div className="risk-list">
              {["🌀 Cyclone Season Active", "🌧️ Heavy Northeast Monsoon", "📡 ISP Outages Tracked", "📉 Weekend Demand Dip"].map(r => (
                <div className="risk-item" key={r}>{r}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Premium Breakdown */}
      <div className="card" style={{ marginBottom: "1.25rem" }}>
        <div className="card-title">Premium Breakdown</div>
        <div style={{ marginBottom: "0.75rem", fontSize: "0.82rem", color: "var(--text-2)" }}>
          Base × Risk Multiplier × Plan = Monthly Premium
        </div>
        <div className="formula-box">
          <span className="formula-val">₹{(worker.baseRate || 79)}</span>
          <span className="formula-op">×</span>
          <span className="formula-val">{(worker.riskMultiplier || 1.15).toFixed(2)}</span>
          <span className="formula-op">×</span>
          <span className="formula-val">{(worker.planMultiplier || 1.0).toFixed(1)}</span>
          <span className="formula-op">=</span>
          <span className="formula-result">₹{premium.toFixed(2)}/mo</span>
        </div>
      </div>

      {/* Recent Claims */}
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <div className="card-title" style={{ margin: 0 }}>Recent Claims ({claims.length})</div>
          <Link to="/claims" style={{ fontSize: "0.8rem", color: "var(--primary)", fontWeight: 700, textDecoration: "none" }}>View All →</Link>
        </div>
        {claims.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📋</div>
            <div className="title">No claims yet</div>
            <div>Simulate a weather event to trigger your first claim!</div>
          </div>
        ) : (
          <div className="claims-list">
            {claims.slice(-3).reverse().map(c => (
              <div className="claim-item" key={c.id}>
                <div className={`claim-dot ${c.status === "approved" ? "green" : c.status === "pending" ? "amber" : "red"}`} />
                <div className="claim-info">
                  <div className="claim-type">🌧️ {c.triggerType || "Rain"} · <span style={{ fontSize: "0.8rem", color: "var(--text-3)" }}>{c.severity || "moderate"} severity</span></div>
                  <div className="claim-id">{c.id}</div>
                </div>
                <span className={`badge ${c.status === "approved" ? "green" : c.status === "pending" ? "amber" : "red"}`}>
                  {c.status}
                </span>
                <div className="claim-amount">₹{c.payout || 0}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}