import { neon } from "@neondatabase/serverless"
import fs from "fs"
import path from "path"

const sql = neon(process.env.NEON_NEON_DATABASE_URL)

async function createConfiguracoes() {
  try {
    console.log("Criando tabela de configurações...")

    const sqlContent = fs.readFileSync(path.join(process.cwd(), "scripts/007-create-configuracoes-table.sql"), "utf8")

    await sql(sqlContent)

    console.log("✅ Tabela de configurações criada com sucesso!")

    // Verificar se foi criada
    const result = await sql`SELECT * FROM configuracoes LIMIT 1`
    console.log("Configuração inicial:", result[0])
  } catch (error) {
    console.error("❌ Erro ao criar tabela de configurações:", error)
  }
}

createConfiguracoes()
