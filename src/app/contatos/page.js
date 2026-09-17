"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, MapPin, Mail, MessageCircle, ArrowUpRight } from "lucide-react";
import { listaContatos, categoriasContatos } from "@/data/contatosData";
import styles from "./Contatos.module.css";

// Retorna os dígitos do telefone já com DDD (assume 32/Muriaé quando vier sem)
function digitosComDDD(tel) {
  const digitos = (tel || "").replace(/\D/g, "");
  return digitos.length <= 9 ? `32${digitos}` : digitos;
}

function normalizarTexto(texto) {
  if (!texto) return "";
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export default function ContatosPage() {
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");
  const [busca, setBusca] = useState("");

  const handleSubmeterBusca = (e) => {
    e.preventDefault();
  };

  // FILTRAGEM COMBINADA (TEMA + BUSCA IGNORANDO ACENTOS)
  const termo = normalizarTexto(busca.trim());

  const contatosFiltrados = listaContatos.filter((item) => {
    const bateCategoria =
      categoriaAtiva === "Todos" || item.categoria === categoriaAtiva;
    const bateNome = normalizarTexto(item.nome).includes(termo);
    const bateEndereco = normalizarTexto(item.endereco).includes(termo);
    const bateCategoriaTexto = normalizarTexto(item.categoria).includes(termo);
    const bateTelefone = (item.telefone || "").replace(/\D/g, "").includes(busca.replace(/\D/g, ""));
    const buscaTemDigitos = busca.replace(/\D/g, "").length > 0;

    const bateBusca =
      bateNome ||
      bateEndereco ||
      bateCategoriaTexto ||
      (buscaTemDigitos && bateTelefone);

    return bateCategoria && bateBusca;
  });

  return (
    <div className={styles.pageWrapper}>
      
      {/* 1. BANNER DE TOPO COM GRADIENTE E BARRA COLORIDA */}
      <section className={styles.heroBanner}>
        <div className={styles.overlay}>
          <div className={styles.container}>
            <span className={styles.heroSubtitle}>INSTITUCIONAL</span>
            <h1 className={styles.heroTitle}>Guia de Contatos da Saúde</h1>
            <p className={styles.heroDesc}>
              Encontre telefones, endereços, e-mails e localizações das Unidades
              Básicas, Policlínicas e Centros Especializados de Muriaé.
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
      <main className={styles.mainContainer}>
        <div className={styles.container}>
          {/* CAMPO DE PESQUISA COMPACTO E PADRONIZADO */}
          <form onSubmit={handleSubmeterBusca} className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar unidade pelo nome ou endereço..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className={styles.searchInput}
            />
            {busca && (
              <button
                type="button"
                className={styles.clearBtn}
                onClick={() => setBusca("")}
                title="Limpar busca"
              >
                ✕
              </button>
            )}
            <button type="submit" className={styles.searchBtn}>
              Buscar
            </button>
          </form>

          {/* FILTROS POR TEMA (ABAS / BOTÕES) */}
          <div className={styles.filterTrack}>
            {categoriasContatos.map((cat) => (
              <button
                key={cat}
                className={`${styles.filterBtn} ${categoriaAtiva === cat ? styles.filterBtnActive : ""}`}
                onClick={() => setCategoriaAtiva(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* CONTADOR DE RESULTADOS */}
          {contatosFiltrados.length > 0 && (
            <p className={styles.resultCount}>
              {contatosFiltrados.length}{" "}
              {contatosFiltrados.length === 1
                ? "unidade encontrada"
                : "unidades encontradas"}
            </p>
          )}

          {/* LISTA DE CARDS DE CONTATO */}
          {contatosFiltrados.length > 0 ? (
            <div className={styles.contactsGrid}>
              {contatosFiltrados.map((contato) => (
                <div key={contato.id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <span className={styles.categoryBadge}>
                      {contato.categoria}
                    </span>
                    <h3 className={styles.cardTitle}>{contato.nome}</h3>
                  </div>

                  <div className={styles.cardBody}>
                    {contato.telefone && (
                      <div className={styles.infoRow}>
                        <span className={`${styles.iconBox} ${styles.iconBoxWhats}`}>
                          <MessageCircle size={16} />
                        </span>
                        <div className={styles.infoContent}>
                          <strong>WhatsApp</strong>
                          <p className={styles.telefoneTexto}>
                            {contato.telefone.split("/").map((tel, i, arr) => {
                              const numeroLimpo = tel.trim();
                              const numeroCompleto = digitosComDDD(tel);
                              return (
                                <span key={i}>
                                  <a
                                    href={`https://wa.me/55${numeroCompleto}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.whatsappLink}
                                    title="Conversar no WhatsApp"
                                  >
                                    {numeroLimpo}
                                  </a>
                                  {i < arr.length - 1 ? " · " : ""}
                                </span>
                              );
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                    {contato.endereco && (
                      <div className={styles.infoRow}>
                        <span className={`${styles.iconBox} ${styles.iconBoxAddress}`}>
                          <MapPin size={16} />
                        </span>
                        <div className={styles.infoContent}>
                          <strong>Endereço</strong>
                          <p>{contato.endereco}</p>
                        </div>
                      </div>
                    )}
                    {contato.email && (
                      <div className={styles.infoRow}>
                        <span className={`${styles.iconBox} ${styles.iconBoxMail}`}>
                          <Mail size={16} />
                        </span>
                        <div className={styles.infoContent}>
                          <strong>E-mail</strong>
                          <p>
                            <a
                              href={`mailto:${contato.email}`}
                              className={styles.contatoLink}
                            >
                              {contato.email}
                            </a>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className={styles.cardFooter}>
                    <a
                      href={contato.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.mapsBtn}
                    >
                      <MapPin size={16} />
                      <span>Ver localização</span>
                      <ArrowUpRight size={15} className={styles.mapsBtnArrow} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <Search size={40} className={styles.emptyIcon} />
              <h3>Nenhum contato encontrado</h3>
              <p>
                Não encontramos nenhuma unidade correspondente aos critérios da
                sua busca.
              </p>
              <button
                className={styles.resetSearchBtn}
                onClick={() => {
                  setBusca("");
                  setCategoriaAtiva("Todos");
                }}
              >
                Limpar Filtros
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
