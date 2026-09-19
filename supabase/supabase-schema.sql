-- Estrutura das tabelas para o Portal Saúde Digital no Supabase
-- Execute estes comandos no SQL Editor do Supabase

-- 1. Tabela de eventos
CREATE TABLE IF NOT EXISTS eventos (
    id TEXT PRIMARY KEY DEFAULT 'evt-' || floor(random() * 1000000)::text,
    titulo TEXT NOT NULL,
    resumo TEXT,
    local TEXT,
    data DATE,
    hora TEXT,
    categoria TEXT DEFAULT 'Saúde',
    descricao TEXT,
    autor TEXT DEFAULT 'Sistema',
    imagem TEXT,
    img_src TEXT,
    -- Campos para inscrições
    requer_inscricao BOOLEAN DEFAULT false,
    inscricoes_encerradas BOOLEAN DEFAULT false,
    gera_certificado BOOLEAN DEFAULT false,
    vagas_maximo INTEGER,
    form_fields JSONB DEFAULT '[]'::jsonb, -- Array de objetos com os campos do formulário
    cronograma JSONB DEFAULT '[]'::jsonb, -- Array de objetos com horário/atividade/palestrante
    -- Metadados
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabela de inscritos em eventos
CREATE TABLE IF NOT EXISTS evento_inscritos (
    id SERIAL PRIMARY KEY,
    codigo_inscricao TEXT UNIQUE NOT NULL,
    evento_id TEXT REFERENCES eventos(id) ON DELETE CASCADE,
    evento_titulo TEXT NOT NULL,
    nome TEXT NOT NULL,
    cpf TEXT NOT NULL,
    email TEXT,
    data_nascimento TEXT,
    telefone TEXT,
    respostas JSONB DEFAULT '{}'::jsonb, -- Todas as respostas do formulário
    -- Metadados
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabela de notícias (se não existir)
CREATE TABLE IF NOT EXISTS noticias (
    id TEXT PRIMARY KEY DEFAULT 'not-' || floor(random() * 1000000)::text,
    titulo TEXT NOT NULL,
    resumo TEXT,
    conteudo TEXT,
    autor TEXT DEFAULT 'Sistema',
    categoria TEXT DEFAULT 'Geral',
    imagem TEXT,
    img_src TEXT,
    data_publicacao DATE DEFAULT CURRENT_DATE,
    destaque BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabela de usuários administrativos
CREATE TABLE IF NOT EXISTS usuarios_admin (
    id SERIAL PRIMARY KEY,
    usuario TEXT UNIQUE NOT NULL,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha_hash TEXT NOT NULL,
    cargo TEXT DEFAULT 'admin', -- admin, master, gestor, comunicacao, imprensa
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_eventos_data ON eventos(data DESC);
CREATE INDEX IF NOT EXISTS idx_eventos_categoria ON eventos(categoria);
CREATE INDEX IF NOT EXISTS idx_eventos_requer_inscricao ON eventos(requer_inscricao);

CREATE INDEX IF NOT EXISTS idx_evento_inscritos_evento_id ON evento_inscritos(evento_id);
CREATE INDEX IF NOT EXISTS idx_evento_inscritos_cpf ON evento_inscritos(cpf);
CREATE INDEX IF NOT EXISTS idx_evento_inscritos_codigo ON evento_inscritos(codigo_inscricao);

CREATE INDEX IF NOT EXISTS idx_noticias_data ON noticias(data_publicacao DESC);
CREATE INDEX IF NOT EXISTS idx_noticias_categoria ON noticias(categoria);
CREATE INDEX IF NOT EXISTS idx_noticias_destaque ON noticias(destaque);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplica o trigger em todas as tabelas
CREATE TRIGGER update_eventos_updated_at BEFORE UPDATE ON eventos FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_evento_inscritos_updated_at BEFORE UPDATE ON evento_inscritos FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_noticias_updated_at BEFORE UPDATE ON noticias FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_usuarios_admin_updated_at BEFORE UPDATE ON usuarios_admin FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- RLS (Row Level Security) - Opcional, descomente se precisar
-- ALTER TABLE eventos ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE evento_inscritos ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE noticias ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE usuarios_admin ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (exemplo) - Descomente e ajuste conforme necessário
-- CREATE POLICY "Eventos são públicos para leitura" ON eventos FOR SELECT USING (true);
-- CREATE POLICY "Inscrições são públicas para inserção" ON evento_inscritos FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Usuários podem ler suas próprias inscrições" ON evento_inscritos FOR SELECT USING (true);