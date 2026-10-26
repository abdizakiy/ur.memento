# ur.memento

Situs undangan digital statis (HTML/CSS/JS, tanpa build). Buka lewat server lokal:

```bash
python3 -m http.server 5180 --directory urmemento
```

Lalu buka http://localhost:5180

## Desain & motion
Spesifikasi lengkap (master prompt yang sudah diisi, token, tabel motion, checklist audit) ada di [DESIGN.md](DESIGN.md).
- Referensi: motion.ayprojex.com (tipografi raksasa, paper/ink/aksen, pin horizontal, tombol magnetik), 21st.dev, ui-ux-pro-max, Vercel Web Interface Guidelines.
- Motion library: [Motion](https://motion.dev) 14.6.0 via ESM CDN (`js/motion.js`). Jika CDN gagal atau pengguna memilih reduced motion, halaman tampil statis dan lengkap.
- Identitas visual mengikuti akun Instagram @ur.memento: palet lemon `#ECEF88`, cokelat zaitun `#3A3010`, putih hangat `#FFFEF5`, emas `#A68620`; font Lora (judul, padanan terdekat wordmark serif tebal), DM Sans (body), Dancing Script (script, cocok dengan tulisan "Photography"). Wordmark logo asli ada di `assets/wordmark.png` (PNG transparan, dipakai sebagai CSS mask supaya bisa berwarna ink atau putih); tulisan "e-Invitation" di bawahnya adalah teks Dancing Script.

## Halaman
| File | Fungsi |
|---|---|
| `index.html` | Landing: hero dengan demo hidup, template, fitur, harga + tabel perbandingan, FAQ |
| `buat.html` | Builder: pilih template, isi data, pratinjau langsung, link per tamu, pesan via WhatsApp |
| `undangan.html` | Renderer undangan (`?demo=kencana\|gading\|mawar\|putih\|malam\|zamrud\|acara`, atau `#d=<data>`, `?to=Nama Tamu`) |
| `bundel.html` | Untuk klien foto: formulir yang membuat pesan WhatsApp ke admin (harga gabungan). Mendukung `?ref=kode` dan `?t=idtema` |

## Analytics (opsional, tanpa cookie)
`js/analytics.js` tidak memuat apa pun sampai `analytics.provider` di `js/config.js` diisi (`goatcounter`, `plausible`, atau `umami`). Hanya dipasang di halaman pemasaran, builder, dan bundel; halaman undangan untuk tamu tidak dilacak. Mematuhi Do Not Track. Event ditandai dengan atribut `data-track="nama"` (props lewat `data-track-*`) atau `URMEMENTO_TRACK(nama, props)`. Cek tanpa provider: tambahkan `?debug=1` dan lihat console. Jangan kirim nama, nomor, atau isi formulir sebagai props.

## Yang perlu Anda ubah sebelum rilis
- `js/config.js` → `whatsapp` (formulir `bundel.html` dinonaktifkan otomatis bila nomor kosong atau placeholder), `instagram`, harga paket, isi tabel fitur, FAQ, `refundDays`.
- `js/config.js` → `testimonials`: isi dengan testimoni ASLI. Selama kosong, bagian testimoni disembunyikan otomatis.
- Kebijakan refund, harga, dan klaim "aktif selamanya" di copy adalah usulan; sesuaikan dengan kebijakan bisnis sebenarnya.

## Batasan prototipe
- Tidak ada backend. RSVP dikirim lewat WhatsApp (`wa.me`) ke nomor yang diisi tuan rumah di builder; tidak ada dasbor. Ucapan hanya tersimpan di `localStorage` perangkat tamu. Data undangan dibawa di URL hash, jadi link tidak bertanda tangan dan mengedit data berarti membuat link baru.
- Fitur yang belum diimplementasikan ditandai "Segera hadir" di halaman harga (flag `soon` di `js/config.js`): dua bahasa, live streaming, undangan privat dengan kode akses, QR check-in, buku tamu, layar sapa, atur meja. Hapus flag `soon` hanya setelah fiturnya benar-benar ada.
- Batas paket Coba (aktif 7 hari, watermark) dan batas foto/nama tamu belum ditegakkan otomatis.
- Foto galeri dan musik memakai link eksternal (belum ada unggah file).
- Pembayaran belum ada; pemesanan lewat pesan WhatsApp.

## Ilustrasi dan animasi tema
`js/art.js` menggambar ilustrasi SVG orisinal per tema (hanya 6 tema budaya baru yang sudah punya): `top` (cover, hero, kartu template), `foot` (pita bawah cover dan hero), dan `divider` (pembatas bagian). Warnanya mengikuti variabel tema dan geraknya dari `css/art.css` (goyang, mengambang, berkedip, berputar, plus efek melayang `fx`: petals, sparkle, leaves, stars). Semua gerak berhenti bila perangkat memakai *reduce motion*.
Lapisan aset gambar (cara template referensi dibuat): per tema bisa dipasang `bg` (latar), `border` (pita samping), `corner` (bunga sudut, dicerminkan dan digoyang) dan `scene` (ilustrasi dasar) lewat objek `ASSETS` di `js/art.js`. Spesifikasi ukuran, palet per tema, sumber aset yang aman, dan contoh brief ada di [assets/themes/README.md](assets/themes/README.md). Tanpa aset, cover memakai ilustrasi SVG bawaan dan latar cat air prosedural (`.wash`).
Slot lama untuk satu gambar (PNG, GIF, WebP, atau SVG): taruh file di `assets/themes/<id-tema>/` lalu daftarkan di objek `ASSETS` pada `js/art.js`, mis. `gadang: { top: "top.gif", foot: "foot.png" }`. File itu menggantikan ilustrasi bawaan untuk slot tersebut. Pastikan Anda berhak memakai aset itu; jangan menyalin gambar dari situs lain.

## Tema
Batch 1 (6 dasar): Kencana (Adat Jawa), Pura Gading (Adat Bali), Mawar Senja (Floral), Putih Sunyi (Minimalis), Langit Malam (Animasi), Zamrud (Islami).
Batch 2 (adat dan budaya): Rumah Gadang (Minang, pola pucuk rebung), Jawa Pastel (parang), Galungan (Bali, poleng), Dayak Enggang (spiral Dayak), Songket Ungu (Melayu), Washi Sakura (Jepang, seigaiha).
Semua dibuat ulang dengan CSS/SVG orisinal dari motif budaya umum, tanpa aset dari situs referensi. Tema baru: tambah objek di `THEMES` pada `js/themes.js` (palet `v`, font, `pattern`, `frame`, `fx`); pola SVG baru ditambah di `patternURL`. Cek kontras: teks aksen di atas `bg` dan putih di atas `accent` minimal 4,5:1.
