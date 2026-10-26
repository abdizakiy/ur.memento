/* ur.memento · motion layer. Memakai Motion (motion.dev). Konten tetap terbaca tanpa file ini. */
const html = document.documentElement;
const MOTION_URL = "https://cdn.jsdelivr.net/npm/motion@14.6.0/+esm";
const EXPO = [0.16, 1, 0.3, 1];
const NAV_H = 72; // tinggi nav sticky (sinkron dengan .nav-in di site.css)
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

if (html.classList.contains("mo")) {
  import(MOTION_URL).then(init).catch((err) => {
    console.warn("Motion gagal dimuat, memakai tampilan statis.", err);
    html.classList.remove("mo");
    trackCounterNative();
  });
} else {
  initStaticOnly();
}

/* Pin horizontal tetap bernilai di gerak-dikurangi? Tidak: pakai scroll-snap native. Hanya penghitung. */
function initStaticOnly() { trackCounterNative(); }

function trackCounterNative() {
  const vp = $("#tpl-viewport"), idx = $("#tpl-i"), cards = $$(".card");
  if (!vp || !idx || !cards.length) return;
  const update = () => {
    const w = cards[0].getBoundingClientRect().width + 16;
    const i = Math.min(cards.length, Math.round(vp.scrollLeft / w) + 1);
    idx.textContent = String(i).padStart(2, "0");
  };
  vp.addEventListener("scroll", update, { passive: true });
}

function init({ animate, inView, scroll, stagger }) {
  window.__moReady = true;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- hero (saat load) ---------- */
  animate(".hero .wi", { y: ["105%", "0%"] }, { duration: 0.95, delay: stagger(0.07), ease: EXPO });
  animate(".hero [data-in]", { opacity: [0, 1], y: [22, 0] }, { duration: 0.85, delay: stagger(0.09, { startDelay: 0.5 }), ease: EXPO });
  animate("#phone-wrap", { opacity: [0, 1], y: [60, 0] }, { duration: 1.15, delay: 0.45, ease: EXPO });
  animate(".stamp", { opacity: [0, 1], scale: [0.6, 1] }, { delay: 1.25, type: "spring", stiffness: 180, damping: 16 });
  animate(".squig path", { strokeDashoffset: [1, 0] }, { duration: 1, delay: 1.0, ease: "easeOut" });

  /* ---------- reveal saat masuk viewport ---------- */
  inView(".rv", (el) => {
    animate(el, { opacity: [0, 1], y: [26, 0] }, { duration: 0.9, ease: EXPO });
  }, { amount: 0.15, margin: "0px 0px -6% 0px" });

  /* ---------- hitung naik harga ---------- */
  inView("#plans", () => {
    $$("[data-count]").forEach((el) => {
      const to = Number(el.dataset.count);
      animate(0, to, { duration: 1.2, ease: "easeOut", onUpdate: (v) => { el.textContent = Math.round(v).toLocaleString("id-ID"); } });
    });
  }, { amount: 0.3 });

  /* ---------- progres scroll ---------- */
  scroll(animate("#progress", { scaleX: [0, 1] }, { ease: "linear" }));

  /* ---------- parallax ponsel hero (hanya layar lebar) ---------- */
  const heroMQ = matchMedia("(min-width: 1021px)");
  let parallaxStop = null;
  const setParallax = () => {
    if (parallaxStop) { parallaxStop(); parallaxStop = null; $(".hero .phone").style.transform = ""; }
    if (!heroMQ.matches) return;
    parallaxStop = scroll(animate(".hero .phone", { y: [0, -70] }, { ease: "linear" }), { target: $(".hero"), offset: ["start start", "end start"] });
  };
  setParallax();
  heroMQ.addEventListener("change", setParallax);

  /* ---------- tombol magnetik ---------- */
  if (fine) {
    $$(".mag").forEach((btn) => {
      const lbl = $(".lbl", btn);
      const spring = { type: "spring", stiffness: 220, damping: 18 };
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        animate(btn, { x: dx * 0.22, y: dy * 0.3 }, spring);
        if (lbl) animate(lbl, { x: dx * 0.1, y: dy * 0.14 }, spring);
      });
      btn.addEventListener("pointerleave", () => {
        animate(btn, { x: 0, y: 0 }, spring);
        if (lbl) animate(lbl, { x: 0, y: 0 }, spring);
      });
    });
  }

  /* ---------- template: pin horizontal ---------- */
  const sec = $("#template"), pin = $("#tpl-pin"), sticky = $(".tpl-sticky"), vp = $("#tpl-viewport"), track = $("#tpl-track"), idx = $("#tpl-i");
  const cards = $$(".card", track);
  const wide = matchMedia("(min-width: 900px) and (min-height: 640px)");
  let stopPin = null, travel = 0;

  const pad = (n) => String(n).padStart(2, "0");
  const teardown = () => {
    if (stopPin) { stopPin(); stopPin = null; }
    sec.classList.remove("pinned");
    track.style.transform = "";
    pin.style.removeProperty("--pin-h");
    travel = 0;
  };
  const setupPin = () => {
    teardown();
    if (!wide.matches) return;
    sec.classList.add("pinned");
    const gutter = parseFloat(getComputedStyle(vp).paddingLeft) || 0;
    travel = Math.max(0, track.scrollWidth + gutter * 2 - innerWidth);
    pin.style.setProperty("--pin-h", `${innerHeight - NAV_H + travel}px`);
    // posisi dibaca langsung tiap frame agar tidak basi saat layout bergeser (font/gambar dimuat)
    let raf = 0;
    const paint = () => {
      raf = 0;
      const p = travel ? Math.min(1, Math.max(0, (NAV_H - pin.getBoundingClientRect().top) / travel)) : 0;
      track.style.transform = `translate3d(${(-travel * p).toFixed(1)}px,0,0)`;
      idx.textContent = pad(Math.min(cards.length, Math.floor(p * cards.length) + 1));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(paint); };
    addEventListener("scroll", onScroll, { passive: true });
    stopPin = () => { removeEventListener("scroll", onScroll); if (raf) cancelAnimationFrame(raf); };
    paint();
  };
  setupPin();
  document.fonts.ready.then(setupPin);
  addEventListener("load", setupPin);
  let rz;
  addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(setupPin, 180); });
  wide.addEventListener("change", setupPin);
  // fokus keyboard: gulir halaman agar kartu terlihat, jangan biarkan overflow tersembunyi bergeser
  track.addEventListener("focusin", (e) => {
    const card = e.target.closest(".card");
    if (!card || !sec.classList.contains("pinned") || !travel) return;
    const p = Math.min(1, Math.max(0, (card.offsetLeft - 24) / travel));
    const top = pin.getBoundingClientRect().top + scrollY - NAV_H;
    window.scrollTo({ top: top + p * travel, behavior: "auto" });
  });
  [sticky, vp].forEach((el) => el.addEventListener("scroll", () => { if (sec.classList.contains("pinned")) el.scrollLeft = 0; }));
  // layar sempit: penghitung mengikuti geser native
  vp.addEventListener("scroll", () => {
    if (sec.classList.contains("pinned")) return;
    const w = cards[0].getBoundingClientRect().width + 16;
    idx.textContent = pad(Math.min(cards.length, Math.round(vp.scrollLeft / w) + 1));
  }, { passive: true });
}
