import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Eye } from "lucide-react"

export function DashboardContent() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-6 bg-sky-500 rounded"></div>
          <span className="text-gray-600">Início</span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-800">Painel</span>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Bem-vindo de volta, treinador!</h2>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 bg-sky-500"></div>
            <h3 className="text-lg font-semibold text-gray-700">Atividades Pendentes</h3>
            <RefreshCw className="w-4 h-4 text-gray-400" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-sky-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                    5
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Novos Atletas</h4>
                    <p className="text-sm text-gray-600">5 cadastros pendentes</p>
                  </div>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2 mb-3">
                  <div className="bg-green-500 h-2 rounded-full w-full"></div>
                </div>
                <Button size="sm" className="bg-sky-500 hover:bg-sky-600">
                  <Eye className="w-4 h-4 mr-1" />
                  Inspecionar
                </Button>
              </CardContent>
            </Card>

            

            {/* <Card className="border-sky-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Avaliações</h4>
                    <p className="text-sm text-gray-600">2 avaliações pendentes</p>
                  </div>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2 mb-3">
                  <div className="bg-green-500 h-2 rounded-full w-1/2"></div>
                </div>
                <Button size="sm" className="bg-sky-500 hover:bg-sky-600">
                  <Eye className="w-4 h-4 mr-1" />
                  Inspecionar
                </Button>
              </CardContent>
            </Card> */}

            <Card className="border-sky-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Relatórios</h4>
                    <p className="text-sm text-gray-600">1 relatório mensal</p>
                  </div>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2 mb-3">
                  <div className="bg-green-500 h-2 rounded-full w-full"></div>
                </div>
                <Button size="sm" className="bg-sky-500 hover:bg-sky-600">
                  <Eye className="w-4 h-4 mr-1" />
                  Inspecionar
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 bg-sky-500"></div>
            <h3 className="text-lg font-semibold text-gray-700">Filtros Rápidos</h3>
            <RefreshCw className="w-4 h-4 text-gray-400" />
          </div>

          <div className="flex flex-wrap gap-3">
            {[
              "Meus Atletas",
              "Categoria Sub-15",
              "Categoria Sub-17",
              "Categoria Sub-20",
              "Profissional",
              "Ativos",
              "Inativos",
            ].map((filter) => (
              <Button
                key={filter}
                variant="outline"
                className="bg-sky-100 border-sky-300 text-sky-700 hover:bg-sky-200"
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
