"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
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
                  {titular.licencias.map((licencia) => (
                    <Card key={licencia.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">Tipo: {licencia.tipo}</p>
                          <p className="text-sm text-gray-600 mt-1">{licencia.observaciones}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            Creada: {format(licencia.fechaCreacion, "PPP", { locale: es })}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
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
