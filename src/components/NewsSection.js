"use client";

import React from 'react';
import Image from 'next/image';
import styles from './NewsSection.module.css';

export default function NewsSection() {
  // Dados baseados na imagem das suas últimas atualizações
  const newsData = [
    {
      id: 1,
      category: "Vacinação",
      date: "10 Jul 2026",
      title: "Campanha contra a gripe é prorrogada até agosto",
      description: "Doses disponíveis em todas as UBS do município para grupos prioritários.",
      image: "/img/noticias/gripe.jpg", // Substitua pelo caminho correto da sua imagem
    },
    {
      id: 2,
      category: "Saúde da Família",
      date: "05 Jul 2026",
      title: "Nova UBS é inaugurada no bairro Jardim das Flores",
      description: "Unidade amplia a cobertura da Atenção Primária para 12 mil habitantes.",
      image: "/img/noticias/ubs.jpg", // Substitua pelo caminho correto da sua imagem
    },
    {
      id: 3,
      category: "Prevenção",
      date: "01 Jul 2026",
      title: "Julho Amarelo: mutirão de testagem para hepatites",
      description: "Testes rápidos e gratuitos durante todo o mês na policlínica central.",
      image: "/img/noticias/julho-amarelo.jpg", // Substitua pelo caminho correto da sua imagem
    }
  ];

  return (
    <section className={styles.newsSection}>
      <div className={styles.container}>
        
        {/* CABEÇALHO DA SECÇÃO */}
        <div className={styles.headerArea}>
          <div className={styles.titleBlock}>
            <span className={styles.subtitle}>NOTÍCIAS</span>
            <h2 className={styles.title}>Últimas atualizações</h2>
          </div>
          <a href="/noticias" className={styles.seeAllLink}>
            Todas as notícias <span>→</span>
          </a>
        </div>

        {/* GRELHA DE CARTÕES */}
        <div className={styles.newsGrid}>
          {newsData.map((item) => (
            <article key={item.id} className={styles.newsCard}>
              
              {/* MOLDURA DA IMAGEM (Evita o colapso para 0px) */}
              <div className={styles.imageWrapper}>
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 380px"
                  className={styles.cardImage}
                  priority={item.id === 1}
                />
              </div>

              {/* CONTEÚDO DO CARTÃO */}
              <div className={styles.cardContent}>
                <div className={styles.metaArea}>
                  <span className={styles.categoryTag}>{item.category}</span>
                  <span className={styles.dateText}>{item.date}</span>
                </div>
                
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardDescription}>{item.description}</p>
                
                <a href={`/noticias/${item.id}`} className={styles.readMore}>
                  Ler mais <span>→</span>
                </a>
              </div>

            </article>
          ))}
        </div>

      </div>
    </section>
  );
}