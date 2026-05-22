-- Jalankan ini di Supabase SQL Editor jika nilai masih hilang saat reload

-- Pastikan upsert bisa bekerja (butuh select + insert + update)
-- Drop dulu kalau sudah ada, lalu buat ulang

drop policy if exists "public insert grades" on grades;
drop policy if exists "public update grades" on grades;
drop policy if exists "public read grades" on grades;

create policy "public all grades" on grades for all using (true) with check (true);
