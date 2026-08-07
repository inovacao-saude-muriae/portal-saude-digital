'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Loader2 } from 'lucide-react';
import styles from './Adocao.module.css';

const SCRIPT_URL = process.env.NEXT_PUBLIC_SCRIPT_CCZ_URL || 'https://script.google.com/macros/s/AKfycbzoGz1c0Q2cRICMbJ7dSA-xp_UPL7O_W2BDojgHKbY_gMdK4aVUCSAxOJHd_o2j6ja8YQ/exec';

function normalizarTexto(texto) {
  if (!texto) return '';
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export default function AdocaoPage() {
  const [animais, setAnimais] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtroEspecie, setFiltroEspecie] = useState('todos');
  const [filtroSexo, setFiltroSexo] = useState('todos');
  const [filtroIdade, setFiltroIdade] = useState('todos');
  const [buscaNome, setBuscaNome] = useState('');

  // ESTADO DA PAGINAÇÃO
  const [paginaAtual, setPaginaAtual] = useState(1);
  const ITENS_POR_PAGINA = 12;

  // ESTADOS DO MODAL E FORMULÁRIO
  const [animalSelecionado, setAnimalSelecionado] = useState(null);
  const [passoModal, setPassoModal] = useState('detalhes');
  const [termoAceito, setTermoAceito] = useState(false);
  
  const [dadosAdocao, setDadosAdocao] = useState({ 
    nome: '', cpf: '', telefone: '', email: '', rua: '', numero: '', bairro: '', cidade: '' 
  });

  const [enviando, setEnviando] = useState(false);
  const [enviadoSucesso, setEnviadoSucesso] = useState(false);

  // BUSCA EXCLUSIVAMENTE DINÂMICA DA PLANILHA DO CCZ
  useEffect(() => {
    let ativo = true;

    async function carregarAnimaisOnline() {
      setCarregando(true);
      try {
        const res = await fetch(`${SCRIPT_URL}?action=GET_ANIMAIS&t=${Date.now()}`);
        const data = await res.json();
        
        if (ativo && data && data.status === 'success') {
          setAnimais(data.animais || []);
        }
      } catch (err) {
        console.error('Erro ao buscar animais cadastrados:', err);
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregarAnimaisOnline();

    return () => {
      ativo = false;
    };
  }, []);

  const handleFiltroEspecie = (valor) => { setFiltroEspecie(valor); setPaginaAtual(1); };
  const handleFiltroSexo = (valor) => { setFiltroSexo(valor); setPaginaAtual(1); };
  const handleFiltroIdade = (valor) => { setFiltroIdade(valor); setPaginaAtual(1); };
  const handleBuscaNome = (valor) => { setBuscaNome(valor); setPaginaAtual(1); };

  const termoBusca = normalizarTexto(buscaNome.trim());

  // FILTRAGEM UTILIZANDO APENAS A LISTA DE ANIMAIS CADASTRADOS
  const animaisFiltrados = animais.filter(animal => {
    const bateEspecie = filtroEspecie === 'todos' || String(animal.especie).toLowerCase() === filtroEspecie.toLowerCase();
    const bateSexo = filtroSexo === 'todos' || String(animal.sexo).toLowerCase() === filtroSexo.toLowerCase();
    
    let bateIdade = true;
    if (filtroIdade === 'filhote') bateIdade = String(animal.filhote) === 'true';
    else if (filtroIdade === 'adulto') bateIdade = String(animal.filhote) === 'false';
    
    const bateNome = normalizarTexto(animal.nome).includes(termoBusca) ||
                     normalizarTexto(animal.descricao).includes(termoBusca);

    return bateEspecie && bateSexo && bateIdade && bateNome;
  });

  // PAGINAÇÃO
  const totalPaginas = Math.ceil(animaisFiltrados.length / ITENS_POR_PAGINA);
  const inicioIndice = (paginaAtual - 1) * ITENS_POR_PAGINA;
  const animaisPagina = animaisFiltrados.slice(inicioIndice, inicioIndice + ITENS_POR_PAGINA);

  const handleMudarPagina = (novaPagina) => {
    if (novaPagina >= 1 && novaPagina <= totalPaginas) {
      setPaginaAtual(novaPagina);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  const handleAbrirModal = (animal) => {
    setAnimalSelecionado(animal);
    setPassoModal('detalhes');
    setTermoAceito(false);
    setEnviadoSucesso(false);
  };

  const handleFecharModal = () => {
    setAnimalSelecionado(null);
    setPassoModal('detalhes');
    setTermoAceito(false);
    setEnviadoSucesso(false);
    setDadosAdocao({ nome: '', cpf: '', telefone: '', email: '', rua: '', numero: '', bairro: '', cidade: '' });
  };

  const handleEnviarFormulario = async (e) => {
    e.preventDefault();
    setEnviando(true);

    try {
      const params = new URLSearchParams({
        tipo: 'adocao',
        nome: dadosAdocao.nome,
        cpf: dadosAdocao.cpf,
        telefone: dadosAdocao.telefone,
        email: dadosAdocao.email,
        rua: dadosAdocao.rua,
        numero: dadosAdocao.numero,
        bairro: dadosAdocao.bairro,
        cidade: dadosAdocao.cidade,
        animal: animalSelecionado?.nome || 'Não especificado'
      });

      await fetch(`${SCRIPT_URL}?${params.toString()}`);
      setEnviadoSucesso(true);
    } catch {
      setEnviadoSucesso(true);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <section className={styles.heroBanner}>
        <div className={styles.container}>
          <span className={styles.heroBadge}>🐾 Posse Responsável</span>
          <h1 className={styles.heroTitle}>Adote um Amigo!</h1>
          <p className={styles.heroSubtitle}>
            Conheça os animais protegidos pelo Centro de Controle de Zoonoses Manuela Pereira da Marta.
          </p>
        </div>
      </section>

      <div className={styles.navigationBar}>
        <div className={styles.container}>
          <Link href="/servicos/ccz" className={styles.backLink}>
            ← Voltar para o CCZ
          </Link>
        </div>
      </div>

      <main className={styles.mainContainer}>
        <div className={styles.container}>

          <div className={styles.filterSection}>
            <form onSubmit={(e) => e.preventDefault()} className={styles.searchBox}>
              <Search size={18} className={styles.searchIcon} />
              <input 
                type="text" 
                placeholder="Buscar por um animal" 
                value={buscaNome}
                onChange={(e) => handleBuscaNome(e.target.value)}
                className={styles.searchInput}
              />
              {buscaNome && (
                <button type="button" className={styles.clearBtn} onClick={() => handleBuscaNome('')}>✕</button>
              )}
              <button type="submit" className={styles.searchBtn}>Buscar</button>
            </form>

            <div className={styles.filterGroupRow}>
              <div className={styles.filterSubGroup}>
                <button className={`${styles.filterBtn} ${filtroEspecie === 'todos' ? styles.activeFilter : ''}`} onClick={() => handleFiltroEspecie('todos')}>Todos</button>
                <button className={`${styles.filterBtn} ${filtroEspecie === 'cachorro' ? styles.activeFilter : ''}`} onClick={() => handleFiltroEspecie('cachorro')}>🐶 Cachorros</button>
                <button className={`${styles.filterBtn} ${filtroEspecie === 'gato' ? styles.activeFilter : ''}`} onClick={() => handleFiltroEspecie('gato')}>🐱 Gatos</button>
              </div>

              <div className={styles.filterSubGroup}>
                <button className={`${styles.filterBtn} ${filtroSexo === 'macho' ? styles.activeFilter : ''}`} onClick={() => handleFiltroSexo(filtroSexo === 'macho' ? 'todos' : 'macho')}>♂ Machos</button>
                <button className={`${styles.filterBtn} ${filtroSexo === 'femea' ? styles.activeFilter : ''}`} onClick={() => handleFiltroSexo(filtroSexo === 'femea' ? 'todos' : 'femea')}>♀ Fêmeas</button>
              </div>

              <div className={styles.filterSubGroup}>
                <button className={`${styles.filterBtn} ${filtroIdade === 'filhote' ? styles.activeFilter : ''}`} onClick={() => handleFiltroIdade(filtroIdade === 'filhote' ? 'todos' : 'filhote')}>🍼 Filhotes</button>
                <button className={`${styles.filterBtn} ${filtroIdade === 'adulto' ? styles.activeFilter : ''}`} onClick={() => handleFiltroIdade(filtroIdade === 'adulto' ? 'todos' : 'adulto')}>🐕 Adultos</button>
              </div>
            </div>
          </div>

          {carregando ? (
            <div className={styles.emptyState}>
              <Loader2 size={36} className="animate-spin" style={{ color: '#008a83', marginBottom: '12px' }} />
              <h3>Carregando animais para adoção...</h3>
              <p>Buscando lista atualizada do Centro de Controle de Zoonoses.</p>
            </div>
          ) : animaisPagina.length > 0 ? (
            <>
              <div className={styles.animaisGrid}>
                {animaisPagina.map((animal) => {
                  const isMacho = String(animal.sexo).toLowerCase() === 'macho';
                  const isFilhote = String(animal.filhote) === 'true';

                  return (
                    <div key={animal.id} className={styles.animalCard}>
                      <div className={styles.imageWrapper}>
                        <Image 
                          src={animal.foto} 
                          alt={animal.nome}
                          width={300}
                          height={400}
                          unoptimized
                          className={styles.animalImg}
                        />
                        <span className={`${styles.sexoIconBadge} ${isMacho ? styles.badgeMacho : styles.badgeFemea}`}>
                          {isMacho ? '♂' : '♀'}
                        </span>
                        {isFilhote && <span className={styles.badgeFilhote}>Filhote</span>}
                      </div>

                      <div className={styles.cardHeaderOnly}>
                        <h3 className={styles.animalNome}>{animal.nome}</h3>
                        <button className={styles.btnVerMais} onClick={() => handleAbrirModal(animal)}>
                          Saber mais →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {totalPaginas > 1 && (
                <div className={styles.paginationContainer}>
                  <button className={styles.paginationNavBtn} disabled={paginaAtual === 1} onClick={() => handleMudarPagina(paginaAtual - 1)}>← Anterior</button>
                  <div className={styles.paginationNumbers}>
                    {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((numPage) => (
                      <button key={numPage} className={`${styles.pageNumberBtn} ${numPage === paginaAtual ? styles.activePageNumber : ''}`} onClick={() => handleMudarPagina(numPage)}>{numPage}</button>
                    ))}
                  </div>
                  <button className={styles.paginationNavBtn} disabled={paginaAtual === totalPaginas} onClick={() => handleMudarPagina(paginaAtual + 1)}>Próximo →</button>
                </div>
              )}
            </>
          ) : (
            <div className={styles.emptyState}>
              <Search size={40} className={styles.emptyIcon} />
              <h3>Nenhum animal encontrado</h3>
              <p>
                {buscaNome 
                  ? `Não encontramos nenhum amiguinho correspondente a "${buscaNome}".` 
                  : 'Nenhum animal cadastrado no momento. Tente novamente mais tarde.'}
              </p>
              {buscaNome && (
                <button className={styles.resetBtn} onClick={() => { setBuscaNome(''); handleFiltroSexo('todos'); handleFiltroEspecie('todos'); handleFiltroIdade('todos'); }}>
                  Limpar Todos os Filtros
                </button>
              )}
            </div>
          )}

          <section className={styles.requisitosBlock}>
            <h2>📋 Requisitos para Adoção Responsável</h2>
            <ul>
              <li>Ser maior de 18 anos;</li>
              <li>Apresentar documento oficial de identidade com foto (RG ou CNH) e CPF;</li>
              <li>Apresentar comprovante de residência recente;</li>
              <li>Assinar o Termo de Adoção e Responsabilidade no local.</li>
            </ul>
          </section>

        </div>
      </main>

      {/* MODAL */}
      {animalSelecionado && (
        <div className={styles.modalOverlay} onClick={handleFecharModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={handleFecharModal}>✕</button>

            {passoModal === 'detalhes' && (
              <div className={styles.modalBodyDetails}>
                <div className={styles.modalImageWrapper}>
                  <Image src={animalSelecionado.foto} alt={animalSelecionado.nome} width={200} height={266} unoptimized className={styles.modalImgSmall} />
                </div>
                <div className={styles.modalTitleRow}>
                  <h2>{animalSelecionado.nome}</h2>
                  <span className={String(animalSelecionado.sexo).toLowerCase() === 'macho' ? styles.symbolMacho : styles.symbolFemea}>
                    {String(animalSelecionado.sexo).toLowerCase() === 'macho' ? '♂ Macho' : '♀ Fêmea'}
                  </span>
                </div>
                <p className={styles.animalDescricao}>{animalSelecionado.descricao || "Animal dócil, vacinado e pronto para ser acolhido."}</p>
                <div className={styles.modalActions}>
                  <button className={styles.btnFormDirect} onClick={() => setPassoModal('termo')}>📝 Solicitar Adoção</button>
                  <a href="tel:3220208123" className={styles.btnTelefone}>📞 Ligar para o CCZ: (32) 2020-8123</a>
                </div>
              </div>
            )}

            {passoModal === 'termo' && (
              <div className={styles.modalBodyTermo}>
                <button className={styles.btnVoltarModal} onClick={() => setPassoModal('detalhes')}>← Voltar</button>
                <h2 className={styles.formTitle}>Termo de Responsabilidade</h2>
                <div className={styles.termoScrollBox}>
                  <ul>
                    <li>✔ Garantir o bem-estar físico e emocional do animal.</li>
                    <li>✔ Garantir consultas veterinárias e vacinação em dia.</li>
                    <li>✔ Não manter o animal preso em correntes de forma cruel.</li>
                    <li>✔ Nunca abandonar o animal.</li>
                  </ul>
                </div>
                <div className={styles.aceiteCheckboxContainer}>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" checked={termoAceito} onChange={(e) => setTermoAceito(e.target.checked)} />
                    <span>Li e concordo com os termos de adoção.</span>
                  </label>
                </div>
                <button className={styles.btnAvancarForm} disabled={!termoAceito} onClick={() => setPassoModal('formulario')}>Continuar para o Formulário →</button>
              </div>
            )}

            {passoModal === 'formulario' && (
              <div className={styles.modalBodyForm}>
                <button className={styles.btnVoltarModal} onClick={() => setPassoModal('termo')}>← Voltar</button>
                <h2 className={styles.formTitle}>Solicitar Adoção: {animalSelecionado.nome}</h2>

                {enviadoSucesso ? (
                  <div className={styles.msgSucesso}>
                    <h3>🎉 Solicitação Enviada!</h3>
                    <p>Sua demonstração de interesse em adotar foi registrada!</p>
                    <button className={styles.btnFecharSucesso} onClick={handleFecharModal}>Concluir</button>
                  </div>
                ) : (
                  <form onSubmit={handleEnviarFormulario} className={styles.formAdocao}>
                    <div className={styles.formGroup}>
                      <label>Seu Nome Completo *</label>
                      <input type="text" required value={dadosAdocao.nome} onChange={(e) => setDadosAdocao({...dadosAdocao, nome: e.target.value})} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>CPF *</label>
                      <input type="text" required value={dadosAdocao.cpf} onChange={(e) => setDadosAdocao({...dadosAdocao, cpf: e.target.value})} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Telefone / Celular *</label>
                      <input type="tel" required value={dadosAdocao.telefone} onChange={(e) => setDadosAdocao({...dadosAdocao, telefone: e.target.value})} />
                    </div>
                    <button type="submit" disabled={enviando} className={styles.btnSubmitAdocao}>{enviando ? 'Enviando...' : 'Confirmar e Enviar'}</button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}