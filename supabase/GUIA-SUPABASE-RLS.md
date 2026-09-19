# Guia rápido: evitar o erro de RLS no Supabase

Toda vez que você cria uma **tabela** ou um **bucket** novo no Supabase, ele vem
com **RLS (Row Level Security) ligado e sem nenhuma permissão**. Por isso aparece:

> `new row violates row-level security policy`

RLS é uma trava de segurança: nada é permitido até você criar uma **política**.
Existem **dois lugares diferentes** que precisam de política:

1. **Tabelas** (ex: `carrossel`, `ccz_animais`, `hero_stats`)
2. **Storage / buckets** (ex: `carrossel`, `ccz`, `eventos`, `noticias`) — as
   políticas ficam na tabela especial `storage.objects`

---

## Opção A — Pelo painel (sem escrever SQL)

### Para uma TABELA nova
1. Supabase → **Authentication → Policies** (ou **Database → Policies**)
2. Ache a tabela → **New Policy**
3. Use os templates:
   - "Enable read access for all users" (SELECT)
   - "Enable insert for all users" / update / delete (para o admin gravar)

### Para um BUCKET novo
1. Ao criar o bucket, marque **"Public bucket"** (libera a leitura das imagens)
2. Storage → seu bucket → **Policies → New Policy**
3. Escolha o template **"Allow access to everyone"** e marque
   SELECT, INSERT, UPDATE e DELETE

---

## Opção B — Por SQL (mais rápido, no SQL Editor)

### Tabela nova — troque `NOME_DA_TABELA`
```sql
alter table public.NOME_DA_TABELA enable row level security;

drop policy if exists "NOME_DA_TABELA_select" on public.NOME_DA_TABELA;
drop policy if exists "NOME_DA_TABELA_insert" on public.NOME_DA_TABELA;
drop policy if exists "NOME_DA_TABELA_update" on public.NOME_DA_TABELA;
drop policy if exists "NOME_DA_TABELA_delete" on public.NOME_DA_TABELA;

create policy "NOME_DA_TABELA_select" on public.NOME_DA_TABELA for select using (true);
create policy "NOME_DA_TABELA_insert" on public.NOME_DA_TABELA for insert with check (true);
create policy "NOME_DA_TABELA_update" on public.NOME_DA_TABELA for update using (true);
create policy "NOME_DA_TABELA_delete" on public.NOME_DA_TABELA for delete using (true);
```

### Bucket novo — troque `NOME_DO_BUCKET`
```sql
insert into storage.buckets (id, name, public)
values ('NOME_DO_BUCKET', 'NOME_DO_BUCKET', true)
on conflict (id) do update set public = true;

drop policy if exists "NOME_DO_BUCKET_select" on storage.objects;
drop policy if exists "NOME_DO_BUCKET_insert" on storage.objects;
drop policy if exists "NOME_DO_BUCKET_update" on storage.objects;
drop policy if exists "NOME_DO_BUCKET_delete" on storage.objects;

create policy "NOME_DO_BUCKET_select" on storage.objects
  for select to public using (bucket_id = 'NOME_DO_BUCKET');
create policy "NOME_DO_BUCKET_insert" on storage.objects
  for insert to public with check (bucket_id = 'NOME_DO_BUCKET');
create policy "NOME_DO_BUCKET_update" on storage.objects
  for update to public using (bucket_id = 'NOME_DO_BUCKET') with check (bucket_id = 'NOME_DO_BUCKET');
create policy "NOME_DO_BUCKET_delete" on storage.objects
  for delete to public using (bucket_id = 'NOME_DO_BUCKET');
```

---

## Dicas para não travar o script

- **Rode as políticas de UM item por vez** (ou em blocos pequenos). Se um script
  grande recria uma política que já existe e dá erro, ele **aborta e não chega**
  nas linhas seguintes — foi o que aconteceu aqui: o script grande abortou antes
  de criar as políticas do `carrossel`.
- Sempre use `drop policy if exists ...` antes do `create policy` (é o que os
  exemplos acima já fazem), para poder rodar de novo sem erro de duplicidade.
- `to public` nas políticas de storage garante que funciona com qualquer tipo de
  chave, inclusive a nova chave `sb_publishable_...`.

---

## Observação de segurança

Os exemplos acima liberam tudo para qualquer um com a chave pública (anon /
publishable). É aceitável para um painel interno de baixo risco. Para produção
mais rígida, troque `using (true)` / `with check (true)` por regras que exijam
usuário autenticado, ex: `using (auth.role() = 'authenticated')`.

---

## Arquivos de política já prontos neste projeto

- `supabase-tabelas-policies.sql` — políticas das tabelas (carrossel, ccz_animais, hero_stats)
- `supabase-storage-policies.sql` — políticas de storage (eventos, noticias, carrossel, ccz)
- `supabase-storage-carrossel-ccz.sql` — versão isolada só de carrossel + ccz (storage)
