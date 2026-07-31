'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Hospital, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  FileText, 
  FileCheck, 
  AlertTriangle 
} from 'lucide-react';
import { dbServicos } from '@/data/servicosData';
import styles from './VigilanciaSanitaria.module.css';

export default function VigilanciaSanitariaPage() {
  const servico = dbServicos['vigilancia-sanitaria'];

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
            Fiscalização, orientação e regulamentação sanitária em comércios, indústrias e serviços de saúde para eliminação de riscos à população.
          </p>
        </div>
      </section>

      {/* 2. BARRA DE NAVEGAÇÃO SUPERIOR */}
      <nav className={styles.navigationBar}>
        <div className={styles.navContainer}>
          <Link href="/servicos" className={styles.backLink}>
            <ArrowLeft size={16} /> Voltar para Serviços
          </Link>
          <span className={styles.navTag}>Vigilância em Saúde - SUS</span>
        </div>
      </nav>

      {/* 3. CONTEÚDO PRINCIPAL */}
      <main className={styles.mainContent}>
        <div className={styles.container}>
          
          <div className={styles.serviceLayout}>
            
            {/* COLUNA PRINCIPAL */}
            <div>
              {/* SOBRE A VIGILÂNCIA SANITÁRIA */}
              <div className={styles.infoBlock}>
                <h2>
                  <ShieldCheck size={22} color="#008a83" /> Sobre a Vigilância Sanitária
                </h2>
                <p>{servico.desc}</p>
                <p>
                  A VISA atua na proteção da saúde coletiva inspecionando estabelecimentos alimentícios, farmácias, clínicas, consultórios, saneantes, além de monitorar a qualidade da água e produtos consumidos no município.
                </p>
              </div>

              {/* SEÇÕES DE SERVIÇOS OFERECIDOS */}
              {servico.secoesTexto && servico.secoesTexto.map((secao, idx) => (
                <div key={idx} className={styles.infoBlock}>
                  <h3>
                    <FileCheck size={22} color="#008a83" /> {secao.titulo}
                  </h3>
                  {secao.paragrafo && <p>{secao.paragrafo}</p>}
                </div>
              ))}

              {/* DOCUMENTAÇÃO NECESSÁRIA */}
              {servico.documentos && servico.documentos.length > 0 && (
                <div className={styles.infoBlock}>
                  <h3>
                    <FileText size={22} color="#008a83" /> Documentação para Licenciamento
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
                  <AlertTriangle size={20} /> Denúncias Sanitárias
                </div>
                <p className={styles.widgetText}>
                  Suspeitas de irregularidades sanitárias em comércios de alimentos, medicamentos ou serviços podem ser informadas presencialmente na sede da VISA.
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