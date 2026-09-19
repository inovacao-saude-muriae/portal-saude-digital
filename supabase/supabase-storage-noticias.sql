-- ============================================================================
-- POLÍTICAS DE STORAGE APENAS PARA O BUCKET 'noticias'
-- ============================================================================
-- Rode ESTE script (isolado) no SQL Editor do Supabase.
-- Corrige o erro "new row violates row-level security policy" ao enviar
-- imagem de notícia pelo painel administrativo.
-- ============================================================================

-- Garante que o bucket 'noticias' existe e é público
insert into storage.buckets (id, name, public)
values ('noticias', 'noticias', true)
on conflict (id) do update set public = true;

-- Remove políticas anteriores com esses nomes (evita erro de duplicidade)
drop policy if exists "noticias_storage_select" on storage.objects;
drop policy if exists "noticias_storage_insert" on storage.objects;
drop policy if exists "noticias_storage_update" on storage.objects;
drop policy if exists "noticias_storage_delete" on storage.objects;

create policy "noticias_storage_select" on storage.objects
  for select to public using (bucket_id = 'noticias');

create policy "noticias_storage_insert" on storage.objects
  for insert to public with check (bucket_id = 'noticias');

create policy "noticias_storage_update" on storage.objects
  for update to public using (bucket_id = 'noticias') with check (bucket_id = 'noticias');

create policy "noticias_storage_delete" on storage.objects
  for delete to public using (bucket_id = 'noticias');
