export const dbEventos = [
  {
    "id": 1,
    "titulo": "SAE Ampliado e o CRIE Macrorregional",
    "resumo": "O SAE Ampliado passa a atuar como referência no cuidado de pessoas com infecções e condições crônicas...",
    "descricao": "A Prefeitura de Muriaé, por meio da Secretaria Municipal de Saúde, realiza a inauguração de dois importantes equipamentos que fortalecem o atendimento especializado no município e em toda a região: o SAE Ampliado e o CRIE Macrorregional, agora em funcionamento no espaço do antigo SESC...",
    "imgSrc": "/img/eventos/evento1.png",
    "data": "2026-03-20",
    "galeria": [
      "/img/eventos/galeria/evento1/1.jpg",
      "/img/eventos/galeria/evento1/2.jpg"
    ]
  },
  {
    "id": 2,
    "titulo": "Unidade Básica de Saúde do Santo Antônio",
    "resumo": "Extensão estratégica da rede municipal no distrito da Gameleira...",
    "descricao": "O Posto de Apoio à Unidade Básica de Saúde do Santo Antônio, no distrito da Gameleira passa a funcionar como uma extensão estratégica da rede municipal...",
    "imgSrc": "/img/eventos/evento2.png",
    "data": "2026-03-19",
    "galeria": [
      "/img/eventos/galeria/evento2/1.jpg"
    ]
  },
  {
    "id": 3,
    "titulo": "UBS Liberty Dias",
    "resumo": "O novo espaço é moderno, estruturado e preparado para oferecer mais qualidade...",
    "descricao": "A Prefeitura de Muriaé realiza a inauguração da UBS Liberty Dias, no bairro Inconfidência...",
    "imgSrc": "/img/eventos/evento3.png",
    "data": "2026-02-28",
    "galeria": [
      "/img/eventos/galeria/evento3/1.jpg"
    ]
  },
  {
    "id": 4,
    "titulo": "2º Simpósio Regulando cuidados em saúde",
    "resumo": "Fortalecimento do acesso à saúde com integração de tecnologia e inovação...",
    "descricao": "A Secretaria Municipal de Saúde de Muriaé convida para um importante momento de diálogo e construção coletiva...",
    "imgSrc": "/img/eventos/simposio.png",
    "data": "2026-05-21",
    "horaInicio": "08:30",
    "horaFim": "16:00",
    "tipo": "simposio",
    "local": "Teatro Zaccarias Marques, Av. Maestro Sansão - em cima da Rodoviária",
    "cronograma": [
      { "hora": "08:30", "tema": "Boas-vindas (breakfast e credenciamento)", "palestrante": "" },
      { "hora": "09:00", "tema": "Abertura - Composição da mesa", "palestrante": "" }
    ],
    "formulario": [
      { "label": "Nome completo", "name": "nome", "type": "text", "required": true }
    ],
    "scriptUrl": "https://script.google.com/macros/s/AKfycbwDyUaKoI6ptX85kKkVnOfBJJ_ikOkuteLY97fbFlsUDE3zxxDYWgem2iNNmrzrhm-C/exec"
  }
];

export function getStatusEvento(evento, styles) {
  const agora = new Date();
  const dataEventoInicio = new Date(`${evento.data}T${evento.horaInicio || '00:00'}:00`);
  const dataEventoFim = new Date(`${evento.data}T${evento.horaFim || '23:59'}:00`);

  if (agora < dataEventoInicio) {
    return { label: 'Aberto / Inscrições', class: styles?.statusAberto || '' };
  } else if (agora >= dataEventoInicio && agora <= dataEventoFim) {
    return { label: 'Em Andamento', class: styles?.statusAndamento || '' };
  } else {
    return { label: 'Encerrado', class: styles?.statusEncerrado || '' };
  }
}