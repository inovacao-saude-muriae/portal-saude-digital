'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, CheckCircle, Send, Loader2, ClipboardList, Download, Search, FileCheck } from 'lucide-react';
import { dbEventos as dbEventosLocal, getStatusEvento } from '@/data/eventosData';
import styles from './EventosDetail.module.css';

const SCRIPT_URL = process.env.NEXT_PUBLIC_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbx1tWcH_pkyhUNdR1safUWAGrlNfJWSMRqSps09p7yc5lBXO2c5iEGJXQl5Sz2bmPex/exec';

// --- FUNÇÕES DE MÁSCARA E FORMATAÇÃO DE CAMPOS ---
function aplicarMascaraCPF(value) {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    .slice(0, 14);
}

function aplicarMascaraTelefone(value) {
  const nums = value.replace(/\D/g, '').slice(0, 11);
  if (nums.length <= 10) {
    return nums
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }
  return nums
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');
}

function limparHora(horaBruta) {
  if (!horaBruta) return '';
  const str = String(horaBruta).trim();
  if (str.includes('1899') || str.includes('GMT') || str.includes('Sat Dec')) {
    const matchHora = str.match(/\d{2}:\d{2}/);
    return matchHora ? matchHora[0] : '';
  }
  return str;
}

function formatarDataBR(dataBruta) {
  if (!dataBruta) return 'A definir';
  let str = String(dataBruta).trim();
  if (str.includes('1899') || str.includes('GMT') || str.includes('Sat Dec')) {
    return 'A definir';
  }
  if (/^\d{2}\/\d{2}\/\d{4}/.test(str)) {
    return str.split('T')[0].split(' ')[0];
  }
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
    const partes = str.split('T')[0].split('-');
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }
  return str;
}

// FORMATA DATA SEM EXIBIR O HORÁRIO (SOMENTE DD/MM/YYYY)
function formatarDataParaExibicao(valor) {
  if (!valor) return '-';
  const str = String(valor).trim();

  // Tratamento para strings tipo GMT JavaScript
  if (str.includes('GMT') || str.includes('Mon') || str.includes('Tue') || str.includes('Wed') || str.includes('Thu') || str.includes('Fri') || str.includes('Sat') || str.includes('Sun')) {
    try {
      const d = new Date(str);
      if (!isNaN(d.getTime())) {
        const dia = String(d.getDate()).padStart(2, '0');
        const mes = String(d.getMonth() + 1).padStart(2, '0');
        const ano = d.getFullYear();
        return `${dia}/${mes}/${ano}`;
      }
    } catch (e) {}
  }

  // Se já estiver no formato DD/MM/YYYY
  if (/^\d{2}\/\d{2}\/\d{4}/.test(str)) {
    return str.split('T')[0].split(' ')[0];
  }

  // Se estiver no formato ISO (Ex: YYYY-MM-DD)
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

  // ESTADOS DO MODAL
  const [modalAberto, setModalAberto] = useState(false);
  const [abaModal, setAbaModal] = useState('inscricao'); // 'inscricao' | 'consulta'
  
  // ESTADOS DO FORMULÁRIO DE INSCRIÇÃO
  const [respostas, setRespostas] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [comprovante, setComprovante] = useState(null);
  const [mensagemErro, setMensagemErro] = useState(null);

  // ESTADOS DA CONSULTA POR CPF
  const [cpfConsulta, setCpfConsulta] = useState('');
  const [buscandoCpf, setBuscandoCpf] = useState(false);

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
        { id: 1, label: 'Nome Completo', type: 'text', required: true, options: [] },
        { id: 2, label: 'CPF', type: 'cpf', required: true, options: [] },
        { id: 3, label: 'E-mail', type: 'email', required: true, options: [] },
        { id: 4, label: 'Telefone Celular', type: 'tel', required: true, options: [] }
      ];

  const handleInputChange = (campo, valorBruto) => {
    let valorFinal = valorBruto;
    if (campo.type === 'cpf') {
      valorFinal = aplicarMascaraCPF(valorBruto);
    } else if (campo.type === 'tel') {
      valorFinal = aplicarMascaraTelefone(valorBruto);
    }
    setRespostas((prev) => ({ ...prev, [campo.label]: valorFinal }));
  };

  const handleCheckboxMultiChange = (label, opcao, checked) => {
    setRespostas((prev) => {
      const selecaoAtual = Array.isArray(prev[label]) ? prev[label] : [];
      let novaSelecao = checked ? [...selecaoAtual, opcao] : selecaoAtual.filter((o) => o !== opcao);
      return { ...prev, [label]: novaSelecao };
    });
  };

  const handleAbrirModal = (aba = 'inscricao') => {
    setAbaModal(aba);
    setModalAberto(true);
    setMensagemErro(null);
    setComprovante(null);
    setCpfConsulta('');
  };

  const handleFecharModal = () => {
    setModalAberto(false);
    setComprovante(null);
    setRespostas({});
    setMensagemErro(null);
  };

  // ENVIO DA NOVA INSCRIÇÃO (UTILIZANDO A NOVA ROTA DE API INTERNA DO NEXT.JS)
  const handleInscricaoSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setMensagemErro(null);

    for (const campo of camposFormulario) {
      const val = respostas[campo.label];
      if (campo.required && (!val || (Array.isArray(val) && val.length === 0))) {
        setMensagemErro(`O campo "${campo.label}" é obrigatório.`);
        setEnviando(false);
        return;
      }
      if (campo.type === 'cpf' && val && val.replace(/\D/g, '').length !== 11) {
        setMensagemErro(`Informe um CPF válido com 11 dígitos.`);
        setEnviando(false);
        return;
      }
    }

    const listaRespostas = camposFormulario.map((c) => {
      const resp = respostas[c.label];
      return {
        label: c.label,
        valor: Array.isArray(resp) ? resp.join(', ') : (resp || '')
      };
    });

    try {
      const payload = {
        action: 'SUBMIT_INSCRICAO',
        eventoId: evento.id,
        eventoTitulo: evento.titulo,
        respostas: listaRespostas
      };

      // Dispara a requisição para a rota interna de API do Next.js
      const response = await fetch('/api/inscricoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const resData = await response.json();

      if (resData.status === 'success' || response.ok) {
        const codigoFinal = resData.codigoInscricao || ('INS-' + Math.floor(100000 + Math.random() * 900000));
        setComprovante({
          codigo: codigoFinal,
          evento: evento.titulo,
          dataHora: new Date().toLocaleDateString('pt-BR'),
          detalhes: listaRespostas
        });
      } else {
        setMensagemErro('Erro ao realizar inscrição: ' + (resData.message || 'Tente novamente.'));
      }
    } catch (err) {
      console.error('Erro de envio:', err);
      setMensagemErro('Ocorreu um erro ao processar sua inscrição. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  };

  // BUSCA NO GOOGLE SHEETS PARA EMISSÃO DE 2ª VIA
  const handleConsultarCpfSubmit = async (e) => {
    e.preventDefault();
    const digitos = cpfConsulta.replace(/\D/g, '');

    if (digitos.length !== 11) {
      setMensagemErro('Informe um CPF válido com 11 dígitos.');
      return;
    }

    setBuscandoCpf(true);
    setMensagemErro(null);

    try {
      const url = `${SCRIPT_URL}?action=CONSULTAR_INSCRICOES&cpf=${encodeURIComponent(cpfConsulta)}&eventoTitulo=${encodeURIComponent(evento.titulo)}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.status === 'success' && Array.isArray(data.inscricoes) && data.inscricoes.length > 0) {
        const item = data.inscricoes[0];
        
        setComprovante({
          codigo: item.codigoInscricao,
          evento: item.eventoTitulo || evento.titulo,
          dataHora: item.dataRegistro || new Date().toLocaleDateString('pt-BR'),
          detalhes: [
            { label: 'Nome Completo', valor: item.nome },
            { label: 'CPF', valor: item.cpf },
            { label: 'Data de Nascimento', valor: item.dataNascimento },
            { label: 'E-mail', valor: item.email }
          ]
        });
      } else {
        setMensagemErro('Nenhuma inscrição encontrada neste evento para o CPF informado.');
      }
    } catch (err) {
      console.error('Erro na consulta:', err);
      setMensagemErro('Erro ao consultar banco de dados. Tente novamente.');
    } finally {
      setBuscandoCpf(false);
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
            
            <div className={styles.headerMeta}>
              <span className={styles.dataPublicacao}>
                Data: {formatarDataBR(evento.data)} {horaExibicao ? `• ${horaExibicao}` : ''}
              </span>
              <span className={`${styles.statusBadge} ${status.class}`}>
                {status.label}
              </span>
            </div>

            <h1 className={styles.titulo}>{evento.titulo}</h1>

            {evento.resumo && <p className={styles.resumo}>{evento.resumo}</p>}

            {imagemExibicao && (
              <div className={styles.imageWrapper}>
                <Image src={imagemExibicao} alt={evento.titulo} width={900} height={450} priority unoptimized className={styles.imagemCapa} />
              </div>
            )}

            {/* BANNER DE INSCRIÇÃO COM LINK DE SEGUNDA VIA */}
            {evento.requerInscricao && (
              <div className={styles.bannerInscricao}>
                <div>
                  <h3 className={styles.bannerInscricaoTitulo}>Inscrições Abertas!</h3>
                  <p className={styles.bannerInscricaoTexto}>
                    Garanta sua vaga neste evento preenchendo o formulário de participação.
                  </p>
                </div>
                
                <div className={styles.bannerButtonsCol}>
                  <button onClick={() => handleAbrirModal('inscricao')} className={styles.btnAbrirInscricao}>
                    <ClipboardList size={20} /> Inscrever-se Agora
                  </button>

                  <button onClick={() => handleAbrirModal('consulta')} className={styles.btnLinkSegundaVia}>
                    <FileCheck size={15} /> Já se inscreveu? Emitir 2ª via do comprovante
                  </button>
                </div>
              </div>
            )}

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

            {evento.local && (
              <div className={styles.infoBlock}>
                <h3>📍 Local de Realização</h3>
                <p>{evento.local}</p>
              </div>
            )}

            {evento.geraCertificado && (
              <div className={styles.badgeCertificadoBox}>
                <span className={styles.badgeCertificadoIcone}>📜</span>
                <div>
                  <strong className={styles.badgeCertificadoTitulo}>Evento com Emissão de Certificado</strong>
                  <p className={styles.badgeCertificadoTexto}>Os participantes inscritos com presença confirmada receberão certificado digital.</p>
                </div>
              </div>
            )}

            {evento.cronograma && evento.cronograma.length > 0 && (
              <div className={styles.infoBlock}>
                <h3>🕒 Programação e Palestras</h3>
                <div className={styles.cronogramaList}>
                  {evento.cronograma.map((item, idx) => (
                    <div key={idx} className={styles.cronogramaItem}>
                      <span className={styles.cronoHora}>{limparHora(item.horario || item.hora)}</span>
                      <div className={styles.cronoConteudo}>
                        <strong>{item.atividade || item.tema}</strong>
                        {item.palestrante && <p className={styles.palestranteNome}>👤 {item.palestrante}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </article>
        </div>
      </main>

      {/* MODAL DE INSCRIÇÃO / CONSULTA POR CPF */}
      {modalAberto && (
        <div className={styles.modalBackdrop} onClick={(e) => e.target === e.currentTarget && handleFecharModal()}>
          <div className={styles.modalBoxContainer}>
            
            <button onClick={handleFecharModal} className={styles.modalCloseIconBtn}>
              <X size={18} />
            </button>

            {!comprovante ? (
              <div className={styles.modalFormContent}>
                
                {/* ALTERNADOR DE ABAS NO MODAL */}
                <div className={styles.modalTabsBar}>
                  <button 
                    type="button"
                    onClick={() => { setAbaModal('inscricao'); setMensagemErro(null); }}
                    className={`${styles.modalTabBtn} ${abaModal === 'inscricao' ? styles.modalTabActive : ''}`}
                  >
                    <ClipboardList size={16} /> Nova Inscrição
                  </button>
                  <button 
                    type="button"
                    onClick={() => { setAbaModal('consulta'); setMensagemErro(null); }}
                    className={`${styles.modalTabBtn} ${abaModal === 'consulta' ? styles.modalTabActive : ''}`}
                  >
                    <Search size={16} /> Emitir 2ª Via
                  </button>
                </div>

                {mensagemErro && <div className={styles.msgErro}>{mensagemErro}</div>}

                {/* ABA 1: FORMULÁRIO DE NOVA INSCRIÇÃO */}
                {abaModal === 'inscricao' && (
                  <form onSubmit={handleInscricaoSubmit} className={styles.modalFormFlex}>
                    <div className={styles.modalFormBodyFields}>
                      {camposFormulario.map((campo, idx) => {
                        const opcoesArray = Array.isArray(campo.options) 
                          ? campo.options.filter((o) => typeof o === 'string' && o.trim() !== '') 
                          : (typeof campo.options === 'string' ? campo.options.split(',').map(o => o.trim()).filter(Boolean) : []);

                        return (
                          <div key={idx} className={styles.modalFieldGroup}>
                            <label className={styles.modalFieldLabel}>
                              {campo.label} {campo.required && <span className={styles.fieldRequiredMark}>*</span>}
                            </label>

                            {campo.type === 'select' ? (
                              <select
                                required={campo.required}
                                value={respostas[campo.label] || ''}
                                onChange={(e) => handleInputChange(campo, e.target.value)}
                                className={styles.modalFieldSelect}
                              >
                                <option value="">Selecione uma opção...</option>
                                {opcoesArray.map((opcaoText, oIdx) => (
                                  <option key={oIdx} value={opcaoText}>{opcaoText}</option>
                                ))}
                              </select>
                            ) : campo.type === 'checkbox' ? (
                              opcoesArray.length > 0 ? (
                                <div className={styles.checkboxGroupWrapper}>
                                  {opcoesArray.map((opcaoText, oIdx) => {
                                    const marcado = Array.isArray(respostas[campo.label]) && respostas[campo.label].includes(opcaoText);
                                    return (
                                      <label key={oIdx} className={styles.checkboxOptionLabel}>
                                        <input
                                          type="checkbox"
                                          checked={marcado}
                                          onChange={(e) => handleCheckboxMultiChange(campo.label, opcaoText, e.target.checked)}
                                          className={styles.modalCheckboxInput}
                                        />
                                        <span>{opcaoText}</span>
                                      </label>
                                    );
                                  })}
                                </div>
                              ) : (
                                <label className={styles.checkboxOptionLabel}>
                                  <input
                                    type="checkbox"
                                    required={campo.required}
                                    checked={!!respostas[campo.label]}
                                    onChange={(e) => handleInputChange(campo, e.target.checked ? 'Sim' : '')}
                                    className={styles.modalCheckboxInput}
                                  />
                                  <span>Concordo e confirmo minha participação</span>
                                </label>
                              )
                            ) : (
                              <input 
                                type={campo.type === 'number' ? 'number' : campo.type === 'date' ? 'date' : campo.type === 'email' ? 'email' : 'text'} 
                                required={campo.required} 
                                value={respostas[campo.label] || ''} 
                                onChange={(e) => handleInputChange(campo, e.target.value)} 
                                placeholder={campo.type === 'cpf' ? '000.000.000-00' : campo.type === 'tel' ? '(00) 00000-0000' : `Informe seu ${campo.label.toLowerCase()}`}
                                className={styles.modalFieldInput}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <button type="submit" disabled={enviando} className={styles.btnConfirmarInscricao}>
                      {enviando ? <><Loader2 size={18} className="animate-spin" /> Processando...</> : <><Send size={18} /> Confirmar Inscrição</>}
                    </button>
                  </form>
                )}

                {/* ABA 2: CONSULTA POR CPF DIRETA NA PLANILHA */}
                {abaModal === 'consulta' && (
                  <form onSubmit={handleConsultarCpfSubmit} className={styles.modalFormFlex}>
                    <p className={styles.modalConsultarTexto}>
                      Informe seu CPF para localizar a inscrição realizada neste evento e emitir a 2ª via do comprovante.
                    </p>

                    <div className={styles.modalFieldGroup}>
                      <label className={styles.modalFieldLabel}>CPF do Participante*</label>
                      <input 
                        type="text" 
                        required
                        value={cpfConsulta} 
                        onChange={(e) => setCpfConsulta(aplicarMascaraCPF(e.target.value))} 
                        placeholder="000.000.000-00"
                        className={styles.modalFieldInput}
                      />
                    </div>

                    <button type="submit" disabled={buscandoCpf} className={styles.btnConfirmarInscricao}>
                      {buscandoCpf ? <><Loader2 size={18} className="animate-spin" /> Aguarde</> : <><Search size={18} /> Localizar Comprovante</>}
                    </button>
                  </form>
                )}

              </div>
            ) : (
              /* COMPROVANTE ENCONTRADO / GERADO */
              <div className={styles.comprovanteWrapper}>
                <CheckCircle size={48} className={styles.comprovanteCheckIcon} />
                <h3 className={styles.comprovanteTituloSucesso}>Comprovante de Inscrição</h3>
                <p className={styles.comprovanteSubtitulo}>Documento oficial registrado no sistema.</p>

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
                      <span>📅 <strong>Data da inscrição:</strong> {formatarDataParaExibicao(comprovante.dataHora)}</span>
                    </div>
                  </div>

                  <div className={styles.ticketGridDetails}>
                    {(() => {
                      const chavesDesejadas = [
                        { labelExibicao: 'Nome Completo', termos: ['nome', 'nome completo'] },
                        { labelExibicao: 'CPF', termos: ['cpf'] },
                        { labelExibicao: 'Data de Nascimento', termos: ['data de nascimento', 'nascimento', 'data nasc'], isDate: true },
                        { labelExibicao: 'E-mail', termos: ['e-mail', 'email'] }
                      ];

                      return chavesDesejadas.map((item, i) => {
                        const itemEncontrado = comprovante.detalhes.find((d) => {
                          const lbl = (d.label || '').toLowerCase().trim();
                          return item.termos.some((termo) => lbl.includes(termo));
                        });

                        let valorExibicao = itemEncontrado?.valor ? itemEncontrado.valor : '-';

                        if (item.isDate && valorExibicao !== '-') {
                          valorExibicao = formatarDataParaExibicao(valorExibicao);
                        }

                        return (
                          <div key={i} className={styles.ticketDetailItem}>
                            <strong className={styles.ticketDetailLabel}>{item.labelExibicao}</strong>
                            <span className={styles.ticketDetailValue}>{valorExibicao}</span>
                          </div>
                        );
                      });
                    })()}
                  </div>

                  <div className={styles.ticketFooter}>
                    <span>✓ Inscrição confirmada no sistema.</span>
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