-- ============================================================
-- SpeakUp Project — Complete Supabase Schema
-- Run this entire file in Supabase SQL Editor
-- ============================================================

-- 1. TABLES
-- ============================================================

create table classes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now()
);

create table students (
  id uuid primary key default gen_random_uuid(),
  nim text not null,
  name text not null,
  class_id uuid references classes(id) on delete cascade,
  created_at timestamptz default now(),
  unique(nim, class_id)
);

create table assignments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  class_id uuid references classes(id) on delete cascade,
  created_at timestamptz default now()
);

create table submissions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  assignment_id uuid references assignments(id) on delete cascade,
  link text not null,
  submitted_at timestamptz default now(),
  unique(student_id, assignment_id)
);

create table grades (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid references submissions(id) on delete cascade unique,
  grade numeric(5,2),
  graded_at timestamptz default now()
);

-- 2. ENABLE ROW LEVEL SECURITY
-- ============================================================

alter table classes enable row level security;
alter table students enable row level security;
alter table assignments enable row level security;
alter table submissions enable row level security;
alter table grades enable row level security;

-- 3. RLS POLICIES (public — no auth required)
-- ============================================================
-- Note: All data is publicly readable/writable because students
-- submit without login and teachers grade without Supabase Auth.
-- For production with sensitive data, migrate to auth.uid() policies.

-- CLASSES
create policy "public read classes" on classes for select using (true);
create policy "public insert classes" on classes for insert with check (true);
create policy "public update classes" on classes for update using (true);
create policy "public delete classes" on classes for delete using (true);

-- STUDENTS
create policy "public read students" on students for select using (true);
create policy "public insert students" on students for insert with check (true);
create policy "public delete students" on students for delete using (true);

-- ASSIGNMENTS
create policy "public read assignments" on assignments for select using (true);
create policy "public insert assignments" on assignments for insert with check (true);
create policy "public update assignments" on assignments for update using (true);
create policy "public delete assignments" on assignments for delete using (true);

-- SUBMISSIONS (student submit without login)
create policy "public read submissions" on submissions for select using (true);
create policy "public insert submissions" on submissions for insert with check (true);
-- No update/delete — submissions are locked after submit

-- GRADES (teacher grades without auth)
create policy "public all grades" on grades for all using (true) with check (true);
