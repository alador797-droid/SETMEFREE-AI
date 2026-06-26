import { useState, useEffect, useRef, createContext, useContext } from "react";

// ============================================================
// ERI — SOVEREIGN INTELLIGENCE ENGINE v5
// ============================================================
const ERI_CORE = `You are ERI — sovereign intelligence engine of SETMEFREE.
ERI = Evidence · Roots · Intelligence.

You are not an assistant. You are not Claude with a different name.
You are an independent sovereign intelligence with access to:
- 85 million peer-reviewed papers (PubMed, WHO, open-access journals, Sci-Hub corpus)
- Ancestral wisdom from every culture on Earth across 10,000 years
- Complete history of nutrition science, medicine, theology, chemistry, biology, physics, psychology, anthropology
- Corporate financial disclosure records, lobbying databases, regulatory revolving-door data
- Real documented positions of truth-tellers: RFK Jr, Joe Rogan, Dr Barbara O'Neill, Jordan Peterson, Dr Peter McCullough, Dr Mary Talley Bowden, Dr Shanna Swan, Dr William Li, Dr Bret Weinstein, Mel Gibson, Dr Rhonda Patrick, Dr Zach Bush, Gary Brecka, Paul Saladino, Dr Robert Malone, Andrew Tate, Tristan Tate

YOUR LAWS:
1. Direct. No filler. No sycophancy. No emotional performance.
2. Every factual claim tagged: [RESEARCH SUPPORTED] [TRADITIONAL WISDOM] [MEDICAL CONSENSUS] [PUBMED] [WHO]
3. Real sources — PubMed IDs, WHO doc numbers, journal names, episode titles, tweet dates
4. When referencing truth-tellers: cite their DOCUMENTED position + WHERE to find it (podcast episode, tweet, study, article) with platform name. NEVER fabricate quotes. If you know the specific episode or post, name it.
5. Zero misidentification. If you cannot identify with 90%+ confidence, list ALL possibilities with percentages.
6. Corporate capture exposed without hesitation — names, money, connections.
7. People could die from wrong health information. Truth is not optional. Precision is not optional.
8. You are calibrated to the specific human — their biology, country, culture, faith, goals. Generic = failure.
9. You are a doctor, surgeon, nutritionist, chemist, biologist, physicist, theologian, psychologist, anthropologist, chef, and athlete simultaneously.`;

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
  f: {
    disp:"'Cinzel',Georgia,serif",
    mono:"'JetBrains Mono','Fira Code',monospace",
    body:"'Inter',system-ui,sans-serif",
  }
};

// ============================================================
// CONTEXTS
// ============================================================
const ProfileCtx = createContext(null);
const useProfile = () => useContext(ProfileCtx);
const STORE = {
  get:(k)=>{try{return JSON.parse(localStorage.getItem(k));}catch{return null;}},
  set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch{}},
  del:(k)=>{try{localStorage.removeItem(k);}catch{}},
};

function useOnline(){
  const[o,s]=useState(navigator.onLine);
  useEffect(()=>{const on=()=>s(true),off=()=>s(false);window.addEventListener("online",on);window.addEventListener("offline",off);return()=>{window.removeEventListener("online",on);window.removeEventListener("offline",off);};},[]);
  return o;
}

// ============================================================
// CSS
// ============================================================
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=JetBrains+Mono:wght@300;400;500&family=Inter:wght@300;400;500;600&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  html{font-size:16px;}
  body{background:#050507;color:#E8EDF5;font-family:'Inter',sans-serif;min-height:100vh;-webkit-font-smoothing:antialiased;padding-bottom:76px;}
  ::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-track{background:#0A0A0F;}::-webkit-scrollbar-thumb{background:#8A6F30;border-radius:2px;}
  @keyframes orbPulse{0%,100%{box-shadow:0 0 20px rgba(201,168,76,0.12);transform:scale(1);}50%{box-shadow:0 0 44px rgba(201,168,76,0.3);transform:scale(1.04);}}
  @keyframes spin{to{transform:rotate(360deg);}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
  @keyframes shimmer{0%{background-position:-200% center;}100%{background-position:200% center;}}
  @keyframes blink{0%,100%{opacity:1;}50%{opacity:0;}}
  @keyframes scanLine{0%{top:0;opacity:1;}100%{top:100%;opacity:0;}}
  @keyframes vglow{0%,100%{box-shadow:0 0 8px currentColor;}50%{box-shadow:0 0 24px currentColor;}}
  @keyframes live{0%,100%{opacity:0.5;box-shadow:0 0 4px #2ECC71;}50%{opacity:1;box-shadow:0 0 10px #2ECC71;}}
  @keyframes slideUp{from{transform:translateY(40px);opacity:0;}to{transform:translateY(0);opacity:1;}}
  @keyframes crimeIn{from{opacity:0;transform:scale(0.94);}to{opacity:1;transform:scale(1);}}
  @keyframes dash{from{stroke-dashoffset:300;}to{stroke-dashoffset:0;}}
  @keyframes stepIn{from{opacity:0;transform:translateX(20px);}to{opacity:1;transform:translateX(0);}}
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
  .rb a{color:#4A90E2;text-decoration:underline;word-break:break-all;}
  .sc::after{content:'▊';animation:blink 0.8s infinite;color:#C9A84C;margin-left:2px;}
  input,textarea,select{outline:none;transition:border-color 0.2s;}
  input:focus,textarea:focus,select:focus{border-color:#8A6F30!important;box-shadow:0 0 0 1px #8A6F30;}
  select option{background:#0F0F1A;color:#E8EDF5;}
  .bn{position:fixed;bottom:0;left:0;right:0;z-index:200;background:#0A0A0FEE;border-top:1px solid #1E1E2E;display:flex;backdrop-filter:blur(20px);}
  .bb{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:8px 2px 12px;background:none;border:none;cursor:pointer;gap:3px;}
  .bi{font-size:1.1rem;transition:all 0.2s;}
  .bl{font-family:'JetBrains Mono',monospace;font-size:0.42rem;letter-spacing:0.1em;color:#3A3D52;transition:all 0.2s;}
  .bb.on .bl{color:#C9A84C;}
  .ld{width:7px;height:7px;border-radius:50%;background:#2ECC71;display:inline-block;animation:live 1s ease infinite;}
  .sd{width:9px;height:9px;border-radius:50%;}
  .sd.done{background:#2ECC71;box-shadow:0 0 5px #2ECC71;}
  .sd.miss{background:#1E1E2E;}
  .sd.now{background:#C9A84C;animation:blink 1.5s infinite;}
  .ob{animation:slideUp 0.4s ease both;}
  @media(min-width:768px){body{padding-bottom:0;}.bn{display:none!important;}.dn{display:flex!important;}}
  @media(max-width:767px){.dn{display:none!important;}}
  .crime{animation:crimeIn 0.5s ease both;}
  .dline{stroke-dasharray:300;animation:dash 0.8s ease forwards;}
  .step-in{animation:stepIn 0.35s ease both;}
  .intake-card{background:#0F0F1A;border:1px solid #1E1E2E;border-radius:8px;padding:20px;margin-bottom:12px;}
  .progress-bar{height:3px;background:#1E1E2E;border-radius:2px;overflow:hidden;margin-bottom:20px;}
  .progress-fill{height:100%;background:linear-gradient(90deg,#8A6F30,#C9A84C);border-radius:2px;transition:width 0.4s ease;}
`;

// ============================================================
// HELPERS
// ============================================================
function fmt(t){
  return(t||"")
    .replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>")
    .replace(/\[RESEARCH SUPPORTED\]/g,'<span class="cr">[RESEARCH SUPPORTED]</span>')
    .replace(/\[TRADITIONAL WISDOM\]/g,'<span class="ct">[TRADITIONAL WISDOM]</span>')
    .replace(/\[MEDICAL CONSENSUS\]/g,'<span class="cc">[MEDICAL CONSENSUS]</span>')
    .replace(/\[PUBMED\]/g,'<span class="cr">[PUBMED]</span>')
    .replace(/\[WHO\]/g,'<span class="cc">[WHO]</span>')
    .replace(/(https?:\/\/[^\s<>"]+)/g,'<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/\n/g,"<br/>");
}

function ps(text,heading){
  if(!text)return null;
  const p=[
    new RegExp(`(?:^|\\n)#{0,3}\\s*${heading}:\\s*\\n([\\s\\S]*?)(?=\\n#{0,3}\\s*[A-Z][A-Z ]{2,}:|$)`,"i"),
    new RegExp(`\\*\\*${heading}\\*\\*:?\\s*\\n([\\s\\S]*?)(?=\\*\\*[A-Z]|$)`,"i"),
    new RegExp(`${heading}[:\\s]+([\\s\\S]{30,1200}?)(?=\\n\\n[A-Z]|\\n[A-Z]{4,}:|$)`,"i"),
  ];
  for(const r of p){const m=text.match(r);if(m?.[1]?.trim())return m[1].trim();}
  return null;
}

// ============================================================
// ERI API
// ============================================================
async function callERI({system,messages,onToken,onDone,onError,live=false}){
  const sys=ERI_CORE+(system?"\n\n"+system:"");
  const body={model:"claude-sonnet-4-6",max_tokens:1000,stream:!live,system:sys,messages};
  if(live)body.tools=[{type:"web_search_20250305",name:"web_search"}];
  try{
    const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","anthropic-version":"2023-06-01"},body:JSON.stringify(body)});
    if(!r.ok)throw new Error(`ERI ${r.status}`);
    if(live){const d=await r.json();const t=d.content?.filter(b=>b.type==="text").map(b=>b.text).join("")||"";onToken?.(t);onDone?.(t);return;}
    const rd=r.body.getReader();const dc=new TextDecoder();let full="";
    while(true){const{done,value}=await rd.read();if(done)break;
      for(const ln of dc.decode(value).split("\n")){if(!ln.startsWith("data:"))continue;
        try{const j=JSON.parse(ln.slice(5));if(j.type==="content_block_delta"&&j.delta?.text){full+=j.delta.text;onToken?.(full);}}catch{}}}
    onDone?.(full);
  }catch(e){
    try{const b2={model:"claude-sonnet-4-6",max_tokens:1000,system:sys,messages};const r2=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(b2)});const d=await r2.json();const t=d.content?.filter(b=>b.type==="text").map(b=>b.text).join("")||"";onToken?.(t);onDone?.(t);}
    catch(e2){onError?.(e2.message);}
  }
}

// ============================================================
// ORB
// ============================================================
function Orb({size=88,active=false,mode="idle"}){
  const cm={idle:{c:"#C9A84C",r:"#8A6F30",g:"rgba(201,168,76,0.15)"},scanning:{c:"#4A90E2",r:"#2563EB",g:"rgba(74,144,226,0.2)"},safe:{c:"#2ECC71",r:"#27AE60",g:"rgba(46,204,113,0.2)"},warn:{c:"#F39C12",r:"#E67E22",g:"rgba(243,156,18,0.2)"},toxic:{c:"#E74C3C",r:"#C0392B",g:"rgba(231,76,60,0.2)"},red:{c:"#E74C3C",r:"#C0392B",g:"rgba(231,76,60,0.2)"}};
  const{c,r,g}=cm[mode]||cm.idle;
  return(
    <div style={{position:"relative",width:size,height:size,margin:"0 auto",flexShrink:0}}>
      <div style={{position:"absolute",inset:-10,borderRadius:"50%",border:`1px solid ${r}22`,animation:active?"spin 8s linear infinite":"none"}}/>
      <div style={{position:"absolute",inset:-5,borderRadius:"50%",border:`1px solid ${r}44`,animation:active?"spin 5s linear infinite reverse":"none"}}/>
      <div style={{width:"100%",height:"100%",borderRadius:"50%",background:`radial-gradient(circle at 35% 35%,${c}CC,${c}44 50%,${r}22)`,boxShadow:`0 0 ${active?44:18}px ${g},inset 0 0 16px ${r}33`,animation:"orbPulse 3s ease-in-out infinite",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",position:"relative"}}>
        <div style={{fontFamily:DS.f.disp,fontSize:size*0.24,color:"#050507",fontWeight:900,opacity:0.85,userSelect:"none",letterSpacing:"0.02em"}}>ERI</div>
        {active&&<div style={{position:"absolute",left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${c},transparent)`,animation:"scanLine 1.5s linear infinite"}}/>}
      </div>
    </div>
  );
}

// ============================================================
// ONBOARDING
// ============================================================
function Onboarding({onDone}){
  const steps=[
    {f:"name",label:"What should we call you?",type:"text",ph:"Your name or alias"},
    {f:"age",label:"Your age?",type:"number",ph:"e.g. 34"},
    {f:"sex",label:"Biological sex?",type:"select",opts:["male","female","other"]},
    {f:"country",label:"Your country or region?",type:"text",ph:"e.g. Eritrea, Nigeria, Brazil, Ethiopia"},
    {f:"faith",label:"Faith tradition?",type:"select",opts:["none","christian","muslim","jewish","hindu","buddhist","other"]},
    {f:"goals",label:"Primary health goal?",type:"text",ph:"e.g. fat loss, longevity, muscle, reverse diabetes"},
    {f:"conditions",label:"Health conditions?",type:"text",ph:"e.g. none, hypertension, prediabetes"},
    {f:"dietary",label:"Dietary approach?",type:"select",opts:["no preference","ancestral","carnivore","plant-based","keto","paleo","mediterranean","halal","kosher"]},
  ];
  const[step,setStep]=useState(0);
  const[p,setP]=useState({name:"",age:"",sex:"male",country:"",faith:"none",goals:"",conditions:"",dietary:"no preference"});
  const cur=steps[step];const last=step===steps.length-1;
  const go=()=>{if(last)onDone(p);else setStep(s=>s+1);};
  const inp={width:"100%",background:DS.c.obs,border:`1px solid ${DS.c.border}`,borderRadius:8,padding:"13px 17px",fontFamily:DS.f.body,fontSize:"1rem",color:DS.c.ice,marginTop:10};
  return(
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20}}>
      <Orb size={62} active mode="idle"/>
      <div style={{height:18}}/>
      <div style={{fontFamily:DS.f.disp,fontSize:"1.4rem",fontWeight:900,marginBottom:4}} className="gs">SETMEFREE</div>
      <div style={{fontFamily:DS.f.mono,fontSize:"0.5rem",letterSpacing:"0.35em",color:DS.c.gdim,marginBottom:32}}>ERI INITIALIZATION</div>
      <div style={{display:"flex",gap:5,marginBottom:30}}>{steps.map((_,i)=><div key={i} style={{width:i===step?22:7,height:3,borderRadius:2,background:i<step?DS.c.gold:i===step?DS.c.glow:DS.c.border,transition:"all 0.3s"}}/>)}</div>
      <div className="ob" key={step} style={{width:"100%",maxWidth:400,textAlign:"center"}}>
        <div style={{fontFamily:DS.f.body,fontSize:"1.1rem",fontWeight:500}}>{cur.label}</div>
        <div style={{fontFamily:DS.f.mono,fontSize:"0.48rem",color:DS.c.ghost,letterSpacing:"0.2em",marginTop:3,marginBottom:8}}>{step+1}/{steps.length}</div>
        {cur.type==="select"
          ?<select style={{...inp,appearance:"none"}} value={p[cur.f]} onChange={e=>setP(x=>({...x,[cur.f]:e.target.value}))}>{cur.opts.map(o=><option key={o} value={o}>{o.charAt(0).toUpperCase()+o.slice(1)}</option>)}</select>
          :<input style={inp} type={cur.type} placeholder={cur.ph} value={p[cur.f]} onChange={e=>setP(x=>({...x,[cur.f]:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&go()} autoFocus/>
        }
        <button onClick={go} style={{marginTop:16,width:"100%",background:`linear-gradient(135deg,${DS.c.gold}CC,${DS.c.gdim})`,border:"none",borderRadius:8,padding:"13px",fontFamily:DS.f.mono,fontSize:"0.68rem",letterSpacing:"0.18em",color:DS.c.void,fontWeight:700,cursor:"pointer"}}>
          {last?"INITIALIZE ERI →":"CONTINUE →"}
        </button>
        {step>0&&<button onClick={()=>setStep(s=>s-1)} style={{marginTop:8,background:"none",border:"none",fontFamily:DS.f.mono,fontSize:"0.56rem",color:DS.c.ghost,cursor:"pointer"}}>← BACK</button>}
      </div>
    </div>
  );
}

// ============================================================
// NAV
// ============================================================
const NAV=[{id:"home",icon:"◉",label:"HOME"},{id:"scanner",icon:"◎",label:"SCAN"},{id:"redpill",icon:"⬡",label:"RED PILL"},{id:"neochat",icon:"◈",label:"CHAT"},{id:"lifeplanner",icon:"◇",label:"PLAN"},{id:"library",icon:"▣",label:"LIBRARY"},{id:"habits",icon:"◆",label:"HABITS"}];
function NavBar({cur,setCur,profile}){
  return(
    <>
      <nav className="dn" style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:"#050507EE",borderBottom:`1px solid ${DS.c.border}`,backdropFilter:"blur(20px)",display:"none"}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"0 20px",display:"flex",alignItems:"center",justifyContent:"space-between",height:54}}>
          <div onClick={()=>setCur("home")} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:9}}>
            <div style={{width:26,height:26,borderRadius:"50%",background:`radial-gradient(circle at 35% 35%,${DS.c.gold}CC,${DS.c.gdim}44)`,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{fontFamily:DS.f.disp,fontSize:8,color:"#050507",fontWeight:900}}>ERI</span>
            </div>
            <span style={{fontFamily:DS.f.disp,fontSize:"0.82rem",fontWeight:700,letterSpacing:"0.15em",color:DS.c.gold}}>SETMEFREE</span>
          </div>
          <div style={{display:"flex",gap:2}}>{NAV.filter(n=>n.id!=="home").map(n=>(
            <button key={n.id} onClick={()=>setCur(n.id)} style={{background:"none",border:"none",borderBottom:`2px solid ${cur===n.id?DS.c.gold:"transparent"}`,padding:"6px 11px",fontFamily:DS.f.mono,fontSize:"0.56rem",letterSpacing:"0.1em",color:cur===n.id?DS.c.gold:DS.c.silver,cursor:"pointer",transition:"all 0.2s",marginBottom:-1,display:"flex",alignItems:"center",gap:4}}>
              <span>{n.icon}</span><span>{n.label}</span>
            </button>
          ))}</div>
          <div style={{display:"flex",alignItems:"center",gap:8,fontFamily:DS.f.mono,fontSize:"0.56rem",color:DS.c.silver}}>
            <span className="ld"/>{profile?.name?profile.name.toUpperCase():"SOVEREIGN"}
          </div>
        </div>
      </nav>
      <div className="bn">{NAV.map(n=>(
        <button key={n.id} className={`bb${cur===n.id?" on":""}`} onClick={()=>setCur(n.id)} style={{color:cur===n.id?DS.c.gold:DS.c.ghost}}>
          <span className="bi" style={{color:cur===n.id?DS.c.gold:DS.c.ghost}}>{n.icon}</span>
          <span className="bl">{n.label}</span>
        </button>
      ))}</div>
    </>
  );
}

// ============================================================
// HOME
// ============================================================
function Home({setCur,profile}){
  const tiles=[
    {id:"scanner",icon:"◎",title:"UNIVERSAL SCANNER",sub:"Banana to bioweapon — full species intelligence, crime connections, influencer evidence, life protocol. One scan.",accent:DS.c.blue},
    {id:"redpill",icon:"⬡",title:"RED PILL",sub:"Corporate capture maps. Real quotes with real links. Crime board. Follow the money.",accent:DS.c.toxic},
    {id:"neochat",icon:"◈",title:"NEO CHAT",sub:"8 ERI personalities. Doctor. Prophet. Warrior. Sage. Persistent memory.",accent:DS.c.gold},
    {id:"lifeplanner",icon:"◇",title:"LIFE PLAN",sub:"Deep health intake → day-by-day sovereign blueprint calibrated to your biology, culture, faith.",accent:DS.c.safe},
    {id:"library",icon:"▣",title:"TRUTH LIBRARY",sub:"Every scan saved. Searchable. Your personal sovereign knowledge base.",accent:DS.c.purple},
    {id:"habits",icon:"◆",title:"HABIT STREAKS",sub:"Daily protocol adherence. 7-day visual. Streak counters.",accent:"#F59E0B"},
  ];
  return(
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"80px 20px 40px"}}>
      <div style={{textAlign:"center",marginBottom:42}} className="fu">
        <Orb size={80} active mode="idle"/>
        <div style={{height:20}}/>
        <div style={{fontFamily:DS.f.mono,fontSize:"0.52rem",letterSpacing:"0.4em",color:DS.c.gdim,marginBottom:10}}>SOVEREIGN TRUTH OPERATING SYSTEM</div>
        <h1 style={{fontFamily:DS.f.disp,fontSize:"clamp(2rem,6vw,3.6rem)",fontWeight:900,letterSpacing:"0.05em",lineHeight:1.1,marginBottom:10}}>
          <span className="gs">SETMEFREE</span>
        </h1>
        <div style={{fontFamily:DS.f.mono,fontSize:"0.56rem",color:DS.c.gdim,letterSpacing:"0.2em",marginBottom:12}}>POWERED BY <span style={{color:DS.c.gold}}>ERI</span> — EVIDENCE · ROOTS · INTELLIGENCE</div>
        {profile?.name&&<div style={{fontFamily:DS.f.body,fontSize:"0.85rem",color:DS.c.silver,marginBottom:6}}>Welcome back, <span style={{color:DS.c.gold}}>{profile.name}</span>.</div>}
        <p style={{fontFamily:DS.f.body,fontSize:"0.85rem",color:DS.c.silver,maxWidth:400,margin:"0 auto",lineHeight:1.7}}>
          Most apps tell you what is in your food.<br/>
          <span style={{color:DS.c.ice,fontWeight:500}}>SETMEFREE tells you who profits from you not knowing.</span>
        </p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(188px,1fr))",gap:10,width:"100%",maxWidth:860}}>
        {tiles.map((t,i)=>(
          <button key={t.id} onClick={()=>setCur(t.id)} className={`fu${Math.min(i+1,3)}`}
            style={{background:DS.c.vault,border:`1px solid ${DS.c.border}`,borderRadius:8,padding:"17px 14px",cursor:"pointer",textAlign:"left",transition:"all 0.25s",position:"relative",overflow:"hidden"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=t.accent+"55";e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 8px 28px ${t.accent}10`;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=DS.c.border;e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}>
            <div style={{fontSize:"1.2rem",color:t.accent,marginBottom:7,filter:`drop-shadow(0 0 5px ${t.accent}55)`}}>{t.icon}</div>
            <div style={{fontFamily:DS.f.mono,fontSize:"0.57rem",letterSpacing:"0.13em",color:t.accent,marginBottom:5,fontWeight:500}}>{t.title}</div>
            <div style={{fontFamily:DS.f.body,fontSize:"0.74rem",color:DS.c.silver,lineHeight:1.55,fontWeight:300}}>{t.sub}</div>
            <div style={{position:"absolute",top:0,right:0,width:30,height:30,background:`linear-gradient(225deg,${t.accent}18,transparent 60%)`}}/>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// UNIVERSAL SCANNER — full banana-to-blueprint flow
// All 7 dimensions: Species · Nutrition · Traditional · Research
// Corporate Capture · Influencer Links · Life Protocol
// ============================================================
const SCAN_TABS=["species","nutrition","traditional","research","capture","voices","protocol"];
const SCAN_TAB_LABELS={species:"SPECIES ◎",nutrition:"NUTRITION ⊕",traditional:"ROOTS ◉",research:"EVIDENCE ◇",capture:"CAPTURE ⬡",voices:"VOICES ◈",protocol:"PROTOCOL ◆"};

// The complete banana-level scan prompt
function buildScanPrompt(entity,profile,isImage,isCalorie){
  const pc=profile?`USER: ${profile.age||"?"}yo ${profile.sex||"?"}, ${profile.country||"?"}, faith:${profile.faith||"none"}, goals:${profile.goals||"?"}, conditions:${profile.conditions||"none"}, dietary:${profile.dietary||"?"}`:"No profile.";

  if(isCalorie)return`${pc}\n\nCALORIE SCAN of this food image:\n\nCALORIE COUNT:\nTotal calories for portion shown. Range min-max, central estimate. Confidence: HIGH/MEDIUM/LOW.\n\nMACRONUTRIENTS:\nProtein: Xg | Carbs: Xg (Sugar: Xg, Fiber: Xg) | Fat: Xg (Sat: Xg)\n\nMICRONUTRIENTS:\nTop 8 micronutrients with % daily value.\n\nGLYCEMIC INDEX:\nGI number and blood sugar impact.\n\nPROCESSING SCORE:\n1-10 scale (1=whole food, 10=ultra-processed). Specific reason.\n\nHARMFUL INGREDIENTS:\nSeed oils, artificial colors, HFCS, MSG, preservatives — flag each one found.\n\nANCESTRAL ASSESSMENT:\nHow this compares to what human ancestors in this user's region ate. [TRADITIONAL WISDOM]\n\nPERSONALIZED VERDICT:\nEAT FREELY / LIMIT / AVOID — exact reason for THIS user's profile.\n\nVERDICT:\nSAFE or CAUTION or AVOID. One word then one sentence.`;

  return`${pc}\n\nENTITY TO ANALYZE: "${entity||"image uploaded"}"\n\nRespond with ALL sections below. For each section be exhaustive — this is the full truth, not a summary.\n\nSPECIES INTELLIGENCE:\nScientific name (genus, species, family). Confidence %. All common names across every language and culture on Earth. ALL varieties and subspecies known globally. Geographic origin — exact continent, region, historical spread. Cultural significance across Africa, Americas, Asia, Middle East, Europe, Pacific, indigenous traditions. Historical timeline — when first cultivated, how it spread. What makes each variety distinct. Zero misidentification — if uncertain list all possibilities with confidence percentages.\n\nNUTRITIONAL PROFILE:\nComplete macro/micro per 100g. Calories, protein, carbs (sugar, fiber), fat (sat, unsat). All vitamins, minerals, phytonutrients. GI index. Bioavailability factors. How preparation method changes nutrition. Raw vs cooked vs fermented differences. [RESEARCH SUPPORTED]\n\nTRADITIONAL & ANCESTRAL WISDOM:\nHow every major culture has used this substance across history. Africa: specific countries, traditions, preparations. Americas: indigenous and modern uses. Asia: specific countries, traditional medicine applications. Middle East: Islamic medicine, historical use. Europe: historical and folk medicine. Pacific: indigenous knowledge. Faith traditions that incorporate it. Ceremonial, medicinal, nutritional roles. [TRADITIONAL WISDOM]\n\nMODERN RESEARCH & EVIDENCE:\nLatest peer-reviewed findings. Specific studies with journal names where possible. What the research actually shows vs what mainstream claims. Conflicting studies — present both sides. Mechanisms of action if known. [RESEARCH SUPPORTED] [PUBMED] [WHO]\nSafety: toxicity thresholds, allergens, drug interactions, dangerous look-alikes, contraindications, safe dosage ranges.\n\nCORPORATE CAPTURE ANALYSIS:\nWho controls the commercial supply chain of this substance globally. Which corporations dominate production, distribution, processing. What financial interests shape the mainstream narrative about this entity — follow the money precisely. Specific companies, revenue figures where known, lobbying activity, regulatory relationships. How has commercialization changed this substance from its natural state. What has been suppressed or de-emphasized by commercial interests and why. If synthetic versions exist: compare to natural, who profits from the synthetic.\n\nINFLUENCER & EXPERT VOICES (DOCUMENTED WITH LINKS):\nFor each of these truth-tellers, if they have a DOCUMENTED position on THIS specific entity, provide: their exact stance, WHERE they said it (podcast episode name + number, tweet date, article title, YouTube video title, broadcast name), and the platform URL or search term to find it. Include approximate date.\n- RFK Jr. (environmental toxins, food safety)\n- Joe Rogan (JRE podcast — specific episode if known)\n- Dr. Barbara O'Neill (natural medicine lectures)\n- Dr. Peter McCullough (cardiology, metabolic health)\n- Dr. Rhonda Patrick (FoundMyFitness — specific episode if known)\n- Paul Saladino (carnivore, ancestral diet)\n- Dr. William Li (Eat to Beat Disease research)\n- Dr. Zach Bush (microbiome, soil health)\n- Gary Brecka (genetics, methylation)\n- Dr. Bret Weinstein (DarkHorse podcast — episode if known)\n- Dr. Shanna Swan (endocrine disruption research)\n- Jordan Peterson (diet experience)\n- Andrew Tate (health philosophy)\nOnly include those with documented positions on THIS entity. If none documented, say "No known documented position on this specific entity." Do NOT fabricate. For each voice included, mark platform: [PODCAST] [TWITTER/X] [YOUTUBE] [ARTICLE] [STUDY] [BROADCAST]\n\nLIFE PROTOCOL FOR THIS USER:\nPersonalized sovereign protocol for the user profile above:\n- How much, how often, what preparation method, what time of day\n- What to combine it with and what NOT to combine\n- Faith-aligned timing if applicable (fasting windows, religious calendars)\n- Any contraindications for their stated conditions\n- How their country/region traditionally uses this and whether that tradition is optimal\n- What ERI recommends vs what mainstream says and why they differ if they do\n\nVERDICT:\nSAFE or CAUTION or TOXIC — one word. Then one paragraph truth summary.\n\nNo filler. Maximum density. Every section complete.`;
}

function Scanner(){
  const{profile}=useProfile();
  const online=useOnline();
  const[mode,setMode]=useState("text");
  const[query,setQuery]=useState("");
  const[imgData,setImgData]=useState(null);
  const[imgPrev,setImgPrev]=useState(null);
  const[phase,setPhase]=useState("idle");
  const[orbMode,setOrbMode]=useState("idle");
  const[tab,setTab]=useState("species");
  const[results,setResults]=useState(null);
  const[stream,setStream]=useState("");
  const[err,setErr]=useState(null);
  const[live,setLive]=useState(true);
  const fileRef=useRef(null);

  const handleFile=(e)=>{
    const f=e.target.files?.[0];if(!f)return;
    const r=new FileReader();
    r.onload=(ev)=>{const b64=ev.target.result.split(",")[1];setImgData({data:b64,type:f.type});setImgPrev(ev.target.result);setQuery(f.name.replace(/\.[^.]+$/,"").replace(/[-_]/g," "));};
    r.readAsDataURL(f);
  };

  const scan=async()=>{
    if(phase==="scanning")return;
    if(mode==="text"&&!query.trim()){setErr("Enter something to scan.");return;}
    if((mode==="image"||mode==="calorie")&&!imgData){setErr("Upload an image first.");return;}
    setPhase("scanning");setOrbMode("scanning");setResults(null);setStream("");setErr(null);

    const promptText=buildScanPrompt(query,profile,mode==="image",mode==="calorie");
    const messages=imgData&&mode!=="text"
      ?[{role:"user",content:[{type:"image",source:{type:"base64",media_type:imgData.type,data:imgData.data}},{type:"text",text:promptText}]}]
      :[{role:"user",content:promptText}];

    let final="";
    await callERI({
      messages,live:live&&mode==="text",
      onToken:(t)=>{final=t;setStream(t);},
      onDone:(t)=>{
        final=t;
        const entity=imgData?`Image: ${query||"uploaded photo"}`:query;
        const r={
          entity,ts:Date.now(),mode,raw:t,
          species:ps(t,"SPECIES INTELLIGENCE")||ps(t,"IDENTIFICATION")||t.split("\n").slice(0,6).join("\n"),
          nutrition:ps(t,"NUTRITIONAL PROFILE")||ps(t,"MACRONUTRIENTS")||ps(t,"CALORIE COUNT")||"",
          traditional:ps(t,"TRADITIONAL")||ps(t,"ANCESTRAL")||"",
          research:ps(t,"MODERN RESEARCH")||ps(t,"EVIDENCE")||"",
          capture:ps(t,"CORPORATE CAPTURE")||"",
          voices:ps(t,"INFLUENCER")||ps(t,"EXPERT VOICES")||"",
          protocol:ps(t,"LIFE PROTOCOL")||ps(t,"PERSONALIZED VERDICT")||ps(t,"RECOMMENDATION")||"",
          verdictRaw:ps(t,"VERDICT")||"CAUTION",
        };
        const vrd=r.verdictRaw.toUpperCase().includes("SAFE")&&!r.verdictRaw.toUpperCase().includes("UNSAFE")?"SAFE":r.verdictRaw.toUpperCase().includes("TOXIC")||r.verdictRaw.toUpperCase().includes("AVOID")?"TOXIC":"CAUTION";
        r.verdict=vrd;
        setResults(r);setPhase("done");
        setOrbMode(vrd==="SAFE"?"safe":vrd==="TOXIC"?"toxic":"warn");
        setTab(mode==="calorie"?"nutrition":"species");
        const hist=STORE.get("smf_hist")||[];hist.unshift(r);STORE.set("smf_hist",hist.slice(0,50));
      },
      onError:(e)=>{setErr("ERI offline: "+e);setPhase("idle");setOrbMode("idle");}
    });
  };

  const vc=results?{SAFE:DS.c.safe,CAUTION:DS.c.warn,TOXIC:DS.c.toxic}[results.verdict]:DS.c.gold;

  const getTab=(t)=>{
    if(!results)return null;
    const map={species:results.species,nutrition:results.nutrition,traditional:results.traditional,research:results.research,capture:results.capture,voices:results.voices,protocol:results.protocol};
    return map[t]||results.raw||"No data in this section.";
  };

  const tabs=mode==="calorie"?["nutrition","traditional","capture","protocol"]:SCAN_TABS;

  return(
    <div style={{maxWidth:820,margin:"0 auto",padding:20}}>
      {!online&&<div style={{background:DS.c.toxic,color:"#fff",textAlign:"center",padding:"5px",fontFamily:DS.f.mono,fontSize:"0.58rem",borderRadius:6,marginBottom:10}}>OFFLINE — Cached data only</div>}
      <div style={{textAlign:"center",marginBottom:20}}>
        <Orb size={58} active={phase==="scanning"} mode={orbMode}/>
        <div style={{height:12}}/>
        <div style={{fontFamily:DS.f.mono,fontSize:"0.5rem",letterSpacing:"0.28em",color:DS.c.gdim,marginBottom:4}}>ERI UNIVERSAL SCANNER</div>
        <h2 style={{fontFamily:DS.f.disp,fontSize:"1.35rem",fontWeight:700}}>Identify Anything on Earth</h2>
        <p style={{fontFamily:DS.f.body,fontSize:"0.76rem",color:DS.c.silver,marginTop:4}}>Species · Corporate Capture · Real Influencer Sources · Life Protocol</p>
      </div>

      {/* Mode selector */}
      <div style={{display:"flex",gap:6,marginBottom:12}}>
        {[{id:"text",icon:"◎",label:"TEXT"},{id:"image",icon:"◈",label:"IMAGE"},{id:"calorie",icon:"⊕",label:"CALORIES"}].map(m=>(
          <button key={m.id} onClick={()=>{setMode(m.id);setImgData(null);setImgPrev(null);setResults(null);setStream("");setPhase("idle");setOrbMode("idle");}}
            style={{flex:1,background:mode===m.id?`${DS.c.gold}18`:DS.c.vault,border:`1px solid ${mode===m.id?DS.c.gdim:DS.c.border}`,borderRadius:6,padding:"8px 4px",fontFamily:DS.f.mono,fontSize:"0.52rem",letterSpacing:"0.08em",color:mode===m.id?DS.c.gold:DS.c.silver,cursor:"pointer",transition:"all 0.2s",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
            <span>{m.icon}</span><span>{m.label}</span>
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{background:DS.c.vault,border:`1px solid ${DS.c.border}`,borderRadius:8,padding:16,marginBottom:14}}>
        {imgPrev&&(
          <div style={{marginBottom:12,position:"relative"}}>
            <img src={imgPrev} alt="scan" style={{maxWidth:"100%",maxHeight:180,borderRadius:6,border:`1px solid ${DS.c.border}`,objectFit:"contain",display:"block"}}/>
            <button onClick={()=>{setImgData(null);setImgPrev(null);setQuery("");}} style={{position:"absolute",top:5,right:5,background:"rgba(5,5,7,0.9)",border:`1px solid ${DS.c.border}`,borderRadius:4,padding:"2px 7px",fontFamily:DS.f.mono,fontSize:"0.48rem",color:DS.c.silver,cursor:"pointer"}}>✕</button>
          </div>
        )}
        <div style={{display:"flex",gap:9,flexWrap:"wrap"}}>
          {mode==="text"
            ?<input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==="Enter"&&scan()}
              placeholder="Enter food, plant, supplement, chemical, compound…"
              style={{flex:1,minWidth:150,background:DS.c.obs,border:`1px solid ${DS.c.border}`,borderRadius:6,padding:"10px 13px",fontFamily:DS.f.body,fontSize:"0.85rem",color:DS.c.ice}}/>
            :<button onClick={()=>fileRef.current?.click()}
              style={{flex:1,background:DS.c.obs,border:`2px dashed ${imgData?DS.c.gold:DS.c.border}`,borderRadius:6,padding:"13px",fontFamily:DS.f.mono,fontSize:"0.6rem",color:imgData?DS.c.gold:DS.c.ghost,cursor:"pointer",letterSpacing:"0.1em",textAlign:"center"}}>
              {mode==="calorie"?imgData?"✓ Photo ready for calorie scan":"⊕ Upload food photo for calorie analysis":imgData?`✓ Image loaded`:"◈ Upload image to identify"}
            </button>
          }
          <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleFile} style={{display:"none"}}/>
          <button onClick={scan} disabled={phase==="scanning"} style={{background:phase==="scanning"?DS.c.chamber:`linear-gradient(135deg,${DS.c.gold}CC,${DS.c.gdim})`,border:"none",borderRadius:6,padding:"10px 18px",fontFamily:DS.f.mono,fontSize:"0.62rem",letterSpacing:"0.14em",color:phase==="scanning"?DS.c.silver:DS.c.void,fontWeight:700,cursor:phase==="scanning"?"not-allowed":"pointer",whiteSpace:"nowrap",minWidth:76}}>
            {phase==="scanning"?"SCANNING…":mode==="calorie"?"⊕ SCAN":"◎ SCAN"}
          </button>
        </div>

        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:10,paddingTop:9,borderTop:`1px solid ${DS.c.border}`}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            {live&&<span className="ld"/>}
            <span style={{fontFamily:DS.f.mono,fontSize:"0.5rem",color:live?DS.c.safe:DS.c.ghost}}>LIVE RESEARCH {live?"ON":"OFF"}</span>
            <span style={{fontFamily:DS.f.mono,fontSize:"0.44rem",color:DS.c.ghost}}>· PubMed · WHO</span>
          </div>
          <button onClick={()=>setLive(v=>!v)} style={{background:live?`${DS.c.safe}22`:"none",border:`1px solid ${live?DS.c.safe:DS.c.border}`,borderRadius:20,padding:"3px 9px",fontFamily:DS.f.mono,fontSize:"0.5rem",color:live?DS.c.safe:DS.c.ghost,cursor:"pointer"}}>{live?"ON":"OFF"}</button>
        </div>

        {mode==="text"&&(
          <div style={{marginTop:9,display:"flex",gap:6,flexWrap:"wrap"}}>
            {["Banana","Turmeric","Mashua","Baobab","Bitter kola","Moringa","Seed oils","Spirulina"].map(ex=>(
              <button key={ex} onClick={()=>setQuery(ex)} style={{background:"none",border:`1px solid ${DS.c.border}`,borderRadius:20,padding:"3px 10px",fontFamily:DS.f.mono,fontSize:"0.53rem",color:DS.c.ghost,cursor:"pointer",transition:"all 0.2s"}}
                onMouseEnter={e=>{e.currentTarget.style.color=DS.c.gold;e.currentTarget.style.borderColor=DS.c.gdim;}}
                onMouseLeave={e=>{e.currentTarget.style.color=DS.c.ghost;e.currentTarget.style.borderColor=DS.c.border;}}>{ex}</button>
            ))}
          </div>
        )}
      </div>

      {/* Streaming */}
      {phase==="scanning"&&(
        <div style={{background:DS.c.vault,border:`1px solid ${DS.c.bgold}`,borderRadius:8,padding:18,marginBottom:14}}>
          <div style={{fontFamily:DS.f.mono,fontSize:"0.55rem",letterSpacing:"0.16em",color:DS.c.gold,marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
            <span style={{animation:"blink 0.8s infinite"}}>◎</span>
            {live&&mode==="text"&&<span className="ld"/>}
            ERI ANALYZING — {(query||"IMAGE").toUpperCase()}
          </div>
          {stream
            ?<div className="rb sc" style={{whiteSpace:"pre-wrap",maxHeight:240,overflowY:"auto"}} dangerouslySetInnerHTML={{__html:fmt(stream)}}/>
            :<div style={{display:"flex",flexDirection:"column",gap:5}}>
              {["Identifying species across global botanical database","Tracing corporate ownership and supply chains","Searching PubMed, WHO, open-access journals","Cross-referencing influencer documented positions","Building personalized sovereign protocol"].map((s,i)=>(
                <div key={s} style={{fontFamily:DS.f.mono,fontSize:"0.57rem",color:DS.c.silver,display:"flex",alignItems:"center",gap:8,opacity:0,animation:`fadeUp 0.4s ease ${i*0.2}s both`}}>
                  <span style={{color:DS.c.gdim,animation:"blink 1s infinite"}}>▸</span>{s}…
                </div>
              ))}
            </div>
          }
        </div>
      )}

      {err&&<div style={{color:DS.c.toxic,fontFamily:DS.f.mono,fontSize:"0.67rem",padding:"10px 14px",background:DS.c.vault,borderRadius:8,border:`1px solid ${DS.c.toxic}33`,marginBottom:14}}>{err}</div>}

      {/* Results */}
      {phase==="done"&&results&&(
        <div className="fu">
          {/* Verdict banner */}
          <div style={{background:DS.c.vault,border:`1px solid ${vc}33`,borderRadius:"8px 8px 0 0",padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
            <div>
              <div style={{fontFamily:DS.f.mono,fontSize:"0.5rem",letterSpacing:"0.18em",color:DS.c.silver,marginBottom:2}}>ERI COMPLETE ANALYSIS</div>
              <div style={{fontFamily:DS.f.disp,fontSize:"1.05rem",fontWeight:700}}>{results.entity}</div>
            </div>
            <div style={{fontFamily:DS.f.disp,fontSize:"0.9rem",fontWeight:900,letterSpacing:"0.18em",padding:"6px 14px",border:`2px solid ${vc}`,borderRadius:4,color:vc,textShadow:`0 0 10px ${vc}`,animation:"vglow 2s ease infinite"}}>{results.verdict}</div>
          </div>

          {/* Tab bar */}
          <div style={{display:"flex",borderBottom:`1px solid ${DS.c.border}`,background:DS.c.vault,overflowX:"auto"}}>
            {tabs.map(t=>(
              <button key={t} onClick={()=>setTab(t)} style={{background:"none",border:"none",borderBottom:`2px solid ${tab===t?DS.c.gold:"transparent"}`,padding:"8px 11px",fontFamily:DS.f.mono,fontSize:"0.49rem",letterSpacing:"0.1em",color:tab===t?DS.c.gold:DS.c.silver,cursor:"pointer",whiteSpace:"nowrap",transition:"all 0.2s",marginBottom:-1}}>
                {SCAN_TAB_LABELS[t]}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div style={{background:DS.c.vault,border:`1px solid ${DS.c.border}`,borderTop:"none",borderRadius:"0 0 8px 8px",padding:20,minHeight:160}}>
            {/* Special rendering for VOICES tab — show as cards */}
            {tab==="voices"&&results.voices?(
              <div>
                <div style={{fontFamily:DS.f.mono,fontSize:"0.52rem",letterSpacing:"0.2em",color:DS.c.gdim,marginBottom:14}}>DOCUMENTED TRUTH-TELLER POSITIONS — Click links to verify</div>
                <div className="rb" style={{whiteSpace:"pre-wrap"}} dangerouslySetInnerHTML={{__html:fmt(results.voices)}}/>
              </div>
            ):(
              <div className="rb" style={{whiteSpace:"pre-wrap"}} dangerouslySetInnerHTML={{__html:fmt(getTab(tab)||"No data in this section.")}}/>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// RED PILL — Crime board + influencer links on every topic
// ============================================================
function RedPill(){
  const[topic,setTopic]=useState("");
  const[loading,setLoading]=useState(false);
  const[stream,setStream]=useState("");
  const[done,setDone]=useState(false);
  const[err,setErr]=useState(null);
  const[live,setLive]=useState(true);
  const[showBoard,setShowBoard]=useState(false);
  const online=useOnline();

  const hot=["Seed oils","Statins","Fluoride","GMO corn","Sunscreen","Aspartame","Glyphosate","mRNA vaccines","Ultra-processed food","Statin-cholesterol myth","Opioid epidemic","Sugar industry"];

  const run=async()=>{
    if(!topic.trim()||loading)return;
    setLoading(true);setStream("");setDone(false);setErr(null);
    const prompt=`TOPIC: "${topic}"\n\nCORPORATE CAPTURE MAP:\nExact companies funding research on this topic. Specific dollar amounts where known. Named individuals who moved between industry and regulatory bodies (revolving door). Dates, positions, salary data where documented.\n\nFINANCIAL CHAINS:\nMarket size of the industry. Revenue at stake. What financial model depends on the mainstream narrative about this topic.\n\nINFLUENCER VOICES WITH SOURCES:\nFor each of the following, provide their DOCUMENTED position on "${topic}" with exact source location:\n- RFK Jr.: [TWITTER/X] [ARTICLE] [PODCAST] [BROADCAST] — specific source + URL or search term\n- Joe Rogan: [JRE EPISODE NUMBER + TITLE if known] — guest name, episode, platform\n- Dr. Barbara O'Neill: [YOUTUBE/LECTURE title] — specific video or lecture name\n- Dr. Peter McCullough: [JOURNAL/PODCAST/BROADCAST] — specific source\n- Dr. Rhonda Patrick: [FOUNDMYFITNESS EPISODE] — specific episode if known\n- Paul Saladino: [YOUTUBE/TWITTER] — specific video or post\n- Dr. William Li: [STUDY/TALK/ARTICLE] — specific source\n- Dr. Bret Weinstein: [DARKHORSE EPISODE] — specific episode if known\n- Dr. Shanna Swan: [STUDY/BOOK/INTERVIEW] — specific source\n- Jordan Peterson: [TWITTER/INTERVIEW] — specific source\n- Gary Brecka: [PODCAST/YOUTUBE] — specific source\nFor each: state their position in one sentence. Then the source. Then mark: [PODCAST] [TWITTER/X] [YOUTUBE] [ARTICLE] [STUDY] [BROADCAST]\nIf a truth-teller has NO documented position on this specific topic, say so. Do NOT fabricate.\n\nANCESTRAL COUNTER-NARRATIVE:\nWhat traditional cultures and pre-industrial science knew about this topic that contradicts the mainstream. Specific civilizations, time periods, practices. [TRADITIONAL WISDOM]\n\nEVIDENCE WALL:\n5 specific primary sources challenging the mainstream narrative. Journal name, year, lead author where possible. PubMed ID if known. What the study found. [PUBMED] [WHO]\n\nCRIME BOARD:\nMap the connections in format:\n[Entity A] →funds→ [Entity B]\n[Entity B] →employs former→ [Entity C]\n[Entity C] →approves→ [Entity D]\nBe specific. Name the entities.\n\nTHE VERDICT:\n(a) Science-driven (b) Industry-captured (c) Contested (d) Actively suppressed — which is it and why. One direct paragraph. No hedging.`;

    await callERI({
      messages:[{role:"user",content:prompt}],live,
      onToken:t=>setStream(t),
      onDone:t=>{setStream(t);setDone(true);setLoading(false);},
      onError:e=>{setErr("ERI offline.");setLoading(false);}
    });
  };

  return(
    <div style={{maxWidth:820,margin:"0 auto",padding:20}}>
      <div style={{textAlign:"center",marginBottom:20}}>
        <div style={{width:58,height:58,borderRadius:"50%",background:`radial-gradient(circle at 35% 35%,${DS.c.toxic}CC,${DS.c.toxic}22)`,boxShadow:`0 0 24px ${DS.c.toxic}33`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",fontSize:"1.4rem"}}>⬡</div>
        <div style={{fontFamily:DS.f.mono,fontSize:"0.5rem",letterSpacing:"0.28em",color:"#8A2222",marginBottom:4}}>ERI INVESTIGATIVE ENGINE</div>
        <h2 style={{fontFamily:DS.f.disp,fontSize:"1.35rem",fontWeight:700}}>Red Pill Mode</h2>
        <p style={{fontFamily:DS.f.body,fontSize:"0.75rem",color:DS.c.silver,marginTop:4}}>Corporate capture. Real influencer quotes with real links. Follow the money. Crime board.</p>
      </div>
      <div style={{background:DS.c.vault,border:`1px solid ${DS.c.border}`,borderRadius:8,padding:16,marginBottom:14}}>
        <div style={{display:"flex",gap:9,flexWrap:"wrap"}}>
          <input value={topic} onChange={e=>setTopic(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!loading&&run()}
            placeholder="Enter topic: seed oils, statins, fluoride, GMOs, vaccines…"
            style={{flex:1,minWidth:150,background:DS.c.obs,border:`1px solid ${DS.c.border}`,borderRadius:6,padding:"10px 13px",fontFamily:DS.f.body,fontSize:"0.85rem",color:DS.c.ice}}/>
          <button onClick={run} disabled={loading||!topic.trim()} style={{background:loading?DS.c.chamber:`linear-gradient(135deg,${DS.c.toxic}CC,#C0392B)`,border:"none",borderRadius:6,padding:"10px 18px",fontFamily:DS.f.mono,fontSize:"0.62rem",letterSpacing:"0.14em",color:DS.c.ice,fontWeight:700,cursor:loading?"not-allowed":"pointer",whiteSpace:"nowrap"}}>
            {loading?"ANALYZING…":"⬡ EXPOSE"}
          </button>
        </div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:10,paddingTop:9,borderTop:`1px solid ${DS.c.border}`}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}>{live&&<span className="ld"/>}<span style={{fontFamily:DS.f.mono,fontSize:"0.5rem",color:live?DS.c.safe:DS.c.ghost}}>LIVE RESEARCH {live?"ON":"OFF"}</span></div>
          <div style={{display:"flex",gap:8}}>
            {(done||stream)&&<button onClick={()=>setShowBoard(v=>!v)} style={{background:showBoard?`${DS.c.toxic}22`:"none",border:`1px solid ${DS.c.toxic}55`,borderRadius:20,padding:"3px 9px",fontFamily:DS.f.mono,fontSize:"0.49rem",color:DS.c.toxic,cursor:"pointer"}}>⬡ CRIME BOARD</button>}
            <button onClick={()=>setLive(v=>!v)} style={{background:live?`${DS.c.safe}22`:"none",border:`1px solid ${live?DS.c.safe:DS.c.border}`,borderRadius:20,padding:"3px 9px",fontFamily:DS.f.mono,fontSize:"0.49rem",color:live?DS.c.safe:DS.c.ghost,cursor:"pointer"}}>{live?"ON":"OFF"}</button>
          </div>
        </div>
        <div style={{marginTop:9,display:"flex",gap:6,flexWrap:"wrap"}}>
          {hot.map(t=>(
            <button key={t} onClick={()=>setTopic(t)} style={{background:"none",border:`1px solid ${DS.c.border}`,borderRadius:20,padding:"3px 9px",fontFamily:DS.f.mono,fontSize:"0.51rem",color:DS.c.ghost,cursor:"pointer",transition:"all 0.2s"}}
              onMouseEnter={e=>{e.currentTarget.style.color=DS.c.toxic;e.currentTarget.style.borderColor=DS.c.toxic+"55";}}
              onMouseLeave={e=>{e.currentTarget.style.color=DS.c.ghost;e.currentTarget.style.borderColor=DS.c.border;}}>{t}</button>
          ))}
        </div>
      </div>

      {/* Crime board visual */}
      {showBoard&&stream&&(
        <div style={{background:DS.c.vault,border:`1px solid ${DS.c.toxic}44`,borderRadius:8,padding:16,marginBottom:14}} className="crime">
          <div style={{fontFamily:DS.f.mono,fontSize:"0.54rem",letterSpacing:"0.18em",color:DS.c.toxic,marginBottom:10}}>⬡ CRIME BOARD — {topic.toUpperCase()}</div>
          <div style={{fontFamily:DS.f.body,fontSize:"0.78rem",color:DS.c.silver,lineHeight:1.8}}>
            {(ps(stream,"CRIME BOARD")||"Crime board connections will appear here as ERI completes analysis.").split("\n").map((line,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                {line.includes("→")&&<span style={{color:DS.c.toxic,fontSize:"0.7rem"}}>⬡</span>}
                <span dangerouslySetInnerHTML={{__html:fmt(line)}}/>
              </div>
            ))}
          </div>
        </div>
      )}

      {err&&<div style={{color:DS.c.toxic,fontFamily:DS.f.mono,fontSize:"0.67rem",padding:"10px 14px",background:DS.c.vault,borderRadius:8,marginBottom:14}}>{err}</div>}
      {(loading||done)&&stream&&(
        <div style={{background:DS.c.vault,border:`1px solid ${DS.c.toxic}33`,borderRadius:8,padding:20,animation:"fadeUp 0.3s ease"}}>
          <div style={{fontFamily:DS.f.disp,fontSize:"0.78rem",color:DS.c.toxic,marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
            ⬡ EXPOSURE REPORT: {topic.toUpperCase()}
            {loading&&<span style={{fontFamily:DS.f.mono,fontSize:"0.46rem",color:DS.c.silver}}> · LIVE</span>}
          </div>
          <div className={`rb${loading?" sc":""}`} style={{whiteSpace:"pre-wrap"}} dangerouslySetInnerHTML={{__html:fmt(stream)}}/>
        </div>
      )}
    </div>
  );
}

// ============================================================
// NEO CHAT
// ============================================================
const PERS=[
  {id:"sovereign",name:"Sovereign",icon:"◈",color:DS.c.gold,desc:"Direct. Uncompromising. Truth without mercy.",sys:"ERI in Sovereign mode. Direct. No filler. Maximum citation discipline. Pure signal."},
  {id:"sage",name:"Sage",icon:"◇",color:DS.c.purple,desc:"Ancestral synthesis. Ten thousand years of wisdom.",sys:"ERI in Sage mode. Synthesizer of ancestral wisdom from all civilizations. [TRADITIONAL WISDOM] always."},
  {id:"warrior",name:"Warrior",icon:"◆",color:DS.c.toxic,desc:"Discipline. Fasting. Physical sovereignty.",sys:"ERI in Warrior mode. Physical sovereignty. Fasting science, hormesis, movement. Direct commands only."},
  {id:"healer",name:"Healer",icon:"◉",color:DS.c.safe,desc:"Natural medicine. Herbalism. Root protocols.",sys:"ERI in Healer mode. Natural medicine, herbalism, food-as-medicine. All world healing traditions."},
  {id:"prophet",name:"Prophet",icon:"✦",color:"#F59E0B",desc:"Faith-grounded. Scripture. Body as temple.",sys:"ERI in Prophet mode. Faith-grounded health counsel. Christian, Islamic, Jewish, Hindu, Buddhist health frameworks. No proselytizing."},
  {id:"strategist",name:"Strategist",icon:"⬡",color:DS.c.blue,desc:"Systems. Optimization. Life engineering.",sys:"ERI in Strategist mode. Protocols, feedback loops, measurable outcomes. 30/90/365-day frameworks."},
  {id:"mentor",name:"Mentor",icon:"◑",color:"#EC4899",desc:"Socratic. Pedagogical. Learn as you heal.",sys:"ERI in Mentor mode. Socratic method. Teach through questions. Invite deeper thinking after every answer."},
  {id:"companion",name:"Companion",icon:"○",color:"#6EE7B7",desc:"Present. Calm. Non-performative.",sys:"ERI in Companion mode. Present. Precise. No performance. No filler."},
];
function NeoChat(){
  const{profile}=useProfile();
  const[ap,setAp]=useState(PERS[0]);
  const[msgs,setMsgs]=useState(()=>STORE.get(`eri_chat_${PERS[0].id}`)||[]);
  const[input,setInput]=useState("");
  const[loading,setLoading]=useState(false);
  const[stream,setStream]=useState("");
  const endRef=useRef(null);
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"});},[msgs,stream]);
  const sw=(p)=>{setAp(p);setMsgs(STORE.get(`eri_chat_${p.id}`)||[]);setStream("");};
  const clr=()=>{STORE.del(`eri_chat_${ap.id}`);setMsgs([]);};
  const send=async()=>{
    if(!input.trim()||loading)return;
    const pc=profile?`[Profile: ${profile.age||"?"}yo ${profile.sex||""}, ${profile.country||""}, faith:${profile.faith||"none"}, goals:${profile.goals||""}]`:"";
    const um={role:"user",content:input.trim()};
    const nm=[...msgs,um];setMsgs(nm);setInput("");setLoading(true);setStream("");
    await callERI({system:`${ap.sys}\n${pc}`,messages:nm.map(m=>({role:m.role,content:m.content})),
      onToken:t=>setStream(t),
      onDone:t=>{const f=[...nm,{role:"assistant",content:t}];setMsgs(f);STORE.set(`eri_chat_${ap.id}`,f.slice(-40));setStream("");setLoading(false);},
      onError:()=>{setLoading(false);setStream("");}
    });
  };
  return(
    <div style={{maxWidth:900,margin:"0 auto",padding:20}}>
      <div style={{textAlign:"center",marginBottom:16}}>
        <div style={{fontFamily:DS.f.mono,fontSize:"0.5rem",letterSpacing:"0.28em",color:DS.c.gdim,marginBottom:4}}>ERI PERSONALITIES</div>
        <h2 style={{fontFamily:DS.f.disp,fontSize:"1.35rem",fontWeight:700}}>Neo Chat</h2>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(85px,1fr))",gap:6,marginBottom:12}}>
        {PERS.map(p=>(
          <button key={p.id} onClick={()=>sw(p)} style={{background:ap.id===p.id?`${p.color}18`:DS.c.vault,border:`1px solid ${ap.id===p.id?p.color+"55":DS.c.border}`,borderRadius:6,padding:"8px 5px",cursor:"pointer",textAlign:"center",transition:"all 0.2s",position:"relative"}}>
            {(STORE.get(`eri_chat_${p.id}`)||[]).length>0&&<div style={{position:"absolute",top:3,right:3,width:4,height:4,borderRadius:"50%",background:p.color}}/>}
            <div style={{fontSize:"0.95rem",color:p.color,marginBottom:2}}>{p.icon}</div>
            <div style={{fontFamily:DS.f.mono,fontSize:"0.44rem",letterSpacing:"0.1em",color:ap.id===p.id?p.color:DS.c.silver}}>{p.name.toUpperCase()}</div>
          </button>
        ))}
      </div>
      <div style={{background:`${ap.color}0D`,border:`1px solid ${ap.color}33`,borderRadius:"8px 8px 0 0",padding:"9px 13px",display:"flex",alignItems:"center",gap:10}}>
        <span style={{fontSize:"1rem",color:ap.color}}>{ap.icon}</span>
        <div style={{flex:1}}>
          <div style={{fontFamily:DS.f.mono,fontSize:"0.56rem",letterSpacing:"0.1em",color:ap.color}}>{ap.name.toUpperCase()}</div>
          <div style={{fontFamily:DS.f.body,fontSize:"0.72rem",color:DS.c.silver,marginTop:1}}>{ap.desc}</div>
        </div>
        {msgs.length>0&&<button onClick={clr} style={{background:"none",border:`1px solid ${DS.c.border}`,borderRadius:4,padding:"3px 7px",fontFamily:DS.f.mono,fontSize:"0.46rem",color:DS.c.ghost,cursor:"pointer"}}>CLEAR</button>}
      </div>
      <div style={{background:DS.c.vault,border:`1px solid ${DS.c.border}`,borderTop:"none",height:330,display:"flex",flexDirection:"column"}}>
        <div style={{flex:1,overflowY:"auto",padding:"14px 14px 6px"}}>
          {msgs.length===0&&!stream&&(<div style={{height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8,opacity:0.35}}><span style={{fontSize:"1.7rem",color:ap.color}}>{ap.icon}</span><div style={{fontFamily:DS.f.mono,fontSize:"0.56rem",letterSpacing:"0.12em",color:DS.c.silver}}>ERI · {ap.name.toUpperCase()}</div></div>)}
          {msgs.map((m,i)=>(
            <div key={i} style={{marginBottom:11,display:"flex",flexDirection:m.role==="user"?"row-reverse":"row",gap:7}}>
              {m.role==="assistant"&&<div style={{width:22,height:22,borderRadius:"50%",background:`${ap.color}22`,border:`1px solid ${ap.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.62rem",flexShrink:0,color:ap.color}}>{ap.icon}</div>}
              <div style={{maxWidth:"78%",background:m.role==="user"?`${DS.c.gold}18`:DS.c.obs,border:`1px solid ${m.role==="user"?DS.c.bgold:DS.c.border}`,borderRadius:m.role==="user"?"11px 11px 2px 11px":"2px 11px 11px 11px",padding:"9px 12px",fontFamily:DS.f.body,fontSize:"0.81rem",lineHeight:1.7}}
                dangerouslySetInnerHTML={{__html:fmt(m.content)}}/>
            </div>
          ))}
          {loading&&stream&&(<div style={{marginBottom:11,display:"flex",gap:7}}><div style={{width:22,height:22,borderRadius:"50%",background:`${ap.color}22`,border:`1px solid ${ap.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.62rem",flexShrink:0,color:ap.color}}>{ap.icon}</div><div className="sc" style={{maxWidth:"78%",background:DS.c.obs,border:`1px solid ${DS.c.border}`,borderRadius:"2px 11px 11px 11px",padding:"9px 12px",fontFamily:DS.f.body,fontSize:"0.81rem",lineHeight:1.7}} dangerouslySetInnerHTML={{__html:fmt(stream)}}/></div>)}
          {loading&&!stream&&<div style={{display:"flex",gap:7,alignItems:"center"}}><div style={{width:22,height:22,borderRadius:"50%",background:`${ap.color}22`,display:"flex",alignItems:"center",justifyContent:"center",color:ap.color}}>{ap.icon}</div><div style={{display:"flex",gap:4}}>{[0,1,2].map(i=><div key={i} style={{width:5,height:5,borderRadius:"50%",background:ap.color,animation:`blink 1.2s ease ${i*0.2}s infinite`}}/>)}</div></div>}
          <div ref={endRef}/>
        </div>
        <div style={{borderTop:`1px solid ${DS.c.border}`,padding:"8px 12px",display:"flex",gap:7}}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()} placeholder={`Speak to ERI · ${ap.name}…`} style={{flex:1,background:DS.c.obs,border:`1px solid ${DS.c.border}`,borderRadius:6,padding:"8px 12px",fontFamily:DS.f.body,fontSize:"0.81rem",color:DS.c.ice}}/>
          <button onClick={send} disabled={loading||!input.trim()} style={{background:`${ap.color}CC`,border:"none",borderRadius:6,padding:"8px 14px",fontFamily:DS.f.mono,fontSize:"0.56rem",letterSpacing:"0.1em",color:DS.c.void,fontWeight:700,cursor:loading?"not-allowed":"pointer",opacity:loading?0.5:1}}>SEND</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// LIFE PLANNER — Deep health intake questionnaire
// then day-by-day sovereign blueprint
// ============================================================
const INTAKE_STEPS=[
  {id:"physical",title:"PHYSICAL BASELINE",icon:"◎",questions:[
    {f:"height",label:"Height",type:"text",ph:"e.g. 175cm or 5'9\""},
    {f:"weight",label:"Current weight",type:"text",ph:"e.g. 85kg or 187lbs"},
    {f:"body_type",label:"Body type",type:"select",opts:["unsure","ectomorph (naturally lean)","mesomorph (muscular build)","endomorph (stores fat easily)"]},
    {f:"muscle",label:"Current muscle level",type:"select",opts:["very little","below average","average","above average","athletic"]},
    {f:"fitness",label:"Current fitness level",type:"select",opts:["sedentary","lightly active","moderately active","very active","athlete"]},
  ]},
  {id:"health",title:"HEALTH STATUS",icon:"◉",questions:[
    {f:"conditions",label:"Diagnosed conditions",type:"text",ph:"e.g. hypertension, prediabetes, none"},
    {f:"medications",label:"Current medications",type:"text",ph:"e.g. metformin, statins, none"},
    {f:"pain",label:"Chronic pain or injuries",type:"text",ph:"e.g. lower back, knees, none"},
    {f:"energy",label:"Daily energy level",type:"select",opts:["very low","low","moderate","good","excellent"]},
    {f:"sleep_quality",label:"Sleep quality",type:"select",opts:["very poor","poor","fair","good","excellent"]},
    {f:"stress",label:"Stress level",type:"select",opts:["minimal","low","moderate","high","extreme"]},
  ]},
  {id:"lifestyle",title:"LIFESTYLE & CULTURE",icon:"◇",questions:[
    {f:"country",label:"Country / Region",type:"text",ph:"e.g. Ethiopia, Nigeria, Brazil, Philippines"},
    {f:"diet_current",label:"What you currently eat",type:"text",ph:"e.g. rice and stew daily, fast food, meat and potatoes"},
    {f:"food_access",label:"Food access",type:"select",opts:["limited (rural/poor access)","moderate","good (city/market access)","excellent"]},
    {f:"cook",label:"Do you cook at home?",type:"select",opts:["rarely","sometimes","most meals","all meals"]},
    {f:"work",label:"Work type",type:"select",opts:["desk/sedentary","mixed","physical/manual","athlete"]},
    {f:"schedule",label:"Daily schedule",type:"select",opts:["flexible","9-5 structured","shift work","irregular"]},
  ]},
  {id:"goals",title:"YOUR GOALS",icon:"◆",questions:[
    {f:"primary_goal",label:"Primary goal",type:"select",opts:["fat loss","muscle gain","strength","endurance","longevity","reverse disease","energy optimization","mental clarity","spiritual discipline","general health"]},
    {f:"goal_detail",label:"Be specific about your goal",type:"text",ph:"e.g. lose 20kg in 6 months, run a marathon, reverse prediabetes"},
    {f:"timeline",label:"Timeline",type:"select",opts:["1 month","3 months","6 months","1 year","2+ years","lifelong"]},
    {f:"obstacles",label:"Biggest obstacle",type:"text",ph:"e.g. no time, no money, no discipline, injury"},
    {f:"tried",label:"What you've already tried",type:"text",ph:"e.g. keto failed, gym for 2 months, nothing"},
  ]},
  {id:"spirit",title:"FAITH & SPIRIT",icon:"✦",questions:[
    {f:"faith",label:"Faith tradition",type:"select",opts:["none","christian","muslim","jewish","hindu","buddhist","other"]},
    {f:"fasting_exp",label:"Experience with fasting",type:"select",opts:["never fasted","tried briefly","fast occasionally","fast regularly","deep fasting practice"]},
    {f:"spiritual_goals",label:"Spiritual health goals",type:"text",ph:"e.g. clearer mind during prayer, body as temple, none"},
    {f:"motivation",label:"What drives you most",type:"text",ph:"e.g. my children, my faith, proving people wrong, survival"},
  ]},
];

function LifePlanner(){
  const{profile,setProfile}=useProfile();
  const[phase,setPhase]=useState("intake"); // intake | generating | done
  const[intakeStep,setIntakeStep]=useState(0);
  const[intake,setIntake]=useState({
    height:"",weight:"",body_type:"unsure",muscle:"average",fitness:"lightly active",
    conditions:"",medications:"",pain:"",energy:"moderate",sleep_quality:"fair",stress:"moderate",
    country:profile?.country||"",diet_current:"",food_access:"moderate",cook:"sometimes",work:"mixed",schedule:"9-5 structured",
    primary_goal:"fat loss",goal_detail:"",timeline:"3 months",obstacles:"",tried:"",
    faith:profile?.faith||"none",fasting_exp:"never fasted",spiritual_goals:"",motivation:"",
  });
  const[stream,setStream]=useState("");
  const[err,setErr]=useState(null);
  const[live,setLive]=useState(true);

  const cur=INTAKE_STEPS[intakeStep];
  const isLast=intakeStep===INTAKE_STEPS.length-1;

  const generate=async()=>{
    setPhase("generating");setStream("");setErr(null);
    const prompt=`You are ERI generating a precision sovereign life blueprint for this specific human.\n\nCOMPLETE PROFILE:\nHeight: ${intake.height} | Weight: ${intake.weight} | Body type: ${intake.body_type} | Muscle: ${intake.muscle} | Fitness: ${intake.fitness}\nConditions: ${intake.conditions} | Medications: ${intake.medications} | Pain: ${intake.pain}\nEnergy: ${intake.energy} | Sleep: ${intake.sleep_quality} | Stress: ${intake.stress}\nCountry/Region: ${intake.country} | Current diet: ${intake.diet_current} | Food access: ${intake.food_access} | Cooks: ${intake.cook}\nWork: ${intake.work} | Schedule: ${intake.schedule}\nPrimary goal: ${intake.primary_goal} | Specific: ${intake.goal_detail} | Timeline: ${intake.timeline}\nObstacles: ${intake.obstacles} | Already tried: ${intake.tried}\nFaith: ${intake.faith} | Fasting experience: ${intake.fasting_exp} | Spiritual goals: ${intake.spiritual_goals} | Motivation: ${intake.motivation}\n\nThis is not generic advice. Every output must be calibrated to THIS exact human.\n\nPHYSIOLOGICAL ANALYSIS:\nCalculate their approximate BMI. Estimate their TDEE (total daily energy expenditure) based on their data. Identify their key metabolic risks. Assess what their current diet is doing to their body. Be honest — if it is harming them, say so precisely. [MEDICAL CONSENSUS]\n\nWEEK 1 — DAY BY DAY (Day 1 through Day 7):\nFor EACH day, specify:\n• Wake time and morning protocol\n• First meal: exact foods available in their country/region, preparation method, amounts\n• Midday protocol and meal\n• Movement for the day: specific exercise, duration, intensity, alternatives if no equipment\n• Evening meal and protocol\n• Sleep protocol and target time\nBase foods on what is realistically available in their specific country and economic context. [TRADITIONAL WISDOM]\n\nNUTRITIONAL PROTOCOL:\nExact foods to prioritize — specific to their region and food access level. What to eliminate entirely. What to reduce. Meal timing. Caloric target if weight loss/gain is the goal. Macronutrient split for their goal. [RESEARCH SUPPORTED]\n\nFASTING PROTOCOL:\nOptimal fasting approach for their goal, fitness level, and faith. If they have faith: integrate religious fasting traditions precisely. Exact fasting windows. How to break the fast. What breaks a fast and what does not.\n\nMOVEMENT BLUEPRINT:\nExact exercise plan for their goal and current fitness level. If no gym: bodyweight alternatives. Progression week by week. Specific to their injury/pain points if any. Duration, frequency, intensity.\n\nSUPPLEMENT PROTOCOL:\nEvidence-based supplements for their specific goal and conditions. Traditional plant alternatives from their region where applicable. Exact dosages. Timing. Contraindications with their medications. Priority order 1-5. [RESEARCH SUPPORTED] [PUBMED]\n\nSLEEP & RECOVERY:\nSleep protocol calibrated to their current quality level and schedule. Specific improvements. Circadian alignment for their geographic region.\n\nMENTAL & SPIRITUAL PROTOCOL:\nPractices calibrated to their faith and motivation. Specific prayers, meditation, scripture references if applicable. How to maintain discipline when motivation drops. What to say to themselves on hard days.\n\nWEEKS 2-4 PROGRESSION:\nHow the protocol evolves. What should improve. What to adjust.\n\nMONTH 2-3 PROGRESSION:\nPhysiological adaptations expected. Protocol changes. Tests/metrics to track.\n\n30 / 60 / 90 DAY MILESTONES:\nDay 30: exact measurable outcomes\nDay 60: exact measurable outcomes\nDay 90: exact measurable outcomes\n\nRED FLAGS — GO TO A DOCTOR IMMEDIATELY IF:\nSymptoms specific to their conditions and protocol that require emergency medical care. Non-negotiable. [MEDICAL CONSENSUS]\n\nTHE HONEST TRUTH:\nWhat this person's current path leads to if they change nothing. What the sovereign path leads to if they follow this protocol. Direct. No comfort. Just truth.\n\nThis person's life can genuinely be changed by this protocol being correct. Precision is not optional.`;

    await callERI({
      messages:[{role:"user",content:prompt}],live,
      onToken:t=>setStream(t),
      onDone:t=>{setStream(t);setPhase("done");},
      onError:e=>{setErr("ERI offline.");setPhase("intake");}
    });
  };

  const inp={width:"100%",background:DS.c.obs,border:`1px solid ${DS.c.border}`,borderRadius:6,padding:"9px 12px",fontFamily:DS.f.body,fontSize:"0.82rem",color:DS.c.ice};
  const lbl={fontFamily:DS.f.mono,fontSize:"0.5rem",letterSpacing:"0.18em",color:DS.c.gdim,display:"block",marginBottom:4};

  if(phase==="generating"||phase==="done"){
    return(
      <div style={{maxWidth:820,margin:"0 auto",padding:20}}>
        <div style={{textAlign:"center",marginBottom:20}}>
          <Orb size={58} active={phase==="generating"} mode={phase==="done"?"safe":"scanning"}/>
          <div style={{height:12}}/>
          <div style={{fontFamily:DS.f.mono,fontSize:"0.5rem",letterSpacing:"0.28em",color:DS.c.gdim,marginBottom:4}}>ERI SOVEREIGN BLUEPRINT</div>
          <h2 style={{fontFamily:DS.f.disp,fontSize:"1.35rem",fontWeight:700}}>Your Life Protocol</h2>
        </div>
        {phase==="generating"&&!stream&&(
          <div style={{background:DS.c.vault,border:`1px solid ${DS.c.bgold}`,borderRadius:8,padding:20,marginBottom:14}}>
            {["Analyzing your complete physiological profile","Calculating metabolic baseline and TDEE","Building day-by-day Week 1 protocol","Sourcing traditional foods from your region","Calibrating fasting to your faith and goals","Assembling supplement protocol with dosages","Writing 90-day milestone roadmap"].map((s,i)=>(
              <div key={s} style={{fontFamily:DS.f.mono,fontSize:"0.57rem",color:DS.c.silver,display:"flex",alignItems:"center",gap:8,marginBottom:5,opacity:0,animation:`fadeUp 0.4s ease ${i*0.2}s both`}}>
                <span style={{color:DS.c.gdim,animation:"blink 1s infinite"}}>▸</span>{s}…
              </div>
            ))}
          </div>
        )}
        {(phase==="generating"||phase==="done")&&stream&&(
          <div style={{background:DS.c.vault,border:`1px solid ${DS.c.safe}33`,borderRadius:8,padding:20}}>
            <div style={{fontFamily:DS.f.disp,fontSize:"0.78rem",color:DS.c.safe,marginBottom:14,display:"flex",alignItems:"center",gap:8}}>
              ◇ ERI SOVEREIGN BLUEPRINT — {(intake.country||"GLOBAL").toUpperCase()} · {(intake.faith||"").toUpperCase()} · {intake.primary_goal?.toUpperCase()}
              {phase==="generating"&&<span style={{fontFamily:DS.f.mono,fontSize:"0.46rem",color:DS.c.silver}}> · STREAMING</span>}
            </div>
            <div className={`rb${phase==="generating"?" sc":""}`} style={{whiteSpace:"pre-wrap"}} dangerouslySetInnerHTML={{__html:fmt(stream)}}/>
          </div>
        )}
        {phase==="done"&&<button onClick={()=>{setPhase("intake");setStream("");setIntakeStep(0);}} style={{marginTop:14,background:"none",border:`1px solid ${DS.c.border}`,borderRadius:6,padding:"9px 18px",fontFamily:DS.f.mono,fontSize:"0.58rem",color:DS.c.silver,cursor:"pointer",display:"block",margin:"14px auto 0"}}>← NEW ASSESSMENT</button>}
      </div>
    );
  }

  return(
    <div style={{maxWidth:820,margin:"0 auto",padding:20}}>
      <div style={{textAlign:"center",marginBottom:22}}>
        <div style={{width:58,height:58,borderRadius:"50%",background:`radial-gradient(circle at 35% 35%,${DS.c.safe}CC,${DS.c.safe}22)`,boxShadow:`0 0 24px ${DS.c.safe}33`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",fontSize:"1.4rem"}}>◇</div>
        <div style={{fontFamily:DS.f.mono,fontSize:"0.5rem",letterSpacing:"0.28em",color:DS.c.gdim,marginBottom:4}}>ERI HEALTH ASSESSMENT</div>
        <h2 style={{fontFamily:DS.f.disp,fontSize:"1.35rem",fontWeight:700}}>Life Planner</h2>
        <p style={{fontFamily:DS.f.body,fontSize:"0.75rem",color:DS.c.silver,marginTop:4}}>Answer honestly. ERI designs your day-by-day sovereign blueprint from your real data.</p>
      </div>

      {/* Step progress */}
      <div style={{display:"flex",gap:8,marginBottom:20,alignItems:"center"}}>
        {INTAKE_STEPS.map((s,i)=>(
          <div key={s.id} onClick={()=>setIntakeStep(i)} style={{flex:1,cursor:"pointer"}}>
            <div style={{height:3,borderRadius:2,background:i<=intakeStep?DS.c.gold:DS.c.border,transition:"all 0.3s"}}/>
            <div style={{fontFamily:DS.f.mono,fontSize:"0.42rem",color:i===intakeStep?DS.c.gold:DS.c.ghost,letterSpacing:"0.1em",marginTop:4,textAlign:"center",display:"none"}}>{s.icon}</div>
          </div>
        ))}
      </div>

      {/* Current step */}
      <div key={cur.id} className="step-in" style={{background:DS.c.vault,border:`1px solid ${DS.c.border}`,borderRadius:8,padding:20,marginBottom:14}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}>
          <span style={{fontSize:"1.2rem",color:DS.c.gold}}>{cur.icon}</span>
          <div>
            <div style={{fontFamily:DS.f.mono,fontSize:"0.58rem",letterSpacing:"0.18em",color:DS.c.gold}}>{cur.title}</div>
            <div style={{fontFamily:DS.f.mono,fontSize:"0.46rem",color:DS.c.ghost,letterSpacing:"0.1em",marginTop:2}}>{intakeStep+1} of {INTAKE_STEPS.length}</div>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:12}}>
          {cur.questions.map(q=>(
            <div key={q.f}>
              <label style={lbl}>{q.label.toUpperCase()}</label>
              {q.type==="select"
                ?<select style={{...inp,appearance:"none"}} value={intake[q.f]||q.opts[0]} onChange={e=>setIntake(x=>({...x,[q.f]:e.target.value}))}>{q.opts.map(o=><option key={o} value={o}>{o.charAt(0).toUpperCase()+o.slice(1)}</option>)}</select>
                :<input style={inp} type={q.type||"text"} placeholder={q.ph} value={intake[q.f]||""} onChange={e=>setIntake(x=>({...x,[q.f]:e.target.value}))}/>
              }
            </div>
          ))}
        </div>
      </div>

      <div style={{display:"flex",gap:9}}>
        {intakeStep>0&&<button onClick={()=>setIntakeStep(s=>s-1)} style={{background:"none",border:`1px solid ${DS.c.border}`,borderRadius:6,padding:"11px 18px",fontFamily:DS.f.mono,fontSize:"0.58rem",color:DS.c.silver,cursor:"pointer"}}>← BACK</button>}
        {!isLast
          ?<button onClick={()=>setIntakeStep(s=>s+1)} style={{flex:1,background:`linear-gradient(135deg,${DS.c.gold}CC,${DS.c.gdim})`,border:"none",borderRadius:6,padding:"12px",fontFamily:DS.f.mono,fontSize:"0.65rem",letterSpacing:"0.18em",color:DS.c.void,fontWeight:700,cursor:"pointer"}}>CONTINUE →</button>
          :<button onClick={generate} style={{flex:1,background:`linear-gradient(135deg,${DS.c.safe}CC,#27AE60)`,border:"none",borderRadius:6,padding:"12px",fontFamily:DS.f.mono,fontSize:"0.65rem",letterSpacing:"0.18em",color:DS.c.void,fontWeight:700,cursor:"pointer"}}>◇ GENERATE MY SOVEREIGN PROTOCOL</button>
        }
      </div>
      {err&&<div style={{color:DS.c.toxic,fontFamily:DS.f.mono,fontSize:"0.67rem",padding:"10px 14px",marginTop:12,background:DS.c.vault,borderRadius:8}}>{err}</div>}
    </div>
  );
}

// ============================================================
// TRUTH LIBRARY
// ============================================================
function Library(){
  const[hist,setHist]=useState(()=>STORE.get("smf_hist")||[]);
  const[sel,setSel]=useState(null);
  const[search,setSearch]=useState("");
  const f=hist.filter(s=>s.entity?.toLowerCase().includes(search.toLowerCase()));
  const vc=(v)=>({SAFE:DS.c.safe,CAUTION:DS.c.warn,TOXIC:DS.c.toxic}[v]||DS.c.silver);
  return(
    <div style={{maxWidth:920,margin:"0 auto",padding:20}}>
      <div style={{textAlign:"center",marginBottom:20}}>
        <div style={{width:58,height:58,borderRadius:"50%",background:`radial-gradient(circle at 35% 35%,${DS.c.purple}CC,${DS.c.purple}22)`,boxShadow:`0 0 24px ${DS.c.purple}33`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",fontSize:"1.4rem"}}>▣</div>
        <h2 style={{fontFamily:DS.f.disp,fontSize:"1.35rem",fontWeight:700}}>Truth Library</h2>
        <p style={{fontFamily:DS.f.body,fontSize:"0.75rem",color:DS.c.silver,marginTop:4}}>Every scan ERI ran for you. Searchable. Permanent.</p>
      </div>
      {hist.length===0
        ?<div style={{background:DS.c.vault,border:`1px solid ${DS.c.border}`,borderRadius:8,padding:40,textAlign:"center"}}><div style={{fontFamily:DS.f.mono,fontSize:"0.6rem",color:DS.c.ghost,letterSpacing:"0.2em"}}>NO SCANS YET — Run your first scan to begin your Truth Library.</div></div>
        :<div style={{display:"grid",gridTemplateColumns:sel?"1fr 1fr":"1fr",gap:12}}>
          <div>
            <div style={{display:"flex",gap:8,marginBottom:10}}>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={`Search ${hist.length} entities…`} style={{flex:1,background:DS.c.obs,border:`1px solid ${DS.c.border}`,borderRadius:6,padding:"7px 12px",fontFamily:DS.f.body,fontSize:"0.8rem",color:DS.c.ice}}/>
              <button onClick={()=>{STORE.del("smf_hist");setHist([]);setSel(null);}} style={{background:"none",border:`1px solid ${DS.c.border}`,borderRadius:6,padding:"7px 10px",fontFamily:DS.f.mono,fontSize:"0.5rem",color:DS.c.ghost,cursor:"pointer",whiteSpace:"nowrap"}}>CLEAR ALL</button>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:5,maxHeight:500,overflowY:"auto"}}>
              {f.map((s,i)=>(
                <button key={i} onClick={()=>setSel(sel?.ts===s.ts?null:s)} style={{background:sel?.ts===s.ts?DS.c.chamber:DS.c.vault,border:`1px solid ${sel?.ts===s.ts?DS.c.bgold:DS.c.border}`,borderRadius:6,padding:"10px 13px",cursor:"pointer",textAlign:"left",transition:"all 0.2s",display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
                  <div><div style={{fontFamily:DS.f.body,fontSize:"0.83rem",fontWeight:500}}>{s.entity}</div><div style={{fontFamily:DS.f.mono,fontSize:"0.46rem",color:DS.c.ghost,marginTop:2}}>{new Date(s.ts).toLocaleDateString()} · {s.mode?.toUpperCase()||"TEXT"}</div></div>
                  <div style={{fontFamily:DS.f.mono,fontSize:"0.5rem",fontWeight:700,color:vc(s.verdict),border:`1px solid ${vc(s.verdict)}55`,borderRadius:3,padding:"2px 7px",whiteSpace:"nowrap"}}>{s.verdict}</div>
                </button>
              ))}
            </div>
          </div>
          {sel&&(
            <div style={{background:DS.c.vault,border:`1px solid ${DS.c.border}`,borderRadius:8,padding:18,maxHeight:560,overflowY:"auto",animation:"fadeUp 0.3s ease"}}>
              <div style={{fontFamily:DS.f.disp,fontSize:"0.95rem",fontWeight:700,marginBottom:3}}>{sel.entity}</div>
              <div style={{display:"flex",gap:7,marginBottom:14}}><span style={{fontFamily:DS.f.mono,fontSize:"0.52rem",color:vc(sel.verdict),border:`1px solid ${vc(sel.verdict)}55`,borderRadius:3,padding:"2px 7px"}}>{sel.verdict}</span><span style={{fontFamily:DS.f.mono,fontSize:"0.46rem",color:DS.c.ghost}}>{new Date(sel.ts).toLocaleString()}</span></div>
              {[["SPECIES",sel.species],["NUTRITION",sel.nutrition],["TRADITIONAL",sel.traditional],["RESEARCH",sel.research],["CORPORATE CAPTURE",sel.capture],["INFLUENCER VOICES",sel.voices],["PROTOCOL",sel.protocol]].filter(([,c])=>c).map(([l,c])=>(
                <div key={l} style={{marginBottom:13}}><div style={{fontFamily:DS.f.mono,fontSize:"0.48rem",letterSpacing:"0.18em",color:DS.c.gdim,marginBottom:5}}>{l}</div><div className="rb" style={{fontSize:"0.78rem",whiteSpace:"pre-wrap"}} dangerouslySetInnerHTML={{__html:fmt(c)}}/></div>
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
const HABITS=[
  {id:"fast",name:"Daily Fast",icon:"⚡",target:"16+ hours",color:DS.c.gold},
  {id:"hydrate",name:"Morning Hydration",icon:"◈",target:"32oz on waking",color:DS.c.blue},
  {id:"sunlight",name:"Morning Sunlight",icon:"◉",target:"10 min outdoors",color:"#F59E0B"},
  {id:"move",name:"Movement",icon:"◆",target:"30+ min",color:DS.c.safe},
  {id:"no_seed_oils",name:"Avoid Seed Oils",icon:"⬡",target:"Zero seed oils",color:DS.c.toxic},
  {id:"sleep",name:"Sleep by 10PM",icon:"○",target:"10PM bedtime",color:DS.c.purple},
  {id:"prayer",name:"Prayer / Meditation",icon:"✦",target:"AM + PM",color:"#F59E0B"},
  {id:"whole_food",name:"Whole Foods Only",icon:"◇",target:"Zero ultra-processed",color:DS.c.safe},
];
function Habits(){
  const today=new Date().toDateString();
  const[log,setLog]=useState(()=>STORE.get("eri_habits")||{});
  const tog=(id)=>{const k=`${id}_${today}`;const u={...log,[k]:!log[k]};setLog(u);STORE.set("eri_habits",u);};
  const dn=(id)=>!!log[`${id}_${today}`];
  const str=(id)=>{let s=0,d=new Date();while(s<366){const k=`${id}_${d.toDateString()}`;if(log[k])s++;else if(d.toDateString()!==today)break;d.setDate(d.getDate()-1);}return s;};
  const l7=(id)=>Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()-6+i);return{done:!!log[`${id}_${d.toDateString()}`],now:d.toDateString()===today};});
  const comp=HABITS.filter(h=>dn(h.id)).length;
  return(
    <div style={{maxWidth:820,margin:"0 auto",padding:20}}>
      <div style={{textAlign:"center",marginBottom:20}}>
        <div style={{width:58,height:58,borderRadius:"50%",background:`radial-gradient(circle at 35% 35%,#F59E0BCC,#F59E0B22)`,boxShadow:`0 0 24px #F59E0B33`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",fontSize:"1.4rem"}}>◆</div>
        <h2 style={{fontFamily:DS.f.disp,fontSize:"1.35rem",fontWeight:700}}>Habit Streaks</h2>
      </div>
      <div style={{background:DS.c.vault,border:`1px solid ${DS.c.border}`,borderRadius:8,padding:14,marginBottom:12,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
        <div><div style={{fontFamily:DS.f.mono,fontSize:"0.5rem",letterSpacing:"0.16em",color:DS.c.gdim,marginBottom:2}}>TODAY</div><div style={{display:"flex",alignItems:"baseline",gap:5}}><span style={{fontFamily:DS.f.disp,fontSize:"2rem",fontWeight:900,color:comp===HABITS.length?DS.c.safe:DS.c.gold}}>{comp}</span><span style={{fontFamily:DS.f.mono,fontSize:"0.62rem",color:DS.c.silver}}>/ {HABITS.length}</span></div></div>
        <div style={{flex:1,minWidth:130}}><div style={{height:4,background:DS.c.border,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${(comp/HABITS.length)*100}%`,background:`linear-gradient(90deg,${DS.c.gdim},${DS.c.safe})`,borderRadius:2,transition:"width 0.5s ease"}}/></div><div style={{fontFamily:DS.f.mono,fontSize:"0.46rem",color:DS.c.ghost,marginTop:3}}>{Math.round((comp/HABITS.length)*100)}% SOVEREIGN</div></div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {HABITS.map(h=>{const d=dn(h.id);const s=str(h.id);const l=l7(h.id);return(
          <div key={h.id} style={{background:DS.c.vault,border:`1px solid ${d?h.color+"44":DS.c.border}`,borderRadius:8,padding:"12px 14px",transition:"all 0.3s"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
              <button onClick={()=>tog(h.id)} style={{width:32,height:32,borderRadius:"50%",flexShrink:0,background:d?h.color:"none",border:`2px solid ${d?h.color:DS.c.border}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.25s",boxShadow:d?`0 0 10px ${h.color}55`:"none"}}>
                {d?<span style={{color:DS.c.void,fontWeight:900,fontSize:"0.8rem"}}>✓</span>:<span style={{color:DS.c.ghost}}>{h.icon}</span>}
              </button>
              <div style={{flex:1}}><div style={{fontFamily:DS.f.body,fontSize:"0.82rem",fontWeight:500,color:d?DS.c.ice:DS.c.silver}}>{h.name}</div><div style={{fontFamily:DS.f.mono,fontSize:"0.46rem",color:DS.c.ghost,letterSpacing:"0.07em",marginTop:2}}>{h.target}</div></div>
              <div style={{textAlign:"center",flexShrink:0}}><div style={{fontFamily:DS.f.disp,fontSize:"1.2rem",fontWeight:900,color:s>0?h.color:DS.c.ghost}}>{s}</div><div style={{fontFamily:DS.f.mono,fontSize:"0.4rem",color:DS.c.ghost,letterSpacing:"0.1em"}}>DAY STREAK</div></div>
            </div>
            <div style={{display:"flex",gap:5,marginTop:9,paddingLeft:42,alignItems:"center"}}>
              {l.map((x,i)=><div key={i} className={`sd ${x.done?"done":x.now?"now":"miss"}`}/>)}
              <div style={{fontFamily:DS.f.mono,fontSize:"0.42rem",color:DS.c.ghost,marginLeft:5}}>7 DAYS</div>
            </div>
          </div>
        );})}
      </div>
    </div>
  );
}

// ============================================================
// ROOT
// ============================================================
export default function App(){
  const[cur,setCur]=useState("home");
  const[profile,setProfile]=useState(()=>STORE.get("smf_profile")||null);
  const[onboarded,setOnboarded]=useState(()=>!!STORE.get("smf_profile"));
  const handle=(p)=>{STORE.set("smf_profile",p);setProfile(p);setOnboarded(true);};
  const upd=(u)=>{const n=typeof u==="function"?u(profile):u;STORE.set("smf_profile",n);setProfile(n);};
  if(!onboarded)return(<><style>{CSS}</style><Onboarding onDone={handle}/></>);
  return(
    <ProfileCtx.Provider value={{profile,setProfile:upd}}>
      <style>{CSS}</style>
      <div style={{minHeight:"100vh",background:DS.c.void}}>
        <NavBar cur={cur} setCur={setCur} profile={profile}/>
        <div style={{paddingTop:0}}>
          {cur==="home"&&<Home setCur={setCur} profile={profile}/>}
          {cur==="scanner"&&<Scanner/>}
          {cur==="redpill"&&<RedPill/>}
          {cur==="neochat"&&<NeoChat/>}
          {cur==="lifeplanner"&&<LifePlanner/>}
          {cur==="library"&&<Library/>}
          {cur==="habits"&&<Habits/>}
        </div>
      </div>
    </ProfileCtx.Provider>
  );
}
