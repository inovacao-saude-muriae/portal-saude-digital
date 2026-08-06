'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Newspaper, 
  Calendar, 
  ArrowRight, 
  ShieldCheck, 
  ArrowLeft,
  LogOut,
  Images,
  Sparkles
} from 'lucide-react';
import styles from './AdminHub.module.css';

export default function AdminHubPage() {
  const router = useRouter();

  // Leitura síncrona inicial do usuário para não precisar rodar setUserInfo no useEffect (sem sublinhado)
  const [userInfo] = useState(() => {
    if (typeof window === 'undefined') return null;
    try {
      const savedUser = localStorage.getItem('user_info');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/admin/login');
    }
  }, [router]);

  // Função para encerrar a sessão
  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    router.push('/admin/login');
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        
        {/* BARRA SUPERIOR DA INTERFACE ADMIN */}
        <div className={styles.headerBar}>
          <div>
            <span className={styles.badgeHeader}>
              <ShieldCheck size={14} /> Painel Administrativo do Portal
            </span>
            <h1 className={styles.mainTitle}>
              {userInfo?.nome ? `Olá, ${userInfo.nome}` : 'Área Restrita do Gestor'}
            </h1>
            <p className={styles.subTitle}>
              Selecione o módulo de conteúdo que deseja cadastrar, editar ou gerenciar.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href="/" className={styles.backLink}>
              <ArrowLeft size={16} /> Ir para o Site Público
            </Link>

            <button 
              onClick={handleLogout}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#fef2f2',
                color: '#dc2626',
                border: '1px solid #fecaca',
                padding: '8px 14px',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer'
              }}
              title="Encerrar Sessão"
            >
              <LogOut size={16} /> Sair
            </button>
          </div>
        </div>

        {/* CARDS DE NAVEGAÇÃO DOS MÓDULOS */}
        <div className={styles.cardsGrid}>
          
          {/* CARD 1: CARROSSEL */}
          <div className={styles.moduleCard}>
            <div className={styles.iconWrapperPurple}>
              <Images size={32} />
            </div>
            <div className={styles.cardContent}>
              <span className={styles.cardBadgePurple}>Destaques</span>
              <h2 className={styles.cardTitle}>Gerenciar Carrossel</h2>
              <p className={styles.cardDescription}>
                Cadastre e edite as imagens e campanhas em destaque exibidas na página inicial.
              </p>
            </div>
            <Link href="/admin/carousel" className={styles.actionBtnPurple}>
              Acessar Carrossel <ArrowRight size={18} />
            </Link>
          </div>

          {/* CARD 2: ESTATÍSTICAS DO HERO (GLASSMORPHISM) */}
          <div className={styles.moduleCard}>
            <div className={styles.iconWrapperBlue}>
              <Sparkles size={32} />
            </div>
            <div className={styles.cardContent}>
              <span className={styles.cardBadge}>Página Inicial</span>
              <h2 className={styles.cardTitle}>Gerenciar Indicadores do Banner Principal</h2>
              <p className={styles.cardDescription}>
                Altere os números e rótulos dos 4 cartões Glassmorphism exibidos no banner inicial.
              </p>
            </div>
            <Link href="/admin/hero" className={styles.actionBtnBlue}>
              Acessar Indicadores <ArrowRight size={18} />
            </Link>
          </div>

          {/* CARD 3: NOTÍCIAS */}
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

          {/* CARD 4: EVENTOS */}
          <div className={styles.moduleCard}>
            <div className={styles.iconWrapperGreen}>
              <Calendar size={32} />
            </div>
            <div className={styles.cardContent}>
              <span className={styles.cardBadgeGreen}>Agendamento Público</span>
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

      </div>
    </div>
  );
}