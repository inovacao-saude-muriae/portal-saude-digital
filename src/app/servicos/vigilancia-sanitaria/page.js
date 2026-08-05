'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Hospital, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Phone,
  UserCheck,
  AlertTriangle,
  Mail,
  Building
} from 'lucide-react';
import styles from './VigilanciaSanitaria.module.css';

export default function VigilanciaSanitariaPage() {
  const dados = {
    title: "Vigilância Sanitária (VISA)",
    subtituloHero: "Fiscalização, Orientação e Segurança para a População",
    desc: "A Vigilância Sanitária é responsável por orientar e fiscalizar estabelecimentos e serviços de saúde ou de interesse à saúde, garantindo segurança, conformidade com as normas vigentes e qualidade para toda a população de Muriaé. Aqui você encontra informações institucionais sobre licenciamento, renovação de alvará e outros serviços regulados.",
    
    mudancaRT: {
      titulo: "Solicitar Mudança de Responsável Técnico",
      texto: "Os estabelecimentos regulados que necessitam alterar o profissional responsável técnico (RT) devem formalizar a solicitação presencialmente no setor da Vigilância. A equipe técnica do município irá fornecer o checklist de documentos e orientar todo o procedimento cabível no próprio local."
    },

    denuncias: {
      titulo: "Denúncias Sanitárias",
      alertaCanal: "Canais Oficiais: As denúncias sanitárias não são processadas diretamente no balcão técnico. Elas devem ser protocoladas e recebidas exclusivamente pela Ouvidoria do SUS e pela Ouvidoria Municipal para triagem legal.",
      subtitulo: "Caso presencie irregularidades em estabelecimentos comerciais ou de saúde, utilize os contatos oficiais de ouvidoria listados abaixo:",
      canais: [
        "Ouvidoria do SUS Regional: (32) 3696-3318;",
        "Ouvidoria Municipal Geral: Telefone 136, dígito 9;",
        "Atendimento presencial da Ouvidoria: Secretaria Municipal de Saúde. Avenida Maestro Sansão, 236 - Centro. Segunda a sexta-feira, das 7h30 às 11h e das 13h às 16h30;",
        "Canal digital via E-mail: ouvidoriasaudemuriae@hotmail.com"
      ]
    },

    atendimento: {
      endereco: "Rua Sinval Florêncio da Silva, nº 02, 2º andar – Centro (Prédio do SENAI, próximo ao Mercado Municipal);",
      telefone: "(32) 2020-8105;",
      horario: "Segunda a sexta-feira, das 7h às 11h e das 13h às 16h."
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
          <span className={styles.navTag}>Vigilância em Saúde - SUS</span>
        </div>
      </nav>

      {/* 3. CONTEÚDO PRINCIPAL */}
      <main className={styles.mainContent}>
        <div className={styles.container}>
          
          <div className={styles.serviceLayout}>
            <div>
              {/* SOBRE A VIGILÂNCIA SANITÁRIA */}
              <div className={styles.infoBlock}>
                <h2>
                  <ShieldCheck size={22} color="#008a83" /> Sobre a Vigilância Sanitária
                </h2>
                <p>{dados.desc}</p>
              </div>

              <div className={styles.infoBlock}>
                <h3>
                  <UserCheck size={22} color="#008a83" /> {dados.mudancaRT.titulo}
                </h3>
                <p>{dados.mudancaRT.texto}</p>
              </div>

              {/* DENÚNCIAS SANITÁRIAS & OUVIDORIA */}
              <div className={styles.infoBlock}>
                <h3>
                  <AlertTriangle size={22} color="#008a83" /> {dados.denuncias.titulo}
                </h3>
                <p style={{ marginBottom: '16px' }}>{dados.denuncias.subtitulo}</p>

                {/* ALERTA DOS CANAIS OFICIAIS DE OUVIDORIA */}
                <div style={{ backgroundColor: '#fffbe3', borderLeft: '4px solid #f59e0b', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                  <p style={{ margin: 0, fontWeight: 600, color: '#78350f', fontSize: '14.5px' }}>
                    {dados.denuncias.alertaCanal}
                  </p>
                </div>

                <ul className={styles.docList}>
                  {dados.denuncias.canais.map((canal, idx) => (
                    <li key={idx}>{canal}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* BARRA LATERAL (SIDEBAR) */}
            <aside className={styles.sidebarArea}>
              
              {/* ENDEREÇO FÍSICO */}
              <div className={styles.widgetBox}>
                <div className={styles.widgetHeader}>
                  <MapPin size={20} /> Endereço Físico
                </div>
                <p className={styles.widgetText}>{dados.atendimento.endereco}</p>
              </div>

              {/* HORÁRIO DE EXPEDIENTE */}
              <div className={styles.widgetBox}>
                <div className={styles.widgetHeader}>
                  <Clock size={20} /> Horário de Expediente
                </div>
                <p className={styles.widgetText}>{dados.atendimento.horario}</p>
              </div>

              {/* TELEFONE DE CONTATO */}
              <div className={styles.widgetBox}>
                <div className={styles.widgetHeader}>
                  <Phone size={20} /> Telefone de Contato
                </div>
                <p className={styles.widgetText}>{dados.atendimento.telefone}</p>
              </div>

            </aside>

          </div>

        </div>
      </main>

    </div>
  );
}