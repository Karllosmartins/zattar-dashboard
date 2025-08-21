-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS public.users (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir usuário admin padrão
INSERT INTO public.users (name, email, password, role, active) 
VALUES (
  'Administrador MySellers',
  'admin@mysellers.com.br',
  'MySellers@2024',
  'admin',
  true
) ON CONFLICT (email) DO NOTHING;

-- Inserir usuário Zattar padrão
INSERT INTO public.users (name, email, password, role, active) 
VALUES (
  'Zattar User',
  'zattar@mysellers.com.br',
  'Zattar@2024',
  'user',
  true
) ON CONFLICT (email) DO NOTHING;

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_active ON public.users(active);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura de usuários ativos
CREATE POLICY "Usuários podem ver outros usuários ativos" ON public.users
  FOR SELECT USING (active = true);

-- Política para admin pode fazer tudo
CREATE POLICY "Admin pode gerenciar usuários" ON public.users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
      AND role = 'admin'
      AND active = true
    )
  );