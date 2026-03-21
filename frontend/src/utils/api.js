const BASE = "http://localhost:5000";
const j = { "Content-Type": "application/json" };
const post = (url, body) => fetch(`${BASE}${url}`, { method:"POST", headers:j, body:JSON.stringify(body) }).then(r=>r.json());
const get  = (url) => fetch(`${BASE}${url}`).then(r=>r.json());

export const api = {
  register:     (d)  => post("/register", d),
  login:        (d)  => post("/login", d),
  getWorker:    (id) => get(`/worker/${id}`),
  getQuote:     (d)  => post("/quote", d),
  checkTrigger: (p)  => get(`/trigger/check${p ? "?"+new URLSearchParams(p) : ""}`),
  autoClaim:    (d)  => post("/claim/auto", d),
  payout:       (d)  => post("/payout", d),
  getClaims:    (id) => get(`/claims/${id}`),
  getPlans:     ()   => get("/plans"),
  adminWorkers: ()   => get("/admin/workers"),
  adminStats:   ()   => get("/admin/stats"),
};

export const CITIES_COORDS = {
  Mumbai:    { lat:19.0760, lon:72.8777 },
  Delhi:     { lat:28.6139, lon:77.2090 },
  Bangalore: { lat:12.9716, lon:77.5946 },
  Hyderabad: { lat:17.3850, lon:78.4867 },
  Chennai:   { lat:13.0827, lon:80.2707 },
  Kolkata:   { lat:22.5726, lon:88.3639 },
};

export async function fetchWeather(city) {
  const c = CITIES_COORDS[city];
  if (!c) return null;
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&current=temperature_2m,weathercode,windspeed_10m,precipitation&timezone=auto`;
    const data = await fetch(url).then(r=>r.json());
    const cur = data.current;
    return { city, temp:cur.temperature_2m, rainfall:cur.precipitation, windspeed:cur.windspeed_10m, weathercode:cur.weathercode, condition:getCondition(cur.weathercode), icon:getIcon(cur.weathercode), updatedAt:cur.time };
  } catch { return null; }
}

export async function fetchAllCitiesWeather() {
  const results = await Promise.allSettled(Object.keys(CITIES_COORDS).map(fetchWeather));
  return results.filter(r => r.status==="fulfilled" && r.value).map(r => r.value);
}

function getCondition(code) {
  if (code===0) return "Clear Sky"; if (code<=3) return "Partly Cloudy"; if (code<=9) return "Overcast";
  if (code<=19) return "Foggy"; if (code<=39) return "Rain Showers"; if (code<=69) return "Heavy Rain";
  if (code<=84) return "Rain Showers"; if (code<=94) return "Thunderstorm"; return "Heavy Thunderstorm";
}
function getIcon(code) {
  if (code===0) return "☀️"; if (code<=3) return "⛅"; if (code<=9) return "☁️";
  if (code<=19) return "🌫️"; if (code<=39) return "🌧️"; if (code<=69) return "⛈️"; return "⛈️";
}