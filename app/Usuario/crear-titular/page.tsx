"use client"

import type React from "react"

import { useState } from "react"
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

export default function CrearTitularPage() {
  const router = useRouter()
  const [titular, setTitular] = useState<Titular>({
    tipoDocumento: "",
    documento: "",
    nombre: "",
    apellido: "",
    fechaNacimiento: undefined,
    direccion: "",
    grupoSanguineo: "",
    factorRH: "",
    donanteOrganos: false,
    licencias: [],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()


    try {

      console.log(localStorage)

      const response = await fetch("http://localhost:8081/titular/crear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          nombre: titular.nombre,
          apellido: titular.apellido,
          documento: titular.documento,
          tipoDocumento: titular.tipoDocumento,
          fechaNacimiento: titular.fechaNacimiento?.toISOString().split("T")[0], // formato yyyy-mm-dd
          direccion: titular.direccion,
          grupoSanguineo: titular.grupoSanguineo,
          factorRH: titular.factorRH,
          donante: titular.donanteOrganos,
        }),
      })


      if (!response.ok) {
        const errorText = await response.text()
        alert("Error al crear titular: " + errorText)
        return
      }

      alert("Titular creado exitosamente")
      router.push("/Usuario")
    } catch (error) {
      console.error("Error en la solicitud:", error)
      alert("Error al conectar con el servidor")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => router.push("/Usuario")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle>Crear Nuevo Titular</CardTitle>
                <CardDescription>Completa todos los campos requeridos</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                    value={titular.documento}
                    onChange={(e) => setTitular({ ...titular, documento: e.target.value })}
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
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={titular.fechaNacimiento}
                        onSelect={(date) => setTitular({ ...titular, fechaNacimiento: date })}
                        initialFocus
                        defaultMonth={titular.fechaNacimiento || new Date(1990, 0)}
                        fromYear={1920}
                        toYear={new Date().getFullYear()}
                        captionLayout="dropdown-buttons"
                        classNames={{
                          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                          month: "space-y-4",
                          caption: "flex justify-center pt-1 relative items-center",
                          caption_label: "hidden", // Ocultar el texto del mes/año
                          caption_dropdowns: "flex justify-center gap-2",
                          vhidden: "hidden",
                          dropdown: "relative",
                          dropdown_month:
                              "flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                          dropdown_year:
                              "flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                          nav: "space-x-1 flex items-center",
                          nav_button: "hidden", // Ocultar botones de navegación
                          nav_button_previous: "hidden",
                          nav_button_next: "hidden",
                          table: "w-full border-collapse space-y-1",
                          head_row: "flex",
                          head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                          row: "flex w-full mt-2",
                          cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                          day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                          day_selected:
                              "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                          day_today: "bg-accent text-accent-foreground",
                          day_outside: "text-muted-foreground opacity-50",
                          day_disabled: "text-muted-foreground opacity-50",
                          day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                          day_hidden: "invisible",
                        }}
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
                <Button type="button" variant="outline" onClick={() => router.push("/Usuario")} className="flex-1">
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
