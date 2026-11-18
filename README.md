# Triks

Platform persiapan ujian berbasis Next.js. Halaman Materi, Diktat, Bank Soal, Tryout, Peringkat, serta formulir akun tersedia melalui navigasi.

## Menjalankan lokal

1. Salin `.env.example` menjadi `.env`.
2. Isi `DATABASE_URL` dengan URL PostgreSQL dan buat `AUTH_SECRET` acak yang panjang.
3. Jalankan `npm install`, kemudian `npm run db:push` untuk membuat tabel.
4. Jalankan `npm run dev`.

## Deploy di Vercel

Hubungkan proyek Git ke Vercel, tambahkan `DATABASE_URL` dan `AUTH_SECRET` pada Environment Variables, lalu deploy. Database PostgreSQL terkelola seperti Neon dapat digunakan. Jalankan `npm run db:push` sekali dengan URL database produksi sebelum membuka pendaftaran.

## Catatan isi

Katalog bab pada aplikasi adalah kerangka belajar yang bisa diedit di `lib/catalog.ts`. Latihan dibuat oleh aplikasi dan bukan kumpulan soal resmi. Sebelum dipakai sebagai materi kurikulum lengkap, konten tiap bab perlu disunting/ditinjau pendidik dan diselaraskan dengan ATP atau silabus sekolah. Tautan video membuka hasil pencarian YouTube berdasarkan bab yang dipilih.
