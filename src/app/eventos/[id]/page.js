'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { dbEventos as dbEventosLocal, getStatusEvento } from '@/data/eventosData';
import styles from './EventosDetail.module.css';

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx1tWcH_pkyhUNdR1safUWAGrlNfJWSMRqSps09p7yc5lBXO2c5iEGJXQl5Sz2bmPex/exec';

export default function EventoDetailPage() {
  const params = useParams();
  const id = params?.id;

  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({ nomeCompleto: '', cpf: '', email: '' });
  const [enviando, setEnviando] = useState(false);
  const [comprovante, setComprovante] = useState(null);
  const [mensagemErro, setMensagemErro] = useState(null);

  useEffect(() => {
    async function carregarEvento() {
      // 1. Primeiro tenta achar no arquivo local (ex: o Simpósio)
      const eventoLocal = dbEventosLocal.find((item) => String(item.id) === String(id));

      try {
        // 2. Busca também na API do Google Sheets
        const res = await fetch(`${SCRIPT_URL}?target=EVENT&action=GET_ALL`);
        const data = await res.json();

        if (data.status === 'success' && Array.isArray(data.eventos)) {
          const eventoOnline = data.eventos.find((e) => String(e.id) === String(id));
          
          // Se encontrou no Google Sheets, usa ele; senão usa o local
          setEvento(eventoOnline || eventoLocal || null);
        } else {
          setEvento(eventoLocal || null);
        }
      } catch (err) {
        console.error('Erro ao buscar evento online, usando local:', err);
        setEvento(eventoLocal || null);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      carregarEvento();
    }
  }, [id]);

  if (loading) {
    return (
      <div className={styles.pageWrapper}>
        <div style={{ textAlign: 'center', padding: '100px 20px', color: '#64748b' }}>
          <p>Carregando informações do evento...</p>
        </div>
      </div>
    );
  }

  if (!evento) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.containerNotFound}>
          <h2>Evento não encontrado</h2>
          <p>O evento solicitado não existe ou foi removido.</p>
          <Link href="/eventos" className={styles.btnVoltar}>
            ← Voltar para Eventos
          </Link>
        </div>
      </div>
    );
  }

  const status = getStatusEvento(evento, styles);
  const imagemExibicao = evento.imgSrc || evento.imagem || '/img/eventos/simposio.png';

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleInscricaoSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setMensagemErro(null);

    try {
      const payload = {
        action: 'INSCREVER',
        eventoId: evento.id,
        eventoTitulo: evento.titulo,
        nomeCompleto: formData.nomeCompleto,
        cpf: formData.cpf,
        email: formData.email
      };

      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });

      const resData = await response.json();

      if (resData.status === 'success') {
        setComprovante(resData.comprovante);
      } else {
        setMensagemErro('Erro ao realizar inscrição: ' + resData.message);
      }
    } catch (err) {
      setMensagemErro('Ocorreu um erro ao enviar. Tente novamente.');
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

      <main className={styles.mainContent}>
        <div className={styles.container}>
          <article className={styles.articleCard}>
            
            {/* CABEÇALHO */}
            <div className={styles.headerMeta}>
              <span className={styles.dataPublicacao}>
                Data: {evento.data} {evento.hora ? `• ${evento.hora}` : ''}
              </span>
              <span className={`${styles.statusBadge} ${status.class}`}>
                {status.label}
              </span>
            </div>

            <h1 className={styles.titulo}>{evento.titulo}</h1>

            {evento.resumo && (
              <p className={styles.resumo}>{evento.resumo}</p>
            )}

            {/* CAPA / BANNER */}
            {imagemExibicao && (
              <div className={styles.imageWrapper}>
                <Image 
                  src={imagemExibicao} 
                  alt={evento.titulo} 
                  width={900} 
                  height={450} 
                  priority 
                  unoptimized 
                  className={styles.imagemCapa} 
                />
              </div>
            )}

            {/* SOBRE O EVENTO */}
            <div className={styles.corpoConteudo}>
              <h3>Sobre o Evento</h3>
              {Array.isArray(evento.descricao) ? (
                evento.descricao.map((p, idx) => <p key={idx}>{p}</p>)
              ) : (
                <p>{evento.descricao}</p>
              )}
            </div>

            {/* LOCAL */}
            {evento.local && (
              <div className={styles.infoBlock}>
                <h3>📍 Local de Realização</h3>
                <p>{evento.local}</p>
              </div>
            )}

            {/* BADGE DE CERTIFICADO */}
            {evento.geraCertificado && (
              <div style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', padding: '16px 20px', borderRadius: '12px', marginTop: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '28px' }}>📜</span>
                <div>
                  <strong style={{ color: '#0369a1', fontSize: '15px' }}>Evento com Emissão de Certificado</strong>
                  <p style={{ margin: 0, fontSize: '13px', color: '#0284c7' }}>Os participantes inscritos com presenças confirmadas receberão certificado digital.</p>
                </div>
              </div>
            )}

            {/* CRONOGRAMA & PALESTRAS */}
            {evento.cronograma && evento.cronograma.length > 0 && (
              <div className={styles.infoBlock}>
                <h3>🕒 Programação e Palestras</h3>
                <div className={styles.cronogramaList}>
                  {evento.cronograma.map((item, idx) => (
                    <div key={idx} className={styles.cronogramaItem}>
                      <span className={styles.cronoHora}>
                        {item.horario || item.hora}
                      </span>
                      <div className={styles.cronoConteudo}>
                        <strong>{item.atividade || item.tema}</strong>
                        {item.palestrante && (
                          <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#0065a4', fontWeight: '600' }}>
                            👤 {item.palestrante}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FORMULÁRIO DE INSCRIÇÃO OU COMPROVANTE */}
            {evento.requerInscricao && (
              <div className={styles.formSection}>
                <h3>📝 Inscrição no Evento</h3>

                {mensagemErro && <div className={styles.msgErro}>{mensagemErro}</div>}

                {!comprovante ? (
                  <form onSubmit={handleInscricaoSubmit} className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label>Nome Completo *</label>
                      <input 
                        type="text" 
                        name="nomeCompleto" 
                        required 
                        value={formData.nomeCompleto} 
                        onChange={handleFormChange} 
                        className={styles.formInput} 
                        placeholder="Digite seu nome completo" 
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>CPF *</label>
                      <input 
                        type="text" 
                        name="cpf" 
                        required 
                        value={formData.cpf} 
                        onChange={handleFormChange} 
                        className={styles.formInput} 
                        placeholder="000.000.000-00" 
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>E-mail *</label>
                      <input 
                        type="email" 
                        name="email" 
                        required 
                        value={formData.email} 
                        onChange={handleFormChange} 
                        className={styles.formInput} 
                        placeholder="seuemail@exemplo.com" 
                      />
                    </div>

                    <button type="submit" disabled={enviando} className={styles.submitBtn}>
                      {enviando ? 'Processando Inscrição...' : 'Confirmar minha Inscrição'}
                    </button>
                  </form>
                ) : (
                  <div style={{ backgroundColor: '#ffffff', border: '2px dashed #2b943d', padding: '24px', borderRadius: '16px', textAlign: 'center' }}>
                    <div style={{ fontSize: '40px', marginBottom: '8px' }}>✅</div>
                    <h4 style={{ fontSize: '20px', color: '#15803d', margin: '0 0 4px 0' }}>Inscrição Confirmada!</h4>
                    <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 16px 0' }}>Guarde o comprovante abaixo para apresentar no dia do evento.</p>

                    <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '16px', borderRadius: '10px', textAlign: 'left', fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div><strong>Código de Inscrição:</strong> <span style={{ color: '#0065a4', fontWeight: 'bold' }}>{comprovante.codigo}</span></div>
                      <div><strong>Participante:</strong> {comprovante.nome}</div>
                      <div><strong>CPF:</strong> {comprovante.cpf}</div>
                      <div><strong>Evento:</strong> {comprovante.evento}</div>
                      <div><strong>Data/Hora do Registro:</strong> {comprovante.dataHora}</div>
                    </div>

                    <button 
                      onClick={() => window.print()} 
                      style={{ marginTop: '20px', backgroundColor: '#0065a4', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      🖨️ Imprimir Comprovante
                    </button>
                  </div>
                )}
              </div>
            )}

          </article>
        </div>
      </main>
    </div>
  );
}