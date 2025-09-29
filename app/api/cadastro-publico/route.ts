import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.NEON_NEON_DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const atletaData = await request.json()

    // Validar dados obrigatórios
    const requiredFields = ["nome", "sobrenome", "data_nascimento", "posicao", "telefone_responsavel", "cpf"]
    for (const field of requiredFields) {
      if (!atletaData[field]) {
        return NextResponse.json({ message: `Campo ${field} é obrigatório` }, { status: 400 })
      }
    }

    // Verificar se CPF já existe
    const existingAtleta = await sql`
      SELECT id FROM atletas WHERE cpf = ${atletaData.cpf}
    `

    if (existingAtleta.length > 0) {
      return NextResponse.json({ message: "CPF já cadastrado no sistema" }, { status: 400 })
    }

    // Inserir novo atleta
    const result = await sql`
      INSERT INTO atletas (
        nome, sobrenome, data_nascimento, posicao, posicao_secundaria,
        telefone_responsavel, cpf, categoria, idade, status
      ) VALUES (
        ${atletaData.nome},
        ${atletaData.sobrenome},
        ${atletaData.data_nascimento},
        ${atletaData.posicao},
        ${atletaData.posicao_secundaria},
        ${atletaData.telefone_responsavel},
        ${atletaData.cpf},
        ${atletaData.categoria},
        ${atletaData.idade},
        ${atletaData.status}
      )
      RETURNING id
    `

    return NextResponse.json(
      {
        message: "Atleta cadastrado com sucesso!",
        id: result[0].id,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Erro ao cadastrar atleta:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}
