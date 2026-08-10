'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, 
  Calendar, 
  FileText, 
  Phone, 
  Newspaper, 
  Dog, 
  Syringe, 
  ArrowRight 
} from 'lucide-react';

import { dbEventos } from '@/data/eventosData';
import { getDbNoticias } from '@/data/noticiasData'; 
import { listaContatos } from '@/data/contatosData';
import { servicos } from '@/data/servicosData';

import styles from './Busca.module.css';

// URL DO GOOGLE APPS SCRIPT DO CCZ (Para busca de animais em tempo real)
const CCZ_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzoGz1c0Q2cRICMbJ7dSA-xp_UPL7O_W2BDojgHKbY_gMdK4aVUCSAxOJHd_o2j6ja8YQ/exec"; // Caso use variável de ambiente, use: process.env.NEXT_PUBLIC_SCRIPT_CCZ_URL

// FUNÇÃO AUXILIAR QUE REMOVE ACENTOS E CONVERTE PARA MINÚSCULAS
function normalizarTexto(texto) {
  if (!texto) return '';
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

// Função para renderizar as Badges coloridas por Categoria
function renderCategoryBadge(categoria) {
  switch (categoria) {
    case 'Evento':
      return <span className={styles.badgeEvento}><Calendar size={12} /> Evento</span>;
    case 'Notícia':
      return <span className={styles.badgeNoticia}><Newspaper size={12} /> Notícia</span>;
    case 'Adoção':
      return <span className={styles.badgeAdocao}><Dog size={12} /> Adoção CCZ</span>;
    case 'Contato':
      return <span className={styles.badgeContato}><Phone size={12} /> Guia de Contato</span>;
    case 'Serviço':
      return <span className={styles.badgeServico}><FileText size={12} /> Serviço</span>;
    case 'Vacinação':
      return <span className={styles.badgeVacina}><Syringe size={12} /> Vacinação</span>;
    default:
      return <span className={styles.badgeGeral}>{categoria}</span>;
  }
}

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  
  const [inputBusca, setInputBusca] = useState(query);
  const [noticiasState, setNoticiasState] = useState({});
  const [animaisState, setAnimaisState] = useState([]);
  const [loading, setLoading] = useState(true);

  // Busca Notícias e Animais atualizados em tempo real via Google Sheets
  useEffect(() => {
    async function carregarDadosDinamicos() {
      setLoading(true);
      try {
        // 1. Busca Notícias
        const dbNoticiasAtualizado = await getDbNoticias();
        setNoticiasState(dbNoticiasAtualizado || {});

        // 2. Busca Animais do CCZ (Google Sheets)
        const urlScript = process.env.NEXT_PUBLIC_SCRIPT_CCZ_URL || CCZ_SCRIPT_URL;
        if (urlScript) {
          const resAnimais = await fetch(urlScript);
          const jsonAnimais = await resAnimais.json();
          if (jsonAnimais && jsonAnimais.status === 'success') {
            setAnimaisState(jsonAnimais.animais || []);
          }
        }
      } catch (err) {
        console.error("Erro ao carregar dados dinâmicos para a busca:", err);
      } finally {
        setLoading(false);
      }
    }

    carregarDadosDinamicos();
  }, []);

  const handleRefazerBusca = (e) => {
    e.preventDefault();
    if (inputBusca.trim()) {
      router.push(`/busca?q=${encodeURIComponent(inputBusca.trim())}`);
    }
  };

  const termo = normalizarTexto(query.trim());

  // --- VARREDURA NAS BASES DE DADOS ---

  // 1. CARTA DE SERVIÇOS 
  const baseServicos = Array.isArray(servicos) ? servicos : Object.values(servicos || {});
  const servicosEncontrados = termo ? baseServicos.filter(s => {
    const bateId = normalizarTexto(s.id).includes(termo);
    const bateTitulo = normalizarTexto(s.title || s.titulo).includes(termo);
    const bateDesc = normalizarTexto(s.desc || s.descricao).includes(termo);

    return bateId || bateTitulo || bateDesc;
  }).map(s => ({
    id: `srv-${s.id}`,
    categoria: 'Serviço',
    titulo: s.title || s.titulo,
    resumo: (s.desc || s.descricao || '').length > 180 ? `${(s.desc || s.descricao).substring(0, 180)}...` : (s.desc || s.descricao),
    url: `/servicos/${s.id}`
  })) : [];

  // 2. GUIA DE CONTATOS / UNIDADES DE SAÚDE
  const contatosEncontrados = termo ? (listaContatos || []).filter(c =>
    normalizarTexto(c.nome).includes(termo) ||
    normalizarTexto(c.endereco).includes(termo) ||
    normalizarTexto(c.categoria).includes(termo)
  ).map(c => ({
    id: `ct-${c.id}`,
    categoria: 'Contato',
    titulo: c.nome,
    resumo: `Endereço: ${c.endereco} | Telefone: ${c.telefone || 'Não informado'}`,
    url: '/contatos'
  })) : [];

  // 3. NOTÍCIAS (Google Sheets)
  const noticiasEncontradas = termo ? Object.keys(noticiasState).map(id => ({
    id,
    ...noticiasState[id]
  })).filter(n =>
    normalizarTexto(n.titulo).includes(termo) ||
    normalizarTexto(n.resumo).includes(termo) ||
    normalizarTexto(n.categoria).includes(termo)
  ).map(n => ({
    id: `not-${n.id}`,
    categoria: 'Notícia',
    titulo: n.titulo,
    resumo: n.resumo,
    url: `/noticias/${n.id}`
  })) : [];

  // 4. EVENTOS
  const eventosEncontrados = termo ? (dbEventos || []).filter(e =>
    normalizarTexto(e.titulo).includes(termo) ||
    normalizarTexto(e.resumo).includes(termo) ||
    normalizarTexto(e.descricao).includes(termo)
  ).map(e => ({
    id: `evt-${e.id}`,
    categoria: 'Evento',
    titulo: e.titulo,
    resumo: e.resumo,
    url: `/eventos/${e.id}`
  })) : [];

  // 5. ANIMAIS PARA ADOÇÃO (Google Sheets / CCZ)
  const animaisEncontrados = termo ? (animaisState || []).filter(a =>
    normalizarTexto(a.nome).includes(termo) ||
    normalizarTexto(a.especie).includes(termo) ||
    normalizarTexto(a.descricao).includes(termo)
  ).map(a => ({
    id: `ani-${a.id}`,
    categoria: 'Adoção',
    titulo: `Animal para Adoção: ${a.nome} (${a.especie})`,
    resumo: a.descricao || 'Animal cadastrado para adoção responsável no CCZ.',
    url: '/adocao'
  })) : [];

  // CONSOLIDAÇÃO DE TODOS OS RESULTADOS
  const todosResultados = [
    ...servicosEncontrados,
    ...contatosEncontrados,
    ...noticiasEncontradas,
    ...eventosEncontrados,
    ...animaisEncontrados
  ];

  return (
    <div className={styles.pageWrapper}>
      
      {/* 1. HERO BANNER DA PÁGINA DE BUSCA */}
      <section className={styles.heroBanner}>
        <div className={styles.container}>
          <span className={styles.heroBadge}>🔍 Portal da Saúde</span>
          <h1 className={styles.heroTitle}>Resultados da Pesquisa</h1>
        </div>
      </section>

      {/* 2. BARRA DE NAVEGAÇÃO DE VOLTAR */}
      <div className={styles.navigationBar}>
        <div className={styles.container}>
          <Link href="/" className={styles.backLink}>
            ← Voltar para a Página Principal
          </Link>
        </div>
      </div>

      <main className={styles.mainContent}>
        <div className={styles.container}>

          {/* CAMPO DE FORMULÁRIO PARA REFAZER A BUSCA */}
          <form onSubmit={handleRefazerBusca} className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Pesquisar novamente em todo o site..."
              value={inputBusca}
              onChange={(e) => setInputBusca(e.target.value)}
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchBtn}>Buscar</button>
          </form>

          {/* MENSAGEM COM RESULTADOS */}
          <div className={styles.headerInfo}>
            {loading ? (
              <p>Carregando informações do portal...</p>
            ) : query ? (
              <p>Encontramos <strong>{todosResultados.length}</strong> resultado(s) para: <strong>{`"${query}"`}</strong></p>
            ) : (
              <p>Digite algo no campo acima para realizar a busca no portal.</p>
            )}
          </div>

          {/* EXIBIÇÃO DOS RESULTADOS */}
          {todosResultados.length > 0 ? (
            <div className={styles.resultsList}>
              {todosResultados.map((item) => (
                <div key={item.id} className={styles.resultCard}>
                  <div className={styles.cardHeaderRow}>
                    {renderCategoryBadge(item.categoria)}
                  </div>
                  <h3 className={styles.cardTitle}>{item.titulo}</h3>
                  <p className={styles.cardResumo}>{item.resumo}</p>
                  <Link href={item.url} className={styles.cardLink}>
                    Acessar informações <ArrowRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            query && !loading && (
              <div className={styles.emptyState}>
                <Search size={48} className={styles.emptyIcon} />
                <h2>Nenhum resultado encontrado</h2>
                <p>Não encontramos nenhum registro correspondente a {`"${query}"`}.</p>
                <Link href="/" className={styles.backHomeBtn}>Voltar para a página inicial</Link>
              </div>
            )
          )}

        </div>
      </main>
    </div>
  );
}

function BuscaWrapper() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  return <SearchResultsContent key={query} />;
}

export default function BuscaPage() {
  return (
    <Suspense fallback={<div>Buscando em todo o site...</div>}>
      <BuscaWrapper />
    </Suspense>
  );
}