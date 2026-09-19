-- ============================================================================
-- POLÍTICAS RLS PARA AS TABELAS DO PORTAL
-- ============================================================================
-- Execute este script no SQL Editor do Supabase para corrigir o erro:
--   "new row violates row-level security policy for table ..."
--
-- Esse erro ocorre quando a tabela tem RLS (Row Level Security) ativado
-- mas não possui políticas que permitam leitura/escrita com a chave pública
-- (anon) usada pelo site e pelo painel administrativo.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- CARROSSEL
-- ---------------------------------------------------------------------------
ALTER TABLE public.carrossel ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "carrossel_select_publico" ON public.carrossel;
DROP POLICY IF EXISTS "carrossel_insert_publico" ON public.carrossel;
DROP POLICY IF EXISTS "carrossel_update_publico" ON public.carrossel;
DROP POLICY IF EXISTS "carrossel_delete_publico" ON public.carrossel;

CREATE POLICY "carrossel_select_publico" ON public.carrossel FOR SELECT USING (true);
CREATE POLICY "carrossel_insert_publico" ON public.carrossel FOR INSERT WITH CHECK (true);
CREATE POLICY "carrossel_update_publico" ON public.carrossel FOR UPDATE USING (true);
CREATE POLICY "carrossel_delete_publico" ON public.carrossel FOR DELETE USING (true);

-- ---------------------------------------------------------------------------
-- CCZ_ANIMAIS (adoção)
-- ---------------------------------------------------------------------------
ALTER TABLE public.ccz_animais ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ccz_animais_select_publico" ON public.ccz_animais;
DROP POLICY IF EXISTS "ccz_animais_insert_publico" ON public.ccz_animais;
DROP POLICY IF EXISTS "ccz_animais_update_publico" ON public.ccz_animais;
DROP POLICY IF EXISTS "ccz_animais_delete_publico" ON public.ccz_animais;

CREATE POLICY "ccz_animais_select_publico" ON public.ccz_animais FOR SELECT USING (true);
CREATE POLICY "ccz_animais_insert_publico" ON public.ccz_animais FOR INSERT WITH CHECK (true);
CREATE POLICY "ccz_animais_update_publico" ON public.ccz_animais FOR UPDATE USING (true);
CREATE POLICY "ccz_animais_delete_publico" ON public.ccz_animais FOR DELETE USING (true);

-- ---------------------------------------------------------------------------
-- HERO_STATS
-- ---------------------------------------------------------------------------
ALTER TABLE public.hero_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "hero_stats_select_publico" ON public.hero_stats;
DROP POLICY IF EXISTS "hero_stats_insert_publico" ON public.hero_stats;
DROP POLICY IF EXISTS "hero_stats_update_publico" ON public.hero_stats;

CREATE POLICY "hero_stats_select_publico" ON public.hero_stats FOR SELECT USING (true);
CREATE POLICY "hero_stats_insert_publico" ON public.hero_stats FOR INSERT WITH CHECK (true);
CREATE POLICY "hero_stats_update_publico" ON public.hero_stats FOR UPDATE USING (true);

-- ============================================================================
-- OBSERVAÇÃO DE SEGURANÇA
-- ============================================================================
-- As políticas acima liberam leitura E escrita para qualquer cliente que use
-- a chave pública (anon). É aceitável para um painel interno de baixo risco,
-- e é o mesmo modelo já usado nas tabelas de eventos e notícias.
--
-- Para maior segurança em produção, restrinja INSERT/UPDATE/DELETE a usuários
-- autenticados, trocando "USING (true)" / "WITH CHECK (true)" por, por exemplo:
--   USING (auth.role() = 'authenticated')
-- e passando a usar autenticação do Supabase no painel administrativo.
-- ============================================================================
