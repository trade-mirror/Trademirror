
import { useState, useEffect, useRef, useCallback } from "react";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PieChart, Pie, Cell, Legend
} from "recharts";

/* ─────────────────────────────────────────────
   GLOBAL STYLES (injected once)
───────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@300;400;500&family=Lato:wght@300;400;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg-base:    #080C14;
    --bg-card:    #0D1421;
    --bg-surface: #111928;
    --bg-hover:   #16202E;
    --border:     #1E2D42;
    --border-light: #253348;
    --gold:       #F5A623;
    --gold-dim:   #C47D0A;
    --cyan:       #00D4FF;
    --cyan-dim:   #0099BB;
    --green:      #00E676;
    --red:        #FF3D57;
    --purple:     #9B5DE5;
    --text-1:     #EDF2F7;
    --text-2:     #8FA3BE;
    --text-3:     #4A6080;
    --font-display: 'Syne', sans-serif;
    --font-mono:    'DM Mono', monospace;
    --font-body:    'Lato', sans-serif;
  }

  html, body, #root { height: 100%; background: var(--bg-base); color: var(--text-1); font-family: var(--font-body); }

  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg-base); }
  ::-webkit-scrollbar-thumb { background: var(--border-light); border-radius: 2px; }

  .syne { font-family: var(--font-display); }
  .mono { font-family: var(--font-mono); }

  /* Animations */
  @keyframes fadeUp   { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
  @keyframes pulse    { 0%,100% { opacity:1; } 50% { opacity:.4; } }
  @keyframes shimmer  { 0% { background-position:-400px 0; } 100% { background-position:400px 0; } }
  @keyframes spinRing { to { transform: rotate(360deg); } }
  @keyframes ticker   { 0%{ transform:translateX(0); } 100%{ transform:translateX(-50%); } }

  .anim-fade-up  { animation: fadeUp .45s ease both; }
  .anim-fade-in  { animation: fadeIn .3s ease both; }
  .pulse-dot     { animation: pulse 2s infinite; }

  /* Cards */
  .card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 12px;
    transition: border-color .2s, box-shadow .2s;
  }
  .card:hover { border-color: var(--border-light); }
  .card-glow:hover { box-shadow: 0 0 24px rgba(0,212,255,.08); }

  /* Buttons */
  .btn-gold {
    background: linear-gradient(135deg, #F5A623, #C47D0A);
    color: #080C14;
    font-family: var(--font-display);
    font-weight: 700;
    border: none;
    cursor: pointer;
    border-radius: 8px;
    transition: opacity .2s, transform .15s;
  }
  .btn-gold:hover { opacity:.9; transform:translateY(-1px); }

  .btn-outline {
    background: transparent;
    color: var(--text-1);
    font-family: var(--font-display);
    font-weight: 600;
    border: 1px solid var(--border-light);
    cursor: pointer;
    border-radius: 8px;
    transition: border-color .2s, background .2s;
  }
  .btn-outline:hover { border-color: var(--cyan); background: rgba(0,212,255,.04); }

  .btn-ghost {
    background: transparent;
    color: var(--text-2);
    border: none;
    cursor: pointer;
    border-radius: 6px;
    transition: color .2s, background .2s;
    font-family: var(--font-body);
  }
  .btn-ghost:hover { color: var(--text-1); background: var(--bg-hover); }

  /* Tag */
  .tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    border-radius: 100px;
    font-size: 11px;
    font-weight: 600;
    font-family: var(--font-display);
    letter-spacing: .4px;
    padding: 3px 10px;
  }
  .tag-gold   { background: rgba(245,166,35,.12); color: var(--gold); border: 1px solid rgba(245,166,35,.25); }
  .tag-cyan   { background: rgba(0,212,255,.10); color: var(--cyan); border: 1px solid rgba(0,212,255,.25); }
  .tag-green  { background: rgba(0,230,118,.10); color: var(--green); border: 1px solid rgba(0,230,118,.25); }
  .tag-red    { background: rgba(255,61,87,.10); color: var(--red); border: 1px solid rgba(255,61,87,.25); }
  .tag-purple { background: rgba(155,93,229,.10); color: var(--purple); border: 1px solid rgba(155,93,229,.25); }

  /* Input */
  .input {
    background: var(--bg-surface);
    border: 1px solid var(--border);
    color: var(--text-1);
    border-radius: 8px;
    font-family: var(--font-body);
    font-size: 14px;
    transition: border-color .2s;
    outline: none;
  }
  .input:focus { border-color: var(--cyan); }
  .input::placeholder { color: var(--text-3); }

  /* Ticker */
  .ticker-wrap { overflow: hidden; white-space: nowrap; }
  .ticker-inner { display: inline-flex; animation: ticker 30s linear infinite; }

  /* Trust score ring */
  .trust-ring { position:relative; display:inline-flex; align-items:center; justify-content:center; }
  .trust-ring svg { position:absolute; top:0; left:0; transform: rotate(-90deg); }

  /* Nav tab */
  .nav-tab {
    display: flex; align-items: center; gap: 8px;
    padding: 9px 14px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    font-family: var(--font-display);
    cursor: pointer;
    transition: all .18s;
    color: var(--text-2);
    background: transparent;
    border: none;
    white-space: nowrap;
  }
  .nav-tab:hover { color: var(--text-1); background: var(--bg-hover); }
  .nav-tab.active { color: var(--gold); background: rgba(245,166,35,.08); }

  /* Signal bar */
  .signal-bar { height: 6px; border-radius: 3px; }

  /* Gradient text */
  .grad-gold { background: linear-gradient(90deg, #F5A623, #FFD580); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .grad-cyan { background: linear-gradient(90deg, #00D4FF, #7FFFEF); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

  /* Tooltip override */
  .recharts-tooltip-wrapper .custom-tooltip {
    background: var(--bg-card);
    border: 1px solid var(--border-light);
    border-radius: 8px;
    padding: 10px 14px;
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--text-1);
  }

  /* Modal overlay */
  .modal-overlay {
    position: fixed; inset: 0;
    background: rgba(8,12,20,.85);
    backdrop-filter: blur(6px);
    z-index: 100;
    display: flex; align-items: center; justify-content: center;
  }

  /* Slider */
  input[type=range] {
    -webkit-appearance: none;
    width: 100%; height: 4px;
    background: var(--bg-surface);
    border-radius: 2px;
    outline: none;
  }
  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px; height: 16px;
    border-radius: 50%;
    background: var(--gold);
    cursor: pointer;
    border: 2px solid var(--bg-card);
  }

  /* Progress */
  .progress-bar { height: 4px; border-radius: 2px; background: var(--bg-surface); overflow: hidden; }
  .progress-fill { height: 100%; border-radius: 2px; transition: width .6s ease; }

  /* Switch */
  .switch { position:relative; width:44px; height:24px; display:inline-block; cursor:pointer; }
  .switch input { opacity:0; width:0; height:0; }
  .switch-slider {
    position:absolute; inset:0;
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    transition: background .2s;
  }
  .switch-slider:before {
    content:'';
    position:absolute;
    width:16px; height:16px;
    left:3px; top:3px;
    background: var(--text-3);
    border-radius: 50%;
    transition: transform .2s, background .2s;
  }
  .switch input:checked + .switch-slider { background: rgba(245,166,35,.15); border-color: var(--gold); }
  .switch input:checked + .switch-slider:before { transform: translateX(20px); background: var(--gold); }
`;

/* ─────────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────────── */

const TRADERS = [
  { id:1,  name:"QuantumEdge",   avatar:"QE", score:91, returns:"+284%", winRate:78, drawdown:"-8.2%",  volatility:"Low",    trades:312, followers:14200, specialty:"Macro/BTC",    riskLevel:"low",    verified:true,  bio:"Algorithmic macro trader. BTC & ETH focus.",    tier:"pro" },
  { id:2,  name:"AlphaWave",     avatar:"AW", score:88, returns:"+198%", winRate:72, drawdown:"-12.1%", volatility:"Medium", trades:287, followers:9800,  specialty:"DeFi/Altcoins",riskLevel:"medium", verified:true,  bio:"DeFi specialist. High conviction altcoin picks.", tier:"pro" },
  { id:3,  name:"NovaTrade",     avatar:"NT", score:85, returns:"+167%", winRate:69, drawdown:"-15.4%", volatility:"Medium", trades:198, followers:7600,  specialty:"Tech Stocks",   riskLevel:"medium", verified:true,  bio:"Tech stock momentum trader. FAANG focus.",      tier:"pro" },
  { id:4,  name:"IronSignal",    avatar:"IS", score:83, returns:"+143%", winRate:74, drawdown:"-9.8%",  volatility:"Low",    trades:421, followers:11400, specialty:"Options/Hedges",riskLevel:"low",    verified:true,  bio:"Options strategist. Risk-first approach.",      tier:"pro" },
  { id:5,  name:"ZephyrFX",      avatar:"ZF", score:79, returns:"+122%", winRate:66, drawdown:"-18.7%", volatility:"High",   trades:534, followers:6200,  specialty:"Forex/Crypto",  riskLevel:"high",   verified:false, bio:"FX crossover crypto trader. High frequency.",   tier:"free" },
  { id:6,  name:"PeakCapital",   avatar:"PC", score:76, returns:"+109%", winRate:71, drawdown:"-11.3%", volatility:"Medium", trades:256, followers:8900,  specialty:"Value/Growth",  riskLevel:"medium", verified:true,  bio:"Traditional value investor adapted for crypto.", tier:"free" },
  { id:7,  name:"DeltaFusion",   avatar:"DF", score:74, returns:"+98%",  winRate:68, drawdown:"-20.1%", volatility:"High",   trades:389, followers:5400,  specialty:"Swing/Meme",    riskLevel:"high",   verified:false, bio:"High-risk swing trader. Meme + momentum.",      tier:"free" },
  { id:8,  name:"StellarQuant",  avatar:"SQ", score:88, returns:"+231%", winRate:76, drawdown:"-7.1%",  volatility:"Low",    trades:178, followers:16800, specialty:"Quant/ML",      riskLevel:"low",    verified:true,  bio:"ML-driven quant signals. Systematic entry/exit.",tier:"pro"},
  { id:9,  name:"VortexAlpha",   avatar:"VA", score:71, returns:"+87%",  winRate:63, drawdown:"-24.5%", volatility:"High",   trades:612, followers:4100,  specialty:"Leverage/Perps",riskLevel:"high",   verified:false, bio:"Perpetuals and leverage specialist.",           tier:"free" },
  { id:10, name:"ClearPath",     avatar:"CP", score:80, returns:"+134%", winRate:73, drawdown:"-10.9%", volatility:"Medium", trades:302, followers:9100,  specialty:"Balanced Multi", riskLevel:"medium", verified:true,  bio:"Diversified multi-asset balanced approach.",   tier:"free" },
];

const ASSETS = [
  { symbol:"BTC",  name:"Bitcoin",   type:"crypto", price:"$67,420", change:"+3.2%",  positive:true  },
  { symbol:"ETH",  name:"Ethereum",  type:"crypto", price:"$3,840",  change:"+2.8%",  positive:true  },
  { symbol:"SOL",  name:"Solana",    type:"crypto", price:"$172",    change:"+5.1%",  positive:true  },
  { symbol:"NVDA", name:"NVIDIA",    type:"stock",  price:"$887",    change:"-1.2%",  positive:false },
  { symbol:"AAPL", name:"Apple",     type:"stock",  price:"$196",    change:"+0.7%",  positive:true  },
  { symbol:"AVAX", name:"Avalanche", type:"crypto", price:"$38.4",   change:"+7.3%",  positive:true  },
  { symbol:"TSLA", name:"Tesla",     type:"stock",  price:"$245",    change:"-2.1%",  positive:false },
  { symbol:"ARB",  name:"Arbitrum",  type:"crypto", price:"$1.24",   change:"+11.2%", positive:true  },
];

// Consensus positions – overlapping trader buys
const CONSENSUS = [
  { asset:"BTC",  traders:[1,2,4,8,10], conviction:"high",   category:"trending", sentiment:"Very Bullish", pctTraders:70, targetUp:"+18%", reason:"Post-halving accumulation. On-chain metrics strong." },
  { asset:"ETH",  traders:[1,2,3,8],    conviction:"high",   category:"trending", sentiment:"Bullish",      pctTraders:60, targetUp:"+24%", reason:"ETF inflows accelerating. L2 ecosystem boom." },
  { asset:"SOL",  traders:[2,5,7,9],    conviction:"medium", category:"trending", sentiment:"Bullish",      pctTraders:50, targetUp:"+31%", reason:"DEX volume surpassing ETH. NFT resurgence." },
  { asset:"NVDA", traders:[3,4,6,8],    conviction:"high",   category:"high-conv",sentiment:"Strong Buy",   pctTraders:55, targetUp:"+15%", reason:"AI infrastructure supercycle. Data center demand." },
  { asset:"AVAX", traders:[2,9,10],     conviction:"medium", category:"trending", sentiment:"Moderate Buy", pctTraders:40, targetUp:"+42%", reason:"Subnet growth. Institutional chain adoption." },
  { asset:"ARB",  traders:[2,7,9],      conviction:"low",    category:"watch",    sentiment:"Speculative",  pctTraders:30, targetUp:"+65%", reason:"L2 market share gain. Airdrop catalysts upcoming." },
];

// Alerts feed
const ALERTS = [
  { id:1,  time:"2m ago",   type:"entry",  strength:"strong", traders:[1,4,8],   asset:"BTC",  msg:"3 top traders opened long positions on BTC",             read:false },
  { id:2,  time:"14m ago",  type:"entry",  strength:"strong", traders:[3,6,8],   asset:"NVDA", msg:"Consensus long on NVDA following earnings beat",          read:false },
  { id:3,  time:"1h ago",   type:"exit",   strength:"medium", traders:[7,9],     asset:"ARB",  msg:"ZephyrFX & VortexAlpha reduced ARB exposure by 40%",      read:true  },
  { id:4,  time:"3h ago",   type:"entry",  strength:"medium", traders:[2,10],    asset:"SOL",  msg:"AlphaWave & ClearPath opened SOL positions",              read:true  },
  { id:5,  time:"5h ago",   type:"exit",   strength:"weak",   traders:[5],       asset:"TSLA", msg:"ZephyrFX exited TSLA short after 22% gain",              read:true  },
  { id:6,  time:"8h ago",   type:"entry",  strength:"strong", traders:[1,2,4,8], asset:"ETH",  msg:"4 elite traders entering ETH. Major signal detected.",    read:true  },
  { id:7,  time:"12h ago",  type:"signal", strength:"medium", traders:[3,6],     asset:"AAPL", msg:"NovaTrade & PeakCapital buying AAPL support level",       read:true  },
  { id:8,  time:"1d ago",   type:"entry",  strength:"weak",   traders:[10],      asset:"AVAX", msg:"ClearPath initiated small AVAX position (rebalance)",     read:true  },
];

// Portfolio performance (months)
const PERF_DATA = [
  { month:"Jan", portfolio:10000, sp500:10000, btc:10000 },
  { month:"Feb", portfolio:11200, sp500:10280, btc:11800 },
  { month:"Mar", portfolio:11800, sp500:10190, btc:10900 },
  { month:"Apr", portfolio:13400, sp500:10480, btc:13200 },
  { month:"May", portfolio:14100, sp500:10650, btc:12100 },
  { month:"Jun", portfolio:13600, sp500:10420, btc:11300 },
  { month:"Jul", portfolio:15200, sp500:10890, btc:14800 },
  { month:"Aug", portfolio:16800, sp500:11100, btc:15600 },
  { month:"Sep", portfolio:16100, sp500:10780, btc:14200 },
  { month:"Oct", portfolio:18400, sp500:11300, btc:17900 },
  { month:"Nov", portfolio:20100, sp500:11680, btc:19400 },
  { month:"Dec", portfolio:22800, sp500:11900, btc:22100 },
];

// Trader equity curves (simplified)
const genCurve = (seed, vol, trend) => {
  let val = 10000; const r = [];
  for (let i = 0; i < 12; i++) {
    val *= (1 + trend + (Math.sin(i * seed) * vol));
    r.push(Math.round(val));
  }
  return r;
};

const TRADER_CURVES = {
  1: genCurve(1.3, 0.03, 0.028),
  2: genCurve(2.1, 0.05, 0.022),
  4: genCurve(0.9, 0.02, 0.024),
  8: genCurve(1.7, 0.02, 0.026),
};

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

/* ─────────────────────────────────────────────
   UTILITY COMPONENTS
───────────────────────────────────────────── */

function StyleInjector() {
  useEffect(() => {
    const el = document.createElement("style");
    el.innerHTML = GLOBAL_CSS;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);
  return null;
}

function TrustRing({ score, size = 56 }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const fill = circ * (score / 100);
  const color = score >= 85 ? "#F5A623" : score >= 70 ? "#00D4FF" : "#9B5DE5";
  return (
    <div className="trust-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1E2D42" strokeWidth={4} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={4}
          strokeDasharray={`${fill} ${circ - fill}`} strokeLinecap="round" />
      </svg>
      <span className="mono" style={{ fontSize: size > 50 ? 14 : 11, fontWeight: 500, color }}>{score}</span>
    </div>
  );
}

function Avatar({ name, size = 36, color }) {
  const colors = ["#F5A623","#00D4FF","#00E676","#9B5DE5","#FF3D57","#FFD580","#7FFFEF"];
  const bg = color || colors[name.charCodeAt(0) % colors.length];
  return (
    <div className="syne" style={{
      width: size, height: size, borderRadius: "50%",
      background: `linear-gradient(135deg, ${bg}22, ${bg}44)`,
      border: `1.5px solid ${bg}55`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * .32, fontWeight: 700, color: bg, flexShrink: 0,
    }}>{name.slice(0,2)}</div>
  );
}

function SignalBadge({ strength }) {
  const map = { strong: { color:"#F5A623", bg:"rgba(245,166,35,.12)", label:"STRONG" },
                medium: { color:"#00D4FF", bg:"rgba(0,212,255,.10)", label:"MEDIUM" },
                weak:   { color:"#4A6080", bg:"rgba(74,96,128,.12)",  label:"WEAK"   } };
  const s = map[strength] || map.weak;
  return (
    <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}33`,
      borderRadius: 100, padding:"2px 8px", fontSize:10, fontWeight:700, fontFamily:"var(--font-display)", letterSpacing:".5px" }}>
      {s.label}
    </span>
  );
}

function StatCard({ label, value, sub, trend, color = "var(--gold)" }) {
  return (
    <div className="card card-glow anim-fade-up" style={{ padding:"20px 22px" }}>
      <p style={{ fontSize:11, fontWeight:700, color:"var(--text-3)", fontFamily:"var(--font-display)", letterSpacing:".8px", textTransform:"uppercase", marginBottom:8 }}>{label}</p>
      <p className="mono" style={{ fontSize:26, fontWeight:500, color, lineHeight:1 }}>{value}</p>
      {sub && <p style={{ fontSize:12, color: trend === "up" ? "var(--green)" : trend === "down" ? "var(--red)" : "var(--text-2)", marginTop:6 }}>{sub}</p>}
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <p style={{ color:"var(--text-2)", marginBottom:4 }}>{label}</p>
      {payload.map((p,i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: <strong>{typeof p.value === "number" && p.value > 1000 ? "$"+p.value.toLocaleString() : p.value}</strong></p>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   PAGES
───────────────────────────────────────────── */

// ── LANDING PAGE ──────────────────────────────
function LandingPage({ onEnter }) {
  const [hovered, setHovered] = useState(null);
  const tiers = [
    { name:"Free", price:"$0", sub:"/month", features:["Top 5 traders (delayed 24h)","Basic leaderboard","3 consensus signals/week","Email alerts only","Community access"], cta:"Start Free", highlight:false },
    { name:"Pro",  price:"$29", sub:"/month", features:["All 10+ traders (real-time)","Full leaderboard + analytics","Unlimited consensus signals","Instant push alerts","Copy strategy builder","Portfolio simulator","AI trade summaries","Priority support"], cta:"Start 14-Day Trial", highlight:true },
    { name:"Institutional", price:"$99", sub:"/month", features:["Everything in Pro","100+ traders tracked","Custom watchlists","API access (JSON/CSV)","White-label reports","Dedicated analyst","Backtesting engine","Multi-portfolio tracking"], cta:"Contact Sales", highlight:false },
  ];
  return (
    <div style={{ minHeight:"100vh", background:"var(--bg-base)" }}>
      {/* HERO */}
      <div style={{
        position:"relative", overflow:"hidden",
        padding:"80px 24px 100px",
        background:"radial-gradient(ellipse 80% 60% at 50% -20%, rgba(0,212,255,.07) 0%, transparent 70%)",
        borderBottom:"1px solid var(--border)",
        textAlign:"center",
      }}>
        {/* Grid overlay */}
        <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(var(--border) 1px, transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px)", backgroundSize:"40px 40px", opacity:.3, pointerEvents:"none" }} />

        <div style={{ position:"relative", maxWidth:840, margin:"0 auto" }}>
          <div className="tag tag-cyan" style={{ marginBottom:20 }}>
            <span className="pulse-dot" style={{ width:6, height:6, borderRadius:"50%", background:"var(--cyan)", display:"inline-block" }} />
            LIVE SIGNAL ENGINE ACTIVE
          </div>
          <h1 className="syne anim-fade-up" style={{ fontSize:"clamp(36px,6vw,72px)", fontWeight:800, lineHeight:1.05, marginBottom:20 }}>
            Stop Guessing.<br/>
            <span className="grad-gold">Follow the Smartest</span><br/>
            Traders on Earth.
          </h1>
          <p className="anim-fade-up" style={{ fontSize:18, color:"var(--text-2)", maxWidth:560, margin:"0 auto 40px", lineHeight:1.7, animationDelay:".1s" }}>
            TradeMirror Pro aggregates signals from elite traders, identifies consensus positions, and gives you a risk-adjusted strategy — not just blind copy-trading.
          </p>
          <div className="anim-fade-up" style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap", animationDelay:".2s" }}>
            <button className="btn-gold" style={{ padding:"14px 32px", fontSize:16 }} onClick={onEnter}>
              Launch App — It's Free
            </button>
            <button className="btn-outline" style={{ padding:"14px 24px", fontSize:15 }}>
              Watch Demo ▶
            </button>
          </div>
          <p style={{ marginTop:16, fontSize:12, color:"var(--text-3)" }}>No credit card required · Cancel anytime · 14-day Pro trial</p>
        </div>
      </div>

      {/* TICKER */}
      <div style={{ background:"var(--bg-card)", borderBottom:"1px solid var(--border)", padding:"10px 0" }}>
        <div className="ticker-wrap">
          <div className="ticker-inner">
            {[...ASSETS,...ASSETS].map((a,i) => (
              <span key={i} className="mono" style={{ padding:"0 24px", fontSize:13, color: a.positive ? "var(--green)" : "var(--red)" }}>
                <span style={{ color:"var(--text-2)", marginRight:8 }}>{a.symbol}</span>
                {a.price} <span style={{ marginLeft:6 }}>{a.change}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"80px 24px" }}>
        <h2 className="syne" style={{ fontSize:36, fontWeight:800, textAlign:"center", marginBottom:12 }}>Why TradeMirror Pro?</h2>
        <p style={{ textAlign:"center", color:"var(--text-2)", marginBottom:56, fontSize:16 }}>Every feature built for one goal: give you an edge, not noise.</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:20 }}>
          {[
            { icon:"🧠", title:"Consensus Engine", desc:"We identify when 3+ elite traders are buying the same asset. That's a signal, not a coincidence." },
            { icon:"📊", title:"Trust Score™",     desc:"Rank traders by consistency, drawdown, and volatility — not just flashy returns." },
            { icon:"⚡", title:"Real-Time Alerts", desc:"Get notified the moment top traders enter or exit major positions. Seconds matter." },
            { icon:"🛡️", title:"Risk-Adjusted Copy",desc:"Build a strategy that matches your risk appetite: aggressive, balanced, or conservative." },
            { icon:"📈", title:"Portfolio Simulator",desc:"See how your chosen strategy would have performed. Backtest before you commit." },
            { icon:"🤖", title:"AI Trade Summaries",desc:"Understand why a stock is trending among top traders in plain English." },
          ].map((f,i) => (
            <div key={i} className="card" style={{ padding:"28px 24px" }}
              onMouseEnter={()=>setHovered(i)} onMouseLeave={()=>setHovered(null)}
              style={{ padding:"28px 24px", background:"var(--bg-card)", border:`1px solid ${hovered===i?"var(--gold)":"var(--border)"}`, borderRadius:12, transition:"border-color .2s" }}>
              <div style={{ fontSize:32, marginBottom:14 }}>{f.icon}</div>
              <h3 className="syne" style={{ fontSize:17, fontWeight:700, marginBottom:8 }}>{f.title}</h3>
              <p style={{ color:"var(--text-2)", fontSize:14, lineHeight:1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PRICING */}
      <div style={{ background:"var(--bg-card)", borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)", padding:"80px 24px" }}>
        <div style={{ maxWidth:1000, margin:"0 auto" }}>
          <h2 className="syne" style={{ fontSize:36, fontWeight:800, textAlign:"center", marginBottom:8 }}>Simple Pricing</h2>
          <p style={{ textAlign:"center", color:"var(--text-2)", marginBottom:52, fontSize:16 }}>Start free. Upgrade when you're ready for the edge.</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:20 }}>
            {tiers.map((t,i) => (
              <div key={i} style={{
                background: t.highlight ? "linear-gradient(145deg, #0D1421, #12202F)" : "var(--bg-base)",
                border: `1px solid ${t.highlight ? "var(--gold)" : "var(--border)"}`,
                borderRadius:16, padding:"32px 28px",
                position:"relative", overflow:"hidden",
              }}>
                {t.highlight && <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"linear-gradient(90deg,var(--gold),#FFD580)" }} />}
                {t.highlight && <div className="tag tag-gold" style={{ marginBottom:16 }}>MOST POPULAR</div>}
                <h3 className="syne" style={{ fontSize:22, fontWeight:800, marginBottom:4 }}>{t.name}</h3>
                <div style={{ display:"flex", alignItems:"baseline", gap:4, marginBottom:24 }}>
                  <span className="mono" style={{ fontSize:38, fontWeight:500, color: t.highlight ? "var(--gold)" : "var(--text-1)" }}>{t.price}</span>
                  <span style={{ color:"var(--text-3)", fontSize:14 }}>{t.sub}</span>
                </div>
                <ul style={{ listStyle:"none", marginBottom:28, display:"flex", flexDirection:"column", gap:10 }}>
                  {t.features.map((f,j) => (
                    <li key={j} style={{ display:"flex", gap:10, fontSize:13, color:"var(--text-2)", alignItems:"flex-start" }}>
                      <span style={{ color: t.highlight ? "var(--gold)" : "var(--cyan)", marginTop:1, flexShrink:0 }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button className={t.highlight ? "btn-gold" : "btn-outline"} style={{ width:"100%", padding:"12px 0", fontSize:14 }}
                  onClick={onEnter}>
                  {t.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ padding:"40px 24px", textAlign:"center", borderTop:"1px solid var(--border)" }}>
        <p className="syne" style={{ fontSize:20, fontWeight:800, color:"var(--gold)", marginBottom:8 }}>TradeMirror Pro</p>
        <p style={{ color:"var(--text-3)", fontSize:13 }}>© 2025 TradeMirror Pro Inc. · Not financial advice. · Privacy · Terms</p>
      </footer>
    </div>
  );
}

// ── AUTH ──────────────────────────────────────
function AuthPage({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const submit = () => {
    if (!email || !pass) { setErr("Please fill all fields."); return; }
    setLoading(true); setErr("");
    setTimeout(() => {
      setLoading(false);
      onAuth({ email, name: name || email.split("@")[0], plan: "free" });
    }, 1200);
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
      background:"radial-gradient(ellipse 70% 50% at 50% 0%, rgba(245,166,35,.05) 0%, transparent 60%), var(--bg-base)",
      padding:24 }}>
      <div className="card anim-fade-up" style={{ width:"100%", maxWidth:420, padding:"40px 36px" }}>
        <p className="syne" style={{ fontSize:24, fontWeight:800, color:"var(--gold)", textAlign:"center", marginBottom:4 }}>TradeMirror Pro</p>
        <p style={{ textAlign:"center", color:"var(--text-3)", fontSize:13, marginBottom:32 }}>
          {mode === "login" ? "Welcome back. Let's find your edge." : "Create your account. Start free."}
        </p>

        {mode === "signup" && (
          <div style={{ marginBottom:16 }}>
            <label style={{ fontSize:12, color:"var(--text-3)", fontWeight:600, display:"block", marginBottom:6 }}>FULL NAME</label>
            <input className="input" style={{ width:"100%", padding:"11px 14px" }}
              placeholder="Alex Morgan" value={name} onChange={e=>setName(e.target.value)} />
          </div>
        )}

        <div style={{ marginBottom:16 }}>
          <label style={{ fontSize:12, color:"var(--text-3)", fontWeight:600, display:"block", marginBottom:6 }}>EMAIL</label>
          <input className="input" style={{ width:"100%", padding:"11px 14px" }}
            type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div style={{ marginBottom: err ? 12 : 24 }}>
          <label style={{ fontSize:12, color:"var(--text-3)", fontWeight:600, display:"block", marginBottom:6 }}>PASSWORD</label>
          <input className="input" style={{ width:"100%", padding:"11px 14px" }}
            type="password" placeholder="••••••••" value={pass} onChange={e=>setPass(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&submit()} />
        </div>
        {err && <p style={{ color:"var(--red)", fontSize:13, marginBottom:14 }}>{err}</p>}

        <button className="btn-gold" style={{ width:"100%", padding:"13px 0", fontSize:15, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}
          onClick={submit} disabled={loading}>
          {loading ? <span style={{ width:18, height:18, border:"2px solid #08080811", borderTop:"2px solid #080C14", borderRadius:"50%", animation:"spinRing .6s linear infinite", display:"inline-block" }} /> : null}
          {loading ? "Signing in..." : mode === "login" ? "Sign In" : "Create Account"}
        </button>

        <div style={{ marginTop:20, display:"flex", gap:12, alignItems:"center" }}>
          <div style={{ flex:1, height:1, background:"var(--border)" }} />
          <span style={{ fontSize:12, color:"var(--text-3)" }}>OR</span>
          <div style={{ flex:1, height:1, background:"var(--border)" }} />
        </div>

        <button className="btn-outline" style={{ width:"100%", padding:"11px 0", fontSize:14, marginTop:12 }}
          onClick={() => onAuth({ email:"demo@trademirror.pro", name:"Demo User", plan:"pro" })}>
          Continue as Demo (Pro Access)
        </button>

        <p style={{ textAlign:"center", marginTop:20, fontSize:13, color:"var(--text-3)" }}>
          {mode === "login" ? "No account? " : "Already have one? "}
          <button className="btn-ghost" style={{ padding:"2px 6px", fontSize:13, color:"var(--cyan)" }}
            onClick={()=>setMode(m=>m==="login"?"signup":"login")}>
            {mode === "login" ? "Sign up free" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}

// ── LEADERBOARD ───────────────────────────────
function Leaderboard({ user }) {
  const [sort, setSort] = useState("score");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  const sorted = [...TRADERS]
    .filter(t => filter === "all" || t.riskLevel === filter)
    .sort((a,b) => {
      if (sort === "score") return b.score - a.score;
      if (sort === "returns") return parseFloat(b.returns) - parseFloat(a.returns);
      if (sort === "winRate") return b.winRate - a.winRate;
      if (sort === "followers") return b.followers - a.followers;
      return 0;
    });

  const isPro = user.plan === "pro";
  const visibleTraders = isPro ? sorted : sorted.slice(0,5);

  return (
    <div className="anim-fade-in">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24, flexWrap:"wrap", gap:12 }}>
        <div>
          <h2 className="syne" style={{ fontSize:24, fontWeight:800 }}>Smart Leaderboard</h2>
          <p style={{ color:"var(--text-2)", fontSize:13, marginTop:2 }}>Ranked by Trust Score™ — consistency, drawdown & volatility</p>
        </div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {["all","low","medium","high"].map(f => (
            <button key={f} onClick={()=>setFilter(f)} className="btn-ghost" style={{
              padding:"6px 14px", fontSize:12, fontWeight:600, fontFamily:"var(--font-display)",
              background: filter===f ? "var(--bg-hover)" : "transparent",
              color: filter===f ? "var(--gold)" : "var(--text-2)",
              border: filter===f ? "1px solid var(--border-light)" : "1px solid transparent",
              borderRadius:6, textTransform:"capitalize"
            }}>{f === "all" ? "All Risk" : f+" Risk"}</button>
          ))}
        </div>
      </div>

      {/* Sort bar */}
      <div style={{ display:"flex", gap:8, marginBottom:16, padding:"0 4px", flexWrap:"wrap" }}>
        {[["score","Trust Score"],["returns","Returns"],["winRate","Win Rate"],["followers","Followers"]].map(([k,l]) => (
          <button key={k} onClick={()=>setSort(k)} style={{
            padding:"5px 12px", fontSize:11, fontWeight:700, fontFamily:"var(--font-display)",
            background: sort===k ? "rgba(245,166,35,.12)" : "transparent",
            color: sort===k ? "var(--gold)" : "var(--text-3)",
            border: `1px solid ${sort===k?"var(--gold)33":"var(--border)"}`,
            borderRadius:6, cursor:"pointer", textTransform:"uppercase", letterSpacing:".4px"
          }}>{l}</button>
        ))}
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {visibleTraders.map((t,i) => (
          <TraderRow key={t.id} trader={t} rank={sorted.indexOf(t)+1} onClick={()=>setSelected(t)} />
        ))}
      </div>

      {!isPro && (
        <div className="card" style={{ padding:28, textAlign:"center", marginTop:12, background:"linear-gradient(145deg,var(--bg-card),#0D1E2E)", border:"1px solid var(--gold)33" }}>
          <p className="syne" style={{ fontSize:18, fontWeight:700, marginBottom:6 }}>🔒 5 More Traders Hidden</p>
          <p style={{ color:"var(--text-2)", fontSize:13, marginBottom:16 }}>Upgrade to Pro to see the full leaderboard including StellarQuant (#2) and more elite traders.</p>
          <button className="btn-gold" style={{ padding:"11px 28px", fontSize:14 }}>Upgrade to Pro — $29/mo</button>
        </div>
      )}

      {selected && <TraderModal trader={selected} onClose={()=>setSelected(null)} />}
    </div>
  );
}

function TraderRow({ trader: t, rank, onClick }) {
  const riskColor = { low:"var(--green)", medium:"var(--gold)", high:"var(--red)" }[t.riskLevel];
  return (
    <div className="card card-glow" onClick={onClick} style={{ padding:"14px 20px", cursor:"pointer", display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
      <span className="mono" style={{ fontSize:12, color:"var(--text-3)", minWidth:20 }}>#{rank}</span>
      <Avatar name={t.avatar} size={42} />
      <div style={{ flex:1, minWidth:120 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
          <span className="syne" style={{ fontWeight:700, fontSize:15 }}>{t.name}</span>
          {t.verified && <span title="Verified" style={{ color:"var(--cyan)", fontSize:13 }}>✓</span>}
          <span className="tag tag-gold" style={{ fontSize:10 }}>{t.specialty}</span>
        </div>
        <p style={{ fontSize:12, color:"var(--text-3)" }}>{t.followers.toLocaleString()} followers · {t.trades} trades</p>
      </div>
      <TrustRing score={t.score} size={48} />
      <div style={{ textAlign:"center", minWidth:70 }}>
        <p className="mono" style={{ fontSize:16, fontWeight:500, color:"var(--green)" }}>{t.returns}</p>
        <p style={{ fontSize:10, color:"var(--text-3)" }}>All-time</p>
      </div>
      <div style={{ textAlign:"center", minWidth:60 }}>
        <p className="mono" style={{ fontSize:15 }}>{t.winRate}%</p>
        <p style={{ fontSize:10, color:"var(--text-3)" }}>Win Rate</p>
      </div>
      <div style={{ textAlign:"center", minWidth:64 }}>
        <p className="mono" style={{ fontSize:14, color:"var(--red)" }}>{t.drawdown}</p>
        <p style={{ fontSize:10, color:"var(--text-3)" }}>Max DD</p>
      </div>
      <span style={{ color:riskColor, fontSize:11, fontWeight:700, fontFamily:"var(--font-display)", textTransform:"uppercase", letterSpacing:".5px", minWidth:50, textAlign:"right" }}>{t.riskLevel}</span>
    </div>
  );
}

function TraderModal({ trader: t, onClose }) {
  const curve = TRADER_CURVES[t.id] || genCurve(t.id * .7, 0.04, 0.02);
  const data = curve.map((v,i) => ({ month: MONTHS[i], value: v }));
  const radarData = [
    { subject:"Consistency", A: t.score },
    { subject:"Win Rate",    A: t.winRate },
    { subject:"Risk Mgmt",   A: Math.round(100 - Math.abs(parseFloat(t.drawdown)) * 4) },
    { subject:"Popularity",  A: Math.round(Math.min(t.followers/200,100)) },
    { subject:"Volume",      A: Math.round(Math.min(t.trades/6,100)) },
  ];
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="card anim-fade-up" onClick={e=>e.stopPropagation()}
        style={{ width:"min(700px,96vw)", maxHeight:"85vh", overflowY:"auto", padding:32 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
          <div style={{ display:"flex", gap:16, alignItems:"center" }}>
            <Avatar name={t.avatar} size={56} />
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <h2 className="syne" style={{ fontSize:22, fontWeight:800 }}>{t.name}</h2>
                {t.verified && <span style={{ color:"var(--cyan)" }}>✓</span>}
              </div>
              <p style={{ color:"var(--text-2)", fontSize:13 }}>{t.bio}</p>
              <div style={{ display:"flex", gap:6, marginTop:8 }}>
                <span className="tag tag-gold">{t.specialty}</span>
                <span className="tag tag-cyan">{t.riskLevel} risk</span>
              </div>
            </div>
          </div>
          <button className="btn-ghost" style={{ padding:"6px 12px", fontSize:20 }} onClick={onClose}>×</button>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:24 }}>
          {[["Trust Score",t.score,"var(--gold)"],["Returns",t.returns,"var(--green)"],["Win Rate",t.winRate+"%","var(--cyan)"],["Drawdown",t.drawdown,"var(--red)"]].map(([l,v,c]) => (
            <div key={l} className="card" style={{ padding:"14px 16px" }}>
              <p style={{ fontSize:10, color:"var(--text-3)", fontWeight:700, fontFamily:"var(--font-display)", letterSpacing:".6px", marginBottom:6 }}>{l.toUpperCase()}</p>
              <p className="mono" style={{ fontSize:20, color:c }}>{v}</p>
            </div>
          ))}
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
          <div>
            <p className="syne" style={{ fontSize:13, fontWeight:700, marginBottom:12, color:"var(--text-2)" }}>EQUITY CURVE</p>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id={`g${t.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--gold)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--gold)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fill:"var(--text-3)", fontSize:10 }} />
                <YAxis tick={{ fill:"var(--text-3)", fontSize:10 }} tickFormatter={v=>"$"+Math.round(v/1000)+"k"} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="value" stroke="var(--gold)" fill={`url(#g${t.id})`} strokeWidth={2} name="Portfolio" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div>
            <p className="syne" style={{ fontSize:13, fontWeight:700, marginBottom:12, color:"var(--text-2)" }}>PERFORMANCE RADAR</p>
            <ResponsiveContainer width="100%" height={180}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill:"var(--text-3)", fontSize:10 }} />
                <Radar dataKey="A" stroke="var(--cyan)" fill="var(--cyan)" fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── CONSENSUS ENGINE ─────────────────────────
function ConsensusEngine({ user }) {
  const [tab, setTab] = useState("trending");
  const filtered = CONSENSUS.filter(c => tab === "all" || c.category === tab || (tab === "trending" && c.category === "trending") || (tab === "high-conv" && c.category === "high-conv"));

  return (
    <div className="anim-fade-in">
      <div style={{ marginBottom:24 }}>
        <h2 className="syne" style={{ fontSize:24, fontWeight:800 }}>Consensus Engine</h2>
        <p style={{ color:"var(--text-2)", fontSize:13, marginTop:2 }}>Where elite traders agree — that's your signal.</p>
      </div>

      {/* Stats bar */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:12, marginBottom:24 }}>
        <StatCard label="Consensus Signals" value="6" sub="Active now" color="var(--gold)" />
        <StatCard label="Traders Aligned" value="4.2" sub="avg per signal" color="var(--cyan)" />
        <StatCard label="Top Asset" value="BTC" sub="70% of elite traders" trend="up" color="var(--green)" />
        <StatCard label="Signal Accuracy" value="73%" sub="Last 90 days" color="var(--purple)" />
      </div>

      {/* Filter tabs */}
      <div style={{ display:"flex", gap:6, marginBottom:20, borderBottom:"1px solid var(--border)", paddingBottom:12 }}>
        {[["all","All Signals"],["trending","📈 Trending"],["high-conv","🎯 High Conviction"],["watch","👁 Watch List"]].map(([k,l]) => (
          <button key={k} onClick={()=>setTab(k)} style={{
            padding:"7px 14px", fontSize:12, fontWeight:700, fontFamily:"var(--font-display)", cursor:"pointer",
            background: tab===k ? "rgba(245,166,35,.10)" : "transparent",
            color: tab===k ? "var(--gold)" : "var(--text-2)",
            border: "none", borderRadius:6,
          }}>{l}</button>
        ))}
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        {CONSENSUS.filter(c => tab==="all" || c.category===tab).map((c,i) => (
          <ConsensusCard key={i} item={c} />
        ))}
        {CONSENSUS.filter(c => tab==="all" || c.category===tab).length === 0 &&
          <div style={{ textAlign:"center", padding:60, color:"var(--text-3)" }}>No signals in this category.</div>
        }
      </div>
    </div>
  );
}

function ConsensusCard({ item: c }) {
  const asset = ASSETS.find(a => a.symbol === c.asset) || {};
  const convColor = { high:"var(--gold)", medium:"var(--cyan)", low:"var(--text-3)" }[c.conviction];
  const traders = TRADERS.filter(t => c.traders.includes(t.id));

  return (
    <div className="card card-glow" style={{ padding:"20px 22px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12, flexWrap:"wrap" }}>
        <div style={{ display:"flex", gap:16, alignItems:"center" }}>
          <div style={{ width:52, height:52, borderRadius:10, background:"var(--bg-surface)", border:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span className="syne" style={{ fontWeight:800, fontSize:16, color:"var(--gold)" }}>{c.asset}</span>
          </div>
          <div>
            <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:4 }}>
              <span className="syne" style={{ fontSize:17, fontWeight:700 }}>{c.asset}</span>
              <span style={{ color: asset.positive ? "var(--green)" : "var(--red)", fontSize:13 }} className="mono">{asset.change}</span>
              <span className={`tag tag-${c.conviction === "high" ? "gold" : c.conviction === "medium" ? "cyan" : "purple"}`}>
                {c.conviction.toUpperCase()} CONVICTION
              </span>
            </div>
            <p style={{ color:"var(--text-2)", fontSize:13 }}>{c.sentiment} · Target: <span style={{ color:"var(--green)" }}>{c.targetUp}</span></p>
          </div>
        </div>
        <div style={{ textAlign:"right" }}>
          <p className="mono" style={{ fontSize:28, fontWeight:500, color:convColor }}>{c.pctTraders}%</p>
          <p style={{ fontSize:11, color:"var(--text-3)" }}>of elite traders</p>
        </div>
      </div>

      {/* Progress */}
      <div style={{ margin:"16px 0 12px" }}>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width:`${c.pctTraders}%`, background:`linear-gradient(90deg,${convColor},${convColor}88)` }} />
        </div>
      </div>

      {/* AI reason */}
      <div style={{ background:"var(--bg-surface)", border:"1px solid var(--border)", borderRadius:8, padding:"12px 14px", marginBottom:14 }}>
        <p style={{ fontSize:11, fontWeight:700, color:"var(--text-3)", fontFamily:"var(--font-display)", letterSpacing:".5px", marginBottom:4 }}>🤖 AI ANALYSIS</p>
        <p style={{ fontSize:13, color:"var(--text-2)", lineHeight:1.6 }}>{c.reason}</p>
      </div>

      {/* Trader avatars */}
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ display:"flex" }}>
          {traders.map((t,i) => (
            <div key={t.id} style={{ marginLeft: i===0 ? 0 : -10, zIndex:10-i }}>
              <Avatar name={t.avatar} size={28} />
            </div>
          ))}
        </div>
        <p style={{ fontSize:12, color:"var(--text-3)" }}>
          {traders.map(t=>t.name).join(", ")}
        </p>
      </div>
    </div>
  );
}

// ── COPY STRATEGY BUILDER ─────────────────────
function CopyBuilder({ user }) {
  const [capital, setCapital] = useState(10000);
  const [mode, setMode] = useState("balanced");
  const [allocations, setAllocations] = useState({ 1:30, 4:25, 8:25, 2:20 });
  const [showAll, setShowAll] = useState(false);

  const selectedTraders = Object.keys(allocations).map(id => TRADERS.find(t=>t.id===parseInt(id))).filter(Boolean);
  const totalAlloc = Object.values(allocations).reduce((a,b)=>a+b,0);

  const projected = {
    aggressive: { ret:"+42%", risk:"High", color:"var(--red)" },
    balanced:   { ret:"+28%", risk:"Medium", color:"var(--gold)" },
    conservative:{ ret:"+15%", risk:"Low", color:"var(--green)" },
  }[mode];

  const projectedGain = capital * (parseFloat(projected.ret)/100);

  const addTrader = (id) => {
    if (allocations[id]) return;
    const remaining = 100 - totalAlloc;
    if (remaining <= 0) return;
    setAllocations(prev => ({ ...prev, [id]: Math.min(20, remaining) }));
  };

  const removeTrader = (id) => {
    const next = { ...allocations };
    delete next[id];
    setAllocations(next);
  };

  const pieData = selectedTraders.map(t => ({ name: t.name, value: allocations[t.id] }));
  const PIE_COLORS = ["#F5A623","#00D4FF","#00E676","#9B5DE5","#FF3D57"];

  return (
    <div className="anim-fade-in">
      <div style={{ marginBottom:24 }}>
        <h2 className="syne" style={{ fontSize:24, fontWeight:800 }}>Copy Strategy Builder</h2>
        <p style={{ color:"var(--text-2)", fontSize:13, marginTop:2 }}>Allocate capital across traders. Set your risk profile. Launch.</p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:20, alignItems:"start" }}>
        {/* Left column */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {/* Capital + mode */}
          <div className="card" style={{ padding:"22px 24px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20, flexWrap:"wrap", gap:12 }}>
              <div>
                <p style={{ fontSize:11, fontWeight:700, color:"var(--text-3)", fontFamily:"var(--font-display)", letterSpacing:".7px", marginBottom:6 }}>CAPITAL TO DEPLOY</p>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span className="mono" style={{ fontSize:28, fontWeight:500, color:"var(--gold)" }}>${capital.toLocaleString()}</span>
                </div>
              </div>
              <div style={{ display:"flex", gap:6 }}>
                {["conservative","balanced","aggressive"].map(m => (
                  <button key={m} onClick={()=>setMode(m)} style={{
                    padding:"8px 14px", fontSize:12, fontWeight:700, fontFamily:"var(--font-display)",
                    borderRadius:8, cursor:"pointer", border:"none",
                    background: mode===m ? (m==="conservative"?"rgba(0,230,118,.15)":m==="balanced"?"rgba(245,166,35,.15)":"rgba(255,61,87,.15)") : "var(--bg-surface)",
                    color: mode===m ? (m==="conservative"?"var(--green)":m==="balanced"?"var(--gold)":"var(--red)") : "var(--text-3)",
                    transition:"all .15s", textTransform:"capitalize",
                  }}>{m}</button>
                ))}
              </div>
            </div>
            <input type="range" min={1000} max={100000} step={500} value={capital} onChange={e=>setCapital(+e.target.value)} />
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:6, fontSize:11, color:"var(--text-3)" }}>
              <span>$1,000</span><span>$100,000</span>
            </div>
          </div>

          {/* Allocations */}
          <div className="card" style={{ padding:"22px 24px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <p className="syne" style={{ fontWeight:700 }}>Allocation ({totalAlloc}% used)</p>
              <div style={{ width:80, height:6, borderRadius:3, background:"var(--bg-surface)", overflow:"hidden" }}>
                <div style={{ width:`${totalAlloc}%`, height:"100%", background: totalAlloc>100?"var(--red)":"linear-gradient(90deg,var(--gold),var(--cyan))", transition:"width .3s" }} />
              </div>
            </div>
            {selectedTraders.map(t => (
              <div key={t.id} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
                <Avatar name={t.avatar} size={32} />
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                    <span style={{ fontSize:13, fontWeight:600 }}>{t.name}</span>
                    <span className="mono" style={{ fontSize:13, color:"var(--gold)" }}>{allocations[t.id]}%</span>
                  </div>
                  <input type="range" min={5} max={60} step={5} value={allocations[t.id]}
                    onChange={e=>setAllocations(prev=>({...prev,[t.id]:+e.target.value}))} />
                </div>
                <button className="btn-ghost" style={{ padding:"2px 8px", fontSize:16, color:"var(--red)" }} onClick={()=>removeTrader(t.id)}>×</button>
              </div>
            ))}
            <button className="btn-outline" style={{ width:"100%", padding:"10px 0", fontSize:13, marginTop:4 }}
              onClick={()=>setShowAll(s=>!s)}>
              + Add Trader
            </button>
            {showAll && (
              <div style={{ marginTop:12, display:"flex", flexDirection:"column", gap:6 }}>
                {TRADERS.filter(t=>!allocations[t.id]).map(t => (
                  <div key={t.id} className="card" onClick={()=>{ addTrader(t.id); setShowAll(false); }}
                    style={{ padding:"10px 14px", cursor:"pointer", display:"flex", alignItems:"center", gap:10 }}>
                    <Avatar name={t.avatar} size={30} />
                    <span style={{ flex:1, fontSize:13 }}>{t.name}</span>
                    <TrustRing score={t.score} size={34} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column – projections */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div className="card" style={{ padding:"22px 24px", border:"1px solid var(--gold)33" }}>
            <p style={{ fontSize:11, fontWeight:700, color:"var(--text-3)", fontFamily:"var(--font-display)", letterSpacing:".7px", marginBottom:16 }}>PROJECTED OUTCOME</p>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div>
                <p style={{ fontSize:12, color:"var(--text-2)", marginBottom:4 }}>Expected Return ({mode})</p>
                <p className="mono" style={{ fontSize:32, fontWeight:500, color:"var(--green)" }}>{projected.ret}</p>
              </div>
              <div>
                <p style={{ fontSize:12, color:"var(--text-2)", marginBottom:4 }}>Projected Gain</p>
                <p className="mono" style={{ fontSize:22, color:"var(--gold)" }}>+${projectedGain.toLocaleString(undefined,{maximumFractionDigits:0})}</p>
              </div>
              <div>
                <p style={{ fontSize:12, color:"var(--text-2)", marginBottom:4 }}>Risk Level</p>
                <span className={`tag tag-${projected.risk==="Low"?"green":projected.risk==="Medium"?"gold":"red"}`} style={{ fontSize:12 }}>{projected.risk}</span>
              </div>
              <div style={{ height:1, background:"var(--border)" }} />
              <div>
                <p style={{ fontSize:12, color:"var(--text-2)", marginBottom:8 }}>Capital split</p>
                {selectedTraders.map(t=>{
                  const amt = capital * (allocations[t.id]/100);
                  return (
                    <div key={t.id} style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:6, color:"var(--text-2)" }}>
                      <span>{t.name}</span>
                      <span className="mono" style={{ color:"var(--text-1)" }}>${amt.toLocaleString(undefined,{maximumFractionDigits:0})}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Pie chart */}
          <div className="card" style={{ padding:"18px" }}>
            <p style={{ fontSize:11, fontWeight:700, color:"var(--text-3)", fontFamily:"var(--font-display)", letterSpacing:".7px", marginBottom:8 }}>ALLOCATION PIE</p>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" paddingAngle={3}>
                  {pieData.map((_,i) => <Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]} />)}
                </Pie>
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:11, color:"var(--text-2)" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <button className="btn-gold" style={{ padding:"14px 0", fontSize:15, width:"100%" }}>
            🚀 Launch Strategy
          </button>
          <p style={{ fontSize:11, color:"var(--text-3)", textAlign:"center", lineHeight:1.5 }}>
            Projections are estimates only. Past performance does not guarantee future results.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── ALERTS ────────────────────────────────────
function AlertsPage({ user }) {
  const [alerts, setAlerts] = useState(ALERTS);
  const [filter, setFilter] = useState("all");
  const [notifEnabled, setNotifEnabled] = useState(true);

  const filtered = alerts.filter(a => filter === "all" || a.type === filter);
  const unread = alerts.filter(a=>!a.read).length;

  const markRead = (id) => setAlerts(prev => prev.map(a => a.id===id ? {...a,read:true} : a));
  const markAllRead = () => setAlerts(prev => prev.map(a=>({...a,read:true})));

  return (
    <div className="anim-fade-in">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24, flexWrap:"wrap", gap:12 }}>
        <div>
          <h2 className="syne" style={{ fontSize:24, fontWeight:800 }}>Alerts & Signals</h2>
          <p style={{ color:"var(--text-2)", fontSize:13, marginTop:2 }}>Real-time moves from top traders. <span style={{ color:"var(--gold)" }}>{unread} unread</span></p>
        </div>
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          <label className="switch" title="Push Notifications">
            <input type="checkbox" checked={notifEnabled} onChange={e=>setNotifEnabled(e.target.checked)} />
            <span className="switch-slider" />
          </label>
          <span style={{ fontSize:12, color:"var(--text-2)" }}>Push alerts</span>
          <button className="btn-ghost" style={{ padding:"7px 14px", fontSize:12 }} onClick={markAllRead}>
            Mark all read
          </button>
        </div>
      </div>

      {/* Signal strength stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:20 }}>
        {[["🔥 Strong Signals", alerts.filter(a=>a.strength==="strong").length, "var(--gold)"],
          ["⚡ Medium Signals", alerts.filter(a=>a.strength==="medium").length, "var(--cyan)"],
          ["📡 Weak Signals",  alerts.filter(a=>a.strength==="weak").length,   "var(--text-3)"]].map(([l,v,c])=>(
          <div key={l} className="card" style={{ padding:"14px 18px" }}>
            <p style={{ fontSize:12, color:"var(--text-2)", marginBottom:4 }}>{l}</p>
            <p className="mono" style={{ fontSize:24, color:c }}>{v}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ display:"flex", gap:6, marginBottom:16 }}>
        {["all","entry","exit","signal"].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{
            padding:"6px 14px", fontSize:12, fontWeight:700, fontFamily:"var(--font-display)",
            background: filter===f?"rgba(245,166,35,.10)":"transparent",
            color: filter===f?"var(--gold)":"var(--text-2)",
            border:"none", borderRadius:6, cursor:"pointer", textTransform:"capitalize"
          }}>{f==="all"?"All":f==="entry"?"Entries":"Exits"}</button>
        ))}
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {filtered.map(a => (
          <div key={a.id} className="card" onClick={()=>markRead(a.id)} style={{
            padding:"16px 20px", cursor:"pointer",
            background: a.read ? "var(--bg-card)" : "linear-gradient(90deg,rgba(245,166,35,.04),var(--bg-card))",
            borderLeft: a.read ? "1px solid var(--border)" : "3px solid var(--gold)",
            display:"flex", alignItems:"center", gap:14, flexWrap:"wrap"
          }}>
            <div style={{ fontSize:24 }}>
              {a.type==="entry" ? "📈" : a.type==="exit" ? "📉" : "📡"}
            </div>
            <div style={{ flex:1, minWidth:200 }}>
              <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:4, flexWrap:"wrap" }}>
                <span className="syne" style={{ fontWeight:700, fontSize:14, color: a.read?"var(--text-2)":"var(--text-1)" }}>{a.asset}</span>
                <SignalBadge strength={a.strength} />
                {!a.read && <span style={{ width:7, height:7, borderRadius:"50%", background:"var(--gold)", display:"inline-block" }} className="pulse-dot" />}
              </div>
              <p style={{ fontSize:13, color:"var(--text-2)", lineHeight:1.5 }}>{a.msg}</p>
              <div style={{ display:"flex", gap:6, marginTop:6 }}>
                {TRADERS.filter(t=>a.traders.includes(t.id)).map(t=>(
                  <span key={t.id} style={{ fontSize:11, background:"var(--bg-surface)", border:"1px solid var(--border)", borderRadius:4, padding:"2px 8px", color:"var(--text-3)" }}>{t.name}</span>
                ))}
              </div>
            </div>
            <span style={{ fontSize:12, color:"var(--text-3)", flexShrink:0 }}>{a.time}</span>
          </div>
        ))}
      </div>

      {!user?.plan === "pro" && (
        <div className="card" style={{ padding:24, textAlign:"center", marginTop:12 }}>
          <p className="syne" style={{ fontWeight:700, marginBottom:6 }}>🔒 Real-Time Alerts require Pro</p>
          <button className="btn-gold" style={{ padding:"10px 24px", fontSize:14 }}>Upgrade to Pro</button>
        </div>
      )}
    </div>
  );
}

// ── PORTFOLIO SIMULATOR ───────────────────────
function PortfolioSim({ user }) {
  const [selectedTraders, setSelectedTraders] = useState([1,4,8]);
  const [capital, setCapital] = useState(10000);
  const [view, setView] = useState("combined");

  const combinedData = PERF_DATA.map(d => ({ ...d,
    gain: d.portfolio - 10000,
    gainPct: ((d.portfolio - 10000)/10000*100).toFixed(1)
  }));

  const finalVal = PERF_DATA[PERF_DATA.length-1].portfolio;
  const totalReturn = ((finalVal - 10000)/10000*100).toFixed(1);
  const scaledFinal = capital * (finalVal/10000);
  const scaledGain = scaledFinal - capital;

  const toggleTrader = (id) => {
    setSelectedTraders(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev,id]);
  };

  return (
    <div className="anim-fade-in">
      <div style={{ marginBottom:24 }}>
        <h2 className="syne" style={{ fontSize:24, fontWeight:800 }}>Portfolio Simulator</h2>
        <p style={{ color:"var(--text-2)", fontSize:13, marginTop:2 }}>Backtest your strategy. See how it would have performed in 2024.</p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:12, marginBottom:24 }}>
        <StatCard label="Simulated Return" value={`+${totalReturn}%`} sub="vs S&P +19%" trend="up" color="var(--green)" />
        <StatCard label="Peak Value" value={"$"+(capital*(22800/10000)).toLocaleString(undefined,{maximumFractionDigits:0})} sub="at Dec" color="var(--gold)" />
        <StatCard label="vs BTC" value="+3.2%" sub="Outperforming" trend="up" color="var(--cyan)" />
        <StatCard label="Max Drawdown" value="-9.4%" sub="Jun–Jul period" trend="down" color="var(--red)" />
      </div>

      {/* Controls */}
      <div className="card" style={{ padding:"20px 22px", marginBottom:20 }}>
        <div style={{ display:"flex", gap:20, flexWrap:"wrap", alignItems:"center" }}>
          <div style={{ flex:1, minWidth:200 }}>
            <p style={{ fontSize:11, color:"var(--text-3)", fontWeight:700, fontFamily:"var(--font-display)", marginBottom:8 }}>STARTING CAPITAL</p>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <span className="mono" style={{ fontSize:20, color:"var(--gold)", minWidth:90 }}>${capital.toLocaleString()}</span>
              <input type="range" min={1000} max={100000} step={1000} value={capital} onChange={e=>setCapital(+e.target.value)} style={{ flex:1 }} />
            </div>
          </div>
          <div>
            <p style={{ fontSize:11, color:"var(--text-3)", fontWeight:700, fontFamily:"var(--font-display)", marginBottom:8 }}>SELECT TRADERS</p>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {TRADERS.slice(0,6).map(t => (
                <button key={t.id} onClick={()=>toggleTrader(t.id)} style={{
                  padding:"5px 11px", fontSize:11, fontWeight:700, fontFamily:"var(--font-display)",
                  borderRadius:6, cursor:"pointer",
                  background: selectedTraders.includes(t.id) ? "rgba(245,166,35,.12)" : "var(--bg-surface)",
                  color: selectedTraders.includes(t.id) ? "var(--gold)" : "var(--text-3)",
                  border: `1px solid ${selectedTraders.includes(t.id)?"var(--gold)44":"var(--border)"}`,
                }}>{t.name.slice(0,6)}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="card" style={{ padding:"22px 24px", marginBottom:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, flexWrap:"wrap", gap:8 }}>
          <p className="syne" style={{ fontWeight:700, fontSize:15 }}>Performance vs Benchmarks</p>
          <div style={{ display:"flex", gap:6 }}>
            {["combined","individual"].map(v=>(
              <button key={v} onClick={()=>setView(v)} style={{
                padding:"5px 12px", fontSize:11, fontWeight:700, fontFamily:"var(--font-display)",
                background: view===v?"rgba(0,212,255,.10)":"transparent",
                color: view===v?"var(--cyan)":"var(--text-3)",
                border:`1px solid ${view===v?"var(--cyan)44":"var(--border)"}`,
                borderRadius:6, cursor:"pointer", textTransform:"capitalize"
              }}>{v}</button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={PERF_DATA.map(d=>({...d,
            portfolio: Math.round(d.portfolio*(capital/10000)),
            sp500: Math.round(d.sp500*(capital/10000)),
            btc: Math.round(d.btc*(capital/10000)),
          }))}>
            <defs>
              <linearGradient id="gPort" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#F5A623" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#F5A623" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="gSP" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#4A6080" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#4A6080" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="gBTC" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#00D4FF" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#00D4FF" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" tick={{ fill:"var(--text-3)", fontSize:11 }} />
            <YAxis tick={{ fill:"var(--text-3)", fontSize:11 }} tickFormatter={v=>"$"+Math.round(v/1000)+"k"} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="portfolio" stroke="var(--gold)" fill="url(#gPort)" strokeWidth={2.5} name="TradeMirror" />
            <Area type="monotone" dataKey="sp500"     stroke="var(--text-3)" fill="url(#gSP)"  strokeWidth={1.5} name="S&P 500" strokeDasharray="5 3" />
            <Area type="monotone" dataKey="btc"       stroke="var(--cyan)"   fill="url(#gBTC)" strokeWidth={1.5} name="BTC HODL" strokeDasharray="3 3" />
            <Legend wrapperStyle={{ fontSize:12, color:"var(--text-2)", paddingTop:12 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly breakdown */}
      <div className="card" style={{ padding:"22px 24px" }}>
        <p className="syne" style={{ fontWeight:700, fontSize:15, marginBottom:16 }}>Monthly P&L Breakdown</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={PERF_DATA.map((d,i,arr)=>({
            month:d.month,
            pnl: i===0 ? 0 : Math.round((d.portfolio-arr[i-1].portfolio)*(capital/10000)),
          })).slice(1)}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="month" tick={{ fill:"var(--text-3)", fontSize:11 }} />
            <YAxis tick={{ fill:"var(--text-3)", fontSize:11 }} tickFormatter={v=>"$"+v.toLocaleString()} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="pnl" name="Monthly P&L" radius={[4,4,0,0]}>
              {PERF_DATA.slice(1).map((d,i,arr)=>(
                <Cell key={i} fill={d.portfolio>(i===0?10000:PERF_DATA[i].portfolio) ? "var(--green)" : "var(--red)"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ── MAIN APP ───────────────────────────────────
function App({ user, onLogout }) {
  const [tab, setTab] = useState("dashboard");

  const tabs = [
    { id:"dashboard", icon:"⚡", label:"Dashboard"   },
    { id:"leaderboard",icon:"🏆",label:"Leaderboard" },
    { id:"consensus",  icon:"🧠",label:"Consensus"   },
    { id:"builder",    icon:"🔧",label:"Strategy"    },
    { id:"alerts",     icon:"🔔",label:"Alerts",     badge: ALERTS.filter(a=>!a.read).length },
    { id:"simulator",  icon:"📈",label:"Simulator"   },
  ];

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column" }}>
      {/* TOP NAV */}
      <header style={{
        position:"sticky", top:0, zIndex:50,
        background:"rgba(8,12,20,.92)", backdropFilter:"blur(12px)",
        borderBottom:"1px solid var(--border)",
        padding:"0 20px", display:"flex", alignItems:"center", gap:12, height:56,
      }}>
        <span className="syne" style={{ fontWeight:800, fontSize:18, color:"var(--gold)", marginRight:8, flexShrink:0 }}>
          TradeMirror<span style={{ color:"var(--text-2)", fontWeight:400 }}> Pro</span>
        </span>

        {/* Ticker mini */}
        <div style={{ flex:1, overflow:"hidden", display:"flex", gap:0 }}>
          <div className="ticker-wrap" style={{ maxWidth:600 }}>
            <div className="ticker-inner">
              {[...ASSETS,...ASSETS].map((a,i) => (
                <span key={i} className="mono" style={{ padding:"0 16px", fontSize:11, color: a.positive?"var(--green)":"var(--red)" }}>
                  <span style={{ color:"var(--text-3)", marginRight:4 }}>{a.symbol}</span>{a.price} {a.change}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display:"flex", gap:8, alignItems:"center", flexShrink:0 }}>
          <span className="tag tag-gold" style={{ fontSize:11 }}>
            {user.plan === "pro" ? "PRO" : "FREE"}
          </span>
          <Avatar name={user.name.slice(0,2)} size={32} />
          <button className="btn-ghost" style={{ padding:"6px 10px", fontSize:12 }} onClick={onLogout}>
            Sign Out
          </button>
        </div>
      </header>

      <div style={{ display:"flex", flex:1 }}>
        {/* SIDEBAR */}
        <nav style={{
          width:200, flexShrink:0,
          background:"var(--bg-card)", borderRight:"1px solid var(--border)",
          padding:"16px 10px", display:"flex", flexDirection:"column", gap:4,
          position:"sticky", top:56, height:"calc(100vh - 56px)", overflowY:"auto",
        }}>
          {tabs.map(t => (
            <button key={t.id} className={`nav-tab ${tab===t.id?"active":""}`}
              onClick={()=>setTab(t.id)} style={{ justifyContent:"flex-start", position:"relative" }}>
              <span style={{ fontSize:16 }}>{t.icon}</span>
              {t.label}
              {t.badge > 0 && (
                <span style={{ marginLeft:"auto", background:"var(--gold)", color:"#080C14", borderRadius:10, padding:"1px 6px", fontSize:10, fontWeight:700, fontFamily:"var(--font-display)" }}>
                  {t.badge}
                </span>
              )}
            </button>
          ))}

          <div style={{ flex:1 }} />

          {user.plan !== "pro" && (
            <div style={{ background:"linear-gradient(145deg,rgba(245,166,35,.08),rgba(245,166,35,.03))", border:"1px solid rgba(245,166,35,.2)", borderRadius:10, padding:"14px 12px", marginTop:8 }}>
              <p className="syne" style={{ fontSize:12, fontWeight:700, color:"var(--gold)", marginBottom:4 }}>Upgrade to Pro</p>
              <p style={{ fontSize:11, color:"var(--text-3)", marginBottom:10, lineHeight:1.5 }}>Real-time alerts, all traders, advanced analytics</p>
              <button className="btn-gold" style={{ width:"100%", padding:"8px 0", fontSize:12 }}>$29/mo</button>
            </div>
          )}
        </nav>

        {/* MAIN CONTENT */}
        <main style={{ flex:1, overflowY:"auto", padding:"28px 28px" }}>
          {tab === "dashboard"   && <Dashboard user={user} setTab={setTab} />}
          {tab === "leaderboard" && <Leaderboard user={user} />}
          {tab === "consensus"   && <ConsensusEngine user={user} />}
          {tab === "builder"     && <CopyBuilder user={user} />}
          {tab === "alerts"      && <AlertsPage user={user} />}
          {tab === "simulator"   && <PortfolioSim user={user} />}
        </main>
      </div>
    </div>
  );
}

// ── DASHBOARD ─────────────────────────────────
function Dashboard({ user, setTab }) {
  const topTraders = TRADERS.sort((a,b)=>b.score-a.score).slice(0,4);
  const topConsensus = CONSENSUS.slice(0,3);
  const recentAlerts = ALERTS.slice(0,4);

  return (
    <div className="anim-fade-in">
      {/* Welcome */}
      <div style={{ marginBottom:28 }}>
        <h1 className="syne" style={{ fontSize:26, fontWeight:800 }}>
          Good morning, {user.name.split(" ")[0]} 👋
        </h1>
        <p style={{ color:"var(--text-2)", fontSize:14, marginTop:4 }}>
          Here's your edge for today. <span style={{ color:"var(--gold)" }}>4 strong signals</span> detected across top traders.
        </p>
      </div>

      {/* Stats row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:12, marginBottom:28 }}>
        <StatCard label="Active Signals"    value="4"      sub="↑2 since yesterday" trend="up"   color="var(--gold)"   />
        <StatCard label="Consensus Assets"  value="6"      sub="BTC leading"                     color="var(--cyan)"   />
        <StatCard label="Top Trader Score"  value="91"     sub="QuantumEdge"                      color="var(--green)"  />
        <StatCard label="Your Portfolio"    value="+128%"  sub="simulated YTD"      trend="up"   color="var(--gold)"   />
      </div>

      {/* Main grid */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:20, marginBottom:20 }}>
        {/* Perf chart */}
        <div className="card" style={{ padding:"20px 22px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <p className="syne" style={{ fontWeight:700, fontSize:15 }}>Portfolio Performance</p>
            <span className="tag tag-green">+128% YTD</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={PERF_DATA}>
              <defs>
                <linearGradient id="gD" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#F5A623" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#F5A623" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fill:"var(--text-3)", fontSize:10 }} />
              <YAxis tick={{ fill:"var(--text-3)", fontSize:10 }} tickFormatter={v=>"$"+Math.round(v/1000)+"k"} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="portfolio" stroke="var(--gold)" fill="url(#gD)" strokeWidth={2.5} name="Portfolio" />
              <Area type="monotone" dataKey="sp500" stroke="var(--text-3)" fill="none" strokeWidth={1.5} name="S&P 500" strokeDasharray="4 3" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Alerts panel */}
        <div className="card" style={{ padding:"20px 22px", overflow:"hidden" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <p className="syne" style={{ fontWeight:700, fontSize:15 }}>Live Alerts</p>
            <button className="btn-ghost" style={{ padding:"4px 8px", fontSize:12 }} onClick={()=>setTab("alerts")}>View all →</button>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {recentAlerts.map(a => (
              <div key={a.id} style={{
                background:"var(--bg-surface)", borderRadius:8, padding:"10px 12px",
                borderLeft: a.read?"none":`3px solid var(--gold)`,
                paddingLeft: a.read?12:10,
              }}>
                <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:3 }}>
                  <span style={{ fontSize:14 }}>{a.type==="entry"?"📈":"📉"}</span>
                  <span className="syne" style={{ fontWeight:700, fontSize:13 }}>{a.asset}</span>
                  <SignalBadge strength={a.strength} />
                </div>
                <p style={{ fontSize:11, color:"var(--text-3)", lineHeight:1.4 }}>{a.msg.slice(0,60)}...</p>
                <p style={{ fontSize:10, color:"var(--text-3)", marginTop:4 }}>{a.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Consensus + Leaderboard */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        {/* Top consensus */}
        <div className="card" style={{ padding:"20px 22px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <p className="syne" style={{ fontWeight:700, fontSize:15 }}>🧠 Trending Among Traders</p>
            <button className="btn-ghost" style={{ padding:"4px 8px", fontSize:12 }} onClick={()=>setTab("consensus")}>More →</button>
          </div>
          {topConsensus.map((c,i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom: i<2?"1px solid var(--border)":"none" }}>
              <div style={{ width:40, height:40, borderRadius:8, background:"var(--bg-surface)", border:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span className="syne" style={{ fontWeight:800, fontSize:13, color:"var(--gold)" }}>{c.asset}</span>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <span style={{ fontWeight:600, fontSize:13 }}>{c.asset}</span>
                  <span className="mono" style={{ color:"var(--green)", fontSize:13 }}>{c.targetUp}</span>
                </div>
                <div style={{ marginTop:4 }}>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width:`${c.pctTraders}%`, background:"linear-gradient(90deg,var(--gold),var(--cyan))" }} />
                  </div>
                </div>
                <p style={{ fontSize:10, color:"var(--text-3)", marginTop:3 }}>{c.pctTraders}% of top traders</p>
              </div>
            </div>
          ))}
        </div>

        {/* Top traders */}
        <div className="card" style={{ padding:"20px 22px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <p className="syne" style={{ fontWeight:700, fontSize:15 }}>🏆 Top Traders</p>
            <button className="btn-ghost" style={{ padding:"4px 8px", fontSize:12 }} onClick={()=>setTab("leaderboard")}>Full board →</button>
          </div>
          {topTraders.map((t,i) => (
            <div key={t.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"9px 0", borderBottom: i<3?"1px solid var(--border)":"none" }}>
              <span className="mono" style={{ fontSize:11, color:"var(--text-3)", minWidth:14 }}>#{i+1}</span>
              <Avatar name={t.avatar} size={34} />
              <div style={{ flex:1 }}>
                <p style={{ fontWeight:600, fontSize:13 }}>{t.name}</p>
                <p style={{ fontSize:11, color:"var(--text-3)" }}>{t.specialty}</p>
              </div>
              <TrustRing score={t.score} size={38} />
              <span className="mono" style={{ fontSize:13, color:"var(--green)", minWidth:52, textAlign:"right" }}>{t.returns}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ROOT
───────────────────────────────────────────── */
export default function TradeMirrorPro() {
  const [view, setView] = useState("landing"); // landing | auth | app
  const [user, setUser] = useState(null);

  return (
    <>
      <StyleInjector />
      {view === "landing" && <LandingPage onEnter={() => setView("auth")} />}
      {view === "auth"    && <AuthPage onAuth={u => { setUser(u); setView("app"); }} />}
      {view === "app"     && user && <App user={user} onLogout={() => { setUser(null); setView("landing"); }} />}
    </>
  );
}
