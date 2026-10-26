/* Tema, data demo, dan utilitas bersama (landing, builder, undangan). */
(function () {
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const safeUrl = (u) => {
    try {
      const raw = String(u == null ? "" : u).trim();
      if (!raw) return "";
      const x = new URL(raw, location.href);
      return /^https?:$/.test(x.protocol) ? x.href : "";
    } catch (e) { return ""; }
  };

  // Data undangan dibawa di URL hash (base64url) agar demo bisa dibagikan tanpa server.
  const enc = (obj) => {
    const bytes = new TextEncoder().encode(JSON.stringify(obj));
    let s = "";
    bytes.forEach((b) => (s += String.fromCharCode(b)));
    return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  };
  const dec = (str) => {
    str = String(str).replace(/-/g, "+").replace(/_/g, "/");
    while (str.length % 4) str += "=";
    const bin = atob(str);
    return JSON.parse(new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0))));
  };

  const patternURL = (kind, color, opacity) => {
    if (!kind) return "none";
    const c = color, o = opacity == null ? 0.22 : opacity;
    const tiles = {
      kawung: [44, `<g fill="none" stroke="${c}" stroke-opacity="${o}" stroke-width="1"><ellipse cx="22" cy="11" rx="6" ry="10"/><ellipse cx="22" cy="33" rx="6" ry="10"/><ellipse cx="11" cy="22" rx="10" ry="6"/><ellipse cx="33" cy="22" rx="10" ry="6"/></g><circle cx="22" cy="22" r="1.8" fill="${c}" fill-opacity="${o}"/>`],
      lattice: [36, `<g fill="none" stroke="${c}" stroke-opacity="${o}" stroke-width="1"><path d="M18 2 L34 18 L18 34 L2 18 Z"/><path d="M18 9 L27 18 L18 27 L9 18 Z"/></g><circle cx="18" cy="18" r="1.6" fill="${c}" fill-opacity="${o}"/>`],
      bloom: [64, `<g transform="translate(32 32)" fill="none" stroke="${c}" stroke-opacity="${o}" stroke-width="1">${[0, 72, 144, 216, 288].map((r) => `<ellipse cx="0" cy="-10" rx="5" ry="11" transform="rotate(${r})"/>`).join("")}<circle r="2.2" fill="${c}" fill-opacity="${o}"/></g>`],
      khatam: [52, `<g fill="none" stroke="${c}" stroke-opacity="${o}" stroke-width="1"><rect x="13" y="13" width="26" height="26"/><rect x="13" y="13" width="26" height="26" transform="rotate(45 26 26)"/></g>`]
    };
    const t = tiles[kind];
    if (!t) return "none";
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${t[0]}" height="${t[0]}" viewBox="0 0 ${t[0]} ${t[0]}">${t[1]}</svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  };

  const THEMES = [
    {
      id: "kencana", name: "Kencana", cat: "Adat", tag: "Adat Jawa", premium: false,
      desc: "Maroon dan emas dengan pola kawung.",
      v: { bg: "#FBF4E8", bg2: "#5B1A22", ink: "#3A1F1F", muted: "#7A5C55", accent: "#B8860B", card: "#FFF9EE", ondark: "#F7E7C2", line: "#E5D3B0" },
      fonts: { display: "'Cormorant Garamond', serif", body: "'Jost', sans-serif", script: "'Pinyon Script', cursive" },
      pattern: "kawung", frame: "double", fx: null, dark: false
    },
    {
      id: "gading", name: "Pura Gading", cat: "Adat", tag: "Adat Bali", premium: false,
      desc: "Hitam dan emas dengan ukiran berlian khas Bali.",
      v: { bg: "#F7F1E3", bg2: "#1E1B16", ink: "#2A2418", muted: "#6D6450", accent: "#C9A227", card: "#FCF8EC", ondark: "#F1E2A8", line: "#E0D2A3" },
      fonts: { display: "'Cinzel', serif", body: "'Jost', sans-serif", script: "'Pinyon Script', cursive" },
      pattern: "lattice", frame: "double", fx: null, dark: false
    },
    {
      id: "mawar", name: "Mawar Senja", cat: "Floral", tag: "Floral", premium: false,
      desc: "Merah muda lembut dengan kelopak yang jatuh perlahan.",
      v: { bg: "#FFF6F6", bg2: "#F2BFC8", ink: "#4A2A33", muted: "#8A6670", accent: "#C0566B", card: "#FFFFFF", ondark: "#4A2A33", line: "#F1D3D8" },
      fonts: { display: "'Playfair Display', serif", body: "'Jost', sans-serif", script: "'Great Vibes', cursive" },
      pattern: "bloom", frame: "arch", fx: "petals", dark: false
    },
    {
      id: "putih", name: "Putih Sunyi", cat: "Minimalis", tag: "Minimalis", premium: false,
      desc: "Putih bersih, garis tipis, tipografi tenang.",
      v: { bg: "#FFFFFF", bg2: "#F3F1ED", ink: "#1E1E1E", muted: "#767067", accent: "#8A7F72", card: "#FAF9F7", ondark: "#1E1E1E", line: "#E6E2DB" },
      fonts: { display: "'Cormorant Garamond', serif", body: "'Jost', sans-serif", script: "'Cormorant Garamond', serif" },
      pattern: null, frame: "thin", fx: null, dark: false
    },
    {
      id: "malam", name: "Langit Malam", cat: "Modern", tag: "Animasi", premium: true,
      desc: "Biru malam dengan bintang berkelip dan aksen emas.",
      v: { bg: "#0E1530", bg2: "#18234A", ink: "#E9ECFA", muted: "#9AA6D0", accent: "#E3C26B", card: "#141D3F", ondark: "#E9ECFA", line: "#2A3764" },
      fonts: { display: "'Italiana', serif", body: "'Jost', sans-serif", script: "'Pinyon Script', cursive" },
      pattern: null, frame: "thin", fx: "stars", dark: true
    },
    {
      id: "zamrud", name: "Zamrud", cat: "Islami", tag: "Islami", premium: false,
      desc: "Hijau zamrud dengan pola bintang khatam.",
      v: { bg: "#F3F8F4", bg2: "#0F4C45", ink: "#16352F", muted: "#5B7570", accent: "#B89443", card: "#FFFFFF", ondark: "#F1E6C6", line: "#D5E3DC" },
      fonts: { display: "'Amiri', serif", body: "'Jost', sans-serif", script: "'Amiri', serif" },
      pattern: "khatam", frame: "double", fx: null, dark: false
    }
  ];

  const themeById = (id) => THEMES.find((t) => t.id === id) || THEMES[0];

  const applyThemeVars = (el, theme) => {
    const v = theme.v;
    el.style.setProperty("--bg", v.bg);
    el.style.setProperty("--bg2", v.bg2);
    el.style.setProperty("--ink", v.ink);
    el.style.setProperty("--muted", v.muted);
    el.style.setProperty("--accent", v.accent);
    el.style.setProperty("--card", v.card);
    el.style.setProperty("--ondark", v.ondark);
    el.style.setProperty("--line", v.line);
    el.style.setProperty("--display", theme.fonts.display);
    el.style.setProperty("--body", theme.fonts.body);
    el.style.setProperty("--script", theme.fonts.script);
    // pola dipakai di atas bg2 (bagian gelap/berwarna) dan bg (terang)
    el.style.setProperty("--pattern-dark", patternURL(theme.pattern, v.ondark, 0.18));
    el.style.setProperty("--pattern-light", patternURL(theme.pattern, v.accent, 0.2));
  };

  // Cover mini untuk kartu galeri & pemilih template.
  const miniCover = (theme, a, b) => {
    const v = theme.v;
    const style = `--bg:${v.bg};--bg2:${v.bg2};--ink:${v.ink};--accent:${v.accent};--ondark:${v.ondark};--display:${theme.fonts.display};--script:${theme.fonts.script};` +
      `--pat:${patternURL(theme.pattern, v.ondark, 0.2)};`;
    const light = !theme.dark && (theme.id === "mawar" || theme.id === "putih");
    return `<div class="mini mini-${theme.id} ${light ? "mini-light" : ""} ${theme.fx ? "mini-fx-" + theme.fx : ""}" style="${style}" aria-hidden="true">
      <div class="mini-frame mini-frame-${theme.frame}">
        <small>The Wedding of</small>
        <strong>${esc(a)}</strong><em>&amp;</em><strong>${esc(b)}</strong>
        <span>20 · 03 · 2027</span>
      </div></div>`;
  };

  const DEMO = {
    type: "nikah", theme: "kencana",
    guest: "Bapak/Ibu/Saudara/i",
    groom: { name: "Raka Pratama", nick: "Raka", parents: "Putra pertama Bapak Hadi Pratama & Ibu Sari Wulandari" },
    bride: { name: "Anisa Putri Maharani", nick: "Anisa", parents: "Putri kedua Bapak Dwi Maharani & Ibu Lestari Ningsih" },
    host: { name: "", title: "", note: "" },
    akad: { date: "2027-03-20", time: "08:00", place: "Masjid Agung Al-Ikhlas", address: "Jl. Merdeka No. 12, Yogyakarta", maps: "" },
    resepsi: { date: "2027-03-20", time: "11:00", place: "Gedung Serbaguna Taman Sari", address: "Jl. Taman Sari No. 5, Yogyakarta", maps: "" },
    quote: { text: "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan dari jenismu sendiri, supaya kamu merasa tenteram kepadanya.", src: "QS. Ar-Rum: 21" },
    story: [
      { title: "Pertama Bertemu", text: "Kami bertemu di sebuah acara kampus pada 2019, dari obrolan singkat yang tidak pernah kami duga akan sejauh ini." },
      { title: "Menjalin Janji", text: "Setelah bertahun-tahun saling menguatkan, kami memutuskan untuk melangkah ke jenjang yang lebih serius." }
    ],
    gallery: [],
    gifts: [
      { bank: "Bank Contoh", no: "1234567890", name: "Raka Pratama" },
      { bank: "E-Wallet Contoh", no: "081234567890", name: "Anisa Putri Maharani" }
    ],
    music: "",
    closing: "Merupakan kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.",
    hashtag: "#RakaAnisa2027"
  };

  const DEMO_ACARA = {
    type: "acara", theme: "zamrud", guest: "Bapak/Ibu/Saudara/i",
    groom: { name: "", nick: "", parents: "" }, bride: { name: "", nick: "", parents: "" },
    host: { name: "Keluarga Bapak Hadi", title: "Syukuran Aqiqah Ananda Zayyan", note: "Dengan memohon rahmat dan ridha Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dalam acara syukuran aqiqah putra kami." },
    akad: { date: "", time: "", place: "", address: "", maps: "" },
    resepsi: { date: "2027-04-10", time: "10:00", place: "Kediaman Keluarga", address: "Jl. Melati No. 8, Bandung", maps: "" },
    quote: { text: "", src: "" }, story: [], gallery: [], gifts: [], music: "",
    closing: "Atas kehadiran dan doa restunya kami ucapkan terima kasih.", hashtag: ""
  };

  // Nomor WhatsApp -> digit internasional tanpa "+" (0812.. -> 62812..). String kosong bila tidak valid.
  const waNumber = (raw) => {
    let n = String(raw == null ? "" : raw).replace(/[^\d+]/g, "").replace(/^\+/, "").replace(/\+/g, "");
    if (n.startsWith("00")) n = n.slice(2);
    else if (n.startsWith("0")) n = "62" + n.slice(1);
    else if (n.startsWith("8")) n = "62" + n;
    return /^[1-9]\d{8,14}$/.test(n) ? n : "";
  };

  window.URMEMENTO = { esc, safeUrl, waNumber, enc, dec, patternURL, THEMES, themeById, applyThemeVars, miniCover, DEMO, DEMO_ACARA };
})();
