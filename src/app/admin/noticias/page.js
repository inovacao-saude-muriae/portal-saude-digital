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
  FileText, 
  Settings, 
  Trash2, 
  List, 
  PlusCircle, 
  Pencil, 
  XCircle,
  Newspaper
} from 'lucide-react';
import { getDbNoticias, converterParaDate } from '@/data/noticiasData';
import styles from './Noticia.module.css';

// URL do seu Web App no Google Apps Script referente às Notícias
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwsi09GSHFIZSj_y77dxpz7pRBJAKwk0DE_fi_-O8yddeVtU5S6Ue8VFc1uRiGIRbKKMQ/exec';

export default function AdminNoticiasPage() {
  const [abaSub, setAbaSub] = useState('cadastrar'); // 'cadastrar' ou 'gerenciar'

  const [loadingForm, setLoadingForm] = useState(false);
  const [mensagem, setMensagem] = useState(null);
  const [nomeArquivo, setNomeArquivo] = useState('');
  const [noticiaEmEdicao, setNoticiaEmEdicao] = useState(null);

  const [listaNoticias, setListaNoticias] = useState([]);
  const [loadingLista, setLoadingLista] = useState(false);
  const [deletandoId, setDeletandoId] = useState(null);

  // Carrega as notícias ao selecionar a aba "gerenciar"
  useEffect(() => {
    async function carregarNoticias() {
      setLoadingLista(true);
      try {
        const db = await getDbNoticias();
        const lista = Object.keys(db)
          .map((chave) => ({
            id: chave,
            ...db[chave]
          }))
          .sort((a, b) => converterParaDate(b.data).getTime() - converterParaDate(a.data).getTime());
        setListaNoticias(lista);
      } catch (err) {
        console.error('Erro ao carregar notícias:', err);
      } finally {
        setLoadingLista(false);
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

    const formData = new FormData(e.target);
    const imagemArquivo = formData.get('imagem');
    const isEditing = !!noticiaEmEdicao;

    const processarEnvio = async (base64Image = '', name = '', type = '') => {
      const payload = {
        action: isEditing ? 'UPDATE' : 'CREATE',
        id: isEditing ? noticiaEmEdicao.id : formData.get('titulo')
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-'),
        titulo: formData.get('titulo'),
        resumo: formData.get('resumo'),
        categoria: formData.get('categoria'),
        tipoCategoria: formData.get('tipoCategoria'),
        data: isEditing ? noticiaEmEdicao.data : new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', ''),
        conteudo: formData.get('conteudo'),
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
          setMensagem({ 
            tipo: 'sucesso', 
            texto: isEditing ? 'Notícia atualizada com sucesso!' : 'Notícia publicada com sucesso no portal!' 
          });
          
          if (!isEditing) {
            e.target.reset();
            setNomeArquivo('');
          } else {
            setNoticiaEmEdicao(null);
          }
        } else {
          setMensagem({ tipo: 'erro', texto: 'Erro ao salvar: ' + resData.message });
        }
      } catch (err) {
        console.error(err);
        setMensagem({ tipo: 'erro', texto: 'Falha na comunicação com o servidor de notícias.' });
      } finally {
        setLoadingForm(false);
      }
    };

    if (imagemArquivo && imagemArquivo.size > 0) {
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
          action: 'DELETE',
          id: id
        })
      });

      const resData = await response.json();

      if (resData.status === 'success') {
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
        
        {/* NAVEGAÇÃO E HEADER */}
        <div className={styles.headerBar}>
          <div>
            <span className={styles.badgeHeader}>
              <Newspaper size={14} /> Módulo Exclusivo de Notícias
            </span>
            <h1 className={styles.mainTitle}>Gerenciador de Notícias</h1>
            <p className={styles.subTitle}>Gerencie as matérias e comunicados oficiais publicados no portal.</p>
          </div>

          <Link href="/admin" className={styles.backLink}>
            <ArrowLeft size={16} /> Voltar ao Painel
          </Link>
        </div>

        {/* SUB-ABAS */}
        <div className={styles.subTabContainer}>
          <button
            onClick={() => {
              setNoticiaEmEdicao(null);
              setAbaSub('cadastrar');
            }}
            className={`${styles.subTabBtn} ${abaSub === 'cadastrar' && !noticiaEmEdicao ? styles.subTabCadastrarActive : ''}`}
          >
            <PlusCircle size={16} /> Cadastrar Nova Notícia
          </button>

          <button
            onClick={() => setAbaSub('gerenciar')}
            className={`${styles.subTabBtn} ${abaSub === 'gerenciar' ? styles.subTabGerenciarActive : ''}`}
          >
            <List size={16} /> Ver e Gerenciar Cadastradas
          </button>
        </div>

        {/* ALERTA DE SUCESSO / ERRO */}
        {mensagem && (
          <div className={`${styles.alertMessage} ${mensagem.tipo === 'sucesso' ? styles.alertSucesso : styles.alertErro}`}>
            {mensagem.tipo === 'sucesso' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            {mensagem.texto}
          </div>
        )}

        {/* FORMULÁRIO DE CADASTRO OU EDIÇÃO */}
        {abaSub === 'cadastrar' && (
          <form onSubmit={handleSubmitNoticia}>
            
            {/* AVISO SE ESTIVER EM MODO DE EDIÇÃO */}
            {noticiaEmEdicao && (
              <div className={styles.editModeBanner}>
                <div>
                  <strong>Editando matéria:</strong> {`"${noticiaEmEdicao.titulo}"`}
                </div>
                <button type="button" onClick={handleCancelarEdicao} className={styles.cancelEditBtn}>
                  <XCircle size={16} /> Cancelar Edição
                </button>
              </div>
            )}

            <div className={styles.formGrid}>
              
              {/* COLUNA ESQUERDA: CONTEÚDO */}
              <div className={styles.cardSection}>
                <h2 className={styles.sectionTitle}>
                  <FileText size={20} color="#0065a4" /> 
                  {noticiaEmEdicao ? 'Editar Conteúdo' : 'Conteúdo da Publicação'}
                </h2>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Título da Notícia*</label>
                  <input 
                    type="text" 
                    name="titulo" 
                    required 
                    defaultValue={noticiaEmEdicao?.titulo || ''}
                    placeholder="Ex: Secretaria lança novo sistema de agendamento online" 
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Resumo (Linha Fina)*</label>
                  <input 
                    type="text" 
                    name="resumo" 
                    required 
                    defaultValue={noticiaEmEdicao?.resumo || ''}
                    placeholder="Resumo de 1 ou 2 frases que ficará visível nos cards da homepage" 
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Texto Completo da Notícia*</label>
                  <textarea 
                    name="conteudo" 
                    rows={10} 
                    required 
                    defaultValue={Array.isArray(noticiaEmEdicao?.conteudo) ? noticiaEmEdicao.conteudo.join('\n\n') : noticiaEmEdicao?.conteudo || ''}
                    placeholder="Digite aqui a matéria completa, detalhes da ação ou comunicado oficial..." 
                    className={styles.textarea}
                  />
                </div>
              </div>

              {/* COLUNA DIREITA: IMAGEM, CATEGORIA E BOTÃO */}
              <div className={styles.rightColumn}>
                
                {/* CARD DE IMAGEM */}
                <div className={styles.cardSection}>
                  <h2 className={styles.sectionTitle}>
                    <UploadCloud size={20} color="#0065a4" /> Capa da Notícia
                  </h2>

                  <div className={styles.dropZone}>
                    <UploadCloud size={36} className={styles.uploadIcon} />
                    <div className={styles.uploadText}>
                      {noticiaEmEdicao ? 'Clique para trocar a imagem' : 'Clique para selecionar'}
                    </div>
                    <div className={styles.uploadSubtext}>Formatos JPG, PNG ou WEBP</div>
                    
                    {nomeArquivo ? (
                      <span className={styles.fileNameBadge}>📷 {nomeArquivo}</span>
                    ) : noticiaEmEdicao?.imagem ? (
                      <span className={styles.fileNameBadge}>📷 Imagem atual mantida</span>
                    ) : null}

                    <input 
                      type="file" 
                      name="imagem" 
                      accept="image/*" 
                      required={!noticiaEmEdicao}
                      onChange={handleFileChange}
                      className={styles.fileInputHidden}
                    />
                  </div>
                </div>

                {/* CARD DE CATEGORIAS */}
                <div className={styles.cardSection}>
                  <h2 className={styles.sectionTitle}>
                    <Settings size={20} color="#0065a4" /> Classificação
                  </h2>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Categoria*</label>
                    <select 
                      name="categoria" 
                      className={styles.select}
                      defaultValue={noticiaEmEdicao?.categoria || 'Inovação'}
                    >
                      <option value="Inovação">Inovação</option>
                      <option value="Campanha">Campanha</option>
                      <option value="Novidades">Novidades</option>
                      <option value="Aviso Oficial">Aviso Oficial</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Estilo do Badge*</label>
                    <select 
                      name="tipoCategoria" 
                      className={styles.select}
                      defaultValue={noticiaEmEdicao?.tipoCategoria || 'infra'}
                    >
                      <option value="infra">Infraestrutura / Inovação (Azul)</option>
                      <option value="vacinacao">Vacinação / Campanha (Verde)</option>
                    </select>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loadingForm}
                    className={styles.submitBtn}
                  >
                    {loadingForm 
                      ? 'Salvando...' 
                      : noticiaEmEdicao 
                        ? <><Pencil size={18} /> Salvar Alterações</> 
                        : <><Send size={18} /> Publicar Notícia</>
                    }
                  </button>
                </div>

              </div>

            </div>
          </form>
        )}

        {/* LISTAGEM DE NOTÍCIAS */}
        {abaSub === 'gerenciar' && (
          <div className={styles.cardSection}>
            <h2 className={styles.sectionTitle}>
              <List size={20} color="#0065a4" /> Notícias Publicadas no Portal
            </h2>

            {loadingLista ? (
              <p className={styles.loadingText}>Carregando matérias...</p>
            ) : listaNoticias.length > 0 ? (
              <div className={styles.newsListContainer}>
                {listaNoticias.map((item) => (
                  <div key={item.id} className={styles.newsItemRow}>
                    <div className={styles.newsItemContent}>
                      <div className={styles.imageThumbnailWrapper}>
                        <Image 
                          src={item.imagem || '/img/noticias/noticia1.jpeg'} 
                          alt={item.titulo} 
                          fill 
                          className={styles.thumbnailImg}
                          unoptimized 
                        />
                      </div>
                      <div>
                        <span className={styles.newsMetaText}>{item.data} | {item.categoria}</span>
                        <h3 className={styles.newsItemTitle}>{item.titulo}</h3>
                      </div>
                    </div>

                    {/* BOTÕES DE AÇÃO */}
                    <div className={styles.actionButtonsGroup}>
                      <button
                        onClick={() => handleIniciarEdicao(item)}
                        className={styles.editBtn}
                        title="Editar notícia"
                      >
                        <Pencil size={15} /> Editar
                      </button>

                      <button
                        onClick={() => handleDeletarNoticia(item.id, item.titulo)}
                        disabled={deletandoId === item.id}
                        className={styles.deleteBtn}
                        title="Excluir notícia"
                      >
                        <Trash2 size={15} />
                        {deletandoId === item.id ? 'Excluindo...' : 'Remover'}
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.emptyText}>Nenhuma notícia encontrada.</p>
            )}
          </div>
        )}

      </div>
    </div>
  );
}