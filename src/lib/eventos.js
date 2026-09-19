import { supabase } from '@/lib/supabase';

export const dbEventos = [];

/**
 * Busca todos os eventos cadastrados na tabela 'eventos' do Supabase
 */
export async function getDbEventos() {
  try {
    const { data, error } = await supabase
      .from('eventos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((evento) => ({
      id: evento.id,
      titulo: evento.titulo || '',
      resumo: evento.resumo || '',
      local: evento.local || '',
      data: evento.data || '',
      hora: evento.hora || '',
      categoria: evento.categoria || 'Capacitação',
      imagem: evento.imagem || '/img/eventos/default.png',
      descricao: evento.descricao || '',
      cronograma: evento.cronograma || [],
      requerInscricao: evento.requer_inscricao ?? false,
      geraCertificado: evento.gera_certificado ?? false,
      formFields: evento.form_fields || [],
      autor: evento.autor || 'Sistema',
      inscricoesEncerradas: evento.inscricoes_encerradas ?? false,
      vagasMaximo: evento.vagas_maximo || null,
      createdAt: evento.created_at,
      updatedAt: evento.updated_at
    }));
  } catch (error) {
    console.error('Erro ao buscar eventos no Supabase:', error);
    return [];
  }
}

/**
 * Calcula dinamicamente o status do evento (Aberto, Em Andamento, Encerrado)
 */
export function getStatusEvento(evento, styles) {
  if (!evento) {
    return { label: 'Aberto / Inscrições', class: styles?.statusAberto || '' };
  }

  if (evento.inscricoesEncerradas || evento.inscricoes_encerradas) {
    return { label: 'Encerrado', class: styles?.statusEncerrado || '' };
  }

  if (!evento.data) {
    return { label: 'Aberto / Inscrições', class: styles?.statusAberto || '' };
  }

  const agora = new Date();
  let dataISO = '';
  const strData = String(evento.data).trim();

  if (strData.includes('/')) {
    const partes = strData.split('/');
    if (partes.length === 3) {
      dataISO = `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`;
    }
  } else if (strData.includes('-')) {
    dataISO = strData.split('T')[0];
  }

  if (!dataISO) {
    const d = new Date(evento.data);
    if (!isNaN(d.getTime())) {
      dataISO = d.toISOString().split('T')[0];
    } else {
      return { label: 'Aberto / Inscrições', class: styles?.statusAberto || '' };
    }
  }

  const horaIni = evento.horaInicio || (evento.hora ? evento.hora.split(' ')[0] : '00:00');
  const horaFim = evento.horaFim || '23:59';

  const horaInicioLimpa = horaIni.includes(':') ? horaIni : '00:00';
  const horaFimLimpa = horaFim.includes(':') ? horaFim : '23:59';

  const dataEventoInicio = new Date(`${dataISO}T${horaInicioLimpa}:00`);
  const dataEventoFim = new Date(`${dataISO}T${horaFimLimpa}:00`);

  if (isNaN(dataEventoInicio.getTime())) {
    return { label: 'Aberto / Inscrições', class: styles?.statusAberto || '' };
  }

  if (agora < dataEventoInicio) {
    return { label: 'Aberto / Inscrições', class: styles?.statusAberto || '' };
  } else if (agora >= dataEventoInicio && agora <= dataEventoFim) {
    return { label: 'Em Andamento', class: styles?.statusAndamento || '' };
  } else {
    return { label: 'Encerrado', class: styles?.statusEncerrado || '' };
  }
}