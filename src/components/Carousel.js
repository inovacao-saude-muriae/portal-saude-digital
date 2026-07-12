"use client"; 

import React, { useState } from 'react';
import { useKeenSlider } from 'keen-slider/react'; // Slider para React
import 'keen-slider/keen-slider.min.css'; // Estilos obrigatórios padrão do Keen Slider
import styles from './Carousel.module.css'; 
import Image from 'next/image'; 

export default function Carousel() {
    // Estado para controlar se o carrossel foi totalmente inicializado e montado no DOM.
    // Isso evita que as setas de navegação apareçam antes do carrossel estar pronto.
    const [loaded, setLoaded] = useState(false);

    // Array de objetos contendo os dados estáticos que alimentam os slides.
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
            alt: "Seu coração da sinais. Aprenda a reconhece-los! Falta de ar, inchaço nas pernas ou pés, cansaço execessivo"
        }
    ];

    /* Inicialização do Slider:
        - sliderRef: Deve ser passado como 'ref' na div principal que envelopa os slides.
        - instanceRef: Guarda a referência da instância criada, permitindo controlar o carrossel programaticamente.
    */
    const [sliderRef, instanceRef] = useKeenSlider({
        initial: 0, // Define que o carrossel sempre começará no primeiro slide (índice 0)
        loop: true, // Ativa o efeito de loop
        created() {
            // Função de callback disparada automaticamente pelo Keen Slider assim que ele termina de ser criado/montado.
            setLoaded(true); // Atualiza o estado para 'true', permitindo a renderização das setas
        },
    });

    /*
    VOLTAR SLIDE 
    */
    const handlePrev = (e) => {
        e.stopPropagation();
        if (instanceRef.current) instanceRef.current.prev();
    };
    /*
    AVANÇAR SLIDE
    */
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
                    {/* A div abaixo recebe a 'sliderRef' para que o Keen Slider tome o controle dela, e a classe obrigatória 'keen-slider' */}
                    <div ref={sliderRef} className="keen-slider">
                        {/* Mapeia o array de dados para renderizar dinamicamente cada slide */}
                        {slidesData.map((slide) => (
                            // Cada slide individual PRECISA obrigatoriamente da classe 'keen-slider__slide'
                            <div key={slide.id} className={`keen-slider__slide ${styles.slide}`}>                                
                                <Image 
                                    src={slide.imgDesktop} 
                                    alt={slide.alt} 
                                    width={1920} 
                                    height={555} 
                                    /* O 'priority' abaixo é um booleano. Se for o primeiro slide (id === 1), 
                                        o Next.js vai carregar essa imagem com prioridade máxima (LCP), 
                                        melhorando a performance percebida pelo usuário.
                                    */
                                    priority={slide.id === 1} 
                                    className={styles.bannerImg} 
                                />
                            </div>
                        ))}
                    </div>

                    {/* SETAS DE NAVEGAÇÃO: Só serão renderizadas se o estado 'loaded' for verdadeiro (carrossel pronto) */}
                    {loaded && (
                        <>
                        {/* Botão para voltar */}
                        <button
                            className={`${styles.arrow} ${styles.arrowLeft}`}
                            onClick={handlePrev} // Dispara a função handlePrev ao clicar
                            aria-label="Slide anterior" // Tag de acessibilidade para leitores de tela
                        >
                            ←
                        </button>

                        {/* Botão para avançar */}
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