'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Hospital, 
  Droplets, 
  Clock, 
  MapPin, 
  FileText, 
  Heart, 
  Dna,
  CheckCircle2,
  Info
} from 'lucide-react';
import styles from './DoacaoSangue.module.css';

export default function DoacaoSanguePage() {
  const dados = {
    title: "Doação de Sangue e Medula Óssea",
    subtituloHero: "Um Gesto de Solidariedade que Salva Vidas",
    desc: "A doação de sangue e de medula óssea é um ato voluntário que pode transformar e salvar vidas. Muitas pessoas enfrentam doenças graves e dependem de transfusões ou de um transplante de medula para sobreviver. Um simples ato de generosidade pode fazer toda a diferença para quem está lutando por um futuro.\n\nO processo de doação é seguro, rápido e traz esperança para aqueles que dependem dessa ajuda. Se você está dentro dos critérios de saúde, pode se tornar um doador e fazer parte dessa corrente de cuidado.",
    
    sangue: {
      requisitos: [
        "Apresentar documento de identidade oficial com foto e CPF;",
        "Estar em excelentes condições gerais de saúde;",
        "Ter entre 16 e 69 anos (menores de 18 anos necessitam de autorização formal dos responsáveis);",
        "Apresentar peso corporal acima de 50 kg;",
        "Não estar em jejum absoluto;",
        "Evitar a ingestão de alimentos gordurosos nas 3 horas que antecedem a doação."
      ]
    },

    medula: {
      requisitos: "Pessoas saudáveis entre 18 e 35 anos podem se cadastrar como doadoras de medula óssea, desde que não apresentem histórico de doenças infecciosas transmissíveis ou patologias hematológicas.",
      comoFunciona: "O cadastro para doação de medula óssea é simples, seguro e rápido. No local de coleta, uma equipe de enfermagem realiza a retirada de uma pequena amostra de sangue (cerca de 5 ml) para identificar as características genéticas de histocompatibilidade (teste de HLA) do doador.\n\nEssas informações são inseridas com total segurança no Registro Nacional de Doadores de Medula Óssea (REDOME) e cruzadas continuamente com os dados de pacientes que necessitam do transplante. Havendo compatibilidade futura com algum paciente, o doador é imediatamente contatado para dar continuidade ao processo."
    },

    localMuriae: {
      horario: "Toda quarta-feira, das 7h30 às 15h",
      local: "Posto Avançado de Coleta Externa (PACE)",
      endereco: "Rua Dr. Ivan Américo / R. Menotti Porcaro, s/n – Centro, Muriaé (Prédio do antigo Viva a Vida)."
    }
  };

  return (
    <div className={styles.pageWrapper}>
      
      {/* 1. HERO BANNER */}
      <section className={styles.heroBanner}>
        <div className={styles.container}>
          <div className={styles.badgeHeader}>
            <Hospital size={14} /> Rede Pública de Saúde de Muriaé
          </div>
          <h1 className={styles.heroTitle}>{dados.title}</h1>
          <p className={styles.heroDesc}>
            {dados.subtituloHero}
          </p>
        </div>
      </section>

      {/* 2. BARRA DE NAVEGAÇÃO SUPERIOR */}
      <nav className={styles.navigationBar}>
        <div className={styles.navContainer}>
          <Link href="/servicos" className={styles.backLink}>
            <ArrowLeft size={16} /> Voltar para Serviços
          </Link>
          <span className={styles.navTag}>PACE Hemominas & Doação de Vidas</span>
        </div>
      </nav>

      {/* 3. CONTEÚDO PRINCIPAL */}
      <main className={styles.mainContent}>
        <div className={styles.container}>
          
          <div className={styles.serviceLayout}>
            
            {/* COLUNA PRINCIPAL */}
            <div>
              {/* SOBRE A DOAÇÃO */}
              <div className={styles.infoBlock}>
                <h2>
                  <Heart size={22} color="#008a83" /> Um Ato de Amor e Esperança
                </h2>
                {dados.desc.split('\n\n').map((paragrafo, idx) => (
                  <p key={idx}>{paragrafo}</p>
                ))}
              </div>

              {/* DOAÇÃO DE SANGUE */}
              <div className={styles.infoBlock}>
                <h3>
                  <Droplets size={22} color="#008a83" /> Doação de Sangue
                </h3>
                <p style={{ marginBottom: '12px', fontWeight: 500 }}>
                  Para doar sangue, os voluntários devem cumprir os seguintes pré-requisitos:
                </p>
                <ul className={styles.docList}>
                  {dados.sangue.requisitos.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>

              {/* DOAÇÃO DE MEDULA ÓSSEA */}
              <div className={styles.infoBlock}>
                <h3>
                  <Dna size={22} color="#008a83" /> Doação de Medula Óssea
                </h3>
                <p style={{ marginBottom: '16px' }}>{dados.medula.requisitos}</p>
                
                <h4 style={{ color: '#003b5c', fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>
                  Como funciona o cadastro
                </h4>
                {dados.medula.comoFunciona.split('\n\n').map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              {/* ALERTA DE ONDE DOAR EM MURIAÉ */}
              <div className={styles.infoBlock} style={{ backgroundColor: '#f0fdfa', borderColor: '#008a83' }}>
                <h3 style={{ color: '#008a83', borderBottomColor: '#ccfbf1' }}>
                  <Info size={22} color="#008a83" /> Onde Doar em Muriaé
                </h3>
                <p style={{ margin: '0 0 6px 0', fontWeight: 700, color: '#0f766e' }}>
                  {dados.localMuriae.horario} no {dados.localMuriae.local}.
                </p>
                <p style={{ margin: 0, color: '#0f766e' }}>
                  <strong>Endereço:</strong> {dados.localMuriae.endereco}
                </p>
              </div>
            </div>

            {/* BARRA LATERAL (SIDEBAR) */}
            <aside className={styles.sidebarArea}>
              
              {/* ONDE ENCONTRAR */}
              <div className={styles.widgetBox}>
                <div className={styles.widgetHeader}>
                  <MapPin size={20} /> Local de Coleta em Muriaé
                </div>
                <p className={styles.widgetText}>{dados.localMuriae.local}</p>
                <p className={styles.widgetText} style={{ marginTop: '8px', fontSize: '13px', color: '#64748b' }}>
                  {dados.localMuriae.endereco}
                </p>
              </div>

              {/* HORÁRIO DE ATENDIMENTO */}
              <div className={styles.widgetBox}>
                <div className={styles.widgetHeader}>
                  <Clock size={20} /> Dia e Horário de Funcionamento
                </div>
                <p className={styles.widgetText}>{dados.localMuriae.horario}</p>
              </div>

              {/* REQUISITOS RÁPIDOS */}
              <div className={`${styles.widgetBox} ${styles.requisitosCard}`}>
                <div className={styles.widgetHeader}>
                  <CheckCircle2 size={20} /> Requisitos Rápidos
                </div>
                <p className={styles.widgetText}>
                  • Peso acima de 50 kg<br />
                  • Idade entre 16 e 69 anos<br />
                  • Documento oficial com foto e CPF<br />
                  • Não estar em jejum absoluto
                </p>
              </div>

            </aside>

          </div>

        </div>
      </main>

    </div>
  );
}