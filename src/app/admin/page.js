'use client';

import Link from 'next/link';
import { 
  Newspaper, 
  Calendar, 
  ArrowRight, 
  ShieldCheck, 
  ArrowLeft,
  Activity
} from 'lucide-react';
import styles from './AdminHub.module.css';

export default function AdminHubPage() {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        
        {/* BARRA SUPERIOR DA INTERFACE ADMIN */}
        <div className={styles.headerBar}>
          <div>
            <span className={styles.badgeHeader}>
              <ShieldCheck size={14} /> Painel Administrativo do Portal
            </span>
            <h1 className={styles.mainTitle}>Área Restrita do Gestor</h1>
            <p className={styles.subTitle}>
              Selecione o módulo de conteúdo que deseja cadastrar, editar ou gerenciar.
            </p>
          </div>

          <Link href="/" className={styles.backLink}>
            <ArrowLeft size={16} /> Ir para o Site Público
          </Link>
        </div>

        {/* CARDS DE NAVEGAÇÃO DOS MÓDULOS */}
        <div className={styles.cardsGrid}>
          
          {/* CARD 1: NOTÍCIAS */}
          <div className={styles.moduleCard}>
            <div className={styles.iconWrapperBlue}>
              <Newspaper size={32} />
            </div>
            <div className={styles.cardContent}>
              <span className={styles.cardBadge}>Comunicação</span>
              <h2 className={styles.cardTitle}>Gerenciar Notícias</h2>
              <p className={styles.cardDescription}>
                Publique comunicados oficiais, matérias jornalísticas e novidades do SUS municipal.
              </p>
            </div>
            <Link href="/admin/noticias" className={styles.actionBtnBlue}>
              Acessar Notícias <ArrowRight size={18} />
            </Link>
          </div>

          {/* CARD 2: EVENTOS */}
          <div className={styles.moduleCard}>
            <div className={styles.iconWrapperGreen}>
              <Calendar size={32} />
            </div>
            <div className={styles.cardContent}>
              <span className={styles.cardBadgeGreen}>Agendamento Publico</span>
              <h2 className={styles.cardTitle}>Gerenciar Eventos</h2>
              <p className={styles.cardDescription}>
                Cadastre mutirões de saúde, campanhas de vacinação, workshops e ações comunitárias.
              </p>
            </div>
            <Link href="/admin/eventos" className={styles.actionBtnGreen}>
              Acessar Eventos <ArrowRight size={18} />
            </Link>
          </div>

        </div>

        {/* MENSAGEM / INFORMAÇÕES DO SISTEMA */}
        <div className={styles.systemInfoBox}>
          <Activity size={20} color="#0065a4" />
          <span>
            Todas as alterações realizadas no painel são sincronizadas em tempo real com a planilha oficial do Google Sheets.
          </span>
        </div>

      </div>
    </div>
  );
}