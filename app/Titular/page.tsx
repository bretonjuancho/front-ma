"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FilePlus2Icon, RefreshCwIcon } from "lucide-react"
import { useRouter } from "next/navigation"

export default function TitularInicioPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-md mx-auto">
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Gestión de Licencia</CardTitle>
                        <CardDescription>Selecciona una acción para continuar</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button
                            onClick={() => router.push("/Titular/Renovacion")}
                            className="w-full h-16 text-lg"
                            variant="default"
                        >
                            <RefreshCwIcon className="mr-2 h-5 w-5" />
                            Renovar Licencia
                        </Button>

                        <Button
                            onClick={() => router.push("/Titular/Emitir-copia")}
                            className="w-full h-16 text-lg"
                            variant="outline"
                        >
                            <FilePlus2Icon className="mr-2 h-5 w-5" />
                            Emitir Copia
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
