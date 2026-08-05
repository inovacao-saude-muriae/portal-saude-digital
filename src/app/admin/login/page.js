'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, KeyRound, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { USUARIOS_CADASTRADOS } from '@/config/usuarios';
import styles from './AdminLogin.module.css';

export default function AdminLoginPage() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    setTimeout(() => {
      // Remove espaços extras e converte para minúsculas
      const userDigitado = usuario.trim().toLowerCase();
      const senhaDigitada = senha.trim();

      // Busca o usuário na lista importada do config
      const usuarioEncontrado = USUARIOS_CADASTRADOS.find(
        (u) => u.usuario.toLowerCase() === userDigitado && u.senha === senhaDigitada
      );

      if (usuarioEncontrado) {
        // Salva a sessão e as informações do usuário logado
        localStorage.setItem('auth_token', 'autenticado_secretaria_saude');
        localStorage.setItem('user_info', JSON.stringify({
          id: usuarioEncontrado.id,
          nome: usuarioEncontrado.nome,
          cargo: usuarioEncontrado.cargo,
          usuario: usuarioEncontrado.usuario
        }));

        router.push('/admin');
      } else {
        setErro('Usuário ou senha incorretos.');
        setCarregando(false);
      }
    }, 600);
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
            <label className={styles.label}>Usuário</label>
            <div className={styles.inputWrapper}>
              <User size={18} className={styles.inputIcon} />
              <input 
                type="text" 
                required
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="Informe seu usuário"
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Senha</label>
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
    </div>
  );
}