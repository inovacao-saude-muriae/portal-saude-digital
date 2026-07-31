'use client';

import React from 'react';
import Link from 'next/link';
import styles from './ServiceSection.module.css';
import { 
  Home, 
  ClipboardList, 
  Pill, 
  Ambulance, 
  Syringe, 
  ChartNoAxesCombined 
} from 'lucide-react';

export default function ServiceSection() {
    const servicos = [
        {
            id: 1,
            title: "Atendimento Domiciliar",
            description: "Consultas, exames e acompanhamento no conforto do lar.",
            icon: <Home size={22} className={styles.icon} />,
            link: "/servicos/atendimento-domiciliar"
        },
        {
            id: 2,
            title: "Câmara Técnica",
            description: "Análises, protocolos médicos e diretrizes de saúde.",
            icon: <ClipboardList size={22} className={styles.icon} />,
            link: "/servicos/camara-tecnica"
        },
        {
            id: 3,
            title: "Farmácia Municipal",
            description: "Dispensação gratuita de medicamentos.",
            icon: <Pill size={22} className={styles.icon} />,
            link: "/servicos/farmacia-municipal"
        },
        {
            id: 4,
            title: "Fluxos Assistenciais",
            description: "Diretrizes, itinerários terapêuticos e pactuações.",
            icon: <Ambulance size={22} className={styles.icon} />,
            link: "/servicos/fluxos-assistenciais"
        },
        {
            id: 5,
            title: "Vacinação",
            description: "Calendário nacional, triagem e campanhas sazonais.",
            icon: <Syringe size={22} className={styles.icon} />,
            link: "/servicos/vacina"
        },
        {
            id: 6,
            title: "Transparência",
            description: "Prestação de contas, relatórios e dados da saúde.",
            icon: <ChartNoAxesCombined size={22} className={styles.icon} />,
            link: "/transparencia"
        }
    ];

    return (
        <section className={styles.servicesSection}>
            <div className={styles.container}>
                <div className={styles.headerArea}>
                    <div className={styles.titleWrapper}>
                        <span className={styles.subtitle}>SERVIÇOS</span>
                        <h2 className={styles.title}>O que oferecemos ao cidadão</h2>
                    </div>
                    <Link href="/servicos" className={styles.viewAllLink}>
                        Ver todos <span>→</span>
                    </Link>
                </div>

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