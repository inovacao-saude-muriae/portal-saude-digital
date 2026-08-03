'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getDbNoticias } from '@/data/noticiasData';
import styles from './NoticiasDetail.module.css';

export default function NoticiaDetalhePage({ params }) {
  const resolvedParams = use(params);
  const idNoticia = resolvedParams.id;

  const [noticia, setNoticia] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function buscarNoticia() {
      setLoading(true);
      const db = await getDbNoticias();
      setNoticia(db[idNoticia] || null);
      setLoading(false);
    }

    buscarNoticia();
  }, [idNoticia]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0', color: '#0065a4' }}>
        <h2>Carregando matéria...</h2>
      </div>
    );
  }

  if (!noticia) {
    return (
      <div className={styles.containerNotFound}>
        <h2>Notícia não encontrada</h2>
        <p>A notícia que você está procurando não existe ou foi removida.</p>
        <Link href="/noticias" className={styles.btnVoltar}>
          ← Voltar para as notícias
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.navigationBar}>
        <div className={styles.container}>
          <Link href="/noticias" className={styles.backLink}>
            ← Voltar para as notícias
          </Link>
        </div>
      </div>

      <main className={styles.mainContent}>
        <div className={styles.container}>
          <article className={styles.articleCard}>
            <span className={styles.dataPublicacao}>
              Publicado em: {noticia.data}
            </span>

            <h1 className={styles.titulo}>{noticia.titulo}</h1>

            {noticia.resumo && (
              <p className={styles.resumo}>{noticia.resumo}</p>
            )}

            {noticia.imagem && (
              <div className={styles.imageWrapper}>
                <Image 
                  src={noticia.imagem} 
                  alt={noticia.titulo}
                  width={900}
                  height={500}
                  className={styles.imagemCapa}
                  unoptimized
                  priority
                />
              </div>
            )}

            <div className={styles.corpoNoticia}>
              {Array.isArray(noticia.conteudo) ? (
                noticia.conteudo.map((paragrafo, index) => (
                  <p key={index}>{paragrafo}</p>
                ))
              ) : (
                <p>{noticia.conteudo}</p>
              )}
            </div>

          </article>
        </div>
      </main>
    </div>
  );
}