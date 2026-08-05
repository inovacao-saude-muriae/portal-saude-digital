'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { animaisDisponiveis } from '@/data/animaisData';
import styles from './Adocao.module.css';

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyJgl-EYVzUXS8KvJogh2yn_iiFwIC7NwDS8iwnIV23DcZaFnBtSBkY-pKz8tY5sA3xsg/exec";

// FUNÇÃO AUXILIAR QUE REMOVE ACENTOS E CONVERTE PARA MINÚSCULAS
function normalizarTexto(texto) {
  if (!texto) return '';
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export default function AdocaoPage() {
  const [filtroEspecie, setFiltroEspecie] = useState('todos');
  const [filtroSexo, setFiltroSexo] = useState('todos');
  const [filtroIdade, setFiltroIdade] = useState('todos');
  const [buscaNome, setBuscaNome] = useState('');

  // ESTADO DA PAGINAÇÃO
  const [paginaAtual, setPaginaAtual] = useState(1);
  const ITENS_POR_PAGINA = 12;

  // ESTADOS DO MODAL, PASSO A PASSO (TERMO -> FORM) E ENVIO
  const [animalSelecionado, setAnimalSelecionado] = useState(null);
  const [passoModal, setPassoModal] = useState('detalhes');
  const [termoAceito, setTermoAceito] = useState(false);
  
  const [dadosAdocao, setDadosAdocao] = useState({ 
    nome: '', 
    cpf: '',
    telefone: '', 
    email: '', 
    rua: '',
    numero: '',
    bairro: '',
    cidade: '' 
  });

  const [enviando, setEnviando] = useState(false);
  const [enviadoSucesso, setEnviadoSucesso] = useState(false);
  const [erroEnvio, setErroEnvio] = useState(null);

  // RESET DA PAGINAÇÃO NOS FILTROS
  const handleFiltroEspecie = (valor) => { setFiltroEspecie(valor); setPaginaAtual(1); };
  const handleFiltroSexo = (valor) => { setFiltroSexo(valor); setPaginaAtual(1); };
  const handleFiltroIdade = (valor) => { setFiltroIdade(valor); setPaginaAtual(1); };
  const handleBuscaNome = (valor) => { setBuscaNome(valor); setPaginaAtual(1); };

  // FILTRAGEM COM NORMALIZAÇÃO DE ACENTOS
  const termoBusca = normalizarTexto(buscaNome.trim());

  const animaisFiltrados = animaisDisponiveis.filter(animal => {
    const bateEspecie = filtroEspecie === 'todos' || animal.especie.toLowerCase() === filtroEspecie.toLowerCase();
    const bateSexo = filtroSexo === 'todos' || animal.sexo.toLowerCase() === filtroSexo.toLowerCase();
    let bateIdade = true;
    if (filtroIdade === 'filhote') bateIdade = animal.filhote === 'true';
    else if (filtroIdade === 'adulto') bateIdade = animal.filhote === 'false';
    
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
    setErroEnvio(null);
  };

  const handleFecharModal = () => {
    setAnimalSelecionado(null);
    setPassoModal('detalhes');
    setTermoAceito(false);
    setEnviadoSucesso(false);
    setErroEnvio(null);
    setDadosAdocao({ nome: '', cpf: '', telefone: '', email: '', rua: '', numero: '', bairro: '', cidade: '' });
  };

  const handleSubmeterBusca = (e) => {
    e.preventDefault();
  };

  // ENVIO PARA O GOOGLE SHEETS
  const handleEnviarFormulario = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setErroEnvio(null);

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

      const urlFinal = `${GOOGLE_SCRIPT_URL}?${params.toString()}`;

      await fetch(urlFinal, {
        method: 'GET',
        redirect: 'follow',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
      });

      setEnviadoSucesso(true);
    } catch (err) {
      setEnviadoSucesso(true);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      
      {/* HERO BANNER */}
      <section className={styles.heroBanner}>
        <div className={styles.container}>
          <span className={styles.heroBadge}>🐾 Posse Responsável</span>
          <h1 className={styles.heroTitle}>Adote um Amigo!</h1>
          <p className={styles.heroSubtitle}>
            Conheça os animais protegidos pelo Centro de Controle de Zoonoses Manuela Pereira da Marta.
          </p>
        </div>
      </section>

      {/* BARRA DE NAVEGAÇÃO DE VOLTAR */}
      <div className={styles.navigationBar}>
        <div className={styles.container}>
          <Link href="/servicos/ccz" className={styles.backLink}>
            ← Voltar para o CCZ
          </Link>
        </div>
      </div>

      <main className={styles.mainContainer}>
        <div className={styles.container}>

          {/* BUSCA COM BOTÃO "BUSCAR" E FILTROS */}
          <div className={styles.filterSection}>
            <form onSubmit={handleSubmeterBusca} className={styles.searchBox}>
              <Search size={18} className={styles.searchIcon} />
              <input 
                type="text" 
                placeholder="Buscar por um animal" 
                value={buscaNome}
                onChange={(e) => handleBuscaNome(e.target.value)}
                className={styles.searchInput}
              />
              {buscaNome && (
                <button 
                  type="button" 
                  className={styles.clearBtn} 
                  onClick={() => handleBuscaNome('')}
                  title="Limpar busca"
                >
                  ✕
                </button>
              )}
              <button type="submit" className={styles.searchBtn}>Buscar</button>
            </form>

            <div className={styles.filterGroupRow}>
              {/* Espécie */}
              <div className={styles.filterSubGroup}>
                <button 
                  className={`${styles.filterBtn} ${filtroEspecie === 'todos' ? styles.activeFilter : ''}`}
                  onClick={() => handleFiltroEspecie('todos')}
                >
                  Todos
                </button>
                <button 
                  className={`${styles.filterBtn} ${filtroEspecie === 'cachorro' ? styles.activeFilter : ''}`}
                  onClick={() => handleFiltroEspecie('cachorro')}
                >
                  🐶 Cachorros
                </button>
                <button 
                  className={`${styles.filterBtn} ${filtroEspecie === 'gato' ? styles.activeFilter : ''}`}
                  onClick={() => handleFiltroEspecie('gato')}
                >
                  🐱 Gatos
                </button>
              </div>

              {/* Sexo */}
              <div className={styles.filterSubGroup}>
                <button 
                  className={`${styles.filterBtn} ${filtroSexo === 'macho' ? styles.activeFilter : ''}`}
                  onClick={() => handleFiltroSexo(filtroSexo === 'macho' ? 'todos' : 'macho')}
                >
                  ♂ Machos
                </button>
                <button 
                  className={`${styles.filterBtn} ${filtroSexo === 'femea' ? styles.activeFilter : ''}`}
                  onClick={() => handleFiltroSexo(filtroSexo === 'femea' ? 'todos' : 'femea')}
                >
                  ♀ Fêmeas
                </button>
              </div>

              {/* Idade */}
              <div className={styles.filterSubGroup}>
                <button 
                  className={`${styles.filterBtn} ${filtroIdade === 'filhote' ? styles.activeFilter : ''}`}
                  onClick={() => handleFiltroIdade(filtroIdade === 'filhote' ? 'todos' : 'filhote')}
                >
                  🍼 Filhotes
                </button>
                <button 
                  className={`${styles.filterBtn} ${filtroIdade === 'adulto' ? styles.activeFilter : ''}`}
                  onClick={() => handleFiltroIdade(filtroIdade === 'adulto' ? 'todos' : 'adulto')}
                >
                  🐕 Adultos
                </button>
              </div>
            </div>
          </div>

          {/* GRID DE CARDS DOS ANIMAIS */}
          {animaisPagina.length > 0 ? (
            <>
              <div className={styles.animaisGrid}>
                {animaisPagina.map((animal) => {
                  const isMacho = animal.sexo.toLowerCase() === 'macho';
                  const isFilhote = animal.filhote === 'true';

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
                        <button 
                          className={styles.btnVerMais}
                          onClick={() => handleAbrirModal(animal)}
                        >
                          Saber mais →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* BARRA DE PAGINAÇÃO */}
              {totalPaginas > 1 && (
                <div className={styles.paginationContainer}>
                  <button 
                    className={styles.paginationNavBtn} 
                    disabled={paginaAtual === 1}
                    onClick={() => handleMudarPagina(paginaAtual - 1)}
                  >
                    ← Anterior
                  </button>

                  <div className={styles.paginationNumbers}>
                    {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((numPage) => (
                      <button 
                        key={numPage} 
                        className={`${styles.pageNumberBtn} ${numPage === paginaAtual ? styles.activePageNumber : ''}`}
                        onClick={() => handleMudarPagina(numPage)}
                      >
                        {numPage}
                      </button>
                    ))}
                  </div>

                  <button 
                    className={styles.paginationNavBtn} 
                    disabled={paginaAtual === totalPaginas}
                    onClick={() => handleMudarPagina(paginaAtual + 1)}
                  >
                    Próximo →
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className={styles.emptyState}>
              <Search size={40} className={styles.emptyIcon} />
              <h3>Nenhum animal encontrado</h3>
              <p>Não encontramos nenhum amiguinho correspondente a {`"${buscaNome}"`}.</p>
              <button 
                className={styles.resetBtn} 
                onClick={() => { setBuscaNome(''); handleFiltroSexo('todos'); handleFiltroEspecie('todos'); handleFiltroIdade('todos'); }}
              >
                Limpar Todos os Filtros
              </button>
            </div>
          )}

          {/* REQUISITOS PARA ADOÇÃO */}
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

      {/* MODAL DE ADOÇÃO */}
      {animalSelecionado && (
        <div className={styles.modalOverlay} onClick={handleFecharModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={handleFecharModal} title="Fechar">✕</button>

            {/* PASSO 1: DETALHES */}
            {passoModal === 'detalhes' && (
              <div className={styles.modalBodyDetails}>
                <div className={styles.modalImageWrapper}>
                  <Image 
                    src={animalSelecionado.foto} 
                    alt={animalSelecionado.nome}
                    width={200}
                    height={266}
                    unoptimized
                    className={styles.modalImgSmall}
                  />
                </div>

                <div className={styles.modalTitleRow}>
                  <h2>{animalSelecionado.nome}</h2>
                  <span className={animalSelecionado.sexo.toLowerCase() === 'macho' ? styles.symbolMacho : styles.symbolFemea}>
                    {animalSelecionado.sexo.toLowerCase() === 'macho' ? '♂ Macho' : '♀ Fêmea'}
                  </span>
                </div>

                <p className={styles.animalDescricao}>
                  {animalSelecionado.descricao || "Animal dócil, vacinado e pronto para ser acolhido com responsabilidade e carinho."}
                </p>

                <div className={styles.modalActions}>
                  <button 
                    className={styles.btnFormDirect}
                    onClick={() => setPassoModal('termo')}
                  >
                    📝 Solicitar Adoção (Formulário Direto)
                  </button>

                  <a href="tel:3220208123" className={styles.btnTelefone}>
                    📞 Ligar para o CCZ: (32) 2020-8123
                  </a>
                </div>
              </div>
            )}

            {/* PASSO 2: TERMO DE RESPONSABILIDADE */}
            {passoModal === 'termo' && (
              <div className={styles.modalBodyTermo}>
                <button 
                  className={styles.btnVoltarModal} 
                  onClick={() => setPassoModal('detalhes')}
                >
                  ← Voltar para a descrição do animal
                </button>

                <h2 className={styles.formTitle}>Termo de Responsabilidade</h2>
                <p className={styles.termoIntro}>
                  Ao assinar este termo, o(a) adotante declara estar ciente e comprometido(a) com as seguintes obrigações:
                </p>

                <div className={styles.termoScrollBox}>
                  <ul>
                    <li>✔ Garantir o bem-estar físico e emocional do animal, provendo alimentação adequada, água fresca e abrigo.</li>
                    <li>✔ Garantir a saúde física do animal, com consultas veterinárias regulares, vacinação e vermifugação em dia.</li>
                    <li>✔ Garantir a saúde psicológica do animal, proporcionando convívio social, afeto e estímulos adequados à espécie.</li>
                    <li>✔ Garantir a segurança do animal, mantendo-o em ambiente protegido e seguro, evitando riscos de fuga ou acidentes.</li>
                    <li>✔ Manter o animal em ambiente limpo e higienizado, adequado às suas necessidades.</li>
                    <li>✔ Não manter o animal preso em correntes, gaiolas inadequadas ou em condições que restrinjam sua liberdade de forma cruel.</li>
                    <li>✔ Garantir a esterilização do animal, caso ainda não tenha sido realizada, contribuindo para o controle populacional.</li>
                    <li>✔ Nunca abandonar o animal. Em caso de impossibilidade de mantê-lo, comunicar ao CCZ para encaminhamento adequado.</li>
                  </ul>
                  <p className={styles.termoAvisoLei}>
                    O descumprimento deste termo sujeita o adotante às penalidades previstas na Lei Federal nº 9.605/1998 (Lei de Crimes Ambientais) e demais legislações de proteção animal vigentes.
                  </p>
                </div>

                <div className={styles.aceiteCheckboxContainer}>
                  <label className={styles.checkboxLabel}>
                    <input 
                      type="checkbox" 
                      checked={termoAceito}
                      onChange={(e) => setTermoAceito(e.target.checked)}
                    />
                    <span>Li e concordo integralmente com os termos de responsabilidade de adoção.</span>
                  </label>
                </div>

                <button 
                  className={styles.btnAvancarForm}
                  disabled={!termoAceito}
                  onClick={() => setPassoModal('formulario')}
                >
                  Continuar para o Formulário →
                </button>
              </div>
            )}

            {/* PASSO 3: FORMULÁRIO DE ADOÇÃO */}
            {passoModal === 'formulario' && (
              <div className={styles.modalBodyForm}>
                <button 
                  className={styles.btnVoltarModal} 
                  onClick={() => setPassoModal('termo')}
                >
                  ← Voltar para o Termo
                </button>

                <h2 className={styles.formTitle}>Solicitar Adoção: {animalSelecionado.nome}</h2>
                <p className={styles.formSubtitle}>Preencha os dados abaixo e a equipe do CCZ entrará em contato com você:</p>

                {enviadoSucesso ? (
                  <div className={styles.msgSucesso}>
                    <h3>🎉 Solicitação Enviada!</h3>
                    <p>
                      Sua demonstração de interesse em adotar o(a) <strong>{animalSelecionado.nome}</strong> foi registrada com sucesso no sistema. Nossa equipe entrará em contato.
                    </p>
                    <button className={styles.btnFecharSucesso} onClick={handleFecharModal}>
                      Concluir
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleEnviarFormulario} className={styles.formAdocao}>
                    {erroEnvio && <div className={styles.msgErro}>{erroEnvio}</div>}

                    <div className={styles.formGroup}>
                      <label>Seu Nome Completo *</label>
                      <input 
                        type="text" 
                        required 
                        value={dadosAdocao.nome}
                        onChange={(e) => setDadosAdocao({...dadosAdocao, nome: e.target.value})}
                        placeholder="Ex: Maria da Silva"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>CPF *</label>
                      <input 
                        type="text" 
                        required 
                        value={dadosAdocao.cpf}
                        onChange={(e) => setDadosAdocao({...dadosAdocao, cpf: e.target.value})}
                        placeholder="000.000.000-00"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Telefone / Celular *</label>
                      <input 
                        type="tel" 
                        required 
                        value={dadosAdocao.telefone}
                        onChange={(e) => setDadosAdocao({...dadosAdocao, telefone: e.target.value})}
                        placeholder="(32) 99999-9999"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>E-mail (opcional)</label>
                      <input 
                        type="email" 
                        value={dadosAdocao.email}
                        onChange={(e) => setDadosAdocao({...dadosAdocao, email: e.target.value})}
                        placeholder="seu@email.com"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Rua / Logradouro *</label>
                      <input 
                        type="text" 
                        required 
                        value={dadosAdocao.rua}
                        onChange={(e) => setDadosAdocao({...dadosAdocao, rua: e.target.value})}
                        placeholder="Ex: Rua Paschoal Bernardino"
                      />
                    </div>

                    <div className={styles.formGroupRow}>
                      <div className={styles.formGroup}>
                        <label>Número *</label>
                        <input 
                          type="text" 
                          required 
                          value={dadosAdocao.numero}
                          onChange={(e) => setDadosAdocao({...dadosAdocao, numero: e.target.value})}
                          placeholder="Ex: 123"
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label>Bairro *</label>
                        <input 
                          type="text" 
                          required 
                          value={dadosAdocao.bairro}
                          onChange={(e) => setDadosAdocao({...dadosAdocao, bairro: e.target.value})}
                          placeholder="Ex: Centro"
                        />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Cidade *</label>
                      <input 
                        type="text" 
                        required 
                        value={dadosAdocao.cidade}
                        onChange={(e) => setDadosAdocao({...dadosAdocao, cidade: e.target.value})}
                        placeholder="Ex: Muriaé"
                      />
                    </div>

                    <button type="submit" disabled={enviando} className={styles.btnSubmitAdocao}>
                      {enviando ? 'Enviando...' : 'Confirmar e Enviar Solicitação'}
                    </button>
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