import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET - Buscar todas as notícias ou uma específica
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      const { data: noticias, error } = await supabase
        .from('noticias')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar notícias:', error)
        return NextResponse.json({
          status: 'error',
          message: 'Erro ao buscar notícias',
          error: error.message
        }, { status: 500 })
      }

      return NextResponse.json({ status: 'success', noticias: noticias || [] })
    }

    const { data: noticia, error } = await supabase
      .from('noticias')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Erro ao buscar notícia:', error)
      return NextResponse.json({
        status: 'error',
        message: 'Notícia não encontrada',
        error: error.message
      }, { status: 404 })
    }

    return NextResponse.json({ status: 'success', noticia })

  } catch (error) {
    console.error('Erro no GET notícias:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Erro interno do servidor',
      error: error.message
    }, { status: 500 })
  }
}

// POST - Criar ou atualizar notícia
export async function POST(request) {
  try {
    const body = await request.json()
    const { action, id, ...noticiaData } = body

    // Monta o payload apenas com as colunas existentes na tabela
    const payload = {
      titulo: noticiaData.titulo,
      resumo: noticiaData.resumo,
      conteudo: noticiaData.conteudo,
      categoria: noticiaData.categoria,
      tipo_categoria: noticiaData.tipoCategoria || noticiaData.categoria || '',
      autor: noticiaData.autor,
      data: noticiaData.data,
      imagem: noticiaData.imagem || '',
      updated_at: new Date().toISOString()
    }

    if (action === 'UPDATE' && id) {
      const { data: noticia, error } = await supabase
        .from('noticias')
        .update(payload)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Erro ao atualizar notícia:', error)
        return NextResponse.json({
          status: 'error',
          message: 'Erro ao atualizar notícia',
          error: error.message
        }, { status: 500 })
      }

      return NextResponse.json({
        status: 'success',
        message: 'Notícia atualizada com sucesso',
        noticia
      })
    } else {
      // Criar nova notícia com ID sequencial crescente (not-1, not-2, ...)
      const { data: idsExistentes, error: idsError } = await supabase
        .from('noticias')
        .select('id')

      if (idsError) {
        console.error('Erro ao buscar IDs existentes:', idsError)
        return NextResponse.json({
          status: 'error',
          message: 'Erro ao gerar ID da notícia',
          error: idsError.message
        }, { status: 500 })
      }

      const LIMITE_SEQUENCIA = 100000
      let maiorNumero = 0
      ;(idsExistentes || []).forEach((row) => {
        const match = String(row.id || '').match(/^not-(\d+)$/)
        if (match) {
          const num = parseInt(match[1], 10)
          if (num < LIMITE_SEQUENCIA && num > maiorNumero) maiorNumero = num
        }
      })

      payload.id = `not-${maiorNumero + 1}`

      const { data: noticia, error } = await supabase
        .from('noticias')
        .insert([payload])
        .select()
        .single()

      if (error) {
        console.error('Erro ao criar notícia:', error)
        return NextResponse.json({
          status: 'error',
          message: 'Erro ao criar notícia',
          error: error.message
        }, { status: 500 })
      }

      return NextResponse.json({
        status: 'success',
        message: 'Notícia criada com sucesso',
        noticia
      })
    }

  } catch (error) {
    console.error('Erro no POST notícias:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Erro interno do servidor',
      error: error.message
    }, { status: 500 })
  }
}

// DELETE - Remover notícia
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({
        status: 'error',
        message: 'ID da notícia é obrigatório'
      }, { status: 400 })
    }

    const { error } = await supabase
      .from('noticias')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erro ao deletar notícia:', error)
      return NextResponse.json({
        status: 'error',
        message: 'Erro ao deletar notícia',
        error: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      status: 'success',
      message: 'Notícia removida com sucesso'
    })

  } catch (error) {
    console.error('Erro no DELETE notícias:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Erro interno do servidor',
      error: error.message
    }, { status: 500 })
  }
}
