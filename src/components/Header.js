'use client';

import React, { useState } from 'react';
import styles from './Header.module.css'; 
import Image from 'next/image';
import Link from 'next/link'; 
import { usePathname } from 'next/navigation';
import { Lock } from 'lucide-react';

const logoSecretaria = '/img/logo-Prefeitura.png'; 

export default function Header() {
    const [menuAberto, setMenuAberto] = useState(false);
    const pathname = usePathname(); 

    const toggleMenu = () => {
        setMenuAberto(!menuAberto);
    };

    // Fecha o menu ao clicar em qualquer link
    const fecharMenu = () => {
        setMenuAberto(false);
    };

    // Ativo para o menu principal
    const isActive = (path) => {
        return pathname === path ? styles.activeLink : "";
    };

    // Ativo exclusivo para a barra superior
    const isTopBarActive = (path) => {
        return pathname === path ? styles.topBarActiveLink : "";
    };

    return (
        <header className={styles.header}>
            {/* BARRA SUPERIOR (DESKTOP) */}
            <div className={styles.topBar}>
                <div className={`${styles.container} ${styles.topBarContainer}`}>
                    <div className={styles.topBarLeft}>
                        <span>📞 (32) 3696-3305</span>
                        <span>📍 Av. Maestro Sansão</span>
                    </div>
                    <div className={styles.topBarRight}>
                        <Link href="/ouvidoria" className={isTopBarActive('/ouvidoria')}>
                            Ouvidoria
                        </Link>
                        <span className={styles.divider}>|</span> 
                        <Link href="/servicos/transparencia" className={isTopBarActive('/servicos/transparencia')}>
                            Transparência
                        </Link>
                        <span className={styles.divider}>|</span> 
                        <Link href="/admin/login" className={`${isTopBarActive('/admin/login')} ${styles.areaRestritaBtn}`}>
                            <Lock size={12} style={{ marginRight: '4px' }} />
                            Área Restrita
                        </Link>
                    </div>
                </div>
            </div>

            {/* MENU PRINCIPAL */}
            <div className={styles.mainHeader}>
                <div className={`${styles.container} ${styles.mainHeaderContainer}`}>
                    {/* LOGO E TÍTULOS */}
                    <div className={styles.brand}>
                        <div className={styles.logoBox}>
                            <Image 
                                src={logoSecretaria} 
                                alt="Logo Secretaria de Saúde do Município" 
                                width={45}  
                                height={45} 
                                className={styles.iconLogo} 
                            />
                        </div>
                        <div className={styles.brandText}>
                            <span className={styles.subTitle}>Prefeitura Municipal de Muriaé</span>
                            <h1 className={styles.mainTitle}>Secretaria de Saúde</h1>
                        </div>
                    </div>

                    {/* BOTÃO HAMBÚRGUER */}
                    <button className={styles.hamburger} onClick={toggleMenu} aria-label="Abrir menu">
                        <span className={`${styles.bar} ${menuAberto ? styles.transform : ""}`}></span>
                        <span className={`${styles.bar} ${menuAberto ? styles.transform : ""}`}></span>
                        <span className={`${styles.bar} ${menuAberto ? styles.transform : ""}`}></span>
                    </button>

                    {/* LINKS DE NAVEGAÇÃO */}
                    <nav className={`${styles.navMenu} ${menuAberto ? styles.active : ""}`}>
                        <Link href="/" onClick={fecharMenu} className={`${styles.navItem} ${isActive('/')}`}>Início</Link>
                        <Link href="/secretaria" onClick={fecharMenu} className={`${styles.navItem} ${isActive('/secretaria')}`}>A Secretaria</Link>
                        <Link href="/servicos" onClick={fecharMenu} className={`${styles.navItem} ${isActive('/servicos')}`}>Serviços</Link>
                        <Link href="/noticias" onClick={fecharMenu} className={`${styles.navItem} ${isActive('/noticias')}`}>Notícias</Link>
                        <Link href="/eventos" onClick={fecharMenu} className={`${styles.navItem} ${isActive('/eventos')}`}>Eventos</Link>
                        <Link href="/contatos" onClick={fecharMenu} className={`${styles.navItem} ${isActive('/contatos')}`}>Contatos</Link>

                        {/* DIVISOR + LINKS DA BARRA SUPERIOR QUE APARECEM APENAS NO MENU HAMBÚRGUER */}
                        <div className={styles.mobileOnlyLinks}>
                            <div className={styles.mobileDivider}></div>
                            <Link href="/ouvidoria" onClick={fecharMenu} className={`${styles.navItem} ${isActive('/ouvidoria')}`}>
                                Ouvidoria
                            </Link>
                            <Link href="/transparencia" onClick={fecharMenu} className={`${styles.navItem} ${isActive('/transparencia')}`}>
                                Transparência
                            </Link>
                            <Link href="/admin/login" onClick={fecharMenu} className={`${styles.navItem} ${styles.mobileAreaRestrita} ${isActive('/admin/login')}`}>
                                <Lock size={14} style={{ marginRight: '6px' }} />
                                Área Restrita
                            </Link>
                        </div>
                    </nav>
                </div>
            </div>
        </header>    
    );
}