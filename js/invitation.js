/* Renderer undangan. Data datang dari: #d=<base64url>, ?demo=<tema|acara>, atau postMessage dari builder. */
(function () {
  const U = window.URMEMENTO;
  const { esc, safeUrl } = U;
  const $ = (s, r = document) => r.querySelector(s);
  const app = $("#app");
  const params = new URLSearchParams(location.search);

  let data = null;
  let opts = { skipCover: params.get("skip") === "1" };
  let timer = null;
  let io = null;

  /* ---------- util ---------- */
  const fmtDate = (d) => {
    if (!d) return "";
    const dt = new Date(d + "T00:00:00");
    return isNaN(dt) ? "" : dt.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  };
  const shortDate = (d) => {
    if (!d) return "";
    const dt = new Date(d + "T00:00:00");
    return isNaN(dt) ? "" : dt.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  };
  const fmtTime = (t) => (t ? t.replace(":", ".") + " WIB" : "");
  const hasEv = (e) => e && (e.date || e.place);
  const mapsHref = (e) => safeUrl(e.maps) || "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(e.address || e.place || "");

  const toast = (msg) => {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove("show"), 1800);
  };

  const hash = (s) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return (h >>> 0).toString(36); };
  const storeKey = () => "urmemento:rsvp:" + hash(JSON.stringify([data.type, data.groom?.name, data.bride?.name, data.host?.name, data.resepsi?.date]));
  const loadWishes = () => { try { return JSON.parse(localStorage.getItem(storeKey()) || "[]"); } catch (e) { return []; } };
  const saveWishes = (a) => { try { localStorage.setItem(storeKey(), JSON.stringify(a.slice(0, 200))); } catch (e) { /* storage penuh/dinonaktifkan */ } };

  const fx = (theme) => {
    if (theme.fx === "stars") {
      let s = "";
      for (let i = 0; i < 46; i++) s += `<i class="star" style="left:${Math.random() * 100}%;top:${Math.random() * 100}%;animation-delay:${(Math.random() * 3).toFixed(2)}s;width:${1 + Math.random() * 2}px;height:${1 + Math.random() * 2}px"></i>`;
      return `<div class="fx" aria-hidden="true">${s}</div>`;
    }
    if (theme.fx === "petals") {
      let s = "";
      for (let i = 0; i < 12; i++) s += `<i class="petal" style="left:${Math.random() * 100}%;animation-duration:${9 + Math.random() * 8}s;animation-delay:${(-Math.random() * 12).toFixed(1)}s;--dx:${(Math.random() * 80 - 40).toFixed(0)}px"></i>`;
      return `<div class="fx" aria-hidden="true">${s}</div>`;
    }
    return "";
  };

  /* ---------- bagian-bagian ---------- */
  const titleBlock = (d) => {
    if (d.type === "acara") {
      return `<div class="names"><span>Undangan</span>${esc(d.host.title || "Acara Syukuran")}</div>`;
    }
    return `<div class="names">${esc(d.groom.nick || d.groom.name || "Mempelai Pria")}<span>&amp;</span>${esc(d.bride.nick || d.bride.name || "Mempelai Wanita")}</div>`;
  };

  const primaryEvent = (d) => (hasEv(d.resepsi) && d.resepsi.date ? d.resepsi : d.akad);

  const coverHTML = (d, theme) => {
    const ev = [d.akad, d.resepsi].filter((e) => e && e.date).sort((a, b) => a.date.localeCompare(b.date))[0];
    return `<section class="cover" id="cover" aria-label="Sampul undangan">
      ${fx(theme)}
      <div class="cover-inner frame-${theme.frame}">
        <div class="eyebrow">${d.type === "acara" ? "Undangan" : "The Wedding of"}</div>
        ${titleBlock(d)}
        <div class="date">${esc(ev ? shortDate(ev.date) : "")}</div>
        <div class="to">Kepada Yth.<strong>${esc(d.guest || "Bapak/Ibu/Saudara/i")}</strong></div>
        <button class="btn" id="open-btn" type="button">Buka Undangan</button>
      </div>
    </section>`;
  };

  const heroHTML = (d, theme) => {
    const ev = primaryEvent(d) || {};
    const intro = d.type === "acara" ? "Dengan hormat, kami mengundang Anda" : "Kami mengundang Anda untuk hadir dalam pernikahan";
    return `<section class="sec dark hero" id="hero">
      ${fx(theme)}
      <div style="position:relative;z-index:2">
        <div class="intro reveal">${intro}</div>
        <div class="reveal">${titleBlock(d)}</div>
        <div class="when reveal">${esc(fmtDate(ev.date))}</div>
        <div class="count reveal" id="count" aria-label="Hitung mundur">
          <div><b data-k="d">0</b><small>Hari</small></div><div><b data-k="h">0</b><small>Jam</small></div>
          <div><b data-k="m">0</b><small>Menit</small></div><div><b data-k="s">0</b><small>Detik</small></div>
        </div>
      </div></section>`;
  };

  const quoteHTML = (d) => {
    if (d.type === "acara" && d.host.note) {
      return `<section class="sec"><p class="quote reveal">${esc(d.host.note)}</p></section>`;
    }
    if (!d.quote || !d.quote.text) return "";
    return `<section class="sec"><div class="rule"></div><blockquote class="quote reveal" style="margin:0">“${esc(d.quote.text)}”<cite>${esc(d.quote.src)}</cite></blockquote></section>`;
  };

  const personHTML = (p, fallback) => `<div class="person reveal">
      <div class="ph" aria-hidden="true">${esc((p.nick || p.name || fallback).charAt(0).toUpperCase())}</div>
      <h3>${esc(p.name || fallback)}</h3><p>${esc(p.parents)}</p></div>`;

  const coupleHTML = (d) => {
    if (d.type === "acara") {
      return `<section class="sec alt"><h2 class="reveal">Tuan Rumah</h2><div class="rule"></div>
        <div class="person reveal"><div class="ph" aria-hidden="true">${esc((d.host.name || "K").charAt(0).toUpperCase())}</div><h3>${esc(d.host.name)}</h3></div></section>`;
    }
    return `<section class="sec alt" id="mempelai"><h2 class="reveal">Mempelai</h2><div class="rule"></div>
      ${personHTML(d.groom, "Mempelai Pria")}<div class="amp reveal">&amp;</div>${personHTML(d.bride, "Mempelai Wanita")}</section>`;
  };

  const evCard = (label, e) => {
    if (!hasEv(e)) return "";
    return `<div class="ev reveal"><h3>${esc(label)}</h3>
      <div class="d">${esc(fmtDate(e.date))}</div><div class="t">${esc(fmtTime(e.time))}</div>
      <div class="pl">${esc(e.place)}</div><div class="ad">${esc(e.address)}</div>
      <a class="btn sm ghost" href="${esc(mapsHref(e))}" target="_blank" rel="noopener">Buka Peta</a></div>`;
  };

  const eventsHTML = (d) => {
    const isAcara = d.type === "acara";
    const cards = isAcara ? evCard("Acara", d.resepsi) : evCard("Akad Nikah", d.akad) + evCard("Resepsi", d.resepsi);
    if (!cards) return "";
    return `<section class="sec" id="acara"><h2 class="reveal">Waktu & Tempat</h2><div class="rule"></div>${cards}
      <div class="actions reveal"><button class="btn" type="button" id="ics-btn">Simpan ke Kalender</button></div></section>`;
  };

  const storyHTML = (d) => {
    const s = (d.story || []).filter((x) => x && (x.title || x.text));
    if (!s.length || d.type === "acara") return "";
    return `<section class="sec alt"><h2 class="reveal">Cerita Kami</h2><div class="rule"></div>
      <div class="timeline">${s.map((x) => `<div class="tl reveal"><h3>${esc(x.title)}</h3><p>${esc(x.text)}</p></div>`).join("")}</div></section>`;
  };

  const galleryHTML = (d) => {
    const urls = (d.gallery || []).map(safeUrl).filter(Boolean).slice(0, 30);
    const tiles = urls.length
      ? urls.map((u, i) => `<button class="g reveal" type="button" data-src="${esc(u)}" aria-label="Perbesar foto ${i + 1}"><img src="${esc(u)}" alt="Foto ${i + 1}" loading="lazy"></button>`).join("")
      : [1, 2, 3, 4, 5].map((n) => `<div class="g reveal">Foto ${n}</div>`).join("");
    return `<section class="sec" id="galeri"><h2 class="reveal">Galeri</h2><div class="rule"></div>
      <div class="grid">${tiles}</div>${urls.length ? "" : '<p class="note">Foto Anda akan tampil di sini.</p>'}</section>`;
  };

  const giftHTML = (d) => {
    const g = (d.gifts || []).filter((x) => x && x.no);
    if (!g.length) return "";
    return `<section class="sec alt"><h2 class="reveal">Amplop Digital</h2><div class="rule"></div>
      <p class="lead reveal">Doa restu Anda adalah hadiah terbaik. Bila ingin berbagi tanda kasih, dapat melalui:</p>
      ${g.map((x) => `<div class="gift reveal"><small>${esc(x.bank)}</small><strong>${esc(x.no)}</strong><p>a.n. ${esc(x.name)}</p>
        <button class="btn sm ghost" type="button" data-copy="${esc(x.no)}">Salin Nomor</button></div>`).join("")}</section>`;
  };

  const wishesHTML = (list) => list.length
    ? list.map((w) => `<div class="wish"><b>${esc(w.name)}</b><span class="chip">${esc(w.statusLabel)}</span>${w.msg ? `<p>${esc(w.msg)}</p>` : ""}</div>`).join("")
    : '<p class="empty">Belum ada ucapan. Jadilah yang pertama.</p>';

  const rsvpHTML = (d) => `<section class="sec" id="rsvp"><h2 class="reveal">RSVP & Ucapan</h2><div class="rule"></div>
    <p class="lead reveal">Mohon konfirmasi kehadiran Anda.</p>
    <form class="rsvp reveal" id="rsvp-form" autocomplete="off">
      <label>Nama<input name="name" required maxlength="60" value="${esc(d.guest && d.guest !== "Bapak/Ibu/Saudara/i" ? d.guest : "")}"></label>
      <div class="radios" role="radiogroup" aria-label="Kehadiran">
        <label><input type="radio" name="status" value="hadir" checked>Hadir</label>
        <label><input type="radio" name="status" value="ragu">Ragu-ragu</label>
        <label><input type="radio" name="status" value="tidak">Tidak hadir</label>
      </div>
      <label>Jumlah tamu<select name="count">${[1, 2, 3, 4, 5].map((n) => `<option>${n}</option>`).join("")}</select></label>
      <label>Ucapan & doa<textarea name="msg" maxlength="300"></textarea></label>
      <button class="btn" type="submit">Kirim</button>
      <p class="note">Mode demo: RSVP tersimpan di perangkat ini saja.</p>
    </form>
    <div class="wishes" id="wishes">${wishesHTML(loadWishes())}</div></section>`;

  const closingHTML = (d) => `<section class="sec dark closing">
    <p class="lead reveal">${esc(d.closing)}</p>
    <div class="big reveal">Terima kasih</div>
    ${d.hashtag ? `<p class="reveal" style="margin-top:14px;letter-spacing:.1em">${esc(d.hashtag)}</p>` : ""}</section>
    <div class="foot">Dibuat dengan <a href="index.html" target="_top">ur.memento</a></div>`;

  /* ---------- render ---------- */
  function render() {
    const d = data;
    const theme = U.themeById(d.theme);
    U.applyThemeVars(document.documentElement, theme);
    document.body.className = "t-" + theme.id;
    document.title = (d.type === "acara" ? d.host.title : `${d.groom.nick || d.groom.name} & ${d.bride.nick || d.bride.name}`) + " · Undangan";

    app.innerHTML = coverHTML(d, theme) + heroHTML(d, theme) + quoteHTML(d) + coupleHTML(d) + eventsHTML(d) +
      storyHTML(d) + galleryHTML(d) + giftHTML(d) + rsvpHTML(d) + closingHTML(d);

    const cover = $("#cover");
    if (opts.skipCover) {
      cover.classList.add("open"); cover.style.display = "none"; document.body.classList.remove("locked");
    } else {
      document.body.classList.add("locked");
    }
    wire();
    startCountdown();
    observe();
    setupMusic();
  }

  function wire() {
    const openBtn = $("#open-btn");
    if (openBtn) openBtn.addEventListener("click", () => {
      $("#cover").classList.add("open");
      document.body.classList.remove("locked");
      const a = $("#audio");
      if (a.src) a.play().then(() => { $("#music-btn").classList.add("on"); }).catch(() => {});
      window.scrollTo({ top: 0 });
    });
    app.querySelectorAll("[data-copy]").forEach((b) => b.addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(b.dataset.copy); toast("Nomor disalin"); }
      catch (e) { toast("Salin manual: " + b.dataset.copy); }
    }));
    app.querySelectorAll("[data-src]").forEach((b) => b.addEventListener("click", () => {
      const lb = $("#lightbox"); lb.querySelector("img").src = b.dataset.src; lb.hidden = false;
    }));
    const ics = $("#ics-btn");
    if (ics) ics.addEventListener("click", downloadICS);
    const form = $("#rsvp-form");
    if (form) form.addEventListener("submit", (e) => {
      e.preventDefault();
      const f = new FormData(form);
      const labels = { hadir: "Hadir", ragu: "Ragu-ragu", tidak: "Tidak hadir" };
      const st = f.get("status");
      const list = loadWishes();
      list.unshift({ name: String(f.get("name")).trim(), status: st, statusLabel: labels[st] + (st === "hadir" ? ` · ${f.get("count")} orang` : ""), msg: String(f.get("msg")).trim(), ts: Date.now() });
      saveWishes(list);
      $("#wishes").innerHTML = wishesHTML(list);
      form.reset();
      toast("Terima kasih, terkirim!");
    });
  }

  const lb = $("#lightbox");
  lb.addEventListener("click", () => { lb.hidden = true; });

  function startCountdown() {
    clearInterval(timer);
    const ev = [data.akad, data.resepsi].filter((e) => e && e.date).sort((a, b) => (a.date + (a.time || "")).localeCompare(b.date + (b.time || "")))[0];
    const box = $("#count");
    if (!ev) { if (box) box.style.display = "none"; return; }
    const target = new Date(`${ev.date}T${ev.time || "00:00"}:00`).getTime();
    const tick = () => {
      let diff = Math.max(0, target - Date.now());
      const v = { d: Math.floor(diff / 864e5), h: Math.floor(diff / 36e5) % 24, m: Math.floor(diff / 6e4) % 60, s: Math.floor(diff / 1e3) % 60 };
      Object.keys(v).forEach((k) => { const el = box.querySelector(`[data-k="${k}"]`); if (el) el.textContent = v[k]; });
    };
    tick();
    timer = setInterval(tick, 1000);
  }

  function downloadICS() {
    const e = primaryEvent(data) || data.akad;
    if (!e || !e.date) return;
    const t = (e.time || "09:00").split(":");
    const start = new Date(`${e.date}T${t[0].padStart(2, "0")}:${(t[1] || "00").padStart(2, "0")}:00`);
    const end = new Date(start.getTime() + 2 * 36e5);
    const p = (n) => String(n).padStart(2, "0");
    const ts = (x) => `${x.getFullYear()}${p(x.getMonth() + 1)}${p(x.getDate())}T${p(x.getHours())}${p(x.getMinutes())}00`;
    const title = data.type === "acara" ? data.host.title : `Pernikahan ${data.groom.nick} & ${data.bride.nick}`;
    const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//ur.memento//ID", "BEGIN:VEVENT", `UID:${Date.now()}@urmemento`, `DTSTAMP:${ts(new Date())}`,
      `DTSTART:${ts(start)}`, `DTEND:${ts(end)}`, `SUMMARY:${title}`, `LOCATION:${(e.place + " " + e.address).trim()}`, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    a.download = "undangan.ics";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1500);
  }

  function observe() {
    if (io) io.disconnect();
    const els = app.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("in")); return; }
    io = new IntersectionObserver((en) => en.forEach((x) => { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } }), { threshold: 0.12 });
    els.forEach((e) => io.observe(e));
  }

  function setupMusic() {
    const a = $("#audio"), b = $("#music-btn");
    const src = safeUrl(data.music);
    if (!src) { b.hidden = true; a.removeAttribute("src"); return; }
    if (a.getAttribute("src") !== src) a.src = src;
    b.hidden = false;
    b.onclick = () => {
      if (a.paused) a.play().then(() => b.classList.add("on")).catch(() => toast("Musik tidak bisa diputar"));
      else { a.pause(); b.classList.remove("on"); }
    };
  }

  /* ---------- normalisasi & sumber data ---------- */
  function normalize(raw) {
    const base = JSON.parse(JSON.stringify(raw && raw.type === "acara" ? U.DEMO_ACARA : U.DEMO));
    const d = Object.assign(base, raw || {});
    ["groom", "bride", "host", "akad", "resepsi", "quote"].forEach((k) => { d[k] = Object.assign({}, base[k], (raw && raw[k]) || {}); });
    d.story = Array.isArray(d.story) ? d.story : [];
    d.gallery = Array.isArray(d.gallery) ? d.gallery : [];
    d.gifts = Array.isArray(d.gifts) ? d.gifts : [];
    const to = params.get("to");
    if (to) d.guest = to.slice(0, 80);
    return d;
  }

  function init() {
    let raw = null;
    const m = location.hash.match(/d=([^&]+)/);
    if (m) { try { raw = U.dec(m[1]); } catch (e) { raw = null; } }
    const demo = params.get("demo");
    if (!raw && demo !== null) {
      raw = demo === "acara" ? JSON.parse(JSON.stringify(U.DEMO_ACARA)) : Object.assign(JSON.parse(JSON.stringify(U.DEMO)), { theme: U.themeById(demo).id });
      if (demo === "") raw = JSON.parse(JSON.stringify(U.DEMO));
    }
    data = normalize(raw);
    render();
  }

  window.addEventListener("message", (e) => {
    if (e.source !== window.parent || !e.data || e.data.type !== "urmemento:update") return;
    if (e.data.opts) opts = Object.assign(opts, e.data.opts);
    data = normalize(e.data.data);
    render();
  });
  window.addEventListener("hashchange", init);

  init();
  if (window.parent !== window) window.parent.postMessage({ type: "urmemento:ready" }, "*");
})();
