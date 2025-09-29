"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { X } from "lucide-react"

interface Atleta {
  id?: number
  nome: string
  sobrenome: string
  dataNascimento: string
  posicao: string
  posicaoSecundaria?: string
  telefoneResponsavel: string
  cpf: string
  categoria: string
  ativo: boolean
}

interface AtletaModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (atleta: Atleta) => void
  atleta?: Atleta | null
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

export function AtletaModal({ isOpen, onClose, onSave, atleta }: AtletaModalProps) {
  const [formData, setFormData] = useState<Atleta>({
    nome: "",
    sobrenome: "",
    dataNascimento: "",
    posicao: "",
    posicaoSecundaria: "",
    telefoneResponsavel: "",
    cpf: "",
    categoria: "",
    ativo: true,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (atleta) {
      setFormData(atleta)
    } else {
      setFormData({
        nome: "",
        sobrenome: "",
        dataNascimento: "",
        posicao: "",
        posicaoSecundaria: "",
        telefoneResponsavel: "",
        cpf: "",
        categoria: "",
        ativo: true,
      })
    }
    setErrors({})
  }, [atleta, isOpen])

  useEffect(() => {
    if (formData.dataNascimento) {
      const categoria = calcularCategoria(formData.dataNascimento)
      setFormData((prev) => ({ ...prev, categoria }))
    }
  }, [formData.dataNascimento])

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSave(formData)
      onClose()
    }
  }

  const handleInputChange = (field: keyof Atleta, value: string) => {
    let formattedValue = value

    if (field === "cpf") {
      formattedValue = formatarCPF(value)
    } else if (field === "telefoneResponsavel") {
      formattedValue = formatarTelefone(value)
    }

    setFormData((prev) => ({ ...prev, [field]: formattedValue }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="bg-blue-600 text-white p-4 -m-6 mb-6">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-medium">{atleta ? "Editar Atleta" : "Dados cadastrais do atleta"}</DialogTitle>
            
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="nome" className="text-sm font-medium">
                  Nome: <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => handleInputChange("nome", e.target.value)}
                  className={errors.nome ? "border-red-500" : ""}
                />
                {errors.nome && <span className="text-red-500 text-xs">{errors.nome}</span>}
              </div>

              <div>
                <Label htmlFor="sobrenome" className="text-sm font-medium">
                  Sobrenome: <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="sobrenome"
                  value={formData.sobrenome}
                  onChange={(e) => handleInputChange("sobrenome", e.target.value)}
                  className={errors.sobrenome ? "border-red-500" : ""}
                />
                {errors.sobrenome && <span className="text-red-500 text-xs">{errors.sobrenome}</span>}
              </div>

              <div>
                <Label htmlFor="dataNascimento" className="text-sm font-medium">
                  Data de nascimento: <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="dataNascimento"
                  type="date"
                  value={formData.dataNascimento}
                  onChange={(e) => handleInputChange("dataNascimento", e.target.value)}
                  className={errors.dataNascimento ? "border-red-500" : ""}
                />
                {errors.dataNascimento && <span className="text-red-500 text-xs">{errors.dataNascimento}</span>}
              </div>

              <div>
                <Label htmlFor="posicao" className="text-sm font-medium">
                  Posição: <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.posicao} onValueChange={(value) => handleInputChange("posicao", value)}>
                  <SelectTrigger className={errors.posicao ? "border-red-500" : ""}>
                    <SelectValue placeholder="Selecione a posição" />
                  </SelectTrigger>
                  <SelectContent>
                    {posicoes.map((posicao) => (
                      <SelectItem key={posicao} value={posicao}>
                        {posicao}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.posicao && <span className="text-red-500 text-xs">{errors.posicao}</span>}
              </div>

              <div>
                <Label htmlFor="posicaoSecundaria" className="text-sm font-medium">
                  Posição secundária:
                </Label>
                <Select
                  value={formData.posicaoSecundaria || "Nenhuma"}
                  onValueChange={(value) => handleInputChange("posicaoSecundaria", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a posição secundária (opcional)" />
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

            <div className="space-y-4">
              <div>
                <Label htmlFor="telefoneResponsavel" className="text-sm font-medium">
                  Telefone do responsável: <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="telefoneResponsavel"
                  value={formData.telefoneResponsavel}
                  onChange={(e) => handleInputChange("telefoneResponsavel", e.target.value)}
                  placeholder="(11) 99999-9999"
                  className={errors.telefoneResponsavel ? "border-red-500" : ""}
                />
                {errors.telefoneResponsavel && (
                  <span className="text-red-500 text-xs">{errors.telefoneResponsavel}</span>
                )}
              </div>

              <div>
                <Label htmlFor="cpf" className="text-sm font-medium">
                  CPF do atleta: <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="cpf"
                  value={formData.cpf}
                  onChange={(e) => handleInputChange("cpf", e.target.value)}
                  placeholder="000.000.000-00"
                  className={errors.cpf ? "border-red-500" : ""}
                />
                {errors.cpf && <span className="text-red-500 text-xs">{errors.cpf}</span>}
              </div>

              <div>
                <Label htmlFor="categoria" className="text-sm font-medium">
                  Categoria:
                </Label>
                <Input
                  id="categoria"
                  value={formData.categoria}
                  readOnly
                  className="bg-gray-100"
                  placeholder="Calculada automaticamente"
                />
                <span className="text-xs text-gray-500">Calculada automaticamente baseada na idade</span>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="ativo"
                  checked={formData.ativo}
                  onChange={(e) => setFormData((prev) => ({ ...prev, ativo: e.target.checked }))}
                  className="w-4 h-4"
                />
                <Label htmlFor="ativo" className="text-sm font-medium">
                  Ativo
                </Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-sky-500 hover:bg-sky-600">
              {atleta ? "Atualizar" : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
