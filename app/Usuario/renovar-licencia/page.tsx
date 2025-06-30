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


interface Licencia {
    id: string
    tipo: string
    observaciones: string
    fechaCreacion: Date
}

interface Titular {
    tipoDocumento: string
    documento: string
    nombre: string
    apellido: string
    fechaNacimiento: Date | undefined
    direccion: string
    grupoSanguineo: string
    factorRH: string
    donanteOrganos: boolean
    licencias: Licencia[]
}

interface LicenciaConTitular {
    id: string
    tipo: string
    observaciones: string
    fechaEmision: Date
    fechaVencimiento: Date
    titular: Titular
}

interface LicenciaDTO {
    class: string
    numero: number
    observations: string
    fechaEmission: string
    fechaVencimiento: string
    titular: TitularDTO
}

interface TitularDTO {
    nombre: string
    apellido: string
    documento: string
    tipoDocumento: string
    fechaNacimiento: string
    direccion: string
    grupoSanguineo: string
    factorRH: string
    donante: boolean
}

export default function RenovarLicenciaPage() {
    const router = useRouter()
    const [titular, setTitular] = useState<Titular | null>(null)
    const [licencia, setLicencia] = useState<LicenciaConTitular | null>(null)
    const [observaciones, setObservaciones] = useState("")
    const [editandoObservaciones, setEditandoObservaciones] = useState(false)
    const [observacionesTemp, setObservacionesTemp] = useState("")
    const [motivoRenovacion, setMotivoRenovacion] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

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
            parsedLicencia.fechaEmision = new Date(parsedLicencia.fechaEmision)
            parsedLicencia.fechaVencimiento = new Date(parsedLicencia.fechaVencimiento)

            setTitular(parsedLicencia.titular || parsedTitular)
            setLicencia(parsedLicencia)
            setObservaciones(parsedLicencia.observaciones)

            // Sugerir motivo automáticamente basado en el estado de la licencia
            if (parsedLicencia.fechaVencimiento < new Date()) {
                setMotivoRenovacion("Expiración")
            }
        } else {
            router.push("/Usuario/datos-titular")
        }
    }, [router])

    const calcularFechaExpiracion = (fechaCreacion: Date) => {
        const fechaExpiracion = new Date(fechaCreacion)
        fechaExpiracion.setFullYear(fechaExpiracion.getFullYear() + 5)
        return fechaExpiracion
    }

    const transformToTitularDTO = (titular: Titular): TitularDTO => {
        return {
            nombre: titular.nombre,
            apellido: titular.apellido,
            documento: titular.documento,
            tipoDocumento: titular.tipoDocumento,
            fechaNacimiento: titular.fechaNacimiento
                ? format(titular.fechaNacimiento, "yyyy-MM-dd")
                : "",
            direccion: titular.direccion,
            grupoSanguineo: titular.grupoSanguineo,
            factorRH: titular.factorRH,
            donante: titular.donanteOrganos
        }
    }

    const transformToLicenciaDTO = (): LicenciaDTO => {
        if (!titular || !licencia) {
            throw new Error("Datos de titular o licencia no disponibles")
        }

        const licenciaNumero = parseInt(licencia.id.replace('LIC', ''))
        if (isNaN(licenciaNumero)) {
            throw new Error("Formato de número de licencia inválido")
        }

        const observacionesConMotivo = motivoRenovacion === "Otros"
            ? observaciones
            : `Motivo: ${motivoRenovacion}${observaciones ? ` - ${observaciones}` : ""}`

        return {
            class: licencia.tipo,
            numero: licenciaNumero,
            observations: observacionesConMotivo,
            fechaEmission: format(new Date(), "yyyy-MM-dd"),
            fechaVencimiento: format(calcularFechaExpiracion(new Date()), "yyyy-MM-dd"),
            titular: transformToTitularDTO(titular)
        }
    }

    const handleRenovar = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        if (!titular || !licencia || !motivoRenovacion) {
            setError("Por favor selecciona un motivo de renovación")
            setLoading(false)
            return
        }

        try {
            const licenciaDTO = transformToLicenciaDTO()

            const response = await fetch("http://localhost:8081/Licencia/renovar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify(licenciaDTO)
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || "Error al renovar la licencia")
            }

            const data = await response.json()

            // Actualizar el estado local con la licencia renovada
            const licenciaRenovada = {
                ...licencia,
                tipo: data.class,
                observaciones: data.observations,
                fechaEmision: new Date(data.fechaEmission),
                fechaVencimiento: new Date(data.fechaVencimiento)
            }

            const titularActualizado = {
                ...titular,
                licencias: titular.licencias.map((lic) =>
                    lic.id === licencia.id ? {
                        ...lic,
                        tipo: data.class,
                        observaciones: data.observations,
                        fechaCreacion: new Date(data.fechaEmission)
                    } : lic
                ),
            }

            // Guardar para el trámite completado
            localStorage.setItem("titularCompletado", JSON.stringify(titularActualizado))
            localStorage.setItem("nuevaLicencia", JSON.stringify(licenciaRenovada))

            router.push("/Usuario/tramite-completado")
        } catch (err) {
            console.error("Error al renovar licencia:", err)
            setError(err instanceof Error ? err.message : "Ocurrió un error al renovar la licencia")
        } finally {
            setLoading(false)
        }
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
        setEditandoObservaciones(false)
    }

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
        return <div className="min-h-screen flex items-center justify-center">Cargando...</div>
    }

    const fechaExpiracion = licencia.fechaVencimiento
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
                        {error && (
                            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
                                {error}
                            </div>
                        )}
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
                                    <Select
                                        value={motivoRenovacion}
                                        onValueChange={setMotivoRenovacion}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar motivo de renovación" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Expiración">Expiración</SelectItem>
                                            <SelectItem value="Extravío">Extravío</SelectItem>
                                            <SelectItem value="Cambios">Cambios</SelectItem>
                                            <SelectItem value="Otros">Otros</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {motivoRenovacion && (
                                        <p className="text-sm text-gray-600 mt-1">
                                            {obtenerDescripcionMotivo(motivoRenovacion)}
                                        </p>
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
                                        <p className="text-base">{format(licencia.fechaEmision, "PPP", { locale: es })}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-500">Fecha de Expiración
                                            Actual</Label>
                                        <p className="text-base">{fechaExpiracion ? format(new Date(fechaExpiracion), "PPP", {locale: es}) : "Fecha no disponible"}</p>
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
                                            <Button
                                                type="button"
                                                size="sm"
                                                onClick={handleGuardarObservaciones}
                                                className="px-3"
                                            >
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
                                        Nota: El motivo de renovación se incluirá automáticamente en el registro de la licencia.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
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
                                    disabled={!motivoRenovacion || loading}
                                >
                                    {loading ? "Procesando..." : "Confirmar Renovación"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}