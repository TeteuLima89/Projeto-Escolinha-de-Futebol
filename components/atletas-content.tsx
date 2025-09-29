"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Edit, Trash2, Loader2 } from "lucide-react"
import { AtletaModal } from "./atleta-modal"
import { useAtletas, type Atleta } from "@/contexts/atletas-context"

export function AtletasContent() {
  const { atletas, loading, error, adicionarAtleta, atualizarAtleta, removerAtleta } = useAtletas()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [atletaEditando, setAtletaEditando] = useState<Atleta | null>(null)
  const [filtros, setFiltros] = useState({
    nome: "",
    sobrenome: "",
    posicao: "",
    categoria: "",
  })

  const handleSalvarAtleta = async (atletaData: any) => {
    try {
      // Converter campos para o formato do banco
      const atletaFormatado = {
        nome: atletaData.nome,
        sobrenome: atletaData.sobrenome,
        data_nascimento: atletaData.dataNascimento,
        posicao: atletaData.posicao,
        posicao_secundaria: atletaData.posicaoSecundaria === "Nenhuma" ? null : atletaData.posicaoSecundaria,
        telefone_responsavel: atletaData.telefoneResponsavel,
        cpf: atletaData.cpf,
        categoria: atletaData.categoria,
        idade: calcularIdade(atletaData.dataNascimento),
        status: atletaData.ativo ? "Ativo" : "Inativo",
      }

      if (atletaEditando) {
        await atualizarAtleta(atletaEditando.id!, atletaFormatado)
      } else {
        await adicionarAtleta(atletaFormatado)
      }
      setIsModalOpen(false)
      setAtletaEditando(null)
    } catch (error) {
      console.error("Erro ao salvar atleta:", error)
      alert("Erro ao salvar atleta. Verifique se o CPF já não está cadastrado.")
    }
  }

  const calcularIdade = (dataNascimento: string): number => {
    const hoje = new Date()
    const nascimento = new Date(dataNascimento)
    return hoje.getFullYear() - nascimento.getFullYear()
  }

  const handleEditarAtleta = (atleta: Atleta) => {
    const atletaFormatado = {
      id: atleta.id,
      nome: atleta.nome,
      sobrenome: atleta.sobrenome,
      dataNascimento: atleta.data_nascimento,
      posicao: atleta.posicao,
      posicaoSecundaria: atleta.posicao_secundaria || "",
      telefoneResponsavel: atleta.telefone_responsavel,
      cpf: atleta.cpf,
      categoria: atleta.categoria,
      ativo: atleta.status === "Ativo",
    }
    setAtletaEditando(atletaFormatado as any)
    setIsModalOpen(true)
  }

  const handleNovoAtleta = () => {
    setAtletaEditando(null)
    setIsModalOpen(true)
  }

  const handleRemoverAtleta = async (id: number) => {
    if (confirm("Tem certeza que deseja remover este atleta?")) {
      try {
        await removerAtleta(id)
      } catch (error) {
        console.error("Erro ao remover atleta:", error)
        alert("Erro ao remover atleta.")
      }
    }
  }

  const atletasFiltrados = atletas.filter((atleta) => {
    return (
      atleta.nome.toLowerCase().includes(filtros.nome.toLowerCase()) &&
      atleta.sobrenome.toLowerCase().includes(filtros.sobrenome.toLowerCase()) &&
      atleta.posicao.toLowerCase().includes(filtros.posicao.toLowerCase()) &&
      atleta.categoria.toLowerCase().includes(filtros.categoria.toLowerCase())
    )
  })

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg p-6">
          <div className="text-center text-red-600">
            <p>Erro ao carregar atletas: {error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Tentar novamente
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-6 bg-sky-500 rounded"></div>
          <span className="text-gray-600">Atletas</span>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-6">Parâmetros de pesquisa</h2>

        <div className="space-y-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="filtroNome">Nome:</Label>
              <Input
                id="filtroNome"
                value={filtros.nome}
                onChange={(e) => setFiltros({ ...filtros, nome: e.target.value })}
                placeholder="Filtrar por nome"
              />
            </div>
            <div>
              <Label htmlFor="filtroSobrenome">Sobrenome:</Label>
              <Input
                id="filtroSobrenome"
                value={filtros.sobrenome}
                onChange={(e) => setFiltros({ ...filtros, sobrenome: e.target.value })}
                placeholder="Filtrar por sobrenome"
              />
            </div>
            <div>
              <Label htmlFor="filtroPosicao">Posição:</Label>
              <Input
                id="filtroPosicao"
                value={filtros.posicao}
                onChange={(e) => setFiltros({ ...filtros, posicao: e.target.value })}
                placeholder="Filtrar por posição"
              />
            </div>
            <div>
              <Label htmlFor="filtroCategoria">Categoria:</Label>
              <Input
                id="filtroCategoria"
                value={filtros.categoria}
                onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value })}
                placeholder="Filtrar por categoria"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="button" className="bg-sky-500 hover:bg-sky-600" onClick={handleNovoAtleta} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
              Novo
            </Button>
            <Button type="button" variant="outline" className="border-sky-300 text-sky-700 bg-transparent">
              <Search className="w-4 h-4 mr-2" />
              Consultar
            </Button>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <p className="text-sm text-gray-600">Arraste aqui o cabeçalho de uma coluna para agrupar por esta coluna</p>
        </div>

        {loading && atletas.length === 0 ? (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p>Carregando atletas...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Sobrenome</TableHead>
                  <TableHead>Data Nascimento</TableHead>
                  <TableHead>Posição</TableHead>
                  <TableHead>Posição Sec.</TableHead>
                  <TableHead>Telefone Resp.</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {atletasFiltrados.map((atleta) => (
                  <TableRow key={atleta.id}>
                    <TableCell className="font-medium">{atleta.nome}</TableCell>
                    <TableCell>{atleta.sobrenome}</TableCell>
                    <TableCell>{new Date(atleta.data_nascimento).toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell>{atleta.posicao}</TableCell>
                    <TableCell>{atleta.posicao_secundaria || "-"}</TableCell>
                    <TableCell>{atleta.telefone_responsavel}</TableCell>
                    <TableCell>{atleta.cpf}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {atleta.categoria}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          atleta.status === "Ativo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {atleta.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditarAtleta(atleta)}
                          disabled={loading}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRemoverAtleta(atleta.id!)}
                          className="text-red-600 hover:text-red-700"
                          disabled={loading}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
          <span>
            Exibindo itens 1 - {atletasFiltrados.length} de {atletasFiltrados.length}
          </span>
          <div className="flex items-center gap-2">
            <span>Itens por página:</span>
            <select className="border rounded px-2 py-1">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
          </div>
        </div>
      </div>

      <AtletaModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setAtletaEditando(null)
        }}
        onSave={handleSalvarAtleta}
        atleta={atletaEditando}
      />
    </div>
  )
}
