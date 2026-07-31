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
  Info
} from 'lucide-react';
import styles from './AtendimentoDomiciliar.module.css';

export default function AtendimentoDomiciliarPage() {
  const dados = {
    title: "Serviço de Atendimento Domiciliar (SAD)",
    subtituloHero: "Cuidado em casa para quem mais precisa",
    desc: "O Serviço de Atendimento Domiciliar (SAD) destina-se a pessoas acamadas ou com dificuldade de mobilidade, de forma temporária ou permanente. Nesse modelo de cuidado, a equipe de saúde realiza o atendimento na própria casa do paciente, garantindo acompanhamento contínuo e humanizado.",
    onde: "Atendimento prestado diretamente no domicílio do paciente cadastrado em Muriaé.",
    horario: "Segunda a Sexta-feira, das 07h00 às 17h00",
    passoAPasso: [
      "O familiar ou responsável deve procurar a UBS onde o paciente já é atendido;",
      "Um profissional da equipe preencherá uma ficha de pedido para inclusão;",
      "A ficha será encaminhada à equipe do SAD, que fará a avaliação."
    ],
    requisitos: [
      "Morar em Muriaé;",
      "Idade a partir de 01 mês de vida;",
      "Ser usuário do SUS;",
      "Apresentar quadro clínico que justifique atendimento domiciliar;",
      "Apresentar CPF, RG e Cartão do SUS atualizado;",
      "Comprovante de residência no município."
    ],
    comunicacao: "Comunicação com o Usuário: Após o encaminhamento, o Agente Comunitário de Saúde entrará em contato com a família para informar sobre a visita de avaliação. Caso o paciente seja admitido, a equipe elaborará um plano de cuidados individualizado."
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
          <span className={styles.navTag}>Atenção Domiciliar - SUS</span>
        </div>
      </nav>

      {/* 3. CONTEÚDO PRINCIPAL */}
      <main className={styles.mainContent}>
        <div className={styles.container}>
          
          <div className={styles.serviceLayout}>
            
            {/* COLUNA PRINCIPAL */}
            <div>
              {/* SOBRE O SAD */}
              <div className={styles.infoBlock}>
                <h2>
                  <Home size={22} color="#008a83" /> Sobre o Atendimento Domiciliar
                </h2>
                <p>{dados.desc}</p>
              </div>

              {/* PASSO A PASSO PARA INCLUSÃO */}
              <div className={styles.infoBlock}>
                <h3>
                  <ListOrdered size={22} color="#008a83" /> Passo a Passo para Inclusão no SAD
                </h3>
                <ol className={styles.docList}>
                  {dados.passoAPasso.map((passo, idx) => (
                    <li key={idx}>{passo}</li>
                  ))}
                </ol>
              </div>

              {/* INFORMAÇÃO / COMUNICAÇÃO COM O USUÁRIO */}
              <div className={styles.infoBlock} style={{ backgroundColor: '#f0fdfa', borderColor: '#008a83' }}>
                <h3 style={{ color: '#008a83', borderBottomColor: '#ccfbf1' }}>
                  <Info size={22} color="#008a83" /> Informações Importantes
                </h3>
                <p style={{ margin: 0, fontWeight: 500, color: '#0f766e' }}>
                  {dados.comunicacao}
                </p>
              </div>
            </div>

            {/* BARRA LATERAL (SIDEBAR) */}
            <aside className={styles.sidebarArea}>
              
              {/* REQUISITOS PARA ACESSAR O SERVIÇO */}
              <div className={`${styles.widgetBox} ${styles.requisitosCard}`}>
                <div className={styles.widgetHeader}>
                  <CheckCircle2 size={20} /> Requisitos para Acessar o Serviço
                </div>
                <ul className={styles.docList} style={{ paddingLeft: '18px', margin: 0 }}>
                  {dados.requisitos.map((req, idx) => (
                    <li key={idx} style={{ marginBottom: '6px', fontSize: '14px' }}>{req}</li>
                  ))}
                </ul>
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