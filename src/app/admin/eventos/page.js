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
  ClipboardList
} from 'lucide-react';
import styles from './Eventos.module.css';

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx1tWcH_pkyhUNdR1safUWAGrlNfJWSMRqSps09p7yc5lBXO2c5iEGJXQl5Sz2bmPex/exec';

export default function AdminEventosPage() {
  const [abaSub, setAbaSub] = useState('cadastrar');

  const [loadingForm, setLoadingForm] = useState(false);
  const [mensagem, setMensagem] = useState(null);
  const [nomeArquivo, setNomeArquivo] = useState('');
  const [eventoEmEdicao, setEventoEmEdicao] = useState(null);

  // Estados de Inscrição e Certificado
  const [requerInscricao, setRequerInscricao] = useState(false);
  const [geraCertificado, setGeraCertificado] = useState(false);

  // Estado do Cronograma Dinâmico
  const [cronograma, setCronograma] = useState([]);

  const [listaEventos, setListaEventos] = useState([]);
  const [loadingEventos, setLoadingEventos] = useState(false);
  const [deletandoId, setDeletandoId] = useState(null);

  useEffect(() => {
    async function carregarEventos() {
      setLoadingEventos(true);
      try {
        const response = await fetch(`${SCRIPT_URL}?target=EVENT&action=GET_ALL`);
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
    setAbaSub('cadastrar');
    setNomeArquivo('');
    setMensagem(null);
  };

  const handleCancelarEdicao = () => {
    setEventoEmEdicao(null);
    setCronograma([]);
    setRequerInscricao(false);
    setGeraCertificado(false);
    setNomeArquivo('');
    setMensagem(null);
  };

  const handleSubmitEvento = async (e) => {
    e.preventDefault();
    setLoadingForm(true);
    setMensagem(null);

    const formData = new FormData(e.target);
    const imagemArquivo = formData.get('imagem');
    const isEditing = !!eventoEmEdicao;

    const processarEnvio = async (base64Image = '', name = '', type = '') => {
      const payload = {
        target: 'EVENT',
        action: isEditing ? 'UPDATE' : 'CREATE',
        id: isEditing ? eventoEmEdicao.id : 'evt-' + Date.now(),
        titulo: formData.get('titulo'),
        local: formData.get('local'),
        dataEvento: formData.get('dataEvento'),
        hora: formData.get('hora'),
        categoria: formData.get('categoria'),
        descricao: formData.get('descricao'),
        requerInscricao: requerInscricao,
        geraCertificado: requerInscricao ? geraCertificado : false,
        cronograma: cronograma.filter((item) => item.horario.trim() !== '' || item.atividade.trim() !== ''),
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
            texto: isEditing ? 'Evento atualizado com sucesso!' : 'Evento publicado com sucesso no portal!' 
          });
          if (!isEditing) {
            e.target.reset();
            setCronograma([]);
            setRequerInscricao(false);
            setGeraCertificado(false);
            setNomeArquivo('');
          } else {
            handleCancelarEdicao();
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
                  <label className={styles.label}>Local / Endereço Completo*</label>
                  <input type="text" name="local" required defaultValue={eventoEmEdicao?.local || ''} placeholder="Ex: UBS Centro - Av. Juscelino Kubitschek" className={styles.input} />
                </div>

                <div className={styles.rowTwoCols}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Data do Evento*</label>
                    <input type="text" name="dataEvento" required defaultValue={eventoEmEdicao?.dataEvento || ''} placeholder="Ex: 15/08/2026" className={styles.input} />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Horário de Atendimento*</label>
                    <input type="text" name="hora" required defaultValue={eventoEmEdicao?.hora || ''} placeholder="Ex: 08:00 às 17:00" className={styles.input} />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Descrição / Orientação ao Cidadão*</label>
                  <textarea name="descricao" rows={5} required defaultValue={eventoEmEdicao?.descricao || ''} placeholder="Informe detalhes, documentos necessários, público-alvo..." className={styles.textarea} />
                </div>

                {/* OPÇÕES DE INSCRIÇÃO E CERTIFICADO */}
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
                    )}
                  </div>
                </div>

                {/* CRONOGRAMA DINÂMICO */}
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
                    {nomeArquivo ? <span className={styles.fileNameBadge}>📷 {nomeArquivo}</span> : eventoEmEdicao?.imagem ? <span className={styles.fileNameBadge}>📷 Imagem mantida</span> : null}
                    <input type="file" name="imagem" accept="image/*" required={!eventoEmEdicao} onChange={handleFileChange} className={styles.fileInputHidden} />
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
                    {loadingForm ? 'Salvando...' : eventoEmEdicao ? <><Pencil size={18} /> Salvar Alterações</> : <><Send size={18} /> Publicar Evento</>}
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
                        <Image src={item.imagem || '/img/noticias/noticia1.jpeg'} alt={item.titulo} fill className={styles.thumbnailImg} unoptimized />
                      </div>
                      <div>
                        <span className={styles.newsMetaText}>
                          {item.categoria} {item.requerInscricao && ' • Inscrição Obrigatória'} {item.geraCertificado && ' • 📜 Certificado'}
                        </span>
                        <h3 className={styles.newsItemTitle}>{item.titulo}</h3>
                        <div className={styles.eventDetailsRow}>
                          <span><MapPin size={12} /> {item.local}</span>
                          <span><Clock size={12} /> {item.dataEvento} - {item.hora}</span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.actionButtonsGroup}>
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
    </div>
  );
}