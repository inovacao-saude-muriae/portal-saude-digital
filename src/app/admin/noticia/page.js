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
  Newspaper,
  Calendar,
  Trash2,
  List,
  PlusCircle
} from 'lucide-react';
import { getDbNoticias, converterParaDate } from '@/data/noticiasData';
import styles from './Noticia.module.css';

// URL do seu Web App no Google Apps Script
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwsi09GSHFIZSj_y77dxpz7pRBJAKwk0DE_fi_-O8yddeVtU5S6Ue8VFc1uRiGIRbKKMQ/exec';

export default function AdminDashboardPage() {
  // Controle de Abas Principais: 'noticias' ou 'eventos'
  const [abaModulo, setAbaModulo] = useState('noticias'); 

  // Controle de Sub-abas de Notícias: 'cadastrar' ou 'gerenciar'
  const [abaNoticia, setAbaNoticia] = useState('cadastrar');

  // Estados do Formulário de Notícia
  const [loadingForm, setLoadingForm] = useState(false);
  const [mensagem, setMensagem] = useState(null);
  const [nomeArquivo, setNomeArquivo] = useState('');

  // Estados do Gerenciador de Notícias
  const [listaNoticias, setListaNoticias] = useState([]);
  const [loadingLista, setLoadingLista] = useState(false);
  const [deletandoId, setDeletandoId] = useState(null);

  // Dispara a busca de notícias quando a aba "gerenciar" for selecionada
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

    if (abaModulo === 'noticias' && abaNoticia === 'gerenciar') {
      carregarNoticias();
    }
  }, [abaModulo, abaNoticia]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNomeArquivo(e.target.files[0].name);
    }
  };

  // SUBMIT DO FORMULÁRIO DE NOTÍCIA
  const handleSubmitNoticia = async (e) => {
    e.preventDefault();
    setLoadingForm(true);
    setMensagem(null);

    const formData = new FormData(e.target);
    const imagemArquivo = formData.get('imagem');

    const processarEnvio = async (base64Image = '', name = '', type = '') => {
      const payload = {
        action: 'CREATE',
        id: formData.get('titulo')
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-'),
        titulo: formData.get('titulo'),
        resumo: formData.get('resumo'),
        categoria: formData.get('categoria'),
        tipoCategoria: formData.get('tipoCategoria'),
        data: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', ''),
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
          setMensagem({ tipo: 'sucesso', texto: 'Notícia publicada com sucesso no portal!' });
          e.target.reset();
          setNomeArquivo('');
        } else {
          setMensagem({ tipo: 'erro', texto: 'Erro ao cadastrar: ' + resData.message });
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

  // REMOVER NOTÍCIA
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
              <Settings size={14} /> Painel Administrativo
            </span>
            <h1 className={styles.mainTitle}>Área Restrita da Comunicação</h1>
            <p className={styles.subTitle}>Gerencie o conteúdo oficial publicado no portal público da saúde.</p>
          </div>

          <Link href="/" className={styles.backLink}>
            <ArrowLeft size={16} /> Voltar ao Portal
          </Link>
        </div>

        {/* 1. SELETOR DE MÓDULOS (NOTÍCIAS vs EVENTOS) */}
        <div className={styles.moduleSelector}>
          <button
            onClick={() => setAbaModulo('noticias')}
            className={`${styles.moduleBtn} ${abaModulo === 'noticias' ? styles.moduleBtnActive : ''}`}
          >
            <Newspaper size={18} /> Módulo Notícias
          </button>

          <button
            onClick={() => setAbaModulo('eventos')}
            className={`${styles.moduleBtn} ${abaModulo === 'eventos' ? styles.moduleBtnActive : ''}`}
          >
            <Calendar size={18} /> Módulo Eventos
          </button>
        </div>

        {/* ALERTA DE SUCESSO / ERRO DA NOTÍCIA */}
        {mensagem && abaModulo === 'noticias' && (
          <div className={`${styles.alertMessage} ${mensagem.tipo === 'sucesso' ? styles.alertSucesso : styles.alertErro}`}>
            {mensagem.tipo === 'sucesso' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            {mensagem.texto}
          </div>
        )}

        {/* ========================================== */}
        {/* CONTEÚDO DO MÓDULO DE NOTÍCIAS */}
        {/* ========================================== */}
        {abaModulo === 'noticias' && (
          <div>
            {/* SUB-ABAS: CADASTRAR vs GERENCIAR */}
            <div className={styles.subTabContainer}>
              <button
                onClick={() => setAbaNoticia('cadastrar')}
                className={`${styles.subTabBtn} ${abaNoticia === 'cadastrar' ? styles.subTabCadastrarActive : ''}`}
              >
                <PlusCircle size={16} /> Cadastrar Nova Notícia
              </button>

              <button
                onClick={() => setAbaNoticia('gerenciar')}
                className={`${styles.subTabBtn} ${abaNoticia === 'gerenciar' ? styles.subTabGerenciarActive : ''}`}
              >
                <List size={16} /> Ver e Gerenciar Cadastradas
              </button>
            </div>

            {/* ABAS 1A: FORMULÁRIO DE CADASTRO DE NOTÍCIA */}
            {abaNoticia === 'cadastrar' && (
              <form onSubmit={handleSubmitNoticia}>
                <div className={styles.formGrid}>
                  
                  {/* COLUNA ESQUERDA: CONTEÚDO PRINCIPAL */}
                  <div className={styles.cardSection}>
                    <h2 className={styles.sectionTitle}>
                      <FileText size={20} color="#0065a4" /> Conteúdo da Publicação
                    </h2>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Título da Notícia*</label>
                      <input 
                        type="text" 
                        name="titulo" 
                        required 
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
                        placeholder="Digite aqui a matéria completa, detalhes da ação ou comunicado oficial..." 
                        className={styles.textarea}
                      />
                    </div>
                  </div>

                  {/* COLUNA DIREITA: IMAGEM, CATEGORIAS E AÇÃO */}
                  <div className={styles.rightColumn}>
                    
                    {/* CARD DE IMAGEM */}
                    <div className={styles.cardSection}>
                      <h2 className={styles.sectionTitle}>
                        <UploadCloud size={20} color="#0065a4" /> Capa da Notícia
                      </h2>

                      <div className={styles.dropZone}>
                        <UploadCloud size={36} className={styles.uploadIcon} />
                        <div className={styles.uploadText}>Clique para selecionar</div>
                        <div className={styles.uploadSubtext}>Formatos JPG, PNG ou WEBP</div>
                        
                        {nomeArquivo && (
                          <span className={styles.fileNameBadge}>📷 {nomeArquivo}</span>
                        )}

                        <input 
                          type="file" 
                          name="imagem" 
                          accept="image/*" 
                          required 
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
                        <select name="categoria" className={styles.select}>
                          <option value="Inovação">Inovação</option>
                          <option value="Campanha">Campanha</option>
                          <option value="Novidades">Novidades</option>
                          <option value="Aviso Oficial">Aviso Oficial</option>
                        </select>
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.label}>Estilo do Badge*</label>
                        <select name="tipoCategoria" className={styles.select}>
                          <option value="infra">Infraestrutura / Inovação (Azul)</option>
                          <option value="vacinacao">Vacinação / Campanha (Verde)</option>
                        </select>
                      </div>

                      <button 
                        type="submit" 
                        disabled={loadingForm}
                        className={styles.submitBtn}
                      >
                        {loadingForm ? 'Publicando...' : <><Send size={18} /> Publicar Notícia</>}
                      </button>
                    </div>

                  </div>

                </div>
              </form>
            )}

            {/* ABAS 1B: LISTAGEM E REMOÇÃO DE NOTÍCIAS */}
            {abaNoticia === 'gerenciar' && (
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

                        <button
                          onClick={() => handleDeletarNoticia(item.id, item.titulo)}
                          disabled={deletandoId === item.id}
                          className={styles.deleteBtn}
                        >
                          <Trash2 size={15} />
                          {deletandoId === item.id ? 'Excluindo...' : 'Remover'}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={styles.emptyText}>Nenhuma notícia encontrada.</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* ========================================== */}
        {/* CONTEÚDO DO MÓDULO DE EVENTOS */}
        {/* ========================================== */}
        {abaModulo === 'eventos' && (
          <div className={`${styles.cardSection} ${styles.eventsPlaceholder}`}>
            <Calendar size={48} color="#0065a4" className={styles.eventsIcon} />
            <h2 className={styles.eventsTitle}>Gerenciador de Eventos</h2>
            <p className={styles.eventsSubtext}>
              Aqui você poderá cadastrar, acompanhar e gerenciar mutirões de saúde, campanhas de vacinação e eventos oficiais.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}