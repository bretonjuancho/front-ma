"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"

export default function CrearUsuarioPage() {
    const router = useRouter()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden")
            return
        }

        // Aquí iría la lógica para enviar el usuario al backend
        alert("Usuario creado correctamente")
        router.push("/admin/inicio")
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-md mx-auto">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => router.push("/admin/inicio")}>
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <div>
                                <CardTitle>Crear Usuario</CardTitle>
                                <CardDescription>Complete los datos para registrar un nuevo usuario</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="username">Nombre de Usuario</Label>
                                <Input
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="password">Contraseña</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="pt-2">
                                <Button type="submit" className="w-full h-12 text-lg">
                                    Crear Usuario
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
