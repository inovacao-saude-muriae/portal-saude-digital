'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { dbEventos, getStatusEvento } from '@/data/eventosData';
import styles from './Eventos.module.css';
import { Search } from 'lucide-react';

// FUNÇÃO AUXILIAR QUE REMOVE ACENTOS E CONVERTE PARA MINÚSCULAS
function normalizarTexto(texto) {
  if (!texto) return '';
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export default function EventosPage() {
  const [busca, setBusca] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const ITENS_POR_PAGINA = 9;

  const handleBusca = (valor) => {
    setBusca(valor);
    setPaginaAtual(1);
  };

  const handleSubmeterBusca = (e) => {
    e.preventDefault();
  };

  // Ordena por data mais recente
  const eventosOrdenados = [...dbEventos].sort((a, b) => new Date(b.data) - new Date(a.data));

  // Filtragem que ignora acentos e diferença de maiúsculas/minúsculas
  const termo = normalizarTexto(busca.trim());

  const eventosFiltrados = eventosOrdenados.filter(e => {
    const bateTitulo = normalizarTexto(e.titulo).includes(termo);
    const bateResumo = normalizarTexto(e.resumo).includes(termo);
    const bateDescricao = normalizarTexto(e.descricao).includes(termo);

    return bateTitulo || bateResumo || bateDescricao;
  });

  // Lógica de Paginação
  const totalPaginas = Math.ceil(eventosFiltrados.length / ITENS_POR_PAGINA);
  const inicioIndice = (paginaAtual - 1) * ITENS_POR_PAGINA;
  const eventosPagina = eventosFiltrados.slice(inicioIndice, inicioIndice + ITENS_POR_PAGINA);

  const handleMudarPagina = (novaPagina) => {
    if (novaPagina >= 1 && novaPagina <= totalPaginas) {
      setPaginaAtual(novaPagina);
      window.scrollTo({ top: 200, behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.pageWrapper}>
      
      {/* 1. HERO BANNER (PADRÃO DAS DEMAIS PÁGINAS INSTITUCIONAIS) */}
      <section 
        className={styles.heroBanner}
        style={{ backgroundImage: "url('/img/banner-header.png')" }}
      >
        <div className={styles.overlay}>
          <div className={styles.container}>
            <span className={styles.heroSubtitle}>AGENDA & REGISTROS</span>
            <h1 className={styles.heroTitle}>Eventos da Saúde</h1>
            <p className={styles.heroDesc}>
              Acompanhe simpósios, inaugurações, encontros e capacitações promovidos pela Secretaria Municipal de Saúde.
            </p>
          </div>
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

      {/* 3. CONTEÚDO PRINCIPAL */}
      <main className={styles.mainContent}>
        <div className={styles.container}> 
          
          {/* BARRA DE PESQUISA COMPACTA */}
          <form onSubmit={handleSubmeterBusca} className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Pesquisar eventos" 
              value={busca}
              onChange={(e) => handleBusca(e.target.value)}
              className={styles.searchInput}
            />
            {busca && (
              <button 
                type="button" 
                className={styles.clearBtn} 
                onClick={() => handleBusca('')}
                title="Limpar busca"
              >
                ✕
              </button>
            )}
            <button type="submit" className={styles.searchBtn}>Buscar</button>
          </form>

          {eventosPagina.length > 0 ? (
            <>
              <div className={styles.eventosGrid}>
                {eventosPagina.map((evento) => {
                  const status = getStatusEvento(evento, styles);
                  const dataFormatada = new Date(`${evento.data}T00:00:00`).toLocaleDateString('pt-BR');
                  
                  return (
                    /* CARD INTEIRO TRANSFORMADO EM LINK */
                    <Link key={evento.id} href={`/eventos/${evento.id}`} className={styles.eventoCard}>
                      <div className={styles.cardImageWrapper}>
                        <Image 
                          src={evento.imgSrc} 
                          alt={evento.titulo} 
                          width={400} 
                          height={240} 
                          unoptimized 
                          className={styles.cardImage}
                        />
                        <span className={`${styles.statusBadge} ${status.class}`}>
                          {status.label}
                        </span>
                      </div>

                      <div className={styles.cardBody}>
                        <span className={styles.eventoData}>📅 {dataFormatada}</span>
                        <h3 className={styles.cardTitle}>{evento.titulo}</h3>
                        <p className={styles.cardResumo}>{evento.resumo}</p>
                        
                        <span className={styles.cardBtn}>
                          Ver detalhes do evento →
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {totalPaginas > 1 && (
                <div className={styles.paginationContainer}>
                  <button 
                    className={styles.paginationNavBtn} 
                    disabled={paginaAtual === 1}
                    onClick={() => handleMudarPagina(paginaAtual - 1)}
                  >
                    ← Anterior
                  </button>

                  <div className={styles.paginationNumbers}>
                    {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((numPage) => (
                      <button 
                        key={numPage} 
                        className={`${styles.pageNumberBtn} ${numPage === paginaAtual ? styles.activePageNumber : ''}`}
                        onClick={() => handleMudarPagina(numPage)}
                      >
                        {numPage}
                      </button>
                    ))}
                  </div>

                  <button 
                    className={styles.paginationNavBtn} 
                    disabled={paginaAtual === totalPaginas}
                    onClick={() => handleMudarPagina(paginaAtual + 1)}
                  >
                    Próximo →
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className={styles.emptyState}>
              <Search size={40} className={styles.emptyIcon} />
              <h3>Nenhum evento encontrado</h3>
              <p>Não encontramos nenhum evento correspondente a {`"${busca}"`}.</p>
              <button className={styles.resetBtn} onClick={() => handleBusca('')}>
                Limpar busca
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}