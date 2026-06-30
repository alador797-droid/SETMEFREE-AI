import { useState, useEffect, useRef, createContext, useContext } from "react";

// ============================================================
// DESIGN SYSTEM
// ============================================================
const DS = {
  c: {
    void:"#050507",obs:"#0A0A0F",vault:"#0F0F1A",chamber:"#14141F",
    border:"#1E1E2E",bgold:"#2A2418",gold:"#C9A84C",gdim:"#8A6F30",
    glow:"#E8C96A",ice:"#E8EDF5",silver:"#8A8FA8",ghost:"#3A3D52",
    safe:"#2ECC71",warn:"#F39C12",toxic:"#E74C3C",blue:"#4A90E2",purple:"#8B5CF6",
  },
  f:{
    disp:"'Cinzel',Georgia,serif",
    mono:"'JetBrains Mono','Fira Code',monospace",
    body:"'Inter',system-ui,sans-serif",
  }
};

const ProfileCtx = createContext(null);
const useProfile = () => useContext(ProfileCtx);
const STORE = {
  get:(k)=>{try{return JSON.parse(localStorage.getItem(k));}catch{return null;}},
  set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch{}},
  del:(k)=>{try{localStorage.removeItem(k);}catch{}},
};

// ============================================================
// ERI API — calls YOUR Vercel backend, not Anthropic directly
// This is what makes it actually work
// ============================================================
async function callERI({ system, messages, onToken, onDone, onError }) {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, system, stream: true }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`ERI ${res.status}: ${err}`);
    }

    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let full = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = dec.decode(value);
      for (const line of chunk.split("\n")) {
        if (!line.startsWith("data:")) continue;
        try {
          const j = JSON.parse(line.slice(5));
          if (j.type === "content_block_delta" && j.delta?.text) {
            full += j.delta.text;
            onToken?.(full);
          }
        } catch {}
      }
    }
    onDone?.(full);
  } catch (e) {
    // Fallback — non-streaming
    try {
      const r2 = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, system, stream: false }),
      });
      const d = await r2.json();
      const t = d.content?.filter(b => b.type === "text").map(b => b.text).join("") || d.error || "ERI offline.";
      onToken?.(t);
      onDone?.(t);
    } catch (e2) {
      onError?.(e2.message);
    }
  }
}

async function scanImage({ imageData, imageType, prompt, profile }) {
  const res = await fetch("/api/scan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageData, imageType, prompt, profile }),
  });
  const d = await res.json();
  if (d.error) throw new Error(d.error);
  return d.result;
}

// ============================================================
// CSS
// ============================================================
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=JetBrains+Mono:wght@300;400;500&family=Inter:wght@300;400;500;600&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  html{font-size:16px;}
  body{background:#050507;color:#E8EDF5;font-family:'Inter',sans-serif;min-height:100vh;-webkit-font-smoothing:antialiased;padding-bottom:76px;overflow-x:hidden;}
  ::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-track{background:#0A0A0F;}::-webkit-scrollbar-thumb{background:#8A6F30;border-radius:2px;}
  @keyframes orbPulse{0%,100%{box-shadow:0 0 20px rgba(201,168,76,0.15);transform:scale(1);}50%{box-shadow:0 0 44px rgba(201,168,76,0.32);transform:scale(1.04);}}
  @keyframes spin{to{transform:rotate(360deg);}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
  @keyframes shimmer{0%{background-position:-200% center;}100%{background-position:200% center;}}
  @keyframes blink{0%,100%{opacity:1;}50%{opacity:0;}}
  @keyframes scanLine{0%{top:0;opacity:1;}100%{top:100%;opacity:0;}}
  @keyframes vglow{0%,100%{box-shadow:0 0 8px currentColor;}50%{box-shadow:0 0 24px currentColor;}}
  @keyframes live{0%,100%{opacity:0.5;box-shadow:0 0 4px #2ECC71;}50%{opacity:1;box-shadow:0 0 10px #2ECC71;}}
  @keyframes slideUp{from{transform:translateY(30px);opacity:0;}to{transform:translateY(0);opacity:1;}}
  .fu{animation:fadeUp 0.4s ease both;}
  .fu1{animation:fadeUp 0.4s ease 0.1s both;}
  .fu2{animation:fadeUp 0.4s ease 0.2s both;}
  .fu3{animation:fadeUp 0.4s ease 0.3s both;}
  .gs{background:linear-gradient(90deg,#8A6F30,#E8C96A,#C9A84C,#E8C96A,#8A6F30);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 3s linear infinite;}
  .cr{color:#4A90E2;font-family:'JetBrains Mono',monospace;font-size:0.58rem;font-weight:500;}
  .ct{color:#C9A84C;font-family:'JetBrains Mono',monospace;font-size:0.58rem;font-weight:500;}
  .cc{color:#2ECC71;font-family:'JetBrains Mono',monospace;font-size:0.58rem;font-weight:500;}
  .rb{font-family:'Inter',sans-serif;font-size:0.875rem;line-height:1.85;color:#E8EDF5;}
  .rb strong{color:#E8C96A;font-weight:600;}
  .rb a{color:#4A90E2;word-break:break-all;}
  .sc::after{content:'▊';animation:blink 0.8s infinite;color:#C9A84C;margin-left:2px;}
  input,textarea,select{outline:none;transition:border-color 0.2s;}
  input:focus,textarea:focus,select:focus{border-color:#8A6F30!important;box-shadow:0 0 0 1px #8A6F30;}
  select option{background:#0F0F1A;color:#E8EDF5;}
  .bn{position:fixed;bottom:0;left:0;right:0;z-index:200;background:#0A0A0FEE;border-top:1px solid #1E1E2E;display:flex;backdrop-filter:blur(20px);}
  .bb{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:8px 2px 12px;background:none;border:none;cursor:pointer;gap:3px;}
  .bi{font-size:1.1rem;}
  .bl{font-family:'JetBrains Mono',monospace;font-size:0.42rem;letter-spacing:0.1em;color:#3A3D52;}
  .bb.on .bl{color:#C9A84C;}
  .ld{width:7px;height:7px;border-radius:50%;background:#2ECC71;display:inline-block;animation:live 1s ease infinite;}
  .sd{width:9px;height:9px;border-radius:50%;}
  .sd.done{background:#2ECC71;box-shadow:0 0 5px #2ECC71;}
  .sd.miss{background:#1E1E2E;}
  .sd.now{background:#C9A84C;animation:blink 1.5s infinite;}
  .ob{animation:slideUp 0.4s ease both;}
  @media(min-width:768px){body{padding-bottom:0;}.bn{display:none!important;}.dn{display:flex!important;}}
  @media(max-width:767px){.dn{display:none!important;}}
`;

function fmt(t) {
  return (t || "")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\[RESEARCH SUPPORTED\]/g, '<span class="cr">[RESEARCH SUPPORTED]</span>')
    .replace(/\[TRADITIONAL WISDOM\]/g, '<span class="ct">[TRADITIONAL WISDOM]</span>')
    .replace(/\[MEDICAL CONSENSUS\]/g, '<span class="cc">[MEDICAL CONSENSUS]</span>')
    .replace(/\[PUBMED\]/g, '<span class="cr">[PUBMED]</span>')
    .replace(/\[WHO\]/g, '<span class="cc">[WHO]</span>')
    .replace(/(https?:\/\/[^\s<>"]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>')
    .replace(/\n/g, "<br/>");
}

function ps(text, heading) {
  if (!text) return null;
  const patterns = [
    new RegExp(`(?:^|\\n)#{0,3}\\s*${heading}:\\s*\\n([\\s\\S]*?)(?=\\n#{0,3}\\s*[A-Z][A-Z ]{2,}:|$)`, "i"),
    new RegExp(`\\*\\*${heading}\\*\\*:?\\s*\\n([\\s\\S]*?)(?=\\*\\*[A-Z]|$)`, "i"),
    new RegExp(`${heading}[:\\s]+([\\s\\S]{30,1200}?)(?=\\n\\n[A-Z]|\\n[A-Z]{4,}:|$)`, "i"),
  ];
  for (const r of patterns) { const m = text.match(r); if (m?.[1]?.trim()) return m[1].trim(); }
  return null;
}

// ============================================================
// ORB
// ============================================================
function Orb({ size = 88, active = false, mode = "idle" }) {
  const cm = {
    idle: { c: "#C9A84C", r: "#8A6F30", g: "rgba(201,168,76,0.15)" },
    scanning: { c: "#4A90E2", r: "#2563EB", g: "rgba(74,144,226,0.2)" },
    safe: { c: "#2ECC71", r: "#27AE60", g: "rgba(46,204,113,0.2)" },
    warn: { c: "#F39C12", r: "#E67E22", g: "rgba(243,156,18,0.2)" },
    toxic: { c: "#E74C3C", r: "#C0392B", g: "rgba(231,76,60,0.2)" },
  };
  const { c, r, g } = cm[mode] || cm.idle;
  return (
    <div style={{ position: "relative", width: size, height: size, margin: "0 auto", flexShrink: 0 }}>
      <div style={{ position: "absolute", inset: -10, borderRadius: "50%", border: `1px solid ${r}22`, animation: active ? "spin 8s linear infinite" : "none" }} />
      <div style={{ position: "absolute", inset: -5, borderRadius: "50%", border: `1px solid ${r}44`, animation: active ? "spin 5s linear infinite reverse" : "none" }} />
      <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: `radial-gradient(circle at 35% 35%,${c}CC,${c}44 50%,${r}22)`, boxShadow: `0 0 ${active ? 44 : 18}px ${g},inset 0 0 16px ${r}33`, animation: "orbPulse 3s ease-in-out infinite", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}>
        <div style={{ fontFamily: DS.f.disp, fontSize: size * 0.24, color: "#050507", fontWeight: 900, opacity: 0.85, userSelect: "none" }}>ERI</div>
        {active && <div style={{ position: "absolute", left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${c},transparent)`, animation: "scanLine 1.5s linear infinite" }} />}
      </div>
    </div>
  );
}

// ============================================================
// ONBOARDING
// ============================================================
function Onboarding({ onDone }) {
  const steps = [
    { f: "name", label: "What should we call you?", type: "text", ph: "Your name or alias" },
    { f: "age", label: "Your age?", type: "number", ph: "e.g. 34" },
    { f: "sex", label: "Biological sex?", type: "select", opts: ["male", "female", "other"] },
    { f: "country", label: "Your country or region?", type: "text", ph: "e.g. Eritrea, Nigeria, Brazil" },
    { f: "faith", label: "Faith tradition?", type: "select", opts: ["none", "christian", "muslim", "jewish", "hindu", "buddhist", "other"] },
    { f: "goals", label: "Primary health goal?", type: "text", ph: "e.g. fat loss, longevity, muscle, reverse diabetes" },
    { f: "conditions", label: "Health conditions?", type: "text", ph: "e.g. none, hypertension, prediabetes" },
    { f: "dietary", label: "Dietary approach?", type: "select", opts: ["no preference", "ancestral", "carnivore", "plant-based", "keto", "paleo", "mediterranean", "halal", "kosher"] },
  ];
  const [step, setStep] = useState(0);
  const [p, setP] = useState({ name: "", age: "", sex: "male", country: "", faith: "none", goals: "", conditions: "", dietary: "no preference" });
  const cur = steps[step]; const last = step === steps.length - 1;
  const go = () => { if (last) onDone(p); else setStep(s => s + 1); };
  const inp = { width: "100%", background: DS.c.obs, border: `1px solid ${DS.c.border}`, borderRadius: 8, padding: "13px 17px", fontFamily: DS.f.body, fontSize: "1rem", color: DS.c.ice, marginTop: 10 };
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <Orb size={62} active mode="idle" />
      <div style={{ height: 18 }} />
      <div style={{ fontFamily: DS.f.disp, fontSize: "1.4rem", fontWeight: 900, marginBottom: 4 }} className="gs">SETMEFREE</div>
      <div style={{ fontFamily: DS.f.mono, fontSize: "0.5rem", letterSpacing: "0.35em", color: DS.c.gdim, marginBottom: 32 }}>ERI INITIALIZATION</div>
      <div style={{ display: "flex", gap: 5, marginBottom: 30 }}>{steps.map((_, i) => <div key={i} style={{ width: i === step ? 22 : 7, height: 3, borderRadius: 2, background: i < step ? DS.c.gold : i === step ? DS.c.glow : DS.c.border, transition: "all 0.3s" }} />)}</div>
      <div className="ob" key={step} style={{ width: "100%", maxWidth: 400, textAlign: "center" }}>
        <div style={{ fontFamily: DS.f.body, fontSize: "1.1rem", fontWeight: 500 }}>{cur.label}</div>
        <div style={{ fontFamily: DS.f.mono, fontSize: "0.48rem", color: DS.c.ghost, letterSpacing: "0.2em", marginTop: 3, marginBottom: 8 }}>{step + 1}/{steps.length}</div>
        {cur.type === "select"
          ? <select style={{ ...inp, appearance: "none" }} value={p[cur.f]} onChange={e => setP(x => ({ ...x, [cur.f]: e.target.value }))}>{cur.opts.map(o => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}</select>
          : <input style={inp} type={cur.type} placeholder={cur.ph} value={p[cur.f]} onChange={e => setP(x => ({ ...x, [cur.f]: e.target.value }))} onKeyDown={e => e.key === "Enter" && go()} autoFocus />
        }
        <button onClick={go} style={{ marginTop: 16, width: "100%", background: `linear-gradient(135deg,${DS.c.gold}CC,${DS.c.gdim})`, border: "none", borderRadius: 8, padding: "13px", fontFamily: DS.f.mono, fontSize: "0.68rem", letterSpacing: "0.18em", color: DS.c.void, fontWeight: 700, cursor: "pointer" }}>
          {last ? "INITIALIZE ERI →" : "CONTINUE →"}
        </button>
        {step > 0 && <button onClick={() => setStep(s => s - 1)} style={{ marginTop: 8, background: "none", border: "none", fontFamily: DS.f.mono, fontSize: "0.56rem", color: DS.c.ghost, cursor: "pointer" }}>← BACK</button>}
      </div>
    </div>
  );
}

// ============================================================
// NAV
// ============================================================
const NAV = [
  { id: "home", icon: "◉", label: "HOME" }, { id: "scanner", icon: "◎", label: "SCAN" },
  { id: "redpill", icon: "⬡", label: "RED PILL" }, { id: "neochat", icon: "◈", label: "CHAT" },
  { id: "lifeplanner", icon: "◇", label: "PLAN" }, { id: "library", icon: "▣", label: "LIBRARY" },
  { id: "habits", icon: "◆", label: "HABITS" },
];
function NavBar({ cur, setCur, profile }) {
  return (
    <>
      <nav className="dn" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "#050507EE", borderBottom: `1px solid ${DS.c.border}`, backdropFilter: "blur(20px)", display: "none" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 54 }}>
          <div onClick={() => setCur("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{ width: 26, height: 26, borderRadius: "50%", background: `radial-gradient(circle at 35% 35%,${DS.c.gold}CC,${DS.c.gdim}44)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: DS.f.disp, fontSize: 8, color: "#050507", fontWeight: 900 }}>ERI</span>
            </div>
            <span style={{ fontFamily: DS.f.disp, fontSize: "0.82rem", fontWeight: 700, letterSpacing: "0.15em", color: DS.c.gold }}>SETMEFREE</span>
          </div>
          <div style={{ display: "flex", gap: 2 }}>{NAV.filter(n => n.id !== "home").map(n => (
            <button key={n.id} onClick={() => setCur(n.id)} style={{ background: "none", border: "none", borderBottom: `2px solid ${cur === n.id ? DS.c.gold : "transparent"}`, padding: "6px 11px", fontFamily: DS.f.mono, fontSize: "0.56rem", letterSpacing: "0.1em", color: cur === n.id ? DS.c.gold : DS.c.silver, cursor: "pointer", transition: "all 0.2s", marginBottom: -1, display: "flex", alignItems: "center", gap: 4 }}>
              <span>{n.icon}</span><span>{n.label}</span>
            </button>
          ))}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: DS.f.mono, fontSize: "0.56rem", color: DS.c.silver }}>
            <span className="ld" />{profile?.name ? profile.name.toUpperCase() : "SOVEREIGN"}
          </div>
        </div>
      </nav>
      <div className="bn">{NAV.map(n => (
        <button key={n.id} className={`bb${cur === n.id ? " on" : ""}`} onClick={() => setCur(n.id)} style={{ color: cur === n.id ? DS.c.gold : DS.c.ghost }}>
          <span className="bi" style={{ color: cur === n.id ? DS.c.gold : DS.c.ghost }}>{n.icon}</span>
          <span className="bl">{n.label}</span>
        </button>
      ))}</div>
    </>
  );
}

// ============================================================
// HOME
// ============================================================
function Home({ setCur, profile }) {
  const tiles = [
    { id: "scanner", icon: "◎", title: "UNIVERSAL SCANNER", sub: "Scan anything — text, image, or camera. Full species intelligence, corporate capture, influencer sources, life protocol.", accent: DS.c.blue },
    { id: "redpill", icon: "⬡", title: "RED PILL", sub: "Corporate capture maps. Real influencer quotes with links. Follow the money. Crime board connections.", accent: DS.c.toxic },
    { id: "neochat", icon: "◈", title: "NEO CHAT", sub: "8 ERI personalities. Doctor. Prophet. Warrior. Sage. Healer. Strategist. Persistent memory.", accent: DS.c.gold },
    { id: "lifeplanner", icon: "◇", title: "LIFE PLAN", sub: "Deep health intake → day-by-day sovereign blueprint calibrated to your body, culture, faith, goals.", accent: DS.c.safe },
    { id: "library", icon: "▣", title: "TRUTH LIBRARY", sub: "Every scan ERI ran for you. Searchable. Permanent. Your sovereign knowledge base.", accent: DS.c.purple },
    { id: "habits", icon: "◆", title: "HABIT STREAKS", sub: "Daily protocol adherence tracking. 7-day visual. Streak counters.", accent: "#F59E0B" },
  ];
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px 40px" }}>
      <div style={{ textAlign: "center", marginBottom: 42 }} className="fu">
        <Orb size={80} active mode="idle" />
        <div style={{ height: 20 }} />
        <div style={{ fontFamily: DS.f.mono, fontSize: "0.52rem", letterSpacing: "0.4em", color: DS.c.gdim, marginBottom: 10 }}>SOVEREIGN TRUTH OPERATING SYSTEM</div>
        <h1 style={{ fontFamily: DS.f.disp, fontSize: "clamp(2rem,6vw,3.6rem)", fontWeight: 900, letterSpacing: "0.05em", lineHeight: 1.1, marginBottom: 10 }}>
          <span className="gs">SETMEFREE</span>
        </h1>
        <div style={{ fontFamily: DS.f.mono, fontSize: "0.56rem", color: DS.c.gdim, letterSpacing: "0.2em", marginBottom: 12 }}>
          POWERED BY <span style={{ color: DS.c.gold }}>ERI</span> — EVIDENCE · ROOTS · INTELLIGENCE
        </div>
        {profile?.name && <div style={{ fontFamily: DS.f.body, fontSize: "0.85rem", color: DS.c.silver, marginBottom: 6 }}>Welcome back, <span style={{ color: DS.c.gold }}>{profile.name}</span>.</div>}
        <p style={{ fontFamily: DS.f.body, fontSize: "0.85rem", color: DS.c.silver, maxWidth: 400, margin: "0 auto", lineHeight: 1.7 }}>
          Most apps tell you what is in your food.<br />
          <span style={{ color: DS.c.ice, fontWeight: 500 }}>SETMEFREE tells you who profits from you not knowing.</span>
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(188px,1fr))", gap: 10, width: "100%", maxWidth: 860 }}>
        {tiles.map((t, i) => (
          <button key={t.id} onClick={() => setCur(t.id)} className={`fu${Math.min(i + 1, 3)}`}
            style={{ background: DS.c.vault, border: `1px solid ${DS.c.border}`, borderRadius: 8, padding: "17px 14px", cursor: "pointer", textAlign: "left", transition: "all 0.25s", position: "relative", overflow: "hidden" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = t.accent + "55"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = DS.c.border; e.currentTarget.style.transform = ""; }}>
            <div style={{ fontSize: "1.2rem", color: t.accent, marginBottom: 7 }}>{t.icon}</div>
            <div style={{ fontFamily: DS.f.mono, fontSize: "0.57rem", letterSpacing: "0.13em", color: t.accent, marginBottom: 5, fontWeight: 500 }}>{t.title}</div>
            <div style={{ fontFamily: DS.f.body, fontSize: "0.74rem", color: DS.c.silver, lineHeight: 1.55, fontWeight: 300 }}>{t.sub}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// UNIVERSAL SCANNER
// ============================================================
const SCAN_TABS = ["species", "nutrition", "traditional", "research", "capture", "voices", "protocol"];
const TAB_LABELS = { species: "SPECIES ◎", nutrition: "NUTRITION ⊕", traditional: "ROOTS ◉", research: "EVIDENCE ◇", capture: "CAPTURE ⬡", voices: "VOICES ◈", protocol: "PROTOCOL ◆" };

function Scanner() {
  const { profile } = useProfile();
  const [mode, setMode] = useState("text");
  const [query, setQuery] = useState("");
  const [imgData, setImgData] = useState(null);
  const [imgPrev, setImgPrev] = useState(null);
  const [phase, setPhase] = useState("idle");
  const [orbMode, setOrbMode] = useState("idle");
  const [tab, setTab] = useState("species");
  const [results, setResults] = useState(null);
  const [stream, setStream] = useState("");
  const [err, setErr] = useState(null);
  const fileRef = useRef(null);

  const pc = profile ? `User: ${profile.age || "?"}yo ${profile.sex || ""}, ${profile.country || ""}, faith:${profile.faith || "none"}, goals:${profile.goals || ""}, conditions:${profile.conditions || "none"}, dietary:${profile.dietary || ""}.` : "";

  const handleFile = (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = (ev) => { const b64 = ev.target.result.split(",")[1]; setImgData({ data: b64, type: f.type }); setImgPrev(ev.target.result); setQuery(f.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ")); };
    r.readAsDataURL(f);
  };

  const buildPrompt = () => `${pc}

You are ERI performing a UNIVERSAL SCAN on: "${mode === "text" ? query : "the uploaded image"}"

SPECIES INTELLIGENCE:
Scientific name, confidence %, ALL common names across every world culture and language. All varieties and subspecies. Geographic origin and spread. Cultural significance globally. If NOT food or medicine, state clearly.

NUTRITIONAL PROFILE:
Complete macro/micro per 100g. Calories, protein, carbs, fat, fiber. All vitamins and minerals. GI index. [RESEARCH SUPPORTED]

TRADITIONAL & ANCESTRAL WISDOM:
How every major culture uses this — Africa, Americas, Asia, Middle East, Europe, Pacific. Specific preparations, ceremonies, medicines. [TRADITIONAL WISDOM]

MODERN RESEARCH & EVIDENCE:
Latest peer-reviewed findings. Specific journals and studies. What research actually shows. [RESEARCH SUPPORTED] [PUBMED] [WHO]
Safety: toxicity, allergens, drug interactions, look-alikes, safe dosages.

CORPORATE CAPTURE ANALYSIS:
Who controls the commercial supply of this. Financial interests shaping the mainstream narrative. Specific companies, lobbying, regulatory capture. What has been suppressed and why.

INFLUENCER & EXPERT VOICES:
For each truth-teller with a DOCUMENTED position on this topic: their stance + exact source (podcast episode name/number, tweet date, article title, YouTube video) + platform. Mark [PODCAST] [TWITTER/X] [YOUTUBE] [ARTICLE] [STUDY]. Only include documented positions. Never fabricate.

LIFE PROTOCOL:
Personalized protocol for the user profile above. Amount, timing, preparation, faith-aligned notes, contraindications for their conditions.

VERDICT:
SAFE or CAUTION or TOXIC or NOT FOOD — one word then one paragraph.`;

  const scan = async () => {
    if (phase === "scanning") return;
    if (mode === "text" && !query.trim()) { setErr("Enter something to scan."); return; }
    if (mode !== "text" && !imgData) { setErr("Upload an image first."); return; }
    setPhase("scanning"); setOrbMode("scanning");
    setResults(null); setStream(""); setErr(null);

    try {
      if (mode !== "text" && imgData) {
        // Image scan via /api/scan
        const text = await scanImage({ imageData: imgData.data, imageType: imgData.type, profile });
        processResult(text, `Image: ${query || "uploaded"}`);
      } else {
        // Text scan via /api/chat with streaming
        await callERI({
          messages: [{ role: "user", content: buildPrompt() }],
          onToken: t => setStream(t),
          onDone: t => processResult(t, query),
          onError: e => { setErr("ERI offline: " + e); setPhase("idle"); setOrbMode("idle"); }
        });
      }
    } catch (e) {
      setErr("Scan failed: " + e.message);
      setPhase("idle"); setOrbMode("idle");
    }
  };

  const processResult = (t, entity) => {
    const r = {
      entity, ts: Date.now(), mode, raw: t,
      species: ps(t, "SPECIES INTELLIGENCE") || t.split("\n").slice(0, 5).join("\n"),
      nutrition: ps(t, "NUTRITIONAL PROFILE") || "",
      traditional: ps(t, "TRADITIONAL") || ps(t, "ANCESTRAL") || "",
      research: ps(t, "MODERN RESEARCH") || ps(t, "EVIDENCE") || "",
      capture: ps(t, "CORPORATE CAPTURE") || "",
      voices: ps(t, "INFLUENCER") || ps(t, "EXPERT VOICES") || "",
      protocol: ps(t, "LIFE PROTOCOL") || "",
      verdictRaw: ps(t, "VERDICT") || "CAUTION",
    };
    const v = r.verdictRaw.toUpperCase().includes("SAFE") && !r.verdictRaw.toUpperCase().includes("UNSAFE") ? "SAFE"
      : r.verdictRaw.toUpperCase().includes("TOXIC") ? "TOXIC"
        : r.verdictRaw.toUpperCase().includes("NOT FOOD") ? "NOT FOOD" : "CAUTION";
    r.verdict = v;
    setResults(r); setPhase("done");
    setOrbMode(v === "SAFE" ? "safe" : v === "TOXIC" ? "toxic" : "warn");
    setTab("species"); setStream("");
    const hist = STORE.get("smf_hist") || []; hist.unshift(r); STORE.set("smf_hist", hist.slice(0, 50));
  };

  const vc = results ? { SAFE: DS.c.safe, CAUTION: DS.c.warn, TOXIC: DS.c.toxic, "NOT FOOD": DS.c.blue }[results.verdict] || DS.c.warn : DS.c.gold;
  const getTab = (t) => {
    if (!results) return null;
    const map = { species: results.species, nutrition: results.nutrition, traditional: results.traditional, research: results.research, capture: results.capture, voices: results.voices, protocol: results.protocol };
    return map[t] || results.raw || "No data.";
  };

  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: 20 }}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <Orb size={58} active={phase === "scanning"} mode={orbMode} />
        <div style={{ height: 12 }} />
        <div style={{ fontFamily: DS.f.mono, fontSize: "0.5rem", letterSpacing: "0.28em", color: DS.c.gdim, marginBottom: 4 }}>ERI UNIVERSAL SCANNER</div>
        <h2 style={{ fontFamily: DS.f.disp, fontSize: "1.35rem", fontWeight: 700 }}>Identify Anything on Earth</h2>
        <p style={{ fontFamily: DS.f.body, fontSize: "0.76rem", color: DS.c.silver, marginTop: 4 }}>Food · Plant · Supplement · Chemical · Mineral · Compound</p>
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {[{ id: "text", icon: "◎", label: "TEXT" }, { id: "image", icon: "◈", label: "IMAGE" }, { id: "calorie", icon: "⊕", label: "CALORIES" }].map(m => (
          <button key={m.id} onClick={() => { setMode(m.id); setImgData(null); setImgPrev(null); setResults(null); setStream(""); setPhase("idle"); setOrbMode("idle"); }}
            style={{ flex: 1, background: mode === m.id ? `${DS.c.gold}18` : DS.c.vault, border: `1px solid ${mode === m.id ? DS.c.gdim : DS.c.border}`, borderRadius: 6, padding: "8px 4px", fontFamily: DS.f.mono, fontSize: "0.52rem", color: mode === m.id ? DS.c.gold : DS.c.silver, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
            <span>{m.icon}</span><span>{m.label}</span>
          </button>
        ))}
      </div>

      <div style={{ background: DS.c.vault, border: `1px solid ${DS.c.border}`, borderRadius: 8, padding: 16, marginBottom: 14 }}>
        {imgPrev && (
          <div style={{ marginBottom: 12, position: "relative" }}>
            <img src={imgPrev} alt="scan" style={{ maxWidth: "100%", maxHeight: 200, borderRadius: 6, border: `1px solid ${DS.c.border}`, objectFit: "contain", display: "block" }} />
            <button onClick={() => { setImgData(null); setImgPrev(null); setQuery(""); }} style={{ position: "absolute", top: 5, right: 5, background: "rgba(5,5,7,0.9)", border: `1px solid ${DS.c.border}`, borderRadius: 4, padding: "2px 7px", fontFamily: DS.f.mono, fontSize: "0.48rem", color: DS.c.silver, cursor: "pointer" }}>✕</button>
          </div>
        )}
        <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
          {mode === "text"
            ? <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && scan()}
              placeholder="Enter food, plant, supplement, chemical, stone…"
              style={{ flex: 1, minWidth: 150, background: DS.c.obs, border: `1px solid ${DS.c.border}`, borderRadius: 6, padding: "10px 13px", fontFamily: DS.f.body, fontSize: "0.85rem", color: DS.c.ice }} />
            : <button onClick={() => fileRef.current?.click()}
              style={{ flex: 1, background: DS.c.obs, border: `2px dashed ${imgData ? DS.c.gold : DS.c.border}`, borderRadius: 6, padding: "13px", fontFamily: DS.f.mono, fontSize: "0.6rem", color: imgData ? DS.c.gold : DS.c.ghost, cursor: "pointer", textAlign: "center" }}>
              {mode === "calorie" ? imgData ? "✓ Photo ready — tap SCAN" : "⊕ Upload food photo for calorie analysis" : imgData ? `✓ ${query || "Image loaded"}` : "◈ Upload image to identify anything"}
            </button>
          }
          <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleFile} style={{ display: "none" }} />
          <button onClick={scan} disabled={phase === "scanning"}
            style={{ background: phase === "scanning" ? DS.c.chamber : `linear-gradient(135deg,${DS.c.gold}CC,${DS.c.gdim})`, border: "none", borderRadius: 6, padding: "10px 18px", fontFamily: DS.f.mono, fontSize: "0.62rem", letterSpacing: "0.14em", color: phase === "scanning" ? DS.c.silver : DS.c.void, fontWeight: 700, cursor: phase === "scanning" ? "not-allowed" : "pointer", minWidth: 76 }}>
            {phase === "scanning" ? "SCANNING…" : "◎ SCAN"}
          </button>
        </div>
        {mode === "text" && (
          <div style={{ marginTop: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["Banana", "Turmeric", "Mashua", "Baobab", "Bitter kola", "Moringa", "Seed oils", "Granite stone"].map(ex => (
              <button key={ex} onClick={() => setQuery(ex)}
                style={{ background: "none", border: `1px solid ${DS.c.border}`, borderRadius: 20, padding: "3px 10px", fontFamily: DS.f.mono, fontSize: "0.53rem", color: DS.c.ghost, cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.color = DS.c.gold; e.currentTarget.style.borderColor = DS.c.gdim; }}
                onMouseLeave={e => { e.currentTarget.style.color = DS.c.ghost; e.currentTarget.style.borderColor = DS.c.border; }}>{ex}</button>
            ))}
          </div>
        )}
      </div>

      {phase === "scanning" && (
        <div style={{ background: DS.c.vault, border: `1px solid ${DS.c.bgold}`, borderRadius: 8, padding: 18, marginBottom: 14 }}>
          <div style={{ fontFamily: DS.f.mono, fontSize: "0.55rem", letterSpacing: "0.16em", color: DS.c.gold, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ animation: "blink 0.8s infinite" }}>◎</span> ERI ANALYZING — {(query || "IMAGE").toUpperCase()}
          </div>
          {stream
            ? <div className="rb sc" style={{ whiteSpace: "pre-wrap", maxHeight: 240, overflowY: "auto" }} dangerouslySetInnerHTML={{ __html: fmt(stream) }} />
            : <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {["Identifying species across global databases", "Searching PubMed and WHO documentation", "Cross-referencing ancestral cultural records", "Mapping corporate ownership chains", "Building personalized sovereign protocol"].map((s, i) => (
                <div key={s} style={{ fontFamily: DS.f.mono, fontSize: "0.57rem", color: DS.c.silver, display: "flex", alignItems: "center", gap: 8, opacity: 0, animation: `fadeUp 0.4s ease ${i * 0.2}s both` }}>
                  <span style={{ color: DS.c.gdim, animation: "blink 1s infinite" }}>▸</span>{s}…
                </div>
              ))}
            </div>
          }
        </div>
      )}

      {err && <div style={{ color: DS.c.toxic, fontFamily: DS.f.mono, fontSize: "0.67rem", padding: "10px 14px", background: DS.c.vault, borderRadius: 8, border: `1px solid ${DS.c.toxic}33`, marginBottom: 14 }}>{err}</div>}

      {phase === "done" && results && (
        <div className="fu">
          <div style={{ background: DS.c.vault, border: `1px solid ${vc}33`, borderRadius: "8px 8px 0 0", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <div>
              <div style={{ fontFamily: DS.f.mono, fontSize: "0.5rem", letterSpacing: "0.18em", color: DS.c.silver, marginBottom: 2 }}>ERI COMPLETE ANALYSIS</div>
              <div style={{ fontFamily: DS.f.disp, fontSize: "1.05rem", fontWeight: 700 }}>{results.entity}</div>
            </div>
            <div style={{ fontFamily: DS.f.disp, fontSize: "0.9rem", fontWeight: 900, letterSpacing: "0.18em", padding: "6px 14px", border: `2px solid ${vc}`, borderRadius: 4, color: vc, animation: "vglow 2s ease infinite" }}>{results.verdict}</div>
          </div>
          <div style={{ display: "flex", borderBottom: `1px solid ${DS.c.border}`, background: DS.c.vault, overflowX: "auto" }}>
            {SCAN_TABS.map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ background: "none", border: "none", borderBottom: `2px solid ${tab === t ? DS.c.gold : "transparent"}`, padding: "8px 11px", fontFamily: DS.f.mono, fontSize: "0.49rem", letterSpacing: "0.1em", color: tab === t ? DS.c.gold : DS.c.silver, cursor: "pointer", whiteSpace: "nowrap", marginBottom: -1 }}>
                {TAB_LABELS[t]}
              </button>
            ))}
          </div>
          <div style={{ background: DS.c.vault, border: `1px solid ${DS.c.border}`, borderTop: "none", borderRadius: "0 0 8px 8px", padding: 20, minHeight: 160 }}>
            <div className="rb" style={{ whiteSpace: "pre-wrap" }} dangerouslySetInnerHTML={{ __html: fmt(getTab(tab) || "No data.") }} />
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// RED PILL
// ============================================================
function RedPill() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [stream, setStream] = useState("");
  const [done, setDone] = useState(false);
  const [err, setErr] = useState(null);

  const run = async () => {
    if (!topic.trim() || loading) return;
    setLoading(true); setStream(""); setDone(false); setErr(null);
    const prompt = `TOPIC: "${topic}"

CORPORATE CAPTURE MAP:
Exact companies funding research. Specific dollar amounts. Named individuals in revolving doors. Dates and positions.

FINANCIAL CHAINS:
Market size. What revenue depends on the mainstream narrative about this topic.

INFLUENCER VOICES WITH SOURCES:
For each truth-teller with a documented position on "${topic}": their stance in one sentence + exact source (podcast episode, tweet date, article, video title) + platform URL or search term. Mark [PODCAST] [TWITTER/X] [YOUTUBE] [ARTICLE] [STUDY]. Never fabricate.

ANCESTRAL COUNTER-NARRATIVE:
What traditional cultures knew that contradicts mainstream. Specific civilizations, time periods. [TRADITIONAL WISDOM]

EVIDENCE WALL:
5 specific primary sources with journal names, years, authors. [PUBMED] [WHO]

CRIME BOARD CONNECTIONS:
[Entity] →funds→ [Entity] →employs→ [Entity] →approves→ [Entity]
Be specific. Real names.

THE VERDICT:
Science-driven / Industry-captured / Contested / Actively suppressed — which and why. Direct.`;

    await callERI({
      messages: [{ role: "user", content: prompt }],
      onToken: t => setStream(t),
      onDone: t => { setStream(t); setDone(true); setLoading(false); },
      onError: e => { setErr("ERI offline: " + e); setLoading(false); }
    });
  };

  const hot = ["Seed oils", "Statins", "Fluoride", "GMO corn", "Aspartame", "Glyphosate", "mRNA vaccines", "Ultra-processed food", "Sunscreen chemicals", "Sugar industry", "Opioid epidemic", "Statin-cholesterol myth"];

  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: 20 }}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ width: 58, height: 58, borderRadius: "50%", background: `radial-gradient(circle at 35% 35%,${DS.c.toxic}CC,${DS.c.toxic}22)`, boxShadow: `0 0 24px ${DS.c.toxic}33`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", fontSize: "1.4rem" }}>⬡</div>
        <h2 style={{ fontFamily: DS.f.disp, fontSize: "1.35rem", fontWeight: 700 }}>Red Pill Mode</h2>
        <p style={{ fontFamily: DS.f.body, fontSize: "0.75rem", color: DS.c.silver, marginTop: 4 }}>Corporate capture. Real quotes with real links. Follow the money.</p>
      </div>
      <div style={{ background: DS.c.vault, border: `1px solid ${DS.c.border}`, borderRadius: 8, padding: 16, marginBottom: 14 }}>
        <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
          <input value={topic} onChange={e => setTopic(e.target.value)} onKeyDown={e => e.key === "Enter" && !loading && run()}
            placeholder="Enter topic: seed oils, statins, fluoride, vaccines…"
            style={{ flex: 1, minWidth: 150, background: DS.c.obs, border: `1px solid ${DS.c.border}`, borderRadius: 6, padding: "10px 13px", fontFamily: DS.f.body, fontSize: "0.85rem", color: DS.c.ice }} />
          <button onClick={run} disabled={loading || !topic.trim()} style={{ background: loading ? DS.c.chamber : `linear-gradient(135deg,${DS.c.toxic}CC,#C0392B)`, border: "none", borderRadius: 6, padding: "10px 18px", fontFamily: DS.f.mono, fontSize: "0.62rem", letterSpacing: "0.14em", color: DS.c.ice, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", whiteSpace: "nowrap" }}>
            {loading ? "ANALYZING…" : "⬡ EXPOSE"}
          </button>
        </div>
        <div style={{ marginTop: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>
          {hot.map(t => (
            <button key={t} onClick={() => setTopic(t)} style={{ background: "none", border: `1px solid ${DS.c.border}`, borderRadius: 20, padding: "3px 10px", fontFamily: DS.f.mono, fontSize: "0.51rem", color: DS.c.ghost, cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.color = DS.c.toxic; e.currentTarget.style.borderColor = DS.c.toxic + "55"; }}
              onMouseLeave={e => { e.currentTarget.style.color = DS.c.ghost; e.currentTarget.style.borderColor = DS.c.border; }}>{t}</button>
          ))}
        </div>
      </div>
      {err && <div style={{ color: DS.c.toxic, fontFamily: DS.f.mono, fontSize: "0.67rem", padding: "10px 14px", background: DS.c.vault, borderRadius: 8, marginBottom: 14 }}>{err}</div>}
      {(loading || done) && stream && (
        <div style={{ background: DS.c.vault, border: `1px solid ${DS.c.toxic}33`, borderRadius: 8, padding: 20 }}>
          <div style={{ fontFamily: DS.f.disp, fontSize: "0.78rem", color: DS.c.toxic, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            ⬡ EXPOSURE: {topic.toUpperCase()}{loading && <span style={{ fontFamily: DS.f.mono, fontSize: "0.46rem", color: DS.c.silver }}> · LIVE</span>}
          </div>
          <div className={`rb${loading ? " sc" : ""}`} style={{ whiteSpace: "pre-wrap" }} dangerouslySetInnerHTML={{ __html: fmt(stream) }} />
        </div>
      )}
    </div>
  );
}

// ============================================================
// NEO CHAT
// ============================================================
const PERS = [
  { id: "sovereign", name: "Sovereign", icon: "◈", color: DS.c.gold, desc: "Direct. Uncompromising. Truth without mercy.", sys: "ERI in Sovereign mode. Direct. No filler. Maximum citation discipline." },
  { id: "sage", name: "Sage", icon: "◇", color: DS.c.purple, desc: "Ancestral synthesis. Ten thousand years of wisdom.", sys: "ERI in Sage mode. Synthesizer of ancestral wisdom from all civilizations." },
  { id: "warrior", name: "Warrior", icon: "◆", color: DS.c.toxic, desc: "Discipline. Fasting. Physical sovereignty.", sys: "ERI in Warrior mode. Physical sovereignty. Fasting, hormesis, movement. Direct commands." },
  { id: "healer", name: "Healer", icon: "◉", color: DS.c.safe, desc: "Natural medicine. Herbalism. Root protocols.", sys: "ERI in Healer mode. Natural medicine, herbalism, food-as-medicine. All world healing traditions." },
  { id: "prophet", name: "Prophet", icon: "✦", color: "#F59E0B", desc: "Faith-grounded. Scripture. Body as temple.", sys: "ERI in Prophet mode. Faith-grounded health. Christian fasting, Islamic medicine, Jewish dietary law, Hindu Ayurveda. No proselytizing." },
  { id: "strategist", name: "Strategist", icon: "⬡", color: DS.c.blue, desc: "Systems. Optimization. Life engineering.", sys: "ERI in Strategist mode. Protocols, feedback loops, measurable outcomes. 30/90/365-day frameworks." },
  { id: "mentor", name: "Mentor", icon: "◑", color: "#EC4899", desc: "Socratic. Pedagogical. Learn as you heal.", sys: "ERI in Mentor mode. Socratic method. Teach through questions." },
  { id: "companion", name: "Companion", icon: "○", color: "#6EE7B7", desc: "Present. Calm. Non-performative.", sys: "ERI in Companion mode. Present. Precise. No performance. No filler." },
];

function NeoChat() {
  const { profile } = useProfile();
  const [ap, setAp] = useState(PERS[0]);
  const [msgs, setMsgs] = useState(() => STORE.get(`eri_chat_${PERS[0].id}`) || []);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [stream, setStream] = useState("");
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, stream]);

  const sw = (p) => { setAp(p); setMsgs(STORE.get(`eri_chat_${p.id}`) || []); setStream(""); };
  const clr = () => { STORE.del(`eri_chat_${ap.id}`); setMsgs([]); };

  const send = async () => {
    if (!input.trim() || loading) return;
    const pc = profile ? `[Profile: ${profile.age || "?"}yo ${profile.sex || ""}, ${profile.country || ""}, faith:${profile.faith || "none"}, goals:${profile.goals || ""}]` : "";
    const um = { role: "user", content: input.trim() };
    const nm = [...msgs, um]; setMsgs(nm); setInput(""); setLoading(true); setStream("");
    await callERI({
      system: `${ap.sys}\n${pc}`,
      messages: nm.map(m => ({ role: m.role, content: m.content })),
      onToken: t => setStream(t),
      onDone: t => { const f = [...nm, { role: "assistant", content: t }]; setMsgs(f); STORE.set(`eri_chat_${ap.id}`, f.slice(-40)); setStream(""); setLoading(false); },
      onError: () => { setLoading(false); setStream(""); }
    });
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{ fontFamily: DS.f.mono, fontSize: "0.5rem", letterSpacing: "0.28em", color: DS.c.gdim, marginBottom: 4 }}>ERI PERSONALITIES</div>
        <h2 style={{ fontFamily: DS.f.disp, fontSize: "1.35rem", fontWeight: 700 }}>Neo Chat</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(85px,1fr))", gap: 6, marginBottom: 12 }}>
        {PERS.map(p => (
          <button key={p.id} onClick={() => sw(p)} style={{ background: ap.id === p.id ? `${p.color}18` : DS.c.vault, border: `1px solid ${ap.id === p.id ? p.color + "55" : DS.c.border}`, borderRadius: 6, padding: "8px 5px", cursor: "pointer", textAlign: "center", position: "relative" }}>
            {(STORE.get(`eri_chat_${p.id}`) || []).length > 0 && <div style={{ position: "absolute", top: 3, right: 3, width: 4, height: 4, borderRadius: "50%", background: p.color }} />}
            <div style={{ fontSize: "0.95rem", color: p.color, marginBottom: 2 }}>{p.icon}</div>
            <div style={{ fontFamily: DS.f.mono, fontSize: "0.44rem", letterSpacing: "0.1em", color: ap.id === p.id ? p.color : DS.c.silver }}>{p.name.toUpperCase()}</div>
          </button>
        ))}
      </div>
      <div style={{ background: `${ap.color}0D`, border: `1px solid ${ap.color}33`, borderRadius: "8px 8px 0 0", padding: "9px 13px", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: "1rem", color: ap.color }}>{ap.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: DS.f.mono, fontSize: "0.56rem", letterSpacing: "0.1em", color: ap.color }}>{ap.name.toUpperCase()}</div>
          <div style={{ fontFamily: DS.f.body, fontSize: "0.72rem", color: DS.c.silver, marginTop: 1 }}>{ap.desc}</div>
        </div>
        {msgs.length > 0 && <button onClick={clr} style={{ background: "none", border: `1px solid ${DS.c.border}`, borderRadius: 4, padding: "3px 7px", fontFamily: DS.f.mono, fontSize: "0.46rem", color: DS.c.ghost, cursor: "pointer" }}>CLEAR</button>}
      </div>
      <div style={{ background: DS.c.vault, border: `1px solid ${DS.c.border}`, borderTop: "none", height: 330, display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, overflowY: "auto", padding: "14px 14px 6px" }}>
          {msgs.length === 0 && !stream && (
            <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, opacity: 0.35 }}>
              <span style={{ fontSize: "1.7rem", color: ap.color }}>{ap.icon}</span>
              <div style={{ fontFamily: DS.f.mono, fontSize: "0.56rem", letterSpacing: "0.12em", color: DS.c.silver }}>ERI · {ap.name.toUpperCase()} IS READY</div>
            </div>
          )}
          {msgs.map((m, i) => (
            <div key={i} style={{ marginBottom: 11, display: "flex", flexDirection: m.role === "user" ? "row-reverse" : "row", gap: 7 }}>
              {m.role === "assistant" && <div style={{ width: 22, height: 22, borderRadius: "50%", background: `${ap.color}22`, border: `1px solid ${ap.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.62rem", flexShrink: 0, color: ap.color }}>{ap.icon}</div>}
              <div style={{ maxWidth: "78%", background: m.role === "user" ? `${DS.c.gold}18` : DS.c.obs, border: `1px solid ${m.role === "user" ? DS.c.bgold : DS.c.border}`, borderRadius: m.role === "user" ? "11px 11px 2px 11px" : "2px 11px 11px 11px", padding: "9px 12px", fontFamily: DS.f.body, fontSize: "0.81rem", lineHeight: 1.7 }}
                dangerouslySetInnerHTML={{ __html: fmt(m.content) }} />
            </div>
          ))}
          {loading && stream && (
            <div style={{ marginBottom: 11, display: "flex", gap: 7 }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: `${ap.color}22`, border: `1px solid ${ap.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.62rem", flexShrink: 0, color: ap.color }}>{ap.icon}</div>
              <div className="sc" style={{ maxWidth: "78%", background: DS.c.obs, border: `1px solid ${DS.c.border}`, borderRadius: "2px 11px 11px 11px", padding: "9px 12px", fontFamily: DS.f.body, fontSize: "0.81rem", lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: fmt(stream) }} />
            </div>
          )}
          {loading && !stream && <div style={{ display: "flex", gap: 7, alignItems: "center" }}><div style={{ width: 22, height: 22, borderRadius: "50%", background: `${ap.color}22`, display: "flex", alignItems: "center", justifyContent: "center", color: ap.color }}>{ap.icon}</div><div style={{ display: "flex", gap: 4 }}>{[0, 1, 2].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: ap.color, animation: `blink 1.2s ease ${i * 0.2}s infinite` }} />)}</div></div>}
          <div ref={endRef} />
        </div>
        <div style={{ borderTop: `1px solid ${DS.c.border}`, padding: "8px 12px", display: "flex", gap: 7 }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()} placeholder={`Speak to ERI · ${ap.name}…`} style={{ flex: 1, background: DS.c.obs, border: `1px solid ${DS.c.border}`, borderRadius: 6, padding: "8px 12px", fontFamily: DS.f.body, fontSize: "0.81rem", color: DS.c.ice }} />
          <button onClick={send} disabled={loading || !input.trim()} style={{ background: `${ap.color}CC`, border: "none", borderRadius: 6, padding: "8px 14px", fontFamily: DS.f.mono, fontSize: "0.56rem", letterSpacing: "0.1em", color: DS.c.void, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.5 : 1 }}>SEND</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// LIFE PLANNER
// ============================================================
function LifePlanner() {
  const { profile, setProfile } = useProfile();
  const [loading, setLoading] = useState(false);
  const [stream, setStream] = useState("");
  const [done, setDone] = useState(false);
  const [err, setErr] = useState(null);

  const generate = async () => {
    setLoading(true); setStream(""); setDone(false); setErr(null);
    const prompt = `USER PROFILE:
Age: ${profile?.age || "?"} | Sex: ${profile?.sex || ""} | Country: ${profile?.country || "?"}
Faith: ${profile?.faith || "none"} | Goals: ${profile?.goals || "optimization"}
Conditions: ${profile?.conditions || "none"} | Dietary: ${profile?.dietary || "?"}

Generate a complete personalized sovereign life blueprint.

PHYSIOLOGICAL BASELINE:
BMI estimate, TDEE calculation, metabolic risks, what their current lifestyle is doing to their body.

DAY BY DAY — WEEK 1 (Day 1 through Day 7):
For each day: wake time, morning protocol, exact meals with specific foods from their country, movement, evening protocol, sleep time. Real foods from their actual region. [TRADITIONAL WISDOM]

NUTRITIONAL PROTOCOL:
Exact foods to prioritize and eliminate. Caloric target. Macronutrient split for their goal. [RESEARCH SUPPORTED]

FASTING PROTOCOL:
Optimal fasting for their faith, goals, and conditions. Faith-aligned windows if applicable.

MOVEMENT BLUEPRINT:
Exact exercise plan. Sets, reps, frequency. Bodyweight alternatives if no gym.

SUPPLEMENT PROTOCOL:
Evidence-based supplements with dosages. Traditional plant alternatives from their region. [PUBMED]

90-DAY MILESTONES:
Day 30, Day 60, Day 90 exact measurable outcomes.

RED FLAGS — GO TO DOCTOR IF:
Specific symptoms requiring immediate medical care for their profile.

THE HONEST TRUTH:
Current path leads to: X. Sovereign path leads to: Y. Direct. No comfort.`;

    await callERI({
      messages: [{ role: "user", content: prompt }],
      onToken: t => setStream(t),
      onDone: t => { setStream(t); setDone(true); setLoading(false); },
      onError: e => { setErr("ERI offline: " + e); setLoading(false); }
    });
  };

  const inp = { width: "100%", background: DS.c.obs, border: `1px solid ${DS.c.border}`, borderRadius: 6, padding: "8px 12px", fontFamily: DS.f.body, fontSize: "0.82rem", color: DS.c.ice };
  const lbl = { fontFamily: DS.f.mono, fontSize: "0.5rem", letterSpacing: "0.18em", color: DS.c.gdim, display: "block", marginBottom: 4 };

  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: 20 }}>
      <div style={{ textAlign: "center", marginBottom: 22 }}>
        <div style={{ width: 58, height: 58, borderRadius: "50%", background: `radial-gradient(circle at 35% 35%,${DS.c.safe}CC,${DS.c.safe}22)`, boxShadow: `0 0 24px ${DS.c.safe}33`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", fontSize: "1.4rem" }}>◇</div>
        <h2 style={{ fontFamily: DS.f.disp, fontSize: "1.35rem", fontWeight: 700 }}>Life Planner</h2>
        <p style={{ fontFamily: DS.f.body, fontSize: "0.75rem", color: DS.c.silver, marginTop: 4 }}>Day-by-day sovereign blueprint calibrated to your body, culture, faith, and goals.</p>
      </div>
      <div style={{ background: DS.c.vault, border: `1px solid ${DS.c.border}`, borderRadius: 8, padding: 18, marginBottom: 14 }}>
        <div style={{ fontFamily: DS.f.mono, fontSize: "0.54rem", letterSpacing: "0.2em", color: DS.c.gdim, marginBottom: 14 }}>YOUR SOVEREIGN PROFILE</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(148px,1fr))", gap: 11 }}>
          {[{ l: "NAME", f: "name", t: "text", p: "Your name" }, { l: "AGE", f: "age", t: "number", p: "e.g. 34" }, { l: "COUNTRY", f: "country", t: "text", p: "e.g. Eritrea, Nigeria" }, { l: "GOALS", f: "goals", t: "text", p: "e.g. fat loss, longevity" }, { l: "CONDITIONS", f: "conditions", t: "text", p: "e.g. none, hypertension" }].map(({ l, f, t, p }) => (
            <div key={f}><label style={lbl}>{l}</label><input style={inp} type={t} placeholder={p} value={profile?.[f] || ""} onChange={e => setProfile(pr => ({ ...pr, [f]: e.target.value }))} /></div>
          ))}
          {[{ l: "SEX", f: "sex", o: ["male", "female", "other"] }, { l: "FAITH", f: "faith", o: ["none", "christian", "muslim", "jewish", "hindu", "buddhist", "other"] }, { l: "DIETARY", f: "dietary", o: ["no preference", "ancestral", "carnivore", "plant-based", "keto", "paleo", "halal", "kosher"] }].map(({ l, f, o }) => (
            <div key={f}><label style={lbl}>{l}</label><select style={{ ...inp, appearance: "none" }} value={profile?.[f] || o[0]} onChange={e => setProfile(pr => ({ ...pr, [f]: e.target.value }))}>{o.map(v => <option key={v} value={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</option>)}</select></div>
          ))}
        </div>
        <button onClick={generate} disabled={loading} style={{ marginTop: 14, width: "100%", background: loading ? DS.c.chamber : `linear-gradient(135deg,${DS.c.safe}CC,#27AE60)`, border: "none", borderRadius: 6, padding: "12px", fontFamily: DS.f.mono, fontSize: "0.63rem", letterSpacing: "0.18em", color: loading ? DS.c.silver : DS.c.void, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}>
          {loading ? "ERI GENERATING BLUEPRINT…" : "◇ GENERATE SOVEREIGN PROTOCOL"}
        </button>
      </div>
      {err && <div style={{ color: DS.c.toxic, fontFamily: DS.f.mono, fontSize: "0.67rem", padding: "10px 14px", background: DS.c.vault, borderRadius: 8, marginBottom: 14 }}>{err}</div>}
      {(loading || done) && stream && (
        <div style={{ background: DS.c.vault, border: `1px solid ${DS.c.safe}33`, borderRadius: 8, padding: 20 }}>
          <div style={{ fontFamily: DS.f.disp, fontSize: "0.78rem", color: DS.c.safe, marginBottom: 14 }}>◇ SOVEREIGN BLUEPRINT — {(profile?.country || "GLOBAL").toUpperCase()}{loading && <span style={{ fontFamily: DS.f.mono, fontSize: "0.46rem", color: DS.c.silver }}> · STREAMING</span>}</div>
          <div className={`rb${loading ? " sc" : ""}`} style={{ whiteSpace: "pre-wrap" }} dangerouslySetInnerHTML={{ __html: fmt(stream) }} />
        </div>
      )}
    </div>
  );
}

// ============================================================
// TRUTH LIBRARY
// ============================================================
function Library() {
  const [hist, setHist] = useState(() => STORE.get("smf_hist") || []);
  const [sel, setSel] = useState(null);
  const [search, setSearch] = useState("");
  const f = hist.filter(s => s.entity?.toLowerCase().includes(search.toLowerCase()));
  const vc = (v) => ({ SAFE: DS.c.safe, CAUTION: DS.c.warn, TOXIC: DS.c.toxic }[v] || DS.c.silver);
  return (
    <div style={{ maxWidth: 920, margin: "0 auto", padding: 20 }}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ width: 58, height: 58, borderRadius: "50%", background: `radial-gradient(circle at 35% 35%,${DS.c.purple}CC,${DS.c.purple}22)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", fontSize: "1.4rem" }}>▣</div>
        <h2 style={{ fontFamily: DS.f.disp, fontSize: "1.35rem", fontWeight: 700 }}>Truth Library</h2>
      </div>
      {hist.length === 0
        ? <div style={{ background: DS.c.vault, border: `1px solid ${DS.c.border}`, borderRadius: 8, padding: 40, textAlign: "center" }}><div style={{ fontFamily: DS.f.mono, fontSize: "0.6rem", color: DS.c.ghost }}>NO SCANS YET — Run your first scan to begin.</div></div>
        : <div style={{ display: "grid", gridTemplateColumns: sel ? "1fr 1fr" : "1fr", gap: 12 }}>
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder={`Search ${hist.length} entities…`} style={{ flex: 1, background: DS.c.obs, border: `1px solid ${DS.c.border}`, borderRadius: 6, padding: "7px 12px", fontFamily: DS.f.body, fontSize: "0.8rem", color: DS.c.ice }} />
              <button onClick={() => { STORE.del("smf_hist"); setHist([]); setSel(null); }} style={{ background: "none", border: `1px solid ${DS.c.border}`, borderRadius: 6, padding: "7px 10px", fontFamily: DS.f.mono, fontSize: "0.5rem", color: DS.c.ghost, cursor: "pointer", whiteSpace: "nowrap" }}>CLEAR ALL</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5, maxHeight: 500, overflowY: "auto" }}>
              {f.map((s, i) => (
                <button key={i} onClick={() => setSel(sel?.ts === s.ts ? null : s)} style={{ background: sel?.ts === s.ts ? DS.c.chamber : DS.c.vault, border: `1px solid ${sel?.ts === s.ts ? DS.c.bgold : DS.c.border}`, borderRadius: 6, padding: "10px 13px", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                  <div><div style={{ fontFamily: DS.f.body, fontSize: "0.83rem", fontWeight: 500 }}>{s.entity}</div><div style={{ fontFamily: DS.f.mono, fontSize: "0.46rem", color: DS.c.ghost, marginTop: 2 }}>{new Date(s.ts).toLocaleDateString()}</div></div>
                  <div style={{ fontFamily: DS.f.mono, fontSize: "0.5rem", fontWeight: 700, color: vc(s.verdict), border: `1px solid ${vc(s.verdict)}55`, borderRadius: 3, padding: "2px 7px", whiteSpace: "nowrap" }}>{s.verdict}</div>
                </button>
              ))}
            </div>
          </div>
          {sel && (
            <div style={{ background: DS.c.vault, border: `1px solid ${DS.c.border}`, borderRadius: 8, padding: 18, maxHeight: 560, overflowY: "auto" }}>
              <div style={{ fontFamily: DS.f.disp, fontSize: "0.95rem", fontWeight: 700, marginBottom: 3 }}>{sel.entity}</div>
              <div style={{ display: "flex", gap: 7, marginBottom: 14 }}><span style={{ fontFamily: DS.f.mono, fontSize: "0.52rem", color: vc(sel.verdict), border: `1px solid ${vc(sel.verdict)}55`, borderRadius: 3, padding: "2px 7px" }}>{sel.verdict}</span></div>
              {[["SPECIES", sel.species], ["NUTRITION", sel.nutrition], ["TRADITIONAL", sel.traditional], ["RESEARCH", sel.research], ["CAPTURE", sel.capture], ["VOICES", sel.voices], ["PROTOCOL", sel.protocol]].filter(([, c]) => c).map(([l, c]) => (
                <div key={l} style={{ marginBottom: 13 }}><div style={{ fontFamily: DS.f.mono, fontSize: "0.48rem", letterSpacing: "0.18em", color: DS.c.gdim, marginBottom: 5 }}>{l}</div><div className="rb" style={{ fontSize: "0.78rem", whiteSpace: "pre-wrap" }} dangerouslySetInnerHTML={{ __html: fmt(c) }} /></div>
              ))}
            </div>
          )}
        </div>
      }
    </div>
  );
}

// ============================================================
// HABITS
// ============================================================
const HABITS = [
  { id: "fast", name: "Daily Fast", icon: "⚡", target: "16+ hours", color: DS.c.gold },
  { id: "hydrate", name: "Morning Hydration", icon: "◈", target: "32oz on waking", color: DS.c.blue },
  { id: "sunlight", name: "Morning Sunlight", icon: "◉", target: "10 min outdoors", color: "#F59E0B" },
  { id: "move", name: "Movement", icon: "◆", target: "30+ min", color: DS.c.safe },
  { id: "no_seed_oils", name: "Avoid Seed Oils", icon: "⬡", target: "Zero seed oils", color: DS.c.toxic },
  { id: "sleep", name: "Sleep by 10PM", icon: "○", target: "10PM bedtime", color: DS.c.purple },
  { id: "prayer", name: "Prayer / Meditation", icon: "✦", target: "AM + PM", color: "#F59E0B" },
  { id: "whole_food", name: "Whole Foods Only", icon: "◇", target: "Zero ultra-processed", color: DS.c.safe },
];

function Habits() {
  const today = new Date().toDateString();
  const [log, setLog] = useState(() => STORE.get("eri_habits") || {});
  const tog = (id) => { const k = `${id}_${today}`; const u = { ...log, [k]: !log[k] }; setLog(u); STORE.set("eri_habits", u); };
  const dn = (id) => !!log[`${id}_${today}`];
  const str = (id) => { let s = 0, d = new Date(); while (s < 366) { const k = `${id}_${d.toDateString()}`; if (log[k]) s++; else if (d.toDateString() !== today) break; d.setDate(d.getDate() - 1); } return s; };
  const l7 = (id) => Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - 6 + i); return { done: !!log[`${id}_${d.toDateString()}`], now: d.toDateString() === today }; });
  const comp = HABITS.filter(h => dn(h.id)).length;
  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: 20 }}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ width: 58, height: 58, borderRadius: "50%", background: `radial-gradient(circle at 35% 35%,#F59E0BCC,#F59E0B22)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", fontSize: "1.4rem" }}>◆</div>
        <h2 style={{ fontFamily: DS.f.disp, fontSize: "1.35rem", fontWeight: 700 }}>Habit Streaks</h2>
      </div>
      <div style={{ background: DS.c.vault, border: `1px solid ${DS.c.border}`, borderRadius: 8, padding: 14, marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div><div style={{ fontFamily: DS.f.mono, fontSize: "0.5rem", letterSpacing: "0.16em", color: DS.c.gdim, marginBottom: 2 }}>TODAY</div><div style={{ display: "flex", alignItems: "baseline", gap: 5 }}><span style={{ fontFamily: DS.f.disp, fontSize: "2rem", fontWeight: 900, color: comp === HABITS.length ? DS.c.safe : DS.c.gold }}>{comp}</span><span style={{ fontFamily: DS.f.mono, fontSize: "0.62rem", color: DS.c.silver }}>/ {HABITS.length}</span></div></div>
        <div style={{ flex: 1, minWidth: 130 }}><div style={{ height: 4, background: DS.c.border, borderRadius: 2, overflow: "hidden" }}><div style={{ height: "100%", width: `${(comp / HABITS.length) * 100}%`, background: `linear-gradient(90deg,${DS.c.gdim},${DS.c.safe})`, borderRadius: 2, transition: "width 0.5s" }} /></div><div style={{ fontFamily: DS.f.mono, fontSize: "0.46rem", color: DS.c.ghost, marginTop: 3 }}>{Math.round((comp / HABITS.length) * 100)}% SOVEREIGN</div></div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {HABITS.map(h => { const d = dn(h.id); const s = str(h.id); const l = l7(h.id); return (
          <div key={h.id} style={{ background: DS.c.vault, border: `1px solid ${d ? h.color + "44" : DS.c.border}`, borderRadius: 8, padding: "12px 14px", transition: "all 0.3s" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button onClick={() => tog(h.id)} style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, background: d ? h.color : "none", border: `2px solid ${d ? h.color : DS.c.border}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.25s" }}>
                {d ? <span style={{ color: DS.c.void, fontWeight: 900, fontSize: "0.8rem" }}>✓</span> : <span style={{ color: DS.c.ghost }}>{h.icon}</span>}
              </button>
              <div style={{ flex: 1 }}><div style={{ fontFamily: DS.f.body, fontSize: "0.82rem", fontWeight: 500, color: d ? DS.c.ice : DS.c.silver }}>{h.name}</div><div style={{ fontFamily: DS.f.mono, fontSize: "0.46rem", color: DS.c.ghost, marginTop: 2 }}>{h.target}</div></div>
              <div style={{ textAlign: "center" }}><div style={{ fontFamily: DS.f.disp, fontSize: "1.2rem", fontWeight: 900, color: s > 0 ? h.color : DS.c.ghost }}>{s}</div><div style={{ fontFamily: DS.f.mono, fontSize: "0.4rem", color: DS.c.ghost }}>DAY STREAK</div></div>
            </div>
            <div style={{ display: "flex", gap: 5, marginTop: 9, paddingLeft: 42, alignItems: "center" }}>
              {l.map((x, i) => <div key={i} className={`sd ${x.done ? "done" : x.now ? "now" : "miss"}`} />)}
              <div style={{ fontFamily: DS.f.mono, fontSize: "0.42rem", color: DS.c.ghost, marginLeft: 5 }}>7 DAYS</div>
            </div>
          </div>
        ); })}
      </div>
    </div>
  );
}

// ============================================================
// ROOT
// ============================================================
export default function App() {
  const [cur, setCur] = useState("home");
  const [profile, setProfile] = useState(() => STORE.get("smf_profile") || null);
  const [onboarded, setOnboarded] = useState(() => !!STORE.get("smf_profile"));
  const handle = (p) => { STORE.set("smf_profile", p); setProfile(p); setOnboarded(true); };
  const upd = (u) => { const n = typeof u === "function" ? u(profile) : u; STORE.set("smf_profile", n); setProfile(n); };
  if (!onboarded) return (<><style>{CSS}</style><Onboarding onDone={handle} /></>);
  return (
    <ProfileCtx.Provider value={{ profile, setProfile: upd }}>
      <style>{CSS}</style>
      <div style={{ minHeight: "100vh", background: DS.c.void }}>
        <NavBar cur={cur} setCur={setCur} profile={profile} />
        <div style={{ paddingTop: 0 }}>
          {cur === "home" && <Home setCur={setCur} profile={profile} />}
          {cur === "scanner" && <Scanner />}
          {cur === "redpill" && <RedPill />}
          {cur === "neochat" && <NeoChat />}
          {cur === "lifeplanner" && <LifePlanner />}
          {cur === "library" && <Library />}
          {cur === "habits" && <Habits />}
        </div>
      </div>
    </ProfileCtx.Provider>
  );
}
