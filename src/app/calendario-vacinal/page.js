'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './CalendarioVacinal.module.css';

const dadosCalendarioCompleto = {
  gestante: {
    tituloExibicao: "Gestantes",
    tagLabel: "Grávidas",
    classNameTagAtiva: styles.tagGravidasAtiva,
    tagIconSvg: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
        <path d="M12 9h2l1.5 3 1.5-5 1 2h2"/>
      </svg>
    ),
    subtitulo: "Proteja a mãe e o bebê durante toda a gestação.",
    icon: "/img/calendario/gestante.png",
    cards: [
      {
        id: "gestante-1",
        idade: "A qualquer momento no Pré-natal",
        rotulo: "Pré-natal",
        vacinas: [
          { nome: "Hepatite B (HB - recombinante)", descricao: "Iniciar ou completar 3 doses.", doencas: ["Proteção contra Hepatite B."] },
          { nome: "Difteria e Tétano (dT)", descricao: "Iniciar ou completar o esquema de 3 doses com os toxoides de difteria e tétano.", doencas: ["Proteção contra difteria e tétano."] }
        ],
        local: "Núcleo de Planejamento Familiar, Rua Coronel Izalino, 154 (próximo ao Hospital São Paulo).",
        horario: "Segunda, quinta e sexta-feira, das 12h30 às 16h30.",
        documentos: ["Certidão de nascimento ou Declaração de nascido vivo."]
      },
      {
        id: "gestante-2",
        idade: "20ª semana e Puérperas",
        rotulo: "A partir da 20ª semana",
        vacinas: [
          { nome: "Difteria, Tétano, Pertussis (dTpa - acelular)", descricao: "1 dose a partir da 20ª semana, a cada gestação.", doencas: ["Proteção contra Difteria, Tétano e Coqueluche."] }
        ],
        local: "Núcleo de Planejamento Familiar, Rua Coronel Izalino, 154 (próximo ao Hospital São Paulo).",
        horario: "Segunda, quinta e sexta-feira, das 12h30 às 16h30.",
        documentos: ["Certidão de nascimento ou declaração de nascido vivo."]
      }
    ]
  },
  crianca: {
    tituloExibicao: "Crianças",
    tagLabel: "Crianças",
    classNameTagAtiva: styles.tagCriancasAtiva,
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
      {
        id: "crianca-nascer",
        idade: "Ao nascer",
        rotulo: "Dose neonatal",
        vacinas: [
          { nome: "BCG (Dose única)", descricao: "", doencas: ["Formas graves da tuberculose (miliar e meníngea)."] },
          { nome: "Hepatite B (HB - recombinante) Dose única", descricao: "", doencas: ["Hepatite B."] }
        ],
        local: "Núcleo de Planejamento Familiar, Rua Coronel Izalino, 154 (próximo ao Hospital São Paulo).",
        horario: "Segunda, quinta e sexta-feira, das 12h30 às 16h30.",
        documentos: ["Certidão de nascimento ou declaração de nascido vivo."]
      },
      {
        id: "crianca-2meses",
        idade: "2 Meses",
        rotulo: "1ª Dose",
        vacinas: [
          { nome: "Pentavalente (Penta) (1ª dose)", descricao: "", doencas: ["Difteria", "Tétano", "Coqueluche", "Hepatite B", "Infecções por Haemophilus influenzae B."] },
          { nome: "Poliomielite (VIP) (1ª dose)", descricao: "", doencas: ["Poliomielite."] },
          { nome: "Pneumocócica 10-valente (Pneumo 10) (1ª dose)", descricao: "", doencas: ["Meningite, pneumonia e otite média por Streptococcus pneumoniae."] },
          { nome: "Rotavírus humano (VRH) (1ª dose)", descricao: "", doencas: ["Diarreia por rotavírus (Gastroenterites)."] }
        ],
        local: "Todas as Unidades Básicas de Saúde de Muriaé e dos distritos.",
        horario: "Segunda a sexta-feira, das 7h30 às 16h30.",
        documentos: ["Cartão SUS", "Documento pessoal", "Cartão de vacina."]
      },
      {
        id: "crianca-3meses",
        idade: "3 Meses",
        rotulo: "1ª Dose",
        vacinas: [
          { nome: "Meningocócica C (Meningo C) (1ª dose)", descricao: "", doencas: ["Doença invasiva causada pela Neisseria meningitidis do sorogrupo C."] }
        ],
        local: "Todas as Unidades Básicas de Saúde de Muriaé e dos distritos.",
        horario: "Segunda a sexta-feira, das 7h30 às 16h30.",
        documentos: ["Cartão SUS", "Documento pessoal", "Cartão de vacina."]
      },
      {
        id: "crianca-4meses",
        idade: "4 Meses",
        rotulo: "2ª Dose",
        vacinas: [
          { nome: "Pentavalente (Penta) (2ª dose)", descricao: "", doencas: ["Difteria", "Tétano", "Coqueluche", "Hepatite B", "Haemophilus influenzae B."] },
          { nome: "Poliomielite (VIP) (2ª dose)", descricao: "", doencas: ["Poliomielite."] },
          { nome: "Pneumocócica 10 (Pneumo 10) (2ª dose)", descricao: "", doencas: ["Infeções invasivas por pneumococo."] },
          { nome: "Rotavírus humano (VRH) (2ª dose)", descricao: "", doencas: ["Diarreia por rotavírus."] }
        ],
        local: "Todas as Unidades Básicas de Saúde de Muriaé e dos distritos.",
        horario: "Segunda a sexta-feira, das 7h30 às 16h30.",
        documentos: ["Cartão SUS", "Documento pessoal", "Cartão de vacina."]
      },
      {
        id: "crianca-5meses",
        idade: "5 Meses",
        rotulo: "2ª Dose",
        vacinas: [
          { nome: "Meningocócica C (Meningo C) (2ª dose)", descricao: "", doencas: ["Doença meningocócica sorogrupo C."] }
        ],
        local: "Todas as Unidades Básicas de Saúde de Muriaé e dos distritos.",
        horario: "Segunda a sexta-feira, das 7h30 às 16h30.",
        documentos: ["Cartão SUS", "Documento pessoal", "Cartão de vacina."]
      },
      {
        id: "crianca-6meses",
        idade: "6 Meses",
        rotulo: "3ª Dose",
        vacinas: [
          { nome: "Pentavalente (Penta) (3ª dose)", descricao: "", doencas: ["Difteria, Tétano, Coqueluche, Hepatite B, Hib."] },
          { nome: "Poliomielite (VIP) (3ª dose)", descricao: "", doencas: ["Poliomielite."] }
        ],
        local: "Todas as Unidades Básicas de Saúde de Muriaé e dos distritos.",
        horario: "Segunda a sexta-feira, das 7h30 às 16h30.",
        documentos: ["Cartão SUS", "Documento pessoal", "Cartão de vacina."]
      },
      {
        id: "crianca-7meses",
        idade: "7 Meses",
        rotulo: "Proteção viral",
        vacinas: [
          { nome: "Covid-19 (2ª dose)", descricao: "", doencas: ["Proteção contra formas graves de Covid-19."] }
        ],
        local: "Todas as Unidades Básicas de Saúde de Muriaé e dos distritos.",
        horario: "Segunda a sexta-feira, das 7h30 às 16h30.",
        documentos: ["Cartão SUS", "Documento pessoal", "Cartão de vacina."]
      },
      {
        id: "crianca-9meses",
        idade: "9 Meses",
        rotulo: "Dose Única",
        vacinas: [
          { nome: "Febre Amarela (FA)", descricao: "", doencas: ["Febre Amarela."] }
        ],
        local: "Todas as Unidades Básicas de Saúde de Muriaé e dos distritos.",
        horario: "Segunda a sexta-feira, das 7h30 às 16h30.",
        documentos: ["Cartão SUS", "Documento pessoal", "Cartão de vacina."]
      },
      {
        id: "crianca-12meses",
        idade: "12 Meses",
        rotulo: "Reforços e Doses",
        vacinas: [
          { nome: "Pneumocócica 10 (Pneumo 10) (Reforço)", descricao: "", doencas: ["Infecções pneumocócicas."] },
          { nome: "Meningocócica C (Meningo C) (Reforço)", descricao: "", doencas: ["Doença meningocócica C."] },
          { nome: "Tríplice Viral (1ª dose)", descricao: "", doencas: ["Sarampo, Caxumba, Rubéola."] }
        ],
        local: "Todas as Unidades Básicas de Saúde de Muriaé e dos distritos.",
        horario: "Segunda a sexta-feira, das 7h30 às 16h30.",
        documentos: ["Cartão SUS", "Documento pessoal", "Cartão de vacina."]
      },
      {
        id: "crianca-15meses",
        idade: "15 Meses",
        rotulo: "Reforços",
        vacinas: [
          { nome: "DTP (1º reforço)", descricao: "", doencas: ["Difteria, Tétano, Coqueluche."] },
          { nome: "Poliomielite (VIP) (Reforço)", descricao: "", doencas: ["Poliomielite."] },
          { nome: "Hepatite A (1 dose)", descricao: "", doencas: ["Hepatite A."] },
          { nome: "Tetraviral (1 dose)", descricao: "", doencas: ["Sarampo, Caxumba, Rubéola, Varicela."] }
        ],
        local: "Todas as Unidades Básicas de Saúde de Muriaé e dos distritos.",
        horario: "Segunda a sexta-feira, das 7h30 às 16h30.",
        documentos: ["Cartão SUS", "Documento pessoal", "Cartão de vacina."]
      },
      {
        id: "crianca-4anos",
        idade: "4 Anos",
        rotulo: "2º Reforço",
        vacinas: [
          { nome: "DTP (2º reforço)", descricao: "", doencas: ["Difteria, Tétano, Coqueluche."] },
          { nome: "Febre Amarela (Reforço)", descricao: "", doencas: ["Febre Amarela."] },
          { nome: "Varicela (Monovalente)", descricao: "", doencas: ["Varicela (Catapora)."] }
        ],
        local: "Todas as Unidades Básicas de Saúde de Muriaé e dos distritos.",
        horario: "Segunda a sexta-feira, das 7h30 às 16h30.",
        documentos: ["Cartão SUS", "Documento pessoal", "Cartão de vacina."]
      },
      {
        id: "crianca-5anos",
        idade: "5 Anos",
        rotulo: "Reforços e Doses",
        vacinas: [
          { nome: "Febre Amarela (atenuada) - (FA) (1 dose)", descricao: "", doencas: ["Proteção contra Febre Amarela."] },
          { nome: "Pneumocócica 23-valente - (Pneumo 23) (2 doses)", descricao: "", doencas: ["Proteção contra infecções invasivas pela bactéria pneumococo."] },
          { nome: "Varicela (monovalente) - (Varicela) (1 dose)", descricao: "", doencas: ["Varicela."] }
        ],
        local: "Todas as Unidades Básicas de Saúde de Muriaé e dos distritos.",
        horario: "Segunda a sexta-feira, das 7h30 às 16h30.",
        documentos: ["Cartão SUS", "Documento pessoal", "Cartão de vacina."]
      },
      {
        id: "crianca-7anos",
        idade: "7 Anos",
        rotulo: "3 Doses",
        vacinas: [
          { nome: "Difteria e Tétano (dT) (3 doses)", descricao: "", doencas: ["Difteria", "Tétano", "Coqueluche", "Hepatite B", "Infecções por Haemophilus influenzae B."] }
        ],
        local: "Todas as Unidades Básicas de Saúde de Muriaé e dos distritos.",
        horario: "Segunda a sexta-feira, das 7h30 às 16h30.",
        documentos: ["Cartão SUS", "Documento pessoal", "Cartão de vacina."]
      },
      {
        id: "crianca-9e10anos",
        idade: "9 a 10 Anos",
        rotulo: "Prevenção",
        vacinas: [
          { nome: "HPV Papilomavírus humano 6, 11, 16 e 18 (HPV4 - recombinante)", descricao: "3 doses", doencas: ["Proteção contra Papilomavírus Humano 6, 11, 16 e 18", "Difteria", "Tétano", "Coqueluche", "Hepatite B", "Infecções por Haemophilus influenzae B."] }
        ],
        local: "Todas as Unidades Básicas de Saúde de Muriaé e dos distritos.",
        horario: "Segunda a sexta-feira, das 7h30 às 16h30.",
        documentos: ["Cartão SUS", "Documento pessoal", "Cartão de vacina."]
      }
    ]
  },
  adolescente: {
    tituloExibicao: "Adolescentes",
    tagLabel: "Adolescentes",
    classNameTagAtiva: styles.tagAdolescentesAtiva,
    tagIconSvg: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M22 21v-2a4 4 0 0 3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    subtitulo: "Reforços e novas proteções para jovens de 11 a 19 anos.",
    icon: "/img/calendario/adolescente.png",
    cards: [
      {
        id: "adolescente-11a14anos",
        idade: "11 a 14 Anos",
        rotulo: "Proteção Jovem",
        vacinas: [
          { nome: "HPV Papilomavírus humano 6, 11, 16 e 18 (HPV4 - recombinante)", descricao: "Dose única", doencas: ["Proteção contra Papilomavírus humano 6, 11, 16 e 18."] },
          { nome: "Meningocócica ACWY (MenACWY - Conjugada)", descricao: "1 dose", doencas: ["Meningite e infecções meningocócicas A, C, W e Y."] }
        ],
        local: "Núcleo de Planejamento Familiar, Rua Coronel Izalino, 154 (próximo ao Hospital São Paulo).",
        horario: "Segunda, quinta e sexta-feira, das 12h30 às 16h30.",
        documentos: ["Certidão de nascimento ou declaração de nascido vivo."]
      },
      {
        id: "adolescente-qualquertempo",
        idade: "A qualquer tempo",
        rotulo: "Atualização",
        vacinas: [
          { nome: "Hepatite B recombinante (HB)", descricao: "Iniciar ou completar 3 doses, de acordo com situação vacinal.", doencas: ["Proteção contra Hepatite B."] },
          { nome: "Difteria e Tétano (dT)", descricao: "Iniciar ou completar 3 doses. Reforço a cada 10 anos ou a cada 5 em ferimentos graves.", doencas: ["Proteção contra difteria e tétano."] },
          { nome: "Febre Amarela (VFA - atenuada)", descricao: "Dose única se não tomou até os 5 anos ou reforço.", doencas: ["Proteção contra febre amarela."] },
          { nome: "Tríplice viral", descricao: "Iniciar ou completar duas doses.", doencas: ["Sarampo, Caxumba, Rubéola."] }
        ],
        local: "Núcleo de Planejamento Familiar, Rua Coronel Izalino, 154 (próximo ao Hospital São Paulo).",
        horario: "Segunda, quinta e sexta-feira, das 12h30 às 16h30.",
        documentos: ["Certidão de nascimento ou declaração de nascido vivo."]
      }
    ]
  },
  idoso: {
    tituloExibicao: "Adultos e Idosos",
    tagLabel: "Adulto / Idoso",
    classNameTagAtiva: styles.tagIdososAtiva,
    tagIconSvg: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="m9 12 2 2 4-4"/>
      </svg>
    ),
    subtitulo: "Vacinas de reforço e imunidade para a fase adulta e 60+.",
    icon: "/img/calendario/idoso.png",
    cards: [
      {
        id: "Adulto-idoso-9a45",
        idade: "9 a 45 Anos",
        rotulo: "Prevenção",
        vacinas: [
          { nome: "HPV Papilomavírus humano 6, 11, 16 e 18 (HPV4 - recombinante)", descricao: "Dose única", doencas: ["Proteção contra Papilomavírus humano 6, 11, 16 e 18."] },
          { nome: "Meningocócica ACWY (MenACWY - Conjugada)", descricao: "1 dose", doencas: ["Infecções meningocócicas dos sorogrupos A, C, W e Y."] }
        ],
        local: "Núcleo de Planejamento Familiar, Rua Coronel Izalino, 154 (próximo ao Hospital São Paulo).",
        horario: "Segunda, quinta e sexta-feira, das 12h30 às 16h30.",
        documentos: ["Certidão de nascimento ou declaração de nascido vivo."]
      },
      {
        id: "Adulto-idoso-18",
        idade: "A partir de 18 Anos",
        rotulo: "Esquema Básico",
        vacinas: [
          { nome: "Hepatite B recombinante (HB)", descricao: "Iniciar ou completar 3 doses, de acordo com situação vacinal.", doencas: ["Proteção contra Hepatite B."] },
          { nome: "Difteria e Tétano (dT)", descricao: "Iniciar ou completar 3 doses. Reforço a cada 10 anos.", doencas: ["Proteção contra difteria e tétano."] },
          { nome: "Febre Amarela (VFA - atenuada)", descricao: "Dose única caso não tenha recebido até os 5 anos.", doencas: ["Proteção contra febre amarela."] },
          { nome: "Tríplice viral", descricao: "Iniciar ou completar duas doses.", doencas: ["Sarampo, Caxumba, Rubéola."] }
        ],
        local: "Núcleo de Planejamento Familiar, Rua Coronel Izalino, 154 (próximo ao Hospital São Paulo).",
        horario: "Segunda, quinta e sexta-feira, das 12h30 às 16h30.",
        documentos: ["Certidão de nascimento ou declaração de nascido vivo."]
      },
      {
        id: "Adulto-idoso-20a29",
        idade: "20 a 29 Anos",
        rotulo: "Adulto Jovem",
        vacinas: [
          { nome: "Hepatite B recombinante (HB)", descricao: "Iniciar ou completar 3 doses, de acordo com situação vacinal.", doencas: ["Proteção contra Hepatite B."] },
          { nome: "Difteria e Tétano (dT)", descricao: "Iniciar ou completar 3 doses. Reforço a cada 10 anos.", doencas: ["Proteção contra difteria e tétano."] },
          { nome: "Febre Amarela (VFA - atenuada)", descricao: "Dose única caso não tenha recebido até os 5 anos.", doencas: ["Proteção contra febre amarela."] },
          { nome: "Tríplice viral", descricao: "Iniciar ou completar duas doses.", doencas: ["Sarampo, Caxumba, Rubéola."] }
        ],
        local: "Núcleo de Planejamento Familiar, Rua Coronel Izalino, 154 (próximo ao Hospital São Paulo).",
        horario: "Segunda, quinta e sexta-feira, das 12h30 às 16h30.",
        documentos: ["Certidão de nascimento ou declaração de nascido vivo."]
      },
      {
        id: "Adulto-idoso-30a59",
        idade: "30 a 59 Anos",
        rotulo: "Fase Adulta",
        vacinas: [
          { nome: "Hepatite B recombinante (HB)", descricao: "Iniciar ou completar 3 doses, de acordo com situação vacinal.", doencas: ["Proteção contra Hepatite B."] },
          { nome: "Difteria e Tétano (dT)", descricao: "Iniciar ou completar 3 doses. Reforço a cada 10 anos.", doencas: ["Proteção contra difteria e tétano."] },
          { nome: "Febre Amarela (VFA - atenuada)", descricao: "Dose única caso não tenha recebido até os 5 anos.", doencas: ["Proteção contra febre amarela."] },
          { nome: "Tríplice viral", descricao: "Iniciar ou completar duas doses.", doencas: ["Sarampo, Caxumba, Rubéola."] }
        ],
        local: "Núcleo de Planejamento Familiar, Rua Coronel Izalino, 154 (próximo ao Hospital São Paulo).",
        horario: "Segunda, quinta e sexta-feira, das 12h30 às 16h30.",
        documentos: ["Certidão de nascimento ou declaração de nascido vivo."]
      },
      {
        id: "Adulto-idoso-60",
        idade: "60 anos e mais",
        rotulo: "Melhor Idade",
        vacinas: [
          { nome: "Hepatite B recombinante (HB)", descricao: "Iniciar ou completar 3 doses.", doencas: ["Proteção contra Hepatite B."] },
          { nome: "Difteria e Tétano (dT)", descricao: "Iniciar ou completar 3 doses. Reforço a cada 10 anos.", doencas: ["Proteção contra difteria e tétano."] },
          { nome: "Febre Amarela (VFA - atenuada)", descricao: "Dose única ou conforme orientação.", doencas: ["Proteção contra febre amarela."] },
          { nome: "Tríplice viral", descricao: "Conforme situação vacinal.", doencas: ["Sarampo, Caxumba, Rubéola."] }
        ],
        local: "Núcleo de Planejamento Familiar, Rua Coronel Izalino, 154 (próximo ao Hospital São Paulo).",
        horario: "Segunda, quinta e sexta-feira, das 12h30 às 16h30.",
        documentos: ["Certidão de nascimento ou declaração de nascido vivo."]
      }
    ]
  }
};

export default function CalendarioVacinalPage() {
  const [grupoAtivo, setGrupoAtivo] = useState('gestante');
  const [cardAberto, setCardAberto] = useState(null); // Controla qual card mostra detalhes estendidos
  
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
                  
                  <span className={`${styles.grupoBaseTag} ${isActive ? gData.classNameTagAtiva : styles.tagInativa}`}>
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
                const isExpanded = cardAberto === (card.id || idx);

                return (
                  <div key={card.id || idx} className={styles.vacinaCard}>
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

                    {/* SEÇÃO EXPANSÍVEL COM DETALHES DE LOCAL, HORÁRIO E DOCUMENTOS */}
                    {(card.local || card.horario || card.documentos) && (
                      <div className={styles.detalhesWrapper}>
                        <button 
                          className={styles.btnToggleInfo}
                          onClick={() => toggleDetalhes(card.id || idx)}
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