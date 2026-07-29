'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Eventos.module.css';

export const dbEventos = [
  {
    "id": 1,
    "titulo": "SAE Ampliado e o CRIE Macrorregional",
    "resumo": "O SAE Ampliado passa a atuar como referência no cuidado de pessoas com infecções e condições crônicas...",
    "descricao": "A Prefeitura de Muriaé, por meio da Secretaria Municipal de Saúde, realiza a inauguração de dois importantes equipamentos que fortalecem o atendimento especializado no município e em toda a região: o SAE Ampliado e o CRIE Macrorregional, agora em funcionamento no espaço do antigo SESC. O SAE Ampliado passa a atuar como referência no cuidado de pessoas com infecções e condições crônicas transmissíveis, oferecendo atendimento médico especializado, acompanhamento multiprofissional, testagem, tratamento e suporte integral ao paciente. Já o CRIE amplia o acesso a vacinas especiais, garantindo mais proteção para quem mais precisa, com atendimento presencial e suporte técnico voltado a toda a macrorregião. Mais acesso, mais cuidado e mais qualidade de vida para a população.",
    "imgSrc": "/img/eventos/evento1.png",
    "data": "2026-03-20",
    "galeria": [
      "/img/eventos/galeria/evento1/1.jpg",
      "/img/eventos/galeria/evento1/2.jpg",
      "/img/eventos/galeria/evento1/3.jpg",
      "/img/eventos/galeria/evento1/4.jpg",
      "/img/eventos/galeria/evento1/5.jpg"
    ]
  },
  {
    "id": 2,
    "titulo": "Unidade Básica de Saúde do Santo Antônio",
    "resumo": "Extensão estratégica da rede municipal no distrito da Gameleira...",
    "descricao": "O Posto de Apoio à Unidade Básica de Saúde do Santo Antônio, no distrito da Gameleira passa a funcionar como uma extensão estratégica da rede municipal, aproximando os serviços de saúde da população local e reduzindo as barreiras de acesso enfrentadas em áreas rurais. Vinculado à UBS Santo Antônio, o posto tem como principal objetivo levar atendimento primário diretamente aos moradores da Gameleira, garantindo mais agilidade, continuidade do cuidado e presença dos profissionais de saúde no território. Os atendimentos serão realizados em dias específicos, com agenda organizada e atuação itinerante de diferentes especialidades.",
    "imgSrc": "/img/eventos/evento2.png",
    "data": "2026-03-19",
    "galeria": [
      "/img/eventos/galeria/evento2/1.jpg",
      "/img/eventos/galeria/evento2/2.jpg"
    ]
  },
  {
    "id": 3,
    "titulo": "UBS Liberty Dias",
    "resumo": "O novo espaço é moderno, estruturado e preparado para oferecer mais qualidade...",
    "descricao": "A Prefeitura de Muriaé realiza a inauguração da UBS Liberty Dias, no bairro Inconfidência, marcando mais um avanço na ampliação da rede de atenção à saúde no município. O novo espaço é moderno, estruturado e preparado para oferecer mais qualidade, agilidade e cuidado à população do bairro, fortalecendo o atendimento na Atenção Primária. Mais do que uma nova unidade, a UBS representa a ampliação do acesso à saúde, o reforço das ações de prevenção e a presença de uma equipe preparada para atender com responsabilidade e humanização.",
    "imgSrc": "/img/eventos/evento3.png",
    "data": "2026-02-28",
    "galeria": [
      "/img/eventos/galeria/evento3/1.jpg",
      "/img/eventos/galeria/evento3/2.jpg"
    ]
  },
  {
    "id": 4,
    "titulo": "2º Simpósio Regulando cuidados em saúde",
    "resumo": "Fortalecimento do acesso à saúde com integração de tecnologia e inovação...",
    "descricao": "A Secretaria Municipal de Saúde de Muriaé convida para um importante momento de diálogo e construção coletiva. No dia 21 de maio, será realizado o 2º Simpósio 'Regulando cuidados em saúde', com foco no fortalecimento do acesso, na integração dos serviços e no uso da tecnologia como aliada da gestão e do cuidado. O encontro será uma oportunidade para troca de experiências, atualização profissional e discussão aprofundada sobre estratégias que qualificam a assistência à população.",
    "imgSrc": "/img/eventos/simposio.png",
    "data": "2026-05-21",
    "horaInicio": "08:30",
    "horaFim": "16:00",
    "tipo": "simposio",
    "local": "Teatro Zaccarias Marques, Av. Maestro Sansão - em cima da Rodoviária",
    "cronograma": [
      { "hora": "08:30", "tema": "Boas-vindas (breakfast e credenciamento)", "palestrante": "" },
      { "hora": "09:00", "tema": "Abertura - Composição da mesa", "palestrante": "" },
      { "hora": "09:30", "tema": "Fluxos assistenciais a tratamentos em prestadores de Muriaé - Onde acessar os serviços?", "palestrante": "Cláudia Moreira – Diretora de Linhas de Cuidados" },
      { "hora": "09:30", "tema": "Tecnologia como ferramenta de informação - Descubra Muriaé", "palestrante": "Jefinny Souza – Chefe de tecnologia da informação" },
      { "hora": "09:30", "tema": "Fluxos de acesso GRS Ubá", "palestrante": "Fabiana Erica de Souza – Coordenadora de Acesso à Serviços de Saúde da GRS Ubá" },
      { "hora": "10:00", "tema": "Mesa redonda - Da regulação à Judicialização: as formas de acesso aos serviços SUS", "palestrante": "Fabiana Erica de Souza – Coordenadora de Acesso à Serviços de Saúde da GRS Ubá" },
      { "hora": "11:00", "tema": "Tempo para questionamentos da plateia", "palestrante": "" },
      { "hora": "12:00", "tema": "Almoço", "palestrante": "" },
      { "hora": "13:15", "tema": "Reabertura das apresentações com a Secretária Municipal de Saúde", "palestrante": "Luiza Agostini de Andrade" },
      { "hora": "13:30", "tema": "Contratos e PPI – direitos e desafios na gestão do SUS", "palestrante": "Márcia Moraes" },
      { "hora": "15:00", "tema": "Debates e tira dúvidas", "palestrante": "Márcia Moraes e Luiza Agostini de Andrade - Secretária Municipal de Saúde de Muriaé" },
      { "hora": "16:00", "tema": "Encerramento Oficial", "palestrante": "" }   
    ],
    "formulario": [
      { "label": "Nome completo", "name": "nome", "type": "text", "required": true },
      { "label": "Município", "name": "municipio", "type": "text", "required": true },
      { "label": "Cargo/Função", "name": "cargo", "type": "text", "required": true },
      { "label": "E-mail", "name": "email", "type": "email", "required": false },
      { "label": "Telefone", "name": "telefone", "type": "text", "required": false }
    ],
    "scriptUrl": "https://script.google.com/macros/s/AKfycbwDyUaKoI6ptX85kKkVnOfBJJ_ikOkuteLY97fbFlsUDE3zxxDYWgem2iNNmrzrhm-C/exec"
  }
];

// FUNÇÃO PARA CALCULAR O STATUS AUTOMÁTICO
export function getStatusEvento(evento) {
  const agora = new Date();
  const dataEventoInicio = new Date(`${evento.data}T${evento.horaInicio || '00:00'}:00`);
  const dataEventoFim = new Date(`${evento.data}T${evento.horaFim || '23:59'}:00`);

  if (agora < dataEventoInicio) {
    return { label: 'Aberto / Inscrições', class: styles.statusAberto };
  } else if (agora >= dataEventoInicio && agora <= dataEventoFim) {
    return { label: 'Em Andamento', class: styles.statusAndamento };
  } else {
    return { label: 'Encerrado', class: styles.statusEncerrado };
  }
}

export default function EventosPage() {
  const [busca, setBusca] = useState('');

  const eventosFiltrados = dbEventos.filter(e => 
    e.titulo.toLowerCase().includes(busca.toLowerCase()) || 
    e.resumo.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className={styles.pageWrapper}>
      <section className={styles.heroBanner}>
        <div className={styles.container}>
          <span className={styles.heroBadge}>📅 Agenda & Registros</span>
          <h1 className={styles.heroTitle}>Eventos da Saúde</h1>
          <p className={styles.heroSubtitle}>
            Acompanhe simpósios, inaugurações, encontros e capacitações promovidos pela Secretaria Municipal de Saúde.
          </p>
        </div>
      </section>

      <main className={styles.mainContent}>
        <div className={styles.container}>
          
          <div className={styles.searchBox}>
            <span className={styles.searchIcon}>🔍</span>
            <input 
              type="text" 
              placeholder="Pesquisar eventos..." 
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.eventosGrid}>
            {eventosFiltrados.map((evento) => {
              const status = getStatusEvento(evento);
              const dataFormatada = new Date(`${evento.data}T00:00:00`).toLocaleDateString('pt-BR');

              return (
                <div key={evento.id} className={styles.eventoCard}>
                  <div className={styles.cardImageWrapper}>
                    <Image 
                      src={evento.imgSrc} 
                      alt={evento.titulo} 
                      width={400} 
                      height={240} 
                      unoptimized 
                      className={styles.cardImage}
                    />
                    <span className={`${styles.statusBadge} ${status.class}`}>
                      {status.label}
                    </span>
                  </div>

                  <div className={styles.cardBody}>
                    <span className={styles.eventoData}>📅 {dataFormatada}</span>
                    <h3 className={styles.cardTitle}>{evento.titulo}</h3>
                    <p className={styles.cardResumo}>{evento.resumo}</p>
                    
                    <Link href={`/eventos/${evento.id}`} className={styles.cardBtn}>
                      Ver detalhes do evento →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </main>
    </div>
  );
}