"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react"

export default function CrearUsuarioAdminPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        dni: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setFormData(prev => ({ ...prev, [id]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setSuccess("")
        setLoading(true)

        // Validaciones
        if (!formData.nombre || !formData.apellido || !formData.dni || !formData.email || !formData.password) {
            setError("Todos los campos son obligatorios")
            setLoading(false)
            return
        }

        if (!/^\d{7,8}$/.test(formData.dni)) {
            setError("El DNI debe tener 7 u 8 dígitos")
            setLoading(false)
            return
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError("Ingrese un email válido")
            setLoading(false)
            return
        }

        if (formData.password.length < 8) {
            setError("La contraseña debe tener al menos 8 caracteres")
            setLoading(false)
            return
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Las contraseñas no coinciden")
            setLoading(false)
            return
        }

        try {
            // Simular petición API
            console.log("Datos a enviar:", {
                nombre: formData.nombre,
                apellido: formData.apellido,
                dni: formData.dni,
                email: formData.email,
                password: formData.password,
                rol: "administrativo" // Rol por defecto
            })

            // Simular retardo de red
            await new Promise(resolve => setTimeout(resolve, 1000))

            setSuccess("Usuario creado correctamente")
            // Limpiar formulario
            setFormData({
                nombre: "",
                apellido: "",
                dni: "",
                email: "",
                password: "",
                confirmPassword: ""
            })
            // Redirigir después de 2 segundos
            setTimeout(() => router.push("/Admin/usuarios"), 2000)
        } catch (err) {
            console.error("Error al crear usuario:", err)
            setError("Ocurrió un error al crear el usuario")
        } finally {
            setLoading(false)
        }
    }

    const handleCancelar = () => {
        router.back()
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
                                <CardTitle>Crear Nuevo Usuario</CardTitle>
                                <CardDescription>
                                    Complete los datos del usuario administrativo
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

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nombre">Nombre*</Label>
                                    <Input
                                        id="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        placeholder="Ej: Juan"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="apellido">Apellido*</Label>
                                    <Input
                                        id="apellido"
                                        value={formData.apellido}
                                        onChange={handleChange}
                                        placeholder="Ej: Pérez"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="dni">DNI*</Label>
                                <Input
                                    id="dni"
                                    type="number"
                                    value={formData.dni}
                                    onChange={handleChange}
                                    placeholder="Ej: 12345678"
                                    required
                                />
                                <p className="text-xs text-gray-500">Sin puntos ni espacios</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email*</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Ej: usuario@dominio.com"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Contraseña*</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Mínimo 8 caracteres"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirmar Contraseña*</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Repita la contraseña"
                                    required
                                />
                            </div>

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
                                    {loading ? "Creando usuario..." : "Crear Usuario"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}