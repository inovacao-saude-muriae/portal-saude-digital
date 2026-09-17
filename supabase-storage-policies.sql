-- ============================================================================
-- POLÍTICAS DE STORAGE PARA O BUCKET 'eventos'
-- ============================================================================
-- Execute este script no SQL Editor do Supabase para corrigir o erro:
--   "new row violates row-level security policy"
--
-- Esse erro ocorre porque o Storage do Supabase tem RLS ativado por padrão
-- na tabela storage.objects, e não existe política que permita o upload
-- feito pela chave pública (anon) usada pelo painel administrativo.
-- ============================================================================

-- 1. Garante que o bucket 'eventos' existe e é público (leitura das imagens)
--    Se o bucket já existe, apenas marca como público.
INSERT INTO storage.buckets (id, name, public)
VALUES ('eventos', 'eventos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Remove políticas anteriores com o mesmo nome (evita erro de duplicidade)
DROP POLICY IF EXISTS "Leitura publica de banners de eventos" ON storage.objects;
DROP POLICY IF EXISTS "Upload publico de banners de eventos" ON storage.objects;
DROP POLICY IF EXISTS "Atualizacao publica de banners de eventos" ON storage.objects;
DROP POLICY IF EXISTS "Exclusao publica de banners de eventos" ON storage.objects;

-- 3. Permite LEITURA pública dos arquivos do bucket 'eventos'
CREATE POLICY "Leitura publica de banners de eventos"
ON storage.objects FOR SELECT
USING (bucket_id = 'eventos');

-- 4. Permite UPLOAD (insert) de arquivos no bucket 'eventos'
CREATE POLICY "Upload publico de banners de eventos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'eventos');

-- 5. Permite ATUALIZAR arquivos no bucket 'eventos' (upsert / substituição)
CREATE POLICY "Atualizacao publica de banners de eventos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'eventos');

-- 6. Permite EXCLUIR arquivos no bucket 'eventos' (limpeza de banners antigos)
CREATE POLICY "Exclusao publica de banners de eventos"
ON storage.objects FOR DELETE
USING (bucket_id = 'eventos');

-- ============================================================================
-- BUCKET 'noticias' (imagens de destaque das notícias)
-- ============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('noticias', 'noticias', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Leitura publica de imagens de noticias" ON storage.objects;
DROP POLICY IF EXISTS "Upload publico de imagens de noticias" ON storage.objects;
DROP POLICY IF EXISTS "Atualizacao publica de imagens de noticias" ON storage.objects;
DROP POLICY IF EXISTS "Exclusao publica de imagens de noticias" ON storage.objects;

CREATE POLICY "Leitura publica de imagens de noticias"
ON storage.objects FOR SELECT
USING (bucket_id = 'noticias');

CREATE POLICY "Upload publico de imagens de noticias"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'noticias');

CREATE POLICY "Atualizacao publica de imagens de noticias"
ON storage.objects FOR UPDATE
USING (bucket_id = 'noticias');

CREATE POLICY "Exclusao publica de imagens de noticias"
ON storage.objects FOR DELETE
USING (bucket_id = 'noticias');

-- ============================================================================
-- BUCKET 'carrossel' (imagens do carrossel da home)
-- ============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('carrossel', 'carrossel', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Leitura publica de imagens do carrossel" ON storage.objects;
DROP POLICY IF EXISTS "Upload publico de imagens do carrossel" ON storage.objects;
DROP POLICY IF EXISTS "Atualizacao publica de imagens do carrossel" ON storage.objects;
DROP POLICY IF EXISTS "Exclusao publica de imagens do carrossel" ON storage.objects;

CREATE POLICY "Leitura publica de imagens do carrossel"
ON storage.objects FOR SELECT
USING (bucket_id = 'carrossel');

CREATE POLICY "Upload publico de imagens do carrossel"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'carrossel');

CREATE POLICY "Atualizacao publica de imagens do carrossel"
ON storage.objects FOR UPDATE
USING (bucket_id = 'carrossel');

CREATE POLICY "Exclusao publica de imagens do carrossel"
ON storage.objects FOR DELETE
USING (bucket_id = 'carrossel');

-- ============================================================================
-- BUCKET 'ccz' (fotos dos animais para adoção)
-- ============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('ccz', 'ccz', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Leitura publica de fotos do ccz" ON storage.objects;
DROP POLICY IF EXISTS "Upload publico de fotos do ccz" ON storage.objects;
DROP POLICY IF EXISTS "Atualizacao publica de fotos do ccz" ON storage.objects;
DROP POLICY IF EXISTS "Exclusao publica de fotos do ccz" ON storage.objects;

CREATE POLICY "Leitura publica de fotos do ccz"
ON storage.objects FOR SELECT
USING (bucket_id = 'ccz');

CREATE POLICY "Upload publico de fotos do ccz"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'ccz');

CREATE POLICY "Atualizacao publica de fotos do ccz"
ON storage.objects FOR UPDATE
USING (bucket_id = 'ccz');

CREATE POLICY "Exclusao publica de fotos do ccz"
ON storage.objects FOR DELETE
USING (bucket_id = 'ccz');

-- ============================================================================
-- OBSERVAÇÃO DE SEGURANÇA
-- ============================================================================
-- As políticas acima liberam upload/edição/exclusão para QUALQUER cliente que
-- use a chave pública (anon). Isso é aceitável para desenvolvimento e para um
-- painel interno de baixo risco. Para produção com maior segurança, restrinja
-- essas operações a usuários autenticados trocando "WITH CHECK (bucket_id = 'eventos')"
-- por algo como:
--   WITH CHECK (bucket_id = 'eventos' AND auth.role() = 'authenticated')
-- e passe a usar autenticação do Supabase (ou a service_role key no servidor).
-- ============================================================================
