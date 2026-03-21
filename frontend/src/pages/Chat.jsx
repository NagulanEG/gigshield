import { useState, useRef, useEffect } from "react";

const BOT_REPLIES = {
  "how does it work": "GigShield uses parametric insurance 🌧️ — when real weather data hits our thresholds (e.g. >10mm rain), you're auto-paid. No forms, no waiting, no drama!",
  "when do i get paid": "💸 Payouts land in your UPI within minutes of a trigger. Our system detects the event, validates it, and sends funds — fully automated!",
  "what triggers a claim": "Claims fire when: 🌧️ Rain > 10mm · 💨 Wind > 40km/h · 🌡️ Temp > 38°C · 📡 Internet outage detected · 📉 Platform demand drops > 40%",
  "how is premium calculated": "Your premium = Base Rate × Risk Multiplier × Plan Factor. Base is ₹79/month. Risk goes up if you're in a high-rainfall or outage-prone city. 📊",
  "upgrade plan": "To upgrade from Shield Lite → Full Shield → Max Shield, go to your dashboard and hit 'Upgrade Plan'. Max Shield covers up to ₹10,000/month! 🚀",
  "fraud": "Our fraud AI flags accounts with 3+ claims in 7 days for review. Legitimate bad-weather claims always pass. We protect honest workers 💙",
  "contact": "Reach us at support@gigshield.in or WhatsApp +91-9000000000. We reply within 2 hours! 🙋",
};

const QUICK = [
  "How does it work?",
  "When do I get paid?",
  "What triggers a claim?",
  "How is premium calculated?",
  "Upgrade plan",
];

function getReply(input) {
  const lower = input.toLowerCase();
  for (const [key, val] of Object.entries(BOT_REPLIES)) {
    if (lower.includes(key)) return val;
  }
  return "I'm not sure about that one 🤔 Try asking about triggers, payouts, premium calculation, or plan upgrades! Or type 'contact' to reach our team.";
}

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hey! 👋 I'm GigShield AI. I can help you understand your coverage, explain triggers, or answer billing questions. What would you like to know?" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: msg }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { role: "bot", text: getReply(msg) }]);
    }, 900);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">💬 AI Support Chat</div>
        <div className="page-subtitle">Ask anything about your GigShield coverage</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "1.25rem" }}>
        {/* Chat */}
        <div className="chat-container">
          <div className="chat-header">
            <div className="chat-avatar">🤖</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>GigShield AI</div>
              <div style={{ fontSize: "0.75rem", opacity: 0.8 }}>● Online · Replies instantly</div>
            </div>
          </div>

          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.role}`}>{m.text}</div>
            ))}
            {typing && (
              <div className="msg bot" style={{ display: "flex", gap: "4px", alignItems: "center", padding: "12px 16px" }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--text-3)", animation: "bounce 0.9s ease infinite" }} />
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--text-3)", animation: "bounce 0.9s ease 0.2s infinite" }} />
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--text-3)", animation: "bounce 0.9s ease 0.4s infinite" }} />
                <style>{`@keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }`}</style>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="chat-quick-replies">
            {QUICK.map(q => (
              <button key={q} className="quick-reply" onClick={() => send(q)}>{q}</button>
            ))}
          </div>

          <div className="chat-input-row">
            <input
              className="chat-input"
              placeholder="Ask about triggers, payouts, plans..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
            />
            <button className="btn btn-primary btn-sm" onClick={() => send()}>Send ↑</button>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div className="card">
            <div className="card-title">Common Topics</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                { icon: "⚡", label: "Trigger Conditions" },
                { icon: "💸", label: "Payout Process" },
                { icon: "📊", label: "Premium Formula" },
                { icon: "🚀", label: "Plan Upgrades" },
                { icon: "🔐", label: "Fraud Protection" },
                { icon: "📞", label: "Contact Support" },
              ].map(t => (
                <button
                  key={t.label}
                  onClick={() => send(t.label.toLowerCase())}
                  style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    padding: "9px 12px", borderRadius: "8px",
                    background: "var(--surface2)", border: "1.5px solid var(--border)",
                    cursor: "pointer", fontFamily: "inherit", fontSize: "0.83rem",
                    fontWeight: 600, color: "var(--text-2)", transition: "all 0.15s",
                    textAlign: "left",
                  }}
                  onMouseEnter={e => { e.target.style.background = "var(--primary-light)"; e.target.style.borderColor = "var(--primary)"; e.target.style.color = "var(--primary)"; }}
                  onMouseLeave={e => { e.target.style.background = "var(--surface2)"; e.target.style.borderColor = "var(--border)"; e.target.style.color = "var(--text-2)"; }}
                >
                  <span>{t.icon}</span> {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="card" style={{ background: "linear-gradient(135deg, var(--primary-light), var(--purple-light))", borderColor: "#C7D2FE" }}>
            <div style={{ fontSize: "1.5rem", marginBottom: "8px" }}>📱</div>
            <div style={{ fontWeight: 800, fontSize: "0.9rem", color: "var(--primary)", marginBottom: "4px" }}>Need Human Help?</div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-2)", lineHeight: 1.5 }}>
              WhatsApp us at<br />
              <strong>+91-9000000000</strong><br />
              Mon–Sat, 9AM–6PM IST
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}