import { neon } from "@neondatabase/serverless"

// String de conexão direta
const NEON_NEON_DATABASE_URL =
  "postgresql://neondb_owner:npg_piaw6FPtsHG2@ep-proud-grass-ac9e9uyy-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

const sql = neon(NEON_DATABASE_URL)

async function testConnection() {
  try {
    console.log("[v0] Testando conexão com o banco...")

    // Teste básico de conexão
    const result = await sql`SELECT NOW() as current_time`
    console.log("[v0] Conexão bem-sucedida!", result[0])

    // Verificar se a tabela CadastroAtletas existe
    console.log("[v0] Verificando se a tabela CadastroAtletas existe...")
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'CadastroAtletas'
      );
    `

    if (tableCheck[0].exists) {
      console.log("[v0] Tabela CadastroAtletas encontrada!")

      // Contar registros na tabela
      const count = await sql`SELECT COUNT(*) FROM "CadastroAtletas"`
      console.log("[v0] Número de atletas cadastrados:", count[0].count)

      // Mostrar alguns registros se existirem
      if (Number.parseInt(count[0].count) > 0) {
        const atletas = await sql`SELECT * FROM "CadastroAtletas" LIMIT 5`
        console.log("[v0] Primeiros atletas:", atletas)
      }
    } else {
      console.log("[v0] Tabela CadastroAtletas não encontrada. Criando...")

      // Criar a tabela
      await sql`
        CREATE TABLE "CadastroAtletas" (
          id SERIAL PRIMARY KEY,
          nome VARCHAR(255) NOT NULL,
          data_nascimento DATE NOT NULL,
          categoria VARCHAR(50) NOT NULL,
          responsavel VARCHAR(255) NOT NULL,
          telefone VARCHAR(20) NOT NULL,
          endereco TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `

      console.log("[v0] Tabela CadastroAtletas criada com sucesso!")
    }
  } catch (error) {
    console.error("[v0] Erro na conexão:", error)
  }
}

testConnection()
