-- SCRIPT DE EMERGÊNCIA (DEBUG)
-- Este script DESATIVA a segurança das tabelas para testar se o problema é permissão.
-- Use apenas para testar. Depois reativaremos.

alter table public.enrollments disable row level security;
alter table public.profiles disable row level security;
alter table public.courses disable row level security;

-- Se isso funcionar e os dados aparecerem, sabemos que o problema era nas Políticas (Policies).
