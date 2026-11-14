# Atlas Resmi Elarion ✦

**The Stars Beyond Eternity — Interactive Canon Atlas**

Website atlas interaktif fantasy, berbasis HTML/CSS/JavaScript murni tanpa biaya API, framework, atau server. Direktori ini terpisah dari aplikasi DeutschNest dan tidak mengubah data pembelajarannya.

## Menjalankan
Buka `index.html` dengan browser modern. Untuk hosting, GitHub Pages harus diaktifkan pada repository pada **Settings → Pages → Deploy from a branch → main / (root)**. Jika Pages sudah menggunakan `main`, halaman berada di:

https://urfavappetizer.github.io/deutschnest/atlas-elarion/

**Catatan:** URL di atas adalah format alamat yang diperkirakan berdasarkan nama repositori; status deploy belum dapat diverifikasi melalui alat.

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

Seluruh penempatan titik, bentuk wilayah, bentuk jalan, dan detail kartografi yang belum disahkan adalah representasi ilustratif, bukan canon topografi presisi. Satu-satunya kota baru di dalam data adalah **konsep non-canon** yang disembunyikan secara default. Asal-usul para peserta turnamen dari kota-kota lain tidak diasumsikan atau dikarang.

## Memperbarui
- `data.js`: nama kerajaan, deskripsi, kota, landmark, kronik. Nama kota konsep boleh diganti/disahkan hanya setelah persetujuan pemain.
- `app.js`: seluruh interaksi dan gambar SVG dinamis.
- `style.css`: tema, font, tampilan mobile.
- `index.html`: struktur UI.

Di `data.js`, `places` adalah titik peta Asteria; `avelorn` dan `trade` adalah landmark dalam peta lokal. Tautan langsung memakai fragment `#world`, `#asteria`, `#avelorn`, `#eastern-trade`, atau `#capital`.

## Pengembangan berikutnya
Tambahkan kota resmi Asteria berdasarkan canon mendatang, tetapkan asal kota setiap peserta Guild/turnamen bila sudah diceritakan, tambahkan peta lokal baru dan sumber ilustrasi canon, lalu pertimbangkan migrasi folder ini ke repository khusus `atlas-elarion`.