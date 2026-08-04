// src/data/eventosData.js

export const dbEventos = [
  {
    id: "4",
    titulo: "2º Simpósio Regulando cuidados em saúde",
    resumo: "Fortalecimento do acesso à saúde com integração de tecnologia e inovação no SUS municipal.",
    descricao: "A Secretaria Municipal de Saúde de Muriaé convida para um importante momento de diálogo e construção coletiva. No dia 21 de maio, será realizado o 2º Simpósio 'Regulando cuidados em saúde', com foco no fortalecimento do acesso, na integração dos serviços e no uso da tecnologia como aliada da gestão e do cuidado. O encontro será uma oportunidade para troca de experiências, atualização profissional e discussão aprofundada sobre estratégias que qualificam a assistência à população.",
    imgSrc: "/img/eventos/simposio.png",
    imagem: "/img/eventos/simposio.png",
    data: "2026-05-21",
    hora: "08:30 às 16:00",
    horaInicio: "08:30",
    horaFim: "16:00",
    categoria: "Palestra",
    tipo: "simposio",
    local: "Teatro Zaccarias Marques, Av. Maestro Sansão - em cima da Rodoviária",
    requerInscricao: true,
    geraCertificado: true,
    cronograma: [
      { horario: "08:30", atividade: "Boas-vindas (breakfast e credenciamento)", palestrante: "" },
      { horario: "09:00", atividade: "Abertura - Composição da mesa", palestrante: "" },
      { horario: "09:30", atividade: "Fluxos assistenciais a tratamentos em prestadores de Muriaé - Onde acessar os serviços?", palestrante: "Cláudia Moreira – Diretora de Linhas de Cuidados" },
      { horario: "09:30", atividade: "Tecnologia como ferramenta de informação - Descubra Muriaé", palestrante: "Jefinny Souza – Chefe de tecnologia da informação" },
      { horario: "09:30", atividade: "Fluxos de acesso GRS Ubá", palestrante: "Fabiana Erica de Souza – Coordenadora de Acesso à Serviços de Saúde da GRS Ubá" },
      { horario: "10:00", atividade: "Mesa redonda - Da regulação à Judicialização: as formas de acesso aos serviços SUS", palestrante: "Fabiana Erica de Souza – Coordenadora de Acesso à Serviços de Saúde da GRS Ubá" },
      { horario: "11:00", atividade: "Tempo para questionamentos da plateia", palestrante: "" },
      { horario: "12:00", atividade: "Almoço", palestrante: "" },
      { horario: "13:15", atividade: "Reabertura das apresentações com a Secretária Municipal de Saúde", palestrante: "Luiza Agostini de Andrade" },
      { horario: "13:30", atividade: "Contratos e PPI – direitos e desafios na gestão do SUS", palestrante: "Márcia Moraes" },
      { horario: "15:00", atividade: "Debates e tira dúvidas", palestrante: "Márcia Moraes e Luiza Agostini de Andrade - Secretária Municipal de Saúde de Muriaé" },
      { horario: "16:00", atividade: "Encerramento Oficial", palestrante: "" }
    ],
    formulario: [
      { label: "Nome completo", name: "nome", type: "text", required: true },
      { label: "Município", name: "municipio", type: "text", required: true },
      { label: "Cargo/Função", name: "cargo", type: "text", required: true },
      { label: "E-mail", name: "email", type: "email", required: false },
      { label: "Telefone", name: "telefone", type: "text", required: false }
    ]
  }
];

export function getStatusEvento(evento, styles) {
  if (!evento || !evento.data) {
    return { label: 'Agendado', class: styles?.statusAberto || '' };
  }

  const agora = new Date();

  // 1. Extrai estritamente o formato YYYY-MM-DD
  let dataISO = '';
  const strData = String(evento.data).trim();

  if (strData.includes('/')) {
    // Se for DD/MM/AAAA
    const partes = strData.split('/');
    if (partes.length === 3) {
      dataISO = `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`;
    }
  } else if (strData.includes('-')) {
    // Se for YYYY-MM-DD ou ISO
    dataISO = strData.split('T')[0];
  }

  // Fallback se não conseguir extrair
  if (!dataISO) {
    const d = new Date(evento.data);
    if (!isNaN(d.getTime())) {
      dataISO = d.toISOString().split('T')[0];
    } else {
      return { label: 'Agendado', class: styles?.statusAberto || '' };
    }
  }

  // 2. Trata os horários
  const horaIni = evento.horaInicio || (evento.hora ? evento.hora.split(' ')[0] : '00:00');
  const horaFim = evento.horaFim || '23:59';

  // Garante formato HH:mm válido
  const horaInicioLimpa = horaIni.includes(':') ? horaIni : '00:00';
  const horaFimLimpa = horaFim.includes(':') ? horaFim : '23:59';

  // 3. Monta as instâncias de Data com segurança
  const dataEventoInicio = new Date(`${dataISO}T${horaInicioLimpa}:00`);
  const dataEventoFim = new Date(`${dataISO}T${horaFimLimpa}:00`);

  // Se mesmo assim a data for inválida, retorna status padrão
  if (isNaN(dataEventoInicio.getTime())) {
    return { label: 'Agendado', class: styles?.statusAberto || '' };
  }

  // 4. Comparação segura
  if (agora < dataEventoInicio) {
    return { label: 'Inscrições / Aberto', class: styles?.statusAberto || '' };
  } else if (agora >= dataEventoInicio && agora <= dataEventoFim) {
    return { label: 'Em Andamento', class: styles?.statusAndamento || '' };
  } else {
    return { label: 'Encerrado', class: styles?.statusEncerrado || '' };
  }
}