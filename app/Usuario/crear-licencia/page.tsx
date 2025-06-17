"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import type { Titular, Licencia } from "@/lib/types"

export default function CrearLicenciaPage() {
  const router = useRouter()
  const [titular, setTitular] = useState<Titular | null>(null)
  const [nuevaLicencia, setNuevaLicencia] = useState({
    tipo: "",
    observaciones: "",
  })

  useEffect(() => {
    const titularData = localStorage.getItem("titularParaLicencia")
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
      router.push("/Usuario/datos-titular")
    }
  }, [router])

  const handleCrearLicencia = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!titular) {
      alert("No se encontró información del titular");
      return;
    }

    // Obtener el token de autenticación
    const token = localStorage.getItem('accessToken');

    console.log(token)

    // Preparar payload
    const licenciaPayload = {
      clase: nuevaLicencia.tipo,
      observaciones:nuevaLicencia.observaciones,
      fechaEmision: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD
      titular: {
        nombre: titular.nombre,
        apellido: titular.apellido,
        documento: titular.documento,
        tipoDocumento: titular.tipoDocumento,
        fechaNacimiento: titular.fechaNacimiento?.toISOString().split("T")[0],
        direccion: titular.direccion,
        grupoSanguineo: titular.grupoSanguineo,
        factorRH: titular.factorRH,
        donante: titular.donanteOrganos,
      },
    };

    console.log(licenciaPayload)
    console.log(licenciaPayload.titular)

    try {
      const response = await fetch("http://localhost:8081/licencia/guardar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(licenciaPayload),
      });

      // Manejar errores de autenticación

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
            errorData?.message ||
            `Error al crear la licencia: ${response.statusText}`
        );
      }

      const data = await response.json();

      // Guardar datos en localStorage
      localStorage.setItem("titularCompletado", JSON.stringify(titular));
      localStorage.setItem("nuevaLicencia", JSON.stringify(data));

      // Redirigir a página de éxito
      router.push("/Usuario/tramite-completado");

    } catch (error) {
      console.error("Fallo al crear la licencia:", error);
      alert(
          error instanceof Error
              ? error.message
              : "No se pudo crear la licencia. Intente nuevamente."
      );
    }
  };

  const handleCancelar = () => {
    router.push("/Usuario/datos-titular")
  }

  if (!titular) {
    return <div>Cargando...</div>
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
                <CardTitle>Crear Nueva Licencia</CardTitle>
                <CardDescription>
                  Para: {titular.nombre} {titular.apellido}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCrearLicencia} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tipoLicencia">Tipo de Licencia</Label>
                <Select
                  value={nuevaLicencia.tipo}
                  onValueChange={(value) => setNuevaLicencia({ ...nuevaLicencia, tipo: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">A - Motocicletas</SelectItem>
                    <SelectItem value="B">B - Automóviles</SelectItem>
                    <SelectItem value="C">C - Camiones</SelectItem>
                    <SelectItem value="D">D - Transporte de pasajeros</SelectItem>
                    <SelectItem value="E">E - Transporte de carga</SelectItem>
                    <SelectItem value="F">F - Maquinaria especial</SelectItem>
                    <SelectItem value="G">G - Tractores</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observaciones">Observaciones</Label>
                <Input
                  id="observaciones"
                  value={nuevaLicencia.observaciones}
                  onChange={(e) => setNuevaLicencia({ ...nuevaLicencia, observaciones: e.target.value })}
                  placeholder="Ingrese observaciones (opcional)"
                />
              </div>

              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={handleCancelar} className="flex-1">
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1">
                  Confirmar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
