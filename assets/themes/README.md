# Aset gambar tema

Taruh aset berlisensi milik Anda di `assets/themes/<id-tema>/` (mis. `assets/themes/gadang/`), lalu daftarkan di objek `ASSETS` pada `js/art.js`:

```js
gadang: { bg: "bg.webp", border: "border.webp", corner: "corner.webp", scene: "scene.webp" },
```

Semua slot opsional. Bila salah satu dari `bg`, `border`, `corner`, `scene` diisi, ilustrasi SVG bawaan di cover dan hero diganti dengan lapisan gambar. Slot lama `top` dan `foot` mengganti SVG bawaan saja.

## Spesifikasi
| Slot | Isi | Ukuran saran | Format | Catatan |
|---|---|---|---|---|
| `bg` | latar penuh cover dan hero (cat air, tekstur kertas, kain) | 1080 x 2340 | WebP/JPG, di bawah 250 KB | ditutup `object-fit: cover`; sisakan area tengah yang tenang untuk teks |
| `border` | pita vertikal motif (songket, batik, ukiran) di tepi kiri | 271 x 2647 | WebP/PNG transparan | memakai 19% lebar layar, direntang setinggi layar |
| `corner` | rangkaian bunga/daun/ornamen di **sudut kiri atas** | 807 x 794 | WebP/PNG transparan | otomatis dicerminkan ke tiga sudut lain dan digoyang pelan; gambar harus mendukung dicerminkan (tanpa teks) |
| `scene` | ilustrasi dasar (rumah adat, gapura, siluet) lebar penuh | 1080 x 600 | WebP/PNG transparan | tinggi dibatasi 34% layar; letakkan objek menempel ke tepi bawah |

Semua gerak berhenti bila perangkat memakai *reduce motion*. GIF dan APNG boleh dipakai untuk `corner`, `scene`, atau `top`/`foot`, tetapi WebP animasi umumnya lebih kecil. Jaga total aset per tema di bawah sekitar 600 KB agar undangan cepat dibuka lewat data seluler.

## Palet per tema (agar aset serasi dengan warna teks dan tombol)
| Tema | id | Latar cover | Teks di cover | Aksen |
|---|---|---|---|---|
| Rumah Gadang | `gadang` | #7D1220 | #F5E2AE | emas #E9C46A |
| Jawa Pastel | `pastel` | #C5D1BE | #2F3A2D | mawar debu #A25D6E |
| Galungan | `galungan` | #1F3B2A | #F7E9A5 | kuning janur #F2C94C |
| Dayak Enggang | `dayak` | #1B1613 | #F3C94F | merah #D8453A |
| Songket Ungu | `songket` | #34174A | #F3DDA0 | emas #E5B94E |
| Washi Sakura | `sakura` | #1F2A44 | #F2EDE0 | vermilion #E0513F |

## Dari mana asetnya
Kekayaan visual template referensi berasal dari gambar lukis profesional. Sumber yang aman:
- **Ilustrator**: pesan paket aset per tema dengan lisensi komersial tertulis (termasuk hak memakai di produk yang dijual).
- **Pustaka aset berlisensi** (Envato Elements, Freepik Premium, Creative Market, dan sejenisnya): baca syarat lisensinya. Sebagian melarang aset dipakai di produk yang pada dasarnya menjual aset itu sendiri atau di "generator".
- **Generator gambar AI**: cek syarat komersial layanan yang dipakai dan simpan bukti pembuatannya. Hasil AI sering tidak bisa dihak-ciptakan.

**Jangan** menyalin aset dari template atau situs pesaing, termasuk dari preview publiknya.

## Contoh brief untuk ilustrator atau generator (ganti isi dalam kurung)
> Aset undangan pernikahan digital bertema [Adat Minangkabau]. Palet: [merah marun #7D1220, emas #E9C46A, krem]. Gaya: [lukisan cat air dengan foil emas]. Buat: (1) latar cat air [1080x2340] tanpa objek di tengah; (2) pita vertikal motif [songket] [271x2647] latar transparan; (3) rangkaian [bunga peony dan mawar dengan daun] untuk sudut kiri atas [807x794] latar transparan, tanpa teks, bisa dicerminkan; (4) ilustrasi [rumah gadang] berfoil emas [1080x600] latar transparan, objek menempel ke bawah. Tanpa watermark, hak pakai komersial.
