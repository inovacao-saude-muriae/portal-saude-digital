import Papa from 'papaparse';

// LINK DO GOOGLE SHEETS PUBLICADO EM CSV
const GOOGLE_SHEETS_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRqaHp2GoWXoHsYmsELjBXVwfVvserOmyipeTHbvxAq939fLXoArpDEIMwCFqdB_3lPSS89Yyq6Ncv4/pub?output=csv";

// Sem notícias estáticas (dados 100% dinâmicos do Google Sheets)
const noticiasEstaticas = {};

/**
 * Função para buscar e converter as notícias da planilha em um objeto indexado por ID/Slug
 */
export async function getDbNoticias() {
  try {
    const response = await fetch(`${GOOGLE_SHEETS_CSV_URL}&_t=${Date.now()}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Falha ao carregar notícias do CSV.');
    }

    const csvText = await response.text();

    return new Promise((resolve) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const dbDinamico = {};

          results.data.forEach((row) => {
            const id = row.id || row.ID || row.Id;
            if (id) {
              dbDinamico[String(id).trim()] = {
                id: String(id).trim(),
                titulo: row.titulo || row.Titulo || '',
                resumo: row.resumo || row.Resumo || '',
                data: row.data || row.Data || '',
                categoria: row.categoria || row.Categoria || '',
                tipoCategoria: row.tipoCategoria || row.tipo || 'infra',
                imagem: row.imagem || row.Imagem || '/img/noticias/noticia1.jpeg',
                conteudo: row.conteudo || row.Conteudo || ''
              };
            }
          });

          resolve(dbDinamico);
        },
        error: (err) => {
          console.error('Erro ao converter CSV:', err);
          resolve({});
        }
      });
    });
  } catch (error) {
    console.error('Erro na requisição das notícias do Google Sheets:', error);
    return {};
  }
}

/**
 * Função utilitária para conversão resiliente de datas no padrão BR ou ISO
 */
export function converterParaDate(dataStr) {
  if (!dataStr) return new Date(0);
  const str = String(dataStr).trim();

  // Tratamento para datas no formato DD/MM/AAAA ou DD MMM AAAA
  if (str.includes('/')) {
    const partes = str.split('/');
    if (partes.length === 3) {
      return new Date(`${partes[2]}-${partes[1]}-${partes[0]}T00:00:00`);
    }
  }

  // Tratamento para YYYY-MM-DD
  const dataParsed = new Date(str.includes('T') ? str : `${str}T00:00:00`);
  return isNaN(dataParsed.getTime()) ? new Date(0) : dataParsed;
}