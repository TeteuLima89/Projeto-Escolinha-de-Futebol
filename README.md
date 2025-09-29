# Sistema de Gestão de Atletas - Meninos do Cristo

Sistema completo para gerenciamento de atletas com integração ao banco de dados PostgreSQL (Neon).

## 🚀 Como executar o projeto

### 1. Pré-requisitos
- Node.js 18+ instalado
- Visual Studio Code (recomendado)

### 2. Instalação das dependências

**Opção A: Usando Command Prompt (Recomendado)**
\`\`\`cmd
npm install
\`\`\`

**Opção B: Se der erro de PowerShell**
1. Abra o PowerShell como Administrador
2. Execute: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
3. Digite "S" para confirmar
4. Execute: `npm install`

### 3. Configuração do banco de dados

O arquivo `.env.local` já está configurado com a conexão do banco PostgreSQL.

### 4. Executar o projeto
\`\`\`cmd
npm run dev
\`\`\`

O sistema estará disponível em: `http://localhost:3000`

## 🗄️ Banco de Dados

- **Banco**: PostgreSQL (Neon)
- **Tabela**: CadastroAtletas
- **Status**: Tabela já criada e configurada

### Campos da tabela:
- id (serial, primary key)
- nome (varchar)
- sobrenome (varchar)
- data_nascimento (date)
- posicao (varchar)
- posicao_secundaria (varchar, opcional)
- telefone_responsavel (varchar)
- cpf (varchar, único)
- categoria (varchar)
- idade (integer)
- status (varchar)
- created_at (timestamp)
- updated_at (timestamp)

## 📋 Funcionalidades

- ✅ Cadastro de atletas
- ✅ Listagem com filtros
- ✅ Edição de dados
- ✅ Exclusão de atletas
- ✅ Geração de relatórios em PDF
- ✅ Validação de CPF único
- ✅ Cálculo automático de categoria por idade
- ✅ Interface responsiva

## 🛠️ Tecnologias

- **Frontend**: Next.js 14, React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI + shadcn/ui
- **Database**: PostgreSQL (Neon)
- **PDF**: jsPDF + jsPDF-AutoTable

## 📁 Estrutura do projeto

\`\`\`
├── app/                    # Páginas Next.js
│   ├── api/atletas/       # API routes
│   ├── atletas/           # Página de atletas
│   └── relatorios/        # Página de relatórios
├── components/            # Componentes React
├── contexts/              # Context API
├── lib/                   # Utilitários e database
└── scripts/               # Scripts SQL
\`\`\`

## 🔧 Resolução de problemas

### Erro de PowerShell
Se aparecer erro sobre execução de scripts:
1. Use Command Prompt ao invés do PowerShell
2. Ou configure a política de execução (ver seção de instalação)

### Erro de conexão com banco
- Verifique se o arquivo `.env.local` existe
- Confirme se a string de conexão está correta

### Erro de módulos não encontrados
\`\`\`cmd
rm -rf node_modules package-lock.json
npm install
\`\`\`

## 📞 Suporte

Em caso de problemas, verifique:
1. Node.js instalado corretamente
2. Dependências instaladas (`npm install`)
3. Arquivo `.env.local` presente
4. Porta 3000 disponível
