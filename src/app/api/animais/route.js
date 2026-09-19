import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET - Buscar todos os animais ou um específico
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      const { data: animais, error } = await supabase
        .from('ccz_animais')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar animais:', error)
        return NextResponse.json({
          status: 'error',
          message: 'Erro ao buscar animais',
          error: error.message
        }, { status: 500 })
      }

      return NextResponse.json({ status: 'success', animais: animais || [] })
    }

    const { data: animal, error } = await supabase
      .from('ccz_animais')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Erro ao buscar animal:', error)
      return NextResponse.json({
        status: 'error',
        message: 'Animal não encontrado',
        error: error.message
      }, { status: 404 })
    }

    return NextResponse.json({ status: 'success', animal })

  } catch (error) {
    console.error('Erro no GET animais:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Erro interno do servidor',
      error: error.message
    }, { status: 500 })
  }
}

// POST - Criar ou atualizar animal
export async function POST(request) {
  try {
    const body = await request.json()
    const { action, id, ...animalData } = body

    const payload = {
      nome: animalData.nome,
      especie: animalData.especie || 'Cachorro',
      sexo: animalData.sexo || 'macho',
      filhote: !!animalData.filhote,
      descricao: animalData.descricao || '',
      foto: animalData.foto || ''
    }

    if (action === 'UPDATE' && id) {
      const { data: animal, error } = await supabase
        .from('ccz_animais')
        .update(payload)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Erro ao atualizar animal:', error)
        return NextResponse.json({
          status: 'error',
          message: 'Erro ao atualizar animal',
          error: error.message
        }, { status: 500 })
      }

      return NextResponse.json({
        status: 'success',
        message: 'Animal atualizado com sucesso',
        animal
      })
    } else {
      // ID único (ms + sufixo aleatório) evita colisão de chave quando
      // dois animais são criados no mesmo segundo.
      payload.id = `${Date.now()}${Math.floor(Math.random() * 1000)}`

      const { data: animal, error } = await supabase
        .from('ccz_animais')
        .insert([payload])
        .select()
        .single()

      if (error) {
        console.error('Erro ao criar animal:', error)
        return NextResponse.json({
          status: 'error',
          message: 'Erro ao criar animal',
          error: error.message
        }, { status: 500 })
      }

      return NextResponse.json({
        status: 'success',
        message: 'Animal cadastrado com sucesso',
        animal
      })
    }

  } catch (error) {
    console.error('Erro no POST animais:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Erro interno do servidor',
      error: error.message
    }, { status: 500 })
  }
}

// DELETE - Remover animal
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({
        status: 'error',
        message: 'ID do animal é obrigatório'
      }, { status: 400 })
    }

    const { error } = await supabase
      .from('ccz_animais')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erro ao deletar animal:', error)
      return NextResponse.json({
        status: 'error',
        message: 'Erro ao deletar animal',
        error: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      status: 'success',
      message: 'Animal removido com sucesso'
    })

  } catch (error) {
    console.error('Erro no DELETE animais:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Erro interno do servidor',
      error: error.message
    }, { status: 500 })
  }
}
