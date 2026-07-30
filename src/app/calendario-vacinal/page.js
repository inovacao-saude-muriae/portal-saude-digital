'use client';

import { useState } from 'react';
import Image from 'next/image';
import { dadosCalendarioCompleto } from '@/data/calendarioData';
import styles from './CalendarioVacinal.module.css';


const tagClassMap = {
    gestante: styles.tagGravidasAtiva,
    crianca: styles.tagCriancasAtiva,
    adolescente: styles.tagAdolescentesAtiva,
    idoso: styles.tagIdososAtiva
};

export default function CalendarioVacinalPage() {
    const [grupoAtivo, setGrupoAtivo] = useState('gestante');
    const [cardAberto, setCardAberto] = useState(null);
    
    const grupoAtual = dadosCalendarioCompleto[grupoAtivo];

    const toggleDetalhes = (id) => {
        setCardAberto(cardAberto === id ? null : id);
};

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.topContainer}>
                <span className={styles.badgeTop}>💉 Calendário Nacional de Vacinação</span>
                <h1 className={styles.mainTitle}>Sua linha do tempo de proteção</h1>
                <p className={styles.mainSubtitle}>
                Clique em cada grupo abaixo para descobrir as idades e as vacinas recomendadas para gestantes, crianças, adolescentes e idosos.
                </p>

                <div className={styles.timelineTrackContainer}>
                    <div className={styles.timelineLine}></div>
                    <div className={styles.grupoFlex}>
                        {[
                        { id: 'gestante', img: '/img/calendario/gestante.png' },
                        { id: 'crianca', img: '/img/calendario/crianca.png' },
                        { id: 'adolescente', img: '/img/calendario/adolescente.png' },
                        { id: 'idoso', img: '/img/calendario/idoso.png' }
                        ]
                        .map((item) => {
                            const gData = dadosCalendarioCompleto[item.id];
                            const isActive = grupoAtivo === item.id;
                            
                            return (
                                <div key={item.id} className={styles.grupoCol}>
                                    <button
                                        className={`${styles.circleBtn} ${isActive ? styles.circleActive : ''}`}
                                        onClick={() => {
                                        setGrupoAtivo(item.id);
                                        setCardAberto(null);
                                        }}
                                        >
                                        <Image 
                                        src={item.img} 
                                        alt={gData.tituloExibicao} 
                                        width={114}
                                        height={114}
                                        priority={item.id === 'idoso'}
                                        unoptimized
                                        className={styles.circleImageSrc} 
                                        />
                                    </button>
                                    
                                    <span className={`${styles.grupoBaseTag} ${isActive ? tagClassMap[item.id] : styles.tagInativa}`}>
                                        <span className={styles.tagIconWrapper}>{gData.tagIconSvg}</span>
                                        {gData.tagLabel}
                                    </span>

                                    <h3 className={styles.grupoTitle}>{gData.tituloExibicao}</h3>
                                    <p className={styles.grupoDesc}>{gData.subtitulo}</p>
                                    <button 
                                        className={`${styles.actionLink} ${isActive ? styles.actionLinkActive : ''}`}
                                        onClick={() => {
                                        setGrupoAtivo(item.id);
                                        setCardAberto(null);
                                        }}
                                        >
                                        {isActive ? 'Exibindo agora ▲' : 'Ver vacinas ∨'}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className={styles.containerLayoutBase}>
                <div className={styles.quadradoPainelPrincipal}>
                    <div className={styles.groupHeader}>
                        <div className={styles.groupAvatarCircle}>
                        <Image 
                            src={grupoAtual.icon} 
                            alt={grupoAtual.tituloExibicao} 
                            width={64}
                            height={64}
                            unoptimized
                            className={styles.avatarImageSrc} 
                        />
                        </div>
                        <div>
                        <h2 className={styles.groupHeaderTitle}>{grupoAtual.tituloExibicao}</h2>
                        <p className={styles.groupHeaderSubtitle}>{grupoAtual.subtitulo}</p>
                        </div>
                    </div>

                    <div className={styles.quadradoConteudoInterno}>
                        <h3 className={styles.sectionSubtitle}>📅 Idades e vacinas recomendadas</h3>
                        
                        <div className={styles.cardsGrid}>
                            {grupoAtual.cards.map((card, idx) => {
                                const cardId = card.id || idx;
                                const isExpanded = cardAberto === cardId;

                                return (
                                    <div key={cardId} className={styles.vacinaCard}>
                                        <div className={styles.cardHeaderRow}>
                                        <span className={styles.idadeBadge}>{card.idade}</span>
                                        {card.rotulo && <span className={styles.rotuloTexto}>{card.rotulo}</span>}
                                        </div>

                                        <ul className={styles.vacinaList}>
                                        {card.vacinas.map((v, i) => (
                                            <li key={i} className={styles.vacinaItem}>
                                            <span className={styles.bulletPoint}>•</span> 
                                            <div>
                                                <span className={styles.vacinaTexto}>{typeof v === 'string' ? v : v.nome}</span>
                                                {v.descricao && <p className={styles.vacinaDescricao}>{v.descricao}</p>}
                                                {v.doencas && v.doencas.length > 0 && v.doencas[0] !== "" && (
                                                <span className={styles.doencaTag}>Protege contra: {v.doencas.join(", ")}</span>
                                                )}
                                            </div>
                                            </li>
                                        ))}
                                        </ul>

                                        {(card.local || card.horario || card.documentos) && (
                                            <div className={styles.detalhesWrapper}>
                                                <button 
                                                    className={styles.btnToggleInfo}
                                                    onClick={() => toggleDetalhes(cardId)}
                                                    >
                                                    {isExpanded ? 'Ocultar local e documentos ▲' : 'Ver local de vacinação e documentos 📍'}
                                                </button>

                                                {isExpanded && (
                                                    <div className={styles.painelDetalhesExtra}>
                                                        {card.local && (
                                                        <p className={styles.infoRow}>
                                                            <strong>📍 Local:</strong> {card.local}
                                                        </p>
                                                        )}
                                                        {card.horario && (
                                                        <p className={styles.infoRow}>
                                                            <strong>⏰ Horário:</strong> {card.horario}
                                                        </p>
                                                        )}
                                                        {card.documentos && card.documentos.length > 0 && (
                                                        <p className={styles.infoRow}>
                                                            <strong>📄 Documentos necessários:</strong> {card.documentos.join(", ")}
                                                        </p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}