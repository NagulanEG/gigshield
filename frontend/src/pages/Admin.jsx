import { useState, useEffect } from "react";

const API = "http://localhost:5000";

export default function Admin() {
  const [workers, setWorkers] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/admin/workers`).then(r => r.json()).catch(() => []),
      fetch(`${API}/admin/claims`).then(r => r.json()).catch(() => []),
    ]).then(([w, c]) => {
      setWorkers(Array.isArray(w) ? w : []);
      setClaims(Array.isArray(c) ? c : []);
      setLoading(false);
    });
  }, []);

  const totalPremium = workers.reduce((s, w) => s + (w.premium || 0), 0);
  const totalPaid = claims.filter(c => c.status === "approved").reduce((s, c) => s + (c.payout || 0), 0);
  const lossRatio = totalPremium ? ((totalPaid / totalPremium) * 100).toFixed(1) : "0.0";

  const planCounts = workers.reduce((acc, w) => {
    acc[w.plan || "Shield Lite"] = (acc[w.plan || "Shield Lite"] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="page">
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div className="page-title">🏢 Admin Portal</div>
          <div className="page-subtitle">GigShield insurer dashboard · Real-time analytics</div>
        </div>
        <span className="badge purple">Admin Only 🔐</span>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card purple">
          <div className="stat-icon purple">👥</div>
          <div className="stat-value">{workers.length}</div>
          <div className="stat-label">Active Workers</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon green">💰</div>
          <div className="stat-value">₹{totalPremium.toFixed(0)}</div>
          <div className="stat-label">Premium Collected</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-icon amber">💸</div>
          <div className="stat-value">₹{totalPaid.toFixed(0)}</div>
          <div className="stat-label">Claims Paid Out</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-icon blue">📈</div>
          <div className="stat-value">{lossRatio}%</div>
          <div className="stat-label">Loss Ratio</div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: "1.25rem" }}>
        {/* Plan Distribution */}
        <div className="card">
          <div className="card-title">Plan Distribution</div>
          {Object.keys(planCounts).length === 0 ? (
            <div className="empty-state" style={{ padding: "1.5rem" }}>
              <div className="icon">📊</div>
              <div>No workers yet</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {Object.entries(planCounts).map(([plan, count]) => {
                const pct = workers.length ? Math.round((count / workers.length) * 100) : 0;
                const colors = { "Shield Lite": "var(--blue)", "Full Shield": "var(--primary)", "Max Shield": "var(--purple)" };
                const col = colors[plan] || "var(--primary)";
                return (
                  <div key={plan}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.83rem", marginBottom: "5px" }}>
                      <span style={{ fontWeight: 600, color: "var(--text-2)" }}>{plan}</span>
                      <span style={{ fontWeight: 700, color: col }}>{count} workers · {pct}%</span>
                    </div>
                    <div style={{ height: 8, background: "var(--border)", borderRadius: 10, overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: col, borderRadius: 10, transition: "width 0.8s ease" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Financial Summary */}
        <div className="card">
          <div className="card-title">Financial Summary</div>
          <div>
            {[
              { key: "Gross Premium", val: `₹${totalPremium.toFixed(2)}` },
              { key: "Claims Paid", val: `₹${totalPaid.toFixed(2)}` },
              { key: "Net Revenue", val: `₹${(totalPremium - totalPaid).toFixed(2)}` },
              { key: "Loss Ratio", val: `${lossRatio}%` },
              { key: "Total Claims Filed", val: claims.length },
              { key: "Approval Rate", val: claims.length ? `${Math.round((claims.filter(c => c.status === "approved").length / claims.length) * 100)}%` : "—" },
            ].map(row => (
              <div className="admin-stat" key={row.key}>
                <span className="key">{row.key}</span>
                <span className="val" style={{ color: row.key === "Net Revenue" ? "var(--green)" : row.key === "Loss Ratio" ? (parseFloat(lossRatio) > 80 ? "var(--red)" : "var(--text)") : "var(--text)" }}>
                  {row.val}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Workers Table */}
      <div className="card">
        <div className="card-title">Registered Workers</div>
        {loading ? (
          <div className="empty-state"><div className="icon">⏳</div><div>Loading...</div></div>
        ) : workers.length === 0 ? (
          <div className="empty-state">
            <div className="icon">👥</div>
            <div className="title">No workers yet</div>
            <div>Workers will appear after onboarding</div>
          </div>
        ) : (
          <div>
            {workers.map(w => (
              <div className="worker-row" key={w.id}>
                <div className="worker-avatar">{w.name?.[0] || "W"}</div>
                <div style={{ flex: 1 }}>
                  <div className="worker-name">{w.name}</div>
                  <div className="worker-meta">{w.platform || "Delivery"} · {w.city || "India"}</div>
                </div>
                <span className="badge purple">{w.plan || "Shield Lite"}</span>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text)" }}>₹{(w.premium || 0).toFixed(2)}/mo</div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-3)" }}>premium</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Claims */}
      {claims.length > 0 && (
        <div className="card" style={{ marginTop: "1.25rem" }}>
          <div className="card-title">Recent Claims (All Workers)</div>
          <div className="claims-list">
            {[...claims].reverse().slice(0, 8).map(c => (
              <div className="claim-item" key={c.id}>
                <div className={`claim-dot ${c.status === "approved" ? "green" : c.status === "pending" ? "amber" : "red"}`} />
                <div className="claim-info">
                  <div className="claim-type">{c.triggerType || "rain"} · <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem" }}>{c.workerId?.slice(-6)}</span></div>
                  <div className="claim-id">{c.id}</div>
                </div>
                <span className={`badge ${c.status === "approved" ? "green" : c.status === "pending" ? "amber" : "red"}`}>{c.status}</span>
                <div className="claim-amount">₹{c.payout || 0}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}