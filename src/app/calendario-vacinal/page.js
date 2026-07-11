'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './CalendarioVacinal.module.css';

const dadosCalendarioCompleto = {
  gestante: {
    tituloExibicao: "Gestantes",
    tagLabel: "Grávidas",
    tagIcon: "🤍",
    subtitulo: "Proteja a mãe e o bebê durante toda a gestação.",
    icon: "/img/calendario/gestante.png", // Ajustado para o caminho do seu print
    cards: [
      { idade: "A qualquer momento", rotulo: "Dose neonatal", vacinas: ["Hepatite B (se não imunizada previamente)"] },
      { idade: "A partir da 20ª semana", rotulo: "Proteção fetal", vacinas: ["dTpa (Tríplice Bacteriana Acelular)"] },
      { idade: "Campanha Anual", rotulo: "Sazonal", vacinas: ["Influenza (Gripe)"] }
    ]
  },
  crianca: {
    tituloExibicao: "Crianças",
    tagLabel: "Crianças",
    tagIcon: "👶",
    subtitulo: "Vacinas essenciais do nascimento aos 10 anos.",
    icon: "/img/calendario/crianca.png", // Ajustado para o caminho do seu print
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
    tagIcon: "👤",
    subtitulo: "Reforços e novas proteções para jovens de 11 a 19 anos.",
    icon: "/img/calendario/adolescente.png", // Ajustado para o caminho do seu print
    cards: [
      { idade: "9 a 14 anos", rotulo: "Prevenção oncológica", vacinas: ["HPV Quadrivalente (Dose única)"] },
      { idade: "11 a 12 anos", rotulo: "Reforço", vacinas: ["Meningocócica ACWY"] }
    ]
  },
  idoso: {
    tituloExibicao: "Idosos",
    tagLabel: "Idosos",
    tagIcon: "🛡️",
    subtitulo: "Vacinas de reforço para manter a imunidade após os 60 anos.",
    icon: "/img/calendario/idoso.png", // Ajustado para o caminho do seu print
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
              { id: 'gestante', img: '/img/calendario/gestante.png' }, // Ajustado aqui também
              { id: 'crianca', img: '/img/calendario/crianca.png' },     // Ajustado aqui também
              { id: 'adolescente', img: '/img/calendario/adolescente.png' }, // Ajustado aqui também
              { id: 'idoso', img: '/img/calendario/idoso.png' }         // Ajustado aqui também
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
                      width={110}
                      height={110}
                      priority={item.id === 'idoso'}
                      unoptimized
                      className={styles.circleImageSrc} 
                    />
                  </button>
                  <span className={styles.grupoTag}>
                    {gData.tagIcon} {gData.tagLabel}
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