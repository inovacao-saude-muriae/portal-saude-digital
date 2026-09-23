"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  X,
  CheckCircle,
  Send,
  Loader2,
  ClipboardList,
  Download,
  Search,
  FileCheck,
  Lock,
  Camera,
  Trash2,
} from "lucide-react";
import jsPDF from "jspdf";
import {
  dbEventos as dbEventosLocal,
  getStatusEvento,
} from "@/data/eventosData";
import { useEvento } from "@/hooks/useEventos";
import { useUI } from "@/components/UIFeedback";
import styles from "./EventosDetail.module.css";

function aplicarMascaraCPF(value) {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    .slice(0, 14);
}

function aplicarMascaraTelefone(value) {
  const nums = value.replace(/\D/g, "").slice(0, 11);
  if (nums.length <= 10) {
    return nums
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }
  return nums.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
}

function limparHora(horaBruta) {
  if (!horaBruta) return "";
  const str = String(horaBruta).trim();
  if (str.includes("1899") || str.includes("GMT") || str.includes("Sat Dec")) {
    const matchHora = str.match(/\d{2}:\d{2}/);
    return matchHora ? matchHora[0] : "";
  }
  return str;
}

function formatarDataBR(dataBruta) {
  if (!dataBruta) return "A definir";
  let str = String(dataBruta).trim();
  if (str.includes("1899") || str.includes("GMT") || str.includes("Sat Dec")) {
    return "A definir";
  }
  if (/^\d{2}\/\d{2}\/\d{4}/.test(str)) {
    return str.split("T")[0].split(" ")[0];
  }
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
    const partes = str.split("T")[0].split("-");
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }
  return str;
}

function formatarDataParaExibicao(valor) {
  if (!valor) return "-";
  const str = String(valor).trim();

  if (
    str.includes("GMT") ||
    str.includes("Mon") ||
    str.includes("Tue") ||
    str.includes("Wed") ||
    str.includes("Thu") ||
    str.includes("Fri") ||
    str.includes("Sat") ||
    str.includes("Sun")
  ) {
    try {
      const d = new Date(str);
      if (!isNaN(d.getTime())) {
        const dia = String(d.getDate()).padStart(2, "0");
        const mes = String(d.getMonth() + 1).padStart(2, "0");
        const ano = d.getFullYear();
        return `${dia}/${mes}/${ano}`;
      }
    } catch (e) {}
  }

  if (/^\d{2}\/\d{2}\/\d{4}/.test(str)) {
    return str.split("T")[0].split(" ")[0];
  }

  if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
    const partes = str.split("T")[0].split("-");
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  return str;
}

export default function EventoDetailPage() {
  const params = useParams();
  const id = params?.id;
  const { notificar, confirmar } = useUI();

  const { evento, loading, error } = useEvento(id);

  const [modalAberto, setModalAberto] = useState(false);
  const [abaModal, setAbaModal] = useState("inscricao");

  const [respostas, setRespostas] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [enviandoMsgExtra, setEnviandoMsgExtra] = useState(false);
  const [comprovante, setComprovante] = useState(null);
  const [mensagemErro, setMensagemErro] = useState(null);

  const [cpfConsulta, setCpfConsulta] = useState("");
  const [buscandoCpf, setBuscandoCpf] = useState(false);

  // CANCELAMENTO DE INSCRIÇÃO
  const [cancelando, setCancelando] = useState(false);
  const [inscricaoCancelada, setInscricaoCancelada] = useState(false);

  // CONTAGEM DE VAGAS
  const [totalInscritos, setTotalInscritos] = useState(null);

  // BUSCA CONTAGEM DE INSCRIÇÕES NO SUPABASE
  useEffect(() => {
    if (!evento || !evento.requerInscricao) return;

    async function buscarContagem() {
      try {
        const res = await fetch(
          `/api/inscricoes?eventoId=${encodeURIComponent(evento.id)}&eventoTitulo=${encodeURIComponent(evento.titulo)}`,
        );
        const data = await res.json();
        if (data.status === "success") {
          setTotalInscritos(data.total);
        }
      } catch (err) {
        console.warn("Não foi possível verificar contagem de vagas:", err);
      }
    }

    buscarContagem();
  }, [evento]);

  if (loading) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.loadingContainer}>
          <p>Carregando informações do evento...</p>
        </div>
      </div>
    );
  }

  if (!evento) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.containerNotFound}>
          <h2>Evento não encontrado</h2>
          <p>O evento solicitado não existe ou foi removido.</p>
          <Link href="/eventos" className={styles.btnVoltar}>
            ← Voltar para Eventos
          </Link>
        </div>
      </div>
    );
  }

  const isEncerrado =
    evento.inscricoesEncerradas === true ||
    String(evento.inscricoesEncerradas) === "true";
  const vagasLimite =
    evento.vagasMaximo != null ? parseInt(evento.vagasMaximo, 10) : null;
  const vagasEsgotadas =
    vagasLimite &&
    !isNaN(vagasLimite) &&
    totalInscritos !== null &&
    totalInscritos >= vagasLimite;
  const inscricaoBloqueada = isEncerrado || vagasEsgotadas;

  const statusOriginal = getStatusEvento(evento, styles);

  const statusLabel = inscricaoBloqueada
    ? vagasEsgotadas && !isEncerrado
      ? "Vagas Esgotadas"
      : "Inscrições Encerradas"
    : statusOriginal.label;
  const statusClass = inscricaoBloqueada
    ? styles.statusBadgeEncerrado
    : statusOriginal.class;

  const imagemExibicao = evento.imgSrc || evento.imagem || "";
  const horaExibicao = limparHora(evento.hora);

  const camposFormulario =
    Array.isArray(evento.formFields) && evento.formFields.length > 0
      ? evento.formFields
      : [
          {
            id: 1,
            label: "Nome Completo",
            type: "text",
            required: true,
            options: [],
          },
          { id: 2, label: "CPF", type: "cpf", required: true, options: [] },
          {
            id: 3,
            label: "E-mail",
            type: "email",
            required: true,
            options: [],
          },
          {
            id: 4,
            label: "Telefone Celular",
            type: "tel",
            required: true,
            options: [],
          },
        ];

  const handleInputChange = (campo, valorBruto) => {
    let valorFinal = valorBruto;
    if (campo.type === "cpf") {
      valorFinal = aplicarMascaraCPF(valorBruto);
    } else if (campo.type === "tel") {
      valorFinal = aplicarMascaraTelefone(valorBruto);
    }
    setRespostas((prev) => ({ ...prev, [campo.label]: valorFinal }));
  };

  const handleCheckboxMultiChange = (label, opcao, checked) => {
    setRespostas((prev) => {
      const selecaoAtual = Array.isArray(prev[label]) ? prev[label] : [];
      let novaSelecao = checked
        ? [...selecaoAtual, opcao]
        : selecaoAtual.filter((o) => o !== opcao);
      return { ...prev, [label]: novaSelecao };
    });
  };

  const handleAbrirModal = (aba = "inscricao") => {
    if (aba === "inscricao" && inscricaoBloqueada) {
      notificar(
        "info",
        vagasEsgotadas && !isEncerrado
          ? "As vagas para este evento estão esgotadas."
          : "As inscrições para este evento estão encerradas.",
      );
      return;
    }
    setAbaModal(aba);
    setModalAberto(true);
    setMensagemErro(null);
    setComprovante(null);
    setCpfConsulta("");
    setInscricaoCancelada(false);
  };

  const handleFecharModal = () => {
    setModalAberto(false);
    setComprovante(null);
    setRespostas({});
    setMensagemErro(null);
    setInscricaoCancelada(false);
  };

  const handleInscricaoSubmit = async (e) => {
    e.preventDefault();
    if (isEncerrado) {
      setMensagemErro("As inscrições estão encerradas.");
      return;
    }

    setEnviando(true);
    setEnviandoMsgExtra(false);
    setMensagemErro(null);

    const timerMsgExtra = setTimeout(() => setEnviandoMsgExtra(true), 8000);

    for (const campo of camposFormulario) {
      const val = respostas[campo.label];
      if (
        campo.required &&
        (!val || (Array.isArray(val) && val.length === 0))
      ) {
        setMensagemErro(`O campo "${campo.label}" é obrigatório.`);
        setEnviando(false);
        return;
      }
      if (campo.type === "cpf" && val && val.replace(/\D/g, "").length !== 11) {
        setMensagemErro(`Informe um CPF válido com 11 dígitos.`);
        setEnviando(false);
        return;
      }
    }

    const listaRespostas = camposFormulario.map((c) => {
      const resp = respostas[c.label];
      return {
        label: c.label,
        valor: Array.isArray(resp) ? resp.join(", ") : resp || "",
      };
    });

    try {
      const payload = {
        eventoId: evento.id,
        eventoTitulo: evento.titulo,
        respostas: listaRespostas,
      };

      const response = await fetch("/api/inscricoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();

      if (resData.status === "error") {
        const msg = resData.message || "";

        if (
          msg.toLowerCase().includes("cpf") &&
          msg.toLowerCase().includes("já possui")
        ) {
          setMensagemErro("Este CPF já possui uma inscrição cadastrada");
          return;
        }

        if (msg.toLowerCase().includes("esgotadas")) {
          setTotalInscritos(vagasLimite);
          setMensagemErro(
            "Que pena! As vagas para este evento foram esgotadas.",
          );
          return;
        }

        setMensagemErro(msg || "Erro ao realizar inscrição. Tente novamente.");
        return;
      }

      if (resData.codigo || resData.inscrito) {
        setTotalInscritos((prev) => (prev !== null ? prev + 1 : null));

        const inscrito = resData.inscrito || {};
        const listaDetalhes = inscrito.respostas
          ? Object.entries(inscrito.respostas).map(([key, val]) => ({
              label: key,
              valor: val,
            }))
          : listaRespostas;

        setComprovante({
          codigo:
            resData.codigo || inscrito.codigo_inscricao || "INS-CONFIRMED",
          evento: inscrito.evento_titulo || evento.titulo,
          dataHora: new Date().toLocaleString("pt-BR"),
          detalhes: listaDetalhes,
        });
      }
    } catch (err) {
      console.error("Erro de envio:", err);
      setMensagemErro(
        "Ocorreu um erro ao processar sua inscrição. Tente novamente.",
      );
    } finally {
      clearTimeout(timerMsgExtra);
      setEnviandoMsgExtra(false);
      setEnviando(false);
    }
  };

  const handleConsultarCpfSubmit = async (e) => {
    e.preventDefault();
    const digitos = cpfConsulta.replace(/\D/g, "");

    if (digitos.length !== 11) {
      setMensagemErro("Informe um CPF válido com 11 dígitos.");
      return;
    }

    setBuscandoCpf(true);
    setMensagemErro(null);

    try {
      const url = `/api/inscricoes?cpf=${encodeURIComponent(cpfConsulta)}&eventoId=${encodeURIComponent(evento.id)}&eventoTitulo=${encodeURIComponent(evento.titulo)}`;
      const res = await fetch(url);
      const data = await res.json();

      const item = data.inscricao || data.comprovante || data.data;

      if ((data.status === "success" || data.success) && item) {
        const listaDetalhes = item.respostas
          ? Object.entries(item.respostas).map(([key, val]) => ({
              label: key,
              valor: val,
            }))
          : [
              { label: "Nome Completo", valor: item.nome },
              { label: "CPF", valor: item.cpf },
              { label: "E-mail", valor: item.email },
            ];

        setComprovante({
          codigo: item.codigo_inscricao || item.codigo || "INS-CONFIRMED",
          evento: item.evento_titulo || evento.titulo,
          dataHora: item.created_at
            ? new Date(item.created_at).toLocaleString("pt-BR")
            : new Date().toLocaleString("pt-BR"),
          detalhes: listaDetalhes,
        });
      } else {
        setMensagemErro(
          data.message ||
            "Nenhuma inscrição encontrada neste evento para o CPF informado.",
        );
      }
    } catch (err) {
      console.error("Erro na consulta:", err);
      setMensagemErro("Erro ao consultar banco de dados. Tente novamente.");
    } finally {
      setBuscandoCpf(false);
    }
  };

  const handleBaixarPdf = () => {
    if (!comprovante) return;

    try {
      // Criar um novo documento PDF
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Configurações de estilo
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;

      // Cabeçalho
      doc.setFillColor(15, 23, 42); // Cor de fundo azul escuro
      doc.rect(0, 0, pageWidth, 30, "F");

      doc.setTextColor(255, 255, 255); // Texto branco
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("PORTAL SAÚDE DIGITAL", margin, 15);

      doc.setFontSize(12);
      doc.text("Secretaria Municipal de Saúde", margin, 22);

      // Reset cor do texto
      doc.setTextColor(0, 0, 0);

      // Título principal
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("COMPROVANTE DE INSCRIÇÃO", pageWidth / 2, 50, {
        align: "center",
      });

      // Linha decorativa
      doc.setDrawColor(59, 130, 246);
      doc.setLineWidth(1);
      doc.line(margin, 55, pageWidth - margin, 55);

      // Informações do código
      doc.setFillColor(239, 246, 255);
      doc.rect(margin, 65, contentWidth, 25, "F");

      doc.setTextColor(59, 130, 246);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text("CÓDIGO DE CONFIRMAÇÃO", margin + 5, 72);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text(comprovante.codigo, margin + 5, 83);

      // Título do evento
      let yPosition = 105;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(15, 23, 42);
      doc.text("EVENTO:", margin, yPosition);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);

      // Quebra o título em linhas se for muito longo
      const tituloLines = doc.splitTextToSize(
        comprovante.evento,
        contentWidth - 40,
      );
      doc.text(tituloLines, margin + 35, yPosition);

      yPosition += tituloLines.length * 6 + 10;

      // Data e hora da inscrição
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text("DATA E HORA DA INSCRIÇÃO:", margin, yPosition);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      doc.text(String(comprovante.dataHora), margin + 78, yPosition);

      yPosition += 15;

      // Linha divisória
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 10;

      // Dados do participante
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(15, 23, 42);
      doc.text("DADOS DO PARTICIPANTE:", margin, yPosition);
      yPosition += 12;

      // Renderiza os detalhes do comprovante, ocultando E-mail e Data de Nascimento
      const detalhesFiltrados = (comprovante.detalhes || []).filter(
        (detalhe) => {
          const lbl = (detalhe.label || "").toLowerCase().trim();
          const ocultar =
            lbl.includes("email") ||
            lbl.includes("e-mail") ||
            lbl.includes("nascimento") ||
            lbl.includes("data nasc");
          return !ocultar;
        },
      );

      if (detalhesFiltrados.length > 0) {
        detalhesFiltrados.forEach((detalhe) => {
          if (
            detalhe.valor &&
            detalhe.valor.trim() !== "" &&
            detalhe.valor !== "-"
          ) {
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text(`${detalhe.label}:`, margin, yPosition);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(11);
            doc.setTextColor(0, 0, 0);

            const valorLines = doc.splitTextToSize(
              detalhe.valor,
              contentWidth - 50,
            );
            doc.text(valorLines, margin + 50, yPosition);

            yPosition += Math.max(valorLines.length * 5, 8);
          }
        });
      }

      // Rodapé
      const rodapeY = pageHeight - 40;
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, rodapeY - 5, pageWidth - margin, rodapeY - 5);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(
        "Este é um documento oficial gerado automaticamente pelo sistema.",
        pageWidth / 2,
        rodapeY,
        { align: "center" },
      );
      doc.text(
        "Portal Saúde Digital - Secretaria Municipal de Saúde",
        pageWidth / 2,
        rodapeY + 10,
        { align: "center" },
      );

      // Salvar o PDF
      const nomeEvento = comprovante.evento
        .replace(/[^a-zA-Z0-9]/g, "_")
        .substring(0, 30);
      const nomeArquivo = `Comprovante_${comprovante.codigo}_${nomeEvento}.pdf`;

      doc.save(nomeArquivo);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      notificar(
        "erro",
        "Erro ao gerar o arquivo PDF. Tente novamente ou use a impressão do navegador.",
      );
    }
  };

  // Cancela a inscrição: remove os dados do participante do evento.
  const handleCancelarInscricao = async () => {
    if (!comprovante || !comprovante.codigo) return;

    const confirmou = await confirmar({
      titulo: "Cancelar inscrição",
      mensagem:
        "Tem certeza que deseja cancelar sua inscrição? Seus dados serão removidos deste evento e esta ação não pode ser desfeita.",
      textoConfirmar: "Cancelar inscrição",
    });
    if (!confirmou) return;

    setCancelando(true);
    try {
      const url = `/api/inscricoes?codigo=${encodeURIComponent(comprovante.codigo)}`;
      const res = await fetch(url, { method: "DELETE" });
      const data = await res.json();

      if (data.status === "success") {
        setTotalInscritos((prev) =>
          prev !== null && prev > 0 ? prev - 1 : prev,
        );
        setInscricaoCancelada(true);
        notificar("sucesso", "Inscrição cancelada e dados removidos do evento.");
      } else {
        notificar(
          "erro",
          data.message || "Não foi possível cancelar a inscrição.",
        );
      }
    } catch (err) {
      console.error("Erro ao cancelar inscrição:", err);
      notificar(
        "erro",
        "Ocorreu um erro ao cancelar a inscrição. Tente novamente.",
      );
    } finally {
      setCancelando(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.navigationBar}>
        <div className={styles.container}>
          <Link href="/eventos" className={styles.backLink}>
            ← Voltar para Eventos
          </Link>
        </div>
      </div>

      <main className={styles.mainContent}>
        <div className={styles.container}>
          <article className={styles.articleCard}>
            <div className={styles.headerMeta}>
              <span className={styles.dataPublicacao}>
                Data: {formatarDataBR(evento.data)}{" "}
                {horaExibicao ? `• ${horaExibicao}` : ""}
              </span>
              <span className={`${styles.statusBadge} ${statusClass}`}>
                {statusLabel}
              </span>
            </div>

            <h1 className={styles.titulo}>{evento.titulo}</h1>

            {evento.resumo && <p className={styles.resumo}>{evento.resumo}</p>}

            <div className={styles.imageWrapper}>
              {imagemExibicao ? (
                <Image
                  src={imagemExibicao}
                  alt={evento.titulo}
                  width={900}
                  height={450}
                  priority
                  unoptimized
                  className={styles.imagemCapa}
                />
              ) : (
                <div className={styles.imagemCapaPlaceholder}>
                  <Camera size={56} strokeWidth={1.5} />
                  <span>Sem imagem</span>
                </div>
              )}
            </div>

            {evento.requerInscricao && (
              <div
                className={`${styles.bannerInscricao} ${inscricaoBloqueada ? styles.bannerEncerrado : ""}`}
              >
                <div>
                  <h3 className={styles.bannerInscricaoTitulo}>
                    {vagasEsgotadas && !isEncerrado
                      ? "Vagas Esgotadas"
                      : isEncerrado
                        ? "Inscrições Encerradas"
                        : "Inscrições Abertas!"}
                  </h3>
                  <p className={styles.bannerInscricaoTexto}>
                    {vagasEsgotadas && !isEncerrado
                      ? "Todas as vagas disponíveis para este evento foram preenchidas."
                      : isEncerrado
                        ? "As inscrições para este evento foram encerradas pela organização."
                        : "Garanta sua vaga neste evento preenchendo o formulário de participação."}
                  </p>
                </div>

                <div className={styles.bannerButtonsCol}>
                  {!inscricaoBloqueada ? (
                    <button
                      onClick={() => handleAbrirModal("inscricao")}
                      className={styles.btnAbrirInscricao}
                    >
                      <ClipboardList size={20} /> Inscrever-se Agora
                    </button>
                  ) : (
                    <button disabled className={styles.btnInscricaoDisabled}>
                      <Lock size={18} />{" "}
                      {vagasEsgotadas && !isEncerrado
                        ? "Vagas Esgotadas"
                        : "Inscrição Encerrada"}
                    </button>
                  )}

                  <button
                    onClick={() => handleAbrirModal("consulta")}
                    className={styles.btnLinkSegundaVia}
                  >
                    <FileCheck size={15} /> Emitir 2ª via do comprovante/Cancelar Inscrição
                  </button>
                </div>
              </div>
            )}

            <div className={styles.corpoConteudo}>
              <h3>Sobre o Evento</h3>
              {Array.isArray(evento.descricao)
                ? evento.descricao.map((p, idx) => <p key={idx}>{p}</p>)
                : String(evento.descricao || "")
                    .split("\n")
                    .map((paragrafo, idx) =>
                      paragrafo.trim() ? <p key={idx}>{paragrafo}</p> : null,
                    )}
            </div>

            {evento.local && (
              <div className={styles.infoBlock}>
                <h3>📍 Local de Realização</h3>
                <p>{evento.local}</p>
              </div>
            )}

            {evento.geraCertificado && (
              <div className={styles.badgeCertificadoBox}>
                <span className={styles.badgeCertificadoIcone}>📜</span>
                <div>
                  <strong className={styles.badgeCertificadoTitulo}>
                    Evento com Emissão de Certificado
                  </strong>
                  <p className={styles.badgeCertificadoTexto}>
                    Os participantes inscritos com presença confirmada receberão
                    certificado digital.
                  </p>
                </div>
              </div>
            )}

            {evento.cronograma && evento.cronograma.length > 0 && (
              <div className={styles.infoBlock}>
                <h3>🕒 Programação e Palestras</h3>
                <div className={styles.cronogramaList}>
                  {evento.cronograma.map((item, idx) => (
                    <div key={idx} className={styles.cronogramaItem}>
                      <span className={styles.cronoHora}>
                        {limparHora(item.horario || item.hora)}
                      </span>
                      <div className={styles.cronoConteudo}>
                        <strong>{item.atividade || item.tema}</strong>
                        {item.palestrante && (
                          <p className={styles.palestranteNome}>
                            👤 {item.palestrante}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>
      </main>

      {modalAberto && (
        <div
          className={styles.modalBackdrop}
          onClick={(e) => e.target === e.currentTarget && handleFecharModal()}
        >
          <div className={styles.modalBoxContainer}>
            <button
              onClick={handleFecharModal}
              className={styles.modalCloseIconBtn}
            >
              <X size={18} />
            </button>

            {!comprovante ? (
              <div className={styles.modalFormContent}>
                <div className={styles.modalTabsBar}>
                  {!inscricaoBloqueada && (
                    <button
                      type="button"
                      onClick={() => {
                        setAbaModal("inscricao");
                        setMensagemErro(null);
                      }}
                      className={`${styles.modalTabBtn} ${abaModal === "inscricao" ? styles.modalTabActive : ""}`}
                    >
                      <ClipboardList size={16} /> Nova Inscrição
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setAbaModal("consulta");
                      setMensagemErro(null);
                    }}
                    className={`${styles.modalTabBtn} ${abaModal === "consulta" ? styles.modalTabActive : ""}`}
                  >
                    <Search size={16} /> Emitir 2ª Via
                  </button>
                </div>

                {mensagemErro && (
                  <div className={styles.msgErro}>{mensagemErro}</div>
                )}

                {abaModal === "inscricao" && !inscricaoBloqueada && (
                  <form
                    onSubmit={handleInscricaoSubmit}
                    className={styles.modalFormFlex}
                  >
                    <div className={styles.modalFormBodyFields}>
                      {camposFormulario.map((campo, idx) => {
                        const opcoesArray = Array.isArray(campo.options)
                          ? campo.options.filter(
                              (o) => typeof o === "string" && o.trim() !== "",
                            )
                          : typeof campo.options === "string"
                            ? campo.options
                                .split(",")
                                .map((o) => o.trim())
                                .filter(Boolean)
                            : [];

                        return (
                          <div key={idx} className={styles.modalFieldGroup}>
                            <label className={styles.modalFieldLabel}>
                              {campo.label}{" "}
                              {campo.required && (
                                <span className={styles.fieldRequiredMark}>
                                  *
                                </span>
                              )}
                            </label>

                            {campo.type === "select" ? (
                              <select
                                required={campo.required}
                                value={respostas[campo.label] || ""}
                                onChange={(e) =>
                                  handleInputChange(campo, e.target.value)
                                }
                                className={styles.modalFieldSelect}
                              >
                                <option value="">Selecione uma opção...</option>
                                {opcoesArray.map((opcaoText, oIdx) => (
                                  <option key={oIdx} value={opcaoText}>
                                    {opcaoText}
                                  </option>
                                ))}
                              </select>
                            ) : campo.type === "checkbox" ? (
                              opcoesArray.length > 0 ? (
                                <div className={styles.checkboxGroupWrapper}>
                                  {opcoesArray.map((opcaoText, oIdx) => {
                                    const marcado =
                                      Array.isArray(respostas[campo.label]) &&
                                      respostas[campo.label].includes(
                                        opcaoText,
                                      );
                                    return (
                                      <label
                                        key={oIdx}
                                        className={styles.checkboxOptionLabel}
                                      >
                                        <input
                                          type="checkbox"
                                          checked={marcado}
                                          onChange={(e) =>
                                            handleCheckboxMultiChange(
                                              campo.label,
                                              opcaoText,
                                              e.target.checked,
                                            )
                                          }
                                          className={styles.modalCheckboxInput}
                                        />
                                        <span>{opcaoText}</span>
                                      </label>
                                    );
                                  })}
                                </div>
                              ) : (
                                <label className={styles.checkboxOptionLabel}>
                                  <input
                                    type="checkbox"
                                    required={campo.required}
                                    checked={!!respostas[campo.label]}
                                    onChange={(e) =>
                                      handleInputChange(
                                        campo,
                                        e.target.checked ? "Sim" : "",
                                      )
                                    }
                                    className={styles.modalCheckboxInput}
                                  />
                                  <span>
                                    Concordo e confirmo minha participação
                                  </span>
                                </label>
                              )
                            ) : (
                              <input
                                type={
                                  campo.type === "number"
                                    ? "number"
                                    : campo.type === "date"
                                      ? "date"
                                      : campo.type === "email"
                                        ? "email"
                                        : "text"
                                }
                                required={campo.required}
                                value={respostas[campo.label] || ""}
                                onChange={(e) =>
                                  handleInputChange(campo, e.target.value)
                                }
                                placeholder={
                                  campo.type === "cpf"
                                    ? "000.000.000-00"
                                    : campo.type === "tel"
                                      ? "(00) 00000-0000"
                                      : `Informe seu ${campo.label.toLowerCase()}`
                                }
                                className={styles.modalFieldInput}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <button
                      type="submit"
                      disabled={enviando}
                      className={styles.btnConfirmarInscricao}
                    >
                      {enviando ? (
                        enviandoMsgExtra ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />{" "}
                            Aguarde, o servidor está respondendo...
                          </>
                        ) : (
                          <>
                            <Loader2 size={18} className="animate-spin" />{" "}
                            Processando inscrição...
                          </>
                        )
                      ) : (
                        <>
                          <Send size={18} /> Confirmar Inscrição
                        </>
                      )}
                    </button>
                  </form>
                )}

                {abaModal === "consulta" && (
                  <form
                    onSubmit={handleConsultarCpfSubmit}
                    className={styles.modalFormFlex}
                  >
                    <p className={styles.modalConsultarTexto}>
                      Informe seu CPF para localizar a inscrição realizada neste
                      evento e emitir a 2ª via do comprovante.
                    </p>

                    <div className={styles.modalFieldGroup}>
                      <label className={styles.modalFieldLabel}>
                        CPF do Participante*
                      </label>
                      <input
                        type="text"
                        required
                        value={cpfConsulta}
                        onChange={(e) =>
                          setCpfConsulta(aplicarMascaraCPF(e.target.value))
                        }
                        placeholder="000.000.000-00"
                        className={styles.modalFieldInput}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={buscandoCpf}
                      className={styles.btnConfirmarInscricao}
                    >
                      {buscandoCpf ? (
                        <>
                          <Loader2 size={18} className="animate-spin" /> Aguarde
                        </>
                      ) : (
                        <>
                          <Search size={18} /> Localizar Comprovante
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <div className={styles.comprovanteWrapper}>
                <CheckCircle
                  size={48}
                  className={styles.comprovanteCheckIcon}
                />
                <h3 className={styles.comprovanteTituloSucesso}>
                  Comprovante de Inscrição
                </h3>
                <p className={styles.comprovanteSubtitulo}>
                  Documento oficial registrado no sistema.
                </p>

                <div
                  id="comprovante-pdf-container"
                  className={styles.comprovanteCardPdf}
                >
                  <div className={styles.ticketHeader}>
                    <div>
                      <span className={styles.ticketBadgeTag}>
                        SAÚDE PÚBLICA • PORTAL OFICIAL
                      </span>
                      <h2 className={styles.ticketTitle}>
                        Comprovante de Inscrição
                      </h2>
                    </div>
                    <div className={styles.ticketCodeBox}>
                      <span className={styles.ticketCodeLabel}>
                        CÓDIGO DE CONFIRMAÇÃO
                      </span>
                      <strong className={styles.ticketCodeNum}>
                        {comprovante.codigo}
                      </strong>
                    </div>
                  </div>

                  <div className={styles.ticketDivider}></div>

                  <div className={styles.ticketSection}>
                    <span className={styles.ticketSectionLabel}>
                      EVENTO SELECIONADO
                    </span>
                    <h3 className={styles.ticketEventTitle}>
                      {comprovante.evento}
                    </h3>
                    <div className={styles.ticketMetaRow}>
                      <span>
                        📅 <strong>Data e hora da inscrição:</strong>{" "}
                        {comprovante.dataHora}
                      </span>
                    </div>
                  </div>

                  <div className={styles.ticketGridDetails}>
                    {(() => {
                      const chavesDesejadas = [
                        {
                          labelExibicao: "Nome Completo",
                          termos: ["nome", "nome completo"],
                        },
                        { labelExibicao: "CPF", termos: ["cpf"] },
                      ];

                      return chavesDesejadas.map((item, i) => {
                        const itemEncontrado = comprovante.detalhes.find(
                          (d) => {
                            const lbl = (d.label || "").toLowerCase().trim();
                            return item.termos.some((termo) =>
                              lbl.includes(termo),
                            );
                          },
                        );

                        let valorExibicao = itemEncontrado?.valor
                          ? itemEncontrado.valor
                          : "-";

                        if (item.isDate && valorExibicao !== "-") {
                          valorExibicao =
                            formatarDataParaExibicao(valorExibicao);
                        }

                        return (
                          <div key={i} className={styles.ticketDetailItem}>
                            <strong className={styles.ticketDetailLabel}>
                              {item.labelExibicao}
                            </strong>
                            <span className={styles.ticketDetailValue}>
                              {valorExibicao}
                            </span>
                          </div>
                        );
                      });
                    })()}
                  </div>

                  <div className={styles.ticketFooter}>
                    <span>✓ Inscrição confirmada no sistema.</span>
                    <span className={styles.ticketStamp}>DOCUMENTO VÁLIDO</span>
                  </div>
                </div>

                {inscricaoCancelada ? (
                  <div className={styles.cancelamentoAviso}>
                    <p>
                      Sua inscrição foi cancelada e seus dados foram removidos
                      deste evento.
                    </p>
                    <button
                      onClick={handleFecharModal}
                      className={styles.btnFecharModal}
                    >
                      Fechar
                    </button>
                  </div>
                ) : (
                  <div className={styles.comprovanteActionButtons}>
                    <button
                      onClick={handleBaixarPdf}
                      className={styles.btnDownloadPdf}
                    >
                      <Download size={16} /> Baixar PDF
                    </button>
                    <button
                      onClick={handleCancelarInscricao}
                      disabled={cancelando}
                      className={styles.btnCancelarInscricao}
                    >
                      {cancelando ? (
                        <>
                          <Loader2 size={16} className="girando" /> Cancelando...
                        </>
                      ) : (
                        <>
                          <Trash2 size={16} /> Cancelar Inscrição
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleFecharModal}
                      className={styles.btnFecharModal}
                    >
                      Fechar
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
