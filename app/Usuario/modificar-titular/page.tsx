"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, ArrowLeft } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { Titular } from "@/lib/types"

interface TitularDTO {
  tipoDocumento: string
  documento: string
  nombre: string
  apellido: string
  fechaNacimiento: string
  direccion: string
  grupoSanguineo: string
  factorRH: string
  donanteOrganos: boolean
}

export default function ModificarTitularPage() {
  const router = useRouter()
  const [titular, setTitular] = useState<Titular | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const titularData = localStorage.getItem("titularParaModificar")
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!titular) return

    setLoading(true)
    setError(null)

    try {
      // Preparar los datos para enviar al backend
      const titularDTO: TitularDTO = {
        tipoDocumento: titular.tipoDocumento,
        documento: titular.documento,
        nombre: titular.nombre,
        apellido: titular.apellido,
        fechaNacimiento: titular.fechaNacimiento?.toISOString().split('T')[0] || '',
        direccion: titular.direccion,
        grupoSanguineo: titular.grupoSanguineo,
        factorRH: titular.factorRH,
        donanteOrganos: titular.donanteOrganos
      }

      // Llamar al endpoint del backend
      const response = await fetch('http://localhost:8081/titular/modificar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(titularDTO)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al modificar el titular')
      }

      const data = await response.json()

      // Actualizar el titular en localStorage
      localStorage.setItem("titularEncontrado", JSON.stringify({
        ...titular,
        nombre: data.nombre,
        apellido: data.apellido,
        direccion: data.direccion,
        donanteOrganos: data.donanteOrganos
      }))

      // Mostrar mensaje de éxito y redirigir
      alert("Titular modificado exitosamente")
      router.push("/Usuario/datos-titular")
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error desconocido')
      console.error("Error al modificar titular:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelar = () => {
    router.back()
  }

  if (!titular) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>
  }

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
                  <CardTitle>Modificar Titular</CardTitle>
                  <CardDescription>
                    Editando datos de {titular.nombre} {titular.apellido}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {error && (
                  <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
                    {error}
                  </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Tipo de Documento (solo lectura) */}
                  <div className="space-y-2">
                    <Label htmlFor="tipoDocumento">Tipo de Documento</Label>
                    <Input
                        id="tipoDocumento"
                        value={titular.tipoDocumento}
                        readOnly
                        className="bg-gray-100"
                    />
                  </div>

                  {/* Número de Documento (solo lectura) */}
                  <div className="space-y-2">
                    <Label htmlFor="numeroDocumento">Número de Documento</Label>
                    <Input
                        id="numeroDocumento"
                        value={titular.documento}
                        readOnly
                        className="bg-gray-100"
                    />
                  </div>

                  {/* Nombre (editable) */}
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre*</Label>
                    <Input
                        id="nombre"
                        value={titular.nombre}
                        onChange={(e) => setTitular({ ...titular, nombre: e.target.value })}
                        placeholder="Ingrese el nombre"
                        required
                    />
                  </div>

                  {/* Apellido (editable) */}
                  <div className="space-y-2">
                    <Label htmlFor="apellido">Apellido*</Label>
                    <Input
                        id="apellido"
                        value={titular.apellido}
                        onChange={(e) => setTitular({ ...titular, apellido: e.target.value })}
                        placeholder="Ingrese el apellido"
                        required
                    />
                  </div>
                </div>

                {/* Fecha de Nacimiento (solo lectura) */}
                <div className="space-y-2">
                  <Label>Fecha de Nacimiento</Label>
                  <Input
                      value={titular.fechaNacimiento ? format(titular.fechaNacimiento, "PPP", { locale: es }) : ""}
                      readOnly
                      className="bg-gray-100"
                  />
                </div>

                {/* Dirección (editable) */}
                <div className="space-y-2">
                  <Label htmlFor="direccion">Dirección*</Label>
                  <Input
                      id="direccion"
                      value={titular.direccion}
                      onChange={(e) => setTitular({ ...titular, direccion: e.target.value })}
                      placeholder="Ingrese la dirección completa"
                      required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Grupo Sanguíneo (solo lectura) */}
                  <div className="space-y-2">
                    <Label>Grupo Sanguíneo</Label>
                    <Input
                        value={titular.grupoSanguineo || "No especificado"}
                        readOnly
                        className="bg-gray-100"
                    />
                  </div>

                  {/* Factor RH (solo lectura) */}
                  <div className="space-y-2">
                    <Label>Factor RH</Label>
                    <Input
                        value={titular.factorRH || "No especificado"}
                        readOnly
                        className="bg-gray-100"
                    />
                  </div>
                </div>

                {/* Donante de órganos (editable) */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                      id="donanteOrganos"
                      checked={titular.donanteOrganos}
                      onCheckedChange={(checked) => setTitular({ ...titular, donanteOrganos: checked as boolean })}
                  />
                  <Label htmlFor="donanteOrganos">Donante de órganos</Label>
                </div>

                <div className="flex gap-4">
                  <Button type="button" variant="outline" onClick={handleCancelar} className="flex-1">
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1" disabled={loading}>
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