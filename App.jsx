import { useState, useEffect, useRef, useMemo } from "react";

/* ═══ DATA ══════════════════════════════════════════════════════════ */
const C = [
  { n:"Vietnam",     s:171,   b:2.6,  g:3760,  democ:0, o:5 },
  { n:"Korea",       s:2763,  b:12.4, g:31950, democ:1, o:5 },
  { n:"Taiwan",      s:1450,  b:7.0,  g:29000, democ:1, o:5 },
  { n:"Kuba",        s:971,   b:5.3,  g:8820,  democ:0, o:4 },
  { n:"Selandia Br.",s:3680,  b:2.6,  g:43600, democ:1, o:4 },
  { n:"Jerman",      s:5986,  b:8.0,  g:46700, democ:1, o:3 },
  { n:"Indonesia",   s:112,   b:1.0,  g:4290,  democ:1, o:3, id:"IDN" },
  { n:"Bangladesh",  s:88,    b:0.8,  g:2227,  democ:0, o:3 },
  { n:"Nigeria",     s:72,    b:0.5,  g:2085,  democ:1, o:3 },
  { n:"Pakistan",    s:44,    b:0.6,  g:1388,  democ:1, o:3 },
  { n:"Singapura",   s:2800,  b:2.5,  g:65000, democ:0, o:3 },
  { n:"India",       s:267,   b:0.5,  g:2277,  democ:1, o:2 },
  { n:"Brazil",      s:1116,  b:2.2,  g:8717,  democ:1, o:2 },
  { n:"Meksiko",     s:524,   b:1.0,  g:10118, democ:1, o:2 },
  { n:"Rusia",       s:820,   b:8.0,  g:12195, democ:0, o:2 },
  { n:"Latvia",      s:1270,  b:5.5,  g:18200, democ:1, o:2 },
  { n:"UK",          s:4356,  b:2.5,  g:42380, democ:1, o:2 },
  { n:"Perancis",    s:4965,  b:5.8,  g:43800, democ:1, o:2 },
  { n:"Italia",      s:3255,  b:3.2,  g:33800, democ:1, o:2 },
  { n:"AS",          s:11072, b:2.9,  g:63500, democ:1, o:1 },
  { n:"Peru",        s:650,   b:1.6,  g:6500,  democ:1, o:1 },
];
const OC={5:"#166534",4:"#166534",3:"#92400e",2:"#9a3412",1:"#991b1b"};
const OF={5:"#bbf7d0",4:"#d1fae5",3:"#fef3c7",2:"#fed7aa",1:"#fecaca"};

const QS = [
  {
    id:"q1", num:"01",
    verdict:"Efficiency Gap",
    verdictFull:"Efficiency Gap in Health Resource Mobilization",
    verdictSub:"r ≈ −0.12, (ns)",
    question:"Mengapa uang triliunan dolar gagal membeli keselamatan nyawa?",
    challenge:"Korelasi antara belanja kesehatan dan outcome pandemi dalam dataset ini bernilai negatif. Bukan nol — negatif. Ini bukti Allocative Inefficiency sistemis.",
    pullStat:"64×",
    pullText:"lebih besar pengeluaran AS dibanding Vietnam — selisih yang tidak menghasilkan perbedaan outcome.",
    premise:"Setiap dolar tambahan dianggap investasi dalam keselamatan kolektif.",
    dataNote:"AS menghabiskan $11k/kapita namun mencatat outcome terburuk (★). Vietnam dengan $171 menang mutlak (★★★★★).",
    interpret:"Anggaran besar hanya memperkuat fasilitas elit jika distribusi timpang. Struktur ekopolitik mendahului kapasitas fiskal.",
    indonesiaNote:"Indonesia ($112/kapita) mencapai outcome moderat (★★★) berkat jaringan Puskesmas dan tradisi gotong royong.",
    anchors:["Marmot Review","Commercial Det. of Health","Allocative Efficiency"],
    accent:"#be123c", accentLight:"#fff1f2",
    xKey:"s", xLog:true, xLabel:"Pengeluaran USD/kapita (log)",
    ann:[{n:"AS",label:"AS·$11k",side:"right",dy:-18},{n:"Vietnam",label:"Vietnam·$171",side:"left",dy:16},{n:"Indonesia",label:"Indo·$112",side:"right",dy:22,isIDN:true}],
  },
  {
    id:"q2", num:"02",
    verdict:"Technocratic Fallacy",
    verdictFull:"The Fallacy of Technocratic Solutionism",
    verdictSub:"r ≈ +0.11, (ns)",
    question:"Apakah tempat tidur rumah sakit cukup untuk menahan pandemi?",
    challenge:"Rusia mewarisi 8,0 bed/1.000 jiwa — salah satu tertinggi di dunia. Tapi rakyat tidak percaya pada vaksin negara sendiri.",
    pullStat:"50%",
    pullText:"cakupan vaksinasi Rusia. Tanpa kepercayaan, teknologi terbaik pun tak berguna.",
    premise:"Kesuksesan diukur dari rasio tempat tidur dan kecanggihan alat medis.",
    dataNote:"Rusia (8,0 bed) → ★★☆☆☆. Korea (12,4 bed) → ★★★★★. Korelasi fisik r ≈ +0.11 (ns).",
    interpret:"Rumah sakit tidak berguna jika rakyat tidak percaya pada pengelolanya. Legitimasi sosial melampaui audit fisik.",
    indonesiaNote:"Bidan desa dan kader Posyandu membangun 'infrastruktur lunak' yang menentukan saat krisis.",
    anchors:["State Capacity · Fukuyama","Political Trust","The Lancet"],
    accent:"#c2410c", accentLight:"#fff7ed",
    xKey:"b", xLog:false, xLabel:"Bed per 1.000 Penduduk",
    ann:[{n:"Rusia",label:"Rusia·8.0",side:"right",dy:-22},{n:"Korea",label:"Korea·12.4",side:"right",dy:20},{n:"Indonesia",label:"Indo·1.0",side:"left",dy:20,isIDN:true}],
  },
  {
    id:"q3", num:"03",
    verdict:"Demographic Determinism",
    verdictFull:"Deconstructing Demographic Determinism",
    verdictSub:"β = −0.32, p > 0.05",
    question:"Benarkah kepadatan penduduk adalah vonis mati?",
    challenge:"Bangladesh (1.300 jiwa/km²) dianggap bom waktu. Data menolak vonis itu. Demografi bukan prediktor resiliensi utama.",
    pullStat:"β=−0.32",
    pullText:"— konstruk yang gagal lolos uji signifikansi. Demografi bukan takdir.",
    premise:"Negara padat dan miskin dianggap pasti hancur lebur karena profil demografinya.",
    dataNote:"Bangladesh (★★★) melampaui beberapa negara Eropa yang secara demografis jauh lebih 'ideal'.",
    interpret:"Menyalahkan kepadatan seringkali menutupi kegagalan koordinasi pemerintah dan ketimpangan struktural.",
    indonesiaNote:"Variabel penentu di Jawa bukan kepadatan, melainkan densitas modal sosial dan kepemimpinan lokal.",
    anchors:["Ostrom · Collective Action","Social Determinants","Krieger"],
    accent:"#a16207", accentLight:"#fefce8",
    xKey:"g", xLog:true, xLabel:"GDP per Kapita (log)",
    ann:[{n:"Bangladesh",label:"Bangla·$2.2k",side:"left",dy:-22},{n:"Indonesia",label:"Indo·$4.3k",side:"right",dy:22,isIDN:true}],
  },
  {
    id:"q4", num:"04",
    verdict:"Regime Decoupling",
    verdictFull:"The Decoupling of Regime Type and Crisis Resilience",
    verdictSub:"r ≈ 0",
    question:"Apakah demokrasi menjamin respons krisis yang lebih baik?",
    challenge:"Vietnam (otokrasi) dan Taiwan (demokrasi) sama-sama di puncak. Inggris dan AS berada di dasar. Label tidak menentukan.",
    pullStat:"3/5",
    pullText:"negara terbaik bukan demokrasi elektoral murni. Krisis tidak peduli pada ideologi, tapi kompetensi.",
    premise:"Demokrasi dianggap paling adaptif berkat transparansi dan akuntabilitas.",
    dataNote:"Vietnam (★★★★★) vs AS (★). UK (★★★) vs Taiwan (★★★★★). Data tidak mendukung korelasi rezim.",
    interpret:"Yang beroperasi di balik label adalah State Capacity — kemampuan birokrasi mengorkestrasi tindakan kolektif.",
    indonesiaNote:"Masalah di Indonesia bukan sistem nasional, tapi kapasitas pemerintah daerah yang tidak merata.",
    anchors:["Sen & Drèze","State Capacity","The Lancet"],
    accent:"#6d28d9", accentLight:"#f5f3ff",
    xKey:"democ", xLog:false, xLabel:"Status Politik", isJitter:true,
    ann:[{n:"Vietnam",label:"Vietnam",side:"right",dy:-24},{n:"AS",label:"AS",side:"left",dy:20},{n:"Korea",label:"Korea",side:"right",dy:20}],
  },
  {
    id:"q5", num:"05",
    verdict:"Wealth Paradox",
    verdictFull:"The Paradox of Unmediated Wealth",
    verdictSub:"r ≈ −0.08, (ns)",
    question:"Mengapa GDP tinggi justru menjadi beban?",
    challenge:"Ada korelasi negatif: semakin kaya sebuah negara, semakin lambat adaptasinya. Kekayaan tidak mendistribusikan dirinya.",
    pullStat:"11×",
    pullText:"selisih GDP UK vs Vietnam. UK (★★★) kalah efisien dibanding Vietnam (★★★★★).",
    premise:"Kekayaan dianggap penyangga logistik terbaik untuk margin kesalahan lebar.",
    dataNote:"r ≈ −0.08. Gini coefficient lebih prediktif dibanding GDP nasional.",
    interpret:"Di negara kaya, kepentingan komersial sering menyandera kebijakan. Kekayaan tanpa jaminan sosial adalah ilusi.",
    indonesiaNote:"Akses relatif merata melalui JKN adalah investasi ketahanan jangka panjang.",
    anchors:["Commercial Det.","Spirit Level","Theory of Justice"],
    accent:"#0369a1", accentLight:"#f0f9ff",
    xKey:"g", xLog:true, xLabel:"GDP per Kapita (log)",
    ann:[{n:"UK",label:"UK·$42k",side:"right",dy:-24},{n:"Vietnam",label:"Viet·$3.8k",side:"left",dy:20},{n:"Indonesia",label:"Indo·$4.3k",side:"left",dy:-22,isIDN:true}],
  },
];

/* ═══ COMPONENTS ════════════════════════════════════════════════════ */

function IllusSpending() {
  return (
    <svg viewBox="0 0 680 200" style={{width:"100%",height:"auto",display:"block"}}>
      <rect width="680" height="200" fill="#fafaf7"/>
      <text x="50" y="50" fill="#991b1b" fontSize="14" fontWeight="700">$11.072 (AS)</text>
      <rect x="150" y="40" width="350" height="30" rx="15" fill="#991b1b" opacity="0.8"/>
      <circle cx="200" cy="70" r="10" fill="#be123c" opacity="0.3"/>
      <text x="530" y="58" fill="#991b1b" fontSize="20">★</text>
      <text x="50" y="140" fill="#166534" fontSize="14" fontWeight="700">$171 (Vietnam)</text>
      <rect x="150" y="130" width="350" height="15" rx="7.5" fill="#166534"/>
      <text x="530" y="142" fill="#166534" fontSize="14">★★★★★</text>
    </svg>
  );
}

function IllusInfra() {
  return (
    <svg viewBox="0 0 680 200" style={{width:"100%",height:"auto",display:"block"}}>
      <rect width="680" height="200" fill="#fafaf7"/>
      <rect x="240" y="40" width="200" height="100" fill="#e7e5e4" stroke="#d6d3d1"/>
      <path d="M260,140 L275,150 L265,160" fill="none" stroke="#991b1b" strokeWidth="2"/>
      <text x="340" y="160" textAnchor="middle" fill="#991b1b" fontSize="10" fontWeight="700">TRUST GAP</text>
      <text x="100" y="100" textAnchor="middle" fill="#991b1b" fontSize="22" fontWeight="900">8.0</text>
      <text x="580" y="100" textAnchor="middle" fill="#166534" fontSize="22" fontWeight="900">12.4</text>
    </svg>
  );
}

function IllusDemography() {
  return (
    <svg viewBox="0 0 680 200" style={{width:"100%",height:"auto",display:"block"}}>
      <rect width="680" height="200" fill="#fafaf7"/>
      <circle cx="340" cy="100" r="60" fill="#166534" opacity="0.1" stroke="#166534" strokeDasharray="4 4"/>
      <text x="340" y="105" textAnchor="middle" fill="#166534" fontSize="10" fontWeight="700">COMMUNITY WEAVE</text>
      <text x="100" y="100" textAnchor="middle" fill="#92400e" fontSize="20" fontWeight="900">1.300/km²</text>
    </svg>
  );
}

function IllusDemocracy() {
  return (
    <svg viewBox="0 0 680 200" style={{width:"100%",height:"auto",display:"block"}}>
      <rect width="680" height="200" fill="#fafaf7"/>
      <rect x="120" y="60" width="120" height="80" rx="8" fill="#fef2f2" stroke="#fca5a5"/>
      <rect x="440" y="60" width="120" height="80" rx="8" fill="#f0fdf4" stroke="#86efac"/>
      <text x="340" y="105" textAnchor="middle" fill="#e7e5e4" fontSize="30" fontWeight="900">vs</text>
    </svg>
  );
}

function IllusWealth() {
  return (
    <svg viewBox="0 0 680 200" style={{width:"100%",height:"auto",display:"block"}}>
      <rect width="680" height="200" fill="#fafaf7"/>
      <rect x="240" y="120" width="200" height="10" fill="#fbbf24"/>
      <rect x="250" y="110" width="180" height="10" fill="#f59e0b"/>
      <text x="340" y="90" textAnchor="middle" fill="#44403c" fontSize="10" fontWeight="700">WEALTH TRAP</text>
    </svg>
  );
}

const ILLUS = { q1: IllusSpending, q2: IllusInfra, q3: IllusDemography, q4: IllusDemocracy, q5: IllusWealth };

function AChart({ q }) {
  const W = 640, H = 220, P = { t: 20, r: 40, b: 40, l: 40 };
  const cw = W - P.l - P.r, ch = H - P.t - P.b;
  const vals = C.map(c => c[q.xKey]);
  const minV = Math.min(...vals), maxV = Math.max(...vals);

  const toX = (v, i) => {
    if (q.isJitter) return P.l + (v === 0 ? 0.3 : 0.7) * cw + (Math.sin(i) * 20);
    if (q.xLog) return P.l + (Math.log(v + 1) - Math.log(minV + 1)) / (Math.log(maxV + 1) - Math.log(minV + 1)) * cw;
    return P.l + (v - minV) / (maxV - minV) * cw;
  };
  const toY = v => P.t + ch - ((v - 1) / 4) * ch;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", background: "#fff", borderRadius: 8, border: "1px solid #eee" }}>
      {C.map((p, i) => (
        <circle key={i} cx={toX(p[q.xKey], i)} cy={toY(p.o)} r={p.id === "IDN" ? 6 : 4} fill={p.id === "IDN" ? "#be123c" : OF[p.o]} stroke={p.id === "IDN" ? "#be123c" : OC[p.o]} />
      ))}
      <text x={W / 2} y={H - 5} textAnchor="middle" fontSize="10" fill="#999">{q.xLabel}</text>
    </svg>
  );
}

export default function App() {
  return (
    <div style={{ background: "#FAFAF7", minHeight: "100vh", padding: "40px 20px", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <header style={{ marginBottom: 60 }}>
          <h1 style={{ fontSize: 48, fontWeight: 900, marginBottom: 10 }}>Myth Autopsy.</h1>
          <p style={{ color: "#666", fontSize: 18 }}>Apa yang benar-benar menentukan respons pandemi?</p>
        </header>

        {QS.map(q => {
          const Illus = ILLUS[q.id];
          return (
            <section key={q.id} style={{ marginBottom: 80, padding: 20, background: "#fff", borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: q.accent, textTransform: "uppercase", marginBottom: 10 }}>{q.verdictFull}</div>
              <h2 style={{ fontSize: 24, marginBottom: 20 }}>{q.question}</h2>
              <div style={{ marginBottom: 20 }}><Illus /></div>
              <AChart q={q} />
              <p style={{ marginTop: 20, lineHeight: 1.6, color: "#444" }}>{q.interpret}</p>
              <div style={{ marginTop: 15, padding: 15, background: "#f9f9f9", borderLeft: `4px solid ${q.accent}`, fontSize: 14 }}>
                <strong>Konteks Indonesia:</strong> {q.indonesiaNote}
              </div>
            </section>
          );
        })}
        
        <footer style={{ marginTop: 100, borderTop: "1px solid #eee", paddingTop: 40, textAlign: "center", color: "#999", fontSize: 12 }}>
          Data: Kim (2020) BMJ Global Health · N=21 · PLS-SEM
        </footer>
      </div>
    </div>
  );
}
