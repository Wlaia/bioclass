-- -- SCRIPT DE CORREÇÃO DE PERMISSÕES --
-- Execute este script EXATAMENTE como está.
-- Certifique-se de que a tradução automática do navegador esteja DESATIVADA.

-- 1. Permissões para Matrículas (Enrollments)
alter table public.enrollments enable row level security;

-- Remove políticas antigas/corrompidas se existirem
drop policy if exists "Enable all access for authenticated users (admin)" on public.enrollments;
drop policy if exists "Users can view their own enrollments" on public.enrollments;
drop policy if exists "Users can insert their own enrollments" on public.enrollments;

-- Recria políticas corretas
create policy "Users can view their own enrollments" on public.enrollments
  for select using (auth.uid() = user_id);

create policy "Users can insert their own enrollments" on public.enrollments
  for insert with check (auth.uid() = user_id);

-- Permite que qualquer usuário logado veja/edite todas as matrículas
-- (Isso serve para o Admin funcionar neste momento)
create policy "Enable all access for authenticated users (admin)" on public.enrollments
  for all using (auth.role() = 'authenticated');


-- 2. Permissões para Perfis (Profiles)
-- Necessário para o Admin ver o Nome do Aluno
alter table public.profiles enable row level security;

drop policy if exists "Enable read access for all users (admin view)" on public.profiles;

-- Permite leitura de perfis por qualquer usuário autenticado
create policy "Enable read access for all users (admin view)" on public.profiles
  for select using (auth.role() = 'authenticated');
