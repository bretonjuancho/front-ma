"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Titular, Licencia } from "@/lib/types"
import { LicenciaPreview } from "@/components/licencia-preview"
import { ComprobantePreview } from "@/components/comprobante-preview"

export default function TramiteCompletadoPage() {
  const router = useRouter()
  const [titular, setTitular] = useState<Titular | null>(null)
  const [nuevaLicencia, setNuevaLicencia] = useState<Licencia | null>(null)

  useEffect(() => {
    const titularData = localStorage.getItem("titularCompletado")
    const licenciaData = localStorage.getItem("nuevaLicencia")

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
      setNuevaLicencia(parsedLicencia)
    } else {
      router.push("/Usuario")
    }
  }, [router])

  const handleVerDatos = () => {
    if (titular) {
      localStorage.setItem("titularEncontrado", JSON.stringify(titular))
      router.push("/Usuario/datos-titular")
    }
  }

  if (!titular || !nuevaLicencia) {
    return <div>Cargando...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-green-600">Trámite Completado</CardTitle>
            <CardDescription>
              Licencia creada exitosamente para {titular.nombre} {titular.apellido}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Foto de Licencia */}
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                  <img
                    src="/placeholder.svg?height=200&width=300"
                    alt="Licencia de conducir"
                    className="mx-auto rounded-lg shadow-md"
                    style={{ maxWidth: "100%", height: "200px", objectFit: "cover" }}
                  />
                </div>
                <p className="text-center font-medium text-gray-700">Licencia</p>
                <LicenciaPreview titular={titular} licencia={nuevaLicencia} />
              </div>

              {/* Foto de Comprobante */}
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                  <img
                    src="/placeholder.svg?height=200&width=300"
                    alt="Comprobante de pago"
                    className="mx-auto rounded-lg shadow-md"
                    style={{ maxWidth: "100%", height: "200px", objectFit: "cover" }}
                  />
                </div>
                <p className="text-center font-medium text-gray-700">Comprobante</p>
                <ComprobantePreview titular={titular} licencia={nuevaLicencia} />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button onClick={handleVerDatos} variant="outline" className="flex-1">
                Ver Datos del Titular
              </Button>
              <Button onClick={() => router.push("/Usuario")} className="flex-1">
                Volver al Inicio
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
