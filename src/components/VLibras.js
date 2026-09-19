'use client';

import { useEffect } from 'react';

/**
 * Widget oficial do VLibras (tradutor de Libras do Governo Federal).
 * Injeta o markup exigido e carrega o script oficial, inicializando o widget
 * assim que ele estiver disponível.
 */
export default function VLibras() {
  useEffect(() => {
    const SCRIPT_SRC = 'https://vlibras.gov.br/app/vlibras-plugin.js';

    // Evita carregar o script mais de uma vez
    const existente = document.querySelector(`script[src="${SCRIPT_SRC}"]`);

    const iniciar = () => {
      if (window.VLibras && window.VLibras.Widget) {
        const widget = new window.VLibras.Widget('https://vlibras.gov.br/app');
        return widget;
      }
    };

    if (existente) {
      iniciar();
      return;
    }

    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = iniciar;
    document.body.appendChild(script);
  }, []);

  return (
    <div vw="true" className="enabled">
      <div vw-access-button="true" className="active"></div>
      <div vw-plugin-wrapper="true">
        <div className="vw-plugin-top-wrapper"></div>
      </div>
    </div>
  );
}
