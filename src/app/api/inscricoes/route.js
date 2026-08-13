import { NextResponse } from 'next/server';

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

export async function POST(request) {
  try {
    const body = await request.json();

    // TRATAMENTO DAS RESPOSTAS DO FORMULÁRIO
    if (body.respostas && Array.isArray(body.respostas)) {
      body.respostas = body.respostas.map((item) => {
        let valor = item.valor;
        const label = (item.label || '').toLowerCase().trim();

        if (typeof valor === 'string') {
          // SE FOR NOME: Converte para CAIXA ALTA (TUDO MAIÚSCULO)
          if (label.includes('nome')) {
            valor = caixaAlta(valor);
          } 
          // SE NÃO FOR E-MAIL NEM CPF: Aplica iniciais maiúsculas (Capitalize)
          else if (!label.includes('email') && !label.includes('cpf') && !label.includes('e-mail')) {
            valor = capitalizarTexto(valor);
          }
        }

        return {
          ...item,
          valor: valor
        };
      });
    }

    // Leitura da URL do Google Script com URL padrão de reserva (fallback)
    const scriptUrl = 
      process.env.NEXT_PUBLIC_SCRIPT_URL || 
      'https://script.google.com/macros/s/AKfycbx1tWcH_pkyhUNdR1safUWAGrlNfJWSMRqSps09p7yc5lBXO2c5iEGJXQl5Sz2bmPex/exec';

    const googleResponse = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(body),
    });

    const textResponse = await googleResponse.text();
    let resData = {};
    try {
      resData = JSON.parse(textResponse);
    } catch (e) {
      resData = { status: 'success' };
    }

    return NextResponse.json(resData);

  } catch (error) {
    console.error('Erro na API de Inscrições:', error);
    return NextResponse.json(
      { status: 'error', message: 'Falha interna no processamento da inscrição.' },
      { status: 500 }
    );
  }
}