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
   LISTAGEM / GRELHA PRINCIPAL DA PÁGINA DE SERVIÇOS
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
   ARRAY COMPARTILHADO: TIPOS DE VACINAS E CAMPANHAS
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