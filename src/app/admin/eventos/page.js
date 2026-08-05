'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import modelo1Img from '@/../public/img/modelo-certificado/modelo1.png';
import modelo2Img from '@/../public/img/modelo-certificado/modelo2.png';

import { 
  ArrowLeft, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  UploadCloud, 
  Calendar, 
  Trash2, 
  List, 
  PlusCircle, 
  Pencil, 
  XCircle, 
  MapPin, 
  Clock,
  Settings,
  Plus,
  X,
  User,
  Award,
  ClipboardList,
  Download,
  CheckSquare,
  Square,
  Loader2,
  FileText
} from 'lucide-react';
import styles from './AdminEventos.module.css';

const SCRIPT_URL = process.env.NEXT_PUBLIC_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbx1tWcH_pkyhUNdR1safUWAGrlNfJWSMRqSps09p7yc5lBXO2c5iEGJXQl5Sz2bmPex/exec';

const MESES = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];

// FUNÇÃO PARA TRATAR O CAMINHO TANTO DE IMPORTAÇÃO MÓDULO QUANTO STRING
function obterSrcImagem(modeloObj) {
  if (!modeloObj) return '';
  if (typeof modeloObj.imagem === 'string') return modeloObj.imagem;
  if (modeloObj.imagem && modeloObj.imagem.src) return modeloObj.imagem.src;
  return '';
}

// CATÁLOGO DE MODELOS VINCULADO ÀS IMAGENS IMPORTADAS
const MODELOS_CERTIFICADO = {
  modelo1: {
    id: 'modelo1',
    nome: 'Modelo 1 - Plenária Municipal de Saúde',
    imagem: modelo1Img,
    gerarTexto: ({ tituloEvento, dataEvento, localEvento, cargaHoraria, cargaHorariaExtenso }) => (
      <>
        Participou da Plenária Municipal de Saúde de Muriaé, com o tema <strong className={styles.boldText}>&quot;{tituloEvento}&quot;</strong> realizada no dia {dataEvento}, no {localEvento}, em Muriaé-MG, com carga horária total de {cargaHoraria} ({cargaHorariaExtenso}) horas.
      </>
    )
  },
  modelo2: {
    id: 'modelo2',
    nome: 'Modelo 2 - Simpósio / Workshop',
    imagem: modelo2Img,
    gerarTexto: ({ tituloEvento, dataEvento, localEvento, cargaHoraria, cargaHorariaExtenso }) => (
      <>
        Concluiu com êxito a participação no Simpósio de Saúde sobre <strong className={styles.boldText}>&quot;{tituloEvento}&quot;</strong>, promovido no dia {dataEvento}, nas dependências de {localEvento}, cumprindo a carga horária de {cargaHoraria} ({cargaHorariaExtenso}) horas de atividades acadêmicas.
      </>
    )
  }
};

function formatarDataParaEnvio(dataInput) {
  if (!dataInput) return '';
  const str = String(dataInput).trim();

  if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
    const partes = str.split('T')[0].split('-');
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  return str;
}

function formatarDataParaInput(dataStr) {
  if (!dataStr) return '';
  const str = String(dataStr).trim();

  if (/^\d{2}\/\d{2}\/\d{4}/.test(str)) {
    const partes = str.split('/');
    return `${partes[2]}-${partes[1]}-${partes[0]}`;
  }

  return str;
}

function formatarDataPorExtenso(dataStr) {
  if (!dataStr) return 'data do evento';
  const str = String(dataStr).trim();

  let dia, mes, ano;

  if (/^\d{2}\/\d{2}\/\d{4}/.test(str)) {
    const partes = str.split('/');
    dia = partes[0];
    mes = parseInt(partes[1], 10) - 1;
    ano = partes[2];
  } 
  else if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
    const partes = str.split('T')[0].split('-');
    dia = partes[2];
    mes = parseInt(partes[1], 10) - 1;
    ano = partes[0];
  } else {
    return str;
  }

  const meses = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
  ];

  if (mes >= 0 && mes < 12) {
    return `${dia} de ${meses[mes]} de ${ano}`;
  }

  return str;
}

function numeroParaExtenso(numero) {
  const num = parseInt(numero, 10);
  if (isNaN(num)) return '';

  const unidades = [
    'zero', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 
    'sete', 'oito', 'nove', 'dez', 'onze', 'doze', 'treze', 
    'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'
  ];

  const dezenas = [
    '', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 
    'sessenta', 'setenta', 'oitenta', 'noventa'
  ];

  if (num < 20) {
    return unidades[num];
  }

  if (num < 100) {
    const d = Math.floor(num / 10);
    const u = num % 10;
    return u === 0 ? dezenas[d] : `${dezenas[d]} e ${unidades[u]}`;
  }

  return String(num);
}

export default function AdminEventosPage() {
  const [abaSub, setAbaSub] = useState('cadastrar');

  const [loadingForm, setLoadingForm] = useState(false);
  const [mensagem, setMensagem] = useState(null);
  const [nomeArquivo, setNomeArquivo] = useState('');
  const [eventoEmEdicao, setEventoEmEdicao] = useState(null);

  const [requerInscricao, setRequerInscricao] = useState(false);
  const [geraCertificado, setGeraCertificado] = useState(false);
  const [cronograma, setCronograma] = useState([]);

  const [formFields, setFormFields] = useState([
    { id: 1, label: 'Nome Completo', type: 'text', required: true },
    { id: 2, label: 'CPF', type: 'text', required: true },
    { id: 3, label: 'E-mail', type: 'email', required: true }
  ]);

  const [listaEventos, setListaEventos] = useState([]);
  const [loadingEventos, setLoadingEventos] = useState(false);
  const [deletandoId, setDeletandoId] = useState(null);

  const [modalCertificadoAberto, setModalCertificadoAberto] = useState(false);
  const [eventoCertificado, setEventoCertificado] = useState(null);
  const [inscritos, setInscritos] = useState([]);
  const [loadingInscritos, setLoadingInscritos] = useState(false);
  const [selecionados, setSelecionados] = useState([]);
  const [cargaHorariaGeral, setCargaHorariaGeral] = useState('8');

  const [modeloCertificadoSelecionado, setModeloCertificadoSelecionado] = useState('modelo1');

  useEffect(() => {
    async function carregarEventos() {
      setLoadingEventos(true);
      try {
        const response = await fetch(`${SCRIPT_URL}?target=EVENT&action=GET_ALL`, {
          method: 'GET',
          redirect: 'follow',
        });
        const resData = await response.json();
        if (resData.status === 'success' && resData.eventos) {
          setListaEventos(resData.eventos);
        }
      } catch (err) {
        console.error('Erro ao carregar eventos:', err);
      } finally {
        setLoadingEventos(false);
      }
    }

    if (abaSub === 'gerenciar') {
      carregarEventos();
    }
  }, [abaSub]);

  const handleAdicionarItemCronograma = () => {
    setCronograma((prev) => [...prev, { horario: '', atividade: '', palestrante: '' }]);
  };

  const handleRemoverItemCronograma = (index) => {
    setCronograma((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAlterarCronograma = (index, campo, valor) => {
    setCronograma((prev) => {
      const novo = [...prev];
      novo[index][campo] = valor;
      return novo;
    });
  };

  const handleAdicionarCampoForm = () => {
    setFormFields((prev) => [
      ...prev,
      { id: Date.now(), label: '', type: 'text', required: true }
    ]);
  };

  const handleRemoverCampoForm = (id) => {
    setFormFields((prev) => prev.filter((field) => field.id !== id));
  };

  const handleAlterarCampoForm = (id, campo, valor) => {
    setFormFields((prev) =>
      prev.map((field) => (field.id === id ? { ...field, [campo]: valor } : field))
    );
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNomeArquivo(e.target.files[0].name);
    }
  };

  const handleIniciarEdicao = (evento) => {
    setEventoEmEdicao(evento);
    setCronograma(Array.isArray(evento.cronograma) ? evento.cronograma : []);
    setRequerInscricao(!!evento.requerInscricao);
    setGeraCertificado(!!evento.geraCertificado);
    
    setFormFields(
      Array.isArray(evento.formFields) && evento.formFields.length > 0
        ? evento.formFields
        : [
            { id: 1, label: 'Nome Completo', type: 'text', required: true },
            { id: 2, label: 'CPF', type: 'text', required: true },
            { id: 3, label: 'E-mail', type: 'email', required: true }
          ]
    );

    setAbaSub('cadastrar');
    setNomeArquivo('');
    setMensagem(null);
  };

  const handleCancelarEdicao = () => {
    setEventoEmEdicao(null);
    setCronograma([]);
    setRequerInscricao(false);
    setGeraCertificado(false);
    setFormFields([
      { id: 1, label: 'Nome Completo', type: 'text', required: true },
      { id: 2, label: 'CPF', type: 'text', required: true },
      { id: 3, label: 'E-mail', type: 'email', required: true }
    ]);
    setNomeArquivo('');
    setMensagem(null);
  };

  const handleSubmitEvento = async (e) => {
    e.preventDefault();
    setLoadingForm(true);
    setMensagem(null);

    const formData = new FormData(e.target);
    const imagemInput = e.target.querySelector('input[name="imagem"]');
    const imagemArquivo = imagemInput && imagemInput.files ? imagemInput.files[0] : null;
    const isEditing = !!eventoEmEdicao;

    const dataOriginal = formData.get('dataEvento');
    const dataFormatadaEnvio = formatarDataParaEnvio(dataOriginal);

    const processarEnvio = async (base64Image = '', name = '', type = '') => {
      const payload = {
        target: 'EVENT',
        action: isEditing ? 'UPDATE' : 'CREATE',
        id: isEditing ? eventoEmEdicao.id : 'evt-' + Date.now(),
        titulo: formData.get('titulo'),
        resumo: formData.get('resumo'),
        local: formData.get('local'),
        data: dataFormatadaEnvio,
        hora: formData.get('hora'),
        categoria: formData.get('categoria'),
        descricao: formData.get('descricao'),
        requerInscricao: requerInscricao,
        geraCertificado: requerInscricao ? geraCertificado : false,
        formFields: requerInscricao 
          ? formFields.filter((f) => f.label && f.label.trim() !== '') 
          : [],
        cronograma: cronograma.filter(
          (item) => (item.horario && item.horario.trim() !== '') || (item.atividade && item.atividade.trim() !== '')
        ),
        imagemBase64: base64Image,
        imagemNome: name,
        imagemType: type
      };

      try {
        const response = await fetch(SCRIPT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload),
        });

        const resData = await response.json();

        if (resData.status === 'success') {
          localStorage.removeItem('cache_portal_eventos');

          setMensagem({ 
            tipo: 'sucesso', 
            texto: isEditing ? 'Evento atualizado com sucesso!' : 'Evento publicado com sucesso na planilha e no portal!' 
          });

          if (!isEditing) {
            e.target.reset();
            setCronograma([]);
            setRequerInscricao(false);
            setGeraCertificado(false);
            setNomeArquivo('');
          } else {
            handleCancelarEdicao();
            setAbaSub('gerenciar');
          }
        } else {
          setMensagem({ tipo: 'erro', texto: 'Erro ao salvar evento: ' + resData.message });
        }
      } catch (err) {
        console.error(err);
        setMensagem({ tipo: 'erro', texto: 'Falha na comunicação com o servidor de eventos.' });
      } finally {
        setLoadingForm(false);
      }
    };

    if (imagemArquivo) {
      const reader = new FileReader();
      reader.readAsDataURL(imagemArquivo);
      reader.onloadend = () => {
        const base64Image = reader.result.split(',')[1];
        processarEnvio(base64Image, imagemArquivo.name, imagemArquivo.type);
      };
    } else {
      processarEnvio();
    }
  };

  const handleDeletarEvento = async (id, titulo) => {
    const confirmou = window.confirm(`Tem certeza que deseja remover o evento:\n"${titulo}"?`);
    if (!confirmou) return;

    setDeletandoId(id);

    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          target: 'EVENT',
          action: 'DELETE',
          id: id
        })
      });

      const resData = await response.json();

      if (resData.status === 'success') {
        localStorage.removeItem('cache_portal_eventos');
        alert('Evento excluído com sucesso!');
        setListaEventos((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert('Erro ao excluir: ' + resData.message);
      }
    } catch (err) {
      console.error(err);
      alert('Ocorreu um erro ao tentar excluir o evento.');
    } finally {
      setDeletandoId(null);
    }
  };

  const handleAbrirEmissorCertificado = async (evento) => {
    setEventoCertificado(evento);
    setInscritos([]);
    setSelecionados([]);
    setModeloCertificadoSelecionado('modelo1');
    setModalCertificadoAberto(true);
    setLoadingInscritos(true);

    try {
      const url = `${SCRIPT_URL}?action=GET_INSCRITOS&eventoTitulo=${encodeURIComponent(evento.titulo)}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.status === 'success' && Array.isArray(data.inscritos)) {
        setInscritos(data.inscritos);
      } else {
        setInscritos([]);
      }
    } catch (err) {
      console.error('Erro ao buscar inscritos:', err);
      setInscritos([]);
    } finally {
      setLoadingInscritos(false);
    }
  };

  const handleToggleSelecionarTudo = () => {
    if (selecionados.length === inscritos.length) {
      setSelecionados([]);
    } else {
      setSelecionados(inscritos.map((_, idx) => idx));
    }
  };

  const handleToggleInscrito = (index) => {
    setSelecionados((prev) => 
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleImprimirCertificados = () => {
    if (selecionados.length === 0) {
      alert('Selecione pelo menos um participante para gerar o certificado.');
      return;
    }
    window.print();
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        
        <div className={styles.headerBar}>
          <div>
            <span className={styles.badgeHeader}>
              <Calendar size={14} /> Módulo Exclusivo de Eventos
            </span>
            <h1 className={styles.mainTitle}>Gerenciador de Eventos</h1>
            <p className={styles.subTitle}>Cadastre e acompanhe mutirões, campanhas e ações de saúde pública.</p>
          </div>

          <Link href="/admin" className={styles.backLink}>
            <ArrowLeft size={16} /> Voltar ao Painel
          </Link>
        </div>

        <div className={styles.subTabContainer}>
          <button
            onClick={() => { handleCancelarEdicao(); setAbaSub('cadastrar'); }}
            className={`${styles.subTabBtn} ${abaSub === 'cadastrar' && !eventoEmEdicao ? styles.subTabCadastrarActive : ''}`}
          >
            <PlusCircle size={16} /> Cadastrar Novo Evento
          </button>

          <button
            onClick={() => setAbaSub('gerenciar')}
            className={`${styles.subTabBtn} ${abaSub === 'gerenciar' ? styles.subTabGerenciarActive : ''}`}
          >
            <List size={16} /> Ver e Gerenciar Eventos
          </button>
        </div>

        {mensagem && (
          <div className={`${styles.alertMessage} ${mensagem.tipo === 'sucesso' ? styles.alertSucesso : styles.alertErro}`}>
            {mensagem.tipo === 'sucesso' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            {mensagem.texto}
          </div>
        )}

        {abaSub === 'cadastrar' && (
          <form onSubmit={handleSubmitEvento}>
            {eventoEmEdicao && (
              <div className={styles.editModeBanner}>
                <div><strong>Editando evento:</strong> {`"${eventoEmEdicao.titulo}"`}</div>
                <button type="button" onClick={handleCancelarEdicao} className={styles.cancelEditBtn}>
                  <XCircle size={16} /> Cancelar Edição
                </button>
              </div>
            )}

            <div className={styles.formGrid}>
              <div className={styles.cardSection}>
                <h2 className={styles.sectionTitle}>
                  <Calendar size={20} color="#0065a4" /> 
                  {eventoEmEdicao ? 'Editar Informações do Evento' : 'Informações do Evento'}
                </h2>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Título do Evento*</label>
                  <input type="text" name="titulo" required defaultValue={eventoEmEdicao?.titulo || ''} placeholder="Ex: Mutirão de Vacinação contra a Gripe" className={styles.input} />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Breve Resumo (Exibido no Card do Site)*</label>
                  <input 
                    type="text" 
                    name="resumo" 
                    required 
                    maxLength={150} 
                    defaultValue={eventoEmEdicao?.resumo || ''} 
                    placeholder="Resumo de até 2 linhas que aparecerá no card do portal..." 
                    className={styles.input} 
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Local / Endereço Completo*</label>
                  <input type="text" name="local" required defaultValue={eventoEmEdicao?.local || ''} placeholder="Ex: UBS Centro - Av. Juscelino Kubitschek" className={styles.input} />
                </div>

                <div className={styles.rowTwoCols}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Data do Evento*</label>
                    <input 
                      type="date" 
                      name="dataEvento" 
                      required 
                      defaultValue={formatarDataParaInput(eventoEmEdicao?.data)} 
                      className={styles.input} 
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Horário de Atendimento*</label>
                    <input type="text" name="hora" required defaultValue={eventoEmEdicao?.hora || ''} placeholder="Ex: 08:00 às 17:00" className={styles.input} />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Descrição Completa / Orientação ao Cidadão*</label>
                  <textarea name="descricao" rows={5} required defaultValue={eventoEmEdicao?.descricao || ''} placeholder="Informe detalhes do evento, documentos necessários, público-alvo..." className={styles.textarea} />
                </div>

                <div className={styles.sectionDivider}>
                  <h3 className={styles.subSectionTitle}>
                    <ClipboardList size={18} color="#0065a4" /> Configuração de Inscrição
                  </h3>

                  <div className={styles.flexColumnGap12}>
                    <label className={styles.checkboxLabelDark}>
                      <input 
                        type="checkbox" 
                        checked={requerInscricao} 
                        onChange={(e) => {
                          setRequerInscricao(e.target.checked);
                          if (!e.target.checked) setGeraCertificado(false);
                        }} 
                        className={styles.checkboxInput}
                      />
                      Requer Inscrição prévia dos participantes?
                    </label>

                    {requerInscricao && (
                      <>
                        <label className={styles.checkboxLabelBlue}>
                          <input 
                            type="checkbox" 
                            checked={geraCertificado} 
                            onChange={(e) => setGeraCertificado(e.target.checked)} 
                            className={styles.checkboxInput}
                          />
                          <Award size={18} color="#0284c7" />
                          Emitir Certificado para este evento?
                        </label>

                        <div className={styles.formFieldsContainer}>
                          <div className={styles.formFieldsHeader}>
                            <div>
                              <h4 className={styles.formFieldsTitle}>Campos do Formulário de Inscrição</h4>
                              <p className={styles.formFieldsSubtitle}>Monte as perguntas que os inscritos deverão responder.</p>
                            </div>
                            <button 
                              type="button" 
                              onClick={handleAdicionarCampoForm} 
                              className={styles.addBtnSmall}
                            >
                              <Plus size={15} /> Adicionar Campo
                            </button>
                          </div>

                          {formFields.map((field) => (
                            <div key={field.id} className={styles.fieldGridRow}>
                              <input 
                                type="text" 
                                placeholder="Nome do Campo (ex: Profissão, Telefone...)" 
                                value={field.label} 
                                onChange={(e) => handleAlterarCampoForm(field.id, 'label', e.target.value)} 
                                className={styles.input} 
                              />
                              <select 
                                value={field.type} 
                                onChange={(e) => handleAlterarCampoForm(field.id, 'type', e.target.value)} 
                                className={styles.select}
                              >
                                <option value="text">Texto</option>
                                <option value="email">E-mail</option>
                                <option value="number">Número</option>
                                <option value="date">Data</option>
                              </select>
                              <label className={styles.checkboxLabelSmall}>
                                <input 
                                  type="checkbox" 
                                  checked={field.required} 
                                  onChange={(e) => handleAlterarCampoForm(field.id, 'required', e.target.checked)} 
                                /> Obrig.
                              </label>
                              <button 
                                type="button" 
                                onClick={() => handleRemoverCampoForm(field.id)} 
                                className={styles.deleteSquareBtn}
                                title="Remover Campo"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className={styles.sectionDividerSpaced}>
                  <div className={styles.subSectionHeader}>
                    <div>
                      <h3 className={styles.subSectionTitle}>Cronograma & Palestras (Opcional)</h3>
                      <p className={styles.formFieldsSubtitle}>Adicione palestras, horários e responsáveis.</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={handleAdicionarItemCronograma}
                      className={styles.addBtnMedium}
                    >
                      <Plus size={16} /> Adicionar Horário
                    </button>
                  </div>

                  {cronograma.map((item, idx) => (
                    <div key={idx} className={styles.cronogramaCard}>
                      <div className={styles.cronogramaGridRow}>
                        <input 
                          type="text" 
                          placeholder="Horário (09:00)" 
                          value={item.horario} 
                          onChange={(e) => handleAlterarCronograma(idx, 'horario', e.target.value)} 
                          className={styles.input} 
                        />
                        <input 
                          type="text" 
                          placeholder="Título da Palestra / Atividade*" 
                          value={item.atividade} 
                          onChange={(e) => handleAlterarCronograma(idx, 'atividade', e.target.value)} 
                          className={styles.input} 
                        />
                        <button 
                          type="button" 
                          onClick={() => handleRemoverItemCronograma(idx)}
                          className={styles.deleteSquareBtn}
                          title="Remover"
                        >
                          <X size={18} />
                        </button>
                      </div>

                      <div className={styles.flexRowCenterGap8}>
                        <User size={16} color="#64748b" />
                        <input 
                          type="text" 
                          placeholder="Palestrante / Responsável (Opcional)" 
                          value={item.palestrante || ''} 
                          onChange={(e) => handleAlterarCronograma(idx, 'palestrante', e.target.value)} 
                          className={`${styles.input} ${styles.fontSize13}`} 
                        />
                      </div>
                    </div>
                  ))}
                </div>

              </div>

              <div className={styles.rightColumn}>
                <div className={styles.cardSection}>
                  <h2 className={styles.sectionTitle}><UploadCloud size={20} color="#0065a4" /> Capa / Banner do Evento</h2>
                  <div className={styles.dropZone}>
                    <UploadCloud size={36} className={styles.uploadIcon} />
                    <div className={styles.uploadText}>{eventoEmEdicao ? 'Clique para trocar imagem' : 'Clique para selecionar'}</div>
                    <div className={styles.uploadSubtext}>Formatos JPG, PNG ou WEBP</div>
                    {nomeArquivo ? <span className={styles.fileNameBadge}>📷 {nomeArquivo}</span> : eventoEmEdicao?.imgSrc || eventoEmEdicao?.imagem ? <span className={styles.fileNameBadge}>📷 Imagem mantida</span> : null}
                    <input type="file" name="imagem" accept="image/*" onChange={handleFileChange} className={styles.fileInputHidden} />
                  </div>
                </div>

                <div className={styles.cardSection}>
                  <h2 className={styles.sectionTitle}><Settings size={20} color="#0065a4" /> Classificação</h2>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Categoria do Evento*</label>
                    <select name="categoria" className={styles.select} defaultValue={eventoEmEdicao?.categoria || 'Mutirão'}>
                      <option value="Mutirão">Mutirão de Saúde</option>
                      <option value="Vacinação">Campanha de Vacinação</option>
                      <option value="Palestra">Palestra / Workshop</option>
                      <option value="Ação Comunitária">Ação Comunitária</option>
                    </select>
                  </div>

                  <button type="submit" disabled={loadingForm} className={styles.submitBtn}>
                    {loadingForm ? 'Salvando na planilha...' : eventoEmEdicao ? <><Pencil size={18} /> Salvar Alterações</> : <><Send size={18} /> Publicar Evento</>}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        {abaSub === 'gerenciar' && (
          <div className={styles.cardSection}>
            <h2 className={styles.sectionTitle}><List size={20} color="#0065a4" /> Eventos Cadastrados no Portal</h2>
            {loadingEventos ? (
              <p className={styles.loadingText}>Carregando lista de eventos...</p>
            ) : listaEventos.length > 0 ? (
              <div className={styles.newsListContainer}>
                {listaEventos.map((item) => {
                  return (
                    <div key={item.id} className={styles.newsItemRow}>
                      <div className={styles.newsItemContent}>
                        {/* CAPA LIMPA SEM BADGE DE DATA */}
                        <div className={styles.imageThumbnailWrapper}>
                          <Image 
                            src={item.imgSrc || item.imagem || '/img/eventos/simposio.png'} 
                            alt={item.titulo || 'Capa do Evento'} 
                            fill 
                            className={styles.thumbnailImg} 
                            unoptimized 
                          />
                        </div>
                        <div>
                          <span className={styles.newsMetaText}>
                            {item.categoria} {item.requerInscricao && ' • Inscrição'} {item.geraCertificado && ' • 📜 Certificado'}
                          </span>
                          <h3 className={styles.newsItemTitle}>{item.titulo}</h3>
                          <div className={styles.eventDetailsRow}>
                            <span><MapPin size={12} /> {item.local}</span>
                            <span><Clock size={12} /> {item.hora}</span>
                          </div>
                        </div>
                      </div>

                      <div className={styles.actionButtonsGroup}>
                        {item.geraCertificado && (
                          <button 
                            onClick={() => handleAbrirEmissorCertificado(item)} 
                            className={styles.emitCertificateBtn}
                          >
                            <Award size={15} /> Emitir Certificados
                          </button>
                        )}
                        
                        <button onClick={() => handleIniciarEdicao(item)} className={styles.editBtn}>
                          <Pencil size={15} /> Editar
                        </button>
                        <button onClick={() => handleDeletarEvento(item.id, item.titulo)} disabled={deletandoId === item.id} className={styles.deleteBtn}>
                          <Trash2 size={15} /> {deletandoId === item.id ? 'Excluindo...' : 'Remover'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className={styles.emptyText}>Nenhum evento cadastrado no momento.</p>
            )}
          </div>
        )}

      </div>

      {modalCertificadoAberto && eventoCertificado && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            
            <button 
              onClick={() => setModalCertificadoAberto(false)} 
              className={styles.closeModalBtn}
            >
              <X size={18} />
            </button>

            <div className={styles.marginBottom16}>
              <span className={styles.modalBadgeText}>EMISSÃO EM LOTE</span>
              <h3 className={styles.modalTitle}>
                <Award color="#0284c7" size={22} /> Certificados: {eventoCertificado.titulo}
              </h3>
            </div>

            <div className={styles.modalControlsBox}>
              <div>
                <label className={styles.modalLabelWithIcon}>
                  <FileText size={14} /> Modelo / Layout do Certificado:
                </label>
                <select 
                  value={modeloCertificadoSelecionado}
                  onChange={(e) => setModeloCertificadoSelecionado(e.target.value)}
                  className={styles.modalSelect}
                >
                  {Object.values(MODELOS_CERTIFICADO).map((mod) => (
                    <option key={mod.id} value={mod.id}>
                      {mod.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={styles.modalLabelBlock}>
                  Carga Horária Geral:
                </label>
                <input 
                  type="text" 
                  value={cargaHorariaGeral} 
                  onChange={(e) => setCargaHorariaGeral(e.target.value)}
                  className={styles.modalInputCargaHoraria}
                />
              </div>
            </div>

            <div className={styles.modalSelectionBar}>
              <div className={styles.flexRowCenterGap10}>
                <button 
                  type="button"
                  onClick={handleToggleSelecionarTudo}
                  className={styles.toggleAllBtn}
                >
                  {selecionados.length === inscritos.length && inscritos.length > 0 ? <CheckSquare size={16} color="#0284c7" /> : <Square size={16} />} 
                  {selecionados.length === inscritos.length && inscritos.length > 0 ? 'Desmarcar Todos' : 'Selecionar Todos'}
                </button>
                <span className={styles.selectedCountText}>
                  {selecionados.length} de {inscritos.length} selecionado(s)
                </span>
              </div>
            </div>

            <div className={styles.tableScrollWrapper}>
              {loadingInscritos ? (
                <div className={styles.loadingInscritosBox}>
                  <Loader2 size={20} className="animate-spin" /> Buscando inscritos da planilha...
                </div>
              ) : inscritos.length > 0 ? (
                <table className={styles.inscritosTable}>
                  <thead>
                    <tr>
                      <th className={styles.colIndex}>#</th>
                      <th>Nome / Participante</th>
                      <th>CPF / Documento</th>
                      <th>Código</th>
                      <th className={styles.textCenter}>Gerar?</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inscritos.map((p, idx) => {
                      const isSelected = selecionados.includes(idx);
                      
                      const extrairValor = (termosBusca) => {
                        const chaveEncontrada = Object.keys(p).find((key) => {
                          const k = key.toLowerCase().trim();
                          return termosBusca.some((termo) => k.includes(termo.toLowerCase()));
                        });
                        return chaveEncontrada ? p[chaveEncontrada] : null;
                      };

                      const nome = extrairValor(['nome completo', 'nome']) || 'Participante';
                      const cpf = extrairValor(['cpf']) || '-';
                      const codigo = p['Código Inscrição'] || extrairValor(['código', 'codigo']) || '-';

                      return (
                        <tr key={idx} className={isSelected ? styles.selectedRow : ''}>
                          <td className={styles.colIndexText}>{idx + 1}</td>
                          <td className={styles.nomeParticipanteText}>{nome}</td>
                          <td className={styles.cpfText}>{cpf}</td>
                          <td className={styles.codigoText}>{codigo}</td>
                          <td className={styles.textCenter}>
                            <input 
                              type="checkbox" 
                              checked={isSelected} 
                              onChange={() => handleToggleInscrito(idx)} 
                              className={styles.checkboxInputLarge}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className={styles.emptyInscritosBox}>
                  Nenhum participante inscrito encontrado para este evento.
                </div>
              )}
            </div>

            {/* AREA IMPRESSÃO DAS IMAGENS DAS PÁGINAS */}
            <div id="certificados-em-lote-print" className={styles.hiddenPrintContainer}>
              {selecionados.map((idxSelect) => {
                const p = inscritos[idxSelect];
                if (!p) return null;

                const extrairValor = (termosBusca) => {
                  const chaveEncontrada = Object.keys(p).find((key) => {
                    const k = key.toLowerCase().trim();
                    return termosBusca.some((termo) => k.includes(termo.toLowerCase()));
                  });
                  return chaveEncontrada ? p[chaveEncontrada] : null;
                };

                const nome = extrairValor(['nome completo', 'nome']) || 'NOME DO PARTICIPANTE';
                const codigo = p['Código Inscrição'] || extrairValor(['código', 'codigo']) || eventoCertificado.id;

                const tituloEvento = eventoCertificado?.titulo || 'Título do Evento';
                const dataEvento = formatarDataPorExtenso(eventoCertificado?.data);
                const localEvento = eventoCertificado?.local || 'Local';
                
                const cargaHoraria = cargaHorariaGeral || '8';
                const cargaHorariaExtenso = numeroParaExtenso(cargaHoraria);

                const modeloAtual = MODELOS_CERTIFICADO[modeloCertificadoSelecionado] || MODELOS_CERTIFICADO.modelo1;
                const srcImagemTratada = obterSrcImagem(modeloAtual);

                return (
                  <div 
                    key={idxSelect}
                    className={styles.certificadoPageSingle}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={srcImagemTratada} 
                      alt={modeloAtual?.nome || 'Certificado'}
                      className={styles.certificadoBgImage}
                    />

                    <div className={styles.certificadoNomeWrapper}>
                      <h2 className={styles.certificadoNomeText}>
                        {nome}
                      </h2>
                    </div>

                    <div className={styles.certificadoTextoWrapper}>
                      <p className={styles.certificadoTextoParagraph}>
                        {typeof modeloAtual?.gerarTexto === 'function' && modeloAtual.gerarTexto({
                          tituloEvento,
                          dataEvento,
                          localEvento,
                          cargaHoraria,
                          cargaHorariaExtenso
                        })}
                      </p>
                    </div>

                    <div className={styles.certificadoAutenticidadeText}>
                      AUTENTICIDADE: CERT-{codigo}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={styles.flexRowGap12}>
              <button 
                onClick={handleImprimirCertificados}
                disabled={selecionados.length === 0}
                className={styles.downloadCertificatesBtn}
              >
                <Download size={18} /> Baixar Certificado(s) Selecionado(s) ({selecionados.length})
              </button>
              <button 
                onClick={() => setModalCertificadoAberto(false)} 
                className={styles.closeModalSecondaryBtn}
              >
                Fechar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}