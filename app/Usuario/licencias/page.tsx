"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Search } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"

interface Licencia {
    id: string
    numeroLicencia: string
    clase: string
    fechaEmision: string
    fechaVencimiento: string
    vigente: boolean
    titular: {
        nombre: string
        apellido: string
        grupoSanguineo: string
        factorRH: string
        donanteOrganos: boolean
    }
}

interface LicenciaConsultaDTO {
    fechaEmisionDesde?: string
    fechaEmisionHasta?: string
    fechaVencimientoDesde?: string
    fechaVencimientoHasta?: string
    vigente?: boolean
    clase?: string
    nombre?: string
    apellido?: string
    numeroLicencia?: string
    grupoSanguineo?: string
    factorRH?: string
    donante?: boolean
}

export default function ListadoLicenciasPage() {
    const router = useRouter()
    const [licencias, setLicencias] = useState<Licencia[]>([])
    const [filtros, setFiltros] = useState<LicenciaConsultaDTO>({
        nombre: "",
        apellido: "",
        numeroLicencia: "",
        clase: "",
        vigente: true,
        grupoSanguineo: "",
        factorRH: "",
        donante: undefined
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const buscarLicencias = async () => {
        const token = localStorage.getItem('accessToken');

        if (!token) {
            throw new Error("No estás autenticado. Por favor inicia sesión nuevamente.");
        }

        try {
            setLoading(true)
            setError("")

            // Construir los parámetros de la URL
            const params = new URLSearchParams();

            // Agregar solo los parámetros que tienen valor
            if (filtros.nombre) params.append('nombre', filtros.nombre);
            if (filtros.apellido) params.append('apellido', filtros.apellido);
            if (filtros.numeroLicencia) params.append('numeroLicencia', filtros.numeroLicencia);
            if (filtros.clase) params.append('clase', filtros.clase);
            if (filtros.vigente !== undefined) params.append('vigente', filtros.vigente.toString());
            if (filtros.grupoSanguineo) params.append('grupoSanguineo', filtros.grupoSanguineo);
            if (filtros.factorRH) params.append('factorRH', filtros.factorRH);
            if (filtros.donante !== undefined) params.append('donante', filtros.donante.toString());
            if (filtros.fechaEmisionDesde) params.append('fechaEmisionDesde', filtros.fechaEmisionDesde);
            if (filtros.fechaEmisionHasta) params.append('fechaEmisionHasta', filtros.fechaEmisionHasta);
            if (filtros.fechaVencimientoDesde) params.append('fechaVencimientoDesde', filtros.fechaVencimientoDesde);
            if (filtros.fechaVencimientoHasta) params.append('fechaVencimientoHasta', filtros.fechaVencimientoHasta);

            const url = `http://localhost:8081/licencia/vigentes?${params.toString()}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                },
                credentials: 'include'
            })

            if (!response.ok) {
                throw new Error('Error al obtener las licencias')
            }

            const data = await response.json()
            setLicencias(data)
        } catch (err) {
            console.error("Error al buscar licencias:", err)
            setError(err instanceof Error ? err.message : "Error desconocido")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        buscarLicencias()
    }, [])

    const handleFiltroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setFiltros(prev => ({ ...prev, [id]: value }))
    }

    const handleClaseChange = (value: string) => {
        setFiltros(prev => ({ ...prev, clase: value === "todas" ? undefined : value }))
    }

    const handleVigenciaChange = (value: string) => {
        setFiltros(prev => ({ ...prev, vigente: value === "vigentes" }))
    }

    const handleDonanteChange = (value: string) => {
        setFiltros(prev => ({
            ...prev,
            donante: value === "todas" ? undefined : value === "si"
        }))
    }

    const handleLimpiarFiltros = () => {
        setFiltros({
            nombre: "",
            apellido: "",
            numeroLicencia: "",
            clase: "",
            vigente: true,
            grupoSanguineo: "",
            factorRH: "",
            donante: undefined,
            fechaEmisionDesde: undefined,
            fechaEmisionHasta: undefined,
            fechaVencimientoDesde: undefined,
            fechaVencimientoHasta: undefined
        })
    }

    const handleEditar = (id: string) => {
        router.push(`/licencia/modificar/${id}`)
    }

    return (
        <div className="p-4">
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <CardTitle>Listado de Licencias</CardTitle>
                            <p className="text-sm text-gray-500 mt-1">
                                {licencias.length} {licencias.length === 1 ? "licencia" : "licencias"} encontradas
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={handleLimpiarFiltros}
                                disabled={loading}
                            >
                                Limpiar
                            </Button>
                            <Button
                                onClick={buscarLicencias}
                                disabled={loading}
                            >
                                {loading ? "Buscando..." : "Buscar"}
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Filtros Básicos */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="nombre">Nombre</Label>
                            <Input
                                id="nombre"
                                value={filtros.nombre || ""}
                                onChange={handleFiltroChange}
                                placeholder="Ej: Juan"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="apellido">Apellido</Label>
                            <Input
                                id="apellido"
                                value={filtros.apellido || ""}
                                onChange={handleFiltroChange}
                                placeholder="Ej: Pérez"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="numeroLicencia">N° Licencia</Label>
                            <Input
                                id="numeroLicencia"
                                value={filtros.numeroLicencia || ""}
                                onChange={handleFiltroChange}
                                placeholder="Ej: 123456"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Clase</Label>
                            <Select
                                value={filtros.clase || "todas"}
                                onValueChange={handleClaseChange}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Todas las clases" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todas">Todas</SelectItem>
                                    <SelectItem value="A">Clase A</SelectItem>
                                    <SelectItem value="B">Clase B</SelectItem>
                                    <SelectItem value="C">Clase C</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Filtros Avanzados */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label>Estado</Label>
                            <Select
                                value={filtros.vigente ? "vigentes" : "todas"}
                                onValueChange={handleVigenciaChange}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="vigentes">Vigentes</SelectItem>
                                    <SelectItem value="todas">Todas</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="grupoSanguineo">Grupo Sanguíneo</Label>
                            <Input
                                id="grupoSanguineo"
                                value={filtros.grupoSanguineo || ""}
                                onChange={handleFiltroChange}
                                placeholder="Ej: A, B, O"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="factorRH">Factor RH</Label>
                            <Input
                                id="factorRH"
                                value={filtros.factorRH || ""}
                                onChange={handleFiltroChange}
                                placeholder="Ej: +, -"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Donante</Label>
                            <Select
                                value={filtros.donante === undefined ? "todas" : filtros.donante ? "si" : "no"}
                                onValueChange={handleDonanteChange}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todas">Todos</SelectItem>
                                    <SelectItem value="si">Sí</SelectItem>
                                    <SelectItem value="no">No</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Filtros por Fechas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Fecha Emisión Desde</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className="w-full justify-start text-left font-normal"
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {filtros.fechaEmisionDesde ? format(new Date(filtros.fechaEmisionDesde), "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={filtros.fechaEmisionDesde ? new Date(filtros.fechaEmisionDesde) : undefined}
                                        onSelect={(date) => setFiltros(prev => ({ ...prev, fechaEmisionDesde: date?.toISOString().split('T')[0] }))}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-2">
                            <Label>Fecha Emisión Hasta</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className="w-full justify-start text-left font-normal"
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {filtros.fechaEmisionHasta ? format(new Date(filtros.fechaEmisionHasta), "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={filtros.fechaEmisionHasta ? new Date(filtros.fechaEmisionHasta) : undefined}
                                        onSelect={(date) => setFiltros(prev => ({ ...prev, fechaEmisionHasta: date?.toISOString().split('T')[0] }))}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-2">
                            <Label>Fecha Vencimiento Desde</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className="w-full justify-start text-left font-normal"
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {filtros.fechaVencimientoDesde ? format(new Date(filtros.fechaVencimientoDesde), "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={filtros.fechaVencimientoDesde ? new Date(filtros.fechaVencimientoDesde) : undefined}
                                        onSelect={(date) => setFiltros(prev => ({ ...prev, fechaVencimientoDesde: date?.toISOString().split('T')[0] }))}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-2">
                            <Label>Fecha Vencimiento Hasta</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className="w-full justify-start text-left font-normal"
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {filtros.fechaVencimientoHasta ? format(new Date(filtros.fechaVencimientoHasta), "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={filtros.fechaVencimientoHasta ? new Date(filtros.fechaVencimientoHasta) : undefined}
                                        onSelect={(date) => setFiltros(prev => ({ ...prev, fechaVencimientoHasta: date?.toISOString().split('T')[0] }))}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    {/* Mensaje de error */}
                    {error && (
                        <div className="p-4 bg-red-100 text-red-700 rounded-md">
                            {error}
                        </div>
                    )}

                    {/* Tabla de licencias */}
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <p>Cargando licencias...</p>
                        </div>
                    ) : licencias.length === 0 ? (
                        <div className="flex justify-center py-8">
                            <p>No se encontraron licencias</p>
                        </div>
                    ) : (
                        <div className="border rounded-lg overflow-hidden">
                            <Table>
                                <TableHeader className="bg-gray-100">
                                    <TableRow>
                                        <TableHead>Titular</TableHead>
                                        <TableHead>N° Licencia</TableHead>
                                        <TableHead>Clase</TableHead>
                                        <TableHead>Emisión</TableHead>
                                        <TableHead>Vencimiento</TableHead>
                                        <TableHead>Grupo Sanguíneo</TableHead>
                                        <TableHead>Donante</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {licencias.map((licencia) => (
                                        <TableRow key={licencia.id}>
                                            <TableCell className="font-medium">
                                                {licencia.titular.nombre} {licencia.titular.apellido}
                                            </TableCell>
                                            <TableCell>{licencia.numeroLicencia}</TableCell>
                                            <TableCell>{licencia.clase}</TableCell>
                                            <TableCell>
                                                {format(new Date(licencia.fechaEmision), "dd/MM/yyyy", { locale: es })}
                                            </TableCell>
                                            <TableCell>
                                                {format(new Date(licencia.fechaVencimiento), "dd/MM/yyyy", { locale: es })}
                                            </TableCell>
                                            <TableCell>
                                                {licencia.titular.grupoSanguineo}{licencia.titular.factorRH}
                                            </TableCell>
                                            <TableCell>
                                                {licencia.titular.donanteOrganos ? "Sí" : "No"}
                                            </TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs ${
                                                    licencia.vigente ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                                }`}>
                                                    {licencia.vigente ? "Vigente" : "Vencida"}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleEditar(licencia.id)}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}