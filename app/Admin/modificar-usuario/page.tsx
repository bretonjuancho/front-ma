"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react"

type UsuarioAdministrativo = {
    id: string
    nombre: string
    apellido: string
    email: string
    rol: "administrador" | "administrativo"
}

export default function ModificarUsuarioAdminPage() {
    const router = useRouter()
    const [usuario, setUsuario] = useState<UsuarioAdministrativo | null>(null)
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    // Cargar datos del usuario al montar el componente
    useEffect(() => {
        // Simular carga de datos del usuario (en un caso real, harías una petición API)
        const loadUserData = () => {
            const dummyUser: UsuarioAdministrativo = {
                id: "user-123",
                nombre: "Ana",
                apellido: "García",
                email: "ana.garcia@example.com",
                rol: "administrativo"
            }
            setUsuario(dummyUser)
        }

        loadUserData()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setSuccess("")
        setLoading(true)

        // Validaciones
        if (!usuario?.nombre || !usuario.apellido || !usuario.email) {
            setError("Todos los campos son obligatorios")
            setLoading(false)
            return
        }

        if (password && password !== confirmPassword) {
            setError("Las contraseñas no coinciden")
            setLoading(false)
            return
        }

        if (password && password.length < 8) {
            setError("La contraseña debe tener al menos 8 caracteres")
            setLoading(false)
            return
        }

        try {
            // Simular petición API (en un caso real, usarías fetch o axios)
            console.log("Datos a enviar:", {
                ...usuario,
                password: password || undefined // Solo envía la contraseña si se modificó
            })

            setSuccess("Usuario actualizado correctamente")
            // Redirigir después de 2 segundos
            setTimeout(() => router.push("/Admin/usuarios"), 2000)
        } catch (err) {
            console.error("Error al actualizar usuario:", err)
            setError("Ocurrió un error al actualizar el usuario")
        } finally {
            setLoading(false)
        }
    }

    const handleCancelar = () => {
        router.back()
    }

    if (!usuario) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Cargando datos del usuario...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-md mx-auto">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={handleCancelar}>
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <div>
                                <CardTitle>Modificar Usuario</CardTitle>
                                <CardDescription>
                                    Editando datos de {usuario.nombre} {usuario.apellido}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Mostrar errores */}
                            {error && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            {/* Mostrar éxito */}
                            {success && (
                                <Alert>
                                    <CheckCircle2 className="h-4 w-4" />
                                    <AlertTitle>Éxito</AlertTitle>
                                    <AlertDescription>{success}</AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="nombre">Nombre*</Label>
                                <Input
                                    id="nombre"
                                    value={usuario.nombre}
                                    onChange={(e) => setUsuario({...usuario, nombre: e.target.value})}
                                    placeholder="Ingrese el nombre"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="apellido">Apellido*</Label>
                                <Input
                                    id="apellido"
                                    value={usuario.apellido}
                                    onChange={(e) => setUsuario({...usuario, apellido: e.target.value})}
                                    placeholder="Ingrese el apellido"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email*</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={usuario.email}
                                    onChange={(e) => setUsuario({...usuario, email: e.target.value})}
                                    placeholder="Ingrese el email"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="rol">Rol</Label>
                                <Input
                                    id="rol"
                                    value={usuario.rol === "administrador" ? "Administrador" : "Administrativo"}
                                    readOnly
                                    className="bg-gray-100"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Nueva Contraseña</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Dejar en blanco para no modificar"
                                />
                                <p className="text-xs text-gray-500">Mínimo 8 caracteres</p>
                            </div>

                            {password && (
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña*</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Repita la nueva contraseña"
                                        required={password !== ""}
                                    />
                                </div>
                            )}

                            <div className="flex gap-4 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancelar}
                                    className="flex-1"
                                    disabled={loading}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1"
                                    disabled={loading}
                                >
                                    {loading ? "Guardando..." : "Guardar Cambios"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}