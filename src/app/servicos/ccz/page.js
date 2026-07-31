'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Hospital, 
  Dog, 
  Clock, 
  MapPin, 
  ShieldAlert, 
  HeartHandshake,
  Syringe
} from 'lucide-react';
import styles from './CCZ.module.css';

export default function CCZPage() {
  const dados = {
    title: "Centro de Controle de Zoonoses Manuela Pereira da Marta",
    subtituloHero: "Vigilância, Prevenção e Promoção da Saúde Pública",
    desc: "O Centro de Controle de Zoonoses Manuela Pereira da Marta, vinculado à Secretaria Municipal de Saúde de Muriaé, é uma unidade fundamental para a promoção da saúde pública e para o controle de doenças que podem ser transmitidas entre animais e seres humanos.\n\nLocalizado na BR-356, no sentido Muriaé–Ervália, o CCZ atua diretamente ligado à vigilância e à prevenção dessas patologias, por meio de ações estratégicas voltadas à proteção e melhoria da qualidade de vida da população.",
    
    atividades: [
      "Monitoramento e controle ativo de doenças zoonóticas, como raiva, leishmaniose, escabiose e esporotricose;",
      "Educação em saúde, com campanhas contínuas sobre prevenção de zoonoses e posse responsável de animais de estimação;",
      "Campanhas estratégicas de adoção responsável, incentivando o bem-estar animal e o estreitamento de vínculos com a comunidade;",
      "Vacinação antirrábica de cães e gatos durante os períodos de mobilização nacional promovidos pelo Governo de Minas Gerais;",
      "Parcerias técnicas com o Instituto Mineiro de Agropecuária (IMA) para o controle da raiva, com foco no monitoramento de morcegos hematófagos;",
      "Acolhimento e resgate direcionado de animais com suspeita clínica de zoonoses ou em estrito risco à saúde pública."
    ],

    adocao: {
      titulo: "Adote um Amigo!",
      texto: "O CCZ disponibiliza cães e gatos para adoção de forma totalmente responsável. Ao adotar, você oferece uma nova chance de vida digna para um animal e contribui diretamente para o controle populacional e bem-estar da nossa comunidade. Venha conhecer nossos animais protegidos e encontre seu novo companheiro de vida!"
    },

    localizacao: {
      endereco: "BR-356, Sentido Muriaé – Ervália, Muriaé/MG",
      horario: "Segunda a Sexta-feira, das 07h00 às 16h00"
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
          <span className={styles.navTag}>Vigilância Ambiental & Zoonoses</span>
        </div>
      </nav>

      {/* 3. CONTEÚDO PRINCIPAL */}
      <main className={styles.mainContent}>
        <div className={styles.container}>
          
          <div className={styles.serviceLayout}>
            
            {/* COLUNA PRINCIPAL */}
            <div>
              {/* SOBRE O CCZ */}
              <div className={styles.infoBlock}>
                <h2>
                  <Dog size={22} color="#008a83" /> Sobre o Centro de Controle de Zoonoses
                </h2>
                {dados.desc.split('\n\n').map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              {/* PRINCIPAIS ATIVIDADES */}
              <div className={styles.infoBlock}>
                <h3>
                  <ShieldAlert size={22} color="#008a83" /> Principais Atividades Desenvolvidas
                </h3>
                <ul className={styles.docList}>
                  {dados.atividades.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* BANNER DE ADOÇÃO RESPONSÁVEL */}
              <div className={styles.adocaoBanner}>
                <div className={styles.adocaoContent}>
                  <span className={styles.adocaoBadge}>🐶🐱 Posse Responsável</span>
                  <h2>{dados.adocao.titulo}</h2>
                  <p>{dados.adocao.texto}</p>
                  <Link href="/adocao" className={styles.btnAdocao}>
                    <HeartHandshake size={20} /> Conhecer Animais para Adoção →
                  </Link>
                </div>
              </div>
            </div>

            {/* BARRA LATERAL (SIDEBAR) */}
            <aside className={styles.sidebarArea}>
              
              {/* ONDE ENCONTRAR */}
              <div className={styles.widgetBox}>
                <div className={styles.widgetHeader}>
                  <MapPin size={20} /> Localização do CCZ
                </div>
                <p className={styles.widgetText}>{dados.localizacao.endereco}</p>
              </div>

              {/* HORÁRIO DE ATENDIMENTO */}
              <div className={styles.widgetBox}>
                <div className={styles.widgetHeader}>
                  <Clock size={20} /> Horário de Funcionamento
                </div>
                <p className={styles.widgetText}>{dados.localizacao.horario}</p>
              </div>

              {/* PARCERIAS E AÇÕES */}
              <div className={`${styles.widgetBox} ${styles.destaqueCard}`}>
                <div className={styles.widgetHeader}>
                  <Syringe size={20} /> Parcerias Técnicas
                </div>
                <p className={styles.widgetText}>
                  Ações integradas com o Instituto Mineiro de Agropecuária (IMA) para monitoramento de morcegos hematófagos e prevenção contínua da raiva.
                </p>
              </div>

            </aside>

          </div>

        </div>
      </main>

    </div>
  );
}