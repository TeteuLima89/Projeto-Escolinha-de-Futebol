"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

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

interface AtletasContextType {
  atletas: Atleta[]
  loading: boolean
  error: string | null
  carregarAtletas: () => Promise<void>
  adicionarAtleta: (atleta: Omit<Atleta, "id" | "created_at" | "updated_at">) => Promise<void>
  atualizarAtleta: (id: number, atleta: Partial<Atleta>) => Promise<void>
  removerAtleta: (id: number) => Promise<void>
}

const AtletasContext = createContext<AtletasContextType | undefined>(undefined)

export function AtletasProvider({ children }: { children: ReactNode }) {
  const [atletas, setAtletas] = useState<Atleta[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const carregarAtletas = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/atletas")
      if (!response.ok) {
        throw new Error("Erro ao carregar atletas")
      }
      const data = await response.json()
      setAtletas(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
    } finally {
      setLoading(false)
    }
  }

  const adicionarAtleta = async (novoAtleta: Omit<Atleta, "id" | "created_at" | "updated_at">) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/atletas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(novoAtleta),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erro ao adicionar atleta")
      }

      const atletaCriado = await response.json()
      setAtletas((prev) => [atletaCriado, ...prev])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const atualizarAtleta = async (id: number, atletaAtualizado: Partial<Atleta>) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/atletas/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(atletaAtualizado),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erro ao atualizar atleta")
      }

      const atletaAtualizadoResponse = await response.json()
      setAtletas((prev) => prev.map((atleta) => (atleta.id === id ? atletaAtualizadoResponse : atleta)))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const removerAtleta = async (id: number) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/atletas/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Erro ao remover atleta")
      }

      setAtletas((prev) => prev.filter((atleta) => atleta.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarAtletas()
  }, [])

  return (
    <AtletasContext.Provider
      value={{
        atletas,
        loading,
        error,
        carregarAtletas,
        adicionarAtleta,
        atualizarAtleta,
        removerAtleta,
      }}
    >
      {children}
    </AtletasContext.Provider>
  )
}

export function useAtletas() {
  const context = useContext(AtletasContext)
  if (context === undefined) {
    throw new Error("useAtletas must be used within an AtletasProvider")
  }
  return context
}
