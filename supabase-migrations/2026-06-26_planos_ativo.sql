-- ============================================================================
-- 2026-06-26 — Planos: coluna `ativo` por plano + tabela `planos_config`
-- ============================================================================
-- Rode este arquivo no SQL Editor do Supabase
-- (https://supabase.com/dashboard/project/rwfecphtxrwxhzuctudk/sql)
-- ============================================================================

-- 1) Coluna `ativo` por plano
ALTER TABLE planos
  ADD COLUMN IF NOT EXISTS ativo BOOLEAN NOT NULL DEFAULT true;

-- 2) Tabela de configuração por categoria (PF / PJ)
CREATE TABLE IF NOT EXISTS planos_config (
  tipo  TEXT PRIMARY KEY,
  ativo BOOLEAN NOT NULL DEFAULT true
);

-- 3) Seed das duas categorias (idempotente)
INSERT INTO planos_config (tipo, ativo) VALUES
  ('pf', true),
  ('pj', true)
ON CONFLICT (tipo) DO NOTHING;

-- 4) RLS — leitura pública (igual ao padrão da tabela `planos`)
ALTER TABLE planos_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "planos_config_select_public" ON planos_config;
CREATE POLICY "planos_config_select_public"
  ON planos_config FOR SELECT
  TO anon, authenticated
  USING (true);

-- Escrita só por usuários autenticados (o gatekeeper de role acontece no
-- server action via requireRole — aqui basta garantir que anon não escreva).
DROP POLICY IF EXISTS "planos_config_write_authenticated" ON planos_config;
CREATE POLICY "planos_config_write_authenticated"
  ON planos_config FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
