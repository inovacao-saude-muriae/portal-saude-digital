'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { Volume2, Play, Pause, Square, X } from 'lucide-react';
import styles from './LeitorTela.module.css';

/**
 * Leitor de página para acessibilidade (pessoas cegas ou com baixa visão).
 * Usa a Web Speech API nativa do navegador (speechSynthesis) para ler em voz
 * alta o conteúdo textual da página em português.
 */
export default function LeitorTela() {
  const [aberto, setAberto] = useState(false);
  // Suporte do navegador avaliado uma vez, sem setState em effect
  const [suportado] = useState(
    () => typeof window === 'undefined' || 'speechSynthesis' in window
  );
  const [estado, setEstado] = useState('parado'); // 'parado' | 'lendo' | 'pausado'
  const pathname = usePathname();

  // Para a leitura ao trocar de página
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    // Cancela qualquer leitura em andamento da página anterior
    window.speechSynthesis.cancel();
    // Atualiza o estado no próximo tick para não disparar setState síncrono no effect
    const t = setTimeout(() => setEstado('parado'), 0);
    return () => clearTimeout(t);
  }, [pathname]);

  // Extrai o texto principal da página (ignora menus, botões de acessibilidade, etc.)
  const obterTextoDaPagina = useCallback(() => {
    const main = document.querySelector('main');
    const alvo = main || document.body;

    // Clona para poder remover elementos que não devem ser lidos
    const clone = alvo.cloneNode(true);
    clone.querySelectorAll(
      'script, style, noscript, [aria-hidden="true"], .vw, [vw], nav, header, footer'
    ).forEach((el) => el.remove());

    const texto = (clone.textContent || '')
      .replace(/\s+/g, ' ')
      .trim();

    return texto;
  }, []);

  const iniciarLeitura = useCallback(() => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    const texto = obterTextoDaPagina();
    if (!texto) return;

    const fala = new SpeechSynthesisUtterance(texto);
    fala.lang = 'pt-BR';
    fala.rate = 1;
    fala.pitch = 1;

    // Tenta escolher uma voz em português, se disponível
    const vozes = window.speechSynthesis.getVoices();
    const vozPt = vozes.find((v) => v.lang && v.lang.toLowerCase().startsWith('pt'));
    if (vozPt) fala.voice = vozPt;

    fala.onend = () => setEstado('parado');
    fala.onerror = () => setEstado('parado');

    window.speechSynthesis.speak(fala);
    setEstado('lendo');
  }, [obterTextoDaPagina]);

  const pausar = useCallback(() => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setEstado('pausado');
    }
  }, []);

  const retomar = useCallback(() => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setEstado('lendo');
    }
  }, []);

  const parar = useCallback(() => {
    window.speechSynthesis.cancel();
    setEstado('parado');
  }, []);

  if (!suportado) return null;

  return (
    <div className={styles.container}>
      {aberto && (
        <div className={styles.painel} role="dialog" aria-label="Leitor de página">
          <div className={styles.painelHeader}>
            <span>Leitor de página</span>
            <button onClick={() => { parar(); setAberto(false); }} aria-label="Fechar leitor" className={styles.fecharBtn}>
              <X size={16} />
            </button>
          </div>

          <p className={styles.painelDica}>Ouça o conteúdo desta página em voz alta.</p>

          <div className={styles.controles}>
            {estado === 'lendo' ? (
              <button onClick={pausar} className={styles.controleBtn}>
                <Pause size={16} /> Pausar
              </button>
            ) : estado === 'pausado' ? (
              <button onClick={retomar} className={styles.controleBtn}>
                <Play size={16} /> Continuar
              </button>
            ) : (
              <button onClick={iniciarLeitura} className={styles.controleBtnPrimario}>
                <Play size={16} /> Ouvir página
              </button>
            )}

            {estado !== 'parado' && (
              <button onClick={parar} className={styles.controleBtn}>
                <Square size={16} /> Parar
              </button>
            )}
          </div>
        </div>
      )}

      <button
        onClick={() => setAberto((a) => !a)}
        className={styles.botaoFlutuante}
        aria-label="Abrir leitor de página em voz alta"
        title="Ouvir a página (acessibilidade)"
      >
        <Volume2 size={24} />
      </button>
    </div>
  );
}
