'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { dbEventos as dbEventosLocal, getStatusEvento } from '@/data/eventosData';
import styles from './Eventos.module.css';
import { Search } from 'lucide-react';

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx1tWcH_pkyhUNdR1safUWAGrlNfJWSMRqSps09p7yc5lBXO2c5iEGJXQl5Sz2bmPex/exec';

function timestampSeguro(dataBruta) {
  if (!dataBruta) return 0;
  const str = String(dataBruta).trim();

  if (str.includes('/')) {
    const partes = str.split('/');
    if (partes.length === 3) {
      return new Date(`${partes[2]}-${partes[1]}-${partes[0]}T00:00:00`).getTime() || 0;
    }
  }

  const t = new Date(str.includes('T') ? str : `${str}T00:00:00`).getTime();
  return isNaN(t) ? 0 : t;
}

// FORMATAÇÃO VISUAL DA DATA NO CARD
function formatarDataCard(dataBruta) {
  if (!dataBruta) return '';
  const strData = String(dataBruta).trim();

  if (strData.includes('/')) return strData;

  if (strData.includes('-')) {
    const partes = strData.split('T')[0].split('-');
    if (partes.length === 3) {
      return `${partes[2].padStart(2, '0')}/${partes[1].padStart(2, '0')}/${partes[0]}`;
    }
  }

  return strData;
}

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
  const [eventos, setEventos] = useState(dbEventosLocal || []);
  const ITENS_POR_PAGINA = 9;

  useEffect(() => {
    async function carregarEventosOnline() {
      // 1. Lê o cache se existir
      const cachedData = localStorage.getItem('cache_portal_eventos');
      if (cachedData) {
        try {
          const parsed = JSON.parse(cachedData);
          if (Array.isArray(parsed)) {
            setEventos(parsed);
          }
        } catch (e) {
          console.error('Erro ao ler cache de eventos:', e);
        }
      }

      // 2. Busca a lista atualizada do servidor de eventos
      try {
        const response = await fetch(`${SCRIPT_URL}?target=EVENT&action=GET_ALL`);
        const resData = await response.json();
        
        if (resData.status === 'success' && Array.isArray(resData.eventos)) {
          setEventos(resData.eventos);
          localStorage.setItem('cache_portal_eventos', JSON.stringify(resData.eventos));
        }
      } catch (err) {
        console.error('Erro ao buscar eventos online:', err);
      }
    }

    carregarEventosOnline();
  }, []);

  const handleBusca = (valor) => {
    setBusca(valor);
    setPaginaAtual(1);
  };

  const handleSubmeterBusca = (e) => {
    e.preventDefault();
  };

  // ORDENAÇÃO SEGURA SEM INVALID DATE
  const eventosOrdenados = [...eventos].sort((a, b) => {
    return timestampSeguro(b.data) - timestampSeguro(a.data);
  });

  const termo = normalizarTexto(busca.trim());

  // FILTRAGEM
  const eventosFiltrados = eventosOrdenados.filter(e => {
    if (!termo) return true; 
    const bateTitulo = normalizarTexto(e.titulo).includes(termo);
    const bateResumo = normalizarTexto(e.resumo || e.descricao).includes(termo);
    const bateDescricao = normalizarTexto(e.descricao).includes(termo);

    return bateTitulo || bateResumo || bateDescricao;
  });

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

      <div className={styles.navigationBar}>
        <div className={styles.container}>
          <Link href="/" className={styles.backLink}>
            ← Voltar para a Página Principal
          </Link>
        </div>
      </div>

      <main className={styles.mainContent}>
        <div className={styles.container}> 
          
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
                  const dataFormatada = formatarDataCard(evento.data);
                  
                  return (
                    <Link key={evento.id} href={`/eventos/${evento.id}`} className={styles.eventoCard}>
                      <div className={styles.cardImageWrapper}>
                        <Image 
                          src={evento.imgSrc || evento.imagem || '/img/eventos/simposio.png'} 
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
                        {dataFormatada && (
                          <span className={styles.eventoData}>📅 {dataFormatada}</span>
                        )}
                        <h3 className={styles.cardTitle}>{evento.titulo}</h3>
                        <p className={styles.cardResumo}>
                          {evento.resumo || (evento.descricao ? evento.descricao.substring(0, 100) + '...' : '')}
                        </p>
                        
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
              <p>{termo ? `Não encontramos nenhum evento correspondente a "${busca}".` : 'Nenhum evento cadastrado no momento.'}</p>
              {termo && (
                <button className={styles.resetBtn} onClick={() => handleBusca('')}>
                  Limpar busca
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}