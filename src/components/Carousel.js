"use client";

import React, { useState } from 'react';
import { useKeenSlider } from 'keen-slider/react'; // Slider para React
import 'keen-slider/keen-slider.min.css'; // Estilos obrigatórios padrão do Keen Slider
import styles from './Carousel.module.css'; 
import Image from 'next/image'; 

export default function Carousel() {
    const [loaded, setLoaded] = useState(false);

    const slidesData = [
        {
            id: 1,
            imgDesktop: "/img/carousel/1.png",
            alt: "Campanha Julho Amarelo - Julho é o mês de combater o silêncio das hepatites virais"
        },
        {
            id: 2,
            imgDesktop: "/img/carousel/2.png",
            alt: "Vacina contra a gripe, vacinas liberadas para toda população"
        },
        {
            id: 3,
            imgDesktop: "/img/carousel/3.png",
            alt: "Saúde Digital Muriaé aplicativo. O aplicativo da Secretaria de Saúde de Muriaé, feito para você"
        },
        {
            id: 4,
            imgDesktop: "/img/carousel/4.png",
            alt: "Seu coração dá sinais. Aprenda a reconhecê-los! Falta de ar, inchaço nas pernas ou pés, cansaço excessivo"
        }
    ];

    /* ==========================================================================
       PLUGIN DE AUTOPLAY (DESLIZAMENTO AUTOMÁTICO COM PAUSA NO HOVER)
       ========================================================================== */
    const [sliderRef, instanceRef] = useKeenSlider(
        {
            initial: 0,
            loop: true,
            created() {
                setLoaded(true);
            },
        },
        [
            (slider) => {
                let timeout;
                let mouseOver = false;

                function clearNextTimeout() {
                    clearTimeout(timeout);
                }

                function nextTimeout() {
                    clearTimeout(timeout);
                    if (mouseOver) return; // Se o mouse estiver por cima, interrompe a transição
                    timeout = setTimeout(() => {
                        slider.next();
                    }, 4000); // TEMPO EM MILISSEGUNDOS (4000ms = 4 segundos)
                }

                slider.on("created", () => {
                    slider.container.addEventListener("mouseover", () => {
                        mouseOver = true;
                        clearNextTimeout();
                    });
                    slider.container.addEventListener("mouseout", () => {
                        mouseOver = false;
                        nextTimeout();
                    });
                    nextTimeout();
                });
                slider.on("dragStarted", clearNextTimeout);
                slider.on("animationEnded", nextTimeout);
                slider.on("updated", nextTimeout);
            },
        ]
    );

    const handlePrev = (e) => {
        e.stopPropagation();
        if (instanceRef.current) instanceRef.current.prev();
    };

    const handleNext = (e) => {
        e.stopPropagation(); 
        if (instanceRef.current) instanceRef.current.next();
    };

    return (
        <section className={styles.carouselSection}>
            <div className={styles.container}>                
                {/* CABEÇALHO DO BLOCO */}
                <div className={styles.headerArea}>
                    <span className={styles.subtitle}>DESTAQUES</span>
                    <h2 className={styles.title}>Campanhas e iniciativas</h2>
                </div>

                {/* CONTAINER DO CARROSSEL */}
                <div className={styles.carouselWrapper}>
                    <div ref={sliderRef} className="keen-slider">
                        {slidesData.map((slide) => (
                            <div key={slide.id} className={`keen-slider__slide ${styles.slide}`}>                                
                                <Image 
                                    src={slide.imgDesktop} 
                                    alt={slide.alt} 
                                    width={1920} 
                                    height={555} 
                                    priority={slide.id === 1} 
                                    className={styles.bannerImg} 
                                />
                            </div>
                        ))}
                    </div>

                    {/* SETAS DE NAVEGAÇÃO */}
                    {loaded && (
                        <>
                            <button
                                className={`${styles.arrow} ${styles.arrowLeft}`}
                                onClick={handlePrev}
                                aria-label="Slide anterior"
                            >
                                ←
                            </button>

                            <button
                                className={`${styles.arrow} ${styles.arrowRight}`}
                                onClick={handleNext} 
                                aria-label="Próximo slide" 
                            >
                                →
                            </button>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}