'use client';

import Link from 'next/link';
import { 
  Building2, 
  Award, 
  CheckCircle2, 
  ArrowLeft, 
  HeartHandshake, 
  ShieldCheck, 
  Stethoscope, 
  Users, 
  Activity,
  Sparkles,
  Hospital
} from 'lucide-react';
import styles from './Secretaria.module.css';

export default function SecretariaPage() {
  return (
    <div className={styles.pageWrapper}>
      
      {/* 1. HERO BANNER COM IMAGEM DE FUNDO */}
      <section 
        className={styles.heroBanner}
        style={{ backgroundImage: "url('/img/banner-header.png')" }}
      >
        <div className={styles.overlay}>
          <div className={styles.container}>
            <span className={styles.heroSubtitle}>INSTITUCIONAL</span>
            <h1 className={styles.heroTitle}>Secretaria Municipal de Saúde</h1>
            <p className={styles.heroDesc}>
              Planejando, coordenando e executando políticas públicas com qualidade, transparência e humanização no Sistema Único de Saúde (SUS) de Muriaé.
            </p>
          </div>
        </div>
      </section>

      {/* 2. BARRA DE NAVEGAÇÃO DE VOLTAR */}
      <div className={styles.navigationBar}>
        <div className={styles.container}>
          <Link href="/" className={styles.backLink}>
            ← Voltar para a Página Principal
          </Link>
        </div>
      </div>

      {/* 3. CONTEÚDO PRINCIPAL */}
      <section className={styles.contentSection}>
        <div className={styles.container}>
          
          {/* CARDS DE ESTATÍSTICAS DE DESTAQUE */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIconWrapper} style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>
                <Hospital size={24} />
              </div>
              <div>
                <h3 className={styles.statValue}>+100 Municípios</h3>
                <p className={styles.statLabel}>Atendidos via CRIE / SAE Ampliado</p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIconWrapper} style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
                <Activity size={24} />
              </div>
              <div>
                <h3 className={styles.statValue}>+4.000</h3>
                <p className={styles.statLabel}>Cirurgias Eletivas Realizadas</p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIconWrapper} style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
                <Stethoscope size={24} />
              </div>
              <div>
                <h3 className={styles.statValue}>7 Novas UBSs</h3>
                <p className={styles.statLabel}>E 26 Unidades Reformadas</p>
              </div>
            </div>
          </div>

          <div className={styles.contentGrid}>
            {/* COLUNA ESQUERDA - TEXTO INSTITUCIONAL */}
            <div className={styles.textContent}>
              
              <div className={styles.paragraphBlock}>
                <p>
                  A <strong>Secretaria Municipal de Saúde de Muriaé</strong> é responsável por planejar, coordenar e executar as políticas públicas de saúde do município, garantindo à população o acesso aos serviços do Sistema Único de Saúde (SUS) com qualidade, eficiência e humanização.
                </p>
                <p>
                  Sua atuação envolve desde a promoção da saúde e a prevenção de doenças até a assistência especializada, a vigilância em saúde, a assistência farmacêutica, a regulação dos serviços, o planejamento das ações e a gestão dos recursos públicos destinados à saúde. Em parceria com o Ministério da Saúde, a Secretaria de Estado de Saúde de Minas Gerais, universidades, instituições e demais órgãos públicos, a Secretaria desenvolve programas e estratégias voltados à melhoria contínua da qualidade de vida da população.
                </p>
                <p>
                  Além da coordenação da rede municipal de saúde, a Secretaria atua na formulação de políticas públicas, no fortalecimento da Atenção Primária, na promoção da saúde coletiva, no controle e monitoramento epidemiológico, sanitário e ambiental, na garantia do abastecimento de medicamentos e insumos, na fiscalização dos serviços contratualizados pelo SUS e no apoio ao Conselho Municipal de Saúde, assegurando uma gestão transparente, participativa e comprometida com o interesse público.
                </p>
              </div>

              {/* SEÇÃO DE CONQUISTAS E AVANÇOS */}
              <div className={styles.achievementsCard}>
                <h2 className={styles.sectionHeading}>
                  <Sparkles size={22} color="#0284c7" /> Principais Avanços e Consolidação Regional
                </h2>
                
                <p>
                  Nos últimos anos, Muriaé consolidou sua posição como um dos principais polos de saúde de Minas Gerais por meio de investimentos estruturantes e da ampliação dos serviços oferecidos à população:
                </p>

                <ul className={styles.bulletList}>
                  <li>
                    <CheckCircle2 size={18} className={styles.checkIcon} />
                    <span><strong>Centro de Referência para Imunobiológicos Especiais (CRIE):</strong> Integrado ao Serviço de Atenção Especializada (SAE Ampliado), atende hoje mais de 100 municípios da região.</span>
                  </li>
                  <li>
                    <CheckCircle2 size={18} className={styles.checkIcon} />
                    <span><strong>Centro Estadual de Atenção Especializada (CEAE):</strong> Antigo Centro Viva Vida/Hiperdia, modernizado para atender toda a microrregião de Muriaé.</span>
                  </li>
                  <li>
                    <CheckCircle2 size={18} className={styles.checkIcon} />
                    <span><strong>Expansão da Rede Física:</strong> Implantação de sete novas Unidades Básicas de Saúde (UBSs), quatro pontos de apoio e a reforma de 26 unidades já existentes.</span>
                  </li>
                  <li>
                    <CheckCircle2 size={18} className={styles.checkIcon} />
                    <span><strong>Saúde Bucal & Eletivas:</strong> Realização de mais de 4 mil cirurgias eletivas e ampliação dos atendimentos do Centro de Especialidades Odontológicas (CEO).</span>
                  </li>
                </ul>
              </div>

              <div className={styles.paragraphBlock}>
                <p>
                  Esse trabalho é resultado do compromisso permanente da Secretaria Municipal de Saúde, sob a coordenação da secretária <strong>Luiza Agostini de Andrade</strong>, em construir uma saúde pública cada vez mais acessível, resolutiva e inovadora. O reconhecimento obtido em âmbito estadual e nacional, incluindo premiações recebidas em Brasília, reforça o protagonismo de Muriaé na gestão do SUS e demonstra que investir em planejamento, inovação, transparência e valorização das pessoas é o caminho para oferecer uma saúde pública de excelência.
                </p>

                <div className={styles.quoteBox}>
                  <HeartHandshake size={32} color="#0284c7" />
                  <p>
                    &quot;Mais do que administrar serviços, a Secretaria Municipal de Saúde trabalha diariamente para cuidar das pessoas, fortalecendo uma rede de saúde que acolhe, previne, trata e promove qualidade de vida para toda a população de Muriaé.&quot;
                  </p>
                </div>
              </div>

            </div>

            {/* COLUNA DIREITA - SIDEBAR INSTITUCIONAL */}
            <aside className={styles.sidebar}>
              
              <div className={styles.sidebarCard}>
                <div className={styles.cardHeader}>
                  <ShieldCheck size={20} color="#0284c7" />
                  <h3>Gestão Atual</h3>
                </div>
                <div className={styles.secretaryProfile}>
                  <div className={styles.avatarPlaceholder}>
                    <Users size={32} color="#0284c7" />
                  </div>
                  <div>
                    <h4 className={styles.secretaryName}>Luiza Agostini de Andrade</h4>
                    <span className={styles.secretaryRole}>Secretária Municipal de Saúde</span>
                  </div>
                </div>
              </div>

              <div className={styles.sidebarCard}>
                <div className={styles.cardHeader}>
                  <Award size={20} color="#d97706" />
                  <h3>Reconhecimento Nacional</h3>
                </div>
                <p className={styles.sidebarText}>
                  Muriaé é destaque em gestão pública no SUS com premiações oficiais recebidas em Brasília e validação pela Secretaria de Estado de Saúde de Minas Gerais.
                </p>
              </div>

              <div className={styles.sidebarCard}>
                <div className={styles.cardHeader}>
                  <Building2 size={20} color="#16a34a" />
                  <h3>Pilares de Atuação</h3>
                </div>
                <ul className={styles.pilaresList}>
                  <li>• Atenção Primária Forte</li>
                  <li>• Vigilância em Saúde</li>
                  <li>• Assistência Farmacêutica</li>
                  <li>• Regulação e Transparência</li>
                  <li>• Controle Epidemiológico e Sanitário</li>
                </ul>
              </div>

            </aside>
          </div>

        </div>
      </section>
    </div>
  );
}