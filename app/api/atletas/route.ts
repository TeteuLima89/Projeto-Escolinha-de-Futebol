import { type NextRequest, NextResponse } from "next/server"
import { criarAtleta, listarAtletas } from "@/lib/database"

export async function GET() {
  try {
    const atletas = await listarAtletas()
    return NextResponse.json(atletas)
  } catch (error) {
    console.error("Erro ao buscar atletas:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const novoAtleta = await criarAtleta(body)
    return NextResponse.json(novoAtleta, { status: 201 })
  } catch (error: any) {
    console.error("Erro ao criar atleta:", error)

    // Verificar se é erro de CPF duplicado
    if (error.message?.includes("duplicate key value violates unique constraint")) {
      return NextResponse.json({ error: "CPF já cadastrado no sistema" }, { status: 409 })
    }

    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
