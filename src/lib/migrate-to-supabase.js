// Utilitário para migrar dados do eventosData.js para o Supabase
import { supabase, formatDateForSupabase } from './supabase'
import { dbEventos } from '@/data/eventosData'

export async function migrateEventsToSupabase() {
  try {
    console.log('Iniciando migração de eventos para Supabase...')
    
    // Verifica se já existem eventos no Supabase
    const { data: existingEvents, error: checkError } = await supabase
      .from('eventos')
      .select('id')
      .limit(1)

    if (checkError) {
      throw checkError
    }

    if (existingEvents && existingEvents.length > 0) {
      console.log('Já existem eventos no Supabase. Migração cancelada.')
      return { success: false, message: 'Já existem eventos no banco' }
    }

    // Converte os dados locais para o formato do Supabase
    const eventosParaMigrar = dbEventos.map(evento => ({
      id: evento.id,
      titulo: evento.titulo,
      resumo: evento.resumo,
      local: evento.local,
      data: formatDateForSupabase(evento.data),
      hora: evento.hora,
      categoria: evento.categoria || 'Saúde',
      descricao: evento.descricao,
      autor: evento.autor || 'Sistema',
      imagem: evento.imagem || evento.imgSrc,
      img_src: evento.imgSrc || evento.imagem,
      // Campos de inscrição (assumindo valores padrão se não existirem)
      requer_inscricao: evento.requerInscricao || false,
      inscricoes_encerradas: evento.inscricoesEncerradas || false,
      gera_certificado: evento.geraCertificado || false,
      vagas_maximo: evento.vagasMaximo || null,
      form_fields: evento.formFields ? JSON.stringify(evento.formFields) : '[]',
      cronograma: evento.cronograma ? JSON.stringify(evento.cronograma) : '[]'
    }))

    // Insere os eventos no Supabase
    const { data, error } = await supabase
      .from('eventos')
      .insert(eventosParaMigrar)
      .select()

    if (error) {
      throw error
    }

    console.log(`${data.length} eventos migrados com sucesso!`)
    return { 
      success: true, 
      message: `${data.length} eventos migrados com sucesso!`,
      eventos: data
    }

  } catch (error) {
    console.error('Erro na migração:', error)
    return { 
      success: false, 
      message: `Erro na migração: ${error.message}`,
      error 
    }
  }
}

// Função para migrar um evento específico
export async function migrateEventById(eventoId) {
  try {
    const evento = dbEventos.find(e => e.id === eventoId)
    if (!evento) {
      throw new Error('Evento não encontrado nos dados locais')
    }

    const eventoFormatado = {
      id: evento.id,
      titulo: evento.titulo,
      resumo: evento.resumo,
      local: evento.local,
      data: formatDateForSupabase(evento.data),
      hora: evento.hora,
      categoria: evento.categoria || 'Saúde',
      descricao: evento.descricao,
      autor: evento.autor || 'Sistema',
      imagem: evento.imagem || evento.imgSrc,
      img_src: evento.imgSrc || evento.imagem,
      requer_inscricao: evento.requerInscricao || false,
      inscricoes_encerradas: evento.inscricoesEncerradas || false,
      gera_certificado: evento.geraCertificado || false,
      vagas_maximo: evento.vagasMaximo || null,
      form_fields: evento.formFields ? JSON.stringify(evento.formFields) : '[]',
      cronograma: evento.cronograma ? JSON.stringify(evento.cronograma) : '[]'
    }

    const { data, error } = await supabase
      .from('eventos')
      .upsert([eventoFormatado])
      .select()
      .single()

    if (error) {
      throw error
    }

    return { success: true, evento: data }

  } catch (error) {
    console.error('Erro ao migrar evento:', error)
    return { success: false, error: error.message }
  }
}