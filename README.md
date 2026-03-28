# 🛡️ GigShield
### AI-Powered Parametric Income Protection for Food Delivery Workers

> **Guidewire DEVTrails 2026 | University Hackathon**
> Team ProtoNexus — Nagulan · MohanaPriyan · Mukesh Pandiyan · Athithyan

---

## 1. The Problem

India's 5+ million food delivery partners on Zomato and Swiggy earn **₹600–₹1,000/day** with income entirely dependent on being physically on the road. When disruptions strike — monsoon downpours, cyclones, civic curfews — delivery orders collapse within minutes and workers absorb the full financial loss alone.

| Metric | Value |
|---|---|
| Average daily earnings | ₹800 |
| Working days lost per disruption | 1–3 days |
| Monthly income loss per disruption event | ₹1,600 – ₹4,800 |
| Existing financial safety net | **None** |

---

## 2. Our Solution

**GigShield** is an AI-enabled, fully automated **parametric income insurance platform** for Zomato and Swiggy delivery workers in Chennai. Payouts are triggered **automatically** by verifiable real-time external data — the worker never files a claim.

> **Core Principle:** If conditions are bad enough that you *can't* work, you shouldn't have to *prove* you couldn't.

### Core Value Proposition
- ✅ **Zero-touch claims** — no forms, no calls, no waiting
- ✅ **₹49/week base premium** — aligned to gig worker budgeting psychology
- ✅ **AI-driven dynamic pricing** based on hyper-local zone risk scores
- ✅ **Payout within 2 hours** via UPI after confirmed trigger
- ✅ **TruthMatrix fraud detection** — multi-layer, GPS spoof-resistant
- ✅ **Actuarially modelled** with combined ratio targets and reinsurance layer

> ⚠️ **Coverage Scope: LOSS OF INCOME ONLY.** Health, life, accidents, vehicle damage are strictly excluded.

---

## 3. Persona

**Rajan, 28 — Zomato Delivery Partner, Chennai**

| Attribute | Detail |
|---|---|
| Working hours | 10–12 hrs/day, 6 days/week |
| Daily income | ₹750 (base ₹550 + incentives) |
| Operating zones | T. Nagar, Adyar, Velachery |
| Savings buffer | Near zero |
| Smartphone | Android mid-range |

Rajan lost 3 full days of income during Cyclone Michaung (Dec 2023) and 2 days during Cyclone Nivar (Nov 2020) — real, documented events that GigShield is specifically designed for.

---

## 4. Application Workflow

```
ONBOARDING (< 3 min)          ACTIVE COVERAGE              DISRUPTION EVENT
────────────────              ───────────────              ────────────────
Phone OTP + eKYC       →    Weekly premium auto-      →  Real-time APIs detect
(DigiLocker)                 deducted via UPI               disruption in zone
       ↓                     Autopay (e-NACH)                      ↓
Zone selection (GPS)   →    AI risk score updated      →  TruthMatrix fraud
+ plan selection             every Monday                   check clears claim
       ↓                           ↓                              ↓
Coverage active        →    Dashboard live             →  UPI payout + push
next Monday                                               notification
```

---

## 5. Weekly Premium Model

### Plans

| Tier | Weekly Premium | Max Payout/Event | Annual Claim Cap | Coverage |
|---|---|---|---|---|
| **Basic Shield** | ₹49 | ₹375 | 6 events/year | Rain Red Alert, Flood |
| **Full Shield** | ₹79 | ₹625 | 8 events/year | Rain + Cyclone + Civic Shutdown |
| **Pro Shield** | ₹119 | ₹900 | 10 events/year | All triggers + Platform Outage |

### Dynamic Pricing Formula

```
Weekly Premium = Base Price × Zone Risk Multiplier × Seasonal Factor × Claim History Factor

Zone Risk:      0.85 – 1.30  (based on historical disruption frequency per zone)
Seasonal:       0.90 – 1.25  (Oct–Dec cyclone season + Jun–Sep monsoon = peak)
Claim History:  0.95 – 1.10  (rewards clean history)
```

**Example — Rajan, Full Shield, Adyar, July:**
₹79 × 1.15 (Adyar flood history) × 1.20 (monsoon) × 0.95 (clean) = **₹104/week**

### Actuarial Sustainability

| Year Type | Events | Loss Ratio | Combined Ratio | Outcome |
|---|---|---|---|---|
| Low disruption | 2 | 29% | 44% | Profitable |
| Average year | 5 | 74% | 89% | Healthy margin |
| High disruption | 6 (capped) | 88% | 103% | Reinsurance activates |

When total payouts exceed 120% of premiums collected in a zone, excess-of-loss reinsurance absorbs the remainder — standard for global parametric products.

---

## 6. Parametric Triggers

| ID | Category | Data Sources | Threshold | Payout Level |
|---|---|---|---|---|
| T1 | Heavy Rain / Red Alert | IMD Open API + OpenWeatherMap | ≥115mm/24hr Red Alert | Moderate–Severe |
| T2 | Flood / Waterlogging | IMD + Chennai Corporation alerts | Red Alert + confirmed road closures | Severe–Extreme |
| T3 | Cyclone / Coastal Storm | IMD Cyclone RSS Feed + NewsAPI | Severe Cyclone Warning for TN coast | Severe–Extreme |
| T4 | Civic Shutdown / Curfew | NewsAPI + human admin verification | Confirmed Section 144 in operating zone | Severe |
| T5 | Platform App Outage | UptimeRobot + Freshping | >90 min confirmed outage on both monitors | Moderate |

All triggers require **≥2 independent sources** before a claim is initiated. T4 uses a human-in-the-loop step due to the absence of a centralised Section 144 API in India.

---

## 7. TruthMatrix — Fraud Detection Architecture

GigShield's fraud engine scores every claim across 6 signal dimensions. A GPS spoofer at home cannot simultaneously fake cell tower registration, physical motion, platform engagement, and passive Wi-Fi environment.

```
TruthScore = (
  25% × Environmental Corroboration   [hardest to fake — IMD + multi-source]
  20% × Platform Behavior Score       [delivery app session, order attempts]
  20% × Cell Tower Score              [physical radio signal, unfakeable by GPS apps]
  15% × Device Motion Score           [accelerometer — movement then shelter pattern]
  10% × Peer Cluster Risk             [coordinated ring detection]
  10% × Historical Worker Score       [long-term behaviour baseline]
)

TruthScore ≥ 75  → AUTO-APPROVE
TruthScore 50–74 → HOLD for 24-hour enhanced review (worker sees "processing")
TruthScore < 50  → AUTO-REJECT + flagged for investigation
```

**Coordinated Ring Detection:** 50+ claims filed within 10 minutes from one zone → flagged. Identical GPS trajectory patterns across multiple workers → flagged. Requires React Native native Android app (not PWA) for cell tower and accelerometer access.

**Honest Worker Protection:** Workers in the grey zone (50–74) are never told their claim is flagged. They see "processing within 24 hours." If delayed signals resolve in their favour, payout triggers automatically. Workers with 8+ weeks clean history get fast-track approval at TruthScore ≥ 65.

---

## 8. Regulatory Framework

**IRDAI Compliance Pathway:**
1. **IRDAI Regulatory Sandbox** — Apply under General Insurance category for up to 12-month supervised pilot (framework launched 2019 specifically for parametric InsurTech)
2. **Partner Insurer Model** — GigShield is the technology layer; licensed insurer underwrites policies
3. **DPDP Act 2023** — Explicit user consent, stated purpose, and clear retention policy for all sensor and location data collected
4. **DigiLocker eKYC** — Uses publicly accessible document verification flow; no separate UIDAI Aadhaar licence required for prototype

---

## 9. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express + PostgreSQL (Supabase) |
| Queue / Scheduler | Redis + BullMQ |
| ML / AI | Python + XGBoost + Isolation Forest + Prophet (FastAPI) |
| Payments | Razorpay Test Mode (UPI Autopay sandbox) |
| Weather | OpenWeatherMap + IMD Open API + IMD Cyclone RSS |
| Civic / News | NewsAPI.org |
| Uptime Monitoring | UptimeRobot + Freshping |
| Deployment | Vercel (frontend) · Railway (backend) · Supabase (DB) |

**Phase 1 is a web prototype (PWA).** Production deployment would use a React Native Android app — TruthMatrix Layer 1 requires background accelerometer, cell tower ID, and passive Wi-Fi scanning, which are native Android OS APIs inaccessible to a browser.

---

## 10. What's Built (Phase 1)

✅ Worker registration and onboarding flow  
✅ Zone-based dynamic premium calculation  
✅ Insurance policy creation (Basic / Full / Pro)  
✅ Simulated parametric trigger engine (5 disruption types)  
✅ Auto-claim generation and approval pipeline  
✅ TruthMatrix rule-based fraud detection (ML model Phase 2)  
✅ Claims history dashboard  
✅ Insurer admin dashboard (loss ratio, fraud queue)  


## 11. Roadmap

| Phase | Timeline | Key Deliverables |
|---|---|---|
| **Seed** | Weeks 1–2 ✅ | Onboarding, premium engine, policy creation, claim pipeline, admin dashboard, 2-min demo video |
| **Scale** | Weeks 3–4 | Live IMD/weather trigger automation, TruthMatrix fraud engine v1, Razorpay UPI sandbox payouts, 2-min demo video |
| **Soar** | Weeks 5–6 | Advanced coordinated fraud detection, worker + insurer intelligent dashboard, full disruption simulation demo, 5-min demo video + final pitch deck |

---

## 12. Key Differentiators

| Feature | GigShield | Typical Micro-Insurance |
|---|---|---|
| Claim filing required | ❌ Never | ✅ Always |
| Payout time | < 2 hours | Days to weeks |
| Fraud detection | 4-layer TruthMatrix + GPS spoof defense | Basic document checks |
| Financial model | Actuarial combined ratio + reinsurance | Often undefined |
| Regulatory awareness | IRDAI Sandbox pathway defined | Typically absent |
| Chennai-specific design | Named cyclone events (Michaung, Nivar) | Generic weather |

---

## 13. Team ProtoNexus

| Name | Role |
|---|---|
| Nagulan | Team Lead & Frontend |
| MohanaPriyan | Frontend & UI/UX |
| Mukesh Pandiyan | Backend & API |
| Athithyan | ML & Integration |
  
**Demo:** https://youtu.be/2q2WHvDTId8

---

*GigShield — Because the rain shouldn't decide if Rajan eats tonight.*
