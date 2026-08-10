'use client';

import { useState, useEffect, useCallback } from 'react';
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
  ImageOff
} from 'lucide-react';
import styles from './AdminAdocao.module.css';

const SCRIPT_URL = process.env.NEXT_PUBLIC_SCRIPT_CCZ_URL || 'https://script.google.com/macros/s/AKfycbzoGz1c0Q2cRICMbJ7dSA-xp_UPL7O_W2BDojgHKbY_gMdK4aVUCSAxOJHd_o2j6ja8YQ/exec';

export default function AdminAdocaoPage() {
  const router = useRouter();

  const [animais, setAnimais] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [msgSucesso, setMsgSucesso] = useState('');

  // ESTADO PARA PESQUISA NA LISTA
  const [buscaAnimal, setBuscaAnimal] = useState('');

  // ESTADO PARA CONTROLAR A EDIÇÃO DE UM ANIMAL
  const [animalEmEdicao, setAnimalEmEdicao] = useState(null);

  const [novoAnimal, setNovoAnimal] = useState({
    nome: '',
    especie: 'Cachorro',
    sexo: 'macho',
    filhote: 'false',
    descricao: ''
  });

  const [arquivoFoto, setArquivoFoto] = useState(null);
  const [previewFoto, setPreviewFoto] = useState('');

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
          alert('Acesso negado: Você não possui permissão para acessar o módulo do CCZ.');
          router.push('/admin');
        }
      } catch (e) {
        console.error('Erro ao validar permissões:', e);
      }
    }
  }, [router]);

  // 2. BUSCAR ANIMAIS
  const buscarAnimais = useCallback(async () => {
    setCarregando(true);
    try {
      const res = await fetch(`${SCRIPT_URL}?action=GET_ANIMAIS&t=${Date.now()}`, {
        method: 'GET',
        redirect: 'follow',
      });
      const data = await res.json();
      if (data && data.status === 'success') {
        setAnimais(data.animais || []);
      }
    } catch (err) {
      console.error('Erro ao buscar animais:', err);
    } finally {
      setCarregando(false);
    }
  }, []);

  // 3. CARREGAMENTO INICIAL
  useEffect(() => {
    let ativo = true;

    async function carregarIniciais() {
      setCarregando(true);
      try {
        const res = await fetch(`${SCRIPT_URL}?action=GET_ANIMAIS&t=${Date.now()}`, {
          method: 'GET',
          redirect: 'follow',
        });
        const data = await res.json();
        if (ativo && data && data.status === 'success') {
          setAnimais(data.animais || []);
        }
      } catch (err) {
        console.error('Erro ao buscar animais:', err);
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregarIniciais();

    return () => {
      ativo = false;
    };
  }, []);

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArquivoFoto(file);
      setPreviewFoto(URL.createObjectURL(file));
    }
  };

  // INICIAR EDIÇÃO
  const handleIniciarEdicao = (animal) => {
    setAnimalEmEdicao(animal);
    setNovoAnimal({
      nome: animal.nome || '',
      especie: animal.especie || 'Cachorro',
      sexo: animal.sexo || 'macho',
      filhote: String(animal.filhote) === 'true' ? 'true' : 'false',
      descricao: animal.descricao || ''
    });
    
    // Se foto for "SEM_FOTO", limpa o preview para indicar que está sem foto
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
      nome: '',
      especie: 'Cachorro',
      sexo: 'macho',
      filhote: 'false',
      descricao: ''
    });
    setArquivoFoto(null);
    setPreviewFoto('');
  };

  // CADASTRAR OU ATUALIZAR ANIMAL
  const handleCadastrarOuEditar = async (e) => {
    e.preventDefault();
    setEnviando(true);

    try {
      let imagemBase64 = '';
      let imagemNome = '';
      let imagemType = '';

      if (arquivoFoto) {
        imagemNome = arquivoFoto.name;
        imagemType = arquivoFoto.type;
        imagemBase64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result.split(',')[1]);
          reader.readAsDataURL(arquivoFoto);
        });
      }

      const isEditing = !!animalEmEdicao;

      // Se não enviou arquivo nem tinha foto anterior, marca como SEM_FOTO
      const fotoFinalAntiga = isEditing ? (animalEmEdicao.foto || 'SEM_FOTO') : 'SEM_FOTO';

      const payload = {
        action: isEditing ? 'UPDATE_ANIMAL' : 'ADD_ANIMAL',
        id: isEditing ? animalEmEdicao.id : undefined,
        ...novoAnimal,
        imagemBase64,
        imagemNome,
        imagemType,
        fotoAntiga: fotoFinalAntiga,
        semFoto: !arquivoFoto && (!isEditing || animalEmEdicao.foto === 'SEM_FOTO')
      };

      await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });

      setMsgSucesso(isEditing ? 'Animal atualizado com sucesso!' : 'Animal cadastrado com sucesso!');
      
      handleCancelarEdicao();

      setTimeout(() => {
        buscarAnimais();
        setMsgSucesso('');
      }, 1200);

    } catch (err) {
      console.error(err);
      alert('Erro ao salvar informações do animal.');
    } finally {
      setEnviando(false);
    }
  };

  const handleExcluir = async (id, nome) => {
    if (!confirm(`Tem certeza que deseja remover o animal "${nome}" da lista de adoção?`)) return;

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'DELETE_ANIMAL',
          id: id
        })
      });

      setAnimais((prev) => prev.filter((a) => a.id !== id));
      if (animalEmEdicao?.id === id) handleCancelarEdicao();
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir animal.');
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
    const idade = animal.filhote === 'true' ? 'filhote' : 'adulto';

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
                <label>
                  Foto do Animal (Opcional)
                </label>
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
                  : 'Nenhum animal cadastrado na planilha ainda.'}
              </p>
            ) : (
              <div className={styles.animaisList}>
                {animaisFiltrados.map((animal) => {
                  const urlFoto = animal.foto || animal.imagemUrl || animal.imagem || '';
                  const temFotoValida = urlFoto && urlFoto !== 'SEM_FOTO' && urlFoto !== 'undefined' && urlFoto !== 'null';

                  return (
                    <div key={animal.id} className={styles.animalRow}>
                      
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
                        <h3>{animal.nome}</h3>
                        <p>
                          {animal.especie} • {animal.sexo === 'macho' ? 'Macho' : 'Fêmea'} • {animal.filhote === 'true' ? 'Filhote' : 'Adulto'}
                        </p>
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