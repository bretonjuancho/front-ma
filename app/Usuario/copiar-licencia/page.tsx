"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { Titular, Licencia } from "@/lib/types"

export default function CopiarLicenciaPage() {
    const router = useRouter()
    const [titular, setTitular] = useState<Titular | null>(null)
    const [licencia, setLicencia] = useState<Licencia | null>(null)
    const [motivoCopia, setMotivoCopia] = useState("")

    useEffect(() => {
        const titularData = localStorage.getItem("titularParaCopia")
        const licenciaData = localStorage.getItem("licenciaParaCopiar")

        if (titularData && licenciaData) {
            const parsedTitular = JSON.parse(titularData)
            const parsedLicencia = JSON.parse(licenciaData)

            // Convertir fechas de string a Date
            if (parsedTitular.fechaNacimiento) {
                parsedTitular.fechaNacimiento = new Date(parsedTitular.fechaNacimiento)
            }
            parsedTitular.licencias = parsedTitular.licencias.map((lic: any) => ({
                ...lic,
                fechaCreacion: new Date(lic.fechaCreacion),
            }))
            parsedLicencia.fechaCreacion = new Date(parsedLicencia.fechaCreacion)

            setTitular(parsedTitular)
            setLicencia(parsedLicencia)
        } else {
            router.push("/Usuario/datos-titular")
        }
    }, [router])

    const handleCopiar = (e: React.FormEvent) => {
        e.preventDefault()

        if (!titular || !licencia || !motivoCopia) {
            alert("Por favor selecciona un motivo para la copia")
            return
        }

        // Crear nueva licencia (copia) con el motivo incluido en las observaciones
        const observacionesConMotivo = `Copia por: ${motivoCopia} - ${licencia.observaciones || "Sin observaciones adicionales"}`

        const licenciaCopia: Licencia = {
            id: Date.now().toString(),
            tipo: licencia.tipo,
            observaciones: observacionesConMotivo,
            fechaCreacion: licencia.fechaCreacion, // Mantiene la fecha de emisión original
        }

        // Actualizar el titular agregando la nueva copia (no reemplaza la original)
        const titularActualizado = {
            ...titular,
            licencias: [...titular.licencias, licenciaCopia],
        }

        // Guardar para el trámite completado
        localStorage.setItem("titularCompletado", JSON.stringify(titularActualizado))
        localStorage.setItem("nuevaLicencia", JSON.stringify(licenciaCopia))

        router.push("/Usuario/tramite-completado")
    }

    const handleCancelar = () => {
        router.push("/Usuario/datos-titular")
    }

    // Función para calcular fecha de expiración
    const calcularFechaExpiracion = (fechaCreacion: Date) => {
        const fechaExpiracion = new Date(fechaCreacion)
        fechaExpiracion.setFullYear(fechaExpiracion.getFullYear() + 5)
        return fechaExpiracion
    }

    // Función para obtener la descripción del motivo
    const obtenerDescripcionMotivo = (motivo: string) => {
        const descripciones = {
            Robo: "La licencia física fue sustraída o robada",
            Extravío: "La licencia física se ha perdido o extraviado",
            Deterioro: "La licencia física está dañada o deteriorada",
            Otros: "Otro motivo no especificado en las opciones anteriores",
        }
        return descripciones[motivo as keyof typeof descripciones] || ""
    }

    if (!titular || !licencia) {
        return <div>Cargando...</div>
    }

    const fechaExpiracion = calcularFechaExpiracion(licencia.fechaCreacion)

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={handleCancelar}>
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <div>
                                <CardTitle>Copiar Licencia</CardTitle>
                                <CardDescription>Solicitud de copia de licencia tipo {licencia.tipo}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCopiar} className="space-y-6">
                            {/* Datos del Titular (Solo lectura) */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-medium text-lg mb-3">Datos del Titular</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <Label className="text-sm font-medium text-gray-500">Nombre</Label>
                                        <p className="text-base font-medium">{titular.nombre}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-500">Apellido</Label>
                                        <p className="text-base font-medium">{titular.apellido}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-500">DNI</Label>
                                        <p className="text-base font-medium">{titular.documento}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Motivo de Copia */}
                            <div className="space-y-4">
                                <h3 className="font-medium text-lg">Motivo de la Copia</h3>
                                <div className="space-y-2">
                                    <Label htmlFor="motivoCopia">Selecciona el motivo *</Label>
                                    <Select value={motivoCopia} onValueChange={setMotivoCopia}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar motivo para la copia" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Robo">Robo</SelectItem>
                                            <SelectItem value="Extravío">Extravío</SelectItem>
                                            <SelectItem value="Deterioro">Deterioro</SelectItem>
                                            <SelectItem value="Otros">Otros</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {motivoCopia && <p className="text-sm text-gray-600 mt-1">{obtenerDescripcionMotivo(motivoCopia)}</p>}
                                </div>
                            </div>

                            {/* Datos de la Licencia */}
                            <div className="space-y-4">
                                <h3 className="font-medium text-lg">Información de la Licencia Original</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-medium text-gray-500">Tipo de Licencia</Label>
                                        <p className="text-lg font-medium">{licencia.tipo}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-500">Estado</Label>
                                        <p className="text-lg">
                                            {fechaExpiracion < new Date() ? (
                                                <span className="text-red-600 font-medium">Vencida</span>
                                            ) : (
                                                <span className="text-green-600 font-medium">Vigente</span>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-medium text-gray-500">Fecha de Emisión Original</Label>
                                        <p className="text-base">{format(licencia.fechaCreacion, "PPP", { locale: es })}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-500">Fecha de Expiración</Label>
                                        <p className="text-base">{format(fechaExpiracion, "PPP", { locale: es })}</p>
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-500">Observaciones Originales</Label>
                                    <p className="text-base bg-gray-50 p-3 rounded-md">{licencia.observaciones || "Sin observaciones"}</p>
                                </div>

                                {/* Información sobre la copia */}
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                    <h4 className="font-medium text-blue-800 mb-2">Información de la Copia:</h4>
                                    <div className="text-sm text-blue-700 space-y-1">
                                        <p>• La copia mantendrá la fecha de emisión original</p>
                                        <p>• La fecha de expiración será la misma que la licencia original</p>
                                        <p>• Se agregará el motivo de la copia en las observaciones</p>
                                        <p>• La copia tendrá validez legal equivalente al original</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button type="button" variant="outline" onClick={handleCancelar} className="flex-1">
                                    Cancelar
                                </Button>
                                <Button type="submit" className="flex-1" disabled={!motivoCopia}>
                                    Confirmar Copia
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
