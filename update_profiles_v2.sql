-- Adicionar colunas faltantes na tabela profiles
-- Execute este script no SQL Editor do Supabase

DO $$ 
BEGIN 
    -- Adicionar coluna 'formacao' se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'formacao') THEN
        ALTER TABLE public.profiles ADD COLUMN formacao TEXT;
    END IF;

    -- Adicionar coluna 'email' se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'email') THEN
        ALTER TABLE public.profiles ADD COLUMN email TEXT;
    END IF;
END $$;
