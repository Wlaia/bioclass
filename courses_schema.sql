-- Create courses table if it doesn't exist
create table if not exists public.courses (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  image_url text,
  category text,
  duration text,
  level text,
  modules_count integer,
  price decimal(10, 2),
  status text check (status in ('active', 'draft')) default 'draft',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add columns if they are missing (idempotent operations)
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'courses' and column_name = 'status') then
    alter table public.courses add column status text check (status in ('active', 'draft')) default 'draft';
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'courses' and column_name = 'modules_count') then
    alter table public.courses add column modules_count integer;
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'courses' and column_name = 'level') then
    alter table public.courses add column level text;
  end if;
    if not exists (select 1 from information_schema.columns where table_name = 'courses' and column_name = 'duration') then
    alter table public.courses add column duration text;
  end if;
    if not exists (select 1 from information_schema.columns where table_name = 'courses' and column_name = 'category') then
    alter table public.courses add column category text;
  end if;
end $$;

-- Enable RLS
alter table public.courses enable row level security;

-- Policies
-- Enable read access for all users
drop policy if exists "Enable read access for all users" on public.courses;
create policy "Enable read access for all users" on public.courses
  for select using (true);

-- Enable all access for authenticated users (admins)
drop policy if exists "Enable all access for authenticated users" on public.courses;
create policy "Enable all access for authenticated users" on public.courses
  for all using (auth.role() = 'authenticated');
