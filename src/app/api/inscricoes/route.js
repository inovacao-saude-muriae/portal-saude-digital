import { NextResponse } from 'next/server';

// Tempo máximo de espera para o GAS responder (30 segundos)
export const maxDuration = 30;

// 1. Converte TUDO para CAIXA ALTA 
function caixaAlta(texto) {
  if (!texto || typeof texto !== 'string') return '';
  return texto.trim().toUpperCase();
}

// 2. Converte para Iniciais Maiúsculas 
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

const SCRIPT_URL =
  process.env.NEXT_PUBLIC_SCRIPT_URL ||
  'https://script.google.com/macros/s/AKfycbx1tWcH_pkyhUNdR1safUWAGrlNfJWSMRqSps09p7yc5lBXO2c5iEGJXQl5Sz2bmPex/exec';

// GET — retorna a contagem de inscrições de um evento
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventoTitulo = searchParams.get('eventoTitulo');

    if (!eventoTitulo) {
      return NextResponse.json({ status: 'error', message: 'Parâmetro eventoTitulo obrigatório.' }, { status: 400 });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    try {
      const url = `${SCRIPT_URL}?action=GET_INSCRITOS&eventoTitulo=${encodeURIComponent(eventoTitulo)}`;
      const res = await fetch(url, { method: 'GET', redirect: 'follow', signal: controller.signal });
      clearTimeout(timeout);
      const text = await res.text();

      let data = {};
      try { data = JSON.parse(text); } catch { data = { status: 'error' }; }

      const total = Array.isArray(data.inscritos) ? data.inscritos.length : 0;
      return NextResponse.json({ status: 'success', total });
    } catch (fetchErr) {
      clearTimeout(timeout);
      throw fetchErr;
    }

  } catch (error) {
    console.error('Erro ao contar inscrições:', error);
    return NextResponse.json({ status: 'error', total: 0 }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    // TRATAMENTO DAS RESPOSTAS DO FORMULÁRIO
    if (body.respostas && Array.isArray(body.respostas)) {
      body.respostas = body.respostas.map((item) => {
        let valor = item.valor;
        const label = (item.label || '').toLowerCase().trim();

        if (typeof valor === 'string') {
          if (label.includes('nome')) {
            valor = caixaAlta(valor);
          } else if (!label.includes('email') && !label.includes('cpf') && !label.includes('e-mail')) {
            valor = capitalizarTexto(valor);
          }
        }

        return { ...item, valor };
      });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    try {
      const googleResponse = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      const textResponse = await googleResponse.text();
      let resData = {};
      try {
        resData = JSON.parse(textResponse);
      } catch (e) {
        resData = { status: 'success' };
      }

      return NextResponse.json(resData);

    } catch (fetchErr) {
      clearTimeout(timeout);
      if (fetchErr.name === 'AbortError') {
        return NextResponse.json(
          { status: 'error', message: 'O servidor demorou muito para responder. Verifique sua inscrição pela opção "Emitir 2ª via" antes de tentar novamente.' },
          { status: 504 }
        );
      }
      throw fetchErr;
    }

  } catch (error) {
    console.error('Erro na API de Inscrições:', error);
    return NextResponse.json(
      { status: 'error', message: 'Falha interna no processamento da inscrição.' },
      { status: 500 }
    );
  }
}