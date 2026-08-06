'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Hero.module.css';

const SCRIPT_URL = process.env.NEXT_PUBLIC_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbx1tWcH_pkyhUNdR1safUWAGrlNfJWSMRqSps09p7yc5lBXO2c5iEGJXQl5Sz2bmPex/exec';

const VALORES_PADRAO = {
  c1Val: '4.375', c1Text: 'Nº de Agendamentos em Consultas',
  c2Val: '1.319', c2Text: 'Nº de Faltas em Consultas',
  c3Val: '4.149', c3Text: 'Nº de Agendamentos em Exames',
  c4Val: '1.199', c4Text: 'Nº de Faltas em Exames'
};

export default function Hero() {
  const [stats, setStats] = useState(() => {
    if (typeof window === 'undefined') return VALORES_PADRAO;
    try {
      const cache = localStorage.getItem('cache_hero_stats');
      if (cache) {
        const dados = JSON.parse(cache);
        if (dados && typeof dados === 'object') {
          return {
            c1Val: String(dados.c1Val || VALORES_PADRAO.c1Val),
            c1Text: String(dados.c1Text || VALORES_PADRAO.c1Text),
            c2Val: String(dados.c2Val || VALORES_PADRAO.c2Val),
            c2Text: String(dados.c2Text || VALORES_PADRAO.c2Text),
            c3Val: String(dados.c3Val || VALORES_PADRAO.c3Val),
            c3Text: String(dados.c3Text || VALORES_PADRAO.c3Text),
            c4Val: String(dados.c4Val || VALORES_PADRAO.c4Val),
            c4Text: String(dados.c4Text || VALORES_PADRAO.c4Text)
          };
        }
      }
    } catch {
      // Ignora erro
    }
    return VALORES_PADRAO;
  });

  useEffect(() => {
    let cancelado = false;

    async function carregarOnline() {
      if (!SCRIPT_URL) return;

      try {
        const res = await fetch(`${SCRIPT_URL}?action=GET_HERO_STATS`);
        const data = await res.json();

        if (!cancelado && data && data.status === 'success' && data.stats) {
          const novasStats = {
            c1Val: String(data.stats.c1Val || VALORES_PADRAO.c1Val),
            c1Text: String(data.stats.c1Text || VALORES_PADRAO.c1Text),
            c2Val: String(data.stats.c2Val || VALORES_PADRAO.c2Val),
            c2Text: String(data.stats.c2Text || VALORES_PADRAO.c2Text),
            c3Val: String(data.stats.c3Val || VALORES_PADRAO.c3Val),
            c3Text: String(data.stats.c3Text || VALORES_PADRAO.c3Text),
            c4Val: String(data.stats.c4Val || VALORES_PADRAO.c4Val),
            c4Text: String(data.stats.c4Text || VALORES_PADRAO.c4Text)
          };

          setStats(novasStats);
          localStorage.setItem('cache_hero_stats', JSON.stringify(novasStats));
        }
      } catch (err) {
        console.warn('Usando estatísticas do cache/padrão:', err);
      }
    }

    carregarOnline();

    return () => {
      cancelado = true;
    };
  }, []);

  return (
    <section className={styles.heroSection}>
      <div className={styles.container}>
        
        {/* LADO ESQUERDO */}
        <div className={styles.heroLeft}>
          <div className={styles.tagCidadao}>
            <span className={styles.dot}></span> Portal do Cidadão
          </div>
          
          <h1 className={styles.title}>
            Você conhece o Saúde Digital Muriaé?
          </h1>
          
          <p className={styles.description}>
            O aplicativo da Secretaria de Saúde de Muriaé, feito para você!
          </p>
          
          <div className={styles.buttonGroup}>
            <Link href="/servicos/aplicativos" className={styles.btnPrimary}>
              Conheça <span>→</span>
            </Link>
            <Link href="/servicos" className={styles.btnSecondary}>
              Nossos Serviços
            </Link>
          </div>
        </div>

        {/* LADO DIREITO: CARDS GLASSMORPHISM */}
        <div className={styles.heroRight}>
          <div className={styles.glassGrid}>
            <div className={styles.glassCard}>
              <h2>{stats.c1Val}</h2>
              <p>{stats.c1Text}</p>
            </div>
            <div className={styles.glassCard}>
              <h2>{stats.c2Val}</h2>
              <p>{stats.c2Text}</p>
            </div>
            <div className={styles.glassCard}>
              <h2>{stats.c3Val}</h2>
              <p>{stats.c3Text}</p>
            </div>
            <div className={styles.glassCard}>
              <h2>{stats.c4Val}</h2>
              <p>{stats.c4Text}</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}