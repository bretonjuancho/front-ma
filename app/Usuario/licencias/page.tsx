"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { LicenciaConTitular } from "@/lib/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ListadoLicencias() {
    const [licencias, setLicencias] = useState<LicenciaConTitular[]>([])
    const [filtro, setFiltro] = useState({
        nombre: "",
        apellido: "",
        numeroLicencia: "",
        clase: "",
        vigencia: "todas",
        grupo: "",
        rh: "",
        donante: "",
        fechaEmisionDesde: undefined as Date | undefined,
        fechaEmisionHasta: undefined as Date | undefined,
        fechaVencimientoDesde: undefined as Date | undefined,
        fechaVencimientoHasta: undefined as Date | undefined,
    })

    useEffect(() => {
        const dummyLicencias: LicenciaConTitular[] = [
            {
                id: "LIC001",
                tipo: "B",
                observaciones: "Automóvil particular",
                fechaEmision: new Date("2023-01-14"),
                fechaVencimiento: new Date("2027-01-14"),
                titular: {
                    nombre: "Juan",
                    apellido: "Pérez",
                    documento: "12345678",
                    tipoDocumento: "DNI",
                    fechaNacimiento: new Date("1990-05-15"),
                    direccion: "Av. Corrientes 1234",
                    grupoSanguineo: "A",
                    factorRH: "+",
                    donanteOrganos: true,
                    licencias: []
                }
            },
            {
                id: "LIC002",
                tipo: "A",
                observaciones: "Motocicleta",
                fechaEmision: new Date("2022-06-09"),
                fechaVencimiento: new Date("2024-06-09"),
                titular: {
                    nombre: "María",
                    apellido: "Gómez",
                    documento: "23456789",
                    tipoDocumento: "DNI",
                    fechaNacimiento: new Date("1995-08-22"),
                    direccion: "Calle Falsa 123",
                    grupoSanguineo: "O",
                    factorRH: "-",
                    donanteOrganos: false,
                    licencias: []
                }
            },
            {
                id: "LIC003",
                tipo: "C",
                observaciones: "Camión pesado",
                fechaEmision: new Date("2024-01-31"),
                fechaVencimiento: new Date("2026-01-31"),
                titular: {
                    nombre: "Lucía",
                    apellido: "Martínez",
                    documento: "34567890",
                    tipoDocumento: "DNI",
                    fechaNacimiento: new Date("1988-02-14"),
                    direccion: "Av. San Martín 456",
                    grupoSanguineo: "B",
                    factorRH: "+",
                    donanteOrganos: true,
                    licencias: []
                }
            },
        ]
        setLicencias(dummyLicencias)
    }, [])

    const filtrar = () => {
        const hoy = new Date()
        return licencias.filter((l) => {
            const nombre = l.titular.nombre.toLowerCase()
            const apellido = l.titular.apellido.toLowerCase()
            const filtroNombre = filtro.nombre.trim().toLowerCase()
            const filtroApellido = filtro.apellido.trim().toLowerCase()

            const cumpleNombre = filtroNombre ? nombre.includes(filtroNombre) : true
            const cumpleApellido = filtroApellido ? apellido.includes(filtroApellido) : true
            const cumpleNumero = l.id.includes(filtro.numeroLicencia)
            const cumpleClase = filtro.clase ? l.tipo === filtro.clase : true
            const cumpleGrupo = filtro.grupo ? l.titular.grupoSanguineo === filtro.grupo : true
            const cumpleRH = filtro.rh ? l.titular.factorRH === filtro.rh : true
            const cumpleDonante = filtro.donante ? (filtro.donante === "si" ? l.titular.donanteOrganos : !l.titular.donanteOrganos) : true

            const cumpleFechaEmision = (!filtro.fechaEmisionDesde || l.fechaEmision >= filtro.fechaEmisionDesde)
                && (!filtro.fechaEmisionHasta || l.fechaEmision <= filtro.fechaEmisionHasta)

            const cumpleFechaVencimiento = (!filtro.fechaVencimientoDesde || l.fechaVencimiento >= filtro.fechaVencimientoDesde)
                && (!filtro.fechaVencimientoHasta || l.fechaVencimiento <= filtro.fechaVencimientoHasta)

            const esVigente = l.fechaVencimiento >= hoy
            const cumpleVigencia =
                filtro.vigencia === "todas" ||
                (filtro.vigencia === "vigentes" && esVigente) ||
                (filtro.vigencia === "no-vigentes" && !esVigente)

            return cumpleNombre && cumpleApellido && cumpleNumero && cumpleClase && cumpleGrupo && cumpleRH &&
                cumpleDonante && cumpleFechaEmision && cumpleFechaVencimiento && cumpleVigencia
        })
    }

    return (
        <div className="p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Listado de Licencias</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Primer renglón de filtros */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <Label>Estado de Vigencia</Label>
                            <Select
                                value={filtro.vigencia}
                                onValueChange={(value) => setFiltro({...filtro, vigencia: value})}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todas">Todas las licencias</SelectItem>
                                    <SelectItem value="vigentes">Solo vigentes</SelectItem>
                                    <SelectItem value="no-vigentes">No vigentes</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Clase de Licencia</Label>
                            <Select
                                value={filtro.clase}
                                onValueChange={(value) => setFiltro({...filtro, clase: value})}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Todas las clases" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas las clases</SelectItem>
                                    <SelectItem value="A">Clase A (Motocicletas)</SelectItem>
                                    <SelectItem value="B">Clase B (Automóviles)</SelectItem>
                                    <SelectItem value="C">Clase C (Camiones)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Nombre</Label>
                            <Input
                                value={filtro.nombre}
                                onChange={(e) => setFiltro({ ...filtro, nombre: e.target.value })}
                            />
                        </div>

                        <div>
                            <Label>Apellido</Label>
                            <Input
                                value={filtro.apellido}
                                onChange={(e) => setFiltro({ ...filtro, apellido: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Segundo renglón de filtros */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <Label>Número de Licencia</Label>
                            <Input
                                value={filtro.numeroLicencia}
                                onChange={(e) => setFiltro({ ...filtro, numeroLicencia: e.target.value })}
                            />
                        </div>

                        <div>
                            <Label>Grupo Sanguíneo</Label>
                            <Input
                                value={filtro.grupo}
                                onChange={(e) => setFiltro({ ...filtro, grupo: e.target.value })}
                            />
                        </div>

                        <div>
                            <Label>Factor RH</Label>
                            <Input
                                value={filtro.rh}
                                onChange={(e) => setFiltro({ ...filtro, rh: e.target.value })}
                            />
                        </div>

                        <div>
                            <Label>Donante de Órganos</Label>
                            <Input
                                value={filtro.donante}
                                onChange={(e) => setFiltro({ ...filtro, donante: e.target.value })}
                                placeholder="si / no"
                            />
                        </div>
                    </div>

                    {/* Tercer renglón - Fechas de Emisión */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Fecha de Emisión Desde</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {filtro.fechaEmisionDesde ? format(filtro.fechaEmisionDesde, "PPP", { locale: es }) : <span>Seleccionar</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={filtro.fechaEmisionDesde}
                                        onSelect={(date) => setFiltro({...filtro, fechaEmisionDesde: date})}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-2">
                            <Label>Fecha de Emisión Hasta</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {filtro.fechaEmisionHasta ? format(filtro.fechaEmisionHasta, "PPP", { locale: es }) : <span>Seleccionar</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={filtro.fechaEmisionHasta}
                                        onSelect={(date) => setFiltro({...filtro, fechaEmisionHasta: date})}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    {/* Cuarto renglón - Fechas de Vencimiento */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Fecha de Vencimiento Desde</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {filtro.fechaVencimientoDesde ? format(filtro.fechaVencimientoDesde, "PPP", { locale: es }) : <span>Seleccionar</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={filtro.fechaVencimientoDesde}
                                        onSelect={(date) => setFiltro({...filtro, fechaVencimientoDesde: date})}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-2">
                            <Label>Fecha de Vencimiento Hasta</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {filtro.fechaVencimientoHasta ? format(filtro.fechaVencimientoHasta, "PPP", { locale: es }) : <span>Seleccionar</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={filtro.fechaVencimientoHasta}
                                        onSelect={(date) => setFiltro({...filtro, fechaVencimientoHasta: date})}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    {/* Tabla de resultados */}
                    <div className="pt-6 overflow-auto">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead className="bg-gray-200">
                            <tr>
                                <th className="p-2 border">Nombre</th>
                                <th className="p-2 border">Apellido</th>
                                <th className="p-2 border">N° Licencia</th>
                                <th className="p-2 border">Clase</th>
                                <th className="p-2 border">Observaciones</th>
                                <th className="p-2 border">Emisión</th>
                                <th className="p-2 border">Vencimiento</th>
                                <th className="p-2 border">Estado</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filtrar().map((lic) => {
                                const hoy = new Date()
                                const esVigente = lic.fechaVencimiento >= hoy
                                return (
                                    <tr key={lic.id} className="border-b hover:bg-gray-50">
                                        <td className="p-2 border">{lic.titular.nombre}</td>
                                        <td className="p-2 border">{lic.titular.apellido}</td>
                                        <td className="p-2 border">{lic.id}</td>
                                        <td className="p-2 border">{lic.tipo}</td>
                                        <td className="p-2 border">{lic.observaciones}</td>
                                        <td className="p-2 border">{format(lic.fechaEmision, "PPP", { locale: es })}</td>
                                        <td className="p-2 border">{format(lic.fechaVencimiento, "PPP", { locale: es })}</td>
                                        <td className="p-2 border">
                                                <span className={`px-2 py-1 rounded-full text-xs ${
                                                    esVigente ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                                }`}>
                                                    {esVigente ? "Vigente" : "No vigente"}
                                                </span>
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}