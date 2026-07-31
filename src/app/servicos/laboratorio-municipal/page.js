'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Hospital, 
  FlaskConical, 
  Clock, 
  MapPin, 
  FileText, 
  ListOrdered,
  TestTube,
  Info
} from 'lucide-react';
import { dbServicos } from '@/data/servicosData';
import styles from './LaboratorioMunicipal.module.css';

export default function LaboratorioMunicipalPage() {
  const servico = dbServicos['laboratorio-municipal'];

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
            Realização de exames de análises clínicas com precisão, agilidade e gratuidade para apoio diagnóstico aos pacientes do SUS.
          </p>
        </div>
      </section>

      {/* 2. BARRA DE NAVEGAÇÃO SUPERIOR */}
      <nav className={styles.navigationBar}>
        <div className={styles.navContainer}>
          <Link href="/servicos" className={styles.backLink}>
            <ArrowLeft size={16} /> Voltar para Serviços
          </Link>
          <span className={styles.navTag}>Apoio Diagnóstico - SUS</span>
        </div>
      </nav>

      {/* 3. CONTEÚDO PRINCIPAL */}
      <main className={styles.mainContent}>
        <div className={styles.container}>
          
          <div className={styles.serviceLayout}>
            
            {/* COLUNA PRINCIPAL */}
            <div>
              {/* SOBRE O LABORATÓRIO MUNICIPAL */}
              <div className={styles.infoBlock}>
                <h2>
                  <FlaskConical size={22} color="#008a83" /> Sobre o Laboratório Municipal
                </h2>
                <p>{servico.desc}</p>
                <p>
                  A unidade realiza exames de sangue, urina, fezes, bioquímica, parasitologia, imunologia e hormônios, atendendo a solicitações da Atenção Básica, Especialidades e Urgências do município.
                </p>
              </div>

              {/* ALERTA SOBRE JEJUM E PREPARO */}
              <div className={styles.alertaPreparo}>
                <h3>
                  <Info size={20} /> Orientação Importante sobre o Preparo
                </h3>
                <p>
                  Alguns exames de sangue necessitam de jejum prévio de 8 a 12 horas (conforme instrução médica). Para exames de urina e fezes, solicite o frasco estéril apropriado com antecedência na recepção do laboratório ou em sua UBS.
                </p>
              </div>

              {/* PASSO A PASSO PARA REALIZAÇÃO */}
              {servico.passoAPasso && servico.passoAPasso.length > 0 && (
                <div className={styles.infoBlock}>
                  <h3>
                    <ListOrdered size={22} color="#008a83" /> Etapas do Atendimento
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
                    <FileText size={22} color="#008a83" /> Documentação Exigida
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
              
              {/* ONDE ENCONTRAR */}
              {servico.onde && (
                <div className={styles.widgetBox}>
                  <div className={styles.widgetHeader}>
                    <MapPin size={20} /> Localização
                  </div>
                  <p className={styles.widgetText}>{servico.onde}</p>
                </div>
              )}

              {/* HORÁRIO DE FUNCIONAMENTO */}
              {servico.horario && (
                <div className={styles.widgetBox}>
                  <div className={styles.widgetHeader}>
                    <Clock size={20} /> Horários de Atendimento
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