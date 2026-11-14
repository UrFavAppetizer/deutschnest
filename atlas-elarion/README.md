# Atlas Resmi Elarion ✦ — Illustrated Atlas V4

**The Stars Beyond Eternity — Interactive Canon Atlas**

Website atlas interaktif fantasy, berbasis HTML/CSS/JavaScript murni tanpa biaya API, framework, atau server. Direktori ini terpisah dari aplikasi DeutschNest dan tidak mengubah data pembelajarannya.

## Menjalankan
Buka `index.html` dengan browser modern. Untuk hosting, GitHub Pages harus diaktifkan pada repository pada **Settings → Pages → Deploy from a branch → main / (root)**. Jika Pages sudah menggunakan `main`, halaman berada di:

https://urfavappetizer.github.io/deutschnest/atlas-elarion/

**Catatan:** URL di atas adalah format alamat yang diperkirakan berdasarkan nama repositori; status deploy belum dapat diverifikasi melalui alat.

## Update V4 — Peta Ibu Kota dan Kawasan Perdagangan Timur (14 November 2026)

Peta Ibu Kota Asteria dan Kawasan Perdagangan Timur sekarang menggunakan ilustrasi yang disediakan pemain, bukan gambar polygon sebagai lapisan visual utama. Kode photo-atlas.js mengikat gambar ke mode peta kota dan menyediakan penanda interaktif yang menjelaskan landmark.

File berikut harus ada dalam direktori atlas-elarion/assets/:
- capital-illustrated.webp (Ibu Kota Kerajaan Asteria, 1448 × 1086)
- trade-illustrated.webp (Kawasan Perdagangan Timur, 1536 × 1024)

Penting: konektor GitHub pada sesi ini tidak mendukung upload gambar binary dari runtime. Perubahan kode telah di-commit, tetapi kedua gambar WEBP perlu diunggah langsung ke GitHub agar bisa dilihat publik. Sampai file diunggah, viewer tetap memakai SVG lama; pengguna juga dapat mengimpor gambar melalui tombol Pilih gambar untuk satu perangkat.

Penanda atas ilustrasi yang belum tercantum dalam canon utama hanya berupa catatan peta, bukan perubahan otomatis pada canon. Angka populasi, ukuran, dan detail riwayat pada poster belum tentu lebih kuat daripada jurnal canon. Nama ibu kota Kerajaan Asteria masih belum ditetapkan.

## Pembaruan V3 — peta dengan ilustrasi 3D/isometrik

Sistem peta baru (`photo-atlas.js` + `photo-atlas.css`) memakai ilustrasi berkualitas tinggi, bukan hanya bentuk SVG sederhana. Ada hotspot interaktif yang membuka kerajaan, kota atau landmark dengan data canon yang sama. Mode foto mengikuti zoom, dan bisa beralih ke peta vektor.

**Status publikasi aset:** Kode sudah diperbarui pada branch `main`. Dua gambar WebP dalam paket distribusi belum dapat ditambahkan lewat konektor GitHub ini, karena tindakan yang tersedia untuk menulis file pada repository hanya menerima teks. Untuk menampilkan ilustrasi bagi semua pengunjung, buka `atlas-elarion/assets/`, lalu pilih **Add file → Upload files** dan unggah:
- `asteria-illustrated.webp`
- `avelorn-illustrated.webp`

Tanpa langkah tersebut, website tetap berfungsi memakai peta SVG. Sebagai alternatif langsung di satu perangkat, klik **Pilih gambar** pada toolbar peta lalu pilih file WebP sesuai wilayah; gambar disimpan di IndexedDB lokal dan bukan diunggah secara otomatis.

Ilustrasi ini tampak 3D/isometrik, tetapi **bukan** dunia 3D nyata yang kameranya bisa diputar. Itu memerlukan engine/WebGL tersendiri.

## Pembaruan V2 — 14 November 2026
- Peta SVG bergambar dengan permukiman, rumah-rumah medieval, benteng, gerbang, kapal, hutan dan pegunungan.
- Peta Avelorn memiliki ilustrasi khusus untuk Guild, Starhaven, rumah penduduk, menara Arcana, pasar, penginapan, dan bengkel.
- Kawasan Perdagangan Timur memiliki ilustrasi Duskcrown, Emberforge, bengkel Eamon dan gudang.
- Ibu kota memiliki tampilan arsitektur konseptual: hanya visualisasi, bukan peta bangunan canon.
- Tombol lapisan 'Bangunan & detail ilustrasi' mematikan atau menghidupkan ilustrasi tanpa mematikan interaksi peta.
- Sumber ilustrasi original: `map-art.js`; tidak perlu asset tambahan atau lisensi gambar luar.

## Navigasi
- Atlas benua → klik kerajaan → klik kota → lihat tempat di kota.
- Fokus Asteria: Avelorn, Kawasan Perdagangan Timur, ibu kota Asteria.
- Cari lokasi dengan kotak pencarian atau tombol `/`.
- Zoom tombol +/− dan scroll mouse; geser peta setelah zoom.
- Lapisan geografi, jalan, dan **kota konsep** dapat dihidupkan/matikan.
- Ensiklopedia dan kronik perjalanan termasuk dalam website.
- Perangkat mobile mempunyai menu dan layout responsif.

## Integritas canon
Sumber utama: **ATLAS_RESMI_ELARION_CANON_V1.md**, disahkan pengguna 3 Nov 2026 (arsip TSE-ATLAS-ELARION-001). Perkembangan kampanye setelah itu menjadi koreksi temporal; misalnya Ryujin **sudah** tiba di ibu kota pada Day 420.

Seluruh penempatan titik, bentuk wilayah, bentuk jalan, dan detail kartografi yang belum disahkan adalah representasi ilustratif, bukan canon topografi presisi. Kota-kota baru dalam data adalah **konsep non-canon**; ditampilkan dengan penanda jelas melalui lapisan konsep yang dapat dimatikan kapan saja. Asal-usul para peserta turnamen dari kota-kota lain tidak diasumsikan atau dikarang.

## Memperbarui
- `data.js`: nama kerajaan, deskripsi, kota, landmark, kronik. Nama kota konsep boleh diganti/disahkan hanya setelah persetujuan pemain.
- `app.js`: seluruh interaksi dan gambar SVG dinamis.
- `map-art.js`: ilustrasi bangunan SVG cadangan.
- `photo-atlas.js` dan `photo-atlas.css`: ilustrasi gambar detail dengan hotspot dan impor gambar.
- `assets/`: gambar WebP; daftar lokasi tetap dikendalikan oleh data canon dalam `data.js`.
- `style.css`: tema, font, tampilan mobile.
- `index.html`: struktur UI.

Di `data.js`, `places` adalah titik peta Asteria; `avelorn` dan `trade` adalah landmark dalam peta lokal. Tautan langsung memakai fragment `#world`, `#asteria`, `#avelorn`, `#eastern-trade`, atau `#capital`.

## Pengembangan berikutnya
Tambahkan kota resmi Asteria berdasarkan canon mendatang, tetapkan asal kota setiap peserta Guild/turnamen bila sudah diceritakan, tambahkan peta lokal baru dan sumber ilustrasi canon, lalu pertimbangkan migrasi folder ini ke repository khusus `atlas-elarion`.