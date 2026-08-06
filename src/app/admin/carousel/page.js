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
  Images, 
  Trash2, 
  List, 
  PlusCircle, 
  Pencil, 
  XCircle,
  Link2 
} from 'lucide-react';
import styles from './AdminCarousel.module.css';

const SCRIPT_CARROSSEL_URL = 'https://script.google.com/macros/s/AKfycbxXCjv22fJcKIuwYV9ml5B6d99pQIX2rT0WBKkbz2JpjV78zADBCCQoGcFvjkt9DuJs3A/exec';

function tratarUrlImagem(url) {
  if (!url || typeof url !== 'string') return '/img/carousel/1.png';
  let cleanUrl = url.trim();

  if (cleanUrl.includes('drive.google.com') || cleanUrl.includes('googleusercontent.com')) {
    let fileId = '';
    if (cleanUrl.includes('/d/')) {
      fileId = cleanUrl.split('/d/')[1].split('/')[0].split('?')[0];
    } else if (cleanUrl.includes('id=')) {
      fileId = cleanUrl.split('id=')[1].split('&')[0];
    }
    if (fileId) return `https://lh3.googleusercontent.com/d/${fileId}`;
  }

  return cleanUrl;
}

export default function AdminCarouselPage() {
  const [abaSub, setAbaSub] = useState('cadastrar');
  const [loadingForm, setLoadingForm] = useState(false);
  const [mensagem, setMensagem] = useState(null);
  const [nomeArquivo, setNomeArquivo] = useState('');
  const [slideEmEdicao, setSlideEmEdicao] = useState(null);

  const [listaSlides, setListaSlides] = useState([]);
  const [loadingSlides, setLoadingSlides] = useState(false);
  const [deletandoId, setDeletandoId] = useState(null);

  useEffect(() => {
    async function carregarSlides() {
      setLoadingSlides(true);
      try {
        const response = await fetch(`${SCRIPT_CARROSSEL_URL}?_t=${Date.now()}`, {
          method: 'GET',
          redirect: 'follow',
        });
        const resData = await response.json();

        if (resData.status === 'success' && Array.isArray(resData.slides)) {
          setListaSlides(resData.slides);
          localStorage.setItem('cache_portal_carrossel', JSON.stringify(resData.slides));
        }
      } catch (err) {
        console.error('Erro ao carregar slides do carrossel:', err);
      } finally {
        setLoadingSlides(false);
      }
    }

    if (abaSub === 'gerenciar') {
      carregarSlides();
    }
  }, [abaSub]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNomeArquivo(e.target.files[0].name);
    }
  };

  const handleIniciarEdicao = (slide) => {
    setSlideEmEdicao(slide);
    setAbaSub('cadastrar');
    setNomeArquivo('');
    setMensagem(null);
  };

  const handleCancelarEdicao = () => {
    setSlideEmEdicao(null);
    setNomeArquivo('');
    setMensagem(null);
  };

  const handleSubmitSlide = async (e) => {
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
        console.error('Erro ao ler dados do usuário:', err);
      }
    }

    const formData = new FormData(e.target);
    const imagemInput = e.target.querySelector('input[name="imagem"]');
    const imagemArquivo = imagemInput && imagemInput.files ? imagemInput.files[0] : null;
    const isEditing = !!slideEmEdicao;

    const processarEnvio = async (base64Image = '', name = '', type = '') => {
      const payload = {
        action: isEditing ? 'UPDATE' : 'CREATE',
        id: isEditing ? slideEmEdicao.id : 'slide-' + Date.now(),
        alt: formData.get('alt'),
        link: formData.get('link') || '', // CAPTURA O LINK
        ordem: formData.get('ordem') || 1,
        autor: autorNome,
        imagemBase64: base64Image,
        imagemNome: name,
        imagemType: type
      };

      try {
        const response = await fetch(SCRIPT_CARROSSEL_URL, {
          method: 'POST',
          body: JSON.stringify(payload),
          redirect: 'follow',
        });

        const resData = await response.json();

        if (resData.status === 'success') {
          localStorage.removeItem('cache_portal_carrossel');

          setMensagem({ 
            tipo: 'sucesso', 
            texto: isEditing ? 'Banner atualizado com sucesso!' : 'Banner publicado no portal com sucesso!' 
          });

          if (!isEditing) {
            e.target.reset();
            setNomeArquivo('');
          } else {
            handleCancelarEdicao();
            setAbaSub('gerenciar');
          }
        } else {
          setMensagem({ tipo: 'erro', texto: 'Erro ao salvar banner: ' + resData.message });
        }
      } catch (err) {
        console.error('Erro na requisição do carrossel:', err);
        setMensagem({ tipo: 'erro', texto: 'Falha na comunicação com o servidor do carrossel.' });
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

  const handleDeletarSlide = async (id, alt) => {
    const confirmou = window.confirm(`Tem certeza que deseja remover o banner:\n"${alt}"?`);
    if (!confirmou) return;

    setDeletandoId(id);

    try {
      const response = await fetch(SCRIPT_CARROSSEL_URL, {
        method: 'POST',
        body: JSON.stringify({
          action: 'DELETE',
          id: id
        }),
        redirect: 'follow',
      });

      const resData = await response.json();

      if (resData.status === 'success') {
        localStorage.removeItem('cache_portal_carrossel');
        alert('Banner excluído com sucesso!');
        setListaSlides((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert('Erro ao excluir: ' + resData.message);
      }
    } catch (err) {
      console.error('Erro ao excluir banner:', err);
      alert('Ocorreu um erro ao tentar excluir o banner.');
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
              <Images size={14} /> Carrossel de Destaques
            </span>
            <h1 className={styles.mainTitle}>Gerenciador de Banners</h1>
            <p className={styles.subTitle}>Cadastre e altere as imagens exibidas no topo do portal público.</p>
          </div>

          <Link href="/admin" className={styles.backLink}>
            <ArrowLeft size={16} /> Voltar ao Painel
          </Link>
        </div>

        <div className={styles.subTabContainer}>
          <button
            onClick={() => { handleCancelarEdicao(); setAbaSub('cadastrar'); }}
            className={`${styles.subTabBtn} ${abaSub === 'cadastrar' && !slideEmEdicao ? styles.subTabCadastrarActive : ''}`}
          >
            <PlusCircle size={16} /> Cadastrar Novo Banner
          </button>

          <button
            onClick={() => setAbaSub('gerenciar')}
            className={`${styles.subTabBtn} ${abaSub === 'gerenciar' ? styles.subTabGerenciarActive : ''}`}
          >
            <List size={16} /> Ver e Gerenciar Banners
          </button>
        </div>

        {mensagem && (
          <div className={`${styles.alertMessage} ${mensagem.tipo === 'sucesso' ? styles.alertSucesso : styles.alertErro}`}>
            {mensagem.tipo === 'sucesso' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            {mensagem.texto}
          </div>
        )}

        {abaSub === 'cadastrar' && (
          <form onSubmit={handleSubmitSlide}>
            {slideEmEdicao && (
              <div className={styles.editModeBanner}>
                <div><strong>Editando banner:</strong> {`"${slideEmEdicao.alt}"`}</div>
                <button type="button" onClick={handleCancelarEdicao} className={styles.cancelEditBtn}>
                  <XCircle size={16} /> Cancelar Edição
                </button>
              </div>
            )}

            <div className={styles.formGrid}>
              <div className={styles.cardSection}>
                <h2 className={styles.sectionTitle}>
                  <Images size={20} color="#0065a4" /> 
                  {slideEmEdicao ? 'Editar Banner' : 'Informações do Banner'}
                </h2>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Título / Descrição do Banner (Acessibilidade)*</label>
                  <input 
                    key={slideEmEdicao ? `alt-${slideEmEdicao.id}` : 'alt-novo'}
                    type="text" 
                    name="alt" 
                    required 
                    defaultValue={slideEmEdicao?.alt || ''} 
                    placeholder="Ex: Campanha de Vacinação contra a Gripe 2026" 
                    className={styles.input} 
                  />
                </div>

                {/* NOVO CAMPO: LINK DE REDIRECIONAMENTO */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>Link de Redirecionamento (Opcional)</label>
                  {/* CÓDIGO CORRIGIDO */}
<input 
  key={slideEmEdicao ? `link-${slideEmEdicao.id}` : 'link-novo'}
  type="text" 
  name="link" 
  defaultValue={slideEmEdicao?.link || ''} 
  placeholder="Ex: /servicos/aplicativos ou https://muriae.mg.gov.br" 
  className={styles.input} 
/>
                  <small style={{ color: '#64748b', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                    Se informado, ao clicar no banner o usuário será direcionado para este link.
                  </small>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Ordem de Exibição*</label>
                  <input 
                    key={slideEmEdicao ? `ord-${slideEmEdicao.id}` : 'ord-novo'}
                    type="number" 
                    name="ordem" 
                    required 
                    defaultValue={slideEmEdicao?.ordem || 1} 
                    min={1} 
                    className={styles.input} 
                  />
                </div>
              </div>

              <div className={styles.rightColumn}>
                <div className={styles.cardSection}>
                  <h2 className={styles.sectionTitle}><UploadCloud size={20} color="#0065a4" /> Imagem do Banner (1920x555)</h2>
                  <div className={styles.dropZone}>
                    <UploadCloud size={36} className={styles.uploadIcon} />
                    <div className={styles.uploadText}>{slideEmEdicao ? 'Clique para trocar a imagem' : 'Clique para selecionar imagem'}</div>
                    <div className={styles.uploadSubtext}>Formatos JPG, PNG ou WEBP</div>
                    {nomeArquivo ? (
                      <span className={styles.fileNameBadge}>📷 {nomeArquivo}</span>
                    ) : slideEmEdicao?.imagem ? (
                      <span className={styles.fileNameBadge}>📷 Imagem mantida</span>
                    ) : null}
                    <input type="file" name="imagem" accept="image/*" onChange={handleFileChange} className={styles.fileInputHidden} />
                  </div>
                </div>

                <div className={styles.cardSection}>
                  <button type="submit" disabled={loadingForm} className={styles.submitBtn}>
                    {loadingForm ? 'Enviando' : slideEmEdicao ? <><Pencil size={18} /> Salvar Alterações</> : <><Send size={18} /> Publicar</>}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        {abaSub === 'gerenciar' && (
          <div className={styles.cardSection}>
            <h2 className={styles.sectionTitle}><List size={20} color="#0065a4" /> Banners Cadastrados</h2>
            {loadingSlides ? (
              <p className={styles.loadingText}>Carregando banners...</p>
            ) : listaSlides.length > 0 ? (
              <div className={styles.newsListContainer}>
                {listaSlides.map((item) => {
                  const imagemUrl = tratarUrlImagem(item.imagem);
                  return (
                    <div key={item.id} className={styles.newsItemRow}>
                      <div className={styles.newsItemContent}>
                        <div className={styles.imageThumbnailWrapper}>
                          <Image 
                            src={imagemUrl} 
                            alt={item.alt || 'Banner'} 
                            fill 
                            className={styles.thumbnailImg} 
                            unoptimized 
                          />
                        </div>
                        <div>
                          <span className={styles.newsMetaText}>Ordem: #{item.ordem || 1} • {item.autor || 'Sistema'}</span>
                          <h3 className={styles.newsItemTitle}>{item.alt}</h3>
                          {item.link && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#0284c7', marginTop: '2px' }}>
                              <Link2 size={12} />
                              <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                                {item.link}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className={styles.actionButtonsGroup}>
                        <button onClick={() => handleIniciarEdicao(item)} className={styles.editBtn}>
                          <Pencil size={15} /> Editar
                        </button>
                        <button onClick={() => handleDeletarSlide(item.id, item.alt)} disabled={deletandoId === item.id} className={styles.deleteBtn}>
                          <Trash2 size={15} /> {deletandoId === item.id ? 'Excluindo...' : 'Remover'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className={styles.emptyText}>Nenhum banner cadastrado no momento.</p>
            )}
          </div>
        )}

      </div>
    </div>
  );
}