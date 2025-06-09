"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, ArrowLeft, User, Search } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface Titular {
  tipoDocumento: string
  numeroDocumento: string
  nombre: string
  apellido: string
  fechaNacimiento: Date | undefined
  direccion: string
  grupoSanguineo: string
  factorRH: string
  donanteOrganos: boolean
}

export default function TitularManager() {
  const [currentView, setCurrentView] = useState<"main" | "crear" | "buscar" | "resultado">("main")
  const [searchQuery, setSearchQuery] = useState("")
  const [titular, setTitular] = useState<Titular>({
    tipoDocumento: "",
    numeroDocumento: "",
    nombre: "",
    apellido: "",
    fechaNacimiento: undefined,
    direccion: "",
    grupoSanguineo: "",
    factorRH: "",
    donanteOrganos: false,
  })

  // Datos de ejemplo para la búsqueda
  const titularesEjemplo: Titular[] = [
    {
      tipoDocumento: "DNI",
      numeroDocumento: "12345678",
      nombre: "Juan",
      apellido: "Pérez",
      fechaNacimiento: new Date("1990-05-15"),
      direccion: "Av. Corrientes 1234, Buenos Aires",
      grupoSanguineo: "A",
      factorRH: "+",
      donanteOrganos: true,
    },
  ]

  const handleSubmitCrear = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Titular creado exitosamente")
    setCurrentView("main")
    // Aquí podrías guardar los datos en una base de datos
  }

  const handleBuscar = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch(
        `http://localhost:3000/api/titular/buscar?nombre=${encodeURIComponent(searchQuery)}`
      )

      if (!response.ok) {
        throw new Error("Error al buscar el titular")
      }

      const data = await response.json()

      if (!data || data.length === 0) {
        alert("No se encontró ningún titular con ese nombre")
      } else {
        setTitular(data[0]) // ← suponemos que es el primero de la lista
        setCurrentView("resultado")
      }
    } catch (error) {
      console.error(error)
      alert("Hubo un problema al conectar con el servidor")
    }
  }


  const resetForm = () => {
    setTitular({
      tipoDocumento: "",
      numeroDocumento: "",
      nombre: "",
      apellido: "",
      fechaNacimiento: undefined,
      direccion: "",
      grupoSanguineo: "",
      factorRH: "",
      donanteOrganos: false,
    })
  }

  const handleBackToMain = () => {
    setCurrentView("main")
    setSearchQuery("")
    resetForm()
  }

  // Vista principal
  if (currentView === "main") {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Gestión de Titulares</CardTitle>
              <CardDescription>Selecciona una opción para continuar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={() => setCurrentView("crear")} className="w-full h-16 text-lg" variant="default">
                <User className="mr-2 h-5 w-5" />
                Crear un Titular
              </Button>
              <Button onClick={() => setCurrentView("buscar")} className="w-full h-16 text-lg" variant="outline">
                <Search className="mr-2 h-5 w-5" />
                Buscar un Titular
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Vista crear titular
  if (currentView === "crear") {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={handleBackToMain}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <CardTitle>Crear Nuevo Titular</CardTitle>
                  <CardDescription>Completa todos los campos requeridos</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitCrear} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tipoDocumento">Tipo de Documento</Label>
                    <Select
                      value={titular.tipoDocumento}
                      onValueChange={(value) => setTitular({ ...titular, tipoDocumento: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DNI">DNI</SelectItem>
                        <SelectItem value="Pasaporte">Pasaporte</SelectItem>
                        <SelectItem value="Cedula">Cédula</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="numeroDocumento">Número de Documento</Label>
                    <Input
                      id="numeroDocumento"
                      value={titular.numeroDocumento}
                      onChange={(e) => setTitular({ ...titular, numeroDocumento: e.target.value })}
                      placeholder="Ingrese el número"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input
                      id="nombre"
                      value={titular.nombre}
                      onChange={(e) => setTitular({ ...titular, nombre: e.target.value })}
                      placeholder="Ingrese el nombre"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="apellido">Apellido</Label>
                    <Input
                      id="apellido"
                      value={titular.apellido}
                      onChange={(e) => setTitular({ ...titular, apellido: e.target.value })}
                      placeholder="Ingrese el apellido"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Fecha de Nacimiento</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {titular.fechaNacimiento ? (
                          format(titular.fechaNacimiento, "PPP", { locale: es })
                        ) : (
                          <span>Seleccionar fecha</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={titular.fechaNacimiento}
                        onSelect={(date) => setTitular({ ...titular, fechaNacimiento: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input
                    id="direccion"
                    value={titular.direccion}
                    onChange={(e) => setTitular({ ...titular, direccion: e.target.value })}
                    placeholder="Ingrese la dirección completa"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Grupo Sanguíneo</Label>
                    <Select
                      value={titular.grupoSanguineo}
                      onValueChange={(value) => setTitular({ ...titular, grupoSanguineo: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar grupo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                        <SelectItem value="AB">AB</SelectItem>
                        <SelectItem value="O">O</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Factor RH</Label>
                    <Select
                      value={titular.factorRH}
                      onValueChange={(value) => setTitular({ ...titular, factorRH: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar factor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="+">+</SelectItem>
                        <SelectItem value="-">-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="donanteOrganos"
                    checked={titular.donanteOrganos}
                    onCheckedChange={(checked) => setTitular({ ...titular, donanteOrganos: checked as boolean })}
                  />
                  <Label htmlFor="donanteOrganos">Donante de órganos</Label>
                </div>

                <div className="flex gap-4">
                  <Button type="button" variant="outline" onClick={handleBackToMain} className="flex-1">
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1">
                    Crear Titular
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Vista buscar titular
  if (currentView === "buscar") {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={handleBackToMain}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <CardTitle>Buscar Titular</CardTitle>
                  <CardDescription>Ingresa el nombre y apellido</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBuscar} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="busqueda">Nombre y Apellido</Label>
                  <Input
                    id="busqueda"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ej: Juan Pérez"
                    required
                  />
                </div>
                <div className="flex gap-4">
                  <Button type="button" variant="outline" onClick={handleBackToMain} className="flex-1">
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

  // Vista resultado de búsqueda
  if (currentView === "resultado") {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setCurrentView("buscar")}>
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
                  <p className="text-lg">{titular.numeroDocumento}</p>
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

              <Button onClick={handleBackToMain} className="w-full">
                Volver al Inicio
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return null
}
