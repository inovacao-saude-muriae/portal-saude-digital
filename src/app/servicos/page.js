"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import { servicos } from '@/data/servicosData';
import styles from './ServicesPage.module.css';

// Função auxiliar para remover acentos e facilitar a busca
function normalizarTexto(texto) {
  if (!texto) return '';
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export default function ServicesPage() {
  const [busca, setBusca] = useState('');

  const termo = normalizarTexto(busca.trim());

  const servicosFiltrados = servicos.filter((item) => {
    const bateTitulo = normalizarTexto(item.title).includes(termo);
    const bateDesc = normalizarTexto(item.desc).includes(termo);
    const bateId = normalizarTexto(item.id).includes(termo);

    return bateTitulo || bateDesc || bateId;
  });

  const handleSubmeterBusca = (e) => {
    e.preventDefault();
  };

  return (
    <div className={styles.pageWrapper}>
      
      {/* 1. BANNER DE TOPO */}
      <section 
        className={styles.heroBanner}
        style={{ backgroundImage: "url('/img/banner-header.png')" }} 
      >
        <div className={styles.overlay}>
          <div className={styles.container}>
            <span className={styles.heroSubtitle}>INSTITUCIONAL</span>
            <h1 className={styles.heroTitle}>Nossos Serviços</h1>
            <p className={styles.heroDesc}>
              Uma rede completa de cuidado, gratuita e acessível a todos os moradores do município.
            </p>
          </div>
        </div>
      </section>

      {/* 2. BARRA DE NAVEGAÇÃO SUPERIOR */}
      <div className={styles.navigationBar}>
        <div className={styles.container}>
          <Link href="/" className={styles.backLink}>
            ← Voltar para a Página Principal
          </Link>
        </div>
      </div>

      {/* 3. CONTEÚDO CENTRAL */}
      <section className={styles.contentSection}>
        <div className={styles.container}>                

          {/* CAMPO DE BUSCA INTERATIVO */}
          <form onSubmit={handleSubmeterBusca} className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Buscar serviço"
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
                <X size={18} />
              </button>
            )}
            <button type="submit" className={styles.searchBtn}>Buscar</button>
          </form>

          {/* FEEDBACK DE RESULTADOS */}
          <div className={styles.introBlock}>
            {busca ? (
              <p className={styles.searchResultText}>
                Exibindo <strong>{servicosFiltrados.length}</strong> resultado(s) para <strong>&quot;{busca}&quot;</strong>:
              </p>
            ) : (
              <p>
                A Secretaria Municipal de Saúde oferece um amplo conjunto de serviços organizados em 
                diferentes níveis de atenção, com o objetivo de garantir atendimento integral em todas as 
                etapas da vida do cidadão.
              </p>
            )}
          </div>

          {/* GRELHA DE CARDS COM LINK PARA AS PASTAS DEDICADAS */}
          {servicosFiltrados.length > 0 ? (
            <div className={styles.servicesGrid}>
              {servicosFiltrados.map((item) => (
                <Link 
                  key={item.id} 
                  href={`/servicos/${item.id}`} 
                  className={styles.serviceCard}
                >
                  <div className={styles.iconBox}>
                    {item.icon}
                  </div>
                  <h2 className={styles.cardTitle}>{item.title}</h2>
                  <p className={styles.cardDesc}>{item.desc}</p>
                  
                  <span className={styles.cardLink}>
                    Saiba mais <span>→</span>
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <Search size={40} className={styles.emptyIcon} />
              <h3>Nenhum serviço encontrado</h3>
              <p>Não encontramos nenhum serviço correspondente a &quot;{busca}&quot;.</p>
              <button className={styles.resetBtn} onClick={() => setBusca('')}>
                Limpar busca
              </button>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}