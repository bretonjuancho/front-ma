"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Eye, Edit } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { Titular } from "@/lib/types"

export default function ResultadosBusquedaPage() {
  const router = useRouter()
  const [resultados, setResultados] = useState<Titular[]>([])

  useEffect(() => {
    const resultadosData = localStorage.getItem("resultadosBusqueda")
    if (resultadosData) {
      const parsedResultados = JSON.parse(resultadosData)
      // Convertir fechas de string a Date
      const resultadosConFechas = parsedResultados.map((titular: any) => ({
        ...titular,
        fechaNacimiento: titular.fechaNacimiento ? new Date(titular.fechaNacimiento) : undefined,
        licencias: titular.licencias.map((lic: any) => ({
          ...lic,
          fechaCreacion: new Date(lic.fechaCreacion),
        })),
      }))
      setResultados(resultadosConFechas)
    } else {
      router.push("/Usuario/buscar-titular")
    }
  }, [router])

  const handleVerTitular = (titular: Titular) => {
    localStorage.setItem("titularEncontrado", JSON.stringify(titular))
    console.log(titular.documento)
    router.push("/Usuario/datos-titular")
  }

  const handleModificarTitular = (titular: Titular) => {
    localStorage.setItem("titularParaModificar", JSON.stringify(titular))
    router.push("/Usuario/modificar-titular")
  }

  if (resultados.length === 0) {
    return <div>Cargando...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => router.push("/Usuario/buscar-titular")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle>Resultados de Búsqueda</CardTitle>
                <CardDescription>Se encontraron {resultados.length} titular(es)</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo Doc.</TableHead>
                    <TableHead>Número</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Apellido</TableHead>
                    <TableHead>Fecha Nac.</TableHead>
                    <TableHead>Licencias</TableHead>
                    <TableHead className="text-center">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resultados.map((titular, index) => (
                    <TableRow key={`${titular.documento}-${index}`}>
                      <TableCell>{titular.tipoDocumento}</TableCell>
                      <TableCell>{titular.documento}</TableCell>
                      <TableCell>{titular.nombre}</TableCell>
                      <TableCell>{titular.apellido}</TableCell>
                      <TableCell>
                        {titular.fechaNacimiento
                          ? format(titular.fechaNacimiento, "dd/MM/yyyy", { locale: es })
                          : "No especificada"}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {titular.licencias.length > 0 ? (
                            titular.licencias.map((licencia) => (
                              <span
                                key={licencia.id}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {licencia.tipo}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-500 text-sm">Sin licencias</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 justify-center">
                          <Button
                            onClick={() => handleVerTitular(titular)}
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handleModificarTitular(titular)}
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-6">
              <Button onClick={() => router.push("/Usuario")} className="w-full">
                Volver al Inicio
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
