'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Plus, 
  Trash2, 
  Upload, 
  Loader2, 
  CheckCircle2, 
  ArrowLeft, 
  ShieldCheck, 
  PawPrint,
  Pencil,
  XCircle,
  Search,
  ImageOff,
  ClipboardList,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { API_CONFIG, buildApiUrl } from '@/lib/config';
import { useUI } from '@/components/UIFeedback';
import styles from './AdminAdocao.module.css';

export default function AdminAdocaoPage() {
  const router = useRouter();
  const { notificar, confirmar } = useUI();

  const [animais, setAnimais] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [msgSucesso, setMsgSucesso] = useState('');

  // ESTADO PARA PESQUISA NA LISTA
  const [buscaAnimal, setBuscaAnimal] = useState('');

  // ESTADO PARA CONTROLAR A EDIÇÃO DE UM ANIMAL
  const [animalEmEdicao, setAnimalEmEdicao] = useState(null);

  const [novoAnimal, setNovoAnimal] = useState({
    idAnimal: '',
    nome: '',
    especie: 'Cachorro',
    sexo: 'macho',
    filhote: 'false',
    descricao: ''
  });

  const [arquivoFoto, setArquivoFoto] = useState(null);
  const [previewFoto, setPreviewFoto] = useState('');

  // SOLICITAÇÕES DE ADOÇÃO (por animal)
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [animalExpandido, setAnimalExpandido] = useState(null);

  // 1. VERIFICAÇÃO DE PERMISSÃO
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
        const cargosPermitidos = ['admin', 'master', 'gestor', 'ccz', 'zoonoses', 'veterinario'];
        
        if (!cargosPermitidos.includes(cargo)) {
          notificar('erro', 'Acesso negado: você não possui permissão para acessar o módulo do CCZ.');
          router.push('/admin');
        }
      } catch (e) {
        console.error('Erro ao validar permissões:', e);
      }
    }
  }, [router, notificar]);

  // 2. CARREGAMENTO INICIAL DOS ANIMAIS (SEGURO E SEM RE-RENDERS INFINITOS)
  useEffect(() => {
    let montado = true;

    async function carregarAnimais() {
      setCarregando(true);
      try {
        const { data, error } = await supabase
          .from('ccz_animais')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (montado) setAnimais(data || []);
      } catch (err) {
        console.error('Erro ao buscar animais no Supabase:', err);
      } finally {
        if (montado) setCarregando(false);
      }
    }

    carregarAnimais();

    return () => {
      montado = false;
    };
  }, []); // Array vazio garante que roda apenas 1 vez ao carregar

  // CARREGA AS SOLICITAÇÕES DE ADOÇÃO (para exibir por animal)
  useEffect(() => {
    let montado = true;

    async function carregarSolicitacoes() {
      try {
        const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.ADOCAO_SOLICITACOES, { _t: Date.now() }));
        const data = await res.json();
        if (montado && data.status === 'success') {
          setSolicitacoes(data.solicitacoes || []);
        }
      } catch (err) {
        console.error('Erro ao carregar solicitações de adoção:', err);
      }
    }

    carregarSolicitacoes();

    return () => {
      montado = false;
    };
  }, []);

  // Retorna as solicitações feitas para um animal específico
  const solicitacoesDoAnimal = (animal) => {
    return solicitacoes.filter((s) => {
      const porId = s.animal_id && animal.id && String(s.animal_id) === String(animal.id);
      const porNome = s.animal_nome && animal.nome &&
        s.animal_nome.toLowerCase().trim() === animal.nome.toLowerCase().trim();
      return porId || porNome;
    });
  };

  // FUNÇÃO AUXILIAR PARA RECARREGAR A LISTA APÓS SALVAR/EXCLUIR
  const recarregarLista = async () => {
    try {
      const { data, error } = await supabase
        .from('ccz_animais')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setAnimais(data);
      }
    } catch (err) {
      console.error('Erro ao recarregar lista:', err);
    }
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArquivoFoto(file);
      setPreviewFoto(URL.createObjectURL(file));
    }
  };

  // UPLOAD DA FOTO PARA O BUCKET 'ccz' NO SUPABASE STORAGE
  const uploadFotoAnimal = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `animal_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('ccz')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabase.storage
      .from('ccz')
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  };

  // INICIAR EDIÇÃO
  const handleIniciarEdicao = (animal) => {
    setAnimalEmEdicao(animal);
    setNovoAnimal({
      idAnimal: animal.id_animal || '',
      nome: animal.nome || '',
      especie: animal.especie || 'Cachorro',
      sexo: animal.sexo || 'macho',
      filhote: String(animal.filhote) === 'true' ? 'true' : 'false',
      descricao: animal.descricao || ''
    });
    
    const fotoExistente = animal.foto || animal.imagemUrl || animal.imagem || '';
    setPreviewFoto(fotoExistente === 'SEM_FOTO' ? '' : fotoExistente);
    setArquivoFoto(null);
    setMsgSucesso('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // CANCELAR EDIÇÃO
  const handleCancelarEdicao = () => {
    setAnimalEmEdicao(null);
    setNovoAnimal({
      idAnimal: '',
      nome: '',
      especie: 'Cachorro',
      sexo: 'macho',
      filhote: 'false',
      descricao: ''
    });
    setArquivoFoto(null);
    setPreviewFoto('');
  };

  // CADASTRAR OU ATUALIZAR ANIMAL NO SUPABASE
  const handleCadastrarOuEditar = async (e) => {
    e.preventDefault();
    setEnviando(true);

    try {
      const isEditing = !!animalEmEdicao;
      let urlFotoFinal = isEditing ? (animalEmEdicao.foto || 'SEM_FOTO') : 'SEM_FOTO';

      if (arquivoFoto) {
        urlFotoFinal = await uploadFotoAnimal(arquivoFoto);
      }

      const payload = {
        id_animal: novoAnimal.idAnimal.trim(),
        nome: novoAnimal.nome.trim(),
        especie: novoAnimal.especie,
        sexo: novoAnimal.sexo,
        filhote: novoAnimal.filhote === 'true',
        descricao: novoAnimal.descricao.trim(),
        foto: urlFotoFinal
      };

      let error;

      if (isEditing) {
        const { error: updateError } = await supabase
          .from('ccz_animais')
          .update(payload)
          .eq('id', animalEmEdicao.id);
        error = updateError;
      } else {
        // ID único (ms + sufixo aleatório) evita colisão de chave quando
        // dois animais são cadastrados no mesmo segundo.
        const novoId = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
        const { error: insertError } = await supabase
          .from('ccz_animais')
          .insert([{ id: novoId, ...payload }]);
        error = insertError;
      }

      if (error) throw error;

      setMsgSucesso(isEditing ? 'Animal atualizado com sucesso!' : 'Animal cadastrado com sucesso!');
      
      handleCancelarEdicao();
      await recarregarLista();

      setTimeout(() => {
        setMsgSucesso('');
      }, 2500);

    } catch (err) {
      console.error('Erro ao salvar animal:', err);
      notificar('erro', 'Erro ao salvar informações do animal: ' + err.message);
    } finally {
      setEnviando(false);
    }
  };

  // EXCLUIR ANIMAL NO SUPABASE
  const handleExcluir = async (id, nome) => {
    const confirmou = await confirmar({
      titulo: 'Remover animal',
      mensagem: `Tem certeza que deseja remover o animal "${nome}" da lista de adoção?`,
      textoConfirmar: 'Remover'
    });
    if (!confirmou) return;

    try {
      const { error } = await supabase
        .from('ccz_animais')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAnimais((prev) => prev.filter((a) => a.id !== id));
      if (animalEmEdicao?.id === id) handleCancelarEdicao();
    } catch (err) {
      console.error('Erro ao excluir animal:', err);
      notificar('erro', 'Erro ao excluir animal: ' + err.message);
    }
  };

  // FILTRAGEM DINÂMICA DA LISTA
  const animaisFiltrados = animais.filter((animal) => {
    const termo = buscaAnimal.toLowerCase().trim();
    if (!termo) return true;

    const nome = (animal.nome || '').toLowerCase();
    const especie = (animal.especie || '').toLowerCase();
    const sexo = (animal.sexo || '').toLowerCase();
    const descricao = (animal.descricao || '').toLowerCase();
    const idade = String(animal.filhote) === 'true' ? 'filhote' : 'adulto';

    return (
      nome.includes(termo) ||
      especie.includes(termo) ||
      sexo.includes(termo) ||
      descricao.includes(termo) ||
      idade.includes(termo)
    );
  });

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        
        {/* CABEÇALHO */}
        <div className={styles.headerBar}>
          <div>
            <span className={styles.badgeHeader}>
              <ShieldCheck size={14} /> Gestão CCZ
            </span>
            <h1 className={styles.mainTitle}>Controle de Animais para Adoção</h1>
            <p className={styles.subTitle}>Cadastre, edite e remova os peludinhos protegidos pelo CCZ.</p>
          </div>
          <Link href="/admin" className={styles.backBtn}>
            <ArrowLeft size={16} /> Voltar ao Painel
          </Link>
        </div>

        {/* ALERTA DE SUCESSO */}
        {msgSucesso && (
          <div className={styles.alertSuccess}>
            <CheckCircle2 size={18} /> {msgSucesso}
          </div>
        )}

        <div className={styles.layoutGrid}>
          {/* COLUNA ESQUERDA: FORMULÁRIO DE CADASTRO / EDIÇÃO */}
          <div className={styles.cardForm}>
            <div className={styles.cardHeaderFlex}>
              <div className={styles.cardTitleGroup}>
                {animalEmEdicao ? <Pencil size={18} color="#008a83" /> : <Plus size={18} color="#008a83" />}
                <h2>{animalEmEdicao ? `Editar: ${animalEmEdicao.nome}` : 'Cadastrar Novo Animal'}</h2>
              </div>

              {animalEmEdicao && (
                <button 
                  type="button" 
                  onClick={handleCancelarEdicao}
                  className={styles.cancelEditBtn}
                >
                  <XCircle size={15} /> Cancelar Edição
                </button>
              )}
            </div>

            <form onSubmit={handleCadastrarOuEditar} className={styles.formContainer}>
              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label>ID do Animal</label>
                  <input 
                    type="text" 
                    value={novoAnimal.idAnimal}
                    onChange={(e) => setNovoAnimal({ ...novoAnimal, idAnimal: e.target.value })}
                    placeholder="Ex: CCZ-001 (opcional)"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Nome do Animal *</label>
                  <input 
                    type="text" 
                    required 
                    value={novoAnimal.nome}
                    onChange={(e) => setNovoAnimal({ ...novoAnimal, nome: e.target.value })}
                    placeholder="Ex: Paçoca"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label>Espécie *</label>
                  <select 
                    value={novoAnimal.especie}
                    onChange={(e) => setNovoAnimal({ ...novoAnimal, especie: e.target.value })}
                  >
                    <option value="Cachorro">Cachorro</option>
                    <option value="Gato">Gato</option>
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label>Sexo *</label>
                  <select 
                    value={novoAnimal.sexo}
                    onChange={(e) => setNovoAnimal({ ...novoAnimal, sexo: e.target.value })}
                  >
                    <option value="macho">Macho</option>
                    <option value="femea">Fêmea</option>
                  </select>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>É Filhote? *</label>
                <select 
                  value={novoAnimal.filhote}
                  onChange={(e) => setNovoAnimal({ ...novoAnimal, filhote: e.target.value })}
                >
                  <option value="false">Não (Adulto)</option>
                  <option value="true">Sim (Filhote)</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label>Descrição e Histórico *</label>
                <textarea 
                  rows={4}
                  required
                  value={novoAnimal.descricao}
                  onChange={(e) => setNovoAnimal({ ...novoAnimal, descricao: e.target.value })}
                  placeholder="Informe se é vacinado, castrado, temperamento..."
                />
              </div>

              {/* UPLOAD DA FOTO (OPCIONAL) */}
              <div className={styles.inputGroup}>
                <label>Foto do Animal (Opcional)</label>
                <label className={styles.fileBox}>
                  <Upload size={20} color="#008a83" />
                  <span>{arquivoFoto ? arquivoFoto.name : 'Clique para selecionar a foto'}</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFotoChange} 
                    hidden 
                  />
                </label>
              </div>

              {previewFoto && previewFoto !== 'SEM_FOTO' && (
                <div className={styles.previewBox}>
                  <Image 
                    src={previewFoto} 
                    alt="Preview" 
                    width={100} 
                    height={130} 
                    unoptimized 
                    className={styles.previewImg} 
                  />
                </div>
              )}

              <button type="submit" disabled={enviando} className={styles.btnSalvar}>
                {enviando ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : animalEmEdicao ? (
                  'Salvar Alterações'
                ) : (
                  'Cadastrar Animal'
                )}
              </button>
            </form>
          </div>

          {/* COLUNA DIREITA: LISTA DE ANIMAIS JÁ CADASTRADOS */}
          <div className={styles.cardLista}>
            <div className={styles.cardHeaderFlex}>
              <div className={styles.cardTitleGroup}>
                <PawPrint size={18} color="#008a83" />
                <h2>Animais Cadastrados ({animaisFiltrados.length})</h2>
              </div>
            </div>

            {/* BARRA DE PESQUISA EM TEMPO REAL */}
            <div className={styles.searchBoxList}>
              <Search size={18} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Pesquisar por nome, espécie, sexo..."
                value={buscaAnimal}
                onChange={(e) => setBuscaAnimal(e.target.value)}
                className={styles.searchInputList}
              />
              {buscaAnimal && (
                <button
                  type="button"
                  className={styles.clearSearchBtn}
                  onClick={() => setBuscaAnimal('')}
                >
                  ✕
                </button>
              )}
            </div>

            {carregando ? (
              <div className={styles.loadingBox}>
                <Loader2 size={24} className="animate-spin" /> Carregando lista de animais...
              </div>
            ) : animaisFiltrados.length === 0 ? (
              <p className={styles.emptyMsg}>
                {buscaAnimal 
                  ? `Nenhum animal encontrado para "${buscaAnimal}".`
                  : 'Nenhum animal cadastrado no banco ainda.'}
              </p>
            ) : (
              <div className={styles.animaisList}>
                {animaisFiltrados.map((animal) => {
                  const urlFoto = animal.foto || animal.imagemUrl || animal.imagem || '';
                  const temFotoValida = urlFoto && urlFoto !== 'SEM_FOTO' && urlFoto !== 'undefined' && urlFoto !== 'null';

                  const pedidos = solicitacoesDoAnimal(animal);
                  const expandido = animalExpandido === animal.id;

                  return (
                    <div key={animal.id} className={styles.animalWrapper}>
                      <div className={styles.animalRow}>

                        {/* EXIBIÇÃO DE FOTO OU BOX "SEM FOTO" */}
                        {temFotoValida ? (
                          <Image 
                            src={urlFoto} 
                            alt={animal.nome} 
                            width={60} 
                            height={80} 
                            unoptimized 
                            className={styles.thumbImg} 
                          />
                        ) : (
                          <div className={styles.noPhotoBox}>
                            <ImageOff size={20} />
                            <span>Sem foto</span>
                          </div>
                        )}

                        <div className={styles.animalInfo}>
                          <h3>
                            {animal.id_animal ? <span className={styles.idAnimalTag}>{animal.id_animal}</span> : null}
                            {animal.nome}
                          </h3>
                          <p>
                            {animal.especie} • {animal.sexo === 'macho' ? 'Macho' : 'Fêmea'} • {String(animal.filhote) === 'true' ? 'Filhote' : 'Adulto'}
                          </p>
                          <button
                            type="button"
                            onClick={() => setAnimalExpandido(expandido ? null : animal.id)}
                            className={`${styles.btnSolicitacoes} ${pedidos.length > 0 ? styles.btnSolicitacoesAtivo : ''}`}
                          >
                            <ClipboardList size={14} />
                            {pedidos.length > 0
                              ? `${pedidos.length} solicitaç${pedidos.length === 1 ? 'ão' : 'ões'} de adoção`
                              : 'Nenhuma solicitação'}
                            {pedidos.length > 0 && (expandido ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                          </button>
                        </div>

                        <div className={styles.actionGroup}>
                          <button 
                            onClick={() => handleIniciarEdicao(animal)} 
                            className={styles.btnEdit} 
                            title="Editar animal"
                          >
                            <Pencil size={16} />
                          </button>

                          <button 
                            onClick={() => handleExcluir(animal.id, animal.nome)} 
                            className={styles.btnDelete} 
                            title="Excluir animal"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {/* PAINEL EXPANSÍVEL COM AS SOLICITAÇÕES DO ANIMAL */}
                      {expandido && pedidos.length > 0 && (
                        <div className={styles.solicitacoesPainel}>
                          {pedidos.map((s) => (
                            <div key={s.id} className={styles.solicitacaoCard}>
                              <div className={styles.solicitacaoTopo}>
                                <strong>{s.nome}</strong>
                                <span className={styles.solicitacaoData}>
                                  {s.created_at ? new Date(s.created_at).toLocaleString('pt-BR') : ''}
                                </span>
                              </div>
                              <div className={styles.solicitacaoInfo}>
                                <span><b>CPF:</b> {s.cpf || '-'}</span>
                                <span><b>Telefone:</b> {s.telefone || '-'}</span>
                                <span className={styles.solicitacaoEndereco}>
                                  <b>Endereço:</b> {[s.rua, s.numero && `nº ${s.numero}`, s.bairro, s.cidade, s.cep].filter(Boolean).join(', ') || '-'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}