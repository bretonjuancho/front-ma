"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Trash2, Search } from "lucide-react"

type UsuarioAdministrativo = {
    id: string
    nombre: string
    apellido: string
    dni: string
    email: string
    rol: "administrador" | "administrativo"
}

export default function ListadoUsuariosAdminPage() {
    const router = useRouter()
    const [usuarios, setUsuarios] = useState<UsuarioAdministrativo[]>([])
    const [filtroNombre, setFiltroNombre] = useState("")
    const [loading, setLoading] = useState(true)

    // Cargar datos de usuarios (simulación)
    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                // Simular retardo de red
                await new Promise(resolve => setTimeout(resolve, 800))

                // Datos de ejemplo
                const dummyUsuarios: UsuarioAdministrativo[] = [
                    {
                        id: "1",
                        nombre: "Ana",
                        apellido: "García",
                        dni: "12345678",
                        email: "ana.garcia@example.com",
                        rol: "administrador"
                    },
                    {
                        id: "2",
                        nombre: "Carlos",
                        apellido: "López",
                        dni: "23456789",
                        email: "carlos.lopez@example.com",
                        rol: "administrativo"
                    },
                    {
                        id: "3",
                        nombre: "María",
                        apellido: "Fernández",
                        dni: "34567890",
                        email: "maria.fernandez@example.com",
                        rol: "administrativo"
                    },
                    {
                        id: "4",
                        nombre: "Juan",
                        apellido: "Pérez",
                        dni: "45678901",
                        email: "juan.perez@example.com",
                        rol: "administrativo"
                    }
                ]

                setUsuarios(dummyUsuarios)
            } catch (error) {
                console.error("Error al cargar usuarios:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchUsuarios()
    }, [])

    // Filtrar usuarios por nombre/apellido
    const usuariosFiltrados = usuarios.filter(usuario => {
        const nombreCompleto = `${usuario.nombre} ${usuario.apellido}`.toLowerCase()
        return nombreCompleto.includes(filtroNombre.toLowerCase())
    })

    const handleEditar = (id: string) => {
        router.push(`/Admin/usuarios/editar/${id}`)
    }

    const handleEliminar = async (id: string) => {
        if (confirm("¿Está seguro que desea eliminar este usuario?")) {
            try {
                // Simular eliminación
                setUsuarios(prev => prev.filter(u => u.id !== id))
            } catch (error) {
                console.error("Error al eliminar usuario:", error)
            }
        }
    }

    const handleNuevoUsuario = () => {
        router.push("/Admin/usuarios/nuevo")
    }

    return (
        <div className="p-4">
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <CardTitle>Usuarios Administrativos</CardTitle>
                            <p className="text-sm text-gray-500 mt-1">
                                {usuariosFiltrados.length} {usuariosFiltrados.length === 1 ? "usuario" : "usuarios"} encontrados
                            </p>
                        </div>
                        <Button onClick={() => router.push("/Admin/crear-usuario")}>
                            Nuevo Usuario
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Filtro */}
                    <div className="relative max-w-xs">
                        <Label htmlFor="buscar">Buscar por nombre</Label>
                        <div className="relative">
                            <Input
                                id="buscar"
                                value={filtroNombre}
                                onChange={(e) => setFiltroNombre(e.target.value)}
                                placeholder="Ej: Ana García"
                            />
                            <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                        </div>
                    </div>

                    {/* Tabla de usuarios */}
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <p>Cargando usuarios...</p>
                        </div>
                    ) : usuariosFiltrados.length === 0 ? (
                        <div className="flex justify-center py-8">
                            <p>No se encontraron usuarios</p>
                        </div>
                    ) : (
                        <div className="border rounded-lg overflow-hidden">
                            <Table>
                                <TableHeader className="bg-gray-100">
                                    <TableRow>
                                        <TableHead>Nombre</TableHead>
                                        <TableHead>DNI</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Rol</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {usuariosFiltrados.map((usuario) => (
                                        <TableRow key={usuario.id}>
                                            <TableCell className="font-medium">
                                                {usuario.nombre} {usuario.apellido}
                                            </TableCell>
                                            <TableCell>{usuario.dni}</TableCell>
                                            <TableCell>{usuario.email}</TableCell>
                                            <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                            usuario.rol === "administrador"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                        }`}>
                          {usuario.rol === "administrador" ? "Administrador" : "Administrativo"}
                        </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleEditar(usuario.id)}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleEliminar(usuario.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
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