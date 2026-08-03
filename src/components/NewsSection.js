'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link'; 
import { getDbNoticias, converterParaDate } from '@/data/noticiasData'; 
import styles from './NewsSection.module.css';

export default function NewsSection() {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarNoticias() {
      setLoading(true);
      const db = await getDbNoticias();
      
      const lista = Object.keys(db)
        .map((chave) => ({
          id: chave,
          ...db[chave]
        }))
        // Ordena da mais recente para a mais antiga
        .sort((a, b) => converterParaDate(b.data).getTime() - converterParaDate(a.data).getTime());

      // Pega as 3 mais recentes
      setNoticias(lista.slice(0, 3));
      setLoading(false);
    }

    carregarNoticias();
  }, []);

  if (loading) {
    return (
      <section className={styles.newsSection}>
        <div className={styles.container}>
          <p style={{ textAlign: 'center', color: '#004066', fontWeight: 'bold' }}>
            Carregando notícias da saúde...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.newsSection}>
      <div className={styles.container}>
        
        {/* CABEÇALHO DA SEÇÃO */}
        <div className={styles.headerArea}>
          <div>
            <span className={styles.subtitle}>INFORMAÇÃO E TRANSPARÊNCIA</span>
            <h2 className={styles.title}>Últimas Notícias da Saúde</h2>
          </div>
          <Link href="/noticias" className={styles.seeAllLink}>
            Ver todas as notícias →
          </Link>
        </div>

        {/* GRELHA DE NOTÍCIAS */}
        <div className={styles.newsGrid}>
          {noticias.map((noticia) => (
            <Link className={styles.newsCard} href={`/noticias/${noticia.id}`} key={noticia.id}>
              
              {/* IMAGEM DO CARD */}
              <div className={styles.imageWrapper}>
                <Image 
                  alt={noticia.titulo || 'Notícia'} 
                  className={styles.cardImage} 
                  src={noticia.imagem || '/img/noticias/noticia1.jpeg'} 
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  unoptimized 
                />
              </div>
              
              {/* ÁREA DE TEXTO */}
              <div className={styles.cardContent}>
                <div className={styles.metaArea}>
                  <span className={styles.categoryTag}>
                    {noticia.categoria}
                  </span>
                  <span className={styles.dateText}>{noticia.data}</span>
                </div>                                        
                <h3 className={styles.cardTitle}>{noticia.titulo}</h3>
                <p className={styles.cardDescription}>{noticia.resumo}</p>                                        
                <span className={styles.readMore}>Ler mais →</span>
              </div>

            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}