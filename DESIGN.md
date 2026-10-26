# ur.memento — Design & Motion Spec

Master prompt (`prompt.template (1).md`) yang sudah diisi untuk ur.memento. Sumber kebenaran untuk `css/site.css`, `js/motion.js`, dan halaman marketing.

## 1. Project config
```txt
PROJECT_NAME        = "ur.memento"
PROJECT_TYPE        = "Product website + builder (undangan digital)"
PROJECT_DESCRIPTION = "Platform undangan digital Indonesia untuk pernikahan, aqiqah, khitan, dan syukuran.
                       Template adat, floral, minimalis, animasi, dan Islami dengan harga tertulis jelas."
PRIMARY_GOAL        = "Membuat pengunjung mencoba builder, lalu memesan paket berbayar."
TARGET_AUDIENCE     = "Calon pengantin & keluarga di Indonesia, 22-40 tahun, mobile-first, sensitif harga."
PRIMARY_CTA         = "Buat undangan gratis"
CORE_MESSAGE        = "Undangan digital yang jujur: harga jelas, bisa dicoba dulu, bayar setelah cocok."
```

## 2. Creative direction
```txt
VISUAL_STYLE      = "Editorial grotesk, kertas hangat + tinta, satu aksen kunyit. Tipografi sebagai komposisi utama."
VISUAL_REFERENCE  = "motion.ayprojex.com (Bricolage Grotesque, display raksasa tracking -0.045em,
                     paper/ink/accent tunggal, pin horizontal, tombol magnetik, line reveal),
                     21st.dev (variasi hero/pricing dengan sudut pandang, bukan template),
                     ui-ux-pro-max (checklist kontras/focus/touch/reduced-motion),
                     Taste Skill dials: DESIGN_VARIANCE 8 · MOTION_INTENSITY 6 · VISUAL_DENSITY 4."
MOOD              = "Hangat, percaya diri, jujur, sedikit playful. Premium tanpa pamer."
COLOR_DIRECTION   = "Paper #EFEBE3, ink #1A1713, aksen kunyit #E3A72F (hanya sebagai fill dengan teks ink)."
TYPOGRAPHY_STYLE  = "Bricolage Grotesque (display+body) + Instrument Serif italic untuk satu kata penekanan."
GRAPHIC_LANGUAGE  = "Garis tangan (coretan di bawah kata kunci), cap bulat berputar, marquee, numeral outline.
                     Cover template dibuat dari CSS/SVG. Tanpa gradient dekoratif, tanpa glassmorphism."
```
Prioritas jika konflik: kebutuhan proyek > referensi visual > arahan kreatif.

## 3. Tech stack
```txt
TECH_STACK        = "HTML/CSS/JS statis (tanpa build)"
ANIMATION_LIBRARY = "Motion (motion.dev) 14.6.0 via ESM CDN: animate, inView, scroll, stagger"
UI_LIBRARY        = "None"
```
Progressive enhancement: konten terlihat tanpa JS/CDN. State tersembunyi hanya aktif lewat `html.mo`, dan dicabut otomatis kalau Motion gagal dimuat.

## 4. Design tokens
```css
--paper: #EFEBE3;   --paper-2: #E6E1D6;  --raised: #F7F4EE;
--ink: #1A1713;     --muted: #5E594F;    --accent: #E3A72F;   --line: rgba(26,23,19,.16);
--font: "Bricolage Grotesque"; --serif: "Instrument Serif";
--step-small: clamp(.8125rem, .79rem + .1vw, .875rem);
--step-body: clamp(1.0625rem, 1rem + .25vw, 1.1875rem);
--step-lead: clamp(1.25rem, 1.1rem + .7vw, 1.625rem);
--step-head: clamp(2.25rem, 1.2rem + 4.2vw, 5rem);
--step-display: clamp(3.25rem, .8rem + 8.2vw, 8.5rem);
--gutter: clamp(20px, 5vw, 72px);   --max: 1320px;
--ease-out: cubic-bezier(.22,.61,.36,1);  --ease-expo: cubic-bezier(.16,1,.3,1);
```
Spasi: 4 8 12 16 24 32 48 64 96 128 160. Tombol pill, kartu radius kecil (8px) dengan garis tipis; tanpa bayangan besar.

## 5. Struktur halaman
01 Nav (sticky, border muncul saat scroll) · 02 Hero (H1 raksasa, demo undangan di ponsel, cap berputar) ·
03 Marquee jenis acara & gaya · 04 Tiga janji (baris editorial bernomor) · 05 Template (pin horizontal, 6 template) ·
06 Fitur (daftar bergaris) · 07 Cara kerja (numeral outline) · 08 Harga (hitung naik + tabel perbandingan) ·
09 Testimoni (hanya jika data asli ada) · 10 FAQ · 11 CTA akhir (inversi ink) · 12 Footer.

## 6. Motion
```txt
ANIMATION_STYLE = "Halus, fisik, tertahan. Elemen bergerak seperti kertas dan tinta, bukan efek."
INTENSITY       = "Medium-rendah"
```
| Momen | Perilaku | Durasi / easing |
|---|---|---|
| Hero load | Kata H1 naik dari mask, stagger 0.07s → sub → CTA → ponsel naik → coretan digambar | 0.9s / ease-expo |
| Reveal | Fade + naik 24px saat masuk viewport (sekali) | 0.8s / ease-expo |
| Scroll progress | Bar tipis di atas, scaleX | linear |
| Hero ponsel | Parallax ringan (-60px) | linear, scroll-linked |
| Template | Scroll vertikal menggeser track horizontal (pin), penghitung 01/06 | linear, scroll-linked |
| Harga | Angka hitung naik 0 → harga | 1.1s / ease-out |
| Tombol utama | Magnetik (spring) hanya pointer halus | spring 220/18 |
| Marquee, cap | CSS translate/rotate kontinu; jeda saat hover | 40s / 28s linear |

Hanya `transform` dan `opacity` yang dianimasikan. Mobile: tanpa pin (scroll-snap native), tanpa parallax.

## 7. Reduced motion
`prefers-reduced-motion: reduce` → tidak ada kelas `mo`, tidak ada JS animasi, marquee/cap berhenti, semua konten langsung terlihat.

## 8. Audit checklist (ui-ux-pro-max + Web Interface Guidelines)
Kontras teks ≥ 4.5:1 · focus-visible jelas · target sentuh ≥ 44px · cursor pointer di elemen interaktif ·
`<button>` untuk aksi, `<a>` untuk navigasi · gambar/iframe punya ukuran & judul · tanpa overflow horizontal di 375/768/1024/1440 ·
heading berurutan · `scroll-padding-top` untuk anchor · warna bukan satu-satunya penanda.
