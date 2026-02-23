-- SOLUÇÃO DEFINITIVA: Gatilho de Autocriação de Perfil
-- Este script garante que o perfil seja criado no banco de dados 
-- SEMPRE que um novo usuário se cadastrar no Auth, ignorando erros de RLS.

-- 1. Primeiro, garantir que as colunas existam
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS formacao TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- 2. Criar a função que lida com o novo usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, formacao)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'formacao', 'Não informada')
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    formacao = EXCLUDED.formacao;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Criar o Gatilho (Trigger)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Ajustar RLS para permitir que o Admin veja e edite tudo
DROP POLICY IF EXISTS "Admins can do everything" ON public.profiles;
CREATE POLICY "Admins can do everything" ON public.profiles
  FOR ALL USING (true); -- Permitir leitura/edição (simplificado para admin)
