'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Hospital, 
  Home, 
  Clock, 
  MapPin, 
  FileText, 
  CheckCircle2, 
  ListOrdered,
  AlertCircle
} from 'lucide-react';
import { dbServicos } from '@/data/servicosData';
import styles from './AtendimentoDomiciliar.module.css';

export default function AtendimentoDomiciliarPage() {
  const servico = dbServicos['atendimento-domiciliar'];

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
            O Serviço de Atendimento Domiciliar (SAD) leva cuidados médicos, de enfermagem e multiprofissionais diretamente à residência de pacientes com restrição de mobilidade.
          </p>
        </div>
      </section>

      {/* 2. BARRA DE NAVEGAÇÃO SUPERIOR */}
      <nav className={styles.navigationBar}>
        <div className={styles.navContainer}>
          <Link href="/servicos" className={styles.backLink}>
            <ArrowLeft size={16} /> Voltar para Serviços
          </Link>
          <span className={styles.navTag}>Atenção Domiciliar - SUS</span>
        </div>
      </nav>

      {/* 3. CONTEÚDO PRINCIPAL */}
      <main className={styles.mainContent}>
        <div className={styles.container}>
          
          <div className={styles.serviceLayout}>
            
            {/* COLUNA PRINCIPAL - INFORMAÇÕES E PASSO A PASSO */}
            <div>
              {/* SOBRE O SERVIÇO */}
              <div className={styles.infoBlock}>
                <h2>
                  <Home size={22} color="#008a83" /> Sobre o Atendimento Domiciliar
                </h2>
                <p>{servico.desc}</p>
                <p>
                  O acompanhamento visa proporcionar melhor qualidade de vida, reabilitação humanizada, além de evitar internações hospitalares desnecessárias e reduzir o tempo de permanência em leitos hospitalares.
                </p>
              </div>

              {/* PASSO A PASSO PARA SOLICITAR */}
              {servico.passoAPasso && servico.passoAPasso.length > 0 && (
                <div className={styles.infoBlock}>
                  <h3>
                    <ListOrdered size={22} color="#008a83" /> Como Solicitar o Acompanhamento
                  </h3>
                  <ol className={styles.docList}>
                    {servico.passoAPasso.map((passo, idx) => (
                      <li key={idx}>{passo}</li>
                    ))}
                  </ol>
                </div>
              )}

              {/* DOCUMENTAÇÃO EXIGIDA */}
              {servico.documentos && servico.documentos.length > 0 && (
                <div className={styles.infoBlock}>
                  <h3>
                    <FileText size={22} color="#008a83" /> Documentação Necessária
                  </h3>
                  <ul className={styles.docList}>
                    {servico.documentos.map((doc, idx) => (
                      <li key={idx}>{doc}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* BARRA LATERAL - ONDE ENCONTRAR E HORÁRIOS */}
            <aside className={styles.sidebarArea}>
              
              {/* REQUISITOS DE ACESSO */}
              {servico.requisitos && (
                <div className={`${styles.widgetBox} ${styles.requisitosCard}`}>
                  <div className={styles.widgetHeader}>
                    <CheckCircle2 size={20} /> Quem Tem Direito
                  </div>
                  <p className={styles.widgetText}>{servico.requisitos}</p>
                </div>
              )}

              {/* ONDE OCORRE O ATENDIMENTO */}
              {servico.onde && (
                <div className={styles.widgetBox}>
                  <div className={styles.widgetHeader}>
                    <MapPin size={20} /> Onde Encontrar
                  </div>
                  <p className={styles.widgetText}>{servico.onde}</p>
                </div>
              )}

              {/* HORÁRIO DE FUNCIONAMENTO */}
              {servico.horario && (
                <div className={styles.widgetBox}>
                  <div className={styles.widgetHeader}>
                    <Clock size={20} /> Horário de Atendimento
                  </div>
                  <p className={styles.widgetText}>{servico.horario}</p>
                </div>
              )}

            </aside>

          </div>

        </div>
      </main>

    </div>
  );
}