'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ChevronDown, BookOpen, Layers, Info } from 'lucide-react';
import styles from './CarteiraServicos.module.css';

const LINHAS_DE_CUIDADO = [
  {
    titulo: "Pequenas cirurgias, cirurgias de pele e subcutâneo",
    procedimentos: [
      { codigo: "0401020088", nome: "EXERESE DE CISTO SACRO-COCCIGEO" },
      { codigo: "0401020096", nome: "EXERESE DE CISTO TIREOGLOSSO" },
      { codigo: "0401020100", nome: "EXTIRPACAO E SUPRESSAO DE LESAO DE PELE E DE TECIDO CELULAR SUBCUTANEO" }
    ]
  },
  {
    titulo: "Glândulas endócrinas",
    procedimentos: [
      { codigo: "0402010019", nome: "EXTIRPACAO DE BOCIO INTRATORACICO POR VIA TRANSESTERNAL" },
      { codigo: "0402010035", nome: "TIREOIDECTOMIA PARCIAL" },
      { codigo: "0402010043", nome: "TIREOIDECTOMIA TOTAL" }
    ]
  },
  {
    titulo: "Sistema nervoso central e periférico",
    procedimentos: [
      { codigo: "0403010020", nome: "CRANIOTOMIA DESCOMPRESSIVA" },
      { codigo: "0403020115", nome: "TRATAMENTO CIRURGICO DE NEUROPATIA COMPRESSIVA COM OU SEM MICROCIRURGIA" },
      { codigo: "0403020123", nome: "TRATAMENTO CIRURGICO DE SINDROME COMPRESSIVA EM TUNEL OSTEO-FIBROSO AO NIVEL DO CARPO" },
      { codigo: "0403050154", nome: "TRATAMENTO DE LESAO DO SISTEMA NEUROVEGETATIVO POR AGENTES QUIMICOS" }
    ]
  },
  {
    titulo: "Vias aéreas e face",
    procedimentos: [
      { codigo: "0404010121", nome: "EXERESE DE TUMOR DE VIAS AEREAS SUPERIORES, FACE E PESCOCO" },
      { codigo: "0404010466", nome: "PAROTIDECTOMIA PARCIAL OU SUBTOTAL" },
      { codigo: "0404020089", nome: "EXCISAO DE RANULA OU FENOMENO DE RETENCAO SALIVAR" },
      { codigo: "0404020240", nome: "RECONSTRUCAO TOTAL OU PARCIAL DE NARIZ" },
      { codigo: "0404020313", nome: "RETIRADA DE CORPO ESTRANHO DOS OSSOS DA FACE" },
      { codigo: "0404020542", nome: "REDUCAO CIRURGICA DE FRATURA DOS OSSOS PROPRIOS DO NARIZ" }
    ]
  },
  {
    titulo: "Aparelho circulatório",
    procedimentos: [
      { codigo: "0406010536", nome: "FECHAMENTO DE COMUNICACAO INTERATRIAL" },
      { codigo: "0406010650", nome: "IMPLANTE DE MARCAPASSO DE CAMARA DUPLA TRANSVENOSO" },
      { codigo: "0406010676", nome: "IMPLANTE DE MARCAPASSO DE CAMARA UNICA TRANSVENOSO" },
      { codigo: "0406010692", nome: "IMPLANTE DE PROTESE VALVAR" },
      { codigo: "0406010927", nome: "REVASCULARIZACAO MIOCARDICA COM USO DE EXTRACORPOREA" },
      { codigo: "0406010935", nome: "REVASCULARIZACAO MIOCARDICA C/ USO DE EXTRACORPOREA (C/ 2 OU MAIS ENXERTOS)" },
      { codigo: "0406020221", nome: "LINFADENECTOMIA RADICAL AXILAR UNILATERAL" },
      { codigo: "0406020450", nome: "REVASCULARIZACAO POR PONTE / TROMBOENDARTERECTOMIA FEMURO-POPLITEA PROXIMAL" },
      { codigo: "0406020493", nome: "TRATAMENTO CIRURGICO DE LESOES VASCULARES TRAUMATICAS DA REGIAO CERVICAL" },
      { codigo: "0406020566", nome: "TRATAMENTO CIRURGICO DE VARIZES (BILATERAL)" },
      { codigo: "0406020574", nome: "TRATAMENTO CIRURGICO DE VARIZES (UNILATERAL)" },
      { codigo: "0406030014", nome: "ANGIOPLASTIA CORONARIANA" },
      { codigo: "0406030022", nome: "ANGIOPLASTIA CORONARIANA C/ IMPLANTE DE DOIS STENTS" },
      { codigo: "0406030030", nome: "ANGIOPLASTIA CORONARIANA COM IMPLANTE DE STENT" },
      { codigo: "0406040028", nome: "ANGIOPLASTIA INTRALUMINAL DE AORTA, VEIA CAVA / VASOS ILIACOS (COM STENT)" },
      { codigo: "0406040044", nome: "ANGIOPLASTIA INTRALUMINAL DE AORTA, VEIA CAVA / VASOS ILIACOS (SEM STENT)" },
      { codigo: "0406040052", nome: "ANGIOPLASTIA INTRALUMINAL DE VASOS DAS EXTREMIDADES (SEM STENT)" },
      { codigo: "0406040060", nome: "ANGIOPLASTIA INTRALUMINAL DE VASOS DAS EXTREMIDADES (COM STENT NAO RECOBERTO)" },
      { codigo: "0406040095", nome: "ANGIOPLASTIA INTRALUMINAL DE VASOS DO PESCOCO OU TRONCOS SUPRA-AORTICOS (COM STENT NAO RECOBERTO)" },
      { codigo: "0406040109", nome: "ANGIOPLASTIA INTRALUMINAL DE VASOS VISCERAIS COM STENT NAO RECOBERTO" },
      { codigo: "0406040168", nome: "CORRECAO ENDOVASCULAR DE ANEURISMA / DISSECCAO DA AORTA ABDOMINAL E ILIACAS COM ENDOPROTESE BIF" },
      { codigo: "0406040176", nome: "CORRECAO ENDOVASCULAR DE ANEURISMA / DISSECCAO DA AORTA TORACICA COM ENDOPROTESE RETA OU CONIC" }
    ]
  },
  {
    titulo: "Aparelho digestivo e parede abdominal",
    procedimentos: [
      { codigo: "0407010211", nome: "GASTROSTOMIA" },
      { codigo: "0407020179", nome: "ENTERECTOMIA" },
      { codigo: "0407020225", nome: "EXCISAO DE LESAO / TUMOR ANU-RETAL" },
      { codigo: "0407020276", nome: "FISTULECTOMIA / FISTULOTOMIA ANAL" },
      { codigo: "0407020284", nome: "HEMORROIDECTOMIA" },
      { codigo: "0407020470", nome: "TRATAMENTO CIRURGICO DE PROLAPSO ANAL" },
      { codigo: "0407030026", nome: "COLECISTECTOMIA" },
      { codigo: "0407030034", nome: "COLECISTECTOMIA VIDEOLAPAROSCOPICA" },
      { codigo: "0407030166", nome: "HEPATOTOMIA E DRENAGEM DE ABSCESSO / CISTO" },
      { codigo: "0407040064", nome: "HERNIOPLASTIA EPIGASTRICA" },
      { codigo: "0407040080", nome: "HERNIOPLASTIA INCISIONAL" },
      { codigo: "0407040099", nome: "HERNIOPLASTIA INGUINAL (BILATERAL)" },
      { codigo: "0407040102", nome: "HERNIOPLASTIA INGUINAL / CRURAL (UNILATERAL)" },
      { codigo: "0407040110", nome: "HERNIOPLASTIA RECIDIVANTE" },
      { codigo: "0407040129", nome: "HERNIOPLASTIA UMBILICAL" },
      { codigo: "0407040137", nome: "HERNIORRAFIA INGUINAL VIDEOLAPAROSCOPICA" },
      { codigo: "0407040153", nome: "HERNIORRAFIA UMBILICAL VIDEOLAPAROSCOPICA" },
      { codigo: "0407040161", nome: "LAPAROTOMIA EXPLORADORA" }
    ]
  },
  {
    titulo: "Sistema osteomuscular",
    procedimentos: [
      { codigo: "0408010150", nome: "TRATAMENTO CIRURGICO DE FRATURA DA CLAVICULA" },
      { codigo: "0408010185", nome: "TRATAMENTO CIRURGICO DE LUXACAO / FRATURA-LUXACAO ACROMIO-CLAVICULAR" },
      { codigo: "0408020369", nome: "TRATAMENTO CIRURGICO DE FRATURA / LESAO FISARIA DO CONDILO / TROCLEA/APOFISE CORONOIDE DO ULNA" },
      { codigo: "0408020385", nome: "TRATAMENTO CIRURGICO DE FRATURA / LESAO FISARIA SUPRACONDILIANA DO UMERO" },
      { codigo: "0408020393", nome: "TRATAMENTO CIRUGICO DE FRATURA DA DIAFISE DO UMERO" },
      { codigo: "0408020423", nome: "TRATAMENTO CIRURGICO DE FRATURA DIAFISARIA DE AMBOS OS OSSOS DO ANTEBRACO (C/ SINTESE)" },
      { codigo: "0408020440", nome: "TRATAMENTO CIRURGICO DE FRATURA LESAO FISARIA DOS OSSOS DO ANTEBRACO" },
      { codigo: "0408030267", nome: "ARTRODESE TORACO-LOMBO-SACRA POSTERIOR UM NIVEL" },
      { codigo: "0408030380", nome: "DISCECTOMIA CERVICAL / LOMBAR / LOMBO-SACRA POR VIA POSTERIOR (1 NIVEL C/ MICROSCOPIO)" },
      { codigo: "0408040190", nome: "REDUCAO INCRUENTA DE LUXACAO COXOFEMORAL TRAUMATICA / POS-ARTROPLASTIA" },
      { codigo: "0408050012", nome: "AMPUTACAO / DESARTICULACAO DE MEMBROS INFERIORES" },
      { codigo: "0408050063", nome: "ARTROPLASTIA TOTAL PRIMARIA DO JOELHO" },
      { codigo: "0408050489", nome: "TRATAMENTO CIRURGICO DE FRATURA / LESAO FISARIA PROXIMAL (COLO) DO FEMUR (SINTESE)" },
      { codigo: "0408050500", nome: "TRATAMENTO CIRURGICO DE FRATURA DA DIAFISE DA TIBIA" },
      { codigo: "0408050519", nome: "TRATAMENTO CIRURGICO DE FRATURA DA DIAFISE DO FEMUR" },
      { codigo: "0408050632", nome: "TRATAMENTO CIRURGICO DE FRATURA TRANSTROCANTERIANA" },
      { codigo: "0408050799", nome: "TRATAMENTO CIRURGICO DE PSEUDARTROSE / RETARDO DE CONSOLIDACAO / PERDA OSSEA DA DIAFISE DO FEMUR" },
      { codigo: "0408050861", nome: "TRATAMENTO CIRURGICO DE PSEUDARTROSE / RETARDO DE CONSOLIDACAO / PERDA OSSEA DA DIAFISE TIBIAL" },
      { codigo: "0408060115", nome: "ENCURTAMENTO DE OSSOS LONGOS EXCETO DA MAO E DO PE" },
      { codigo: "0408060158", nome: "MANIPULACAO ARTICULAR" },
      { codigo: "0408060212", nome: "RESSECCAO DE CISTO SINOVIAL" },
      { codigo: "0408060310", nome: "RESSECCAO SIMPLES DE TUMOR OSSEO / DE PARTES MOLES" },
      { codigo: "0408060352", nome: "RETIRADA DE FIO OU PINO INTRA-OSSEO" },
      { codigo: "0408060360", nome: "RETIRADA DE FIXADOR EXTERNO" },
      { codigo: "0408060379", nome: "RETIRADA DE PLACA E/OU PARAFUSOS" },
      { codigo: "0408060476", nome: "TENOPLASTIA OU ENXERTO DE TENDAO UNICO" }
    ]
  },
  {
    titulo: "Aparelho Geniturinário",
    procedimentos: [
      { codigo: "0409010170", nome: "INSTALACAO ENDOSCOPICA DE CATETER DUPLO J" },
      { codigo: "0409010308", nome: "NEFROURETERECTOMIA TOTAL" },
      { codigo: "0409010383", nome: "RESSECCAO ENDOSCOPICA DE LESAO VESICAL" },
      { codigo: "0409010561", nome: "URETEROLITOTOMIA" },
      { codigo: "0409010596", nome: "URETEROLITOTRIPSIA TRANSURETEROSCOPICA" },
      { codigo: "0409030023", nome: "PROSTATECTOMIA SUPRAPUBICA" },
      { codigo: "0409040134", nome: "ORQUIDOPEXIA UNILATERAL" },
      { codigo: "0409040177", nome: "PLASTICA DA BOLSA ESCROTAL" },
      { codigo: "0409040215", nome: "TRATAMENTO CIRURGICO DE HIDROCELE" },
      { codigo: "0409040240", nome: "VASECTOMIA" },
      { codigo: "0409060020", nome: "COLPOPERINEOPLASTIA ANTERIOR E POSTERIOR C/ AMPUTACAO DE COLO" },
      { codigo: "0409060046", nome: "CURETAGEM SEMIOTICA C/ OU S/ DILATACAO DO COLO DO UTERO" },
      { codigo: "0409060100", nome: "HISTERECTOMIA (POR VIA VAGINAL)" },
      { codigo: "0409060119", nome: "HISTERECTOMIA C/ ANEXECTOMIA (UNI / BILATERAL)" },
      { codigo: "0409060127", nome: "HISTERECTOMIA SUBTOTAL" },
      { codigo: "0409060135", nome: "HISTERECTOMIA TOTAL" },
      { codigo: "0409060143", nome: "HISTERECTOMIA TOTAL AMPLIADA (WERTHEIN-MEIGS)" },
      { codigo: "0409060186", nome: "LAQUEADURA TUBARIA" },
      { codigo: "0409060194", nome: "MIOMECTOMIA" },
      { codigo: "0409060216", nome: "OOFORECTOMIA / OOFOROPLASTIA" },
      { codigo: "0409060232", nome: "SALPINGECTOMIA UNI / BILATERAL" },
      { codigo: "0409070050", nome: "COLPOPERINEOPLASTIA ANTERIOR E POSTERIOR" },
      { codigo: "0409070084", nome: "COLPOPLASTIA ANTERIOR" },
      { codigo: "0409070149", nome: "EXERESE DE CISTO VAGINAL" },
      { codigo: "0409070157", nome: "EXERESE DE GLANDULA DE BARTHOLIN / SKENE" }
    ]
  },
  {
    titulo: "Obstetrícia",
    procedimentos: [
      { codigo: "0411010034", nome: "PARTO CESARIANO" },
      { codigo: "0411020013", nome: "CURETAGEM POS-ABORTAMENTO / PUERPERAL" }
    ]
  },
  {
    titulo: "Bucomaxilofacial",
    procedimentos: [
      { codigo: "0414020413", nome: "TRATAMENTO ODONTOLOGICO PARA PACIENTES COM NECESSIDADES ESPECIAIS" }
    ]
  }
];

export default function CarteiraServicosPage() {
  const [busca, setBusca] = useState('');
  const [abertos, setAbertos] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Alterna o estado de abertura de um acordeão
  const toggleAcordeon = (index) => {
    setAbertos((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // Filtragem dinâmica por nome ou código do procedimento
  const termo = busca.toLowerCase().trim();

  const linhasFiltradas = LINHAS_DE_CUIDADO.map((linha) => {
    const procedimentosFiltrados = linha.procedimentos.filter(
      (proc) =>
        proc.nome.toLowerCase().includes(termo) ||
        proc.codigo.includes(termo)
    );
    return { ...linha, procedimentos: procedimentosFiltrados };
  }).filter((linha) => linha.procedimentos.length > 0);

  return (
    <div className={styles.pageWrapper}>
      {/* BANNER HERO INSTITUCIONAL */}
      <section className={styles.heroBanner}>
        <div className={styles.container}>
          <span className={styles.heroBadge}>
            <BookOpen size={14} /> Transparência SUS
          </span>
          <h1 className={styles.heroTitle}>Carteira de Serviços</h1>
          <p className={styles.heroSubtitle}>
            Consulte a listagem completa de procedimentos cirúrgicos e ambulatoriais realizados pelo município, organizados por linhas de cuidado e código oficial SUS.
          </p>
        </div>
      </section>

      {/* BARRA DE NAVEGAÇÃO DE VOLTA */}
      <div className={styles.navigationBar}>
        <div className={styles.container}>
          <Link href="/" className={styles.backLink}>
            ← Voltar ao Início
          </Link>
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <main className={styles.mainContainer}>
        <div className={styles.container}>
          
          {/* CARD INFORMATIVO */}
          <div className={styles.cardInfo}>
            <div className={styles.infoIconBox}>
              <Info size={22} />
            </div>
            <div>
              <h3>Guia do Cidadão e Prestador</h3>
              <p>
                Abaixo você encontra a padronização oficial dos procedimentos faturáveis do município. Utilize a barra de busca para pesquisar diretamente pelo código SIGTAP ou pelo nome da cirurgia.
              </p>
            </div>
          </div>

          {/* CAMPO DE BUSCA EM TEMPO REAL */}
          <div className={styles.searchSection}>
            <div className={styles.searchBox}>
              <Search size={20} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Buscar procedimento por nome ou código (ex: Histerectomia, 0407030026)..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className={styles.searchInput}
              />
              {busca && (
                <button
                  type="button"
                  className={styles.clearBtn}
                  onClick={() => setBusca('')}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* LISTA DE LINHAS DE CUIDADO / ACORDEÕES */}
          <div className={styles.linhasContainer}>
            <div className={styles.sectionHeader}>
              <Layers size={20} color="#008a83" />
              <h2>Linhas de Cuidado Disponíveis</h2>
            </div>

            {linhasFiltradas.length > 0 ? (
              linhasFiltradas.map((linha, index) => {
                const isAberto = abertos[index] || busca.length > 0;

                return (
                  <div key={index} className={styles.acordeonItem}>
                    <button
                      className={styles.acordeonHeader}
                      onClick={() => toggleAcordeon(index)}
                      type="button"
                    >
                      <span className={styles.acordeonTitulo}>{linha.titulo}</span>
                      <div className={styles.headerRight}>
                        <span className={styles.countBadge}>
                          {linha.procedimentos.length} procedimento(s)
                        </span>
                        <ChevronDown
                          size={20}
                          className={`${styles.chevron} ${isAberto ? styles.chevronOpen : ''}`}
                        />
                      </div>
                    </button>

                    {isAberto && (
                      <div className={styles.acordeonBody}>
                        <ul className={styles.procedimentosList}>
                          {linha.procedimentos.map((proc, idx) => (
                            <li key={idx} className={styles.procedimentoCard}>
                              <span className={styles.codigoBadge}>{proc.codigo}</span>
                              <span className={styles.procedimentoNome}>{proc.nome}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })
          
                ) : (
                <div className={styles.emptyState}>
                    <Search size={40} className={styles.emptyIcon} />
                    <h3>Nenhum procedimento encontrado</h3>
                    <p>
                    Não encontramos nenhum resultado para {`"${busca}"`}. Tente buscar por outros termos.
                    </p>
                    <button className={styles.resetBtn} onClick={() => setBusca('')}>
                    Limpar Busca
                    </button>
                </div>
                )}
          </div>

        </div>
      </main>
    </div>
  );
}