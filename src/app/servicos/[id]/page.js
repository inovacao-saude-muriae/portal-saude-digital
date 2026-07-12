'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link'; // Importação adicionada para corrigir o aviso do Next.js
import styles from './ServiceDetail.module.css';

// 1. BANCO DE DADOS INTEGRAL DO MUNICÍPIO
const dbServicos = {
  "atendimento-domiciliar": {
    title: "Cuidado em casa para quem mais precisa",
    desc: "O Serviço de Atendimento Domiciliar (SAD) destina-se a pessoas acamadas ou com dificuldade de mobilidade, de forma temporária ou permanente. Nesse modelo de cuidado, a equipe de saúde realiza o atendimento na própria casa do paciente, garantindo acompanhamento contínuo e humanizado.",
    horario: "Segunda a Sexta, das 07h às 17h",
    onde: "Atendimento realizado diretamente na própria casa do paciente.",
    documentos: [
      "CPF e RG do paciente",
      "Cartão do SUS atualizado",
      "Comprovante de residência no município de Muriaé"
    ],
    requisitos: "Morar em Muriaé; Idade a partir de 01 mês de vida; Ser usuário do SUS; Apresentar quadro clínico que justifique o atendimento domiciliar (pessoas acamadas ou com dificuldade de mobilidade temporária ou permanente).",
    passoAPasso: [
      "O familiar ou responsável deve procurar a UBS onde o paciente já é atendido;",
      "Um profissional da equipe preencherá uma ficha de pedido para inclusão;",
      "A ficha será encaminhada à equipe do SAD, que fará a avaliação técnica."
    ],
    comunicacao: "Comunicação com o Usuário: Após o encaminhamento, o Agente Comunitário de Saúde entrerá em contato com a família para informar sobre a visita de avaliação. Caso o paciente seja admitido, a equipe elaborará um plano de cuidados individualizado."
  },
  "camara-tecnica": {
    title: "Gestão e Assessoria Especializada",
    desc: "A Câmara Técnica é um grupo de especialistas que trabalha para garantir que o cidadão receba o tratamento correto, unindo as necessidades dos pacientes às regras e recursos do SUS.",
    horario: "Segunda a Sexta, das 07h30 às 11h30 e das 13h00 às 17h00",
    onde: "Secretaria Municipal de Saúde de Muriaé / Setor de Regulação.",
    documentos: [
      "Prescrição emitida por profissional habilitado",
      "Justificativa clínica detalhada para o uso de itens fora da rede padrão",
      "Laudos médicos anteriores ou exames complementares (se houver)",
      "Documentos pessoais do paciente (RG, CPF e Cartão do SUS de Muriaé)"
    ],
    requisitos: "Prestar assessoria no processo de oferta de medicamentos, exames, tratamentos e materiais médicos fora das listas padrão e das diretrizes do SUS (PCDT). Destinado a casos com prescrição feita por profissionais habilitados, onde as alternativas previstas no SUS tenham sido avaliadas.",
    passoAPasso: [
      "Análise das justificativas dos profissionais para o uso de itens fora da rede padrão do SUS;",
      "Emissão de parecer técnico recomendando a continuidade do tratamento, substituição por alternativas do SUS ou indeferimento por falta de eficácia;",
      "Estabelecimento de roteiros padronizados para organizar as rotinas e os cuidados prestados;",
      "Fornecimento de auxílio técnico (laudos e perícias) ao Poder Judiciário, Ministério Público, Defensoria Pública, OAB e Procuradoria Geral do Município para garantir o cumprimento dos protocolos do SUS e evitar gastos desnecessários."
    ],
    comunicacao: "Perícias Periódicas: Todas as pessoas que recebem remédios, materiais ou tratamentos pelo SUS poderão passar por perícias periódicas, seguindo as regras e critérios definidos pela Câmara Técnica de Saúde. Pacientes com sentenças judiciais definitivas serão submetidos anualmente à revisão pericial para atestar a manutenção do tratamento."
  },
  "farmacia-municipal": {
    title: "Acesso Gratuito a Medicamentos",
    desc: "A Assistência Farmacêutica garante à população o acesso gratuito a medicamentos por meio do Sistema Único de Saúde (SUS). Esses medicamentos são organizados em diferentes componentes, de acordo com o tipo de tratamento, a complexidade das doenças e as diretrizes do Ministério da Saúde.",
    horario: "Básico: 07h às 17h | Especializado (Alto Custo): 07h às 15h (Atendimento operacional até o dia 23 do mês).",
    onde: "Farmácias Municipais, UBS e Setor de Epidemiologia (para medicamentos estratégicos).",
    documentos: [
      "Receita médica atualizada e válida (emitida pelo SUS ou rede conveniada)",
      "Documento de identificação oficial com foto do paciente",
      "CPF e Cartão do SUS atualizado",
      "Comprovante de residência recente no município de Muriaé",
      "Procuração ou documento do representante legal (caso a retirada não seja feita pelo próprio paciente no Alto Custo)"
    ],
    requisitos: "Componente Básico: Destinado ao tratamento das doenças mais comuns da Atenção Primária, disponíveis na REMUME. Componente Especializado (CEAF): Medicamentos de alto custo que exigem enquadramento rigoroso nos critérios dos Protocolos Clínicos (PCDT) com diagnóstico laudado. Componente Estratégico (CESAF): Medicamentos para doenças de impacto epidemiológico controladas.",
    passoAPasso: [
      "Assistência Básica: Apresentar a receita e documentos em qualquer farmácia da rede municipal de segunda a sexta, das 7h às 17h.",
      "Componente Especializado (Alto Custo): Dispensação programada mensal a cada 30 dias. O atendimento é exclusivo das 7h às 15h, lembrando que o atendimento operacional do mês encerra dia 23.",
      "Componente Estratégico: Retirada realizada diretamente no setor de Epidemiologia, mediante preenchimento de formulários específicos e exames de monitoramento exigidos pelo agravo."
    ],
    comunicacao: "Atenção ao Cadastro: Para o Componente Especializado (CEAF), é obrigatório que o paciente passe por uma auditoria de cadastro, apresentando laudos, exames comprobatórios e a documentação específica exigida pela Secretaria de Estado de Saúde."
  },
  "laboratorio-municipal": {
    title: "Diagnóstico e Apoio à Saúde da População",
    desc: "O Laboratório Municipal é responsável pela realização de exames laboratoriais oferecidos pelo Sistema Único de Saúde (SUS), desempenhando um papel essencial no diagnóstico, prevenção e acompanhamento de doenças. Por meio desse serviço, a população tem acesso gratuito a exames que auxiliam os profissionais de saúde.",
    horario: "Segunda a Sexta-feira, das 12h às 17h",
    onde: "Rua Coronel Izalino, s/n - Muriaé/MG | Telefone: (32) 2020-8074",
    documentos: [
      "Pedido médico oficial emitido pelo SUS",
      "Documento de identidade oficial com foto e CPF",
      "Comprovante de residência atualizado no município de Muriaé",
      "Cartão Nacional de Saúde (Cartão SUS) atualizado",
      "Número de telefone ativo para contato com o paciente",
      "Para menores de idade: Certidão de nascimento da criança acompanhada do documento de identidade do responsável legal"
    ],
    requisitos: "Ser residente em Muriaé, usuário do SUS e possuir um pedido médico oficial válido emitido por profissional da rede pública de saúde.",
    passoAPasso: [
      "O agendamento é realizado exclusivamente de forma presencial no balcão de atendimento do laboratório;",
      "O cidadão ou responsável deve comparecer ao local munido de toda a documentação obrigatória listada;",
      "Após a conferência dos dados e do pedido médico, a equipe do laboratório agendará a data e fornecerá as orientações de preparo (como jejum ou coleta de material) para a realização dos exames."
    ],
    comunicacao: "Atenção Gestantes: Além dos documentos citados, as gestantes deverão apresentar a Caderneta de Pré-Natal do SUS para garantir o atendimento prioritário e o encaminhamento para exames específicos do período gestacional."
  },
  "doacao-de-sangue": {
    title: "Um Gesto de Solidariedade que Salva Vidas",
    desc: "A doação de sangue e de medula óssea é um ato voluntário que pode transformar e salvar vidas. Muitas pessoas enfrentam doenças graves e dependem de transfusões ou de um transplante de medula para sobreviver. Um simples ato de generosidade pode fazer toda a diferença.",
    horario: "Toda quarta-feira, das 07h30 às 15h00",
    onde: "Posto Avançado de Coleta Externa (PACE) - Rua Dr. Ivan Américo / R. Menotti Porcaro, s/n – Centro, Muriaé (Prédio do antigo Viva a Vida).",
    documentos: [
      "Documento de identidade oficial com foto e CPF",
      "Estar in excelentes condições gerais de saúde",
      "Ter entre 16 e 69 anos (menores de 18 anos necessitam de autorização formal dos responsáveis)",
      "Apresentar peso corporal acima de 50 kg",
      "Não estar em jejum absoluto",
      "Evitar a ingestão de alimentos gordurosos nas 3 horas que antecedem a doação"
    ],
    requisitos: "Pessoas saudáveis entre 18 e 35 anos podem se cadastrar como doadoras de medula óssea, desde que não apresentem histórico de doenças infecciosas transmissíveis ou patologias hematológicas (doenças do sangue).",
    passoAPasso: [
      "Comparecer ao local de coleta (PACE) portando documento oficial com foto e CPF;",
      "Uma equipe de enfermagem realizará a retirada de uma pequena amostra de sangue (cerca de 5 ml);",
      "A amostra será enviada para laboratório para identificar as características genéticas de histocompatibilidade (teste de HLA);",
      "Essas informações são inseridas com total segurança no Registro Nacional de Doadores de Medula Óssea (REDOME) e cruzadas continuamente com os dados de pacientes;",
      "Havendo compatibilidade futura com algum paciente cadastrado, o doador é imediatamente contatado para dar continuidade ao processo."
    ],
    comunicacao: "Informações de Coleta em Muriaé: Toda quarta-feira, das 7h30 às 15h, no Posto Avançado de Coleta Externa (PACE). Localizado na Rua Dr. Ivan Américo / R. Menotti Porcaro, s/n – Centro (Prédio do antigo Viva a Vida)."
  },
  "vacina": {
    title: "Vacina",
    desc: "A vacinação é uma das estratégias mais eficazes para proteger a saúde da população e promover uma sociedade mais segura e saudável. Além de prevenir doenças graves, contribui para a redução da circulação de vírus e bactérias, protegendo especialmente as pessoas mais vulneráveis.\n\nNo Brasil, a política de vacinação é coordenada pelo Programa Nacional de Imunizações (PNI) do SUS, garantindo acesso integral e gratuito a uma ampla oferta de imunobiológicos. Atualmente, são disponibilizados 47 itens, incluindo vacinas, soros e imunoglobulinas. As vacinas contemplam tanto o Calendário Nacional de Vacinação quanto às imunizações especiais destinadas a pessoas com condições clínicas crônicas ou imunossuprimidas, oferecidas nos Centros de Referência para Imunobiológicos Especiais (CRIE).",
    requisitos: "Apresentar documento de identificação e, preferencialmente, o cartão de vacina.",
    documentos: [
      "Documento de identidade oficial com foto (RG, CNH) ou Certidão de Nascimento (para crianças).",
      "Cartão Nacional de Saúde (CNS) ou CPF.",
      "Caderneta/Cartão de Vacinação atual (se possuir)."
    ],
    onde: "Salas de vacina das Unidades Básicas de Saúde (UBS) e pontos estratégicos durante campanhas.",
    horario: "Segunda a sexta-feira, das 08h às 16h30 (pode variar conforme a unidade)."
  }
};

// 2. DADOS DOS CARDS DE CAMPANHA (ABA 1)
const tiposVacinas = [
  {
    id: 1,
    titulo: "Vacinação de Rotina (Caderneta)",
    desc: "Atualização sistemática do esquema vacinal conforme as orientações do Calendário Nacional de Vacinação para todas as faixas etárias.",
    proceder: "Comparecer a uma UBS com a caderneta de vacinação para avaliação e aplicação das doses pendentes.",
    locais: "Todas as Unidades Básicas de Saúde (UBS) do município.",
    docs: "Documento pessoal, Cartão SUS e Caderneta de Vacinação."
  },
  {
    id: 2,
    titulo: "Vacina Antirrábica",
    desc: "Imunização voltada para a prevenção da raiva humana, indicada para pessoas que sofreram exposição ou potencial risco de infecção por animais transmissores.",
    proceder: "Em caso de agressão por animal, lavar ferimento com água e sabão e procurar atendimento médico imediatamente para avaliação da necessidade da vacina ou soro.",
    locais: "UBS Safira, UBS São Francisco, Hospital Municipal e UPA.",
    docs: "Documento de identificação, Cartão SUS e Guia de atendimento médico/notificação de acidente por animal."
  },
  {
    id: 3,
    titulo: "Vacinação contra Covid-19",
    desc: "Campanha contínua de imunização contra o coronavírus, seguindo os critérios de faixas etárias, grupos prioritários e doses de reforço vigentes.",
    proceder: "Acompanhar o cronograma de grupos convocados e comparecer ao local de aplicação portando os documentos exigidos.",
    locais: "Central de Vacinação (Antigo PAM) e Unidades de Saúde polos divulgadas semanalmente.",
    docs: "Documento com foto, CPF, Cartão SUS e comprovante de doses anteriores."
  },
  {
    id: 4,
    titulo: "Vacina contra Dengue",
    desc: "Vacinação focada na redução das hospitalizações e óbitos decorrentes da infecção pelos vírus da dengue.",
    proceder: "Público-alvo atual deve comparecer aos locais indicados. Atenção: Vacina contraindicada para gestantes, lactantes e imunossuprimidos.",
    locais: "Salas de vacinação selecionadas nas UBS centrais e distritais.",
    docs: "Documento de identificação da criança/adolescente, CPF e presença dos pais ou responsável.",
    alerta: "Faixa Etária: Destinada a crianças e adolescentes de 10 a 14 anos."
  }
];

// 3. RENDERIZAÇÃO DO COMPONENTE
export default function ServiceDetailPage() {
  const params = useParams();
  const id = params?.id;

  const [activeTab, setActiveTab] = useState('campanhas');

  const servico = dbServicos[id];
  const isVacinacao = id === "vacinacao" || id === "vacina";

  if (!servico) {
    return (
      <main className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.infoBlock}>
            <h2 style={{ color: '#003b5c', margin: '0 0 10px 0' }}>Serviço não encontrado</h2>
            <p style={{ color: '#475569', margin: 0 }}>O serviço solicitado não existe ou está sendo migrado.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      
      {/* BANNER 100% LARGURA */}
      <section className={styles.heroBanner}>
        <div className={styles.overlay}>
          <div className={styles.container}>
            <span className={styles.heroSubtitle}>CARTA DE SERVIÇOS</span>
            <h1 className={styles.heroTitle}>{servico.title}</h1>
          </div>
        </div>
      </section>

      {/* BARRA DE NAVEGAÇÃO SUPERIOR - CORRIGIDA COM <Link> */}
      <div className={styles.navigationBar}>
        <div className={styles.container}>
          <Link href="/servicos" className={styles.backLink}>
            ← Voltar para Serviços
          </Link>
        </div>
      </div>

      {/* ÁREA DE CONTEÚDO PRINCIPAL */}
      <main className={styles.mainContent}>
        <div className={styles.container}>
          
          {isVacinacao ? (
            /* ==========================================================
               --- CENÁRIO A: PAINEL INTERATIVO DE VACINAÇÃO --- 
               ========================================================== */
            <div style={{ width: '100%' }}>
              
              {/* Texto Institucional Completo do PNI */}
              <div className={styles.infoBlock}>
                <h3>
                  <span className={styles.blockIcon}>ℹ️</span> 
                  Programa Nacional de Imunizações (PNI)
                </h3>
                {servico.desc.split('\n\n').map((paragrafo, idx) => (
                  <p key={idx} style={{ marginBottom: idx === 0 ? '16px' : '0' }}>
                    {paragrafo}
                  </p>
                ))}
              </div>

              {/* Sistema União de Abas Integradas */}
              <div className={styles.tabHeader}>
                <button 
                  className={`${styles.tabButton} ${activeTab === 'campanhas' ? styles.tabButtonActive : ''}`}
                  onClick={() => setActiveTab('campanhas')}
                >
                  📢 Campanhas & Tipos de Vacina
                </button>
                
                {/* Nota: Mantemos o elemento <a> com target="_blank" aqui pois abrir em nova guia (tab) é um comportamento nativo ideal para links externos/ancorados paralelos, não violando o lint do Next.js de navegação de página interna principal */}
                <a 
                  href="/calendario-vacinal" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.tabButton}
                  style={{ textDecoration: 'none' }}
                >
                  📅 Linha do Tempo / Calendário Vacinal ↗
                </a>
              </div>

              {/* Aba Campanhas */}
              {activeTab === 'campanhas' && (
                <div className={styles.vacinacaoGrid}>
                  {tiposVacinas.map((vacina) => (
                    <div key={vacina.id} className={styles.vacinaCard}>
                      <h4 className={styles.vacinaCardTitle}>{vacina.titulo}</h4>
                      <p className={styles.vacinaCardDesc}>{vacina.desc}</p>
                      
                      <div className={styles.vacinaSection}>
                        <strong>Como Proceder:</strong>
                        <p>{vacina.proceder}</p>
                      </div>
                      <div className={styles.vacinaSection}>
                        <strong>Locais de Atendimento:</strong>
                        <p>{vacina.locais}</p>
                      </div>
                      <div className={styles.vacinaSection}>
                        <strong>Documentação Exigida:</strong>
                        <p>{vacina.docs}</p>
                      </div>

                      {vacina.alerta && (
                        <div className={styles.vacinaAlerta}>
                          <p>{vacina.alerta}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

            </div>
          ) : (
            /* ==========================================================
               --- CENÁRIO B: LAYOUT DA REDE DE OUTROS SERVIÇOS --- 
               ========================================================== */
            <div className={styles.infoLayout}>
              <div>
                <div className={styles.infoBlock}>
                  <h3><span className={styles.blockIcon}>ℹ️</span> Sobre o Serviço</h3>
                  <p>{servico.desc}</p>
                </div>

                <div className={styles.infoBlock}>
                  <h3><span className={styles.blockIcon}>📝</span> Requisitos de Acesso</h3>
                  <p>{servico.requisitos}</p>
                </div>

                {servico.passoAPasso && servico.passoAPasso.length > 0 && (
                  <div className={styles.infoBlock}>
                    <h3><span className={styles.blockIcon}>🔄</span> Como Solicitar / Etapas</h3>
                    <ol className={styles.docList} style={{ listStyleType: 'decimal' }}>
                      {servico.passoAPasso.map((passo, idx) => (
                        <li key={idx} style={{ marginBottom: '4px' }}>{passo}</li>
                      ))}
                    </ol>
                  </div>
                )}

                <div className={styles.infoBlock}>
                  <h3><span className={styles.blockIcon}>📂</span> Documentação Exigida</h3>
                  <ul className={styles.docList}>
                    {servico.documentos.map((doc, idx) => (
                      <li key={idx}>{doc}</li>
                    ))}
                  </ul>
                </div>

                {servico.comunicacao && (
                  <div className={styles.infoBlock} style={{ borderLeft: '4px solid #005c8a', backgroundColor: '#f1f5f9' }}>
                    <p style={{ fontStyle: 'italic', color: '#1e293b', margin: 0 }}>{servico.comunicacao}</p>
                  </div>
                )}
              </div>

              {/* Sidebar Lateral Administrativa */}
              <aside className={styles.stickyWidget}>
                <div className={styles.widgetItem}>
                  <div className={styles.widgetHeader}>
                    <span className={styles.widgetIcon}>📍</span>
                    <h4>Onde Encontrar</h4>
                  </div>
                  <p>{servico.onde}</p>
                </div>
                <div className={styles.widgetItem}>
                  <div className={styles.widgetHeader}>
                    <span className={styles.widgetIcon}>⏰</span>
                    <h4>Horário de Funcionamento</h4>
                  </div>
                  <p>{servico.horario}</p>
                </div>
              </aside>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}