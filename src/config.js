/**
 * ======================================================================
 * ✏️  EDIT SEMUA DATA UNDANGAN DI SINI
 * Ganti teks di dalam tanda kutip " " sesuai kebutuhan.
 * File lain tidak perlu disentuh.
 * ======================================================================
 */
const config = {
  eyebrow: 'Undangan Pernikahan',
  guestFallback: 'Tamu Undangan', // ditampilkan jika link dibuka tanpa ?to=Nama

  mempelai: {
    pria: {
      namaLengkap: 'Ahmad Fajar Nugroho',
      namaPanggilan: 'Ahmad',
      orangTua: 'Putra dari Bapak Slamet Nugroho & Ibu Rahayu Wulandari',
      instagram: '', // contoh: "@ahmadfajar" — kosongkan jika tidak ingin ditampilkan
      foto: '', // isi URL foto, atau kosongkan untuk memakai inisial
    },
    wanita: {
      namaLengkap: 'Bunga Lestari',
      namaPanggilan: 'Bunga',
      orangTua: 'Putri dari Bapak Hendra Wijaya & Ibu Sri Handayani',
      instagram: '',
      foto: '',
    },
  },

  // Tanggal yang tampil di cover (teks bebas)
  tanggalCover: 'Sabtu, 21 Desember 2026',

  // Target hitung mundur — format ISO: TAHUN-BULAN-TANGGALTJAM:MENIT:DETIK+07:00
  countdownTarget: '2026-12-21T08:00:00+07:00',

  // Kutipan pembuka. Kosongkan "arabic" jika belum ingin menampilkan teks Arab.
  quote: {
    arabic: '',
    makna:
      'Di antara tanda kebesaran-Nya, diciptakan-Nya pasangan untuk kita agar hati menjadi tenteram, serta ditumbuhkan-Nya rasa cinta dan kasih sayang di antara keduanya.',
    referensi: 'QS. Ar-Rūm: 21',
  },

  // Tambah/kurangi acara sesuai kebutuhan
  acara: [
    {
      label: 'Akad Nikah',
      tanggal: 'Sabtu, 21 Desember 2026',
      jam: '08.00 – 10.00 WIB',
      tempat: 'Kediaman Mempelai Wanita',
      alamat: 'Jl. Melati No. 12, Kota Semarang, Jawa Tengah',
      mapsUrl: 'https://maps.google.com/?q=Jl.+Melati+No.+12+Semarang',
      mulaiISO: '2026-12-21T08:00:00+07:00',
      selesaiISO: '2026-12-21T10:00:00+07:00',
    },
    {
      label: 'Resepsi',
      tanggal: 'Sabtu, 21 Desember 2026',
      jam: '11.00 – 14.00 WIB',
      tempat: 'Gedung Serbaguna Wijaya Kusuma',
      alamat: 'Jl. Diponegoro No. 45, Kota Semarang, Jawa Tengah',
      mapsUrl: 'https://maps.google.com/?q=Gedung+Serbaguna+Wijaya+Kusuma+Semarang',
      mulaiISO: '2026-12-21T11:00:00+07:00',
      selesaiISO: '2026-12-21T14:00:00+07:00',
    },
  ],

  // Kisah cinta — tambah/kurangi sesuai cerita kalian. Kosongkan array untuk sembunyikan section ini.
  kisah: [
    { tahun: '2021', judul: 'Pertama Bertemu', cerita: 'Dipertemukan di lingkungan yang sama, sapaan sederhana menjadi awal cerita.' },
    { tahun: '2023', judul: 'Menjalin Hubungan', cerita: 'Perlahan tumbuh rasa nyaman dan saling percaya satu sama lain.' },
    { tahun: '2025', judul: 'Lamaran', cerita: 'Restu keluarga menjadi langkah untuk melanjutkan ke jenjang yang lebih serius.' },
    { tahun: '2026', judul: 'Menikah', cerita: 'Hari yang dinanti tiba, dua hati resmi menyatu dalam ikatan pernikahan.' },
  ],

  // Isi dengan URL foto untuk galeri. Kosongkan array untuk tampilkan placeholder.
  galeri: [
    // 'https://contoh.com/foto1.jpg',
    // 'https://contoh.com/foto2.jpg',
  ],

  // Rekening / e-wallet untuk kado digital
  hadiah: [
    { bank: 'Bank BCA', nomor: '1234567890', atasNama: 'Bunga Lestari' },
    { bank: 'GoPay', nomor: '0812-3456-7890', atasNama: 'Bunga Lestari' },
  ],

  // Nomor WhatsApp untuk tombol "Bagikan" (format 62xxxxxxxxxx), kosongkan untuk pakai teks bagikan umum
  whatsapp: '',

  // URL file musik latar (mp3). Kosongkan jika tidak ingin ada musik.
  musikUrl: '',

  pesanPenutup:
    'Merupakan suatu kehormatan dan kebahagiaan bagi kami, apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.',
}

export default config
