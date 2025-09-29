"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Loader2, UserPlus, Users } from "lucide-react"

interface FormData {
  nome: string
  sobrenome: string
  dataNascimento: string
  posicao: string
  posicaoSecundaria: string
  telefoneResponsavel: string
  cpf: string
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

const calcularCategoria = (dataNascimento: string): string => {
  if (!dataNascimento) return ""

  const hoje = new Date()
  const nascimento = new Date(dataNascimento)
  const idade = hoje.getFullYear() - nascimento.getFullYear()

  if (idade <= 7) return "Sub-7"
  if (idade <= 9) return "Sub-9"
  if (idade <= 11) return "Sub-11"
  if (idade <= 13) return "Sub-13"
  if (idade <= 15) return "Sub-15"
  if (idade <= 17) return "Sub-17"
  if (idade <= 20) return "Sub-20"
  return "Adulto"
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

export default function CadastroPublicoPage() {
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    sobrenome: "",
    dataNascimento: "",
    posicao: "",
    posicaoSecundaria: "",
    telefoneResponsavel: "",
    cpf: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.nome.trim()) newErrors.nome = "Nome é obrigatório"
    if (!formData.sobrenome.trim()) newErrors.sobrenome = "Sobrenome é obrigatório"
    if (!formData.dataNascimento) newErrors.dataNascimento = "Data de nascimento é obrigatória"
    if (!formData.posicao) newErrors.posicao = "Posição é obrigatória"
    if (!formData.telefoneResponsavel.trim()) newErrors.telefoneResponsavel = "Telefone do responsável é obrigatório"
    if (!formData.cpf.trim()) newErrors.cpf = "CPF é obrigatório"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    let formattedValue = value

    if (field === "cpf") {
      formattedValue = formatarCPF(value)
    } else if (field === "telefoneResponsavel") {
      formattedValue = formatarTelefone(value)
    }

    setFormData((prev) => ({ ...prev, [field]: formattedValue }))

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    try {
      const atletaData = {
        nome: formData.nome,
        sobrenome: formData.sobrenome,
        data_nascimento: formData.dataNascimento,
        posicao: formData.posicao,
        posicao_secundaria: formData.posicaoSecundaria === "Nenhuma" ? null : formData.posicaoSecundaria,
        telefone_responsavel: formData.telefoneResponsavel,
        cpf: formData.cpf,
        categoria: calcularCategoria(formData.dataNascimento),
        idade: new Date().getFullYear() - new Date(formData.dataNascimento).getFullYear(),
        status: "Ativo",
      }

      const response = await fetch("/api/cadastro-publico", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(atletaData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Erro ao cadastrar atleta")
      }

      setSuccess(true)
    } catch (error) {
      console.error("Erro ao cadastrar:", error)
      alert(error instanceof Error ? error.message : "Erro ao cadastrar atleta")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setSuccess(false)
    setFormData({
      nome: "",
      sobrenome: "",
      dataNascimento: "",
      posicao: "",
      posicaoSecundaria: "",
      telefoneResponsavel: "",
      cpf: "",
    })
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="text-center p-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Cadastro Realizado!</h2>
            <p className="text-gray-600 mb-6">Seu cadastro foi enviado com sucesso. Em breve entraremos em contato!</p>
            <Button onClick={resetForm} className="bg-blue-600 hover:bg-blue-700 w-full">
              Fazer Novo Cadastro
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-blue-600 rounded-t-lg p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Cadastro de Atleta</h1>
          </div>
          <p className="text-blue-100">Meninos do Cristo - Escolinha de Futebol</p>
          <p className="text-sm text-blue-200 mt-2">
            Preencha o formulário abaixo para se cadastrar em nossa escolinha
          </p>
        </div>

        <Card className="rounded-t-none shadow-lg">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Dados Pessoais</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome" className="text-sm font-medium text-gray-700">
                      Nome *
                    </Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => handleInputChange("nome", e.target.value)}
                      className={`mt-1 ${errors.nome ? "border-red-500" : ""}`}
                      placeholder="Digite seu nome"
                    />
                    {errors.nome && <span className="text-red-500 text-xs mt-1">{errors.nome}</span>}
                  </div>

                  <div>
                    <Label htmlFor="sobrenome" className="text-sm font-medium text-gray-700">
                      Sobrenome *
                    </Label>
                    <Input
                      id="sobrenome"
                      value={formData.sobrenome}
                      onChange={(e) => handleInputChange("sobrenome", e.target.value)}
                      className={`mt-1 ${errors.sobrenome ? "border-red-500" : ""}`}
                      placeholder="Digite seu sobrenome"
                    />
                    {errors.sobrenome && <span className="text-red-500 text-xs mt-1">{errors.sobrenome}</span>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dataNascimento" className="text-sm font-medium text-gray-700">
                      Data de Nascimento *
                    </Label>
                    <Input
                      id="dataNascimento"
                      type="date"
                      value={formData.dataNascimento}
                      onChange={(e) => handleInputChange("dataNascimento", e.target.value)}
                      className={`mt-1 ${errors.dataNascimento ? "border-red-500" : ""}`}
                    />
                    {errors.dataNascimento && (
                      <span className="text-red-500 text-xs mt-1">{errors.dataNascimento}</span>
                    )}
                    {formData.dataNascimento && (
                      <span className="text-xs text-blue-600 font-medium mt-1 block">
                        Categoria: {calcularCategoria(formData.dataNascimento)}
                      </span>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="cpf" className="text-sm font-medium text-gray-700">
                      CPF *
                    </Label>
                    <Input
                      id="cpf"
                      value={formData.cpf}
                      onChange={(e) => handleInputChange("cpf", e.target.value)}
                      placeholder="000.000.000-00"
                      className={`mt-1 ${errors.cpf ? "border-red-500" : ""}`}
                      maxLength={14}
                    />
                    {errors.cpf && <span className="text-red-500 text-xs mt-1">{errors.cpf}</span>}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Posições de Jogo</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="posicao" className="text-sm font-medium text-gray-700">
                      Posição Principal *
                    </Label>
                    <Select value={formData.posicao} onValueChange={(value) => handleInputChange("posicao", value)}>
                      <SelectTrigger className={`mt-1 ${errors.posicao ? "border-red-500" : ""}`}>
                        <SelectValue placeholder="Selecione sua posição" />
                      </SelectTrigger>
                      <SelectContent>
                        {posicoes.map((posicao) => (
                          <SelectItem key={posicao} value={posicao}>
                            {posicao}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.posicao && <span className="text-red-500 text-xs mt-1">{errors.posicao}</span>}
                  </div>

                  <div>
                    <Label htmlFor="posicaoSecundaria" className="text-sm font-medium text-gray-700">
                      Posição Secundária
                    </Label>
                    <Select
                      value={formData.posicaoSecundaria || "Nenhuma"}
                      onValueChange={(value) => handleInputChange("posicaoSecundaria", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Posição secundária (opcional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Nenhuma">Nenhuma</SelectItem>
                        {posicoes.map((posicao) => (
                          <SelectItem key={posicao} value={posicao}>
                            {posicao}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Contato do Responsável</h3>

                <div>
                  <Label htmlFor="telefoneResponsavel" className="text-sm font-medium text-gray-700">
                    Telefone do Responsável *
                  </Label>
                  <Input
                    id="telefoneResponsavel"
                    value={formData.telefoneResponsavel}
                    onChange={(e) => handleInputChange("telefoneResponsavel", e.target.value)}
                    placeholder="(11) 99999-9999"
                    className={`mt-1 ${errors.telefoneResponsavel ? "border-red-500" : ""}`}
                    maxLength={15}
                  />
                  {errors.telefoneResponsavel && (
                    <span className="text-red-500 text-xs mt-1">{errors.telefoneResponsavel}</span>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">📋 Informações Importantes</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Todos os campos marcados com (*) são obrigatórios</li>
                  <li>• A categoria será calculada automaticamente pela idade</li>
                  <li>• Após o cadastro, entraremos em contato em até 48 horas</li>
                  <li>• Mantenha seu telefone disponível para contato</li>
                </ul>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 py-3 text-lg font-medium"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Enviando cadastro...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5 mr-2" />
                      Enviar Cadastro
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
