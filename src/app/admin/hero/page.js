'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Save, 
  Loader2, 
  Sparkles, 
  CheckCircle2, 
  ArrowLeft, 
  ShieldCheck 
} from 'lucide-react';
import styles from './AdminHero.module.css';

const SCRIPT_URL = process.env.NEXT_PUBLIC_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbyzBI9rvja9s0STIWBIsTeA0z2OhGDZLVL4bu5IjDOQkTOA-SDFE1JxF54COF9YS4A/exec';

const VALORES_INICIAIS = {
  c1Val: '4.375', c1Text: 'Nº de Agendamentos em Consultas',
  c2Val: '1.319', c2Text: 'Nº de Faltas em Consultas',
  c3Val: '4.149', c3Text: 'Nº de Agendamentos em Exames',
  c4Val: '1.199', c4Text: 'Nº de Faltas em Exames'
};

export default function AdminHeroPage() {
  const [stats, setStats] = useState(VALORES_INICIAIS);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState(false);

  useEffect(() => {
    async function carregar() {
      try {
        const res = await fetch(`${SCRIPT_URL}?action=GET_HERO_STATS`);
        const data = await res.json();
        if (data && data.status === 'success' && data.stats) {
          setStats(data.stats);
        }
      } catch (err) {
        console.warn('Erro ao carregar dados do admin:', err);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);

  const handleSalvar = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setMensagemSucesso(false);

    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'UPDATE_HERO_STATS',
          stats: stats
        })
      });

      const resData = await response.json();
      if (resData.status === 'success') {
        localStorage.setItem('cache_hero_stats', JSON.stringify(stats));
        setMensagemSucesso(true);
        setTimeout(() => setMensagemSucesso(false), 4000);
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar configurações.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        
        {/* CABEÇALHO DO PAINEL ADMIN */}
        <div className={styles.headerBar}>
          <div>
            <span className={styles.badgeHeader}>
              <ShieldCheck size={14} /> Painel Administrativo
            </span>
            <h1 className={styles.mainTitle}>Indicadores do Banner Principal</h1>
            <p className={styles.subTitle}>
              Altere os números e descrições dos 4 cartões exibidos na página inicial.
            </p>
          </div>

          <Link href="/admin" className={styles.backBtn}>
            <ArrowLeft size={16} /> Voltar ao Painel
          </Link>
        </div>

        {/* CONTEÚDO PRINCIPAL / FORMULÁRIO */}
        <div className={styles.cardMain}>
          
          {loading ? (
            <div className={styles.loadingBox}>
              <Loader2 size={24} className="animate-spin" /> Carregando indicadores...
            </div>
          ) : (
            <>
              <div className={styles.headerTitle}>
                <Sparkles color="#0065a4" size={20} />
                <h2>Cartões em Destaque (Home)</h2>
              </div>

              {mensagemSucesso && (
                <div className={styles.alertSuccess}>
                  <CheckCircle2 size={18} /> Indicadores da Home atualizados com sucesso!
                </div>
              )}

              <form onSubmit={handleSalvar} className={styles.formGrid}>
                {/* CARTÃO 1 */}
                <div className={styles.cardBox}>
                  <div className={styles.cardBoxHeader}>
                    <span className={styles.cardBoxTitle}>Cartão 1</span>
                    <span className={styles.cardBadgeTag}>Posição 1</span>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Número / Valor</label>
                    <input 
                      type="text" 
                      value={stats.c1Val} 
                      onChange={(e) => setStats({...stats, c1Val: e.target.value})} 
                      placeholder="Ex: 4.375" 
                      required 
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Texto do Rótulo</label>
                    <input 
                      type="text" 
                      value={stats.c1Text} 
                      onChange={(e) => setStats({...stats, c1Text: e.target.value})} 
                      placeholder="Ex: Nº de Agendamentos em Consultas" 
                      required 
                    />
                  </div>
                </div>

                {/* CARTÃO 2 */}
                <div className={styles.cardBox}>
                  <div className={styles.cardBoxHeader}>
                    <span className={styles.cardBoxTitle}>Cartão 2</span>
                    <span className={styles.cardBadgeTag}>Posição 2</span>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Número / Valor</label>
                    <input 
                      type="text" 
                      value={stats.c2Val} 
                      onChange={(e) => setStats({...stats, c2Val: e.target.value})} 
                      placeholder="Ex: 1.319" 
                      required 
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Texto do Rótulo</label>
                    <input 
                      type="text" 
                      value={stats.c2Text} 
                      onChange={(e) => setStats({...stats, c2Text: e.target.value})} 
                      placeholder="Ex: Nº de Faltas em Consultas" 
                      required 
                    />
                  </div>
                </div>

                {/* CARTÃO 3 */}
                <div className={styles.cardBox}>
                  <div className={styles.cardBoxHeader}>
                    <span className={styles.cardBoxTitle}>Cartão 3</span>
                    <span className={styles.cardBadgeTag}>Posição 3</span>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Número / Valor</label>
                    <input 
                      type="text" 
                      value={stats.c3Val} 
                      onChange={(e) => setStats({...stats, c3Val: e.target.value})} 
                      placeholder="Ex: 4.149" 
                      required 
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Texto do Rótulo</label>
                    <input 
                      type="text" 
                      value={stats.c3Text} 
                      onChange={(e) => setStats({...stats, c3Text: e.target.value})} 
                      placeholder="Ex: Nº de Agendamentos em Exames" 
                      required 
                    />
                  </div>
                </div>

                {/* CARTÃO 4 */}
                <div className={styles.cardBox}>
                  <div className={styles.cardBoxHeader}>
                    <span className={styles.cardBoxTitle}>Cartão 4</span>
                    <span className={styles.cardBadgeTag}>Posição 4</span>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Número / Valor</label>
                    <input 
                      type="text" 
                      value={stats.c4Val} 
                      onChange={(e) => setStats({...stats, c4Val: e.target.value})} 
                      placeholder="Ex: 1.199" 
                      required 
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Texto do Rótulo</label>
                    <input 
                      type="text" 
                      value={stats.c4Text} 
                      onChange={(e) => setStats({...stats, c4Text: e.target.value})} 
                      placeholder="Ex: Nº de Faltas em Exames" 
                      required 
                    />
                  </div>
                </div>

                <button type="submit" disabled={salvando} className={styles.btnSalvar}>
                  {salvando ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Salvar Alterações</>}
                </button>
              </form>
            </>
          )}

        </div>

      </div>
    </div>
  );
}