-- Jalankan seluruh isi file ini di Supabase Dashboard > SQL Editor

-- Tabel untuk menyimpan ucapan & konfirmasi kehadiran tamu
create table if not exists rsvp (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  name text not null,
  status text not null check (status in ('Hadir', 'Tidak Hadir', 'Masih Ragu')),
  guests int not null default 1,
  message text not null
);

-- Aktifkan Row Level Security
alter table rsvp enable row level security;

-- Buku tamu bersifat publik: siapa saja (termasuk pengunjung tanpa akun)
-- boleh membaca ucapan yang sudah masuk
create policy "Publik bisa melihat ucapan"
  on rsvp for select
  using (true);

-- Siapa saja boleh mengirim ucapan baru
create policy "Publik bisa mengirim ucapan"
  on rsvp for insert
  with check (true);

-- Aktifkan realtime supaya ucapan tamu lain muncul otomatis tanpa reload
alter publication supabase_realtime add table rsvp;


-- ============================================================
-- Data undangan yang diisi mempelai lewat form (/isi-data)
-- Disimpan sebagai satu baris (id = 1) berisi seluruh data dalam JSON,
-- mengikuti struktur yang sama dengan src/config.js
-- ============================================================
create table if not exists wedding_config (
  id int primary key default 1,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table wedding_config enable row level security;

-- Halaman undangan perlu membaca data ini tanpa login
create policy "Publik bisa membaca data undangan"
  on wedding_config for select
  using (true);

-- Form intake perlu bisa menyimpan data baru
create policy "Publik bisa menyimpan data undangan"
  on wedding_config for insert
  with check (true);

-- Form intake perlu bisa memperbarui data yang sudah ada
create policy "Publik bisa memperbarui data undangan"
  on wedding_config for update
  using (true);


-- ============================================================
-- Storage bucket untuk foto yang diunggah mempelai lewat form
-- ============================================================
insert into storage.buckets (id, name, public)
values ('wedding-photos', 'wedding-photos', true)
on conflict (id) do nothing;

create policy "Publik bisa melihat foto undangan"
  on storage.objects for select
  using (bucket_id = 'wedding-photos');

create policy "Publik bisa mengunggah foto undangan"
  on storage.objects for insert
  with check (bucket_id = 'wedding-photos');
