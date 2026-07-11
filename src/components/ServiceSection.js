"use client";

import React from 'react';
import Link from 'next/link';
import styles from './ServiceSection.module.css';
// Importação dos ícones correspondentes da biblioteca Lucide
import { Stethoscope, Syringe, Baby, HeartPulse, Pill, Ambulance } from 'lucide-react';

export default function ServiceSection() {
    // Array com os dados dos serviços para deixar o código limpo e escalável
    const servicos = [
        {
            id: 1,
            title: "Atendimento Domiciliar",
            description: "Consultas, exames e acompanhamento nas UBS.",
            icon: <Stethoscope size={22} className={styles.icon} />,
            link: "/servicos/atencao-basica"
        },
        {
            id: 2,
            title: "Camara técnica",
            description: "Calendário nacional e campanhas sazonais.",
            icon: <Syringe size={22} className={styles.icon} />,
            link: "/servicos/vacinacao"
        },
        {
            id: 3,
            title: "Vacinação",
            description: "Puericultura, triagem neonatal e vacinas.",
            icon: <Baby size={22} className={styles.icon} />,
            link: "/servicos/saude-da-crianca"
        },
        {
            id: 4,
            title: "Farmácia Municipal",
            description: "Dispensação gratuita de medicamentos.",
            icon: <Pill size={22} className={styles.icon} />,
            link: "/servicos/farmacia-popular"
        },
        {
            id: 5,
            title: "Transparência",
            description: "Hipertensão, diabetes e saúde mental.",
            icon: <HeartPulse size={22} className={styles.icon} />,
            link: "/servicos/programas-cronicos"
        },
        {
            id: 6,
            title: "Fluxos assistênciais",
            description: "Atendimento móvel de urgência 24h.",
            icon: <Ambulance size={22} className={styles.icon} />,
            link: "/servicos/samu"
        }
    ];

    return (
        <section className={styles.servicesSection}>
            <div className={styles.container}>
                
                {/* CABEÇALHO DA SEÇÃO */}
                <div className={styles.headerArea}>
                    <div className={styles.titleWrapper}>
                        <span className={styles.subtitle}>SERVIÇOS</span>
                        <h2 className={styles.title}>O que oferecemos ao cidadão</h2>
                    </div>
                    <Link href="/servicos" className={styles.viewAllLink}>
                        Ver todos <span>→</span>
                    </Link>
                </div>

                {/* GRID DE CARDS */}
                <div className={styles.grid}>
                    {servicos.map((servico) => (
                        <Link href={servico.link} key={servico.id} className={styles.card}>
                            <div className={styles.iconBox}>
                                {servico.icon}
                            </div>
                            <h3 className={styles.cardTitle}>{servico.title}</h3>
                            <p className={styles.cardDescription}>{servico.description}</p>
                        </Link>
                    ))}
                </div>

            </div>
        </section>
    );
}