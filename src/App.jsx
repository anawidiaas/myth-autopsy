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

/* ═══ QUESTIONS ══════════════════════════════════════════════════════ */
const QS = [
  {
    id:"q1", num:"01",
    verdict:"Efficiency Gap",
    verdictFull:"Efficiency Gap in Health Resource Mobilization",
    verdictSub:"r ≈ −0.12, tidak signifikan",
    question:"Mengapa uang triliunan dolar gagal membeli keselamatan nyawa?",
    challenge:"Korelasi antara belanja kesehatan dan outcome pandemi dalam dataset ini bernilai negatif. Bukan nol — negatif. Ini bukan anomali statistik; ini adalah bukti Allocative Inefficiency yang sistemis.",
    pullStat:"64×",
    pullText:"lebih besar pengeluaran AS dibanding Vietnam — selisih yang tidak menghasilkan perbedaan outcome yang diharapkan.",
    premise:"Kita percaya bahwa semakin besar anggaran kesehatan per kapita, semakin kuat \"benteng\" sebuah negara melawan virus. Setiap dolar tambahan adalah investasi dalam keselamatan kolektif.",
    dataNote:"AS menghabiskan $11.072/kapita namun mencatat outcome terburuk di antara negara maju (★). Vietnam dengan $171/kapita menang mutlak (★★★★★). Spearman r ≈ −0.12 — arahnya berlawanan dengan asumsi dasar kebijakan kesehatan.",
    interpret:"Data mengonfirmasi bahwa korelasi negatif ini adalah manifestasi dari Allocative Inefficiency. Di bawah struktur pasar bebas, akumulasi modal kesehatan AS terkonsentrasi pada sektor tersier yang profit-oriented. Commercial Determinants of Health menyerap anggaran sebelum menyentuh komunitas rentan.",
    indonesiaNote:"Indonesia: $112/kapita — terendah kedua di dataset — namun outcome moderat (★★★). Puskesmas dan tradisi gotong royong membangun kapasitas adaptif yang tidak tercatat di anggaran.",
    anchors:["Marmot Review (2010)","Commercial Det. of Health · Lancet","Allocative Efficiency · WHO"],
    accent:"#be123c", accentLight:"#fff1f2",
    xKey:"s", xLog:true, xLabel:"Pengeluaran Kesehatan USD/kapita (log)",
    ann:[{n:"AS",label:"AS·$11k",side:"right",dy:-18},{n:"Vietnam",label:"Vietnam·$171",side:"left",dy:16},{n:"Indonesia",label:"Indonesia·$112",side:"right",dy:22,isIDN:true}],
  },
  {
    id:"q2", num:"02",
    verdict:"Technocratic Fallacy",
    verdictFull:"The Fallacy of Technocratic Solutionism",
    verdictSub:"r ≈ +0.11, tidak signifikan",
    question:"Apakah tumpukan tempat tidur rumah sakit cukup untuk menahan gelombang pandemi?",
    challenge:"Rusia mewarisi 8,0 bed/1.000 jiwa — salah satu tertinggi di dunia. Sputnik V selesai sebelum Pfizer. Namun excess mortality-nya melampaui 1 juta jiwa.",
    pullStat:"50%",
    pullText:"cakupan vaksinasi domestik Rusia. Rakyat tidak percaya pada vaksin negara sendiri meski teknologinya ada.",
    premise:"Kesuksesan diukur dari rasio tempat tidur dan kecanggihan alat medis. Kesiapan fisik dianggap fondasi utama respons pandemi.",
    dataNote:"Rusia: 8,0 bed → ★★☆☆☆. Korea: 12,4 bed → ★★★★★. Profil fisik hampir setara, outcome berbeda drastis. r ≈ +0.11 (ns).",
    interpret:"State Capacity tidak diukur dari banyaknya fasilitas, melainkan dari kemampuan negara membangun Political Trust. Di Rusia, krisis kepercayaan menghancurkan efektivitas infrastruktur fisik.",
    indonesiaNote:"Indonesia: 1,0 bed/1.000 jiwa — terendah di dataset. Namun bidan desa dan kader Posyandu membangun 'infrastruktur lunak' yang menentukan saat krisis.",
    anchors:["State Capacity · Fukuyama","Trust & Vaccine Uptake · Larson","Political Origins of Health"],
    accent:"#c2410c", accentLight:"#fff7ed",
    xKey:"b", xLog:false, xLabel:"Rasio Tempat Tidur per 1.000 Penduduk",
    ann:[{n:"Rusia",label:"Rusia·8.0",side:"right",dy:-22},{n:"Korea",label:"Korea·12.4",side:"right",dy:20},{n:"Indonesia",label:"Indonesia·1.0",side:"left",dy:20,isIDN:true}],
  },
  {
    id:"q3", num:"03",
    verdict:"Demographic Determinism",
    verdictFull:"Deconstructing Demographic Determinism",
    verdictSub:"β = −0.32, p > 0.05",
    question:"Benarkah kemiskinan dan kepadatan penduduk adalah vonis mati saat pandemi?",
    challenge:"Bangladesh dianggap bom waktu demografis: 1.300 jiwa/km². Model PLS-SEM Kim (2020) menolak vonis itu. Demografi adalah satu-satunya konstruk yang tidak signifikan.",
    pullStat:"β=−0.32",
    pullText:"— konstruk yang gagal lolos uji signifikansi. Profil demografis bukan prediktor resiliensi utama.",
    premise:"Negara padat dan miskin dianggap pasti akan hancur lebur karena demografinya. Epidemiologi seringkali terlalu fokus pada identifikasi beban populasi.",
    dataNote:"Bangladesh (1.300 jiwa/km²): ★★★. Pakistan dan Nigeria melampaui beberapa negara Eropa yang secara demografis jauh lebih ideal.",
    interpret:"Demographic Determinism seringkali melindungi status quo: menyalahkan kepadatan penduduk untuk menutupi kegagalan koordinasi pemerintah dan ketimpangan struktural.",
    indonesiaNote:"Variabel penentu di Jawa bukan kepadatan penduduk, melainkan densitas modal sosial dan kualitas kepemimpinan lokal yang adaptif.",
    anchors:["Ostrom — Collective Action","Social Determinants · WHO","Krieger — Ecosocial Theory"],
    accent:"#a16207", accentLight:"#fefce8",
    xKey:"g", xLog:true, xLabel:"GDP per Kapita USD (log)",
    ann:[{n:"Bangladesh",label:"Bangladesh·$2.2k",side:"left",dy:-22},{n:"Indonesia",label:"Indonesia·$4.3k",side:"right",dy:22,isIDN:true}],
  },
  {
    id:"q4", num:"04",
    verdict:"Regime-Resilience Decoupling",
    verdictFull:"The Decoupling of Regime Type and Crisis Resilience",
    verdictSub:"korelasi demokrasi vs outcome ≈ 0",
    question:"Apakah demokrasi menjamin respons krisis yang lebih baik?",
    challenge:"Vietnam (otokrasi) dan Taiwan (demokrasi) sama-sama di puncak. Inggris dan AS berada di dasar. Ini pemisahan antara label rezim dan kapasitas operasional negara.",
    pullStat:"3/5",
    pullText:"negara dengan outcome terbaik bukan demokrasi elektoral murni. Label sistem politik tidak memprediksi resiliensi.",
    premise:"Demokrasi dengan transparansinya dianggap paling adaptif karena akuntabilitas publik dan kebebasan pers.",
    dataNote:"Vietnam: ★★★★★. Taiwan: ★★★★★. AS: ★. UK: ★★★. Distribusi data tidak mendukung hipotesis keunggulan rezim tertentu.",
    interpret:"Yang beroperasi di balik label adalah State Capacity — kemampuan birokrasi menerjemahkan keputusan menjadi tindakan kolektif. Krisis hanya peduli pada kompetensi.",
    indonesiaNote:"Desentralisasi yang tidak merata membuat respons antar provinsi berbeda drastis. Masalahnya bukan sistem nasional, tapi kapasitas daerah.",
    anchors:["Sen & Drèze","Hanson & Sigman","The Lancet — Political Origins"],
    accent:"#6d28d9", accentLight:"#f5f3ff",
    xKey:"democ", xLog:false, xLabel:"Status Sistem Politik", isJitter:true,
    ann:[{n:"Vietnam",label:"Vietnam",side:"right",dy:-24},{n:"AS",label:"AS",side:"left",dy:20},{n:"Korea",label:"Korea",side:"right",dy:20}],
  },
  {
    id:"q5", num:"05",
    verdict:"Wealth Paradox",
    verdictFull:"The Paradox of Unmediated Wealth",
    verdictSub:"r ≈ −0.08, tidak signifikan",
    question:"Mengapa GDP tinggi justru menjadi beban saat menghadapi krisis kesehatan?",
    challenge:"Ada korelasi negatif yang tidak nyaman: semakin kaya sebuah negara, semakin lambat adaptasinya. Kekayaan nasional tidak mendistribusikan dirinya sendiri.",
    pullStat:"11×",
    pullText:"selisih GDP per kapita UK vs Vietnam. UK: ★★★. Vietnam: ★★★★★.",
    premise:"Kekayaan nasional dianggap penyangga terbaik untuk logistik dan teknologi. GDP tinggi berarti margin kesalahan yang lebih lebar.",
    dataNote:"r ≈ −0.08. AS ($63k): ★. Vietnam ($3,7k): ★★★★★. Gini coefficient lebih prediktif dibanding GDP.",
    interpret:"Di negara kaya, kepentingan komersial (asuransi, farmasi) sering menyandera kebijakan. Kekayaan tanpa jaminan sosial yang merata adalah ilusi keamanan.",
    indonesiaNote:"GDP rendah namun outcome moderat karena akses relatif merata melalui Puskesmas dan JKN. Ini argumen untuk memperdalam Universal Health Coverage.",
    anchors:["Commercial Det. · Lancet","Wilkinson & Pickett","Rawls — Theory of Justice"],
    accent:"#0369a1", accentLight:"#f0f9ff",
    xKey:"g", xLog:true, xLabel:"GDP per Kapita USD (log)",
    ann:[{n:"UK",label:"UK·$42k",side:"right",dy:-24},{n:"Vietnam",label:"Vietnam·$3.8k",side:"left",dy:20},{n:"Indonesia",label:"Indonesia·$4.3k",side:"left",dy:-22,isIDN:true}],
  },
];

/* ═══ ILLUSTRATIONS ══════════════════════════════════════════════════ */
// ... (Bagian IllusSpending, IllusInfra, IllusDemography, dsb tetap sama seperti kode lo sebelumnya)
// Pastikan tidak ada duplikasi teks di sini.

// 

function IllusSpending() {
  const leaks = [
    {x:200, label:"Admin Waste",   rot:-20},
    {x:278, label:"Pharma Lobby",  rot:15},
    {x:356, label:"Middlemen",     rot:-12},
    {x:428, label:"Billing Fraud", rot:18},
  ];
  return (
    <svg viewBox="0 0 680 240" style={{width:"100%",height:"auto",display:"block"}}>
      <defs>
        <linearGradient id="pL" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#991b1b"/>
          <stop offset="100%" stopColor="#7f1d1d"/>
        </linearGradient>
        <linearGradient id="pG" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#166534"/>
          <stop offset="100%" stopColor="#14532d"/>
        </linearGradient>
        <marker id="arR" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
          <polygon points="0 0,7 2.5,0 5" fill="#991b1b"/>
        </marker>
        <marker id="arG" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
          <polygon points="0 0,7 2.5,0 5" fill="#166534"/>
        </marker>
      </defs>

      <text x="18" y="70" fill="#991b1b" fontSize="12" fontWeight="700" fontFamily="'IBM Plex Mono',monospace">$11.072</text>
      <text x="18" y="84" fill="#a8a29e" fontSize="8" fontFamily="'IBM Plex Mono',monospace">per kapita · AS</text>
      <rect x="108" y="58" width="430" height="46" rx="23" fill="url(#pL)" opacity="0.88"/>

      {leaks.map((l,i)=>(
        <g key={i} transform={`rotate(${l.rot},${l.x},93)`}>
          <ellipse cx={l.x} cy={98} rx="9" ry="6" fill="#fef2f2" opacity="0.95"/>
          <text x={l.x} y={64} textAnchor="middle" fill="#991b1b" fontSize="7.5" fontWeight="600" fontFamily="'IBM Plex Mono',monospace">{l.label}</text>
        </g>
      ))}

      <line x1="538" y1="81" x2="608" y2="81" stroke="#fca5a5" strokeWidth="5" strokeLinecap="round" markerEnd="url(#arR)"/>
      <text x="628" y="77" fill="#991b1b" fontSize="13" fontFamily="Georgia">★</text>

      <text x="18" y="152" fill="#166534" fontSize="12" fontWeight="700" fontFamily="'IBM Plex Mono',monospace">$171</text>
      <rect x="108" y="152" width="430" height="26" rx="13" fill="url(#pG)" opacity="0.9"/>
      <line x1="538" y1="165" x2="608" y2="165" stroke="#4ade80" strokeWidth="7" strokeLinecap="round" markerEnd="url(#arG)"/>
      <text x="616" y="161" fill="#166534" fontSize="13" fontFamily="Georgia">★★★★★</text>

      <text x="340" y="232" textAnchor="middle" fill="#c4b5a5" fontSize="8" fontFamily="'IBM Plex Mono',monospace">
        Volume anggaran adalah potensi — integritas sistem menentukan realitas
      </text>
    </svg>
  );
}

// ... Sisa fungsi (IllusInfra, IllusDemography, IllusDemocracy, IllusWealth, StructuralModel, AChart, R, dan App) 
// dilanjutkan sesuai kode lo yang sudah bagus tadi.