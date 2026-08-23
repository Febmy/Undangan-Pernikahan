# Undangan Pernikahan — React + Supabase

Undangan pernikahan digital berbasis React (Vite), dengan buku tamu (ucapan & konfirmasi
kehadiran) yang tersimpan di Supabase dan muncul secara real-time ke semua tamu.

## 1. Setup Supabase

1. Buat project baru di https://supabase.com
2. Buka **SQL Editor**, jalankan seluruh isi file `supabase/schema.sql`
3. Buka **Project Settings > API**, salin dua nilai ini:
   - `Project URL`
   - `anon public` key

## 2. Setup lokal

```bash
npm install
cp .env.example .env
```

Isi file `.env` dengan nilai dari Supabase:

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=isi-anon-key-anda
```

Jalankan mode pengembangan:

```bash
npm run dev
```

## 3. Form untuk mempelai mengisi data sendiri

Selain lewat kode, sekarang tersedia halaman form di:

```
/isi-data
```

Kirimkan link ini (misalnya `https://undangan-anda.vercel.app/isi-data`) ke mempelai agar
mereka bisa mengisi semua data sendiri: nama, orang tua, tanggal & lokasi acara, kisah
cinta, foto (upload langsung dari HP), rekening kado, dll.

Begitu mereka klik **"Simpan Data Undangan"**, data langsung tersimpan di Supabase dan
halaman undangan (`/`) otomatis menampilkan data terbaru — tidak perlu edit kode atau
deploy ulang. Form ini juga bisa dibuka lagi kapan saja untuk mengubah data yang sudah
diisi.

Catatan: link `/isi-data` bersifat terbuka (siapa pun yang tahu link-nya bisa mengisi/
mengubah data), jadi cukup kirim langsung ke mempelai dan jangan disebar publik. Kalau
perlu proteksi tambahan (kode akses, dsb), beri tahu saya.

### Cara lain: edit lewat kode

Kalau belum ada data tersimpan di Supabase, halaman undangan menampilkan data contoh dari:

```
src/config.js
```

File ini juga berguna sebagai referensi struktur data / template awal saat mengisi form.

## 4. Link personal per tamu

Tambahkan `?to=Nama Tamu` di akhir URL untuk menampilkan nama tamu secara otomatis di
halaman pembuka, contoh:

```
https://undangan-anda.vercel.app/?to=Budi+%26+Keluarga
```

## 5. Deploy ke Vercel

1. Push folder ini ke repository GitHub
2. Buka https://vercel.com → **Add New Project** → pilih repo tersebut
3. Vercel otomatis mendeteksi project Vite (build command `vite build`, output folder
   `dist`) — tidak perlu diubah
4. Di bagian **Environment Variables**, tambahkan:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Klik **Deploy**

Setelah live, cek kembali bahwa form "Ucapan & Doa Restu" berhasil mengirim dan tampil —
kalau env variable salah/belum diisi, bagian itu akan menampilkan pesan error, sisanya
tetap berjalan normal.

## Struktur project

```
├── index.html
├── vercel.json                # rewrite supaya route /isi-data tidak 404 di Vercel
├── src/
│   ├── main.jsx               # routing: "/" undangan, "/isi-data" form
│   ├── config.js              # data contoh / fallback sebelum form diisi
│   ├── supabaseClient.js      # koneksi ke Supabase
│   ├── utils.js                # helper kalender, salin teks, konversi tanggal
│   ├── index.css               # semua styling
│   ├── hooks/
│   │   ├── useReveal.js        # animasi muncul saat discroll
│   │   ├── useCountdown.js     # logika hitung mundur
│   │   └── useWeddingConfig.js # ambil data undangan dari Supabase
│   ├── pages/
│   │   ├── Invitation.jsx      # halaman undangan ("/")
│   │   └── IntakeForm.jsx      # form untuk mempelai ("/isi-data")
│   └── components/
│       ├── Cover.jsx           # halaman pembuka
│       ├── Quote.jsx           # kutipan
│       ├── Couple.jsx          # profil mempelai
│       ├── Events.jsx          # waktu & tempat acara
│       ├── Countdown.jsx
│       ├── Story.jsx           # kisah cinta
│       ├── Gallery.jsx         # galeri foto
│       ├── Gifts.jsx           # kado digital
│       ├── Rsvp.jsx            # form + buku tamu (Supabase, real-time)
│       ├── Closing.jsx         # penutup & tombol bagikan
│       └── MusicToggle.jsx
└── supabase/
    └── schema.sql              # jalankan sekali di SQL Editor Supabase
```

## Catatan keamanan

Tabel `rsvp` sengaja dibuat terbuka (siapa saja boleh membaca & menulis) karena berfungsi
sebagai buku tamu publik, sama seperti undangan digital pada umumnya. Kalau ingin
membatasi (misalnya mencegah spam), beberapa opsi:

- Tambahkan rate limiting lewat Supabase Edge Function
- Aktifkan Captcha sebelum submit
- Moderasi lewat **Table Editor** di dashboard Supabase sebelum acara berlangsung
