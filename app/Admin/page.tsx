"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { UserPlusIcon, SearchIcon } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminInicioPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-md mx-auto">
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Panel del Administrador</CardTitle>
                        <CardDescription>Gestión de usuarios del sistema</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button
                            onClick={() => router.push("/admin/crear-usuario")}
                            className="w-full h-16 text-lg"
                            variant="default"
                        >
                            <UserPlusIcon className="mr-2 h-5 w-5" />
                            Crear Usuario
                        </Button>

                        <Button
                            onClick={() => router.push("/admin/consultar-titular")}
                            className="w-full h-16 text-lg"
                            variant="outline"
                        >
                            <SearchIcon className="mr-2 h-5 w-5" />
                            Consultar Titular
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
