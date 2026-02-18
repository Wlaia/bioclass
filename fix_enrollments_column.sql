-- SCRIPT DE CORREÇÃO: ADICIONAR COLUNA DA DATA DE MATRÍCULA
-- Execute este script para corrigir o erro "column enrollments.enrolled_at does not exist"

do $$
begin
  -- Verifica se a coluna 'enrolled_at' existe, se não, cria ela
  if not exists (select 1 from information_schema.columns where table_name = 'enrollments' and column_name = 'enrolled_at') then
    alter table public.enrollments add column enrolled_at timestamp with time zone default timezone('utc'::text, now()) not null;
  end if;
end $$;
