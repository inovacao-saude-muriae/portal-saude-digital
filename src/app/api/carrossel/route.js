import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET - Buscar todos os slides do carrossel (ordenados por 'ordem')
export async function GET() {
  try {
    const { data: slides, error } = await supabase
      .from('carrossel')
      .select('*')
      .order('ordem', { ascending: true })

    if (error) {
      console.error('Erro ao buscar carrossel:', error)
      return NextResponse.json({
        status: 'error',
        message: 'Erro ao buscar slides',
        error: error.message
      }, { status: 500 })
    }

    return NextResponse.json({ status: 'success', slides: slides || [] })

  } catch (error) {
    console.error('Erro no GET carrossel:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Erro interno do servidor',
      error: error.message
    }, { status: 500 })
  }
}

// POST - Criar ou atualizar slide
export async function POST(request) {
  try {
    const body = await request.json()
    const { action, id, ...slideData } = body

    const payload = {
      alt: slideData.alt || 'Banner institucional',
      imagem: slideData.imagem || '',
      ordem: Number.isFinite(Number(slideData.ordem)) ? parseInt(slideData.ordem, 10) : 1,
      link: slideData.link || '',
      autor: slideData.autor || 'Sistema'
    }

    if (action === 'UPDATE' && id) {
      const { data: slide, error } = await supabase
        .from('carrossel')
        .update(payload)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Erro ao atualizar slide:', error)
        return NextResponse.json({
          status: 'error',
          message: 'Erro ao atualizar slide',
          error: error.message
        }, { status: 500 })
      }

      return NextResponse.json({
        status: 'success',
        message: 'Slide atualizado com sucesso',
        slide
      })
    } else {
      // Gera um ID único no servidor (ms + sufixo aleatório) para evitar
      // colisão de chave quando dois slides são criados no mesmo segundo,
      // já que o default do banco usa apenas o timestamp em segundos.
      payload.id = `slide-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

      const { data: slide, error } = await supabase
        .from('carrossel')
        .insert([payload])
        .select()
        .single()

      if (error) {
        console.error('Erro ao criar slide:', error)
        return NextResponse.json({
          status: 'error',
          message: 'Erro ao criar slide',
          error: error.message
        }, { status: 500 })
      }

      return NextResponse.json({
        status: 'success',
        message: 'Slide criado com sucesso',
        slide
      })
    }

  } catch (error) {
    console.error('Erro no POST carrossel:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Erro interno do servidor',
      error: error.message
    }, { status: 500 })
  }
}

// DELETE - Remover slide
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({
        status: 'error',
        message: 'ID do slide é obrigatório'
      }, { status: 400 })
    }

    const { error } = await supabase
      .from('carrossel')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erro ao deletar slide:', error)
      return NextResponse.json({
        status: 'error',
        message: 'Erro ao deletar slide',
        error: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      status: 'success',
      message: 'Slide removido com sucesso'
    })

  } catch (error) {
    console.error('Erro no DELETE carrossel:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Erro interno do servidor',
      error: error.message
    }, { status: 500 })
  }
}
