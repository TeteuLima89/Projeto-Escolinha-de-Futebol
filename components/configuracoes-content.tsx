"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Upload,
  Save,
  Building2,
  Phone,
  Mail,
  MapPin,
  Link,
  Copy,
  Check,
  UserPlus,
  FileSpreadsheet,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
// import { ImportacaoExcel } from "./importacao-excel"

interface Configuracao {
  id: number
  nome_escolinha: string
  telefone: string
  email: string
  endereco: string
  logo_url: string
}

export function ConfiguracoesContent() {
  const [config, setConfig] = useState<Configuracao>({
    id: 1,
    nome_escolinha: "",
    telefone: "",
    email: "",
    endereco: "",
    logo_url: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [linkCopiado, setLinkCopiado] = useState(false)
  const { toast } = useToast()

  const webhookUrl =
    typeof window !== "undefined" ? `${window.location.origin}/api/webhook/google-forms` : "/api/webhook/google-forms"

  const fetchConfiguracoes = async () => {
    try {
      const response = await fetch("/api/configuracoes")
      if (response.ok) {
        const data = await response.json()
        if (data.length > 0) {
          setConfig(data[0])
        }
      }
    } catch (error) {
      console.error("Erro ao carregar configurações:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/configuracoes", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      })

      if (response.ok) {
        toast({
          title: "Configurações salvas",
          description: "As configurações foram atualizadas com sucesso.",
        })
      } else {
        throw new Error("Erro ao salvar")
      }
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: keyof Configuracao, value: string) => {
    setConfig((prev) => ({ ...prev, [field]: value }))
  }

  const copiarLink = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl)
      setLinkCopiado(true)
      toast({
        title: "Link copiado!",
        description: "O link de cadastro foi copiado para a área de transferência.",
      })
      setTimeout(() => setLinkCopiado(false), 2000)
    } catch (error) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o link. Tente selecionar e copiar manualmente.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchConfiguracoes()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando configurações...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Configurações</h1>
        <p className="text-white/80 mt-2">Configure as informações gerais da escolinha</p>
      </div>

      <Card className="bg-white/95 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5" />
            Importação de Planilhas Excel
          </CardTitle>
          <CardDescription>
            Importe atletas em lote através de planilhas Excel com validação automática de duplicatas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-blue-800">
              🚧 Funcionalidade de importação Excel em desenvolvimento. Em breve você poderá importar planilhas com
              validação automática de duplicatas.
            </p>
          </div>
          {/* <ImportacaoExcel /> */}
        </CardContent>
      </Card>

      <Card className="bg-white/95 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Google Forms - Cadastro de Atletas
          </CardTitle>
          <CardDescription>Configure um Google Forms para receber cadastros de atletas automaticamente</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* URL do Webhook */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">URL do Webhook (para configurar no Google Forms)</Label>
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Link className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <Input
                  value={webhookUrl}
                  readOnly
                  className="bg-white border-blue-300 text-blue-800 font-mono text-sm"
                />
              </div>
              <Button
                onClick={() => navigator.clipboard.writeText(webhookUrl)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-100 bg-transparent"
              >
                <Copy className="w-4 h-4" />
                Copiar
              </Button>
            </div>
          </div>

          {/* Instruções passo a passo */}
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
              <Check className="w-5 h-5" />
              Como configurar o Google Forms:
            </h4>

            <div className="space-y-4 text-sm text-green-700">
              <div className="space-y-2">
                <p className="font-medium">1. Criar o Google Forms:</p>
                <ul className="ml-4 space-y-1">
                  <li>
                    • Acesse{" "}
                    <a
                      href="https://forms.google.com"
                      target="_blank"
                      className="text-blue-600 underline"
                      rel="noreferrer"
                    >
                      forms.google.com
                    </a>
                  </li>
                  <li>• Crie um novo formulário</li>
                  <li>• Título sugerido: "Cadastro de Atletas - [Nome da Escolinha]"</li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="font-medium">2. Adicionar os campos (EXATAMENTE com estes nomes):</p>
                <ul className="ml-4 space-y-1">
                  <li>
                    • <code className="bg-gray-100 px-1 rounded">nome</code> - Texto curto (obrigatório)
                  </li>
                  <li>
                    • <code className="bg-gray-100 px-1 rounded">sobrenome</code> - Texto curto (obrigatório)
                  </li>
                  <li>
                    • <code className="bg-gray-100 px-1 rounded">data_nascimento</code> - Data (obrigatório)
                  </li>
                  <li>
                    • <code className="bg-gray-100 px-1 rounded">posicoes</code> - Múltipla escolha: Goleiro, Zagueiro,
                    Lateral, Volante, Meia, Atacante
                  </li>
                  <li>
                    • <code className="bg-gray-100 px-1 rounded">telefone_responsavel</code> - Texto curto
                  </li>
                  <li>
                    • <code className="bg-gray-100 px-1 rounded">cpf</code> - Texto curto (obrigatório)
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="font-medium">3. Configurar integração:</p>
                <ul className="ml-4 space-y-1">
                  <li>• Vá em "Respostas" → "Criar planilha"</li>
                  <li>• Na planilha, vá em "Extensões" → "Apps Script"</li>
                  <li>• Cole o código que forneceremos abaixo</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Código para Apps Script */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm font-medium">Código para Google Apps Script:</Label>
              <Button
                onClick={() =>
                  navigator.clipboard.writeText(`function onFormSubmit(e) {
  console.log('Formulário enviado, processando dados...');
  
  const responses = e.values;
  console.log('Respostas recebidas:', responses);
  
  // Mapear respostas (ajuste os índices conforme a ordem dos campos no seu formulário)
  const data = {
    nome: responses[1],           // Nome
    sobrenome: responses[2],      // Sobrenome  
    data_nascimento: responses[3], // Data de Nascimento
    posicoes: responses[4],       // Posições de Jogo
    telefone_responsavel: responses[5], // Telefone do Responsável
    cpf: responses[6]             // CPF
  };
  
  console.log('Dados mapeados:', data);
  
  // Enviar para nosso webhook
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    payload: JSON.stringify(data)
  };
  
  try {
    console.log('Enviando dados para:', '${webhookUrl}');
    const response = UrlFetchApp.fetch('${webhookUrl}', options);
    console.log('Resposta do servidor:', response.getContentText());
    console.log('Status:', response.getResponseCode());
  } catch (error) {
    console.error('Erro ao enviar dados:', error);
  }
}`)
                }
                variant="outline"
                size="sm"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar Código
              </Button>
            </div>
            <pre className="text-xs bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
              {`function onFormSubmit(e) {
  console.log('Formulário enviado, processando dados...');
  
  const responses = e.values;
  console.log('Respostas recebidas:', responses);
  
  // Mapear respostas (ajuste os índices conforme a ordem dos campos no seu formulário)
  const data = {
    nome: responses[1],           // Nome
    sobrenome: responses[2],      // Sobrenome  
    data_nascimento: responses[3], // Data de Nascimento
    posicoes: responses[4],       // Posições de Jogo
    telefone_responsavel: responses[5], // Telefone do Responsável
    cpf: responses[6]             // CPF
  };
  
  console.log('Dados mapeados:', data);
  
  // Enviar para nosso webhook
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    payload: JSON.stringify(data)
  };
  
  try {
    console.log('Enviando dados para:', '${webhookUrl}');
    const response = UrlFetchApp.fetch('${webhookUrl}', options);
    console.log('Resposta do servidor:', response.getContentText());
    console.log('Status:', response.getResponseCode());
  } catch (error) {
    console.error('Erro ao enviar dados:', error);
  }
}`}
            </pre>
          </div>

          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h4 className="font-medium text-red-800 mb-2">🔧 Para debugar problemas:</h4>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• No Apps Script, vá em "Execuções" para ver logs de erro</li>
              <li>• Teste o acionador manualmente: "Executar" → "onFormSubmit"</li>
              <li>• Verifique se os índices do array responses[] correspondem à ordem dos campos</li>
              <li>• Certifique-se que o acionador está configurado para "Ao enviar formulário"</li>
              <li>• URL do webhook deve estar exatamente como mostrado acima</li>
            </ul>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-2">🧪 Testar Integração:</h4>
            <p className="text-sm text-blue-700 mb-3">
              Clique no botão abaixo para testar se o webhook está funcionando:
            </p>
            <Button
              onClick={async () => {
                try {
                  const testData = {
                    nome: "João",
                    sobrenome: "Silva",
                    data_nascimento: "2010-05-15",
                    posicoes: "Atacante",
                    telefone_responsavel: "(11) 99999-9999",
                    cpf: "123.456.789-00",
                  }

                  const response = await fetch(webhookUrl, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(testData),
                  })

                  const result = await response.json()

                  if (response.ok) {
                    toast({
                      title: "✅ Webhook funcionando!",
                      description: "O teste foi bem-sucedido. A integração está funcionando.",
                    })
                  } else {
                    toast({
                      title: "❌ Erro no webhook",
                      description: result.error || "Erro desconhecido",
                      variant: "destructive",
                    })
                  }
                } catch (error) {
                  toast({
                    title: "❌ Erro de conexão",
                    description: "Não foi possível conectar ao webhook",
                    variant: "destructive",
                  })
                }
              }}
              variant="outline"
              className="border-blue-300 text-blue-700 hover:bg-blue-100"
            >
              Testar Webhook
            </Button>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              {saving ? "Salvando..." : "Salvar Configurações"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/95 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Informações da Escolinha
          </CardTitle>
          <CardDescription>Configure o nome, contatos e informações básicas da instituição</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nome_escolinha">Nome da Escolinha</Label>
              <Input
                id="nome_escolinha"
                value={config.nome_escolinha}
                onChange={(e) => handleInputChange("nome_escolinha", e.target.value)}
                placeholder="Ex: Meninos do Cristo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Telefone
              </Label>
              <Input
                id="telefone"
                value={config.telefone}
                onChange={(e) => handleInputChange("telefone", e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={config.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="contato@meninosdocristo.com.br"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endereco" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Endereço
              </Label>
              <Textarea
                id="endereco"
                value={config.endereco}
                onChange={(e) => handleInputChange("endereco", e.target.value)}
                placeholder="Rua, número, bairro, cidade - CEP"
                rows={3}
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Logo da Escolinha
            </Label>
            <div className="flex items-center gap-4">
              {config.logo_url && (
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                  <img src={config.logo_url || "/placeholder.svg"} alt="Logo" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1">
                <Input
                  value={config.logo_url}
                  onChange={(e) => handleInputChange("logo_url", e.target.value)}
                  placeholder="URL da logo (ex: https://exemplo.com/logo.png)"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Cole a URL de uma imagem ou faça upload para um serviço de hospedagem
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
