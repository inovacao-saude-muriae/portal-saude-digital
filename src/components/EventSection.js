'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Clock } from 'lucide-react';
import { dbEventos as dbEventosLocal, getStatusEvento } from '@/data/eventosData';
import styles from './EventSection.module.css';

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx1tWcH_pkyhUNdR1safUWAGrlNfJWSMRqSps09p7yc5lBXO2c5iEGJXQl5Sz2bmPex/exec';

const MESES = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];

// FUNÇÃO SEGURA PARA EXTRAIR DIA E MÊS SEM DAR INVALID DATE
function extrairDiaEMes(dataBruta) {
  if (!dataBruta) return { dia: '01', mes: 'JAN' };

  try {
    const dataString = String(dataBruta).split('T')[0].trim();

    // Caso 1: Formato YYYY-MM-DD (ex: 2026-08-15)
    if (dataString.includes('-')) {
      const partes = dataString.split('-');
      if (partes.length === 3) {
        const [ano, mes, dia] = partes;
        const mesIndex = parseInt(mes, 10) - 1;
        return {
          dia: dia.padStart(2, '0'),
          mes: MESES[mesIndex] || 'JAN'
        };
      }
    }

    // Caso 2: Formato DD/MM/YYYY (ex: 15/08/2026)
    if (dataString.includes('/')) {
      const partes = dataString.split('/');
      if (partes.length === 3) {
        const [dia, mes] = partes;
        const mesIndex = parseInt(mes, 10) - 1;
        return {
          dia: dia.padStart(2, '0'),
          mes: MESES[mesIndex] || 'JAN'
        };
      }
    }

    // Caso 3: Fallback usando new Date()
    const d = new Date(dataBruta);
    if (!isNaN(d.getTime())) {
      return {
        dia: String(d.getUTCDate()).padStart(2, '0'),
        mes: MESES[d.getUTCMonth()] || 'JAN'
      };
    }
  } catch (err) {
    console.error('Erro ao extrair dia/mês:', err);
  }

  return { dia: '01', mes: 'JAN' };
}

export default function EventSection() {
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    async function carregarEventos() {
      try {
        const response = await fetch(`${SCRIPT_URL}?target=EVENT&action=GET_ALL`);
        const resData = await response.json();

        if (resData.status === 'success' && Array.isArray(resData.eventos) && resData.eventos.length > 0) {
          const idsOnline = new Set(resData.eventos.map(e => String(e.id)));
          const locaisFiltrados = dbEventosLocal.filter(e => !idsOnline.has(String(e.id)));
          setEventos([...resData.eventos, ...locaisFiltrados]);
        } else {
          setEventos(dbEventosLocal);
        }
      } catch (err) {
        console.error('Erro ao buscar eventos para a home, usando locais:', err);
        setEventos(dbEventosLocal);
      }
    }

    carregarEventos();
  }, []);

  // Ordena os eventos do mais recente para o mais antigo
  const eventosOrdenados = [...eventos].sort((a, b) => {
    const dataA = new Date(a.data || '2026-01-01').getTime();
    const dataB = new Date(b.data || '2026-01-01').getTime();
    return dataB - dataA;
  });

  // Pega os 3 mais recentes para exibir na Home
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
            const { dia, mes } = extrairDiaEMes(evento.data);
            const status = getStatusEvento(evento, styles);

            return (
              <Link 
                key={evento.id} 
                href={`/eventos/${evento.id}`}
                className={styles.eventCard}
              >
                
                {/* BLOCO DA DATA (AZUL) */}
                <div className={styles.dateBox}>
                  <span className={styles.dayNumber}>{dia}</span>
                  <span className={styles.monthText}>{mes}</span>
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
                      {evento.hora 
                        ? evento.hora 
                        : (evento.horaInicio ? `${evento.horaInicio}h${evento.horaFim ? ` às ${evento.horaFim}h` : ''}` : 'Consulte a programação')}
                    </span>
                  </div>

                  <span 
                    style={{ 
                      marginTop: '12px', 
                      display: 'inline-block', 
                      fontSize: '13px', 
                      color: '#008a83', 
                      fontWeight: '700' 
                    }}
                  >
                    Ver mais →
                  </span>
                </div>

              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}