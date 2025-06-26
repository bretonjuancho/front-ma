"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ArrowLeft, RefreshCw, Copy } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { Titular } from "@/lib/types"

export default function DatosTitularPage() {
  const router = useRouter()
  const [titular, setTitular] = useState<Titular | null>(null)

  useEffect(() => {
    const titularData = localStorage.getItem("titularEncontrado")
    if (titularData) {
      const parsedTitular = JSON.parse(titularData)
      // Convertir fechas de string a Date
      if (parsedTitular.fechaNacimiento) {
        parsedTitular.fechaNacimiento = new Date(parsedTitular.fechaNacimiento)
      }
      parsedTitular.licencias = parsedTitular.licencias.map((lic: any) => ({
        ...lic,
        fechaCreacion: new Date(lic.fechaCreacion),
      }))
      setTitular(parsedTitular)
    } else {
      router.push("/Usuario/buscar-titular")
    }
  }, [router])

  const handleAgregarLicencia = () => {
    if (titular) {
      localStorage.setItem("titularParaLicencia", JSON.stringify(titular))
      router.push("/Usuario/crear-licencia")
    }
  }

  const handleRenovarLicencia = (licencia: any) => {
    if (titular) {
      // Guardar datos para la renovación
      localStorage.setItem("titularParaRenovacion", JSON.stringify(titular))
      localStorage.setItem("licenciaParaRenovar", JSON.stringify(licencia))
      router.push("/Usuario/renovar-licencia")
    }
  }

  const handleCopiarLicencia = (licencia: any) => {
    if (titular) {
      // Guardar datos para la copia
      localStorage.setItem("titularParaCopia", JSON.stringify(titular))
      localStorage.setItem("licenciaParaCopiar", JSON.stringify(licencia))
      router.push("/Usuario/copiar-licencia")
    }
  }

  // Función para calcular fecha de expiración
  const calcularFechaExpiracion = (fechaCreacion: Date) => {
    const fechaExpiracion = new Date(fechaCreacion)
    fechaExpiracion.setFullYear(fechaExpiracion.getFullYear() + 5)
    return fechaExpiracion
  }

  if (!titular) {
    return <div>Cargando...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => router.push("/Usuario/buscar-titular")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle>Datos del Titular</CardTitle>
                <CardDescription>Información encontrada</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Tipo de Documento</Label>
                <p className="text-lg">{titular.tipoDocumento}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Número de Documento</Label>
                <p className="text-lg">{titular.documento}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Nombre</Label>
                <p className="text-lg">{titular.nombre}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Apellido</Label>
                <p className="text-lg">{titular.apellido}</p>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-500">Fecha de Nacimiento</Label>
              <p className="text-lg">
                {titular.fechaNacimiento ? format(titular.fechaNacimiento, "PPP", { locale: es }) : "No especificada"}
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-500">Dirección</Label>
              <p className="text-lg">{titular.direccion}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Grupo Sanguíneo</Label>
                <p className="text-lg">
                  {titular.grupoSanguineo}
                  {titular.factorRH}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Donante de Órganos</Label>
                <p className="text-lg">{titular.donanteOrganos ? "Sí" : "No"}</p>
              </div>
            </div>

            {/* Sección de Licencias */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-4">
                <Label className="text-lg font-medium">Licencias</Label>
                <Button onClick={handleAgregarLicencia} size="sm">
                  Añadir Licencia
                </Button>
              </div>

              {titular.licencias && titular.licencias.length > 0 ? (
                  <div className="space-y-3">
                    {titular.licencias.map((licencia) => {
                      const fechaExpiracion = calcularFechaExpiracion(licencia.fechaCreacion)
                      const estaVencida = fechaExpiracion < new Date()

                      return (
                          <Card key={licencia.id} className={`p-4 ${estaVencida ? "border-red-200 bg-red-50" : ""}`}>
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <p className="font-medium text-lg">Tipo: {licencia.tipo}</p>
                                  {estaVencida && (
                                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Vencida</span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{licencia.observaciones}</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-500">
                                  <p>
                                    <span className="font-medium">Emisión:</span>{" "}
                                    {format(licencia.fechaCreacion, "dd/MM/yyyy", { locale: es })}
                                  </p>
                                  <p>
                                    <span className="font-medium">Vencimiento:</span>{" "}
                                    {format(fechaExpiracion, "dd/MM/yyyy", { locale: es })}
                                  </p>
                                </div>
                              </div>
                              <div className="ml-4 flex gap-2">
                                <Button
                                    onClick={() => handleCopiarLicencia(licencia)}
                                    size="sm"
                                    variant="outline"
                                    className="flex items-center gap-1"
                                >
                                  <Copy className="h-3 w-3"/>
                                  Copiar
                                </Button>
                                <Button
                                    onClick={() => handleRenovarLicencia(licencia)}
                                    size="sm"
                                    variant={estaVencida ? "default" : "outline"}
                                    className="flex items-center gap-1"
                                >
                                  <RefreshCw className="h-3 w-3"/>
                                  Renovar
                                </Button>
                              </div>
                            </div>
                          </Card>
                      )
                    })}
                  </div>
              ) : (
                  <p className="text-gray-500 italic">No tiene licencias registradas</p>
              )}
            </div>

            <Button onClick={() => router.push("/Usuario")} className="w-full">
              Volver al Inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
