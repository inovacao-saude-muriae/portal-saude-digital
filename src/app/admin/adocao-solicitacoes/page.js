'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Loader2,
  ArrowLeft,
  ShieldCheck,
  ClipboardList,
  Trash2,
  Search,
  Inbox,
  FileDown
} from 'lucide-react';
import { API_CONFIG, buildApiUrl } from '@/lib/config';
import { gerarPdfTermoAdocao } from '@/lib/termoAdocao';
import { useUI } from '@/components/UIFeedback';
import styles from './AdminSolicitacoes.module.css';

function formatarDataHora(iso) {
  if (!iso) return '-';
  try {
    return new Date(iso).toLocaleString('pt-BR');
  } catch {
    return iso;
  }
}

export default function AdminSolicitacoesAdocaoPage() {
  const router = useRouter();
  const { notificar, confirmar } = useUI();

  const [solicitacoes, setSolicitacoes] = useState([]);
  const [animais, setAnimais] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');
  const [removendoId, setRemovendoId] = useState(null);

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

  // 2. CARREGAMENTO DAS SOLICITAÇÕES
  useEffect(() => {
    let montado = true;

    async function carregar() {
      setCarregando(true);
      try {
        const [resSol, resAni] = await Promise.all([
          fetch(buildApiUrl(API_CONFIG.ENDPOINTS.ADOCAO_SOLICITACOES, { _t: Date.now() })),
          fetch(buildApiUrl(API_CONFIG.ENDPOINTS.ANIMAIS, { _t: Date.now() }))
        ]);
        const dataSol = await resSol.json();
        const dataAni = await resAni.json();
        if (montado && dataSol.status === 'success') {
          setSolicitacoes(dataSol.solicitacoes || []);
        }
        if (montado && dataAni.status === 'success') {
          setAnimais(dataAni.animais || []);
        }
      } catch (err) {
        console.error('Erro ao carregar solicitações:', err);
      } finally {
        if (montado) setCarregando(false);
      }
    }

    carregar();
    return () => {
      montado = false;
    };
  }, []);

  const handleRemover = async (id) => {
    const confirmou = await confirmar({
      titulo: 'Remover solicitação',
      mensagem: 'Deseja remover esta solicitação de adoção?',
      textoConfirmar: 'Remover'
    });
    if (!confirmou) return;
    setRemovendoId(id);
    try {
      const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.ADOCAO_SOLICITACOES, { id }), {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.status === 'success') {
        setSolicitacoes((prev) => prev.filter((s) => s.id !== id));
        notificar('sucesso', 'Solicitação removida.');
      } else {
        notificar('erro', 'Erro ao remover: ' + (data.message || 'tente novamente.'));
      }
    } catch (err) {
      console.error('Erro ao remover solicitação:', err);
      notificar('erro', 'Ocorreu um erro ao remover a solicitação.');
    } finally {
      setRemovendoId(null);
    }
  };

  const termo = busca.toLowerCase().trim();
  const filtradas = solicitacoes.filter((s) => {
    if (!termo) return true;
    return (
      (s.nome || '').toLowerCase().includes(termo) ||
      (s.cpf || '').toLowerCase().includes(termo) ||
      (s.animal_nome || '').toLowerCase().includes(termo) ||
      (s.telefone || '').toLowerCase().includes(termo)
    );
  });

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>

        {/* CABEÇALHO */}
        <div className={styles.headerBar}>
          <div>
            <span className={styles.badgeHeader}>
              <ShieldCheck size={14} /> Painel Administrativo
            </span>
            <h1 className={styles.mainTitle}>
              <ClipboardList size={24} /> Solicitações de Adoção
            </h1>
            <p className={styles.subTitle}>
              Pedidos enviados pelos cidadãos através do formulário de adoção do CCZ.
            </p>
          </div>

          <Link href="/admin" className={styles.backLink}>
            <ArrowLeft size={16} /> Voltar ao Painel
          </Link>
        </div>

        {/* BUSCA + CONTAGEM */}
        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar por nome, CPF, animal ou telefone..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          {!carregando && (
            <span className={styles.contador}>
              {filtradas.length} {filtradas.length === 1 ? 'solicitação' : 'solicitações'}
            </span>
          )}
        </div>

        {/* CONTEÚDO */}
        {carregando ? (
          <div className={styles.estadoVazio}>
            <Loader2 size={32} className="animate-spin" />
            <p>Carregando solicitações...</p>
          </div>
        ) : filtradas.length === 0 ? (
          <div className={styles.estadoVazio}>
            <Inbox size={40} />
            <h3>Nenhuma solicitação encontrada</h3>
            <p>Ainda não há pedidos de adoção registrados{busca ? ' para esta busca' : ''}.</p>
          </div>
        ) : (
          <div className={styles.cardsGrid}>
            {filtradas.map((s) => (
              <div key={s.id} className={styles.card}>
                <div className={styles.cardTopo}>
                  <div>
                    <h3 className={styles.nome}>{s.nome}</h3>
                    {s.animal_nome && (
                      <span className={styles.animalTag}>🐾 Interesse: {s.animal_nome}</span>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemover(s.id)}
                    disabled={removendoId === s.id}
                    className={styles.btnRemover}
                    title="Remover solicitação"
                  >
                    {removendoId === s.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                  </button>
                </div>

                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <strong>CPF</strong>
                    <span>{s.cpf || '-'}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <strong>Telefone</strong>
                    <span>{s.telefone || '-'}</span>
                  </div>
                  <div className={styles.infoItemFull}>
                    <strong>Endereço</strong>
                    <span>
                      {[s.rua, s.numero && `nº ${s.numero}`, s.bairro, s.cidade, s.cep]
                        .filter(Boolean)
                        .join(', ') || '-'}
                    </span>
                  </div>
                </div>

                <div className={styles.cardRodape}>
                  <span>Recebida em {formatarDataHora(s.created_at)}</span>
                  <button
                    type="button"
                    onClick={async () => {
                      // 1. Tenta achar o animal na lista já carregada
                      let animal = animais.find((a) =>
                        (s.animal_id && String(a.id) === String(s.animal_id)) ||
                        (s.animal_nome && a.nome && a.nome.toLowerCase().trim() === s.animal_nome.toLowerCase().trim())
                      );

                      // 2. Se não achou (lista ainda vazia), busca direto pela API por ID
                      if (!animal && s.animal_id) {
                        try {
                          const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.ANIMAIS, { id: s.animal_id }));
                          const data = await res.json();
                          if (data.status === 'success' && data.animal) {
                            animal = data.animal;
                          }
                        } catch (err) {
                          console.warn('Não foi possível buscar o animal:', err);
                        }
                      }

                      try {
                        await gerarPdfTermoAdocao(s, animal || {});
                      } catch (err) {
                        console.error('Erro ao gerar o termo em PDF:', err);
                        notificar('erro', 'Não foi possível gerar o termo em PDF.');
                      }
                    }}
                    className={styles.btnTermo}
                    title="Baixar o Termo de Adoção preenchido em PDF"
                  >
                    <FileDown size={15} /> Baixar Termo (PDF)
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
