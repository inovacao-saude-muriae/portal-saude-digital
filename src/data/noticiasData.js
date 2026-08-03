import Papa from 'papaparse';

// COLE AQUI O LINK DO SEU GOOGLE SHEETS PUBLICADO EM CSV (.csv)
const GOOGLE_SHEETS_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRqaHp2GoWXoHsYmsELjBXVwfVvserOmyipeTHbvxAq939fLXoArpDEIMwCFqdB_3lPSS89Yyq6Ncv4/pub?output=csv";

// Notícias estáticas padrão (Ficam como fallback se o Sheets estiver vazio ou falhar)
const noticiasEstaticas = {
    "saude-digital-muriae": {
        titulo: "Saúde Digital Muriaé moderniza atendimento e fortalece transparência no SUS municipal",
        resumo: "A Prefeitura de Muriaé, por meio da Secretaria Municipal de Saúde, lança oficialmente o Saúde Digital Muriaé.",
        data: "28 Mar 2026",
        categoria: "Inovação",
        tipoCategoria: "infra",
        imagem: "/img/noticias/noticia1.jpeg", 
        conteudo: `A Prefeitura Municipal de Muriaé por meio da Secretaria Municipal de Saúde...`
    },
    "Dia-B": {
        titulo: "Muriaé realiza Dia B da Saúde Bucal com ações educativas nas UBS e escolas do município",
        resumo: "Muriaé promoveu o Dia B da Saúde Bucal, uma mobilização organizada pela Secretaria Municipal de Saúde.",
        data: "14 Fev 2026",
        categoria: "Campanha",
        tipoCategoria: "vacinacao",
        imagem: "/img/noticias/noticia2.jpeg",
        conteudo: `Nesta semana, Muriaé promoveu o Dia B da Saúde Bucal...`
    },
    "entrega-EPIs": {
        titulo: "Mais proteção para quem cuida: Muriaé entrega EPIs a agentes de endemias.",
        resumo: "Valorizar quem está na linha de frente é também fortalecer a prevenção. Em Muriaé, o cuidado com os servidores tem sido prioridade.",
        data: "14 Fev 2026",
        categoria: "Novidades",
        tipoCategoria: "infra",
        imagem: "/img/noticias/noticia3.jpeg",
        conteudo: `Valorizar quem está na linha de frente é também fortalecer a prevenção...`
    }
};

const mesesMap = {
    jan: 0, fev: 1, mar: 2, abr: 3, mai: 4, jun: 5,
    jul: 6, ago: 7, set: 8, out: 9, nov: 10, dez: 11
};

export const converterParaDate = (dataString) => {
    if (!dataString) return new Date(0);
    const partes = dataString.toLowerCase().replace('.', '').split(' ');
    if (partes.length < 3) return new Date(0);
    const dia = partes[0];
    const mesTexto = partes[1];
    const ano = partes[2];
    const mesNumero = mesesMap[mesTexto] !== undefined ? mesesMap[mesTexto] : 0;
    return new Date(parseInt(ano, 10), mesNumero, parseInt(dia, 10));
};

// FUNÇÃO DINÂMICA QUE BUSCA AS NOTÍCIAS DO GOOGLE SHEETS
export async function getDbNoticias() {
    try {
        if (!GOOGLE_SHEETS_CSV_URL || GOOGLE_SHEETS_CSV_URL.includes("SEU_LINK")) {
            return noticiasEstaticas;
        }

        const response = await fetch(GOOGLE_SHEETS_CSV_URL, {
            cache: 'no-store' // Garante que notícias novas apareçam instantaneamente sem cache represado
        });

        const csvText = await response.text();

        const { data } = Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true
        });

        const noticiasDoSheets = {};

        data.forEach((row) => {
            if (row.id && row.titulo) {
                noticiasDoSheets[row.id] = {
                    titulo: row.titulo,
                    resumo: row.resumo,
                    data: row.data,
                    categoria: row.categoria,
                    tipoCategoria: row.tipoCategoria,
                    imagem: row.imagem,
                    conteudo: row.conteudo
                };
            }
        });

        // Retorna as notícias do Sheets + as estáticas combinadas
        return { ...noticiasEstaticas, ...noticiasDoSheets };

    } catch (error) {
        console.error("Erro ao carregar notícias do Google Sheets:", error);
        return noticiasEstaticas;
    }
}