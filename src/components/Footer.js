"use client";

import React from 'react';
import Link from 'next/link';
// Removemos os ícones de redes sociais daqui para evitar o erro de exportação
import { MapPin, Phone, Mail } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* BLOCO SUPERIOR: 4 COLUNAS */}
      <div className={styles.footerTop}>
        <div className={styles.container}>
          
          {/* COLUNA 1: LOGO E REDES */}
          <div className={styles.column}>
            <div className={styles.logoArea}>
              <div className={styles.logoIcon}>
                ❤️
              </div>
              <h3>Secretaria de Saúde</h3>
            </div>
            <p className={styles.brandDesc}>
              Cuidando da saúde da nossa cidade com dedicação, ciência e humanidade.
            </p>
            
            {/* SVG Puro para as redes sociais: Funciona sempre e não quebra o build */}
            <div className={styles.socialIcons}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
            </div>
          </div>

          {/* COLUNA 2: LINKS INSTITUCIONAIS */}
          <div className={styles.column}>
            <h4>INSTITUCIONAL</h4>
            <ul className={styles.linkList}>
              <li><Link href="/a-secretaria">A Secretaria</Link></li>
              <li><Link href="/servicos">Serviços</Link></li>
              <li><Link href="/noticias">Notícias</Link></li>
              <li><Link href="/agenda">Eventos</Link></li>
            </ul>
          </div>

          {/* COLUNA 3: CONTATO E ENDEREÇO */}
          <div className={styles.column}>
            <div className={styles.infoRow}>
              <MapPin size={18} className={styles.infoIcon} />
              <div>
                <p>Av. Maestro Sansão, 236</p>
                <p className={styles.subText}>Centro — CEP 36880-002</p>
              </div>
            </div>
            
            <div className={styles.infoRow}>
              <Phone size={18} className={styles.infoIcon} />
              <div>
                <p>(32) 3721-0000</p>
              </div>
            </div>

          </div>

          {/* COLUNA 4: HORÁRIOS */}
          <div className={styles.column}>
            <ul className={styles.timeList}>
              <li>Segunda a Sexta: 12h às 18h</li>
            </ul>
          </div>

        </div>
      </div>

      {/* BARRA INFERIOR: COPYRIGHT */}
      <div className={styles.footerBottom}>
        <div className={styles.containerBottom}>
          <p>© 2026 Secretaria Municipal de Saúde. Todos os direitos reservados.</p>
          <p className={styles.prefeituraText}>Portal oficial da Secretaria Municipal de Saúde de Muriaé</p>
        </div>
      </div>
    </footer>
  );
}