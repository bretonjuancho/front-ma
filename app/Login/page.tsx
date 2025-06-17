"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function LoginPage() {
    const router = useRouter()
    const [dni, setDni] = useState("")
    const [password, setPassword] = useState("")
    const [showError, setShowError] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!dni || !password) {
            setErrorMessage("Por favor complete ambos campos.");
            setShowError(true);
            return;
        }

        try {
            const response = await fetch("http://localhost:8081/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    dni: dni,
                    password: password
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Credenciales inválidas");
            }

            const data = await response.json();
            console.log("Respuesta de login:", data); // Para depuración



            // Guardar el token en localStorage
            if (data.access_token) {
                localStorage.setItem('accessToken', data.access_token);
                localStorage.setItem('refreshToken', data.refresh_token);
                localStorage.setItem('userRole', data.rol);
            } else {
                throw new Error("No se recibió token en la respuesta");
            }

            // Redirección basada en rol
            if (data.rol === "administrador") {
                router.push("/Admin");
            } else if (data.rol === "administrativo") {
                router.push("/Usuario");
            } else {
                throw new Error("Rol desconocido");
            }

        } catch (error) {
            console.error("Error en login:", error);
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "DNI o contraseña incorrectos."
            );
            setShowError(true);

            // Limpiar tokens en caso de error
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userRole');
        }
    };
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Ingreso al Sistema</CardTitle>
                        <CardDescription>Acceso para usuarios administrativos y administradores</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <Label htmlFor="dni">DNI</Label>
                                <Input
                                    id="dni"
                                    type="text"
                                    value={dni}
                                    onChange={(e) => setDni(e.target.value)}
                                    placeholder="Ej: 12345678"
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
                                    placeholder="Contraseña"
                                    required
                                />
                            </div>

                            <Button type="submit" className="w-full h-12 text-lg">
                                Iniciar Sesión
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>

            {/* Diálogo de error */}
            <Dialog open={showError} onOpenChange={setShowError}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600">
                            <AlertCircle className="h-5 w-5" /> Error al iniciar sesión
                        </DialogTitle>
                    </DialogHeader>
                    <div className="text-sm text-gray-700">{errorMessage}</div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
