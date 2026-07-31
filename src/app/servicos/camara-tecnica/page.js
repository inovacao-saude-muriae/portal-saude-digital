'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Hospital, 
  ClipboardList, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Building2,
  Info
} from 'lucide-react';
import styles from './CamaraTecnica.module.css';

export default function CamaraTecnicaPage() {
  const dados = {
    title: "Câmara Técnica de Saúde",
    subtituloHero: "Gestão e Assessoria Especializada",
    desc: "A Câmara Técnica é um grupo de especialistas que trabalha para garantir que o cidadão receba o tratamento correto, unindo as necessidades dos pacientes às regras e recursos do SUS.",
    onde: "Secretaria Municipal de Saúde / Setor de Regulação - Muriaé/MG",
    horario: "Segunda a Sexta-feira, das 07h30 às 11h30 e das 13h00 às 17h00",
    atribuicoes: [
      "Prestar assessoria à Gestão Municipal de Saúde no processo de oferta de medicamentos, exames, tratamentos e materiais médicos que estejam fora das listas padrão e das diretrizes do SUS (PCDT), sempre que houver prescrição feita por profissionais habilitados.",
      "Estabelecer roteiros padronizados de atendimento para organizar as rotinas e os cuidados prestados na assistência à saúde.",
      "Analisar as justificativas dos profissionais para o uso de itens fora da rede, emitindo um parecer que recomende a continuidade do tratamento, a sua substituição por alternativas previstas no SUS ou, se necessário, o indeferimento por falta de eficácia.",
      "Promover encontros de trabalho entre os especialistas das áreas assistenciais para discutir e integrar as ações de saúde.",
      "Submeter anualmente à revisão pericial os pacientes com sentenças judiciais definitivas. A perícia deve atestar se a manutenção do tratamento ainda se justifica ou se houve mudança na situação real do paciente que permita a troca por outras terapias ou até a suspensão do fornecimento."
    ],
    apoioInstitucional: "Prestar auxílio técnico ao Poder Judiciário, Ministério Público, Defensoria Pública, OAB e à Procuradoria Geral do Município por meio de Acordos de Cooperação. O objetivo é fornecer laudos e perícias que garantam o cumprimento dos protocolos do SUS e a adoção de terapias alternativas, evitando gastos desnecessários para o município.",
    avisoPericia: "Todas as pessoas que recebem remédios, materiais ou tratamentos pelo SUS poderão passar por perícias periódicas, seguindo as regras e critérios definidos pela Câmara Técnica de Saúde."
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
                <p>{dados.desc}</p>
              </div>

              {/* ATRIBUIÇÕES */}
              <div className={styles.infoBlock}>
                <h3>
                  <ShieldCheck size={22} color="#008a83" /> Atribuições da Câmara Técnica de Saúde
                </h3>
                <ul className={styles.docList}>
                  {dados.atribuicoes.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* APOIO INSTITUCIONAL */}
              <div className={styles.infoBlock}>
                <h3>
                  <Building2 size={22} color="#008a83" /> Apoio Institucional
                </h3>
                <p>{dados.apoioInstitucional}</p>
              </div>

              {/* INFORMAÇÃO IMPORTANTE / AVISO DE PERÍCIA */}
              <div className={styles.infoBlock} style={{ backgroundColor: '#f0fdfa', borderColor: '#008a83' }}>
                <h3 style={{ color: '#008a83', borderBottomColor: '#ccfbf1' }}>
                  <Info size={22} color="#008a83" /> Perícias Periódicas
                </h3>
                <p style={{ margin: 0, fontWeight: 500, color: '#0f766e' }}>
                  {dados.avisoPericia}
                </p>
              </div>
            </div>

            {/* BARRA LATERAL (SIDEBAR) */}
            <aside className={styles.sidebarArea}>
              
              <div className={`${styles.widgetBox} ${styles.destaqueCard}`}>
                <div className={styles.widgetHeader}>
                  <ShieldCheck size={20} /> Transparência e Rigor
                </div>
                <p className={styles.widgetText}>
                  A análise garante que todos os pedidos atendam aos critérios clínicos e às diretrizes dos protocolos oficiais do SUS.
                </p>
              </div>

              {/* ONDE ENCONTRAR */}
              <div className={styles.widgetBox}>
                <div className={styles.widgetHeader}>
                  <MapPin size={20} /> Onde Encontrar
                </div>
                <p className={styles.widgetText}>{dados.onde}</p>
              </div>

              {/* HORÁRIO DE FUNCIONAMENTO */}
              <div className={styles.widgetBox}>
                <div className={styles.widgetHeader}>
                  <Clock size={20} /> Horário de Atendimento
                </div>
                <p className={styles.widgetText}>{dados.horario}</p>
              </div>

            </aside>

          </div>

        </div>
      </main>

    </div>
  );
}