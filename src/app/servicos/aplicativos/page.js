'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Hospital, 
  KeyRound, 
  Zap, 
  Info,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import styles from './Aplicativos.module.css';

export default function AplicativosPage() {
  const [appAtivo, setAppAtivo] = useState('saude-digital');

  const servico = {
    title: "Aplicativos Digitais de Saúde",
    desc: "Acesse os serviços digitais de saúde na palma da sua mão para acompanhar atendimentos, histórico de saúde e agendamentos.",
    apps: {
      "saude-digital": {
        nome: "Saúde Digital Muriaé",
        subtitulo: "A plataforma oficial de saúde do município de Muriaé",
        bannerDestaque: true,
        desc: "A Prefeitura Municipal de Muriaé, por meio da Secretaria Municipal de Saúde, lança oficialmente o Saúde Digital Muriaé, uma nova plataforma que amplia o acesso da população às informações e aos serviços da rede pública de saúde do município.\n\nA iniciativa representa mais um avanço no processo de modernização da gestão, fortalecendo a transparência, a organização dos atendimentos e a aproximação entre o cidadão e o Sistema Único de Saúde.",
        funcionalidades: [
          "Acompanhamento de consultas agendadas (data, horário, local e profissional);",
          "Ferramenta de confirmação de consultas;",
          "Consulta à posição na fila de espera para procedimentos;",
          "Lista atualizada de médicos, hospitais e unidades de saúde;",
          "Acesso seguro a dados pessoais e familiares cadastrados;",
          "Divulgação de notícias, campanhas e comunicados oficiais."
        ],
        comoAcessar: "O acesso à plataforma será realizado mediante CPF e senha disponibilizada pela Unidade Básica de Saúde (UBS), garantindo a proteção das informações e o uso responsável dos dados.",
        linksDownload: {
          appStore: "https://apps.apple.com/br/app/vivver-sa%C3%BAde-cidad%C3%A3o/id6466105436",
          googlePlay: "https://play.google.com/store/apps/details?id=io.vivver.cidadao.app"
        }
      },
      "meu-sus-digital": {
        nome: "Meu SUS Digital",
        subtitulo: "A plataforma oficial do Ministério da Saúde",
        desc: "Acesse a Carteira de Vacinação, Cartão SUS digital e histórico nacional de atendimentos.",
        funcionalidades: [
          "Carteira Nacional de Vacinação Digital;",
          "Emissão do Cartão SUS digital;"
        ],
        comoAcessar: "Acesse utilizando sua conta oficial do GOV.BR.",
        linksDownload: {
          appStore: "https://apps.apple.com/br/app/meu-sus-digital/id1527885233",
          googlePlay: "https://play.google.com/store/apps/details?id=br.gov.datasus.conectesus"
        }
      }
    }
  };

  const appSelecionado = servico.apps ? servico.apps[appAtivo] : null;

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
            Serviços digitais na palma da sua mão. Acompanhe agendamentos, histórico de consultas, vacinas e filas de espera.
          </p>
        </div>
      </section>

      {/* 2. BARRA DE NAVEGAÇÃO SUPERIOR */}
      <nav className={styles.navigationBar}>
        <div className={styles.navContainer}>
          <Link href="/servicos" className={styles.backLink}>
            <ArrowLeft size={16} /> Voltar para Serviços
          </Link>
          <span className={styles.navTag}>Saúde Digital & Inovação</span>
        </div>
      </nav>

      {/* 3. CONTEÚDO PRINCIPAL */}
      <main className={styles.mainContent}>
        <div className={styles.container}>
          
          {/* SELETOR DE APLICATIVOS (ABAS) */}
          <div className={styles.tabHeader}>
            <button 
              className={`${styles.tabButton} ${appAtivo === 'saude-digital' ? styles.tabButtonActive : ''}`}
              onClick={() => setAppAtivo('saude-digital')}
            >
              📱 Saúde Digital Muriaé
            </button>
            <button 
              className={`${styles.tabButton} ${appAtivo === 'meu-sus-digital' ? styles.tabButtonActive : ''}`}
              onClick={() => setAppAtivo('meu-sus-digital')}
            >
              🇧🇷 Meu SUS Digital
            </button>
          </div>

          {/* BANNER DESTAQUE COM MOCKUP VERTICAL DO APLICATIVO */}
          {appAtivo === 'saude-digital' && (
            <div className={styles.heroFeatureCard}>
              <div className={styles.featureContent}>
                <span className={styles.featureBadge}>
                  <Sparkles size={14} /> Lançamento Oficial
                </span>
                <h2 className={styles.featureTitle}>
                  A Saúde de Muriaé Conectada com Você
                </h2>
                <p className={styles.featureText}>
                  Acompanhe suas consultas agendadas, confirme presença com um toque e consulte sua posição nas filas de espera diretamente no seu celular.
                </p>

                <div className={styles.quickHighlights}>
                  <div className={styles.highlightItem}>
                    <CheckCircle2 size={18} color="#38bdf8" />
                    <span>Transparência total em exames e consultas</span>
                  </div>
                  <div className={styles.highlightItem}>
                    <CheckCircle2 size={18} color="#38bdf8" />
                    <span>Acesso simples e seguro via CPF e senha da UBS</span>
                  </div>
                </div>
              </div>

              {/* TELA DE INÍCIO DO APP */}
              <div className={styles.featureImageWrapper}>
                <div className={styles.appScreenCard}>
                  <Image 
                    src="/img/app.jpeg" 
                    alt="Tela de Login do aplicativo Saúde Digital Muriaé"
                    width={260}
                    height={520}
                    className={styles.featureImage}
                    priority
                  />
                </div>
              </div>
            </div>
          )}

          {/* DETALHES DO APLICATIVO SELECIONADO */}
          {appSelecionado && (
            <div>
              <div className={styles.infoBlock}>
                <h3>
                  <Info size={20} color="#005c8a" /> {appSelecionado.nome}
                </h3>
                <p className={styles.subtituloApp}>
                  {appSelecionado.subtitulo}
                </p>
                {appSelecionado.desc.split('\n\n').map((paragrafo, idx) => (
                  <p key={idx}>{paragrafo}</p>
                ))}
              </div>

              <div className={styles.infoBlock}>
                <h3>
                  <Zap size={20} color="#005c8a" /> Funcionalidades Principais
                </h3>
                <ul className={styles.docGrid}>
                  {appSelecionado.funcionalidades.map((func, idx) => (
                    <li key={idx} className={styles.docItem}>
                      <CheckCircle2 size={18} color="#005c8a" className={styles.itemIcon} />
                      <span>{func}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {appSelecionado.comoAcessar && (
                <div className={styles.infoBlock}>
                  <h3>
                    <KeyRound size={20} color="#005c8a" /> Como Acessar
                  </h3>
                  <p>{appSelecionado.comoAcessar}</p>
                </div>
              )}

              {/* ÁREA DE DOWNLOAD */}
              <div className={`${styles.infoBlock} ${styles.downloadBox}`}>
                <h3>Baixe Gratuitamente</h3>
                <p>
                  Escolha a loja oficial do sistema operacional do seu celular para fazer o download:
                </p>

                <div className={styles.downloadContainer}>
                  
                  {/* APP STORE */}
                  {appSelecionado.linksDownload?.appStore && (
                    <a 
                      href={appSelecionado.linksDownload.appStore} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`${styles.badgeBtn} ${styles.btnAppStore}`}
                    >
                      <svg className={styles.brandIcon} width="26" height="30" viewBox="0 0 170 170" fill="#ffffff">
                        <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.33.13-9.13-1.9-14.4-6.07-3.52-2.81-7.48-7.51-11.88-14.1-6.19-9.28-11.05-19.78-14.58-31.5-3.53-11.72-5.3-22.99-5.3-33.8 0-14.34 3.6-26.17 10.8-35.48 7.2-9.31 16.29-14.07 27.27-14.28 4.33 0 9.38 1.15 15.15 3.44 5.77 2.3 9.77 3.45 12 3.45 1.83 0 5.92-1.2 12.27-3.6 6.35-2.4 11.45-3.48 15.3-3.23 11.06.67 20.14 4.8 27.23 12.38-9.84 5.97-14.63 14.1-14.37 24.38.26 8.01 3.28 14.88 9.07 20.61 5.79 5.73 12.82 8.92 21.09 9.57-2.19 6.53-4.99 13.25-8.4 20.15zM119.22 31.84c0-7.39 2.65-14.35 7.95-20.88 5.3-6.53 11.97-10.43 20.01-11.7 1.05 8.16-1.57 15.42-7.86 21.78-6.29 6.36-13.56 9.87-20.1 9.8z"/>
                      </svg>
                      <div className={styles.btnTextGroup}>
                        <span className={styles.btnSubtext}>Disponível na</span>
                        <span className={styles.btnMaintext}>App Store</span>
                      </div>
                    </a>
                  )}

                  {/* GOOGLE PLAY */}
                  {appSelecionado.linksDownload?.googlePlay && (
                    <a 
                      href={appSelecionado.linksDownload.googlePlay} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`${styles.badgeBtn} ${styles.btnGooglePlay}`}
                    >
                      <svg className={styles.brandIcon} width="24" height="26" viewBox="0 0 512 512">
                        <path fill="#41A5EE" d="M380.9 220.1l-289.4-165c-21.7-12.4-44.5-.6-44.5 22.8v356.2c0 23.4 22.8 35.2 44.5 22.8l289.4-165c21.7-12.4 21.7-32.5 0-44.8z"/>
                        <path fill="#0277BD" d="M380.9 220.1L91.5 55.1c-21.7-12.4-44.5-.6-44.5 22.8v178.1l235.8 4.1 98.1-40z"/>
                        <path fill="#FFD600" d="M380.9 291.9l-98.1-40-235.8 4.1v178.1c0 23.4 22.8 35.2 44.5 22.8l289.4-165z"/>
                        <path fill="#00E676" d="M380.9 220.1l-98.1 35.9 98.1 35.9c21.7-12.3 21.7-32.5 0-44.8z"/>
                        <path fill="#FF3D00" d="M282.8 256l98.1-35.9c10.8-6.2 16.3-14.3 16.3-22.4H47c0 8.1 5.4 16.2 16.3 22.4l219.5 35.9z"/>
                      </svg>
                      <div className={styles.btnTextGroup}>
                        <span className={styles.btnSubtext}>DISPONÍVEL NO</span>
                        <span className={styles.btnMaintext}>Google Play</span>
                      </div>
                    </a>
                  )}

                </div>
              </div>
            </div>
          )}

        </div>
      </main>

    </div>
  );
}