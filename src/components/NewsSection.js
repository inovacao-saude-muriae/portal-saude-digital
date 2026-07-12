"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link'; 
import { dbNoticias } from '@/app/noticias/page'; // Puxa o banco de dados oficial das notícias
import styles from './NewsSection.module.css';

// Dicionário para converter o nome dos meses por extenso para número indexável pelo JS
const mesesMap = {
  jan: 0, fev: 1, mar: 2, abr: 3, mai: 4, jun: 5,
  jul: 6, ago: 7, set: 8, out: 9, nov: 10, dez: 11
};

// Função auxiliar que transforma "28 Mar 2026" em um objeto Date comparável
const converterParaDate = (dataString) => {
  if (!dataString) return new Date(0);
  const [dia, mesTexto, ano] = dataString.toLowerCase().split(' ');
  const mesNumero = mesesMap[mesTexto] || 0;
  return new Date(parseInt(ano), mesNumero, parseInt(dia));
};

export default function NewsSection() {
  // Converte o objeto dbNoticias em array, ordena por data cronológica e pega as 3 mais recentes
  const noticiasHome = Object.keys(dbNoticias)
    .map((chave) => ({
      id: chave,
      ...dbNoticias[chave]
    }))
    .sort((a, b) => {
      // Ordenação decrescente: o maior timestamp (mais novo) fica no topo do array
      return converterParaDate(b.data).getTime() - converterParaDate(a.data).getTime();
    })
    .slice(0, 3); // Corta e isola apenas as 3 primeiras notícias ordenadas

  return (
    <section className={styles.newsSection}>
      <div className={styles.container}>
        
        {/* CABEÇALHO DA SECÇÃO */}
        <div className={styles.headerArea}>
          <div className={styles.titleBlock}>
            <span className={styles.subtitle}>NOTÍCIAS</span>
            <h2 className={styles.title}>Últimas atualizações</h2>
          </div>
          <Link href="/noticias" className={styles.seeAllLink}>
            Todas as notícias <span>→</span>
          </Link>
        </div>

        {/* GRELHA DE CARTÕES DINÂMICOS POR DATA */}
        <div className={styles.newsGrid}>
          {noticiasHome.map((item, idx) => (
            <article key={item.id} className={styles.newsCard}>
              
              {/* MOLDURA DA IMAGEM */}
              <div className={styles.imageWrapper}>
                <Image
                  src={item.imagem} 
                  alt={item.titulo} 
                  fill
                  unoptimized // Mantém a compatibilidade com caminhos locais no Turbopack
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 380px"
                  className={styles.cardImage}
                  priority={idx === 0}
                />
              </div>

              {/* CONTEÚDO DO CARTÃO */}
              <div className={styles.cardContent}>
                <div className={styles.metaArea}>
                  {item.categoria && (
                    <span className={`${styles.categoryTag} ${item.classCategoria}`}>
                      {item.categoria}
                    </span>
                  )}
                  <span className={styles.dateText}>{item.data}</span>
                </div>
                
                <h3 className={styles.cardTitle}>{item.titulo}</h3>
                <p className={styles.cardDescription}>{item.resumo}</p>
                
                <Link href={`/noticias/${item.id}`} className={styles.readMore}>
                  Ler mais <span>→</span>
                </Link>
              </div>

            </article>
          ))}
        </div>

      </div>
    </section>
  );
}