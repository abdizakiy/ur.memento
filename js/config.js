/* Konfigurasi ur.memento - ubah di sini, halaman harga & tabel perbandingan ikut berubah. */
window.URMEMENTO_CONFIG = {
  brand: "ur.memento",
  // Nomor WhatsApp admin (format internasional tanpa +, mis. 6281234567890)
  whatsapp: "6287784532572",
  instagram: "https://instagram.com/ur.memento",
  refundDays: 7,

  // Statistik tanpa cookie. Kosong = tidak ada skrip pihak ketiga yang dimuat. Isi salah satu:
  //   { provider: "goatcounter", site: "kodeanda" }            -> https://kodeanda.goatcounter.com
  //   { provider: "plausible",   domain: "abdizakiy.github.io" }
  //   { provider: "umami",       id: "uuid-website-dari-umami" }
  // Uji tanpa provider: buka halaman dengan ?debug=1 dan lihat event di console.
  analytics: { provider: "" },

  plans: [
    {
      id: "coba", name: "Coba", price: 0, note: "Untuk melihat hasilnya dulu",
      cta: "Mulai gratis", highlight: false,
      bullets: ["Semua template dasar", "Aktif 7 hari", "Ada watermark ur.memento"]
    },
    {
      id: "esensial", name: "Esensial", price: 59000, note: "Cukup untuk undangan sederhana",
      cta: "Pilih Esensial", highlight: false,
      bullets: ["Aktif selamanya", "Nama tamu tak terbatas", "RSVP via WhatsApp, peta, musik"]
    },
    {
      id: "plus", name: "Plus", price: 99000, note: "Paling banyak cocok untuk pernikahan",
      cta: "Pilih Plus", highlight: true,
      bullets: ["Semua di Esensial", "Galeri 20 foto + cerita cinta", "Amplop digital", { t: "2 bahasa", soon: true }, { t: "Live streaming", soon: true }]
    },
    {
      id: "eksklusif", name: "Eksklusif", price: 169000, note: "Acara besar & butuh check-in tamu",
      cta: "Pilih Eksklusif", highlight: false,
      bullets: ["Semua di Plus", { t: "QR check-in & buku tamu", soon: true }, { t: "Undangan privat", soon: true }, { t: "Atur meja", soon: true }]
    }
  ],

  // Baris tabel perbandingan. values = urutan paket di atas. true/false/teks.
  features: [
    { group: "Dasar", rows: [
      { label: "Masa aktif",                 values: ["7 hari", "Selamanya", "Selamanya", "Selamanya"] },
      { label: "Tanpa watermark ur.memento",     values: [false, true, true, true] },
      { label: "Template dasar (Adat, Floral, Minimalis, Islami)", values: [true, true, true, true] },
      { label: "Template premium animasi",   values: [false, false, true, true] },
      { label: "Edit data (menghasilkan link baru)", values: [true, true, true, true] },
      { label: "Biaya admin pembayaran",     values: ["-", "Tidak ada", "Tidak ada", "Tidak ada"] }
    ]},
    { group: "Isi undangan", rows: [
      { label: "Nama tamu personal",         values: ["5 nama", "Tak terbatas", "Tak terbatas", "Tak terbatas"] },
      { label: "Foto galeri",                values: ["3 foto", "6 foto", "20 foto", "30 foto"] },
      { label: "RSVP lewat WhatsApp tuan rumah", values: [true, true, true, true] },
      { label: "Peta & simpan ke kalender",  values: [true, true, true, true] },
      { label: "Musik latar",                values: [true, true, true, true] },
      { label: "Cerita cinta",               values: [false, false, true, true] },
      { label: "Dua bahasa",                 values: [false, false, true, true], soon: true },
      { label: "Amplop digital (rekening/e-wallet)", values: [false, false, true, true] },
      { label: "Link live streaming",        values: [false, false, true, true], soon: true }
    ]},
    { group: "Hari-H & privasi", rows: [
      { label: "Undangan privat (kode akses)", values: [false, false, false, true], soon: true },
      { label: "QR check-in & buku tamu digital", values: [false, false, false, true], soon: true },
      { label: "Layar sapa tamu",            values: [false, false, false, true], soon: true },
      { label: "Atur meja & denah",          values: [false, false, false, true], soon: true }
    ]},
    { group: "Bantuan", rows: [
      { label: "Dukungan",                   values: ["Panduan", "WhatsApp", "WhatsApp", "WhatsApp prioritas"] },
      { label: "Dibuatkan tim (1x konsultasi)", values: [false, false, false, true] }
    ]}
  ],

  faq: [
    { q: "Apakah benar tidak ada harga coret atau biaya tersembunyi?",
      a: "Benar. Harga yang tertulis adalah harga yang Anda bayar. Kami tidak memasang harga coret palsu, dan tidak ada biaya admin pembayaran." },
    { q: "Apa bedanya paket Coba dengan yang berbayar?",
      a: "Paket Coba dirancang untuk melihat hasilnya dulu: semua template dasar, aktif 7 hari, ada watermark ur.memento, dan batas foto/nama tamu lebih kecil. Paket berbayar aktif selamanya tanpa watermark. Catatan jujur: batas masa aktif dan watermark paket Coba belum diberlakukan otomatis di versi prototipe ini." },
    { q: "Bagaimana jika saya tidak cocok setelah membayar?",
      a: "Anda bisa meminta pengembalian dana penuh dalam {refundDays} hari sejak pembayaran, selama undangan belum dibagikan ke tamu." },
    { q: "Apakah saya perlu mendaftar untuk mencoba?",
      a: "Tidak. Buka halaman Buat, pilih template, isi data, dan lihat hasilnya langsung. Link undangan dapat disalin dan dibagikan." },
    { q: "Bisakah satu undangan punya link berbeda untuk tiap tamu?",
      a: "Bisa. Tempel daftar nama tamu, lalu ur.memento membuat link personal (dengan nama tamu di cover) yang siap dikirim lewat WhatsApp." },
    { q: "Apakah undangan bisa untuk acara selain pernikahan?",
      a: "Bisa. Tersedia mode Aqiqah, Khitan, Ulang tahun, dan Syukuran dengan tampilan tuan rumah tunggal." },
    { q: "Bagaimana RSVP sampai ke saya?",
      a: "Isi nomor WhatsApp Anda di builder. Saat tamu menekan Kirim, WhatsApp terbuka dengan pesan konfirmasi (nama, hadir atau tidak, jumlah tamu, ucapan) yang siap dikirim ke nomor Anda. RSVP baru tercatat setelah tamu menekan kirim di WhatsApp. Belum ada dasbor atau dinding ucapan bersama; ucapan yang ditulis tamu hanya tampil di perangkatnya sendiri." },
    { q: "Fitur bertanda “Segera hadir” itu apa?",
      a: "Fitur yang sudah kami rencanakan tetapi belum bisa dipakai hari ini: dua bahasa, live streaming, undangan dengan kode akses, QR check-in, buku tamu, layar sapa, dan atur meja. Pilihlah paket berdasarkan fitur yang sudah bertanda ✓." },
    { q: "Bisakah undangan digabung dengan paket foto?",
      a: "Bisa. ur.memento juga menerima jasa foto (prewedding, wedding, wisuda), dan undangan dapat dipesan bersama. Tanyakan lewat WhatsApp untuk paket dan harga gabungan; harga akan ditulis jelas sebelum Anda setuju." }
  ],

  // Isi dengan testimoni ASLI saja. Jika kosong, bagian testimoni disembunyikan otomatis.
  // contoh: { name: "Nama", detail: "Menikah Maret 2027", text: "…" }
  testimonials: []
};
