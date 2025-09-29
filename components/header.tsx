import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function Header() {
  return (
    <header className="bg-sky-500 text-white p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1">
            <Image
              src="/images/logo-meninos-do-cristo.jpg"
              alt="Logo Meninos do Cristo"
              width={32}
              height={32}
              className="rounded-full object-contain"
            />
          </div>
          <h1 className="text-xl font-bold">Meninos do Cristo</h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className="text-white hover:bg-sky-600">
          <Bell className="w-4 h-4" />
          <span className="bg-red-500 text-xs rounded-full px-1 ml-1">3</span>
        </Button>
      </div>
    </header>
  )
}
