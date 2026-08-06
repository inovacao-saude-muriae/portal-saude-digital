"use client";

import React, { useState, useEffect } from 'react';
import { useKeenSlider } from 'keen-slider/react'; 
import 'keen-slider/keen-slider.min.css'; 
import styles from './Carousel.module.css'; 
import Image from 'next/image'; 
import { Images } from 'lucide-react';

const SCRIPT_CARROSSEL_URL = 'https://script.google.com/macros/s/AKfycbxXCjv22fJcKIuwYV9ml5B6d99pQIX2rT0WBKkbz2JpjV78zADBCCQoGcFvjkt9DuJs3A/exec';

function tratarUrlImagem(url) {
  if (!url || typeof url !== 'string') return '';
  let cleanUrl = url.trim();

  if (cleanUrl.includes('drive.google.com') || cleanUrl.includes('googleusercontent.com')) {
    let fileId = '';
    if (cleanUrl.includes('/d/')) {
      fileId = cleanUrl.split('/d/')[1].split('/')[0].split('?')[0];
    } else if (cleanUrl.includes('id=')) {
      fileId = cleanUrl.split('id=')[1].split('&')[0];
    }
    if (fileId) return `https://lh3.googleusercontent.com/d/${fileId}`;
  }

  return cleanUrl;
}

export default function Carousel() {
  const [loaded, setLoaded] = useState(false);
  const [slides, setSlides] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [sliderRef, instanceRef] = useKeenSlider(
    {
      initial: 0,
      loop: slides.length > 1,
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
          if (mouseOver || slider.track.details?.slides.length <= 1) return;
          timeout = setTimeout(() => {
            slider.next();
          }, 4000);
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

  useEffect(() => {
    async function carregarSlides() {
      const cache = localStorage.getItem('cache_portal_carrossel');
      if (cache) {
        try {
          const parsedCache = JSON.parse(cache);
          if (Array.isArray(parsedCache) && parsedCache.length > 0) {
            setSlides(parsedCache);
            setCarregando(false);
          }
        } catch (e) {
          console.error("Erro ao ler cache do carrossel:", e);
        }
      }

      try {
        const response = await fetch(`${SCRIPT_CARROSSEL_URL}?_t=${Date.now()}`, {
          method: 'GET',
          redirect: 'follow',
          cache: 'no-store'
        });
        const resData = await response.json();

        if (resData.status === 'success' && Array.isArray(resData.slides)) {
          const slidesFormatados = resData.slides
            .map(item => ({
              id: item.id || String(Date.now()),
              imgDesktop: tratarUrlImagem(item.imagem),
              alt: item.alt || 'Banner institucional',
              link: item.link || '' 
            }))
            .filter(item => item.imgDesktop !== '');

          setSlides(slidesFormatados);
          localStorage.setItem('cache_portal_carrossel', JSON.stringify(slidesFormatados));
        }
      } catch (err) {
        console.error("Erro ao buscar banners dinâmicos:", err);
      } finally {
        setCarregando(false);
      }
    }

    carregarSlides();
  }, []);

  return (
    <section className={styles.carouselSection}>
      <div className={styles.container}>                
        
        <div className={styles.headerArea}>
          <span className={styles.subtitle}>DESTAQUES</span>
          <h2 className={styles.title}>Campanhas e iniciativas</h2>
        </div>

        {slides.length > 0 ? (
          <div className={styles.carouselWrapper}>
            <div key={slides.length} ref={sliderRef} className="keen-slider">
              {slides.map((slide, index) => {
                const linkStr = (typeof slide.link === 'string') ? slide.link.trim() : '';
                const isExternal = linkStr.startsWith('http');

                const content = (
                  <Image 
                    src={slide.imgDesktop} 
                    alt={slide.alt} 
                    width={1920} 
                    height={555} 
                    priority={index === 0} 
                    className={styles.bannerImg}
                    unoptimized
                  />
                );

                return (
                  <div key={slide.id} className={`keen-slider__slide ${styles.slide}`}>
                    {linkStr ? (
                      <a 
                        href={linkStr} 
                        target={isExternal ? "_blank" : "_self"}
                        rel={isExternal ? "noopener noreferrer" : ""}
                        style={{ display: 'block', width: '100%' }}
                      >
                        {content}
                      </a>
                    ) : (
                      content
                    )}
                  </div>
                );
              })}
            </div>

            {loaded && slides.length > 1 && (
              <>
                <button
                  className={`${styles.arrow} ${styles.arrowLeft}`}
                  onClick={(e) => { e.stopPropagation(); instanceRef.current?.prev(); }}
                  aria-label="Slide anterior"
                >
                  ←
                </button>

                <button
                  className={`${styles.arrow} ${styles.arrowRight}`}
                  onClick={(e) => { e.stopPropagation(); instanceRef.current?.next(); }}
                  aria-label="Próximo slide" 
                >
                  →
                </button>
              </>
            )}
          </div>
        ) : (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '40px 20px',
            textAlign: 'center',
            border: '1px dashed #cbd5e1',
            color: '#64748b'
          }}>
            <Images size={40} color="#0284c7" style={{ marginBottom: '12px' }} />
            <h3 style={{ margin: '0 0 8px 0', color: '#0f172a', fontSize: '18px' }}>
              {carregando ? 'Carregando destaques...' : 'Nenhum banner cadastrado'}
            </h3>
            <p style={{ margin: 0, fontSize: '14px' }}>
              {carregando 
                ? 'Buscando informações...' 
                : 'Acesse o Painel Administrativo para publicar o primeiro banner do carrossel.'}
            </p>
          </div>
        )}

      </div>
    </section>
  );
}