-- Criar tabela de configurações da escolinha
CREATE TABLE IF NOT EXISTS configuracoes (
  id SERIAL PRIMARY KEY,
  nome_escolinha VARCHAR(255) NOT NULL DEFAULT 'Meninos do Cristo',
  telefone VARCHAR(20),
  email VARCHAR(255),
  endereco TEXT,
  logo_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir configuração inicial
INSERT INTO configuracoes (nome_escolinha, telefone, email, endereco) 
VALUES ('Meninos do Cristo', '', '', '')
ON CONFLICT (id) DO NOTHING;
