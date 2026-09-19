import { useState, useEffect, useCallback } from 'react';
import { getDbEventos, getEventoById } from '@/data/eventosData';
import { API_CONFIG, buildApiUrl } from '@/lib/config';

export function useEventos() {
  const [eventos, setEventos] = useState([]);
  // Inicia como true pois o carregamento inicial ocorre na montagem.
  // Evita chamar setLoading(true) sincronamente dentro do effect.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lógica de carregamento isolada e independente de estado/efeito.
  // Recebe callbacks para atualizar estado apenas quando o componente
  // ainda está montado, evitando setState em componentes desmontados.
  const buscarEventos = useCallback(async ({ onEventos, onError } = {}) => {
    try {
      // 1. Tenta carregar do Supabase diretamente
      const eventosSupabase = await getDbEventos();
      if (eventosSupabase.length > 0) {
        localStorage.setItem('cache_portal_eventos', JSON.stringify(eventosSupabase));
        onEventos?.(eventosSupabase);
        return;
      }

      // 2. Fallback para API REST
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.EVENTOS, { action: 'GET_ALL' }));
      const resData = await response.json();

      if (resData.status === 'success' && Array.isArray(resData.eventos)) {
        const eventosFormatados = resData.eventos.map(evento => ({
          id: evento.id,
          titulo: evento.titulo,
          resumo: evento.resumo,
          local: evento.local,
          data: evento.data,
          hora: evento.hora,
          categoria: evento.categoria,
          imagem: evento.imagem || '',
          imgSrc: evento.imagem || '',
          descricao: evento.descricao,
          cronograma: Array.isArray(evento.cronograma) ? evento.cronograma :
                      (typeof evento.cronograma === 'string' ? JSON.parse(evento.cronograma || '[]') : []),
          requerInscricao: evento.requer_inscricao ?? false,
          geraCertificado: evento.gera_certificado ?? false,
          formFields: Array.isArray(evento.form_fields) ? evento.form_fields :
                      (typeof evento.form_fields === 'string' ? JSON.parse(evento.form_fields || '[]') : []),
          autor: evento.autor,
          inscricoesEncerradas: evento.inscricoes_encerradas ?? false,
          vagasMaximo: evento.vagas_maximo
        }));

        localStorage.setItem('cache_portal_eventos', JSON.stringify(eventosFormatados));
        onEventos?.(eventosFormatados);
      }
    } catch (err) {
      console.error('Erro ao carregar eventos:', err);
      onError?.(err.message);

      // Fallback para cache local
      try {
        const cachedData = localStorage.getItem('cache_portal_eventos');
        if (cachedData) {
          onEventos?.(JSON.parse(cachedData));
        }
      } catch (cacheErr) {
        console.error('Erro ao ler cache:', cacheErr);
      }
    }
  }, []);

  useEffect(() => {
    let montado = true;

    buscarEventos({
      onEventos: (lista) => { if (montado) setEventos(lista); },
      onError: (msg) => { if (montado) setError(msg); }
    }).finally(() => {
      if (montado) setLoading(false);
    });

    return () => {
      montado = false;
    };
  }, [buscarEventos]);

  // Carregamento manual (ex: botão "atualizar")
  const carregarEventos = useCallback(async () => {
    setLoading(true);
    setError(null);
    await buscarEventos({
      onEventos: setEventos,
      onError: setError
    });
    setLoading(false);
  }, [buscarEventos]);

  const recarregarEventos = useCallback(() => {
    localStorage.removeItem('cache_portal_eventos');
    return carregarEventos();
  }, [carregarEventos]);

  return {
    eventos,
    loading,
    error,
    carregarEventos,
    recarregarEventos
  };
}

export function useEvento(id) {
  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function carregarEvento() {
      if (!id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // 1. Busca diretamente do Supabase
        const eventoEncontrado = await getEventoById(id);
        if (eventoEncontrado) {
          setEvento(eventoEncontrado);
          return;
        }

        // 2. Fallback para API REST
        const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.EVENTOS, { id }));
        const resData = await response.json();
        
        if (resData.status === 'success' && resData.evento) {
          const eventoFormatado = {
            id: resData.evento.id,
            titulo: resData.evento.titulo,
            resumo: resData.evento.resumo,
            local: resData.evento.local,
            data: resData.evento.data,
            hora: resData.evento.hora,
            categoria: resData.evento.categoria,
            imagem: resData.evento.imagem || '',
            imgSrc: resData.evento.imagem || '',
            descricao: resData.evento.descricao,
            cronograma: Array.isArray(resData.evento.cronograma) ? resData.evento.cronograma : 
                        (typeof resData.evento.cronograma === 'string' ? JSON.parse(resData.evento.cronograma || '[]') : []),
            requerInscricao: resData.evento.requer_inscricao ?? false,
            geraCertificado: resData.evento.gera_certificado ?? false,
            formFields: Array.isArray(resData.evento.form_fields) ? resData.evento.form_fields :
                        (typeof resData.evento.form_fields === 'string' ? JSON.parse(resData.evento.form_fields || '[]') : []),
            autor: resData.evento.autor,
            inscricoesEncerradas: resData.evento.inscricoes_encerradas ?? false,
            vagasMaximo: resData.evento.vagas_maximo
          };
          setEvento(eventoFormatado);
          return;
        }

        // 3. Fallback para cache local
        const cachedData = localStorage.getItem('cache_portal_eventos');
        if (cachedData) {
          const eventos = JSON.parse(cachedData);
          const eventoCache = eventos.find((e) => String(e.id) === String(id));
          if (eventoCache) {
            setEvento(eventoCache);
            return;
          }
        }

        setError('Evento não encontrado');
      } catch (err) {
        console.error('Erro ao carregar evento:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    carregarEvento();
  }, [id]);

  return {
    evento,
    loading,
    error
  };
}