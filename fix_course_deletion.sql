-- Script para permitir a exclusão de cursos e seus dados vinculados (Cascade Delete)
-- Execute este script no SQL Editor do Supabase

-- 1. Ajustar a tabela de Módulos (depende de Cursos)
ALTER TABLE public.modules 
DROP CONSTRAINT IF EXISTS modules_course_id_fkey,
ADD CONSTRAINT modules_course_id_fkey 
  FOREIGN KEY (course_id) 
  REFERENCES public.courses(id) 
  ON DELETE CASCADE;

-- 2. Ajustar a tabela de Aulas (depende de Módulos)
ALTER TABLE public.lessons 
DROP CONSTRAINT IF EXISTS lessons_module_id_fkey,
ADD CONSTRAINT lessons_module_id_fkey 
  FOREIGN KEY (module_id) 
  REFERENCES public.modules(id) 
  ON DELETE CASCADE;

-- 3. Ajustar a tabela de Matrículas (depende de Cursos)
ALTER TABLE public.enrollments 
DROP CONSTRAINT IF EXISTS enrollments_course_id_fkey,
ADD CONSTRAINT enrollments_course_id_fkey 
  FOREIGN KEY (course_id) 
  REFERENCES public.courses(id) 
  ON DELETE CASCADE;

-- Após rodar este script, ao excluir um curso, 
-- todos os módulos, aulas e matrículas vinculadas serão removidos automaticamente.
