'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import JSZip from 'jszip';

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
  FileText,
  Printer,
  Ticket,
  ShieldCheck,
  Table,
  Lock,
  Unlock,
  AlertTriangle,
  Archive,
  Users,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import styles from './AdminEventos.module.css';

const SCRIPT_URL = process.env.NEXT_PUBLIC_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbx1tWcH_pkyhUNdR1safUWAGrlNfJWSMRqSps09p7yc5lBXO2c5iEGJXQl5Sz2bmPex/exec';

function formatarCaminhoImagemModelo(caminho) {
  if (!caminho || typeof caminho !== 'string' || caminho === 'undefined') {
    return '/img/eventos/simposio.png';
  }
  let url = caminho.trim();

  if (url.includes('drive.google.com') || url.includes('googleusercontent.com')) {
    let fileId = '';
    if (url.includes('/d/')) fileId = url.split('/d/')[1].split('/')[0].split('?')[0];
    else if (url.includes('id=')) fileId = url.split('id=')[1].split('&')[0];
    if (fileId) return `https://lh3.googleusercontent.com/d/${fileId}`;
  }

  if (!url.startsWith('/') && !url.startsWith('http')) {
    return `/${url}`;
  }

  return url;
}

function limparHora(horaBruta) {
  if (!horaBruta) return '';
  const str = String(horaBruta).trim();
  if (str.includes('1899') || str.includes('GMT') || str.includes('Sat Dec') || str.includes('Sun Dec')) {
    const matchHora = str.match(/\d{2}:\d{2}/);
    return matchHora ? matchHora[0] : '';
  }
  return str;
}

const MODELOS_CERTIFICADO = {
  modelo1: {
    id: 'modelo1',
    nome: 'Modelo 1 - Plenária Municipal de Saúde',
    imagem: '/img/modelo-certificado/modelo1.png',
    gerarTexto: ({ resumoEvento, dataEvento, localEvento, cargaHoraria, cargaHorariaExtenso }) => (
      <>
        Participou da Plenária Municipal de Saúde de Muriaé, com o tema <strong>&quot;{resumoEvento}&quot;</strong> realizada no dia {dataEvento}, no {localEvento}, em Muriaé-MG{cargaHoraria ? `, com carga horária total de ${cargaHoraria} (${cargaHorariaExtenso}) horas` : ''}.
      </>
    )
  },
  modelo2: {
    id: 'modelo2',
    nome: 'Modelo 2 - Simpósio / Workshop',
    imagem: '/img/modelo-certificado/modelo2.png',
    gerarTexto: ({ resumoEvento, dataEvento, localEvento, cargaHoraria, cargaHorariaExtenso }) => (
      <>
        Concluiu com êxito a participação no Simpósio de Saúde sobre <strong>&quot;{resumoEvento}&quot;</strong>, promovido no dia {dataEvento}, nas dependências de {localEvento}{cargaHoraria ? `, cumprindo a carga horária de ${cargaHoraria} (${cargaHorariaExtenso}) horas de atividades acadêmicas` : ''}.
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

function formatarDataParaExibicao(valor) {
  if (!valor) return '-';
  const str = String(valor).trim();

  if (str.includes('GMT') || str.includes('Mon') || str.includes('Tue') || str.includes('Wed') || str.includes('Thu') || str.includes('Fri') || str.includes('Sat') || str.includes('Sun')) {
    try {
      const d = new Date(str);
      if (!isNaN(d.getTime())) {
        const dia = String(d.getDate()).padStart(2, '0');
        const mes = String(d.getMonth() + 1).padStart(2, '0');
        const ano = d.getFullYear();
        return `${dia}/${mes}/${ano}`;
      }
    } catch {}
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

function numeroParaExtenso(numero) {
  if (!numero) return '';
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

  if (num < 20) return unidades[num];

  if (num < 100) {
    const d = Math.floor(num / 10);
    const u = num % 10;
    return u === 0 ? dezenas[d] : `${dezenas[d]} e ${unidades[u]}`;
  }

  return String(num);
}

export default function AdminEventosPage() {
  const router = useRouter();

  // CONTROLE DE SUB-ABAS: 'cadastrar' | 'gerenciar' | 'inscritos'
  const [abaSub, setAbaSub] = useState('cadastrar');

  const [loadingForm, setLoadingForm] = useState(false);
  const [mensagem, setMensagem] = useState(null);
  const [nomeArquivo, setNomeArquivo] = useState('');
  const [eventoEmEdicao, setEventoEmEdicao] = useState(null);

  const [requerInscricao, setRequerInscricao] = useState(false);
  const [inscricoesEncerradas, setInscricoesEncerradas] = useState(false);
  const [geraCertificado, setGeraCertificado] = useState(false);
  const [cronograma, setCronograma] = useState([]);

  // MODAL DE CONFIRMAÇÃO DE STATUS
  const [confirmModalData, setConfirmModalAberto] = useState(null);
  const [alterandoStatus, setAlterandoStatus] = useState(false);

  // CAMPOS DO FORMULÁRIO DE INSCRIÇÃO
  const [formFields, setFormFields] = useState([
    { id: 1, label: 'Nome Completo', type: 'text', required: true, options: [] },
    { id: 2, label: 'CPF', type: 'cpf', required: true, options: [] },
    { id: 3, label: 'E-mail', type: 'email', required: true, options: [] },
    { id: 4, label: 'Telefone Celular', type: 'tel', required: true, options: [] }
  ]);

  const [listaEventos, setListaEventos] = useState([]);
  const [loadingEventos, setLoadingEventos] = useState(false);
  const [deletandoId, setDeletandoId] = useState(null);

  // ABA DE INSCRITOS / CERTIFICADOS
  const [eventoCertificado, setEventoCertificado] = useState(null);
  const [inscritos, setInscritos] = useState([]);
  const [loadingInscritos, setLoadingInscritos] = useState(false);
  const [selecionados, setSelecionados] = useState([]);
  const [cargaHorariaGeral, setCargaHorariaGeral] = useState('');
  const [gerandoZip, setGerandoZip] = useState(false);

  // ESTADOS DA PAGINAÇÃO DE INSCRITOS
  const [paginaAtual, setPaginaAtual] = useState(1);
  const ITENS_POR_PAGINA = 30;

  const [modeloCertificadoSelecionado, setModeloCertificadoSelecionado] = useState('modelo1');
  const [imagemModeloBase64, setImagemModeloBase64] = useState('');

  // MODAL DE COMPROVANTE INDIVIDUAL
  const [comprovanteAdmin, setComprovanteAdmin] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    const savedUser = localStorage.getItem('user_info');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        const cargo = user?.cargo ? user.cargo.toLowerCase() : 'admin';
        
        const cargosPermitidos = ['admin', 'master', 'gestor', 'comunicacao', 'imprensa'];
        
        if (!cargosPermitidos.includes(cargo)) {
          alert('Acesso negado: Você não possui permissão para gerenciar Eventos.');
          router.push('/admin');
        }
      } catch (e) {
        console.error('Erro ao validar permissões:', e);
      }
    }
  }, [router]);

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

  useEffect(() => {
    async function converterImagemParaBase64() {
      const modeloAtual = MODELOS_CERTIFICADO[modeloCertificadoSelecionado] || MODELOS_CERTIFICADO.modelo1;
      const urlNormal = formatarCaminhoImagemModelo(modeloAtual?.imagem);

      try {
        const response = await fetch(urlNormal);
        if (!response.ok) throw new Error('Não foi possível carregar a imagem');
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagemModeloBase64(reader.result);
        };
        reader.readAsDataURL(blob);
      } catch (err) {
        console.error('Erro ao converter imagem para base64:', err);
        setImagemModeloBase64(urlNormal);
      }
    }

    if (abaSub === 'inscritos') {
      converterImagemParaBase64();
    }
  }, [modeloCertificadoSelecionado, abaSub]);

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

  // CAMPOS DO FORMULÁRIO
  const handleAdicionarCampoForm = () => {
    setFormFields((prev) => [
      ...prev,
      { id: Date.now(), label: '', type: 'text', required: true, options: [''] }
    ]);
  };

  const handleRemoverCampoForm = (id) => {
    setFormFields((prev) => prev.filter((field) => field.id !== id));
  };

  const handleAlterarCampoForm = (id, campo, valor) => {
    setFormFields((prev) =>
      prev.map((field) => {
        if (field.id === id) {
          let novasOpcoes = field.options;
          if ((valor === 'select' || valor === 'checkbox') && (!Array.isArray(novasOpcoes) || novasOpcoes.length === 0)) {
            novasOpcoes = [''];
          }
          return { ...field, [campo]: valor, options: novasOpcoes };
        }
        return field;
      })
    );
  };

  const handleAdicionarOpcao = (fieldId) => {
    setFormFields((prev) =>
      prev.map((field) => {
        if (field.id === fieldId) {
          const opcoesAtuais = Array.isArray(field.options) ? field.options : [];
          return { ...field, options: [...opcoesAtuais, ''] };
        }
        return field;
      })
    );
  };

  const handleAlterarOpcao = (fieldId, indexOpcao, valor) => {
    setFormFields((prev) =>
      prev.map((field) => {
        if (field.id === fieldId) {
          const novasOpcoes = [...(Array.isArray(field.options) ? field.options : [])];
          novasOpcoes[indexOpcao] = valor;
          return { ...field, options: novasOpcoes };
        }
        return field;
      })
    );
  };

  const handleRemoverOpcao = (fieldId, indexOpcao) => {
    setFormFields((prev) =>
      prev.map((field) => {
        if (field.id === fieldId) {
          const novasOpcoes = field.options.filter((_, idx) => idx !== indexOpcao);
          return { ...field, options: novasOpcoes };
        }
        return field;
      })
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
    setInscricoesEncerradas(!!evento.inscricoesEncerradas);
    setGeraCertificado(!!evento.geraCertificado);
    
    setFormFields(
      Array.isArray(evento.formFields) && evento.formFields.length > 0
        ? evento.formFields
        : [
            { id: 1, label: 'Nome Completo', type: 'text', required: true, options: [] },
            { id: 2, label: 'CPF', type: 'cpf', required: true, options: [] },
            { id: 3, label: 'E-mail', type: 'email', required: true, options: [] },
            { id: 4, label: 'Telefone Celular', type: 'tel', required: true, options: [] }
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
    setInscricoesEncerradas(false);
    setGeraCertificado(false);
    setFormFields([
      { id: 1, label: 'Nome Completo', type: 'text', required: true, options: [] },
      { id: 2, label: 'CPF', type: 'cpf', required: true, options: [] },
      { id: 3, label: 'E-mail', type: 'email', required: true, options: [] },
      { id: 4, label: 'Telefone Celular', type: 'tel', required: true, options: [] }
    ]);
    setNomeArquivo('');
    setMensagem(null);
  };

  const handleAbrirConfirmacaoStatus = (evento) => {
    const novoStatusEncerrado = !evento.inscricoesEncerradas;
    setConfirmModalAberto({
      evento,
      novoStatus: novoStatusEncerrado
    });
  };

  const handleExecutarAlternarStatus = async () => {
    if (!confirmModalData) return;
    const { evento, novoStatus } = confirmModalData;
    setAlterandoStatus(true);

    try {
      const payload = {
        target: 'EVENT',
        action: 'UPDATE',
        id: evento.id,
        titulo: evento.titulo,
        resumo: evento.resumo,
        local: evento.local,
        data: evento.data,
        hora: evento.hora,
        categoria: evento.categoria,
        descricao: evento.descricao,
        requerInscricao: evento.requerInscricao,
        inscricoesEncerradas: novoStatus,
        geraCertificado: evento.geraCertificado,
        formFields: evento.formFields || [],
        cronograma: evento.cronograma || []
      };

      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });

      const resData = await response.json();

      if (resData.status === 'success') {
        localStorage.removeItem('cache_portal_eventos');
        setListaEventos((prev) =>
          prev.map((item) =>
            item.id === evento.id ? { ...item, inscricoesEncerradas: novoStatus } : item
          )
        );
        setConfirmModalAberto(null);
      } else {
        alert('Erro ao atualizar status: ' + resData.message);
      }
    } catch (err) {
      console.error(err);
      alert('Erro na comunicação com o servidor.');
    } finally {
      setAlterandoStatus(false);
    }
  };

  const handleSubmitEvento = async (e) => {
    e.preventDefault();
    setLoadingForm(true);
    setMensagem(null);

    let autorNome = 'Gestor / Sistema';
    const savedUser = localStorage.getItem('user_info');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        autorNome = `${parsedUser.nome} (${parsedUser.usuario})`;
      } catch (err) {
        console.error('Erro ao ler informações do usuário:', err);
      }
    }

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
        autor: autorNome, 
        requerInscricao: requerInscricao,
        inscricoesEncerradas: requerInscricao ? inscricoesEncerradas : false,
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
            setInscricoesEncerradas(false);
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
      reader.onerror = () => {
        setLoadingForm(false);
        setMensagem({ tipo: 'erro', texto: 'Erro ao carregar imagem' });
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

  // ABRE A ABA DE INSCRITOS EM TELA CHEIA (SUBISTITUI O POPUP)
  const handleAbrirEmissorCertificado = async (evento) => {
    setEventoCertificado(evento);
    setInscritos([]);
    setSelecionados([]);
    setModeloCertificadoSelecionado('modelo1');
    setCargaHorariaGeral('');
    setPaginaAtual(1); // Reseta para a primeira página
    setAbaSub('inscritos');
    setLoadingInscritos(true);

    try {
      const url = `${SCRIPT_URL}?action=GET_INSCRITOS&eventoTitulo=${encodeURIComponent(evento.titulo)}`;
      const res = await fetch(url, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      const data = await res.json();

      if (data && data.status === 'success' && Array.isArray(data.inscritos)) {
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

  const handleExportarInscritosCSV = () => {
    if (inscritos.length === 0) {
      alert('Não há inscritos para exportar.');
      return;
    }

    const extrairValor = (p, termosBusca) => {
      const chaveEncontrada = Object.keys(p).find((key) => {
        const k = key.toLowerCase().trim();
        return termosBusca.some((termo) => k.includes(termo.toLowerCase()));
      });
      return chaveEncontrada ? p[chaveEncontrada] : '-';
    };

    let csvContent = '\uFEFF';
    csvContent += 'Nº Inscrição;Nome Completo;CPF\n';

    inscritos.forEach((p, index) => {
      const codigo = p['Código Inscrição'] || extrairValor(p, ['código', 'codigo']) || ('INS-' + (index + 1));
      const nome = extrairValor(p, ['nome completo', 'nome']);
      const cpf = extrairValor(p, ['cpf']);

      csvContent += `"${codigo}";"${nome}";"${cpf}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const nomeArquivoClean = (eventoCertificado?.titulo || 'Inscritos').replace(/[^a-zA-Z0-9]/g, '_');
    
    link.setAttribute('href', url);
    link.setAttribute('download', `Inscritos_Resumido_${nomeArquivoClean}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportarInscritosXLSX = () => {
    if (!inscritos || inscritos.length === 0) {
      alert('Não há inscritos para exportar.');
      return;
    }

    try {
      const worksheet = XLSX.utils.json_to_sheet(inscritos);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Inscritos');

      const nomeEventoClean = (eventoCertificado?.titulo || 'Inscritos').replace(/[^a-zA-Z0-9]/g, '_');
      const nomeArquivo = `Inscritos_Completo_${nomeEventoClean}.xlsx`;

      XLSX.writeFile(workbook, nomeArquivo);
    } catch (error) {
      console.error('Erro ao gerar planilha XLSX:', error);
      alert('Ocorreu um erro ao tentar exportar o arquivo Excel.');
    }
  };

  const handleAbrirComprovanteAdmin = (p) => {
    const extrairValor = (termosBusca) => {
      const chaveEncontrada = Object.keys(p).find((key) => {
        const k = key.toLowerCase().trim();
        return termosBusca.some((termo) => k.includes(termo.toLowerCase()));
      });
      return chaveEncontrada ? p[chaveEncontrada] : '-';
    };

    const codigo = p['Código Inscrição'] || extrairValor(['código', 'codigo']) || 'INS-000';
    const nome = extrairValor(['nome completo', 'nome']);
    const cpf = extrairValor(['cpf']);
    const dataNascimento = extrairValor(['nascimento', 'data nasc']);
    const email = extrairValor(['e-mail', 'email']);
    const dataReg = p['Data Inscrição'] || extrairValor(['data inscricao']) || new Date().toLocaleDateString('pt-BR');

    setComprovanteAdmin({
      codigo,
      evento: eventoCertificado?.titulo || 'Evento',
      dataHora: dataReg,
      nome,
      cpf,
      dataNascimento,
      email
    });
  };

  // GERENCIAMENTO DA SELEÇÃO DE CERTIFICADOS
  const handleToggleSelecionarTudo = () => {
    if (selecionados.length === inscritos.length && inscritos.length > 0) {
      setSelecionados([]);
    } else {
      setSelecionados(Array.from({ length: inscritos.length }, (_, i) => i));
    }
  };

  const handleToggleInscrito = (index) => {
    setSelecionados((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  // CÁLCULOS DA PAGINAÇÃO
  const totalPaginas = Math.ceil(inscritos.length / ITENS_POR_PAGINA);
  const inicioIndice = (paginaAtual - 1) * ITENS_POR_PAGINA;
  const fimIndice = inicioIndice + ITENS_POR_PAGINA;
  const inscritosPaginados = inscritos.slice(inicioIndice, fimIndice);

  // GERADOR E BAIXADOR UNIFICADO DE CERTIFICADOS COM NEGRITO REAL
  const handleBaixarCertificados = async () => {
    if (selecionados.length === 0) {
      alert('Selecione pelo menos um participante para baixar o certificado.');
      return;
    }

    setGerandoZip(true);

    try {
      const extrairValor = (p, termosBusca) => {
        const chaveEncontrada = Object.keys(p).find((key) => {
          const k = key.toLowerCase().trim();
          return termosBusca.some((termo) => k.includes(termo.toLowerCase()));
        });
        return chaveEncontrada ? p[chaveEncontrada] : null;
      };

      const modeloAtual = MODELOS_CERTIFICADO[modeloCertificadoSelecionado] || MODELOS_CERTIFICADO.modelo1;
      const srcBg = imagemModeloBase64 || formatarCaminhoImagemModelo(modeloAtual?.imagem);
      
      const resumoEvento = eventoCertificado?.resumo || eventoCertificado?.titulo || 'Resumo do Evento';
      const dataEvento = formatarDataPorExtenso(eventoCertificado?.data);
      const localEvento = eventoCertificado?.local || 'Local';
      const cargaHoraria = cargaHorariaGeral ? cargaHorariaGeral.trim() : '';
      const cargaHorariaExtenso = numeroParaExtenso(cargaHoraria);

      // Carrega imagem de fundo em base64
      let bgImageData = null;
      if (srcBg) {
        try {
          const imgResp = await fetch(srcBg);
          const blob = await imgResp.blob();
          bgImageData = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          });
        } catch (err) {
          console.warn('Erro ao carregar imagem de fundo:', err);
        }
      }

      // Função utilitária com divisão por estilos (Normal / Bold)
      const criarPdfCertificado = (idxSelect) => {
        const p = inscritos[idxSelect];
        if (!p) return null;

        const nome = extrairValor(p, ['nome completo', 'nome']) || 'PARTICIPANTE';
        const codigo = p['Código Inscrição'] || extrairValor(p, ['código', 'codigo']) || eventoCertificado.id;

        const doc = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4'
        });

        // 1. Fundo
        if (bgImageData) {
          doc.addImage(bgImageData, 'PNG', 0, 0, 297, 210);
        }

        // 2. Nome
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(24);
        doc.setTextColor(15, 23, 42);
        const nomeFormatado = String(nome).toUpperCase().trim();
        doc.text(nomeFormatado, 148.5, 80, { align: 'center' });

        // 3. Texto do Certificado com Trechos em Negrito
        doc.setFontSize(11);
        doc.setTextColor(51, 65, 85);

        let segmentos = [];

        if (modeloCertificadoSelecionado === 'modelo2') {
          segmentos = [
            { text: 'Concluiu com êxito a participação no Simpósio de Saúde sobre ', style: 'normal' },
            { text: `"${resumoEvento}"`, style: 'bold' },
            { text: `, promovido no dia ${dataEvento}, nas dependências de ${localEvento}`, style: 'normal' }
          ];

          if (cargaHoraria) {
            segmentos.push({ text: ', cumprindo a carga horária de ', style: 'normal' });
            segmentos.push({ text: `${cargaHoraria} (${cargaHorariaExtenso}) horas`, style: 'bold' });
            segmentos.push({ text: ' de atividades acadêmicas.', style: 'normal' });
          } else {
            segmentos.push({ text: '.', style: 'normal' });
          }
        } else {
          segmentos = [
            { text: 'Participou da Plenária Municipal de Saúde de Muriaé, com o tema ', style: 'normal' },
            { text: `"${resumoEvento}"`, style: 'bold' },
            { text: ` realizada no dia ${dataEvento}, no ${localEvento}, em Muriaé-MG`, style: 'normal' }
          ];

          if (cargaHoraria) {
            segmentos.push({ text: ', com carga horária total de ', style: 'normal' });
            segmentos.push({ text: `${cargaHoraria} (${cargaHorariaExtenso}) horas`, style: 'bold' });
            segmentos.push({ text: '.', style: 'normal' });
          } else {
            segmentos.push({ text: '.', style: 'normal' });
          }
        }

        // Algoritmo de quebra de linha e centralização preservando estilos
        const larguraMax = 220; // mm
        let linhas = [];
        let linhaAtual = [];
        let larguraLinhaAtual = 0;

        segmentos.forEach((seg) => {
          doc.setFont('helvetica', seg.style);
          const palavras = seg.text.split(' ');

          palavras.forEach((palavra, pIdx) => {
            const espaco = pIdx === palavras.length - 1 ? '' : ' ';
            const termo = palavra + espaco;
            const larguraTermo = doc.getTextWidth(termo);

            if (larguraLinhaAtual + larguraTermo > larguraMax && linhaAtual.length > 0) {
              linhas.push({ tokens: linhaAtual, largura: larguraLinhaAtual });
              linhaAtual = [];
              larguraLinhaAtual = 0;
            }

            linhaAtual.push({ text: termo, style: seg.style });
            larguraLinhaAtual += larguraTermo;
          });
        });

        if (linhaAtual.length > 0) {
          linhas.push({ tokens: linhaAtual, largura: larguraLinhaAtual });
        }

        let yPos = 96;
        const alturaLinha = 6;

        linhas.forEach((linha) => {
          let xPos = 148.5 - (linha.largura / 2);

          linha.tokens.forEach((token) => {
            doc.setFont('helvetica', token.style);
            doc.text(token.text, xPos, yPos);
            xPos += doc.getTextWidth(token.text);
          });

          yPos += alturaLinha;
        });

        // 4. Autenticidade
        doc.setFont('courier', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text(`AUTENTICIDADE: CERT-${codigo}`, 280, 202, { align: 'right' });

        return { doc, nomeFormatado };
      };

      // CASO 1: SE 1 SELECIONADO -> PDF DIRETO
      if (selecionados.length === 1) {
        const resultado = criarPdfCertificado(selecionados[0]);
        if (resultado) {
          const nomeArquivoClean = resultado.nomeFormatado.replace(/[^A-Z0-9_\-\s]/gi, '').trim() || 'PARTICIPANTE';
          resultado.doc.save(`Certificado_${nomeArquivoClean}.pdf`);
        }
      } 
      // CASO 2: SE MÚLTIPLOS SELECIONADOS -> ARQUIVO ZIP COM PDFS
      else {
        const zip = new JSZip();

        for (const idxSelect of selecionados) {
          const resultado = criarPdfCertificado(idxSelect);
          if (resultado) {
            const pdfArrayBuffer = resultado.doc.output('arraybuffer');
            const nomeArquivoSanitizado = resultado.nomeFormatado.replace(/[^A-Z0-9_\-\s]/gi, '').trim() || `PARTICIPANTE_${idxSelect + 1}`;
            zip.file(`Certificado_${nomeArquivoSanitizado}.pdf`, pdfArrayBuffer);
          }
        }

        const zipContent = await zip.generateAsync({ type: 'blob' });
        const urlZip = URL.createObjectURL(zipContent);
        const link = document.createElement('a');
        const nomeEventoClean = (eventoCertificado?.titulo || 'Certificados').replace(/[^a-zA-Z0-9]/g, '_');
        
        link.href = urlZip;
        link.download = `Certificados_${nomeEventoClean}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(urlZip);
      }

    } catch (error) {
      console.error('Erro ao gerar certificado:', error);
      alert('Ocorreu um erro ao gerar o(s) certificado(s).');
    } finally {
      setGerandoZip(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        
        <div className={styles.headerBar}>
          <div>
            <span className={styles.badgeHeader}>
              <ShieldCheck size={14} /> Comunicação & Agendamento
            </span>
            <h1 className={styles.mainTitle}>Gerenciador de Eventos</h1>
            <p className={styles.subTitle}>Cadastre, acompanhe e emita comprovantes e certificados para participantes.</p>
          </div>

          <Link href="/admin" className={styles.backLink}>
            <ArrowLeft size={16} /> Voltar ao Painel
          </Link>
        </div>

        {/* NAVEGAÇÃO DE SUB-ABAS */}
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

          {abaSub === 'inscritos' && (
            <button
              onClick={() => setAbaSub('inscritos')}
              className={`${styles.subTabBtn} ${styles.subTabInscritosActive}`}
            >
              <Users size={16} /> Inscritos: {eventoCertificado?.titulo || 'Evento'}
            </button>
          )}
        </div>

        {mensagem && (
          <div className={`${styles.alertMessage} ${mensagem.tipo === 'sucesso' ? styles.alertSucesso : styles.alertErro}`}>
            {mensagem.tipo === 'sucesso' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            {mensagem.texto}
          </div>
        )}

        {/* ABA 1: CADASTRAR / EDITAR */}
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
                          if (!e.target.checked) {
                            setGeraCertificado(false);
                            setInscricoesEncerradas(false);
                          }
                        }} 
                        className={styles.checkboxInput}
                      />
                      Requer Inscrição prévia dos participantes?
                    </label>

                    {requerInscricao && (
                      <>
                        <label className={styles.checkboxLabelRed}>
                          <input 
                            type="checkbox" 
                            checked={inscricoesEncerradas} 
                            onChange={(e) => setInscricoesEncerradas(e.target.checked)} 
                            className={styles.checkboxInput}
                          />
                          <Lock size={18} color="#dc2626" />
                          Encerrar Inscrições? (Impede novos cadastros no site)
                        </label>

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
                              <p className={styles.formFieldsSubtitle}>Monte as perguntas que os inscritos deverão responder no site.</p>
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
                            <div key={field.id} className={styles.fieldBoxWrapper}>
                              <div className={styles.fieldGridRow}>
                                <input 
                                  type="text" 
                                  placeholder="Nome do Campo (ex: Unidade, Profissão...)" 
                                  value={field.label} 
                                  onChange={(e) => handleAlterarCampoForm(field.id, 'label', e.target.value)} 
                                  className={styles.input} 
                                />

                                <select 
                                  value={field.type} 
                                  onChange={(e) => handleAlterarCampoForm(field.id, 'type', e.target.value)} 
                                  className={styles.select}
                                >
                                  <option value="text">Texto Simples</option>
                                  <option value="cpf">CPF (com validação e máscara)</option>
                                  <option value="tel">Telefone / WhatsApp</option>
                                  <option value="email">E-mail</option>
                                  <option value="number">Número</option>
                                  <option value="date">Data</option>
                                  <option value="select">Lista Suspensa (Menu Select)</option>
                                  <option value="checkbox">Caixa de Seleção (Múltiplas Opções)</option>
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

                              {(field.type === 'select' || field.type === 'checkbox') && (
                                <div className={styles.optionsContainer}>
                                  <div className={styles.optionsHeader}>
                                    <span className={styles.optionsTitle}>
                                      Opções disponíveis ({field.type === 'select' ? 'Menu Seleção' : 'Múltipla Escolha'}):
                                    </span>
                                  </div>

                                  <div className={styles.optionsList}>
                                    {(Array.isArray(field.options) ? field.options : []).map((opcao, idx) => (
                                      <div key={idx} className={styles.optionRowItem}>
                                        <span className={styles.optionNumber}>{idx + 1}.</span>
                                        <input 
                                          type="text" 
                                          placeholder={`Digite o texto da opção ${idx + 1}`}
                                          value={opcao} 
                                          onChange={(e) => handleAlterarOpcao(field.id, idx, e.target.value)} 
                                          className={`${styles.input} ${styles.fontSize13}`} 
                                        />
                                        <button 
                                          type="button" 
                                          onClick={() => handleRemoverOpcao(field.id, idx)} 
                                          className={styles.deleteSquareBtnSmall}
                                          title="Remover Opção"
                                        >
                                          <X size={14} />
                                        </button>
                                      </div>
                                    ))}
                                  </div>

                                  <button 
                                    type="button" 
                                    onClick={() => handleAdicionarOpcao(field.id)} 
                                    className={styles.addOptionBtn}
                                  >
                                    <Plus size={13} /> Adicionar Opção
                                  </button>
                                </div>
                              )}
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
                    {loadingForm ? <Loader2 size={18} className="animate-spin" /> : eventoEmEdicao ? <><Pencil size={18} /> Salvar Alterações</> : <><Send size={18} /> Publicar</>}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* ABA 2: GERENCIAR EVENTOS */}
        {abaSub === 'gerenciar' && (
          <div className={styles.cardSection}>
            <h2 className={styles.sectionTitle}><List size={20} color="#0065a4" /> Eventos Cadastrados no Portal</h2>
            {loadingEventos ? (
              <p className={styles.loadingText}>Carregando lista de eventos...</p>
            ) : listaEventos.length > 0 ? (
              <div className={styles.newsListContainer}>
                {listaEventos.map((item) => {
                  const urlTratadaImagem = formatarCaminhoImagemModelo(item.imgSrc || item.imagem);
                  const horaLimpa = limparHora(item.hora);

                  return (
                    <div key={item.id} className={styles.newsItemRow}>
                      <div className={styles.newsItemContent}>
                        
                        <div className={styles.imageThumbnailWrapper}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={urlTratadaImagem} 
                            alt={item.titulo || 'Capa do Evento'} 
                            className={styles.thumbnailImgDirect}
                            onError={(e) => {
                              e.currentTarget.src = '/img/eventos/simposio.png';
                            }}
                          />
                        </div>

                        <div>
                          <span className={styles.newsMetaText}>
                            {item.categoria} 
                            {item.requerInscricao && (
                              item.inscricoesEncerradas 
                                ? ' • 🔴 INSCRIÇÕES ENCERRADAS' 
                                : ' • 🟢 INSCRIÇÕES ABERTAS'
                            )} 
                            {item.geraCertificado && ' • 📜 CERTIFICADO'}
                          </span>
                          <h3 className={styles.newsItemTitle}>{item.titulo}</h3>
                          <div className={styles.eventDetailsRow}>
                            <span><MapPin size={12} /> {item.local}</span>
                            {horaLimpa && <span><Clock size={12} /> {horaLimpa}</span>}
                          </div>
                        </div>
                      </div>

                      <div className={styles.actionButtonsGroup}>
                        {item.requerInscricao && (
                          <>
                            <button 
                              onClick={() => handleAbrirConfirmacaoStatus(item)}
                              className={item.inscricoesEncerradas ? styles.btnReabrirInscricao : styles.btnLockInscricao}
                              title={item.inscricoesEncerradas ? 'Reabrir Inscrições' : 'Encerrar Inscrições'}
                            >
                              {item.inscricoesEncerradas ? <Unlock size={15} /> : <Lock size={15} />}
                              {item.inscricoesEncerradas ? 'Reabrir' : 'Encerrar Inscrições'}
                            </button>

                            <button 
                              onClick={() => handleAbrirEmissorCertificado(item)} 
                              className={styles.emitCertificateBtn}
                            >
                              <ClipboardList size={15} /> Ver Inscritos
                            </button>
                          </>
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

        {/* ABA 3: GERENCIAR INSCRITOS (COM PAGINAÇÃO A CADA 30 INSCRITOS) */}
        {abaSub === 'inscritos' && eventoCertificado && (
          <div className={styles.cardSection}>
            <div className={styles.inscritosHeaderBar}>
              <div>
                <span className={styles.modalBadgeText}>PAINEL COMPLETO DE INSCRITOS</span>
                <h2 className={styles.sectionTitleNoBorder}>
                  <ClipboardList color="#0284c7" size={24} /> {eventoCertificado.titulo}
                </h2>
              </div>

              <div className={styles.adminActionsHeaderBar}>
                <button 
                  type="button" 
                  onClick={handleExportarInscritosCSV}
                  disabled={inscritos.length === 0}
                  className={styles.btnExportarCsv}
                  title="Exportar apenas código, nome e CPF em CSV"
                >
                  <Download size={15} /> Exportar Resumido
                </button>

                <button 
                  type="button" 
                  onClick={handleExportarInscritosXLSX}
                  disabled={inscritos.length === 0}
                  className={styles.btnExportarXlsx}
                  title="Exportar todas as colunas da planilha em formato nativo do Excel (.xlsx)"
                >
                  <Table size={15} /> Exportar Completo
                </button>

                <button 
                  type="button" 
                  onClick={() => setAbaSub('gerenciar')}
                  className={styles.backLink}
                >
                  <ArrowLeft size={15} /> Voltar aos Eventos
                </button>
              </div>
            </div>

            <div className={styles.modalControlsBoxFull}>
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
                  Carga Horária:
                </label>
                <input 
                  type="text" 
                  value={cargaHorariaGeral} 
                  onChange={(e) => setCargaHorariaGeral(e.target.value)}
                  placeholder="Carga Horária"
                  className={styles.modalInputCargaHoraria}
                />
              </div>

              <div className={styles.flexAlignEnd}>
                <button 
                  onClick={handleBaixarCertificados}
                  disabled={selecionados.length === 0 || gerandoZip}
                  className={styles.btnExportarZipLarge}
                  title="Baixar certificado em PDF (se 1 selecionado) ou em arquivo ZIP com PDFs separados (se múltiplos selecionados)"
                >
                  {gerandoZip ? (
                    <><Loader2 size={18} className="animate-spin" /> Processando...</>
                  ) : selecionados.length > 1 ? (
                    <><Archive size={18} /> Baixar Certificados Selecionados ({selecionados.length})</>
                  ) : (
                    <><Download size={18} /> Baixar Certificado Selecionado</>
                  )}
                </button>
              </div>
            </div>

            <div className={styles.modalSelectionBar}>
              <div className={styles.flexRowCenterGap10}>
                <button 
                  type="button"
                  onClick={handleToggleSelecionarTudo}
                  className={styles.toggleAllBtn}
                >
                  {selecionados.length === inscritos.length && inscritos.length > 0 ? <CheckSquare size={18} color="#0284c7" /> : <Square size={18} />} 
                  {selecionados.length === inscritos.length && inscritos.length > 0 ? 'Desmarcar Todos' : 'Selecionar Todos os Participantes'}
                </button>
                
                <span className={styles.selectedCountText}>
                  Total de Inscritos: <strong>{inscritos.length}</strong> | Selecionados: <strong>{selecionados.length}</strong>
                </span>
              </div>

              {/* INFO DA PÁGINA */}
              {inscritos.length > 0 && (
                <span className={styles.paginaInfoText}>
                  Exibindo <strong>{inicioIndice + 1}</strong>–<strong>{Math.min(fimIndice, inscritos.length)}</strong> de <strong>{inscritos.length}</strong>
                </span>
              )}
            </div>

            <div className={styles.tableFullWrapper}>
              {loadingInscritos ? (
                <div className={styles.loadingInscritosBox}>
                  <Loader2 size={22} className="animate-spin" /> Buscando lista de inscritos do evento...
                </div>
              ) : inscritos.length > 0 ? (
                <table className={styles.inscritosTableFull}>
                  <thead>
                    <tr>
                      <th className={styles.colIndex}>#</th>
                      <th>Nº Inscrição</th>
                      <th>Nome / Participante</th>
                      <th>CPF / Documento</th>
                      <th className={styles.textCenter}>Comprovante</th>
                      <th className={styles.textCenter}>Emitir Certificado?</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inscritosPaginados.map((p, pIdx) => {
                      const idxGlobal = inicioIndice + pIdx;
                      const isSelected = selecionados.includes(idxGlobal);
                      
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
                        <tr key={idxGlobal} className={isSelected ? styles.selectedRow : ''}>
                          <td className={styles.colIndexText}>{idxGlobal + 1}</td>
                          <td className={styles.codigoText}>{codigo}</td>
                          <td className={styles.nomeParticipanteText}>{nome}</td>
                          <td className={styles.cpfText}>{cpf}</td>
                          
                          <td className={styles.textCenter}>
                            <button 
                              type="button"
                              onClick={() => handleAbrirComprovanteAdmin(p)}
                              className={styles.btnVerTicketSmall}
                              title="Visualizar Comprovante do Inscrito"
                            >
                              <Ticket size={13} /> Comprovante
                            </button>
                          </td>

                          <td className={styles.textCenter}>
                            <input 
                              type="checkbox" 
                              checked={isSelected} 
                              onChange={() => handleToggleInscrito(idxGlobal)} 
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

            {/* BARRA DE CONTROLE DA PAGINAÇÃO */}
            {totalPaginas > 1 && (
              <div className={styles.paginationContainer}>
                <button
                  type="button"
                  onClick={() => setPaginaAtual((prev) => Math.max(prev - 1, 1))}
                  disabled={paginaAtual === 1}
                  className={styles.paginationBtn}
                  title="Página Anterior"
                >
                  <ChevronLeft size={16} /> Anterior
                </button>

                <div className={styles.paginationNumbersBox}>
                  {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((numPagina) => (
                    <button
                      key={numPagina}
                      type="button"
                      onClick={() => setPaginaAtual(numPagina)}
                      className={`${styles.paginationNumberBtn} ${paginaAtual === numPagina ? styles.paginationNumberActive : ''}`}
                    >
                      {numPagina}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas))}
                  disabled={paginaAtual === totalPaginas}
                  className={styles.paginationBtn}
                  title="Próxima Página"
                >
                  Próxima <ChevronRight size={16} />
                </button>
              </div>
            )}

          </div>
        )}

      </div>

      {/* MODAL DE CONFIRMAÇÃO DE ALTERAÇÃO DE STATUS */}
      {confirmModalData && (
        <div className={styles.modalOverlay} onClick={() => !alterandoStatus && setConfirmModalAberto(null)}>
          <div className={styles.modalConfirmBox}>
            <div className={styles.confirmHeader}>
              <AlertTriangle size={32} color={confirmModalData.novoStatus ? "#dc2626" : "#16a34a"} />
              <h3>{confirmModalData.novoStatus ? 'Encerrar Inscrições?' : 'Reabrir Inscrições?'}</h3>
            </div>

            <p className={styles.confirmText}>
              Você está prestes a {confirmModalData.novoStatus ? 'encerrar' : 'reabrir'} as inscrições para o evento:
              <br />
              <strong className={styles.confirmEventoTitle}>&quot;{confirmModalData.evento.titulo}&quot;</strong>
            </p>

            <p className={styles.confirmSubtext}>
              {confirmModalData.novoStatus 
                ? 'Os cidadãos não conseguirão mais preencher o formulário no portal.' 
                : 'O formulário de inscrição voltará a ficar disponível para o público.'}
            </p>

            <div className={styles.confirmActionsRow}>
              <button 
                onClick={() => setConfirmModalAberto(null)} 
                disabled={alterandoStatus}
                className={styles.btnCancelModal}
              >
                Cancelar
              </button>

              <button 
                onClick={handleExecutarAlternarStatus} 
                disabled={alterandoStatus}
                className={confirmModalData.novoStatus ? styles.btnConfirmLock : styles.btnConfirmUnlock}
              >
                {alterandoStatus ? (
                  <><Loader2 size={16} className="animate-spin" /> Atualizando...</>
                ) : confirmModalData.novoStatus ? (
                  <><Lock size={16} /> Confirmar Encerramento</>
                ) : (
                  <><Unlock size={16} /> Confirmar Reabertura</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE COMPROVANTE INDIVIDUAL */}
      {comprovanteAdmin && (
        <div className={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && setComprovanteAdmin(null)}>
          <div className={styles.modalComprovanteBox}>
            <button 
              onClick={() => setComprovanteAdmin(null)} 
              className={styles.closeModalBtn}
            >
              <X size={18} />
            </button>

            <div id="comprovante-admin-pdf-container" className={styles.comprovanteCardPdf}>
              <div className={styles.ticketHeader}>
                <div>
                  <span className={styles.ticketBadgeTag}>SAÚDE PÚBLICA • PORTAL OFICIAL</span>
                  <h2 className={styles.ticketTitle}>Comprovante de Inscrição</h2>
                </div>
                <div className={styles.ticketCodeBox}>
                  <span className={styles.ticketCodeLabel}>CÓDIGO DE CONFIRMAÇÃO</span>
                  <strong className={styles.ticketCodeNum}>{comprovanteAdmin.codigo}</strong>
                </div>
              </div>

              <div className={styles.ticketDivider}></div>

              <div className={styles.ticketSection}>
                <span className={styles.ticketSectionLabel}>EVENTO SELECIONADO</span>
                <h3 className={styles.ticketEventTitle}>{comprovanteAdmin.evento}</h3>
                <div className={styles.ticketMetaRow}>
                  <span>📅 <strong>Data de Registro:</strong> {formatarDataParaExibicao(comprovanteAdmin.dataHora)}</span>
                </div>
              </div>

              <div className={styles.ticketGridDetails}>
                <div className={styles.ticketDetailItem}>
                  <strong className={styles.ticketDetailLabel}>Nome Completo</strong>
                  <span className={styles.ticketDetailValue}>{comprovanteAdmin.nome}</span>
                </div>
                <div className={styles.ticketDetailItem}>
                  <strong className={styles.ticketDetailLabel}>CPF</strong>
                  <span className={styles.ticketDetailValue}>{comprovanteAdmin.cpf}</span>
                </div>
                <div className={styles.ticketDetailItem}>
                  <strong className={styles.ticketDetailLabel}>Data de Nascimento</strong>
                  <span className={styles.ticketDetailValue}>{formatarDataParaExibicao(comprovanteAdmin.dataNascimento)}</span>
                </div>
                <div className={styles.ticketDetailItem}>
                  <strong className={styles.ticketDetailLabel}>E-mail</strong>
                  <span className={styles.ticketDetailValue}>{comprovanteAdmin.email}</span>
                </div>
              </div>

              <div className={styles.ticketFooter}>
                <span>✓ Inscrição confirmada no sistema.</span>
                <span className={styles.ticketStamp}>DOCUMENTO VÁLIDO</span>
              </div>
            </div>

            <div className={styles.flexRowGap12}>
              <button 
                onClick={() => window.print()}
                className={styles.btnDownloadPdf}
              >
                <Printer size={16} /> Imprimir Comprovante
              </button>
              <button 
                onClick={() => setComprovanteAdmin(null)}
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