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
  Phone,
  Baby,
  CalendarCheck
} from 'lucide-react';
import styles from './LaboratorioMunicipal.module.css';

export default function LaboratorioMunicipalPage() {
  const dados = {
    title: "Laboratório Municipal",
    subtituloHero: "Diagnóstico e Apoio à Saúde da População",
    desc: "O Laboratório Municipal é responsável pela realização de exames laboratoriais oferecidos pelo Sistema Único de Saúde (SUS), desempenhando um papel essencial no diagnóstico, prevenção e acompanhamento de doenças. Por meio desse serviço, a população tem acesso gratuito a exames que auxiliam os profissionais de saúde na identificação precoce de alterações e na condução adequada dos tratamentos.",
    
    agendamento: {
      forma: "O agendamento é realizado exclusivamente de forma presencial no balcão de atendimento do laboratório.",
      documentos: [
        "Pedido médico oficial emitido pelo SUS;",
        "Documento de identidade oficial com foto e CPF;",
        "Comprovante de residência atualizado no município;",
        "Cartão Nacional de Saúde (Cartão SUS) atualizado;",
        "Número de telefone ativo para contato com o paciente;",
        "No caso de menores de idade: certidão de nascimento da criança acompanhada do documento de identidade do responsável legal."
      ],
      alertaGestantes: "Além dos documentos citados, as gestantes deverão apresentar a Caderneta de Pré-Natal do SUS para garantir o atendimento prioritário e o encaminhamento para exames específicos do período gestacional."
    },

    contato: {
      horario: "Segunda a sexta-feira, das 12h às 17h",
      telefone: "(32) 2020-8074",
      endereco: "Rua Coronel Izalino, s/n - Muriaé/MG"
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
          <span className={styles.navTag}>Apoio Diagnóstico - SUS</span>
        </div>
      </nav>

      {/* 3. CONTEÚDO PRINCIPAL */}
      <main className={styles.mainContent}>
        <div className={styles.container}>
          
          <div className={styles.serviceLayout}>
            
            <div>
              {/* SOBRE O LABORATÓRIO MUNICIPAL */}
              <div className={styles.infoBlock}>
                <h2>
                  <FlaskConical size={22} color="#008a83" /> Sobre o Laboratório Municipal
                </h2>
                <p>{dados.desc}</p>
              </div>

              {/* COMO REALIZAR O AGENDAMENTO */}
              <div className={styles.infoBlock}>
                <h3>
                  <CalendarCheck size={22} color="#008a83" /> Como Realizar o Agendamento
                </h3>
                <p>{dados.agendamento.forma}</p>
              </div>

              {/* DOCUMENTAÇÃO PARA AGENDAMENTO */}
              <div className={styles.infoBlock}>
                <h3>
                  <FileText size={22} color="#008a83" /> Documentação para Agendamento de Exames
                </h3>
                <p style={{ marginBottom: '12px' }}>
                  Para realizar o agendamento é necessário apresentar a seguinte documentação:
                </p>
                <ul className={styles.docList}>
                  {dados.agendamento.documentos.map((doc, idx) => (
                    <li key={idx}>{doc}</li>
                  ))}
                </ul>
              </div>

              {/* ALERTA DEDICADO ÀS GESTANTES */}
              <div className={styles.infoBlock} style={{ backgroundColor: '#f0fdfa', borderColor: '#008a83' }}>
                <h3 style={{ color: '#008a83', borderBottomColor: '#ccfbf1' }}>
                  <Baby size={22} color="#008a83" /> Atenção Gestantes
                </h3>
                <p style={{ margin: 0, fontWeight: 500, color: '#0f766e' }}>
                  {dados.agendamento.alertaGestantes}
                </p>
              </div>
            </div>

            {/* BARRA LATERAL (SIDEBAR) */}
            <aside className={styles.sidebarArea}>
              
              {/* ENDEREÇO INSTITUCIONAL */}
              <div className={styles.widgetBox}>
                <div className={styles.widgetHeader}>
                  <MapPin size={20} /> Endereço Institucional
                </div>
                <p className={styles.widgetText}>{dados.contato.endereco}</p>
              </div>

              {/* HORÁRIO DE ATENDIMENTO */}
              <div className={styles.widgetBox}>
                <div className={styles.widgetHeader}>
                  <Clock size={20} /> Horário de Funcionamento
                </div>
                <p className={styles.widgetText}>{dados.contato.horario}</p>
              </div>

              {/* TELEFONE DE CONTATO */}
              <div className={styles.widgetBox}>
                <div className={styles.widgetHeader}>
                  <Phone size={20} /> Telefone de Contato
                </div>
                <p className={styles.widgetText}>{dados.contato.telefone}</p>
              </div>

            </aside>

          </div>

        </div>
      </main>

    </div>
  );
}