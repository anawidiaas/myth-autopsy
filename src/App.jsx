import React, { useState, useEffect, useRef, useMemo } from "react";

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
    dataNote:"AS menghabiskan $11.072/kapita namun mencatat outcome terburuk di antara negara maju (★). Vietnam dengan $171/kapita menang mutlak (★★★★★). Spearman r ≈ −0.12 — arahnya berlawanan dengan asumsi dasar kebijakan kesehatan. Path coefficient ekopolitik: β=0.72 vs teknis β=0.58.",
    interpret:"Data mengonfirmasi bahwa korelasi negatif ini adalah manifestasi dari Allocative Inefficiency. Di bawah struktur pasar bebas, akumulasi modal kesehatan AS terkonsentrasi pada sektor tersier yang profit-oriented. Commercial Determinants of Health — tekanan industri farmasi, insurance lobby, dan middlemen administratif — menyerap anggaran sebelum menyentuh komunitas rentan. Vietnam mendistribusikan sumber dayanya melalui jaringan komunitas, bukan melalui pasar.",
    indonesiaNote:"Indonesia: $112/kapita — terendah kedua di dataset — namun outcome moderat (★★★). Jaringan Puskesmas yang menjangkau desa, tradisi gotong royong sebagai penyangga informal, dan pengalaman kolektif dari bencana berulang membangun kapasitas adaptif yang tidak tercatat dalam neraca anggaran.",
    anchors:["Marmot Review (2010) — Health Inequalities","Commercial Det. of Health · Lancet (2023)","Allocative Efficiency · WHO Health Systems"],
    accent:"#be123c", accentLight:"#fff1f2",
    xKey:"s", xLog:true, xLabel:"Pengeluaran Kesehatan USD/kapita (log)",
    ann:[{n:"AS",label:"AS·$11k",side:"right",dy:-18},{n:"Vietnam",label:"Vietnam·$171",side:"left",dy:16},{n:"Kuba",label:"Kuba·$971",side:"left",dy:-22},{n:"Indonesia",label:"Indonesia·$112",side:"right",dy:22,isIDN:true}],
  },
  {
    id:"q2", num:"02",
    verdict:"Technocratic Fallacy",
    verdictFull:"The Fallacy of Technocratic Solutionism",
    verdictSub:"r ≈ +0.11, tidak signifikan",
    question:"Apakah tumpukan tempat tidur rumah sakit cukup untuk menahan gelombang pandemi?",
    challenge:"Rusia mewarisi 8,0 bed/1.000 jiwa dari sistem Semashko Soviet — salah satu tertinggi di dunia. Sputnik V selesai sebelum Pfizer. Excess mortality-nya melampaui 1 juta jiwa. Ini kegagalan teknostruktur, bukan kegagalan anggaran.",
    pullStat:"50%",
    pullText:"cakupan vaksinasi domestik Rusia, meski Sputnik V dikembangkan lebih awal dari Pfizer. Rakyat tidak percaya pada vaksin negara sendiri.",
    premise:"Kesuksesan diukur dari rasio tempat tidur dan kecanggihan alat medis. Perkuat kapasitas sistem — tambah bed, tambah nakes, bangun RSUD. Kesiapan fisik adalah fondasi respons pandemi.",
    dataNote:"Rusia: 8,0 bed/1.000 jiwa → ★★☆☆☆. Korea: 12,4 bed/1.000 jiwa → ★★★★★. Profil infrastruktur fisik yang hampir setara, outcome yang berbeda secara fundamental. Korelasi bed ratio vs outcome: r ≈ +0.11, tidak signifikan.",
    interpret:"Technocratic Solutionism — keyakinan bahwa masalah sosial-politik bisa diselesaikan melalui solusi teknis semata — gagal secara empiris. State Capacity tidak diukur dari banyaknya fasilitas, melainkan dari kemampuan negara membangun Political Trust yang mendorong kepatuhan kolektif sukarela. Di Rusia, dekade oligarki pasca-Soviet menghancurkan trust tersebut hingga vaksin terbaik pun tak berguna. Infrastructure of Trust tidak bisa dibangun dengan anggaran.",
    indonesiaNote:"Indonesia: 1,0 bed/1.000 jiwa — terendah di dataset — namun outcome moderat. Kader Posyandu dan bidan desa membangun trust komunitas jauh sebelum pandemi. Inilah \"infrastruktur lunak\" yang tidak muncul dalam audit kapasitas fisik namun sangat menentukan saat krisis.",
    anchors:["State Capacity · Fukuyama (2014)","Political Origins of Health Inequities · Lancet","Trust & Vaccine Uptake · Larson et al. (2022)"],
    accent:"#c2410c", accentLight:"#fff7ed",
    xKey:"b", xLog:false, xLabel:"Rasio Tempat Tidur per 1.000 Penduduk",
    ann:[{n:"Rusia",label:"Rusia·8.0",side:"right",dy:-22},{n:"Korea",label:"Korea·12.4",side:"right",dy:20},{n:"Vietnam",label:"Vietnam·2.6",side:"left",dy:-22},{n:"Indonesia",label:"Indonesia·1.0",side:"left",dy:20,isIDN:true}],
  },
  {
    id:"q3", num:"03",
    verdict:"Demographic Determinism",
    verdictFull:"Deconstructing Demographic Determinism",
    verdictSub:"β = −0.32, p > 0.05, tidak signifikan",
    question:"Benarkah kemiskinan dan kepadatan penduduk adalah vonis mati saat pandemi?",
    challenge:"Bangladesh dianggap bom waktu demografis: 1.300 jiwa/km², $88/kapita, median usia 28 tahun. Model PLS-SEM Kim (2020) menolak vonis itu secara statistik. Demografi adalah satu-satunya konstruk yang tidak signifikan.",
    pullStat:"β=−0.32",
    pullText:"— satu-satunya konstruk yang gagal lolos uji signifikansi dalam model PLS-SEM Kim (2020). Profil demografis bukan prediktor resiliensi.",
    premise:"Negara padat dan miskin seperti Bangladesh dianggap \"bom waktu\" yang pasti akan hancur lebur karena demografinya. Epidemiologi mengajarkan: identifikasi populasi rentan, prediksi beban, alokasikan sumber daya.",
    dataNote:"Bangladesh (1.300 jiwa/km², $88/kapita): ★★★. Pakistan dan Nigeria — profil demografis \"paling rawan\" di dataset: ★★★. Keduanya melampaui beberapa negara Eropa yang secara demografis jauh lebih \"ideal\". Prediksi berbasis demografi gagal secara sistematis.",
    interpret:"Demographic Determinism adalah bentuk penyederhanaan yang secara tidak sadar melindungi status quo: jika kemiskinan diperlakukan sebagai risiko yang inheren, maka kegagalan koordinasi pemerintah dan ketimpangan struktural tidak perlu dipertanggungjawabkan. Common-Pool Resource governance (Ostrom) menunjukkan bahwa komunitas padat dengan ikatan sosial kuat mampu mengelola krisis kolektif secara efisien tanpa otoritas sentral — jika Political Economy of Health mendukungnya.",
    indonesiaNote:"Jawa: 150 juta jiwa di 130.000 km², salah satu wilayah terpadat di dunia. Namun respons Yogyakarta berbeda drastis dari Surabaya. Variabel penentu bukan kepadatan — melainkan kualitas kepemimpinan lokal dan densitas modal sosial yang dibangun selama bertahun-tahun.",
    anchors:["Ostrom — Common-Pool Resources & Collective Action","Social Determinants of Health · WHO Commission (2008)","Krieger — Ecosocial Theory of Disease Distribution"],
    accent:"#a16207", accentLight:"#fefce8",
    xKey:"g", xLog:true, xLabel:"GDP per Kapita USD (log) — proksi kapasitas",
    ann:[{n:"Bangladesh",label:"Bangladesh·$2.2k",side:"left",dy:-22},{n:"AS",label:"AS·$63k",side:"right",dy:-20},{n:"Vietnam",label:"Vietnam·$3.8k",side:"left",dy:20},{n:"Indonesia",label:"Indonesia·$4.3k",side:"right",dy:22,isIDN:true}],
  },
  {
    id:"q4", num:"04",
    verdict:"Regime-Resilience Decoupling",
    verdictFull:"The Decoupling of Regime Type and Crisis Resilience",
    verdictSub:"korelasi demokrasi vs outcome ≈ 0",
    question:"Apakah demokrasi menjamin respons krisis yang lebih baik?",
    challenge:"Vietnam (otokrasi satu partai) dan Taiwan (demokrasi muda) sama-sama di puncak. Inggris dan AS — dua demokrasi tertua — berada di dasar. Ini bukan paradoks; ini pemisahan antara label rezim dan kapasitas operasional negara.",
    pullStat:"3/5",
    pullText:"negara dengan outcome terbaik bukan demokrasi elektoral. Label sistem politik tidak memprediksi resiliensi.",
    premise:"Demokrasi dengan transparansinya dianggap paling adaptif: akuntabilitas publik menghasilkan kebijakan yang responsif, kebebasan pers menghasilkan koreksi cepat, partisipasi sipil menghasilkan kepatuhan kolektif.",
    dataNote:"Vietnam (satu partai): ★★★★★. Taiwan (demokrasi muda): ★★★★★. Korea Selatan (demokrasi dengan memori Gwangju 1980): ★★★★★. AS (demokrasi tertua): ★. UK (Westminster): ★★★. Distribusi ini tidak mendukung hipotesis linier apapun.",
    interpret:"Yang beroperasi di balik label adalah State Capacity — kemampuan birokrasi menerjemahkan keputusan politik menjadi tindakan kolektif yang terkoordinasi. Di UK, Partygate menghancurkan Moral Authority of Public Compliance. Di AS, Political Economy of Polarization membuat kebijakan federal tak bisa dieksekusi di level negara bagian. Regime type adalah variabel nominal; State Capacity adalah variabel interval yang menentukan.",
    indonesiaNote:"Indonesia: demokrasi elektoral, namun outcome moderat karena desentralisasi yang tidak merata. Beberapa gubernur bergerak cepat (DIY, Jawa Barat), mayoritas lambat. Ini argumen untuk membangun State Capacity pemerintah daerah yang substantif, bukan sekadar pelimpahan administratif tanpa sumber daya.",
    anchors:["Political Economy of Health · Sen & Drèze","State Capacity Index · Hanson & Sigman (2021)","The Lancet — Political Origins of Health Inequalities"],
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
    challenge:"Ada korelasi negatif yang tidak nyaman: semakin kaya sebuah negara, semakin lambat adaptasinya terhadap realitas darurat di lapangan. Kekayaan nasional tidak mendistribusikan dirinya sendiri — dan Commercial Determinants of Health memastikan agar ia tidak melakukannya.",
    pullStat:"11×",
    pullText:"selisih GDP per kapita UK vs Vietnam. UK: ★★★. Vietnam: ★★★★★.",
    premise:"Kekayaan nasional adalah penyangga terbaik untuk membeli logistik, teknologi, dan kapasitas respons cepat. GDP tinggi berarti pilihan yang lebih banyak dan margin kesalahan yang lebih lebar.",
    dataNote:"r ≈ −0.08 (sedikit negatif, tidak signifikan). UK ($42k/kapita): ★★★. Italia ($33k): ★★★. AS ($63k): ★. Vietnam ($3,7k): ★★★★★. Gini coefficient — bukan GDP — secara konsisten lebih prediktif untuk resiliensi sistem dalam krisis.",
    interpret:"Di negara-negara kaya, Commercial Determinants of Health — kepentingan industri asuransi, farmasi, dan real estate — secara aktif membentuk kebijakan kesehatan untuk melindungi akumulasi modal, bukan untuk memaksimalkan kesehatan populasi. Gig economy UK memaksa 5 juta pekerja memilih antara karantina dan makan. Di AS, 30 juta orang tidak terasuransi saat pandemi. GDP adalah angka agregat; distribusinya adalah pertanyaan politik.",
    indonesiaNote:"Indonesia: GDP rendah namun outcome moderat — sebagian karena kekayaan yang ada, meski terbatas, relatif merata diakses melalui Puskesmas dan JKN. Ini bukan alasan untuk puas; ini argumen untuk memperdalam Universal Health Coverage sebagai investasi ketahanan berbasis Political Economy of Health.",
    anchors:["Commercial Det. of Health · Kickbusters et al. (2023)","Wilkinson & Pickett — The Spirit Level","Rawls — Theory of Justice (distributive equity)"],
    accent:"#0369a1", accentLight:"#f0f9ff",
    xKey:"g", xLog:true, xLabel:"GDP per Kapita USD (log)",
    ann:[{n:"UK",label:"UK·$42k",side:"right",dy:-24},{n:"Vietnam",label:"Vietnam·$3.8k",side:"left",dy:20},{n:"AS",label:"AS·$63k",side:"right",dy:20},{n:"Indonesia",label:"Indonesia·$4.3k",side:"left",dy:-22,isIDN:true}],
  },
];
    question:"Mengapa uang triliunan dolar gagal membeli keselamatan nyawa?",
    challenge:"Korelasi antara belanja kesehatan dan outcome pandemi dalam dataset ini bernilai negatif. Bukan nol — negatif. Uang adalah potensi, bukan eksekusi.",
    pullStat:"64×",
    pullText:"lebih besar pengeluaran AS dibanding Vietnam — selisih yang tidak menghasilkan perbedaan outcome yang diharapkan.",
    premise:"Kita percaya bahwa semakin besar anggaran kesehatan per kapita, semakin kuat \"benteng\" sebuah negara melawan virus. Setiap dolar tambahan adalah investasi dalam keselamatan kolektif.",
    dataNote:"AS menghabiskan $11.072/kapita namun mencatat outcome terburuk di antara negara maju (★). Vietnam dengan $171/kapita menang mutlak (★★★★★). Spearman r ≈ −0.12 — arahnya berlawanan dengan asumsi dasar kebijakan kesehatan.",
    interpret:"Di bawah sistem yang timpang, anggaran besar hanya memperkuat fasilitas elit, bukan ketahanan akar rumput. Tanpa keadilan distribusi, uang adalah angka di atas kertas. Struktur sosial-politik mendahului kapasitas fiskal.",
    indonesiaNote:"Indonesia: $112/kapita — terendah kedua di dataset — namun mencapai outcome moderat (★★★). Jaringan Puskesmas yang menjangkau desa, tradisi gotong royong sebagai penyangga informal, dan pengalaman kolektif dari bencana berulang membangun kapasitas adaptif yang tidak tercatat dalam neraca anggaran.",
    accent:"#be123c", accentLight:"#fff1f2",
    xKey:"s", xLog:true, xLabel:"Pengeluaran Kesehatan USD/kapita (log)",
    ann:[{n:"AS",label:"AS·$11k",side:"right",dy:-18},{n:"Vietnam",label:"Vietnam·$171",side:"left",dy:16},{n:"Kuba",label:"Kuba·$971",side:"left",dy:-22},{n:"Indonesia",label:"Indonesia·$112",side:"right",dy:22,isIDN:true}],
  },
  {
    id:"q2", num:"02",
    verdict:"Kegagalan Teknokrasi",
    verdictSub:"r ≈ +0.11, tidak signifikan",
    question:"Apakah tumpukan tempat tidur rumah sakit cukup untuk menahan gelombang pandemi?",
    challenge:"Rusia mewarisi 8,0 bed/1.000 jiwa dari sistem Semashko Soviet — salah satu tertinggi di dunia. Sputnik V selesai sebelum Pfizer. Excess mortality-nya melampaui 1 juta jiwa.",
    pullStat:"50%",
    pullText:"cakupan vaksinasi domestik Rusia, meski Sputnik V dikembangkan lebih awal dari Pfizer. Rakyat tidak percaya pada vaksin negara sendiri.",
    premise:"Kesuksesan diukur dari rasio tempat tidur dan kecanggihan alat medis. Perkuat kapasitas sistem — tambah bed, tambah nakes, bangun RSUD. Kesiapan fisik adalah fondasi respons pandemi.",
    dataNote:"Rusia: 8,0 bed/1.000 jiwa → ★★☆☆☆. Korea: 12,4 bed/1.000 jiwa → ★★★★★. Profil infrastruktur fisik yang hampir setara, outcome yang berbeda secara fundamental. Korelasi bed ratio vs outcome: r ≈ +0.11, jauh dari signifikan.",
    interpret:"Tempat tidur RS tidak ada gunanya jika rakyat tidak percaya pada institusi yang mengelolanya. Infrastruktur fisik tanpa infrastruktur kepercayaan adalah kerangka kosong. Dekade oligarki pasca-Soviet menghancurkan modal sosial yang tidak bisa dibangun kembali dengan anggaran.",
    indonesiaNote:"Indonesia: 1,0 bed/1.000 jiwa — terendah di dataset — namun outcome moderat. Kader Posyandu dan bidan desa membangun kepercayaan komunitas jauh sebelum pandemi datang. Inilah \"infrastruktur lunak\" yang tidak muncul dalam audit kapasitas fisik, tetapi sangat menentukan saat krisis.",
    accent:"#c2410c", accentLight:"#fff7ed",
    xKey:"b", xLog:false, xLabel:"Rasio Tempat Tidur per 1.000 Penduduk",
    ann:[{n:"Rusia",label:"Rusia·8.0",side:"right",dy:-22},{n:"Korea",label:"Korea·12.4",side:"right",dy:20},{n:"Vietnam",label:"Vietnam·2.6",side:"left",dy:-22},{n:"Indonesia",label:"Indonesia·1.0",side:"left",dy:20,isIDN:true}],
  },
  {
    id:"q3", num:"03",
    verdict:"Narasi Kambing Hitam",
    verdictSub:"β = −0.32, p > 0.05, tidak signifikan",
    question:"Benarkah kemiskinan dan kepadatan penduduk adalah vonis mati saat pandemi?",
    challenge:"Bangladesh dianggap bom waktu demografis: 1.300 jiwa/km², $88/kapita, median usia 28 tahun. Data menolak vonis itu. Variabel demografi adalah satu-satunya konstruk yang tidak signifikan dalam model SEM.",
    pullStat:"β=−0.32",
    pullText:"— satu-satunya konstruk yang gagal lolos uji signifikansi dalam model PLS-SEM Kim (2020). Profil demografis bukan prediktor resiliensi.",
    premise:"Negara padat dan miskin seperti Bangladesh dianggap \"bom waktu\" yang pasti akan hancur lebur karena demografinya. Epidemiologi mengajarkan: identifikasi populasi rentan, prediksi beban, alokasikan sumber daya.",
    dataNote:"Bangladesh (1.300 jiwa/km², $88/kapita): ★★★. Pakistan dan Nigeria — profil demografis \"paling rawan\" di dataset: ★★★. Keduanya melampaui beberapa negara Eropa yang secara demografis jauh lebih \"ideal\". Prediksi berbasis demografi gagal secara sistematis.",
    interpret:"Kita sering menyalahkan kepadatan penduduk untuk menutupi kegagalan koordinasi pemerintah. Modal sosial komunitas — jaringan informal, kepemimpinan lokal, pengalaman kolektif — seringkali lebih kuat dari prediksi matematis populasi. Demografi adalah konteks, bukan takdir.",
    indonesiaNote:"Jawa: 150 juta jiwa di 130.000 km², salah satu wilayah terpadat di dunia. Namun respons Yogyakarta berbeda drastis dari Surabaya. Variabel penentu bukan kepadatan — melainkan kualitas kepemimpinan lokal dan densitas modal sosial yang dibangun selama bertahun-tahun.",
    accent:"#a16207", accentLight:"#fefce8",
    xKey:"g", xLog:true, xLabel:"GDP per Kapita USD (log) — proksi kapasitas",
    ann:[{n:"Bangladesh",label:"Bangladesh·$2.2k",side:"left",dy:-22},{n:"AS",label:"AS·$63k",side:"right",dy:-20},{n:"Vietnam",label:"Vietnam·$3.8k",side:"left",dy:20},{n:"Indonesia",label:"Indonesia·$4.3k",side:"right",dy:22,isIDN:true}],
  },
  {
    id:"q4", num:"04",
    verdict:"Kedaulatan vs Label",
    verdictSub:"korelasi demokrasi vs outcome ≈ 0",
    question:"Apakah demokrasi menjamin respons krisis yang lebih baik?",
    challenge:"Vietnam (otokrasi satu partai) dan Taiwan (demokrasi muda) sama-sama di puncak. Inggris dan AS — dua demokrasi tertua dan terkaya — berada di dasar. Korelasi label sistem politik dengan outcome: mendekati nol.",
    pullStat:"3/5",
    pullText:"negara dengan outcome terbaik adalah non-demokrasi elektoral. Label tidak menentukan kapasitas.",
    premise:"Demokrasi dengan transparansinya dianggap paling adaptif: akuntabilitas publik menghasilkan kebijakan yang responsif, kebebasan pers menghasilkan koreksi cepat, partisipasi sipil menghasilkan kepatuhan kolektif.",
    dataNote:"Vietnam (satu partai): ★★★★★. Taiwan (demokrasi muda): ★★★★★. Korea Selatan (demokrasi dengan memori Gwangju 1980): ★★★★★. AS (demokrasi tertua): ★. UK (Westminster): ★★★. Distribusi ini tidak mendukung hipotesis linier apapun.",
    interpret:"Yang bekerja bukan \"label\" sistemnya, melainkan kapasitas negara untuk mengorkestrasi tindakan kolektif dan tingkat kepercayaan publik terhadap institusi. Skandal Partygate menghancurkan legitimasi moral seruan kepatuhan di UK. Krisis tidak peduli pada ideologi, tetapi pada kompetensi.",
    indonesiaNote:"Indonesia: demokrasi elektoral, namun outcome moderat karena desentralisasi yang tidak merata. Beberapa gubernur bergerak cepat (DIY, Jawa Barat), mayoritas lambat. Ini bukan argumen anti-demokrasi — melainkan argumen untuk membangun kapasitas pemerintah daerah yang nyata, bukan sekadar pelimpahan administratif.",
    accent:"#6d28d9", accentLight:"#f5f3ff",
    xKey:"democ", xLog:false, xLabel:"Status Sistem Politik", isJitter:true,
    ann:[{n:"Vietnam",label:"Vietnam",side:"right",dy:-24},{n:"AS",label:"AS",side:"left",dy:20},{n:"Korea",label:"Korea",side:"right",dy:20}],
  },
  {
    id:"q5", num:"05",
    verdict:"Paradoks Kekayaan",
    verdictSub:"r ≈ −0.08, tidak signifikan",
    question:"Mengapa GDP tinggi justru menjadi beban saat menghadapi krisis kesehatan?",
    challenge:"Ada korelasi negatif yang tidak nyaman: semakin kaya sebuah negara, semakin lambat adaptasinya terhadap realitas darurat di lapangan. Kekayaan nasional tidak mendistribusikan dirinya sendiri.",
    pullStat:"11×",
    pullText:"selisih GDP per kapita antara UK dan Vietnam. UK: ★★★. Vietnam: ★★★★★.",
    premise:"Kekayaan nasional adalah penyangga terbaik untuk membeli logistik, teknologi, dan kapasitas respons cepat. GDP tinggi berarti pilihan yang lebih banyak dan margin kesalahan yang lebih lebar.",
    dataNote:"r ≈ −0.08 (sedikit negatif, tidak signifikan). UK ($42k/kapita): ★★★. Italia ($33k): ★★★. AS ($63k): ★. Vietnam ($3,7k): ★★★★★. Gini coefficient — bukan GDP — secara konsisten lebih prediktif untuk resiliensi sistem dalam krisis.",
    interpret:"Di negara kaya, ekonomi seringkali menyandera kebijakan kesehatan. Gig economy memaksa jutaan pekerja UK memilih antara karantina dan makan. Di AS, 30 juta orang tidak terasuransi saat pandemi. Kekayaan nasional tanpa jaminan sosial yang merata adalah ilusi keamanan kolektif.",
    indonesiaNote:"Indonesia: GDP rendah namun outcome moderat — sebagian karena kekayaan yang ada, meski terbatas, relatif merata diakses melalui Puskesmas dan program JKN. Ini bukan alasan untuk puas; ini argumen untuk memperdalam jaminan sosial universal sebagai investasi ketahanan, bukan sekadar program kesejahteraan.",
    accent:"#0369a1", accentLight:"#f0f9ff",
    xKey:"g", xLog:true, xLabel:"GDP per Kapita USD (log)",
    ann:[{n:"UK",label:"UK·$42k",side:"right",dy:-24},{n:"Vietnam",label:"Vietnam·$3.8k",side:"left",dy:20},{n:"AS",label:"AS·$63k",side:"right",dy:20},{n:"Indonesia",label:"Indonesia·$4.3k",side:"left",dy:-22,isIDN:true}],
  },
];

/* ═══ ILLUSTRATIONS ══════════════════════════════════════════════════ */

/* Q1 ── The Leaky Pipeline ─────────────────────────────────────────── */
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

      {/* ═ PIPA AS — raksasa, bocor ═ */}
      <text x="18" y="70" fill="#991b1b" fontSize="12" fontWeight="700"
        fontFamily="'IBM Plex Mono',monospace">$11.072</text>
      <text x="18" y="84" fill="#a8a29e" fontSize="8"
        fontFamily="'IBM Plex Mono',monospace">per kapita · AS</text>

      {/* badan pipa besar */}
      <rect x="108" y="58" width="430" height="46" rx="23"
        fill="url(#pL)" opacity="0.88"/>
      {/* sheen */}
      <rect x="116" y="63" width="414" height="10" rx="5"
        fill="white" opacity="0.07"/>

      {/* kebocoran */}
      {leaks.map((l,i)=>(
        <g key={i} transform={`rotate(${l.rot},${l.x},93)`}>
          <ellipse cx={l.x} cy={98} rx="9" ry="6"
            fill="#fef2f2" opacity="0.95"/>
          {[0,1,2].map(j=>(
            <line key={j}
              x1={l.x+(j-1)*5} y1={92}
              x2={l.x+(j-1)*9} y2={72-j*3}
              stroke="#fca5a5" strokeWidth="1.8" strokeLinecap="round" opacity="0.85"/>
          ))}
          <rect x={l.x-32} y={52} width="64" height="17" rx="3"
            fill="#fef2f2" stroke="#fca5a5" strokeWidth="1"/>
          <text x={l.x} y={64} textAnchor="middle"
            fill="#991b1b" fontSize="7.5" fontWeight="600"
            fontFamily="'IBM Plex Mono',monospace">{l.label}</text>
        </g>
      ))}

      {/* output AS — kurus, hampir habis */}
      <line x1="538" y1="81" x2="608" y2="81"
        stroke="#fca5a5" strokeWidth="5" strokeLinecap="round"
        markerEnd="url(#arR)"/>
      <text x="628" y="77" fill="#991b1b" fontSize="13" fontFamily="Georgia">★</text>
      <text x="630" y="90" fill="#a8a29e" fontSize="7.5"
        fontFamily="'IBM Plex Mono',monospace">Outcome</text>

      {/* ═ PIPA VIETNAM — ramping, solid, tanpa bocor ═ */}
      <text x="18" y="152" fill="#166534" fontSize="12" fontWeight="700"
        fontFamily="'IBM Plex Mono',monospace">$171</text>
      <text x="18" y="166" fill="#a8a29e" fontSize="8"
        fontFamily="'IBM Plex Mono',monospace">per kapita · Vietnam</text>

      <rect x="108" y="152" width="430" height="26" rx="13"
        fill="url(#pG)" opacity="0.9"/>
      <rect x="116" y="156" width="414" height="7" rx="3"
        fill="white" opacity="0.08"/>
      {/* aliran mulus */}
      {[140,195,250,305,360,415,470,520].map((x,i)=>(
        <line key={i} x1={x} y1="161" x2={x+35} y2="161"
          stroke="#86efac" strokeWidth="1.2" opacity="0.35"/>
      ))}

      {/* output Vietnam — penuh */}
      <line x1="538" y1="165" x2="608" y2="165"
        stroke="#4ade80" strokeWidth="7" strokeLinecap="round"
        markerEnd="url(#arG)"/>
      <text x="616" y="161" fill="#166534" fontSize="13" fontFamily="Georgia">★★★★★</text>
      <text x="630" y="174" fill="#a8a29e" fontSize="7.5"
        fontFamily="'IBM Plex Mono',monospace">Outcome</text>

      <text x="340" y="232" textAnchor="middle" fill="#c4b5a5"
        fontSize="8" fontFamily="'IBM Plex Mono',monospace">
        Volume anggaran adalah potensi — integritas sistem menentukan realitas
      </text>
    </svg>
  );
}

/* Q2 ── The Hollow Cathedral ───────────────────────────────────────── */
function IllusInfra() {
  return (
    <svg viewBox="0 0 680 248" style={{width:"100%",height:"auto",display:"block"}}>
      <defs>
        <pattern id="hatchFnd" patternUnits="userSpaceOnUse" width="8" height="8"
          patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="8" stroke="#fca5a5"
            strokeWidth="1" opacity="0.45"/>
        </pattern>
      </defs>

      {/* ═ FONDASI RETAK ═ */}
      <rect x="148" y="190" width="384" height="34" rx="3"
        fill="#fef2f2" stroke="#fca5a5" strokeWidth="1.5"/>
      <rect x="148" y="190" width="384" height="34" rx="3" fill="url(#hatchFnd)"/>
      {/* retakan zig-zag */}
      {[
        "M210,190 L228,202 L218,210 L235,224",
        "M335,190 L348,202 L338,212 L352,224",
        "M458,190 L447,202 L458,211 L446,224",
        "M280,190 L290,198 L280,206 L292,224",
      ].map((d,i)=>(
        <path key={i} d={d} fill="none" stroke="#991b1b"
          strokeWidth={i<2?2.5:1.8} strokeLinecap="round"/>
      ))}
      <text x="340" y="212" textAnchor="middle" fill="#991b1b"
        fontSize="8.5" fontWeight="700" letterSpacing="2.5"
        fontFamily="'IBM Plex Mono',monospace">⚠ PUBLIC TRUST DEFICIT</text>

      {/* ═ FASAD GEDUNG ═ */}
      <rect x="168" y="76" width="344" height="115"
        fill="#f5f5f2" stroke="#d6d3d1" strokeWidth="1.5"/>
      {[184,218,252,286,320,354,388,422,456,478].map((x,i)=>(
        <rect key={i} x={x} y="76" width="12" height="115"
          fill="#e8e6e2" stroke="#d6d3d1" strokeWidth="0.5"/>
      ))}
      <rect x="168" y="65" width="344" height="16"
        fill="#d6d3d1" stroke="#c4b5a5" strokeWidth="1"/>
      <polygon points="168,65 340,20 512,65"
        fill="#e7e5e4" stroke="#c4b5a5" strokeWidth="1.5"/>
      <text x="340" y="47" textAnchor="middle" fill="#78716c"
        fontSize="7.5" fontWeight="700" letterSpacing="2"
        fontFamily="'IBM Plex Mono',monospace">ГОСУДАРСТВЕННАЯ БОЛЬНИЦА</text>
      <rect x="334" y="24" width="7" height="20" rx="1" fill="#be123c"/>
      <rect x="328" y="30" width="19" height="7" rx="1" fill="#be123c"/>

      {/* jendela 1: antrian kacau */}
      <rect x="188" y="92" width="52" height="58" rx="2"
        fill="#fef3c7" stroke="#c4b5a5" strokeWidth="1"/>
      {[198,210,220,230,238].map((x,i)=>(
        <g key={i} opacity="0.75">
          <circle cx={x} cy="124" r="4.5" fill="#92400e"/>
          <rect x={x-3.5} y="129" width="7" height="12" rx="1.5" fill="#92400e"/>
        </g>
      ))}
      <text x="214" y="157" textAnchor="middle" fill="#92400e"
        fontSize="7" fontWeight="700" fontFamily="'IBM Plex Mono',monospace">ANTRIAN</text>

      {/* jendela 2: stok habis */}
      <rect x="254" y="92" width="52" height="58" rx="2"
        fill="#fef2f2" stroke="#fca5a5" strokeWidth="1.5"/>
      <text x="280" y="124" textAnchor="middle" fill="#991b1b"
        fontSize="20">⊘</text>
      <text x="280" y="140" textAnchor="middle" fill="#991b1b"
        fontSize="7.5" fontWeight="700" fontFamily="'IBM Plex Mono',monospace">STOK HABIS</text>

      {/* jendela 3: gelap */}
      <rect x="318" y="92" width="44" height="58" rx="2"
        fill="#1c1917" stroke="#44403c" strokeWidth="1"/>
      <text x="340" y="128" textAnchor="middle" fill="#57534e"
        fontSize="20">✕</text>

      {/* jendela 4: vaksin ditolak */}
      <rect x="376" y="92" width="52" height="58" rx="2"
        fill="#fef2f2" stroke="#fca5a5" strokeWidth="1"/>
      <text x="402" y="122" textAnchor="middle" fill="#991b1b"
        fontSize="15">💉</text>
      <text x="402" y="136" textAnchor="middle" fill="#991b1b"
        fontSize="7.5" fontWeight="700" fontFamily="'IBM Plex Mono',monospace">DITOLAK</text>
      <text x="402" y="147" textAnchor="middle" fill="#a8a29e"
        fontSize="6.5" fontFamily="'IBM Plex Mono',monospace">50% coverage</text>

      {/* jendela 5: Korea — OK */}
      <rect x="442" y="92" width="52" height="58" rx="2"
        fill="#f0fdf4" stroke="#4ade80" strokeWidth="1.5"/>
      <text x="468" y="122" textAnchor="middle" fill="#166534"
        fontSize="16">✓</text>
      <text x="468" y="136" textAnchor="middle" fill="#166534"
        fontSize="7.5" fontWeight="700" fontFamily="'IBM Plex Mono',monospace">Korea</text>
      <text x="468" y="147" textAnchor="middle" fill="#166534"
        fontSize="7" fontFamily="Georgia">★★★★★</text>

      {/* pintu */}
      <rect x="316" y="158" width="48" height="33" rx="2"
        fill="#44403c" stroke="#1c1917" strokeWidth="1.5"/>

      {/* stat samping */}
      <text x="82" y="118" textAnchor="middle" fill="#991b1b"
        fontSize="18" fontWeight="900" fontFamily="'IBM Plex Mono',monospace">8.0</text>
      <text x="82" y="133" textAnchor="middle" fill="#a8a29e"
        fontSize="7.5" fontFamily="'IBM Plex Mono',monospace">bed/1.000</text>
      <text x="82" y="147" textAnchor="middle" fill="#991b1b"
        fontSize="9" fontFamily="Georgia">★★☆☆☆</text>
      <text x="82" y="160" textAnchor="middle" fill="#a8a29e"
        fontSize="7.5" fontFamily="'IBM Plex Mono',monospace">Rusia</text>

      <text x="598" y="118" textAnchor="middle" fill="#166534"
        fontSize="18" fontWeight="900" fontFamily="'IBM Plex Mono',monospace">12.4</text>
      <text x="598" y="133" textAnchor="middle" fill="#a8a29e"
        fontSize="7.5" fontFamily="'IBM Plex Mono',monospace">bed/1.000</text>
      <text x="598" y="147" textAnchor="middle" fill="#166534"
        fontSize="9" fontFamily="Georgia">★★★★★</text>
      <text x="598" y="160" textAnchor="middle" fill="#166534"
        fontSize="7.5" fontFamily="'IBM Plex Mono',monospace">Korea</text>

      <text x="340" y="242" textAnchor="middle" fill="#c4b5a5"
        fontSize="8" fontFamily="'IBM Plex Mono',monospace">
        Kapasitas fisik tanpa legitimasi sosial hanyalah kerangka kosong
      </text>
    </svg>
  );
}

/* Q3 ── The Social Weave ───────────────────────────────────────────── */
function IllusDemography() {
  const nodes = [];
  for (let r=0;r<7;r++) for (let c=0;c<15;c++) {
    const x=100+c*35+(r%2)*17, y=24+r*26;
    const dx=x-340, dy=y-105;
    const dist=Math.sqrt(dx*dx+dy*dy);
    nodes.push({x,y,dist,core:dist<90,mid:dist<158});
  }
  const edges = [];
  const weaveNodes=nodes.filter(n=>n.mid);
  weaveNodes.forEach((a,i)=>{
    weaveNodes.slice(i+1).forEach(b=>{
      const d=Math.sqrt((a.x-b.x)**2+(a.y-b.y)**2);
      if(d<44) edges.push({...a, x2:b.x, y2:b.y, core:a.core&&b.core});
    });
  });
  const viruses=[{x:68,y:46},{x:58,y:140},{x:75,y:196},
    {x:608,y:40},{x:614,y:148},{x:602,y:202},
    {x:255,y:6},{x:408,y:5}];

  return (
    <svg viewBox="0 0 680 220" style={{width:"100%",height:"auto",display:"block",overflow:"visible"}}>
      {/* shield glow */}
      <circle cx="340" cy="105" r="162" fill="#166534" opacity="0.04"/>
      <circle cx="340" cy="105" r="162" fill="none"
        stroke="#166534" strokeWidth="1.5" strokeDasharray="7 5" opacity="0.18"/>
      <circle cx="340" cy="105" r="96" fill="#166534" opacity="0.05"/>

      {/* network edges */}
      {edges.map((e,i)=>(
        <line key={i} x1={e.x} y1={e.y} x2={e.x2} y2={e.y2}
          stroke={e.core?"#166534":"#bbf7d0"}
          strokeWidth={e.core?1.2:0.6}
          opacity={e.core?0.55:0.3}/>
      ))}

      {/* human figures */}
      {nodes.map((n,i)=>{
        const sz=n.core?5.5:n.mid?4.5:3;
        const col=n.core?"#166534":n.mid?"#4ade80":"#d1fae5";
        const op=n.core?0.95:n.mid?0.7:0.28;
        return (
          <g key={i} opacity={op}>
            <circle cx={n.x} cy={n.y} r={sz} fill={col}/>
            <rect x={n.x-sz*.75} y={n.y+sz+1} width={sz*1.5} height={sz*2.2}
              rx={sz*.45} fill={col}/>
          </g>
        );
      })}

      {/* virus particles */}
      {viruses.map((v,i)=>(
        <g key={i}>
          <circle cx={v.x} cy={v.y} r={9}
            fill="#fef2f2" stroke="#fca5a5" strokeWidth="1.5"/>
          {[0,60,120,180,240,300].map((a,j)=>{
            const rad=a*Math.PI/180;
            return <line key={j}
              x1={v.x+Math.cos(rad)*9} y1={v.y+Math.sin(rad)*9}
              x2={v.x+Math.cos(rad)*14} y2={v.y+Math.sin(rad)*14}
              stroke="#fca5a5" strokeWidth="1.8" strokeLinecap="round"/>;
          })}
          <text x={v.x} y={v.y+4} textAnchor="middle"
            fill="#991b1b" fontSize="8" fontWeight="700">✕</text>
        </g>
      ))}

      {/* label jaring */}
      <text x="340" y="104" textAnchor="middle"
        fill="#166534" fontSize="8" fontWeight="700" letterSpacing="2.5"
        fontFamily="'IBM Plex Mono',monospace" opacity="0.45">
        COMMUNITY RESILIENCE
      </text>

      {/* callouts */}
      <rect x="8" y="74" width="82" height="62" rx="6"
        fill="#fefce8" stroke="#d97706" strokeWidth="1"/>
      <text x="49" y="92" textAnchor="middle" fill="#92400e"
        fontSize="11" fontWeight="700" fontFamily="'IBM Plex Mono',monospace">1.300</text>
      <text x="49" y="105" textAnchor="middle" fill="#a8a29e"
        fontSize="7" fontFamily="'IBM Plex Mono',monospace">jiwa/km²</text>
      <text x="49" y="118" textAnchor="middle" fill="#92400e"
        fontSize="9" fontFamily="Georgia">★★★☆☆</text>
      <text x="49" y="130" textAnchor="middle" fill="#a8a29e"
        fontSize="7" fontFamily="'IBM Plex Mono',monospace">Bangladesh</text>

      <rect x="590" y="74" width="82" height="62" rx="6"
        fill="#f5f5f0" stroke="#d6d3d1" strokeWidth="1"/>
      <text x="631" y="94" textAnchor="middle" fill="#9ca3af"
        fontSize="10" fontWeight="700" fontFamily="'IBM Plex Mono',monospace">β=−0.32</text>
      <text x="631" y="107" textAnchor="middle" fill="#c4b5a5"
        fontSize="7" fontFamily="'IBM Plex Mono',monospace">Demografi</text>
      <text x="631" y="119" textAnchor="middle" fill="#c4b5a5"
        fontSize="7" fontFamily="'IBM Plex Mono',monospace">p {">"} 0.05</text>
      <text x="631" y="131" textAnchor="middle" fill="#c4b5a5"
        fontSize="7" fontFamily="'IBM Plex Mono',monospace">tdk signifikan</text>

      <text x="340" y="214" textAnchor="middle" fill="#c4b5a5"
        fontSize="8" fontFamily="'IBM Plex Mono',monospace">
        Kedekatan sosial bukan beban populasi — ia adalah jaring pengaman paling purba
      </text>
    </svg>
  );
}

/* Q4 ── The Capacity Engine ───────────────────────────────────────── */
/* Gear must be defined at MODULE LEVEL — defining inside function body causes
   React to create a new component type on every render → unmount/remount loop */
function GearSVG({cx,cy,r,col,broken}) {
  const teeth=12;
  const ro=r+11, ri=r;
  const pts=Array.from({length:teeth},(_,i)=>{
    const a1=(i/teeth)*Math.PI*2-0.15;
    const a2=(i/teeth)*Math.PI*2+0.15;
    const a3=((i+0.5)/teeth)*Math.PI*2-0.15;
    const a4=((i+0.5)/teeth)*Math.PI*2+0.15;
    const px=(a,rr)=>[(cx+Math.cos(a)*rr).toFixed(1),(cy+Math.sin(a)*rr).toFixed(1)].join(",");
    return `M${px(a1,ri)} L${px(a1,ro)} L${px(a2,ro)} L${px(a2,ri)} L${px(a3,ri)} L${px(a3,ro)} L${px(a4,ro)} L${px(a4,ri)}`;
  }).join(" ")+"Z";
  return (
    <g>
      <circle cx={cx} cy={cy} r={r+20} fill={col} opacity="0.06"/>
      <path d={pts} fill={broken?"#fef2f2":"#f0fdf4"}
        stroke={col} strokeWidth="1.8" strokeLinejoin="round"/>
      <circle cx={cx} cy={cy} r={r*0.52}
        fill={broken?"#fff1f2":"#ecfdf5"} stroke={col} strokeWidth="1.5"/>
      <text x={cx} y={cy+8} textAnchor="middle" fontSize="20"
        fontWeight="900" fill={broken?"#991b1b":"#166534"}>
        {broken?"✕":"⟳"}
      </text>
    </g>
  );
}

function IllusDemocracy() {
    <svg viewBox="0 0 680 238" style={{width:"100%",height:"auto",display:"block"}}>
      {/* ═ MESIN KIRI: macet ═ */}
      <rect x="34" y="36" width="258" height="158" rx="14"
        fill="#fef2f2" stroke="#fca5a5" strokeWidth="1.5"/>
      <text x="163" y="57" textAnchor="middle" fill="#991b1b"
        fontSize="8.5" fontWeight="700" letterSpacing="2"
        fontFamily="'IBM Plex Mono',monospace">DEMOKRASI</text>
      <text x="163" y="70" textAnchor="middle" fill="#a8a29e"
        fontSize="7.5" fontFamily="'IBM Plex Mono',monospace">AS · UK · Peru</text>

      <GearSVG cx={163} cy={136} r={44} broken={true} col="#fca5a5"/>

      {/* fuel: ideology */}
      <rect x="50" y="86" width="60" height="24" rx="5"
        fill="#f5f3ff" stroke="#c4b5fd" strokeWidth="1"/>
      <text x="80" y="102" textAnchor="middle" fill="#7c3aed"
        fontSize="7.5" fontWeight="700" fontFamily="'IBM Plex Mono',monospace">IDEOLOGY</text>
      <line x1="110" y1="98" x2="118" y2="115"
        stroke="#c4b5fd" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.6"/>

      <text x="163" y="182" textAnchor="middle" fill="#991b1b"
        fontSize="9" fontFamily="Georgia">★☆☆☆☆ – ★★★☆☆</text>

      {/* ═ MESIN KANAN: berputar ═ */}
      <rect x="388" y="36" width="258" height="158" rx="14"
        fill="#f0fdf4" stroke="#86efac" strokeWidth="1.5"/>
      <text x="517" y="57" textAnchor="middle" fill="#166534"
        fontSize="8.5" fontWeight="700" letterSpacing="2"
        fontFamily="'IBM Plex Mono',monospace">VIETNAM · TAIWAN · KOREA</text>
      <text x="517" y="70" textAnchor="middle" fill="#a8a29e"
        fontSize="7.5" fontFamily="'IBM Plex Mono',monospace">Otokrasi + Demokrasi</text>

      <GearSVG cx={517} cy={136} r={44} broken={false} col="#4ade80"/>

      {/* fuel: state capacity */}
      <rect x="404" y="86" width="82" height="24" rx="5"
        fill="#f0fdf4" stroke="#4ade80" strokeWidth="1.5"/>
      <text x="445" y="102" textAnchor="middle" fill="#166534"
        fontSize="7.5" fontWeight="700" fontFamily="'IBM Plex Mono',monospace">STATE CAPACITY</text>
      <line x1="486" y1="98" x2="474" y2="115"
        stroke="#4ade80" strokeWidth="2" opacity="0.65"/>

      <text x="517" y="182" textAnchor="middle" fill="#166534"
        fontSize="9" fontFamily="Georgia">★★★★★</text>

      {/* center VS */}
      <text x="340" y="116" textAnchor="middle" fill="#e7e5e4"
        fontSize="36" fontWeight="900" fontFamily="'Playfair Display',serif"
        opacity="0.55">vs</text>
      <rect x="298" y="148" width="84" height="36" rx="8"
        fill="#fafaf7" stroke="#e7e5e4" strokeWidth="1"/>
      <text x="340" y="163" textAnchor="middle" fill="#78716c"
        fontSize="7" fontFamily="'IBM Plex Mono',monospace">Yang membedakan</text>
      <text x="340" y="176" textAnchor="middle" fill="#1c1917"
        fontSize="8.5" fontWeight="700" fontFamily="'IBM Plex Mono',monospace">Kompetensi</text>

      <text x="340" y="230" textAnchor="middle" fill="#c4b5a5"
        fontSize="8" fontFamily="'IBM Plex Mono',monospace">
        Virus tidak peduli pada ideologi — ia hanya takut pada kompetensi organisasi
      </text>
    </svg>
  );
}

/* Q5 ── The Wealth Trap ─────────────────────────────────────────────── */
function IllusWealth() {
  const coinStack = Array.from({length:12},(_,i)=>i);
  const chainAngle = Array.from({length:13},(_,i)=>i*(360/13));
  return (
    <svg viewBox="0 0 680 248" style={{width:"100%",height:"auto",display:"block"}}>
      <defs>
        <radialGradient id="goldG" cx="50%" cy="80%" r="60%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.2"/>
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0"/>
        </radialGradient>
      </defs>

      {/* ═ TUMPUKAN KOIN ═ */}
      <ellipse cx="290" cy="200" rx="112" ry="18"
        fill="#fbbf24" opacity="0.12"/>
      {coinStack.map(i=>(
        <g key={i}>
          <ellipse cx="290" cy={195-i*13} rx={106-i*2.5} ry="11"
            fill={i%2===0?"#fbbf24":"#f59e0b"}
            stroke="#d97706" strokeWidth="0.8"/>
          {i===11 && (
            <>
              <text x="290" y={192-i*13} textAnchor="middle"
                fill="#78350f" fontSize="9" fontWeight="700"
                fontFamily="'IBM Plex Mono',monospace">NATIONAL GDP</text>
              <text x="290" y={181-i*13} textAnchor="middle"
                fill="#92400e" fontSize="8.5"
                fontFamily="'IBM Plex Mono',monospace">$63k · $42k · $33k</text>
            </>
          )}
        </g>
      ))}
      <ellipse cx="290" cy="196" rx="112" ry="18" fill="url(#goldG)"/>

      {/* ═ RANTAI MELINGKARI TUMPUKAN ═ */}
      {chainAngle.map((a,i)=>{
        const rad=a*Math.PI/180;
        const rx_=118, ry_=86, cx_=290, cy_=146;
        const cx2=cx_+Math.cos(rad)*rx_, cy2=cy_+Math.sin(rad)*ry_;
        return (
          <ellipse key={i} cx={cx2} cy={cy2} rx="11" ry="7"
            fill="none" stroke="#44403c" strokeWidth="4.5"
            transform={`rotate(${a},${cx2},${cy2})`}
            opacity="0.88"/>
        );
      })}
      <text x="290" y="66" textAnchor="middle" fill="#44403c"
        fontSize="8.5" fontWeight="700" letterSpacing="2.5"
        fontFamily="'IBM Plex Mono',monospace">ECONOMIC INTERESTS</text>
      <line x1="290" y1="70" x2="290" y2="84"
        stroke="#44403c" strokeWidth="2" strokeDasharray="3 2"/>

      {/* ═ NAKES — tangan menggapai, kaki terbelenggu ═ */}
      {/* body */}
      <circle cx="522" cy="84" r="15" fill="#dbeafe" stroke="#93c5fd" strokeWidth="1.5"/>
      <text x="522" y="90" textAnchor="middle" fontSize="16">👩‍⚕️</text>
      <rect x="514" y="99" width="16" height="32" rx="4"
        fill="#dbeafe" stroke="#93c5fd" strokeWidth="1"/>
      {/* lengan menggapai atas kiri */}
      <path d="M514,110 C496,100 484,88 468,74"
        fill="none" stroke="#93c5fd" strokeWidth="3.5" strokeLinecap="round"/>
      {/* tangan kanan */}
      <line x1="530" y1="110" x2="540" y2="122"
        stroke="#93c5fd" strokeWidth="3.5" strokeLinecap="round"/>
      {/* kaki */}
      <line x1="518" y1="131" x2="512" y2="154"
        stroke="#93c5fd" strokeWidth="3.5" strokeLinecap="round"/>
      <line x1="526" y1="131" x2="532" y2="154"
        stroke="#93c5fd" strokeWidth="3.5" strokeLinecap="round"/>
      {/* belenggu kaki */}
      <ellipse cx="510" cy="157" rx="10" ry="7"
        fill="none" stroke="#44403c" strokeWidth="4"/>
      <ellipse cx="534" cy="157" rx="10" ry="7"
        fill="none" stroke="#44403c" strokeWidth="4"/>
      <line x1="520" y1="157" x2="524" y2="157"
        stroke="#44403c" strokeWidth="4"/>

      {/* obat yang ingin dijangkau */}
      <rect x="432" y="48" width="34" height="30" rx="5"
        fill="#f0fdf4" stroke="#4ade80" strokeWidth="1.5"/>
      <text x="449" y="70" textAnchor="middle" fill="#166534"
        fontSize="16">💊</text>
      {/* panah gagal */}
      <line x1="468" y1="74" x2="456" y2="70"
        stroke="#991b1b" strokeWidth="1.5" strokeDasharray="3 2"/>
      <text x="450" y="42" textAnchor="middle" fill="#991b1b"
        fontSize="7.5" fontWeight="600" fontFamily="'IBM Plex Mono',monospace">Kebijakan</text>
      <text x="450" y="53" textAnchor="middle" fill="#991b1b"
        fontSize="7.5" fontWeight="600" fontFamily="'IBM Plex Mono',monospace">Tersandera</text>

      {/* stat callout */}
      <text x="606" y="148" textAnchor="middle" fill="#991b1b"
        fontSize="13" fontWeight="700" fontFamily="'IBM Plex Mono',monospace">$63k</text>
      <text x="606" y="163" textAnchor="middle" fill="#a8a29e"
        fontSize="7" fontFamily="'IBM Plex Mono',monospace">AS / kapita</text>
      <text x="606" y="175" textAnchor="middle" fill="#991b1b"
        fontSize="10" fontFamily="Georgia">★☆☆☆☆</text>
      <line x1="590" y1="186" x2="622" y2="186"
        stroke="#e7e5e4" strokeWidth="1"/>
      <text x="606" y="200" textAnchor="middle" fill="#166534"
        fontSize="13" fontWeight="700" fontFamily="'IBM Plex Mono',monospace">$3.7k</text>
      <text x="606" y="215" textAnchor="middle" fill="#a8a29e"
        fontSize="7" fontFamily="'IBM Plex Mono',monospace">Vietnam / kapita</text>
      <text x="606" y="227" textAnchor="middle" fill="#166534"
        fontSize="10" fontFamily="Georgia">★★★★★</text>

      <text x="340" y="243" textAnchor="middle" fill="#c4b5a5"
        fontSize="8" fontFamily="'IBM Plex Mono',monospace">
        Kekayaan nasional seringkali menjadi beban yang melambatkan kelincahan darurat
      </text>
    </svg>
  );
}

const ILLUS={q1:IllusSpending,q2:IllusInfra,q3:IllusDemography,q4:IllusDemocracy,q5:IllusWealth};

/* ═══ STRUCTURAL MODEL (The Synthesis) ═══════════════════════════════ */
function StructuralModel() {
  const [hov,setHov]=useState(null);
  const W=680, H=460;

  // Shadow/peripheral nodes (weak predictors)
  const shadows=[
    {id:"beds",  x:88,  y:88,  label:"Hospital\nBeds",  sub:"r=+0.11",  c:"#9ca3af"},
    {id:"gdp",   x:88,  y:220, label:"National\nGDP",   sub:"r=−0.08",  c:"#9ca3af"},
    {id:"demog", x:88,  y:348, label:"Demography",      sub:"β=−0.32",  c:"#d1d5db"},
  ];
  // Input nodes
  const inputs=[
    {id:"stateCap",  x:258, y:140, label:"State\nCapacity",  sub:"Kapasitas Negara", c:"#6d28d9", r:38},
    {id:"econDist",  x:258, y:288, label:"Economic\nDistrib.",sub:"Distribusi Ekonomi",c:"#0369a1", r:38},
  ];
  // Mediator
  const mediator={id:"inst",x:420,y:214,label:"Institusional",sub:"β=0.49**",c:"#166534",r:34};
  // Core node
  const core={id:"epo",x:420,y:214, label:"",sub:"",c:"#be123c",r:0}; // will use mediator pos
  const outcome={id:"out",x:590,y:214,label:"COVID\nOutcome",sub:"R²=0.74",c:"#be123c",r:46};

  // All arrow edges
  const edges=[
    {x1:296,y1:148,x2:382,y2:204, label:"β=0.61**",c:"#6d28d9",w:3},
    {x1:296,y1:280,x2:382,y2:224, label:"β=0.44**",c:"#0369a1",w:2.5},
    {x1:454,y1:214,x2:544,y2:214, label:"β=0.49**",c:"#166534",w:2.5},
    // direct paths curved around mediator
    {x1:296,y1:136,x2:544,y2:194, label:"β=0.72**",c:"#be123c",w:4.5,curve:true,up:true},
    {x1:296,y1:292,x2:544,y2:234, label:"β=0.58**",c:"#0369a1",w:3,curve:true,up:false},
  ];
  // Shadow dashed edges
  const shadowEdges=[
    {x1:120,y1:88, x2:238,y2:152},
    {x1:120,y1:220,x2:238,y2:274},
    {x1:120,y1:348,x2:544,y2:232},
  ];

  return (
    <div style={{position:"relative"}}>
      <svg viewBox={`0 0 ${W} ${H}`}
        style={{width:"100%",height:"auto",display:"block"}}>
        <defs>
          {["#be123c","#6d28d9","#0369a1","#166534"].map((c,i)=>(
            <marker key={i} id={`sm${i}`}
              markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0,8 3,0 6" fill={c}/>
            </marker>
          ))}
          <marker id="smGray" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
            <polygon points="0 0,7 2.5,0 5" fill="#d1d5db"/>
          </marker>
          <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#be123c" stopOpacity="0.25"/>
            <stop offset="100%" stopColor="#be123c" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="outGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#be123c" stopOpacity="0.15"/>
            <stop offset="100%" stopColor="#be123c" stopOpacity="0"/>
          </radialGradient>
          <filter id="gGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* ── subtle grid ── */}
        {Array.from({length:7},(_,i)=>(
          <line key={"gv"+i} x1={i*114} y1={0} x2={i*114} y2={H}
            stroke="#f3f4f6" strokeWidth="1"/>
        ))}
        {Array.from({length:5},(_,i)=>(
          <line key={"gh"+i} x1={0} y1={i*115} x2={W} y2={i*115}
            stroke="#f3f4f6" strokeWidth="1"/>
        ))}

        {/* ── labels ── */}
        <text x="88" y="20" textAnchor="middle" fill="#d1d5db"
          fontSize="8" fontFamily="'IBM Plex Mono',monospace" letterSpacing="2">
          PERIPHERAL
        </text>
        <text x="258" y="20" textAnchor="middle" fill="#a8a29e"
          fontSize="8" fontFamily="'IBM Plex Mono',monospace" letterSpacing="2">
          INPUT NODES
        </text>
        <text x="420" y="20" textAnchor="middle" fill="#a8a29e"
          fontSize="8" fontFamily="'IBM Plex Mono',monospace" letterSpacing="2">
          MEDIATOR
        </text>
        <text x="590" y="20" textAnchor="middle" fill="#be123c"
          fontSize="8" fontFamily="'IBM Plex Mono',monospace" letterSpacing="2">
          OUTCOME
        </text>

        {/* ── shadow dashed edges ── */}
        {shadowEdges.map((e,i)=>(
          <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
            stroke="#d1d5db" strokeWidth="1.5" strokeDasharray="5 4"
            markerEnd="url(#smGray)" opacity="0.5"/>
        ))}

        {/* ── main edges ── */}
        {edges.map((e,i)=>{
          const colorIdx={"#be123c":0,"#6d28d9":1,"#0369a1":2,"#166534":3};
          const mIdx=colorIdx[e.c]??0;
          const markerRef=`url(#sm${mIdx})`;
          const isH=hov&&(e.label.includes("0.72")?hov==="stateCap"||hov==="out"
            :e.label.includes("0.58")?hov==="econDist"||hov==="out"
            :e.label.includes("0.61")?hov==="stateCap"||hov==="inst"
            :e.label.includes("0.44")?hov==="econDist"||hov==="inst"
            :hov==="inst"||hov==="out");
          if(e.curve){
            const cy=e.up?e.y1-70:e.y1+70;
            const mx=(e.x1+e.x2)/2;
            return (
              <g key={i}>
                <path d={`M${e.x1},${e.y1} C${mx},${cy} ${mx},${cy} ${e.x2},${e.y2}`}
                  fill="none" stroke={e.c} strokeWidth={isH?e.w+2:e.w}
                  opacity={isH?1:0.7} markerEnd={markerRef}
                  style={{transition:"all 0.2s"}}/>
                <text x={mx} y={e.up?cy-6:cy+12} textAnchor="middle"
                  fill={e.c} fontSize="9.5" fontWeight="700"
                  fontFamily="'IBM Plex Mono',monospace"
                  opacity={isH?1:0.75}>{e.label}</text>
              </g>
            );
          }
          const mx=(e.x1+e.x2)/2, my=(e.y1+e.y2)/2;
          return (
            <g key={i}>
              <line x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
                stroke={e.c} strokeWidth={isH?e.w+1.5:e.w}
                opacity={isH?1:0.72} markerEnd={markerRef}
                style={{transition:"all 0.2s"}}/>
              <rect x={mx-20} y={my-9} width="40" height="14" rx="3"
                fill="white" opacity="0.85"/>
              <text x={mx} y={my+1} textAnchor="middle"
                fill={e.c} fontSize="9" fontWeight="700"
                fontFamily="'IBM Plex Mono',monospace">{e.label}</text>
            </g>
          );
        })}

        {/* ── shadow nodes ── */}
        {shadows.map(n=>(
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r={28}
              fill="#f9fafb" stroke="#e5e7eb" strokeWidth="1.5"
              strokeDasharray="5 3"/>
            {n.label.split("\n").map((l,i,arr)=>(
              <text key={i} x={n.x} y={n.y+(i-arr.length/2+0.6)*13}
                textAnchor="middle" fill="#9ca3af"
                fontSize="9.5" fontFamily="'IBM Plex Sans',sans-serif" fontWeight="500">
                {l}
              </text>
            ))}
            <text x={n.x} y={n.y+22} textAnchor="middle"
              fill="#d1d5db" fontSize="8"
              fontFamily="'IBM Plex Mono',monospace">{n.sub}</text>
          </g>
        ))}

        {/* ── input nodes ── */}
        {inputs.map(n=>(
          <g key={n.id}
            onMouseEnter={()=>setHov(n.id)}
            onMouseLeave={()=>setHov(null)}
            style={{cursor:"pointer"}}>
            <circle cx={n.x} cy={n.y} r={n.r+10}
              fill={n.c} opacity={hov===n.id?0.12:0.05}
              style={{transition:"opacity 0.2s"}}/>
            <circle cx={n.x} cy={n.y} r={n.r}
              fill={hov===n.id?n.c+"18":"#fafaf7"}
              stroke={n.c} strokeWidth={hov===n.id?2.5:1.8}
              style={{transition:"all 0.2s"}}/>
            {n.label.split("\n").map((l,i,arr)=>(
              <text key={i} x={n.x} y={n.y+(i-arr.length/2+0.65)*13}
                textAnchor="middle"
                fill={hov===n.id?n.c:"#1c1917"}
                fontSize="10" fontWeight="700"
                fontFamily="'IBM Plex Sans',sans-serif"
                style={{transition:"fill 0.2s"}}>{l}</text>
            ))}
            <text x={n.x} y={n.y+26} textAnchor="middle"
              fill="#a8a29e" fontSize="8"
              fontFamily="'IBM Plex Mono',monospace">{n.sub}</text>
          </g>
        ))}

        {/* ── mediator node ── */}
        <g onMouseEnter={()=>setHov("inst")} onMouseLeave={()=>setHov(null)}
          style={{cursor:"pointer"}}>
          <circle cx={mediator.x} cy={mediator.y} r={mediator.r+10}
            fill={mediator.c} opacity={hov==="inst"?0.12:0.06}
            style={{transition:"opacity 0.2s"}}/>
          <circle cx={mediator.x} cy={mediator.y} r={mediator.r}
            fill={hov==="inst"?mediator.c+"18":"#fafaf7"}
            stroke={mediator.c} strokeWidth={hov==="inst"?2.5:1.8}
            style={{transition:"all 0.2s"}}/>
          {mediator.label.split("\n").map((l,i,arr)=>(
            <text key={i} x={mediator.x} y={mediator.y+(i-arr.length/2+0.65)*13}
              textAnchor="middle"
              fill={hov==="inst"?mediator.c:"#1c1917"}
              fontSize="10" fontWeight="700"
              fontFamily="'IBM Plex Sans',sans-serif">{l}</text>
          ))}
          <text x={mediator.x} y={mediator.y+22} textAnchor="middle"
            fill={mediator.c} fontSize="8.5" fontWeight="700"
            fontFamily="'IBM Plex Mono',monospace">{mediator.sub}</text>
        </g>

        {/* ── CORE OUTCOME NODE — glowing ── */}
        <g onMouseEnter={()=>setHov("out")} onMouseLeave={()=>setHov(null)}
          style={{cursor:"pointer"}}>
          {/* glow rings */}
          <circle cx={outcome.x} cy={outcome.y} r={outcome.r+30}
            fill="url(#outGlow)"/>
          <circle cx={outcome.x} cy={outcome.y} r={outcome.r+16}
            fill={outcome.c} opacity="0.08"/>
          <circle cx={outcome.x} cy={outcome.y} r={outcome.r}
            fill={hov==="out"?"#fff1f2":"#fafaf7"}
            stroke={outcome.c} strokeWidth="2.5"
            style={{transition:"all 0.2s"}}/>
          {outcome.label.split("\n").map((l,i,arr)=>(
            <text key={i} x={outcome.x} y={outcome.y+(i-arr.length/2+0.65)*14}
              textAnchor="middle" fill={outcome.c}
              fontSize="11" fontWeight="700"
              fontFamily="'IBM Plex Sans',sans-serif">{l}</text>
          ))}
          <text x={outcome.x} y={outcome.y+28} textAnchor="middle"
            fill={outcome.c} fontSize="9" fontWeight="700"
            fontFamily="'IBM Plex Mono',monospace">{outcome.sub}</text>
        </g>

        {/* ── CORE LABEL: Ecopolitical Power ── */}
        {/* Floating label above the main flow */}
        <rect x="330" y="50" width="180" height="48" rx="8"
          fill="#fff1f2" stroke="#be123c" strokeWidth="1.5"/>
        <circle cx="345" cy="74" r="6" fill="#be123c" opacity="0.3"/>
        <circle cx="345" cy="74" r="3" fill="#be123c"/>
        <text x="418" y="68" textAnchor="middle" fill="#be123c"
          fontSize="9" fontWeight="700" letterSpacing="1.5"
          fontFamily="'IBM Plex Mono',monospace">ECOPOLITICAL POWER</text>
        <text x="418" y="84" textAnchor="middle" fill="#be123c"
          fontSize="12" fontWeight="900"
          fontFamily="'IBM Plex Mono',monospace">β = 0.72 **</text>
        {/* arrow dari label ke outcome */}
        <line x1="510" y1="74" x2="544" y2="194"
          stroke="#be123c" strokeWidth="1.5"
          strokeDasharray="4 3" opacity="0.35"/>

        {/* ── indirect effect box ── */}
        <rect x="294" y="390" width="192" height="40" rx="8"
          fill="#f5f3ff" stroke="#6d28d9" strokeWidth="1"/>
        <text x="390" y="407" textAnchor="middle"
          fill="#6d28d9" fontSize="7.5" fontWeight="600"
          fontFamily="'IBM Plex Mono',monospace" letterSpacing="1">INDIRECT EFFECT</text>
        <text x="390" y="421" textAnchor="middle"
          fill="#6d28d9" fontSize="9" fontWeight="700"
          fontFamily="'IBM Plex Mono',monospace">X1→X3→Y = 0.30**</text>

        {/* model fit */}
        <rect x="516" y="340" width="120" height="56" rx="8"
          fill="#fff1f2" stroke="#be123c" strokeWidth="1"/>
        <text x="576" y="360" textAnchor="middle"
          fill="#be123c" fontSize="7.5" fontWeight="600"
          fontFamily="'IBM Plex Mono',monospace">MODEL FIT</text>
        <text x="576" y="376" textAnchor="middle"
          fill="#be123c" fontSize="11" fontWeight="900"
          fontFamily="'IBM Plex Mono',monospace">R² = 0.74</text>
        <text x="576" y="389" textAnchor="middle"
          fill="#a8a29e" fontSize="7.5"
          fontFamily="'IBM Plex Mono',monospace">CFI=0.944 · RMSEA=0.067</text>

        {/* caption */}
        <text x={W/2} y={H-6} textAnchor="middle"
          fill="#c4b5a5" fontSize="8"
          fontFamily="'IBM Plex Mono',monospace">
          Hover node untuk menyorot jalur pengaruh · Kim (2020) PLS-SEM
        </text>
      </svg>
    </div>
  );
}
  return (
    <svg viewBox="0 0 680 210" style={{width:"100%",height:"auto",display:"block"}}>
      <rect width="680" height="210" fill="transparent"/>
      {/* fulcrum + base */}
      <polygon points="340,162 318,188 362,188" fill="#1c1917"/>
      <rect x="298" y="186" width="84" height="7" rx="2" fill="#1c1917"/>
      {/* beam tilted left down, right up */}
      <line x1="148" y1="98" x2="340" y2="160" stroke="#1c1917" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="340" y1="160" x2="532" y2="78" stroke="#1c1917" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="340" cy="160" r="6" fill="#1c1917"/>
      {/* left pan: money pile */}
      <ellipse cx="148" cy="100" rx="54" ry="10" fill="#44403c"/>
      {coins.map(i=>(
        <ellipse key={i} cx="148" cy={94-i*10} rx={46-i*2} ry="8"
          fill={i%2===0?"#d97706":"#b45309"} stroke="#78350f" strokeWidth="0.5" opacity={0.9}/>
      ))}
      <text x="148" y="8" textAnchor="middle" fill="#78350f"
        fontSize="13" fontWeight="700" fontFamily="'IBM Plex Mono',monospace">$11.072</text>
      <text x="148" y="23" textAnchor="middle" fill="#a8a29e"
        fontSize="8" fontFamily="'IBM Plex Mono',monospace">Amerika Serikat</text>
      {/* left outcome: 1 star */}
      <text x="148" y="190" textAnchor="middle" fill="#991b1b"
        fontSize="12" fontFamily="Georgia">★☆☆☆☆</text>

      {/* right pan: 2 small coins + 5 stars floating high */}
      <ellipse cx="532" cy="80" rx="54" ry="10" fill="#44403c"/>
      <ellipse cx="532" cy="74" rx="36" ry="8" fill="#d97706" stroke="#78350f" strokeWidth="0.5"/>
      <ellipse cx="532" cy="66" rx="32" ry="7" fill="#b45309" stroke="#78350f" strokeWidth="0.5"/>
      <text x="532" y="8" textAnchor="middle" fill="#166534"
        fontSize="13" fontWeight="700" fontFamily="'IBM Plex Mono',monospace">$171</text>
      <text x="532" y="23" textAnchor="middle" fill="#a8a29e"
        fontSize="8" fontFamily="'IBM Plex Mono',monospace">Vietnam</text>
      {/* stars floating */}
      {[0,1,2,3,4].map(i=>(
        <text key={i} x={512+i*10} y="44" fill={accent} fontSize="14" fontFamily="Georgia">★</text>
      ))}
      {/* right outcome annotation */}
      <text x="532" y="190" textAnchor="middle" fill="#166534"
        fontSize="12" fontFamily="Georgia">★★★★★</text>

      {/* axis label */}
      <text x="340" y="205" textAnchor="middle" fill="#c4b5a5"
        fontSize="8" fontFamily="'IBM Plex Mono',monospace">
        Lebih banyak uang tidak menjamin lebih banyak bintang
      </text>
    </svg>
  );
}

function IllusInfra({accent}) {
  // Gedung RS megah Soviet, tapi FONDASI RETAK = kepercayaan publik hancur
  return (
    <svg viewBox="0 0 680 220" style={{width:"100%",height:"auto",display:"block"}}>
      <rect width="680" height="220" fill="transparent"/>

      {/* ── FOUNDATION LAYER (trust) — retak ── */}
      <rect x="160" y="170" width="360" height="30" rx="3"
        fill="#e7e5e4" stroke="#d6d3d1" strokeWidth="1"/>
      {/* retak-retak di fondasi */}
      <path d="M195,170 L210,185 L200,200" fill="none" stroke="#9a3412" strokeWidth="1.5" opacity="0.7"/>
      <path d="M280,170 L295,182 L285,200" fill="none" stroke="#9a3412" strokeWidth="1.5" opacity="0.7"/>
      <path d="M390,172 L405,183 L420,200" fill="none" stroke="#9a3412" strokeWidth="1.5" opacity="0.7"/>
      <path d="M460,170 L448,183 L455,200" fill="none" stroke="#9a3412" strokeWidth="1.2" opacity="0.6"/>
      {/* label fondasi */}
      <text x="340" y="190" textAnchor="middle" fill="#9a3412"
        fontSize="8" fontWeight="600" fontFamily="'IBM Plex Mono',monospace" letterSpacing="1.5">
        KEPERCAYAAN PUBLIK — RETAK
      </text>

      {/* ── BANGUNAN RS ── */}
      {/* badan gedung */}
      <rect x="190" y="72" width="300" height="99" fill="#f5f5f3" stroke="#c4b5a5" strokeWidth="1.5"/>
      {/* kolom-kolom */}
      {[205,243,281,319,357,395,433,471].map((x,i)=>(
        <rect key={i} x={x} y="72" width="10" height="99"
          fill="#e2e0dc" stroke="#d6d3d1" strokeWidth="0.5"/>
      ))}
      {/* entablature */}
      <rect x="190" y="62" width="300" height="16" fill="#d6d3d1" stroke="#c4b5a5" strokeWidth="1"/>
      {/* pediment */}
      <polygon points="190,62 340,22 490,62" fill="#e7e5e4" stroke="#c4b5a5" strokeWidth="1.5"/>
      <text x="340" y="48" textAnchor="middle" fill="#78716c"
        fontSize="7.5" fontWeight="600" fontFamily="'IBM Plex Mono',monospace" letterSpacing="1.5">
        ГОСУДАРСТВЕННАЯ БОЛЬНИЦА
      </text>
      {/* jendela — beberapa mati */}
      {[215,265,315,365,415,455].map((x,i)=>(
        <g key={i}>
          <rect x={x} y="88" width="26" height="36" rx="1"
            fill={i===4?"#44403c":i===0?"#e7e5e4":"#dbeafe"}
            stroke="#c4b5a5" strokeWidth="0.8"/>
          <line x1={x+13} y1="88" x2={x+13} y2="124" stroke="#c4b5a5" strokeWidth="0.5"/>
          <line x1={x} y1="106" x2={x+26} y2="106" stroke="#c4b5a5" strokeWidth="0.5"/>
          {i===0 && <line x1={x+4} y1="90" x2={x+18} y2="104"
            stroke="#9a3412" strokeWidth="1.2" opacity="0.6"/>}
        </g>
      ))}
      {/* palang merah */}
      <rect x="334" y="26" width="6" height="18" rx="1" fill="#be123c"/>
      <rect x="328" y="32" width="18" height="6" rx="1" fill="#be123c"/>
      {/* pintu */}
      <rect x="320" y="135" width="40" height="36" rx="2" fill="#44403c" stroke="#1c1917" strokeWidth="1"/>

      {/* ── STATS SAMPING ── */}
      <g>
        <text x="100" y="95" textAnchor="middle" fill="#1c1917"
          fontSize="20" fontWeight="900" fontFamily="'IBM Plex Mono',monospace">8.0</text>
        <text x="100" y="111" textAnchor="middle" fill="#a8a29e"
          fontSize="7.5" fontFamily="'IBM Plex Mono',monospace">bed/1.000</text>
        <text x="100" y="125" textAnchor="middle" fill="#9a3412"
          fontSize="10" fontFamily="Georgia">★★☆☆☆</text>
        <text x="100" y="139" textAnchor="middle" fill="#9a3412"
          fontSize="7.5" fontFamily="'IBM Plex Mono',monospace">Rusia</text>
      </g>
      <g>
        <text x="580" y="95" textAnchor="middle" fill="#1c1917"
          fontSize="20" fontWeight="900" fontFamily="'IBM Plex Mono',monospace">2.6</text>
        <text x="580" y="111" textAnchor="middle" fill="#a8a29e"
          fontSize="7.5" fontFamily="'IBM Plex Mono',monospace">bed/1.000</text>
        <text x="580" y="125" textAnchor="middle" fill="#166534"
          fontSize="10" fontFamily="Georgia">★★★★★</text>
        <text x="580" y="139" textAnchor="middle" fill="#166534"
          fontSize="7.5" fontFamily="'IBM Plex Mono',monospace">Vietnam</text>
      </g>

      <text x="340" y="214" textAnchor="middle" fill="#c4b5a5"
        fontSize="8" fontFamily="'IBM Plex Mono',monospace">
        Kapasitas yang tercatat tidak sama dengan kepercayaan yang berfungsi
      </text>
    </svg>
  );
}

function IllusDemography({accent}) {
  // Grid manusia — kepadatan tinggi tapi kolektif terhubung = perisai
  const figs = [];
  for(let r=0;r<6;r++) for(let c=0;c<14;c++) {
    const x=170+c*26+(r%2)*13, y=32+r*24;
    const shield=(c>=2&&c<=11)&&(r>=1&&r<=4);
    figs.push({x,y,shield});
  }
  return (
    <svg viewBox="0 0 680 200" style={{width:"100%",height:"auto",display:"block"}}>
      <rect width="680" height="200" fill="transparent"/>
      {/* perisai komunal */}
      <path d="M340,14 L510,50 L510,118 Q510,158 340,178 Q170,158 170,118 L170,50 Z"
        fill={accent} opacity="0.07"/>
      <path d="M340,14 L510,50 L510,118 Q510,158 340,178 Q170,158 170,118 L170,50 Z"
        fill="none" stroke={accent} strokeWidth="1.5" strokeDasharray="5 4" opacity="0.25"/>

      {/* garis koneksi komunal */}
      {figs.filter(f=>f.shield).slice(0,6).map((f,i)=>(
        figs.filter(f=>f.shield).slice(i+1,i+3).map((f2,j)=>(
          <line key={`${i}-${j}`} x1={f.x} y1={f.y} x2={f2.x} y2={f2.y}
            stroke={accent} strokeWidth="0.4" opacity="0.2"/>
        ))
      ))}

      {figs.map((f,i)=>(
        <g key={i}>
          <circle cx={f.x} cy={f.y-1} r={f.shield?4:3.5}
            fill={f.shield?accent:"#d6d3d1"} opacity={f.shield?0.8:0.4}/>
          <rect x={f.x-3} y={f.y+4} width={6} height={9} rx={1}
            fill={f.shield?accent:"#d6d3d1"} opacity={f.shield?0.8:0.4}/>
        </g>
      ))}

      {/* stats */}
      <text x="75" y="78" textAnchor="middle" fill="#1c1917"
        fontSize="18" fontWeight="900" fontFamily="'IBM Plex Mono',monospace">1.300</text>
      <text x="75" y="94" textAnchor="middle" fill="#a8a29e"
        fontSize="7.5" fontFamily="'IBM Plex Mono',monospace">jiwa/km²</text>
      <text x="75" y="110" textAnchor="middle" fill="#a16207"
        fontSize="7.5" fontFamily="'IBM Plex Mono',monospace">Bangladesh</text>
      <text x="75" y="124" textAnchor="middle" fill="#92400e"
        fontSize="10" fontFamily="Georgia">★★★☆☆</text>

      <text x="605" y="78" textAnchor="middle" fill="#78716c"
        fontSize="11" fontFamily="'IBM Plex Mono',monospace">β=−0.32</text>
      <text x="605" y="94" textAnchor="middle" fill="#a8a29e"
        fontSize="7.5" fontFamily="'IBM Plex Mono',monospace">demografi</text>
      <text x="605" y="108" textAnchor="middle" fill="#c4b5a5"
        fontSize="7.5" fontFamily="'IBM Plex Mono',monospace">p {">"} 0.05</text>
      <text x="605" y="122" textAnchor="middle" fill="#c4b5a5"
        fontSize="7.5" fontFamily="'IBM Plex Mono',monospace">tidak signifikan</text>

      <text x="340" y="196" textAnchor="middle" fill="#c4b5a5"
        fontSize="8" fontFamily="'IBM Plex Mono',monospace">
        Kepadatan bukan hukuman — koneksi komunal adalah pelindung
      </text>
    </svg>
  );
}

function IllusDemocracy({accent}) {
  return (
    <svg viewBox="0 0 680 210" style={{width:"100%",height:"auto",display:"block"}}>
      <rect width="680" height="210" fill="transparent"/>
      <defs>
        <marker id="arL" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
          <polygon points="0 0,7 2.5,0 5" fill="#44403c"/>
        </marker>
        <marker id="arR" markerWidth="7" markerHeight="5" refX="0" refY="2.5" orient="auto">
          <polygon points="7 0,0 2.5,7 5" fill="#44403c"/>
        </marker>
      </defs>

      {/* BOX NON-DEMOKRASI */}
      <rect x="80" y="48" width="170" height="120" rx="6"
        fill="#fafaf7" stroke="#1c1917" strokeWidth="2"/>
      <rect x="80" y="48" width="170" height="26" rx="6" fill="#1c1917"/>
      <rect x="80" y="64" width="170" height="10" fill="#1c1917"/>
      <text x="165" y="65" textAnchor="middle" fill="white"
        fontSize="8" fontWeight="700" fontFamily="'IBM Plex Mono',monospace" letterSpacing="1">
        NON-DEMOKRASI
      </text>
      {/* outcomes inside */}
      <text x="165" y="102" textAnchor="middle" fill="#166534"
        fontSize="11" fontFamily="Georgia">★★★★★</text>
      <text x="165" y="116" textAnchor="middle" fill="#a8a29e"
        fontSize="8" fontFamily="'IBM Plex Mono',monospace">Vietnam</text>
      <text x="165" y="136" textAnchor="middle" fill="#92400e"
        fontSize="11" fontFamily="Georgia">★★★☆☆</text>
      <text x="165" y="150" textAnchor="middle" fill="#a8a29e"
        fontSize="8" fontFamily="'IBM Plex Mono',monospace">Kuba · Singapura</text>

      {/* BOX DEMOKRASI */}
      <rect x="430" y="48" width="170" height="120" rx="6"
        fill="#fafaf7" stroke="#1c1917" strokeWidth="2"/>
      <rect x="430" y="48" width="170" height="26" rx="6" fill="#1c1917"/>
      <rect x="430" y="64" width="170" height="10" fill="#1c1917"/>
      <text x="515" y="65" textAnchor="middle" fill="white"
        fontSize="8" fontWeight="700" fontFamily="'IBM Plex Mono',monospace" letterSpacing="1">
        DEMOKRASI
      </text>
      <text x="515" y="98" textAnchor="middle" fill="#166534"
        fontSize="11" fontFamily="Georgia">★★★★★</text>
      <text x="515" y="112" textAnchor="middle" fill="#a8a29e"
        fontSize="8" fontFamily="'IBM Plex Mono',monospace">Korea · Taiwan</text>
      <text x="515" y="132" textAnchor="middle" fill="#991b1b"
        fontSize="11" fontFamily="Georgia">★☆☆☆☆</text>
      <text x="515" y="146" textAnchor="middle" fill="#a8a29e"
        fontSize="8" fontFamily="'IBM Plex Mono',monospace">AS · Peru</text>
      <text x="515" y="160" textAnchor="middle" fill="#92400e"
        fontSize="9" fontFamily="Georgia">★★★☆☆</text>

      {/* center: YANG MEMBEDAKAN */}
      <rect x="275" y="74" width="130" height="66" rx="8"
        fill={accent+"15"} stroke={accent} strokeWidth="1.5"/>
      <text x="340" y="96" textAnchor="middle" fill={accent}
        fontSize="7.5" fontWeight="700" fontFamily="'IBM Plex Mono',monospace" letterSpacing="1">
        YANG MEMBEDAKAN
      </text>
      <text x="340" y="112" textAnchor="middle" fill="#44403c"
        fontSize="9.5" fontFamily="'IBM Plex Sans',sans-serif" fontWeight="600">State Capacity</text>
      <text x="340" y="127" textAnchor="middle" fill="#44403c"
        fontSize="9.5" fontFamily="'IBM Plex Sans',sans-serif" fontWeight="600">Social Trust</text>

      {/* arrows */}
      <path d="M250,107 C270,107 272,107 272,107" fill="none"
        stroke="#44403c" strokeWidth="1.2" markerEnd="url(#arL)"/>
      <path d="M408,107 C406,107 406,107 406,107" fill="none"
        stroke="#44403c" strokeWidth="1.2" markerEnd="url(#arR)"/>

      <text x="340" y="204" textAnchor="middle" fill="#c4b5a5"
        fontSize="8" fontFamily="'IBM Plex Mono',monospace">
        Label sistem tidak menentukan kapasitas bertindak kolektif
      </text>
    </svg>
  );
}

function IllusWealth({accent}) {
  // Tangga naik (GDP) tapi bintang outcome mengambang tidak mengikuti
  const steps=[
    {x:90, label:"$1–4k", countries:["Vietnam","Bangladesh"], stars:["★★★★★","★★★☆☆"], oc:["#166534","#92400e"]},
    {x:196,label:"$8–12k",countries:["Kuba","Brazil"],         stars:["★★★★☆","★★☆☆☆"], oc:["#166534","#9a3412"]},
    {x:302,label:"$18–20k",countries:["Latvia"],               stars:["★★☆☆☆"],          oc:["#9a3412"]},
    {x:408,label:"$33–44k",countries:["Italia","UK"],          stars:["★★★☆☆","★★★☆☆"],  oc:["#92400e","#92400e"]},
    {x:514,label:"$46–65k",countries:["Jerman","AS"],          stars:["★★★☆☆","★☆☆☆☆"],  oc:["#92400e","#991b1b"]},
  ];
  const heights=[30,50,70,90,110];
  return (
    <svg viewBox="0 0 680 210" style={{width:"100%",height:"auto",display:"block"}}>
      <rect width="680" height="210" fill="transparent"/>
      {steps.map((s,i)=>(
        <g key={i}>
          <rect x={s.x} y={178-heights[i]} width={82} height={heights[i]+2}
            fill={i===0?"#f0fdf4":i===1?"#fefce8":i===2?"#fff7ed":"#fef2f2"}
            stroke="#e7e5e4" strokeWidth="1"/>
          <text x={s.x+41} y={188} textAnchor="middle"
            fill="#a8a29e" fontSize="7.5" fontFamily="'IBM Plex Mono',monospace">{s.label}</text>
          {s.countries.map((c,j)=>(
            <g key={j}>
              <text x={s.x+41} y={176-heights[i]-j*18} textAnchor="middle"
                fill={s.oc[j]} fontSize="7.5" fontFamily="'IBM Plex Mono',monospace">{c}</text>
              <text x={s.x+41} y={164-heights[i]-j*18} textAnchor="middle"
                fill={s.oc[j]} fontSize="9" fontFamily="Georgia">{s.stars[j]}</text>
            </g>
          ))}
        </g>
      ))}
      {/* trend garis outcome — tidak mengikuti tangga */}
      <polyline points="131,120 237,124 343,98 449,92 555,84"
        fill="none" stroke={accent} strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round"/>
      {/* garis GDP naik */}
      <polyline points="90,178 172,148 278,128 384,108 490,88 640,68"
        fill="none" stroke="#d97706" strokeWidth="1.5"
        strokeDasharray="5 3" opacity="0.4"/>
      {/* legend */}
      <rect x="420" y="14" width="14" height="3" rx="1" fill="#d97706" opacity="0.5"/>
      <text x="438" y="18" fill="#a8a29e" fontSize="8" fontFamily="'IBM Plex Mono',monospace">GDP naik</text>
      <rect x="500" y="14" width="14" height="3" rx="1" fill={accent}/>
      <text x="518" y="18" fill="#a8a29e" fontSize="8" fontFamily="'IBM Plex Mono',monospace">Outcome zig-zag</text>

      <text x="340" y="204" textAnchor="middle" fill="#c4b5a5"
        fontSize="8" fontFamily="'IBM Plex Mono',monospace">
        Kekayaan tidak mendistribusikan dirinya sendiri
      </text>
    </svg>
  );
}

/* ═══ SCATTER CHART ══════════════════════════════════════════════════ */
function AChart({q}) {
  const W=640,H=270,P={t:20,r:60,b:52,l:52};
  const cw=W-P.l-P.r, ch=H-P.t-P.b;
  const seed=useRef(Math.random()*99);
  const [tooltip,setTooltip]=useState(null);

  const vals=useMemo(()=>C.map(c=>c[q.xKey]),[q.xKey]);
  const minV=Math.min(...vals), maxV=Math.max(...vals);

  const toX=(v,i=0)=>{
    if(q.isJitter) return P.l+(v===0?0.28:0.72)*cw+Math.sin((i+seed.current)*3.7)*cw*0.06;
    if(q.xLog) return P.l+(Math.log(v+1)-Math.log(minV+1))/(Math.log(maxV+1)-Math.log(minV+1))*cw;
    return P.l+(v-minV)/(maxV-minV)*cw;
  };
  const toY=v=>P.t+ch-((v-1)/4)*ch;
  const pts=useMemo(()=>C.map((c,i)=>({
    ...c, px:toX(c[q.xKey],i), py:toY(c.o),
    ann:q.ann?.find(a=>a.n===c.n),
    isIDN:c.id==="IDN",
  })),[q]);

  const xTicks=q.isJitter
    ?[{v:0,l:"Non-Demokrasi"},{v:1,l:"Demokrasi"}]
    :q.xLog
      ?[50,300,1500,8000,40000].filter(v=>v>minV*0.4&&v<maxV*1.6)
         .map(v=>({v,l:v>=1000?`$${(v/1000).toFixed(0)}k`:`$${v}`}))
      :Array.from({length:4},(_,i)=>({v:minV+(maxV-minV)*i/3,
         l:parseFloat((minV+(maxV-minV)*i/3).toFixed(1))}));

  return (
    <div style={{position:"relative"}}>
      <svg viewBox={`0 0 ${W} ${H}`}
        style={{width:"100%",height:"auto",display:"block",overflow:"visible"}}>
        {[1,2,3,4,5].map(v=>(
          <line key={v} x1={P.l} x2={W-P.r} y1={toY(v)} y2={toY(v)}
            stroke={v===3?"#d1d5db":"#f3f4f6"}
            strokeWidth={v===3?1:0.5} strokeDasharray={v===3?"4 3":""}/>
        ))}
        {[1,3,5].map(v=>(
          <text key={v} x={P.l-8} y={toY(v)+4} textAnchor="end"
            fill="#c4b5a5" fontSize="10" fontFamily="'IBM Plex Mono',monospace">{v}</text>
        ))}
        {xTicks.map(({v,l})=>(
          <g key={v}>
            <line x1={toX(v)} x2={toX(v)} y1={H-P.b} y2={H-P.b+5} stroke="#e5e7eb"/>
            <text x={toX(v)} y={H-P.b+18} textAnchor="middle"
              fill="#c4b5a5" fontSize="9.5" fontFamily="'IBM Plex Mono',monospace">{l}</text>
          </g>
        ))}
        <line x1={P.l} x2={P.l} y1={P.t} y2={H-P.b} stroke="#e5e7eb"/>
        <line x1={P.l} x2={W-P.r} y1={H-P.b} y2={H-P.b} stroke="#e5e7eb"/>

        {/* background dots */}
        {pts.filter(p=>!p.ann&&!p.isIDN).map((p,i)=>(
          <circle key={i} cx={p.px} cy={p.py} r={5.5}
            fill={OF[p.o]} stroke={OC[p.o]} strokeWidth={0.8} opacity={0.5}/>
        ))}

        {/* Indonesia dot — special */}
        {pts.filter(p=>p.isIDN).map((p,i)=>(
          <g key={"idn"+i}
            onMouseEnter={()=>setTooltip({x:p.px,y:p.py})}
            onMouseLeave={()=>setTooltip(null)}
            style={{cursor:"pointer"}}>
            <circle cx={p.px} cy={p.py} r={14} fill="#be123c" opacity="0.08"/>
            <circle cx={p.px} cy={p.py} r={7} fill={OF[p.o]}
              stroke="#be123c" strokeWidth="2" strokeDasharray="3 2"/>
            <text x={p.px} y={p.py-12} textAnchor="middle"
              fill="#be123c" fontSize="9" fontWeight="700"
              fontFamily="'IBM Plex Mono',monospace">Indonesia ▲</text>
          </g>
        ))}

        {/* annotated dots */}
        {pts.filter(p=>p.ann&&!p.isIDN).map((p,i)=>{
          const {label,side,dy}=p.ann;
          const lx=side==="right"?p.px+10:p.px-10;
          const ly=p.py+dy;
          return (
            <g key={"a"+i}>
              <circle cx={p.px} cy={p.py} r={10} fill={q.accent} opacity="0.1"/>
              <circle cx={p.px} cy={p.py} r={6} fill={OF[p.o]}
                stroke={q.accent} strokeWidth={2}/>
              <line x1={p.px} y1={p.py} x2={lx} y2={ly}
                stroke={q.accent} strokeWidth={0.8} opacity="0.4" strokeDasharray="3 2"/>
              <text x={side==="right"?lx+4:lx-4} y={ly+3.5}
                textAnchor={side==="right"?"start":"end"}
                fill={q.accent} fontSize="9" fontWeight="600"
                fontFamily="'IBM Plex Mono',monospace">{label}</text>
            </g>
          );
        })}

        <text x={P.l+cw/2} y={H-5} textAnchor="middle"
          fill="#c4b5a5" fontSize="8.5" fontFamily="'IBM Plex Mono',monospace">
          {q.xLabel}
        </text>
        <text x={13} y={P.t+ch/2} textAnchor="middle"
          fill="#c4b5a5" fontSize="8.5" fontFamily="'IBM Plex Mono',monospace"
          transform={`rotate(-90,13,${P.t+ch/2})`}>Outcome (1–5)</text>
      </svg>

      {/* Indonesia Tooltip */}
      {tooltip && (
        <div style={{
          position:"absolute",
          left: `${(tooltip.x/W)*100}%`,
          top: `${(tooltip.y/270)*100}%`,
          transform:"translate(-50%,-110%)",
          background:"#1c1917",
          borderRadius:8,
          padding:"14px 16px",
          width:260,
          pointerEvents:"none",
          zIndex:50,
          boxShadow:"0 8px 28px rgba(0,0,0,0.18)",
          border:"1px solid #be123c40",
        }}>
          <div style={{fontSize:8,letterSpacing:2.5,color:"#be123c",
            fontFamily:"'IBM Plex Mono',monospace",textTransform:"uppercase",
            marginBottom:6}}>Konteks Lokal · Indonesia</div>
          <div style={{display:"flex",gap:12,marginBottom:8}}>
            <div>
              <div style={{fontSize:14,fontWeight:700,color:"#fbbf24",
                fontFamily:"'IBM Plex Mono',monospace",lineHeight:1}}>$112</div>
              <div style={{fontSize:7.5,color:"#6b7280",fontFamily:"'IBM Plex Mono',monospace"}}>spending/kapita</div>
            </div>
            <div>
              <div style={{fontSize:14,fontWeight:700,color:"#92400e",
                fontFamily:"Georgia",lineHeight:1}}>★★★☆☆</div>
              <div style={{fontSize:7.5,color:"#6b7280",fontFamily:"'IBM Plex Mono',monospace"}}>outcome</div>
            </div>
          </div>
          <p style={{fontSize:10.5,color:"#d6d3d1",lineHeight:1.7,
            fontFamily:"'IBM Plex Sans',sans-serif",fontWeight:300,margin:0}}>
            Jaringan Puskesmas hingga desa + tradisi gotong royong + pengalaman bencana berulang membangun kapasitas adaptif yang tidak muncul di neraca anggaran. Ketimpangan Papua-Jawa yang membatasi potensi lebih tinggi.
          </p>
          {/* tooltip arrow */}
          <div style={{position:"absolute",bottom:-6,left:"50%",transform:"translateX(-50%)",
            width:12,height:6,background:"#1c1917",clipPath:"polygon(0 0,100% 0,50% 100%)"}}/>
        </div>
      )}
    </div>
  );
}

/* ═══ REVEAL ═════════════════════════════════════════════════════════ */
function R({children,d=0,y=24}){
  const ref=useRef(),[v,sv]=useState(false);
  useEffect(()=>{
    const o=new IntersectionObserver(([e])=>{
      if(e.isIntersecting){sv(true);o.disconnect();}
    },{threshold:0.06,rootMargin:"0px 0px -40px 0px"});
    if(ref.current)o.observe(ref.current);
    return()=>o.disconnect();
  },[]);
  return(
    <div ref={ref} style={{
      opacity:v?1:0,
      transform:v?"none":`translateY(${y}px)`,
      transition:`opacity 0.75s ${d}s cubic-bezier(0.22,1,0.36,1), transform 0.75s ${d}s cubic-bezier(0.22,1,0.36,1)`,
    }}>{children}</div>
  );
}

/* ═══ APP ════════════════════════════════════════════════════════════ */
export default function App(){
  const [active,setActive]=useState(null);
  const refs=useRef({});

  useEffect(()=>{
    const o=new IntersectionObserver(es=>{
      es.forEach(e=>{if(e.isIntersecting)setActive(e.target.dataset.id);});
    },{rootMargin:"-35% 0px -35% 0px"});
    Object.values(refs.current).forEach(r=>r&&o.observe(r));
    return()=>o.disconnect();
  },[]);

  return(
    <div style={{background:"#FAFAF7",color:"#1c1917",
      fontFamily:"'IBM Plex Sans',system-ui,sans-serif",minHeight:"100vh"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,600;1,700&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::selection{background:#fde68a;}
        ::-webkit-scrollbar{width:2px;}::-webkit-scrollbar-thumb{background:#e7e5e4;}
        body{-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.25}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
        a{text-decoration:none;}
        button{cursor:pointer;border:none;background:none;}
      `}</style>

      {/* ── PROGRESS NAV ─────────────────────── */}
      <div style={{position:"fixed",right:20,top:"50%",transform:"translateY(-50%)",
        zIndex:100,display:"flex",flexDirection:"column",gap:10,alignItems:"flex-end"}}>
        {QS.map(q=>(
          <div key={q.id} style={{display:"flex",alignItems:"center",gap:6}}>
            {active===q.id && (
              <span style={{fontSize:8,color:q.accent,fontFamily:"'IBM Plex Mono',monospace",
                letterSpacing:1,opacity:0.7,transition:"opacity 0.3s"}}>
                {q.num}
              </span>
            )}
            <div onClick={()=>refs.current[q.id]?.scrollIntoView({behavior:"smooth"})}
              style={{
                height:5,borderRadius:3,cursor:"pointer",
                width:active===q.id?24:5,
                background:active===q.id?q.accent:"#e7e5e4",
                transition:"all 0.4s cubic-bezier(.4,0,.2,1)",
              }}/>
          </div>
        ))}
      </div>

      {/* ── HERO ──────────────────────────────── */}
      <div style={{maxWidth:720,margin:"0 auto",padding:"100px 32px 84px",
        borderBottom:"1px solid #e7e5e4",animation:"fadeIn 0.9s ease both"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:28}}>
          <span style={{display:"inline-block",width:7,height:7,borderRadius:"50%",
            background:"#be123c",animation:"pulse 2s infinite",flexShrink:0}}/>
          <span style={{fontSize:10,letterSpacing:2.5,color:"#a8a29e",
            fontFamily:"'IBM Plex Mono',monospace",textTransform:"uppercase"}}>
            N=21 Negara · Kim (2020) · BMJ Global Health · PLS-SEM
          </span>
        </div>

        <div style={{marginBottom:32}}>
          <h1 style={{fontFamily:"'Playfair Display',Georgia,serif",
            fontSize:"clamp(38px,5.5vw,66px)",fontWeight:900,
            lineHeight:1.0,letterSpacing:"-0.03em",color:"#0c0a09",marginBottom:6}}>
            Lima Mitos yang Dibayar<br/>dengan Jutaan Nyawa.
          </h1>
          <h2 style={{fontFamily:"'Playfair Display',Georgia,serif",
            fontSize:"clamp(20px,2.8vw,34px)",fontWeight:400,fontStyle:"italic",
            lineHeight:1.25,letterSpacing:"-0.02em",color:"#78716c",marginBottom:0}}>
            Apa yang benar-benar menentukan respons pandemi?
          </h2>
        </div>

        <p style={{fontSize:17,lineHeight:1.9,color:"#44403c",
          maxWidth:560,marginBottom:28,fontWeight:300,fontStyle:"italic",
          borderLeft:"3px solid #be123c",paddingLeft:20}}>
          Data dari 21 negara menunjukkan temuan yang tidak nyaman: faktor ekopolitik —
          distribusi kekuatan ekonomi dan kapasitas negara — lebih menentukan outcome pandemi
          daripada pengeluaran, infrastruktur fisik, atau profil demografis secara gabungan.
        </p>

        <p style={{fontSize:13.5,lineHeight:1.85,color:"#78716c",maxWidth:520,marginBottom:36}}>
          Lima pertanyaan berikut menantang asumsi-asumsi inti dalam kurikulum kesehatan
          masyarakat. Setiap section menyertakan konteks Indonesia (▲) yang dapat di-hover
          pada scatter plot, dan blok analisis lokal di bawahnya.
        </p>

        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
          {QS.map((q,i)=>(
            <button key={q.id}
              onClick={()=>refs.current[q.id]?.scrollIntoView({behavior:"smooth"})}
              style={{
                padding:"7px 16px",borderRadius:20,
                border:`1.5px solid #e7e5e4`,
                fontSize:11,fontFamily:"'IBM Plex Mono',monospace",
                color:"#78716c",letterSpacing:0.3,
                transition:"all 0.2s",
              }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=q.accent;e.currentTarget.style.color=q.accent;e.currentTarget.style.background=q.accentLight;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="#e7e5e4";e.currentTarget.style.color="#78716c";e.currentTarget.style.background="transparent";}}>
              {q.num} — {q.verdictFull}
            </button>
          ))}
        </div>
      </div>

      {/* ── PLS-SEM EVIDENCE BAR ──────────────── */}
      <div style={{background:"#f5f5f0",borderBottom:"1px solid #e7e5e4",padding:"20px 32px"}}>
        <div style={{maxWidth:720,margin:"0 auto",display:"flex",
          alignItems:"center",gap:36,flexWrap:"wrap"}}>
          <span style={{fontSize:9,letterSpacing:3,color:"#a8a29e",
            fontFamily:"'IBM Plex Mono',monospace",textTransform:"uppercase",flexShrink:0}}>
            Bukti PLS-SEM
          </span>
          {[
            {l:"Ekopolitik",   b:"β=0.72",t:"t=4.21",c:"#b45309",sig:true},
            {l:"Teknis",       b:"β=0.58",t:"t=3.14",c:"#0369a1",sig:true},
            {l:"Institusional",b:"β=0.49",t:"t=2.67",c:"#6d28d9",sig:true},
            {l:"Demografi",    b:"β=−0.32",t:"t=1.78",c:"#9ca3af",sig:false},
            {l:"R² Model",     b:"0.74",  t:"Sangat Kuat",c:"#166534",sig:true},
          ].map((x,i)=>(
            <div key={i} style={{display:"flex",flexDirection:"column",gap:2}}>
              <span style={{fontSize:8,color:"#a8a29e",
                fontFamily:"'IBM Plex Mono',monospace"}}>{x.l}</span>
              <span style={{fontSize:15,fontWeight:700,color:x.c,
                fontFamily:"'IBM Plex Mono',monospace",lineHeight:1}}>{x.b}</span>
              <span style={{fontSize:7.5,color:x.sig?"#166534":"#9ca3af",
                fontFamily:"'IBM Plex Mono',monospace"}}>{x.t}{x.sig?" **":" (ns)"}</span>
            </div>
          ))}
          <a href="https://covid-platform.vercel.app/sem" target="_blank" rel="noreferrer"
            style={{marginLeft:"auto",fontSize:9,letterSpacing:1.5,color:"#a8a29e",
              fontFamily:"'IBM Plex Mono',monospace",textTransform:"uppercase",
              flexShrink:0,transition:"color 0.2s"}}
            onMouseEnter={e=>e.target.style.color="#be123c"}
            onMouseLeave={e=>e.target.style.color="#a8a29e"}>
            Platform ↗
          </a>
        </div>
      </div>

      {/* ── QUESTIONS ─────────────────────────── */}
      {QS.map((q,qi)=>{
        const Illus=ILLUS[q.id];
        return (
          <section key={q.id}
            ref={el=>refs.current[q.id]=el} data-id={q.id}
            style={{borderBottom:"1px solid #e7e5e4",
              background:qi%2===0?"#FAFAF7":"#ffffff",
              padding:"80px 32px 88px",
              position:"relative",overflow:"hidden"}}>

            {/* watermark */}
            <div style={{position:"absolute",right:-8,top:-16,
              fontSize:220,fontWeight:900,lineHeight:1,
              color:q.accent,opacity:0.025,
              fontFamily:"'Playfair Display',serif",
              userSelect:"none",pointerEvents:"none",letterSpacing:"-0.05em"}}>
              {q.num}
            </div>

            <div style={{maxWidth:720,margin:"0 auto",position:"relative"}}>

              {/* section header */}
              <R>
                <div style={{display:"flex",alignItems:"flex-start",gap:14,marginBottom:24}}>
                  <div style={{width:36,height:36,borderRadius:"50%",background:q.accent,
                    flexShrink:0,marginTop:6,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <span style={{fontSize:11,fontWeight:600,color:"white",
                      fontFamily:"'IBM Plex Mono',monospace"}}>{q.num}</span>
                  </div>
                  <div>
                  <div style={{display:"flex",flexDirection:"column",gap:4,marginBottom:10}}>
                    <div style={{display:"inline-flex",alignItems:"center",gap:8,
                      padding:"3px 12px",borderRadius:3,background:q.accentLight,
                      alignSelf:"flex-start"}}>
                      <span style={{fontSize:10,letterSpacing:2,color:q.accent,
                        fontFamily:"'IBM Plex Mono',monospace",fontWeight:700,
                        textTransform:"uppercase"}}>{q.verdict}</span>
                      <span style={{width:1,height:10,background:q.accent+"40",display:"inline-block"}}/>
                      <span style={{fontSize:9,color:q.accent+"99",
                        fontFamily:"'IBM Plex Mono',monospace"}}>{q.verdictSub}</span>
                    </div>
                    <span style={{fontSize:11,color:"#78716c",
                      fontFamily:"'IBM Plex Mono',monospace",letterSpacing:0.5,
                      paddingLeft:12}}>{q.verdictFull}</span>
                  </div>
                    <h2 style={{fontFamily:"'Playfair Display',Georgia,serif",
                      fontSize:"clamp(20px,2.6vw,29px)",fontWeight:600,fontStyle:"italic",
                      lineHeight:1.3,color:"#0c0a09"}}>{q.question}</h2>
                  </div>
                </div>
              </R>

              {/* challenge statement — provocative */}
              <R d={0.08}>
                <div style={{
                  margin:"0 0 28px",padding:"16px 20px",
                  borderLeft:`3px solid ${q.accent}`,
                  background:q.accentLight,borderRadius:"0 6px 6px 0",
                }}>
                  <p style={{fontSize:14,lineHeight:1.8,color:"#1c1917",
                    fontFamily:"'Playfair Display',serif",fontStyle:"italic"}}>
                    {q.challenge}
                  </p>
                </div>
              </R>

              {/* pull stat */}
              <R d={0.12}>
                <div style={{display:"flex",alignItems:"baseline",gap:16,
                  padding:"20px 0",marginBottom:28,
                  borderTop:`1.5px solid ${q.accent}20`,
                  borderBottom:`1.5px solid ${q.accent}20`}}>
                  <span style={{fontFamily:"'Playfair Display',serif",
                    fontSize:"clamp(50px,7.5vw,84px)",fontWeight:900,lineHeight:1,
                    color:q.accent,letterSpacing:"-0.04em",flexShrink:0}}>{q.pullStat}</span>
                  <p style={{fontSize:16,lineHeight:1.65,color:"#44403c",fontWeight:300,
                    paddingBottom:4}}>{q.pullText}</p>
                </div>
              </R>

              {/* illustration */}
              <R d={0.14}>
                <div style={{margin:"0 0 28px",borderRadius:8,overflow:"hidden",
                  border:"1px solid #e7e5e4"}}>
                  <Illus accent={q.accent}/>
                </div>
              </R>

              {/* scatter chart */}
              <R d={0.16}>
                <div style={{marginBottom:28}}>
                  <div style={{fontSize:8.5,letterSpacing:2,color:"#a8a29e",
                    fontFamily:"'IBM Plex Mono',monospace",textTransform:"uppercase",
                    marginBottom:10}}>{q.xLabel} × Outcome Pandemi</div>
                  <AChart q={q}/>
                  <div style={{fontSize:7.5,color:"#d6d3d1",marginTop:4,textAlign:"right",
                    fontFamily:"'IBM Plex Mono',monospace"}}>
                    N=21 · WHO · World Bank · Kim (2020) · ▲ hover Indonesia
                  </div>
                </div>
              </R>

              {/* 3-col analysis */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:20,marginBottom:24}}>
                {[
                  {label:"Asumsi",             text:q.premise,  hi:false},
                  {label:"Yang Ditemukan Data",text:q.dataNote, hi:true},
                  {label:"Satu Penjelasan",    text:q.interpret,hi:false},
                ].map((b,i)=>(
                  <R key={i} d={0.1+i*0.07}>
                    <div style={{
                      borderTop:`2.5px solid ${b.hi?q.accent:"#e7e5e4"}`,
                      paddingTop:14,
                      ...(b.hi?{background:q.accentLight,borderRadius:"0 0 6px 6px",
                        padding:"14px 14px 16px"}:{}),
                    }}>
                      <div style={{fontSize:8,letterSpacing:2.5,marginBottom:8,fontWeight:700,
                        fontFamily:"'IBM Plex Mono',monospace",textTransform:"uppercase",
                        color:b.hi?q.accent:"#c4b5a5"}}>{b.label}</div>
                      <p style={{fontSize:12.5,color:"#44403c",lineHeight:1.9}}>{b.text}</p>
                    </div>
                  </R>
                ))}
              </div>

              {/* Indonesia local context inline */}
              <R d={0.28}>
                <div style={{display:"flex",gap:12,padding:"14px 16px",
                  background:"#fafaf7",border:"1px solid #e7e5e4",
                  borderLeft:"3px solid #be123c",borderRadius:"0 8px 8px 0",
                  marginBottom:14}}>
                  <span style={{fontSize:16,flexShrink:0}}>🇮🇩</span>
                  <div>
                    <div style={{fontSize:8,letterSpacing:2,color:"#be123c",
                      fontFamily:"'IBM Plex Mono',monospace",textTransform:"uppercase",
                      marginBottom:4}}>Konteks Indonesia</div>
                    <p style={{fontSize:12,color:"#57534e",lineHeight:1.8}}>{q.indonesiaNote}</p>
                  </div>
                </div>
              </R>

              {/* Theoretical Anchors */}
              <R d={0.32}>
                <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center",
                  paddingTop:12,borderTop:"1px solid #f3f4f6"}}>
                  <span style={{fontSize:8,letterSpacing:2,color:"#c4b5a5",
                    fontFamily:"'IBM Plex Mono',monospace",textTransform:"uppercase",
                    flexShrink:0}}>Theoretical Anchors</span>
                  {q.anchors.map((a,i)=>(
                    <span key={i} style={{
                      fontSize:9,padding:"3px 10px",borderRadius:12,
                      background:"#f5f5f0",border:"1px solid #e7e5e4",
                      color:"#78716c",fontFamily:"'IBM Plex Mono',monospace",
                      lineHeight:1.4,
                    }}>{a}</span>
                  ))}
                </div>
              </R>
            </div>
          </section>
        );
      })}

      {/* ── CONCLUSION + SEM MAP ──────────────── */}
      <div style={{background:"#FAFAF7",borderTop:"1px solid #e7e5e4",padding:"96px 32px 80px"}}>
        <div style={{maxWidth:720,margin:"0 auto"}}>
          <R>
            <p style={{fontSize:9,letterSpacing:3,color:"#a8a29e",
              fontFamily:"'IBM Plex Mono',monospace",textTransform:"uppercase",
              marginBottom:32}}>Implikasi Sistemik</p>

            <h2 style={{fontFamily:"'Playfair Display',serif",
              fontSize:"clamp(28px,4.5vw,52px)",fontWeight:900,lineHeight:1.1,
              color:"#0c0a09",marginBottom:8,letterSpacing:"-0.03em"}}>
              Kesehatan Masyarakat
            </h2>
            <h2 style={{fontFamily:"'Playfair Display',serif",
              fontSize:"clamp(28px,4.5vw,52px)",fontWeight:400,fontStyle:"italic",
              lineHeight:1.1,color:"#57534e",marginBottom:40,letterSpacing:"-0.02em"}}>
              adalah Soal Politik Distribusi.
            </h2>

            <div style={{borderLeft:"3px solid #be123c",paddingLeft:24,marginBottom:36}}>
              <p style={{fontSize:18,lineHeight:1.85,color:"#1c1917",
                fontFamily:"'Playfair Display',serif",fontStyle:"italic",marginBottom:10}}>
                "Ekopolitik — distribusi kekuatan ekonomi dan kapasitas negara
                untuk mengorkestrasi tindakan kolektif — memiliki path coefficient
                tertinggi dalam model PLS-SEM ini (β=0.72, R²=0.74)."
              </p>
              <span style={{fontSize:9,color:"#a8a29e",
                fontFamily:"'IBM Plex Mono',monospace",letterSpacing:1}}>
                Kim (2020) · BMJ Global Health · N=21 · PLS-SEM
              </span>
            </div>

            <p style={{fontSize:14.5,color:"#57534e",lineHeight:1.95,marginBottom:52,
              fontWeight:300,maxWidth:560}}>
              Ini bukan argumentasi teoritis. Ini cermin. Setiap praktisi kesmas
              yang merancang intervensi tanpa bertanya <em>"siapa yang memegang
              kekuatan distribusi, dan apakah ia berpihak pada yang paling rentan?"</em> —
              sedang bekerja di atas fondasi yang retak. Data ini meminta lebih dari
              kepedulian teknis. Ia meminta keberanian politik.
            </p>
          </R>

          {/* SEM SYSTEM MAP */}
          <R d={0.1}>
            <div style={{marginBottom:52}}>
              <div style={{fontSize:8.5,letterSpacing:2.5,color:"#a8a29e",
                fontFamily:"'IBM Plex Mono',monospace",textTransform:"uppercase",
                marginBottom:16}}>
                Peta Sistem · Structural Equation Model
              </div>
              <div style={{border:"1px solid #e7e5e4",borderRadius:12,
                overflow:"hidden",background:"#fafaf7",padding:"16px"}}>
                <StructuralModel/>
              </div>
            </div>
          </R>

          <R d={0.15}>
            {/* 3 key numbers */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",
              borderTop:"1px solid #e7e5e4",paddingTop:40,marginBottom:48}}>
              {[
                {l:"Vietnam · USD/kapita",  v:"$171",    s:"Outcome ★★★★★",c:"#166534"},
                {l:"AS · USD/kapita",       v:"$11.072", s:"Outcome ★",    c:"#991b1b"},
                {l:"Ekopolitik · β (PLS)",  v:"0.72",    s:"Prediktor terkuat",c:"#b45309"},
              ].map((x,i)=>(
                <div key={i} style={{paddingRight:i<2?28:0,paddingLeft:i>0?28:0,
                  borderRight:i<2?"1px solid #e7e5e4":"none"}}>
                  <div style={{fontSize:8.5,color:"#a8a29e",
                    fontFamily:"'IBM Plex Mono',monospace",marginBottom:10,lineHeight:1.5}}>
                    {x.l}</div>
                  <div style={{fontSize:30,fontWeight:700,color:x.c,
                    letterSpacing:"-0.03em",fontFamily:"'IBM Plex Mono',monospace",
                    lineHeight:1,marginBottom:6}}>{x.v}</div>
                  <div style={{fontSize:9,color:"#a8a29e",
                    fontFamily:"'IBM Plex Mono',monospace"}}>{x.s}</div>
                </div>
              ))}
            </div>

            <a href="https://covid-platform.vercel.app" target="_blank" rel="noreferrer"
              style={{display:"inline-flex",alignItems:"center",gap:8,
                padding:"12px 22px",border:"1.5px solid #e7e5e4",borderRadius:4,
                fontSize:11,fontFamily:"'IBM Plex Mono',monospace",
                color:"#78716c",letterSpacing:0.5,transition:"all 0.2s",
                background:"transparent"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="#be123c";e.currentTarget.style.color="#be123c";e.currentTarget.style.background="#fff1f2";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="#e7e5e4";e.currentTarget.style.color="#78716c";e.currentTarget.style.background="transparent";}}>
              Lihat Analisis SEM Lengkap ↗
            </a>

            <div style={{marginTop:48,paddingTop:32,borderTop:"1px solid #e7e5e4",
              fontSize:9,color:"#c4b5a5",fontFamily:"'IBM Plex Mono',monospace",lineHeight:2.4}}>
              Data: WHO · World Bank · Kim (2020) BMJ Global Health<br/>
              Framework: Putnam · Ostrom · Ha-Joon Chang · Marmot · Krieger<br/>
              N=21 negara · PLS-SEM · CFI=0.944 · TLI=0.921 · RMSEA=0.067 · SRMR=0.072
            </div>
          </R>
        </div>
      </div>
    </div>
  );
}
