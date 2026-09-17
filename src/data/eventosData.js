import { supabase } from '@/lib/supabase';

// Array vazio - dados agora vêm do Supabase
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
      categoria: evento.categoria || 'Saúde',
      imagem: evento.imagem || '',
      imgSrc: evento.imagem || '', // Compatibilidade
      descricao: evento.descricao || '',
      cronograma: Array.isArray(evento.cronograma) ? evento.cronograma : 
                  (typeof evento.cronograma === 'string' ? JSON.parse(evento.cronograma || '[]') : []),
      requerInscricao: evento.requer_inscricao ?? false,
      geraCertificado: evento.gera_certificado ?? false,
      formFields: Array.isArray(evento.form_fields) ? evento.form_fields :
                  (typeof evento.form_fields === 'string' ? JSON.parse(evento.form_fields || '[]') : []),
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
 * Busca um evento específico por ID
 */
export async function getEventoById(id) {
  try {
    const { data, error } = await supabase
      .from('eventos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) return null;

    return {
      id: data.id,
      titulo: data.titulo || '',
      resumo: data.resumo || '',
      local: data.local || '',
      data: data.data || '',
      hora: data.hora || '',
      categoria: data.categoria || 'Saúde',
      imagem: data.imagem || '',
      imgSrc: data.imagem || '',
      descricao: data.descricao || '',
      cronograma: Array.isArray(data.cronograma) ? data.cronograma : 
                  (typeof data.cronograma === 'string' ? JSON.parse(data.cronograma || '[]') : []),
      requerInscricao: data.requer_inscricao ?? false,
      geraCertificado: data.gera_certificado ?? false,
      formFields: Array.isArray(data.form_fields) ? data.form_fields :
                  (typeof data.form_fields === 'string' ? JSON.parse(data.form_fields || '[]') : []),
      autor: data.autor || 'Sistema',
      inscricoesEncerradas: data.inscricoes_encerradas ?? false,
      vagasMaximo: data.vagas_maximo || null,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error('Erro ao buscar evento por ID:', error);
    return null;
  }
}

/**
 * Calcula dinamicamente o status do evento (Aberto, Em Andamento, Encerrado)
 */
export function getStatusEvento(evento, styles) {
  if (!evento) {
    return { label: 'Aberto / Inscrições', class: styles?.statusAberto || '' };
  }

  // 1. Verifica se o evento foi encerrado manualmente no painel admin
  if (evento.inscricoesEncerradas || evento.inscricoes_encerradas) {
    return { label: 'Encerrado', class: styles?.statusEncerrado || '' };
  }

  if (!evento.data) {
    return { label: 'Aberto / Inscrições', class: styles?.statusAberto || '' };
  }

  const agora = new Date();
  let dataISO = '';
  const strData = String(evento.data).trim();

  // 2. Trata datas nos formatos DD/MM/YYYY ou YYYY-MM-DD
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

  // 3. Trata os horários de início e término
  const horaIni = evento.horaInicio || (evento.hora ? evento.hora.split(' ')[0] : '00:00');
  const horaFim = evento.horaFim || '23:59';

  const horaInicioLimpa = horaIni.includes(':') ? horaIni : '00:00';
  const horaFimLimpa = horaFim.includes(':') ? horaFim : '23:59';

  // 4. Instâncias de Date para comparação
  const dataEventoInicio = new Date(`${dataISO}T${horaInicioLimpa}:00`);
  const dataEventoFim = new Date(`${dataISO}T${horaFimLimpa}:00`);

  if (isNaN(dataEventoInicio.getTime())) {
    return { label: 'Aberto / Inscrições', class: styles?.statusAberto || '' };
  }

  // 5. Retorna o status conforme o horário atual
  if (agora < dataEventoInicio) {
    return { label: 'Aberto / Inscrições', class: styles?.statusAberto || '' };
  } else if (agora >= dataEventoInicio && agora <= dataEventoFim) {
    return { label: 'Em Andamento', class: styles?.statusAndamento || '' };
  } else {
    return { label: 'Encerrado', class: styles?.statusEncerrado || '' };
  }
}