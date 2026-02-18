-- Enable RLS (already enabled, but good practice)
alter table public.enrollments enable row level security;

-- Drop existing policies to avoid conflicts/confusion
drop policy if exists "Users can view their own enrollments" on public.enrollments;
drop policy if exists "Users can insert their own enrollments" on public.enrollments;

-- Re-create basic user policies
create policy "Users can view their own enrollments" on public.enrollments
  for select using (auth.uid() = user_id);

create policy "Users can insert their own enrollments" on public.enrollments
  for insert with check (auth.uid() = user_id);

-- Create Admin policies
-- For simplicity, we are allowing all authenticated users to view/update for now, 
-- effectively making everyone an admin for testing. 
-- In production, you would check for strict role/claim.

drop policy if exists "Enable all access for authenticated users (admin)" on public.enrollments;
create policy "Enable all access for authenticated users (admin)" on public.enrollments
  for all using (auth.role() = 'authenticated');

-- Note: The above "all access" policy overlaps with the specific user policies. 
-- Postgres combines policies with OR, so if any policy allows access, it is granted.
-- This effectively opens up the table to all logged-in users.
