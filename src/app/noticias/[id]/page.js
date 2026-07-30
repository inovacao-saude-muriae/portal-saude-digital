'use client';

import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { dbNoticias } from '@/data/noticiasData';
import styles from './NoticiasDetail.module.css';

export default function NoticiaDetalhePage({ params }) {
  const resolvedParams = use(params);
  const idNoticia = resolvedParams.id;

  const noticia = dbNoticias[idNoticia];

  if (!noticia) {
    return (
      <div className={styles.containerNotFound}>
        <h2>Notícia não encontrada</h2>
        <p>A notícia que você está procurando não existe ou foi removida.</p>
        <Link href="/" className={styles.btnVoltar}>
          ← Voltar para a página inicial
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      
      {/* BARRA DE NAVEGAÇÃO DE VOLTAR */}
      <div className={styles.navigationBar}>
        <div className={styles.container}>
          <Link href="/" className={styles.backLink}>
            ← Voltar para as notícias
          </Link>
        </div>
      </div>

      <main className={styles.mainContent}>
        <div className={styles.container}>
          
          {/* CARD BRANCO PRINCIPAL (IGUAL À IMAGEM) */}
          <article className={styles.articleCard}>
            
            {/* DATA DE PUBLICAÇÃO DISCRETA NO TOPO */}
            <span className={styles.dataPublicacao}>
              Publicado em: {noticia.data}
            </span>

            {/* TÍTULO PRINCIPAL DESTACADO */}
            <h1 className={styles.titulo}>{noticia.titulo}</h1>

            {/* RESUMO / SUBTÍTULO */}
            {noticia.resumo && (
              <p className={styles.resumo}>{noticia.resumo}</p>
            )}

            {/* IMAGEM COM BORDAS ARREDONDADAS */}
            {noticia.imagem && (
              <div className={styles.imageWrapper}>
                <Image 
                  src={noticia.imagem} 
                  alt={noticia.titulo}
                  width={900}
                  height={500}
                  className={styles.imagemCapa}
                  priority
                />
              </div>
            )}

            {/* CORPO DO TEXTO DA NOTÍCIA */}
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