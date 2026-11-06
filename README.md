# DeutschNest V2 — Fritzi's German Adventure 🦊🇩🇪

Aplikasi website belajar bahasa Jerman yang dibuat **khusus untuk pelajar berbahasa Indonesia dari nol**, gratis dan berdesain gamifikasi ceria. Tampilan terinspirasi oleh pola pembelajaran berbasis jalur dan penghargaan, tetapi seluruh branding, kode, dan maskot Fritzi adalah karya orisinal DeutschNest dan tidak berafiliasi dengan Duolingo.

## Yang baru pada V2

- **Redesain total:** tema hijau-cerah, kartu membulat, tombol tebal, maskot rubah orisinal bernama **Fritzi**.
- **Peta belajar gamified:** 4 unit (A1/A2/B1/B2), masing-masing delapan pelajaran, dengan simpul selesai/aktif/terkunci.
- **Kuis interaktif satu soal per langkah:** jawaban langsung diberi feedback, lalu layar hadiah XP jika lulus (minimal 3 dari 4).
- **Misi harian sederhana:** target 80 XP dengan jumlah XP harian; panel streak dan progres.
- **Tata letak mobile-first:** navigasi bawah khusus HP, sidebar untuk desktop, dukungan PWA.
- **Kompatibel dengan progres lama:** data versi 1 di localStorage tetap dibaca dan migrasi menambahkan statistik harian saat dibutuhkan. Backup JSON versi 1 juga tetap bisa diimpor.

## Fitur belajar

- 32 pengantar pelajaran A1–B2, lengkap dengan penjelasan tata bahasa, kosakata, contoh percakapan, latihan berbicara, dan kuis.
- Tombol 🔊 yang membacakan teks Jerman via `speechSynthesis` (bergantung pada browser dan paket suara perangkat).
- 🎙️ Latihan mikrofon `SpeechRecognition` jika didukung; mencocokkan hasil **transkripsi** dengan target, **bukan** memberi penilaian fonetik atau aksen yang valid secara ilmiah.
- Flashcard dengan penjadwalan pengulangan sederhana, XP, streak lokal, nama panggilan, kecepatan suara.
- Ekspor/impor progres JSON; pemasangan ke layar utama HP jika browser mendukung PWA.
- Service worker untuk cache aset halaman setelah pengunjung pertama kali membukanya secara online.

> Materi level B1/B2 adalah pengantar masing-masing tingkat, bukan jaminan kemampuan atau sertifikasi resmi CEFR. Website ini belum menyertakan tutor AI ChatGPT live.

## Jalankan

Cara paling praktis di komputer: ekstrak ZIP lalu buka `index.html`. Untuk fitur PWA yang lengkap, gunakan server lokal:

```bash
cd deutschnest
python -m http.server 8000
```

Kemudian buka `http://localhost:8000` di browser.

## Publikasikan melalui GitHub Pages (gratis)

1. Buat repository publik melalui <https://github.com/new> bernama `deutschnest`.
2. Ekstrak file ZIP ini; **unggah semua isi folder `deutschnest` ke direktori root repository**. Pastikan `index.html`, `app.js`, `style.css`, `lessons.js`, `mascot.svg`, ikon dan manifest berada pada posisi root.
3. Di GitHub, buka **Settings → Pages → Build and deployment → Deploy from a branch**.
4. Pilih branch `main`, folder `/ (root)`, lalu **Save**.
5. Jika pemilik repository `UrFavAppetizer` dan namanya `deutschnest`, URL yang akan digunakan setelah GitHub Pages aktif adalah: <https://urfavappetizer.github.io/deutschnest/>.

Jika kamu sudah mengunggah versi 1, kamu bisa mengganti file-file website pada repository yang sama dan menjaga data progres pada browser tersebut. Service worker versi 2 akan mengganti cache aset versi 1 pada kunjungan berikutnya setelah update terdeteksi.

## Dari HP

- Buka URL GitHub Pages di Chrome Android atau Safari iPhone.
- Gunakan menu **Tambahkan ke layar utama / Add to Home Screen** (jika tersedia).
- Izinkan akses mikrofon jika ingin memakai latihan bicara.

## Penyimpanan dan privasi

- Progres, XP, streak dan statistik harian disimpan **hanya di perangkat/browser saat ini** menggunakan `localStorage`. Tidak tersinkron ke GitHub atau perangkat lain.
- Untuk pindah HP/PC, gunakan **Profil → Ekspor progres**, lalu impor di perangkat lainnya. Jangan unggah file backup ke repository publik.
- Browser tertentu dapat mengirim rekaman ke layanan pihak ketiga saat memakai pengenalan suara. Fungsi microphone dapat memerlukan internet dan tidak tersedia di semua browser.
- Tidak memerlukan biaya hosting tambahan melalui GitHub Pages untuk pemakaian yang sesuai ketentuan layanan GitHub Pages.
- Jangan menyimpan kredensial/API key rahasia dalam file publik karena semua isi kode dapat dilihat pengunjung.

## File penting

```text
deutschnest/
├── index.html
├── style.css
├── lessons.js
├── app.js
├── mascot.svg                 # Maskot Fritzi
├── icon.svg
├── icon-192.png
├── icon-512.png
├── apple-touch-icon.png
├── manifest.webmanifest
├── sw.js
├── .nojekyll
└── README.md
```

**Dibuat khusus untuk perjalanan bahasa Jermanmu. Viel Spaß beim Lernen!**
