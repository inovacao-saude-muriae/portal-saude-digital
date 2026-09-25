import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

// Cargos válidos que podem ser atribuídos a um usuário
const CARGOS_VALIDOS = [
  'admin',
  'ccz',
  'comunicacao'
]

// GET - Lista os usuários cadastrados (perfis)
export async function GET() {
  try {
    const admin = getSupabaseAdmin()
    const { data, error } = await admin
      .from('profiles')
      .select('id, nome, usuario, cargo, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao listar usuários:', error)
      return NextResponse.json({ status: 'error', message: 'Erro ao listar usuários', error: error.message }, { status: 500 })
    }

    return NextResponse.json({ status: 'success', usuarios: data || [] })
  } catch (error) {
    console.error('Erro no GET usuários:', error)
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 })
  }
}

// POST - Cria um novo usuário (Auth + profiles)
export async function POST(request) {
  try {
    const body = await request.json()
    const nome = (body.nome || '').trim()
    const usuario = (body.usuario || '').trim().toLowerCase()
    const email = (body.email || '').trim().toLowerCase()
    const senha = (body.senha || '').trim()
    const cargo = (body.cargo || '').trim().toLowerCase()

    // Validações
    if (!nome || !usuario || !email || !senha) {
      return NextResponse.json({ status: 'error', message: 'Preencha nome, usuário, e-mail e senha.' }, { status: 400 })
    }
    if (senha.length < 6) {
      return NextResponse.json({ status: 'error', message: 'A senha deve ter pelo menos 6 caracteres.' }, { status: 400 })
    }
    if (!CARGOS_VALIDOS.includes(cargo)) {
      return NextResponse.json({ status: 'error', message: 'Cargo inválido.' }, { status: 400 })
    }

    const admin = getSupabaseAdmin()

    // Verifica se o "usuario" (apelido) já existe
    const { data: usuarioExistente } = await admin
      .from('profiles')
      .select('id')
      .eq('usuario', usuario)
      .maybeSingle()

    if (usuarioExistente) {
      return NextResponse.json({ status: 'error', message: 'Este nome de usuário já está em uso.' }, { status: 400 })
    }

    // 1. Cria o usuário no Supabase Auth (já confirmado, para poder logar)
    const { data: authData, error: authError } = await admin.auth.admin.createUser({
      email,
      password: senha,
      email_confirm: true
    })

    if (authError || !authData?.user) {
      console.error('Erro ao criar usuário no Auth:', authError)
      const msg = authError?.message?.includes('already been registered')
        ? 'Este e-mail já está cadastrado.'
        : (authError?.message || 'Erro ao criar usuário.')
      return NextResponse.json({ status: 'error', message: msg }, { status: 400 })
    }

    // 2. Cria/atualiza o perfil vinculado (mesmo id do Auth).
    // Usa upsert porque o Supabase pode ter um trigger que já cria a linha
    // em 'profiles' automaticamente ao criar o usuário no Auth.
    const { error: profileError } = await admin
      .from('profiles')
      .upsert([{ id: authData.user.id, nome, usuario, cargo }], { onConflict: 'id' })

    if (profileError) {
      // Desfaz a criação do Auth para não deixar usuário órfão
      await admin.auth.admin.deleteUser(authData.user.id)
      console.error('Erro ao criar perfil:', profileError)
      return NextResponse.json({ status: 'error', message: 'Erro ao salvar o perfil do usuário.', error: profileError.message }, { status: 500 })
    }

    return NextResponse.json({
      status: 'success',
      message: 'Usuário criado com sucesso',
      usuario: { id: authData.user.id, nome, usuario, cargo }
    })
  } catch (error) {
    console.error('Erro no POST usuários:', error)
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 })
  }
}

// PUT - Edita os dados de um usuário existente (profiles + opcionalmente Auth)
export async function PUT(request) {
  try {
    const body = await request.json()
    const id = (body.id || '').trim()
    const nome = (body.nome || '').trim()
    const usuario = (body.usuario || '').trim().toLowerCase()
    const email = (body.email || '').trim().toLowerCase()
    const senha = (body.senha || '').trim()
    const cargo = (body.cargo || '').trim().toLowerCase()

    if (!id) {
      return NextResponse.json({ status: 'error', message: 'ID do usuário é obrigatório.' }, { status: 400 })
    }
    if (!nome || !usuario) {
      return NextResponse.json({ status: 'error', message: 'Preencha nome e usuário.' }, { status: 400 })
    }
    if (!CARGOS_VALIDOS.includes(cargo)) {
      return NextResponse.json({ status: 'error', message: 'Cargo inválido.' }, { status: 400 })
    }
    if (senha && senha.length < 6) {
      return NextResponse.json({ status: 'error', message: 'A nova senha deve ter pelo menos 6 caracteres.' }, { status: 400 })
    }

    const admin = getSupabaseAdmin()

    // Impede que o apelido de usuário colida com o de OUTRO usuário
    const { data: apelidoEmUso } = await admin
      .from('profiles')
      .select('id')
      .eq('usuario', usuario)
      .neq('id', id)
      .maybeSingle()

    if (apelidoEmUso) {
      return NextResponse.json({ status: 'error', message: 'Este nome de usuário já está em uso por outra pessoa.' }, { status: 400 })
    }

    // 1. Atualiza o perfil (nome, usuário, cargo)
    const { error: profileError } = await admin
      .from('profiles')
      .update({ nome, usuario, cargo })
      .eq('id', id)

    if (profileError) {
      console.error('Erro ao atualizar perfil:', profileError)
      return NextResponse.json({ status: 'error', message: 'Erro ao atualizar o perfil do usuário.', error: profileError.message }, { status: 500 })
    }

    // 2. Atualiza dados de autenticação (e-mail e/ou senha), se informados
    const authUpdate = {}
    if (email) authUpdate.email = email
    if (senha) authUpdate.password = senha

    if (Object.keys(authUpdate).length > 0) {
      const { error: authError } = await admin.auth.admin.updateUserById(id, authUpdate)
      if (authError) {
        console.error('Erro ao atualizar dados de acesso:', authError)
        const msg = authError?.message?.includes('already been registered')
          ? 'Este e-mail já está cadastrado para outro usuário.'
          : (authError?.message || 'Erro ao atualizar dados de acesso.')
        return NextResponse.json({ status: 'error', message: msg }, { status: 400 })
      }
    }

    return NextResponse.json({
      status: 'success',
      message: 'Usuário atualizado com sucesso',
      usuario: { id, nome, usuario, cargo }
    })
  } catch (error) {
    console.error('Erro no PUT usuários:', error)
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 })
  }
}

// DELETE - Remove um usuário (Auth + profiles em cascata)
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ status: 'error', message: 'ID do usuário é obrigatório' }, { status: 400 })
    }

    const admin = getSupabaseAdmin()

    // Remove do Auth (o perfil em profiles é removido em cascata pela FK
    // profiles_id_fkey -> auth.users, se configurada com ON DELETE CASCADE;
    // por segurança removemos o perfil também).
    await admin.from('profiles').delete().eq('id', id)
    const { error } = await admin.auth.admin.deleteUser(id)

    if (error) {
      console.error('Erro ao remover usuário:', error)
      return NextResponse.json({ status: 'error', message: 'Erro ao remover usuário', error: error.message }, { status: 500 })
    }

    return NextResponse.json({ status: 'success', message: 'Usuário removido com sucesso' })
  } catch (error) {
    console.error('Erro no DELETE usuários:', error)
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 })
  }
}
