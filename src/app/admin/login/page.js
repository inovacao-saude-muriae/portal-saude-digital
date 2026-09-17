'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Lock, 
  User, 
  KeyRound, 
  AlertCircle, 
  ArrowLeft, 
  Loader2, 
  Mail, 
  CheckCircle2, 
  X
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import styles from './AdminLogin.module.css';

export default function AdminLoginPage() {
  const [usuarioOuEmail, setUsuarioOuEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  
  // ESTADOS DO MODAL DE RECUPERAÇÃO DE SENHA
  const [modalRecuperarAberto, setModalRecuperarAberto] = useState(false);
  const [emailRecuperacao, setEmailRecuperacao] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [msgRecuperacao, setMsgRecuperacao] = useState(null);

  const router = useRouter();

  // Se já estiver logado, vai direto para o painel (evita "pedir login" de novo
  // ao clicar em "Área Restrita" no menu quando a sessão ainda está ativa).
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('user_info');
    if (token && user) {
      router.replace('/admin');
    }
  }, [router]);

  // LOGIN UTILIZANDO A FUNÇÃO RPC get_email_by_username
  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      let emailFinal = usuarioOuEmail.trim().toLowerCase();

      // Se o usuário digitou um apelido/username (ex: admin.admin)
      if (!emailFinal.includes('@')) {
        const { data: emailEncontrado, error: rpcError } = await supabase
          .rpc('get_email_by_username', { p_usuario: emailFinal });

        if (rpcError || !emailEncontrado) {
          setErro('Usuário não encontrado.');
          setCarregando(false);
          return;
        }

        emailFinal = emailEncontrado;
      }

      // Autentica via Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: emailFinal,
        password: senha.trim()
      });

      if (authError || !authData.user) {
        setErro('Usuário ou senha incorretos.');
        setCarregando(false);
        return;
      }

      // Busca o perfil do usuário logado na tabela profiles
      const { data: profile } = await supabase
        .from('profiles')
        .select('nome, usuario, cargo')
        .eq('id', authData.user.id)
        .maybeSingle();

      // Salva os dados na sessão
      localStorage.setItem('auth_token', authData.session.access_token);
      localStorage.setItem('user_info', JSON.stringify({
        id: authData.user.id,
        nome: profile?.nome || 'Gestor',
        usuario: profile?.usuario || authData.user.email,
        cargo: profile?.cargo || 'admin',
        email: authData.user.email
      }));

      // Notifica o Header (e outros componentes) que o login mudou
      window.dispatchEvent(new Event('auth-changed'));

      router.push('/admin');
    } catch (err) {
      console.error('Erro na autenticação:', err);
      setErro('Erro ao conectar com o serviço de autenticação.');
    } finally {
      setCarregando(false);
    }
  };

  // ENVIAR E-MAIL DE REDEFINIÇÃO DE SENHA
  const handleSolicitarRedefinicao = async (e) => {
    e.preventDefault();
    setMsgRecuperacao(null);
    setEnviando(true);

    try {
      let emailAlvo = emailRecuperacao.trim().toLowerCase();

      // Se informou o apelido/username no modal, resolve o e-mail via RPC
      if (!emailAlvo.includes('@')) {
        const { data: emailEncontrado } = await supabase
          .rpc('get_email_by_username', { p_usuario: emailAlvo });

        if (!emailEncontrado) {
          setMsgRecuperacao({ tipo: 'erro', texto: 'Usuário não encontrado.' });
          setEnviando(false);
          return;
        }
        emailAlvo = emailEncontrado;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(emailAlvo, {
        redirectTo: `${window.location.origin}/admin/redefinir-senha`
      });

      if (error) {
        setMsgRecuperacao({ tipo: 'erro', texto: 'Erro ao enviar e-mail: ' + error.message });
      } else {
        setMsgRecuperacao({ 
          tipo: 'sucesso', 
          texto: 'E-mail de redefinição enviado com sucesso! Verifique sua caixa de entrada.' 
        });
      }
    } catch (err) {
      console.error(err);
      setMsgRecuperacao({ tipo: 'erro', texto: 'Falha ao processar solicitação.' });
    } finally {
      setEnviando(false);
    }
  };

  const fecharModal = () => {
    setModalRecuperarAberto(false);
    setEmailRecuperacao('');
    setMsgRecuperacao(null);
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginCard}>
        
        <div className={styles.headerContainer}>
          <div className={styles.iconBadge}>
            <Lock size={30} />
          </div>
          <h2 className={styles.title}>Área Restrita</h2>
          <p className={styles.subtitle}>Secretaria Municipal de Saúde</p>
        </div>

        {erro && (
          <div className={styles.alertError}>
            <AlertCircle size={18} />
            <span>{erro}</span>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Usuário ou E-mail</label>
            <div className={styles.inputWrapper}>
              <User size={18} className={styles.inputIcon} />
              <input 
                type="text" 
                required
                value={usuarioOuEmail}
                onChange={(e) => setUsuarioOuEmail(e.target.value)}
                placeholder="Informe seu usuário ou e-mail"
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.passwordLabelRow}>
              <label className={styles.label}>Senha</label>
              <button 
                type="button" 
                onClick={() => { setModalRecuperarAberto(true); setMsgRecuperacao(null); }}
                className={styles.forgotBtn}
              >
                Esqueceu a senha?
              </button>
            </div>
            <div className={styles.inputWrapper}>
              <KeyRound size={18} className={styles.inputIcon} />
              <input 
                type="password" 
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                className={styles.input}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={carregando}
            className={styles.submitBtn}
          >
            {carregando ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Acessando...
              </>
            ) : (
              'Entrar no Sistema'
            )}
          </button>
        </form>

        <div className={styles.footer}>
          <Link href="/" className={styles.backLink}>
            <ArrowLeft size={15} /> Voltar ao Portal da Saúde
          </Link>
        </div>

      </div>

      {/* MODAL DE RECUPERAÇÃO DE SENHA */}
      {modalRecuperarAberto && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button onClick={fecharModal} className={styles.modalCloseBtn}>
              <X size={18} />
            </button>

            <div className={styles.modalHeader}>
              <div className={styles.modalIconBadge}>
                <Mail size={24} />
              </div>
              <h3 className={styles.modalTitle}>Recuperar Senha</h3>
              <p className={styles.modalSubtitle}>
                Informe seu usuário ou e-mail para receber as instruções de redefinição.
              </p>
            </div>

            {msgRecuperacao && (
              <div className={`${styles.alertRecuperacao} ${msgRecuperacao.tipo === 'sucesso' ? styles.alertSucesso : styles.alertErro}`}>
                {msgRecuperacao.tipo === 'sucesso' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{msgRecuperacao.texto}</span>
              </div>
            )}

            <form onSubmit={handleSolicitarRedefinicao}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Usuário ou E-mail</label>
                <input 
                  type="text" 
                  required
                  value={emailRecuperacao}
                  onChange={(e) => setEmailRecuperacao(e.target.value)}
                  placeholder="admin.admin ou exemplo@muriae.mg.gov.br"
                  className={styles.inputSimple}
                />
              </div>

              <button type="submit" disabled={enviando} className={styles.submitBtn}>
                {enviando ? <><Loader2 size={16} className="animate-spin" /> Enviando...</> : 'Enviar E-mail de Redefinição'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}