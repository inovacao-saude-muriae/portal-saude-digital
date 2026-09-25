'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Lock,
  KeyRound,
  AlertCircle,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Eye,
  EyeOff
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import styles from '../login/AdminLogin.module.css';

export default function RedefinirSenhaPage() {
  const router = useRouter();

  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarNova, setMostrarNova] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState(null);
  const [sessaoValida, setSessaoValida] = useState(false);
  const [verificandoSessao, setVerificandoSessao] = useState(true);

  // Ao abrir a página pelo link do e-mail, o Supabase detecta o token na URL
  // (detectSessionInUrl está ativado no cliente) e cria uma sessão temporária
  // de recuperação. Verificamos se essa sessão existe.
  useEffect(() => {
    let ativo = true;

    async function verificarSessao() {
      try {
        const { data } = await supabase.auth.getSession();
        if (ativo) {
          setSessaoValida(!!data?.session);
          setVerificandoSessao(false);
        }
      } catch {
        if (ativo) {
          setSessaoValida(false);
          setVerificandoSessao(false);
        }
      }
    }

    // Escuta o evento de recuperação de senha disparado pelo Supabase.
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
        if (ativo) {
          setSessaoValida(true);
          setVerificandoSessao(false);
        }
      }
    });

    // Pequeno atraso para dar tempo do Supabase processar o token da URL.
    const timer = setTimeout(verificarSessao, 700);

    return () => {
      ativo = false;
      clearTimeout(timer);
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const handleSalvar = async (e) => {
    e.preventDefault();
    setMensagem(null);

    if (novaSenha.length < 6) {
      setMensagem({ tipo: 'erro', texto: 'A senha deve ter pelo menos 6 caracteres.' });
      return;
    }
    if (novaSenha !== confirmarSenha) {
      setMensagem({ tipo: 'erro', texto: 'As senhas não coincidem.' });
      return;
    }

    setSalvando(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: novaSenha });

      if (error) {
        setMensagem({ tipo: 'erro', texto: 'Erro ao redefinir a senha: ' + error.message });
      } else {
        setMensagem({
          tipo: 'sucesso',
          texto: 'Senha redefinida com sucesso! Redirecionando para o login...'
        });
        setTimeout(async () => {
          await supabase.auth.signOut();
          router.replace('/admin/login');
        }, 2500);
      }
    } catch (err) {
      console.error('Erro ao redefinir senha:', err);
      setMensagem({ tipo: 'erro', texto: 'Falha ao processar a redefinição de senha.' });
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginCard}>
        <div className={styles.logoIcon}>
          <KeyRound size={26} color="#0065a4" />
        </div>

        <h1 className={styles.title}>Redefinir Senha</h1>
        <p className={styles.subtitle}>Crie uma nova senha de acesso ao painel.</p>

        {verificandoSessao ? (
          <div className={styles.alertRecuperacao}>
            <Loader2 size={16} className="girando" />
            <span>Validando o link de redefinição...</span>
          </div>
        ) : !sessaoValida ? (
          <>
            <div className={`${styles.alertRecuperacao} ${styles.alertErro}`}>
              <AlertCircle size={16} />
              <span>
                Link inválido ou expirado. Solicite uma nova redefinição na tela de login.
              </span>
            </div>
            <div className={styles.footer}>
              <Link href="/admin/login" className={styles.backLink}>
                <ArrowLeft size={15} /> Voltar para o login
              </Link>
            </div>
          </>
        ) : (
          <>
            {mensagem && (
              <div
                className={`${styles.alertRecuperacao} ${mensagem.tipo === 'sucesso' ? styles.alertSucesso : styles.alertErro}`}
              >
                {mensagem.tipo === 'sucesso' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{mensagem.texto}</span>
              </div>
            )}

            <form onSubmit={handleSalvar}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Nova senha</label>
                <div className={styles.inputWrapper}>
                  <Lock size={18} className={styles.inputIcon} />
                  <input
                    type={mostrarNova ? 'text' : 'password'}
                    required
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    placeholder="Digite a nova senha"
                    className={`${styles.input} ${styles.inputComToggle}`}
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarNova((v) => !v)}
                    className={styles.toggleSenhaBtn}
                    aria-label={mostrarNova ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {mostrarNova ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Confirmar nova senha</label>
                <div className={styles.inputWrapper}>
                  <Lock size={18} className={styles.inputIcon} />
                  <input
                    type={mostrarConfirmar ? 'text' : 'password'}
                    required
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    placeholder="Repita a nova senha"
                    className={`${styles.input} ${styles.inputComToggle}`}
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarConfirmar((v) => !v)}
                    className={styles.toggleSenhaBtn}
                    aria-label={mostrarConfirmar ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {mostrarConfirmar ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={salvando} className={styles.submitBtn}>
                {salvando ? (
                  <><Loader2 size={16} className="girando" /> Salvando...</>
                ) : (
                  'Salvar nova senha'
                )}
              </button>
            </form>

            <div className={styles.footer}>
              <Link href="/admin/login" className={styles.backLink}>
                <ArrowLeft size={15} /> Voltar para o login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
