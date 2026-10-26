/* Ilustrasi tema: SVG orisinal yang mengikuti warna tema (lihat css/art.css) dan bergerak lewat CSS.
   Slot: "top" (di cover, hero, kartu template) dan "divider" (pembatas bagian).
   Memakai aset sendiri (PNG/GIF/WebP/SVG): taruh file di assets/themes/<id>/ lalu daftarkan di ASSETS di bawah;
   file itu menggantikan ilustrasi bawaan untuk slot tersebut. */
(function () {
  const U = window.URMEMENTO;
  if (!U) return;

  // Aset gambar per tema (PNG/WebP/GIF/SVG berlisensi milik Anda), di assets/themes/<id-tema>/.
  // Lapisan cover dan hero (semua opsional): bg (latar penuh), border (pita vertikal di tepi kiri),
  // corner (rangkaian bunga di sudut kiri atas; dicerminkan ke tiga sudut lain), scene (ilustrasi dasar, lebar penuh).
  // Slot lama: top, foot (menggantikan ilustrasi SVG). Lihat assets/themes/README.md untuk ukuran dan brief.
  const ASSETS = {
    // contoh: gadang: { bg: "bg.webp", border: "border.webp", corner: "corner.webp", scene: "scene.webp" },
    kencana: { bg: "bg.webp", border: "border.webp" }, // batik CC0, lihat assets/themes/LICENSES.md
  };

  const svg = (inner, vb) => `<svg class="art-svg" viewBox="${vb || "0 0 320 120"}" preserveAspectRatio="xMidYMax meet" aria-hidden="true" focusable="false">${inner}</svg>`;
  const r1 = (n) => Math.round(n * 10) / 10;

  // bunga lima kelopak
  const flower = (cx, cy, r, cls, n) => {
    n = n || 5;
    let s = "";
    for (let i = 0; i < n; i++) s += `<ellipse class="${cls}" cx="${cx}" cy="${r1(cy - r * 0.85)}" rx="${r1(r * 0.52)}" ry="${r1(r)}" transform="rotate(${r1((i * 360) / n)} ${cx} ${cy})"/>`;
    return s + `<circle class="g1" cx="${cx}" cy="${cy}" r="${r1(r * 0.34)}"/>`;
  };

  // berlian bertingkat (tangga) dengan jari-jari R dan n anak tangga
  const stepped = (cx, cy, R, n) => {
    const s = R / n, Q = [[0, -R]];
    for (let i = 1; i <= n; i++) { Q.push([i * s, -R + (i - 1) * s]); Q.push([i * s, -R + i * s]); }
    const my = (p) => [p[0], -p[1]], mx = (p) => [-p[0], p[1]];
    const BR = Q.map(my).reverse().slice(1);
    const BL = Q.map(my).map(mx).slice(1);
    const TL = Q.map(mx).reverse().slice(1, -1);
    return Q.concat(BR, BL, TL).map((p, i) => (i ? "L" : "M") + r1(cx + p[0]) + " " + r1(cy + p[1])).join(" ") + " Z";
  };


  // pita ilustrasi bawah (viewBox 320x70, menempel di dasar)
  const FOOT_VB = "0 0 320 70";
  const roofPath = "M22 78 C32 68 44 44 32 12 C54 30 68 50 90 58 L112 58 C113 44 119 32 114 18 C127 28 131 44 133 58 L148 58 C150 36 158 22 160 6 C162 22 170 36 172 58 L188 58 C189 44 193 30 206 18 C201 32 207 44 208 58 L230 58 C252 50 266 30 288 12 C276 44 288 68 298 78 L272 84 L48 84 Z";
  const tri = (y0, h, step, from, to, up) => { let d = ""; for (let x = from; x < to; x += step) d += up ? `M${x} ${y0} l${step / 2} ${-h} l${step / 2} ${h} ` : `M${x} ${y0} l${step / 2} ${h} l${step / 2} ${-h} `; return d; };
  const FOOT = {
    gadang: () => svg(`
      <path class="f2" d="${tri(70, 14, 20, 0, 320, true)}"/>
      <path class="f1" d="M0 70 V62 H320 V70Z" fill-opacity=".9"/>
      <g transform="translate(6 30) scale(.3)"><path class="f1" d="${roofPath}"/></g>
      <g transform="translate(232 30) scale(.3)"><path class="f1" d="${roofPath}"/></g>
      <path class="k1" d="M0 61 H320" stroke-width="1"/>
      <circle class="g1 twinkle" cx="160" cy="40" r="2.4"/><circle class="g1 twinkle d2" cx="120" cy="30" r="1.8"/><circle class="g1 twinkle d3" cx="204" cy="32" r="1.8"/>`, FOOT_VB),
    pastel: () => {
      let g = "";
      for (let i = 0; i < 10; i++) {
        const x = 16 + i * 32, h = 24 + (i % 3) * 12, d = i % 3 ? (i % 3 === 1 ? "d2" : "d3") : "";
        g += `<g class="sway ${d}"><path class="k1" d="M${x} 70 C${x - 3} ${70 - h * 0.5} ${x + 3} ${70 - h * 0.8} ${x} ${70 - h}" stroke-width="1.8"/><path class="f2" d="M${x} ${70 - h * 0.4} c-8 -2 -11 -9 -9 -14 c7 2 10 8 9 14Z"/>${flower(x, 70 - h - 3, 5 + (i % 2) * 2.5, i % 2 ? "f1" : "f2")}</g>`;
      }
      return svg(g, FOOT_VB);
    },
    galungan: () => {
      let g = `<path class="f2" d="M0 70 V63 q40 -9 80 0 t80 0 t80 0 t80 0 V70 Z"/>`;
      [[30, ""], [118, "d2"], [206, "d3"], [292, ""]].forEach(([x, d], i) => {
        const dir = i % 2 ? -1 : 1;
        g += `<path class="k1" d="M${x} 66 C${x - 4 * dir} 40 ${x + 14 * dir} 20 ${x + 32 * dir} 22" stroke-width="2.6" stroke-linecap="round"/><g class="sway ${d}"><path class="k1" d="M${x + 32 * dir} 22 v16" stroke-width="1.2"/><path class="g1" d="M${x + 32 * dir} 34 c-4 3 -4 9 0 12 c4 -3 4 -9 0 -12Z"/></g>`;
      });
      return svg(g + `<circle class="g1 twinkle" cx="160" cy="30" r="2.4"/>`, FOOT_VB);
    },
    dayak: () => {
      let sp = "";
      [40, 160, 280].forEach((cx, i) => { sp += `<g class="spin"><path class="gk" d="M${cx} 34 a2 2 0 0 1 4 0 a4 4 0 0 1 -8 0 a6 6 0 0 1 12 0 a8 8 0 0 1 -16 0" stroke-width="1.8" stroke-linecap="round"/></g>`; });
      return svg(`
        <path class="f1" d="${tri(70, 12, 16, 0, 320, true)}" fill-opacity=".9"/>
        <path class="f2" d="${tri(48, 12, 16, 8, 312, false)}"/>${sp}
        <circle class="g1 twinkle" cx="100" cy="26" r="2"/><circle class="g1 twinkle d2" cx="220" cy="26" r="2"/>`, FOOT_VB);
    },
    songket: () => `${svg(`
        <path class="f1" d="${tri(70, 16, 16, 0, 320, true)}" fill-opacity=".85"/>
        <path class="f2" d="${tri(50, 12, 16, 8, 312, false)}"/>
        <path class="g1 twinkle" d="${stepped(60, 30, 8, 2)}"/><path class="g1 twinkle d2" d="${stepped(160, 26, 10, 2)}"/><path class="g1 twinkle d3" d="${stepped(260, 30, 8, 2)}"/>
        <path class="k1" d="${stepped(160, 26, 17, 3)}" stroke-width="1.2"/>`, FOOT_VB)}`,
    sakura: () => {
      let w1 = "", w2 = "";
      for (let x = 0; x <= 320; x += 32) { [16, 11, 6].forEach((r) => { w1 += `M${x - r} 70 a${r} ${r} 0 0 1 ${2 * r} 0 `; w2 += `M${x + 16 - r} 58 a${r} ${r} 0 0 1 ${2 * r} 0 `; }); }
      return svg(`
        <path class="k2" d="${w2}" stroke-width="1.3"/><path class="k1" d="${w1}" stroke-width="1.3"/>
        <g class="bob">${flower(70, 36, 6, "f1")}</g><g class="bob d2">${flower(150, 28, 5, "f2")}</g><g class="bob">${flower(236, 38, 6, "f1")}</g>`, FOOT_VB);
    }
  };

  const ART = {
    // ---------- Rumah Gadang (Minang): atap bergonjong ----------
    gadang: {
      top: () => {
        let diamonds = "";
        for (let x = 84; x <= 236; x += 24) diamonds += `M${x} 90 l8 6 l-8 6 l-8 -6 Z `;
        return svg(`
          <circle class="g1 pulse" cx="160" cy="60" r="48" fill-opacity=".14"/>
          <path class="f1" d="M22 78 C32 68 44 44 32 12 C54 30 68 50 90 58 L112 58 C113 44 119 32 114 18 C127 28 131 44 133 58 L148 58 C150 36 158 22 160 6 C162 22 170 36 172 58 L188 58 C189 44 193 30 206 18 C201 32 207 44 208 58 L230 58 C252 50 266 30 288 12 C276 44 288 68 298 78 L272 84 L48 84 Z"/>
          <rect class="f2" x="62" y="84" width="196" height="24"/>
          <path class="k1" d="${diamonds}" stroke-width="1.2"/>
          <path class="k1" d="M70 108 v10 M110 108 v10 M150 108 v10 M190 108 v10 M230 108 v10 M250 108 v10" stroke-width="3"/>
          <path class="f2" d="M144 108 h32 v4 h-32 z M138 112 h44 v4 h-44 z"/>
          <path class="k2" d="M30 119 H290" stroke-width="1.5"/>
          <circle class="g1 twinkle" cx="32" cy="12" r="3"/><circle class="g1 twinkle d2" cx="160" cy="6" r="3.2"/><circle class="g1 twinkle d3" cx="288" cy="12" r="3"/>`);
      },
      divider: `<path d="M72 14 L80 2 L88 14 Z" fill="currentColor"/><path d="M92 14 L97 6 L102 14 Z M58 14 L63 6 L68 14 Z" fill="currentColor" opacity=".6"/>`
    },

    // ---------- Jawa Pastel: gunungan dan bunga ----------
    pastel: {
      top: () => {
        let branches = "", dots = "";
        [50, 66, 82].forEach((y, i) => {
          const dx = 22 - i * 4;
          branches += `M160 ${y} C${160 - dx * 0.6} ${y - 2} ${160 - dx} ${y - 8} ${160 - dx - 4} ${y - 16} M160 ${y} C${160 + dx * 0.6} ${y - 2} ${160 + dx} ${y - 8} ${160 + dx + 4} ${y - 16} `;
          dots += `<circle class="f1" cx="${160 - dx - 4}" cy="${y - 16}" r="2.6"/><circle class="f1" cx="${160 + dx + 4}" cy="${y - 16}" r="2.6"/>`;
        });
        return svg(`
          <path class="f2" d="M160 4 C176 30 208 56 208 108 L112 108 C112 56 144 30 160 4 Z"/>
          <path class="k1" d="M160 4 C176 30 208 56 208 108 L112 108 C112 56 144 30 160 4 Z" stroke-width="1.6"/>
          <path class="k1" d="M160 26 V104 ${branches}" stroke-width="1.8" stroke-linecap="round"/>${dots}
          <path class="k1" d="M148 108 V98 a12 12 0 0 1 24 0 V108" stroke-width="1.6"/>
          <g class="sway">
            <path class="k1" d="M58 116 C56 94 64 80 60 60" stroke-width="2"/>${flower(60, 54, 9, "f1")}
            <path class="f2" d="M58 98 C48 96 43 88 45 80 C53 82 58 90 58 98Z"/>
            ${flower(40, 84, 6, "f2")}
          </g>
          <g class="sway d2">
            <path class="k1" d="M262 116 C264 94 256 80 260 60" stroke-width="2"/>${flower(260, 54, 9, "f1")}
            <path class="f2" d="M262 98 C272 96 277 88 275 80 C267 82 262 90 262 98Z"/>
            ${flower(280, 84, 6, "f2")}
          </g>
          <path class="k2" d="M20 116 H300" stroke-width="1.5"/>`);
      },
      divider: `${flower(80, 9, 5, "cc")}<circle cx="64" cy="8" r="1.8" fill="currentColor"/><circle cx="96" cy="8" r="1.8" fill="currentColor"/>`
    },

    // ---------- Galungan: penjor Bali ----------
    galungan: {
      top: () => {
        const tassel = (x, y, len, d) => `<g class="sway ${d || ""}"><path class="k1" d="M${x} ${y} v${len}" stroke-width="1.4"/><path class="g1" d="M${x} ${y + len - 10} c-5 4 -5 10 0 14 c5 -4 5 -10 0 -14Z"/><path class="f1" d="M${x} ${y + 8} c-4 3 -4 8 0 11 c4 -3 4 -8 0 -11Z"/></g>`;
        return svg(`
          <circle class="g1 pulse" cx="160" cy="58" r="40" fill-opacity=".14"/>
          <path class="k1" d="M44 118 C38 70 66 26 122 16 C136 14 146 20 148 32" stroke-width="3.2" stroke-linecap="round"/>
          <path class="k1" d="M276 118 C282 70 254 26 198 16 C184 14 174 20 172 32" stroke-width="3.2" stroke-linecap="round"/>
          ${tassel(148, 32, 34)}${tassel(172, 32, 34, "d2")}
          ${tassel(104, 22, 22, "d3")}${tassel(216, 22, 22)}
          ${tassel(74, 42, 20, "d2")}${tassel(246, 42, 20, "d3")}
          <g class="pulse">${flower(160, 70, 15, "f1", 8)}</g>
          <path class="f2" d="M20 118 q40 -16 80 0 z M220 118 q40 -16 80 0 z"/>
          <path class="k2" d="M20 119 H300" stroke-width="1.5"/>`);
      },
      divider: `<rect x="62" y="3" width="8" height="8" fill="currentColor"/><rect x="70" y="11" width="8" height="8" fill="currentColor" transform="translate(0 -6)"/><rect x="78" y="3" width="8" height="8" fill="currentColor"/><rect x="86" y="5" width="8" height="8" fill="currentColor" opacity=".6"/>`
    },

    // ---------- Dayak Enggang: perisai dan bulu enggang ----------
    dayak: {
      top: () => {
        const feather = (a, cls) => `<path class="${cls}" d="M112 94 C92 84 78 60 76 30 C94 44 108 66 112 94Z" transform="rotate(${a} 112 94)"/>`;
        const zig = (y) => `M130 ${y} ` + Array.from({ length: 8 }, (_, i) => (i % 2 ? "l7 7 " : "l7 -7 ")).join("");
        let teeth = "";
        for (let x = 20; x < 300; x += 16) teeth += `M${x} 119 l8 -10 l8 10 `;
        return svg(`
          <g class="bob">${feather(-30, "g1")}${feather(-12, "f1")}${feather(6, "g1")}${feather(22, "f2")}</g>
          <g transform="translate(320 0) scale(-1 1)"><g class="bob d2">${feather(-30, "g1")}${feather(-12, "f1")}${feather(6, "g1")}${feather(22, "f2")}</g></g>
          <path class="f2" d="M160 4 L198 28 L198 88 L160 116 L122 88 L122 28 Z"/>
          <path class="k1" d="M160 4 L198 28 L198 88 L160 116 L122 88 L122 28 Z" stroke-width="2.2" stroke-linejoin="round"/>
          <path class="k1" d="${zig(40)}" stroke-width="1.6"/>
          <path class="k1" d="${zig(88)}" stroke-width="1.6"/>
          <g class="spin"><path class="gk" d="M160 62 a3 3 0 0 1 6 0 a6 6 0 0 1 -12 0 a9 9 0 0 1 18 0 a12 12 0 0 1 -24 0" stroke-width="2.2" stroke-linecap="round"/></g>
          <path class="f2" d="${teeth}"/>`);
      },
      divider: `<path d="M80 8 a2 2 0 0 1 4 0 a4 4 0 0 1 -8 0 a6 6 0 0 1 12 0" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>`
    },

    // ---------- Songket Ungu: medali berlian bertingkat ----------
    songket: {
      top: () => {
        let tumpal = "";
        for (let x = 0; x < 320; x += 16) tumpal += `M${x} 119 L${x + 8} 103 L${x + 16} 119 Z `;
        return svg(`
          <g class="spin"><path class="k1" d="${stepped(160, 54, 46, 4)}" stroke-width="1.8"/></g>
          <path class="f2" d="${stepped(160, 54, 32, 3)}"/>
          <path class="g1 pulse" d="${stepped(160, 54, 16, 2)}"/>
          <path class="k1" d="${stepped(66, 54, 18, 2)}" stroke-width="1.5"/><path class="k1" d="${stepped(254, 54, 18, 2)}" stroke-width="1.5"/>
          <path class="f2" d="${stepped(66, 54, 7, 1)}"/><path class="f2" d="${stepped(254, 54, 7, 1)}"/>
          <path class="k2" d="M92 54 H112 M208 54 H228" stroke-width="1.4"/>
          <path class="f1" d="${tumpal}" fill-opacity=".85"/>
          <path class="g1 twinkle" d="${stepped(116, 16, 5, 1)}"/><path class="g1 twinkle d2" d="${stepped(204, 16, 5, 1)}"/><path class="g1 twinkle d3" d="${stepped(160, 8, 4, 1)}"/>`);
      },
      divider: `<path d="${stepped(80, 8, 7, 2)}" fill="currentColor"/><path d="M40 8 H64 M96 8 H120" stroke="currentColor" stroke-width="1.2"/>`
    },

    // ---------- Washi Sakura: torii, matahari, ranting sakura ----------
    sakura: {
      top: () => {
        let wave = "";
        for (let x = 20; x < 300; x += 40) wave += `M${x} 114 q10 -9 20 0 t20 0 `;
        return svg(`
          <circle class="g1 pulse" cx="160" cy="58" r="40"/>
          <rect class="f1" x="118" y="48" width="8" height="62"/><rect class="f1" x="194" y="48" width="8" height="62"/>
          <path class="f1" d="M98 40 C128 48 192 48 222 40 L230 28 C192 38 128 38 90 28 Z"/>
          <rect class="f1" x="108" y="60" width="104" height="6"/><rect class="f1" x="152" y="42" width="16" height="8"/>
          <path class="k2" d="${wave}" stroke-width="1.6" stroke-linecap="round"/>
          <g class="sway">
            <path class="k1" d="M320 4 C286 10 256 24 226 30 M274 14 C268 24 262 30 252 36 M296 8 C294 18 290 24 284 28" stroke-width="2.6" stroke-linecap="round"/>
            ${flower(262, 22, 7, "f1")}${flower(240, 34, 6, "f2")}${flower(288, 22, 6, "f1")}${flower(276, 8, 5, "f2")}${flower(250, 44, 5, "f1")}
          </g>`);
      },
      divider: `${flower(80, 9, 5, "cc")}<path d="M40 9 H66 M94 9 H120" stroke="currentColor" stroke-width="1.2"/>`
    }
  };

  // lapisan aset gambar milik tema (atau null)
  U.artAssets = (theme) => {
    const id = typeof theme === "string" ? theme : theme.id, m = ASSETS[id];
    if (!m || !(m.bg || m.border || m.corner || m.scene)) return null;
    return Object.assign({ base: `assets/themes/${id}/` }, m);
  };

  // slot "top" / "divider"; kembalikan "" bila tema tidak punya ilustrasi
  U.art = (theme, slot) => {
    const id = typeof theme === "string" ? theme : theme.id;
    const asset = ASSETS[id] && ASSETS[id][slot];
    if (asset) return `<img class="art-img" src="assets/themes/${id}/${asset}" alt="" decoding="async">`;
    if (slot === "foot") return FOOT[id] ? FOOT[id]() : "";
    const a = ART[id];
    if (!a || !a[slot]) return "";
    if (slot === "divider") return svg(`<path d="M4 9 H54 M106 9 H156" stroke="currentColor" stroke-opacity=".45" stroke-width="1.2"/><g transform="translate(80 9) scale(1.7) translate(-80 -9)">${a.divider}</g>`, "0 0 160 18").replace('class="art-svg"', 'class="art-svg art-divider"');
    return typeof a[slot] === "function" ? a[slot]() : a[slot];
  };
})();
