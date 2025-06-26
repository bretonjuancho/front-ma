"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Edit2, Check, X } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { Titular, Licencia } from "@/lib/types"

export default function RenovarLicenciaPage() {
    const router = useRouter()
    const [titular, setTitular] = useState<Titular | null>(null)
    const [licencia, setLicencia] = useState<Licencia | null>(null)
    const [observaciones, setObservaciones] = useState("")
    const [editandoObservaciones, setEditandoObservaciones] = useState(false)
    const [observacionesTemp, setObservacionesTemp] = useState("")
    const [motivoRenovacion, setMotivoRenovacion] = useState("")

    useEffect(() => {
        const titularData = localStorage.getItem("titularParaRenovacion")
        const licenciaData = localStorage.getItem("licenciaParaRenovar")

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
            setObservaciones(parsedLicencia.observaciones)

            // Sugerir motivo automáticamente basado en el estado de la licencia
            const fechaExpiracion = new Date(parsedLicencia.fechaCreacion)
            fechaExpiracion.setFullYear(fechaExpiracion.getFullYear() + 5)

            if (fechaExpiracion < new Date()) {
                setMotivoRenovacion("Expiración")
            }
        } else {
            router.push("/Usuario/datos-titular")
        }
    }, [router])

    const handleRenovar = (e: React.FormEvent) => {
        e.preventDefault()

        if (!titular || !licencia || !motivoRenovacion) {
            alert("Por favor selecciona un motivo de renovación")
            return
        }


        // Crear nueva licencia renovada con el motivo incluido en las observaciones
        const observacionesConMotivo =
            motivoRenovacion === "Otros"
                ? observaciones
                : `Motivo: ${motivoRenovacion}${observaciones ? ` - ${observaciones}` : ""}`

        const licenciaRenovada: Licencia = {
            id: Date.now().toString(),
            tipo: licencia.tipo,
            observaciones: observacionesConMotivo,
            fechaCreacion: new Date(), // Nueva fecha de emisión
        }

        // Actualizar el titular con la nueva licencia
        const titularActualizado = {
            ...titular,
            licencias: titular.licencias.map((lic) => (lic.id === licencia.id ? licenciaRenovada : lic)),
        }

        // Guardar para el trámite completado
        localStorage.setItem("titularCompletado", JSON.stringify(titularActualizado))
        localStorage.setItem("nuevaLicencia", JSON.stringify(licenciaRenovada))

        router.push("/Usuario/tramite-completado")
    }

    const handleCancelar = () => {
        router.push("/Usuario/datos-titular")
    }

    const handleDobleClickObservaciones = () => {
        setEditandoObservaciones(true)
        setObservacionesTemp(observaciones)
    }

    const handleGuardarObservaciones = () => {
        setObservaciones(observacionesTemp)
        setEditandoObservaciones(false)
    }

    const handleCancelarEdicion = () => {
        setObservacionesTemp(observaciones)
        setEditandoObservaciones(false)
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
            Expiración: "La licencia ha vencido o está próxima a vencer",
            Extravío: "La licencia física se ha perdido o extraviado",
            Cambios: "Cambios en datos personales o información de la licencia",
            Otros: "Otro motivo no especificado en las opciones anteriores",
        }
        return descripciones[motivo as keyof typeof descripciones] || ""
    }

    if (!titular || !licencia) {
        return <div>Cargando...</div>
    }

    const fechaExpiracion = calcularFechaExpiracion(licencia.fechaCreacion)
    const nuevaFechaExpiracion = calcularFechaExpiracion(new Date())

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
                                <CardTitle>Renovar Licencia</CardTitle>
                                <CardDescription>Renovación de licencia tipo {licencia.tipo}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleRenovar} className="space-y-6">
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

                            {/* Motivo de Renovación */}
                            <div className="space-y-4">
                                <h3 className="font-medium text-lg">Motivo de Renovación</h3>
                                <div className="space-y-2">
                                    <Label htmlFor="motivoRenovacion">Selecciona el motivo *</Label>
                                    <Select value={motivoRenovacion} onValueChange={setMotivoRenovacion}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar motivo de renovación" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Expiración">Expiración</SelectItem>
                                            <SelectItem value="Extravío">Extravío</SelectItem>
                                            <SelectItem value="Cambios">Robo</SelectItem>
                                            <SelectItem value="Otros">Otros</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {motivoRenovacion && (
                                        <p className="text-sm text-gray-600 mt-1">{obtenerDescripcionMotivo(motivoRenovacion)}</p>
                                    )}
                                </div>
                            </div>

                            {/* Datos de la Licencia */}
                            <div className="space-y-4">
                                <h3 className="font-medium text-lg">Información de la Licencia</h3>

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
                                        <Label className="text-sm font-medium text-gray-500">Fecha de Emisión Actual</Label>
                                        <p className="text-base">{format(licencia.fechaCreacion, "PPP", { locale: es })}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-500">Fecha de Expiración Actual</Label>
                                        <p className="text-base">{format(fechaExpiracion, "PPP", { locale: es })}</p>
                                    </div>
                                </div>

                                {/* Nueva información después de la renovación */}
                                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                    <h4 className="font-medium text-green-800 mb-2">Después de la renovación:</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <Label className="text-sm font-medium text-green-700">Nueva Fecha de Emisión</Label>
                                            <p className="text-green-800">{format(new Date(), "PPP", { locale: es })}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-green-700">Nueva Fecha de Expiración</Label>
                                            <p className="text-green-800">{format(nuevaFechaExpiracion, "PPP", { locale: es })}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Observaciones (Editable con doble click) */}
                                <div>
                                    <Label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                        Observaciones
                                        {!editandoObservaciones &&
                                            <span className="text-xs text-gray-400">(Doble click para editar)</span>}
                                    </Label>

                                    {editandoObservaciones ? (
                                        <div className="flex gap-2 mt-1">
                                            <Input
                                                value={observacionesTemp}
                                                onChange={(e) => setObservacionesTemp(e.target.value)}
                                                placeholder="Ingrese observaciones"
                                                className="flex-1"
                                                autoFocus
                                            />
                                            <Button type="button" size="sm" onClick={handleGuardarObservaciones}
                                                    className="px-3">
                                                <Check className="h-4 w-4"/>
                                            </Button>
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                onClick={handleCancelarEdicion}
                                                className="px-3"
                                            >
                                                <X className="h-4 w-4"/>
                                            </Button>
                                        </div>
                                    ) : (
                                        <div
                                            className="p-3 bg-gray-50 rounded-md border cursor-pointer hover:bg-gray-100 transition-colors min-h-[40px] flex items-center"
                                            onDoubleClick={handleDobleClickObservaciones}
                                        >
                                            <p className="text-base">
                                                {observaciones ||
                                                    <span className="text-gray-400 italic">Sin observaciones</span>}
                                            </p>
                                            <Edit2 className="h-4 w-4 text-gray-400 ml-auto"/>
                                        </div>
                                    )}
                                    <p className="text-xs text-gray-500 mt-1">
                                        Nota: El motivo de renovación se incluirá automáticamente en el registro de la
                                        licencia.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button type="button" variant="outline" onClick={handleCancelar} className="flex-1">
                                    Cancelar
                                </Button>
                                <Button type="submit" className="flex-1" disabled={!motivoRenovacion}>
                                    Confirmar Renovación
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
