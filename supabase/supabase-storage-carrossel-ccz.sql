-- ============================================================================
-- POLÍTICAS DE STORAGE APENAS PARA OS BUCKETS 'carrossel' E 'ccz'
-- ============================================================================
-- Rode ESTE script (isolado) no SQL Editor do Supabase.
-- Ele NÃO mexe em eventos/noticias (que já funcionam), evitando que um erro
-- de duplicidade aborte o restante do script.
--
-- Execute tudo de uma vez. Se aparecer erro em alguma linha, execute cada
-- bloco separadamente para identificar qual falha.
-- ============================================================================

-- Garante que os buckets existem e são públicos
insert into storage.buckets (id, name, public)
values ('carrossel', 'carrossel', true)
on conflict (id) do update set public = true;

insert into storage.buckets (id, name, public)
values ('ccz', 'ccz', true)
on conflict (id) do update set public = true;

-- ---------------------------------------------------------------------------
-- Políticas do bucket 'carrossel'
-- ---------------------------------------------------------------------------
drop policy if exists "carrossel_storage_select" on storage.objects;
drop policy if exists "carrossel_storage_insert" on storage.objects;
drop policy if exists "carrossel_storage_update" on storage.objects;
drop policy if exists "carrossel_storage_delete" on storage.objects;

create policy "carrossel_storage_select" on storage.objects
  for select to public using (bucket_id = 'carrossel');

create policy "carrossel_storage_insert" on storage.objects
  for insert to public with check (bucket_id = 'carrossel');

create policy "carrossel_storage_update" on storage.objects
  for update to public using (bucket_id = 'carrossel') with check (bucket_id = 'carrossel');

create policy "carrossel_storage_delete" on storage.objects
  for delete to public using (bucket_id = 'carrossel');

-- ---------------------------------------------------------------------------
-- Políticas do bucket 'ccz' (fotos dos animais)
-- ---------------------------------------------------------------------------
drop policy if exists "ccz_storage_select" on storage.objects;
drop policy if exists "ccz_storage_insert" on storage.objects;
drop policy if exists "ccz_storage_update" on storage.objects;
drop policy if exists "ccz_storage_delete" on storage.objects;

create policy "ccz_storage_select" on storage.objects
  for select to public using (bucket_id = 'ccz');

create policy "ccz_storage_insert" on storage.objects
  for insert to public with check (bucket_id = 'ccz');

create policy "ccz_storage_update" on storage.objects
  for update to public using (bucket_id = 'ccz') with check (bucket_id = 'ccz');

create policy "ccz_storage_delete" on storage.objects
  for delete to public using (bucket_id = 'ccz');
