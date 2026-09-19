-- ============================================================================
-- TABELA DE SOLICITAÇÕES DE ADOÇÃO (CCZ)
-- ============================================================================
-- Rode este script no SQL Editor do Supabase.
-- Guarda os pedidos de adoção enviados pelo formulário público em /adocao.
-- ============================================================================

create table if not exists public.adocao_solicitacoes (
  id uuid not null default gen_random_uuid(),
  animal_id text,
  animal_nome text,
  nome text not null,
  cpf text,
  telefone text,
  rua text,
  numero text,
  bairro text,
  cidade text,
  cep text,
  status text default 'nova',
  created_at timestamp with time zone default now(),
  constraint adocao_solicitacoes_pkey primary key (id)
);

create index if not exists idx_adocao_solicitacoes_created_at
  on public.adocao_solicitacoes (created_at desc);

-- ---------------------------------------------------------------------------
-- POLÍTICAS RLS
-- Leitura e escrita liberadas para a chave pública (mesmo modelo das demais
-- tabelas do projeto). O INSERT vem do formulário público; a leitura é usada
-- pelo painel administrativo.
-- ---------------------------------------------------------------------------
alter table public.adocao_solicitacoes enable row level security;

drop policy if exists "adocao_solicitacoes_select" on public.adocao_solicitacoes;
drop policy if exists "adocao_solicitacoes_insert" on public.adocao_solicitacoes;
drop policy if exists "adocao_solicitacoes_update" on public.adocao_solicitacoes;
drop policy if exists "adocao_solicitacoes_delete" on public.adocao_solicitacoes;

create policy "adocao_solicitacoes_select" on public.adocao_solicitacoes
  for select using (true);
create policy "adocao_solicitacoes_insert" on public.adocao_solicitacoes
  for insert with check (true);
create policy "adocao_solicitacoes_update" on public.adocao_solicitacoes
  for update using (true);
create policy "adocao_solicitacoes_delete" on public.adocao_solicitacoes
  for delete using (true);
