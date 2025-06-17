"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { User, Search } from "lucide-react"
import { useRouter } from "next/navigation"

export default function UsuarioInicioPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Gestión de Titulares</CardTitle>
            <CardDescription>Selecciona una opción para continuar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Vista crear titular: crear-titular/page.tsx */}
            <Button
              onClick={() => router.push("/Usuario/crear-titular")}
              className="w-full h-16 text-lg"
              variant="default"
            >
              <User className="mr-2 h-5 w-5" />
              Crear un Titular
            </Button>

            {/* Vista buscar titular: buscar-titular/page.tsx */}
            <Button
              onClick={() => router.push("/Usuario/buscar-titular")}
              className="w-full h-16 text-lg"
              variant="outline"
            >
              <Search className="mr-2 h-5 w-5" />
              Buscar un Titular
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
