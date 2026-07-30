// src/data/noticiasData.js

export const dbNoticias = {
    "saude-digital-muriae": {
        titulo: "Saúde Digital Muriaé moderniza atendimento e fortalece transparência no SUS municipal",
        resumo: "A Prefeitura de Muriaé, por meio da Secretaria Municipal de Saúde, lança oficialmente o Saúde Digital Muriaé.",
        data: "28 Mar 2026",
        categoria: "Inovação",
        tipoCategoria: "infra",
        imagem: "/img/noticias/noticia1.jpeg", 
        conteudo: `A Prefeitura Municipal de Muriaé por meio da Secretaria Municipal de Saúde de Muriaé lança oficialmente o Saúde Digital Muriaé, uma nova plataforma que amplia o acesso da população às informações e aos serviços da rede pública de saúde do município.
        A iniciativa representa mais um avanço no processo de modernização da gestão, fortalecendo a transparência, a organização dos atendimentos e a aproximação entre o cidadão e o Sistema Único de Saúde no município de Muriaé.
        Por meio da plataforma, os usuários poderão acompanhar informações completas sobre consultas agendadas, incluindo data, horário, local e profissional responsável. Também estará disponível a ferramenta de confirmação de consultas, contribuindo para a redução das faltas às consultas previamente agendadas e para a melhor organização das agendas nas unidades de saúde.
        Outra funcionalidade importante é a consulta à posição na fila de espera para procedimentos e atendimentos especializados, com estimativa de tempo, garantindo maior transparência e previsibilidade ao cidadão.
        O Saúde Digital Muriaé ainda disponibiliza lista atualizada de médicos, hospitais e unidades de saúde da rede municipal, com contatos e localização, além de permitir o acesso seguro aos dados pessoais e familiares cadastrados.
        O acesso à plataforma será realizado mediante CPF e senha disponibilizada pela Unidade Básica de Saúde (UBS), assegurando a proteção das informações e o uso responsável dos dados.
        Além das funcionalidades de acompanhamento e gestão de atendimentos, o espaço também contará com a divulgação de notícias, campanhas, orientações e comunicados oficiais da saúde municipal.
        Com a implantação do Saúde Digital Muriaé, a Secretaria Municipal de Saúde reafirma seu compromisso com a inovação, a eficiência dos serviços públicos e a ampliação do acesso à informação qualificada, promovendo mais agilidade, organização e proximidade no cuidado com a população.`
    },

    "Dia-B": {
        titulo: "Muriaé realiza Dia B da Saúde Bucal com ações educativas nas UBS e escolas do município",
        resumo: "Muriaé promoveu o Dia B da Saúde Bucal, uma mobilização organizada pela Secretaria Municipal de Saúde.",
        data: "14 Fev 2026",
        categoria: "Campanha",
        tipoCategoria: "vacinacao",
        imagem: "/img/noticias/noticia2.jpeg",
        conteudo: `Nesta semana, Muriaé promoveu o Dia B da Saúde Bucal, uma mobilização organizada pela Secretaria Municipal de Saúde com foco na conscientização e orientação da população sobre os cuidados com a saúde bucal.
        A ação levou informações importantes às Unidades Básicas de Saúde (UBS), reforçando os serviços disponíveis e destacando a importância da prevenção para a saúde como um todo.
        Além disso, diversas escolas do município receberam atividades educativas, com palestras sobre higiene bucal e momentos de escovação supervisionada, incentivando hábitos saudáveis desde a infância. Em algumas unidades, a presença do personagem “Dentão” trouxe ainda mais entusiasmo, aproximando o tema das crianças de forma lúdica.
        A iniciativa reforça o compromisso do município com a promoção da saúde, ampliando o acesso à informação e incentivando o cuidado contínuo da população.
        O trabalho segue fortalecendo a prevenção e a atenção básica, pilares fundamentais para a qualidade de vida dos muriaeenses.`
    },

    "entrega-EPIs": {
        titulo: "Mais proteção para quem cuida: Muriaé entrega EPIs a agentes de endemias.",
        resumo: "Valorizar quem está na linha de frente é também fortalecer a prevenção. Em Muriaé, o cuidado com os servidores tem sido prioridade.",
        data: "14 Fev 2026",
        categoria: "Novidades",
        tipoCategoria: "infra",
        imagem: "/img/noticias/noticia3.jpeg",
        conteudo: `Valorizar quem está na linha de frente é também fortalecer a prevenção. Em Muriaé, o cuidado com os servidores tem sido prioridade, refletindo diretamente na proteção de toda a população.
        Diariamente, os agentes de combate às endemias percorrem ruas e comunidades do município em um trabalho silencioso, contínuo e essencial no enfrentamento à dengue. São eles que estão nas visitas domiciliares, orientando moradores e atuando na eliminação de focos do mosquito.
        Agora, esse trabalho ganha um reforço importante: Muriaé se torna o primeiro município da microregião a garantir novos Equipamentos de Proteção Individual (EPIs) para esses profissionais. A iniciativa oferece mais segurança, conforto e melhores condições de trabalho para quem enfrenta o sol, longas caminhadas e a exposição diária.
        A ação representa um avanço significativo no fortalecimento da prevenção e no cuidado com os profissionais que estão na linha de frente.
        A Secretaria Municipal de Saúde segue firme no compromisso com a saúde pública, investindo em ações que valorizam os servidores e ampliam a proteção da população no combate à dengue.`
    }
};

// Dicionário e função utilitária para ordenação por data
const mesesMap = {
    jan: 0, fev: 1, mar: 2, abr: 3, mai: 4, jun: 5,
    jul: 6, ago: 7, set: 8, out: 9, nov: 10, dez: 11
};

export const converterParaDate = (dataString) => {
    if (!dataString) return new Date(0);
    const [dia, mesTexto, ano] = dataString.toLowerCase().split(' ');
    const mesNumero = mesesMap[mesTexto] || 0;
    return new Date(parseInt(ano, 10), mesNumero, parseInt(dia, 10));
};