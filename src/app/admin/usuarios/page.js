'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ShieldCheck,
  UserPlus,
  Trash2,
  Loader2,
  User,
  AtSign,
  KeyRound,
  Users,
  Save,
  Pencil,
  XCircle
} from 'lucide-react';
import { API_CONFIG, buildApiUrl } from '@/lib/config';
import { useUI } from '@/components/UIFeedback';
import styles from './AdminUsuarios.module.css';

// Rótulos amigáveis dos cargos
const CARGOS = [
  { valor: 'admin', label: 'Administrador', descricao: 'Acesso total ao sistema' },
  { valor: 'ccz', label: 'CCZ / Zoonoses', descricao: 'Adoção de animais e solicitações' },
  { valor: 'comunicacao', label: 'Comunicação', descricao: 'Notícias, eventos, carrossel e indicadores' }
];

function labelCargo(cargo) {
  const c = CARGOS.find((x) => x.valor === String(cargo || '').toLowerCase());
  return c ? c.label : (cargo || '-');
}

export default function AdminUsuariosPage() {
  const router = useRouter();
  const { notificar, confirmar } = useUI();

  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [removendoId, setRemovendoId] = useState(null);

  // Usuário sendo editado (null = modo de criação)
  const [usuarioEmEdicao, setUsuarioEmEdicao] = useState(null);

  const [form, setForm] = useState({
    nome: '',
    usuario: '',
    email: '',
    senha: '',
    cargo: 'comunicacao'
  });

  // Permissão: apenas administradores acessam esta página
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
        const cargo = user?.cargo ? user.cargo.toLowerCase() : '';
        if (cargo !== 'admin' && cargo !== 'master' && cargo !== 'gestor') {
          notificar('erro', 'Acesso negado: apenas administradores podem gerenciar usuários.');
          router.push('/admin');
        }
      } catch (e) {
        console.error('Erro ao validar permissões:', e);
      }
    }
  }, [router, notificar]);

  const carregarUsuarios = async () => {
    try {
      const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.USUARIOS, { _t: Date.now() }));
      const data = await res.json();
      if (data.status === 'success') {
        setUsuarios(data.usuarios || []);
      } else {
        notificar('erro', data.message || 'Erro ao carregar usuários.');
      }
    } catch (err) {
      console.error('Erro ao carregar usuários:', err);
      notificar('erro', 'Erro ao carregar usuários.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    let montado = true;
    async function iniciar() {
      const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.USUARIOS, { _t: Date.now() })).catch(() => null);
      if (!montado || !res) { if (montado) setCarregando(false); return; }
      const data = await res.json().catch(() => null);
      if (!montado) return;
      if (data?.status === 'success') setUsuarios(data.usuarios || []);
      setCarregando(false);
    }
    iniciar();
    return () => { montado = false; };
  }, []);

  // Preenche o formulário com os dados do usuário para edição.
  // A senha e o e-mail ficam vazios (o e-mail não vem na listagem, e a senha
  // só é alterada se o admin digitar um valor novo).
  const iniciarEdicao = (u) => {
    setUsuarioEmEdicao(u);
    setForm({
      nome: u.nome || '',
      usuario: u.usuario || '',
      email: '',
      senha: '',
      cargo: String(u.cargo || 'comunicacao').toLowerCase()
    });
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const cancelarEdicao = () => {
    setUsuarioEmEdicao(null);
    setForm({ nome: '', usuario: '', email: '', senha: '', cargo: 'comunicacao' });
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    setSalvando(true);

    const editando = !!usuarioEmEdicao;

    try {
      const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.USUARIOS), {
        method: editando ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editando ? { ...form, id: usuarioEmEdicao.id } : form)
      });
      const data = await res.json();

      if (data.status === 'success') {
        notificar('sucesso', editando ? 'Usuário atualizado com sucesso!' : 'Usuário criado com sucesso!');
        cancelarEdicao();
        carregarUsuarios();
      } else {
        notificar('erro', data.message || `Não foi possível ${editando ? 'atualizar' : 'criar'} o usuário.`);
      }
    } catch (err) {
      console.error('Erro ao salvar usuário:', err);
      notificar('erro', `Ocorreu um erro ao ${editando ? 'atualizar' : 'criar'} o usuário.`);
    } finally {
      setSalvando(false);
    }
  };

  const handleRemover = async (u) => {
    const confirmou = await confirmar({
      titulo: 'Remover usuário',
      mensagem: `Tem certeza que deseja remover o usuário "${u.nome}"? Ele perderá o acesso ao sistema.`,
      textoConfirmar: 'Remover'
    });
    if (!confirmou) return;

    setRemovendoId(u.id);
    try {
      const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.USUARIOS, { id: u.id }), {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.status === 'success') {
        setUsuarios((prev) => prev.filter((x) => x.id !== u.id));
        notificar('sucesso', 'Usuário removido.');
      } else {
        notificar('erro', data.message || 'Erro ao remover usuário.');
      }
    } catch (err) {
      console.error('Erro ao remover usuário:', err);
      notificar('erro', 'Ocorreu um erro ao remover o usuário.');
    } finally {
      setRemovendoId(null);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>

        {/* CABEÇALHO */}
        <div className={styles.headerBar}>
          <div>
            <span className={styles.badgeHeader}>
              <ShieldCheck size={14} /> Administração
            </span>
            <h1 className={styles.mainTitle}>
              <Users size={24} /> Gerenciar Usuários
            </h1>
            <p className={styles.subTitle}>
              Crie acessos ao painel e defina o setor de cada usuário.
            </p>
          </div>
          <Link href="/admin" className={styles.backLink}>
            <ArrowLeft size={16} /> Voltar ao Painel
          </Link>
        </div>

        <div className={styles.grid}>
          {/* FORMULÁRIO DE CRIAÇÃO / EDIÇÃO */}
          <form onSubmit={handleSalvar} className={styles.card}>
            <div className={styles.cardTituloRow}>
              <h2 className={styles.cardTitulo}>
                {usuarioEmEdicao
                  ? <><Pencil size={18} color="#0065a4" /> Editar: {usuarioEmEdicao.nome}</>
                  : <><UserPlus size={18} color="#0065a4" /> Novo Usuário</>}
              </h2>
              {usuarioEmEdicao && (
                <button type="button" onClick={cancelarEdicao} className={styles.btnCancelarEdicao}>
                  <XCircle size={15} /> Cancelar
                </button>
              )}
            </div>

            <div className={styles.campo}>
              <label>Nome Completo *</label>
              <div className={styles.inputWrap}>
                <User size={16} className={styles.inputIcon} />
                <input
                  type="text"
                  required
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  placeholder="Ex: Maria da Silva"
                />
              </div>
            </div>

            <div className={styles.campo}>
              <label>Usuário (apelido de login) *</label>
              <div className={styles.inputWrap}>
                <AtSign size={16} className={styles.inputIcon} />
                <input
                  type="text"
                  required
                  value={form.usuario}
                  onChange={(e) => setForm({ ...form, usuario: e.target.value.toLowerCase() })}
                  placeholder="Ex: maria.silva"
                />
              </div>
            </div>

            <div className={styles.campo}>
              <label>E-mail {usuarioEmEdicao ? '(deixe em branco para manter)' : '*'}</label>
              <div className={styles.inputWrap}>
                <AtSign size={16} className={styles.inputIcon} />
                <input
                  type="email"
                  required={!usuarioEmEdicao}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder={usuarioEmEdicao ? 'Novo e-mail (opcional)' : 'exemplo@muriae.mg.gov.br'}
                />
              </div>
            </div>

            <div className={styles.campo}>
              <label>Senha {usuarioEmEdicao ? '(deixe em branco para manter)' : '* (mínimo 6 caracteres)'}</label>
              <div className={styles.inputWrap}>
                <KeyRound size={16} className={styles.inputIcon} />
                <input
                  type="text"
                  required={!usuarioEmEdicao}
                  minLength={6}
                  value={form.senha}
                  onChange={(e) => setForm({ ...form, senha: e.target.value })}
                  placeholder={usuarioEmEdicao ? 'Nova senha (opcional)' : 'Defina uma senha'}
                />
              </div>
            </div>

            <div className={styles.campo}>
              <label>Setor / Cargo *</label>
              <select
                value={form.cargo}
                onChange={(e) => setForm({ ...form, cargo: e.target.value })}
                className={styles.select}
              >
                {CARGOS.map((c) => (
                  <option key={c.valor} value={c.valor}>{c.label}</option>
                ))}
              </select>
              <span className={styles.cargoDica}>
                {CARGOS.find((c) => c.valor === form.cargo)?.descricao}
              </span>
            </div>

            <button type="submit" disabled={salvando} className={styles.btnSalvar}>
              {salvando ? (
                <><Loader2 size={18} className="girando" /> {usuarioEmEdicao ? 'Salvando...' : 'Criando...'}</>
              ) : usuarioEmEdicao ? (
                <><Save size={18} /> Salvar Alterações</>
              ) : (
                <><Save size={18} /> Criar Usuário</>
              )}
            </button>
          </form>

          {/* LISTA DE USUÁRIOS */}
          <div className={styles.card}>
            <h2 className={styles.cardTitulo}>
              <Users size={18} color="#0065a4" /> Usuários Cadastrados
              {!carregando && <span className={styles.contador}>{usuarios.length}</span>}
            </h2>

            {carregando ? (
              <div className={styles.estadoVazio}>
                <Loader2 size={28} className="animate-spin" />
                <p>Carregando usuários...</p>
              </div>
            ) : usuarios.length === 0 ? (
              <div className={styles.estadoVazio}>
                <Users size={36} />
                <p>Nenhum usuário cadastrado ainda.</p>
              </div>
            ) : (
              <div className={styles.lista}>
                {usuarios.map((u) => (
                  <div key={u.id} className={styles.usuarioRow}>
                    <div className={styles.usuarioInfo}>
                      <div className={styles.avatar}>{(u.nome || '?').charAt(0).toUpperCase()}</div>
                      <div>
                        <h3>{u.nome}</h3>
                        <p>@{u.usuario} · <span className={styles.cargoTag}>{labelCargo(u.cargo)}</span></p>
                      </div>
                    </div>
                    <div className={styles.usuarioAcoes}>
                      <button
                        onClick={() => iniciarEdicao(u)}
                        className={styles.btnEditar}
                        title="Editar usuário"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleRemover(u)}
                        disabled={removendoId === u.id}
                        className={styles.btnRemover}
                        title="Remover usuário"
                      >
                        {removendoId === u.id ? <Loader2 size={15} className="girando" /> : <Trash2 size={15} />}
                      </button>
                    </div>
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
