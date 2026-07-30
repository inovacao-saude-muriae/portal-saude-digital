'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { listaContatos, categoriasContatos } from '@/data/contatosData';
import styles from './Contatos.module.css';

// FUNÇÃO AUXILIAR QUE REMOVE ACENTOS E CONVERTE PARA MINÚSCULAS
function normalizarTexto(texto) {
  if (!texto) return '';
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export default function ContatosPage() {
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");
  const [busca, setBusca] = useState("");

  const handleSubmeterBusca = (e) => {
    e.preventDefault();
  };

  // FILTRAGEM COMBINADA (TEMA + BUSCA IGNORANDO ACENTOS)
  const termo = normalizarTexto(busca.trim());

  const contatosFiltrados = listaContatos.filter((item) => {
    const bateCategoria = categoriaAtiva === "Todos" || item.categoria === categoriaAtiva;
    const bateNome = normalizarTexto(item.nome).includes(termo);
    const bateEndereco = normalizarTexto(item.endereco).includes(termo);
    
    return bateCategoria && (bateNome || bateEndereco);
  });

  return (
    <div className={styles.pageWrapper}>
      
      {/* 1. HERO BANNER */}
      <section 
        className={styles.heroBanner}
        style={{ backgroundImage: "url('/img/banner-paginas.png')" }}
      >
        <div className={styles.overlay}>
          <div className={styles.container}>
            <span className={styles.heroSubtitle}>REDES DE ATENDIMENTO</span>
            <h1 className={styles.heroTitle}>Guia de Contatos da Saúde</h1>
            <p className={styles.heroDesc}>
              Encontre telefones, endereços, e-mails e localizações das Unidades Básicas, Policlínicas e Centros Especializados de Muriaé.
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
      <main className={styles.mainContainer}>
        <div className={styles.container}> 
          
          {/* CAMPO DE PESQUISA COMPACTO E PADRONIZADO */}
          <form onSubmit={handleSubmeterBusca} className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Buscar unidade pelo nome ou endereço..." 
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className={styles.searchInput}
            />
            {busca && (
              <button 
                type="button" 
                className={styles.clearBtn} 
                onClick={() => setBusca('')}
                title="Limpar busca"
              >
                ✕
              </button>
            )}
            <button type="submit" className={styles.searchBtn}>Buscar</button>
          </form>

          {/* FILTROS POR TEMA (ABAS / BOTÕES) */}
          <div className={styles.filterTrack}>
            {categoriasContatos.map((cat) => (
              <button
                key={cat}
                className={`${styles.filterBtn} ${categoriaAtiva === cat ? styles.filterBtnActive : ''}`}
                onClick={() => setCategoriaAtiva(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* LISTA DE CARDS DE CONTATO */}
          {contatosFiltrados.length > 0 ? (
            <div className={styles.contactsGrid}>
              {contatosFiltrados.map((contato) => (
                <div key={contato.id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <span className={styles.categoryBadge}>{contato.categoria}</span>
                    <h3 className={styles.cardTitle}>{contato.nome}</h3>
                  </div>

                  <div className={styles.cardBody}>
                    {contato.telefone && (
                      <div className={styles.infoRow}>
                        <span className={styles.icon}>📞</span>
                        <div>
                          <strong>Telefone</strong>
                          <p>{contato.telefone}</p>
                        </div>
                      </div>
                    )}
                    {contato.endereco && (
                      <div className={styles.infoRow}>
                        <span className={styles.icon}>📍</span>
                        <div>
                          <strong>Endereço</strong>
                          <p>{contato.endereco}</p>
                        </div>
                      </div>
                    )}
                    {contato.email && (
                      <div className={styles.infoRow}>
                        <span className={styles.icon}>✉️</span>
                        <div>
                          <strong>E-mail</strong>
                          <p>{contato.email}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className={styles.cardFooter}>
                    <a
                      href={contato.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.mapsBtn}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      Ver localização no Google Maps ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <Search size={40} className={styles.emptyIcon} />
              <h3>Nenhum contato encontrado</h3>
              <p>Não encontramos nenhuma unidade correspondente aos critérios da sua busca.</p>
              <button 
                className={styles.resetSearchBtn}
                onClick={() => { setBusca(''); setCategoriaAtiva('Todos'); }}
              >
                Limpar Filtros
              </button>
            </div>
          )}

        </div>
      </main>

    </div>
  );
}