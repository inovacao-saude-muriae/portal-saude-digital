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
  Newspaper, 
  Trash2, 
  List, 
  PlusCircle, 
  Pencil, 
  XCircle 
} from 'lucide-react';
import styles from './AdminNoticia.module.css';

const SCRIPT_URL = process.env.NEXT_PUBLIC_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbwsi09GSHFIZSj_y77dxpz7pRBJAKwk0DE_fi_-O8yddeVtU5S6Ue8VFc1uRiGIRbKKMQ/exec';

const MESES = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];

// FUNÇÃO PARA DEFINIR A CLASSE DE COR DA CATEGORIA APENAS PARA OS CARDS
function getClasseCategoria(categoria) {
  switch (categoria) {
    case 'Vacinação': return styles.catVacinacao;
    case 'Infraestrutura': return styles.catInfraestrutura;
    case 'Ação Comunitária': return styles.catAcaoComunitaria;
    case 'Comunicado': return styles.catComunicado;
    case 'Inovação': return styles.catInovacao;
    case 'Campanha': return styles.catCampanha;
    case 'Inauguração': return styles.catInauguracao;
    default: return styles.catPadrao;
  }
}

// FUNÇÃO RESILIENTE PARA EXTRAIR E FORMATAR IMAGENS DO GOOGLE DRIVE
function extrairImagem(item) {
  if (!item) return '/img/noticias/noticia1.jpeg';
  
  let url = item.imagem || item.imgSrc || item.imageUrl || item.img || '';
  if (typeof url !== 'string' || !url.trim()) {
    return '/img/noticias/noticia1.jpeg';
  }

  url = url.trim();

  // Previne erro de URLs duplicadas/concatenadas na mesma célula
  if (url.includes('https://') && url.indexOf('https://', 8) !== -1) {
    url = url.substring(0, url.indexOf('https://', 8));
  }

  if (url.includes('drive.google.com') || url.includes('googleusercontent.com')) {
    let fileId = '';
    
    if (url.includes('/d/')) {
      fileId = url.split('/d/')[1].split('/')[0].split('?')[0];
    } else if (url.includes('id=')) {
      fileId = url.split('id=')[1].split('&')[0];
    }

    if (fileId) {
      return `https://lh3.googleusercontent.com/d/${fileId}`;
    }
  }

  if (/^[a-zA-Z0-9_-]{25,}$/.test(url)) {
    return `https://lh3.googleusercontent.com/d/${url}`;
  }

  return url;
}

function extrairDiaEMes(dataBruta) {
  if (!dataBruta) return { dia: '01', mes: 'JAN' };

  try {
    const dataString = String(dataBruta).split('T')[0].trim();

    if (dataString.includes('-')) {
      const partes = dataString.split('-');
      if (partes.length === 3) {
        const [ano, mes, dia] = partes;
        const mesIndex = parseInt(mes, 10) - 1;
        return {
          dia: dia.padStart(2, '0'),
          mes: MESES[mesIndex] || 'JAN'
        };
      }
    }

    if (dataString.includes('/')) {
      const partes = dataString.split('/');
      if (partes.length === 3) {
        const [dia, mes] = partes;
        const mesIndex = parseInt(mes, 10) - 1;
        return {
          dia: dia.padStart(2, '0'),
          mes: MESES[mesIndex] || 'JAN'
        };
      }
    }

    const d = new Date(dataBruta);
    if (!isNaN(d.getTime())) {
      return {
        dia: String(d.getUTCDate()).padStart(2, '0'),
        mes: MESES[d.getUTCMonth()] || 'JAN'
      };
    }
  } catch (err) {
    console.error('Erro ao extrair dia/mês:', err);
  }

  return { dia: '01', mes: 'JAN' };
}

function formatarDataParaEnvio(dataInput) {
  if (!dataInput) {
    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const ano = hoje.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  const str = String(dataInput).trim();

  if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
    const partes = str.split('T')[0].split('-');
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  return str;
}

function formatarDataParaInput(dataStr) {
  if (!dataStr) {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }

  const str = String(dataStr).trim();

  if (/^\d{1,2}\/\d{1,2}\/\d{4}/.test(str)) {
    const partes = str.split('T')[0].split('/');
    if (partes.length === 3) {
      const dia = partes[0].padStart(2, '0');
      const mes = partes[1].padStart(2, '0');
      const ano = partes[2];
      return `${ano}-${mes}-${dia}`;
    }
  }

  if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
    return str.split('T')[0];
  }

  const d = new Date(str);
  if (!isNaN(d.getTime())) {
    const ano = d.getUTCFullYear();
    const mes = String(d.getUTCMonth() + 1).padStart(2, '0');
    const dia = String(d.getUTCDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }

  const MESES_MAP = {
    jan: '01', fev: '02', mar: '03', abr: '04', mai: '05', jun: '06',
    jul: '07', ago: '08', set: '09', out: '10', nov: '11', dez: '12'
  };

  const partesTexto = str.toLowerCase().split(' ');
  if (partesTexto.length === 3) {
    const dia = partesTexto[0].padStart(2, '0');
    const mes = MESES_MAP[partesTexto[1].substring(0, 3)] || '01';
    const ano = partesTexto[2];
    return `${ano}-${mes}-${dia}`;
  }

  return '';
}

export default function AdminNoticiasPage() {
  const [abaSub, setAbaSub] = useState('cadastrar');
  const [loadingForm, setLoadingForm] = useState(false);
  const [mensagem, setMensagem] = useState(null);
  const [nomeArquivo, setNomeArquivo] = useState('');
  const [noticiaEmEdicao, setNoticiaEmEdicao] = useState(null);

  const [listaNoticias, setListaNoticias] = useState([]);
  const [loadingNoticias, setLoadingNoticias] = useState(false);
  const [deletandoId, setDeletandoId] = useState(null);

  useEffect(() => {
    async function carregarNoticias() {
      setLoadingNoticias(true);
      try {
        const response = await fetch(`${SCRIPT_URL}?target=NEWS&action=GET_ALL&_t=${Date.now()}`, {
          method: 'GET',
          redirect: 'follow',
        });

        const resData = await response.json();

        if (resData.status === 'success' && Array.isArray(resData.noticias)) {
          setListaNoticias(resData.noticias);
          localStorage.setItem('cache_portal_noticias', JSON.stringify(resData.noticias));
        } else {
          console.warn('Formato de resposta inesperado:', resData);
        }
      } catch (err) {
        console.error('Erro ao carregar notícias do servidor:', err);
      } finally {
        setLoadingNoticias(false);
      }
    }

    if (abaSub === 'gerenciar') {
      carregarNoticias();
    }
  }, [abaSub]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNomeArquivo(e.target.files[0].name);
    }
  };

  const handleIniciarEdicao = (noticia) => {
    setNoticiaEmEdicao(noticia);
    setAbaSub('cadastrar');
    setNomeArquivo('');
    setMensagem(null);
  };

  const handleCancelarEdicao = () => {
    setNoticiaEmEdicao(null);
    setNomeArquivo('');
    setMensagem(null);
  };

  const handleSubmitNoticia = async (e) => {
    e.preventDefault();
    setLoadingForm(true);
    setMensagem(null);

    // CAPTURA AS INFORMAÇÕES DO USUÁRIO LOGADO NO LOCALSTORAGE
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
    const isEditing = !!noticiaEmEdicao;

    const dataOriginal = formData.get('dataNoticia');
    const dataFormatadaEnvio = formatarDataParaEnvio(dataOriginal);

    const processarEnvio = async (base64Image = '', name = '', type = '') => {
      const payload = {
        target: 'NEWS',
        action: isEditing ? 'UPDATE' : 'CREATE',
        id: isEditing ? noticiaEmEdicao.id : 'news-' + Date.now(),
        titulo: formData.get('titulo'),
        resumo: formData.get('resumo'),
        data: dataFormatadaEnvio,
        categoria: formData.get('categoria'),
        conteudo: formData.get('conteudo'),
        autor: autorNome, // ENVIANDO O USUÁRIO RESPONSÁVEL PARA A PLANILHA
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
          localStorage.removeItem('cache_portal_noticias');

          setMensagem({ 
            tipo: 'sucesso', 
            texto: isEditing ? 'Notícia atualizada com sucesso!' : 'Notícia publicada com sucesso no portal!' 
          });

          if (!isEditing) {
            e.target.reset();
            setNomeArquivo('');
          } else {
            handleCancelarEdicao();
            setAbaSub('gerenciar');
          }
        } else {
          setMensagem({ tipo: 'erro', texto: 'Erro ao salvar notícia: ' + resData.message });
        }
      } catch (err) {
        console.error(err);
        setMensagem({ tipo: 'erro', texto: 'Falha na comunicação com o servidor.' });
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

  const handleDeletarNoticia = async (id, titulo) => {
    const confirmou = window.confirm(`Tem certeza que deseja remover a notícia:\n"${titulo}"?`);
    if (!confirmou) return;

    setDeletandoId(id);

    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          target: 'NEWS',
          action: 'DELETE',
          id: id
        })
      });

      const resData = await response.json();

      if (resData.status === 'success') {
        localStorage.removeItem('cache_portal_noticias');
        alert('Notícia excluída com sucesso!');
        setListaNoticias((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert('Erro ao excluir: ' + resData.message);
      }
    } catch (err) {
      console.error(err);
      alert('Ocorreu um erro ao tentar excluir a notícia.');
    } finally {
      setDeletandoId(null);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        
        <div className={styles.headerBar}>
          <div>
            <span className={styles.badgeHeader}>
              <Newspaper size={14} /> Módulo Exclusivo de Notícias
            </span>
            <h1 className={styles.mainTitle}>Gerenciador de Notícias</h1>
            <p className={styles.subTitle}>Cadastre e edite informes, campanhas e comunicados da Secretaria de Saúde.</p>
          </div>

          <Link href="/admin" className={styles.backLink}>
            <ArrowLeft size={16} /> Voltar ao Painel
          </Link>
        </div>

        <div className={styles.subTabContainer}>
          <button
            onClick={() => { handleCancelarEdicao(); setAbaSub('cadastrar'); }}
            className={`${styles.subTabBtn} ${abaSub === 'cadastrar' && !noticiaEmEdicao ? styles.subTabCadastrarActive : ''}`}
          >
            <PlusCircle size={16} /> Cadastrar Nova Notícia
          </button>

          <button
            onClick={() => setAbaSub('gerenciar')}
            className={`${styles.subTabBtn} ${abaSub === 'gerenciar' ? styles.subTabGerenciarActive : ''}`}
          >
            <List size={16} /> Ver e Gerenciar Notícias
          </button>
        </div>

        {mensagem && (
          <div className={`${styles.alertMessage} ${mensagem.tipo === 'sucesso' ? styles.alertSucesso : styles.alertErro}`}>
            {mensagem.tipo === 'sucesso' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            {mensagem.texto}
          </div>
        )}

        {abaSub === 'cadastrar' && (
          <form onSubmit={handleSubmitNoticia}>
            {noticiaEmEdicao && (
              <div className={styles.editModeBanner}>
                <div><strong>Editando notícia:</strong> {`"${noticiaEmEdicao.titulo}"`}</div>
                <button type="button" onClick={handleCancelarEdicao} className={styles.cancelEditBtn}>
                  <XCircle size={16} /> Cancelar Edição
                </button>
              </div>
            )}

            <div className={styles.formGrid}>
              <div className={styles.cardSection}>
                <h2 className={styles.sectionTitle}>
                  <Newspaper size={20} color="#0065a4" /> 
                  {noticiaEmEdicao ? 'Editar Informações da Notícia' : 'Informações da Notícia'}
                </h2>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Título da Notícia*</label>
                  <input 
                    key={noticiaEmEdicao ? `tit-${noticiaEmEdicao.id}` : 'tit-novo'}
                    type="text" 
                    name="titulo" 
                    required 
                    defaultValue={noticiaEmEdicao?.titulo || ''} 
                    placeholder="Ex: Campanha de Vacinação atinge nova meta" 
                    className={styles.input} 
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Breve Resumo (Exibido no Card)*</label>
                  <input 
                    key={noticiaEmEdicao ? `res-${noticiaEmEdicao.id}` : 'res-novo'}
                    type="text" 
                    name="resumo" 
                    required 
                    maxLength={160} 
                    defaultValue={noticiaEmEdicao?.resumo || ''} 
                    placeholder="Resumo de até 2 linhas que aparecerá no card do portal..." 
                    className={styles.input} 
                  />
                </div>

                <div className={styles.rowTwoCols}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Data da Publicação*</label>
                    <input 
                      key={noticiaEmEdicao ? `dt-${noticiaEmEdicao.id}` : 'dt-novo'}
                      type="date" 
                      name="dataNoticia" 
                      required 
                      defaultValue={formatarDataParaInput(noticiaEmEdicao?.data)} 
                      className={styles.input} 
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Categoria da Notícia*</label>
                    <select 
                      key={noticiaEmEdicao ? `cat-${noticiaEmEdicao.id}` : 'cat-novo'}
                      name="categoria" 
                      className={styles.select} 
                      defaultValue={noticiaEmEdicao?.categoria || 'Vacinação'}
                    >
                      <option value="Vacinação">Vacinação</option>
                      <option value="Infraestrutura">Infraestrutura</option>
                      <option value="Ação Comunitária">Ação Comunitária</option>
                      <option value="Comunicado">Comunicado Oficial</option>
                      <option value="Inovação">Inovação</option>
                      <option value="Campanha">Campanha</option>
                      <option value="Inauguração">Inauguração</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Conteúdo Completo da Notícia*</label>
                  <textarea 
                    key={noticiaEmEdicao ? `cnt-${noticiaEmEdicao.id}` : 'cnt-novo'}
                    name="conteudo" 
                    rows={8} 
                    required 
                    defaultValue={noticiaEmEdicao?.conteudo || ''} 
                    placeholder="Escreva o texto completo da notícia..." 
                    className={styles.textarea} 
                  />
                </div>
              </div>

              <div className={styles.rightColumn}>
                <div className={styles.cardSection}>
                  <h2 className={styles.sectionTitle}><UploadCloud size={20} color="#0065a4" /> Imagem de Destaque</h2>
                  <div className={styles.dropZone}>
                    <UploadCloud size={36} className={styles.uploadIcon} />
                    <div className={styles.uploadText}>{noticiaEmEdicao ? 'Clique para trocar imagem' : 'Clique para selecionar'}</div>
                    <div className={styles.uploadSubtext}>Formatos JPG, PNG ou WEBP</div>
                    {nomeArquivo ? (
                      <span className={styles.fileNameBadge}>📷 {nomeArquivo}</span>
                    ) : extrairImagem(noticiaEmEdicao) !== '/img/noticias/noticia1.jpeg' ? (
                      <span className={styles.fileNameBadge}>📷 Imagem mantida</span>
                    ) : null}
                    <input type="file" name="imagem" accept="image/*" onChange={handleFileChange} className={styles.fileInputHidden} />
                  </div>
                </div>

                <div className={styles.cardSection}>
                  <button type="submit" disabled={loadingForm} className={styles.submitBtn}>
                    {loadingForm ? 'Salvando na planilha...' : noticiaEmEdicao ? <><Pencil size={18} /> Salvar Alterações</> : <><Send size={18} /> Publicar Notícia</>}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        {abaSub === 'gerenciar' && (
          <div className={styles.cardSection}>
            <h2 className={styles.sectionTitle}><List size={20} color="#0065a4" /> Notícias Cadastradas</h2>
            {loadingNoticias ? (
              <p className={styles.loadingText}>Carregando notícias...</p>
            ) : listaNoticias.length > 0 ? (
              <div className={styles.newsListContainer}>
                {listaNoticias.map((item) => {
                  const { dia, mes } = extrairDiaEMes(item.data);
                  const imagemUrl = extrairImagem(item);

                  return (
                    <div key={item.id} className={styles.newsItemRow}>
                      <div className={styles.newsItemContent}>
                        <div className={styles.imageThumbnailWrapper}>
                          <Image 
                            src={imagemUrl} 
                            alt={item.titulo || 'Notícia'} 
                            fill 
                            sizes="90px"
                            className={styles.thumbnailImg} 
                            unoptimized 
                          />
                          
                          <div className={styles.dateBadgeOverlay}>
                            <span className={styles.badgeDay}>{dia}</span>
                            <span className={styles.badgeMonth}>{mes}</span>
                          </div>
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span className={`${styles.badgeCategoria} ${getClasseCategoria(item.categoria)}`}>
                              {item.categoria}
                            </span>
                            <span className={styles.newsMetaText}>• {item.data}</span>
                          </div>
                          <h3 className={styles.newsItemTitle}>{item.titulo}</h3>
                        </div>
                      </div>

                      <div className={styles.actionButtonsGroup}>
                        <button onClick={() => handleIniciarEdicao(item)} className={styles.editBtn}>
                          <Pencil size={15} /> Editar
                        </button>
                        <button onClick={() => handleDeletarNoticia(item.id, item.titulo)} disabled={deletandoId === item.id} className={styles.deleteBtn}>
                          <Trash2 size={15} /> {deletandoId === item.id ? 'Excluindo...' : 'Remover'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className={styles.emptyText}>Nenhuma notícia cadastrada no momento.</p>
            )}
          </div>
        )}

      </div>
    </div>
  );
}