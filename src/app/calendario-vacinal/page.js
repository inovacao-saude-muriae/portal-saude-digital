'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './CalendarioVacinal.module.css';

const dadosCalendarioCompleto = {
  gestante: {
    tituloExibicao: "Gestantes",
    tagLabel: "Grávidas",
    classNameTagAtiva: styles.tagGravidasAtiva, // Classe de cor quando estiver ativo
    tagIconSvg: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
        <path d="M12 9h2l1.5 3 1.5-5 1 2h2"/>
      </svg>
    ),
    subtitulo: "Proteja a mãe e o bebê durante toda a gestação.",
    icon: "/img/calendario/gestante.png",
    cards: [
      { idade: "A qualquer momento", rotulo: "Dose neonatal", vacinas: ["Hepatite B (se não imunizada previamente)"] },
      { idade: "A partir da 20ª semana", rotulo: "Proteção fetal", vacinas: ["dTpa (Tríplice Bacteriana Acelular)"] },
      { idade: "Campanha Anual", rotulo: "Sazonal", vacinas: ["Influenza (Gripe)"] }
    ]
  },
  crianca: {
    tituloExibicao: "Crianças",
    tagLabel: "Crianças",
    classNameTagAtiva: styles.tagCriancasAtiva, // Classe de cor quando estiver ativo
    tagIconSvg: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
        <line x1="9" x2="9.01" y1="9" y2="9"/>
        <line x1="15" x2="15.01" y1="9" y2="9"/>
      </svg>
    ),
    subtitulo: "Vacinas essenciais do nascimento aos 10 anos.",
    icon: "/img/calendario/crianca.png",
    cards: [
      { idade: "Ao nascer", rotulo: "Dose neonatal", vacinas: ["BCG", "Hepatite B"] },
      { idade: "2 meses", rotulo: "Primeira dose", vacinas: ["Pentavalente (DTP + Hib + HepB)", "VIP (Poliomielite inativada)", "Pneumocócica 10", "Meningocócica ACWY", "Rotavírus"] },
      { idade: "3 meses", rotulo: "Reforço precoce", vacinas: ["Meningocócica ACWY (reforço)"] },
      { idade: "4 meses", rotulo: "Segunda dose", vacinas: ["Pentavalente", "VIP", "Pneumocócica 10", "Rotavírus"] }
    ]
  },
  adolescente: {
    tituloExibicao: "Adolescentes",
    tagLabel: "Adolescentes",
    classNameTagAtiva: styles.tagAdolescentesAtiva, // Classe de cor quando estiver ativo
    tagIconSvg: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    subtitulo: "Reforços e novas proteções para jovens de 11 a 19 anos.",
    icon: "/img/calendario/adolescente.png",
    cards: [
      { idade: "9 a 14 anos", rotulo: "Prevenção oncológica", vacinas: ["HPV Quadrivalente (Dose única)"] },
      { idade: "11 a 12 anos", rotulo: "Reforço", vacinas: ["Meningocócica ACWY"] }
    ]
  },
  idoso: {
    tituloExibicao: "Idosos",
    tagLabel: "Idosos",
    classNameTagAtiva: styles.tagIdososAtiva, // Classe de cor quando estiver ativo
    tagIconSvg: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="m9 12 2 2 4-4"/>
      </svg>
    ),
    subtitulo: "Vacinas de reforço para manter a imunidade após os 60 anos.",
    icon: "/img/calendario/idoso.png",
    cards: [
      { idade: "60+ anos", rotulo: "Anualmente", vacinas: ["Influenza (gripe)"] },
      { idade: "60+ anos", rotulo: "Reforço", vacinas: ["dT (difteria e tétano) — a cada 10 anos"] },
      { idade: "60+ anos", rotulo: "Dose única / reforço", vacinas: ["Pneumocócica 23-valente"] },
      { idade: "60+ anos", rotulo: "Conforme indicação", vacinas: ["Covid-19 (esquema atualizado)", "Herpes zoster (shingles)"] }
    ]
  }
};

export default function CalendarioVacinalPage() {
  const [grupoAtivo, setGrupoAtivo] = useState('idoso');
  const grupoAtual = dadosCalendarioCompleto[grupoAtivo];

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
            ].map((item) => {
              const gData = dadosCalendarioCompleto[item.id];
              const isActive = grupoAtivo === item.id;
              
              return (
                <div key={item.id} className={styles.grupoCol}>
                  <button
                    className={`${styles.circleBtn} ${isActive ? styles.circleActive : ''}`}
                    onClick={() => setGrupoAtivo(item.id)}
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
                  
                  {/* ALTERAÇÃO DINÂMICA: Se estiver ativo, usa a cor dele; se inativo, usa a cor neutra */}
                  <span className={`${styles.grupoBaseTag} ${isActive ? gData.classNameTagAtiva : styles.tagInativa}`}>
                    <span className={styles.tagIconWrapper}>{gData.tagIconSvg}</span>
                    {gData.tagLabel}
                  </span>

                  <h3 className={styles.grupoTitle}>{gData.tituloExibicao}</h3>
                  <p className={styles.grupoDesc}>{gData.subtitulo}</p>
                  <button 
                    className={`${styles.actionLink} ${isActive ? styles.actionLinkActive : ''}`}
                    onClick={() => setGrupoAtivo(item.id)}
                  >
                    {isActive ? 'Fechar detalhes ▲' : 'Ver vacinas ∨'}
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
              {grupoAtual.cards.map((card, idx) => (
                <div key={idx} className={styles.vacinaCard}>
                  <div className={styles.cardHeaderRow}>
                    <span className={styles.idadeBadge}>{card.idade}</span>
                    <span className={styles.rotuloTexto}>{card.rotulo}</span>
                  </div>
                  <ul className={styles.vacinaList}>
                    {card.vacinas.map((v, i) => (
                      <li key={i}>
                        <span className={styles.bulletPoint}>•</span> 
                        <span className={styles.vacinaTexto}>{v}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}