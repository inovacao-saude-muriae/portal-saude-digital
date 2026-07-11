"use client";

import React from 'react';
import Link from 'next/link';
import { MapPin, Clock } from 'lucide-react';
import styles from './EventSection.module.css';

export default function EventSection() {
  // Dados mockados baseados perfeitamente no seu print
  const eventos = [
    {
      id: 1,
      day: "18",
      month: "JUL",
      title: "Dia D de Vacinação Infantil",
      location: "Praça Central",
      time: "08h – 17h"
    },
    {
      id: 2,
      day: "25",
      month: "JUL",
      title: "Mutirão de Saúde da Mulher",
      location: "Policlínica Municipal",
      time: "07h – 13h"
    },
    {
      id: 3,
      day: "02",
      month: "AGO",
      title: "Palestra: Prevenção ao Câncer de Pele",
      location: "Auditório da Secretaria",
      time: "19h"
    }
  ];

  return (
    <section className={styles.eventsSection}>
      <div className={styles.container}>
        
        {/* CABEÇALHO DA SEÇÃO */}
        <div className={styles.headerArea}>
          <div className={styles.titleBlock}>
            <span className={styles.subtitle}>AGENDA</span>
            <h2 className={styles.title}>Próximos eventos</h2>
          </div>
          <Link href="/agenda" className={styles.seeAllLink}>
            Ver agenda completa <span>→</span>
          </Link>
        </div>

        {/* GRELHA DE EVENTOS */}
        <div className={styles.eventsGrid}>
          {eventos.map((evento) => (
            <div key={evento.id} className={styles.eventCard}>
              
              {/* BLOCO DA DATA (AZUL) */}
              <div className={styles.dateBox}>
                <span className={styles.dayNumber}>{evento.day}</span>
                <span className={styles.monthText}>{evento.month}</span>
              </div>

              {/* CONTEÚDO DE TEXTO */}
              <div className={styles.eventContent}>
                <h3 className={styles.eventTitle}>{evento.title}</h3>
                
                <div className={styles.metaRow}>
                  <MapPin size={14} className={styles.icon} />
                  <span>{evento.location}</span>
                </div>
                
                <div className={styles.metaRow}>
                  <Clock size={14} className={styles.icon} />
                  <span>{evento.time}</span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}