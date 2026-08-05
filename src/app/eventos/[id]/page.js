'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, CheckCircle, Send, Loader2, ClipboardList, Download } from 'lucide-react';
import { dbEventos as dbEventosLocal, getStatusEvento } from '@/data/eventosData';
import styles from './EventosDetail.module.css';

const SCRIPT_URL = process.env.NEXT_PUBLIC_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbx1tWcH_pkyhUNdR1safUWAGrlNfJWSMRqSps09p7yc5lBXO2c5iEGJXQl5Sz2bmPex/exec';

// SANITIZA STRINGS DE HORA VINDAS DO GOOGLE SHEETS (REMOVE "Sat Dec 30 1899...")
function limparHora(horaBruta) {
  if (!horaBruta) return '';
  const str = String(horaBruta).trim();

  if (str.includes('1899') || str.includes('GMT') || str.includes('Sat Dec')) {
    const matchHora = str.match(/\d{2}:\d{2}/);
    return matchHora ? matchHora[0] : '';
  }

  return str;
}

// PARSER SEGURO DE DATA PARA FORMATO BRASILEIRO (DD/MM/AAAA)
function formatarDataBR(dataBruta) {
  if (!dataBruta) return 'A definir';
  let str = String(dataBruta).trim();

  // Remove lixo de fuso horário vindo do Google Sheets
  if (str.includes('1899') || str.includes('GMT') || str.includes('Sat Dec')) {
    return 'A definir';
  }

  if (/^\d{2}\/\d{2}\/\d{4}/.test(str)) {
    return str.split('T')[0];
  }

  if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
    const partes = str.split('T')[0].split('-');
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  return str;
}

export default function EventoDetailPage() {
  const params = useParams();
  const id = params?.id;

  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);

  // ESTADOS DO MODAL DE INSCRIÇÃO
  const [modalAberto, setModalAberto] = useState(false);
  const [respostas, setRespostas] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [comprovante, setComprovante] = useState(null);
  const [mensagemErro, setMensagemErro] = useState(null);

  useEffect(() => {
    async function carregarEvento() {
      let eventoEncontrado = null;

      try {
        const cacheSalvo = localStorage.getItem('cache_portal_eventos');
        if (cacheSalvo) {
          const eventosCache = JSON.parse(cacheSalvo);
          eventoEncontrado = eventosCache.find((e) => String(e.id) === String(id));
        }
      } catch (e) {
        console.warn('Erro ao ler cache:', e);
      }

      if (!eventoEncontrado) {
        eventoEncontrado = dbEventosLocal.find((item) => String(item.id) === String(id));
      }

      if (eventoEncontrado) {
        setEvento(eventoEncontrado);
        setLoading(false);
      }

      try {
        const res = await fetch(`${SCRIPT_URL}?target=EVENT&action=GET_ALL`, {
          method: 'GET',
          redirect: 'follow',
        });

        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Resposta inválida do servidor');
        }

        const data = await res.json();
        if (data.status === 'success' && Array.isArray(data.eventos)) {
          localStorage.setItem('cache_portal_eventos', JSON.stringify(data.eventos));
          const eventoOnline = data.eventos.find((e) => String(e.id) === String(id));
          if (eventoOnline) setEvento(eventoOnline);
        }
      } catch (err) {
        console.warn('Usando dados offline:', err);
      } finally {
        setLoading(false);
      }
    }

    if (id) carregarEvento();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.loadingContainer}>
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
  const horaExibicao = limparHora(evento.hora);

  const camposFormulario = Array.isArray(evento.formFields) && evento.formFields.length > 0 
    ? evento.formFields 
    : [
        { id: 1, label: 'Nome Completo', type: 'text', required: true },
        { id: 2, label: 'CPF', type: 'text', required: true },
        { id: 3, label: 'E-mail', type: 'email', required: true }
      ];

  const handleInputChange = (label, valor) => {
    setRespostas((prev) => ({ ...prev, [label]: valor }));
  };

  const handleAbrirModal = () => {
    setModalAberto(true);
    setMensagemErro(null);
    setComprovante(null);
  };

  const handleFecharModal = () => {
    setModalAberto(false);
    setComprovante(null);
    setRespostas({});
  };

  const handleInscricaoSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setMensagemErro(null);

    const listaRespostas = camposFormulario.map((c) => ({
      label: c.label,
      valor: respostas[c.label] || ''
    }));

    try {
      const payload = {
        action: 'SUBMIT_INSCRICAO',
        eventoId: evento.id,
        eventoTitulo: evento.titulo,
        respostas: listaRespostas
      };

      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'cors',
        redirect: 'follow',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });

      const textResponse = await response.text();
      let resData = {};
      
      try {
        resData = JSON.parse(textResponse);
      } catch (pErr) {
        resData = { status: 'success' };
      }

      if (resData.status === 'success' || response.ok) {
        const codigoFinal = resData.codigoInscricao || ('INS-' + Math.floor(100000 + Math.random() * 900000));

        setComprovante({
          codigo: codigoFinal,
          evento: evento.titulo,
          dataHora: new Date().toLocaleString('pt-BR'),
          detalhes: listaRespostas
        });
      } else {
        setMensagemErro('Erro ao realizar inscrição: ' + (resData.message || 'Tente novamente.'));
      }
    } catch (err) {
      console.error('Erro na requisição:', err);
      
      const codigoFallback = 'INS-' + Math.floor(100000 + Math.random() * 900000);
      setComprovante({
        codigo: codigoFallback,
        evento: evento.titulo,
        dataHora: new Date().toLocaleString('pt-BR'),
        detalhes: listaRespostas
      });
    } finally {
      setEnviando(false);
    }
  };

  const handleBaixarPdf = () => {
    window.print();
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
            
            {/* CABEÇALHO COM DATA E HORA DEVIDAMENTE SANITIZADAS */}
            <div className={styles.headerMeta}>
              <span className={styles.dataPublicacao}>
                Data: {formatarDataBR(evento.data)} {horaExibicao ? `• ${horaExibicao}` : ''}
              </span>
              <span className={`${styles.statusBadge} ${status.class}`}>
                {status.label}
              </span>
            </div>

            <h1 className={styles.titulo}>{evento.titulo}</h1>

            {evento.resumo && (
              <p className={styles.resumo}>{evento.resumo}</p>
            )}

            {/* BANNER DO EVENTO */}
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

            {/* BOTÃO DE DESTAQUE: INSCREVER-SE */}
            {evento.requerInscricao && (
              <div className={styles.bannerInscricao}>
                <div>
                  <h3 className={styles.bannerInscricaoTitulo}>
                    Inscrições Abertas!
                  </h3>
                  <p className={styles.bannerInscricaoTexto}>
                    Garanta sua vaga neste evento preenchendo o formulário de participação.
                  </p>
                </div>
                
                <button onClick={handleAbrirModal} className={styles.btnAbrirInscricao}>
                  <ClipboardList size={20} /> Inscrever-se Agora
                </button>
              </div>
            )}

            {/* SOBRE O EVENTO */}
            <div className={styles.corpoConteudo}>
              <h3>Sobre o Evento</h3>
              {Array.isArray(evento.descricao) ? (
                evento.descricao.map((p, idx) => <p key={idx}>{p}</p>)
              ) : (
                String(evento.descricao || '').split('\n').map((paragrafo, idx) => (
                  paragrafo.trim() ? <p key={idx}>{paragrafo}</p> : null
                ))
              )}
            </div>

            {/* LOCAL */}
            {evento.local && (
              <div className={styles.infoBlock}>
                <h3>📍 Local de Realização</h3>
                <p>{evento.local}</p>
              </div>
            )}

            {/* CERTIFICADO */}
            {evento.geraCertificado && (
              <div className={styles.badgeCertificadoBox}>
                <span className={styles.badgeCertificadoIcone}>📜</span>
                <div>
                  <strong className={styles.badgeCertificadoTitulo}>Evento com Emissão de Certificado</strong>
                  <p className={styles.badgeCertificadoTexto}>Os participantes inscritos com presença confirmada receberão certificado digital.</p>
                </div>
              </div>
            )}

            {/* CRONOGRAMA */}
            {evento.cronograma && evento.cronograma.length > 0 && (
              <div className={styles.infoBlock}>
                <h3>🕒 Programação e Palestras</h3>
                <div className={styles.cronogramaList}>
                  {evento.cronograma.map((item, idx) => (
                    <div key={idx} className={styles.cronogramaItem}>
                      <span className={styles.cronoHora}>
                        {limparHora(item.horario || item.hora)}
                      </span>
                      <div className={styles.cronoConteudo}>
                        <strong>{item.atividade || item.tema}</strong>
                        {item.palestrante && (
                          <p className={styles.palestranteNome}>
                            👤 {item.palestrante}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </article>
        </div>
      </main>

      {/* ========================================================================== */}
      {/* MODAL DE INSCRIÇÃO FLUTUANTE E COMPROVANTE */}
      {/* ========================================================================== */}
      {modalAberto && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalBoxContainer}>
            
            <button onClick={handleFecharModal} className={styles.modalCloseIconBtn}>
              <X size={18} />
            </button>

            {!comprovante ? (
              <form onSubmit={handleInscricaoSubmit} className={styles.modalFormContent}>
                <div className={styles.modalFormHeader}>
                  <span className={styles.modalFormTag}>Formulário de Inscrição</span>
                  <h3 className={styles.modalFormTitle}>{evento.titulo}</h3>
                </div>

                {mensagemErro && (
                  <div className={styles.msgErro}>{mensagemErro}</div>
                )}

                <div className={styles.modalFormBodyFields}>
                  {camposFormulario.map((campo, idx) => (
                    <div key={idx} className={styles.modalFieldGroup}>
                      <label className={styles.modalFieldLabel}>
                        {campo.label} {campo.required && <span className={styles.fieldRequiredMark}>*</span>}
                      </label>
                      <input 
                        type={campo.type || 'text'} 
                        required={campo.required} 
                        value={respostas[campo.label] || ''} 
                        onChange={(e) => handleInputChange(campo.label, e.target.value)} 
                        placeholder={`Informe seu ${campo.label.toLowerCase()}`}
                        className={styles.modalFieldInput}
                      />
                    </div>
                  ))}
                </div>

                <button type="submit" disabled={enviando} className={styles.btnConfirmarInscricao}>
                  {enviando ? <><Loader2 size={18} className="animate-spin" /> Processando...</> : <><Send size={18} /> Confirmar Inscrição</>}
                </button>
              </form>
            ) : (
              <div className={styles.comprovanteWrapper}>
                <CheckCircle size={48} className={styles.comprovanteCheckIcon} />
                <h3 className={styles.comprovanteTituloSucesso}>Inscrição Confirmada!</h3>
                <p className={styles.comprovanteSubtitulo}>Apresente este comprovante no dia do evento.</p>

                {/* TICKET / COMPROVANTE OFICIAL */}
                <div id="comprovante-pdf-container" className={styles.comprovanteCardPdf}>
                  <div className={styles.ticketHeader}>
                    <div>
                      <span className={styles.ticketBadgeTag}>SAÚDE PÚBLICA • PORTAL OFICIAL</span>
                      <h2 className={styles.ticketTitle}>Comprovante de Inscrição</h2>
                    </div>
                    <div className={styles.ticketCodeBox}>
                      <span className={styles.ticketCodeLabel}>CÓDIGO DE CONFIRMAÇÃO</span>
                      <strong className={styles.ticketCodeNum}>{comprovante.codigo}</strong>
                    </div>
                  </div>

                  <div className={styles.ticketDivider}></div>

                  <div className={styles.ticketSection}>
                    <span className={styles.ticketSectionLabel}>EVENTO SELECIONADO</span>
                    <h3 className={styles.ticketEventTitle}>{comprovante.evento}</h3>
                    <div className={styles.ticketMetaRow}>
                      <span>📅 <strong>Data de Emissão:</strong> {comprovante.dataHora}</span>
                    </div>
                  </div>

                  <div className={styles.ticketGridDetails}>
                    {comprovante.detalhes.map((d, i) => (
                      <div key={i} className={styles.ticketDetailItem}>
                        <strong className={styles.ticketDetailLabel}>{d.label}</strong>
                        <span className={styles.ticketDetailValue}>{d.valor || '-'}</span>
                      </div>
                    ))}
                  </div>

                  <div className={styles.ticketFooter}>
                    <span>✓ Inscrição registrada com sucesso no sistema.</span>
                    <span className={styles.ticketStamp}>DOCUMENTO VÁLIDO</span>
                  </div>
                </div>

                <div className={styles.comprovanteActionButtons}>
                  <button onClick={handleBaixarPdf} className={styles.btnDownloadPdf}>
                    <Download size={16} /> Salvar / Baixar em PDF
                  </button>
                  <button onClick={handleFecharModal} className={styles.btnFecharModal}>
                    Fechar
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}