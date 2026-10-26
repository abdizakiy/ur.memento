/* Form bundel klien foto: membuat pesan WhatsApp ke admin. Tidak ada data yang disimpan. */
(function () {
  const C = window.URMEMENTO_CONFIG, U = window.URMEMENTO;
  const $ = (s) => document.querySelector(s);
  const T = (n, p) => window.URMEMENTO_TRACK && window.URMEMENTO_TRACK(n, p);
  const params = new URLSearchParams(location.search);
  const ref = (params.get("ref") || "").toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 32);

  const burger = $("#burger"), links = $("#links");
  const setMenu = (open) => { links.classList.toggle("open", open); burger.setAttribute("aria-expanded", String(open)); burger.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu"); };
  burger.addEventListener("click", () => setMenu(!links.classList.contains("open")));
  links.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });

  $("#yr").textContent = new Date().getFullYear();
  document.querySelectorAll("[data-wa]").forEach((a) => { a.href = "https://wa.me/" + C.whatsapp; a.target = "_blank"; a.rel = "noopener"; });
  document.querySelectorAll("[data-ig]").forEach((a) => { a.href = C.instagram; a.target = "_blank"; a.rel = "noopener"; });

  $("#b-theme").innerHTML = '<option value="">Belum tahu</option>' + U.THEMES.map((t) => `<option value="${U.esc(t.name)}">${U.esc(t.name)}</option>`).join("");
  const tp = params.get("t");
  if (tp && U.THEMES.some((t) => t.id === tp)) $("#b-theme").value = U.themeById(tp).name;

  const placeholder = !C.whatsapp || /^(62)?8?0{6,}$/.test(String(C.whatsapp));
  if (placeholder) {
    $("#b-note").textContent = "Pemesanan belum aktif: nomor WhatsApp admin belum diisi di js/config.js.";
    $("#bform button[type=submit]").disabled = true;
  }

  $("#bform").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target, v = (n) => String(f.elements[n].value || "").trim();
    if (!v("name")) { f.elements.name.focus(); return; }
    const lines = [
      "Halo ur.memento, saya klien foto dan ingin bertanya harga gabungan undangan digital.",
      `Nama: ${v("name")}`,
      `Acara: ${v("kind")}` + (v("date") ? `, ${v("date")}` : "") + (v("guests") ? `, perkiraan ${v("guests")} tamu` : ""),
      v("photo") && `Paket foto: ${v("photo")}`,
      v("theme") && `Template favorit: ${v("theme")}`,
      v("note") && `Catatan: ${v("note")}`,
      ref && `Kode referensi: ${ref}`
    ].filter(Boolean);
    const url = "https://wa.me/" + C.whatsapp + "?text=" + encodeURIComponent(lines.join("\n"));
    T("bundle_wa_click", { ref, kind: v("kind"), theme: v("theme") });
    const w = window.open(url, "_blank", "noopener");
    const fb = $("#b-fallback");
    if (!w) { fb.hidden = false; fb.innerHTML = `Pop-up diblokir. <a href="${U.esc(url)}" target="_blank" rel="noopener">Buka WhatsApp untuk mengirim pesan</a>.`; }
    else fb.hidden = true;
  });
})();
