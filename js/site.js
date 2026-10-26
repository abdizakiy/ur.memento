/* Render konten dari config (tanpa animasi). Animasi ada di motion.js. */
(function () {
  const C = window.URMEMENTO_CONFIG, U = window.URMEMENTO;
  const { esc } = U;
  const $ = (s, r = document) => r.querySelector(s);
  const idr = (n) => n.toLocaleString("id-ID");

  const wa = (text) => `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(text || "Halo ur.memento, saya mau tanya soal undangan digital.")}`;
  document.querySelectorAll("[data-wa]").forEach((a) => { a.href = wa(); a.target = "_blank"; a.rel = "noopener"; });
  document.querySelectorAll("[data-ig]").forEach((a) => { a.href = C.instagram; a.target = "_blank"; a.rel = "noopener"; });
  const refund = $("[data-refund]");
  if (refund) refund.textContent = `Refund ${C.refundDays} hari, tertulis`;
  $("#yr").textContent = new Date().getFullYear();

  // menu mobile
  const burger = $("#burger"), links = $("#links");
  const setMenu = (open) => { links.classList.toggle("open", open); burger.setAttribute("aria-expanded", String(open)); burger.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu"); };
  burger.addEventListener("click", () => setMenu(!links.classList.contains("open")));
  links.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  const nav = $("#nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  // marquee (dua baris identik agar loop -50% mulus)
  const star = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1l2.6 8.4L23 12l-8.4 2.6L12 23l-2.6-8.4L1 12l8.4-2.6z" fill="currentColor"/></svg>';
  const words = ["Pernikahan", "Aqiqah", "Khitan", "Syukuran", "Ulang tahun", "Adat Jawa", "Adat Bali", "Floral", "Minimalis", "Islami"];
  const row = `<div class="marquee-row">${words.map((w) => `<span>${esc(w)}</span>${star}`).join("")}</div>`;
  $("#marquee").innerHTML = row + row;

  // jeda animasi dekoratif (WCAG 2.2.2): marquee, cap berputar, bintang
  const pauseBtn = $("#pause");
  pauseBtn.addEventListener("click", () => {
    const on = document.documentElement.classList.toggle("paused");
    pauseBtn.setAttribute("aria-pressed", String(on));
    pauseBtn.firstElementChild.textContent = on ? "▶" : "II";
    pauseBtn.setAttribute("aria-label", on ? "Putar animasi dekoratif" : "Jeda animasi dekoratif");
  });

  // kartu template
  const names = { kencana: ["Raka", "Anisa"], gading: ["Wayan", "Ayu"], mawar: ["Dimas", "Salsa"], putih: ["Arya", "Nadia"], malam: ["Bima", "Laras"], zamrud: ["Fikri", "Aisyah"] };
  $("#tpl-track").innerHTML = U.THEMES.map((t, i) => {
    const n = names[t.id] || ["Raka", "Anisa"];
    return `<article class="card" data-i="${i}">
      <a class="card-art" href="undangan.html?demo=${t.id}" target="_blank" rel="noopener" aria-label="Lihat demo ${esc(t.name)} (tab baru)">${U.miniCover(t, n[0], n[1])}</a>
      <div class="card-meta"><h3>${esc(t.name)}</h3><span class="tag ${t.premium ? "tag-pro" : ""}">${t.premium ? "Premium · " : ""}${esc(t.tag)}</span></div>
      <p>${esc(t.desc)}</p>
      <div class="card-actions">
        <a class="btn btn-sm btn-ghost" href="undangan.html?demo=${t.id}" target="_blank" rel="noopener"><span class="lbl">Lihat demo</span></a>
        <a class="btn btn-sm" href="buat.html?t=${t.id}"><span class="lbl">Pakai tema ini</span></a>
      </div></article>`;
  }).join("");

  // harga
  $("#plans").innerHTML = C.plans.map((p) => `
    <article class="plan ${p.highlight ? "plan-hl" : ""}">
      ${p.highlight ? '<span class="plan-badge">Paling sering dipilih</span>' : ""}
      <h3>${esc(p.name)}</h3>
      <p class="plan-note">${esc(p.note)}</p>
      <p class="plan-price" aria-label="${p.price ? "Rp" + idr(p.price) : "Gratis"}">${p.price === 0 ? "Gratis" : `<span class="rp">Rp</span><span data-count="${p.price}">${idr(p.price)}</span>`}</p>
      <span class="plan-unit">${p.price ? "sekali bayar" : "&nbsp;"}</span>
      <ul>${p.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
      <a class="btn btn-block" href="buat.html?plan=${p.id}"><span class="lbl">${esc(p.cta)}</span></a>
    </article>`).join("");

  const cell = (v) => v === true ? '<span class="y" aria-label="Termasuk">✓</span>' : v === false ? '<span class="n" aria-label="Tidak termasuk">—</span>' : `<span class="t">${esc(v)}</span>`;
  let tbl = `<thead><tr><th scope="col">Fitur</th>${C.plans.map((p) => `<th scope="col" class="${p.highlight ? "hl" : ""}">${esc(p.name)}<small>${p.price ? "Rp" + idr(p.price) : "Gratis"}</small></th>`).join("")}</tr></thead><tbody>`;
  C.features.forEach((g) => {
    tbl += `<tr class="grp"><th colspan="${C.plans.length + 1}" scope="colgroup">${esc(g.group)}</th></tr>`;
    g.rows.forEach((r) => {
      tbl += `<tr><th scope="row">${esc(r.label)}</th>${r.values.map((v, i) => `<td class="${C.plans[i].highlight ? "hl" : ""}">${cell(v)}</td>`).join("")}</tr>`;
    });
  });
  $("#cmp").innerHTML = tbl + "</tbody>";

  if (C.testimonials && C.testimonials.length) {
    $("#testi").hidden = false;
    $("#testi-grid").innerHTML = C.testimonials.map((t) => `<figure class="testi rv"><blockquote>${esc(t.text)}</blockquote><figcaption><b>${esc(t.name)}</b><span>${esc(t.detail || "")}</span></figcaption></figure>`).join("");
  }

  $("#faq-list").innerHTML = C.faq.map((f) => `<details class="rv"><summary>${esc(f.q)}</summary><p>${esc(f.a.replace("{refundDays}", C.refundDays))}</p></details>`).join("");
})();
