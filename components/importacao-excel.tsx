"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileSpreadsheet, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { useAtletas } from "@/contexts/atletas-context"

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

interface ResultadoImportacao {
  total: number
  validos: number
  invalidos: number
  duplicados: number
  novos: number
  atletas: AtletaExcel[]
}

export function ImportacaoExcel() {
  const [arquivo, setArquivo] = useState<File | null>(null)
  const [carregando, setCarregando] = useState(false)
  const [resultado, setResultado] = useState<ResultadoImportacao | null>(null)
  const [importando, setImportando] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { carregarAtletas } = useAtletas()

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setArquivo(file)
      setResultado(null)
    }
  }

  const processarPlanilha = async () => {
    if (!arquivo) return

    setCarregando(true)
    try {
      const formData = new FormData()
      formData.append("arquivo", arquivo)

      const response = await fetch("/api/importar-excel", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Erro ao processar planilha")
      }

      const resultado = await response.json()
      setResultado(resultado)
    } catch (error) {
      console.error("Erro ao processar planilha:", error)
      alert("Erro ao processar planilha. Verifique o formato do arquivo.")
    } finally {
      setCarregando(false)
    }
  }

  const importarAtletas = async () => {
    if (!resultado) return

    setImportando(true)
    try {
      const atletasValidos = resultado.atletas.filter((a) => a.valido && !a.duplicado)

      const response = await fetch("/api/importar-atletas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ atletas: atletasValidos }),
      })

      if (!response.ok) {
        throw new Error("Erro ao importar atletas")
      }

      alert(`${atletasValidos.length} atletas importados com sucesso!`)
      await carregarAtletas()
      setArquivo(null)
      setResultado(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      console.error("Erro ao importar atletas:", error)
      alert("Erro ao importar atletas. Tente novamente.")
    } finally {
      setImportando(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5" />
            Importar Atletas via Excel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="arquivo">Selecionar arquivo Excel (.xlsx)</Label>
            <Input
              ref={fileInputRef}
              id="arquivo"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              className="mt-1"
            />
            <p className="text-sm text-gray-500 mt-1">
              O arquivo deve conter as colunas: Nome, Sobrenome, Data de Nascimento, Posição, Telefone do Responsável,
              CPF
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={processarPlanilha}
              disabled={!arquivo || carregando}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {carregando ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Processando...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Processar Planilha
                </>
              )}
            </Button>

            {resultado && resultado.novos > 0 && (
              <Button onClick={importarAtletas} disabled={importando} className="bg-green-600 hover:bg-green-700">
                {importando ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Importando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Importar {resultado.novos} Atletas
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {resultado && (
        <Card>
          <CardHeader>
            <CardTitle>Resultado da Análise</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{resultado.total}</div>
                <div className="text-sm text-blue-600">Total</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{resultado.novos}</div>
                <div className="text-sm text-green-600">Novos</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{resultado.duplicados}</div>
                <div className="text-sm text-yellow-600">Duplicados</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{resultado.invalidos}</div>
                <div className="text-sm text-red-600">Inválidos</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">{resultado.validos}</div>
                <div className="text-sm text-gray-600">Válidos</div>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="p-2 text-left">Linha</th>
                    <th className="p-2 text-left">Nome</th>
                    <th className="p-2 text-left">CPF</th>
                    <th className="p-2 text-left">Status</th>
                    <th className="p-2 text-left">Observações</th>
                  </tr>
                </thead>
                <tbody>
                  {resultado.atletas.map((atleta, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">{atleta.linha}</td>
                      <td className="p-2">
                        {atleta.nome} {atleta.sobrenome}
                      </td>
                      <td className="p-2">{atleta.cpf}</td>
                      <td className="p-2">
                        {atleta.duplicado ? (
                          <span className="flex items-center text-yellow-600">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            Duplicado
                          </span>
                        ) : atleta.valido ? (
                          <span className="flex items-center text-green-600">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Válido
                          </span>
                        ) : (
                          <span className="flex items-center text-red-600">
                            <XCircle className="w-4 h-4 mr-1" />
                            Inválido
                          </span>
                        )}
                      </td>
                      <td className="p-2">
                        {atleta.erros.length > 0 && (
                          <div className="text-red-600 text-xs">{atleta.erros.join(", ")}</div>
                        )}
                        {atleta.duplicado && <div className="text-yellow-600 text-xs">CPF já existe no sistema</div>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
