'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { dbEventos, getStatusEvento } from '@/data/eventosData';
import styles from './Eventos.module.css';
import { Search } from 'lucide-react';

export default function EventosPage() {
  const [busca, setBusca] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const ITENS_POR_PAGINA = 9;

  const handleBusca = (e) => {
    setBusca(e.target.value);
    setPaginaAtual(1);
  };

  // Ordena por data mais recente
  const eventosOrdenados = [...dbEventos].sort((a, b) => new Date(b.data) - new Date(a.data));

  const eventosFiltrados = eventosOrdenados.filter(e => 
    e.titulo.toLowerCase().includes(busca.toLowerCase()) || 
    e.resumo.toLowerCase().includes(busca.toLowerCase())
  );

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
      <section className={styles.heroBanner}>
        <div className={styles.container}>
          <span className={styles.heroBadge}>📅 Agenda & Registros</span>
          <h1 className={styles.heroTitle}>Eventos da Saúde</h1>
          <p className={styles.heroSubtitle}>
            Acompanhe simpósios, inaugurações, encontros e capacitações promovidos pela Secretaria Municipal de Saúde.
          </p>
        </div>
      </section>

      <main className={styles.mainContent}>
        <div className={styles.container}>
          
          {/* BARRA DE PESQUISA COM ÍCONE VETORIAL */}
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Pesquisar eventos..." 
              value={busca}
              onChange={handleBusca}
              className={styles.searchInput}
            />
          </div>

          {eventosPagina.length > 0 ? (
            <>
              <div className={styles.eventosGrid}>
                {eventosPagina.map((evento) => {
                  const status = getStatusEvento(evento, styles);
                  const dataFormatada = new Date(`${evento.data}T00:00:00`).toLocaleDateString('pt-BR');

                  return (
                    <div key={evento.id} className={styles.eventoCard}>
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
                        
                        <Link href={`/eventos/${evento.id}`} className={styles.cardBtn}>
                          Ver detalhes do evento →
                        </Link>
                      </div>
                    </div>
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
              <p>Não encontramos nenhum evento correspondente à sua pesquisa.</p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}