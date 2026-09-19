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
import { supabase } from '@/lib/supabase';
import { useUI } from '@/components/UIFeedback';
import styles from './AdminHero.module.css';

const VALORES_INICIAIS = {
  c1Val: '4.375', c1Text: 'Nº de Agendamentos em Consultas',
  c2Val: '1.319', c2Text: 'Nº de Faltas em Consultas',
  c3Val: '4.149', c3Text: 'Nº de Agendamentos em Exames',
  c4Val: '1.199', c4Text: 'Nº de Faltas em Exames'
};

export default function AdminHeroPage() {
  const { notificar } = useUI();
  const [stats, setStats] = useState(VALORES_INICIAIS);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState(false);

  // CARREGAMENTO INICIAL DOS INDICADORES DO SUPABASE
  useEffect(() => {
    let montado = true;

    async function carregar() {
      try {
        const { data, error } = await supabase
          .from('hero_stats')
          .select('*')
          .eq('id', 1)
          .maybeSingle();

        if (error) throw error;

        if (data && montado) {
          setStats({
            c1Val: data.c1_val || '',
            c1Text: data.c1_text || '',
            c2Val: data.c2_val || '',
            c2Text: data.c2_text || '',
            c3Val: data.c3_val || '',
            c3Text: data.c3_text || '',
            c4Val: data.c4_val || '',
            c4Text: data.c4_text || ''
          });
        }
      } catch (err) {
        console.warn('Erro ao carregar dados do Supabase:', err);
      } finally {
        if (montado) setLoading(false);
      }
    }

    carregar();

    return () => {
      montado = false;
    };
  }, []);

  // SALVAR OU ATUALIZAR INDICADORES NO SUPABASE
  const handleSalvar = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setMensagemSucesso(false);

    try {
      const payload = {
        c1_val: stats.c1Val,
        c1_text: stats.c1Text,
        c2_val: stats.c2Val,
        c2_text: stats.c2Text,
        c3_val: stats.c3Val,
        c3_text: stats.c3Text,
        c4_val: stats.c4Val,
        c4_text: stats.c4Text,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('hero_stats')
        .upsert({ id: 1, ...payload });

      if (error) throw error;

      localStorage.setItem('cache_hero_stats', JSON.stringify(stats));
      setMensagemSucesso(true);
      setTimeout(() => setMensagemSucesso(false), 4000);
    } catch (err) {
      console.error('Erro ao salvar configurações no Supabase:', err);
      notificar('erro', 'Erro ao salvar configurações: ' + err.message);
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