'use client'

import { useState } from 'react'
import { migrateEventsToSupabase } from '@/lib/migrate-to-supabase'
import { supabase } from '@/lib/supabase'

export default function MigracaoTest() {
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [eventos, setEventos] = useState([])

  const testarConexao = async () => {
    setLoading(true)
    setStatus('Testando conexão...')
    
    try {
      const { data, error } = await supabase
        .from('eventos')
        .select('count', { count: 'exact', head: true })
      
      if (error) throw error
      
      setStatus(`✅ Conexão OK! Total de eventos: ${data || 0}`)
    } catch (error) {
      setStatus(`❌ Erro de conexão: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const listarEventos = async () => {
    setLoading(true)
    setStatus('Buscando eventos...')
    
    try {
      const { data, error } = await supabase
        .from('eventos')
        .select('*')
        .limit(10)
      
      if (error) throw error
      
      setEventos(data || [])
      setStatus(`✅ Encontrados ${data?.length || 0} eventos`)
    } catch (error) {
      setStatus(`❌ Erro ao buscar: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const executarMigracao = async () => {
    setLoading(true)
    setStatus('Executando migração...')
    
    try {
      const result = await migrateEventsToSupabase()
      
      if (result.success) {
        setStatus(`✅ ${result.message}`)
        listarEventos() // Recarrega a lista
      } else {
        setStatus(`❌ ${result.message}`)
      }
    } catch (error) {
      setStatus(`❌ Erro na migração: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const criarTabelasTeste = async () => {
    setLoading(true)
    setStatus('Verificando tabelas...')
    
    try {
      // Testa se as tabelas existem tentando fazer uma query simples
      const { error: eventosError } = await supabase
        .from('eventos')
        .select('id')
        .limit(1)
      
      const { error: inscritosError } = await supabase
        .from('evento_inscritos')
        .select('id')
        .limit(1)
      
      if (!eventosError && !inscritosError) {
        setStatus('✅ Todas as tabelas existem e estão acessíveis!')
      } else {
        setStatus('❌ Algumas tabelas não existem. Execute o script SQL primeiro.')
      }
    } catch (error) {
      setStatus(`❌ Erro ao verificar tabelas: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ccc', 
      borderRadius: '8px',
      margin: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2>🔧 Utilitário de Migração para Supabase</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Status: {status}</h3>
        {loading && <p>⏳ Carregando...</p>}
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <button 
          onClick={testarConexao} 
          disabled={loading}
          style={{ padding: '10px 15px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          🔍 Testar Conexão
        </button>
        
        <button 
          onClick={criarTabelasTeste} 
          disabled={loading}
          style={{ padding: '10px 15px', background: '#10b981', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          📋 Verificar Tabelas
        </button>
        
        <button 
          onClick={executarMigracao} 
          disabled={loading}
          style={{ padding: '10px 15px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          🚀 Migrar Eventos
        </button>
        
        <button 
          onClick={listarEventos} 
          disabled={loading}
          style={{ padding: '10px 15px', background: '#8b5cf6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          📂 Listar Eventos
        </button>
      </div>

      {eventos.length > 0 && (
        <div>
          <h3>📋 Eventos no Supabase:</h3>
          <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #eee', padding: '10px' }}>
            {eventos.map(evento => (
              <div key={evento.id} style={{ 
                padding: '10px', 
                borderBottom: '1px solid #eee',
                marginBottom: '5px'
              }}>
                <strong>{evento.titulo}</strong><br />
                <small>ID: {evento.id} | Data: {evento.data} | Local: {evento.local}</small>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p><strong>Instruções:</strong></p>
        <ol>
          <li>Execute o script <code>supabase-schema.sql</code> no SQL Editor do Supabase</li>
          <li>Configure as variáveis de ambiente no arquivo <code>.env</code></li>
          <li>Clique em &quot;Testar Conexão&quot; para verificar se tudo está funcionando</li>
          <li>Use &quot;Migrar Eventos&quot; para transferir dados do eventosData.js</li>
        </ol>
      </div>
    </div>
  )
}