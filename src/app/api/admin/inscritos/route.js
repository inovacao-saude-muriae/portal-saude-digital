import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET - Buscar inscritos de um evento específico
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const eventoId = searchParams.get('eventoId')
    const eventoTitulo = searchParams.get('eventoTitulo')

    if (!eventoId && !eventoTitulo) {
      return NextResponse.json({ 
        status: 'error', 
        message: 'É necessário informar eventoId ou eventoTitulo' 
      }, { status: 400 })
    }

    let query = supabase.from('evento_inscritos').select('*')

    if (eventoId && eventoTitulo) {
      query = query.or(`evento_id.eq.${eventoId},evento_titulo.ilike.%${eventoTitulo}%`)
    } else if (eventoId) {
      query = query.eq('evento_id', eventoId)
    } else if (eventoTitulo) {
      query = query.ilike('evento_titulo', `%${eventoTitulo}%`)
    }

    const { data: inscritos, error } = await query.order('created_at', { ascending: true })

    if (error) {
      console.error('Erro ao buscar inscritos:', error)
      return NextResponse.json({ 
        status: 'error', 
        message: 'Erro ao buscar inscritos',
        error: error.message 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      status: 'success', 
      inscritos: inscritos || []
    })

  } catch (error) {
    console.error('Erro no GET inscritos:', error)
    return NextResponse.json({ 
      status: 'error', 
      message: 'Erro interno do servidor',
      error: error.message 
    }, { status: 500 })
  }
}

// DELETE - Remover inscrição (apenas admin)
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const inscricaoId = searchParams.get('id')

    if (!inscricaoId) {
      return NextResponse.json({ 
        status: 'error', 
        message: 'ID da inscrição é obrigatório' 
      }, { status: 400 })
    }

    const { error } = await supabase
      .from('evento_inscritos')
      .delete()
      .eq('id', inscricaoId)

    if (error) {
      console.error('Erro ao deletar inscrição:', error)
      return NextResponse.json({ 
        status: 'error', 
        message: 'Erro ao deletar inscrição',
        error: error.message 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      status: 'success', 
      message: 'Inscrição removida com sucesso' 
    })

  } catch (error) {
    console.error('Erro no DELETE inscrição:', error)
    return NextResponse.json({ 
      status: 'error', 
      message: 'Erro interno do servidor',
      error: error.message 
    }, { status: 500 })
  }
}