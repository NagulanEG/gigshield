import { useState, useEffect } from "react";

const API = "http://localhost:5000";

export default function Claims() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const workerId = localStorage.getItem("workerId");

  useEffect(() => {
    if (!workerId) return;
    fetch(`${API}/claims/${workerId}`)
      .then(r => r.json())
      .then(d => { setClaims(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [workerId]);

  const approved = claims.filter(c => c.status === "approved");
  const totalPaid = approved.reduce((s, c) => s + (c.payout || 0), 0);
  const approvalRate = claims.length ? Math.round((approved.length / claims.length) * 100) : 0;

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">📋 My Claims</div>
        <div className="page-subtitle">Full history of your GigShield payouts</div>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", marginBottom: "1.5rem" }}>
        <div className="stat-card purple">
          <div className="stat-icon purple">📋</div>
          <div className="stat-value">{claims.length}</div>
          <div className="stat-label">Total Claims</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon green">💸</div>
          <div className="stat-value">₹{totalPaid.toFixed(0)}</div>
          <div className="stat-label">Total Received</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-icon blue">✅</div>
          <div className="stat-value">{approvalRate}%</div>
          <div className="stat-label">Approval Rate</div>
        </div>
      </div>

      {/* Claims List */}
      <div className="card">
        <div className="card-title">Claims Timeline</div>

        {loading ? (
          <div className="empty-state">
            <div className="icon">⏳</div>
            <div>Loading claims...</div>
          </div>
        ) : claims.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📭</div>
            <div className="title">No claims yet</div>
            <div>Head to Live Triggers to simulate a weather event</div>
          </div>
        ) : (
          <div className="claims-list">
            {[...claims].reverse().map((c, i) => (
              <div
                key={c.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "16px",
                  background: i % 2 === 0 ? "var(--surface2)" : "var(--surface)",
                  border: "1.5px solid var(--border)",
                  borderRadius: "var(--radius-sm)",
                  transition: "box-shadow 0.18s",
                }}
              >
                {/* Trigger Icon */}
                <div style={{
                  width: 44, height: 44,
                  borderRadius: "12px",
                  background: c.status === "approved" ? "var(--green-light)" : c.status === "pending" ? "var(--accent-light)" : "var(--red-light)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.2rem", flexShrink: 0,
                }}>
                  {c.triggerType === "rain" ? "🌧️" : c.triggerType === "outage" ? "📡" : c.triggerType === "wind" ? "💨" : "⚡"}
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text)" }}>
                    {c.triggerType?.charAt(0).toUpperCase() + c.triggerType?.slice(1) || "Weather"} Trigger
                    {c.source === "live-weather" && (
                      <span className="badge blue" style={{ marginLeft: "8px" }}>Live Data</span>
                    )}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-3)", fontFamily: "'DM Mono', monospace", marginTop: "2px" }}>
                    {c.id}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-3)", marginTop: "2px" }}>
                    {c.severity || "moderate"} severity · {c.date ? new Date(c.date).toLocaleDateString() : "Today"}
                  </div>
                </div>

                {/* Status */}
                <span className={`badge ${c.status === "approved" ? "green" : c.status === "pending" ? "amber" : "red"}`}>
                  {c.status === "approved" ? "✅ " : c.status === "pending" ? "⏳ " : "❌ "}
                  {c.status}
                </span>

                {/* Payout */}
                <div style={{ textAlign: "right", minWidth: 70 }}>
                  <div style={{ fontSize: "1.1rem", fontWeight: 800, color: c.status === "approved" ? "var(--green)" : "var(--text-3)" }}>
                    ₹{c.payout || 0}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-3)" }}>payout</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {claims.length > 0 && (
          <div style={{ marginTop: "1.25rem", padding: "14px 16px", background: "var(--primary-light)", borderRadius: "var(--radius-sm)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 700, color: "var(--primary)", fontSize: "0.875rem" }}>
              🎉 Lifetime Total
            </span>
            <span style={{ fontWeight: 800, fontSize: "1.25rem", color: "var(--primary)" }}>
              ₹{totalPaid.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="card" style={{ marginTop: "1.25rem" }}>
        <div className="card-title">Trigger Reference</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
          {[
            { icon: "🌧️", name: "Heavy Rain", desc: "> 10mm precipitation" },
            { icon: "💨", name: "High Wind", desc: "> 40 km/h wind speed" },
            { icon: "🌡️", name: "Extreme Heat", desc: "> 38°C temperature" },
            { icon: "📡", name: "Net Outage", desc: "ISP disruption detected" },
            { icon: "📉", name: "Low Demand", desc: "Orders drop > 40%" },
            { icon: "🌀", name: "Storm Alert", desc: "Govt weather warning" },
          ].map(t => (
            <div key={t.name} style={{ padding: "10px 12px", background: "var(--surface2)", borderRadius: "8px", display: "flex", gap: "10px", alignItems: "center" }}>
              <span style={{ fontSize: "1.2rem" }}>{t.icon}</span>
              <div>
                <div style={{ fontSize: "0.8rem", fontWeight: 700 }}>{t.name}</div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-3)" }}>{t.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}