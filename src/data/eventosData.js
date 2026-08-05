    // src/data/eventosData.js

    // Array vazia: Todos os eventos agora virão do painel de administração (Planilha/Apps Script)
    export const dbEventos = [];

    export function getStatusEvento(evento, styles) {
    if (!evento || !evento.data) {
        return { label: 'Aberto / Inscrições', class: styles?.statusAberto || '' };
    }

    const agora = new Date();

    // 1. Extrai estritamente o formato YYYY-MM-DD para evitar problemas de fuso horário
    let dataISO = '';
    const strData = String(evento.data).trim();

    if (strData.includes('/')) {
        const partes = strData.split('/');
        if (partes.length === 3) {
        dataISO = `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`;
        }
    } else if (strData.includes('-')) {
        dataISO = strData.split('T')[0];
    }

    // Fallback caso a data seja um objeto ou string alternativa
    if (!dataISO) {
        const d = new Date(evento.data);
        if (!isNaN(d.getTime())) {
        dataISO = d.toISOString().split('T')[0];
        } else {
        return { label: 'Aberto / Inscrições', class: styles?.statusAberto || '' };
        }
    }

    // 2. Trata os horários de início e término
    const horaIni = evento.horaInicio || (evento.hora ? evento.hora.split(' ')[0] : '00:00');
    const horaFim = evento.horaFim || '23:59';

    const horaInicioLimpa = horaIni.includes(':') ? horaIni : '00:00';
    const horaFimLimpa = horaFim.includes(':') ? horaFim : '23:59';

    // 3. Monta as instâncias de Data para comparação
    const dataEventoInicio = new Date(`${dataISO}T${horaInicioLimpa}:00`);
    const dataEventoFim = new Date(`${dataISO}T${horaFimLimpa}:00`);

    if (isNaN(dataEventoInicio.getTime())) {
        return { label: 'Aberto / Inscrições', class: styles?.statusAberto || '' };
    }

    // 4. Retorna o status correto conforme o horário atual
    if (agora < dataEventoInicio) {
        return { label: 'Aberto / Inscrições', class: styles?.statusAberto || '' };
    } else if (agora >= dataEventoInicio && agora <= dataEventoFim) {
        return { label: 'Em Andamento', class: styles?.statusAndamento || '' };
    } else {
        return { label: 'Encerrado', class: styles?.statusEncerrado || '' };
    }
    }