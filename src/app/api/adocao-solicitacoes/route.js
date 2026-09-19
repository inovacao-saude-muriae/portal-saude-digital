import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET - Lista as solicitações de adoção (usado pelo painel administrativo)
export async function GET() {
  try {
    const { data: solicitacoes, error } = await supabase
      .from('adocao_solicitacoes')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar solicitações de adoção:', error)
      return NextResponse.json({
        status: 'error',
        message: 'Erro ao buscar solicitações',
        error: error.message
      }, { status: 500 })
    }

    return NextResponse.json({ status: 'success', solicitacoes: solicitacoes || [] })

  } catch (error) {
    console.error('Erro no GET solicitações de adoção:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Erro interno do servidor',
      error: error.message
    }, { status: 500 })
  }
}

// POST - Registra uma nova solicitação (enviada pelo formulário público)
export async function POST(request) {
  try {
    const body = await request.json()

    if (!body.nome || !body.nome.trim()) {
      return NextResponse.json({
        status: 'error',
        message: 'O nome é obrigatório'
      }, { status: 400 })
    }

    const payload = {
      animal_id: body.animalId || null,
      animal_nome: body.animalNome || null,
      nome: body.nome.trim(),
      cpf: body.cpf || '',
      telefone: body.telefone || '',
      rua: body.rua || '',
      numero: body.numero || '',
      bairro: body.bairro || '',
      cidade: body.cidade || '',
      cep: body.cep || '',
      status: 'nova'
    }

    const { data: solicitacao, error } = await supabase
      .from('adocao_solicitacoes')
      .insert([payload])
      .select()
      .single()

    if (error) {
      console.error('Erro ao registrar solicitação de adoção:', error)
      return NextResponse.json({
        status: 'error',
        message: 'Erro ao registrar solicitação',
        error: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      status: 'success',
      message: 'Solicitação registrada com sucesso',
      solicitacao
    })

  } catch (error) {
    console.error('Erro no POST solicitação de adoção:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Erro interno do servidor',
      error: error.message
    }, { status: 500 })
  }
}

// DELETE - Remove uma solicitação (usado pelo painel administrativo)
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({
        status: 'error',
        message: 'ID da solicitação é obrigatório'
      }, { status: 400 })
    }

    const { error } = await supabase
      .from('adocao_solicitacoes')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erro ao deletar solicitação:', error)
      return NextResponse.json({
        status: 'error',
        message: 'Erro ao deletar solicitação',
        error: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      status: 'success',
      message: 'Solicitação removida com sucesso'
    })

  } catch (error) {
    console.error('Erro no DELETE solicitação de adoção:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Erro interno do servidor',
      error: error.message
    }, { status: 500 })
  }
}
