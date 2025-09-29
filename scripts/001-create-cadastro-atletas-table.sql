-- Criando tabela CadastroAtletas para armazenar dados dos atletas
CREATE TABLE IF NOT EXISTS CadastroAtletas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    sobrenome VARCHAR(100) NOT NULL,
    data_nascimento DATE NOT NULL,
    posicao VARCHAR(50) NOT NULL,
    posicao_secundaria VARCHAR(50),
    telefone_responsavel VARCHAR(20) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    categoria VARCHAR(20) NOT NULL,
    idade INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'Ativo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criando índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_cadastro_atletas_categoria ON CadastroAtletas(categoria);
CREATE INDEX IF NOT EXISTS idx_cadastro_atletas_posicao ON CadastroAtletas(posicao);
CREATE INDEX IF NOT EXISTS idx_cadastro_atletas_status ON CadastroAtletas(status);
CREATE INDEX IF NOT EXISTS idx_cadastro_atletas_cpf ON CadastroAtletas(cpf);

-- Criando trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cadastro_atletas_updated_at 
    BEFORE UPDATE ON CadastroAtletas 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
