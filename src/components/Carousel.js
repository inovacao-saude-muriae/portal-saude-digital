"use client";

import React, { useState } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css'; 
import styles from './Carousel.module.css';
import Image from 'next/image';

export default function Carousel() {
  const [loaded, setLoaded] = useState(false);

  const slidesData = [
    {
      id: 1,
      imgDesktop: "/img/carousel/1.png",
      alt: "Campanha Julho Amarelo - Secretaria de Saúde"
    },
    {
      id: 2,
      imgDesktop: "/img/carousel/campanha-2-desktop.webp",
      alt: "Campanha de Vacinação - Secretaria de Saúde"
    }
  ];

  const [sliderRef, instanceRef] = useKeenSlider({
    initial: 0,
    loop: true, 
    created() {
      setLoaded(true);
    },
  });

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
        
        {/* CABEÇALHO */}
        <div className={styles.headerArea}>
          <span className={styles.subtitle}>DESTAQUES</span>
          <h2 className={styles.title}>Campanhas e iniciativas</h2>
        </div>

        {/* CONTAINER DO CARROSSEL */}
        <div className={styles.carouselWrapper}>
          <div ref={sliderRef} className="keen-slider">
            {slidesData.map((slide) => (
              <div key={slide.id} className={`keen-slider__slide ${styles.slide}`}>
                {/* Fixamos a resolução da sua imagem original aqui. 
                  O CSS com 'width: 100%' e 'height: auto' vai garantir que ela encolha de forma responsiva.
                */}
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