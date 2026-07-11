import React, { useState } from 'react';
import styles from './Header.modules.css';
import Image from 'next/image';

const logoSecretaria = '/img/logo-secretaria.png';

export default function Header() {
    const [menuAberto, setMenuAberto] = useState(false);
    const toggleMenu = () => {
        setMenuAberto(!menuAberto);
    };

    return (
        <header className={styles.header}>
            {/* BARRA SUPERIOR */}
            <div className={styles.topBar}>
                <div className={`${styles.container} ${styles.topBarContainer}`}>
                    <div className={styles.topBarLeft}>
                        <span>(32)3696-3305</span>
                        <span>Av. Maestro Sansão</span>
                    </div>
                    <div className={styles.topBarRight}>
                        <a href="#ouvidoria">Ouvidoria</a>
                        <span className={styles.divider}>|</span>
                        <a href="#transparecia">Transparência</a>
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
                                src={logoSecretariaPath} 
                                alt="Logo Secretaria de Saúde do Município" 
                                width={45}  
                                height={45} 
                                className={styles.iconLogo} 
                                quality={85}
                            />
                        </div>
                        <div className={styles.brandText}>
                            <span className={styles.subTitle}>Prefeitura Municipal</span>
                            <h1 className={styles.mainTitle}>Secretaria de Saúde</h1>
                        </div>
                    </div>

                    {/* BOTÃO HAMBURGUER */}
                    <button className={styles.hamburger} onClick={toggleMenu} aria-label="Abrir menu">
                        <span className={`${styles.bar} ${menuAberto ? styles.transform : ""}`}></span>
                        <span className={`${styles.bar} ${menuAberto ? styles.transform : ""}`}></span>
                        <span className={`${styles.bar} ${menuAberto ? styles.transform : ""}`}></span>
                    </button>

                    {/*LINKS DE NAVEGAÇÃO*/}
                    <nav className={`${styles.navMenu} ${menuAberto ? styles.active : ""}`}>
                        <a href="#inicio" className={styles.navItem}>Início</a>
                        <a href="#secretaria" className={styles.navItem}>A Secretaria</a>
                        <a href="#servicos" className={styles.navItem}>Serviços</a>
                        <a href="#noticias" className={`${styles.navItem} ${styles.activeLink}`}>Notícias</a>
                        <a href="#eventos" className={styles.navItem}>Eventos</a>
                        <a href="#contato" className={styles.navItem}>Contato</a>
                    </nav>
                </div>
            </div>
        </header>    
    )
}