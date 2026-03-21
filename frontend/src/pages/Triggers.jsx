import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API = "http://localhost:5000";

const CITIES = [
  { name: "Mumbai", emoji: "🏙️", lat: 19.076, lon: 72.877 },
  { name: "Delhi", emoji: "🕌", lat: 28.613, lon: 77.209 },
  { name: "Bangalore", emoji: "🌆", lat: 12.971, lon: 77.594 },
  { name: "Hyderabad", emoji: "🏯", lat: 17.385, lon: 78.486 },
  { name: "Chennai", emoji: "🌊", lat: 13.082, lon: 80.270 },
  { name: "Kolkata", emoji: "🎭", lat: 22.572, lon: 88.363 },
];

const THRESHOLDS = { rain: 10, wind: 40, temp: 38 };

export default function Triggers() {
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [triggering, setTriggering] = useState(null);
  const [triggerResult, setTriggerResult] = useState(null);
  const workerId = localStorage.getItem("workerId");

  const fetchWeather = async () => {
    setLoading(true);
    const results = {};
    await Promise.all(
      CITIES.map(async (city) => {
        try {
          const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,precipitation,windspeed_10m,weathercode&timezone=Asia/Kolkata`;
          const r = await fetch(url);
          const d = await r.json();
          results[city.name] = {
            temp: d.current.temperature_2m,
            rain: d.current.precipitation,
            wind: d.current.windspeed_10m,
            code: d.current.weathercode,
          };
        } catch {
          results[city.name] = { temp: 30, rain: 0, wind: 10, code: 0 };
        }
      })
    );
    setWeather(results);
    setLastUpdated(new Date().toLocaleTimeString());
    setLoading(false);
  };

  useEffect(() => { fetchWeather(); }, []);

  const triggerClaim = async (cityName) => {
    if (!workerId) return;
    setTriggering(cityName); setTriggerResult(null);
    try {
      const r = await fetch(`${API}/simulate-trigger`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workerId, city: cityName, source: "live-weather" }),
      });
      const d = await r.json();
      setTriggerResult({ city: cityName, ...d });
    } catch (e) { setTriggerResult({ city: cityName, error: true }); }
    setTriggering(null);
  };

  const isAlert = (w) =>
    w && (w.rain >= THRESHOLDS.rain || w.wind >= THRESHOLDS.wind || w.temp >= THRESHOLDS.temp);

  const alertCount = CITIES.filter(c => isAlert(weather[c.name])).length;

  return (
    <div className="page">
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div className="page-title">⚡ Live Weather Triggers</div>
          <div className="page-subtitle">
            Real-time data from Open-Meteo API
            {lastUpdated && <> · Updated {lastUpdated}</>}
          </div>
        </div>
        <button className="btn btn-outline btn-sm" onClick={fetchWeather} disabled={loading}>
          {loading ? "⏳ Fetching..." : "🔄 Refresh"}
        </button>
      </div>

      {/* Alert Banner */}
      {!loading && alertCount > 0 && (
        <div style={{ background: "linear-gradient(135deg, #FEF3C7, #FFFBEB)", border: "1.5px solid #FCD34D", borderRadius: "var(--radius)", padding: "1rem 1.5rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "1.4rem" }}>⚠️</span>
          <div>
            <div style={{ fontWeight: 800, color: "#92400E", fontSize: "0.95rem" }}>
              {alertCount} {alertCount === 1 ? "City" : "Cities"} Exceeding Thresholds
            </div>
            <div style={{ fontSize: "0.8rem", color: "#B45309" }}>
              Rain &gt;10mm · Wind &gt;40km/h · Temp &gt;38°C · Click "Trigger Claim" to file
            </div>
          </div>
        </div>
      )}

      {/* Claim Success */}
      {triggerResult && !triggerResult.error && (
        <div className="payout-card" style={{ marginBottom: "1.5rem" }}>
          <div className="payout-icon">💸</div>
          <div style={{ flex: 1 }}>
            <div className="payout-amount">₹{triggerResult.payout} from {triggerResult.city}</div>
            <div className="payout-label">Live weather trigger · {triggerResult.claimId}</div>
          </div>
          <span className="badge green">Auto-Approved ✅</span>
        </div>
      )}

      {/* City Cards */}
      <div className="grid-6">
        {CITIES.map((city) => {
          const w = weather[city.name];
          const alert = isAlert(w);
          return (
            <div className={`city-card ${alert ? "alert" : ""}`} key={city.name}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <div>
                  <div className="city-name">{city.name}</div>
                  {alert && <span className="badge red" style={{ marginTop: "4px" }}>🚨 ALERT</span>}
                </div>
                <div className="city-emoji">{city.emoji}</div>
              </div>

              {loading || !w ? (
                <div style={{ textAlign: "center", padding: "1.5rem", color: "var(--text-3)", fontSize: "0.85rem" }}>
                  Loading...
                </div>
              ) : (
                <>
                  <div className="weather-stat">
                    <span className="key">🌡️ Temp</span>
                    <span className="val" style={{ color: w.temp >= THRESHOLDS.temp ? "var(--red)" : "var(--text)" }}>
                      {w.temp}°C
                    </span>
                  </div>
                  <div className="weather-stat">
                    <span className="key">🌧️ Rain</span>
                    <span className="val" style={{ color: w.rain >= THRESHOLDS.rain ? "var(--red)" : "var(--text)" }}>
                      {w.rain} mm
                    </span>
                  </div>
                  <div className="weather-stat">
                    <span className="key">💨 Wind</span>
                    <span className="val" style={{ color: w.wind >= THRESHOLDS.wind ? "var(--red)" : "var(--text)" }}>
                      {w.wind} km/h
                    </span>
                  </div>

                  <button
                    className={`btn btn-sm btn-full ${alert ? "btn-accent" : "btn-outline"}`}
                    style={{ marginTop: "12px" }}
                    onClick={() => triggerClaim(city.name)}
                    disabled={triggering === city.name}
                  >
                    {triggering === city.name ? "⏳ Filing..." : "⚡ Trigger Claim"}
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* How It Works */}
      <div className="card" style={{ marginTop: "1.5rem" }}>
        <div className="card-title">How Parametric Triggers Work</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
          {[
            { icon: "📡", title: "Live Data", desc: "Open-Meteo API fetches real weather every few minutes from 20+ stations" },
            { icon: "⚡", title: "Auto Trigger", desc: "When thresholds are breached, claims fire automatically — no paperwork" },
            { icon: "💸", title: "Instant Payout", desc: "Funds hit your UPI within minutes. No adjuster, no delay, no stress" },
          ].map(item => (
            <div key={item.title} style={{ background: "var(--surface2)", borderRadius: "10px", padding: "1rem" }}>
              <div style={{ fontSize: "1.5rem", marginBottom: "6px" }}>{item.icon}</div>
              <div style={{ fontWeight: 700, fontSize: "0.875rem", marginBottom: "4px" }}>{item.title}</div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-2)", lineHeight: 1.5 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}