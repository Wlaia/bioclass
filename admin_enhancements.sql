-- Migração: Melhorias Administrativas (Financeiro, Documentos e Progresso)
-- Este script cria as tabelas necessárias para uma gestão escolar mais completa.

-- 1. Tabela de Transações Financeiras
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

-- 2. Tabela de Documentos do Aluno
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

-- 3. Tabela de Progresso de Aulas
CREATE TABLE IF NOT EXISTS public.lesson_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, lesson_id)
);

-- 4. Tabela de Despesas (Contas a Pagar)
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

-- Habilitar RLS para as novas tabelas
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (Admin tem acesso total, usuários veem apenas o seu)
-- Nota: Assumindo que o admin já tem acesso via RLS global ou políticas de serviço.
-- Se precisar de políticas específicas para o admin, geralmente usamos o 'service_role' ou verificamos se o usuário tem role 'admin' em seu metadata.

CREATE POLICY "Users view own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users view own documents" ON public.student_documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users view own progress" ON public.lesson_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users upsert own progress" ON public.lesson_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins manage expenses" ON public.expenses FOR ALL USING (auth.uid() IN (SELECT id FROM profiles WHERE email = 'wellingtonlaialopes@gmail.com'));

-- Documentação de como criar o bucket de storage (apenas como comentário)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('student-documents', 'student-documents', false);
