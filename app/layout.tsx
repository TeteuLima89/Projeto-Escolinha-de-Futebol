import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AtletasProvider } from "@/contexts/atletas-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Meninos do Cristo - Sistema de Gestão",
  description: "Sistema de gestão para atletas do Meninos do Cristo",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AtletasProvider>{children}</AtletasProvider>
      </body>
    </html>
  )
}
