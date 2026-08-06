'use client';

import styles from './Ouvidoria.module.css';

export default function OuvidoriaPage() {
  const tiposManifestacao = [
    {
      titulo: 'Sugestões',
      icone: '💡',
      descricao: 'Ideias e propostas para a melhoria dos serviços de saúde no município.'
    },
    {
      titulo: 'Reclamações',
      icone: '⚠️',
      descricao: 'Relatos de insatisfação sobre atendimentos, fluxos de trabalho ou estruturas físicas.'
    },
    {
      titulo: 'Elogios',
      icone: '👏',
      descricao: 'Demonstrações de satisfação e reconhecimento dedicados a profissionais ou unidades de saúde.'
    },
    {
      titulo: 'Solicitações',
      icone: '📋',
      descricao: 'Pedidos de esclarecimentos ou acesso a informações institucionais.'
    },
    {
      titulo: 'Denúncias',
      icone: '🛡️',
      descricao: 'Comunicação de irregularidades, infrações ou atos ilícitos na saúde pública.'
    }
  ];

  return (
    <div className={styles.pageWrapper}>
      {/* 1. BANNER DE TOPO COM GRADIENTE E BARRA COLORIDA */}
      <section className={styles.heroBanner}>
        <div className={styles.overlay}>
          <div className={styles.container}>
            <span className={styles.heroBadge}>📣 Participação Social</span>
            <h1 className={styles.heroTitle}>Ouvidoria da Saúde</h1>
            <p className={styles.heroSubtitle}>
              Canal Direto de Diálogo com o Cidadão
            </p>
            </div>
        </div>
      </section>

      <main className={styles.mainContainer}>
        <div className={styles.container}>
          
          {/* APRESENTAÇÃO / SOBRE A OUVIDORIA */}
          <section className={styles.infoSection}>
            <div className={styles.infoCard}>
              <h2><span className={styles.titleIcon}>🤝</span> Sobre a Ouvidoria</h2>
              <p>
                A Ouvidoria da Saúde de Muriaé é o espaço institucional destinado a ouvir, registrar e encaminhar as manifestações da população sobre os serviços de saúde oferecidos pelo município.
              </p>
              <p>
                Trata-se de uma ferramenta essencial de gestão que fortalece o controle social, a transparência pública e a participação ativa do cidadão na melhoria do Sistema Único de Saúde (SUS).
              </p>
            </div>
          </section>

          {/* O QUE VOCÊ PODE REGISTRAR */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <h2>O que você pode registrar na Ouvidoria?</h2>
              <p>Escolha a opção que melhor se enquadra na sua necessidade:</p>
            </div>

            <div className={styles.typesGrid}>
              {tiposManifestacao.map((item, index) => (
                <div key={index} className={styles.typeCard}>
                  <div className={styles.typeIcon}>{item.icone}</div>
                  <h3 className={styles.typeTitle}>{item.titulo}</h3>
                  <p className={styles.typeDesc}>{item.descricao}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CANAIS DE ATENDIMENTO E CONTATO */}
          <section className={styles.sectionBlock}>
            <div className={styles.contactContainer}>
              <div className={styles.contactText}>
                <h2>Como entrar em contato</h2>
                <p>
                  Você pode procurar o serviço presencialmente na sede da Secretaria Municipal de Saúde ou utilizar os canais remotos listados abaixo para formalizar a sua manifestação:
                </p>
              </div>

              <div className={styles.contactsGrid}>
                {/* TELEFONE */}
                <a href="tel:3236963318" className={styles.contactCard}>
                  <span className={styles.contactIcon}>📞</span>
                  <div>
                    <strong>Contato Telefônico</strong>
                    <p>(32) 3696-3318</p>
                  </div>
                </a>

                {/* EMAIL */}
                <a href="mailto:ouvidoriasaudemuriae@hotmail.com" className={styles.contactCard}>
                  <span className={styles.contactIcon}>✉️</span>
                  <div>
                    <strong>Correio Eletrônico</strong>
                    <p>ouvidoriasaudemuriae@hotmail.com</p>
                  </div>
                </a>

                {/* ENDEREÇO */}
                <div className={styles.contactCardNoLink}>
                  <span className={styles.contactIcon}>📍</span>
                  <div>
                    <strong>Atendimento Presencial</strong>
                    <p>Avenida Maestro Sansão, 236 - Centro, Muriaé/MG</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* NOTA INFORMATIVA / AVISO INSTITUCIONAL */}
          <section className={styles.noticeBlock}>
            <div className={styles.noticeIcon}>ℹ️</div>
            <p>
              Todas as manifestações acolhidas são registradas nos sistemas oficiais, auditadas e analisadas, garantindo um <strong>posicionamento resolutivo ao cidadão</strong> e o encaminhamento técnico interno para o aperfeiçoamento contínuo da rede assistencial.
            </p>
          </section>

        </div>
      </main>
    </div>
  );
}