# 🛡️ GigShield — AI-Powered Income Protection for Delivery Workers
> Hackathon Prototype · Fully Simulated

---

## 📁 Folder Structure

```
gigshield/
├── backend/
│   ├── server.js          ← Express API (all routes)
│   └── package.json
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── package.json
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── utils/
        │   └── api.js     ← API client
        └── pages/
            ├── Register.jsx   ← Onboarding form
            └── Dashboard.jsx  ← Main demo screen
```

---

## 🚀 How to Run

### 1. Start the Backend
```bash
cd gigshield/backend
npm install
npm start
# ✅ Running on http://localhost:4000
```

### 2. Start the Frontend (new terminal)
```bash
cd gigshield/frontend
npm install
npm run dev
# ✅ Running on http://localhost:3000
```

### 3. Open Browser
→ http://localhost:3000

---

## 🎯 Demo Flow

1. **Register a worker**
   - Fill: Name, Phone, Zone, Daily Income
   - Pick a plan (Basic / Full / Pro)
   - Click **Get Protected**

2. **Dashboard loads** showing:
   - Weekly premium (formula: basePrice × zoneRisk × seasonalFactor)
   - Active plan + payout cap
   - Premium breakdown

3. **Click "Simulate Rain Event"**
   - System checks for trigger → returns random event (Rain / Cyclone / Outage / etc.)
   - Claim is auto-generated and approved
   - Payout is simulated: `min(dailyIncome × 0.5, planMaxLimit)`
   - ₹ credited message appears

4. **Claims history** updates below the button

---

## 📡 API Endpoints

| Method | Route             | Description              |
|--------|-------------------|--------------------------|
| POST   | /register         | Register a worker        |
| GET    | /worker/:id       | Get worker + premium     |
| GET    | /premium/:id      | Recalculate premium      |
| GET    | /trigger/check    | Simulate weather trigger |
| POST   | /claim/auto       | Auto-create claim        |
| POST   | /payout           | Simulate payout          |
| GET    | /claims/:id       | List worker claims       |
| GET    | /workers          | List all workers (debug) |

---

## 🧮 Business Logic

### Premium Formula
```
premium = basePrice × zoneRisk × seasonalFactor

basePrices: Basic=49, Full=79, Pro=119
zoneRisk:   random 0.9–1.2
seasonal:   random 1.0–1.2
```

### Payout Formula
```
payout = min(dailyIncome × 0.5, planMaxLimit)

planLimits: Basic=₹375, Full=₹625, Pro=₹900
```

### Fraud Rules
- > 2 claims in 7 days → flagged
- Returns `{ status: "flagged", reason: "..." }`

---

## ⚠️ Notes
- All data is **in-memory** — restarting the backend clears everything
- No real payments, GPS, or ML involved
- Built for hackathon demo purposes only
