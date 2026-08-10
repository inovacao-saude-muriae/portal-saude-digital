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
  Syringe,
  Activity,
  GraduationCap,
  Heart,
  FileCheck2,
  Ambulance,
  BookOpen
} from 'lucide-react';
import styles from './CCZ.module.css';

export default function CCZPage() {
  const dados = {
    title: "Centro de Controle de Zoonoses Manuela Pereira da Marta",
    subtituloHero: "Vigilância, Prevenção e Promoção da Saúde Pública",
    desc: "O Centro de Controle de Zoonoses Manuela Pereira da Marta, vinculado à Secretaria Municipal de Saúde de Muriaé, é uma unidade fundamental para a promoção da saúde pública e para o controle de doenças que podem ser transmitidas entre animais e seres humanos.\n\nLocalizado na BR-356, no sentido Muriaé–Ervália, o CCZ atua diretamente ligado à vigilância e à prevenção dessas patologias, por meio de ações estratégicas voltadas à proteção e melhoria da qualidade de vida da população.",
    
    atividades: [
      {
        icone: <Activity size={22} />,
        titulo: "Monitoramento de Zoonoses",
        desc: "Controle ativo e contínuo de doenças como raiva, leishmaniose, escabiose e esporotricose."
      },
      {
        icone: <GraduationCap size={22} />,
        titulo: "Educação em Saúde",
        desc: "Campanhas contínuas sobre prevenção de zoonoses e conscientização sobre posse responsável de animais."
      },
      {
        icone: <Heart size={22} />,
        titulo: "Adoção Responsável",
        desc: "Ações estratégicas para o incentivo ao bem-estar animal e estreitamento de vínculos com a comunidade."
      },
      {
        icone: <Syringe size={22} />,
        titulo: "Vacinação Antirrábica",
        desc: "Imunização anual de cães e gatos alinhada com as diretrizes e mobilizações estaduais de Minas Gerais."
      },
      {
        icone: <FileCheck2 size={22} />,
        titulo: "Parceria com o IMA",
        desc: "Cooperação técnica para controle da raiva com foco especial no monitoramento de morcegos hematófagos."
      },
      {
        icone: <Ambulance size={22} />,
        titulo: "Resgate Direcionado",
        desc: "Acolhimento de animais com suspeita clínica de zoonoses ou em situação de estrito risco à saúde pública."
      }
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
      
      {/* 1. HERO BANNER EM TOM AZUL */}
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
                  <Dog size={22} color="#005c8a" /> Sobre o Centro de Controle de Zoonoses
                </h2>
                {dados.desc.split('\n\n').map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              {/* PRINCIPAIS ATIVIDADES (CARDS EM TONS AZUIS) */}
              <div className={styles.infoBlock}>
                <h2>
                  <ShieldAlert size={22} color="#005c8a" /> Principais Atividades Desenvolvidas
                </h2>
                
                <div className={styles.atividadesGrid}>
                  {dados.atividades.map((act, idx) => (
                    <div key={idx} className={styles.atividadeCard}>
                      <div className={styles.atividadeIconBox}>
                        {act.icone}
                      </div>
                      <div className={styles.atividadeInfo}>
                        <h3>{act.titulo}</h3>
                        <p>{act.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
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