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
      <div className={styles.pageWrapper} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <p style={{ color: '#0065a4', fontSize: '18px', fontWeight: 'bold' }}>Carregando notícia...</p>
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

  let paragrafos = [];
  if (Array.isArray(noticia.conteudo)) {
    paragrafos = noticia.conteudo;
  } else if (typeof noticia.conteudo === 'string') {
    paragrafos = noticia.conteudo
      .split('\n')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
  }

  return (
    <div className={styles.pageWrapper}>
      
      {/* BARRA DE NAVEGAÇÃO DE VOLTAR */}
      <div className={styles.navigationBar}>
        <div className={styles.container}>
          <Link href="/noticias" className={styles.backLink}>
            ← Voltar para as notícias
          </Link>
        </div>
      </div>

      <main className={styles.mainContent}>
        <div className={styles.container}>
          
          {/* CARD BRANCO PRINCIPAL */}
          <article className={styles.articleCard}>
            
            {/* DATA DE PUBLICAÇÃO */}
            {noticia.data && (
              <span className={styles.dataPublicacao}>
                Publicado em: {noticia.data}
              </span>
            )}

            {/* TÍTULO PRINCIPAL */}
            <h1 className={styles.titulo}>{noticia.titulo}</h1>

            {/* RESUMO / SUBTÍTULO */}
            {noticia.resumo && (
              <p className={styles.resumo}>{noticia.resumo}</p>
            )}

            {/* IMAGEM DE CAPA */}
            {noticia.imagem && (
              <div className={styles.imageWrapper}>
                <Image 
                  src={noticia.imagem} 
                  alt={noticia.titulo || 'Imagem da notícia'}
                  width={900}
                  height={500}
                  className={styles.imagemCapa}
                  unoptimized
                  priority
                />
              </div>
            )}

            {/* CORPO DO TEXTO DA NOTÍCIA */}
            <div className={styles.corpoNoticia}>
              {paragrafos.length > 0 ? (
                paragrafos.map((paragrafo, index) => (
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