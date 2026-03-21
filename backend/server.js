const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());
app.use(express.json());

const workers = {};
const claims  = {};
const policies = {};

const PLAN_CONFIG = {
  Basic: { base:49,  maxPayout:375, dailyCoverage:250, label:"Basic Shield" },
  Full:  { base:79,  maxPayout:625, dailyCoverage:500, label:"Full Shield"  },
  Pro:   { base:119, maxPayout:900, dailyCoverage:750, label:"Pro Shield"   },
};

const ZONE_RISK = {
  "Adyar":1.15,"T Nagar":1.10,"Anna Nagar":1.05,"Velachery":1.18,
  "OMR":1.08,"Tambaram":1.12,"Porur":1.07,"Guindy":1.14,
  "Chromepet":1.09,"Sholinganallur":1.11,"Mumbai":1.20,"Delhi":1.10,
  "Bangalore":1.08,"Hyderabad":1.13,"Kolkata":1.16,"Chennai":1.14,
};

const DELIVERY_PERSONAS = {
  "Food Delivery":    { riskMultiplier:1.10 },
  "Grocery Delivery": { riskMultiplier:1.08 },
  "E-commerce":       { riskMultiplier:1.05 },
  "Two-Wheeler":      { riskMultiplier:1.12 },
};

function rand(min, max) { return Math.random() * (max - min) + min; }

function getMonthSeasonal() {
  const month = new Date().getMonth();
  const map = [1.0,1.0,1.0,1.05,1.05,1.15,1.20,1.20,1.15,1.08,1.02,1.0];
  return map[month];
}

function calcPremium(worker) {
  const plan = PLAN_CONFIG[worker.selectedPlan] || PLAN_CONFIG.Full;
  const zoneRisk = ZONE_RISK[worker.zone] || parseFloat(rand(0.9,1.2).toFixed(3));
  const seasonalFactor = getMonthSeasonal();
  const personaMultiplier = DELIVERY_PERSONAS[worker.deliveryPersona]?.riskMultiplier || 1.0;
  const weeklyPremium = parseFloat((plan.base * zoneRisk * seasonalFactor * personaMultiplier).toFixed(2));
  return {
    weeklyPremium,
    breakdown: {
      basePrice: plan.base,
      zoneRisk,
      seasonalFactor,
      personaMultiplier,
      formula: `₹${plan.base} × ${zoneRisk} (zone) × ${seasonalFactor} (seasonal) × ${personaMultiplier} (persona)`
    }
  };
}

function getRiskFactors(city, persona) {
  const cityRisks = {
    Mumbai:    ["Heavy Monsoon Flooding","Coastal Cyclones","Peak Hour Gridlock","Waterlogging"],
    Delhi:     ["Extreme Summer Heat >42°C","Dense Fog in Winter","Air Quality Alerts","Political Events"],
    Bangalore: ["Flash Floods in Low Areas","Tech Park Traffic","Road Closures","Rain Showers"],
    Hyderabad: ["Monsoon Flash Floods","High Traffic Congestion","Festival Road Closures","Urban Flooding"],
    Chennai:   ["Cyclone Season","Heavy Northeast Monsoon","Marina Beach Closures","Flooding"],
    Kolkata:   ["Pre-Monsoon Thunderstorms","Waterlogging","Festival Season Closures","Humidity"],
  };
  const personaRisks = {
    "Food Delivery":    ["Peak dinner-hour accidents","Late-night safety risks"],
    "Grocery Delivery": ["Heavy load handling","Time-pressure deliveries"],
    "E-commerce":       ["Multi-floor building access","Package theft zones"],
    "Two-Wheeler":      ["Highway exposure","Fuel cost spikes"],
  };
  const base = cityRisks[city] || ["Weather disruptions","Platform outages"];
  const extra = personaRisks[persona] || [];
  return [...base, ...extra].slice(0,6);
}

function getClaimsThisWeek(workerId) {
  const oneWeek = 7*24*60*60*1000;
  return (claims[workerId]||[]).filter(c => Date.now()-c.createdAt < oneWeek);
}

function fraudCheck(workerId) {
  const week = getClaimsThisWeek(workerId);
  if (week.length >= 3) return { passed:false, reason:"3+ claims in 7 days — flagged for manual review" };
  if (week.length >= 2) return { passed:true, warning:"2 claims this week — next will be flagged" };
  return { passed:true };
}

function generatePolicyId() {
  return "GS-PC-" + Math.floor(10000 + Math.random()*90000);
}

// ── Routes ──────────────────────────────────────────

app.get("/", (req,res) => res.json({ status:"GigShield API v2 running ✅" }));

// 1. Register
app.post("/register", (req,res) => {
  const { phoneNumber,name,email,zone,city,dailyIncome,selectedPlan,deliveryPersona } = req.body;
  if (!phoneNumber||!name||!zone||!dailyIncome||!selectedPlan)
    return res.status(400).json({ error:"Required fields missing" });
  if (!PLAN_CONFIG[selectedPlan])
    return res.status(400).json({ error:"Invalid plan" });

  const existing = Object.values(workers).find(w => w.phoneNumber===phoneNumber);
  if (existing) return res.status(409).json({ error:"Phone already registered", workerId:existing.workerId });

  const workerId = uuidv4();
  const policyId = generatePolicyId();
  const premium = calcPremium({ selectedPlan, zone, deliveryPersona:deliveryPersona||"Food Delivery" });
  const riskFactors = getRiskFactors(city||zone, deliveryPersona||"Food Delivery");

  workers[workerId] = {
    workerId,phoneNumber,name,email:email||"",
    zone,city:city||zone,dailyIncome:parseFloat(dailyIncome),
    selectedPlan,deliveryPersona:deliveryPersona||"Food Delivery",
    policyId,registeredAt:Date.now(),isActive:true,
  };
  claims[workerId] = [];
  policies[policyId] = {
    policyId,workerId,plan:selectedPlan,...premium,riskFactors,
    startDate:new Date().toISOString(),
    nextPayment:new Date(Date.now()+7*24*60*60*1000).toISOString(),
    status:"active",
    dailyCoverage:PLAN_CONFIG[selectedPlan].dailyCoverage,
    maxPayout:PLAN_CONFIG[selectedPlan].maxPayout,
  };

  return res.status(201).json({
    workerId,policyId,...workers[workerId],...premium,riskFactors,
    dailyCoverage:PLAN_CONFIG[selectedPlan].dailyCoverage,
    maxPayout:PLAN_CONFIG[selectedPlan].maxPayout,
    message:"Registration successful! You are now protected.",
  });
});

// 2. Login
app.post("/login", (req,res) => {
  const { phoneNumber } = req.body;
  const worker = Object.values(workers).find(w => w.phoneNumber===phoneNumber);
  if (!worker) return res.status(404).json({ error:"No account found with this phone number" });
  const premium = calcPremium(worker);
  const workerClaims = claims[worker.workerId]||[];
  const policy = policies[worker.policyId]||{};
  return res.json({
    ...worker,...premium,
    lastClaim:workerClaims.length ? workerClaims[workerClaims.length-1] : null,
    totalClaims:workerClaims.length,
    totalPayout:workerClaims.reduce((s,c)=>s+(c.payoutAmount||0),0),
    policy,
  });
});

// 3. Get Worker
app.get("/worker/:id", (req,res) => {
  const worker = workers[req.params.id];
  if (!worker) return res.status(404).json({ error:"Worker not found" });
  const premium = calcPremium(worker);
  const workerClaims = claims[worker.workerId]||[];
  const policy = policies[worker.policyId]||{};
  const fraud = fraudCheck(worker.workerId);
  return res.json({
    ...worker,...premium,policy,
    lastClaim:workerClaims.length ? workerClaims[workerClaims.length-1] : null,
    totalClaims:workerClaims.length,
    totalPayout:workerClaims.reduce((s,c)=>s+(c.payoutAmount||0),0),
    fraudStatus:fraud,
  });
});

// 4. AI Quote
app.post("/quote", (req,res) => {
  const { zone,city,dailyIncome,selectedPlan,deliveryPersona } = req.body;
  const mockWorker = { zone,city,dailyIncome:parseFloat(dailyIncome),selectedPlan,deliveryPersona };
  const premium = calcPremium(mockWorker);
  const riskFactors = getRiskFactors(city||zone, deliveryPersona||"Food Delivery");
  const plan = PLAN_CONFIG[selectedPlan];
  const aiExplanation = `Your weekly premium of ₹${premium.weeklyPremium} is calculated based on your ${deliveryPersona||"delivery"} work in ${city||zone}. The zone risk factor of ${premium.breakdown.zoneRisk} reflects local weather patterns and traffic disruption frequency. The seasonal factor of ${premium.breakdown.seasonalFactor} accounts for current monsoon/weather conditions. Your ${selectedPlan} plan covers up to ₹${plan.maxPayout} per event with ₹${plan.dailyCoverage} per disrupted day — triggered automatically, no forms, no delays.`;
  return res.json({
    ...premium,riskFactors,aiExplanation,
    dailyCoverage:plan.dailyCoverage,
    maxPayout:plan.maxPayout,
    planLabel:plan.label,
  });
});

// 5. Trigger Check
app.get("/trigger/check", (req,res) => {
  const { rainfall,temperature,windspeed,city } = req.query;
  if (rainfall !== undefined) {
    const rain=parseFloat(rainfall)||0, temp=parseFloat(temperature)||25, wind=parseFloat(windspeed)||0;
    const triggers=[];
    if (rain>=8)  triggers.push({ type:"Heavy Rain",   severity:"high",     value:`${rain}mm/hr` });
    if (rain>=20) triggers.push({ type:"Flash Flood",  severity:"critical", value:`${rain}mm/hr` });
    if (temp>=42) triggers.push({ type:"Extreme Heat", severity:"high",     value:`${temp}°C` });
    if (wind>=50) triggers.push({ type:"High Wind",    severity:"moderate", value:`${wind}km/h` });
    if (triggers.length>0) {
      const top = triggers[0];
      return res.json({ triggered:true,...top,city,allTriggers:triggers,timestamp:new Date().toISOString(),source:"live-weather" });
    }
    return res.json({ triggered:false,message:"No thresholds breached",city,source:"live-weather" });
  }
  const sim=[
    { type:"Rain",            severity:"moderate", weight:0.30 },
    { type:"Heavy Rain",      severity:"high",     weight:0.25 },
    { type:"Platform Outage", severity:"moderate", weight:0.20 },
    { type:"Cyclone Warning", severity:"critical", weight:0.12 },
    { type:"Flash Flood",     severity:"critical", weight:0.08 },
    { type:"Extreme Heat",    severity:"high",     weight:0.05 },
  ];
  const triggered = Math.random()<0.78;
  if (!triggered) return res.json({ triggered:false,message:"All clear",source:"simulated" });
  let roll=Math.random(),cum=0,chosen=sim[0];
  for (const t of sim) { cum+=t.weight; if (roll<cum){ chosen=t; break; } }
  return res.json({ triggered:true,...chosen,timestamp:new Date().toISOString(),source:"simulated" });
});

// 6. Auto Claim
app.post("/claim/auto", (req,res) => {
  const { workerId,triggerType,severity,source,city,value } = req.body;
  const worker = workers[workerId];
  if (!worker) return res.status(404).json({ error:"Worker not found" });
  const fraud = fraudCheck(workerId);
  if (!fraud.passed) return res.json({ status:"flagged",reason:fraud.reason });
  const plan = PLAN_CONFIG[worker.selectedPlan];
  const sevMul = severity==="critical"?1.0:severity==="high"?0.8:0.6;
  const payoutAmount = parseFloat(Math.min(worker.dailyIncome*0.5*sevMul,plan.maxPayout).toFixed(2));
  const claim = {
    claimId:"CLM-"+uuidv4().slice(0,8).toUpperCase(),
    workerId,triggerType,severity,payoutAmount,
    status:"approved",source:source||"simulated",
    city:city||worker.city,value:value||"",
    policyId:worker.policyId,
    createdAt:Date.now(),
  };
  claims[workerId].push(claim);
  return res.status(201).json({
    status:"approved",claim,
    warning:fraud.warning||null,
    message:`Claim auto-approved. ₹${payoutAmount} will be credited to your UPI.`,
  });
});

// ── 7. SIMULATE TRIGGER (all-in-one endpoint for dashboard & triggers page) ──
app.post("/simulate-trigger", (req,res) => {
  const { workerId, city, source } = req.body;
  const worker = workers[workerId];
  if (!worker) return res.status(404).json({ error:"Worker not found" });

  const fraud = fraudCheck(workerId);
  if (!fraud.passed) return res.json({ status:"flagged", reason:fraud.reason });

  // Pick a random trigger event
  const events = [
    { triggerType:"Rain",            severity:"moderate" },
    { triggerType:"Heavy Rain",      severity:"high"     },
    { triggerType:"Platform Outage", severity:"moderate" },
    { triggerType:"Cyclone Warning", severity:"critical" },
    { triggerType:"Flash Flood",     severity:"critical" },
    { triggerType:"Extreme Heat",    severity:"high"     },
  ];
  const event = events[Math.floor(Math.random() * events.length)];

  const plan   = PLAN_CONFIG[worker.selectedPlan];
  const sevMul = event.severity==="critical"?1.0:event.severity==="high"?0.8:0.6;
  const payout = parseFloat(Math.min(worker.dailyIncome*0.5*sevMul, plan.maxPayout).toFixed(2));

  const claimId = "CLM-"+uuidv4().slice(0,8).toUpperCase();
  const txnId   = uuidv4().slice(0,10).toUpperCase();

  const claim = {
    claimId,
    id: claimId,
    workerId,
    triggerType: event.triggerType,
    severity:    event.severity,
    payout,
    payoutAmount: payout,
    status:  "approved",
    source:  source || "simulated",
    city:    city || worker.city,
    policyId: worker.policyId,
    createdAt: Date.now(),
    date: new Date().toISOString(),
  };

  claims[workerId].push(claim);

  return res.status(201).json({
    status:      "approved",
    claimId,
    txnId,
    triggerType: event.triggerType,
    severity:    event.severity,
    payout,
    city:        city || worker.city,
    warning:     fraud.warning || null,
    message:     `₹${payout} auto-approved and credited to UPI!`,
  });
});

// 8. Payout
app.post("/payout", (req,res) => {
  const { workerId,claimId,amount } = req.body;
  const worker = workers[workerId];
  if (!worker) return res.status(404).json({ error:"Worker not found" });
  return res.json({
    status:"success",
    message:`₹${amount} credited to ${worker.name}'s UPI account`,
    transactionId:"TXN-"+uuidv4().slice(0,10).toUpperCase(),
    method:"UPI (Simulated)",
    claimId,amount,
    timestamp:new Date().toISOString(),
  });
});

// 9. Claims
app.get("/claims/:workerId", (req,res) => {
  return res.json(claims[req.params.workerId]||[]);
});

// 10. Admin Workers
app.get("/admin/workers", (req,res) => {
  const all = Object.values(workers).map(w=>({
    ...w,
    totalClaims:(claims[w.workerId]||[]).length,
    totalPayout:(claims[w.workerId]||[]).reduce((s,c)=>s+c.payoutAmount,0),
  }));
  return res.json(all);
});

// 11. Admin Claims
app.get("/admin/claims", (req,res) => {
  return res.json(Object.values(claims).flat());
});

// 12. Admin Stats
app.get("/admin/stats", (req,res) => {
  const allWorkers=Object.values(workers);
  const allClaims=Object.values(claims).flat();
  return res.json({
    totalWorkers:allWorkers.length,
    activeWorkers:allWorkers.filter(w=>w.isActive).length,
    totalClaims:allClaims.length,
    approvedClaims:allClaims.filter(c=>c.status==="approved").length,
    flaggedClaims:allClaims.filter(c=>c.status==="flagged").length,
    totalPayout:allClaims.reduce((s,c)=>s+(c.payoutAmount||0),0),
    planBreakdown:{
      Basic:allWorkers.filter(w=>w.selectedPlan==="Basic").length,
      Full: allWorkers.filter(w=>w.selectedPlan==="Full").length,
      Pro:  allWorkers.filter(w=>w.selectedPlan==="Pro").length,
    },
  });
});

// 13. Plans
app.get("/plans", (req,res) => {
  return res.json(Object.entries(PLAN_CONFIG).map(([id,p])=>({id,...p})));
});

const PORT = 5000;
app.listen(PORT, () => console.log(`✅  GigShield API running on http://localhost:${PORT}`));