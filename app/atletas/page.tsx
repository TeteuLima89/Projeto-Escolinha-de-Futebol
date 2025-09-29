import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { AtletasContent } from "@/components/atletas-content"

export default function AtletasPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 to-sky-600">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <AtletasContent />
        </main>
      </div>
    </div>
  )
}
