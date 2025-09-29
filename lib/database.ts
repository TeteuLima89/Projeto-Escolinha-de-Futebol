import { neon } from "@neondatabase/serverless"

const sql = neon(
  "postgresql://neondb_owner:npg_piaw6FPtsHG2@ep-proud-grass-ac9e9uyy-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
)

export interface Atleta {
  id?: number
  nome: string
  sobrenome: string
  data_nascimento: string
  posicao: string
  posicao_secundaria?: string
  telefone_responsavel: string
  cpf: string
  categoria: string
  idade: number
  status: string
  created_at?: string
  updated_at?: string
}

export async function criarAtleta(atleta: Omit<Atleta, "id" | "created_at" | "updated_at">): Promise<Atleta> {
  const result = await sql`
    INSERT INTO cadastroatletas (
      nome, sobrenome, data_nascimento, posicao, posicao_secundaria,
      telefone_responsavel, cpf, categoria, idade, status
    ) VALUES (
      ${atleta.nome}, ${atleta.sobrenome}, ${atleta.data_nascimento},
      ${atleta.posicao}, ${atleta.posicao_secundaria || null},
      ${atleta.telefone_responsavel}, ${atleta.cpf}, ${atleta.categoria},
      ${atleta.idade}, ${atleta.status}
    ) RETURNING *
  `
  return result[0] as Atleta
}

export async function listarAtletas(): Promise<Atleta[]> {
  const result = await sql`
    SELECT * FROM cadastroatletas 
    ORDER BY created_at DESC
  `
  return result as Atleta[]
}

export async function atualizarAtleta(id: number, atleta: Partial<Atleta>): Promise<Atleta> {
  const result = await sql`
    UPDATE cadastroatletas 
    SET 
      nome = COALESCE(${atleta.nome}, nome),
      sobrenome = COALESCE(${atleta.sobrenome}, sobrenome),
      data_nascimento = COALESCE(${atleta.data_nascimento}, data_nascimento),
      posicao = COALESCE(${atleta.posicao}, posicao),
      posicao_secundaria = COALESCE(${atleta.posicao_secundaria}, posicao_secundaria),
      telefone_responsavel = COALESCE(${atleta.telefone_responsavel}, telefone_responsavel),
      cpf = COALESCE(${atleta.cpf}, cpf),
      categoria = COALESCE(${atleta.categoria}, categoria),
      idade = COALESCE(${atleta.idade}, idade),
      status = COALESCE(${atleta.status}, status),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING *
  `
  return result[0] as Atleta
}

export async function excluirAtleta(id: number): Promise<void> {
  await sql`
    DELETE FROM cadastroatletas 
    WHERE id = ${id}
  `
}

export async function buscarAtletaPorCpf(cpf: string): Promise<Atleta | null> {
  const result = await sql`
    SELECT * FROM cadastroatletas 
    WHERE cpf = ${cpf}
    LIMIT 1
  `
  return result.length > 0 ? (result[0] as Atleta) : null
}
