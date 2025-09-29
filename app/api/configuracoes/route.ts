import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.NEON_NEON_DATABASE_URL!)

export async function GET() {
  try {
    const configuracoes = await sql`
      SELECT * FROM configuracoes ORDER BY id LIMIT 1
    `

    return NextResponse.json(configuracoes)
  } catch (error) {
    console.error("Erro ao buscar configurações:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { nome_escolinha, telefone, email, endereco, logo_url } = body

    const result = await sql`
      UPDATE configuracoes 
      SET 
        nome_escolinha = ${nome_escolinha},
        telefone = ${telefone},
        email = ${email},
        endereco = ${endereco},
        logo_url = ${logo_url},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
      RETURNING *
    `

    if (result.length === 0) {
      // Se não existe, criar
      const newConfig = await sql`
        INSERT INTO configuracoes (nome_escolinha, telefone, email, endereco, logo_url)
        VALUES (${nome_escolinha}, ${telefone}, ${email}, ${endereco}, ${logo_url})
        RETURNING *
      `
      return NextResponse.json(newConfig[0])
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Erro ao salvar configurações:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
