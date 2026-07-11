"use client";

import React, { useState } from 'react';
import styles from './Header.module.css'; 
import Image from 'next/image';
import Link from 'next/link'; // <-- 1. IMPORTA O LINK DO NEXT.JS PARA NAVEGAÇÃO INTERNA
import { usePathname } from 'next/navigation';

const logoSecretaria = '/img/logo-Prefeitura.png'; 

export default function Header() {
    const [menuAberto, setMenuAberto] = useState(false);
    const pathname = usePathname(); // Captura a página real atual
    const toggleMenu = () => {
        setMenuAberto(!menuAberto);
    };

    // Função que verifica se a rota do botão é a mesma da URL do navegador
    const isActive = (path) => {
        return pathname === path ? styles.activeLink : "";
    };

    return (
        <header className={styles.header}>
            {/* BARRA SUPERIOR */}
            <div className={styles.topBar}>
                <div className={`${styles.container} ${styles.topBarContainer}`}>
                    <div className={styles.topBarLeft}>
                        <span>📞 (32) 3696-3305</span>
                        <span>📍 Av. Maestro Sansão</span>
                    </div>
                    <div className={styles.topBarRight}>
                        <Link href="/ouvidoria" className={isActive('/ouvidoria')}>Ouvidoria</Link>
                        <span className={styles.divisor}>|</span> 
                        <Link href="/transparencia" className={isActive('/transparencia')}>Transparência</Link>
                    </div>
                </div>
            </div>

            {/* MENU PRINCIPAL */}
            <div className={styles.mainHeader}>
                <div className={`${styles.container} ${styles.mainHeaderContainer}`}>
                    {/* LOGO E TITULOS */}
                    <div className={styles.brand}>
                        <div className={styles.logoBox}>
                            <Image 
                                src={logoSecretaria} 
                                alt="Logo Secretaria de Saúde do Município" 
                                width={45}  
                                height={45} 
                                className={styles.iconLogo} 
                                quality={85}
                            />
                        </div>
                        <div className={styles.brandText}>
                            <span className={styles.subTitle}>Prefeitura Municipal de Muriaé</span>
                            <h1 className={styles.mainTitle}>Secretaria de Saúde</h1>
                        </div>
                    </div>

                    {/* BOTÃO HAMBURGUER */}
                    <button className={styles.hamburger} onClick={toggleMenu} aria-label="Abrir menu">
                        <span className={`${styles.bar} ${menuAberto ? styles.transform : ""}`}></span>
                        <span className={`${styles.bar} ${menuAberto ? styles.transform : ""}`}></span>
                        <span className={`${styles.bar} ${menuAberto ? styles.transform : ""}`}></span>
                    </button>

                    {/* LINKS DE NAVEGAÇÃO CORRIGIDOS */}
                    <nav className={`${styles.navMenu} ${menuAberto ? styles.active : ""}`}>
                        <Link href="/" className={`${styles.navItem} ${isActive('/')}`}>Início</Link>
                        <Link href="/secretaria" className={`${styles.navItem} ${isActive('/secretaria')}`}>A Secretaria</Link>
                        <Link href="/servicos" className={`${styles.navItem} ${isActive('/servicos')}`}>Serviços</Link>
                        <Link href="/noticias" className={`${styles.navItem} ${isActive('/noticias')}`}>Notícias</Link>
                        <Link href="/eventos" className={`${styles.navItem} ${isActive('/eventos')}`}>Eventos</Link>
                        <Link href="/contato" className={`${styles.navItem} ${isActive('/contato')}`}>Contato</Link>
                    </nav>
                </div>
            </div>
        </header>    
    );
}