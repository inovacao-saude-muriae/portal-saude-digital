'use client';

import { useState } from 'react';
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
  X,
  ShieldCheck
} from 'lucide-react';
import styles from './AdminLogin.module.css';

const SCRIPT_USUARIOS_URL = process.env.NEXT_PUBLIC_SCRIPT_USUARIOS_URL || 'https://script.google.com/macros/s/AKfycbz0uiuPzrSYPHex_rhAVHXkRUFTIoOgC3WzgAFpEC5V-t3mo0GiaICsti63xAbEkI1ccA/exec';

export default function AdminLoginPage() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  
  // ESTADOS DO MODAL E REDEFINIÇÃO DE SENHA
  const [modalRecuperarAberto, setModalRecuperarAberto] = useState(false);
  const [passoRecuperacao, setPassoRecuperacao] = useState(1);
  const [usuarioRecuperacao, setUsuarioRecuperacao] = useState('');
  const [usuarioIdentificado, setUsuarioIdentificado] = useState('');
  const [codigoDigitado, setCodigoDigitado] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [msgRecuperacao, setMsgRecuperacao] = useState(null);

  const router = useRouter();

  // LOGIN CONSULTANDO DIRETAMENTE A PLANILHA DO GOOGLE
  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const response = await fetch(SCRIPT_USUARIOS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'LOGIN',
          usuario: usuario.trim(),
          senha: senha.trim()
        })
      });

      const data = await response.json();

      if (data.status === 'success') {
        localStorage.setItem('auth_token', 'autenticado_secretaria_saude');
        localStorage.setItem('user_info', JSON.stringify(data.user));

        router.push('/admin');
      } else {
        setErro(data.message || 'Usuário ou senha incorretos.');
      }
    } catch (err) {
      console.error(err);
      setErro('Erro ao conectar com o servidor para autenticação.');
    } finally {
      setCarregando(false);
    }
  };

  // SOLICITAR CÓDIGO POR E-MAIL
  const handleSolicitarCodigo = async (e) => {
    e.preventDefault();
    setMsgRecuperacao(null);
    setEnviando(true);

    try {
      const response = await fetch(SCRIPT_USUARIOS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'SOLICITAR_CODIGO',
          usuarioOuEmail: usuarioRecuperacao.trim()
        })
      });

      const data = await response.json();

      if (data.status === 'success') {
        setUsuarioIdentificado(data.usuario);
        setPassoRecuperacao(2);
        setMsgRecuperacao({ tipo: 'sucesso', texto: data.message });
      } else {
        setMsgRecuperacao({ tipo: 'erro', texto: data.message || 'Erro ao processar.' });
      }
    } catch (err) {
      console.error(err);
      setMsgRecuperacao({ tipo: 'erro', texto: 'Falha ao conectar com o servidor.' });
    } finally {
      setEnviando(false);
    }
  };

  // VALIDAR CÓDIGO E ALTERAR SENHA NA PLANILHA
  const handleRedefinirSenha = async (e) => {
    e.preventDefault();
    setMsgRecuperacao(null);
    setEnviando(true);

    try {
      const response = await fetch(SCRIPT_USUARIOS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'REDEFINIR_SENHA',
          usuario: usuarioIdentificado,
          codigo: codigoDigitado,
          novaSenha: novaSenha
        })
      });

      const data = await response.json();

      if (data.status === 'success') {
        setMsgRecuperacao({ tipo: 'sucesso', texto: data.message });

        setTimeout(() => {
          setModalRecuperarAberto(false);
          setPassoRecuperacao(1);
          setUsuario(usuarioIdentificado);
          setSenha(novaSenha);
        }, 2000);
      } else {
        setMsgRecuperacao({ tipo: 'erro', texto: data.message });
      }
    } catch (err) {
      console.error(err);
      setMsgRecuperacao({ tipo: 'erro', texto: 'Falha ao atualizar a senha.' });
    } finally {
      setEnviando(false);
    }
  };

  const fecharModal = () => {
    setModalRecuperarAberto(false);
    setPassoRecuperacao(1);
    setUsuarioRecuperacao('');
    setCodigoDigitado('');
    setNovaSenha('');
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
                {passoRecuperacao === 1 ? <Mail size={24} /> : <ShieldCheck size={24} />}
              </div>
              <h3 className={styles.modalTitle}>
                {passoRecuperacao === 1 ? 'Recuperar Senha' : 'Digite o Código e a Nova Senha'}
              </h3>
              <p className={styles.modalSubtitle}>
                {passoRecuperacao === 1 
                  ? 'Informe seu usuário ou e-mail para receber um código de segurança.' 
                  : `Enviamos um código para o e-mail cadastrado de ${usuarioIdentificado}.`}
              </p>
            </div>

            {msgRecuperacao && (
              <div className={`${styles.alertRecuperacao} ${msgRecuperacao.tipo === 'sucesso' ? styles.alertSucesso : styles.alertErro}`}>
                {msgRecuperacao.tipo === 'sucesso' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{msgRecuperacao.texto}</span>
              </div>
            )}

            {passoRecuperacao === 1 ? (
              <form onSubmit={handleSolicitarCodigo}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Usuário ou E-mail</label>
                  <input 
                    type="text" 
                    required
                    value={usuarioRecuperacao}
                    onChange={(e) => setUsuarioRecuperacao(e.target.value)}
                    placeholder="Ex: admin.admin"
                    className={styles.inputSimple}
                  />
                </div>

                <button type="submit" disabled={enviando} className={styles.submitBtn}>
                  {enviando ? <><Loader2 size={16} className="animate-spin" /> Enviando Código...</> : 'Enviar Código por E-mail'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRedefinirSenha}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Código de Verificação (6 dígitos)</label>
                  <input 
                    type="text" 
                    required
                    maxLength={6}
                    value={codigoDigitado}
                    onChange={(e) => setCodigoDigitado(e.target.value)}
                    placeholder="123456"
                    className={styles.inputSimple}
                    style={{ textAlign: 'center', letterSpacing: '4px', fontSize: '18px', fontWeight: 'bold' }}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Nova Senha</label>
                  <input 
                    type="password" 
                    required
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    placeholder="Digite a nova senha"
                    className={styles.inputSimple}
                  />
                </div>

                <button type="submit" disabled={enviando} className={styles.submitBtn}>
                  {enviando ? <><Loader2 size={16} className="animate-spin" /> Salvando...</> : 'Alterar Senha'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}