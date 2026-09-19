-- ============================================================================
-- ADICIONA A COLUNA id_animal NA TABELA ccz_animais
-- ============================================================================
-- Rode este script no SQL Editor do Supabase.
-- id_animal é o código/identificação do animal definido pelo CCZ no cadastro
-- (diferente do "id" interno, que é a chave primária do registro).
-- ============================================================================

alter table public.ccz_animais
  add column if not exists id_animal text;
