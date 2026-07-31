'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Hospital, 
  Syringe, 
  Calendar, 
  Megaphone, 
  Clock, 
  MapPin, 
  AlertTriangle 
} from 'lucide-react';
import { dbServicos, tiposVacinas } from '@/data/servicosData';
import styles from './Vacina.module.css';

export default function VacinaPage() {
  const servico = dbServicos['vacina'];
  const [activeTab, setActiveTab] = useState('campanhas');

  if (!servico) return null;

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
          
          {/* BLOCOR INFORMATIVO PRINCIPAL */}
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