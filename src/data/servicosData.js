import React from 'react';
import { 
  Smartphone, 
  Home, 
  FlaskConical, 
  ClipboardList, 
  Dog, 
  Droplets, 
  Pill, 
  Ambulance, 
  Syringe, 
  ShieldCheck, 
  BarChart3 
} from 'lucide-react';

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
    id: 'carteira-servicos',
    title: 'Carteira de Serviços',
    desc: 'Consulte a listagem completa de procedimentos realizados, organizados por Linhas de Cuidado e Especialidades Médicas do município.',
    icon: <FlaskConical size={24} />
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
  },
  {
    id: 'transparencia',
    title: 'Transparência',
    desc: 'Consulte indicadores da saúde municipal, filas de espera e relatórios em tempo real.',
    icon: <BarChart3 size={24} />
  },
];