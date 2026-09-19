import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Converte a linha do banco (snake_case) para o formato usado no front (camelCase)
function paraFront(row) {
  return {
    c1Val: row?.c1_val ?? '',
    c1Text: row?.c1_text ?? '',
    c2Val: row?.c2_val ?? '',
    c2Text: row?.c2_text ?? '',
    c3Val: row?.c3_val ?? '',
    c3Text: row?.c3_text ?? '',
    c4Val: row?.c4_val ?? '',
    c4Text: row?.c4_text ?? ''
  }
}

// GET - Busca a linha única de estatísticas (id = 1)
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('hero_stats')
      .select('*')
      .eq('id', 1)
      .maybeSingle()

    if (error) {
      console.error('Erro ao buscar hero_stats:', error)
      return NextResponse.json({
        status: 'error',
        message: 'Erro ao buscar estatísticas',
        error: error.message
      }, { status: 500 })
    }

    return NextResponse.json({ status: 'success', stats: paraFront(data || {}) })

  } catch (error) {
    console.error('Erro no GET hero:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Erro interno do servidor',
      error: error.message
    }, { status: 500 })
  }
}

// POST - Atualiza a linha única (id = 1). Cria se ainda não existir.
export async function POST(request) {
  try {
    const body = await request.json()

    const payload = {
      id: 1,
      c1_val: String(body.c1Val ?? ''),
      c1_text: String(body.c1Text ?? ''),
      c2_val: String(body.c2Val ?? ''),
      c2_text: String(body.c2Text ?? ''),
      c3_val: String(body.c3Val ?? ''),
      c3_text: String(body.c3Text ?? ''),
      c4_val: String(body.c4Val ?? ''),
      c4_text: String(body.c4Text ?? ''),
      updated_at: new Date().toISOString()
    }

    // upsert garante criar (id=1) ou atualizar a linha existente
    const { data, error } = await supabase
      .from('hero_stats')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single()

    if (error) {
      console.error('Erro ao salvar hero_stats:', error)
      return NextResponse.json({
        status: 'error',
        message: 'Erro ao salvar estatísticas',
        error: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      status: 'success',
      message: 'Estatísticas atualizadas com sucesso',
      stats: paraFront(data)
    })

  } catch (error) {
    console.error('Erro no POST hero:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Erro interno do servidor',
      error: error.message
    }, { status: 500 })
  }
}
