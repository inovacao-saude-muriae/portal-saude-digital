// src/data/listaServicosData.js
import React from 'react';
import { Stethoscope, Syringe, Baby, HeartPulse, Pill, Truck } from 'lucide-react';

export const servicos = [
  {
    id: "aplicativos",
    icon: <Stethoscope size={22} />,
    title: "Aplicativo",
    desc: "Consultas médicas, exames de rotina, curativos, pré-natal e acompanhamento de saúde da família nas UBS."
  },
  {
    id: "atendimento-domiciliar",
    icon: <Stethoscope size={22} />,
    title: "Atendimento Domiciliar",
    desc: "Consultas médicas, exames de rotina, curativos, pré-natal e acompanhamento de saúde da família nas UBS."
  },
  {
    id: "camara-tecnica",
    icon: <Syringe size={22} />,
    title: "Câmara Técnica",
    desc: "Aplicação de vacinas do calendário nacional, campanhas sazonais e imunização de grupos prioritários."
  },
  {
    id: "ccz",
    icon: <Truck size={22} />,
    title: "Centro de Controle de Zoonoses",
    desc: "Orientar e fiscalizar estabelecimentos e serviços de saúde ou de interesse à saúde."
  },
  {
    id: "doacao-de-sangue",
    icon: <Pill size={22} />,
    title: "Doação de Sangue",
    desc: "Dispensação gratuita de medicamentos essenciais e do componente especializado."
  },
  {
    id: "farmacia-municipal",
    icon: <Baby size={22} />,
    title: "Farmácia Municipal",
    desc: "Puericultura, triagem neonatal (teste do pezinho, orelhinha, olhinho) e acompanhamento do desenvolvimento infantil."
  },
  {
    id: "laboratorio-municipal",
    icon: <HeartPulse size={22} />,
    title: "Laboratório Municipal",
    desc: "Acompanhamento de hipertensão, diabetes, saúde cardiovascular e programas de prevenção."
  },
  {
    id: "vacina",
    icon: <Truck size={22} />,
    title: "Vacina",
    desc: "SAMU 192, UPA 24 horas e atendimento pré-hospitalar em toda a cidade."
  },
  {
    id: "vigilancia-sanitaria",
    icon: <Truck size={22} />,
    title: "Vigilância Sanitária",
    desc: "Orientar e fiscalizar estabelecimentos e serviços de saúde ou de interesse à saúde."
  }
];