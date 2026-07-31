'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  X, 
  Search, 
  Move, 
  ArrowLeft, 
  Hospital, 
  FileText 
} from 'lucide-react';
import { dbServicos } from '@/data/servicosData';
import styles from './FluxosAssistenciais.module.css';

export default function FluxosAssistenciaisPage() {
  const servico = dbServicos['fluxos-assistenciais'];

  const [categoriaAtivaId, setCategoriaAtivaId] = useState('cardiologia');
  const [submoduloAtivoId, setSubmoduloAtivoId] = useState('angioplastia');

  // Estados do Modal Lightbox / Zoom / Drag
  const [imagemModal, setImagemModal] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const listaCategorias = servico?.fluxosData || [];
  const categoriaAtual = listaCategorias.find((cat) => cat.id === categoriaAtivaId) || listaCategorias[0];
  const submodulosDisponiveis = categoriaAtual?.submodulos || [];
  const submoduloAtual = submodulosDisponiveis.find((sub) => sub.id === submoduloAtivoId) || submodulosDisponiveis[0];

  const handleTrocarCategoria = (catId) => {
    setCategoriaAtivaId(catId);
    const catEncontrada = listaCategorias.find((c) => c.id === catId);
    if (catEncontrada && catEncontrada.submodulos?.length > 0) {
      setSubmoduloAtivoId(catEncontrada.submodulos[0].id);
    }
  };

  const abrirModal = (imagem) => {
    setImagemModal(imagem);
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  const fecharModal = () => {
    setImagemModal(null);
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
    setIsDragging(false);
  };

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.4, 4));
  
  const handleZoomOut = () => {
    setZoomLevel((prev) => {
      const next = Math.max(prev - 0.4, 1);
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  // Controles do Mouse
  const handleMouseDown = (e) => {
    if (zoomLevel <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || zoomLevel <= 1) return;
    e.preventDefault();
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Controles de Touch (Telas sensíveis ao toque)
  const handleTouchStart = (e) => {
    if (zoomLevel <= 1 || e.touches.length !== 1) return;
    setIsDragging(true);
    setDragStart({
      x: e.touches[0].clientX - position.x,
      y: e.touches[0].clientY - position.y
    });
  };

  const handleTouchMove = (e) => {
    if (!isDragging || zoomLevel <= 1 || e.touches.length !== 1) return;
    setPosition({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  };

  const handleTouchEnd = () => setIsDragging(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') fecharModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!servico) return null;

  return (
    <div className={styles.pageWrapper}>
      
      {/* 1. HERO BANNER */}
      <section className={styles.heroBanner}>
        <div className={styles.container}>
          <div className={styles.badgeHeader}>
            <Hospital size={14} /> Rede Pública de Saúde de Muriaé
          </div>
          <h1 className={styles.heroTitle}>{servico.title}</h1>
          <p className={styles.heroDesc}>{servico.desc}</p>
        </div>
      </section>

      {/* 2. BARRA DE NAVEGAÇÃO DE RETORNO */}
      <nav className={styles.navigationBar}>
        <div className={styles.navContainer}>
          <Link href="/servicos" className={styles.backLink}>
            <ArrowLeft size={16} /> Voltar para Serviços
          </Link>
          <span className={styles.navTag}>Regulação & Pactuações do SUS</span>
        </div>
      </nav>

      {/* 3. CONTEÚDO PRINCIPAL */}
      <main className={styles.mainContent}>
        <div className={styles.container}>
          
          {/* SELETOR DE ESPECIALIDADES */}
          <div className={styles.categoryCard}>
            <span className={styles.categoryLabel}>
              Selecione a Especialidade Desejada:
            </span>
            <div className={styles.categoryGrid}>
              {listaCategorias.map((cat) => {
                const isSelected = categoriaAtivaId === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleTrocarCategoria(cat.id)}
                    className={`${styles.categoryButton} ${isSelected ? styles.categoryButtonActive : ''}`}
                  >
                    {cat.titulo}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SUB-ABAS DE PROCEDIMENTOS */}
          {submodulosDisponiveis.length > 1 && (
            <div className={styles.subTabGrid}>
              {submodulosDisponiveis.map((sub) => {
                const isSubSelected = submoduloAtivoId === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setSubmoduloAtivoId(sub.id)}
                    className={`${styles.subTabButton} ${isSubSelected ? styles.subTabButtonActive : ''}`}
                  >
                    {sub.titulo}
                  </button>
                );
              })}
            </div>
          )}

          {/* DETALHES E TEXTOS DO PROCEDIMENTO */}
          {submoduloAtual && (
            <div className={styles.detailCard}>
              <div className={styles.cardHeader}>
                <div className={styles.headerIconBox}>
                  <div className={styles.headerIconCircle}>
                    <FileText size={22} />
                  </div>
                  <div>
                    <span className={styles.headerTag}>{categoriaAtual.titulo}</span>
                    <h2 className={styles.headerTitle}>{submoduloAtual.titulo}</h2>
                  </div>
                </div>
              </div>

              <div className={styles.flowTextContent}>
                {submoduloAtual.texto?.split('\n\n').map((paragrafo, index) => (
                  <p key={index} className={styles.flowParagraph}>
                    {paragrafo}
                  </p>
                ))}
              </div>

              {/* SESSÃO DE FLUXOGRAMAS / MAPAS COM IMAGENS CLICÁVEIS */}
              {submoduloAtual.imagens && submoduloAtual.imagens.length > 0 && (
                <div className={styles.diagramsSection}>
                  <div className={styles.diagramsHeader}>
                    <h3 className={styles.diagramsTitle}>
                      Fluxogramas de Atendimento e Pactuações
                    </h3>
                    <p className={styles.diagramsSub}>
                      Clique em qualquer imagem para abrir em tela cheia e dar zoom com movimento livre.
                    </p>
                  </div>

                  <div className={styles.diagramsGrid}>
                    {submoduloAtual.imagens.map((img, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => abrirModal(img)}
                        className={styles.diagramCard}
                      >
                        <div className={styles.diagramImageWrapper}>
                          <Image 
                            src={img.src} 
                            alt={img.alt} 
                            width={600} 
                            height={400} 
                            className={styles.diagramImage}
                            unoptimized 
                          />
                        </div>
                        <div className={styles.diagramCardFooter}>
                          <span>{img.alt}</span>
                          <span className={styles.zoomPill}>
                            <Search size={14} /> Ampliar
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      </main>

      {/* MODAL LIGHTBOX COM FUNDO BRANCO E MOVIMENTO LIVRE */}
      {imagemModal && (
        <div 
          onClick={fecharModal}
          className={styles.lightboxModal}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className={styles.lightboxHeader}
          >
            <div className={styles.lightboxTitleArea}>
              <span className={styles.lightboxTitle}>
                {imagemModal.alt}
              </span>
              {zoomLevel > 1 && (
                <span className={styles.dragHintPill}>
                  <Move size={12} /> Arraste para mover
                </span>
              )}
            </div>

            <div className={styles.lightboxControls}>
              <button 
                onClick={handleZoomIn} 
                className={styles.controlBtn}
                title="Aumentar Zoom"
              >
                <ZoomIn size={18} />
              </button>

              <button 
                onClick={handleZoomOut} 
                className={styles.controlBtn}
                title="Diminuir Zoom"
              >
                <ZoomOut size={18} />
              </button>

              <button 
                onClick={handleResetZoom} 
                className={styles.controlBtn}
                title="Resetar Zoom e Posição"
              >
                <RotateCcw size={18} />
              </button>

              <button 
                onClick={fecharModal} 
                className={styles.closeBtn}
                title="Fechar (ESC)"
              >
                <X size={18} /> Fechar
              </button>
            </div>
          </div>

          <div 
            onClick={(e) => e.stopPropagation()}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className={`${styles.lightboxStage} ${
              zoomLevel > 1 
                ? (isDragging ? styles.stageGrabbing : styles.stageGrab) 
                : styles.stageDefault
            }`}
          >
            <div
              className={styles.zoomContainer}
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel})`,
                transition: isDragging ? 'none' : 'transform 0.15s ease-out'
              }}
            >
              <Image
                src={imagemModal.src}
                alt={imagemModal.alt}
                width={1800}
                height={1200}
                className={styles.lightboxImage}
                unoptimized
              />
            </div>
          </div>

          <div className={styles.lightboxFooter}>
            Dica: Ao aplicar o zoom, clique e segure na imagem para arrastar e visualizar detalhes cortados. Pressione ESC para fechar.
          </div>
        </div>
      )}

    </div>
  );
}