'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Hospital, 
  Pill, 
  Clock, 
  MapPin, 
  FileText, 
  ListOrdered,
  ShieldCheck,
  PackageCheck,
  Activity,
  AlertTriangle,
  Info
} from 'lucide-react';
import styles from './FarmaciaMunicipal.module.css';

export default function FarmaciaMunicipalPage() {
  const dados = {
    title: "Farmácia Municipal",
    subtituloHero: "Acesso Gratuito a Medicamentos pelo SUS",
    desc: "A Assistência Farmacêutica garante à população o acesso gratuito a medicamentos por meio do Sistema Único de Saúde (SUS). Esses medicamentos são organizados em diferentes componentes, de acordo com o tipo de tratamento, a complexidade das doenças e as diretrizes do Ministério da Saúde.",
    onde: "Farmácia Central / Unidades Básicas de Saúde (UBS) - Muriaé/MG",
    horarioBasico: "Segunda a Sexta-feira, das 07h00 às 17h00",
    horarioEspecializado: "Segunda a Sexta-feira, das 07h00 às 15h00 (Último dia operacional do mês: dia 23)",
    
    basica: {
      titulo: "Medicamentos da Assistência Farmacêutica Básica",
      texto: "São medicamentos essenciais disponibilizados gratuitamente pelo SUS para o tratamento das doenças mais comuns. Eles fazem parte da Relação Municipal de Medicamentos Essenciais (REMUME).",
      quemPode: "Pacientes com receita médica válida e que atendem aos critérios de uso de medicamentos disponíveis na rede pública.",
      passoAPasso: [
        "Atendimento de segunda a sexta-feira, das 7h às 17h;",
        "Apresentar receita médica atualizada;",
        "Apresentar documento de identificação oficial com foto;",
        "Apresentar CPF e Cartão do SUS atualizado;",
        "Apresentar comprovante de residência recente no município."
      ]
    },

    especializado: {
      titulo: "Componente Especializado (CEAF) - Alto Custo",
      texto: "Programa do SUS que garante acesso a medicamentos de alto custo usados em tratamentos ambulatoriais, seguindo critérios dos Protocolos Clínicos e Diretrizes Terapêuticas (PCDT).",
      regras: [
        "Dispensação programada mensal, realizada a cada 30 dias;",
        "Horário de atendimento exclusivo: das 7h às 15h;",
        "Atenção: o último dia de atendimento operacional do mês é o dia 23;",
        "Retirada permitida apenas pelo paciente cadastrado ou representante legal documentado."
      ],
      alerta: "Atenção ao Cadastro: Para o Componente Especializado, é necessário que o paciente esteja rigorosamente enquadrado nos critérios dos PCDTs, apresentando diagnóstico laudado e documentação específica exigida pelo Estado."
    },

    estrategico: {
      titulo: "Componente Estratégico (CESAF)",
      texto: "Reúne medicamentos para prevenção, controle e tratamento de doenças de impacto epidemiológico. A dispensação é realizada diretamente no setor de Epidemiologia, mediante receita médica, preenchimento de formulários e exames de monitoramento exigidos."
    }
  };

  return (
    <div className={styles.pageWrapper}>
      
      {/* 1. HERO BANNER */}
      <section className={styles.heroBanner}>
        <div className={styles.container}>
          <div className={styles.badgeHeader}>
            <Hospital size={14} /> Rede Pública de Saúde de Muriaé
          </div>
          <h1 className={styles.heroTitle}>{dados.title}</h1>
          <p className={styles.heroDesc}>
            {dados.subtituloHero}
          </p>
        </div>
      </section>

      {/* 2. BARRA DE NAVEGAÇÃO SUPERIOR */}
      <nav className={styles.navigationBar}>
        <div className={styles.navContainer}>
          <Link href="/servicos" className={styles.backLink}>
            <ArrowLeft size={16} /> Voltar para Serviços
          </Link>
          <span className={styles.navTag}>Assistência Farmacêutica - SUS</span>
        </div>
      </nav>

      {/* 3. CONTEÚDO PRINCIPAL */}
      <main className={styles.mainContent}>
        <div className={styles.container}>
          
          <div className={styles.serviceLayout}>
            
            {/* COLUNA PRINCIPAL */}
            <div>
              {/* SOBRE A ASSISTÊNCIA FARMACÊUTICA */}
              <div className={styles.infoBlock}>
                <h2>
                  <Pill size={22} color="#008a83" /> Sobre a Assistência Farmacêutica
                </h2>
                <p>{dados.desc}</p>
              </div>

              {/* FARMÁCIA BÁSICA */}
              <div className={styles.infoBlock}>
                <h3>
                  <PackageCheck size={22} color="#008a83" /> {dados.basica.titulo}
                </h3>
                <p>{dados.basica.texto}</p>
                
                <p style={{ marginTop: '14px', fontWeight: 600, color: '#003b5c' }}>
                  Quem pode retirar:
                </p>
                <p>{dados.basica.quemPode}</p>

                <p style={{ marginTop: '14px', fontWeight: 600, color: '#003b5c' }}>
                  Como funciona a retirada:
                </p>
                <ul className={styles.docList}>
                  {dados.basica.passoAPasso.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* COMPONENTE ESPECIALIZADO (CEAF) */}
              <div className={styles.infoBlock}>
                <h3>
                  <ShieldCheck size={22} color="#008a83" /> {dados.especializado.titulo}
                </h3>
                <p>{dados.especializado.texto}</p>

                <p style={{ marginTop: '14px', fontWeight: 600, color: '#003b5c' }}>
                  Regras de Funcionamento:
                </p>
                <ul className={styles.docList}>
                  {dados.especializado.regras.map((regra, idx) => (
                    <li key={idx}>{regra}</li>
                  ))}
                </ul>
              </div>

              {/* ALERTA DE CADASTRO DO CEAF */}
              <div className={styles.infoBlock} style={{ backgroundColor: '#fffbe3', borderColor: '#f59e0b' }}>
                <h3 style={{ color: '#b45309', borderBottomColor: '#fde68a' }}>
                  <AlertTriangle size={22} color="#b45309" /> Atenção ao Cadastro
                </h3>
                <p style={{ margin: 0, fontWeight: 500, color: '#78350f' }}>
                  {dados.especializado.alerta}
                </p>
              </div>

              {/* COMPONENTE ESTRATÉGICO (CESAF) */}
              <div className={styles.infoBlock}>
                <h3>
                  <Activity size={22} color="#008a83" /> {dados.estrategico.titulo}
                </h3>
                <p>{dados.estrategico.texto}</p>
              </div>
            </div>

            {/* BARRA LATERAL (SIDEBAR) */}
            <aside className={styles.sidebarArea}>
              
              {/* ONDE ENCONTRAR */}
              <div className={styles.widgetBox}>
                <div className={styles.widgetHeader}>
                  <MapPin size={20} /> Onde Encontrar
                </div>
                <p className={styles.widgetText}>{dados.onde}</p>
              </div>

              {/* HORÁRIOS DE ATENDIMENTO */}
              <div className={styles.widgetBox}>
                <div className={styles.widgetHeader}>
                  <Clock size={20} /> Horários de Atendimento
                </div>
                <p className={styles.widgetText} style={{ marginBottom: '10px' }}>
                  <strong>Atenção Básica:</strong><br />
                  {dados.horarioBasico}
                </p>
                <p className={styles.widgetText}>
                  <strong>Componente Especializado (CEAF):</strong><br />
                  {dados.horarioEspecializado}
                </p>
              </div>

            </aside>

          </div>

        </div>
      </main>

    </div>
  );
}