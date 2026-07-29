'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Clock } from 'lucide-react';
// Importa o array de eventos real cadastrado na sua página de eventos
import { dbEventos } from '@/data/eventosData';
import styles from './EventSection.module.css';

// Nomes dos meses resumidos para exibição no bloco azul
const MESES = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];

export default function EventSection() {
  // 1. Ordena os eventos da data mais recente (mais nova) para a mais antiga
  const eventosOrdenados = [...dbEventos].sort((a, b) => {
    return new Date(b.data) - new Date(a.data);
  });

  // 2. Pega os 3 eventos mais recentes para exibir na Home
  const ultimosEventos = eventosOrdenados.slice(0, 3);

  return (
    <section className={styles.eventsSection}>
      <div className={styles.container}>
        
        {/* CABEÇALHO DA SEÇÃO */}
        <div className={styles.headerArea}>
          <div className={styles.titleBlock}>
            <span className={styles.subtitle}>AGENDA</span>
            <h2 className={styles.title}>Próximos eventos</h2>
          </div>
          <Link href="/eventos" className={styles.seeAllLink}>
            Ver agenda completa <span>→</span>
          </Link>
        </div>

        {/* GRELHA DE EVENTOS */}
        <div className={styles.eventsGrid}>
          {ultimosEventos.map((evento) => {
            // Extrai o dia e o mês diretamente da string YYYY-MM-DD
            const [ano, mesStr, diaStr] = evento.data.split('-');
            const mesIndex = parseInt(mesStr, 10) - 1;
            const mesNome = MESES[mesIndex] || "JUN";

            return (
              <div key={evento.id} className={styles.eventCard}>
                
                {/* BLOCO DA DATA (AZUL) */}
                <div className={styles.dateBox}>
                  <span className={styles.dayNumber}>{diaStr}</span>
                  <span className={styles.monthText}>{mesNome}</span>
                </div>

                {/* CONTEÚDO DE TEXTO */}
                <div className={styles.eventContent}>
                  <h3 className={styles.eventTitle}>{evento.titulo}</h3>
                  
                  {evento.local && (
                    <div className={styles.metaRow}>
                      <MapPin size={14} className={styles.icon} />
                      <span>{evento.local}</span>
                    </div>
                  )}
                  
                  <div className={styles.metaRow}>
                    <Clock size={14} className={styles.icon} />
                    <span>{evento.horaInicio ? `${evento.horaInicio}h` : 'Consulte a programação'}</span>
                  </div>

                  <Link href={`/eventos/${evento.id}`} style={{ marginTop: '10px', display: 'inline-block', fontSize: '13px', color: '#008a83', fontWeight: '700', textDecoration: 'none' }}>
                    Ver mais →
                  </Link>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}