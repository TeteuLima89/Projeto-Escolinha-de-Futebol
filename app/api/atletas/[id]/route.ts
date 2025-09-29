import { type NextRequest, NextResponse } from "next/server"
import { atualizarAtleta, excluirAtleta } from "@/lib/database"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()
    const atletaAtualizado = await atualizarAtleta(id, body)
    return NextResponse.json(atletaAtualizado)
  } catch (error: any) {
    console.error("Erro ao atualizar atleta:", error)

    if (error.message?.includes("duplicate key value violates unique constraint")) {
      return NextResponse.json({ error: "CPF já cadastrado no sistema" }, { status: 409 })
    }

    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    await excluirAtleta(id)
    return NextResponse.json({ message: "Atleta excluído com sucesso" })
  } catch (error) {
    console.error("Erro ao excluir atleta:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
