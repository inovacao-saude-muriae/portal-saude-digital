import Papa from 'papaparse';

// LINK DO GOOGLE SHEETS PUBLICADO EM CSV
const GOOGLE_SHEETS_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRqaHp2GoWXoHsYmsELjBXVwfVvserOmyipeTHbvxAq939fLXoArpDEIMwCFqdB_3lPSS89Yyq6Ncv4/pub?output=csv";

// Notícias estáticas padrão (Fallback)
const noticiasEstaticas = {
    "saude-digital-muriae": {
        titulo: "Saúde Digital Muriaé moderniza atendimento e fortalece transparência no SUS municipal",
        resumo: "A Prefeitura de Muriaé, por meio da Secretaria Municipal de Saúde, lança oficialmente o Saúde Digital Muriaé.",
        data: "28 Mar 2026",
        categoria: "Inovação",
        tipoCategoria: "infra",
        imagem: "/img/noticias/noticia1.jpeg", 
        conteudo: `A Prefeitura Municipal de Muriaé por meio da Secretaria Municipal de Saúde de Muriaé lança oficialmente o Saúde Digital Muriaé, uma nova plataforma que amplia o acesso da população às informações e aos serviços da rede pública de saúde do município.`
    },
    "Dia-B": {
        titulo: "Muriaé realiza Dia B da Saúde Bucal com ações educativas nas UBS e escolas do município",
        resumo: "Muriaé promoveu o Dia B da Saúde Bucal, uma mobilização organizada pela Secretaria Municipal de Saúde.",
        data: "14 Fev 2026",
        categoria: "Campanha",
        tipoCategoria: "vacinacao",
        imagem: "/img/noticias/noticia2.jpeg",
        conteudo: `Nesta semana, Muriaé promoveu o Dia B da Saúde Bucal, uma mobilização organizada pela Secretaria Municipal de Saúde com foco na conscientização e orientação da população sobre os cuidados com a saúde bucal.`
    },
    "entrega-EPIs": {
        titulo: "Mais proteção para quem cuida: Muriaé entrega EPIs a agentes de endemias.",
        resumo: "Valorizar quem está na linha de frente é também fortalecer a prevenção. Em Muriaé, o cuidado com os servidores tem sido prioridade.",
        data: "14 Fev 2026",
        categoria: "Novidades",
        tipoCategoria: "infra",
        imagem: "/img/noticias/noticia3.jpeg",
        conteudo: `Valorizar quem está na linha de frente é também fortalecer a prevenção. Em Muriaé, o cuidado com os servidores tem sido prioridade, refletindo diretamente na proteção de toda a população.`
    }
};

const mesesMap = {
    jan: 0, fev: 1, mar: 2, abr: 3, mai: 4, jun: 5,
    jul: 6, ago: 7, set: 8, out: 9, nov: 10, dez: 11
};

// CONVERSOR DE DATA APRIMORADO (Lida com "03 de ago de 2026", "28/03/2026", etc.)
export const converterParaDate = (dataString) => {
    if (!dataString) return new Date(0);

    // Remove a palavra 'de', pontos e espaços extras (ex: "03 de ago de 2026" vira "03 ago 2026")
    const stringLimpa = dataString
        .toString()
        .trim()
        .toLowerCase()
        .replace(/\bde\b/g, '') // Remove a palavra 'de' isolada
        .replace(/\./g, '')
        .replace(/\s+/g, ' '); // Unifica múltiplos espaços em um só

    // 1. Caso o formato seja com barras (ex: "03/08/2026")
    if (stringLimpa.includes('/')) {
        const partes = stringLimpa.split('/');
        if (partes.length === 3) {
            const dia = parseInt(partes[0], 10);
            const mes = parseInt(partes[1], 10) - 1;
            const ano = parseInt(partes[2], 10);
            return new Date(ano, mes, dia);
        }
    }

    // 2. Caso seja texto extenso (ex: "03 ago 2026")
    const partesEspaco = stringLimpa.split(' ');
    if (partesEspaco.length >= 3) {
        const dia = parseInt(partesEspaco[0], 10);
        const mesTexto = partesEspaco[1];
        const ano = parseInt(partesEspaco[2], 10);
        const mesNumero = mesesMap[mesTexto] !== undefined ? mesesMap[mesTexto] : 0;
        return new Date(ano, mesNumero, dia);
    }

    const dataPadrao = new Date(dataString);
    return isNaN(dataPadrao.getTime()) ? new Date(0) : dataPadrao;
};

// FUNÇÃO QUE LÊ O GOOGLE SHEETS
export async function getDbNoticias() {
    try {
        if (!GOOGLE_SHEETS_CSV_URL) {
            return noticiasEstaticas;
        }

        const response = await fetch(GOOGLE_SHEETS_CSV_URL, {
            cache: 'no-store'
        });

        const csvText = await response.text();

        const { data } = Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true
        });

        const noticiasDoSheets = {};

        data.forEach((row) => {
            // Pega 'id' e 'titulo' ignorando maiúsculas/minúsculas no cabeçalho
            const idNoticia = row.id || row.ID;
            const tituloNoticia = row.titulo || row.Titulo || row.TÍTULO;

            if (idNoticia && tituloNoticia) {
                noticiasDoSheets[idNoticia] = {
                    titulo: tituloNoticia,
                    resumo: row.resumo || '',
                    data: row.data || '',
                    categoria: row.categoria || 'Geral',
                    // Aceita tanto "tipoCategoria" quanto "tipo categoria"
                    tipoCategoria: row.tipoCategoria || row['tipo categoria'] || 'infra',
                    imagem: row.imagem || '',
                    conteudo: row.conteudo || ''
                };
            }
        });

        // Retorna primeiro as notícias do Sheets combinadas com as estáticas
        return { ...noticiasEstaticas, ...noticiasDoSheets };

    } catch (error) {
        console.error("Erro ao carregar notícias do Google Sheets:", error);
        return noticiasEstaticas;
    }
}