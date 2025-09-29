"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, Download, Filter, Users, Loader2 } from "lucide-react"
import { useAtletas, type Atleta } from "@/contexts/atletas-context"

const generatePDF = async (atletasFiltrados: Atleta[], filtros: any) => {
  const { jsPDF } = await import("jspdf")
  const autoTable = (await import("jspdf-autotable")).default

  const doc = new jsPDF()

  // Header do PDF
  doc.setFontSize(20)
  doc.setTextColor(40, 40, 40)
  doc.text("Meninos do Cristo - Relatório de Atletas", 20, 30)

  doc.setFontSize(12)
  doc.setTextColor(100, 100, 100)
  doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-BR")}`, 20, 40)

  // Informações dos filtros aplicados
  let yPosition = 50
  if (filtros.categoria !== "all" || filtros.posicao !== "all" || filtros.status !== "all") {
    doc.setFontSize(14)
    doc.setTextColor(40, 40, 40)
    doc.text("Filtros Aplicados:", 20, yPosition)
    yPosition += 10

    doc.setFontSize(10)
    if (filtros.categoria !== "all") {
      doc.text(`• Categoria: ${filtros.categoria}`, 25, yPosition)
      yPosition += 7
    }
    if (filtros.posicao !== "all") {
      doc.text(`• Posição: ${filtros.posicao}`, 25, yPosition)
      yPosition += 7
    }
    if (filtros.status !== "all") {
      doc.text(`• Status: ${filtros.status}`, 25, yPosition)
      yPosition += 7
    }
    yPosition += 10
  }

  const tableData = atletasFiltrados.map((atleta) => [
    atleta.nome,
    atleta.sobrenome,
    new Date(atleta.data_nascimento).toLocaleDateString("pt-BR"),
    atleta.posicao,
    atleta.posicao_secundaria || "-",
    atleta.categoria,
    atleta.status,
  ])

  autoTable(doc, {
    head: [["Nome", "Sobrenome", "Nascimento", "Posição", "Pos. Sec.", "Categoria", "Status"]],
    body: tableData,
    startY: yPosition,
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [14, 165, 233], // Sky blue color
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
  })

  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(100, 100, 100)
    doc.text(
      `Total de atletas: ${atletasFiltrados.length} | Página ${i} de ${pageCount}`,
      20,
      doc.internal.pageSize.height - 10,
    )
  }

  // Salvar o PDF
  const fileName = `relatorio-atletas-${new Date().toISOString().split("T")[0]}.pdf`
  doc.save(fileName)
}

export function RelatoriosContent() {
  const { atletas, loading, error } = useAtletas()
  const [filtros, setFiltros] = useState({
    categoria: "all",
    posicao: "all",
    status: "all",
  })
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const atletasFiltrados = atletas.filter((atleta) => {
    return (
      (filtros.categoria === "all" || atleta.categoria === filtros.categoria) &&
      (filtros.posicao === "all" || atleta.posicao.toLowerCase().includes(filtros.posicao.toLowerCase())) &&
      (filtros.status === "all" || atleta.status === filtros.status)
    )
  })

  const handleGerarPDF = async () => {
    setIsGeneratingPDF(true)
    try {
      await generatePDF(atletasFiltrados, filtros)
    } catch (error) {
      console.error("Erro ao gerar PDF:", error)
      alert("Erro ao gerar PDF. Tente novamente.")
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const categorias = [...new Set(atletas.map((atleta) => atleta.categoria))].sort()
  const posicoes = [...new Set(atletas.map((atleta) => atleta.posicao))].sort()
  const statusList = [...new Set(atletas.map((atleta) => atleta.status))].sort()

  const atletasAtivos = atletas.filter((a) => a.status === "Ativo").length
  const atletasInativos = atletas.filter((a) => a.status === "Inativo").length

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg p-6">
          <div className="text-center text-red-600">
            <p>Erro ao carregar dados: {error}</p>
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
          <span className="text-gray-600">Relatórios</span>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-6">Gerador de Relatórios</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total de Atletas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-sky-600">
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : atletas.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Atletas Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : atletasAtivos}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Atletas Inativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : atletasInativos}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Categorias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : categorias.length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtros do Relatório
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="filtroCategoria">Categoria:</Label>
                <Select
                  value={filtros.categoria}
                  onValueChange={(value) => setFiltros({ ...filtros, categoria: value })}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as categorias" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    {categorias.map((categoria) => (
                      <SelectItem key={categoria} value={categoria}>
                        {categoria}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="filtroPosicao">Posição:</Label>
                <Select
                  value={filtros.posicao}
                  onValueChange={(value) => setFiltros({ ...filtros, posicao: value })}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as posições" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as posições</SelectItem>
                    {posicoes.map((posicao) => (
                      <SelectItem key={posicao} value={posicao}>
                        {posicao}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="filtroStatus">Status:</Label>
                <Select
                  value={filtros.status}
                  onValueChange={(value) => setFiltros({ ...filtros, status: value })}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    {statusList.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                onClick={handleGerarPDF}
                className="bg-sky-500 hover:bg-sky-600"
                disabled={isGeneratingPDF || loading || atletasFiltrados.length === 0}
              >
                {isGeneratingPDF ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Gerando PDF...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Gerar PDF
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setFiltros({ categoria: "all", posicao: "all", status: "all" })}
                className="border-sky-300 text-sky-700"
                disabled={loading}
              >
                Limpar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Preview do Relatório ({atletasFiltrados.length} atletas)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                <p>Carregando dados...</p>
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
                      <TableHead>Categoria</TableHead>
                      <TableHead>Status</TableHead>
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
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {!loading && atletasFiltrados.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum atleta encontrado com os filtros aplicados.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
