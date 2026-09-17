import { NextResponse } from 'next/server'
import { supabase, formatDateForSupabase } from '@/lib/supabase'

// GET - Buscar todos os eventos ou um específico
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const action = searchParams.get('action')

    if (action === 'GET_ALL' || !id) {
      const { data: eventos, error } = await supabase
        .from('eventos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar eventos:', error)
        return NextResponse.json({ 
          status: 'error', 
          message: 'Erro ao buscar eventos',
          error: error.message 
        }, { status: 500 })
      }

      return NextResponse.json({ 
        status: 'success', 
        eventos: eventos || []
      })
    }

    // Buscar evento específico
    const { data: evento, error } = await supabase
      .from('eventos')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Erro ao buscar evento:', error)
      return NextResponse.json({ 
        status: 'error', 
        message: 'Evento não encontrado',
        error: error.message 
      }, { status: 404 })
    }

    return NextResponse.json({ 
      status: 'success', 
      evento 
    })

  } catch (error) {
    console.error('Erro no GET eventos:', error)
    return NextResponse.json({ 
      status: 'error', 
      message: 'Erro interno do servidor',
      error: error.message 
    }, { status: 500 })
  }
}

// POST - Criar ou atualizar evento
export async function POST(request) {
  try {
    const body = await request.json()
    const { action, id, ...eventoData } = body

    // Formatar a data para o Supabase
    if (eventoData.data) {
      eventoData.data = formatDateForSupabase(eventoData.data)
    }

    // Tratar campos que podem ser arrays/objetos
    if (eventoData.formFields && typeof eventoData.formFields !== 'string') {
      eventoData.form_fields = JSON.stringify(eventoData.formFields)
      delete eventoData.formFields
    }

    if (eventoData.cronograma && typeof eventoData.cronograma !== 'string') {
      eventoData.cronograma = JSON.stringify(eventoData.cronograma)
    }

    // Campos booleanos
    eventoData.requer_inscricao = !!eventoData.requerInscricao
    eventoData.inscricoes_encerradas = !!eventoData.inscricoesEncerradas
    eventoData.gera_certificado = !!eventoData.geraCertificado
    eventoData.vagas_maximo = eventoData.vagasMaximo || null

    // Remover campos antigos
    delete eventoData.requerInscricao
    delete eventoData.inscricoesEncerradas
    delete eventoData.geraCertificado
    delete eventoData.vagasMaximo

    if (action === 'UPDATE' && id) {
      // Atualizar evento existente
      const { data: evento, error } = await supabase
        .from('eventos')
        .update(eventoData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Erro ao atualizar evento:', error)
        return NextResponse.json({ 
          status: 'error', 
          message: 'Erro ao atualizar evento',
          error: error.message 
        }, { status: 500 })
      }

      return NextResponse.json({ 
        status: 'success', 
        message: 'Evento atualizado com sucesso',
        evento 
      })

    } else {
      // Criar novo evento com ID sequencial crescente (evt-1, evt-2, ...).
      // Descobre o maior número já usado no padrão "evt-N" e soma 1.
      const { data: idsExistentes, error: idsError } = await supabase
        .from('eventos')
        .select('id')

      if (idsError) {
        console.error('Erro ao buscar IDs existentes:', idsError)
        return NextResponse.json({
          status: 'error',
          message: 'Erro ao gerar ID do evento',
          error: idsError.message
        }, { status: 500 })
      }

      // Considera apenas números de sequência "normais" (evt-1 ... evt-99999).
      // IDs antigos gerados por timestamp (ex: evt-1789400548) são ignorados
      // para não estourar a sequência.
      const LIMITE_SEQUENCIA = 100000
      let maiorNumero = 0
      ;(idsExistentes || []).forEach((row) => {
        const match = String(row.id || '').match(/^evt-(\d+)$/)
        if (match) {
          const num = parseInt(match[1], 10)
          if (num < LIMITE_SEQUENCIA && num > maiorNumero) maiorNumero = num
        }
      })

      const novoId = `evt-${maiorNumero + 1}`
      eventoData.id = novoId

      const { data: evento, error } = await supabase
        .from('eventos')
        .insert([eventoData])
        .select()
        .single()

      if (error) {
        console.error('Erro ao criar evento:', error)
        return NextResponse.json({ 
          status: 'error', 
          message: 'Erro ao criar evento',
          error: error.message 
        }, { status: 500 })
      }

      return NextResponse.json({ 
        status: 'success', 
        message: 'Evento criado com sucesso',
        evento 
      })
    }

  } catch (error) {
    console.error('Erro no POST eventos:', error)
    return NextResponse.json({ 
      status: 'error', 
      message: 'Erro interno do servidor',
      error: error.message 
    }, { status: 500 })
  }
}

// DELETE - Remover evento
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ 
        status: 'error', 
        message: 'ID do evento é obrigatório' 
      }, { status: 400 })
    }

    const { error } = await supabase
      .from('eventos')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erro ao deletar evento:', error)
      return NextResponse.json({ 
        status: 'error', 
        message: 'Erro ao deletar evento',
        error: error.message 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      status: 'success', 
      message: 'Evento removido com sucesso' 
    })

  } catch (error) {
    console.error('Erro no DELETE eventos:', error)
    return NextResponse.json({ 
      status: 'error', 
      message: 'Erro interno do servidor',
      error: error.message 
    }, { status: 500 })
  }
}