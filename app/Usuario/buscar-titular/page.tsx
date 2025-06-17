"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Search } from "lucide-react"
import { titularesEjemplo } from "@/lib/data"

export default function BuscarTitularPage() {
  const router = useRouter()
  const [criterio, setCriterio] = useState("")
  const [valorBusqueda, setValorBusqueda] = useState("")

  const handleBuscar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!criterio || !valorBusqueda.trim()) {
      alert("Por favor selecciona un criterio de búsqueda e ingresa un valor");
      return;
    }

    try {
      // Obtener el token del localStorage
      const token = localStorage.getItem('accessToken');

      if (!token) {
        throw new Error("No estás autenticado. Por favor inicia sesión nuevamente.");
      }



      console.log("ahora voy al back")

      const response = await fetch(
          `http://localhost:8081/titular?${criterio}=${encodeURIComponent(valorBusqueda)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          }
      );

      console.log("volvi del back")


      if (!response.ok) {
        throw new Error(`Error al buscar titulares: ${response.statusText}`);
      }

      const resultados = await response.json();


      if (!resultados || resultados.length === 0) {
        alert("No se encontraron titulares con los criterios especificados");
        return;
      }

      if (resultados.length === 1) {
        localStorage.setItem("titularEncontrado", JSON.stringify(resultados[0]));
        router.push("/Usuario/datos-titular");
      } else {
        localStorage.setItem("resultadosBusqueda", JSON.stringify(resultados));
        //console.log(localStorage.getItem("resultadosBusqueda"))
        router.push("/Usuario/resultados-busqueda");
      }
    } catch (error) {
      console.error("Fallo al buscar titulares:", error);
      alert(
          error instanceof Error
              ? error.message
              : "Hubo un error al intentar buscar titulares"
      );

      // Redirigir a login si el error es de autenticación
      if (error instanceof Error && error.message.includes("sesión ha expirado")) {
        router.push("/Login");
      }
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => router.push("/Usuario")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle>Buscar Titular</CardTitle>
                <CardDescription>Selecciona un criterio de búsqueda</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleBuscar} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="criterio">Criterio de Búsqueda</Label>
                <Select value={criterio} onValueChange={setCriterio}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar criterio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dni">DNI</SelectItem>
                    <SelectItem value="nombre">Nombre</SelectItem>
                    <SelectItem value="apellido">Apellido</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="valorBusqueda">
                  {criterio === "dni" && "Número de DNI"}
                  {criterio === "nombre" && "Nombre"}
                  {criterio === "apellido" && "Apellido"}
                  {!criterio && "Valor de búsqueda"}
                </Label>
                <Input
                  id="valorBusqueda"
                  value={valorBusqueda}
                  onChange={(e) => setValorBusqueda(e.target.value)}
                  placeholder={
                    criterio === "dni"
                      ? "Ej: 12345678"
                      : criterio === "nombre"
                        ? "Ej: Juan"
                        : criterio === "apellido"
                          ? "Ej: Pérez"
                          : "Ingrese el valor a buscar"
                  }
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => router.push("/Usuario")} className="flex-1">
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1">
                  <Search className="mr-2 h-4 w-4" />
                  Buscar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
