-- Enable UUID extension just in case
create extension if not exists "uuid-ossp";

-- Create profiles table if it does not exist
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  full_name text,
  cpf text,
  phone text,
  address text,
  number text,
  city text,
  state text,
  zip_code text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add columns if they are missing (for existing tables)
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'full_name') then
    alter table public.profiles add column full_name text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'cpf') then
    alter table public.profiles add column cpf text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'phone') then
    alter table public.profiles add column phone text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'address') then
    alter table public.profiles add column address text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'number') then
    alter table public.profiles add column number text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'city') then
    alter table public.profiles add column city text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'state') then
    alter table public.profiles add column state text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'zip_code') then
    alter table public.profiles add column zip_code text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'updated_at') then
    alter table public.profiles add column updated_at timestamp with time zone default timezone('utc'::text, now()) not null;
  end if;
end $$;

-- Enable Row Level Security (RLS) for profiles
alter table public.profiles enable row level security;

-- Policies (DROP IF EXISTS first to avoid errors)
drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

-- Create enrollments table
create table if not exists public.enrollments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  course_id uuid references public.courses(id) not null,
  status text check (status in ('pending', 'active', 'completed', 'cancelled')) default 'pending',
  enrolled_at timestamp with time zone default timezone('utc'::text, now()) not null,
  payment_method text,
  amount decimal(10, 2)
);

-- Enable Row Level Security (RLS) for enrollments
alter table public.enrollments enable row level security;

-- Policies for enrollments
drop policy if exists "Users can view their own enrollments" on public.enrollments;
create policy "Users can view their own enrollments" on public.enrollments
  for select using (auth.uid() = user_id);

drop policy if exists "Users can insert their own enrollments" on public.enrollments;
create policy "Users can insert their own enrollments" on public.enrollments
  for insert with check (auth.uid() = user_id);
