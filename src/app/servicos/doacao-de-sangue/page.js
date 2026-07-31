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
  CheckCircle2, 
  Heart, 
  ListOrdered
} from 'lucide-react';
import { dbServicos } from '@/data/servicosData';
import styles from './DoacaoSangue.module.css';

export default function DoacaoSanguePage() {
  const servico = dbServicos['doacao-de-sangue'];

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
            Um gesto simples e seguro que salva até 4 vidas por doação. Cadastre-se também no Registro Nacional de Doadores de Medula Óssea (REDOME).
          </p>
        </div>
      </section>

      {/* 2. BARRA DE NAVEGAÇÃO SUPERIOR */}
      <nav className={styles.navigationBar}>
        <div className={styles.navContainer}>
          <Link href="/servicos" className={styles.backLink}>
            <ArrowLeft size={16} /> Voltar para Serviços
          </Link>
          <span className={styles.navTag}>Hemominas & PACE Muriaé</span>
        </div>
      </nav>

      {/* 3. CONTEÚDO PRINCIPAL */}
      <main className={styles.mainContent}>
        <div className={styles.container}>
          
          <div className={styles.serviceLayout}>
            
            {/* COLUNA PRINCIPAL */}
            <div>
              {/* CAIXA DE IMPACTO DE SOLIDARIEDADE */}
              <div className={styles.solidariedadeBox}>
                <h3>
                  <Heart size={20} color="#e11d48" /> Um Ato de Amor ao Próximo
                </h3>
                <p>
                  A doação de sangue é um procedimento seguro, rápido e com material 100% descartável. Uma única doação pode salvar a vida de vítimas de acidentes, pacientes em cirurgias de grande porte e pessoas em tratamento contra o câncer.
                </p>
              </div>

              {/* SOBRE O SERVIÇO */}
              <div className={styles.infoBlock}>
                <h2>
                  <Droplets size={22} color="#008a83" /> Doação de Sangue e Medula Óssea
                </h2>
                <p>{servico.desc}</p>
                <p>
                  <strong>Cadastro de Doadores de Medula Óssea:</strong> No momento da doação de sangue, você também pode solicitar a coleta de apenas 5ml de sangue para se cadastrar no REDOME. Caso haja compatibilidade no futuro com algum paciente no Brasil ou no mundo, você será chamado para a doação da medula.
                </p>
              </div>

              {/* PASSO A PASSO DA DOAÇÃO */}
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
              
              {/* REQUISITOS PARA DOAR */}
              {servico.requisitos && (
                <div className={`${styles.widgetBox} ${styles.requisitosCard}`}>
                  <div className={styles.widgetHeader}>
                    <CheckCircle2 size={20} /> Requisitos Básicos
                  </div>
                  <p className={styles.widgetText}>{servico.requisitos}</p>
                </div>
              )}

              {/* ONDE ENCONTRAR */}
              {servico.onde && (
                <div className={styles.widgetBox}>
                  <div className={styles.widgetHeader}>
                    <MapPin size={20} /> Local de Coleta (PACE)
                  </div>
                  <p className={styles.widgetText}>{servico.onde}</p>
                </div>
              )}

              {/* HORÁRIO DE FUNCIONAMENTO */}
              {servico.horario && (
                <div className={styles.widgetBox}>
                  <div className={styles.widgetHeader}>
                    <Clock size={20} /> Horário de Coleta
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