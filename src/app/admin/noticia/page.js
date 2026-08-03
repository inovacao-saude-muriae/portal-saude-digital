'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  UploadCloud, 
  FileText, 
  Settings, 
  Newspaper 
} from 'lucide-react';
import styles from './Noticia.module.css';

export default function NovaNoticiaPage() {
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState(null);
  const [nomeArquivo, setNomeArquivo] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNomeArquivo(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensagem(null);

    const formData = new FormData(e.target);
    const imagemArquivo = formData.get('imagem');

    const reader = new FileReader();
    reader.readAsDataURL(imagemArquivo);
    reader.onloadend = async () => {
      const base64Image = reader.result.split(',')[1];

      const payload = {
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
        imagemNome: imagemArquivo.name,
        imagemType: imagemArquivo.type
      };

      try {
        // COLE AQUI A URL DO SEU APPS SCRIPT
        const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwsi09GSHFIZSj_y77dxpz7pRBJAKwk0DE_fi_-O8yddeVtU5S6Ue8VFc1uRiGIRbKKMQ/exec';

        const response = await fetch(SCRIPT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload),
        });

        const resData = await response.json();

        if (resData.status === 'success') {
          setMensagem({ tipo: 'sucesso', texto: 'Notícia e imagem publicadas com sucesso no portal!' });
          e.target.reset();
          setNomeArquivo('');
        } else {
          setMensagem({ tipo: 'erro', texto: 'Erro ao cadastrar: ' + resData.message });
        }
      } catch (err) {
        console.error(err);
        setMensagem({ tipo: 'erro', texto: 'Falha na comunicação com o servidor de notícias.' });
      } finally {
        setLoading(false);
      }
    };
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        
        {/* NAVEGAÇÃO E HEADER */}
        <div className={styles.headerBar}>
          <div>
            <span className={styles.badgeHeader}>
              <Newspaper size={14} /> Módulo de Imprensa
            </span>
            <h1 className={styles.mainTitle}>Painel da Comunicação</h1>
            <p className={styles.subTitle}>Crie e publique notícias oficiais diretamente no portal público do cidadão.</p>
          </div>

          <Link href="/" className={styles.backLink}>
            <ArrowLeft size={16} /> Voltar ao Portal
          </Link>
        </div>

        {/* ALERTA DE SUSCESSO / ERRO */}
        {mensagem && (
          <div className={`${styles.alertMessage} ${mensagem.tipo === 'sucesso' ? styles.alertSucesso : styles.alertErro}`}>
            {mensagem.tipo === 'sucesso' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            {mensagem.texto}
          </div>
        )}

        {/* FORMULÁRIO EM DUPAS COLUNAS */}
        <form onSubmit={handleSubmit}>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
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
                  disabled={loading}
                  className={styles.submitBtn}
                >
                  {loading ? 'Publicando...' : <><Send size={18} /> Publicar Notícia</>}
                </button>
              </div>

            </div>

          </div>
        </form>

      </div>
    </div>
  );
}