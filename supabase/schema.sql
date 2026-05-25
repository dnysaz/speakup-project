-- XLinks Database Schema
-- Run this in Supabase SQL Editor

-- Classes
create table classes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now()
);

-- Students
create table students (
  id uuid primary key default gen_random_uuid(),
  nim text not null,
  name text not null,
  class_id uuid references classes(id) on delete cascade,
  created_at timestamptz default now(),
  unique(nim, class_id)
);

-- Assignments
create table assignments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  class_id uuid references classes(id) on delete cascade,
  created_at timestamptz default now()
);

-- Submissions
create table submissions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  assignment_id uuid references assignments(id) on delete cascade,
  link text not null,
  submitted_at timestamptz default now(),
  unique(student_id, assignment_id)
);

-- Grades
create table grades (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid references submissions(id) on delete cascade unique,
  grade numeric(5,2),
  graded_at timestamptz default now()
);

-- Enable Row Level Security (public read for student flow)
alter table classes enable row level security;
alter table students enable row level security;
alter table assignments enable row level security;
alter table submissions enable row level security;
alter table grades enable row level security;

-- Public read policies (mahasiswa tidak login)
create policy "public read classes" on classes for select using (true);
create policy "public read students" on students for select using (true);
create policy "public read assignments" on assignments for select using (true);
create policy "public read submissions" on submissions for select using (true);
create policy "public read grades" on grades for select using (true);

-- Public insert for submissions (mahasiswa submit tanpa login)
create policy "public insert submissions" on submissions for insert with check (true);

-- Public insert/update for grades (guru input nilai, no auth in app)
create policy "public insert grades" on grades for insert with check (true);
create policy "public update grades" on grades for update using (true);

-- Public insert for students (import via guru)
create policy "public insert students" on students for insert with check (true);
create policy "public insert classes" on classes for insert with check (true);
create policy "public insert assignments" on assignments for insert with check (true);
create policy "public update assignments" on assignments for update using (true);
create policy "public delete assignments" on assignments for delete using (true);
create policy "public delete students" on students for delete using (true);
create policy "public update classes" on classes for update using (true);
create policy "public delete classes" on classes for delete using (true);
