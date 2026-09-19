'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Clock } from 'lucide-react';
import { getDbEventos, getStatusEvento } from '@/data/eventosData';
import Loading from '@/components/Loading';
import styles from './EventSection.module.css';

const MESES = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];

// FUNÇÃO PARA SANITIZAR STRINGS VINDAS DO GOOGLE SHEETS COM "Sat Dec 30 1899..."
function limparFormatoTexto(valor) {
  if (!valor) return '';
  const str = String(valor).trim();
  
  if (str.includes('1899') || str.includes('GMT') || str.includes('Sat Dec')) {
    const matchHora = str.match(/\d{2}:\d{2}/);
    if (matchHora) {
      return matchHora[0];
    }
    return '';
  }

  return str;
}

function extrairDiaEMes(dataBruta) {
  if (!dataBruta) return { dia: '01', mes: 'JAN' };

  try {
    const dataLimpa = limparFormatoTexto(dataBruta);
    const dataString = String(dataLimpa).split('T')[0].trim();

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

    const d = new Date(dataLimpa);
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

// CONVERTE FORMATOS DD/MM/YYYY OU YYYY-MM-DD EM TIMESTAMP PARA ORDENAÇÃO
function converterParaTimestamp(dataBruta) {
  if (!dataBruta) return 0;
  const str = String(dataBruta).trim().split('T')[0];

  if (/^\d{2}\/\d{2}\/\d{4}/.test(str)) {
    const [dia, mes, ano] = str.split('/');
    return new Date(parseInt(ano, 10), parseInt(mes, 10) - 1, parseInt(dia, 10)).getTime();
  }

  if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
    const [ano, mes, dia] = str.split('-');
    return new Date(parseInt(ano, 10), parseInt(mes, 10) - 1, parseInt(dia, 10)).getTime();
  }

  const d = new Date(str);
  return !isNaN(d.getTime()) ? d.getTime() : 0;
}

export default function EventSection() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let montado = true;

    async function carregarEventos() {
      // 1. Cache local (exibição imediata enquanto busca do banco)
      try {
        const cache = localStorage.getItem('cache_portal_eventos');
        if (cache) {
          const eventosCache = JSON.parse(cache);
          if (Array.isArray(eventosCache) && eventosCache.length > 0 && montado) {
            setEventos(eventosCache);
          }
        }
      } catch (err) {
        console.warn('Erro ao ler cache local de eventos:', err);
      }

      // 2. Busca do Supabase
      try {
        const eventosSupabase = await getDbEventos();
        if (montado && Array.isArray(eventosSupabase) && eventosSupabase.length > 0) {
          setEventos(eventosSupabase);
          localStorage.setItem('cache_portal_eventos', JSON.stringify(eventosSupabase));
        }
      } catch (err) {
        console.warn('Erro ao carregar eventos do Supabase:', err);
      } finally {
        if (montado) setLoading(false);
      }
    }

    carregarEventos();

    return () => {
      montado = false;
    };
  }, []);

  // ORDENAÇÃO DO MAIS RECENTE PARA O MAIS ANTIGO
  const eventosOrdenados = [...eventos].sort((a, b) => {
    const timeA = converterParaTimestamp(a.data);
    const timeB = converterParaTimestamp(b.data);
    return timeB - timeA;
  });

  const ultimosEventos = eventosOrdenados.slice(0, 3);

  return (
    <section className={styles.eventsSection}>
      <div className={styles.container}>
        
        {/* CABEÇALHO */}
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
        {loading && ultimosEventos.length === 0 ? (
          <Loading texto="Carregando eventos..." />
        ) : (
        <div className={styles.eventsGrid}>
          {ultimosEventos.map((evento) => {
            const { dia, mes } = extrairDiaEMes(evento.data);
            const status = getStatusEvento(evento, styles);
            
            const eventoIdFinal = String(evento.id || '').trim();

            // SANITIZA AS STRINGS DE HORA
            const horaExibicao = limparFormatoTexto(evento.hora);
            const horaInicioLimpa = limparFormatoTexto(evento.horaInicio);
            const horaFimLimpa = limparFormatoTexto(evento.horaFim);

            const textoHoraFinal = horaExibicao 
              ? horaExibicao 
              : (horaInicioLimpa ? `${horaInicioLimpa}h${horaFimLimpa ? ` às ${horaFimLimpa}h` : ''}` : 'Consulte a programação');

            return (
              <Link 
                key={eventoIdFinal || evento.titulo} 
                href={`/eventos/${eventoIdFinal}`}
                className={styles.eventCard}
              >
                {/* LINHA SUPERIOR: DATA + STATUS */}
                <div className={styles.cardTopRow}>
                  <div className={styles.dateBox}>
                    <span className={styles.dayNumber}>{dia}</span>
                    <span className={styles.monthText}>{mes}</span>
                  </div>
                  {status.label && (
                    <span className={`${styles.statusBadge} ${status.class}`}>
                      {status.label}
                    </span>
                  )}
                </div>

                {/* CONTEÚDO */}
                <div className={styles.eventContent}>
                  <h3 className={styles.eventTitle}>{evento.titulo}</h3>

                  <div className={styles.metaList}>
                    {evento.local && (
                      <div className={styles.metaRow}>
                        <MapPin size={14} className={styles.icon} />
                        <span>{evento.local}</span>
                      </div>
                    )}

                    <div className={styles.metaRow}>
                      <Clock size={14} className={styles.icon} />
                      <span>{textoHoraFinal}</span>
                    </div>
                  </div>

                  <span className={styles.verMaisLink}>Ver mais →</span>
                </div>
              </Link>
            );
          })}
        </div>
        )}

      </div>
    </section>
  );
}