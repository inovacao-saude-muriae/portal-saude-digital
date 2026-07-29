'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { dbEventos, getStatusEvento } from '../page';
import styles from './EventosDetail.module.css';

export default function EventoDetailPage() {
  const params = useParams();
  const id = params?.id;

  const evento = dbEventos.find(item => item.id === Number(id));
  
  const [formData, setFormData] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState(null);

  // ESTADO PARA O ÍNDICE DA IMAGEM SELECIONADA NA GALERIA (null = fechado)
  const [fotoIndex, setFotoIndex] = useState(null);

  // FUNÇÕES NAVEGADORAS DA GALERIA
  const proximaFoto = () => {
    if (!evento?.galeria) return;
    setFotoIndex((prev) => (prev === null ? 0 : (prev + 1) % evento.galeria.length));
  };

  const fotoAnterior = () => {
    if (!evento?.galeria) return;
    setFotoIndex((prev) => (prev === null ? 0 : (prev - 1 + evento.galeria.length) % evento.galeria.length));
  };

  // SUPORTE A TECLAS DO TECLADO (SETA ESQUERDA, SETA DIREITA E ESC)
  useEffect(() => {
    if (fotoIndex === null || !evento?.galeria) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        setFotoIndex((prev) => (prev === null ? 0 : (prev + 1) % evento.galeria.length));
      } else if (e.key === 'ArrowLeft') {
        setFotoIndex((prev) => (prev === null ? 0 : (prev - 1 + evento.galeria.length) % evento.galeria.length));
      } else if (e.key === 'Escape') {
        setFotoIndex(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fotoIndex, evento?.galeria]);

  if (!evento) {
    return (
      <div className={styles.containerErro}>
        <h2>Evento não encontrado</h2>
        <p>O evento solicitado não existe ou foi removido.</p>
        <Link href="/eventos" className={styles.backLink}>Voltar para Eventos</Link>
      </div>
    );
  }

  const status = getStatusEvento(evento);
  const dataFormatada = new Date(`${evento.data}T00:00:00`).toLocaleDateString('pt-BR');

  // ENVIO DO FORMULÁRIO PARA O GOOGLE SCRIPT
  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setMensagem(null);

    try {
      const dataToSend = new FormData();
      Object.keys(formData).forEach(key => dataToSend.append(key, formData[key]));

      await fetch(evento.scriptUrl, {
        method: 'POST',
        body: dataToSend,
        mode: 'no-cors'
      });

      setMensagem({ tipo: 'sucesso', texto: 'Inscrição realizada com sucesso!' });
      setFormData({});
    } catch (err) {
      setMensagem({ tipo: 'erro', texto: 'Ocorreu um erro ao enviar. Tente novamente.' });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.navigationBar}>
        <div className={styles.container}>
          <Link href="/eventos" className={styles.backLink}>
            ← Voltar para Eventos
          </Link>
        </div>
      </div>

      <main className={styles.contentContainer}>
        <div className={styles.container}>
          
          <div className={styles.headerInfo}>
            <span className={`${styles.statusBadge} ${status.class}`}>{status.label}</span>
            <span className={styles.eventoData}>Data: {dataFormatada}</span>
          </div>

          <h1 className={styles.eventoTitulo}>{evento.titulo}</h1>
          <p className={styles.eventoResumo}>{evento.resumo}</p>

          <div className={styles.eventoBanner}>
            <Image 
              src={evento.imgSrc} 
              alt={evento.titulo} 
              width={900} 
              height={450} 
              priority 
              unoptimized 
              className={styles.bannerImage}
            />
          </div>

          <article className={styles.descricaoCompleta}>
            <h3>Sobre o Evento</h3>
            <p>{evento.descricao}</p>
          </article>

          {/* LOCALIZAÇÃO (SE HOUVER) */}
          {evento.local && (
            <div className={styles.infoBlock}>
              <h3>📍 Local de Realização</h3>
              <p>{evento.local}</p>
            </div>
          )}

          {/* CRONOGRAMA DE HORÁRIOS (SE HOUVER) */}
          {evento.cronograma && evento.cronograma.length > 0 && (
            <div className={styles.infoBlock}>
              <h3>🕒 Programação / Cronograma</h3>
              <div className={styles.cronogramaList}>
                {evento.cronograma.map((item, idx) => (
                  <div key={idx} className={styles.cronogramaItem}>
                    <span className={styles.cronoHora}>{item.hora}</span>
                    <div className={styles.cronoConteudo}>
                      <strong>{item.tema}</strong>
                      {item.palestrante && <p>{item.palestrante}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FORMULÁRIO DE INSCRIÇÃO */}
          {evento.formulario && status.label.includes('Aberto') && (
            <div className={styles.formSection}>
              <h3>📝 Formulário de Inscrição</h3>
              
              {mensagem && (
                <div className={mensagem.tipo === 'sucesso' ? styles.msgSucesso : styles.msgErro}>
                  {mensagem.texto}
                </div>
              )}

              <form onSubmit={handleFormSubmit} className={styles.formGrid}>
                {evento.formulario.map((field, idx) => (
                  <div key={idx} className={styles.formGroup}>
                    <label>{field.label} {field.required && '*'}</label>
                    <input 
                      type={field.type} 
                      name={field.name}
                      required={field.required}
                      value={formData[field.name] || ''}
                      onChange={handleFormChange}
                      className={styles.formInput}
                    />
                  </div>
                ))}
                <button type="submit" disabled={enviando} className={styles.submitBtn}>
                  {enviando ? 'Enviando...' : 'Confirmar Inscrição'}
                </button>
              </form>
            </div>
          )}

          {/* GALERIA DE FOTOS COM EFEITO DE CLIQUE */}
          {evento.galeria && evento.galeria.length > 0 && (
            <div className={styles.infoBlock}>
              <h3>📸 Galeria de Fotos</h3>
              <div className={styles.galeriaGrid}>
                {evento.galeria.map((img, idx) => (
                  <div 
                    key={idx} 
                    className={styles.galeriaItem}
                    onClick={() => setFotoIndex(idx)}
                  >
                    <Image 
                      src={img} 
                      alt={`Foto ${idx + 1}`} 
                      width={300} 
                      height={200} 
                      unoptimized 
                      className={styles.galeriaImg}
                    />
                    <div className={styles.zoomOverlay}>🔍 Expandir</div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* MODAL TELA CHEIA COM SETAS DE NAVEGAÇÃO */}
      {fotoIndex !== null && evento.galeria && (
        <div 
          className={styles.modalOverlay} 
          onClick={() => setFotoIndex(null)}
        >
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            
            {/* BOTÃO FECHAR */}
            <button 
              className={styles.closeBtn} 
              onClick={() => setFotoIndex(null)}
              title="Fechar (Esc)"
            >
              ✕
            </button>

            {/* SETA ANTERIOR */}
            <button 
              className={`${styles.navBtn} ${styles.prevBtn}`} 
              onClick={fotoAnterior}
              title="Anterior (Seta Esquerda)"
            >
              ❮
            </button>

            {/* IMAGEM AMPLIADA */}
            <Image 
              src={evento.galeria[fotoIndex]} 
              alt={`Foto ${fotoIndex + 1} de ${evento.galeria.length}`} 
              width={1200} 
              height={800} 
              unoptimized 
              className={styles.modalImage}
            />

            {/* SETA PRÓXIMA */}
            <button 
              className={`${styles.navBtn} ${styles.nextBtn}`} 
              onClick={proximaFoto}
              title="Próxima (Seta Direita)"
            >
              ❯
            </button>

            {/* CONTADOR DE FOTOS (Ex: 3 / 16) */}
            <div className={styles.counterBadge}>
              {fotoIndex + 1} / {evento.galeria.length}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}