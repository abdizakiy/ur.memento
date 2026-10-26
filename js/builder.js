(function () {
  const C = window.URMEMENTO_CONFIG, U = window.URMEMENTO;
  const $ = (s) => document.querySelector(s);
  const KEY = "urmemento:draft:v1";
  const frame = $("#frame");
  const params = new URLSearchParams(location.search);

  const KINDS = {
    nikah: { type: "nikah" },
    aqiqah: { type: "acara", title: "Syukuran Aqiqah Ananda ", note: "Dengan memohon rahmat dan ridha Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dalam acara aqiqah putra/putri kami." },
    khitan: { type: "acara", title: "Syukuran Khitan Ananda ", note: "Dengan rasa syukur, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dalam acara khitan putra kami." },
    ultah: { type: "acara", title: "Ulang Tahun ke-", note: "Mari merayakan hari istimewa ini bersama kami." },
    syukuran: { type: "acara", title: "Syukuran ", note: "Dengan rasa syukur, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dalam acara kami." }
  };

  let state = null;
  let kind = "nikah";

  // ---------- state <-> form ----------
  const val = (id) => ($("#" + id) ? $("#" + id).value : "");
  const set = (id, v) => { const el = $("#" + id); if (el) el.value = v == null ? "" : v; };

  function readForm() {
    const type = KINDS[kind].type;
    const story = val("story").split("\n").map((l) => l.trim()).filter(Boolean).map((l) => {
      const i = l.indexOf("|");
      return i < 0 ? { title: "", text: l } : { title: l.slice(0, i).trim(), text: l.slice(i + 1).trim() };
    });
    const gifts = [1, 2].map((n) => ({ bank: val(`g${n}-bank`), no: val(`g${n}-no`), name: val(`g${n}-name`) })).filter((g) => g.no.trim());
    return {
      type, theme: state.theme, guest: "Nama Tamu", kind,
      groom: { name: val("groom-name"), nick: val("groom-nick"), parents: val("groom-parents") },
      bride: { name: val("bride-name"), nick: val("bride-nick"), parents: val("bride-parents") },
      host: { name: val("host-name"), title: val("host-title"), note: val("host-note") },
      akad: { date: val("akad-date"), time: val("akad-time"), place: val("akad-place"), address: val("akad-address"), maps: val("akad-maps") },
      resepsi: { date: val("resepsi-date"), time: val("resepsi-time"), place: val("resepsi-place"), address: val("resepsi-address"), maps: val("resepsi-maps") },
      quote: { text: val("quote-text"), src: val("quote-src") },
      story,
      gallery: val("gallery").split("\n").map((l) => l.trim()).filter(Boolean),
      gifts, music: val("music").trim(), rsvpWa: val("rsvp-wa").trim(), closing: val("closing"), hashtag: val("hashtag")
    };
  }

  function fillForm(d) {
    state = { theme: d.theme };
    kind = d.kind || (d.type === "acara" ? "syukuran" : "nikah");
    set("kind", kind);
    ["groom", "bride"].forEach((k) => { set(k + "-name", d[k].name); set(k + "-nick", d[k].nick); set(k + "-parents", d[k].parents); });
    set("host-name", d.host.name); set("host-title", d.host.title); set("host-note", d.host.note);
    ["akad", "resepsi"].forEach((k) => ["date", "time", "place", "address", "maps"].forEach((f) => set(`${k}-${f}`, d[k][f])));
    set("quote-text", d.quote.text); set("quote-src", d.quote.src);
    set("story", (d.story || []).map((s) => (s.title ? `${s.title} | ${s.text}` : s.text)).join("\n"));
    set("gallery", (d.gallery || []).join("\n"));
    set("music", d.music);
    [1, 2].forEach((n) => { const g = (d.gifts || [])[n - 1] || {}; set(`g${n}-bank`, g.bank); set(`g${n}-no`, g.no); set(`g${n}-name`, g.name); });
    set("closing", d.closing); set("hashtag", d.hashtag); set("rsvp-wa", d.rsvpWa);
    waHint();
    applyKindUI();
    drawPicker();
  }

  function waHint() {
    const raw = val("rsvp-wa").trim(), n = U.waNumber(raw), el = $("#rsvp-wa-hint");
    if (!el) return;
    el.textContent = !raw ? "Tamu yang menekan Kirim akan membuka WhatsApp dengan pesan konfirmasi siap kirim ke nomor ini. Kosongkan bila tidak ingin menerima RSVP."
      : n ? "RSVP akan dikirim ke +" + n + "." : "Nomor belum valid. Contoh: 0812 3456 7890 atau +62 812 3456 7890.";
  }

  function applyKindUI() {
    const isN = KINDS[kind].type === "nikah";
    $("#sec-nikah").hidden = !isN;
    $("#sec-acara").hidden = isN;
    $("#fs-akad").hidden = !isN;
    $("#lb-story").hidden = !isN;
    $("#lg-resepsi").textContent = isN ? "Resepsi" : "Acara";
  }

  // ---------- template picker ----------
  function drawPicker() {
    $("#tpl-pick").innerHTML = U.THEMES.map((t) => `<button type="button" role="radio" aria-checked="${t.id === state.theme}" data-t="${t.id}">
      <span class="pk">${U.miniCover(t, "Raka", "Anisa")}</span><span class="nm">${U.esc(t.name)}</span></button>`).join("");
  }
  $("#tpl-pick").addEventListener("click", (e) => {
    const b = e.target.closest("[data-t]");
    if (!b) return;
    state.theme = b.dataset.t; drawPicker(); update();
    if (window.URMEMENTO_TRACK) window.URMEMENTO_TRACK("template_pick", { theme: state.theme, where: "builder" });
  });

  // ---------- preview ----------
  let ready = false, t = null;
  const skip = () => $("#skip-cover").checked;
  function push() {
    const d = readForm();
    try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) { /* penyimpanan dinonaktifkan */ }
    if (ready && frame.contentWindow) frame.contentWindow.postMessage({ type: "urmemento:update", data: d, opts: { skipCover: skip() } }, "*");
    $("#open-new").href = shareURL(null);
    $("#order").href = orderURL();
  }
  function update() { clearTimeout(t); t = setTimeout(push, 180); }
  window.addEventListener("message", (e) => {
    if (e.source === frame.contentWindow && e.data && e.data.type === "urmemento:ready") { ready = true; push(); }
  });
  $("#form").addEventListener("input", update);
  $("#rsvp-wa").addEventListener("input", waHint);
  $("#kind").addEventListener("change", () => {
    const prev = kind;
    kind = val("kind");
    applyKindUI();
    const k = KINDS[kind];
    if (k.type === "acara" && (!val("host-title") || Object.values(KINDS).some((x) => x.title && val("host-title") === x.title))) { set("host-title", k.title); set("host-note", k.note); }
    if (k.type === "acara" && prev === "nikah" && !val("resepsi-date")) set("resepsi-date", val("akad-date"));
    update();
  });
  $("#skip-cover").addEventListener("change", push);

  // ---------- link ----------
  function baseURL() { return new URL("undangan.html", location.href).href; }
  function shareURL(guest) {
    const d = readForm();
    delete d.guest; delete d.kind;
    return baseURL() + (guest ? "?to=" + encodeURIComponent(guest) : "") + "#d=" + U.enc(d);
  }
  const toast = (m) => { const e = $("#toast"); e.textContent = m; e.classList.add("show"); clearTimeout(toast._t); toast._t = setTimeout(() => e.classList.remove("show"), 1800); };
  async function copy(text, msg) {
    try { await navigator.clipboard.writeText(text); toast(msg || "Tersalin"); }
    catch (e) { window.prompt("Salin manual:", text); }
  }
  const T = (n, p) => window.URMEMENTO_TRACK && window.URMEMENTO_TRACK(n, p);
  $("#form").addEventListener("input", () => { if (!T.started) { T.started = true; T("builder_start", { template: state && state.theme, kind }); } });
  $("#order").addEventListener("click", () => T("order_click", { plan: planSel.value, template: state && state.theme }));
  $("#copy-link").addEventListener("click", () => { T("link_copied", { scope: "umum" }); copy(shareURL(null), "Link undangan disalin"); });

  $("#make-links").addEventListener("click", () => {
    const names = val("guests").split("\n").map((s) => s.trim()).filter(Boolean).slice(0, 300);
    const ul = $("#guest-links");
    if (!names.length) { ul.innerHTML = '<li><span>Isi nama tamu dulu.</span></li>'; return; }
    ul.innerHTML = names.map((n, i) => `<li><span title="${U.esc(n)}">${U.esc(n)}</span><button type="button" data-i="${i}" data-a="copy">Salin</button><button type="button" data-i="${i}" data-a="wa">WhatsApp</button></li>`).join("");
    ul._names = names;
    T("guest_links_made", { count: names.length });
  });
  $("#guest-links").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-a]");
    if (!b) return;
    const name = $("#guest-links")._names[+b.dataset.i];
    const link = shareURL(name);
    T(b.dataset.a === "copy" ? "link_copied" : "guest_wa_click", { scope: "tamu" });
    if (b.dataset.a === "copy") return copy(link, "Link untuk " + name + " disalin");
    const d = readForm();
    const who = d.type === "acara" ? d.host.title : `pernikahan ${d.groom.nick || d.groom.name} & ${d.bride.nick || d.bride.name}`;
    const text = `Kepada Yth. ${name},\n\nDengan hormat, kami mengundang Anda untuk hadir di ${who}.\nBuka undangan digital kami di:\n${link}\n\nTerima kasih.`;
    window.open("https://wa.me/?text=" + encodeURIComponent(text), "_blank", "noopener");
  });

  // ---------- pesan ----------
  const planSel = $("#plan");
  planSel.innerHTML = C.plans.map((p) => `<option value="${p.id}">${U.esc(p.name)} · ${p.price ? "Rp" + p.price.toLocaleString("id-ID") : "Gratis"}</option>`).join("");
  planSel.value = C.plans.some((p) => p.id === params.get("plan")) ? params.get("plan") : "plus";
  planSel.addEventListener("change", () => { $("#order").href = orderURL(); });
  function orderURL() {
    const d = readForm();
    const p = C.plans.find((x) => x.id === planSel.value);
    const who = d.type === "acara" ? d.host.title || "acara" : `${d.groom.nick || d.groom.name} & ${d.bride.nick || d.bride.name}`;
    const th = U.themeById(d.theme).name;
    const text = `Halo ur.memento, saya mau pesan paket ${p.name} (${p.price ? "Rp" + p.price.toLocaleString("id-ID") : "Gratis"}).\nUndangan: ${who}\nTemplate: ${th}\nLink pratinjau: ${shareURL(null)}`;
    return `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(text)}`;
  }

  // ---------- tab mobile ----------
  function tab(prev) {
    document.body.classList.toggle("show-prev", prev);
    $("#tab-form").classList.toggle("on", !prev); $("#tab-form").setAttribute("aria-selected", String(!prev));
    $("#tab-prev").classList.toggle("on", prev); $("#tab-prev").setAttribute("aria-selected", String(prev));
    if (prev) window.scrollTo({ top: 0 });
  }
  $("#tab-form").addEventListener("click", () => tab(false));
  $("#tab-prev").addEventListener("click", () => { tab(true); push(); });

  // ---------- reset & init ----------
  $("#reset").addEventListener("click", () => {
    if (!confirm("Kembalikan semua isian ke contoh?")) return;
    try { localStorage.removeItem(KEY); } catch (e) { /* abaikan */ }
    fillForm(Object.assign(JSON.parse(JSON.stringify(U.DEMO)), { theme: state.theme }));
    push();
  });

  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { saved = null; }
  let start = JSON.parse(JSON.stringify(U.DEMO));
  if (saved && saved.groom && saved.resepsi) start = Object.assign(start, saved);
  const want = params.get("t");
  if (want && U.THEMES.some((x) => x.id === want)) start.theme = want;
  fillForm(start);
  push();
})();
