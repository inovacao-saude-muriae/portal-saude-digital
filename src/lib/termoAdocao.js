import jsPDF from 'jspdf';

// Itens do Termo de Adoção e Responsabilidade (conforme documento oficial do CCZ)
export const TERMO_COMPROMISSOS = [
  { titulo: 'Garantir o bem-estar', texto: 'deste animal, respeitando suas características e zelando pelas suas necessidades psicológicas e físicas;' },
  { titulo: 'Garantir sua saúde física', texto: 'fornecendo abrigo, alimento adequado, higiene, vacinas e levando-o regularmente ao veterinário;' },
  { titulo: 'Garantir sua saúde psicológica', texto: 'respeitando suas características e fornecendo atenção, carinho, e a possibilidade de interagir com outras pessoas ou animais;' },
  { titulo: 'Garantir sua segurança', texto: 'mantendo-o sempre dentro de casa e fazendo passeios com coleira e guia (no caso de cães);' },
  { titulo: 'Mantê-lo em ambiente limpo', texto: 'arejado e espaçoso, com possibilidade de abrigo do sol ou chuva;' },
  { titulo: 'Não o manter preso', texto: 'em espaços pequenos ou em correntes;' },
  { titulo: 'Identificá-lo', texto: 'com plaquinha ou microchip, tornando mais fácil recuperá-lo caso ele se perca;' },
  { titulo: 'Garantir sua esterilização', texto: 'processo sem contraindicações que garante a redução de animais abandonados nas ruas;' },
  { titulo: 'NUNCA e em nenhuma circunstância abandoná-lo', texto: 'na rua ou entregá-lo a um desconhecido;' },
  { titulo: 'Comunicar qualquer outro destino', texto: 'que envolva o animal, tais como desaparecimento ou morte;' },
  { titulo: 'Permitir a visita', texto: 'do protetor responsável pela adoção ou antigo dono até a completa adaptação do animal (6 meses).' }
];

export const TERMO_CIENTE = [
  'Um cão ou gato pode viver até 15 anos ou mais, e durante todo este tempo serei responsável pelo seu bem-estar, principalmente durante sua velhice;',
  'O não cumprimento dos itens acima poderá ser interpretado como maus-tratos, o que acarretará a retirada do animal pelo doador responsável a qualquer tempo;',
  'Maus-tratos é crime e estarei sujeito às penas previstas pela Lei Federal de Proteção aos Animais nº 9605 art. 32 de 13/fevereiro/1998, no caso de infração.'
];

// Formata o CPF (000.000.000-00). Se não tiver 11 dígitos, retorna o valor original.
function formatarCPF(valor) {
  const d = String(valor || '').replace(/\D/g, '');
  if (d.length !== 11) return valor || '';
  return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

// Formata telefone: (32) 9 9826-5629 (celular) ou (32) 3696-3305 (fixo).
function formatarTelefone(valor) {
  const d = String(valor || '').replace(/\D/g, '');
  if (d.length === 11) return d.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2 $3-$4');
  if (d.length === 10) return d.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  return valor || '';
}

/**
 * Gera e baixa o Termo de Adoção preenchido em PDF.
 * @param {object} solicitacao - registro de adocao_solicitacoes
 *   (nome, cpf, telefone, rua, numero, bairro, cidade, cep, animal_nome)
 * @param {object} animal - dados opcionais do animal (especie, sexo)
 */
// Carrega uma imagem pública e converte para dataURL (necessário para o jsPDF)
async function carregarImagemBase64(caminho) {
  try {
    const resp = await fetch(caminho);
    if (!resp.ok) return null;
    const blob = await resp.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export async function gerarPdfTermoAdocao(solicitacao, animal = {}) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 16;
  const contentW = pageW - margin * 2;
  let y = 0;

  // ---------- CABEÇALHO (fundo azul + logo do CCZ) ----------
  const headerAltura = 26;
  doc.setFillColor(0, 101, 164); // azul institucional
  doc.rect(0, 0, pageW, headerAltura, 'F');

  // Logo do CCZ à esquerda
  const logo = await carregarImagemBase64('/img/ccz.png');
  if (logo) {
    try {
      doc.addImage(logo, 'PNG', margin, 4, 18, 18);
    } catch {
      // se falhar, segue sem a logo
    }
  }

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('TERMO DE ADOÇÃO E RESPONSABILIDADE', pageW / 2, 12, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('Centro de Controle de Zoonoses — Secretaria Municipal de Saúde de Muriaé', pageW / 2, 18.5, { align: 'center' });
  doc.setTextColor(0, 0, 0);
  y = headerAltura + 16;

  // ---------- IDENTIFICAÇÃO NO FORMATO DE FORMULÁRIO (com linhas) ----------
  const especie = animal.especie || '';
  const sexo = animal.sexo
    ? (String(animal.sexo).toLowerCase() === 'macho' ? 'Macho' : 'Fêmea')
    : '';
  const animalId = animal.id_animal || solicitacao.animal_id || animal.id || '';

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.setDrawColor(120, 120, 120);
  doc.setLineWidth(0.2);

  // Escreve um rótulo + valor sobre uma linha preenchível.
  // Retorna a posição X onde a linha termina.
  const campo = (rotulo, valor, x, larguraCampo, linhaY) => {
    doc.setFont('helvetica', 'normal');
    doc.text(rotulo, x, linhaY);
    const rotuloW = doc.getTextWidth(rotulo + ' ');
    const inicioLinha = x + rotuloW + 1;
    const fimLinha = x + larguraCampo;
    // valor por cima da linha
    if (valor) {
      doc.text(String(valor), inicioLinha + 1, linhaY - 1);
    }
    doc.line(inicioLinha, linhaY + 0.5, fimLinha, linhaY + 0.5);
    return fimLinha;
  };

  const linhaGap = 9;

  // Linha 1: Eu ______________________  CPF/RG ____________
  campo('Eu', solicitacao.nome, margin, contentW * 0.66, y);
  campo('CPF/RG', formatarCPF(solicitacao.cpf), margin + contentW * 0.7, contentW * 0.3, y);
  y += linhaGap;

  // Linha 2: residente __________________  nº ____  Bairro __________
  campo('residente', solicitacao.rua, margin, contentW * 0.55, y);
  campo('nº', solicitacao.numero, margin + contentW * 0.58, contentW * 0.14, y);
  campo('Bairro', solicitacao.bairro, margin + contentW * 0.74, contentW * 0.26, y);
  y += linhaGap;

  // Linha 3: Cidade/Estado __________________  Contato __________
  campo('Cidade/Estado', solicitacao.cidade, margin, contentW * 0.6, y);
  campo('Contato', formatarTelefone(solicitacao.telefone), margin + contentW * 0.63, contentW * 0.37, y);
  y += linhaGap + 3;

  // Frase de responsabilidade
  doc.setFont('helvetica', 'normal');
  doc.text('Estou adotando e assumindo total responsabilidade pelo seguinte animal:', margin, y);
  y += linhaGap;

  // Linha 4: ID ________  Espécie ________  Sexo ________
  campo('ID', animalId, margin, contentW * 0.34, y);
  campo('Espécie', especie, margin + contentW * 0.37, contentW * 0.31, y);
  campo('Sexo', sexo, margin + contentW * 0.7, contentW * 0.3, y);
  y += linhaGap + 4;

  doc.setLineWidth(0.2);

  // ---------- COMPROMISSOS ----------
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('Comprometo-me a:', margin, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);

  const lineH = 3.4;
  TERMO_COMPROMISSOS.forEach((item) => {
    const linhas = doc.splitTextToSize(`•  ${item.titulo} ${item.texto}`, contentW);
    doc.text(linhas, margin, y);
    y += linhas.length * lineH + 1.2;
  });

  y += 2;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('Estou ciente de que:', margin, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  TERMO_CIENTE.forEach((item) => {
    const linhas = doc.splitTextToSize(`•  ${item}`, contentW);
    doc.text(linhas, margin, y);
    y += linhas.length * lineH + 1.2;
  });

  // ---------- DATA + ASSINATURAS (centralizado) ----------
  y += 10;
  doc.setFontSize(9.5);
  doc.text('Muriaé, _______ de __________________ de _________', pageW / 2, y, { align: 'center' });

  y += 24;
  const larguraLinha = 70;
  const gap = 16;
  const totalLinhas = larguraLinha * 2 + gap;
  const inicioX = (pageW - totalLinhas) / 2;
  const x1c = inicioX + larguraLinha / 2;
  const x2c = inicioX + larguraLinha + gap + larguraLinha / 2;

  doc.setDrawColor(0, 0, 0);
  doc.line(inicioX, y, inicioX + larguraLinha, y);
  doc.line(inicioX + larguraLinha + gap, y, inicioX + larguraLinha * 2 + gap, y);
  y += 4.5;
  doc.setFontSize(8.5);
  doc.text('Responsável do CCZ', x1c, y, { align: 'center' });
  doc.text('Adotante', x2c, y, { align: 'center' });

  const nomeArquivo = `Termo_Adocao_${(solicitacao.nome || 'adotante').replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
  doc.save(nomeArquivo);
}
