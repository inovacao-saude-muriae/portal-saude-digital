import { supabase } from '@/lib/supabase';

/**
 * Função para buscar as notícias salvas na tabela 'noticias' do Supabase
 * e retornar um objeto indexado por ID
 */
export async function getDbNoticias() {
  try {
    const { data, error } = await supabase
      .from('noticias')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    const dbDinamico = {};

    (data || []).forEach((row) => {
      if (row.id) {
        const idStr = String(row.id).trim();
        dbDinamico[idStr] = {
          id: idStr,
          titulo: row.titulo || '',
          resumo: row.resumo || '',
          data: row.data || '',
          categoria: row.categoria || '',
          tipoCategoria: row.tipo_categoria || row.categoria || 'infra',
          imagem: row.imagem || '',
          conteudo: row.conteudo || '',
          autor: row.autor || ''
        };
      }
    });

    return dbDinamico;
  } catch (error) {
    console.error('Erro na requisição das notícias do Supabase:', error);
    return {};
  }
}

/**
 * Função para converter a string de data (DD/MM/YYYY ou YYYY-MM-DD) em um objeto Date
 */
export function converterParaDate(dataStr) {
  if (!dataStr) return new Date(0);
  const str = String(dataStr).trim();

  // Tratamento para datas no formato DD/MM/AAAA
  if (str.includes('/')) {
    const partes = str.split('/');
    if (partes.length === 3) {
      return new Date(`${partes[2]}-${partes[1]}-${partes[0]}T00:00:00`);
    }
  }

  // Tratamento para formato YYYY-MM-DD
  const dataParsed = new Date(str.includes('T') ? str : `${str}T00:00:00`);
  return isNaN(dataParsed.getTime()) ? new Date(0) : dataParsed;
}