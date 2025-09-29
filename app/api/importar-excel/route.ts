import { type NextRequest, NextResponse } from "next/server"
import * as XLSX from "xlsx"
import { buscarAtletaPorCpf } from "@/lib/database"

interface AtletaExcel {
  nome: string
  sobrenome: string
  data_nascimento: string
  posicao: string
  posicao_secundaria?: string
  telefone_responsavel: string
  cpf: string
  categoria?: string
  idade?: number
  status: string
  linha: number
  valido: boolean
  erros: string[]
  duplicado: boolean
}

const posicoes = [
  "Goleiro",
  "Lateral Direito",
  "Lateral Esquerdo",
  "Zagueiro",
  "Volante",
  "Meio-campo",
  "Meia Atacante",
  "Ponta Direita",
  "Ponta Esquerda",
  "Atacante",
  "Centroavante",
]

const calcularIdadeECategoria = (dataNascimento: string) => {
  const hoje = new Date()
  const nascimento = new Date(dataNascimento)
  const idade = hoje.getFullYear() - nascimento.getFullYear()

  let categoria = ""
  if (idade <= 7) categoria = "Sub-7"
  else if (idade <= 9) categoria = "Sub-9"
  else if (idade <= 11) categoria = "Sub-11"
  else if (idade <= 13) categoria = "Sub-13"
  else if (idade <= 15) categoria = "Sub-15"
  else if (idade <= 17) categoria = "Sub-17"
  else if (idade <= 20) categoria = "Sub-20"
  else categoria = "Adulto"

  return { idade, categoria }
}

const formatarCPF = (cpf: string): string => {
  const numeros = cpf.replace(/\D/g, "")
  return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
}

const formatarTelefone = (telefone: string): string => {
  const numeros = telefone.replace(/\D/g, "")
  if (numeros.length <= 10) {
    return numeros.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3")
  }
  return numeros.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
}

const validarCPF = (cpf: string): boolean => {
  const numeros = cpf.replace(/\D/g, "")
  if (numeros.length !== 11) return false

  // Verificar se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(numeros)) return false

  // Validar dígitos verificadores
  let soma = 0
  for (let i = 0; i < 9; i++) {
    soma += Number.parseInt(numeros[i]) * (10 - i)
  }
  let resto = (soma * 10) % 11
  if (resto === 10 || resto === 11) resto = 0
  if (resto !== Number.parseInt(numeros[9])) return false

  soma = 0
  for (let i = 0; i < 10; i++) {
    soma += Number.parseInt(numeros[i]) * (11 - i)
  }
  resto = (soma * 10) % 11
  if (resto === 10 || resto === 11) resto = 0
  if (resto !== Number.parseInt(numeros[10])) return false

  return true
}

const validarData = (data: string): boolean => {
  const regex = /^\d{4}-\d{2}-\d{2}$/
  if (!regex.test(data)) return false

  const date = new Date(data)
  return date instanceof Date && !isNaN(date.getTime())
}

const processarLinha = async (linha: any, numeroLinha: number): Promise<AtletaExcel> => {
  const erros: string[] = []

  // Extrair dados da linha
  const nome = String(linha["Nome"] || linha["NOME"] || "").trim()
  const sobrenome = String(linha["Sobrenome"] || linha["SOBRENOME"] || "").trim()
  const dataNascimento = linha["Data de Nascimento"] || linha["DATA DE NASCIMENTO"] || linha["Data Nascimento"]
  const posicao = String(linha["Posição"] || linha["POSIÇÃO"] || linha["Posicao"] || "").trim()
  const posicaoSecundaria = String(
    linha["Posição Secundária"] || linha["POSIÇÃO SECUNDÁRIA"] || linha["Posicao Secundaria"] || "",
  ).trim()
  const telefone = String(linha["Telefone"] || linha["TELEFONE"] || linha["Telefone Responsável"] || "").trim()
  const cpfRaw = String(linha["CPF"] || "").trim()

  // Validações
  if (!nome) erros.push("Nome obrigatório")
  if (!sobrenome) erros.push("Sobrenome obrigatório")
  if (!cpfRaw) erros.push("CPF obrigatório")
  if (!posicao) erros.push("Posição obrigatória")
  if (!telefone) erros.push("Telefone obrigatório")

  // Formatar e validar CPF
  const cpf = formatarCPF(cpfRaw)
  if (cpfRaw && !validarCPF(cpf)) {
    erros.push("CPF inválido")
  }

  // Validar posição
  if (posicao && !posicoes.includes(posicao)) {
    erros.push("Posição inválida")
  }

  // Processar data de nascimento
  let dataFormatada = ""
  if (dataNascimento) {
    if (dataNascimento instanceof Date) {
      dataFormatada = dataNascimento.toISOString().split("T")[0]
    } else if (typeof dataNascimento === "string") {
      // Tentar diferentes formatos
      const formatos = [
        /^(\d{2})\/(\d{2})\/(\d{4})$/, // DD/MM/YYYY
        /^(\d{4})-(\d{2})-(\d{2})$/, // YYYY-MM-DD
      ]

      for (const formato of formatos) {
        const match = dataNascimento.match(formato)
        if (match) {
          if (formato.source.includes("\\/")) {
            // DD/MM/YYYY
            dataFormatada = `${match[3]}-${match[2]}-${match[1]}`
          } else {
            // YYYY-MM-DD
            dataFormatada = dataNascimento
          }
          break
        }
      }
    }

    if (!dataFormatada || !validarData(dataFormatada)) {
      erros.push("Data de nascimento inválida")
    }
  } else {
    erros.push("Data de nascimento obrigatória")
  }

  // Calcular idade e categoria
  let idade = 0
  let categoria = ""
  if (dataFormatada && validarData(dataFormatada)) {
    const resultado = calcularIdadeECategoria(dataFormatada)
    idade = resultado.idade
    categoria = resultado.categoria
  }

  // Verificar se CPF já existe no banco
  let duplicado = false
  if (cpf && validarCPF(cpf)) {
    try {
      const atletaExistente = await buscarAtletaPorCpf(cpf)
      duplicado = !!atletaExistente
    } catch (error) {
      console.error("Erro ao verificar CPF duplicado:", error)
    }
  }

  return {
    nome,
    sobrenome,
    data_nascimento: dataFormatada,
    posicao,
    posicao_secundaria: posicaoSecundaria || undefined,
    telefone_responsavel: formatarTelefone(telefone),
    cpf,
    categoria,
    idade,
    status: "Ativo",
    linha: numeroLinha,
    valido: erros.length === 0,
    erros,
    duplicado,
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const arquivo = formData.get("arquivo") as File

    if (!arquivo) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 })
    }

    // Ler arquivo Excel
    const buffer = await arquivo.arrayBuffer()
    const workbook = XLSX.read(buffer, { type: "buffer" })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const data = XLSX.utils.sheet_to_json(worksheet)

    if (data.length === 0) {
      return NextResponse.json({ error: "Planilha vazia" }, { status: 400 })
    }

    // Processar cada linha
    const atletas: AtletaExcel[] = []
    for (let i = 0; i < data.length; i++) {
      const atleta = await processarLinha(data[i], i + 2) // +2 porque linha 1 é cabeçalho
      atletas.push(atleta)
    }

    // Calcular estatísticas
    const total = atletas.length
    const validos = atletas.filter((a) => a.valido).length
    const invalidos = atletas.filter((a) => !a.valido).length
    const duplicados = atletas.filter((a) => a.duplicado).length
    const novos = atletas.filter((a) => a.valido && !a.duplicado).length

    return NextResponse.json({
      total,
      validos,
      invalidos,
      duplicados,
      novos,
      atletas,
    })
  } catch (error) {
    console.error("Erro ao processar planilha:", error)
    return NextResponse.json({ error: "Erro ao processar planilha" }, { status: 500 })
  }
}
