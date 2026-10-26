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
- `js/config.js` → `whatsapp` (sekarang placeholder `6280000000000`; selama placeholder, formulir `bundel.html` sengaja dinonaktifkan), `instagram`, harga paket, isi tabel fitur, FAQ, `refundDays`.
- `js/config.js` → `testimonials`: isi dengan testimoni ASLI. Selama kosong, bagian testimoni disembunyikan otomatis.
- Kebijakan refund, harga, dan klaim "aktif selamanya" di copy adalah usulan; sesuaikan dengan kebijakan bisnis sebenarnya.

## Batasan prototipe
- Tidak ada backend. RSVP dikirim lewat WhatsApp (`wa.me`) ke nomor yang diisi tuan rumah di builder; tidak ada dasbor. Ucapan hanya tersimpan di `localStorage` perangkat tamu. Data undangan dibawa di URL hash, jadi link tidak bertanda tangan dan mengedit data berarti membuat link baru.
- Fitur yang belum diimplementasikan ditandai "Segera hadir" di halaman harga (flag `soon` di `js/config.js`): dua bahasa, live streaming, undangan privat dengan kode akses, QR check-in, buku tamu, layar sapa, atur meja. Hapus flag `soon` hanya setelah fiturnya benar-benar ada.
- Batas paket Coba (aktif 7 hari, watermark) dan batas foto/nama tamu belum ditegakkan otomatis.
- Foto galeri dan musik memakai link eksternal (belum ada unggah file).
- Pembayaran belum ada; pemesanan lewat pesan WhatsApp.

## Tema
Kencana (Adat Jawa), Pura Gading (Adat Bali), Mawar Senja (Floral), Putih Sunyi (Minimalis), Langit Malam (Animasi), Zamrud (Islami). Semua dibuat ulang dengan CSS/SVG orisinal, tanpa aset dari situs referensi. Tema baru: tambah objek di `THEMES` pada `js/themes.js`.
