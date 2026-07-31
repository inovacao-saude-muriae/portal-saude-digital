'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Hospital, 
  ClipboardList, 
  Clock, 
  MapPin, 
  FileText, 
  ShieldCheck, 
  ListOrdered
} from 'lucide-react';
import { dbServicos } from '@/data/servicosData';
import styles from './CamaraTecnica.module.css';

export default function CamaraTecnicaPage() {
  const servico = dbServicos['camara-tecnica'];

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
            Avaliação e consultoria especializada de profissionais de saúde para análise técnica de solicitações de medicamentos, procedimentos e tratamentos de alta complexidade no SUS.
          </p>
        </div>
      </section>

      {/* 2. BARRA DE NAVEGAÇÃO SUPERIOR */}
      <nav className={styles.navigationBar}>
        <div className={styles.navContainer}>
          <Link href="/servicos" className={styles.backLink}>
            <ArrowLeft size={16} /> Voltar para Serviços
          </Link>
          <span className={styles.navTag}>Gestão & Regulação - SUS</span>
        </div>
      </nav>

      {/* 3. CONTEÚDO PRINCIPAL */}
      <main className={styles.mainContent}>
        <div className={styles.container}>
          
          <div className={styles.serviceLayout}>
            
            {/* COLUNA PRINCIPAL */}
            <div>
              {/* SOBRE A CÂMARA TÉCNICA */}
              <div className={styles.infoBlock}>
                <h2>
                  <ClipboardList size={22} color="#008a83" /> Sobre a Câmara Técnica
                </h2>
                <p>{servico.desc}</p>
              </div>

              {/* SEÇÕES ADICIONAIS / ATRIBUÍÇÕES */}
              {servico.secoesTexto && servico.secoesTexto.map((secao, idx) => (
                <div key={idx} className={styles.infoBlock}>
                  <h3>
                    <ShieldCheck size={22} color="#008a83" /> {secao.titulo}
                  </h3>
                  {secao.paragrafo && <p>{secao.paragrafo}</p>}
                  {secao.itens && secao.itens.length > 0 && (
                    <ul className={styles.docList}>
                      {secao.itens.map((item, itemIdx) => (
                        <li key={itemIdx}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}

              {/* PASSO A PASSO PARA SOLICITAÇÃO */}
              {servico.passoAPasso && servico.passoAPasso.length > 0 && (
                <div className={styles.infoBlock}>
                  <h3>
                    <ListOrdered size={22} color="#008a83" /> Etapas do Processo
                  </h3>
                  <ol className={styles.docList}>
                    {servico.passoAPasso.map((passo, idx) => (
                      <li key={idx}>{passo}</li>
                    ))}
                  </ol>
                </div>
              )}

              {/* DOCUMENTAÇÃO NECESSÁRIA */}
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
              
              <div className={`${styles.widgetBox} ${styles.destaqueCard}`}>
                <div className={styles.widgetHeader}>
                  <ShieldCheck size={20} /> Transparência e Rigor
                </div>
                <p className={styles.widgetText}>
                  A análise garante que todos os pedidos atendam aos critérios clínicos nacionais e às normas vigentes do Ministério da Saúde.
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