"use client";

import React from 'react';
import Link from 'next/link';
import styles from './Hero.module.css';

export default function Hero() {
    return (
        <section className={styles.heroSection}>
            <div className={styles.container}>
                
                {/* LADO ESQUERDO: TEXTOS E BOTÕES */}
                <div className={styles.heroLeft}>
                    <div className={styles.tagCidadao}>
                        <span className={styles.dot}></span> Portal do Cidadão
                    </div>
                    
                    <h1 className={styles.title}>
                        Cuidando da saúde<br />da nossa cidade
                    </h1>
                    
                    <p className={styles.description}>
                        Acesse serviços, agende consultas, acompanhe campanhas e 
                        mantenha-se informado sobre a saúde do seu município.
                    </p>
                    
                    <div className={styles.buttonGroup}>
                        <Link href="/servicos" className={styles.btnPrimary}>
                            Nossos serviços <span>→</span>
                        </Link>
                        <Link href="/contatos" className={styles.btnSecondary}>
                            Fale conosco
                        </Link>
                    </div>
                </div>

                {/* LADO DIREITO: CARDS COM EFEITO DE VIDRO (GLASSMORPHISM) */}
                <div className={styles.heroRight}>
                    <div className={styles.glassGrid}>
                        <div className={styles.glassCard}>
                            <h2>42</h2>
                            <p>Unidades Básicas</p>
                        </div>
                        <div className={styles.glassCard}>
                            <h2>000</h2>
                            <p>Descrição</p>
                        </div>
                        <div className={styles.glassCard}>
                            <h2>000</h2>
                            <p>Descrição</p>
                        </div>
                        <div className={styles.glassCard}>
                            <h2>100%</h2>
                            <p>SUS gratuito</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}