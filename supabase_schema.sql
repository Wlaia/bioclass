-- Create Profiles table (extends auth.users)
create table public.profiles (
  id uuid references auth.users not null primary key,
  full_name text,
  avatar_url text,
  role text default 'student' check (role in ('student', 'admin', 'instructor')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Profiles
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Create Courses table
create table public.courses (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  image_url text,
  category text,
  duration text,
  level text,
  modules_count integer default 0,
  price decimal(10,2),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Courses
alter table public.courses enable row level security;

create policy "Courses are viewable by everyone."
  on courses for select
  using ( true );

-- Create Modules table
create table public.modules (
  id uuid default uuid_generate_v4() primary key,
  course_id uuid references public.courses not null,
  title text not null,
  order_index integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.modules enable row level security;

create policy "Modules viewable by everyone" on modules for select using (true);

-- Create Lessons table
create table public.lessons (
  id uuid default uuid_generate_v4() primary key,
  module_id uuid references public.modules not null,
  title text not null,
  video_url text,
  duration text,
  order_index integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.lessons enable row level security;

create policy "Lessons viewable by enrolled users" on lessons for select using (true); -- Simplified for now

-- Create Enrollments table
create table public.enrollments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  course_id uuid references public.courses(id) not null,
  status text default 'active',
  progress integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, course_id)
);

alter table public.enrollments enable row level security;

create policy "Users can view own enrollments" 
  on enrollments for select 
  using (auth.uid() = user_id);

-- Trigger to create profile after signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data->>'full_name', 'student');
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Insert Mock Data
insert into public.courses (title, description, image_url, category, duration, level, modules_count, price)
values 
('Biomedicina Estética Avançada', 'Domine as técnicas de harmonização facial.', 'https://images.unsplash.com/photo-1576091160550-2187d80018fd', 'Estética', '120h', 'Avançado', 12, 997.00),
('Microbiologia Clínica Laboratorial', 'Aprenda a identificar patógenos.', 'https://images.unsplash.com/photo-1579154204601-01588f351e67', 'Laboratório', '80h', 'Intermediário', 8, 597.00);
