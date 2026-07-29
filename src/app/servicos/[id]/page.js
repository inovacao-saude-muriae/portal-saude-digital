'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import styles from './ServiceDetail.module.css';

// 1. BANCO DE DADOS ATUALIZADO
const dbServicos = {
  "aplicativos": {
    title: "Aplicativos da Saúde",
    desc: "Acesse os serviços digitais de saúde na palma da sua mão. Escolha abaixo qual aplicativo você deseja conhecer e utilizar para acompanhar seus atendimentos, histórico de saúde e agendamentos.",
    apps: {
      "saude-digital": {
        nome: "Saúde Digital Muriaé",
        subtitulo: "A nova plataforma oficial de saúde do município de Muriaé",
        desc: "A Prefeitura Municipal de Muriaé, por meio da Secretaria Municipal de Saúde, lança oficialmente o Saúde Digital Muriaé, uma nova plataforma que amplia o acesso da população às informações e aos serviços da rede pública de saúde do município.\n\nA iniciativa representa mais um avanço no processo de modernização da gestão, fortalecendo a transparência, a organização dos atendimentos e a aproximação entre o cidadão e o Sistema Único de Saúde.",
        funcionalidades: [
          "Acompanhamento de consultas agendadas (data, horário, local e profissional);",
          "Ferramenta de confirmação de consultas;",
          "Consulta à posição na fila de espera para procedimentos;",
          "Lista atualizada de médicos, hospitais e unidades de saúde;",
          "Acesso seguro a dados pessoais e familiares cadastrados;",
          "Divulgação de notícias, campanhas e comunicados oficiais."
        ],
        comoAcessar: "O acesso à plataforma será realizado mediante CPF e senha disponibilizada pela Unidade Básica de Saúde (UBS), garantindo a proteção das informações e o uso responsável dos dados.",
        linksDownload: {
          appStore: "https://apps.apple.com/br/app/vivver-sa%C3%BAde-cidad%C3%A3o/id6466105436", // Substitua pelo link real da App Store quando disponível
          googlePlay: " https://play.google.com/store/apps/details?id=io.vivver.cidadao.app" // Substitua pelo link real da Google Play quando disponível
        }
      },
      "meu-sus-digital": {
        nome: "Meu SUS Digital",
        subtitulo: "A plataforma oficial do Ministério da Saúde",
        desc: "O Meu SUS Digital (antigo Conecte SUS) é o aplicativo oficial do Governo Federal que unifica o histórico de saúde de todos os cidadãos brasileiros atendidos pelo Sistema Único de Saúde.",
        funcionalidades: [
          "Carteira Nacional de Vacinação Digital (com QR Code comprovante);",
          "Histórico de exames, internações e medicamentos dispensados pelo SUS em todo o país;",
          "Emissão do Cartão Nacional de Saúde (CNS) em formato digital;",
          "Registro do histórico de doação de órgãos e contatos de emergência."
        ],
        comoAcessar: "Baixe o aplicativo 'Meu SUS Digital' diretamente na Google Play Store ou Apple App Store. Para acessar, utilize seu login e senha cadastrados na sua conta Gov.br (com nível Prata ou Ouro).",
        linksDownload: {
          appStore: "https://apps.apple.com/br/app/meu-sus-digital/id1527885233",
          googlePlay: "https://play.google.com/store/apps/details?id=br.gov.datasus.conectesus"
        }
      }
    }
  },
  "atendimento-domiciliar": {
    title: "Cuidado em casa para quem mais precisa",
    desc: "O Serviço de Atendimento Domiciliar (SAD) destina-se a pessoas acamadas ou com dificuldade de mobilidade, de forma temporária ou permanente. Nesse modelo de cuidado, a equipe de saúde realiza o atendimento na própria casa do paciente, garantindo acompanhamento contínuo e humanizado.",
    horario: "Segunda a Sexta, das 07h às 17h",
    onde: "Atendimento realizado diretamente na própria casa do paciente.",
    documentos: [
      "CPF, RG e Cartão do SUS atualizado",
      "Comprovante de residência no município"
    ],
    requisitos: "Morar em Muriaé; Idade a partir de 01 mês de vida; Ser usuário do SUS; Apresentar quadro clínico que justifique atendimento domiciliar.",
    passoAPasso: [
      "O familiar ou responsável deve procurar a UBS onde o paciente já é atendido;",
      "Um profissional da equipe preencherá uma ficha de pedido para inclusão;",
      "A ficha será encaminhada à equipe do SAD, que fará a avaliação."
    ],
    comunicacao: "Comunicação com o Usuário: Após o encaminhamento, o Agente Comunitário de Saúde entrará em contato com a família para informar sobre a visita de avaliação. Caso o paciente seja admitido, a equipe elaborará um plano de cuidados individualizado."
  },
  "camara-tecnica": {
    title: "Gestão e Assessoria Especializada",
    desc: "A Câmara Técnica é um grupo de especialistas que trabalha para garantir que o cidadão receba o tratamento correto, unindo as necessidades dos pacientes às regras e recursos do SUS.",
    horario: "Segunda a Sexta, das 07h30 às 11h30 e das 13h00 às 17h00",
    onde: "Secretaria Municipal de Saúde de Muriaé / Setor de Regulação.",
    secoesTexto: [
      {
        titulo: "Atribuições da Câmara Técnica de Saúde",
        itens: [
          "Prestar assessoria à Gestão Municipal de Saúde no processo de oferta de medicamentos, exames, tratamentos e materiais médicos que estejam fora das listas padrão e das diretrizes do SUS (PCDT), sempre que houver prescrição feita por profissionais habilitados.",
          "Estabelecer roteiros padronizados de atendimento para organizar as rotinas e os cuidados prestados na assistência à saúde.",
          "Analisar as justificativas dos profissionais para o uso de itens fora da rede, emitindo um parecer que recomende a continuidade do tratamento, a sua substituição por alternativas previstas no SUS ou, se necessário, o indeferimento por falta de eficácia.",
          "Promover encontros de trabalho entre os especialistas das áreas assistenciais para discutir e integrar as ações de saúde.",
          "Submeter anualmente à revisão pericial os pacientes com sentenças judiciais definitivas. A perícia deve atestar se a manutenção do tratamento ainda se justifica ou se houve mudança na situação real do paciente que permita a troca por outras terapias ou até a suspensão do fornecimento."
        ]
      },
      {
        titulo: "Apoio Institucional",
        paragrafo: "Prestar auxílio técnico ao Poder Judiciário, Ministério Público, Defensoria Pública, OAB e à Procuradoria Geral do Município por meio de Acordos de Cooperação. O objetivo é fornecer laudos e perícias que garantam o cumprimento dos protocolos do SUS e a adoção de terapias alternativas, evitando gastos desnecessários para o município."
      }
    ],
    comunicacao: "Todas as pessoas que recebem remédios, materiais ou tratamentos pelo SUS poderão passar por perícias periódicas, seguindo as regras e critérios definidos pela Câmara Técnica de Saúde."
  },
  "ccz": {
  title: "Centro de Controle de Zoonoses",
  desc: "O Centro de Controle de Zoonoses Manuela Pereira da Marta, vinculado à Secretaria Municipal de Saúde de Muriaé, é uma unidade fundamental para a promoção da saúde pública e para o controle de doenças que podem ser transmitidas entre animais e seres humanos.\n\nLocalizado na BR-356, no sentido Muriaé–Ervália, o CCZ atua diretamente ligado à vigilância e à prevenção dessas patologias, por meio de ações estratégicas voltadas à proteção e melhoria da qualidade de vida da população.",
  onde: "BR-356, sentido Muriaé–Ervália",
  secoesTexto: [
    {
      titulo: "Principais Atividades Desenvolvidas",
      itens: [
        "Monitoramento e controle ativo de doenças zoonóticas, como raiva, leishmaniose, escabiose e esporotricose;",
        "Educação em saúde, com campanhas contínuas sobre prevenção de zoonoses e posse responsável de animais de estimação;",
        "Campanhas estratégicas de adoção responsável, incentivando o bem-estar animal e o estreitamento de vínculos com a comunidade;",
        "Vacinação antirrábica de cães e gatos durante os períodos de mobilização nacional promovidos pelo Governo de Minas Gerais;",
        "Parcerias técnicas com o Instituto Mineiro de Agropecuária (IMA) para o controle da raiva, com foco no monitoramento de morcegos hematófagos;",
        "Acolhimento e resgate direcionado de animais com suspeita clínica de zoonoses ou em estrito risco à saúde pública."
      ]
    }
  ]
},
  "farmacia-municipal": {
    title: "Acesso Gratuito a Medicamentos",
    desc: "A Assistência Farmacêutica garante à população o acesso gratuito a medicamentos por meio do Sistema Único de Saúde (SUS). Esses medicamentos são organizados em diferentes componentes, de acordo com o tipo de tratamento, a complexidade das doenças e as diretrizes do Ministério da Saúde.",
    horario: "Básico: Segunda a sexta, das 7h às 17h | Especializado: Segunda a sexta, das 7h às 15h (Atendimento até dia 23 do mês).",
    onde: "Farmácias Municipais, UBS e Setor de Epidemiologia.",
    secoesTexto: [
      {
        titulo: "Medicamentos da Assistência Farmacêutica Básica",
        paragrafo: "São medicamentos essenciais disponibilizados gratuitamente pelo SUS para o tratamento das doenças mais comuns. Eles fazem parte da Relação Municipal de Medicamentos Essenciais (REMUME).\n\nQuem pode retirar:\nPacientes com receita médica válida e que atendem aos critérios de uso de medicamentos disponíveis na rede pública.",
        itens: [
          "Atendimento de segunda a sexta-feira, das 7h às 17h;",
          "Apresentar receita médica atualizada;",
          "Apresentar documento de identificação oficial com foto;",
          "Apresentar CPF e Cartão do SUS atualizado;",
          "Apresentar comprovante de residência recente no município."
        ]
      },
      {
        titulo: "Componente Especializado (CEAF)",
        paragrafo: "Programa do SUS que garante acesso a medicamentos de alto custo usados em tratamentos ambulatoriais, seguindo critérios dos Protocolos Clínicos e Diretrizes Terapêuticas (PCDT).",
        itens: [
          "Dispensação programada mensal, realizada a cada 30 dias;",
          "Horário de atendimento exclusivo: das 7h às 15h;",
          "Atenção: o último dia de atendimento operacional do mês é o dia 23;",
          "Retirada permitida apenas pelo paciente cadastrado ou representante legal documentado."
        ]
      },
      {
        titulo: "Atenção ao cadastro",
        paragrafo: "Para o Componente Especializado, é necessário que o paciente esteja rigorosamente enquadrado nos critérios dos PCDTs, apresentando diagnóstico laudado e documentação específica exigida pelo Estado."
      },
      {
        titulo: "Componente Estratégico (CESAF)",
        paragrafo: "Reúne medicamentos para prevenção, controle e tratamento de doenças de impacto epidemiológico. A dispensação é realizada diretamente no setor de Epidemiologia, mediante receita médica, preenchimento de formulários e exames de monitoramento exigidos."
      }
    ]
  },
  "laboratorio-municipal": {
    title: "Diagnóstico e Apoio à Saúde da População",
    desc: "O Laboratório Municipal é responsável pela realização de exames laboratoriais offeredidos pelo Sistema Único de Saúde (SUS), desempenhando um papel essencial no diagnóstico, prevenção e acompanhamento de doenças.\n\nPor meio desse serviço, a população tem acesso gratuito a exames que auxiliam os profissionais de saúde na identificação precoce de alterações e na condução adequada dos tratamentos.",
    horario: "Segunda a sexta-feira, das 12h às 17h",
    onde: "Rua Coronel Izalino, s/n - Muriaé/MG | Telefone: (32) 2020-8074",
    secoesTexto: [
      {
        titulo: "Agendamento de exames",
        paragrafo: "Para realizar o agendamento é necessário apresentar a seguinte documentação:",
        itens: [
          "Pedido médico oficial emitido pelo SUS;",
          "Documento de identidade oficial com foto e CPF;",
          "Comprovante de residência atualizado no município;",
          "Cartão Nacional de Saúde (Cartão SUS) atualizado;",
          "Número de telefone ativo para contato com o paciente;",
          "No caso de menores de idade: certidão de nascimento da criança acompanhada do documento de identidade do responsável legal."
        ]
      },
      {
        titulo: "Atenção Gestantes",
        paragrafo: "Além dos documentos citados, as gestantes deverão apresentar a Caderneta de Pré-Natal do SUS para garantir o atendimento prioritário e o encaminhamento para exames específicos do período gestacional."
      }
    ]
  },
  "doacao-de-sangue": {
    title: "Um Gesto de Solidariedade que Salva Vidas",
    desc: "A doação de sangue e de medula óssea é um ato voluntário que pode transformar e salvar vidas. Muitas pessoas enfrentam doenças graves e dependem de transfusões ou de um transplante de medula para sobreviver. Um simples ato de generosidade pode fazer toda a diferença para quem está lutando por um futuro.\n\nO processo de doação é seguro, rápido e traz esperança para aqueles que dependem dessa ajuda. Se você está dentro dos critérios de saúde, pode se tornar um doador e fazer parte dessa corrente de cuidado.",
    horario: "Toda quarta-feira, das 07h30 às 15h00",
    onde: "Posto Avançado de Coleta Externa (PACE) - Rua Dr. Ivan Américo / R. Menotti Porcaro, s/n – Centro, Muriaé (Prédio do antigo Viva a Vida).",
    secoesTexto: [
      {
        titulo: "Doação de Sangue",
        paragrafo: "Doar sangue é um gesto simples, voluntário e de extrema importância para a sociedade. Em poucos minutos, uma única doação pode salvar até quatro vidas, contribuindo para o tratamento de pacientes vítimas de acidentes, cirurgias, doenças crônicas, câncer, anemias graves e outras condições que dependem de transfusões sanguíneas."
      },
      {
        titulo: "Requisitos para Doação de Sangue",
        itens: [
          "Estar em excelentes condições gerais de saúde;",
          "Ter entre 16 e 69 anos (menores de 18 anos necessitam de autorização formal dos responsáveis);",
          "Apresentar peso corporal acima de 50 kg;",
          "Não estar em jejum absoluto;",
          "Evitar a ingestão de alimentos gordurosos nas 3 horas que antecedem a doação."
        ]
      },
      {
        titulo: "Documentação Necessária",
        paragrafo: "Documento de identidade oficial com foto e CPF."
      },
      {
        titulo: "Doação de Medula Óssea",
        paragrafo: "Como funciona o cadastro:\nO cadastro para doação de medula óssea é simples, seguro e rápido. No local de coleta, uma equipe de enfermagem realiza a retirada de uma pequena amostra de sangue (cerca de 5 ml) para identificar as características genéticas de histocompatibilidade (teste de HLA) do doador.\n\nEssas informações são inseridas com total segurança no Registro Nacional de Doadores de Medula Óssea (REDOME) e cruzadas continuamente com os dados de pacientes que necessitam do transplante. Havendo compatibilidade futura com algum paciente, o doador é imediatamente contatado para dar continuidade ao processo."
      },
      {
        titulo: "Requisitos para Doação de Medula Óssea",
        paragrafo: "Pessoas saudáveis entre 18 e 35 anos podem se cadastrar como doadoras de medula óssea, desde que não apresentem histórico de doenças infecciosas transmissíveis ou patologias hematológicas."
      }
    ]
  },
  "vacina": {
    title: "Vacina",
    desc: "A vacinação é uma das estratégias mais eficazes para proteger a saúde da população e promover uma sociedade mais segura e saudável. Além de prevenir doenças graves, contribui para a redução da circulação de vírus e bactérias, protegendo especialmente as pessoas mais vulneráveis.",
    requisitos: "Apresentar documento de identificação e, preferencialmente, o cartão de vacina.",
    documentos: [
      "Documento de identidade oficial com foto (RG, CNH) ou Certidão de Nascimento (para crianças).",
      "Cartão Nacional de Saúde (CNS) ou CPF.",
      "Caderneta/Cartão de Vacinação atual (se possuir)."
    ],
    onde: "Salas de vacina das Unidades Básicas de Saúde (UBS) e pontos estratégicos durante campanhas.",
    horario: "Segunda a sexta-feira, das 08h às 16h30 (pode variar conforme a unidade)."
  },
  "vigilancia-sanitaria": {
    title: "Fiscalização e Regulamentação Sanitária",
    desc: "A Vigilância Sanitária é responsável por orientar e fiscalizar estabelecimentos e serviços de saúde ou de interesse à saúde, garantindo segurança, conformidade com as normas vigentes e qualidade para toda a população de Muriaé. Aqui você encontra informações institucionais sobre licenciamento, renovação de alvará e outros serviços regulados.",
    horario: "Segunda a sexta-feira, das 7h às 11h e das 13h às 16h",
    onde: "Rua Sinval Florêncio da Silva, nº 02, 2º andar – Centro (Prédio do SENAI, próximo ao Mercado Municipal) | Telefone: (32) 2020-8105",
    secoesTexto: [
      {
        titulo: "Solicitar Mudança de Responsável Técnico",
        paragrafo: "Os estabelecimentos regulados que necessitam alterar o profissional responsável técnico (RT) devem formalizar a solicitação presencialmente no setor da Vigilância. A equipe técnica do município irá fornecer o checklist de documentos e orientar todo o procedimento cabível no próprio local."
      },
      {
        titulo: "Denúncias Sanitárias",
        paragrafo: "As denúncias sanitárias não são processadas diretamente no balcão técnico. Elas devem ser protocoladas e recebidas exclusivamente pela Ouvidoria do SUS e pela Ouvidoria Municipal para triagem legal.\n\nCaso presencie irregularidades em estabelecimentos comerciais ou de saúde, utilize os contatos oficiais de ouvidoria listados abaixo:",
        itens: [
          "Ouvidoria do SUS Regional: (32) 3696-3318;",
          "Ouvidoria Municipal Geral: Telefone 136, dígito 9;",
          "Atendimento presencial da Ouvidoria: Secretaria Municipal de Saúde. Avenida Maestro Sansão, 236 - Centro. Segunda a sexta-feira, das 7h30 às 11h e das 13h às 16h30;",
          "Canal digital via E-mail: ouvidoriasaudemuriae@hotmail.com"
        ]
      }
    ]
  },
};

const tiposVacinas = [
  {
    id: 1,
    titulo: "Vacinação de Rotina (Caderneta)",
    desc: "Atualização sistemática do esquema vacinal conforme as orientações do Calendário Nacional de Vacinação para todas as faixas etárias.",
    proceder: "Comparecer a uma UBS com a caderneta de vacinação para avaliação e aplicação das doses pendentes.",
    locais: "Todas as Unidades Básicas de Saúde (UBS) do município.",
    docs: "Documento pessoal, Cartão SUS e Caderneta de Vacinação."
  },
  {
    id: 2,
    titulo: "Vacina Antirrábica",
    desc: "Imunização voltada para a prevenção da raiva humana, indicada para pessoas que sofreram exposição ou potencial risco de infecção por animais transmissores.",
    proceder: "Em caso de agressão por animal, lavar ferimento com água e sabão e procurar atendimento médico imediatamente para avaliação da necessidade da vacina ou soro.",
    locais: "UBS Safira, UBS São Francisco, Hospital Municipal e UPA.",
    docs: "Documento de identificação, Cartão SUS e Guia de atendimento médico/notificação de acidente por animal."
  },
  {
    id: 3,
    titulo: "Vacinação contra Covid-19",
    desc: "Campanha contínua de imunização contra o coronavírus, seguindo os critérios de faixas etárias, grupos prioritários e doses de reforço vigentes.",
    proceder: "Acompanhar o cronograma de grupos convocados e comparecer ao local de aplicação portando os documentos exigidos.",
    locais: "Central de Vacinação (Antigo PAM) e Unidades de Saúde polos divulgadas semanalmente.",
    docs: "Documento com foto, CPF, Cartão SUS e comprovante de doses anteriores."
  },
  {
    id: 4,
    titulo: "Vacina contra Dengue",
    desc: "Vacinação focada na redução das hospitalizações e óbitos decorrentes da infecção pelos vírus da dengue.",
    proceder: "Público-alvo atual deve comparecer aos locais indicados. Atenção: Vacina contraindicada para gestantes, lactantes e imunossuprimidos.",
    locais: "Salas de vacinação selecionadas nas UBS centrais e distritais.",
    docs: "Documento de identificação da criança/adolescente, CPF e presença dos pais ou responsável.",
    alerta: "Faixa Etária: Destinada a crianças e adolescentes de 10 a 14 anos."
  }
];

export default function ServiceDetailPage() {
  const params = useParams();
  const id = params?.id;

  const [activeTab, setActiveTab] = useState('campanhas');
  const [appAtivo, setAppAtivo] = useState('saude-digital'); // Estado para alternar entre os 2 Apps

  const servico = dbServicos[id];
  const isVacinacao = id === "vacinacao" || id === "vacina";
  const isAplicativos = id === "aplicativos" || id === "aplicativo" || id === "app";

 if (!servico) {
    return (
      <main className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.infoBlock}>
            <h2 style={{ color: '#003b5c', margin: '0 0 10px 0' }}>Serviço não encontrado</h2>
            <p style={{ color: '#475569', margin: 0 }}>O serviço solicitado não existe ou está sendo migrado.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      
      {/* BANNER 100% LARGURA */}
      <section className={styles.heroBanner}>
        <div className={styles.overlay}>
          <div className={styles.container}>
            <span className={styles.heroSubtitle}>CARTA DE SERVIÇOS</span>
            <h1 className={styles.heroTitle}>{servico.title}</h1>
          </div>
        </div>
      </section>

      {/* BARRA DE NAVEGAÇÃO SUPERIOR */}
      <div className={styles.navigationBar}>
        <div className={styles.container}>
          <Link href="/servicos" className={styles.backLink}>
            ← Voltar para Serviços
          </Link>
        </div>
      </div>

      {/* ÁREA DE CONTEÚDO PRINCIPAL */}
      <main className={styles.mainContent}>
        <div className={styles.container}>
          
          {/* ==========================================================
             --- CENÁRIO 1: PAINEL DE APLICATIVOS (SAÚDE DIGITAL / MEU SUS) --- 
             ========================================================== */}
          {isAplicativos ? (
            <div style={{ width: '100%' }}>
              <div className={styles.infoBlock}>
                <h3><span className={styles.blockIcon}>📱</span> Sobre os Aplicativos</h3>
                <p>{servico.desc}</p>
              </div>

              {/* ABAS SELETORAS DE APLICATIVOS */}
              <div className={styles.tabHeader}>
                <button 
                  className={`${styles.tabButton} ${appAtivo === 'saude-digital' ? styles.tabButtonActive : ''}`}
                  onClick={() => setAppAtivo('saude-digital')}
                >
                  🏥 Saúde Digital Muriaé
                </button>
                <button 
                  className={`${styles.tabButton} ${appAtivo === 'meu-sus-digital' ? styles.tabButtonActive : ''}`}
                  onClick={() => setAppAtivo('meu-sus-digital')}
                >
                  🇧🇷 Meu SUS Digital
                </button>
              </div>

              {/* CONTEÚDO DO APP SELECIONADO */}
              {servico.apps && servico.apps[appAtivo] && (
                <div>
                  <div className={styles.infoBlock}>
                    <h3><span className={styles.blockIcon}>ℹ️</span> {servico.apps[appAtivo].nome}</h3>
                    <p style={{ fontWeight: '600', color: '#008a83', marginBottom: '8px' }}>
                      {servico.apps[appAtivo].subtitulo}
                    </p>
                    {servico.apps[appAtivo].desc.split('\n\n').map((paragrafo, idx) => (
                      <p key={idx} style={{ marginBottom: '8px' }}>{paragrafo}</p>
                    ))}
                  </div>

                  <div className={styles.infoBlock}>
                    <h3><span className={styles.blockIcon}>⚡</span> Funcionalidades</h3>
                    <ul className={styles.docList}>
                      {servico.apps[appAtivo].funcionalidades.map((func, idx) => (
                        <li key={idx} style={{ marginBottom: '8px' }}>{func}</li>
                      ))}
                    </ul>
                  </div>

                  {servico.apps[appAtivo].comoAcessar && (
                    <div className={styles.infoBlock}>
                      <h3><span className={styles.blockIcon}>🔐</span> Como acessar</h3>
                      <p>{servico.apps[appAtivo].comoAcessar}</p>
                    </div>
                  )}

                  {/* SEÇÃO DE DOWNLOAD DO APP UTILIZANDO AS CLASSES DO CSS MODULE */}
                  <div className={styles.infoBlock} style={{ borderLeft: '4px solid #008a83', backgroundColor: '#f8fafc' }}>
                    <h3 style={{ marginBottom: '8px' }}>
                      <span className={styles.blockIcon}>📲</span> Baixe o {servico.apps[appAtivo].nome}
                    </h3>
                    <p style={{ color: '#475569', marginBottom: '20px', fontSize: '14.5px' }}>
                      Disponível gratuitamente para dispositivos iOS e Android.
                    </p>

                    <div className={styles.downloadContainer}>
                      {/* BOTÃO APP STORE */}
                      <a 
                        href={servico.apps[appAtivo].linksDownload.appStore} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.btnAppStore}
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.66-.8 1.11-1.92.99-3.04-.96.04-2.12.64-2.8 1.44-.61.71-1.14 1.86-.99 2.97 1.07.08 2.14-.57 2.8-1.37z"/>
                        </svg>
                        App Store
                      </a>

                      {/* BOTÃO GOOGLE PLAY */}
                      <a 
                        href={servico.apps[appAtivo].linksDownload.googlePlay} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.btnGooglePlay}
                      >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                        </svg>
                        Google Play
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : isVacinacao ? (
            /* ==========================================================
               --- CENÁRIO 2: PAINEL INTERATIVO DE VACINAÇÃO --- 
               ========================================================== */
            <div style={{ width: '100%' }}>
              <div className={styles.infoBlock}>
                <h3>
                  <span className={styles.blockIcon}>ℹ️</span> 
                  Programa Nacional de Imunizações (PNI)
                </h3>
                {servico.desc.split('\n\n').map((paragrafo, idx) => (
                  <p key={idx} style={{ marginBottom: idx === 0 ? '16px' : '0' }}>
                    {paragrafo}
                  </p>
                ))}
              </div>

              <div className={styles.tabHeader}>
                <button 
                  className={`${styles.tabButton} ${activeTab === 'campanhas' ? styles.tabButtonActive : ''}`}
                  onClick={() => setActiveTab('campanhas')}
                >
                  📢 Campanhas & Tipos de Vacina
                </button>
                
                <a 
                  href="/calendario-vacinal" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.tabButton}
                  style={{ textDecoration: 'none' }}
                >
                  📅 Linha do Tempo / Calendário Vacinal ↗
                </a>
              </div>

              {activeTab === 'campanhas' && (
                <div className={styles.vacinacaoGrid}>
                  {tiposVacinas.map((vacina) => (
                    <div key={vacina.id} className={styles.vacinaCard}>
                      <h4 className={styles.vacinaCardTitle}>{vacina.titulo}</h4>
                      <p className={styles.vacinaCardDesc}>{vacina.desc}</p>
                      
                      <div className={styles.vacinaSection}>
                        <strong>Como Proceder:</strong>
                        <p>{vacina.proceder}</p>
                      </div>
                      <div className={styles.vacinaSection}>
                        <strong>Locais de Atendimento:</strong>
                        <p>{vacina.locais}</p>
                      </div>
                      <div className={styles.vacinaSection}>
                        <strong>Documentação Exigida:</strong>
                        <p>{vacina.docs}</p>
                      </div>

                      {vacina.alerta && (
                        <div className={styles.vacinaAlerta}>
                          <p>{vacina.alerta}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* ==========================================================
               --- CENÁRIO 3: LAYOUT PADRÃO OU INSTITUCIONAL --- 
               ========================================================== */
            <div className={styles.infoLayout}>
              <div>
                {/* DESCRIÇÃO PRINCIPAL */}
                <div className={styles.infoBlock}>
                  <h3><span className={styles.blockIcon}>ℹ️</span> Sobre o Serviço</h3>
                  {servico.desc.split('\n\n').map((paragrafo, idx) => (
                    <p key={idx} style={{ marginBottom: idx === 0 ? '12px' : '0' }}>
                      {paragrafo}
                    </p>
                  ))}
                </div>

                {/* RENDERS ESPECÍFICOS DE SEÇÕES TEXTUAIS */}
                {servico.secoesTexto && servico.secoesTexto.map((secao, idx) => (
                  <div key={idx} className={styles.infoBlock}>
                    <h3><span className={styles.blockIcon}>📌</span> {secao.titulo}</h3>
                    
                    {secao.paragrafo && secao.paragrafo.split('\n\n').map((p, pIdx) => (
                      <p key={pIdx} style={{ marginBottom: '8px' }}>{p}</p>
                    ))}

                    {secao.itens && secao.itens.length > 0 && (
                      <ul className={styles.docList}>
                        {secao.itens.map((item, iIdx) => (
                          <li key={iIdx} style={{ marginBottom: '10px' }}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}

                {/* REQUISITOS (SÓ SE EXISTIR) */}
                {servico.requisitos && (
                  <div className={styles.infoBlock}>
                    <h3><span className={styles.blockIcon}>📝</span> Requisitos de Acesso</h3>
                    <p>{servico.requisitos}</p>
                  </div>
                )}

                {/* PASSO A PASSO (SÓ SE EXISTIR) */}
                {servico.passoAPasso && servico.passoAPasso.length > 0 && (
                  <div className={styles.infoBlock}>
                    <h3><span className={styles.blockIcon}>🔄</span> Como Solicitar / Etapas</h3>
                    <ol className={styles.docList} style={{ listStyleType: 'decimal' }}>
                      {servico.passoAPasso.map((passo, idx) => (
                        <li key={idx} style={{ marginBottom: '4px' }}>{passo}</li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* DOCUMENTOS (SÓ SE EXISTIR) */}
                {servico.documentos && servico.documentos.length > 0 && (
                  <div className={styles.infoBlock}>
                    <h3><span className={styles.blockIcon}>📂</span> Documentação Exigida</h3>
                    <ul className={styles.docList}>
                      {servico.documentos.map((doc, idx) => (
                        <li key={idx}>{doc}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* NOTAS E COMUNICAÇÕES DE RODAPÉ */}
                {servico.comunicacao && (
                  <div className={styles.infoBlock} style={{ borderLeft: '4px solid #005c8a', backgroundColor: '#f1f5f9' }}>
                    <p style={{ fontStyle: 'italic', color: '#1e293b', margin: 0 }}>{servico.comunicacao}</p>
                  </div>
                )}
              </div>

              {/* SIDEBAR LATERAL COM ONDE ENCONTRAR E HORÁRIO */}
              {(servico.onde || servico.horario) && (
                <aside className={styles.stickyWidget}>
                  {servico.onde && (
                    <div className={styles.widgetItem}>
                      <div className={styles.widgetHeader}>
                        <span className={styles.widgetIcon}>📍</span>
                        <h4>Onde Encontrar</h4>
                      </div>
                      <p>{servico.onde}</p>
                    </div>
                  )}
                  {servico.horario && (
                    <div className={styles.widgetItem}>
                      <div className={styles.widgetHeader}>
                        <span className={styles.widgetIcon}>⏰</span>
                        <h4>Horário de Funcionamento</h4>
                      </div>
                      <p>{servico.horario}</p>
                    </div>
                  )}
                </aside>
              )}

            </div>
          )}
          {/* BLOCO DE DESTAQUE PARA ADOÇÃO DE ANIMAIS */}
          <div className={styles.adocaoBanner}>
            <div className={styles.adocaoContent}>
              <span className={styles.adocaoBadge}>🐶🐱 Posse Responsável</span>
              <h2>Adote um Amigo!</h2>
              <p>
                O CCZ disponibiliza cães e gatos para adoção de forma totalmente responsável. Ao adotar, você oferece uma nova chance de vida digna para um animal e contribui diretamente para o controle populacional e bem-estar da nossa comunidade. Venha conhecer nossos animais protegidos e encontre seu novo companheiro de vida!
              </p>
              <Link href="/adocao" className={styles.btnAdocao}>
                🐾 Conhecer Animais para Adoção →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}