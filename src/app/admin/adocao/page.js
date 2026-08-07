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
  PawPrint 
} from 'lucide-react';
import styles from './AdminAdocao.module.css';

const SCRIPT_URL = process.env.NEXT_PUBLIC_SCRIPT_CCZ_URL || 'https://script.google.com/macros/s/AKfycbzoGz1c0Q2cRICMbJ7dSA-xp_UPL7O_W2BDojgHKbY_gMdK4aVUCSAxOJHd_o2j6ja8YQ/exec';

export default function AdminAdocaoPage() {
  const router = useRouter();

  const [animais, setAnimais] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [msgSucesso, setMsgSucesso] = useState('');

  const [novoAnimal, setNovoAnimal] = useState({
    nome: '',
    especie: 'Cachorro',
    sexo: 'macho',
    filhote: 'false',
    descricao: ''
  });

  const [arquivoFoto, setArquivoFoto] = useState(null);
  const [previewFoto, setPreviewFoto] = useState('');

  // 1. VERIFICAÇÃO DE PERMISSÃO / SEGURANÇA DA ROTA
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
        
        // Cargos com acesso permitido a esta rota
        const cargosPermitidos = ['admin', 'ccz'];
        
        if (!cargosPermitidos.includes(cargo)) {
          alert('Acesso negado: Você não possui permissão para acessar o módulo do CCZ.');
          router.push('/admin');
        }
      } catch (e) {
        console.error('Erro ao validar permissões:', e);
      }
    }
  }, [router]);

  // 2. FUNÇÃO MANUAL DE RECARREGAMENTO
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

  const handleCadastrar = async (e) => {
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

      await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'ADD_ANIMAL',
          ...novoAnimal,
          imagemBase64,
          imagemNome,
          imagemType
        })
      });

      setMsgSucesso('Animal cadastrado com sucesso!');
      setNovoAnimal({ nome: '', especie: 'Cachorro', sexo: 'macho', filhote: 'false', descricao: '' });
      setArquivoFoto(null);
      setPreviewFoto('');

      setTimeout(() => {
        buscarAnimais();
        setMsgSucesso('');
      }, 1200);

    } catch (err) {
      console.error(err);
      alert('Erro ao cadastrar animal.');
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
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir animal.');
    }
  };

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
            <p className={styles.subTitle}>Cadastre e remova os peludinhos protegidos pelo CCZ.</p>
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
          {/* COLUNA ESQUERDA: FORMULÁRIO DE CADASTRO */}
          <div className={styles.cardForm}>
            <div className={styles.cardHeader}>
              <Plus size={18} color="#008a83" />
              <h2>Cadastrar Novo Animal</h2>
            </div>

            <form onSubmit={handleCadastrar} className={styles.formContainer}>
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

              {/* UPLOAD DA FOTO */}
              <div className={styles.inputGroup}>
                <label>Foto do Animal *</label>
                <label className={styles.fileBox}>
                  <Upload size={20} color="#008a83" />
                  <span>{arquivoFoto ? arquivoFoto.name : 'Clique para selecionar a foto'}</span>
                  <input type="file" accept="image/*" onChange={handleFotoChange} hidden required />
                </label>
              </div>

              {previewFoto && (
                <div className={styles.previewBox}>
                  <Image src={previewFoto} alt="Preview" width={100} height={130} unoptimized className={styles.previewImg} />
                </div>
              )}

              <button type="submit" disabled={enviando} className={styles.btnSalvar}>
                {enviando ? <Loader2 size={18} className="animate-spin" /> : 'Cadastrar Animal'}
              </button>
            </form>
          </div>

          {/* COLUNA DIREITA: LISTA DE ANIMAIS JÁ CADASTRADOS */}
          <div className={styles.cardLista}>
            <div className={styles.cardHeader}>
              <PawPrint size={18} color="#008a83" />
              <h2>Animais Cadastrados ({animais.length})</h2>
            </div>

            {carregando ? (
              <div className={styles.loadingBox}>
                <Loader2 size={24} className="animate-spin" /> Carregando lista de animais...
              </div>
            ) : animais.length === 0 ? (
              <p className={styles.emptyMsg}>Nenhum animal cadastrado na planilha ainda.</p>
            ) : (
              <div className={styles.animaisList}>
                {animais.map((animal) => (
                  <div key={animal.id} className={styles.animalRow}>
                    <Image 
                      src={animal.foto} 
                      alt={animal.nome} 
                      width={60} 
                      height={80} 
                      unoptimized 
                      className={styles.thumbImg} 
                    />
                    <div className={styles.animalInfo}>
                      <h3>{animal.nome}</h3>
                      <p>
                        {animal.especie} • {animal.sexo === 'macho' ? 'Macho' : 'Fêmea'} • {animal.filhote === 'true' ? 'Filhote' : 'Adulto'}
                      </p>
                    </div>
                    <button 
                      onClick={() => handleExcluir(animal.id, animal.nome)} 
                      className={styles.btnDelete} 
                      title="Excluir animal"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}