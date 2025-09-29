import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { DashboardContent } from "@/components/dashboard-content"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 to-sky-600">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <DashboardContent />
        </main>
      </div>
    </div>
  )
}
