# Instalação do Projeto - Meninos do Cristo

## Pré-requisitos
- Node.js 18+ instalado
- npm (vem com Node.js)

## Passos para Instalação

### 1. Instalar Dependências
\`\`\`bash
npm install
\`\`\`

### 2. Configurar Variáveis de Ambiente
Crie o arquivo `.env.local` na raiz do projeto com:
\`\`\`env
NEON_NEON_DATABASE_URL=postgresql://neondb_owner:npg_EOk1NTu4hCiY@ep-fancy-rain-ac4ftn8h-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
\`\`\`

### 3. Executar o Projeto
\`\`\`bash
npm run dev
\`\`\`

O projeto estará disponível em: http://localhost:3000

## Resolução de Problemas

### Erro "pnpm não é reconhecido"
- Use apenas `npm install` e `npm run dev`
- Não use comandos pnpm

### Erro de conexão com banco
- Verifique se o arquivo `.env.local` existe
- Verifique se a variável NEON_DATABASE_URL está correta

### Erro de módulos não encontrados
- Delete a pasta `node_modules`
- Execute `npm install` novamente
- Execute `npm run dev`
