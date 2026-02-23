-- =========================================================
-- MIGRATION: BIOCLASS FINANCE & ADMIN ACCESS
-- DATA: 23/02/2026
-- =========================================================

-- 1. ADICIONAR COLUNA ROLE NA TABELA PROFILES (SE NÃO EXISTIR)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='role') THEN
        ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'student';
    END IF;
END $$;

-- 2. DEFINIR ADMINS INICIAIS
UPDATE public.profiles 
SET role = 'admin' 
WHERE email IN ('contato@bioclasscursos.com.br', 'wellingtonlaialopes@gmail.com');


-- 3. TABELA DE TRANSAÇÕES (RECEITAS MANUAIS)
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    enrollment_id UUID REFERENCES public.enrollments(id) ON DELETE SET NULL,
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method TEXT, -- 'pix', 'credit_card', 'boleto', 'cash'
    status TEXT CHECK (status IN ('pending', 'paid', 'refunded', 'cancelled')) DEFAULT 'pending',
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABELA DE DESPESAS (CONTAS A PAGAR)
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    description TEXT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    due_date DATE NOT NULL,
    payment_date DATE,
    category TEXT, -- 'aluguel', 'salarios', 'cloud', 'marketing', 'outros'
    status TEXT CHECK (status IN ('pending', 'paid', 'cancelled')) DEFAULT 'pending',
    provider TEXT, -- Fornecedor
    notes TEXT,
    total_installments INTEGER DEFAULT 1,
    current_installment INTEGER DEFAULT 1,
    parent_id UUID, -- Referência para parcelas ou recorrências
    is_recurring BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by UUID REFERENCES auth.users(id)
);

-- 5. TABELA DE DOCUMENTOS DO ALUNO
CREATE TABLE IF NOT EXISTS public.student_documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    document_type TEXT NOT NULL, -- 'RG', 'CPF', 'DIPLOMA', 'COMPROVANTE_RESIDENCIA'
    file_path TEXT, -- Caminho no Supabase Storage
    status TEXT CHECK (status IN ('pending', 'submitted', 'verified', 'rejected')) DEFAULT 'pending',
    notes TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, document_type)
);

-- 6. TABELA DE PROGRESSO DE AULAS
CREATE TABLE IF NOT EXISTS public.lesson_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, lesson_id)
);

-- 7. HABILITAR RLS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- 8. POLÍTICAS RLS
-- Transactions
DROP POLICY IF EXISTS "Users view own transactions" ON public.transactions;
CREATE POLICY "Users view own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);

-- Documents
DROP POLICY IF EXISTS "Users view own documents" ON public.student_documents;
CREATE POLICY "Users view own documents" ON public.student_documents FOR SELECT USING (auth.uid() = user_id);

-- Progress
DROP POLICY IF EXISTS "Users view own progress" ON public.lesson_progress;
CREATE POLICY "Users view own progress" ON public.lesson_progress FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users upsert own progress" ON public.lesson_progress;
CREATE POLICY "Users upsert own progress" ON public.lesson_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Expenses
DROP POLICY IF EXISTS "Admins manage expenses" ON public.expenses;
CREATE POLICY "Admins manage expenses" ON public.expenses FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 9. RECARREGAR SCHEMA
NOTIFY pgrst, 'reload schema';
