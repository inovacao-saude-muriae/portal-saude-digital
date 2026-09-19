import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Helper: Converte nomes para CAIXA ALTA
function caixaAlta(texto) {
  if (!texto || typeof texto !== 'string') return '';
  return texto.trim().toUpperCase();
}

// Helper: Capitaliza palavras mantendo preposições em minúsculo
function capitalizarTexto(texto) {
  if (!texto || typeof texto !== 'string') return '';

  const preposicoes = new Set(['de', 'do', 'da', 'dos', 'das', 'e', 'em', 'com']);

  return texto
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((palavra, index) => {
      if (index > 0 && preposicoes.has(palavra)) {
        return palavra;
      }
      return palavra.charAt(0).toUpperCase() + palavra.slice(1);
    })
    .join(' ');
}

// GET — Consulta 2ª via por CPF ou total de vagas do evento
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const cpfBruto = searchParams.get('cpf');
    const eventoId = searchParams.get('eventoId');
    const eventoTitulo = searchParams.get('eventoTitulo');

    // -------------------------------------------------------------
    // CENÁRIO A: Busca de 2ª Via por CPF
    // -------------------------------------------------------------
    if (cpfBruto) {
      const cpfApenasNumeros = cpfBruto.replace(/\D/g, '');
      let cpfFormatado = cpfApenasNumeros;

      if (cpfApenasNumeros.length === 11) {
        cpfFormatado = cpfApenasNumeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      }

      const { data: inscricoes, error } = await supabase
        .from('evento_inscritos')
        .select('*')
        .or(`cpf.eq.${cpfBruto},cpf.eq.${cpfApenasNumeros},cpf.eq.${cpfFormatado}`);

      if (error) throw error;

      if (!inscricoes || inscricoes.length === 0) {
        return NextResponse.json({
          status: 'error',
          success: false,
          message: 'Nenhuma inscrição encontrada para o CPF informado.'
        }, { status: 200 });
      }

      let registro = inscricoes[0];

      if (eventoId || eventoTitulo) {
        const idBuscado = (eventoId || '').trim();
        const tituloBuscado = (eventoTitulo || '').toLowerCase().trim();

        const match = inscricoes.find((item) => {
          const itemEvtId = (item.evento_id || '').trim();
          const itemEvtTitulo = (item.evento_titulo || '').toLowerCase().trim();

          return (
            (idBuscado && itemEvtId === idBuscado) ||
            (tituloBuscado && itemEvtTitulo.includes(tituloBuscado))
          );
        });

        if (match) registro = match;
      }

      return NextResponse.json({
        status: 'success',
        success: true,
        inscricao: registro,
        comprovante: registro,
        data: registro,
        item: registro,
        total: inscricoes.length
      });
    }

    // -------------------------------------------------------------
    // CENÁRIO B: Contagem Total de Inscritos
    // -------------------------------------------------------------
    if (!eventoTitulo && !eventoId) {
      return NextResponse.json(
        { status: 'error', message: 'Informe eventoId, eventoTitulo ou cpf.' }, 
        { status: 400 }
      );
    }

    let countQuery = supabase.from('evento_inscritos').select('*', { count: 'exact', head: true });

    if (eventoId) {
      countQuery = countQuery.eq('evento_id', String(eventoId).trim());
    } else if (eventoTitulo) {
      countQuery = countQuery.ilike('evento_titulo', `%${eventoTitulo.trim()}%`);
    }

    const { count, error: countError } = await countQuery;

    if (countError) throw countError;

    return NextResponse.json({ status: 'success', total: count || 0 });

  } catch (error) {
    console.error('Erro na API de Inscrições (GET):', error);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}

// POST — Cadastra a inscrição validando duplicidade de CPF e existência do evento
export async function POST(request) {
  try {
    const body = await request.json();
    const { eventoId, eventoTitulo } = body;

    let targetEventoId = eventoId ? String(eventoId).trim() : null;

    // 1. Valida se o evento existe na tabela 'eventos'
    if (targetEventoId) {
      const { data: eventoExiste } = await supabase
        .from('eventos')
        .select('id, vagas_maximo, inscricoes_encerradas')
        .eq('id', targetEventoId)
        .maybeSingle();

      if (!eventoExiste) {
        targetEventoId = null;
      } else {
        if (eventoExiste.inscricoes_encerradas) {
          return NextResponse.json(
            { status: 'error', message: 'As inscrições para este evento já foram encerradas.' },
            { status: 400 }
          );
        }

        if (eventoExiste.vagas_maximo) {
          const { count } = await supabase
            .from('evento_inscritos')
            .select('codigo_inscricao', { count: 'exact', head: true })
            .eq('evento_id', targetEventoId);

          if (count >= eventoExiste.vagas_maximo) {
            return NextResponse.json(
              { status: 'error', message: 'As vagas para este evento foram esgotadas.' },
              { status: 400 }
            );
          }
        }
      }
    }

    // Fallback de ID pelo Título
    if (!targetEventoId) {
      const { data: eventoPorTitulo } = await supabase
        .from('eventos')
        .select('id')
        .ilike('titulo', `%${(eventoTitulo || '').trim()}%`)
        .limit(1)
        .maybeSingle();

      targetEventoId = eventoPorTitulo ? eventoPorTitulo.id : 'evt-4';
    }

    // Processamento e formatação dos campos do formulário
    let respostasTratadas = {};
    let nomeInscrito = '';
    let cpfInscrito = '';
    let emailInscrito = '';

    if (body.respostas && Array.isArray(body.respostas)) {
      body.respostas.forEach((item) => {
        let valor = item.valor;
        const label = (item.label || '').toLowerCase().trim();

        if (typeof valor === 'string') {
          if (label.includes('nome')) {
            valor = caixaAlta(valor);
            nomeInscrito = valor;
          } else if (label.includes('cpf')) {
            cpfInscrito = valor.trim();
          } else if (label.includes('email') || label.includes('e-mail')) {
            emailInscrito = valor.toLowerCase().trim();
          } else {
            valor = capitalizarTexto(valor);
          }
        }

        respostasTratadas[item.label] = valor;
      });
    }

    const cpfFinal = cpfInscrito || respostasTratadas['CPF'] || '';

    // -------------------------------------------------------------
    // VALIDAÇÃO DE CPF DUPLICADO NO MESMO EVENTO
    // -------------------------------------------------------------
    if (cpfFinal) {
      const cpfLimpo = cpfFinal.replace(/\D/g, '');
      let cpfComMascara = cpfLimpo;
      if (cpfLimpo.length === 11) {
        cpfComMascara = cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      }

      // Procura por qualquer cadastro com esse CPF no mesmo evento_id
      const { data: inscricaoDuplicada } = await supabase
        .from('evento_inscritos')
        .select('codigo_inscricao')
        .eq('evento_id', targetEventoId)
        .or(`cpf.eq.${cpfFinal},cpf.eq.${cpfLimpo},cpf.eq.${cpfComMascara}`)
        .limit(1)
        .maybeSingle();

      if (inscricaoDuplicada) {
        return NextResponse.json({
          status: 'error',
          message: 'Este CPF já possui uma inscrição cadastrada para este evento.'
        }, { status: 400 });
      }
    }

    // Gera o código INS-XXXXXX único
    let codigoInscricao = '';
    let codigoExiste = true;
    let tentativas = 0;

    while (codigoExiste && tentativas < 5) {
      tentativas++;
      const numRand = Math.floor(100000 + Math.random() * 900000);
      codigoInscricao = `INS-${numRand}`;

      const { count } = await supabase
        .from('evento_inscritos')
        .select('codigo_inscricao', { count: 'exact', head: true })
        .eq('codigo_inscricao', codigoInscricao);

      if (!count || count === 0) {
        codigoExiste = false;
      }
    }

    const payload = {
      codigo_inscricao: codigoInscricao,
      evento_id: targetEventoId,
      evento_titulo: eventoTitulo || 'TURMA 01| COMUNICAÇÃO ASSERTIVA E RESOLUTIVIDADE NA ATENÇÃO PRIMÁRIA',
      nome: nomeInscrito || respostasTratadas['Nome Completo'] || 'Inscrito',
      cpf: cpfFinal,
      email: emailInscrito || respostasTratadas['E-mail'] || '',
      respostas: respostasTratadas,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('evento_inscritos')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      status: 'success',
      message: 'Inscrição realizada com sucesso!',
      codigo: codigoInscricao,
      inscrito: data
    });

  } catch (error) {
    console.error('Erro na API de Inscrições do Supabase:', error);
    return NextResponse.json(
      { status: 'error', message: 'Falha interna ao registrar inscrição no banco de dados: ' + error.message },
      { status: 500 }
    );
  }
}