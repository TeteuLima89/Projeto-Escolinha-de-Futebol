import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.NEON_NEON_NEON_DATABASE_URL!)

// Função para calcular categoria baseada na idade
function calcularCategoria(dataNascimento: string): string {
  const hoje = new Date()
  const nascimento = new Date(dataNascimento)
  const idade = hoje.getFullYear() - nascimento.getFullYear()

  if (idade <= 12) return "Sub-12"
  if (idade <= 15) return "Sub-15"
  if (idade <= 17) return "Sub-17"
  if (idade <= 20) return "Sub-20"
  return "Adulto"
}

// Função para formatar CPF
function formatarCPF(cpf: string): string {
  return cpf.replace(/\D/g, "").replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
}

// Função para formatar telefone
function formatarTelefone(telefone: string): string {
  const digits = telefone.replace(/\D/g, "")
  if (digits.length === 11) {
    return digits.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
  }
  return telefone
}

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Webhook Google Forms - Recebendo dados...")

    const body = await request.json()
    console.log("[v0] Dados recebidos do Google Forms:", JSON.stringify(body, null, 2))

    // Aceitar diferentes formatos de nomes de campos
    const dados = {
      nome: body.nome || body["Nome Completo"] || body["Nome"] || "",
      sobrenome: body.sobrenome || body["Sobrenome"] || "",
      data_nascimento: body.data_nascimento || body["Data de Nascimento"] || "",
      posicoes: body.posicoes || body["Posições de Jogo"] || body["Posicoes"] || "",
      telefone_responsavel: body.telefone_responsavel || body["Telefone do Responsável"] || body["Telefone"] || "",
      cpf: body.cpf || body["CPF"] || "",
      nome_responsavel: body.nome_responsavel || body["Nome do Responsável"] || "",
    }

    console.log("[v0] Dados mapeados:", dados)

    // Se nome completo veio junto, separar nome e sobrenome
    if (!dados.sobrenome && dados.nome.includes(" ")) {
      const partesNome = dados.nome.split(" ")
      dados.nome = partesNome[0]
      dados.sobrenome = partesNome.slice(1).join(" ")
    }

    // Validações básicas
    if (!dados.nome || !dados.data_nascimento || !dados.cpf) {
      console.log("[v0] Erro: Campos obrigatórios não preenchidos")
      return NextResponse.json(
        {
          error: "Campos obrigatórios não preenchidos",
          campos_recebidos: Object.keys(body),
          dados_mapeados: dados,
        },
        { status: 400 },
      )
    }

    // Verificar se CPF já existe
    const cpfLimpo = dados.cpf.replace(/\D/g, "")
    console.log("[v0] Verificando CPF:", cpfLimpo)

    const atletaExistente = await sql`
      SELECT id FROM atletas WHERE cpf = ${cpfLimpo}
    `

    if (atletaExistente.length > 0) {
      console.log("[v0] CPF já existe no sistema")
      return NextResponse.json({ error: "CPF já cadastrado no sistema" }, { status: 409 })
    }

    // Processar posições
    let posicoesArray = []
    if (typeof dados.posicoes === "string") {
      posicoesArray = dados.posicoes
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p)
    } else if (Array.isArray(dados.posicoes)) {
      posicoesArray = dados.posicoes
    }

    // Calcular categoria
    const categoria = calcularCategoria(dados.data_nascimento)
    console.log("[v0] Categoria calculada:", categoria)

    // Inserir atleta no banco
    const novoAtleta = await sql`
      INSERT INTO atletas (
        nome, 
        sobrenome, 
        data_nascimento, 
        categoria, 
        posicoes, 
        telefone_responsavel, 
        nome_responsavel,
        cpf,
        origem_cadastro
      ) VALUES (
        ${dados.nome},
        ${dados.sobrenome || ""},
        ${dados.data_nascimento},
        ${categoria},
        ${JSON.stringify(posicoesArray)},
        ${formatarTelefone(dados.telefone_responsavel)},
        ${dados.nome_responsavel || ""},
        ${cpfLimpo},
        'google_forms'
      ) RETURNING *
    `

    console.log("[v0] Atleta cadastrado com sucesso:", novoAtleta[0])

    return NextResponse.json({
      success: true,
      message: "Atleta cadastrado com sucesso!",
      atleta: {
        id: novoAtleta[0].id,
        nome: novoAtleta[0].nome,
        sobrenome: novoAtleta[0].sobrenome,
        categoria: novoAtleta[0].categoria,
      },
    })
  } catch (error) {
    console.error("[v0] Erro no webhook Google Forms:", error)
    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        details: error.message,
      },
      { status: 500 },
    )
  }
}

// Permitir apenas POST
export async function GET() {
  return NextResponse.json({ error: "Método não permitido" }, { status: 405 })
}
