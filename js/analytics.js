/* Analytics ringan tanpa cookie. Tidak memuat apa pun sampai `analytics.provider` di config.js diisi.
   Dipasang hanya di halaman pemasaran, builder, dan bundel; halaman undangan untuk tamu TIDAK dilacak.
   Pakai: <button data-track="nama_event" data-track-plan="plus">  atau  window.URMEMENTO_TRACK("nama_event", { plan: "plus" }). */
(function () {
  const A = (window.URMEMENTO_CONFIG && window.URMEMENTO_CONFIG.analytics) || {};
  const dnt = navigator.doNotTrack === "1" || window.doNotTrack === "1";
  const debug = () => { try { return localStorage.getItem("urmemento:debug") === "1" || /[?&]debug=1/.test(location.search); } catch (e) { return false; } };
  const SAFE = { domain: /^[a-z0-9.-]{3,80}$/i, site: /^[a-z0-9-]{2,60}$/i, id: /^[0-9a-f-]{36}$/i };

  const PROVIDERS = {
    plausible: {
      ok: () => SAFE.domain.test(A.domain || ""),
      src: () => "https://plausible.io/js/script.js",
      attrs: () => ({ "data-domain": A.domain }),
      pre: () => { window.plausible = window.plausible || function () { (window.plausible.q = window.plausible.q || []).push(arguments); }; },
      send: (n, p) => window.plausible(n, { props: p })
    },
    umami: {
      ok: () => SAFE.id.test(A.id || ""),
      src: () => "https://cloud.umami.is/script.js",
      attrs: () => ({ "data-website-id": A.id }),
      send: (n, p) => window.umami && window.umami.track(n, p)
    },
    goatcounter: {
      ok: () => SAFE.site.test(A.site || ""),
      src: () => "https://gc.zgo.at/count.js",
      attrs: () => ({ "data-goatcounter": `https://${A.site}.goatcounter.com/count` }),
      send: (n, p) => window.goatcounter && window.goatcounter.count && window.goatcounter.count({ path: "event/" + n, title: n + (p && Object.keys(p).length ? " " + JSON.stringify(p) : ""), event: true })
    }
  };

  const prov = !dnt && PROVIDERS[A.provider] && PROVIDERS[A.provider].ok() ? PROVIDERS[A.provider] : null;
  let loaded = !prov || !!prov.pre, queue = [];

  if (prov) {
    if (prov.pre) prov.pre();
    const s = document.createElement("script");
    s.defer = true; s.src = prov.src();
    const attrs = prov.attrs();
    Object.keys(attrs).forEach((k) => s.setAttribute(k, attrs[k]));
    s.onload = () => { loaded = true; queue.splice(0).forEach((q) => prov.send(q[0], q[1])); };
    document.head.appendChild(s);
    document.addEventListener("DOMContentLoaded", () => {
      const note = document.getElementById("stat-note");
      if (note) { note.hidden = false; note.textContent = "Statistik kunjungan tanpa cookie. Halaman undangan untuk tamu tidak dilacak."; }
    });
  }

  function track(name, props) {
    const p = {};
    Object.keys(props || {}).forEach((k) => { if (props[k] != null && props[k] !== "") p[k] = String(props[k]).slice(0, 60); });
    if (debug()) console.info("[track]", name, p, prov ? "(dikirim)" : "(tidak dikirim: provider kosong atau DNT)");
    if (!prov) return;
    if (loaded) prov.send(name, p); else queue.push([name, p]);
  }

  document.addEventListener("click", (e) => {
    const t = e.target.closest && e.target.closest("[data-track]");
    if (!t) return;
    const props = {};
    Object.keys(t.dataset).forEach((k) => {
      if (k.length > 5 && k.indexOf("track") === 0) props[k.charAt(5).toLowerCase() + k.slice(6)] = t.dataset[k];
    });
    track(t.dataset.track, props);
  });

  window.URMEMENTO_TRACK = track;
})();
