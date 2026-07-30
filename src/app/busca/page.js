'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, Calendar, FileText, MapPin } from 'lucide-react';
import { dbEventos } from '@/data/eventosData';
import styles from './Busca.module.css';

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [termoLocal, setTermoLocal] = useState(query);

  useEffect(() => {
    setTermoLocal(query);
  }, [query]);

  // 1. Pesquisa nos Eventos
  const eventosEncontrados = dbEventos.filter(e =>
    e.titulo.toLowerCase().includes(query.toLowerCase()) ||
    e.resumo.toLowerCase().includes(query.toLowerCase()) ||
    (e.descricao && e.descricao.toLowerCase().includes(query.toLowerCase()))
  );

  // 2. Se você tiver páginas institucionais ou serviços estáticos, pode adicionar aqui:
  const paginasEstaticas = [
    { id: 'ubs', titulo: 'Rede de Unidades Básicas de Saúde (UBS)', resumo: 'Confira os endereços e horários de funcionamento das UBS do município.', url: '/unidades-de-saude' },
    { id: 'vacinas', titulo: 'Campanhas de Vacinação', resumo: 'Informações sobre doses, calendários e pontos de vacinação ativos.', url: '/vacinacao' },
  ];

  const paginasEncontradas = query.trim() ? paginasEstaticas.filter(p =>
    p.titulo.toLowerCase().includes(query.toLowerCase()) ||
    p.resumo.toLowerCase().includes(query.toLowerCase())
  ) : [];

  const totalResultados = eventosEncontrados.length + paginasEncontradas.length;

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        
        <header className={styles.header}>
          <h1>Resultados da pesquisa</h1>
          {query && <p>Exibindo resultados para: <strong>"{query}"</strong></p>}
        </header>

        {totalResultados > 0 ? (
          <div className={styles.resultsList}>
            
            {/* RESULTADOS DE EVENTOS */}
            {eventosEncontrados.map((evento) => (
              <div key={`evt-${evento.id}`} className={styles.resultCard}>
                <span className={styles.categoryBadge}>
                  <Calendar size={12} /> Evento / Agenda
                </span>
                <h3 className={styles.cardTitle}>{evento.titulo}</h3>
                <p className={styles.cardResumo}>{evento.resumo}</p>
                <Link href={`/eventos/${evento.id}`} className={styles.cardLink}>
                  Acessar evento →
                </Link>
              </div>
            ))}

            {/* RESULTADOS DE PÁGINAS DO SITE */}
            {paginasEncontradas.map((pag) => (
              <div key={`pag-${pag.id}`} className={styles.resultCard}>
                <span className={styles.categoryBadgeInstitucional}>
                  <FileText size={12} /> Serviço / Informação
                </span>
                <h3 className={styles.cardTitle}>{pag.titulo}</h3>
                <p className={styles.cardResumo}>{pag.resumo}</p>
                <Link href={pag.url} className={styles.cardLink}>
                  Ver detalhes →
                </Link>
              </div>
            ))}

          </div>
        ) : (
          <div className={styles.emptyState}>
            <Search size={48} className={styles.emptyIcon} />
            <h2>Nenhum resultado encontrado</h2>
            <p>Não encontramos nenhum conteúdo correspondente a "{query}".</p>
            <Link href="/" className={styles.backHomeBtn}>Voltar para a página inicial</Link>
          </div>
        )}

      </div>
    </div>
  );
}

export default function BuscaPage() {
  return (
    <Suspense fallback={<div>Carregando resultados...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}