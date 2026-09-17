'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';
import styles from './UIFeedback.module.css';

const UIFeedbackContext = createContext(null);

/**
 * Provider global de feedback de UI:
 * - toasts (notificações que somem sozinhas)
 * - modal de confirmação (substitui window.confirm)
 *
 * Uso em qualquer componente cliente:
 *   const { notificar, confirmar } = useUI();
 *   notificar('sucesso', 'Salvo com sucesso!');
 *   const ok = await confirmar({ titulo: '...', mensagem: '...' });
 */
export function UIFeedbackProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [confirmState, setConfirmState] = useState(null);

  // ----- TOASTS -----
  const removerToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const notificar = useCallback((tipo, texto, duracao = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, tipo, texto }]);
    if (duracao > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duracao);
    }
    return id;
  }, []);

  // ----- CONFIRMAÇÃO -----
  const confirmar = useCallback((opcoes = {}) => {
    return new Promise((resolve) => {
      setConfirmState({
        titulo: opcoes.titulo || 'Confirmar ação',
        mensagem: opcoes.mensagem || 'Tem certeza que deseja continuar?',
        textoConfirmar: opcoes.textoConfirmar || 'Confirmar',
        textoCancelar: opcoes.textoCancelar || 'Cancelar',
        perigo: opcoes.perigo ?? true,
        resolve
      });
    });
  }, []);

  const fecharConfirmacao = useCallback((resultado) => {
    setConfirmState((atual) => {
      if (atual?.resolve) atual.resolve(resultado);
      return null;
    });
  }, []);

  const iconePorTipo = {
    sucesso: <CheckCircle2 size={20} />,
    erro: <AlertCircle size={20} />,
    info: <Info size={20} />
  };

  return (
    <UIFeedbackContext.Provider value={{ notificar, confirmar }}>
      {children}

      {/* PILHA DE TOASTS */}
      <div className={styles.toastContainer} role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`${styles.toast} ${styles[`toast_${t.tipo}`] || ''}`}>
            <span className={styles.toastIcone}>{iconePorTipo[t.tipo] || iconePorTipo.info}</span>
            <span className={styles.toastTexto}>{t.texto}</span>
            <button
              className={styles.toastFechar}
              onClick={() => removerToast(t.id)}
              aria-label="Fechar notificação"
            >
              <X size={15} />
            </button>
          </div>
        ))}
      </div>

      {/* MODAL DE CONFIRMAÇÃO */}
      {confirmState && (
        <div className={styles.confirmOverlay} onClick={() => fecharConfirmacao(false)}>
          <div className={styles.confirmBox} onClick={(e) => e.stopPropagation()}>
            <div className={`${styles.confirmIcone} ${confirmState.perigo ? styles.confirmIconePerigo : styles.confirmIconeNeutro}`}>
              <AlertTriangle size={26} />
            </div>
            <h3 className={styles.confirmTitulo}>{confirmState.titulo}</h3>
            <p className={styles.confirmMensagem}>{confirmState.mensagem}</p>
            <div className={styles.confirmBotoes}>
              <button
                className={styles.confirmCancelar}
                onClick={() => fecharConfirmacao(false)}
              >
                {confirmState.textoCancelar}
              </button>
              <button
                className={`${styles.confirmConfirmar} ${confirmState.perigo ? styles.confirmConfirmarPerigo : ''}`}
                onClick={() => fecharConfirmacao(true)}
              >
                {confirmState.textoConfirmar}
              </button>
            </div>
          </div>
        </div>
      )}
    </UIFeedbackContext.Provider>
  );
}

export function useUI() {
  const ctx = useContext(UIFeedbackContext);
  if (!ctx) {
    // Fallback seguro caso seja usado fora do provider
    return {
      notificar: (_tipo, texto) => { if (typeof window !== 'undefined') window.alert(texto); },
      confirmar: (opcoes) => Promise.resolve(typeof window !== 'undefined' ? window.confirm(opcoes?.mensagem || 'Confirmar?') : false)
    };
  }
  return ctx;
}
