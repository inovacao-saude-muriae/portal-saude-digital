import { 
  Smartphone, 
  Home, 
  ClipboardList, 
  Dog, 
  Droplets, 
  Pill, 
  FlaskConical, 
  Syringe, 
  ShieldCheck,
  Ambulance
} from 'lucide-react';

/* ==========================================================================
   1. ARRAY PARA A LISTAGEM / PÁGINA INICIAL DE SERVIÇOS
   ========================================================================== */
export const servicos = [
  {
    id: 'aplicativos',
    title: 'Aplicativos da Saúde',
    desc: 'Acesso rápido aos serviços digitais de saúde na palma da sua mão.',
    icon: <Smartphone size={24} />
  },
  {
    id: 'atendimento-domiciliar',
    title: 'Atendimento Domiciliar',
    desc: 'Cuidado em saúde diretamente no aconchego do seu lar para acamados ou com mobilidade reduzida.',
    icon: <Home size={24} />
  },
  {
    id: 'camara-tecnica',
    title: 'Câmara Técnica',
    desc: 'Avaliação especializada para apoio às decisões em tratamentos e medicamentos.',
    icon: <ClipboardList size={24} />
  },
  {
    id: 'ccz',
    title: 'Centro de Controle de Zoonoses',
    desc: 'Prevenção, vigilância e controle de doenças transmissíveis por animais.',
    icon: <Dog size={24} />
  },
  {
    id: 'doacao-de-sangue',
    title: 'Doação de Sangue e Medula',
    desc: 'Saiba onde e como doar sangue e cadastrar-se para doação de medula óssea.',
    icon: <Droplets size={24} />
  },
  {
    id: 'farmacia-municipal',
    title: 'Farmácia Municipal',
    desc: 'Fornecimento gratuito de medicamentos essenciais e especializados.',
    icon: <Pill size={24} />
  },
  {
    id: 'fluxos-assistenciais',
    title: 'Fluxos Assistenciais',
    desc: 'Diretrizes, itinerários terapêuticos e pactuações para exames, procedimentos e cirurgias.',
    icon: <Ambulance size={24} />
  },
  {
    id: 'laboratorio-municipal',
    title: 'Laboratório Municipal',
    desc: 'Exames laboratoriais gratuitos com precisão e agilidade.',
    icon: <FlaskConical size={24} />
  },
  {
    id: 'vacina',
    title: 'Vacina',
    desc: 'Imunização para todas as faixas etárias segundo o calendário oficial.',
    icon: <Syringe size={24} />
  },
  {
    id: 'vigilancia-sanitaria',
    title: 'Vigilância Sanitária',
    desc: 'Fiscalização e orientação para segurança alimentar, ambiental e sanitária.',
    icon: <ShieldCheck size={24} />
  }
];

/* ==========================================================================
   2. OBJETO COMPLETO COM DETALHES DE TODOS OS SERVIÇOS DO MUNICÍPIO
   ========================================================================== */
export const dbServicos = {
  // --- 1. FLUXOS ASSISTENCIAIS ---
  "fluxos-assistenciais": {
    title: "Fluxos Assistenciais e Pactuações",
    desc: "Consulte as diretrizes, itinerários terapêuticos e mapas de pactuação para exames, procedimentos e cirurgias do SUS em Muriaé.",
    fluxosData: [
      {
        id: 'cardiologia',
        titulo: 'Cardiologia',
        submodulos: [
          {
            id: 'angioplastia',
            titulo: 'Angioplastia',
            texto: `A angioplastia é um procedimento que os médicos fazem para “desentupir” as artérias, que são os “caminhos” por onde o sangue passa no nosso corpo. Quando essas artérias ficam estreitas ou entupidas, o sangue não consegue passar direito, o que pode causar dor no peito, falta de ar ou até infarto, se for no coração.\n\nDurante a angioplastia, o médico coloca um cateter com um balão na ponta dentro da artéria entupida. Esse balão é inflado para abrir a passagem e deixar o sangue circular melhor. Muitas vezes, também é colocado uma pequena “molinha” de metal, chamado Stent, que ajuda a manter a artéria aberta.\n\nÉ um procedimento muito importante e seguro, feito em hospital, que ajuda a cuidar bem do coração, mas é muito importante seguir todas as orientações antes do procedimento. Lembrando que a Angioplastia pode ser realizada tanto no Hospital São Paulo quanto no Prontocor, hospitais habilitados pelo Ministério da Saúde para realização do tratamento pelo SUS.`,
            imagens: [
              { src: '/img/fluxos-assistenciais/cardiologia/angioplastia/fluxo.png', alt: 'Fluxo Angioplastia' },
              { src: '/img/fluxos-assistenciais/cardiologia/angioplastia/pactuacao-endovascular.png', alt: 'Pactuação Endovascular' },
              { src: '/img/fluxos-assistenciais/cardiologia/angioplastia/pactuacao-intervencionista.png', alt: 'Pactuação Intervencionista' }
            ]
          },
          {
            id: 'cateterismo',
            titulo: 'Cateterismo',
            texto: `O cateterismo cardíaco é um exame que os médicos usam para ver se as veias do coração (chamadas artérias coronárias) estão entupidas ou com algum outro tipo de problema.\n\nNo exame, o médico coloca um tubo bem fininho (chamado cateter) dentro da artéria e injeta um líquido de contraste que aparece nas imagens do raio-X. O procedimento é realizado pelo SUS tanto no Hospital São Paulo quanto no Prontocor.`,
            imagens: [
              { src: '/img/fluxos-assistenciais/cardiologia/cateterismo/fluxo.png', alt: 'Fluxo Cateterismo' },
              { src: '/img/fluxos-assistenciais/cardiologia/cateterismo/pactuacao.png', alt: 'Pactuação Cateterismo' }
            ]
          },
          {
            id: 'cirurgia-cardiaca',
            titulo: 'Cirurgia Cardíaca',
            texto: `A cirurgia cardíaca é feita para tratar problemas no coração, principalmente quando as artérias estão entupidas (ponte de safena) ou para a troca de válvulas. Para agendar pelo SUS, primeiro realiza-se a consulta com o cirurgião. Com a indicação confirmada, procure a Secretaria de Saúde do município para cadastrar a solicitação.`,
            imagens: [
              { src: '/img/fluxos-assistenciais/cardiologia/cirurgia/fluxo1.png', alt: 'Fluxo Cirurgia Cardíaca' },
              { src: '/img/fluxos-assistenciais/cardiologia/cirurgia/pactuacao.png', alt: 'Pactuação Cirurgia Cardíaca' }
            ]
          },
          {
            id: 'eletrofisiologia',
            titulo: 'Eletrofisiologia',
            texto: `Exames e tratamentos para investigar e tratar os batimentos do coração (arritmias), ablação e implante de marcapasso. Em Muriaé os atendimentos são realizados no Prontocor.`,
            imagens: [
              { src: '/img/fluxos-assistenciais/cardiologia/eletrofisiologia/fluxo.png', alt: 'Fluxo Eletrofisiologia' },
              { src: '/img/fluxos-assistenciais/cardiologia/eletrofisiologia/pactuacao.png', alt: 'Pactuação Eletrofisiologia' }
            ]
          }
        ]
      },
      {
        id: 'cintilografia',
        titulo: 'Cintilografia',
        submodulos: [
          {
            id: 'cintilografia-geral',
            titulo: 'Exames de imagem de Alta Complexidade',
            texto: `Exames de imagem avançados como tomografia computadorizada (TC), ressonância magnética nuclear (RNM) e cintilografia pelo SUS. É imprescindível que o pedido esteja no formulário APAC devidamente preenchido.`,
            imagens: [
              { src: '/img/fluxos-assistenciais/cintilografia/fluxo.png', alt: 'Fluxo Cintilografia' },
              { src: '/img/fluxos-assistenciais/cintilografia/pactuacao.png', alt: 'Pactuação Cintilografia' }
            ]
          }
        ]
      },
      {
        id: 'cirurgia-geral',
        titulo: 'Cirurgia Geral',
        submodulos: [
          {
            id: 'cirurgia-geral-sub',
            titulo: 'Cuidado e Compromisso com a Saúde',
            texto: `Cirurgias gerais como hérnia, vesícula biliar e remoção de cistos pelo programa Opera Já Muriaé. Consultas pré-operatórias devem ser agendadas na Secretaria Municipal de Saúde ou via CISLESTE para outros municípios pactuados.`,
            imagens: [
              { src: '/img/fluxos-assistenciais/cirurgia-geral/fluxo.png', alt: 'Fluxo Cirurgia Geral' },
              { src: '/img/fluxos-assistenciais/cirurgia-geral/pactuacao.png', alt: 'Pactuação Cirurgia Geral' }
            ]
          }
        ]
      },
      {
        id: 'cirurgia-vascular',
        titulo: 'Cirurgia Vascular',
        submodulos: [
          {
            id: 'aparelho-circulatorio',
            titulo: 'Aparelho Circulatório',
            texto: `Procedimentos endovasculares e angioplastias periféricas para desobstrução de artérias nas pernas e pescoço. Atendimento de hemodinâmica no Hospital São Paulo.`,
            imagens: [
              { src: '/img/fluxos-assistenciais/cirurgia-vascular/aparelhoCirculatorio/fluxo.png', alt: 'Fluxo Aparelho Circulatório' },
              { src: '/img/fluxos-assistenciais/cirurgia-vascular/aparelhoCirculatorio/Pactuacao1.png', alt: 'Pactuação Aparelho Circulatório' }
            ]
          },
          {
            id: 'varizes',
            titulo: 'Varizes',
            texto: `Tratamento cirúrgico de varizes pelo SUS no Hospital São Paulo, com todo pré-operatório garantido pelo programa Opera Já Muriaé.`,
            imagens: [
              { src: '/img/fluxos-assistenciais/cirurgia-vascular/varizes/fluxo.png', alt: 'Fluxo Varizes' },
              { src: '/img/fluxos-assistenciais/cirurgia-vascular/varizes/pactuacao.png', alt: 'Pactuação Varizes' }
            ]
          }
        ]
      },
      {
        id: 'ginecologia',
        titulo: 'Ginecologia',
        submodulos: [
          {
            id: 'saude-da-mulher',
            titulo: 'Saúde da Mulher',
            texto: `Histerectomia, miomectomia, laqueadura tubária e demais tratamentos ginecológicos realizados no Hospital São Paulo com suporte completo de pré-operatório.`,
            imagens: [
              { src: '/img/fluxos-assistenciais/ginecologia/fluxo1.png', alt: 'Fluxo Cirurgias Ginecológicas' }
            ]
          },
          {
            id: 'exames-acompanhamento',
            titulo: 'Exames e Acompanhamentos',
            texto: `Prevenção do câncer de colo do útero (Papanicolau), mamografias, pré-natal e métodos contraceptivos disponíveis na rede municipal.`,
            imagens: [
              { src: '/img/fluxos-assistenciais/ginecologia/fluxo2.png', alt: 'Fluxo Exames e Acompanhamentos' }
            ]
          }
        ]
      },
      {
        id: 'oncologia',
        titulo: 'Oncologia',
        submodulos: [
          {
            id: 'oncologia-geral',
            titulo: 'Atendimento Oncológico',
            texto: `Linha de cuidado oncológico em parceria com a Fundação Cristiano Varella. Acolhimento inicial feito através da UBS de referência do bairro.`,
            imagens: [
              { src: '/img/fluxos-assistenciais/oncologia/fluxo.png', alt: 'Fluxo Oncologia' }
            ]
          }
        ]
      },
      {
        id: 'oftalmologia',
        titulo: 'Oftalmologia',
        submodulos: [
          {
            id: 'catarata-pterigio',
            titulo: 'Tratamento de Catarata e Pterígio',
            texto: `Cirurgias gratuitas de catarata e pterígio com acompanhamento completo pré e pós-operatório mediante solicitação de médico especialista.`,
            imagens: [
              { src: '/img/fluxos-assistenciais/oftalmologia/pactuacao.png', alt: 'Pactuação Oftalmologia' }
            ]
          }
        ]
      },
      {
        id: 'ortopedia',
        titulo: 'Ortopedia e Traumatologia',
        submodulos: [
          {
            id: 'media-complexidade',
            titulo: 'Média Complexidade',
            texto: `Atendimento a traumas e cirurgias ortopédicas eletivas de média complexidade pelo programa Opera Já Muriaé.`,
            imagens: [
              { src: '/img/fluxos-assistenciais/ortopedia-traumatologia/fluxo.png', alt: 'Fluxo Ortopedia Média Complexidade' },
              { src: '/img/fluxos-assistenciais/ortopedia-traumatologia/pactuacao.png', alt: 'Pactuação Ortopedia Média Complexidade' }
            ]
          },
          {
            id: 'alta-complexidade',
            titulo: 'Alta Complexidade',
            texto: `Tratamento para fraturas graves, coluna e articulações. Urgências são acolhidas no pronto-socorro e os casos eletivos pela Secretaria de Saúde.`,
            imagens: [
              { src: '/img/fluxos-assistenciais/ortopedia-traumatologia/fluxo.png', alt: 'Fluxo Ortopedia Alta Complexidade' },
              { src: '/img/fluxos-assistenciais/ortopedia-traumatologia/pactuacao.png', alt: 'Pactuação Ortopedia Alta Complexidade' }
            ]
          }
        ]
      },
      {
        id: 'ressonancia',
        titulo: 'Ressonância Magnética',
        submodulos: [
          {
            id: 'ressonancia-geral',
            titulo: 'Exames de imagem de alta complexidade',
            texto: `Agendamento e autorização de Ressonância Magnética Nuclear via formulário APAC devidamente preenchido pelo médico requisitante.`,
            imagens: [
              { src: '/img/fluxos-assistenciais/ressonancia/fluxo.png', alt: 'Fluxo Ressonância Magnética' },
              { src: '/img/fluxos-assistenciais/ressonancia/pactuacao.png', alt: 'Pactuação Ressonância Magnética' }
            ]
          }
        ]
      },
      {
        id: 'tomografia',
        titulo: 'Tomografia',
        submodulos: [
          {
            id: 'tomografia-geral',
            titulo: 'Exames de Alta Complexidade',
            texto: `Tomografia Computadorizada (TC) disponibilizada pelo SUS. Encaminhamento rápido mediante validação do laudo e formulário APAC.`,
            imagens: [
              { src: '/img/fluxos-assistenciais/tomografia/fluxo.png', alt: 'Fluxo Tomografia' },
              { src: '/img/fluxos-assistenciais/tomografia/pactuacao.png', alt: 'Pactuação Tomografia' }
            ]
          }
        ]
      },
      {
        id: 'urologia',
        titulo: 'Urologia',
        submodulos: [
          {
            id: 'urologia-geral',
            titulo: 'Cálculo Renal',
            texto: `Cirurgia a laser para retirada de pedras nos rins realizada no Prontocor em regime eletivo. Atendimento de urgência urológica no Hospital São Paulo.`,
            imagens: [
              { src: '/img/fluxos-assistenciais/urologia/fluxo.png', alt: 'Fluxo Urologia' },
              { src: '/img/fluxos-assistenciais/urologia/pactuacao.png', alt: 'Pactuação Urologia' }
            ]
          }
        ]
      }
    ]
  },

  // --- 2. CÂMARA TÉCNICA ---
  "camara-tecnica": {
    title: "Câmara Técnica de Saúde",
    desc: "A Câmara Técnica é um grupo formado por profissionais de saúde especializados que analisam solicitações de procedimentos, cirurgias e medicamentos de alta complexidade ou fora do rol habitual do SUS, garantindo decisões transparentes e fundamentadas em evidências científicas.",
    horario: "Segunda a Sexta-feira, das 07h30 às 11h30 e das 13h00 às 17h00",
    onde: "Secretaria Municipal de Saúde / Setor de Regulação - Muriaé/MG",
    secoesTexto: [
      {
        titulo: "Atribuições da Câmara Técnica",
        paragrafo: "Análise minuciosa de laudos médicos para concessão de medicamentos especiais e avaliação técnica para encaminhamentos de média e alta complexidade."
      }
    ],
    documentos: [
      "Laudo médico detalhado emitido por profissional do SUS",
      "Formulário LME (Laudo para Solicitação de Medicamentos) preenchido",
      "Documento de identificação (RG/CPF) e Cartão SUS",
      "Comprovante de residência atualizado no município"
    ],
    passoAPasso: [
      "Compareça à sua UBS de referência com a solicitação médica;",
      "O pedido será protocolo e enviado para a análise da Câmara Técnica;",
      "Acompanhe o andamento pelo aplicativo Saúde Digital Muriaé ou na própria UBS."
    ]
  },

  // --- 3. DOAÇÃO DE SANGUE E MEDULA ---
  "doacao-de-sangue": {
    title: "Doação de Sangue e Medula Óssea",
    desc: "A doação de sangue é um ato voluntário e altruísta que salva vidas. Muriaé conta com o Posto Avançado de Coleta Externa (PACE Hemominas), permitindo que os moradores doem sangue sem precisar se deslocar para outras cidades.",
    horario: "Toda quarta-feira, das 07h30 às 15h00 (Mediante agendamento)",
    onde: "PACE Hemominas - Rua Dr. Ivan Américo, s/n - Centro, Muriaé/MG",
    requisitos: "Ter entre 16 e 69 anos; Estar em bom estado de saúde; Pesar no mínimo 50kg; Ter dormido pelo menos 6 horas na noite anterior; Não estar em jejum.",
    documentos: [
      "Documento oficial com foto (RG, CNH ou Carteira de Trabalho)",
      "CPF"
    ],
    passoAPasso: [
      "Agende seu horário previamente pelo aplicativo ou telefone do PACE;",
      "Compareça no dia agendado alimentado e munido de documento oficial;",
      "Passe pela triagem clínica e realize a doação com total segurança."
    ]
  },

  // --- 4. FARMÁCIA MUNICIPAL ---
  "farmacia-municipal": {
    title: "Farmácia Municipal",
    desc: "A Assistência Farmacêutica de Muriaé assegura o acesso gratuito a medicamentos essenciais da Atenção Básica (REMUME), além de intermediar o fornecimento de medicamentos de Alto Custo mantidos pelo Governo do Estado.",
    horario: "Atendimento Geral: Segunda a Sexta, das 07h00 às 17h00 | Alto Custo: 07h00 às 15h00",
    onde: "Farmácia Central (Rua Coronel Izalino, Centro) e Unidades Básicas de Saúde (UBS)",
    documentos: [
      "Receita médica original emitida pelo SUS e dentro da validade",
      "Cartão do SUS do paciente atualizado",
      "Documento de identificação do paciente e do morador que for retirar"
    ],
    passoAPasso: [
      "Apresente a receita médica válida emitida por profissional de saúde do SUS;",
      "Apresente o Cartão do SUS e documento oficial na farmácia;",
      "Retire o medicamento orientado sobre a dosagem e conservação."
    ]
  },

  // --- 5. LABORATÓRIO MUNICIPAL ---
  "laboratorio-municipal": {
    title: "Laboratório Municipal de Análises Clínicas",
    desc: "O Laboratório Municipal de Muriaé realiza exames laboratoriais essenciais para apoio diagnóstico, garantindo agilidade, precisão e gratuidade nos resultados para os usuários da rede pública.",
    horario: "Coleta: Segunda a Sexta, das 06h30 às 09h30 | Entrega de Resultados: 12h00 às 17h00",
    onde: "Rua Coronel Izalino, s/n - Centro, Muriaé/MG | Telefone: (32) 3720-8074",
    documentos: [
      "Pedido médico assinado e carimbado por profissional do SUS",
      "Cartão do SUS atualizado",
      "Documento de identificação oficial com foto"
    ],
    passoAPasso: [
      "Agende a coleta na recepção do laboratório ou na sua UBS de referência;",
      "Siga o preparo orientado (tempo de jejum, restrições alimentares);",
      "Retire os resultados no prazo informado ou consulte pela plataforma digital."
    ]
  },

  // --- 6. VIGILÂNCIA SANITÁRIA ---
  "vigilancia-sanitaria": {
    title: "Vigilância Sanitária (VISA)",
    desc: "A Vigilância Sanitária atua na prevenção de riscos à saúde da população por meio de orientação, fiscalização e licenciamento de estabelecimentos comerciais, de alimentação, serviços de saúde e indústrias.",
    horario: "Segunda a Sexta-feira, das 07h00 às 11h00 e das 13h00 às 16h00",
    onde: "Rua Sinval Florêncio da Silva, nº 02, 2º andar – Centro, Muriaé/MG",
    secoesTexto: [
      {
        titulo: "Serviços Oferecidos",
        paragrafo: "Emissão e renovação de Alvará Sanitário, fiscalização de denúncias de irregularidades, receitas de medicamentos controlados (notificação A e B) e orientação para adequação de comércios."
      }
    ],
    documentos: [
      "Requerimento de Licenciamento Sanitário preenchido",
      "CNPJ e Contrato Social da empresa",
      "Taxa de fiscalização quitada"
    ]
  },

  // --- 7. ATENDIMENTO DOMICILIAR (SAD) ---
  "atendimento-domiciliar": {
    title: "Serviço de Atendimento Domiciliar (SAD)",
    desc: "O Serviço de Atendimento Domiciliar destina-se a pessoas acamadas ou com mobilidade reduzida que necessitam de cuidados de saúde contínuos, realizados por equipe multiprofissional no conforto da própria residência.",
    horario: "Segunda a Sexta-feira, das 07h00 às 17h00",
    onde: "Atendimento prestado diretamente no domicílio do paciente cadastrado.",
    requisitos: "Residir no município de Muriaé; Estar acamado ou impossibilitado de deslocamento até a UBS; Necessitar de cuidados temporários ou reabilitação.",
    documentos: [
      "CPF, RG e Cartão do SUS atualizado do paciente",
      "Comprovante de residência atualizado",
      "Relatório médico comprovando a necessidade do atendimento domiciliar"
    ],
    passoAPasso: [
      "O familiar deve procurar a UBS do bairro e solicitar a avaliação para o SAD;",
      "A equipe realizará uma visita prévia para validação dos critérios de elegibilidade;",
      "Aprovado, o paciente passa a receber acompanhamento médico e de enfermagem em casa."
    ]
  },

  // --- 8. CENTRO DE CONTROLE DE ZOONOSES (CCZ) ---
  "ccz": {
    title: "Centro de Controle de Zoonoses (CCZ)",
    desc: "O CCZ desenvolve ações de vigilância e controle de zoonoses (doenças transmissíveis entre animais e seres humanos, como raiva, leishmaniose e febre maculosa), vacinação antirrábica animal e acolhimento para adoção responsável.",
    horario: "Segunda a Sexta-feira, das 07h00 às 16h00",
    onde: "BR-356, sentido Muriaé–Ervália, Muriaé/MG",
    secoesTexto: [
      {
        titulo: "Principais Atividades",
        paragrafo: "Campanha anual e contínua de vacinação antirrábica para cães e gatos, recolhimento de animais de rua doentes/agressivos e programa de adoção de animais resgatados."
      }
    ]
  },

  // --- 9. APLICATIVOS DA SAÚDE ---
  "aplicativos": {
    title: "Aplicativos Digitais de Saúde",
    desc: "Acesse os serviços digitais de saúde na palma da sua mão. Escolha abaixo qual aplicativo você deseja conhecer e utilizar para acompanhar seus atendimentos, histórico de saúde e agendamentos.",
    apps: {
      "saude-digital": {
        nome: "Saúde Digital Muriaé",
        subtitulo: "A nova plataforma oficial de saúde do município de Muriaé",
        desc: "Lançado pela Prefeitura Municipal de Muriaé para ampliar o acesso e a transparência. Permite consultar agendamentos de consultas, posição na fila de exames e históricos de atendimento.",
        funcionalidades: [
          "Acompanhamento de consultas agendadas (data, horário, local e profissional);",
          "Confirmação digital de presença em consultas e exames;",
          "Consulta da posição atualizada na fila de espera para procedimentos;",
          "Lista completa e telefones das Unidades Básicas de Saúde e Hospitais."
        ],
        comoAcessar: "Cadastre-se na sua UBS de referência com CPF para receber o código de acesso.",
        linksDownload: {
          appStore: "https://apps.apple.com/br/app/vivver-sa%C3%BAde-cidad%C3%A3o/id6466105436",
          googlePlay: "https://play.google.com/store/apps/details?id=io.vivver.cidadao.app"
        }
      },
      "meu-sus-digital": {
        nome: "Meu SUS Digital",
        subtitulo: "A plataforma oficial do Ministério da Saúde",
        desc: "O aplicativo unificado do Governo Federal para acessar a Carteira de Vacinação, Cartão SUS digital e histórico de atendimentos em todo o território nacional.",
        funcionalidades: [
          "Carteira Nacional de Vacinação Digital (com validação por QR Code);",
          "Emissão do Cartão Nacional de Saúde (CNS) em formato digital;",
          "Histórico de medicamentos retirados na Farmácia Popular."
        ],
        comoAcessar: "Acesse utilizando sua conta do sistema GOV.BR.",
        linksDownload: {
          appStore: "https://apps.apple.com/br/app/meu-sus-digital/id1527885233",
          googlePlay: "https://play.google.com/store/apps/details?id=br.gov.datasus.conectesus"
        }
      }
    }
  },

  // --- 10. VACINAÇÃO ---
  "vacina": {
    title: "Programa Municipal de Imunização",
    desc: "A vacinação é a forma mais segura e eficaz de prevenir doenças. A rede municipal disponibiliza gratuitamente todas as vacinas do Calendário Nacional de Imunização do Ministério da Saúde.",
    onde: "Salas de Vacina das Unidades Básicas de Saúde (UBS)",
    horario: "Segunda a Sexta-feira, das 08h00 às 16h30"
  }
};

/* ==========================================================================
   3. TIPOS DE VACINAS E CAMPANHAS
   ========================================================================== */
export const tiposVacinas = [
  {
    id: 1,
    titulo: "Vacinação de Rotina (Caderneta)",
    desc: "Atualização sistemática do esquema vacinal conforme o Calendário Nacional para crianças, adolescentes, adultos e idosos.",
    proceder: "Comparecer a uma UBS portando a caderneta para avaliação do profissional.",
    locais: "Todas as Unidades Básicas de Saúde (UBS) do município.",
    docs: "Documento oficial de identificação, Cartão SUS e Caderneta de Vacinação."
  },
  {
    id: 2,
    titulo: "Vacina Antirrábica Humana",
    desc: "Imunização pós-exposição preventiva para pessoas mordidas, arranhadas ou arranhadas por animais suspeitos.",
    proceder: "Lavar o ferimento com água e sabão e procurar atendimento imediatamente.",
    locais: "UBS Safira, UBS São Francisco, Hospital Municipal e UPA.",
    docs: "Documento oficial, Cartão SUS e Guia de Atendimento de Acidente Animal."
  },
  {
    id: 3,
    titulo: "Vacinação contra Covid-19",
    desc: "Doses de imunização e reforço contra o coronavírus para os grupos prioritários convocados.",
    proceder: "Acompanhar os comunicados semanais da Secretaria de Saúde.",
    locais: "UBS Polos divulgadas nos canais oficiais.",
    docs: "Documento com foto, CPF e Cartão do SUS."
  },
  {
    id: 4,
    titulo: "Vacina contra a Dengue",
    desc: "Imunização para redução de complicações e internações por dengue.",
    proceder: "Faixa etária convocada (10 a 14 anos) deve comparecer acompanhada dos pais.",
    locais: "Salas de vacinação polos do município.",
    docs: "Documento da criança, CPF e comprovante de residência.",
    alerta: "Contraindicada para gestantes, lactantes e imunossuprimidos."
  }
];