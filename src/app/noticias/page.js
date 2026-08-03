'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { getDbNoticias, converterParaDate } from '@/data/noticiasData';
import styles from './Noticias.module.css';

const categoriaClassMap = {
  infra: styles.catInfra,
  vacinacao: styles.catVacinacao
};

function normalizarTexto(texto) {
  if (!texto) return '';
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export default function NoticiasPage() {
  const [busca, setBusca] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [listaNoticias, setListaNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const ITENS_POR_PAGINA = 9;

  // BUSCA AS NOTÍCIAS DO GOOGLE SHEETS AO CARREGAR A PÁGINA
  useEffect(() => {
    async function carregarDados() {
      setLoading(true);
      const db = await getDbNoticias();
      
      const lista = Object.keys(db)
        .map((chave) => ({
          id: chave,
          ...db[chave]
        }))
        .sort((a, b) => converterParaDate(b.data).getTime() - converterParaDate(a.data).getTime());

      setListaNoticias(lista);
      setLoading(false);
    }

    carregarDados();
  }, []);

  const handleBusca = (valor) => {
    setBusca(valor);
    setPaginaAtual(1);
  };

  const termo = normalizarTexto(busca.trim());

  const noticiasFiltradas = listaNoticias.filter((noticia) => {
    const bateTitulo = normalizarTexto(noticia.titulo).includes(termo);
    const bateResumo = normalizarTexto(noticia.resumo).includes(termo);
    const bateCategoria = normalizarTexto(noticia.categoria).includes(termo);

    return bateTitulo || bateResumo || bateCategoria;
  });

  const totalPaginas = Math.ceil(noticiasFiltradas.length / ITENS_POR_PAGINA);
  const inicioIndice = (paginaAtual - 1) * ITENS_POR_PAGINA;
  const noticiasPagina = noticiasFiltradas.slice(inicioIndice, inicioIndice + ITENS_POR_PAGINA);

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
            <span className={styles.heroSubtitle}>INSTITUCIONAL</span>
            <h1 className={styles.heroTitle}>Notícias da Saúde</h1>
            <p className={styles.heroDesc}>
              Aqui você encontra as atualizações mais recentes sobre serviços, campanhas de vacinação e ações da Secretaria de Saúde.
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

      <section className={styles.contentSection}>
        <div className={styles.container}> 
          
          <form onSubmit={(e) => e.preventDefault()} className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Buscar notícias..." 
              value={busca}
              onChange={(e) => handleBusca(e.target.value)}
              className={styles.searchInput}
            />
            {busca && (
              <button 
                type="button" 
                className={styles.clearBtn} 
                onClick={() => handleBusca('')}
              >
                ✕
              </button>
            )}
            <button type="submit" className={styles.searchBtn}>Buscar</button>
          </form>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#0065a4' }}>
              <h3>Carregando notícias atualizadas...</h3>
            </div>
          ) : noticiasPagina.length > 0 ? (
            <>
              <div className={styles.gridNoticias}>
                {noticiasPagina.map((noticia) => {
                  const classCategoriaCss = categoriaClassMap[noticia.tipoCategoria] || styles.catInfra;

                  return (
                    <Link className={styles.cardNoticia} href={`/noticias/${noticia.id}`} key={noticia.id}>
                      <div className={styles.capsulaImagem}>
                        <Image 
                          alt={noticia.titulo} 
                          className={styles.imagemNoticiaSrc} 
                          height={200} 
                          src={noticia.imagem || '/img/noticias/noticia1.jpeg'} 
                          unoptimized 
                          width={360}
                        />
                      </div>
                      
                      <div className={styles.infoCard}>
                        <div className={styles.metaRow}>
                          <span className={`${styles.badgeCategoria} ${classCategoriaCss}`}>
                            {noticia.categoria}
                          </span>
                          <span className={styles.dataText}>{noticia.data}</span>
                        </div>                                        
                        <h2 className={styles.tituloCard}>{noticia.titulo}</h2>
                        <p className={styles.resumoCard}>{noticia.resumo}</p>                                        
                        <span className={styles.leiaMaisBtn}>Ler mais →</span>
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
                    onClick={() => handleMudarPagina(paginaAtual + totalPaginas)}
                  >
                    Próximo →
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className={styles.emptyState}>
              <Search size={40} className={styles.emptyIcon} />
              <h3>Nenhuma notícia encontrada</h3>
              <p>Não encontramos nenhuma notícia correspondente a {`"${busca}"`}.</p>
              <button className={styles.resetBtn} onClick={() => handleBusca('')}>
                Limpar busca
              </button>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}