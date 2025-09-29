"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Trophy, Settings, ChevronDown, Search, BarChart3 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const menuItems = [
  { icon: Home, label: "Início", href: "/" },
  { icon: Trophy, label: "Atletas", href: "/atletas" },
  { icon: BarChart3, label: "Relatórios", href: "/relatorios" },
  { icon: Settings, label: "Configurações", href: "/configuracoes" },
]

export function Sidebar() {
  const [isAdminOpen, setIsAdminOpen] = useState(true)
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white/10 backdrop-blur-sm text-white min-h-screen">
      <div className="p-4">
        <div className="flex items-center justify-center mb-6 pb-4 border-b border-white/20">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center p-2">
            <Image
              src="/images/logo-meninos-do-cristo.jpg"
              alt="Logo Meninos do Cristo"
              width={48}
              height={48}
              className="rounded-full object-contain"
            />
          </div>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
          <Input
            placeholder="Filtrar menu (ENTER)"
            className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/60"
          />
        </div>

        <div className="mb-4">
          <Button
            variant="ghost"
            className="w-full justify-between text-white hover:bg-white/20 p-2"
            onClick={() => setIsAdminOpen(!isAdminOpen)}
          >
            <span>Administração</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isAdminOpen ? "rotate-180" : ""}`} />
          </Button>
        </div>

        {isAdminOpen && (
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-white hover:bg-white/20 ${isActive ? "bg-white/20" : ""}`}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {item.label}
                  </Button>
                </Link>
              )
            })}
          </nav>
        )}
      </div>
    </aside>
  )
}
