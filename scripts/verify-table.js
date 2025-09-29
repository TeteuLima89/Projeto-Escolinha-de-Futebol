import { neon } from "@neondatabase/serverless"

const sql = neon(
  "postgresql://neondb_owner:npg_piaw6FPtsHG2@ep-proud-grass-ac9e9uyy-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
)

async function verifyTable() {
  try {
    console.log("[v0] Verificando se a tabela existe...")

    // Verificar se a tabela existe (PostgreSQL converte nomes para minúsculo)
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name ILIKE 'cadastroatletas'
    `

    console.log("[v0] Tabelas encontradas:", tables)

    if (tables.length > 0) {
      console.log("[v0] ✅ Tabela encontrada!")

      // Verificar estrutura da tabela
      const columns = await sql`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_name ILIKE 'cadastroatletas'
        ORDER BY ordinal_position
      `

      console.log("[v0] Estrutura da tabela:")
      columns.forEach((col) => {
        console.log(
          `[v0] - ${col.column_name}: ${col.data_type} (${col.is_nullable === "YES" ? "nullable" : "not null"})`,
        )
      })

      // Testar inserção de dados de exemplo
      console.log("[v0] Testando inserção de dados...")

      const testData = await sql`
        INSERT INTO cadastroatletas (
          nome, sobrenome, data_nascimento, posicao, telefone_responsavel, 
          cpf, categoria, idade
        ) VALUES (
          'João', 'Silva', '2010-05-15', 'Atacante', '(11) 99999-9999',
          '123.456.789-00', 'Sub-14', 13
        ) 
        ON CONFLICT (cpf) DO NOTHING
        RETURNING id, nome, sobrenome
      `

      console.log("[v0] Dados inseridos:", testData)

      // Verificar se os dados foram inseridos
      const count = await sql`SELECT COUNT(*) as total FROM cadastroatletas`
      console.log("[v0] Total de registros na tabela:", count[0].total)
    } else {
      console.log("[v0] ❌ Tabela não encontrada!")
    }
  } catch (error) {
    console.error("[v0] Erro ao verificar tabela:", error)
  }
}

verifyTable()
