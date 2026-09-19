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
  PawPrint,
  ClipboardList,
  UserCog
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import styles from './AdminHub.module.css';

// Função para inscrever ouvintes de eventos (leitura reativa do localStorage)
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

  // Valida a autenticação. Fonte primária: o token salvo no localStorage
  // (que persiste entre páginas). O Supabase é consultado apenas para
  // renovar/sincronizar o token, sem deslogar caso ele demore a reidratar.
  useEffect(() => {
    let ativo = true;

    async function checarSessao() {
      const tokenLocal = localStorage.getItem('auth_token');
      const userLocal = localStorage.getItem('user_info');

      // Sem credencial local nenhuma => não está logado
      if (!tokenLocal || !userLocal) {
        router.push('/admin/login');
        return;
      }

      // Tem credencial local: mantém o usuário logado.
      // Tenta sincronizar com a sessão do Supabase de forma não-destrutiva.
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!ativo) return;
        if (session?.access_token) {
          localStorage.setItem('auth_token', session.access_token);
        }
      } catch (err) {
        // Falha ao consultar a sessão não deve deslogar o usuário
        console.warn('Não foi possível sincronizar a sessão:', err);
      }
    }

    checarSessao();

    return () => {
      ativo = false;
    };
  }, [router]);

  // Função para encerrar a sessão no Supabase e limpar o navegador
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Erro ao fazer logout no Supabase:', err);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_info');
      window.dispatchEvent(new Event('auth-changed'));
      router.push('/admin/login');
    }
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
                <h2 className={styles.cardTitle}>Gerenciar Animais para adoção</h2>
              </div>
              <Link href="/admin/adocao" className={styles.actionBtnGreen} style={{ backgroundColor: '#008a83' }}>
                Acessar<ArrowRight size={18} />
              </Link>
            </div>
          )}

          {/* MÓDULO: SOLICITAÇÕES DE ADOÇÃO RECEBIDAS */}
          {temPermissao(['ccz', 'zoonoses', 'veterinario']) && (
            <div className={styles.moduleCard}>
              <div className={styles.iconWrapperGreen} style={{ backgroundColor: '#e6f4f1', color: '#008a83' }}>
                <ClipboardList size={32} />
              </div>
              <div className={styles.cardContent}>
                <span className={styles.cardBadgeGreen} style={{ backgroundColor: '#e6f4f1', color: '#008a83' }}>
                  Zoonoses
                </span>
                <h2 className={styles.cardTitle}>Solicitações de Adoção</h2>
              </div>
              <Link href="/admin/adocao-solicitacoes" className={styles.actionBtnGreen} style={{ backgroundColor: '#008a83' }}>
                Ver Solicitações <ArrowRight size={18} />
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
        
              </div>
              <Link href="/admin/hero" className={styles.actionBtnBlue}>
                Acessar<ArrowRight size={18} />
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
              </div>
              <Link href="/admin/carousel" className={styles.actionBtnPurple}>
                Acessar <ArrowRight size={18} />
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
              </div>
              <Link href="/admin/noticias" className={styles.actionBtnBlue}>
                Acessar<ArrowRight size={18} />
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
              </div>
              <Link href="/admin/eventos" className={styles.actionBtnGreen}>
                Acessar<ArrowRight size={18} />
              </Link>
            </div>
          )}

          {/* MÓDULO: GERENCIAR USUÁRIOS (somente administradores) */}
          {(userCargo === 'admin' || userCargo === 'master' || userCargo === 'gestor') && (
            <div className={styles.moduleCard}>
              <div className={styles.iconWrapperBlue}>
                <UserCog size={32} />
              </div>
              <div className={styles.cardContent}>
                <span className={styles.cardBadge}>Administração</span>
                <h2 className={styles.cardTitle}>Gerenciar Usuários</h2>
              </div>
              <Link href="/admin/usuarios" className={styles.actionBtnBlue}>
                Acessar<ArrowRight size={18} />
              </Link>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}