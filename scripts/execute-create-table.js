import { neon } from "@neondatabase/serverless"

const sql = neon(
  "postgresql://neondb_owner:npg_piaw6FPtsHG2@ep-proud-grass-ac9e9uyy-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
)

async function createTable() {
  try {
    console.log("[v0] Iniciando criação da tabela...")

    // Criar tabela CadastroAtletas
    await sql`
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
      )
    `

    console.log("[v0] Tabela CadastroAtletas criada com sucesso!")

    // Criar índices
    await sql`CREATE INDEX IF NOT EXISTS idx_cadastro_atletas_categoria ON CadastroAtletas(categoria)`
    await sql`CREATE INDEX IF NOT EXISTS idx_cadastro_atletas_posicao ON CadastroAtletas(posicao)`
    await sql`CREATE INDEX IF NOT EXISTS idx_cadastro_atletas_status ON CadastroAtletas(status)`
    await sql`CREATE INDEX IF NOT EXISTS idx_cadastro_atletas_cpf ON CadastroAtletas(cpf)`

    console.log("[v0] Índices criados com sucesso!")

    // Criar função e trigger para updated_at
    await sql`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql'
    `

    await sql`
      DROP TRIGGER IF EXISTS update_cadastro_atletas_updated_at ON CadastroAtletas
    `

    await sql`
      CREATE TRIGGER update_cadastro_atletas_updated_at 
          BEFORE UPDATE ON CadastroAtletas 
          FOR EACH ROW 
          EXECUTE FUNCTION update_updated_at_column()
    `

    console.log("[v0] Trigger criado com sucesso!")

    // Verificar se a tabela foi criada
    const result = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'cadastroatletas'
    `

    console.log("[v0] Tabelas encontradas:", result)

    // Verificar estrutura da tabela
    const columns = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'cadastroatletas'
      ORDER BY ordinal_position
    `

    console.log("[v0] Estrutura da tabela:", columns)
  } catch (error) {
    console.error("[v0] Erro ao criar tabela:", error)
  }
}

createTable()
