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
- Font: Bricolage Grotesque + Instrument Serif (Google Fonts).

## Halaman
| File | Fungsi |
|---|---|
| `index.html` | Landing: hero dengan demo hidup, template, fitur, harga + tabel perbandingan, FAQ |
| `buat.html` | Builder: pilih template, isi data, pratinjau langsung, link per tamu, pesan via WhatsApp |
| `undangan.html` | Renderer undangan (`?demo=kencana\|gading\|mawar\|putih\|malam\|zamrud\|acara`, atau `#d=<data>`, `?to=Nama Tamu`) |

## Yang perlu Anda ubah sebelum rilis
- `js/config.js` → `whatsapp` (sekarang placeholder `6280000000000`), `instagram`, harga paket, isi tabel fitur, FAQ, `refundDays`.
- `js/config.js` → `testimonials`: isi dengan testimoni ASLI. Selama kosong, bagian testimoni disembunyikan otomatis.
- Kebijakan refund, harga, dan klaim "aktif selamanya" di copy adalah usulan; sesuaikan dengan kebijakan bisnis sebenarnya.

## Batasan prototipe
- Tidak ada backend: RSVP/ucapan hanya tersimpan di `localStorage` perangkat pengunjung; data undangan dibawa di URL hash.
- Fitur paket Eksklusif (QR check-in, buku tamu, atur meja, undangan privat dengan kode akses) tampil di halaman harga tetapi belum diimplementasikan di renderer.
- Foto galeri dan musik memakai link eksternal (belum ada unggah file).
- Pembayaran belum ada; pemesanan lewat pesan WhatsApp.

## Tema
Kencana (Adat Jawa), Pura Gading (Adat Bali), Mawar Senja (Floral), Putih Sunyi (Minimalis), Langit Malam (Animasi), Zamrud (Islami). Semua dibuat ulang dengan CSS/SVG orisinal, tanpa aset dari situs referensi. Tema baru: tambah objek di `THEMES` pada `js/themes.js`.
