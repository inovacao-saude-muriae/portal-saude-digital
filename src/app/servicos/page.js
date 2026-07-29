"use client";

import React from 'react';
import Link from 'next/link';
import { Stethoscope, Syringe, Baby, HeartPulse, Pill, Truck } from 'lucide-react';
import styles from './ServicesPage.module.css';

export default function ServicesPage() {
    const servicos = [
        {
        id: "aplicativos",
        icon: <Stethoscope size={22} />,
        title: "Aplicativo",
        desc: "Consultas médicas, exames de rotina, curativos, pré-natal e acompanhamento de saúde da família nas UBS."
        },
        {
        id: "atendimento-domiciliar",
        icon: <Stethoscope size={22} />,
        title: "Atendimento Domiciliar",
        desc: "Consultas médicas, exames de rotina, curativos, pré-natal e acompanhamento de saúde da família nas UBS."
        },
        {
        id: "camara-tecnica",
        icon: <Syringe size={22} />,
        title: "Câmara Técnica",
        desc: "Aplicação de vacinas do calendário nacional, campanhas sazonais e imunização de grupos prioritários."
        },
        {
        id: "doacao-de-sangue",
        icon: <Pill size={22} />,
        title: "Doação de Sangue",
        desc: "Dispensação gratuita de medicamentos essenciais e do componente especializado."
        },
        {
        id: "farmacia-municipal",
        icon: <Baby size={22} />,
        title: "Farmácia Municipal",
        desc: "Puericultura, triagem neonatal (teste do pezinho, orelhinha, olhinho) e acompanhamento do desenvolvimento infantil."
        },
        
        {
        id: "laboratorio-municipal",
        icon: <HeartPulse size={22} />,
        title: "Labortório Municipal",
        desc: "Acompanhamento de hipertensão, diabetes, saúde cardiovascular e programas de prevenção."
        },        
        {
        id: "vacina",
        icon: <Truck size={22} />,
        title: "Vacina",
        desc: "SAMU 192, UPA 24 horas e atendimento pré-hospitalar em toda a cidade."
        },
        {
        id: "vigilancia-sanitaria",
        icon: <Truck size={22} />,
        title: "Vigilância Sanitária",
        desc: "Orientar e fiscalizar estabelecimentos e serviços de saúde ou de interesse à saúde."
        }
    ];

    return (
        <div className={styles.pageWrapper}>
        
            {/* 1. BANNER DE TOPO COM IMAGEM DE FUNDO */}
            <section className={styles.heroBanner}
                style={{ 
                    backgroundImage: "url('/img/banner-paginas.png')" 
                }} >
                <div className={styles.overlay}>
                    <div className={styles.container}>
                        <span className={styles.heroSubtitle}>INSTITUCIONAL</span>
                        <h1 className={styles.heroTitle}>Nossos Serviços</h1>
                        <p className={styles.heroDesc}>
                        Uma rede completa de cuidado, gratuita e acessível a todos os moradores do município.
                        </p>
                    </div>
                </div>
            </section>

            {/* 2. CONTEÚDO CENTRAL */}
            <section className={styles.contentSection}>
                <div className={styles.container}>                
                    <div className={styles.introBlock}>
                        <p>
                            A Secretaria Municipal de Saúde oferece um amplo conjunto de serviços organizados em 
                            diferentes níveis de atenção, com o objetivo de garantir atendimento integral em todas as 
                            etapas da vida do cidadão.
                        </p>
                    </div>

                    {/* GRELHA DE CARTÕES */}
                    <div className={styles.servicesGrid}>
                        {servicos.map((item) => (
                            <div key={item.id} className={styles.serviceCard}>
                                <div className={styles.iconBox}>
                                    {item.icon}
                                </div>
                                <h2 className={styles.cardTitle}>{item.title}</h2>
                                <p className={styles.cardDesc}>{item.desc}</p>
                                <Link href={`/servicos/${item.id}`} className={styles.cardLink}>
                                Saiba mais <span>→</span>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}