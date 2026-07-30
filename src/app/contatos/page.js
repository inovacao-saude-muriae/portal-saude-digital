'use client';

import { useState } from 'react';
import { listaContatos, categoriasContatos } from '@/data/contatosData';
import styles from './Contatos.module.css';

export default function ContatosPage() {
    const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");
    const [busca, setBusca] = useState("");

    // FILTRAGEM COMBINADA (TEMA + BUSCA POR NOME OU ENDEREÇO)
    const contatosFiltrados = listaContatos.filter((item) => {
        const bateCategoria = categoriaAtiva === "Todos" || item.categoria === categoriaAtiva;
        const termoBusca = busca.toLowerCase();
        const bateBusca = item.nome.toLowerCase().includes(termoBusca) ||
                        item.endereco.toLowerCase().includes(termoBusca);
        return bateCategoria && bateBusca;
    });

    return (
        <div className={styles.pageWrapper}>
            {/* BANNER SUPERIOR */}
            <section className={styles.heroBanner}>
                <div className={styles.container}>
                    <span className={styles.heroBadge}>☎️ Redes de Atendimento</span>
                    <h1 className={styles.heroTitle}>Guia de Contatos da Saúde</h1>
                    <p className={styles.heroSubtitle}>
                        Encontre telefones, endereços, e-mails e localizações das Unidades Básicas, Policlínicas e Centros Especializados de Muriaé.
                    </p>
                </div>
            </section>

            <main className={styles.mainContainer}>
                <div className={styles.container}>            
                    {/* CAMPO DE PESQUISA POR NOME */}
                    <div className={styles.searchBox}>
                        <span className={styles.searchIcon}>🔍</span>
                        <input
                        type="text"
                        placeholder="Buscar unidade pelo nome ou endereço..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        className={styles.searchInput}
                        />
                        {busca && (
                            <button className={styles.clearBtn} onClick={() => setBusca('')}>
                                ✕
                            </button>
                        )}
                    </div>

                    {/* FILTROS POR TEMA (ABAS / BOTÕES) */}
                    <div className={styles.filterTrack}>
                        {categoriasContatos.map((cat) => (
                            <button
                                key={cat}
                                className={`${styles.filterBtn} ${categoriaAtiva === cat ? styles.filterBtnActive : ''}`}
                                onClick={() => setCategoriaAtiva(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* LISTA DE CARDS DE CONTATO */}
                    {contatosFiltrados.length > 0 ? (
                        <div className={styles.contactsGrid}>
                            {contatosFiltrados.map((contato) => (
                                <div key={contato.id} className={styles.card}>
                                    <div className={styles.cardHeader}>
                                        <span className={styles.categoryBadge}>{contato.categoria}</span>
                                        <h3 className={styles.cardTitle}>{contato.nome}</h3>
                                    </div>
                                    <div className={styles.cardBody}>
                                        {contato.telefone && (
                                            <div className={styles.infoRow}>
                                                <span className={styles.icon}>📞</span>
                                                <div>
                                                    <strong>Telefone</strong>
                                                    <p>{contato.telefone}</p>
                                                </div>
                                            </div>
                                        )}
                                        {contato.endereco && (
                                            <div className={styles.infoRow}>
                                                <span className={styles.icon}>📍</span>
                                                <div>
                                                    <strong>Endereço</strong>
                                                    <p>{contato.endereco}</p>
                                                </div>
                                            </div>
                                        )}
                                        {contato.email && (
                                            <div className={styles.infoRow}>
                                                <span className={styles.icon}>✉️</span>
                                                <div>
                                                    <strong>E-mail</strong>
                                                    <p>{contato.email}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className={styles.cardFooter}>
                                        <a
                                            href={contato.mapsUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.mapsBtn}
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/>
                                                <circle cx="12" cy="10" r="3"/>
                                            </svg>
                                            Ver localização no Google Maps ↗
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={styles.emptyState}>
                            <span className={styles.emptyIcon}>🔍</span>
                            <h3>Nenhum contato encontrado</h3>
                            <p>Não encontramos nenhuma unidade correspondente aos critérios da sua busca.</p>
                            <button 
                                className={styles.resetSearchBtn}
                                onClick={() => { setBusca(''); setCategoriaAtiva('Todos'); }}
                            >
                                Limpar Filtros
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}