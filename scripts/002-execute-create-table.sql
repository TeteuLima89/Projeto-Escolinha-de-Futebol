-- Criando a tabela CadastroAtletas no banco de dados
CREATE TABLE IF NOT EXISTS CadastroAtletas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    sobrenome VARCHAR(100) NOT NULL,
    data_nascimento DATE NOT NULL,
    posicao VARCHAR(50) NOT NULL,
    posicao_secundaria VARCHAR(50),
    telefone_responsavel VARCHAR(20) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    categoria VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criando índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_cadastro_atletas_cpf ON CadastroAtletas(cpf);
CREATE INDEX IF NOT EXISTS idx_cadastro_atletas_categoria ON CadastroAtletas(categoria);
CREATE INDEX IF NOT EXISTS idx_cadastro_atletas_posicao ON CadastroAtletas(posicao);
