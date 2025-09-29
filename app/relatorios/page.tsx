import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { RelatoriosContent } from "@/components/relatorios-content"

export default function RelatoriosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 to-sky-600">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <RelatoriosContent />
        </main>
      </div>
    </div>
  )
}
