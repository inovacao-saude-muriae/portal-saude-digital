'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Clock } from 'lucide-react';
// Importa o array de eventos e a função de status do arquivo centralizado
import { dbEventos, getStatusEvento } from '@/data/eventosData';
import styles from './EventSection.module.css';

// Nomes dos meses resumidos para exibição no bloco do card
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
            <span className={styles.subtitle}>AGENDA DA SAÚDE</span>
            <h2 className={styles.title}>Próximos eventos</h2>
          </div>
          <Link href="/eventos" className={styles.seeAllLink}>
            Ver agenda completa <span>→</span>
          </Link>
        </div>

        {/* GRELHA DE EVENTOS */}
        <div className={styles.eventsGrid}>
          {ultimosEventos.map((evento) => {
            // Extrai o dia e o mês diretamente da string YYYY-MM-DD para evitar problemas de fuso horário
            const [ano, mesStr, diaStr] = evento.data.split('-');
            const mesIndex = parseInt(mesStr, 10) - 1;
            const mesNome = MESES[mesIndex] || "JAN";

            // Calcula o status dinâmico do evento (Inscrições, Em Andamento ou Encerrado)
            const status = getStatusEvento(evento, styles);

            return (
              <div key={evento.id} className={styles.eventCard}>
                
                {/* BLOCO DA DATA (AZUL) */}
                <div className={styles.dateBox}>
                  <span className={styles.dayNumber}>{diaStr}</span>
                  <span className={styles.monthText}>{mesNome}</span>
                </div>

                {/* CONTEÚDO DE TEXTO */}
                <div className={styles.eventContent}>
                  <div className={styles.cardHeaderRow}>
                    <h3 className={styles.eventTitle}>{evento.titulo}</h3>
                    {status.label && (
                      <span className={`${styles.statusBadge} ${status.class}`}>
                        {status.label}
                      </span>
                    )}
                  </div>
                  
                  {evento.local && (
                    <div className={styles.metaRow}>
                      <MapPin size={14} className={styles.icon} />
                      <span>{evento.local}</span>
                    </div>
                  )}
                  
                  <div className={styles.metaRow}>
                    <Clock size={14} className={styles.icon} />
                    <span>
                      {evento.horaInicio 
                        ? `${evento.horaInicio}h${evento.horaFim ? ` às ${evento.horaFim}h` : ''}` 
                        : 'Consulte a programação'}
                    </span>
                  </div>

                  <Link 
                    href={`/eventos/${evento.id}`} 
                    style={{ 
                      marginTop: '12px', 
                      display: 'inline-block', 
                      fontSize: '13px', 
                      color: '#008a83', 
                      fontWeight: '700', 
                      textDecoration: 'none' 
                    }}
                  >
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