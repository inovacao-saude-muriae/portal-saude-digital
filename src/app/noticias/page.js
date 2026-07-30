'use client';

import Link from 'next/link';
import Image from 'next/image';
import { dbNoticias, converterParaDate } from '@/data/noticiasData';
import styles from './Noticias.module.css';

// Mapeamento local dos tipos de categoria para os estilos do CSS Module
const categoriaClassMap = {
    infra: styles.catInfra,
    vacinacao: styles.catVacinacao
};

export default function NoticiasPage() {
  // Transforma o objeto em Array e o ordena da notícia mais recente para a mais antiga
    const listaNoticias = Object.keys(dbNoticias)
        .map((chave) => ({
        id: chave,
        ...dbNoticias[chave]
    }))
    .sort((a, b) => converterParaDate(b.data).getTime() - converterParaDate(a.data).getTime());

    return (
        <div className={styles.pageWrapper}>
            {/* 1. BANNER DE TOPO */}
            <section 
                className={styles.heroBanner}
                style={{ backgroundImage: "url('/img/banner-paginas.png')" }}
                >
                <div className={styles.overlay}>
                    <div className={styles.container}>
                        <span className={styles.heroSubtitle}>INSTITUCIONAL</span>
                        <h1 className={styles.heroTitle}>Notícias da Saúde</h1>
                        <p className={styles.heroDesc}>
                            Aqui você encontra as atualizações mais recentes sobre serviços, campanhas de vacinação, programas de prevenção, ações educativas e demais iniciativas conduzidas pela Secretaria Municipal de Saúde.
                        </p>
                    </div>
                </div>
            </section>

            {/* 2. CONTEÚDO CENTRAL */}
            <section className={styles.contentSection}>
                <div className={styles.container}>                    
                    <div className={styles.gridNoticias}>
                        {listaNoticias.map((noticia) => {
                        const classCategoriaCss = categoriaClassMap[noticia.tipoCategoria] || styles.catInfra;

                            return (
                                <Link className={styles.cardNoticia} href={`/noticias/${noticia.id}`} key={noticia.id}>
                                    <div className={styles.capsulaImagem}>
                                        <Image 
                                        alt={noticia.titulo} 
                                        className={styles.imagemNoticiaSrc} 
                                        height={200} 
                                        src={noticia.imagem} 
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
                                            <h2 className={styles.tituloCard}>{noticia.titulo}</h2>
                                            <p className={styles.resumoCard}>{noticia.resumo}</p>                                        
                                            <span className={styles.leiaMaisBtn}>Ler mais →</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
}