'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Hospital, 
  Pill, 
  Clock, 
  MapPin, 
  FileText, 
  ListOrdered,
  ShieldCheck,
  PackageCheck
} from 'lucide-react';
import { dbServicos } from '@/data/servicosData';
import styles from './FarmaciaMunicipal.module.css';

export default function FarmaciaMunicipalPage() {
  const servico = dbServicos['farmacia-municipal'];

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
            Fornecimento gratuito de medicamentos essenciais da Atenção Básica e intermediação de medicamentos de Alto Custo (Componente Especializado) pelo Sistema Único de Saúde (SUS).
          </p>
        </div>
      </section>

      {/* 2. BARRA DE NAVEGAÇÃO SUPERIOR */}
      <nav className={styles.navigationBar}>
        <div className={styles.navContainer}>
          <Link href="/servicos" className={styles.backLink}>
            <ArrowLeft size={16} /> Voltar para Serviços
          </Link>
          <span className={styles.navTag}>Assistência Farmacêutica - SUS</span>
        </div>
      </nav>

      {/* 3. CONTEÚDO PRINCIPAL */}
      <main className={styles.mainContent}>
        <div className={styles.container}>
          
          <div className={styles.serviceLayout}>
            
            {/* COLUNA PRINCIPAL */}
            <div>
              {/* SOBRE A FARMÁCIA MUNICIPAL */}
              <div className={styles.infoBlock}>
                <h2>
                  <Pill size={22} color="#008a83" /> Sobre a Assistência Farmacêutica
                </h2>
                <p>{servico.desc}</p>
                <p>
                  A Relação Municipal de Medicamentos Essenciais (REMUME) inclui remédios para tratamento de hipertensão, diabetes, infecções, analgésicos, antitérmicos e saúde mental, garantindo continuidade ao tratamento prescrito nas UBSs e hospitais do SUS.
                </p>
              </div>

              {/* TIPO DE DISPENSAÇÃO / SEÇÕES */}
              <div className={styles.infoBlock}>
                <h3>
                  <PackageCheck size={22} color="#008a83" /> Modalidades de Atendimento
                </h3>
                <ul className={styles.docList}>
                  <li>
                    <strong>Farmácia Básica / Unidades Básicas de Saúde (UBS):</strong> Dispensação de remédios de uso contínuo e agudo pertencentes à lista REMUME.
                  </li>
                  <li>
                    <strong>Componente Especializado (Alto Custo):</strong> Medicamentos para doenças crônicas ou raras fornecidos em parceria com a Secretaria de Estado de Saúde de Minas Gerais (SES-MG).
                  </li>
                </ul>
              </div>

              {/* PASSO A PASSO PARA RETIRADA */}
              {servico.passoAPasso && servico.passoAPasso.length > 0 && (
                <div className={styles.infoBlock}>
                  <h3>
                    <ListOrdered size={22} color="#008a83" /> Como Retirar seu Medicamento
                  </h3>
                  <ol className={styles.docList}>
                    {servico.passoAPasso.map((passo, idx) => (
                      <li key={idx}>{passo}</li>
                    ))}
                  </ol>
                </div>
              )}

              {/* DOCUMENTOS EXIGIDOS */}
              {servico.documentos && servico.documentos.length > 0 && (
                <div className={styles.infoBlock}>
                  <h3>
                    <FileText size={22} color="#008a83" /> Documentação Obrigatória
                  </h3>
                  <ul className={styles.docList}>
                    {servico.documentos.map((doc, idx) => (
                      <li key={idx}>{doc}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* BARRA LATERAL (SIDEBAR) */}
            <aside className={styles.sidebarArea}>
              
              <div className={`${styles.widgetBox} ${styles.destaqueCard}`}>
                <div className={styles.widgetHeader}>
                  <ShieldCheck size={20} /> Validade da Receita
                </div>
                <p className={styles.widgetText}>
                  Receitas de uso contínuo possuem validade de até 6 meses. Receitas de antibióticos e medicamentos controlados têm regras e prazos específicos.
                </p>
              </div>

              {/* ONDE ENCONTRAR */}
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