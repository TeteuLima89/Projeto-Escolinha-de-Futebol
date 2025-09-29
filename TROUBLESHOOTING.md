# Guia de Resolução de Problemas - Sistema de Cadastro de Atletas

## Problema: "No database connection string was provided to neon()"

### Causa
A variável de ambiente `NEON_NEON_DATABASE_URL` não está sendo encontrada pelo Next.js.

### Soluções

#### 1. Verificar arquivo .env.local
Certifique-se de que o arquivo `.env.local` existe na raiz do projeto com:
\`\`\`
NEON_DATABASE_URL=sua_string_de_conexao_aqui
\`\`\`

#### 2. Reiniciar o servidor de desenvolvimento
Após criar ou modificar o arquivo `.env.local`:
\`\`\`bash
# Parar o servidor (Ctrl+C)
# Depois executar novamente:
npm run dev
\`\`\`

#### 3. Verificar se a tabela existe no banco
Execute o script de teste:
\`\`\`bash
# No terminal do projeto, execute:
node -e "
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.NEON_DATABASE_URL);
sql\`SELECT table_name FROM information_schema.tables WHERE table_name = 'cadastroatletas'\`
  .then(result => console.log('Tabela encontrada:', result))
  .catch(err => console.error('Erro:', err));
"
\`\`\`

#### 4. Criar a tabela se não existir
Se a tabela não existir, execute o script SQL:
\`\`\`sql
-- Execute no console do Neon ou via script
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
\`\`\`

## Outros Problemas Comuns

### Erro de importação de módulos
- Certifique-se de que executou `npm install`
- Verifique se não há arquivos CSS duplicados
- Reinicie o servidor de desenvolvimento

### Problemas de CORS
- Verifique se a URL da API está correta
- Certifique-se de que o servidor está rodando na porta 3000

### Dados não carregam
- Verifique o console do navegador para erros
- Teste a API diretamente: `http://localhost:3000/api/atletas`
- Verifique se a conexão com o banco está funcionando
