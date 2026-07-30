'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { dbServicos, tiposVacinas } from '@/data/servicosData';
import styles from './ServiceDetail.module.css';

export default function ServiceDetailPage() {
  const params = useParams();
  const id = params?.id;

  const [activeTab, setActiveTab] = useState('campanhas');
  const [appAtivo, setAppAtivo] = useState('saude-digital');

  const servico = dbServicos[id];
  const isVacinacao = id === "vacinacao" || id === "vacina";
  const isAplicativos = id === "aplicativos" || id === "aplicativo" || id === "app";

  if (!servico) {
    return (
      <main className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.infoBlock}>
            <h2 style={{ color: '#003b5c', margin: '0 0 10px 0' }}>Serviço não encontrado</h2>
            <p style={{ color: '#475569', margin: 0 }}>O serviço solicitado não existe ou está sendo migrado.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      
      {/* BANNER 100% LARGURA */}
      <section className={styles.heroBanner}>
        <div className={styles.overlay}>
          <div className={styles.container}>
            <span className={styles.heroSubtitle}>CARTA DE SERVIÇOS</span>
            <h1 className={styles.heroTitle}>{servico.title}</h1>
          </div>
        </div>
      </section>

      {/* BARRA DE NAVEGAÇÃO SUPERIOR */}
      <div className={styles.navigationBar}>
        <div className={styles.container}>
          <Link href="/servicos" className={styles.backLink}>
            ← Voltar para Serviços
          </Link>
        </div>
      </div>

      {/* ÁREA DE CONTEÚDO PRINCIPAL */}
      <main className={styles.mainContent}>
        <div className={styles.container}>
          
          {/* --- CENÁRIO 1: PAINEL DE APLICATIVOS --- */}
          {isAplicativos ? (
            <div style={{ width: '100%' }}>
              <div className={styles.infoBlock}>
                <h3><span className={styles.blockIcon}>📱</span> Sobre os Aplicativos</h3>
                <p>{servico.desc}</p>
              </div>

              {/* ABAS SELETORAS DE APLICATIVOS */}
              <div className={styles.tabHeader}>
                <button 
                  className={`${styles.tabButton} ${appAtivo === 'saude-digital' ? styles.tabButtonActive : ''}`}
                  onClick={() => setAppAtivo('saude-digital')}
                >
                  🏥 Saúde Digital Muriaé
                </button>
                <button 
                  className={`${styles.tabButton} ${appAtivo === 'meu-sus-digital' ? styles.tabButtonActive : ''}`}
                  onClick={() => setAppAtivo('meu-sus-digital')}
                >
                  🇧🇷 Meu SUS Digital
                </button>
              </div>

              {/* CONTEÚDO DO APP SELECIONADO */}
              {servico.apps && servico.apps[appAtivo] && (
                <div>
                  <div className={styles.infoBlock}>
                    <h3><span className={styles.blockIcon}>ℹ️</span> {servico.apps[appAtivo].nome}</h3>
                    <p style={{ fontWeight: '600', color: '#008a83', marginBottom: '8px' }}>
                      {servico.apps[appAtivo].subtitulo}
                    </p>
                    {servico.apps[appAtivo].desc.split('\n\n').map((paragrafo, idx) => (
                      <p key={idx} style={{ marginBottom: '8px' }}>{paragrafo}</p>
                    ))}
                  </div>

                  <div className={styles.infoBlock}>
                    <h3><span className={styles.blockIcon}>⚡</span> Funcionalidades</h3>
                    <ul className={styles.docList}>
                      {servico.apps[appAtivo].funcionalidades.map((func, idx) => (
                        <li key={idx} style={{ marginBottom: '8px' }}>{func}</li>
                      ))}
                    </ul>
                  </div>

                  {servico.apps[appAtivo].comoAcessar && (
                    <div className={styles.infoBlock}>
                      <h3><span className={styles.blockIcon}>🔐</span> Como acessar</h3>
                      <p>{servico.apps[appAtivo].comoAcessar}</p>
                    </div>
                  )}

                  <div className={styles.infoBlock} style={{ borderLeft: '4px solid #008a83', backgroundColor: '#f8fafc' }}>
                    <h3 style={{ marginBottom: '8px' }}>
                      <span className={styles.blockIcon}>📲</span> Baixe o {servico.apps[appAtivo].nome}
                    </h3>
                    <p style={{ color: '#475569', marginBottom: '20px', fontSize: '14.5px' }}>
                      Disponível gratuitamente para dispositivos iOS e Android.
                    </p>

                    <div className={styles.downloadContainer}>
                      <a 
                        href={servico.apps[appAtivo].linksDownload.appStore} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.btnAppStore}
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.66-.8 1.11-1.92.99-3.04-.96.04-2.12.64-2.8 1.44-.61.71-1.14 1.86-.99 2.97 1.07.08 2.14-.57 2.8-1.37z"/>
                        </svg>
                        App Store
                      </a>

                      <a 
                        href={servico.apps[appAtivo].linksDownload.googlePlay} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.btnGooglePlay}
                      >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                        </svg>
                        Google Play
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : isVacinacao ? (
            /* --- CENÁRIO 2: PAINEL DE VACINAÇÃO --- */
            <div style={{ width: '100%' }}>
              <div className={styles.infoBlock}>
                <h3>
                  <span className={styles.blockIcon}>ℹ️</span> 
                  Programa Nacional de Imunizações (PNI)
                </h3>
                {servico.desc.split('\n\n').map((paragrafo, idx) => (
                  <p key={idx} style={{ marginBottom: idx === 0 ? '16px' : '0' }}>
                    {paragrafo}
                  </p>
                ))}
              </div>

              <div className={styles.tabHeader}>
                <button 
                  className={`${styles.tabButton} ${activeTab === 'campanhas' ? styles.tabButtonActive : ''}`}
                  onClick={() => setActiveTab('campanhas')}
                >
                  📢 Campanhas & Tipos de Vacina
                </button>
                
                <a 
                  href="/calendario-vacinal" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.tabButton}
                  style={{ textDecoration: 'none' }}
                >
                  📅 Linha do Tempo / Calendário Vacinal ↗
                </a>
              </div>

              {activeTab === 'campanhas' && (
                <div className={styles.vacinacaoGrid}>
                  {tiposVacinas.map((vacina) => (
                    <div key={vacina.id} className={styles.vacinaCard}>
                      <h4 className={styles.vacinaCardTitle}>{vacina.titulo}</h4>
                      <p className={styles.vacinaCardDesc}>{vacina.desc}</p>
                      
                      <div className={styles.vacinaSection}>
                        <strong>Como Proceder:</strong>
                        <p>{vacina.proceder}</p>
                      </div>
                      <div className={styles.vacinaSection}>
                        <strong>Locais de Atendimento:</strong>
                        <p>{vacina.locais}</p>
                      </div>
                      <div className={styles.vacinaSection}>
                        <strong>Documentação Exigida:</strong>
                        <p>{vacina.docs}</p>
                      </div>

                      {vacina.alerta && (
                        <div className={styles.vacinaAlerta}>
                          <p>{vacina.alerta}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* --- CENÁRIO 3: LAYOUT INSTITUCIONAL / PADRÃO --- */
            <div className={styles.infoLayout}>
              <div>
                <div className={styles.infoBlock}>
                  <h3><span className={styles.blockIcon}>ℹ️</span> Sobre o Serviço</h3>
                  {servico.desc.split('\n\n').map((paragrafo, idx) => (
                    <p key={idx} style={{ marginBottom: idx === 0 ? '12px' : '0' }}>
                      {paragrafo}
                    </p>
                  ))}
                </div>

                {servico.secoesTexto && servico.secoesTexto.map((secao, idx) => (
                  <div key={idx} className={styles.infoBlock}>
                    <h3><span className={styles.blockIcon}>📌</span> {secao.titulo}</h3>
                    
                    {secao.paragrafo && secao.paragrafo.split('\n\n').map((p, pIdx) => (
                      <p key={pIdx} style={{ marginBottom: '8px' }}>{p}</p>
                    ))}

                    {secao.itens && secao.itens.length > 0 && (
                      <ul className={styles.docList}>
                        {secao.itens.map((item, iIdx) => (
                          <li key={iIdx} style={{ marginBottom: '10px' }}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}

                {servico.requisitos && (
                  <div className={styles.infoBlock}>
                    <h3><span className={styles.blockIcon}>📝</span> Requisitos de Acesso</h3>
                    <p>{servico.requisitos}</p>
                  </div>
                )}

                {servico.passoAPasso && servico.passoAPasso.length > 0 && (
                  <div className={styles.infoBlock}>
                    <h3><span className={styles.blockIcon}>🔄</span> Como Solicitar / Etapas</h3>
                    <ol className={styles.docList} style={{ listStyleType: 'decimal' }}>
                      {servico.passoAPasso.map((passo, idx) => (
                        <li key={idx} style={{ marginBottom: '4px' }}>{passo}</li>
                      ))}
                    </ol>
                  </div>
                )}

                {servico.documentos && servico.documentos.length > 0 && (
                  <div className={styles.infoBlock}>
                    <h3><span className={styles.blockIcon}>📂</span> Documentação Exigida</h3>
                    <ul className={styles.docList}>
                      {servico.documentos.map((doc, idx) => (
                        <li key={idx}>{doc}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {servico.comunicacao && (
                  <div className={styles.infoBlock} style={{ borderLeft: '4px solid #005c8a', backgroundColor: '#f1f5f9' }}>
                    <p style={{ fontStyle: 'italic', color: '#1e293b', margin: 0 }}>{servico.comunicacao}</p>
                  </div>
                )}
              </div>

              {(servico.onde || servico.horario) && (
                <aside className={styles.stickyWidget}>
                  {servico.onde && (
                    <div className={styles.widgetItem}>
                      <div className={styles.widgetHeader}>
                        <span className={styles.widgetIcon}>📍</span>
                        <h4>Onde Encontrar</h4>
                      </div>
                      <p>{servico.onde}</p>
                    </div>
                  )}
                  {servico.horario && (
                    <div className={styles.widgetItem}>
                      <div className={styles.widgetHeader}>
                        <span className={styles.widgetIcon}>⏰</span>
                        <h4>Horário de Funcionamento</h4>
                      </div>
                      <p>{servico.horario}</p>
                    </div>
                  )}
                </aside>
              )}

            </div>
          )}

          {/* BANNER DE ADOÇÃO: EXIBIDO EXCLUSIVAMENTE NA PÁGINA DO CCZ */}
          {id === "ccz" && (
            <div className={styles.adocaoBanner}>
              <div className={styles.adocaoContent}>
                <span className={styles.adocaoBadge}>🐶🐱 Posse Responsável</span>
                <h2>Adote um Amigo!</h2>
                <p>
                  O CCZ disponibiliza cães e gatos para adoção de forma totalmente responsável. Ao adotar, você oferece uma nova chance de vida digna para um animal e contribui diretamente para o controle populacional e bem-estar da nossa comunidade. Venha conhecer nossos animais protegidos e encontre seu novo companheiro de vida!
                </p>
                <Link href="/adocao" className={styles.btnAdocao}>
                  🐾 Conhecer Animais para Adoção →
                </Link>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}