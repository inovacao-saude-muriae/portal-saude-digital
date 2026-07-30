'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ExternalLink, BarChart3, ListFilter, Hospital, Pill } from 'lucide-react';
import styles from './Transparencia.module.css';

// ESTRUTURA CATEGORIZADA DOS DASHBOARDS
const categoriasTransparencia = [
  {
    id: 'lista-espera',
    titulo: 'Lista de Espera',
    icone: <ListFilter size={18} />,
    dashboards: [
      {
        id: 'catarata',
        titulo: 'Catarata e Pterígio',
        subtitulo: 'Fila de Espera para Cirurgias de Catarata e Pterígio',
        url: 'https://app.powerbi.com/view?r=eyJrIjoiYmZiMmQwYWQtMTdmNi00MDk3LTljMDEtNzkyMmJlNGFhM2U5IiwidCI6Ijg5N2M4NzA0LWRkMGMtNDczMy1hZjA1LWZmYmYyMTg1MzIxZSJ9'
      },
      {
        id: 'eletivas',
        titulo: 'Cirurgias Eletivas',
        subtitulo: 'Fila de Espera para Procedimentos Cirúrgicos Eletivos',
        url: 'https://app.powerbi.com/view?r=eyJrIjoiYzA2MWRlMDMtZGRjYS00ZDIyLWJiNGMtOGM3YzcwOGI4NmI0IiwidCI6Ijg5N2M4NzA0LWRkMGMtNDczMy1hZjA1LWZmYmYyMTg1MzIxZSJ9'
      },
      {
        id: 'consultas-exames',
        titulo: 'Consultas e Exames',
        subtitulo: 'Fila de Espera para Consultas Especializadas e Exames',
        url: 'https://app.powerbi.com/view?r=eyJrIjoiMWMxMDY5NDMtNjA0Ny00YWE5LTk3NDMtNGE2NDVhY2RiNWNhIiwidCI6Ijg5N2M4NzA0LWRkMGMtNDczMy1hZjA1LWZmYmYyMTg1MzIxZSJ9'
      },
      {
        id: 'fisioterapia',
        titulo: 'Fisioterapia',
        subtitulo: 'Fila de Espera para Atendimento Fisioterapêutico',
        url: 'https://app.powerbi.com/view?r=eyJrIjoiNzM5OWYyZTEtY2JhYS00YzAzLWE0MjQtZjZjZmJiNzkxNzYxIiwidCI6Ijg5N2M4NzA0LWRkMGMtNDczMy1hZjA1LWZmYmYyMTg1MzIxZSJ9'
      },
      {
        id: 'ressonancia',
        titulo: 'Ressonância Magnética',
        subtitulo: 'Fila de Espera para Exames de Ressonância Magnética',
        url: 'https://app.powerbi.com/view?r=eyJrIjoiZjA4MmE1YzMtMmE0Ny00NTk2LTliOGMtYmU5MTYyODVkYmFhIiwidCI6Ijg5N2M4NzA0LWRkMGMtNDczMy1hZjA1LWZmYmYyMTg1MzIxZSJ9'
      },
      {
        id: 'tomografia',
        titulo: 'Tomografia Computadorizada',
        subtitulo: 'Fila de Espera para Exames de Tomografia',
        url: 'https://app.powerbi.com/view?r=eyJrIjoiZTg0NzQwMmYtY2UxNC00M2I5LTg3OTQtY2EyNWIyMjUxOWE5IiwidCI6Ijg5N2M4NzA0LWRkMGMtNDczMy1hZjA1LWZmYmYyMTg1MzIxZSJ9'
      }
    ]
  },
  {
    id: 'producao-hospitalar',
    titulo: 'Produção Hospitalar',
    icone: <Hospital size={18} />,
    dashboards: [
      {
        id: 'producao-geral',
        titulo: 'Relatório Hospitalar',
        subtitulo: 'Indicadores de Atendimentos, Internações e Cirurgias Hospitalares',
        url: 'https://app.powerbi.com/view?r=eyJrIjoiMDY2ZGFjODctNDVhYi00NTY0LWJkN2QtNDNlNWE1YTE2NmNmIiwidCI6Ijg5N2M4NzA0LWRkMGMtNDczMy1hZjA1LWZmYmYyMTg1MzIxZSJ9' // Adicione a URL do PowerBI de Produção Hospitalar aqui assim que tiver
      }
    ]
  },
  {
    id: 'farmacia-municipal',
    titulo: 'Farmácia Municipal',
    icone: <Pill size={18} />,
    dashboards: [
      {
        id: 'estoque-medicamentos',
        titulo: 'Estoque de Medicamentos',
        subtitulo: 'Acompanhamento do Estoque',
        url: 'https://app.powerbi.com/view?r=eyJrIjoiYTUxNGNiMTYtYTVlYy00YjY0LWE3M2YtYjAyMzEzYTk5YjY0IiwidCI6Ijg5N2M4NzA0LWRkMGMtNDczMy1hZjA1LWZmYmYyMTg1MzIxZSJ9' // Adicione a URL do PowerBI da Farmácia Municipal aqui assim que tiver
      }
    ]
  }
];

export default function TransparenciaPage() {
  const [categoriaAtivaId, setCategoriaAtivaId] = useState('lista-espera');
  const [dashboardAtivoId, setDashboardAtivoId] = useState('catarata');

  // Categoria e Dashboards atuais
  const categoriaAtual = categoriasTransparencia.find(cat => cat.id === categoriaAtivaId) || categoriasTransparencia[0];
  const dashboardAtual = categoriaAtual.dashboards.find(dash => dash.id === dashboardAtivoId) || categoriaAtual.dashboards[0];

  // Troca de Categoria Principal
  const handleTrocarCategoria = (catId) => {
    setCategoriaAtivaId(catId);
    const primeiraOpcao = categoriasTransparencia.find(c => c.id === catId)?.dashboards[0]?.id;
    if (primeiraOpcao) {
      setDashboardAtivoId(primeiraOpcao);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      
      {/* BANNER INSTITUCIONAL */}
      <section 
        className={styles.heroBanner}
        style={{ backgroundImage: "url('/img/banner-paginas.png')" }}
      >
        <div className={styles.overlay}>
          <div className={styles.container}>
            <span className={styles.heroSubtitle}>GESTÃO PÚBLICA & ACESSO À INFORMAÇÃO</span>
            <h1 className={styles.heroTitle}>Portal da Transparência</h1>
            <p className={styles.heroDesc}>
              Consulte dados da saúde municipal organizados por Lista de Espera, Produção Hospitalar e Farmácia Municipal.
            </p>
          </div>
        </div>
      </section>

      {/* BARRA DE NAVEGAÇÃO */}
      <div className={styles.navigationBar}>
        <div className={styles.container}>
          <Link href="/" className={styles.backLink}>
            ← Voltar para a Página Principal
          </Link>
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <main className={styles.mainContainer}>
        <div className={styles.container}>
          
          {/* 1º NÍVEL: CATEGORIAS PRINCIPAIS (Lista de Espera / Produção Hospitalar / Farmácia) */}
          <div className={styles.categoryTrack}>
            {categoriasTransparencia.map((cat) => (
              <button
                key={cat.id}
                className={`${styles.categoryBtn} ${categoriaAtivaId === cat.id ? styles.categoryBtnActive : ''}`}
                onClick={() => handleTrocarCategoria(cat.id)}
              >
                {cat.icone}
                {cat.titulo}
              </button>
            ))}
          </div>

          {/* 2º NÍVEL: SUB-OPÇÕES DA CATEGORIA (Ex: Catarata, Cirurgias, etc.) */}
          {categoriaAtual.dashboards.length > 1 && (
            <div className={styles.subTabContainer}>
              {categoriaAtual.dashboards.map((item) => (
                <button
                  key={item.id}
                  className={`${styles.subTabBtn} ${dashboardAtivoId === item.id ? styles.subTabBtnActive : ''}`}
                  onClick={() => setDashboardAtivoId(item.id)}
                >
                  <BarChart3 size={15} />
                  {item.titulo}
                </button>
              ))}
            </div>
          )}

          {/* CARD DO DASHBOARD POWER BI */}
          <div className={styles.dashboardCard}>
            <div className={styles.dashboardHeader}>
              <div>
                <span className={styles.badgeLive}>● Portal Oficial da Transparência</span>
                <h2 className={styles.dashboardTitle}>{dashboardAtual.subtitulo}</h2>
              </div>
              
              {dashboardAtual.url && (
                <a 
                  href={dashboardAtual.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={styles.openExternalBtn}
                  title="Abrir relatório em tela cheia"
                >
                  Abrir no Power BI <ExternalLink size={15} />
                </a>
              )}
            </div>

            {/* IFRAME RESPONSIVO OU MENSAGEM SE AINDA NÃO HOUVER URL */}
            {dashboardAtual.url ? (
              <div className={styles.iframeWrapper}>
                <iframe
                  title={dashboardAtual.titulo}
                  src={dashboardAtual.url}
                  allowFullScreen={true}
                  className={styles.powerBiIframe}
                ></iframe>
              </div>
            ) : (
              <div className={styles.emptyDashboardState}>
                <BarChart3 size={48} className={styles.emptyIcon} />
                <h3>Painel em Atualização</h3>
                <p>Os dados de {dashboardAtual.titulo} estão sendo integrados e estarão disponíveis em breve.</p>
              </div>
            )}
          </div>

        </div>
      </main>

    </div>
  );
}