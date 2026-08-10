'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Calendar, 
  Hospital, 
  ChevronDown, 
  ChevronUp, 
  MapPin, 
  Clock, 
  FileText,
  ShieldCheck
} from 'lucide-react';
import { dadosCalendarioCompleto } from '@/data/calendarioData';
import styles from './CalendarioVacinal.module.css';

const tagClassMap = {
  gestante: styles.tagGestante,
  crianca: styles.tagCrianca,
  adolescente: styles.tagAdolescente,
  idoso: styles.tagIdoso
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
      
      {/* 1. HERO BANNER AZUL */}
      <section className={styles.heroBanner}>
        <div className={styles.container}>
          <div className={styles.badgeHeader}>
            <Hospital size={14} /> Rede Pública de Saúde de Muriaé
          </div>
          <h1 className={styles.heroTitle}>Calendário Nacional de Vacinação</h1>
          <p className={styles.heroDesc}>
            Acompanhe a linha do tempo de imunização e descubra as idades e vacinas recomendadas para cada fase da vida.
          </p>
        </div>
      </section>

      {/* 2. BARRA DE NAVEGAÇÃO SUPERIOR (VOLTAR) */}
      <nav className={styles.navigationBar}>
        <div className={styles.navContainer}>
          <Link href="/servicos/vacina" className={styles.backLink}>
            <ArrowLeft size={16} /> Voltar para Vacinação
          </Link>
          <span className={styles.navTag}>Imunização & Programa Nacional</span>
        </div>
      </nav>

      {/* 3. CONTEÚDO PRINCIPAL */}
      <main className={styles.mainContent}>
        <div className={styles.container}>
          
          {/* SELEÇÃO INTERATIVA DE FASES DA VIDA (LINHA DO TEMPO) */}
          <div className={styles.timelineTrackContainer}>
            <div className={styles.timelineLine}></div>
            
            <div className={styles.grupoFlex}>
              {[
                { id: 'gestante', img: '/img/calendario/gestante.png' },
                { id: 'crianca', img: '/img/calendario/crianca.png' },
                { id: 'adolescente', img: '/img/calendario/adolescente.png' },
                { id: 'idoso', img: '/img/calendario/idoso.png' }
              ].map((item) => {
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
                      title={`Ver vacinas para ${gData.tituloExibicao}`}
                    >
                      <Image 
                        src={item.img} 
                        alt={gData.tituloExibicao} 
                        width={110}
                        height={110}
                        priority={item.id === 'idoso'}
                        unoptimized
                        className={styles.circleImageSrc} 
                      />
                    </button>
                    
                    <span className={`${styles.grupoBaseTag} ${isActive ? tagClassMap[item.id] : styles.tagInativa}`}>
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

          {/* PAINEL PRINCIPAL DE CONTEÚDO DO GRUPO SELECIONADO */}
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
              <h3 className={styles.sectionSubtitle}>
                <Calendar size={18} color="#005c8a" /> Idades e Vacinas Recomendadas pelo PNI
              </h3>
              
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
                            <ShieldCheck size={18} color="#005c8a" className={styles.bulletIcon} /> 
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
                            <span>{isExpanded ? 'Ocultar local e documentos' : 'Ver local de vacinação e documentos'}</span>
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>

                          {isExpanded && (
                            <div className={styles.painelDetalhesExtra}>
                              {card.local && (
                                <p className={styles.infoRow}>
                                  <MapPin size={14} color="#005c8a" />
                                  <span><strong>Local:</strong> {card.local}</span>
                                </p>
                              )}
                              {card.horario && (
                                <p className={styles.infoRow}>
                                  <Clock size={14} color="#005c8a" />
                                  <span><strong>Horário:</strong> {card.horario}</span>
                                </p>
                              )}
                              {card.documentos && card.documentos.length > 0 && (
                                <p className={styles.infoRow}>
                                  <FileText size={14} color="#005c8a" />
                                  <span><strong>Documentos:</strong> {card.documentos.join(", ")}</span>
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
      </main>

    </div>
  );
}