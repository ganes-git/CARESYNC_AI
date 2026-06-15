// CareSync AI - Clinical ICU Dashboard JavaScript Core
// Developed with React 18 UMD & Babel standalone compile

const { useState, useEffect, useRef, useMemo } = React;

// --- WHO physiological normal baselines ---
const BASelines = {
  hr: { min: 60, max: 100, target: 80, range: 40 },
  bp: { minSystolic: 90, maxSystolic: 140, targetSystolic: 120, minDiastolic: 60, maxDiastolic: 90, targetDiastolic: 80 },
  spo2: { min: 95, max: 100, target: 98, range: 5 },
  rr: { min: 12, max: 20, target: 16, range: 8 },
  temp: { min: 36.0, max: 37.8, target: 36.8, range: 1.8 }
};

// Helper to initialize history arrays
function createHistory(baseline, variance, length = 15) {
  const arr = [];
  for (let i = 0; i < length; i++) {
    const randomShift = (Math.random() - 0.5) * variance;
    arr.push(Number((baseline + randomShift).toFixed(1)));
  }
  return arr;
}

// 10 Initial Patient Records
const INITIAL_PATIENTS = [
  {
    id: 1,
    name: "Eleanor Vance",
    age: 72,
    gender: "F",
    room: "ICU-3A",
    diagnosis: "Severe Urosepsis & Shock",
    vitals: {
      hr: { current: 104, history: createHistory(102, 6), baseline: 72, minNormal: 60, maxNormal: 100, unit: "bpm", trend: "up" },
      bp: { currentSystolic: 92, currentDiastolic: 56, historySystolic: createHistory(94, 8), historyDiastolic: createHistory(58, 4), baselineSystolic: 118, baselineDiastolic: 76, minNormalSystolic: 90, maxNormalSystolic: 140, minNormalDiastolic: 60, maxNormalDiastolic: 90, unit: "mmHg", trend: "down" },
      spo2: { current: 93, history: createHistory(94, 2), baseline: 98, minNormal: 95, maxNormal: 100, unit: "%", trend: "down" },
      rr: { current: 22, history: createHistory(21, 2), baseline: 15, minNormal: 12, maxNormal: 20, unit: "rpm", trend: "up" },
      temp: { current: 38.9, history: createHistory(38.8, 0.4), baseline: 36.8, minNormal: 36.0, maxNormal: 37.8, unit: "°C", trend: "up" }
    },
    score: 0,
    severity: "stable"
  },
  {
    id: 2,
    name: "Marcus Aurelius",
    age: 65,
    gender: "M",
    room: "ICU-3B",
    diagnosis: "Acute Respiratory Distress (ARDS)",
    vitals: {
      hr: { current: 95, history: createHistory(93, 4), baseline: 75, minNormal: 60, maxNormal: 100, unit: "bpm", trend: "up" },
      bp: { currentSystolic: 135, currentDiastolic: 82, historySystolic: createHistory(130, 10), historyDiastolic: createHistory(80, 5), baselineSystolic: 125, baselineDiastolic: 80, minNormalSystolic: 90, maxNormalSystolic: 140, minNormalDiastolic: 60, maxNormalDiastolic: 90, unit: "mmHg", trend: "stable" },
      spo2: { current: 90, history: createHistory(91, 1), baseline: 97, minNormal: 95, maxNormal: 100, unit: "%", trend: "down" },
      rr: { current: 24, history: createHistory(23, 2), baseline: 16, minNormal: 12, maxNormal: 20, unit: "rpm", trend: "up" },
      temp: { current: 37.2, history: createHistory(37.1, 0.2), baseline: 36.7, minNormal: 36.0, maxNormal: 37.8, unit: "°C", trend: "stable" }
    },
    score: 0,
    severity: "stable"
  },
  {
    id: 3,
    name: "Sarah Jenkins",
    age: 45,
    gender: "F",
    room: "ICU-3C",
    diagnosis: "Acute Pancreatitis",
    vitals: {
      hr: { current: 78, history: createHistory(77, 3), baseline: 74, minNormal: 60, maxNormal: 100, unit: "bpm", trend: "stable" },
      bp: { currentSystolic: 118, currentDiastolic: 76, historySystolic: createHistory(120, 4), historyDiastolic: createHistory(78, 3), baselineSystolic: 120, baselineDiastolic: 78, minNormalSystolic: 90, maxNormalSystolic: 140, minNormalDiastolic: 60, maxNormalDiastolic: 90, unit: "mmHg", trend: "stable" },
      spo2: { current: 98, history: createHistory(98, 1), baseline: 98, minNormal: 95, maxNormal: 100, unit: "%", trend: "stable" },
      rr: { current: 16, history: createHistory(16, 1), baseline: 15, minNormal: 12, maxNormal: 20, unit: "rpm", trend: "stable" },
      temp: { current: 36.9, history: createHistory(36.8, 0.15), baseline: 36.7, minNormal: 36.0, maxNormal: 37.8, unit: "°C", trend: "stable" }
    },
    score: 0,
    severity: "stable"
  },
  {
    id: 4,
    name: "James Mercer",
    age: 67,
    gender: "M",
    room: "ICU-3D",
    diagnosis: "Post-Op Coronary Artery Bypass",
    vitals: {
      hr: { current: 82, history: createHistory(80, 2), baseline: 78, minNormal: 60, maxNormal: 100, unit: "bpm", trend: "stable" },
      bp: { currentSystolic: 122, currentDiastolic: 78, historySystolic: createHistory(120, 3), historyDiastolic: createHistory(76, 2), baselineSystolic: 120, baselineDiastolic: 78, minNormalSystolic: 90, maxNormalSystolic: 140, minNormalDiastolic: 60, maxNormalDiastolic: 90, unit: "mmHg", trend: "stable" },
      spo2: { current: 97, history: createHistory(97, 1), baseline: 98, minNormal: 95, maxNormal: 100, unit: "%", trend: "stable" },
      rr: { current: 16, history: createHistory(15, 1), baseline: 14, minNormal: 12, maxNormal: 20, unit: "rpm", trend: "stable" },
      temp: { current: 36.8, history: createHistory(36.8, 0.1), baseline: 36.6, minNormal: 36.0, maxNormal: 37.8, unit: "°C", trend: "stable" }
    },
    score: 0,
    severity: "stable"
  },
  {
    id: 5,
    name: "Liam O'Connor",
    age: 29,
    gender: "M",
    room: "ICU-4A",
    diagnosis: "Traumatic Brain Injury (TBI)",
    vitals: {
      hr: { current: 64, history: createHistory(65, 3), baseline: 68, minNormal: 60, maxNormal: 100, unit: "bpm", trend: "stable" },
      bp: { currentSystolic: 112, currentDiastolic: 70, historySystolic: createHistory(115, 5), historyDiastolic: createHistory(72, 3), baselineSystolic: 118, baselineDiastolic: 74, minNormalSystolic: 90, maxNormalSystolic: 140, minNormalDiastolic: 60, maxNormalDiastolic: 90, unit: "mmHg", trend: "stable" },
      spo2: { current: 99, history: createHistory(99, 1), baseline: 98, minNormal: 95, maxNormal: 100, unit: "%", trend: "stable" },
      rr: { current: 14, history: createHistory(14, 1), baseline: 14, minNormal: 12, maxNormal: 20, unit: "rpm", trend: "stable" },
      temp: { current: 36.5, history: createHistory(36.6, 0.1), baseline: 36.7, minNormal: 36.0, maxNormal: 37.8, unit: "°C", trend: "stable" }
    },
    score: 0,
    severity: "stable"
  },
  {
    id: 6,
    name: "Sophia Martinez",
    age: 58,
    gender: "F",
    room: "ICU-4B",
    diagnosis: "Diabetic Ketoacidosis (DKA)",
    vitals: {
      hr: { current: 112, history: createHistory(110, 5), baseline: 76, minNormal: 60, maxNormal: 100, unit: "bpm", trend: "up" },
      bp: { currentSystolic: 105, currentDiastolic: 62, historySystolic: createHistory(108, 6), historyDiastolic: createHistory(64, 4), baselineSystolic: 120, baselineDiastolic: 76, minNormalSystolic: 90, maxNormalSystolic: 140, minNormalDiastolic: 60, maxNormalDiastolic: 90, unit: "mmHg", trend: "down" },
      spo2: { current: 96, history: createHistory(96, 1), baseline: 98, minNormal: 95, maxNormal: 100, unit: "%", trend: "stable" },
      rr: { current: 26, history: createHistory(25, 2), baseline: 16, minNormal: 12, maxNormal: 20, unit: "rpm", trend: "up" },
      temp: { current: 37.4, history: createHistory(37.3, 0.2), baseline: 36.8, minNormal: 36.0, maxNormal: 37.8, unit: "°C", trend: "stable" }
    },
    score: 0,
    severity: "stable"
  },
  {
    id: 7,
    name: "Chen Wei",
    age: 81,
    gender: "M",
    room: "ICU-4C",
    diagnosis: "Decompensated Heart Failure",
    vitals: {
      hr: { current: 88, history: createHistory(86, 4), baseline: 70, minNormal: 60, maxNormal: 100, unit: "bpm", trend: "up" },
      bp: { currentSystolic: 154, currentDiastolic: 94, historySystolic: createHistory(150, 8), historyDiastolic: createHistory(92, 4), baselineSystolic: 130, baselineDiastolic: 82, minNormalSystolic: 90, maxNormalSystolic: 140, minNormalDiastolic: 60, maxNormalDiastolic: 90, unit: "mmHg", trend: "up" },
      spo2: { current: 92, history: createHistory(93, 2), baseline: 96, minNormal: 95, maxNormal: 100, unit: "%", trend: "down" },
      rr: { current: 21, history: createHistory(20, 2), baseline: 16, minNormal: 12, maxNormal: 20, unit: "rpm", trend: "up" },
      temp: { current: 36.6, history: createHistory(36.6, 0.15), baseline: 36.5, minNormal: 36.0, maxNormal: 37.8, unit: "°C", trend: "stable" }
    },
    score: 0,
    severity: "stable"
  },
  {
    id: 8,
    name: "Clara Oswald",
    age: 34,
    gender: "F",
    room: "ICU-4D",
    diagnosis: "Pulmonary Embolism Suspect",
    vitals: {
      hr: { current: 98, history: createHistory(96, 5), baseline: 72, minNormal: 60, maxNormal: 100, unit: "bpm", trend: "up" },
      bp: { currentSystolic: 126, currentDiastolic: 78, historySystolic: createHistory(124, 6), historyDiastolic: createHistory(76, 3), baselineSystolic: 120, baselineDiastolic: 76, minNormalSystolic: 90, maxNormalSystolic: 140, minNormalDiastolic: 60, maxNormalDiastolic: 90, unit: "mmHg", trend: "stable" },
      spo2: { current: 94, history: createHistory(95, 1), baseline: 98, minNormal: 95, maxNormal: 100, unit: "%", trend: "down" },
      rr: { current: 19, history: createHistory(18, 1), baseline: 14, minNormal: 12, maxNormal: 20, unit: "rpm", trend: "up" },
      temp: { current: 37.0, history: createHistory(37.0, 0.1), baseline: 36.8, minNormal: 36.0, maxNormal: 37.8, unit: "°C", trend: "stable" }
    },
    score: 0,
    severity: "stable"
  },
  {
    id: 9,
    name: "David Kim",
    age: 50,
    gender: "M",
    room: "ICU-5A",
    diagnosis: "End-Stage Renal Disease (ESRD)",
    vitals: {
      hr: { current: 72, history: createHistory(73, 2), baseline: 74, minNormal: 60, maxNormal: 100, unit: "bpm", trend: "stable" },
      bp: { currentSystolic: 138, currentDiastolic: 88, historySystolic: createHistory(135, 5), historyDiastolic: createHistory(86, 3), baselineSystolic: 135, baselineDiastolic: 84, minNormalSystolic: 90, maxNormalSystolic: 140, minNormalDiastolic: 60, maxNormalDiastolic: 90, unit: "mmHg", trend: "stable" },
      spo2: { current: 97, history: createHistory(97, 1), baseline: 97, minNormal: 95, maxNormal: 100, unit: "%", trend: "stable" },
      rr: { current: 15, history: createHistory(15, 1), baseline: 15, minNormal: 12, maxNormal: 20, unit: "rpm", trend: "stable" },
      temp: { current: 36.4, history: createHistory(36.5, 0.15), baseline: 36.6, minNormal: 36.0, maxNormal: 37.8, unit: "°C", trend: "stable" }
    },
    score: 0,
    severity: "stable"
  },
  {
    id: 10,
    name: "Aisha Bello",
    age: 62,
    gender: "F",
    room: "ICU-5B",
    diagnosis: "Post-Op Kidney Transplant",
    vitals: {
      hr: { current: 80, history: createHistory(79, 3), baseline: 78, minNormal: 60, maxNormal: 100, unit: "bpm", trend: "stable" },
      bp: { currentSystolic: 128, currentDiastolic: 82, historySystolic: createHistory(126, 4), historyDiastolic: createHistory(80, 2), baselineSystolic: 124, baselineDiastolic: 78, minNormalSystolic: 90, maxNormalSystolic: 140, minNormalDiastolic: 60, maxNormalDiastolic: 90, unit: "mmHg", trend: "stable" },
      spo2: { current: 98, history: createHistory(98, 1), baseline: 98, minNormal: 95, maxNormal: 100, unit: "%", trend: "stable" },
      rr: { current: 16, history: createHistory(17, 1), baseline: 15, minNormal: 12, maxNormal: 20, unit: "rpm", trend: "stable" },
      temp: { current: 37.1, history: createHistory(37.0, 0.1), baseline: 36.8, minNormal: 36.0, maxNormal: 37.8, unit: "°C", trend: "stable" }
    },
    score: 0,
    severity: "stable"
  }
];

// --- CRISIS SCORE CALCULATION ENGINE ---
function calculateCrisisScore(vitals) {
  let baselineDeviations = [];
  let velocities = [];
  let abnormalCount = 0;

  // 1. Heart Rate (HR)
  const hrVal = vitals.hr.current;
  let hrDev = 0;
  if (hrVal > vitals.hr.maxNormal) {
    hrDev = Math.min(100, ((hrVal - vitals.hr.maxNormal) / 40) * 100);
  } else if (hrVal < vitals.hr.minNormal) {
    hrDev = Math.min(100, ((vitals.hr.minNormal - hrVal) / 20) * 100);
  }
  baselineDeviations.push(hrDev);
  if (hrDev > 15) abnormalCount++;

  // HR Trend velocity (rate of change over the last 5 values)
  const hrHist = vitals.hr.history;
  if (hrHist && hrHist.length >= 5) {
    const delta = hrVal - hrHist[hrHist.length - 5];
    // Increase is bad for sepsis/crisis, extreme decrease is also bad.
    const hrVel = Math.min(100, Math.max(0, delta) * 4); // +25 bpm increase = 100 score
    velocities.push(hrVel);
  }

  // 2. Blood Pressure (BP Systolic)
  const bpsVal = vitals.bp.currentSystolic;
  let bpsDev = 0;
  if (bpsVal > vitals.bp.maxNormalSystolic) {
    bpsDev = Math.min(100, ((bpsVal - vitals.bp.maxNormalSystolic) / 40) * 100);
  } else if (bpsVal < vitals.bp.minNormalSystolic) {
    bpsDev = Math.min(100, ((vitals.bp.minNormalSystolic - bpsVal) / 25) * 100); // 65 mmHg = 100 score
  }
  baselineDeviations.push(bpsDev);
  if (bpsDev > 15) abnormalCount++;

  // BP Trend velocity (Systolic drop is high alert in crisis)
  const bpsHist = vitals.bp.historySystolic;
  if (bpsHist && bpsHist.length >= 5) {
    const delta = bpsHist[bpsHist.length - 5] - bpsVal; // drop rate
    const bpVel = Math.min(100, Math.max(0, delta) * 3); // -30 mmHg drop = 90 score
    velocities.push(bpVel);
  }

  // 3. Oxygen Saturation (SpO2)
  const spo2Val = vitals.spo2.current;
  let spo2Dev = 0;
  if (spo2Val < vitals.spo2.minNormal) {
    spo2Dev = Math.min(100, ((vitals.spo2.minNormal - spo2Val) / 12) * 100); // drop to 83% = 100 score
  }
  baselineDeviations.push(spo2Dev);
  if (spo2Dev > 10) abnormalCount++;

  // SpO2 Trend velocity (rapid drop is critical)
  const spo2Hist = vitals.spo2.history;
  if (spo2Hist && spo2Hist.length >= 5) {
    const delta = spo2Hist[spo2Hist.length - 5] - spo2Val; // drop rate
    const spo2Vel = Math.min(100, Math.max(0, delta) * 15); // -6% drop = 90 score
    velocities.push(spo2Vel);
  }

  // 4. Respiratory Rate (RR)
  const rrVal = vitals.rr.current;
  let rrDev = 0;
  if (rrVal > vitals.rr.maxNormal) {
    rrDev = Math.min(100, ((rrVal - vitals.rr.maxNormal) / 15) * 100); // 35 rpm = 100 score
  } else if (rrVal < vitals.rr.minNormal) {
    rrDev = Math.min(100, ((vitals.rr.minNormal - rrVal) / 6) * 100);
  }
  baselineDeviations.push(rrDev);
  if (rrDev > 15) abnormalCount++;

  // RR Trend velocity
  const rrHist = vitals.rr.history;
  if (rrHist && rrHist.length >= 5) {
    const delta = rrVal - rrHist[rrHist.length - 5];
    const rrVel = Math.min(100, Math.max(0, delta) * 6); // +15 breaths increase = 90 score
    velocities.push(rrVel);
  }

  // 5. Temperature
  const tempVal = vitals.temp.current;
  let tempDev = 0;
  if (tempVal > vitals.temp.maxNormal) {
    tempDev = Math.min(100, ((tempVal - vitals.temp.maxNormal) / 2.0) * 100);
  } else if (tempVal < vitals.temp.minNormal) {
    tempDev = Math.min(100, ((vitals.temp.minNormal - tempVal) / 1.5) * 100);
  }
  baselineDeviations.push(tempDev);
  if (tempDev > 15) abnormalCount++;

  // --- Calculate Score Weights ---
  const baselineDeviationComponent = baselineDeviations.length > 0 ? Math.max(...baselineDeviations) : 0;
  const trendVelocityComponent = velocities.length > 0 ? Math.max(...velocities) : 0;
  const multiVitalPenaltyComponent = Math.min(100, abnormalCount * 25);

  // score = (baseline_deviation × 0.3) + (trend_velocity × 0.4) + (multi_vital_penalty × 0.3)
  const finalScore = (baselineDeviationComponent * 0.3) + (trendVelocityComponent * 0.4) + (multiVitalPenaltyComponent * 0.3);

  return Math.min(100, Math.max(0, Math.round(finalScore)));
}

// --- LOCAL HIGH-FIDELITY CLINICAL GENERATOR (FALLBACK) ---
function generateLocalClinicalSummary(patient) {
  const { name, age, gender, diagnosis, vitals, score } = patient;
  const criticalIssues = [];
  const warnings = [];

  // HR Checks
  if (vitals.hr.current > 110) criticalIssues.push(`marked tachycardia (${vitals.hr.current} bpm)`);
  else if (vitals.hr.current > 100) warnings.push(`mild tachycardia (${vitals.hr.current} bpm)`);
  else if (vitals.hr.current < 50) criticalIssues.push(`profound bradycardia (${vitals.hr.current} bpm)`);

  // SpO2 Checks
  if (vitals.spo2.current < 90) criticalIssues.push(`severe hypoxemia (SpO2 ${vitals.spo2.current}%)`);
  else if (vitals.spo2.current < 95) warnings.push(`borderline desaturation (SpO2 ${vitals.spo2.current}%)`);

  // BP Checks
  if (vitals.bp.currentSystolic < 90) criticalIssues.push(`systemic hypotension (${vitals.bp.currentSystolic}/${vitals.bp.currentDiastolic} mmHg)`);
  else if (vitals.bp.currentSystolic > 160) warnings.push(`severe systolic hypertension (${vitals.bp.currentSystolic}/${vitals.bp.currentDiastolic} mmHg)`);

  // RR Checks
  if (vitals.rr.current > 25) criticalIssues.push(`tachypnea (${vitals.rr.current} rpm) suggesting ventilatory fatigue`);
  else if (vitals.rr.current > 20) warnings.push(`mild tachypnea (${vitals.rr.current} rpm)`);

  // Temp Checks
  if (vitals.temp.current > 38.5) warnings.push(`high febrile spike (${vitals.temp.current.toFixed(1)}°C)`);
  else if (vitals.temp.current < 35.5) criticalIssues.push(`critical hypothermia (${vitals.temp.current.toFixed(1)}°C)`);

  let analysis = "";
  if (score >= 70) {
    analysis = `Patient ${name} (${age}${gender}, Room ${patient.room} — Adm: ${diagnosis}) is exhibiting acute physiologic decompensation (Crisis Score: ${score}). `;
    if (criticalIssues.length > 0) {
      analysis += `Key signs include ${criticalIssues.join(' accompanied by ')}. `;
    }
    if (vitals.spo2.trend === 'down' || vitals.bp.trend === 'down') {
      analysis += `Downward trajectory on telemetry suggests impending circulatory or respiratory arrest. `;
    } else {
      analysis += `Adverse multi-vital parameters confirm systemic stress. `;
    }
    analysis += `Urgent bedside assessment, blood gas analysis, and physician notification are strongly advised.`;
  } else if (score >= 40) {
    analysis = `Patient ${name} (${age}${gender}, Room ${patient.room} — Adm: ${diagnosis}) is showing early signs of physiologic instability (Crisis Score: ${score}). `;
    const combined = [...criticalIssues, ...warnings];
    if (combined.length > 0) {
      analysis += `Presenting with ${combined.join(', ')}. `;
    }
    analysis += `Vitals are trending outside normal WHO targets. Increase frequency of surveillance and review medication administration records.`;
  } else {
    analysis = `Patient ${name} (${age}${gender}, Room ${patient.room} — Adm: ${diagnosis}) remains stable. `;
    analysis += `All parameters, including SpO₂ (${vitals.spo2.current}%) and Blood Pressure (${vitals.bp.currentSystolic}/${vitals.bp.currentDiastolic} mmHg), correlate with clinical expectations (Crisis Score: ${score}). Continued standard ICU monitoring.`;
  }
  return analysis;
}

// --- CLAUDE SONNET 4.6 API CALL ---
async function fetchClaudeBriefing(patient, apiKey) {
  const prompt = `You are a clinical AI agent. Write a concise, 2-to-3 sentence briefing for a shift nurse about this ICU patient. Be highly specific, clinical, and plain-English. Address the key risk immediately. Do not write introductory words or conversational greetings.

Patient: ${patient.name} (${patient.age}${patient.gender})
Room: ${patient.room}
Diagnosis: ${patient.diagnosis}
Crisis Score: ${patient.score}/100
Vitals telemetry:
- Heart Rate: ${patient.vitals.hr.current} bpm (${patient.vitals.hr.trend})
- Blood Pressure: ${patient.vitals.bp.currentSystolic}/${patient.vitals.bp.currentDiastolic} mmHg (${patient.vitals.bp.trend})
- SpO2: ${patient.vitals.spo2.current}% (${patient.vitals.spo2.trend})
- RR: ${patient.vitals.rr.current} rpm (${patient.vitals.rr.trend})
- Temperature: ${patient.vitals.temp.current.toFixed(1)}°C (${patient.vitals.temp.trend})`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerously-allow-browser': 'true'
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 150,
      messages: [
        { role: 'user', content: prompt }
      ]
    })
  });
  
  if (!response.ok) {
    throw new Error(`Anthropic endpoint returned HTTP ${response.status}`);
  }
  
  const data = await response.json();
  return data.content[0].text;
}


// --- NATIVE REACT MINI SVG SPARKLINE ---
function Sparkline({ data, minNormal, maxNormal, isSystolic }) {
  if (!data || data.length < 2) return null;
  
  const width = 120;
  const height = 20;
  const padding = 2;
  
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min;
  
  const points = data.map((val, index) => {
    const x = padding + (index / (data.length - 1)) * (width - 2 * padding);
    let y;
    if (range === 0) {
      y = height / 2;
    } else {
      y = padding + (1 - (val - min) / range) * (height - 2 * padding);
    }
    return `${x},${y}`;
  }).join(' ');

  // Determine line color based on the latest value vs normals
  const latest = data[data.length - 1];
  let color = 'var(--color-stable)';
  if (latest < minNormal || latest > maxNormal) {
    color = 'var(--color-critical)';
  } else if (Math.abs(latest - ((minNormal + maxNormal) / 2)) > (maxNormal - minNormal) * 0.35) {
    color = 'var(--color-warning)';
  }

  return (
    <div className="sparkline-container">
      <svg className="sparkline-svg" viewBox={`0 0 ${width} ${height}`}>
        <polyline
          className="sparkline-path"
          points={points}
          stroke={color}
          fill="none"
        />
        {/* Draw a subtle indicator dot at the latest point */}
        {points && (
          <circle
            cx={padding + (width - 2 * padding)}
            cy={padding + (range === 0 ? (height / 2) : (1 - (latest - min) / range) * (height - 2 * padding))}
            r="2"
            fill={color}
          />
        )}
      </svg>
    </div>
  );
}


// --- MAIN APP COMPONENT ---
function App() {
  const [patients, setPatients] = useState(() => {
    // Initial score run
    return INITIAL_PATIENTS.map(p => {
      const score = calculateCrisisScore(p.vitals);
      const severity = score >= 70 ? "critical" : score >= 40 ? "warning" : "stable";
      return { ...p, score, severity };
    });
  });

  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("caresync_api_key") || "");
  const [showSettings, setShowSettings] = useState(false);
  const [simulationStatus, setSimulationStatus] = useState("idle"); // idle | countdown | deteriorating
  const [countdown, setCountdown] = useState(2);
  const [aiBriefing, setAiBriefing] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  
  const deteriorationStepRef = useRef(0);
  const deteriorationIntervalRef = useRef(null);

  // Statistics summaries
  const stats = useMemo(() => {
    let stable = 0, warning = 0, critical = 0;
    patients.forEach(p => {
      if (p.severity === "critical") critical++;
      else if (p.severity === "warning") warning++;
      else stable++;
    });
    return { total: patients.length, stable, warning, critical };
  }, [patients]);

  // Load selected patient object
  const selectedPatient = useMemo(() => {
    return patients.find(p => p.id === selectedPatientId) || null;
  }, [patients, selectedPatientId]);

  // Handle API Key storage
  const handleApiKeyChange = (e) => {
    const val = e.target.value;
    setApiKey(val);
    localStorage.setItem("caresync_api_key", val);
  };

  // Generate / Fetch AI briefing
  const loadBriefing = async (patient) => {
    if (!patient) return;
    setAiLoading(true);
    setAiError(null);
    
    if (apiKey && apiKey.trim().length > 10) {
      try {
        const text = await fetchClaudeBriefing(patient, apiKey.trim());
        setAiBriefing(text);
      } catch (err) {
        console.warn("Claude API failed, falling back to local clinical rules:", err);
        setAiError("Claude API connection restricted or invalid key. Fallback clinical engine details rendered below.");
        const fallbackText = generateLocalClinicalSummary(patient);
        setAiBriefing(fallbackText);
      }
    } else {
      // Local fallback
      const fallbackText = generateLocalClinicalSummary(patient);
      setAiBriefing(fallbackText);
    }
    setAiLoading(false);
  };

  // Trigger briefing reload when selected patient changes
  useEffect(() => {
    if (selectedPatient) {
      loadBriefing(selectedPatient);
    } else {
      setAiBriefing("");
    }
  }, [selectedPatientId]);

  // Update briefing dynamically if vitals update and sidebar is open
  useEffect(() => {
    if (selectedPatient && simulationStatus !== "deteriorating") {
      // Re-trigger without loading skeleton for seamless real-time updating
      if (apiKey && apiKey.trim().length > 10) {
        // Debounce API calls during real-time telemetry if needed, but local is instant
        const fallbackText = generateLocalClinicalSummary(selectedPatient);
        setAiBriefing(fallbackText);
      } else {
        const fallbackText = generateLocalClinicalSummary(selectedPatient);
        setAiBriefing(fallbackText);
      }
    }
  }, [patients]);

  // --- REAL-TIME PATIENT SIMULATOR (INTERVAL LOOP) ---
  useEffect(() => {
    const interval = setInterval(() => {
      if (simulationStatus === "countdown" || simulationStatus === "deteriorating") return;

      setPatients(prevPatients => {
        const updated = prevPatients.map(patient => {
          // Patient 4 is reserved for crisis simulation triggers, bypass normal updates
          if (patient.id === 4 && simulationStatus === "idle") {
            // Keep Patient 4 relatively stable before simulation
            return patient;
          }

          const v = { ...patient.vitals };
          
          // Helper to adjust vital with random walk
          const adjust = (val, min, max, velocity) => {
            const shift = (Math.random() - 0.5) * velocity;
            const newVal = Number((val + shift).toFixed(1));
            return Math.min(max, Math.max(min, newVal));
          };

          // 1. Heart Rate
          v.hr.current = Math.round(adjust(v.hr.current, 50, 150, 2));
          v.hr.history = [...v.hr.history.slice(1), v.hr.current];
          v.hr.trend = v.hr.current > v.hr.history[v.hr.history.length - 2] ? "up" : v.hr.current < v.hr.history[v.hr.history.length - 2] ? "down" : "stable";

          // 2. BP
          v.bp.currentSystolic = Math.round(adjust(v.bp.currentSystolic, 80, 180, 3));
          v.bp.currentDiastolic = Math.round(adjust(v.bp.currentDiastolic, 50, 110, 2));
          v.bp.historySystolic = [...v.bp.historySystolic.slice(1), v.bp.currentSystolic];
          v.bp.historyDiastolic = [...v.bp.historyDiastolic.slice(1), v.bp.currentDiastolic];
          v.bp.trend = v.bp.currentSystolic > v.bp.historySystolic[v.bp.historySystolic.length - 2] ? "up" : v.bp.currentSystolic < v.bp.historySystolic[v.bp.historySystolic.length - 2] ? "down" : "stable";

          // 3. SpO2
          // Keep SpO2 highly stable unless already abnormal
          const spo2MinLimit = patient.id === 1 || patient.id === 2 || patient.id === 7 ? 88 : 94;
          v.spo2.current = Math.round(adjust(v.spo2.current, spo2MinLimit, 100, 0.6));
          v.spo2.history = [...v.spo2.history.slice(1), v.spo2.current];
          v.spo2.trend = v.spo2.current > v.spo2.history[v.spo2.history.length - 2] ? "up" : v.spo2.current < v.spo2.history[v.spo2.history.length - 2] ? "down" : "stable";

          // 4. RR
          v.rr.current = Math.round(adjust(v.rr.current, 10, 35, 1.2));
          v.rr.history = [...v.rr.history.slice(1), v.rr.current];
          v.rr.trend = v.rr.current > v.rr.history[v.rr.history.length - 2] ? "up" : v.rr.current < v.rr.history[v.rr.history.length - 2] ? "down" : "stable";

          // 5. Temp
          v.temp.current = Number(adjust(v.temp.current, 35.0, 41.0, 0.1).toFixed(1));
          v.temp.history = [...v.temp.history.slice(1), v.temp.current];
          v.temp.trend = v.temp.current > v.temp.history[v.temp.history.length - 2] ? "up" : v.temp.current < v.temp.history[v.temp.history.length - 2] ? "down" : "stable";

          const score = calculateCrisisScore(v);
          const severity = score >= 70 ? "critical" : score >= 40 ? "warning" : "stable";

          return { ...patient, vitals: v, score, severity };
        });

        return updated;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [simulationStatus]);

  // --- CASCADE CRISIS SIMULATOR TRIGGERS ---
  const triggerCrisisSimulation = () => {
    if (simulationStatus !== "idle") return;
    
    setSimulationStatus("countdown");
    setCountdown(2);
    
    // 2-Second Countdown
    const countdownTimer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          startRapidDeterioration();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startRapidDeterioration = () => {
    setSimulationStatus("deteriorating");
    deteriorationStepRef.current = 0;
    
    // Focus Patient 4 (James Mercer) immediately
    setSelectedPatientId(4);

    // Rapid Deterioration Steps: from baseline [HR 82, BP 122/78, SpO2 97%, RR 16]
    // To critical [HR 142, BP 82/53, SpO2 85%, RR 28] over 10 steps (3 seconds)
    const steps = 10;
    const startHR = 82, targetHR = 142;
    const startBPs = 122, targetBPs = 82;
    const startBPd = 78, targetBPd = 53;
    const startSpO2 = 97, targetSpO2 = 85;
    const startRR = 16, targetRR = 28;

    deteriorationIntervalRef.current = setInterval(() => {
      deteriorationStepRef.current += 1;
      const step = deteriorationStepRef.current;

      setPatients(prevPatients => {
        return prevPatients.map(patient => {
          if (patient.id !== 4) return patient; // Only degrade Patient 4

          const v = { ...patient.vitals };
          const ratio = step / steps;

          // Compute interpolated values
          v.hr.current = Math.round(startHR + (targetHR - startHR) * ratio);
          v.hr.history = [...v.hr.history.slice(1), v.hr.current];
          v.hr.trend = "up";

          v.bp.currentSystolic = Math.round(startBPs + (targetBPs - startBPs) * ratio);
          v.bp.currentDiastolic = Math.round(startBPd + (targetBPd - startBPd) * ratio);
          v.bp.historySystolic = [...v.bp.historySystolic.slice(1), v.bp.currentSystolic];
          v.bp.historyDiastolic = [...v.bp.historyDiastolic.slice(1), v.bp.currentDiastolic];
          v.bp.trend = "down";

          v.spo2.current = Math.round(startSpO2 + (targetSpO2 - startSpO2) * ratio);
          v.spo2.history = [...v.spo2.history.slice(1), v.spo2.current];
          v.spo2.trend = "down";

          v.rr.current = Math.round(startRR + (targetRR - startRR) * ratio);
          v.rr.history = [...v.rr.history.slice(1), v.rr.current];
          v.rr.trend = "up";

          // Calculate score
          const score = calculateCrisisScore(v);
          const severity = score >= 70 ? "critical" : score >= 40 ? "warning" : "stable";

          return { ...patient, vitals: v, score, severity };
        });
      });

      if (step >= steps) {
        clearInterval(deteriorationIntervalRef.current);
        setSimulationStatus("idle");
        
        // Trigger final Claude / Local summary generation
        setPatients(currentPatients => {
          const finalMercer = currentPatients.find(p => p.id === 4);
          if (finalMercer) {
            loadBriefing(finalMercer);
          }
          return currentPatients;
        });
      }
    }, 300); // 300ms * 10 steps = 3.0s total deterioration duration
  };

  // Sort patients by Crisis Score descending
  const sortedPatients = useMemo(() => {
    return [...patients].sort((a, b) => b.score - a.score);
  }, [patients]);

  return (
    <div className={`app-container ${selectedPatient ? 'sidebar-open' : ''}`}>
      {/* Header commands */}
      <header className="header-bar">
        <div className="brand-section">
          <svg className="logo-heartbeat" viewBox="0 0 50 50">
            <path d="M5 25h10l4-15 6 30 4-20 4 10h12" />
          </svg>
          <div>
            <h1>CareSync <span>AI</span></h1>
            <span className="brand-tagline">From alarm noise to clinical clarity.</span>
          </div>
        </div>

        <div className="controls-section">
          <div className="system-status">
            <span className={`status-dot ${simulationStatus !== "idle" ? 'simulating' : ''}`}></span>
            <span>{simulationStatus === "countdown" ? "PREPARING SIMULATION" : simulationStatus === "deteriorating" ? "DEGRADATION ACTIVE" : "COMMAND ACTIVE"}</span>
          </div>

          <button className="btn-primary" onClick={triggerCrisisSimulation} disabled={simulationStatus !== "idle"}>
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
              <path d="M11.354 5.646a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L8 8.293l2.646-2.647a.5.5 0 0 1 .708 0z"/>
            </svg>
            Simulate Crisis
          </button>

          <div className="settings-trigger">
            <button className="btn-secondary" onClick={() => setShowSettings(!showSettings)}>
              ⚙ Settings
            </button>
            {showSettings && (
              <div className="settings-dropdown">
                <h3>System Settings</h3>
                <div className="settings-input-group">
                  <label htmlFor="apiKey">Anthropic Claude API Key:</label>
                  <input
                    type="password"
                    id="apiKey"
                    className="settings-input"
                    value={apiKey}
                    placeholder="sk-ant-..."
                    onChange={handleApiKeyChange}
                  />
                  <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>
                    Keys are saved locally in localStorage. Leave blank to run CareSync's high-fidelity clinical rules fallback engine.
                  </span>
                </div>
                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setShowSettings(false)}>
                  Apply Configuration
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Command Dashboard */}
      <main className="main-content">
        {/* Ward Overview Stats */}
        <section className="dashboard-summary-grid">
          <div className="summary-card">
            <div className="summary-details">
              <h4>Total ICU Patients</h4>
              <div className="summary-value">{stats.total}</div>
            </div>
            <div className="summary-icon" style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--color-text-bright)' }}>
              👥
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-details">
              <h4>Stable Status</h4>
              <div className="summary-value" style={{ color: 'var(--color-stable)' }}>{stats.stable}</div>
            </div>
            <div className="summary-icon" style={{ backgroundColor: 'var(--color-stable-glow)', color: 'var(--color-stable)' }}>
              ✓
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-details">
              <h4>Under Watch</h4>
              <div className="summary-value" style={{ color: 'var(--color-warning)' }}>{stats.warning}</div>
            </div>
            <div className="summary-icon" style={{ backgroundColor: 'var(--color-warning-glow)', color: 'var(--color-warning)' }}>
              !
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-details">
              <h4>Critical Distress</h4>
              <div className="summary-value" style={{ color: 'var(--color-critical)' }}>{stats.critical}</div>
            </div>
            <div className="summary-icon" style={{ backgroundColor: 'var(--color-critical-glow)', color: 'var(--color-critical)' }}>
              ⚠
            </div>
          </div>
        </section>

        {/* Dynamic Sorted Patient Card Grid */}
        <section className="ward-grid">
          {sortedPatients.map((patient) => {
            const isSelected = patient.id === selectedPatientId;
            return (
              <div
                key={patient.id}
                className={`patient-card severity-${patient.severity} ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedPatientId(patient.id)}
              >
                <div className="card-header-flex">
                  <div className="patient-identity">
                    <h2>{patient.name}</h2>
                    <div className="patient-demographics">
                      {patient.age}{patient.gender} • Room {patient.room}
                    </div>
                  </div>
                  <div className="score-badge-container">
                    <div className="crisis-score-badge">
                      {patient.score}
                    </div>
                    <span className="crisis-score-label">Crisis Score</span>
                  </div>
                </div>

                {/* Vitals Tiles */}
                <div className="vitals-grid">
                  {/* Heart Rate */}
                  <div className={`vital-tile status-${patient.vitals.hr.current < patient.vitals.hr.minNormal || patient.vitals.hr.current > patient.vitals.hr.maxNormal ? 'critical' : 'stable'}`}>
                    <div className="vital-label-row">
                      <span className="vital-name">Heart Rate</span>
                      <span className={`vital-trend-arrow ${patient.vitals.hr.trend}`}>
                        {patient.vitals.hr.trend === 'up' ? '↑' : patient.vitals.hr.trend === 'down' ? '↓' : '→'}
                      </span>
                    </div>
                    <div className="vital-value-row">
                      <span className="vital-number">{patient.vitals.hr.current}</span>
                      <span className="vital-unit">{patient.vitals.hr.unit}</span>
                    </div>
                    <Sparkline
                      data={patient.vitals.hr.history}
                      minNormal={patient.vitals.hr.minNormal}
                      maxNormal={patient.vitals.hr.maxNormal}
                    />
                  </div>

                  {/* SpO2 */}
                  <div className={`vital-tile status-${patient.vitals.spo2.current < patient.vitals.spo2.minNormal ? 'critical' : 'stable'}`}>
                    <div className="vital-label-row">
                      <span className="vital-name">SpO₂</span>
                      <span className={`vital-trend-arrow ${patient.vitals.spo2.trend}`}>
                        {patient.vitals.spo2.trend === 'up' ? '↑' : patient.vitals.spo2.trend === 'down' ? '↓' : '→'}
                      </span>
                    </div>
                    <div className="vital-value-row">
                      <span className="vital-number">{patient.vitals.spo2.current}</span>
                      <span className="vital-unit">{patient.vitals.spo2.unit}</span>
                    </div>
                    <Sparkline
                      data={patient.vitals.spo2.history}
                      minNormal={patient.vitals.spo2.minNormal}
                      maxNormal={patient.vitals.spo2.maxNormal}
                    />
                  </div>

                  {/* Blood Pressure */}
                  <div className={`vital-tile full-width status-${patient.vitals.bp.currentSystolic < patient.vitals.bp.minNormalSystolic || patient.vitals.bp.currentSystolic > patient.vitals.bp.maxNormalSystolic ? 'critical' : 'stable'}`}>
                    <div className="vital-label-row">
                      <span className="vital-name">Blood Pressure</span>
                      <span className={`vital-trend-arrow ${patient.vitals.bp.trend}`}>
                        {patient.vitals.bp.trend === 'up' ? '↑' : patient.vitals.bp.trend === 'down' ? '↓' : '→'}
                      </span>
                    </div>
                    <div className="vital-value-row">
                      <span className="vital-number">
                        {patient.vitals.bp.currentSystolic}/{patient.vitals.bp.currentDiastolic}
                      </span>
                      <span className="vital-unit">{patient.vitals.bp.unit}</span>
                    </div>
                    <Sparkline
                      data={patient.vitals.bp.historySystolic}
                      minNormal={patient.vitals.bp.minNormalSystolic}
                      maxNormal={patient.vitals.bp.maxNormalSystolic}
                    />
                  </div>

                  {/* Respiratory Rate */}
                  <div className={`vital-tile status-${patient.vitals.rr.current < patient.vitals.rr.minNormal || patient.vitals.rr.current > patient.vitals.rr.maxNormal ? 'critical' : 'stable'}`}>
                    <div className="vital-label-row">
                      <span className="vital-name">Resp. Rate</span>
                      <span className={`vital-trend-arrow ${patient.vitals.rr.trend}`}>
                        {patient.vitals.rr.trend === 'up' ? '↑' : patient.vitals.rr.trend === 'down' ? '↓' : '→'}
                      </span>
                    </div>
                    <div className="vital-value-row">
                      <span className="vital-number">{patient.vitals.rr.current}</span>
                      <span className="vital-unit">{patient.vitals.rr.unit}</span>
                    </div>
                    <Sparkline
                      data={patient.vitals.rr.history}
                      minNormal={patient.vitals.rr.minNormal}
                      maxNormal={patient.vitals.rr.maxNormal}
                    />
                  </div>

                  {/* Temperature */}
                  <div className={`vital-tile status-${patient.vitals.temp.current < patient.vitals.temp.minNormal || patient.vitals.temp.current > patient.vitals.temp.maxNormal ? 'critical' : 'stable'}`}>
                    <div className="vital-label-row">
                      <span className="vital-name">Temperature</span>
                      <span className={`vital-trend-arrow ${patient.vitals.temp.trend}`}>
                        {patient.vitals.temp.trend === 'up' ? '↑' : patient.vitals.temp.trend === 'down' ? '↓' : '→'}
                      </span>
                    </div>
                    <div className="vital-value-row">
                      <span className="vital-number">{patient.vitals.temp.current.toFixed(1)}</span>
                      <span className="vital-unit">{patient.vitals.temp.unit}</span>
                    </div>
                    <Sparkline
                      data={patient.vitals.temp.history}
                      minNormal={patient.vitals.temp.minNormal}
                      maxNormal={patient.vitals.temp.maxNormal}
                    />
                  </div>
                </div>

                <div className="card-actions">
                  <span className={`severity-pill ${patient.severity}`}>
                    {patient.severity}
                  </span>
                  <button className="card-btn">
                    Clinical Briefing →
                  </button>
                </div>
              </div>
            );
          })}
        </section>
      </main>

      {/* Slide-out Sidebar Panel */}
      <aside className={`briefing-sidebar ${selectedPatient ? 'open' : ''}`}>
        {selectedPatient && (
          <React.Fragment>
            <div className="sidebar-header">
              <div>
                <h2>{selectedPatient.name}</h2>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  Room {selectedPatient.room} • {selectedPatient.diagnosis}
                </div>
              </div>
              <button className="sidebar-close-btn" onClick={() => setSelectedPatientId(null)}>
                ×
              </button>
            </div>

            <div className="sidebar-body">
              {/* Score Indicator */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--color-bg-darker)', padding: '0.85rem 1.25rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Crisis Severity</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: selectedPatient.severity === 'critical' ? 'var(--color-critical)' : selectedPatient.severity === 'warning' ? 'var(--color-warning)' : 'var(--color-stable)', textTransform: 'uppercase' }}>
                    {selectedPatient.severity}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Calculated Score</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, fontFamily: 'var(--font-mono)' }}>
                    {selectedPatient.score}<span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>/100</span>
                  </div>
                </div>
              </div>

              {/* AI Briefing Narrative Panel */}
              <div className="ai-summary-box">
                <div className="ai-summary-header">
                  <svg className="ai-sparkle-icon" viewBox="0 0 24 24">
                    <path d="M12 2l3 6 6 3-6 3-3 6-3-6-6-3 6-3 3-6zm0 4.67L10.78 10 7.33 11.22l3.45 1.22.4 3.45L12 14l1.22-3.45 3.45-1.22-3.45-1.22z" />
                  </svg>
                  <span className="ai-summary-title">CLAUDE CLINICAL NARRATIVE</span>
                </div>
                
                {aiLoading ? (
                  <div className="ai-summary-loading">
                    <div className="loading-skeleton long"></div>
                    <div className="loading-skeleton medium"></div>
                    <div className="loading-skeleton short"></div>
                  </div>
                ) : (
                  <div>
                    {aiError && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-warning)', marginBottom: '0.5rem', fontFamily: 'var(--font-mono)' }}>
                        ⚠ {aiError}
                      </div>
                    )}
                    <p className="ai-summary-text">{aiBriefing}</p>
                  </div>
                )}
                
                <button
                  className="btn-secondary"
                  style={{ width: '100%', fontSize: '0.75rem', padding: '0.35rem', marginTop: '1rem' }}
                  onClick={() => loadBriefing(selectedPatient)}
                  disabled={aiLoading}
                >
                  🔄 Regenerate Briefing
                </button>
              </div>

              {/* WHO Normal Ranges Table */}
              <div className="clinical-breakdown-section">
                <h3>Physiological Target Ranges</h3>
                <table className="analysis-table">
                  <thead>
                    <tr>
                      <th>Vitals Param</th>
                      <th>Current</th>
                      <th>Reference (WHO)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* HR */}
                    <tr>
                      <td className="table-vital-name">Heart Rate</td>
                      <td className={`table-vital-value ${selectedPatient.vitals.hr.current < selectedPatient.vitals.hr.minNormal || selectedPatient.vitals.hr.current > selectedPatient.vitals.hr.maxNormal ? 'critical' : 'stable'}`}>
                        {selectedPatient.vitals.hr.current} bpm
                      </td>
                      <td className="table-reference-range">60 - 100</td>
                    </tr>
                    {/* SpO2 */}
                    <tr>
                      <td className="table-vital-name">SpO₂</td>
                      <td className={`table-vital-value ${selectedPatient.vitals.spo2.current < selectedPatient.vitals.spo2.minNormal ? 'critical' : 'stable'}`}>
                        {selectedPatient.vitals.spo2.current}%
                      </td>
                      <td className="table-reference-range">&gt; 95%</td>
                    </tr>
                    {/* BP */}
                    <tr>
                      <td className="table-vital-name">Blood Pressure</td>
                      <td className={`table-vital-value ${selectedPatient.vitals.bp.currentSystolic < selectedPatient.vitals.bp.minNormalSystolic || selectedPatient.vitals.bp.currentSystolic > selectedPatient.vitals.bp.maxNormalSystolic ? 'critical' : 'stable'}`}>
                        {selectedPatient.vitals.bp.currentSystolic}/{selectedPatient.vitals.bp.currentDiastolic} mmHg
                      </td>
                      <td className="table-reference-range">90-140 / 60-90</td>
                    </tr>
                    {/* RR */}
                    <tr>
                      <td className="table-vital-name">Resp. Rate</td>
                      <td className={`table-vital-value ${selectedPatient.vitals.rr.current < selectedPatient.vitals.rr.minNormal || selectedPatient.vitals.rr.current > selectedPatient.vitals.rr.maxNormal ? 'critical' : 'stable'}`}>
                        {selectedPatient.vitals.rr.current} rpm
                      </td>
                      <td className="table-reference-range">12 - 20</td>
                    </tr>
                    {/* Temp */}
                    <tr>
                      <td className="table-vital-name">Temperature</td>
                      <td className={`table-vital-value ${selectedPatient.vitals.temp.current < selectedPatient.vitals.temp.minNormal || selectedPatient.vitals.temp.current > selectedPatient.vitals.temp.maxNormal ? 'critical' : 'stable'}`}>
                        {selectedPatient.vitals.temp.current.toFixed(1)}°C
                      </td>
                      <td className="table-reference-range">36.0 - 37.8</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Nurse Action List */}
              <div className="sidebar-checklist">
                <h4>Bedside Protocols Required:</h4>
                <ul>
                  <li>Verify arterial line/cuff transducer calibration</li>
                  <li>Perform manual pulmonary auscultation</li>
                  <li>Confirm continuous supplemental oxygen fraction</li>
                  <li>Ensure intravenous access lines remain patent</li>
                </ul>
              </div>
            </div>
          </React.Fragment>
        )}
      </aside>

      {/* Crisis countdown overlay */}
      {simulationStatus === "countdown" && (
        <div className="sim-overlay">
          <div className="sim-countdown-number">{countdown}</div>
          <div className="sim-overlay-title">CRISIS SIMULATION INITIATED</div>
          <div className="sim-overlay-subtitle">
            Injecting cardiogenic and respiratory deterioration into Patient 4 (James Mercer, Room ICU-3D). System re-ranking animation will execute shortly...
          </div>
        </div>
      )}
    </div>
  );
}

// Render the application to DOM
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);
