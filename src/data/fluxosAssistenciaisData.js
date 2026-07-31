export const fluxosAssistenciaisData = [
  {
    id: 'cardiologia',
    titulo: 'Cardiologia',
    submodulos: [
      {
        id: 'angioplastia',
        titulo: 'Angioplastia',
        texto: `A angioplastia é um procedimento que os médicos fazem para “desentupir” as artérias, que são os “caminhos” por onde o sangue passa no nosso corpo. Quando essas artérias ficam estreitas ou entupidas, o sangue não consegue passar direito, o que pode causar dor no peito, falta de ar ou até infarto, se for no coração.\n\nDurante a angioplastia, o médico coloca um cateter com um balão na ponta dentro da artéria entupida. Esse balão é inflado para abrir a passagem e deixar o sangue circular melhor. Muitas vezes, também é colocado uma pequena “molinha” de metal, chamado Stent, que ajuda a manter a artéria aberta. Esse procedimento pode ser feito nas artérias do coração ou de outras partes do corpo e ajuda a melhorar os sintomas e evitar problemas mais graves.\n\nÉ um procedimento muito importante e seguro, feito em hospital, que ajuda a cuidar bem do coração, mas é muito importante seguir todas as orientações antes do procedimento. Abaixo apresentamos os fluxos de atendimentos para quem mora em Muriaé e para quem mora em outros municípios, que tem referência de atendimento aqui. Lembrando que a Angioplastia pode ser realizada tanto no Hospital São Paulo quanto no Prontocor, que são os hospitais habilitados pelo Ministério da Saúde para realização do tratamento pelo SUS. Antes de realizar o procedimento, é muito importante seguir TODAS as orientações para que tudo dê certinho!!`,
        imagens: [
          { src: '/img/fluxos-assistenciais/cardiologia/angioplastia/fluxo.png', alt: 'Fluxo Angioplastia' },
          { src: '/img/fluxos-assistenciais/cardiologia/angioplastia/pactuacao-endovascular.png', alt: 'Pactuação Endovascular' },
          { src: '/img/fluxos-assistenciais/cardiologia/angioplastia/pactuacao-intervencionista.png', alt: 'Pactuação Intervencionista' }
        ]
      },
      {
        id: 'cateterismo',
        titulo: 'Cateterismo',
        texto: `O cateterismo cardíaco é um exame que os médicos usam para ver se as veias do coração (chamadas artérias coronárias) estão entupidas ou com algum outro tipo de problema. Ele ajuda a descobrir se o sangue está passando direitinho pelo coração ou se tem algum bloqueio que pode causar dor no peito ou até um infarto.\n\nNo exame, o médico coloca um tubo bem fininho (chamado cateter) dentro da artéria, geralmente na perna ou no braço, e leva até o coração. Depois, ele injeta um líquido de contraste que aparece nas imagens do raio-X, mostrando se há alteração. É um exame muito importante e seguro, feito em hospital, que ajuda a cuidar bem do coração e decidir o melhor tratamento, mas é muito importante seguir todas as orientações antes do procedimento.\n\nAbaixo apresentamos os fluxos de atendimentos para quem mora em Muriaé e para quem mora em outros municípios, que tem referência de atendimento aqui. Lembrando que o Cateterismo pode ser realizado pelo SUS tanto no Hospital São Paulo quanto no Prontocor, que são os hospitais habilitados pelo Ministério da Saúde para realização deste exame.`,
        imagens: [
          { src: '/img/fluxos-assistenciais/cardiologia/cateterismo/fluxo.png', alt: 'Fluxo Cateterismo' },
          { src: '/img/fluxos-assistenciais/cardiologia/cateterismo/pactuacao.png', alt: 'Pactuação Cateterismo' }
        ]
      },
      {
        id: 'cirurgia-cardiaca',
        titulo: 'Cirurgia Cardíaca',
        texto: `A cirurgia cardíaca é um tipo de operação feita para tratar problemas no coração, principalmente quando as artérias (os “caminhos” por onde o sangue passa) estão entupidas ou muito estreitas. Quando isso acontece, o sangue não consegue chegar bem ao coração, o que pode causar dores no peito, falta de ar ou até infarto. Nessa cirurgia, os médicos fazem um "desvio" no local entupido usando um pedaço de veia ou artéria de outra parte do corpo. É como se fizessem uma nova estrada para o sangue passar sem dificuldade. Esse procedimento é conhecido como "ponte de safena" quando usam uma veia da perna.\n\nOutra cirurgia cardíaca é para a troca de válvula, que é feita quando uma das válvulas do coração não está funcionando direito. As válvulas são como “portinhas” dentro do coração que controlam a passagem do sangue. Quando elas estão endurecidas, com vazamentos ou muito apertadas, o sangue não circula como deveria. Nesse tipo de cirurgia, os médicos retiram a válvula que está com problema e colocam uma nova no lugar. Essa nova válvula pode ser feita de metal ou de tecido (geralmente de porco ou boi).\n\nÉ uma cirurgia mais complexa, feita no hospital, com equipe especializada, e serve para melhorar a circulação do sangue e proteger o coração de problemas mais graves. Para confirmar a indicação da cirurgia, primeiro agendamos - pelo SUS - a consulta com o cirurgião. Assim que for confirmed que o tratamento precisa de cirurgia, procure a Secretaria de Saúde de seu município para cadastrar a solicitação de cirurgia e a SMS de Muriaé irá autorizar. Seguindo todo o fluxo, que está logo abaixo, o tratamento é TODO feito pelo SUS, em um dos prestadores habilitados para a Cirurgia Cardíaca em Muriaé - Hospital São Paulo ou Prontocor.`,
        imagens: [
          { src: '/img/fluxos-assistenciais/cardiologia/cirurgia/fluxo1.png', alt: 'Fluxo Cirurgia Cardíaca' },
          { src: '/img/fluxos-assistenciais/cardiologia/cirurgia/pactuacao.png', alt: 'Pactuação Cirurgia Cardíaca' }
        ]
      },
      {
        id: 'eletrofisiologia',
        titulo: 'Eletrofisiologia',
        texto: `Os procedimentos de eletrofisiologia são exames e tratamentos que os médicos fazem para investigar e cuidar dos batimentos do coração, especialmente quando ele bate muito rápido, muito devagar ou de forma descompassada (as famosas arritmias).\n\nNesse tipo de procedimento, os médicos colocam fios fininhos (chamados cateteres) dentro do coração, através de uma veia, para estudar como está passando a eletricidade que comanda os batimentos. Se for preciso, eles podem fazer um tratamento chamado ablação, que “queima” ou “desativa” o ponto do coração que está causando a arritmia.\n\nEm alguns casos, há necessidade de colocar o marcapasso. O marca-passo é um aparelhinho que ajuda o coração a bater no ritmo certo. Ele pode ser indicado quando o coração está batendo muito devagar ou de forma irregular, o que pode causar cansaço, tontura, desmaios e até risco maior para a saúde. Com o implante do marca-passo, o coração volta a funcionar melhor, ajudando a pessoa a ter mais qualidade de vida e segurança no dia a dia. Se o médico recomendou o uso do marca-passo, é porque ele avaliou que essa é a melhor forma de cuidar do seu coração. São procedimentos seguros, feitos no hospital, e que ajudam a controlar os batimentos e melhorar a qualidade de vida da pessoa. Em Muriaé os atendimentos são realizados no Prontocor!`,
        imagens: [
          { src: '/img/fluxos-assistenciais/cardiologia/eletrofisiologia/fluxo.png', alt: 'Fluxo Eletrofisiologia' },
          { src: '/img/fluxos-assistenciais/cardiologia/eletrofisiologia/pactuacao.png', alt: 'Pactuação Eletrofisiologia' }
        ]
      }
    ]
  },
  {
    id: 'cintilografia',
    titulo: 'Cintilografia',
    submodulos: [
      {
        id: 'cintilografia-geral',
        titulo: 'Exames de imagem de Alta Complexidade',
        texto: `A Secretaria Municipal de Saúde de Muriaé disponibiliza exames de imagem avançados como tomografia computadorizada (TC), ressonância magnética nuclear (RNM) e cintilografia pelo SUS, conforme indicação médica. Esses exames são fundamentais para diagnósticos mais precisos e detalhados, auxiliando no acompanhamento e tratamento de diversas condições de saúde.\n\nPara que a solicitação seja autorizada, é imprescindible que o pedido esteja corretamente preenchido no formulário APAC (Autorização de Procedimentos de Alta Complexidade). A falta de informações pode atrasar a liberação do exame.\n\nAtenção ao formulário correto e fique atento às orientações e garanta o acesso ao exame de forma segura e organizada!\n\nAtenção: Em caso de dúvida sobre o fluxo ou agendamento, entre em contato com a Secretaria Municipal de Saúde.`,
        imagens: [
          { src: '/img/fluxos-assistenciais/cintilografia/fluxo.png', alt: 'Fluxo Cintilografia' },
          { src: '/img/fluxos-assistenciais/cintilografia/pactuacao.png', alt: 'Pactuação Cintilografia' }
        ]
      }
    ]
  },
  {
    id: 'cirurgia-geral',
    titulo: 'Cirurgia Geral',
    submodulos: [
      {
        id: 'cirurgia-geral-sub',
        titulo: 'Cuidado e Compromisso com a Saúde',
        texto: `Cirurgias gerais pelo SUS em Muriaé: cuidado, segurança e compromisso com a sua saúde! As cirurgias gerais mais comuns, como hérnia (umbilical e inguinal), retirada da vesícula biliar e remoção de cistos, normalmente são indicadas após avaliação médica detalhada. Quando existe a necessidade da cirurgia, é importante seguir todas as etapas do atendimento para garantir mais segurança e qualidade no tratamento.\n\nA Secretaria Municipal de Saúde de Muriaé, por meio do programa Opera Já Muriaé, garante a realização de todos os exames e consultas do pré-operatório pelo SUS, oferecendo atendimento completo, acolhedor e sem custos para a população.\n\nAntes da cirurgia, é obrigatório passar pela consulta de pré-operatório com o cirurgião responsável pelo procedimento. Essa etapa é essencial para avaliação, orientação e planejamento da cirurgia. Quem mora em Muriaé deve procurar a Secretaria Municipal de Saúde para receber as orientações e realizar o agendamento. Já os pacientes de outros municípios que possuem referência de atendimento em Muriaé devem procurar a Secretaria de Saúde da sua cidade. O agendamento poderá ser realizado pelo CISLESTE, conforme o contrato de cada município com o consórcio. Os atendimentos e agendamentos são feitos com médicos do corpo clínico do hospital, seguindo as normas e contratos estabelecidos pelo SUS.`,
        imagens: [
          { src: '/img/fluxos-assistenciais/cirurgia-geral/fluxo.png', alt: 'Fluxo Cirurgia Geral' },
          { src: '/img/fluxos-assistenciais/cirurgia-geral/pactuacao.png', alt: 'Pactuação Cirurgia Geral' }
        ]
      }
    ]
  },
  {
    id: 'cirurgia-vascular',
    titulo: 'Cirurgia Vascular',
    submodulos: [
      {
        id: 'aparelho-circulatorio',
        titulo: 'Aparelho Circulatório',
        texto: `Assim como a angioplastia pode ser feita no coração, ela também pode ser realizada nas pernas e nas artérias do pescoço (carótidas). Esses procedimentos são chamados de angioplastias periféricas ou procedimentos endovasculares. O objetivo do tratamento é desobstruir as artérias que estão com dificuldade na passagem do sangue, melhorando o funcionamento do organismo e diminuindo o risco de complicações.\n\nQuando o médico angiologista, cardiologista ou clínico indica a angioplastia, é necessário que a Secretaria de Saúde de Muriaé faça o agendamento da consulta com o médico especialista em hemodinâmica do Hospital São Paulo, unidade habilitada pelo SUS para realizar esses procedimentos.\n\nQuem mora em Muriaé deve levar toda a documentação até a Secretaria de Saúde para realizar o cadastro e o agendamento. Já quem mora em outra cidade deve procurar a Secretaria de Saúde do próprio município para cadastrar o pedido no sistema. Depois disso, a Regulação de Muriaé irá analisar a documentação e realizar o agendamento. Antes do procedimento, é muito importante seguir todas as orientações médicas para que tudo aconteça da melhor forma possível.`,
        imagens: [
          { src: '/img/fluxos-assistenciais/cirurgia-vascular/aparelhoCirculatorio/fluxo.png', alt: 'Fluxo Aparelho Circulatório' },
          { src: '/img/fluxos-assistenciais/cirurgia-vascular/aparelhoCirculatorio/Pactuacao1.png', alt: 'Pactuação Aparelho Circulatório' }
        ]
      },
      {
        id: 'varizes',
        titulo: 'Varizes',
        texto: `Cirurgias vasculares pelo SUS: mais saúde e qualidade de vida! As cirurgias vasculares, principalmente para tratamento de varizes, são indicadas quando problemas na circulação causam dor, inchaço, desconforto ou risco de complicações. Nesses casos, o tratamento cirúrgico pode ajudar a melhorar a qualidade de vida e evitar o agravamento do problema.\n\nPara realizar esses procedimentos pelo SUS, é importante seguir corretamente todas as etapas do atendimento, garantindo mais segurança e organização no cuidado com o paciente. A Secretaria Municipal de Saúde de Muriaé, por meio do programa Opera Já Muriaé, garante a realização de todo o pré-operatório necessário, oferecendo atendimento gratuito, completo e de qualidade para a população.\n\nAntes da cirurgia, é obrigatório passar pela consulta de pré-operatório com o cirurgião que irá realizar o procedimento. Essa etapa é fundamental para avaliação, orientações e planejamento da cirurgia. Pelo SUS, as cirurgias para tratamento de varizes são realizadas no Hospital São Paulo. Por isso, a consulta de pré-operatório deve ser feita com um médico do corpo clínico do hospital, com agendamento pela Secretaria de Saúde. Pacientes de outros municípios que possuem referência de atendimento em Muriaé devem procurar a Secretaria de Saúde da sua cidade. O agendamento poderá ser realizado pelo CISLESTE, conforme o contrato de cada município com o consórcio.`,
        imagens: [
          { src: '/img/fluxos-assistenciais/cirurgia-vascular/varizes/fluxo.png', alt: 'Fluxo Varizes' },
          { src: '/img/fluxos-assistenciais/cirurgia-vascular/varizes/pactuacao.png', alt: 'Pactuação Varizes' }
        ]
      }
    ]
  },
  {
    id: 'ginecologia',
    titulo: 'Ginecologia',
    submodulos: [
      {
        id: 'saude-da-mulher',
        titulo: 'Saúde da Mulher',
        texto: `Cirurgias ginecológicas: cuidado integral pela saúde da mulher! As cirurgias ginecológicas mais comuns, como a histerectomia (retirada do útero), miomectomia (remoção de miomas uterinos), laqueadura tubária, entre outras, são frequentemente indicadas por médicos clínicos para tratar condições que afetam a saúde reprodutiva e ginecológica das mulheres.\n\nPara que esses procedimentos sejam realizados de forma segura e organizada, é essencial seguir os fluxos estabelecidos pela rede pública de saúde. A Secretaria Municipal de Saúde de Muriaé, por meio do programa Opera Já Muriaé, garante a realização de todo o pré-operatório, oferecendo atendimento completo e gratuito aos nossos munícipes, sempre com cuidado e responsabilidade, dentro do SUS.\n\nPelo SUS, as cirurgias para tratamento em ginecologia são realizadas no Hospital São Paulo. Por isso, a consulta de pré-operatório deve ser feita com um médico do corpo clínico do hospital, com agendamento pela Secretaria de Saúde. Pacientes de outros municípios que possuem referência de atendimento em Muriaé devem procurar a Secretaria de Saúde da sua cidade. O agendamento poderá ser realizado pelo CISLESTE, conforme o contrato de cada município com o consórcio.`,
        imagens: [
          { src: '/img/fluxos-assistenciais/ginecologia/fluxo1.png', alt: 'Fluxo Cirurgias Ginecológicas' }
        ]
      },
      {
        id: 'exames-acompanhamento',
        titulo: 'Exames e Acompanhamentos',
        texto: `Quando falamos sobre a saúde da mulher, é importante cuidar de várias áreas da saúde e da prevenção. Entre os principais cuidados estão a prevenção do câncer de colo do útero, realizada por meio do exame Papanicolau, indicado para mulheres de 25 a 64 anos, a identificação precoce de alterações nas mamas, o acompanhamento da gestação — tanto de risco habitual quanto de alto risco — e o acesso aos métodos contraceptivos.\n\nO cuidado com a saúde da mulher é fundamental para promover mais qualidade de vida, prevenção de doenças e atendimento adequado em todas as fases da vida. A seguir, apresentamos alguns fluxos de atendimento disponíveis dentro da linha de cuidados da saúde da mulher.`,
        imagens: [
          { src: '/img/fluxos-assistenciais/ginecologia/fluxo2.png', alt: 'Fluxo Exames e Acompanhamentos' }
        ]
      }
    ]
  },
  {
    id: 'oncologia',
    titulo: 'Oncologia',
    submodulos: [
      {
        id: 'oncologia-geral',
        titulo: 'Atendimento Oncológico com Responsabilidade',
        texto: `A linha de cuidados da oncologia foi criada para garantir que pessoas com suspeita ou diagnóstico de câncer recebam atendimento rápido e de qualidade. A Fundação Cristiano Varella é a nossa referência nesse cuidado, atendendo pacientes de mais de 290 cidades pactuadas.\n\nPara os residentes em Muriaé, o primeiro passo é comparecer à UBS de referência de seu bairro. Com o encaminhamento correto, a regulação garante o acolhimento necessário para o início do tratamento.`,
        imagens: [
          { src: '/img/fluxos-assistenciais/oncologia/fluxo.png', alt: 'Fluxo Oncologia' }
        ]
      }
    ]
  },
  {
    id: 'oftalmologia',
    titulo: 'Oftalmologia',
    submodulos: [
      {
        id: 'catarata-pterigio',
        titulo: 'Tratamento de Catarata e Pterígio',
        texto: `Tratamento de Catarata e Pterígio pelo SUS em Muriaé. A Secretaria Municipal de Saúde de Muriaé disponibiliza, por meio do Sistema Único de Saúde (SUS), tratamento completo e gratuito para catarata e pterígio. Os pacientes contam com atendimento pré-operatório realizado por médicos oftalmologistas especializados, cirurgia sem qualquer custo e acompanhamento pós-operatório com todo o cuidado necessário.\n\nÉ mais saúde visual e qualidade de vida para a população muriaeense, com compromisso e responsabilidade. Para ter acesso à cirurgia de catarata ou pterígio, é necessário que o morador de Muriaé possua uma solicitação médica emitida por oftalmologista. A requisição, acompanhada de cópias dos documentos pessoais, deve ser entregue diretamente na Secretaria Municipal de Saúde, para que o pedido seja inserido no sistema de regulação.\n\nJá os demais procedimentos oftalmológicos são realizados por meio de pactuação com municípios vizinhos. Nesses casos, o cidadão deve procurar o setor de Tratamento Fora do Domicílio (TFD) para encaminhamento e orientações sobre o processo.`,
        imagens: [
          { src: '/img/fluxos-assistenciais/oftalmologia/pactuacao.png', alt: 'Pactuação Oftalmologia' }
        ]
      }
    ]
  },
  {
    id: 'ortopedia',
    titulo: 'Ortopedia e Traumatologia',
    submodulos: [
      {
        id: 'media-complexidade',
        titulo: 'Média Complexidade',
        texto: `Segurança no dia a dia e cuidado com a saúde: um compromisso de todos. Condução defensiva no trânsito, uso correto dos Equipamentos de Proteção Individual (EPIs) no ambiente de trabalho e atenção constante nas atividades diárias são medidas simples, mas extremamente importantes para evitar acidentes. Muitos traumas e lesões graves, que resultam em cirurgias ortopédicas de urgência, podem ser prevenidos com responsabilidade e cuidado.\n\nQuando a cirurgia é necessária, é fundamental seguir todos os fluxos e orientações médicas para garantir a segurança e o sucesso do tratamento. A Prefeitura de Muriaé, por meio da Secretaria Municipal de Saúde, assegura aos seus cidadãos todo o suporte necessário no pré-operatório através do Programa Opera Já Muriaé, reafirmando o compromisso com a saúde e o bem-estar da população.`,
        imagens: [
          { src: '/img/fluxos-assistenciais/ortopedia-traumatologia/fluxo.png', alt: 'Fluxo Ortopedia Média Complexidade' },
          { src: '/img/fluxos-assistenciais/ortopedia-traumatologia/pactuacao.png', alt: 'Pactuação Ortopedia Média Complexidade' }
        ]
      },
      {
        id: 'alta-complexidade',
        titulo: 'Alta Complexidade',
        texto: `Ortopedia de Alta Complexidade: entenda como funciona. Alguns problemas mais graves nos ossos, articulações ou na coluna, como fraturas complexas ou lesões sérias, são considerados de alta complexidade e, na maioria das vezes, são resolvidos diretamente nos atendimentos de urgência e emergência, quando o paciente precisa de cuidado imediato.\n\nJá nos casos que não são urgentes, a pessoa deve procurar a Secretaria Municipal de Saúde para receber as orientações correctas sobre o encaminhamento e tratamento necessário.`,
        imagens: [
          { src: '/img/fluxos-assistenciais/ortopedia-traumatologia/fluxo.png', alt: 'Fluxo Ortopedia Alta Complexidade' },
          { src: '/img/fluxos-assistenciais/ortopedia-traumatologia/pactuacao.png', alt: 'Pactuação Ortopedia Alta Complexidade' }
        ]
      }
    ]
  },
  {
    id: 'ressonancia',
    titulo: 'Ressonância Magnética',
    submodulos: [
      {
        id: 'ressonancia-geral',
        titulo: 'Exames de imagem de alta complexidade',
        texto: `A Secretaria Municipal de Saúde de Muriaé disponibiliza exames de imagem avançados como tomografia computadorizada (TC), ressonância magnética nuclear (RNM) e cintilografia pelo SUS, conforme indicação médica. Esses exames são fundamentais para diagnósticos mais precisos e detalhados, auxiliando no acompanhamento e tratamento de diversas condições de saúde.\n\nPara que a solicitação seja autorizada, é imprescindible que o pedido esteja corretamente preenchido no formulário APAC (Autorização de Procedimentos de Alta Complexidade), conforme as normas do sistema público de saúde. A falta de informações ou o uso de formulários incorretos pode atrasar a liberação do exame. Fique atento às orientações e garanta o acesso ao exame de forma segura e organizada!`,
        imagens: [
          { src: '/img/fluxos-assistenciais/ressonancia/fluxo.png', alt: 'Fluxo Ressonância Magnética' },
          { src: '/img/fluxos-assistenciais/ressonancia/pactuacao.png', alt: 'Pactuação Ressonância Magnética' }
        ]
      }
    ]
  },
  {
    id: 'tomografia',
    titulo: 'Tomografia',
    submodulos: [
      {
        id: 'tomografia-geral',
        titulo: 'Exames de Alta Complexidade',
        texto: `A Secretaria Municipal de Saúde de Muriaé disponibiliza exames de imagem avançados como a Tomografia Computadorizada (TC) pelo SUS, conforme indicação médica. Estes exames são fundamentais para diagnósticos precisos e detalhados.\n\nPara que a solicitação seja autorizada, é imprescindível que o pedido esteja preenchido no formulário APAC (Autorização de Procedimentos de Alta Complexidade). A correção nas informações garante o acesso ao exame de forma segura e ágil.`,
        imagens: [
          { src: '/img/fluxos-assistenciais/tomografia/fluxo.png', alt: 'Fluxo Tomografia' },
          { src: '/img/fluxos-assistenciais/tomografia/pactuacao.png', alt: 'Pactuação Tomografia' }
        ]
      }
    ]
  },
  {
    id: 'urologia',
    titulo: 'Urologia',
    submodulos: [
      {
        id: 'urologia-geral',
        titulo: 'Cálculo Renal: Prevenir é o melhor remédio',
        texto: `O cálculo renal, conhecido como pedra nos rins, é uma das doenças urológicas mais comuns. Ele pode causar dores fortes, infecções e, em alguns casos, até necessidade de internação. A melhor forma de prevenir o problema é manter uma boa hidratação, bebendo água ao longo do dia, além de ter uma alimentação equilibrada, com menos sal, gordura e alimentos industrializados.\n\nQuando o tratamento com medicamentos e acompanhamento médico não é suficiente, pode ser necessário realizar cirurgia. A Secretaria Municipal de Saúde de Muriaé oferece, pelo SUS e de forma eletiva (fora de situações de urgência), a cirurgia a laser para tratamento de cálculos renais, realizada no Prontocor. O objetivo é garantir atendimento de qualidade, segurança e acesso à tecnologia adequada para os pacientes.\n\nPara realizar o procedimento, é importante seguir corretamente os fluxos de atendimento e todas as orientações médicas. Nos casos de urgência urológica, o hospital de referência da nossa região é o Hospital São Paulo, que possui equipe especializada e equipamentos modernos para atendimento rápido e seguro.\n\nCuide da sua saúde urinária: prevenção e acompanhamento médico fazem toda a diferença!`,
        imagens: [
          { src: '/img/fluxos-assistenciais/urologia/fluxo.png', alt: 'Fluxo Urologia' },
          { src: '/img/fluxos-assistenciais/urologia/pactuacao.png', alt: 'Pactuação Urologia' }
        ]
      }
    ]
  }
];