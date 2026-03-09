import { useState, useEffect, useRef, useMemo } from "react";

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
    id:"q1", num:"01", verdict:"Efficiency Gap", verdictFull:"Efficiency Gap in Health Resource Mobilization", verdictSub:"r ≈ −0.12",
    question:"Mengapa uang triliunan dolar gagal membeli keselamatan?", challenge:"Korelasi belanja kesehatan dan outcome pandemi bernilai negatif. Uang adalah potensi, bukan eksekusi.",
    pullStat:"64×", pullText:"Pengeluaran AS dibanding Vietnam — selisih tanpa hasil.", premise:"Setiap dolar tambahan adalah investasi keselamatan.",
    dataNote:"AS ($11k) = ★. Vietnam ($171) = ★★★★★.", interpret:"Anggaran besar hanya memperkuat elit jika distribusi timpang.",
    indonesiaNote:"Indonesia ($112) moderat (★★★) berkat Puskesmas.", anchors:["Marmot Review","WHO"], accent:"#be123c", accentLight:"#fff1f2", xKey:"s", xLog:true, xLabel:"Spending/capita",
    ann:[{n:"AS",label:"AS·$11k",side:"right",dy:-18},{n:"Vietnam",label:"Vietnam·$171",side:"left",dy:16},{n:"Indonesia",label:"Indo·$112",side:"right",dy:22,isIDN:true}],
  },
  {
    id:"q2", num:"02", verdict:"Technocratic Fallacy", verdictFull:"The Fallacy of Technocratic Solutionism", verdictSub:"r ≈ +0.11",
    question:"Apakah rumah sakit cukup menahan pandemi?", challenge:"Rusia punya bed tinggi tapi rakyat tak percaya vaksin sendiri.",
    pullStat:"50%", pullText:"Vaksinasi Rusia rendah. Trust melampaui teknologi.", premise:"Bed dan alat medis adalah fondasi utama.",
    dataNote:"Rusia (8.0 bed) = ★★. Korea (12.4 bed) = ★★★★★.", interpret:"Fasilitas fisik tanpa legitimasi sosial adalah kerangka kosong.",
    indonesiaNote:"Bidan desa membangun 'infrastruktur lunak' yang krusial.", anchors:["Fukuyama","The Lancet"], accent:"#c2410c", accentLight:"#fff7ed", xKey:"b", xLog:false, xLabel:"Beds per 1.000",
    ann:[{n:"Rusia",label:"Rusia·8.0",side:"right",dy:-22},{n:"Korea",label:"Korea·12.4",side:"right",dy:20},{n:"Indonesia",label:"Indo·1.0",side:"left",dy:20,isIDN:true}],
  },
  {
    id:"q3", num:"03", verdict:"Demographic Determinism", verdictFull:"Deconstructing Demographic Determinism", verdictSub:"β = −0.32",
    question:"Benarkah kepadatan penduduk adalah vonis mati?", challenge:"Bangladesh padat tapi tak hancur. Demografi bukan takdir.",
    pullStat:"β=−0.32", pullText:"Konstruk tak signifikan. Demografi bukan prediktor utama.", premise:"Negara miskin pasti hancur lebur karena demografi.",
    dataNote:"Bangladesh melampaui beberapa negara Eropa.", interpret:"Menyalahkan kepadatan menutupi kegagalan koordinasi.",
    indonesiaNote:"Modal sosial di Jawa lebih kuat dari prediksi kepadatan.", anchors:["Ostrom","WHO"], accent:"#a16207", accentLight:"#fefce8", xKey:"g", xLog:true, xLabel:"GDP per Capita",
    ann:[{n:"Bangladesh",label:"Bangla·$2.2k",side:"left",dy:-22},{n:"Indonesia",label:"Indo·$4.3k",side:"right",dy:22,isIDN:true}],
  },
  {
    id:"q4", num:"04", verdict:"Regime Decoupling", verdictFull:"The Decoupling of Regime Type and Crisis Resilience", verdictSub:"r ≈ 0",
    question:"Apakah demokrasi menjamin respons lebih baik?", challenge:"Vietnam (otokrasi) dan Taiwan (demokrasi) sama-sama di puncak.",
    pullStat:"3/5", pullText:"Negara terbaik bukan demokrasi elektoral murni.", premise:"Demokrasi dianggap paling adaptif.",
    dataNote:"AS (★) vs Vietnam (★★★★★).", interpret:"Krisis takut pada kompetensi, bukan label ideologi.",
    indonesiaNote:"Kapasitas Pemda yang tak merata adalah masalah nyata.", anchors:["Sen & Dreze","State Capacity"], accent:"#6d28d9", accentLight:"#f5f3ff", xKey:"democ", xLog:false, xLabel:"Status Politik", isJitter:true,
    ann:[{n:"Vietnam",label:"Vietnam",side:"right",dy:-24},{n:"AS",label:"AS",side:"left",dy:20},{n:"Korea",label:"Korea",side:"right",dy:20}],
  },
  {
    id:"q5", num:"05", verdict:"Wealth Paradox", verdictFull:"The Paradox of Unmediated Wealth", verdictSub:"r ≈ −0.08",
    question:"Mengapa GDP tinggi justru menjadi beban?", challenge:"Semakin kaya negara, semakin lambat adaptasinya.",
    pullStat:"11×", pullText:"Selisih GDP UK vs Vietnam. Kekayaan tak otomatis jadi resiliensi.", premise:"GDP tinggi berarti margin kesalahan lebar.",
    dataNote:"Gini coefficient lebih prediktif dibanding GDP.", interpret:"Kekayaan tanpa keadilan adalah ilusi keamanan.",
    indonesiaNote:"Akses JKN merata adalah investasi ketahanan.", anchors:["Spirit Level","Rawls"], accent:"#0369a1", accentLight:"#f0f9ff", xKey:"g", xLog:true, xLabel:"GDP/capita",
    ann:[{n:"UK",label:"UK·$42k",side:"right",dy:-24},{n:"Vietnam",label:"Viet·$3.8k",side:"left",dy:20},{n:"Indonesia",label:"Indo·$4.3k",side:"left",dy:-22,isIDN:true}],
  },
];

function IllusSpending() { return <svg viewBox="0 0 680 200"><rect width="680" height="200" fill="#fafaf7"/><rect x="150" y="40" width="350" height="30" rx="15" fill="#991b1b" opacity="0.8"/><text x="160" y="60" fill="white" fontSize="12">AS ($11k)</text><rect x="150" y="130" width="350" height="15" rx="7.5" fill="#166534"/><text x="160" y="142" fill="white" fontSize="10">Vietnam ($171)</text></svg>; }
function IllusInfra() { return <svg viewBox="0 0 680 200"><rect width="680" height="200" fill="#fafaf7"/><rect x="240" y="40" width="200" height="100" fill="#e7e5e4" stroke="#d6d3d1"/><text x="340" y="100" textAnchor="middle" fontSize="24">🏥</text><text x="340" y="160" textAnchor="middle" fill="#991b1b" fontSize="10" fontWeight="700">TRUST GAP</text></svg>; }
function IllusDemography() { return <svg viewBox="0 0 680 200"><rect width="680" height="200" fill="#fafaf7"/><circle cx="340" cy="100" r="60" fill="#166534" opacity="0.1" stroke="#166534" strokeDasharray="4 4"/><text x="340" y="105" textAnchor="middle" fill="#166534" fontSize="10" fontWeight="700">SOCIAL WEAVE</text></svg>; }
function IllusDemocracy() { return <svg viewBox="0 0 680 200"><rect width="680" height="200" fill="#fafaf7"/><rect x="120" y="60" width="120" height="80" rx="8" fill="#fef2f2" stroke="#fca5a5"/><rect x="440" y="60" width="120" height="80" rx="8" fill="#f0fdf4" stroke="#86efac"/><text x="340" y="105" textAnchor="middle" fill="#ccc" fontSize="30" fontWeight="900">vs</text></svg>; }
function IllusWealth() { return <svg viewBox="0 0 680 200"><rect width="680" height="200" fill="#fafaf7"/><rect x="240" y="120" width="200" height="10" fill="#fbbf24"/><text x="340" y="100" textAnchor="middle" fill="#444" fontSize="10" fontWeight="700">WEALTH TRAP</text></svg>; }
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
        <circle key={i} cx={toX(p[q.xKey], i)} cy={toY(p.o)} r={p.id === "IDN" ? 8 : 4} fill={p.id === "IDN" ? "#be123c" : OF[p.o]} stroke={p.id === "IDN" ? "#fff" : OC[p.o]} />
      ))}
    </svg>
  );
}

export default function App() {
  return (
    <div style={{ background: "#FAFAF7", minHeight: "100vh", padding: "40px 20px", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <h1 style={{ fontSize: 48, fontWeight: 900, marginBottom: 10 }}>Myth Autopsy.</h1>
        <p style={{ color: "#666", fontSize: 18, marginBottom: 60 }}>Apa yang benar-benar menentukan respons pandemi?</p>
        {QS.map(q => {
          const Illus = ILLUS[q.id];
          return (
            <section key={q.id} style={{ marginBottom: 80, padding: 30, background: "#fff", borderRadius: 12, border: "1px solid #eee" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: q.accent, textTransform: "uppercase", marginBottom: 10 }}>{q.verdictFull}</div>
              <h2 style={{ fontSize: 24, marginBottom: 20 }}>{q.question}</h2>
              <div style={{ marginBottom: 20 }}><Illus /></div>
              <AChart q={q} />
              <p style={{ marginTop: 20, lineHeight: 1.7, color: "#444" }}>{q.interpret}</p>
              <div style={{ marginTop: 20, padding: 20, background: "#fef2f2", borderLeft: `4px solid #be123c`, fontSize: 14 }}>
                <strong>Konteks Indonesia:</strong> {q.indonesiaNote}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
