'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Adocao.module.css';

// URL DO SEU SCRIPT DO GOOGLE SHEETS
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyJgl-EYVzUXS8KvJogh2yn_iiFwIC7NwDS8iwnIV23DcZaFnBtSBkY-pKz8tY5sA3xsg/exec";

// BANCO DE DADOS DE ANIMAIS DO CCZ
const animaisDisponiveis = [
  {
    "id": 1,
    "nome": "Amigão",
    "especie": "Cachorro",
    "sexo": "macho",
    "filhote": "false",
    "descricao": "Esse peludinho é dócil, carinhoso e amoroso — daqueles que conquista com o olhar e retribui com afeto sincero. Já está vacinado contra a raiva, vermifugado e com o controle de ectoparasitas em dia, prontinho para ser adotado com segurança e responsabilidade. Está no CCZ desde 2023, sonhando com uma família que lhe ofereça o carinho e o lar que ele tanto merece.",
    "foto": "/img/animais/Amigao.jpeg"
  },
  {
    "id": 2,
    "nome": "Amora",
    "especie": "Cachorro",
    "sexo": "femea",
    "filhote": "false",
    "descricao": "Essa SRD de porte médio tem cerca de 2 anos e é uma parceira incrível: dócil, amorosa e extremamente companheira. Já está castrada, vacinada contra a raiva, vermifugada e com a saúde em dia — pronta para começar uma nova vida ao seu lado. Está no CCZ desde 2023.",
    "foto": "/img/animais/Amora.jpeg"
  },
  {
    "id": 3,
    "nome": "Bela",
    "especie": "Cachorro",
    "sexo": "femea",
    "filhote": "false",
    "descricao": "Bela é SRD, aproximadamente 1 ano de idade, castrada, vermifugada, controle de ectoparasitas em dia, vacinada para raiva, está no CCZ aproximadamente 3 meses. Dócil, carinhosa, carente e brincalhona.",
    "foto": "/img/animais/Bela.jpeg"
  },
  {
    "id": 4,
    "nome": "Belisario",
    "especie": "Cachorro",
    "sexo": "macho",
    "filhote": "false",
    "descricao": "Esse peludinho já está castrado, vacinado contra a raiva, com o controle de ectoparasitas em dia e vermifugado — prontinho para fazer parte da sua família! Ele é dócil, brincalhão e tem um jeitinho especial: adora dar abraços!",
    "foto": "/img/animais/Belisario.jpeg"
  },
  {
    "id": 5,
    "nome": "Bento",
    "especie": "Cachorro",
    "sexo": "macho",
    "filhote": "false",
    "descricao": "Esse peludinho é dócil, carinhoso, amoroso e carente — daqueles que só querem atenção, afeto e um cantinho seguro para chamar de seu. Vacinado contra a raiva e vermifugado.",
    "foto": "/img/animais/Bento.jpeg"
  },
  {
    "id": 6,
    "nome": "Beyonce",
    "especie": "Cachorro",
    "sexo": "femea",
    "filhote": "false",
    "descricao": "Essa peludinha é castrada, vacinada contra a raiva, com controle de ectoparasitas em dia e vermifugada. Dócil, brincalhona e sobrevivente da cinomose.",
    "foto": "/img/animais/Beyonce.jpeg"
  },
  {
    "id": 7,
    "nome": "Bibi",
    "especie": "Cachorro",
    "sexo": "femea",
    "filhote": "true",
    "descricao": "Bibi é SRD mestiça com basset, aproximadamente 4 meses de idade, vacinada para raiva, controle de ectoparasitas e vermifugada. Dócil e carinhosa.",
    "foto": "/img/animais/Bibi.jpeg"
  },
  {
    "id": 8,
    "nome": "Bode",
    "especie": "Cachorro",
    "sexo": "macho",
    "filhote": "false",
    "descricao": "O Bode é um SRD de porte médio, com 4 anos. Já está castrado, vacinado e vermifugado. É ativo, instável e muito companheiro.",
    "foto": "/img/animais/Bode.jpeg"
  },
  {
    "id": 9,
    "nome": "Branca",
    "especie": "Cachorro",
    "sexo": "femea",
    "filhote": "false",
    "descricao": "Com cerca de 5 anos, essa peludinha é dócil e amorosa. Vacinada contra a raiva, vermifugada e curada da cinomose.",
    "foto": "/img/animais/Branca.jpeg"
  },
  {
    "id": 10,
    "nome": "Cardosinha",
    "especie": "Cachorro",
    "sexo": "femea",
    "filhote": "false",
    "descricao": "Verdadeira guerreira: curada da cinomose, hoje está saudável, forte e cheia de amor para dar! Vacinada e vermifugada.",
    "foto": "/img/animais/Cardosinha.jpeg"
  },
  {
    "id": 12,
    "nome": "Chicó",
    "especie": "Cachorro",
    "sexo": "macho",
    "filhote": "false",
    "descricao": "O Chicó é um SRD caramelo, de porte médio, com cerca de 5 anos. Castrado, vacinado e vermifugado.",
    "foto": "/img/animais/Chicó.jpeg"
  },
  {
    "id": 14,
    "nome": "Cyclone",
    "especie": "Cachorro",
    "sexo": "macho",
    "filhote": "false",
    "descricao": "Pitbull de porte grande, 4 anos. Castrado, vacinado e vermifugado.",
    "foto": "/img/animais/Cyclone.jpeg"
  },
  {
    "id": 15,
    "nome": "Dupeladinho",
    "especie": "Cachorro",
    "sexo": "macho",
    "filhote": "false",
    "descricao": "SRD de porte médio, 3 anos. Dócil, alegre e muito companheiro. Castrado e vacinado.",
    "foto": "/img/animais/Dupeladinho.jpeg"
  },
  {
    "id": 16,
    "nome": "Edinha",
    "especie": "Cachorro",
    "sexo": "femea",
    "filhote": "false",
    "descricao": "Dócil, carinhosa, amorosa e carente. Vacinada contra a raiva e vermifugada.",
    "foto": "/img/animais/Edinha.jpeg"
  },
  {
    "id": 17,
    "nome": "Evin",
    "especie": "Cachorro",
    "sexo": "macho",
    "filhote": "false",
    "descricao": "SRD caramelo de porte médio, 13 anos. Castrado, vacinado e vermifugado, pronto para viver seus anos dourados.",
    "foto": "/img/animais/Evin.jpeg"
  },
  {
    "id": 18,
    "nome": "Fred",
    "especie": "Cachorro",
    "sexo": "macho",
    "filhote": "false",
    "descricao": "Vacinado contra a raiva, vermifugado e com controle de ectoparasitas em dia.",
    "foto": "/img/animais/Fred.jpeg"
  },
  {
    "id": 19,
    "nome": "Frederico",
    "especie": "Cachorro",
    "sexo": "macho",
    "filhote": "false",
    "descricao": "Vacinado contra a raiva, vermifugado, dócil e amoroso.",
    "foto": "/img/animais/Frederico.jpeg"
  },
  {
    "id": 20,
    "nome": "Jaqueline",
    "especie": "Cachorro",
    "sexo": "femea",
    "filhote": "false",
    "descricao": "Mestiça com pitbull, porte médio, dócil, carinhosa, com energia, castrada e vacinada, 3 anos.",
    "foto": "/img/animais/Jaqueline.jpeg"
  },
  {
    "id": 21,
    "nome": "Kelinha",
    "especie": "Cachorro",
    "sexo": "femea",
    "filhote": "false",
    "descricao": "Guerreirinha vacinada contra a raiva e vermifugada, à espera de um lar definitivo.",
    "foto": "/img/animais/Kelinha.jpeg"
  },
  {
    "id": 22,
    "nome": "Lampião",
    "especie": "Cachorro",
    "sexo": "macho",
    "filhote": "false",
    "descricao": "SRD grande, 3 anos. Dócil, brincalhão, castrado, vacinado e vermifugado.",
    "foto": "/img/animais/Lampiao.jpeg"
  },
  {
    "id": 23,
    "nome": "Lola",
    "especie": "Cachorro",
    "sexo": "femea",
    "filhote": "false",
    "descricao": "Dócil, carinhosa, amorosa e carente. Vacinada contra a raiva e vermifugada.",
    "foto": "/img/animais/Lola.jpeg"
  },
  {
    "id": 24,
    "nome": "Lorena",
    "especie": "Cachorro",
    "sexo": "femea",
    "filhote": "false",
    "descricao": "Pastora mestiça de porte médio, 5 anos. Castrada, vacinada e brincalhona.",
    "foto": "/img/animais/Lorena.jpeg"
  },
  {
    "id": 25,
    "nome": "Luna",
    "especie": "Cachorro",
    "sexo": "femea",
    "filhote": "false",
    "descricao": "SRD de porte médio, 1 aninho. Superou a cinomose, é muito dócil, castrada e vacinada.",
    "foto": "/img/animais/Luna.jpeg"
  },
  {
    "id": 26,
    "nome": "Luna 2",
    "especie": "Cachorro",
    "sexo": "femea",
    "filhote": "false",
    "descricao": "Cadelinha dócil, carinhosa, vacinada e cheia de amor para dar.",
    "foto": "/img/animais/Luna2.jpeg"
  },
  {
    "id": 27,
    "nome": "Manqueta",
    "especie": "Cachorro",
    "sexo": "macho",
    "filhote": "false",
    "descricao": "SRD caramelo de porte médio, cerca de 4 anos. Dócil, brincalhão, castrado e vacinado.",
    "foto": "/img/animais/Manqueta.jpeg"
  },
  {
    "id": 29,
    "nome": "Meg",
    "especie": "Cachorro",
    "sexo": "femea",
    "filhote": "false",
    "descricao": "Dócil, carinhosa e muito amorosa. Vacinada contra a raiva e vermifugada.",
    "foto": "/img/animais/Meg.jpeg"
  },
  {
    "id": 30,
    "nome": "Mel",
    "especie": "Cachorro",
    "sexo": "femea",
    "filhote": "false",
    "descricao": "SRD de porte médio, 1 aninho. Curada da cinomose, castrada e vacinada.",
    "foto": "/img/animais/Mel.jpeg"
  },
  {
    "id": 31,
    "nome": "Mel 2",
    "especie": "Cachorro",
    "sexo": "femea",
    "filhote": "true",
    "descricao": "Mel é SRD, aproximadamente 8 meses, castrada, vermifugada, vacinada para raiva. Dócil.",
    "foto": "/img/animais/Mel2.jpeg"
  },
  {
    "id": 32,
    "nome": "Moana",
    "especie": "Cachorro",
    "sexo": "femea",
    "filhote": "true",
    "descricao": "SRD de porte pequeno, filhotinha de 3 meses. Dócil, amorosa, vacinada e vermifugada.",
    "foto": "/img/animais/Moana.jpeg"
  },
  {
    "id": 34,
    "nome": "Nala",
    "especie": "Cachorro",
    "sexo": "femea",
    "filhote": "true",
    "descricao": "American bully de aproximadamente 6 meses, vermifugada, vacinada contra raiva.",
    "foto": "/img/animais/Nala.jpeg"
  },
  {
    "id": 35,
    "nome": "Paçoca",
    "especie": "Cachorro",
    "sexo": "macho",
    "filhote": "false",
    "descricao": "Vacinado contra a raiva, vermifugado e pronto para ser acolhido com amor.",
    "foto": "/img/animais/Paçoca.jpeg"
  },
  {
    "id": 36,
    "nome": "Pantera",
    "especie": "Cachorro",
    "sexo": "macho",
    "filhote": "false",
    "descricao": "SRD grande, 3 anos. Ativo, castrado, vacinado e vermifugado.",
    "foto": "/img/animais/Pantera.jpeg"
  },
  {
    "id": 37,
    "nome": "Pretinha",
    "especie": "Cachorro",
    "sexo": "femea",
    "filhote": "false",
    "descricao": "Dócil, carinhosa, brincalhona e carente. Vacinada contra a raiva e vermifugada.",
    "foto": "/img/animais/Pretinha.jpeg"
  },
  {
    "id": 38,
    "nome": "Sr. Vicente",
    "especie": "Cachorro",
    "sexo": "macho",
    "filhote": "false",
    "descricao": "Dócil, carinhoso, amoroso e carente. Vacinado contra a raiva e vermifugado.",
    "foto": "/img/animais/Sr_vicente.jpeg"
  },
  {
    "id": 39,
    "nome": "Thiaguim",
    "especie": "Cachorro",
    "sexo": "macho",
    "filhote": "false",
    "descricao": "Castrado, vacinado e vermifugado. É brincalhão e ama carrinhos de mão de obra!",
    "foto": "/img/animais/Thiaguim.jpeg"
  },
  {
    "id": 40,
    "nome": "Thor",
    "especie": "Cachorro",
    "sexo": "macho",
    "filhote": "false",
    "descricao": "Dócil, carinhoso, brincalhão e carente. Vacinado e vermifugado.",
    "foto": "/img/animais/Thor.jpeg"
  },
  {
    "id": 41,
    "nome": "Tupam",
    "especie": "Cachorro",
    "sexo": "macho",
    "filhote": "false",
    "descricao": "Vacinado contra a raiva, vermifugado, dócil e amoroso.",
    "foto": "/img/animais/Tupam.jpeg"
  },
  {
    "id": 43,
    "nome": "Zé",
    "especie": "Cachorro",
    "sexo": "macho",
    "filhote": "false",
    "descricao": "Castrado, vacinado e vermifugado. Dócil, carinhoso e brincalhão.",
    "foto": "/img/animais/Ze.jpeg"
  },
  {
    "id": 44,
    "nome": "Zé Grilo",
    "especie": "Cachorro",
    "sexo": "macho",
    "filhote": "false",
    "descricao": "SRD caramelo de porte médio, 5 anos. Dócil, brincalhão, castrado e vacinado.",
    "foto": "/img/animais/Ze_Grilo.jpeg"
  }
];

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
  const [passoModal, setPassoModal] = useState('detalhes'); // 'detalhes' | 'termo' | 'formulario'
  const [termoAceito, setTermoAceito] = useState(false);
  const [dadosAdocao, setDadosAdocao] = useState({ nome: '', telefone: '', email: '', cidade: '' });
  const [enviando, setEnviando] = useState(false);
  const [enviadoSucesso, setEnviadoSucesso] = useState(false);
  const [erroEnvio, setErroEnvio] = useState(null);

  // RESET DA PAGINAÇÃO
  const handleFiltroEspecie = (valor) => { setFiltroEspecie(valor); setPaginaAtual(1); };
  const handleFiltroSexo = (valor) => { setFiltroSexo(valor); setPaginaAtual(1); };
  const handleFiltroIdade = (valor) => { setFiltroIdade(valor); setPaginaAtual(1); };
  const handleBuscaNome = (valor) => { setBuscaNome(valor); setPaginaAtual(1); };

  // FILTRAGEM
  const animaisFiltrados = animaisDisponiveis.filter(animal => {
    const bateEspecie = filtroEspecie === 'todos' || animal.especie.toLowerCase() === filtroEspecie.toLowerCase();
    const bateSexo = filtroSexo === 'todos' || animal.sexo.toLowerCase() === filtroSexo.toLowerCase();
    let bateIdade = true;
    if (filtroIdade === 'filhote') bateIdade = animal.filhote === 'true';
    else if (filtroIdade === 'adulto') bateIdade = animal.filhote === 'false';
    const bateNome = animal.nome.toLowerCase().includes(buscaNome.toLowerCase());

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
    setDadosAdocao({ nome: '', telefone: '', email: '', cidade: '' });
  };

  // ENVIO PARA O GOOGLE SHEETS VIA GET
  const handleEnviarFormulario = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setErroEnvio(null);

    try {
      // Monta os parâmetros URLSearchParams para a chamada GET
      const params = new URLSearchParams({
        tipo: 'adocao', // Sinalizador lido pela função salvarSolicitacaoAdocaoSite(e) no Apps Script
        nome: dadosAdocao.nome,
        telefone: dadosAdocao.telefone,
        email: dadosAdocao.email,
        cidade: dadosAdocao.cidade,
        animal: animalSelecionado?.nome || 'Não especificado'
      });

      const urlFinal = `${GOOGLE_SCRIPT_URL}?${params.toString()}`;

      await fetch(urlFinal, {
        method: 'GET',
        mode: 'no-cors'
      });

      setEnviadoSucesso(true);
    } catch (err) {
      setErroEnvio('Ocorreu um erro ao enviar sua solicitação. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      
      {/* BARRA DE NAVEGAÇÃO SUPERIOR */}
      <div className={styles.navigationBar}>
        <div className={styles.container}>
          <Link href="/servicos/ccz" className={styles.backLink}>
            ← Voltar para o CCZ
          </Link>
        </div>
      </div>

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

      <main className={styles.mainContainer}>
        <div className={styles.container}>

          {/* BUSCA E FILTROS EXPANDIDOS */}
          <div className={styles.filterSection}>
            <div className={styles.searchBox}>
              <span className={styles.searchIcon}>🔍</span>
              <input 
                type="text" 
                placeholder="Buscar pelo nome do animal..." 
                value={buscaNome}
                onChange={(e) => handleBuscaNome(e.target.value)}
                className={styles.searchInput}
              />
              {buscaNome && (
                <button className={styles.clearBtn} onClick={() => handleBuscaNome('')}>✕</button>
              )}
            </div>

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

          {/* GRID DE CARDS DOS ANIMAIS (4 POR LINHA) */}
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
              <span>🔍</span>
              <h3>Nenhum animal encontrado</h3>
              <p>Não encontramos nenhum amiguinho com essa combinação de filtros.</p>
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

      {/* MODAL / POP-UP CLEAN DE ADOÇÃO COM FLUXO TERMO DE RESPONSABILIDADE */}
      {animalSelecionado && (
        <div className={styles.modalOverlay} onClick={handleFecharModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={handleFecharModal} title="Fechar">✕</button>

            {/* PASSO 1: DETALHES COMPACTOS DO ANIMAL */}
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
                      <label>Cidade / Bairro *</label>
                      <input 
                        type="text" 
                        required 
                        value={dadosAdocao.cidade}
                        onChange={(e) => setDadosAdocao({...dadosAdocao, cidade: e.target.value})}
                        placeholder="Ex: Muriaé - Bairro Centro"
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