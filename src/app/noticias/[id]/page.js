'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { dbNoticias } from '../page';
import styles from './NoticiasDetail.module.css';

export default function NoticiaDetailPage() {
  const params = useParams();
  const id = params?.id;

  const noticia = dbNoticias[id];

  if (!noticia) {
    return (
      <div className={styles.containerErro}>
        <h2>Notícia não encontrada</h2>
        <p>O conteúdo que procura foi removido ou não existe.</p>
        <Link href="/noticias" className={styles.backLink}>Voltar para Notícias</Link>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.navigationBar}>
        <Link href="/noticias" className={styles.backLink}>
          ← Voltar para Notícias
        </Link>
      </div>

      <main className={styles.contentContainer}>
        <span className={styles.noticiaData}>Publicado em: {noticia.data}</span>
        <h1 className={styles.noticiaTitulo}>{noticia.titulo}</h1>
        <p className={styles.noticiaResumo}>{noticia.resumo}</p>
        
        <div className={styles.noticiaBanner}>
          {/* CORRIGIDO: Substituído img por Image com proporções fluidas */}
          <Image 
            src={noticia.imagem} 
            alt={noticia.titulo} 
            width={800}
            height={400}
            priority
            unoptimized
            className={styles.bannerImageSrc}
          />
        </div>

        <article className={styles.noticiaTextoCompleto}>
          {noticia.conteudo}
        </article>
      </main>
    </div>
  );
}