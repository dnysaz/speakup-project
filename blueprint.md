# XLinks - Blueprint

## Overview
Web app untuk dosen menyimpan & menilai link tugas video mahasiswa (YouTube, TikTok, Google Drive).

## Stack
- Next.js + Tailwind CSS
- Supabase (DB + Auth)
- UI style: Google Classroom

---

## Entitas

### Kelas
- id, nama (contoh: "Kelas A")

### Mahasiswa
- id, nim, nama, kelas_id

### Tugas
- id, nama (contoh: "Tugas 1"), kelas_id

### Submission
- id, mahasiswa_id, tugas_id, link (YouTube/TikTok/GDrive), submitted_at
- **Tidak bisa diedit setelah submit**

### Nilai
- id, submission_id, nilai (input oleh guru)

---

## Alur Mahasiswa (tanpa login, mirip Google Form)
1. Buka xlinks → pilih kelas
2. Cari nama → cocokkan NIM
3. Pilih tugas (Tugas 1, 2, dst)
4. Paste link video → Submit
5. Setelah submit, link terkunci (tidak bisa edit)

## Alur Guru (login dengan email+password via env)
1. Login → dashboard kelas
2. Pilih kelas → tampil folder per tugas
3. Klik tugas → list mahasiswa + video embed di samping
4. Input nilai di samping kanan video
5. Export Excel per kelas: baris = mahasiswa, kolom = tugas, isi = nilai

---

## Fitur Tambahan
- Import mahasiswa massal via Excel format: `NIM | Nama`
- Auth guru: email & password disimpan di `.env`
- Video embed langsung di halaman penilaian

---

## Database Schema (Supabase)

```
classes: id, name
students: id, nim, name, class_id
assignments: id, name, class_id
submissions: id, student_id, assignment_id, link, submitted_at
grades: id, submission_id, grade
```

---

## Env Variables
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
TEACHER_EMAIL=
TEACHER_PASSWORD=
```
