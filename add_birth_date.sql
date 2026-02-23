-- ADICIONAR CAMPO DE DATA DE NASCIMENTO
-- Execute este script no SQL Editor do Supabase

-- 1. Adicionar a coluna na tabela profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS birth_date DATE;

-- 2. Atualizar a função do Gatilho (Trigger) para capturar a data de nascimento do cadastro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, formacao, birth_date)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'formacao', 'Não informada'),
    (NEW.raw_user_meta_data->>'birth_date')::DATE
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    formacao = EXCLUDED.formacao,
    birth_date = EXCLUDED.birth_date;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
