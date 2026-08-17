'use client';

import { useEffect, useSyncExternalStore } from 'react';
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
  Sparkles,
  PawPrint
} from 'lucide-react';
import styles from './AdminHub.module.css';

// Função para inscrever ouvintes de eventos (não precisamos escutar mudanças externas aqui)
const subscribe = () => () => {};

// Lê os dados do localStorage apenas no navegador
const getClientSnapshot = () => {
  try {
    return localStorage.getItem('user_info') || '';
  } catch {
    return '';
  }
};

// Retorna o estado padrão para o Servidor (SSR)
const getServerSnapshot = () => '';

export default function AdminHubPage() {
  const router = useRouter();

  // Lê do localStorage de forma segura entre Servidor e Cliente
  const userInfoRaw = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

  let userInfo = null;
  if (userInfoRaw) {
    try {
      userInfo = JSON.parse(userInfoRaw);
    } catch (e) {
      console.error('Erro ao analisar user_info:', e);
    }
  }

  // Valida a autenticação apenas no navegador
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

  // Identifica o cargo do usuário logado (padrão: 'admin')
  const userCargo = userInfo?.cargo ? String(userInfo.cargo).toLowerCase().trim() : 'admin';

  // Função auxiliar para validar as permissões de exibição
  const temPermissao = (cargosPermitidos) => {
    if (userCargo === 'admin' || userCargo === 'master' || userCargo === 'gestor') return true;
    return cargosPermitidos.includes(userCargo);
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
              Perfil de Acesso: <strong style={{ textTransform: 'uppercase', color: '#0f172a' }}>{userInfo ? userCargo : 'Carregando...'}</strong>
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
                padding: '10px 16px',
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
          
          {/* MÓDULO 1: CCZ / ADOÇÃO DE ANIMAIS */}
          {temPermissao(['ccz', 'zoonoses', 'veterinario']) && (
            <div className={styles.moduleCard}>
              <div className={styles.iconWrapperGreen} style={{ backgroundColor: '#e6f4f1', color: '#008a83' }}>
                <PawPrint size={32} />
              </div>
              <div className={styles.cardContent}>
                <span className={styles.cardBadgeGreen} style={{ backgroundColor: '#e6f4f1', color: '#008a83' }}>
                  Zoonoses
                </span>
                <h2 className={styles.cardTitle}>Gerenciar Adoção (CCZ)</h2>
                <p className={styles.cardDescription}>
                  Cadastre novos animais com fotos, edite históricos e remova os peludinhos adotados.
                </p>
              </div>
              <Link href="/admin/adocao" className={styles.actionBtnGreen} style={{ backgroundColor: '#008a83' }}>
                Acessar CCZ <ArrowRight size={18} />
              </Link>
            </div>
          )}

          {/* MÓDULO 2: BANNER PRINCIPAL (HERO / INDICADORES) */}
          {temPermissao(['comunicacao', 'imprensa', 'home']) && (
            <div className={styles.moduleCard}>
              <div className={styles.iconWrapperBlue}>
                <Sparkles size={32} />
              </div>
              <div className={styles.cardContent}>
                <span className={styles.cardBadge}>Página Inicial</span>
                <h2 className={styles.cardTitle}>Indicadores da Home</h2>
                <p className={styles.cardDescription}>
                  Altere os números e rótulos dos 4 cartões de estatísticas do banner principal.
                </p>
              </div>
              <Link href="/admin/hero" className={styles.actionBtnBlue}>
                Acessar Indicadores <ArrowRight size={18} />
              </Link>
            </div>
          )}

          {/* MÓDULO 3: CARROSSEL */}
          {temPermissao(['comunicacao', 'imprensa', 'carrossel']) && (
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
          )}

          {/* MÓDULO 4: NOTÍCIAS */}
          {temPermissao(['comunicacao', 'imprensa', 'noticias']) && (
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
          )}

          {/* MÓDULO 5: EVENTOS */}
          {temPermissao(['comunicacao', 'imprensa', 'eventos']) && (
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
          )}

        </div>

      </div>
    </div>
  );
}