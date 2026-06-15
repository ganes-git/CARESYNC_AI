// ══════════════════════════════════════════════════════════
// CareSync AI — v4 PREMIUM Minimalist Command Center
// Zero Overlap • Louder Siren • Super Interactive
// ══════════════════════════════════════════════════════════

const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ─── Helpers ───
const hist = (base, v, n = 15) => Array.from({ length: n }, () => +(base + (Math.random() - 0.5) * v).toFixed(1));
const now = () => new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

// ─── 10 Patients ───
const P0 = [
  { id:1, name:"Eleanor Vance", age:72, g:"F", room:"ICU-3A", dx:"Severe Urosepsis", v:{ hr:{c:104,h:hist(102,6),bl:72,lo:60,hi:100,u:"bpm",t:"up"}, bp:{cs:92,cd:56,hs:hist(94,8),hd:hist(58,4),bls:118,bld:76,los:90,his:140,lod:60,hid:90,u:"mmHg",t:"down"}, o2:{c:93,h:hist(94,2),bl:98,lo:95,hi:100,u:"%",t:"down"}, rr:{c:22,h:hist(21,2),bl:15,lo:12,hi:20,u:"rpm",t:"up"}, tp:{c:38.9,h:hist(38.8,0.4),bl:36.8,lo:36,hi:37.8,u:"°C",t:"up"} } },
  { id:2, name:"Marcus Aurelius", age:65, g:"M", room:"ICU-3B", dx:"ARDS", v:{ hr:{c:95,h:hist(93,4),bl:75,lo:60,hi:100,u:"bpm",t:"up"}, bp:{cs:135,cd:82,hs:hist(130,10),hd:hist(80,5),bls:125,bld:80,los:90,his:140,lod:60,hid:90,u:"mmHg",t:"stable"}, o2:{c:90,h:hist(91,1),bl:97,lo:95,hi:100,u:"%",t:"down"}, rr:{c:24,h:hist(23,2),bl:16,lo:12,hi:20,u:"rpm",t:"up"}, tp:{c:37.2,h:hist(37.1,0.2),bl:36.7,lo:36,hi:37.8,u:"°C",t:"stable"} } },
  { id:3, name:"Sarah Jenkins", age:45, g:"F", room:"ICU-3C", dx:"Acute Pancreatitis", v:{ hr:{c:78,h:hist(77,3),bl:74,lo:60,hi:100,u:"bpm",t:"stable"}, bp:{cs:118,cd:76,hs:hist(120,4),hd:hist(78,3),bls:120,bld:78,los:90,his:140,lod:60,hid:90,u:"mmHg",t:"stable"}, o2:{c:98,h:hist(98,1),bl:98,lo:95,hi:100,u:"%",t:"stable"}, rr:{c:16,h:hist(16,1),bl:15,lo:12,hi:20,u:"rpm",t:"stable"}, tp:{c:36.9,h:hist(36.8,.15),bl:36.7,lo:36,hi:37.8,u:"°C",t:"stable"} } },
  { id:4, name:"James Mercer", age:67, g:"M", room:"ICU-3D", dx:"Post-Op CABG", v:{ hr:{c:82,h:hist(80,2),bl:78,lo:60,hi:100,u:"bpm",t:"stable"}, bp:{cs:122,cd:78,hs:hist(120,3),hd:hist(76,2),bls:120,bld:78,los:90,his:140,lod:60,hid:90,u:"mmHg",t:"stable"}, o2:{c:97,h:hist(97,1),bl:98,lo:95,hi:100,u:"%",t:"stable"}, rr:{c:16,h:hist(15,1),bl:14,lo:12,hi:20,u:"rpm",t:"stable"}, tp:{c:36.8,h:hist(36.8,.1),bl:36.6,lo:36,hi:37.8,u:"°C",t:"stable"} } },
  { id:5, name:"Liam O'Connor", age:29, g:"M", room:"ICU-4A", dx:"Traumatic Brain Injury", v:{ hr:{c:64,h:hist(65,3),bl:68,lo:60,hi:100,u:"bpm",t:"stable"}, bp:{cs:112,cd:70,hs:hist(115,5),hd:hist(72,3),bls:118,bld:74,los:90,his:140,lod:60,hid:90,u:"mmHg",t:"stable"}, o2:{c:99,h:hist(99,1),bl:98,lo:95,hi:100,u:"%",t:"stable"}, rr:{c:14,h:hist(14,1),bl:14,lo:12,hi:20,u:"rpm",t:"stable"}, tp:{c:36.5,h:hist(36.6,.1),bl:36.7,lo:36,hi:37.8,u:"°C",t:"stable"} } },
  { id:6, name:"Sophia Martinez", age:58, g:"F", room:"ICU-4B", dx:"DKA", v:{ hr:{c:112,h:hist(110,5),bl:76,lo:60,hi:100,u:"bpm",t:"up"}, bp:{cs:105,cd:62,hs:hist(108,6),hd:hist(64,4),bls:120,bld:76,los:90,his:140,lod:60,hid:90,u:"mmHg",t:"down"}, o2:{c:96,h:hist(96,1),bl:98,lo:95,hi:100,u:"%",t:"stable"}, rr:{c:26,h:hist(25,2),bl:16,lo:12,hi:20,u:"rpm",t:"up"}, tp:{c:37.4,h:hist(37.3,.2),bl:36.8,lo:36,hi:37.8,u:"°C",t:"stable"} } },
  { id:7, name:"Chen Wei", age:81, g:"M", room:"ICU-4C", dx:"Heart Failure", v:{ hr:{c:88,h:hist(86,4),bl:70,lo:60,hi:100,u:"bpm",t:"up"}, bp:{cs:154,cd:94,hs:hist(150,8),hd:hist(92,4),bls:130,bld:82,los:90,his:140,lod:60,hid:90,u:"mmHg",t:"up"}, o2:{c:92,h:hist(93,2),bl:96,lo:95,hi:100,u:"%",t:"down"}, rr:{c:21,h:hist(20,2),bl:16,lo:12,hi:20,u:"rpm",t:"up"}, tp:{c:36.6,h:hist(36.6,.15),bl:36.5,lo:36,hi:37.8,u:"°C",t:"stable"} } },
  { id:8, name:"Clara Oswald", age:34, g:"F", room:"ICU-4D", dx:"Pulmonary Embolism", v:{ hr:{c:98,h:hist(96,5),bl:72,lo:60,hi:100,u:"bpm",t:"up"}, bp:{cs:126,cd:78,hs:hist(124,6),hd:hist(76,3),bls:120,bld:76,los:90,his:140,lod:60,hid:90,u:"mmHg",t:"stable"}, o2:{c:94,h:hist(95,1),bl:98,lo:95,hi:100,u:"%",t:"down"}, rr:{c:19,h:hist(18,1),bl:14,lo:12,hi:20,u:"rpm",t:"up"}, tp:{c:37,h:hist(37,.1),bl:36.8,lo:36,hi:37.8,u:"°C",t:"stable"} } },
  { id:9, name:"David Kim", age:50, g:"M", room:"ICU-5A", dx:"ESRD", v:{ hr:{c:72,h:hist(73,2),bl:74,lo:60,hi:100,u:"bpm",t:"stable"}, bp:{cs:138,cd:88,hs:hist(135,5),hd:hist(86,3),bls:135,bld:84,los:90,his:140,lod:60,hid:90,u:"mmHg",t:"stable"}, o2:{c:97,h:hist(97,1),bl:97,lo:95,hi:100,u:"%",t:"stable"}, rr:{c:15,h:hist(15,1),bl:15,lo:12,hi:20,u:"rpm",t:"stable"}, tp:{c:36.4,h:hist(36.5,.15),bl:36.6,lo:36,hi:37.8,u:"°C",t:"stable"} } },
  { id:10, name:"Aisha Bello", age:62, g:"F", room:"ICU-5B", dx:"Post-Op Transplant", v:{ hr:{c:80,h:hist(79,3),bl:78,lo:60,hi:100,u:"bpm",t:"stable"}, bp:{cs:128,cd:82,hs:hist(126,4),hd:hist(80,2),bls:124,bld:78,los:90,his:140,lod:60,hid:90,u:"mmHg",t:"stable"}, o2:{c:98,h:hist(98,1),bl:98,lo:95,hi:100,u:"%",t:"stable"}, rr:{c:16,h:hist(17,1),bl:15,lo:12,hi:20,u:"rpm",t:"stable"}, tp:{c:37.1,h:hist(37,.1),bl:36.8,lo:36,hi:37.8,u:"°C",t:"stable"} } },
];

// ═══ CRISIS SCORE ═══
function calcScore(v) {
  let devs = [], vels = [], abn = 0;
  // HR
  let d = 0;
  if (v.hr.c > v.hr.hi) d = Math.min(100, (v.hr.c - v.hr.hi) / 40 * 100);
  else if (v.hr.c < v.hr.lo) d = Math.min(100, (v.hr.lo - v.hr.c) / 20 * 100);
  devs.push(d); if (d > 15) abn++;
  if (v.hr.h?.length >= 5) vels.push(Math.min(100, Math.max(0, v.hr.c - v.hr.h[v.hr.h.length - 5]) * 4));
  // BP
  d = 0;
  if (v.bp.cs > v.bp.his) d = Math.min(100, (v.bp.cs - v.bp.his) / 40 * 100);
  else if (v.bp.cs < v.bp.los) d = Math.min(100, (v.bp.los - v.bp.cs) / 25 * 100);
  devs.push(d); if (d > 15) abn++;
  if (v.bp.hs?.length >= 5) vels.push(Math.min(100, Math.max(0, v.bp.hs[v.bp.hs.length - 5] - v.bp.cs) * 3));
  // SpO2
  d = 0;
  if (v.o2.c < v.o2.lo) d = Math.min(100, (v.o2.lo - v.o2.c) / 12 * 100);
  devs.push(d); if (d > 10) abn++;
  if (v.o2.h?.length >= 5) vels.push(Math.min(100, Math.max(0, v.o2.h[v.o2.h.length - 5] - v.o2.c) * 15));
  // RR
  d = 0;
  if (v.rr.c > v.rr.hi) d = Math.min(100, (v.rr.c - v.rr.hi) / 15 * 100);
  else if (v.rr.c < v.rr.lo) d = Math.min(100, (v.rr.lo - v.rr.c) / 6 * 100);
  devs.push(d); if (d > 15) abn++;
  if (v.rr.h?.length >= 5) vels.push(Math.min(100, Math.max(0, v.rr.c - v.rr.h[v.rr.h.length - 5]) * 6));
  // Temp
  d = 0;
  if (v.tp.c > v.tp.hi) d = Math.min(100, (v.tp.c - v.tp.hi) / 2 * 100);
  else if (v.tp.c < v.tp.lo) d = Math.min(100, (v.tp.lo - v.tp.c) / 1.5 * 100);
  devs.push(d); if (d > 15) abn++;

  const dMax = devs.length ? Math.max(...devs) : 0;
  const vMax = vels.length ? Math.max(...vels) : 0;
  return Math.min(100, Math.max(0, Math.round(dMax * 0.3 + vMax * 0.4 + Math.min(100, abn * 25) * 0.3)));
}

function localAI(p) {
  const { v, score } = p;
  const c = [], w = [];
  if (v.hr.c > 110) c.push(`Tachycardia ${v.hr.c}bpm`);
  else if (v.hr.c > 100) w.push(`Elevated HR ${v.hr.c}bpm`);
  if (v.o2.c < 90) c.push(`Severe Hypoxemia SpO₂ ${v.o2.c}%`);
  else if (v.o2.c < 95) w.push(`Low SpO₂ ${v.o2.c}%`);
  if (v.bp.cs < 90) c.push(`Hypotension ${v.bp.cs}/${v.bp.cd}`);
  if (v.rr.c > 25) c.push(`Tachypnea ${v.rr.c}rpm`);
  else if (v.rr.c > 20) w.push(`Elevated RR ${v.rr.c}rpm`);
  if (v.tp.c > 38.5) w.push(`Fever ${v.tp.c.toFixed(1)}°C`);
  const all = [...c, ...w];
  if (score >= 70) return { risk:`Critical: ${all.slice(0,2).join(' & ')||'Hemodynamic collapse'}.`, vec:`Multi-vital collapse. Score ${score}/100.`, acts:["Increase O₂ immediately.","Verify IV access.","Bedside physician consult."] };
  if (score >= 40) return { risk:`Watch: ${all.join(', ')||'Fluctuating baselines'}.`, vec:`Vitals outside thresholds. Score ${score}/100.`, acts:["Increase surveillance q15min.","Review medication infusion."] };
  return { risk:"Patient stable.", vec:"Vitals within limits.", acts:["Routine ICU monitoring."] };
}

async function claudeAI(p, key) {
  const pr = `You are a clinical AI. Return ONLY JSON: {"risk":"...","vec":"...","acts":["..."]}\nPatient: ${p.name} ${p.age}${p.g}, ${p.dx}\nScore: ${p.score}/100\nHR:${p.v.hr.c}bpm BP:${p.v.bp.cs}/${p.v.bp.cd} SpO2:${p.v.o2.c}% RR:${p.v.rr.c} T:${p.v.tp.c.toFixed(1)}°C`;
  const r = await fetch('https://api.anthropic.com/v1/messages', { method:'POST', headers:{'content-type':'application/json','x-api-key':key,'anthropic-version':'2023-06-01','anthropic-dangerously-allow-browser':'true'}, body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:200,messages:[{role:'user',content:pr}]}) });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const d = await r.json();
  let t = d.content[0].text.trim();
  if (t.startsWith('```')) t = t.replace(/^```(json)?/,'').replace(/```$/,'').trim();
  return JSON.parse(t);
}

// ═══ SPARKLINE ═══
function Spark({ data, lo, hi }) {
  if (!data || data.length < 2) return null;
  const W=120, H=22, P=2;
  const mn = Math.min(...data), mx = Math.max(...data), rng = mx - mn;
  const pts = data.map((v,i) => `${P+i/(data.length-1)*(W-2*P)},${rng===0?H/2:P+(1-(v-mn)/rng)*(H-2*P)}`).join(' ');
  const last = data[data.length-1];
  const col = last < lo || last > hi ? 'var(--red)' : 'var(--grn)';
  const lx = P+(W-2*P), ly = rng===0?H/2:P+(1-(last-mn)/rng)*(H-2*P);
  return <div className="spark-wrap"><svg viewBox={`0 0 ${W} ${H}`}><polyline className="spark-line" points={pts} stroke={col}/><circle cx={lx} cy={ly} r="2" fill={col}/></svg></div>;
}

// ═══ APP ═══
function App() {
  const [pts, setPts] = useState(() => P0.map(p => { const s = calcScore(p.v); return { ...p, score:s, sev: s>=70?"critical":s>=40?"warning":"stable" }; }));
  const [view, setView] = useState("ward");
  const [selId, setSelId] = useState(null);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("cs_key")||"");
  const [cfgOpen, setCfgOpen] = useState(false);
  const [simSt, setSimSt] = useState("idle");
  const [cd, setCd] = useState(2);
  const [detId, setDetId] = useState(null);
  const [speed, setSpeed] = useState(2000);
  const [audio, setAudio] = useState(true);
  const [acked, setAcked] = useState(new Set());
  const [brief, setBrief] = useState({ risk:"", vec:"", acts:[] });
  const [aiLoad, setAiLoad] = useState(false);
  const [aiErr, setAiErr] = useState(null);
  const [log, setLog] = useState([
    { t:now(), m:"CareSync AI initialized. 10 patients loaded.", k:"info" },
    { t:now(), m:"Real-time telemetry active — 2s intervals.", k:"info" },
  ]);

  // ─── Manual Intake & Vitals State ───
  const [intakeIsNew, setIntakeIsNew] = useState(true);
  const [intakeId, setIntakeId] = useState("");
  const [intakeName, setIntakeName] = useState("");
  const [intakeAge, setIntakeAge] = useState("");
  const [intakeGender, setIntakeGender] = useState("M");
  const [intakeRoom, setIntakeRoom] = useState("");
  const [intakeDx, setIntakeDx] = useState("");

  const [intakeHR, setIntakeHR] = useState("80");
  const [intakeO2, setIntakeO2] = useState("98");
  const [intakeBPS, setIntakeBPS] = useState("120");
  const [intakeBPD, setIntakeBPD] = useState("80");
  const [intakeRR, setIntakeRR] = useState("16");
  const [intakeTemp, setIntakeTemp] = useState("37.0");

  const [intakeResult, setIntakeResult] = useState(null);
  const [intakeErr, setIntakeErr] = useState("");


  const oscRef = useRef(null);
  const osc2Ref = useRef(null);
  const gainRef = useRef(null);
  const lfoRef = useRef(null);
  const sirenIvRef = useRef(null);
  const actxRef = useRef(null);
  const detStepRef = useRef(0);
  const detIvRef = useRef(null);

  const stats = useMemo(() => { let s=0,w=0,c=0; pts.forEach(p=>{if(p.sev==="critical")c++;else if(p.sev==="warning")w++;else s++;}); return {n:pts.length,s,w,c}; }, [pts]);
  const sel = useMemo(() => pts.find(p => p.id === selId) || null, [pts, selId]);
  const sorted = useMemo(() => [...pts].sort((a,b) => b.score - a.score), [pts]);

  const addLog = useCallback((m, k="info") => { setLog(p => [{t:now(),m,k},...p].slice(0,60)); }, []);

  // ═══ LOUD EMERGENCY SIREN ═══
  const startSiren = useCallback(() => {
    if (!audio || oscRef.current) return;
    try {
      const C = window.AudioContext || window.webkitAudioContext;
      const ctx = new C(); actxRef.current = ctx;

      // Main oscillator — sawtooth for harsh emergency tone
      const o1 = ctx.createOscillator();
      const o2 = ctx.createOscillator();
      const o3 = ctx.createOscillator(); // Sub-bass rumble
      const g = ctx.createGain();
      const comp = ctx.createDynamicsCompressor(); // Compressor for loudness

      o1.connect(g); o2.connect(g); o3.connect(g);
      g.connect(comp);
      comp.connect(ctx.destination);

      o1.type = 'sawtooth';
      o2.type = 'square';
      o3.type = 'sine';
      o1.frequency.setValueAtTime(800, ctx.currentTime);
      o2.frequency.setValueAtTime(805, ctx.currentTime);
      o3.frequency.setValueAtTime(120, ctx.currentTime); // Sub rumble

      // LOUDER GAIN — 0.12 (was 0.035)
      g.gain.setValueAtTime(0.12, ctx.currentTime);

      comp.threshold.setValueAtTime(-10, ctx.currentTime);
      comp.knee.setValueAtTime(10, ctx.currentTime);
      comp.ratio.setValueAtTime(6, ctx.currentTime);

      o1.start(); o2.start(); o3.start();
      oscRef.current = o1; osc2Ref.current = o2;
      gainRef.current = g; lfoRef.current = o3;

      // Rapid pitch sweep 600→1400Hz for piercing effect
      let hi = false;
      sirenIvRef.current = setInterval(() => {
        if (!oscRef.current || ctx.state !== 'running') return;
        const f = hi ? 1400 : 600;
        o1.frequency.exponentialRampToValueAtTime(f, ctx.currentTime + 0.18);
        o2.frequency.exponentialRampToValueAtTime(f + 5, ctx.currentTime + 0.18);
        // Pulse the gain for urgency
        g.gain.linearRampToValueAtTime(hi ? 0.14 : 0.08, ctx.currentTime + 0.18);
        hi = !hi;
      }, 200);
    } catch(e) { console.warn("Audio:", e); }
  }, [audio]);

  const stopSiren = useCallback(() => {
    if (sirenIvRef.current) { clearInterval(sirenIvRef.current); sirenIvRef.current = null; }
    [oscRef, osc2Ref, lfoRef].forEach(r => { if (r.current) { try{r.current.stop();r.current.disconnect();}catch(e){} r.current=null; } });
    if (actxRef.current) { try{actxRef.current.close();}catch(e){} actxRef.current=null; }
  }, []);

  useEffect(() => {
    const hasUn = pts.some(p => p.sev === "critical" && !acked.has(p.id));
    if (hasUn && audio) startSiren(); else stopSiren();
    return () => stopSiren();
  }, [pts, acked, audio]);

  // ─── Briefing ───
  const loadBrief = useCallback(async (p) => {
    if (!p) return;
    setAiLoad(true); setAiErr(null);
    if (apiKey?.trim().length > 10) {
      try { setBrief(await claudeAI(p, apiKey.trim())); }
      catch { setAiErr("Claude offline — local rules active."); setBrief(localAI(p)); }
    } else { setBrief(localAI(p)); }
    setAiLoad(false);
  }, [apiKey]);

  useEffect(() => { if (sel) loadBrief(sel); else setBrief({risk:"",vec:"",acts:[]}); }, [selId]);
  useEffect(() => { if (sel && simSt !== "deteriorating") setBrief(localAI(sel)); }, [pts]);

  // ═══ REAL-TIME LOOP ═══
  useEffect(() => {
    if (speed === null || simSt === "countdown" || simSt === "deteriorating") return;
    const iv = setInterval(() => {
      setPts(prev => prev.map(p => {
        if (p.id === detId) return p;
        const v = { ...p.v };
        const a = (val,lo,hi,vel) => Math.min(hi, Math.max(lo, +(val+(Math.random()-0.5)*vel).toFixed(1)));
        const trend = (cur, arr) => cur > arr[arr.length-2] ? "up" : cur < arr[arr.length-2] ? "down" : "stable";

        v.hr.c = Math.round(a(v.hr.c,50,150,2)); v.hr.h=[...v.hr.h.slice(1),v.hr.c]; v.hr.t=trend(v.hr.c,v.hr.h);
        v.bp.cs = Math.round(a(v.bp.cs,80,180,3)); v.bp.cd = Math.round(a(v.bp.cd,50,110,2));
        v.bp.hs=[...v.bp.hs.slice(1),v.bp.cs]; v.bp.hd=[...v.bp.hd.slice(1),v.bp.cd]; v.bp.t=trend(v.bp.cs,v.bp.hs);
        const o2Min = [1,2,7].includes(p.id)?88:94;
        v.o2.c = Math.round(a(v.o2.c,o2Min,100,0.6)); v.o2.h=[...v.o2.h.slice(1),v.o2.c]; v.o2.t=trend(v.o2.c,v.o2.h);
        v.rr.c = Math.round(a(v.rr.c,10,35,1.2)); v.rr.h=[...v.rr.h.slice(1),v.rr.c]; v.rr.t=trend(v.rr.c,v.rr.h);
        v.tp.c = +a(v.tp.c,35,41,0.1).toFixed(1); v.tp.h=[...v.tp.h.slice(1),v.tp.c]; v.tp.t=trend(v.tp.c,v.tp.h);

        const sc = calcScore(v);
        const oldS = p.sev;
        const sev = sc>=70?"critical":sc>=40?"warning":"stable";
        if (oldS !== sev) {
          if (sev==="critical") addLog(`🚨 ${p.name} → CRITICAL (${sc})`,"critical");
          else if (sev==="warning"&&oldS==="stable") addLog(`⚠️ ${p.name} → WARNING (${sc})`,"warning");
          else if (sev==="stable"&&oldS!=="stable") addLog(`✅ ${p.name} stabilized (${sc})`,"info");
        }
        if (sev!=="critical"&&acked.has(p.id)) setAcked(pr=>{const n=new Set(pr);n.delete(p.id);return n;});
        return { ...p, v, score:sc, sev };
      }));
    }, speed);
    return () => clearInterval(iv);
  }, [speed, simSt, detId, acked, audio]);

  // ═══ CRISIS SIM ═══
  const triggerCrisis = (pid) => {
    if (simSt !== "idle") return;
    setAcked(p=>{const n=new Set(p);n.delete(pid);return n;});
    setDetId(pid); setSimSt("countdown"); setCd(2);
    addLog(`⚡ Crisis simulation started for patient #${pid}`,"critical");
    const ti = setInterval(() => { setCd(p => { if(p<=1){clearInterval(ti);runCrisis(pid);return 0;} return p-1; }); }, 1000);
  };

  const runCrisis = (pid) => {
    setSimSt("deteriorating"); detStepRef.current = 0;
    setSelId(pid); setView("focus");
    const tgt = pts.find(p=>p.id===pid); if(!tgt) return;
    const s = tgt.v, steps = 10;
    const sHR=s.hr.c, sBPs=s.bp.cs, sBPd=s.bp.cd, sO2=s.o2.c, sRR=s.rr.c;
    detIvRef.current = setInterval(() => {
      detStepRef.current++;
      const step = detStepRef.current, r = step/steps;
      setPts(prev=>prev.map(p=>{
        if(p.id!==pid)return p;
        const v={...p.v};
        v.hr.c=Math.round(sHR+(145-sHR)*r); v.hr.h=[...v.hr.h.slice(1),v.hr.c]; v.hr.t="up";
        v.bp.cs=Math.round(sBPs+(78-sBPs)*r); v.bp.cd=Math.round(sBPd+(48-sBPd)*r);
        v.bp.hs=[...v.bp.hs.slice(1),v.bp.cs]; v.bp.hd=[...v.bp.hd.slice(1),v.bp.cd]; v.bp.t="down";
        v.o2.c=Math.round(sO2+(83-sO2)*r); v.o2.h=[...v.o2.h.slice(1),v.o2.c]; v.o2.t="down";
        v.rr.c=Math.round(sRR+(30-sRR)*r); v.rr.h=[...v.rr.h.slice(1),v.rr.c]; v.rr.t="up";
        const sc=calcScore(v);
        return {...p,v,score:sc,sev:sc>=70?"critical":sc>=40?"warning":"stable"};
      }));
      if(step>=steps){
        clearInterval(detIvRef.current);setSimSt("idle");setDetId(null);
        addLog(`💀 Crisis complete. Patient at critical floor.`,"critical");
        setPts(cur=>{const fp=cur.find(p=>p.id===pid);if(fp)loadBrief(fp);return cur;});
      }
    }, 280);
  };

  // ═══ TREATMENTS ═══
  const treat = (pid, type) => {
    setPts(prev=>prev.map(p=>{
      if(p.id!==pid) return p;
      const v={...p.v};
      if(type==="o2"){ v.o2.c=Math.min(100,v.o2.c+3);v.o2.h=[...v.o2.h.slice(1),v.o2.c];v.o2.t="up"; v.rr.c=Math.max(12,v.rr.c-2);v.rr.h=[...v.rr.h.slice(1),v.rr.c];v.rr.t="down"; addLog(`💨 O₂ → ${p.name}. SpO₂+3 RR-2`,"treatment"); }
      else if(type==="beta"){ v.hr.c=Math.max(60,v.hr.c-15);v.hr.h=[...v.hr.h.slice(1),v.hr.c];v.hr.t="down"; v.bp.cs=Math.max(90,v.bp.cs-10);v.bp.hs=[...v.bp.hs.slice(1),v.bp.cs];v.bp.t="down"; addLog(`💊 Beta-Blocker → ${p.name}. HR-15 BP-10`,"treatment"); }
      else if(type==="iv"){ v.bp.cs=Math.min(180,v.bp.cs+12);v.bp.hs=[...v.bp.hs.slice(1),v.bp.cs];v.bp.t="up"; v.hr.c=Math.max(60,v.hr.c-5);v.hr.h=[...v.hr.h.slice(1),v.hr.c];v.hr.t="down"; addLog(`💧 IV Saline → ${p.name}. BP+12 HR-5`,"treatment"); }
      else if(type==="epi"){ v.hr.c=Math.min(150,v.hr.c+20);v.hr.h=[...v.hr.h.slice(1),v.hr.c];v.hr.t="up"; v.bp.cs=Math.min(180,v.bp.cs+20);v.bp.hs=[...v.bp.hs.slice(1),v.bp.cs];v.bp.t="up"; addLog(`💉 Epinephrine → ${p.name}. HR+20 BP+20`,"treatment"); }
      else if(type==="sed"){ v.hr.c=Math.max(55,v.hr.c-10);v.hr.h=[...v.hr.h.slice(1),v.hr.c];v.hr.t="down"; v.rr.c=Math.max(10,v.rr.c-3);v.rr.h=[...v.rr.h.slice(1),v.rr.c];v.rr.t="down"; addLog(`😴 Sedation → ${p.name}. HR-10 RR-3`,"treatment"); }
      else if(type==="defib"){ v.hr.c=75;v.hr.h=[...v.hr.h.slice(1),v.hr.c];v.hr.t="stable"; v.bp.cs=Math.min(140,v.bp.cs+15);v.bp.hs=[...v.bp.hs.slice(1),v.bp.cs];v.bp.t="up"; addLog(`⚡ Defibrillation → ${p.name}. HR→75 BP+15`,"treatment"); }
      const sc=calcScore(v);
      return {...p,v,score:sc,sev:sc>=70?"critical":sc>=40?"warning":"stable"};
    }));
  };

  const ackAlarm = (pid) => {
    const p=pts.find(x=>x.id===pid);
    setAcked(pr=>{const n=new Set(pr);if(n.has(pid)){n.delete(pid);addLog(`🔔 Siren re-activated: ${p?.name}`,"warning");}else{n.add(pid);addLog(`✓ Alarm acknowledged: ${p?.name}`,"info");}return n;});
  };

  // ─── Pre-fill Vitals when selecting an existing patient ───
  useEffect(() => {
    if (!intakeIsNew && intakeId) {
      const p = pts.find(x => x.id === +intakeId);
      if (p) {
        setIntakeHR(p.v.hr.c.toString());
        setIntakeO2(p.v.o2.c.toString());
        setIntakeBPS(p.v.bp.cs.toString());
        setIntakeBPD(p.v.bp.cd.toString());
        setIntakeRR(p.v.rr.c.toString());
        setIntakeTemp(p.v.tp.c.toString());
      }
    } else if (intakeIsNew) {
      setIntakeHR("80");
      setIntakeO2("98");
      setIntakeBPS("120");
      setIntakeBPD("80");
      setIntakeRR("16");
      setIntakeTemp("37.0");
    }
  }, [intakeId, intakeIsNew]);

  const submitIntake = (e) => {
    e.preventDefault();
    setIntakeErr("");
    setIntakeResult(null);

    // Validation
    const hr = parseInt(intakeHR);
    const o2 = parseInt(intakeO2);
    const bps = parseInt(intakeBPS);
    const bpd = parseInt(intakeBPD);
    const rr = parseInt(intakeRR);
    const temp = parseFloat(intakeTemp);

    if (isNaN(hr) || hr < 20 || hr > 220) return setIntakeErr("Heart Rate must be between 20 and 220 bpm");
    if (isNaN(o2) || o2 < 50 || o2 > 100) return setIntakeErr("SpO₂ must be between 50% and 100%");
    if (isNaN(bps) || bps < 40 || bps > 240) return setIntakeErr("Systolic BP must be between 40 and 240 mmHg");
    if (isNaN(bpd) || bpd < 20 || bpd > 150) return setIntakeErr("Diastolic BP must be between 20 and 150 mmHg");
    if (isNaN(rr) || rr < 5 || rr > 60) return setIntakeErr("Respiratory Rate must be between 5 and 60 rpm");
    if (isNaN(temp) || temp < 30 || temp > 43) return setIntakeErr("Temperature must be between 30°C and 43°C");

    let targetPatient = null;

    if (intakeIsNew) {
      if (!intakeName.trim()) return setIntakeErr("Patient Name is required");
      if (!intakeRoom.trim()) return setIntakeErr("Room Number is required");
      if (!intakeAge || isNaN(parseInt(intakeAge))) return setIntakeErr("Valid Age is required");
      
      const newId = pts.length ? Math.max(...pts.map(p => p.id)) + 1 : 1;
      const v = {
        hr: { c: hr, h: hist(hr, 4), bl: 75, lo: 60, hi: 100, u: "bpm", t: "stable" },
        bp: { cs: bps, cd: bpd, hs: hist(bps, 6), hd: hist(bpd, 4), bls: 120, bld: 80, los: 90, his: 140, lod: 60, hid: 90, u: "mmHg", t: "stable" },
        o2: { c: o2, h: hist(o2, 1), bl: 98, lo: 95, hi: 100, u: "%", t: "stable" },
        rr: { c: rr, h: hist(rr, 2), bl: 15, lo: 12, hi: 20, u: "rpm", t: "stable" },
        tp: { c: temp, h: hist(temp, 0.15), bl: 36.8, lo: 36, hi: 37.8, u: "°C", t: "stable" }
      };
      
      const sc = calcScore(v);
      targetPatient = {
        id: newId,
        name: intakeName.trim(),
        age: parseInt(intakeAge),
        g: intakeGender,
        room: intakeRoom.trim().toUpperCase(),
        dx: intakeDx.trim() || "Observed Admission",
        v,
        score: sc,
        sev: sc >= 70 ? "critical" : sc >= 40 ? "warning" : "stable"
      };

      setPts(prev => [...prev, targetPatient]);
      addLog(`➕ Manual Admission: ${targetPatient.name} in Room ${targetPatient.room} (Score: ${sc})`, targetPatient.sev);
    } else {
      if (!intakeId) return setIntakeErr("Please select a patient to update");
      const pid = parseInt(intakeId);
      const prevPt = pts.find(p => p.id === pid);
      if (!prevPt) return setIntakeErr("Selected patient not found");

      const v = {
        hr: { ...prevPt.v.hr, c: hr, h: [...prevPt.v.hr.h.slice(1), hr], t: hr > prevPt.v.hr.c ? "up" : hr < prevPt.v.hr.c ? "down" : "stable" },
        bp: { ...prevPt.v.bp, cs: bps, cd: bpd, hs: [...prevPt.v.bp.hs.slice(1), bps], hd: [...prevPt.v.bp.hd.slice(1), bpd], t: bps > prevPt.v.bp.cs ? "up" : bps < prevPt.v.bp.cs ? "down" : "stable" },
        o2: { ...prevPt.v.o2, c: o2, h: [...prevPt.v.o2.h.slice(1), o2], t: o2 > prevPt.v.o2.c ? "up" : o2 < prevPt.v.o2.c ? "down" : "stable" },
        rr: { ...prevPt.v.rr, c: rr, h: [...prevPt.v.rr.h.slice(1), rr], t: rr > prevPt.v.rr.c ? "up" : rr < prevPt.v.rr.c ? "down" : "stable" },
        tp: { ...prevPt.v.tp, c: temp, h: [...prevPt.v.tp.h.slice(1), temp], t: temp > prevPt.v.tp.c ? "up" : temp < prevPt.v.tp.c ? "down" : "stable" }
      };

      const sc = calcScore(v);
      targetPatient = {
        ...prevPt,
        v,
        score: sc,
        sev: sc >= 70 ? "critical" : sc >= 40 ? "warning" : "stable"
      };

      setPts(prev => prev.map(p => p.id === pid ? targetPatient : p));
      addLog(`⚡ Manual Vitals Update: ${targetPatient.name} (Score: ${sc})`, targetPatient.sev);
    }

    // Silence if stabled, trigger if newly critical
    if (targetPatient.sev === "critical" && !acked.has(targetPatient.id)) {
      setAcked(prev => { const n = new Set(prev); n.delete(targetPatient.id); return n; });
    }

    setIntakeResult({
      id: targetPatient.id,
      name: targetPatient.name,
      room: targetPatient.room,
      score: targetPatient.score,
      sev: targetPatient.sev
    });

    // Reset Form Fields if it was new admission
    if (intakeIsNew) {
      setIntakeName("");
      setIntakeAge("");
      setIntakeRoom("");
      setIntakeDx("");
    }
  };

  const openFocus = (id) => { setSelId(id); setView("focus"); };

  // ═══ RENDER ═══
  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh' }}>

      {/* TOPBAR */}
      <header className="topbar">
        <div className="brand">
          <svg viewBox="0 0 50 50"><path d="M5 25h10l4-15 6 30 4-20 4 10h12"/></svg>
          <div><h1>CareSync <b>AI</b></h1><small>From alarm noise to clinical clarity</small></div>
        </div>
        <div className="topbar-right">
          <div className="pill">
            <span className={`dot ${simSt!=="idle"?"alert":""}`}></span>
            {simSt==="countdown"?"SIREN":simSt==="deteriorating"?"CRISIS":"LIVE"}
          </div>
          <div className="cfg-wrap">
            <button className="pill" onClick={()=>setCfgOpen(!cfgOpen)}>⚙ Config</button>
            {cfgOpen && (
              <div className="cfg-drop">
                <h4>Configuration</h4>
                <label>Claude API Key</label>
                <input type="password" value={apiKey} placeholder="sk-ant-..." onChange={e=>{setApiKey(e.target.value);localStorage.setItem("cs_key",e.target.value);}} />
                <div className="tip">Optional. Leave blank for local clinical rules.</div>
                <button className="btn-apply" onClick={()=>setCfgOpen(false)}>Apply</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* NAV */}
      <nav className="nav">
        <button className={`nav-btn ${view==="ward"?"on":""}`} onClick={()=>setView("ward")}>🏥 Ward</button>
        <button className={`nav-btn ${view==="focus"?"on":""}`} onClick={()=>{if(sel)setView("focus");else setView("ward");}}>🔬 Focus{sel&&<span className="badge g">●</span>}</button>
        <button className={`nav-btn ${view==="intake"?"on":""}`} onClick={()=>setView("intake")}>➕ Admit / Vitals</button>
        <button className={`nav-btn ${view==="analytics"?"on":""}`} onClick={()=>setView("analytics")}>📊 Analytics</button>
        <button className={`nav-btn ${view==="events"?"on":""}`} onClick={()=>setView("events")}>📋 Log<span className="badge a">{log.length}</span></button>
        <div className="nav-spacer"></div>
        <select className="sel" value={speed===null?"p":speed} onChange={e=>setSpeed(e.target.value==="p"?null:+e.target.value)}>
          <option value={2000}>2s Live</option><option value={5000}>5s Slow</option><option value="p">Paused</option>
        </select>
        <div className={`pill ${audio?"active":""}`} onClick={()=>setAudio(!audio)} style={{marginLeft:'0.3rem'}}>
          {audio?"🔊 Siren":"🔇 Mute"}
        </div>
      </nav>

      {/* MAIN */}
      <div className="main">

        {/* ── WARD ── */}
        {view==="ward" && (<div>
          <div className="stats">
            <div className="s-card tot"><span className="s-label">Total Patients</span><span className="s-val">{stats.n}</span></div>
            <div className="s-card crt"><span className="s-label">Critical</span><span className="s-val">{stats.c}</span></div>
            <div className="s-card wrn"><span className="s-label">Warning</span><span className="s-val">{stats.w}</span></div>
            <div className="s-card stb"><span className="s-label">Stable</span><span className="s-val">{stats.s}</span></div>
          </div>
            {/* 🚨 EMERGENCY SIMULATOR — Demo Panel */}
            <div className="demo-panel">
              <div className="demo-left">
                <div className="demo-icon">🚨</div>
                <div>
                  <div className="demo-title">Emergency Crisis Simulator</div>
                  <div className="demo-desc">Select a patient and trigger a rapid cardiogenic deterioration. The siren alarm, AI briefing, and vitals will respond in real-time.</div>
                </div>
              </div>
              <div className="demo-right">
                <select className="demo-select" id="crisis-patient-select" value={selId || sorted[0]?.id} onChange={e => setSelId(+e.target.value)}>
                  {sorted.map(p => (
                    <option key={p.id} value={p.id}>{p.name} — {p.room} (Score: {p.score})</option>
                  ))}
                </select>
                <button className="demo-launch" onClick={() => {
                  const targetId = selId || sorted[0]?.id;
                  if (targetId) triggerCrisis(targetId);
                }} disabled={simSt !== "idle"}>
                  {simSt === "idle" ? "⚡ LAUNCH CRISIS" : simSt === "countdown" ? "⏳ COUNTDOWN..." : "🔴 CRISIS ACTIVE"}
                </button>
              </div>
            </div>

            <div className="sec-title">Patient Grid — sorted by crisis score</div>
            <div className="grid">
              {sorted.map(p => {
                const ia = acked.has(p.id);
                return (
                  <div key={p.id} className={`p-card sev-${p.sev} ${p.id===selId?'sel':''} ${ia?'acked':''}`} onClick={()=>openFocus(p.id)}>
                    <div className="p-top">
                      <div>
                        <div className="p-name">{p.name}</div>
                        <div className="p-meta">{p.age}{p.g} · {p.room} · {p.dx}</div>
                      </div>
                      <div className="score-circle" style={{
                        borderColor: ia?'var(--blu)':p.sev==='critical'?'var(--red)':p.sev==='warning'?'var(--amb)':'var(--grn)',
                        color: ia?'var(--blu)':p.sev==='critical'?'var(--red)':p.sev==='warning'?'var(--amb)':'var(--grn)',
                        background: ia?'var(--blu-d)':p.sev==='critical'?'var(--red-d)':p.sev==='warning'?'var(--amb-d)':'var(--grn-d)'
                      }}>{p.score}</div>
                    </div>
                    {/* HORIZONTAL vitals — label NEXT TO value, no overlap */}
                    <div className="vitals-row">
                      <div className={`v-chip ${p.v.o2.c<p.v.o2.lo?'abn':''}`}>
                        <span className="v-lbl">O₂</span>
                        <span className={`v-num ${p.v.o2.c<p.v.o2.lo?'bad':''}`}>{p.v.o2.c}%</span>
                      </div>
                      <div className={`v-chip ${p.v.hr.c>p.v.hr.hi||p.v.hr.c<p.v.hr.lo?'abn':''}`}>
                        <span className="v-lbl">HR</span>
                        <span className={`v-num ${p.v.hr.c>p.v.hr.hi||p.v.hr.c<p.v.hr.lo?'bad':''}`}>{p.v.hr.c}</span>
                      </div>
                      <div className={`v-chip ${p.v.bp.cs<p.v.bp.los||p.v.bp.cs>p.v.bp.his?'abn':''}`}>
                        <span className="v-lbl">BP</span>
                        <span className={`v-num ${p.v.bp.cs<p.v.bp.los||p.v.bp.cs>p.v.bp.his?'bad':''}`}>{p.v.bp.cs}/{p.v.bp.cd}</span>
                      </div>
                    </div>
                    <div className="p-foot">
                      <span className={`sev-tag ${ia?'ack':p.sev}`}>{ia?"Acked":p.sev}</span>
                      {p.sev==="critical"&&!ia&&<span style={{animation:'blink 0.6s infinite alternate'}}>🚨</span>}
                      <button className="open-btn">Open →</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>)}


        {/* ── FOCUS (Single Column — Spacious) ── */}
        {view==="focus" && (sel ? (
          <div style={{maxWidth:'960px',margin:'0 auto',display:'flex',flexDirection:'column',gap:'1.5rem'}}>

            {/* Header */}
            <div className="f-head">
              <div>
                <div style={{display:'flex',alignItems:'center',gap:'0.6rem'}}>
                  <h2>{sel.name}</h2><span className="f-room">{sel.room}</span>
                </div>
                <div className="f-diag">{sel.age}{sel.g} · {sel.dx}</div>
              </div>
              <button className="back-btn" onClick={()=>setView("ward")}>← Back to Ward</button>
            </div>

            {/* Alert Banner */}
            <div className={`alert-banner ${sel.sev==="critical"?"crit":sel.sev==="warning"?"warn":"ok"}`}>
              <div>
                <div className="ab-lbl">Clinical Status</div>
                <div className={`ab-val ${sel.sev==="critical"?"crit":sel.sev==="warning"?"warn":"ok"}`}>
                  {acked.has(sel.id)?"Acknowledged":`${sel.sev} distress`}
                </div>
              </div>
              <div style={{textAlign:'right',color:sel.sev==='critical'?'var(--red)':sel.sev==='warning'?'var(--amb)':'var(--grn)'}}>
                <div className="ab-lbl">Score</div>
                <span className="ab-score">{sel.score}</span><span style={{fontSize:'0.7rem',color:'var(--t4)'}}>/100</span>
              </div>
            </div>

            {/* Alarm (if critical) */}
            {sel.sev==="critical" && (
              <div className={`alarm-box ${acked.has(sel.id)?'acked':''}`}>
                <div className="alarm-txt"><span>{acked.has(sel.id)?"✓":"🚨"}</span><span>{acked.has(sel.id)?"Siren silenced":"EMERGENCY SIREN ACTIVE"}</span></div>
                <button className={`ack-btn ${acked.has(sel.id)?'blue':''}`} onClick={()=>ackAlarm(sel.id)}>{acked.has(sel.id)?"Re-activate Siren":"Acknowledge Alarm"}</button>
              </div>
            )}

            {/* 5 Vital Tiles */}
            <div className="tiles5">
              {[
                {k:'hr',l:'Heart Rate',val:sel.v.hr.c,u:'bpm',t:sel.v.hr.t,ab:sel.v.hr.c>sel.v.hr.hi||sel.v.hr.c<sel.v.hr.lo},
                {k:'o2',l:'SpO₂',val:sel.v.o2.c+'%',u:'',t:sel.v.o2.t,ab:sel.v.o2.c<sel.v.o2.lo},
                {k:'bp',l:'Blood Pressure',val:`${sel.v.bp.cs}/${sel.v.bp.cd}`,u:'mmHg',t:sel.v.bp.t,ab:sel.v.bp.cs<sel.v.bp.los||sel.v.bp.cs>sel.v.bp.his},
                {k:'rr',l:'Resp Rate',val:sel.v.rr.c,u:'rpm',t:sel.v.rr.t,ab:sel.v.rr.c>sel.v.rr.hi||sel.v.rr.c<sel.v.rr.lo},
                {k:'tp',l:'Temp',val:sel.v.tp.c.toFixed(1),u:'°C',t:sel.v.tp.t,ab:sel.v.tp.c>sel.v.tp.hi||sel.v.tp.c<sel.v.tp.lo},
              ].map(x=>(
                <div key={x.k} className={`vtile ${x.ab?'abn':''}`}>
                  <div className="vtile-lbl">{x.l}</div>
                  <div className="vtile-val">{x.val}</div>
                  {x.u&&<div className="vtile-unit">{x.u}</div>}
                  <div className={`vtile-trend ${x.t}`}>{x.t==='up'?'▲ Rising':x.t==='down'?'▼ Falling':'● Stable'}</div>
                </div>
              ))}
            </div>

            {/* Two-column row: AI Briefing + Interventions */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.25rem'}}>
              {/* AI Briefing */}
              <div className="ai-box">
                <div className="ai-hdr">
                  <svg viewBox="0 0 24 24"><path d="M12 2l3 6 6 3-6 3-3 6-3-6-6-3 6-3 3-6z"/></svg>
                  <span>AI NURSE BRIEFING</span>
                </div>
                {aiLoad ? (
                  <div><div className="skel l"></div><div className="skel m"></div><div className="skel s"></div></div>
                ) : (
                  <div style={{display:'flex',flexDirection:'column',gap:'0.65rem'}}>
                    {aiErr&&<div style={{fontSize:'0.65rem',color:'var(--amb)'}}>⚠️ {aiErr}</div>}
                    <div className="ai-sec"><div className="ai-lbl">⚠️ Risk</div><div className="ai-val risk">{brief.risk}</div></div>
                    <div className="ai-sec"><div className="ai-lbl">📈 Vector</div><div className="ai-val vec">{brief.vec}</div></div>
                    <div className="ai-sec"><div className="ai-lbl">🩺 Actions</div><ul className="ai-ul">{brief.acts?.map((a,i)=><li key={i}>{a}</li>)}</ul></div>
                  </div>
                )}
              </div>

              {/* Interventions — 2x3 grid */}
              <div className="treat-box">
                <h3>⚡ Bedside Interventions</h3>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.5rem'}}>
                  <button className="treat-btn" onClick={()=>treat(sel.id,"o2")}><span>💨 O₂</span><span className="treat-fx">SpO₂+3</span></button>
                  <button className="treat-btn" onClick={()=>treat(sel.id,"beta")}><span>💊 Beta-Blocker</span><span className="treat-fx">HR-15</span></button>
                  <button className="treat-btn" onClick={()=>treat(sel.id,"iv")}><span>💧 IV Saline</span><span className="treat-fx">BP+12</span></button>
                  <button className="treat-btn" onClick={()=>treat(sel.id,"epi")}><span>💉 Epinephrine</span><span className="treat-fx">HR+20</span></button>
                  <button className="treat-btn" onClick={()=>treat(sel.id,"sed")}><span>😴 Sedation</span><span className="treat-fx">HR-10</span></button>
                  <button className="treat-btn" onClick={()=>treat(sel.id,"defib")}><span>⚡ Defibrillate</span><span className="treat-fx">HR→75</span></button>
                </div>
              </div>
            </div>

            {/* Telemetry Sparklines */}
            <div className="telem-box">
              <h3>Trend Telemetry (15 readings)</h3>
              <table className="t-table">
                <thead><tr><th>Vital</th><th>Value</th><th>Trend</th></tr></thead>
                <tbody>
                  {[
                    {n:'Heart Rate',val:`${sel.v.hr.c} bpm`,d:sel.v.hr.h,lo:sel.v.hr.lo,hi:sel.v.hr.hi},
                    {n:'SpO₂',val:`${sel.v.o2.c}%`,d:sel.v.o2.h,lo:sel.v.o2.lo,hi:sel.v.o2.hi},
                    {n:'Systolic BP',val:`${sel.v.bp.cs} mmHg`,d:sel.v.bp.hs,lo:sel.v.bp.los,hi:sel.v.bp.his},
                    {n:'Resp Rate',val:`${sel.v.rr.c} rpm`,d:sel.v.rr.h,lo:sel.v.rr.lo,hi:sel.v.rr.hi},
                    {n:'Temperature',val:`${sel.v.tp.c.toFixed(1)}°C`,d:sel.v.tp.h,lo:sel.v.tp.lo,hi:sel.v.tp.hi},
                  ].map((r,i)=><tr key={i}><td className="t-name">{r.n}</td><td className="t-val">{r.val}</td><td><Spark data={r.d} lo={r.lo} hi={r.hi}/></td></tr>)}
                </tbody>
              </table>
            </div>

            {/* Crisis Simulator */}
            <div className="sim-panel">
              <div><h4>🧪 Crisis Simulator</h4><p>Inject rapid cardiogenic shock deterioration into this patient.</p></div>
              <button className="sim-btn" onClick={()=>triggerCrisis(sel.id)} disabled={simSt!=="idle"}>⚡ Trigger Crisis</button>
            </div>
          </div>
        ) : (
          <div className="empty">
            <div className="empty-ico">🔬</div>
            <h3>No Patient Selected</h3>
            <p>Select a patient from the Ward view to open focused bedside monitoring.</p>
            <button className="go-btn" onClick={()=>setView("ward")}>Go to Ward</button>
          </div>
        ))}

        {/* ── INTAKE / VITALS INPUT ── */}
        {view==="intake" && (
          <div style={{maxWidth:'680px',margin:'0 auto'}}>
            <div className="sec-title">Patient Intake & Vitals Input</div>
            
            <div className="ana-card" style={{marginBottom:'1.5rem'}}>
              <div style={{display:'flex',gap:'1rem',marginBottom:'1.25rem',borderBottom:'1px solid var(--border)',paddingBottom:'0.75rem'}}>
                <button 
                  type="button"
                  className={`pill ${intakeIsNew?'active':''}`} 
                  onClick={()=>{setIntakeIsNew(true); setIntakeResult(null); setIntakeErr("");}}
                  style={{fontSize:'0.8rem',padding:'0.4rem 1rem'}}
                >
                  ➕ Admit New Patient
                </button>
                <button 
                  type="button"
                  className={`pill ${!intakeIsNew?'active':''}`} 
                  onClick={()=>{setIntakeIsNew(false); setIntakeResult(null); setIntakeErr("");}}
                  style={{fontSize:'0.8rem',padding:'0.4rem 1rem'}}
                >
                  ⚙️ Update Vitals
                </button>
              </div>

              {intakeErr && (
                <div style={{background:'var(--red-d)',border:'1px solid var(--red)',color:'var(--red)',padding:'0.75rem 1rem',borderRadius:'8px',marginBottom:'1rem',fontSize:'0.82rem',fontWeight:'700'}}>
                  ⚠️ {intakeErr}
                </div>
              )}

              {intakeResult && (
                <div style={{background:'rgba(34,211,238,0.06)',border:'2px solid var(--cyan)',padding:'1.25rem',borderRadius:'12px',marginBottom:'1.5rem'}}>
                  <h4 style={{color:'var(--cyan)',fontSize:'1rem',fontWeight:'800',marginBottom:'0.5rem'}}>
                    ✓ ANALYSIS COMPLETE & APPROVED
                  </h4>
                  <p style={{fontSize:'0.85rem',color:'var(--t2)',marginBottom:'0.85rem'}}>
                    Vitals processed for <strong>{intakeResult.name}</strong> (Room {intakeResult.room}).
                  </p>
                  <div style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'1rem'}}>
                    <div>
                      <div style={{fontSize:'0.72rem',color:'var(--t3)',textTransform:'uppercase'}}>Calculated Score</div>
                      <span style={{fontFamily:'var(--fm)',fontSize:'2.2rem',fontWeight:'900',color:'var(--t1)'}}>{intakeResult.score}</span>
                      <span style={{fontSize:'0.8rem',color:'var(--t4)'}}>/100</span>
                    </div>
                    <div style={{marginLeft:'auto',textAlign:'right'}}>
                      <div style={{fontSize:'0.72rem',color:'var(--t3)',textTransform:'uppercase',marginBottom:'0.2rem'}}>Clinical Alarm Status</div>
                      <span className={`sev-tag ${intakeResult.sev}`} style={{fontSize:'0.8rem',padding:'0.3rem 0.8rem'}}>
                        {intakeResult.sev === 'critical' ? '🚨 EMERGENCY DECLARED' : intakeResult.sev === 'warning' ? '⚠️ WARNING ALERT' : '✅ STABLE'}
                      </span>
                    </div>
                  </div>
                  <div style={{display:'flex',gap:'0.75rem'}}>
                    <button type="button" className="btn-apply" onClick={() => { setSelId(intakeResult.id); setView("focus"); }} style={{padding:'0.55rem',fontSize:'0.85rem'}}>
                      🔍 Go to bedside Focus View
                    </button>
                    <button type="button" className="back-btn" onClick={() => { setIntakeResult(null); setView("ward"); }} style={{padding:'0.55rem',fontSize:'0.85rem'}}>
                      🏥 Return to Ward
                    </button>
                  </div>
                </div>
              )}

              <form onSubmit={submitIntake}>
                {intakeIsNew ? (
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginBottom:'1rem'}}>
                    <div>
                      <label style={{fontSize:'0.75rem',color:'var(--t3)',display:'block',marginBottom:'0.25rem',fontWeight:'700'}}>Patient Name *</label>
                      <input 
                        className="demo-select" 
                        style={{width:'100%',background:'var(--bg-0)'}} 
                        type="text" 
                        value={intakeName} 
                        onChange={e=>setIntakeName(e.target.value)} 
                        placeholder="e.g. John Doe"
                      />
                    </div>
                    <div>
                      <label style={{fontSize:'0.75rem',color:'var(--t3)',display:'block',marginBottom:'0.25rem',fontWeight:'700'}}>Room *</label>
                      <input 
                        className="demo-select" 
                        style={{width:'100%',background:'var(--bg-0)'}} 
                        type="text" 
                        value={intakeRoom} 
                        onChange={e=>setIntakeRoom(e.target.value)} 
                        placeholder="e.g. ICU-3E"
                      />
                    </div>
                    <div>
                      <label style={{fontSize:'0.75rem',color:'var(--t3)',display:'block',marginBottom:'0.25rem',fontWeight:'700'}}>Age *</label>
                      <input 
                        className="demo-select" 
                        style={{width:'100%',background:'var(--bg-0)'}} 
                        type="number" 
                        value={intakeAge} 
                        onChange={e=>setIntakeAge(e.target.value)} 
                        placeholder="e.g. 54"
                      />
                    </div>
                    <div>
                      <label style={{fontSize:'0.75rem',color:'var(--t3)',display:'block',marginBottom:'0.25rem',fontWeight:'700'}}>Gender *</label>
                      <select 
                        className="demo-select" 
                        style={{width:'100%',background:'var(--bg-0)'}} 
                        value={intakeGender} 
                        onChange={e=>setIntakeGender(e.target.value)}
                      >
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                      </select>
                    </div>
                    <div style={{gridColumn:'span 2'}}>
                      <label style={{fontSize:'0.75rem',color:'var(--t3)',display:'block',marginBottom:'0.25rem',fontWeight:'700'}}>Diagnosis</label>
                      <input 
                        className="demo-select" 
                        style={{width:'100%',background:'var(--bg-0)'}} 
                        type="text" 
                        value={intakeDx} 
                        onChange={e=>setIntakeDx(e.target.value)} 
                        placeholder="e.g. Acute Myocardial Infarction"
                      />
                    </div>
                  </div>
                ) : (
                  <div style={{marginBottom:'1.25rem'}}>
                    <label style={{fontSize:'0.75rem',color:'var(--t3)',display:'block',marginBottom:'0.25rem',fontWeight:'700'}}>Select Patient to Update *</label>
                    <select 
                      className="demo-select" 
                      style={{width:'100%',background:'var(--bg-0)'}} 
                      value={intakeId} 
                      onChange={e=>{setIntakeId(e.target.value); setIntakeResult(null);}}
                    >
                      <option value="">-- Choose Patient --</option>
                      {pts.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.room}) — Current Score: {p.score}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div style={{borderTop:'1px solid var(--border)',paddingTop:'1rem',marginTop:'1rem'}}>
                  <h4 style={{fontSize:'0.8rem',color:'var(--cyan)',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:'0.85rem'}}>
                    🩺 Clinical Vital Telemetry
                  </h4>
                  
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                    <div>
                      <label style={{fontSize:'0.75rem',color:'var(--t3)',display:'block',marginBottom:'0.25rem',fontWeight:'700'}}>Heart Rate (bpm)</label>
                      <input 
                        className="demo-select" 
                        style={{width:'100%',background:'var(--bg-0)'}} 
                        type="number" 
                        value={intakeHR} 
                        onChange={e=>setIntakeHR(e.target.value)}
                      />
                    </div>
                    <div>
                      <label style={{fontSize:'0.75rem',color:'var(--t3)',display:'block',marginBottom:'0.25rem',fontWeight:'700'}}>SpO₂ Oxygen (%)</label>
                      <input 
                        className="demo-select" 
                        style={{width:'100%',background:'var(--bg-0)'}} 
                        type="number" 
                        value={intakeO2} 
                        onChange={e=>setIntakeO2(e.target.value)}
                      />
                    </div>
                    <div>
                      <label style={{fontSize:'0.75rem',color:'var(--t3)',display:'block',marginBottom:'0.25rem',fontWeight:'700'}}>Systolic BP (mmHg)</label>
                      <input 
                        className="demo-select" 
                        style={{width:'100%',background:'var(--bg-0)'}} 
                        type="number" 
                        value={intakeBPS} 
                        onChange={e=>setIntakeBPS(e.target.value)}
                      />
                    </div>
                    <div>
                      <label style={{fontSize:'0.75rem',color:'var(--t3)',display:'block',marginBottom:'0.25rem',fontWeight:'700'}}>Diastolic BP (mmHg)</label>
                      <input 
                        className="demo-select" 
                        style={{width:'100%',background:'var(--bg-0)'}} 
                        type="number" 
                        value={intakeBPD} 
                        onChange={e=>setIntakeBPD(e.target.value)}
                      />
                    </div>
                    <div>
                      <label style={{fontSize:'0.75rem',color:'var(--t3)',display:'block',marginBottom:'0.25rem',fontWeight:'700'}}>Respiratory Rate (rpm)</label>
                      <input 
                        className="demo-select" 
                        style={{width:'100%',background:'var(--bg-0)'}} 
                        type="number" 
                        value={intakeRR} 
                        onChange={e=>setIntakeRR(e.target.value)}
                      />
                    </div>
                    <div>
                      <label style={{fontSize:'0.75rem',color:'var(--t3)',display:'block',marginBottom:'0.25rem',fontWeight:'700'}}>Temperature (°C)</label>
                      <input 
                        className="demo-select" 
                        style={{width:'100%',background:'var(--bg-0)'}} 
                        type="number" 
                        step="0.1" 
                        value={intakeTemp} 
                        onChange={e=>setIntakeTemp(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="demo-launch" 
                  style={{width:'100%',marginTop:'1.5rem',padding:'0.8rem',fontSize:'0.9rem'}}
                >
                  {intakeIsNew ? "➕ ADMIT & ANALYZE CLINICAL VECTORS" : "⚡ UPDATE & RE-CALCULATE SCORE"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ── ANALYTICS ── */}
        {view==="analytics" && (<div>
          <div className="sec-title">Clinical Analytics</div>
          <div className="ana-grid">
            <div className="ana-card">
              <h3>Crisis Score Distribution</h3>
              {sorted.map(p=>(
                <div key={p.id} className="bar-row" onClick={()=>openFocus(p.id)}>
                  <span className="bar-name">{p.name}</span>
                  <div className="bar-track"><div className={`bar-fill ${p.sev}`} style={{width:`${p.score}%`}}></div></div>
                  <span className="bar-val">{p.score}</span>
                </div>
              ))}
            </div>
            <div className="ana-card">
              <h3>Severity Breakdown</h3>
              {[{l:'Critical',c:stats.c,col:'var(--red)'},{l:'Warning',c:stats.w,col:'var(--amb)'},{l:'Stable',c:stats.s,col:'var(--grn)'}].map((s,i)=>{
                const pct=Math.round(s.c/stats.n*100);
                return(<div key={i} style={{marginBottom:'1rem'}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:'0.25rem'}}>
                    <span style={{fontSize:'0.75rem',fontWeight:700,color:s.col}}>{s.l}</span>
                    <span style={{fontSize:'0.75rem',fontFamily:'var(--fm)',color:'var(--t1)'}}>{s.c} ({pct}%)</span>
                  </div>
                  <div style={{height:'7px',background:'var(--bg-0)',borderRadius:'4px',overflow:'hidden'}}>
                    <div style={{height:'100%',width:`${pct}%`,background:s.col,borderRadius:'4px',transition:'width 0.4s'}}></div>
                  </div>
                </div>);
              })}
            </div>
            <div className="ana-card">
              <h3>Vital Ranges (All Patients)</h3>
              <table className="t-table">
                <thead><tr><th>Vital</th><th>Min</th><th>Max</th><th>Avg</th></tr></thead>
                <tbody>
                  {[{n:'HR',v:pts.map(p=>p.v.hr.c)},{n:'SpO₂',v:pts.map(p=>p.v.o2.c)},{n:'SBP',v:pts.map(p=>p.v.bp.cs)},{n:'RR',v:pts.map(p=>p.v.rr.c)},{n:'Temp',v:pts.map(p=>p.v.tp.c)}].map((x,i)=>(
                    <tr key={i}><td className="t-name">{x.n}</td><td className="t-val">{Math.min(...x.v).toFixed(1)}</td><td className="t-val">{Math.max(...x.v).toFixed(1)}</td><td className="t-val">{(x.v.reduce((a,b)=>a+b,0)/x.v.length).toFixed(1)}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="ana-card">
              <h3>Priority Queue</h3>
              {sorted.map((p,i)=>(
                <div key={p.id} onClick={()=>openFocus(p.id)} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0.4rem 0.6rem',borderRadius:'8px',background:i===0?'var(--red-d)':'var(--bg-1)',border:`1px solid ${i===0?'rgba(248,113,113,0.2)':'var(--border)'}`,cursor:'pointer',marginBottom:'0.35rem',transition:'var(--tr)'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
                    <span style={{fontFamily:'var(--fm)',fontSize:'0.65rem',color:'var(--t4)',width:'18px'}}>#{i+1}</span>
                    <span style={{fontSize:'0.78rem',fontWeight:600,color:'var(--t1)'}}>{p.name}</span>
                    <span style={{fontSize:'0.62rem',color:'var(--t4)'}}>{p.room}</span>
                  </div>
                  <span className={`sev-tag ${p.sev}`}>{p.score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>)}

        {/* ── EVENTS ── */}
        {view==="events" && (<div>
          <div className="sec-title">Live Event Log</div>
          <div className="log-list">
            {log.map((e,i)=>(
              <div key={i} className={`log-item ${e.k==='critical'?'crit-ev':e.k==='warning'?'warn-ev':e.k==='treatment'?'treat-ev':'info-ev'}`}>
                <span className="log-time">{e.t}</span>
                <span className="log-msg">{e.m}</span>
              </div>
            ))}
          </div>
        </div>)}
      </div>

      {/* OVERLAY */}
      {simSt==="countdown" && (
        <div className="overlay">
          <div className="overlay-num">{cd}</div>
          <div className="overlay-title">CRISIS SIMULATION</div>
          <div className="overlay-sub">Injecting deterioration into Room {pts.find(p=>p.id===detId)?.room}. Siren alarms will activate.</div>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
