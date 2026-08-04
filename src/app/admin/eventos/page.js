'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  Loader2
} from 'lucide-react';
import styles from './AdminEventos.module.css';

const SCRIPT_URL = process.env.NEXT_PUBLIC_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbx1tWcH_pkyhUNdR1safUWAGrlNfJWSMRqSps09p7yc5lBXO2c5iEGJXQl5Sz2bmPex/exec';

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

  // Trata formato DD/MM/YYYY
  if (/^\d{2}\/\d{2}\/\d{4}/.test(str)) {
    const partes = str.split('/');
    dia = partes[0];
    mes = parseInt(partes[1], 10) - 1;
    ano = partes[2];
  } 
  // Trata formato YYYY-MM-DD
  else if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
    const partes = str.split('T')[0].split('-');
    dia = partes[2];
    mes = parseInt(partes[1], 10) - 1;
    ano = partes[0];
  } else {
    return str; // Se já vier em texto ou outro formato, retorna como está
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

  // ESTADO DOS CAMPOS DINÂMICOS DO FORMULÁRIO DE INSCRIÇÃO
  const [formFields, setFormFields] = useState([
    { id: 1, label: 'Nome Completo', type: 'text', required: true },
    { id: 2, label: 'CPF', type: 'text', required: true },
    { id: 3, label: 'E-mail', type: 'email', required: true }
  ]);

  const [listaEventos, setListaEventos] = useState([]);
  const [loadingEventos, setLoadingEventos] = useState(false);
  const [deletandoId, setDeletandoId] = useState(null);

  // ESTADOS DO GERADOR E SELEÇÃO DE CERTIFICADOS
  const [modalCertificadoAberto, setModalCertificadoAberto] = useState(false);
  const [eventoCertificado, setEventoCertificado] = useState(null);
  const [inscritos, setInscritos] = useState([]);
  const [loadingInscritos, setLoadingInscritos] = useState(false);
  const [selecionados, setSelecionados] = useState([]);
  const [cargaHorariaGeral, setCargaHorariaGeral] = useState('8');

  // BUSCA EVENTOS QUANDO A ABA "GERENCIAR" FOR SELECIONADA
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

  // CRONOGRAMA
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

  // CAMPOS DINÂMICOS
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

  // BUSCA OS INSCRITOS DA PLANILHA PARA A EMISSÃO DE CERTIFICADOS
  const handleAbrirEmissorCertificado = async (evento) => {
    setEventoCertificado(evento);
    setInscritos([]);
    setSelecionados([]);
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

  // SELEÇÃO INDIVIDUAL E EM LOTE
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

                {/* CONFIGURAÇÃO DE INSCRIÇÃO E CERTIFICADO */}
                <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ClipboardList size={18} color="#0065a4" /> Configuração de Inscrição
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#334155' }}>
                      <input 
                        type="checkbox" 
                        checked={requerInscricao} 
                        onChange={(e) => {
                          setRequerInscricao(e.target.checked);
                          if (!e.target.checked) setGeraCertificado(false);
                        }} 
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                      Requer Inscrição prévia dos participantes?
                    </label>

                    {requerInscricao && (
                      <>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#0369a1', marginLeft: '28px', backgroundColor: '#f0f9ff', padding: '10px 14px', borderRadius: '8px', border: '1px solid #bae6fd' }}>
                          <input 
                            type="checkbox" 
                            checked={geraCertificado} 
                            onChange={(e) => setGeraCertificado(e.target.checked)} 
                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                          />
                          <Award size={18} color="#0284c7" />
                          Emitir Certificado para este evento?
                        </label>

                        <div style={{ marginTop: '16px', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <div>
                              <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>Campos do Formulário de Inscrição</h4>
                              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>Monte as perguntas que os inscritos deverão responder.</p>
                            </div>
                            <button 
                              type="button" 
                              onClick={handleAdicionarCampoForm} 
                              style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#e0f2fe', color: '#0369a1', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
                            >
                              <Plus size={15} /> Adicionar Campo
                            </button>
                          </div>

                          {formFields.map((field) => (
                            <div key={field.id} style={{ display: 'grid', gridTemplateColumns: '1fr 120px 85px 38px', gap: '8px', marginBottom: '10px', alignItems: 'center' }}>
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
                              <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                                <input 
                                  type="checkbox" 
                                  checked={field.required} 
                                  onChange={(e) => handleAlterarCampoForm(field.id, 'required', e.target.checked)} 
                                /> Obrig.
                              </label>
                              <button 
                                type="button" 
                                onClick={() => handleRemoverCampoForm(field.id)} 
                                style={{ backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '6px', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
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

                {/* CRONOGRAMA */}
                <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Cronograma & Palestras (Opcional)</h3>
                      <p style={{ fontSize: '13px', color: '#64748b', margin: '2px 0 0 0' }}>Adicione palestras, horários e responsáveis.</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={handleAdicionarItemCronograma}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#e0f2fe', color: '#0369a1', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
                    >
                      <Plus size={16} /> Adicionar Horário
                    </button>
                  </div>

                  {cronograma.map((item, idx) => (
                    <div key={idx} style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', marginBottom: '12px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr 40px', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
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
                          style={{ backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '6px', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                          title="Remover"
                        >
                          <X size={18} />
                        </button>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <User size={16} color="#64748b" />
                        <input 
                          type="text" 
                          placeholder="Palestrante / Responsável (Opcional)" 
                          value={item.palestrante || ''} 
                          onChange={(e) => handleAlterarCronograma(idx, 'palestrante', e.target.value)} 
                          className={styles.input} 
                          style={{ fontSize: '13px' }}
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
                {listaEventos.map((item) => (
                  <div key={item.id} className={styles.newsItemRow}>
                    <div className={styles.newsItemContent}>
                      <div className={styles.imageThumbnailWrapper}>
                        <Image src={item.imgSrc || item.imagem || '/img/eventos/simposio.png'} alt={item.titulo} fill className={styles.thumbnailImg} unoptimized />
                      </div>
                      <div>
                        <span className={styles.newsMetaText}>
                          {item.categoria} {item.requerInscricao && ' • Inscrição'} {item.geraCertificado && ' • 📜 Certificado'}
                        </span>
                        <h3 className={styles.newsItemTitle}>{item.titulo}</h3>
                        <div className={styles.eventDetailsRow}>
                          <span><MapPin size={12} /> {item.local}</span>
                          <span><Clock size={12} /> {item.data} - {item.hora}</span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.actionButtonsGroup}>
                      {item.geraCertificado && (
                        <button 
                          onClick={() => handleAbrirEmissorCertificado(item)} 
                          style={{ backgroundColor: '#0284c7', color: '#ffffff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
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
                ))}
              </div>
            ) : (
              <p className={styles.emptyText}>Nenhum evento cadastrado no momento.</p>
            )}
          </div>
        )}

      </div>

      {/* ========================================================================== */}
      {/* MODAL DE LISTAGEM DE INSCRITOS E GERADOR DE CERTIFICADOS */}
      {/* ========================================================================== */}
      {modalCertificadoAberto && eventoCertificado && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '20px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', maxWidth: '900px', width: '100%', padding: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', position: 'relative', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
            
            <button 
              onClick={() => setModalCertificadoAberto(false)} 
              style={{ position: 'absolute', top: '16px', right: '16px', background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
            >
              <X size={18} />
            </button>

            <div style={{ marginBottom: '16px' }}>
              <span style={{ fontSize: '12px', fontWeight: '800', color: '#0284c7', textTransform: 'uppercase' }}>EMISSÃO EM LOTE</span>
              <h3 style={{ margin: '2px 0 0 0', color: '#0f172a', fontSize: '20px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award color="#0284c7" size={22} /> Certificados: {eventoCertificado.titulo}
              </h3>
            </div>

            {/* SELEÇÃO E CONFIGURAÇÃO DA CARGA HORÁRIA */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '16px', backgroundColor: '#f8fafc', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button 
                  type="button"
                  onClick={handleToggleSelecionarTudo}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', color: '#334155' }}
                >
                  {selecionados.length === inscritos.length && inscritos.length > 0 ? <CheckSquare size={16} color="#0284c7" /> : <Square size={16} />} 
                  {selecionados.length === inscritos.length && inscritos.length > 0 ? 'Desmarcar Todos' : 'Selecionar Todos'}
                </button>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#0284c7' }}>
                  {selecionados.length} de {inscritos.length} selecionado(s)
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Carga Horária Geral:</label>
                <input 
                  type="text" 
                  value={cargaHorariaGeral} 
                  onChange={(e) => setCargaHorariaGeral(e.target.value)}
                  style={{ width: '70px', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 'bold' }}
                />
              </div>
            </div>

            {/* LISTA DE PARTICIPANTES COM SELEÇÃO */}
            <div style={{ overflowY: 'auto', flexGrow: 1, border: '1px solid #e2e8f0', borderRadius: '10px', marginBottom: '16px' }}>
              {loadingInscritos ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <Loader2 size={20} className="animate-spin" /> Buscando inscritos da planilha...
                </div>
              ) : inscritos.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #cbd5e1', color: '#475569' }}>
                      <th style={{ padding: '10px 14px', width: '40px' }}>#</th>
                      <th style={{ padding: '10px 14px' }}>Nome / Participante</th>
                      <th style={{ padding: '10px 14px' }}>CPF / Documento</th>
                      <th style={{ padding: '10px 14px' }}>Código</th>
                      <th style={{ padding: '10px 14px', textAlign: 'center' }}>Gerar?</th>
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
                        <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: isSelected ? '#f0f9ff' : 'transparent' }}>
                          <td style={{ padding: '10px 14px', color: '#64748b' }}>{idx + 1}</td>
                          <td style={{ padding: '10px 14px', fontWeight: '700', color: '#0f172a' }}>{nome}</td>
                          <td style={{ padding: '10px 14px', color: '#334155' }}>{cpf}</td>
                          <td style={{ padding: '10px 14px', color: '#0284c7', fontWeight: 'bold' }}>{codigo}</td>
                          <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                            <input 
                              type="checkbox" 
                              checked={isSelected} 
                              onChange={() => handleToggleInscrito(idx)} 
                              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                  Nenhum participante inscrito encontrado para este evento.
                </div>
              )}
            </div>

            {/* ÁREA DE IMPRESSÃO EM LOTE (FONTE MONTSERRAT 17PX - CARGA HORÁRIA E EXTENSO DINÂMICOS) */}
            <div id="certificados-em-lote-print" style={{ display: 'none' }}>
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
                
                // CARGA HORÁRIA E SEU EXTENSO DINÂMICO
                const cargaHoraria = cargaHorariaGeral || '8';
                const cargaHorariaExtenso = numeroParaExtenso(cargaHoraria);

                return (
                  <div 
                    key={idxSelect}
                    className={styles.certificadoPageSingle}
                    style={{
                      width: '297mm',
                      height: '210mm',
                      position: 'relative',
                      pageBreakAfter: 'always',
                      breakAfter: 'page',
                      boxSizing: 'border-box',
                      overflow: 'hidden',
                      backgroundColor: '#ffffff'
                    }}
                  >
                    {/* 1. IMAGEM DO MODELO OFICIAL */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src="/img/modelo-certificado.png" 
                      alt="Modelo Certificado"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'fill',
                        zIndex: 1
                      }}
                    />

                    {/* 2. NOME DO PARTICIPANTE */}
                    <div style={{
                      position: 'absolute',
                      top: '32.5%',
                      left: '8%',
                      width: '84%',
                      textAlign: 'center',
                      zIndex: 2
                    }}>
                      <h2 style={{
                        fontSize: '30px',
                        fontWeight: '900',
                        color: '#000000',
                        fontFamily: "'Montserrat', sans-serif",
                        margin: 0,
                        padding: 0,
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                      }}>
                        {nome}
                      </h2>
                    </div>

                    {/* 3. PARÁGRAFO CORRIDO (MONTSERRAT 17PX, APENAS TÍTULO EM NEGRITO) */}
                    <div style={{
                      position: 'absolute',
                      top: '43%',
                      left: '8%',
                      width: '84%',
                      zIndex: 2
                    }}>
                      <p style={{
                        fontSize: '17px',
                        color: '#000000',
                        lineHeight: '1.75',
                        textAlign: 'justify',
                        fontFamily: "'Montserrat', sans-serif",
                        margin: 0,
                        padding: 0,
                        fontWeight: '400',
                        display: 'block',
                        width: '100%'
                      }}>
                        Participou da Plenária Municipal de Saúde de Muriaé, com o tema <strong style={{ fontWeight: '800' }}>&quot;{tituloEvento}&quot;</strong> realizada no dia {dataEvento}, no {localEvento}, em Muriaé-MG, com carga horária total de {cargaHoraria} ({cargaHorariaExtenso}) horas.
                      </p>
                    </div>

                    {/* 4. CÓDIGO DE AUTENTICIDADE */}
                    <div style={{
                      position: 'absolute',
                      bottom: '12px',
                      right: '25px',
                      fontSize: '9px',
                      fontWeight: '700',
                      color: '#475569',
                      zIndex: 2,
                      fontFamily: "'Montserrat', sans-serif"
                    }}>
                      AUTENTICIDADE: CERT-{codigo}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* BOTÕES DE AÇÃO */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={handleImprimirCertificados}
                disabled={selecionados.length === 0}
                style={{ flex: 1, backgroundColor: selecionados.length > 0 ? '#0284c7' : '#94a3b8', color: '#ffffff', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 'bold', fontSize: '15px', cursor: selecionados.length > 0 ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Download size={18} /> Baixar Certificado(s) Selecionado(s) ({selecionados.length})
              </button>
              <button 
                onClick={() => setModalCertificadoAberto(false)} 
                style={{ backgroundColor: '#e2e8f0', color: '#334155', border: 'none', padding: '14px 24px', borderRadius: '8px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}
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