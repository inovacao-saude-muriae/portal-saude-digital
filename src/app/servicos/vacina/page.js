'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Hospital, 
  Syringe, 
  Calendar, 
  Megaphone, 
  AlertTriangle 
} from 'lucide-react';
import styles from './Vacina.module.css';

/* ==========================================================================
   DADOS ESPECÍFICOS DA PÁGINA DE VACINAS
   ========================================================================== */
const servico = {
  id: 'vacina',
  title: 'Vacina',
  desc: 'Imunização para todas as faixas etárias segundo o calendário oficial.'
};

export const tiposVacinas = [
  {
    id: 1,
    titulo: "Vacinação de Rotina (Caderneta)",
    desc: "Atualização sistemática do esquema vacinal conforme o Calendário Nacional para crianças, adolescentes, adultos e idosos.",
    proceder: "Comparecer a uma UBS portando a caderneta para avaliação do profissional.",
    locais: "Todas as Unidades Básicas de Saúde (UBS) do município.",
    docs: "Documento oficial de identificação, Cartão SUS e Caderneta de Vacinação."
  },
  {
    id: 2,
    titulo: "Vacina Antirrábica Humana",
    desc: "Imunização pós-exposição preventiva para pessoas mordidas, arranhadas ou arranhadas por animais suspeitos.",
    proceder: "Lavar o ferimento com água e sabão e procurar atendimento imediatamente.",
    locais: "UBS Safira, UBS São Francisco, Hospital Municipal e UPA.",
    docs: "Documento oficial, Cartão SUS e Guia de Atendimento de Acidente Animal."
  },
  {
    id: 3,
    titulo: "Vacinação contra Covid-19",
    desc: "Doses de imunização e reforço contra o coronavírus para os grupos prioritários convocados.",
    proceder: "Acompanhar os comunicados semanais da Secretaria de Saúde.",
    locais: "UBS Polos divulgadas nos canais oficiais.",
    docs: "Documento com foto, CPF e Cartão do SUS."
  },
  {
    id: 4,
    titulo: "Vacina contra a Dengue",
    desc: "Imunização para redução de complicações e internações por dengue.",
    proceder: "Faixa etária convocada (10 a 14 anos) deve comparecer acompanhada dos pais.",
    locais: "Salas de vacinação polos do município.",
    docs: "Documento da criança, CPF e comprovante de residência.",
    alerta: "Contraindicada para gestantes, lactantes e imunossuprimidos."
  }
];

export default function VacinaPage() {
  const [activeTab, setActiveTab] = useState('campanhas');

  return (
    <div className={styles.pageWrapper}>
      
      {/* 1. HERO BANNER */}
      <section className={styles.heroBanner}>
        <div className={styles.container}>
          <div className={styles.badgeHeader}>
            <Hospital size={14} /> Rede Pública de Saúde de Muriaé
          </div>
          <h1 className={styles.heroTitle}>{servico.title}</h1>
          <p className={styles.heroDesc}>
            Imunização gratuita e segura para todas as faixas etárias, conforme as diretrizes do Programa Nacional de Imunizações (PNI).
          </p>
        </div>
      </section>

      {/* 2. BARRA DE NAVEGAÇÃO SUPERIOR */}
      <nav className={styles.navigationBar}>
        <div className={styles.navContainer}>
          <Link href="/servicos" className={styles.backLink}>
            <ArrowLeft size={16} /> Voltar para Serviços
          </Link>
          <span className={styles.navTag}>Imunização & Vigilância em Saúde</span>
        </div>
      </nav>

      {/* 3. CONTEÚDO PRINCIPAL */}
      <main className={styles.mainContent}>
        <div className={styles.container}>
          
          {/* BLOCO INFORMATIVO PRINCIPAL */}
          <div className={styles.infoBlock}>
            <h2>
              <Syringe size={22} color="#008a83" /> Programa Nacional de Imunizações (PNI)
            </h2>
            <p>{servico.desc}</p>
            <p>
              As vacinas estão disponíveis nas Salas de Vacina das Unidades Básicas de Saúde (UBS). Para vacinar, basta comparecer com documento de identificação, Cartão SUS e a Caderneta de Vacinação.
            </p>
          </div>

          {/* BARRA DE NAVEGAÇÃO DE ABAS E CALENDÁRIO */}
          <div className={styles.tabHeader}>
            <button 
              className={`${styles.tabButton} ${activeTab === 'campanhas' ? styles.tabButtonActive : ''}`}
              onClick={() => setActiveTab('campanhas')}
            >
              <Megaphone size={18} /> Campanhas & Tipos de Vacina
            </button>
            
            <Link 
              href="/calendario-vacinal" 
              className={`${styles.tabButton} ${styles.calendarLink}`}
            >
              <Calendar size={18} /> Ver Calendário Vacinal Completo ↗
            </Link>
          </div>

          {/* CARDS DE VACINAS E CAMPANHAS */}
          {activeTab === 'campanhas' && (
            <div className={styles.vacinacaoGrid}>
              {tiposVacinas.map((vacina) => (
                <div key={vacina.id} className={styles.vacinaCard}>
                  <h3 className={styles.vacinaCardTitle}>{vacina.titulo}</h3>
                  <p className={styles.vacinaCardDesc}>{vacina.desc}</p>
                  
                  <div className={styles.vacinaSection}>
                    <strong>Como Proceder:</strong>
                    <p>{vacina.proceder}</p>
                  </div>

                  <div className={styles.vacinaSection}>
                    <strong>Locais de Atendimento:</strong>
                    <p>{vacina.locais}</p>
                  </div>

                  <div className={styles.vacinaSection}>
                    <strong>Documentação Exigida:</strong>
                    <p>{vacina.docs}</p>
                  </div>

                  {vacina.alerta && (
                    <div className={styles.vacinaAlerta}>
                      <p>
                        <AlertTriangle size={14} style={{ display: 'inline', marginRight: '4px' }} />
                        {vacina.alerta}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>
      </main>

    </div>
  );
}