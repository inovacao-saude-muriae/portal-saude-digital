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
  HeartHandshake 
} from 'lucide-react';
import { dbServicos } from '@/data/servicosData';
import styles from './CCZ.module.css';

export default function CCZPage() {
  const servico = dbServicos['ccz'];

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
            Vigilância, prevenção e controle de zoonoses (doenças transmissíveis por animais), controle populacional ético e promoção do bem-estar animal no município.
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
                <p>{servico.desc}</p>
                <p>
                  O CCZ atua no controle de doenças como Raiva, Leishmaniose, Febre Maculosa e Esporotricose, além de realizar ações educativas sobre posse responsável e prevenção de acidentes por animais peçonhentos.
                </p>
              </div>

              {/* PRINCIPAIS ATIVIDADES */}
              {servico.secoesTexto && servico.secoesTexto.map((secao, idx) => (
                <div key={idx} className={styles.infoBlock}>
                  <h3>
                    <ShieldAlert size={22} color="#008a83" /> {secao.titulo}
                  </h3>
                  {secao.paragrafo && <p>{secao.paragrafo}</p>}
                </div>
              ))}

              {/* BANNER DESTACADO DE ADOÇÃO DE ANIMAIS */}
              <div className={styles.adocaoBanner}>
                <div className={styles.adocaoContent}>
                  <span className={styles.adocaoBadge}>🐶🐱 Posse Responsável</span>
                  <h2>Adote um Amigo!</h2>
                  <p>
                    O CCZ disponibiliza cães e gatos resgatados para adoção responsável. Todos os animais são vacinados, vermifugados e preparados para receber um novo lar cheio de carinho. Ao adotar, você oferece uma vida digna e ajuda no controle populacional da nossa cidade!
                  </p>
                  <Link href="/adocao" className={styles.btnAdocao}>
                    <HeartHandshake size={20} /> Conhecer Animais para Adoção →
                  </Link>
                </div>
              </div>
            </div>

            {/* BARRA LATERAL (SIDEBAR) */}
            <aside className={styles.sidebarArea}>
              
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
              {servico.horario ? (
                <div className={styles.widgetBox}>
                  <div className={styles.widgetHeader}>
                    <Clock size={20} /> Horário de Atendimento
                  </div>
                  <p className={styles.widgetText}>{servico.horario}</p>
                </div>
              ) : (
                <div className={styles.widgetBox}>
                  <div className={styles.widgetHeader}>
                    <Clock size={20} /> Horário de Atendimento
                  </div>
                  <p className={styles.widgetText}>Segunda a Sexta-feira, das 07h00 às 16h00</p>
                </div>
              )}

            </aside>

          </div>

        </div>
      </main>

    </div>
  );
}