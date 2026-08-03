'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link'; 
import { getDbNoticias, converterParaDate } from '@/data/noticiasData'; 
import styles from './NewsSection.module.css';

const categoriaClassMap = {
  infra: styles.catInfra,
  vacinacao: styles.catVacinacao
};

export default function NewsSection() {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarNoticias() {
      setLoading(true);
      const db = await getDbNoticias();
      
      // Converte o objeto do banco/sheets em array e ordena por data
      const lista = Object.keys(db)
        .map((chave) => ({
          id: chave,
          ...db[chave]
        }))
        .sort((a, b) => converterParaDate(b.data).getTime() - converterParaDate(a.data).getTime());

      // Pega as 3 notícias mais recentes para o carrossel/grid da Home
      setNoticias(lista.slice(0, 3));
      setLoading(false);
    }

    carregarNoticias();
  }, []);

  if (loading) {
    return (
      <section className={styles.newsSection}>
        <div className={styles.container}>
          <p style={{ textAlign: 'center', color: '#0065a4' }}>Carregando notícias...</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.newsSection}>
      <div className={styles.container}>
        
        <div className={styles.headerRow}>
          <div>
            <span className={styles.badgeHeader}>INFORMAÇÃO E TRANSPARÊNCIA</span>
            <h2 className={styles.sectionTitle}>Últimas Notícias da Saúde</h2>
          </div>
          <Link href="/noticias" className={styles.verTodasBtn}>
            Ver todas as notícias →
          </Link>
        </div>

        <div className={styles.gridNoticias}>
          {noticias.map((noticia) => {
            const classCategoriaCss = categoriaClassMap[noticia.tipoCategoria] || styles.catInfra;

            return (
              <Link className={styles.cardNoticia} href={`/noticias/${noticia.id}`} key={noticia.id}>
                <div className={styles.capsulaImagem}>
                  <Image 
                    alt={noticia.titulo} 
                    className={styles.imagemNoticiaSrc} 
                    height={200} 
                    src={noticia.imagem || '/img/noticias/noticia1.jpeg'} 
                    unoptimized 
                    width={360}
                  />
                </div>
                
                <div className={styles.infoCard}>
                  <div className={styles.metaRow}>
                    <span className={`${styles.badgeCategoria} ${classCategoriaCss}`}>
                      {noticia.categoria}
                    </span>
                    <span className={styles.dataText}>{noticia.data}</span>
                  </div>                                        
                  <h3 className={styles.tituloCard}>{noticia.titulo}</h3>
                  <p className={styles.resumoCard}>{noticia.resumo}</p>                                        
                  <span className={styles.leiaMaisBtn}>Ler mais →</span>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}