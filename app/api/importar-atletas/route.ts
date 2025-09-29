import { type NextRequest, NextResponse } from "next/server"
import { criarAtleta } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { atletas } = await request.json()

    if (!Array.isArray(atletas) || atletas.length === 0) {
      return NextResponse.json({ error: "Nenhum atleta para importar" }, { status: 400 })
    }

    const resultados = []
    let sucessos = 0
    let erros = 0

    for (const atleta of atletas) {
      try {
        // Remover campos desnecessários para a inserção
        const { linha, valido, erros: errosValidacao, duplicado, ...dadosAtleta } = atleta

        const novoAtleta = await criarAtleta(dadosAtleta)
        resultados.push({ sucesso: true, atleta: novoAtleta })
        sucessos++
      } catch (error) {
        console.error("Erro ao criar atleta:", error)
        resultados.push({
          sucesso: false,
          erro: error instanceof Error ? error.message : "Erro desconhecido",
          atleta: atleta,
        })
        erros++
      }
    }

    return NextResponse.json({
      total: atletas.length,
      sucessos,
      erros,
      resultados,
    })
  } catch (error) {
    console.error("Erro ao importar atletas:", error)
    return NextResponse.json({ error: "Erro ao importar atletas" }, { status: 500 })
  }
}
