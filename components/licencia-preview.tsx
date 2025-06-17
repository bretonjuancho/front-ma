"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Titular, Licencia } from "@/lib/types"
import html2canvas from "html2canvas";
import { jsPDF } from 'jspdf';

interface LicenciaPreviewProps {
  titular: Titular
  licencia: Licencia
}

export function LicenciaPreview({ titular, licencia }: LicenciaPreviewProps) {
  const [open, setOpen] = useState(false)
  const licenciaRef = useRef<HTMLDivElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handlePrint = () => {
    setOpen(true)
  }

  const generatePDF = async () => {
    if (!licenciaRef.current) return

    setIsGenerating(true)
    try {

      const canvas = await html2canvas(licenciaRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
      })

      const imgData = canvas.toDataURL("image/png")

      // Crear PDF con orientación horizontal
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [86, 54], // Tamaño estándar de tarjeta ID
      })

      // Añadir la imagen al PDF
      pdf.addImage(imgData, "PNG", 0, 0, 86, 54)

      // Descargar el PDF
      pdf.save(`licencia_${titular.apellido}_${titular.nombre}.pdf`)
    } catch (error) {
      console.error("Error al generar PDF:", error)
    }
    setIsGenerating(false)
  }

  // Generar un número de licencia aleatorio
  const numeroLicencia = `${Math.floor(Math.random() * 1000000)}`.padStart(6, "0")

  // Calcular fecha de vencimiento (5 años desde hoy)
  const fechaOtorgamiento = new Date()
  const fechaVencimiento = new Date()
  fechaVencimiento.setFullYear(fechaVencimiento.getFullYear() + 5)

  return (
    <>
      <Button onClick={handlePrint} className="w-full" variant="outline">
        Imprimir
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Vista previa de la Licencia</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center space-y-4">
            <div
              ref={licenciaRef}
              className="relative w-[500px] h-[310px] rounded-xl overflow-hidden shadow-lg"
              style={{
                backgroundImage: "url('/images/background-licencia.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Contenido de la licencia */}
              <div className="absolute top-0 left-0 w-full h-full p-4">
                {/* Encabezado */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-10 h-6 bg-blue-500 mr-2 flex items-center justify-center">
                      <div className="w-8 h-4 bg-white flex items-center justify-center">
                        <div className="w-6 h-2 bg-blue-500"></div>
                      </div>
                    </div>
                    <h1 className="text-blue-700 font-bold text-xl">Licencia Nacional de Conducir</h1>
                  </div>
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-xs text-gray-500">Escudo</span>
                  </div>
                </div>

                <div className="text-blue-700 font-semibold text-lg mt-1 text-center">Chaco - Fontana</div>

                {/* Contenido principal */}
                <div className="flex mt-4">
                  {/* Columna izquierda - Foto */}
                  <div className="w-1/3 pr-4">
                    <div className="w-full h-40 bg-gray-200 border border-gray-300 flex items-center justify-center">
                      <span className="text-gray-500">Foto</span>
                    </div>
                  </div>

                  {/* Columna derecha - Datos */}
                  <div className="w-2/3 text-sm">
                    <div className="mb-2 flex">
                      <div className="w-1/2">
                        <p className="font-bold">
                          5. Nº Licencia / <span className="italic font-normal">License Nº</span>
                        </p>
                        <p>{numeroLicencia}</p>
                      </div>
                      <div className="w-1/2">
                        <p className="font-bold">
                          9. Clase / <span className="italic font-normal">Class</span>
                        </p>
                        <p>{licencia.tipo}</p>
                      </div>
                    </div>

                    <div className="mb-2">
                      <p className="font-bold">
                        1. Apellido / <span className="italic font-normal">Last name</span>
                      </p>
                      <p>{titular.apellido}</p>
                    </div>

                    <div className="mb-2">
                      <p className="font-bold">
                        2. Nombre / <span className="italic font-normal">First name</span>
                      </p>
                      <p>{titular.nombre}</p>
                    </div>

                    <div className="mb-2">
                      <p className="font-bold">
                        8. Domicilio / <span className="italic font-normal">Address</span>
                      </p>
                      <p>{titular.direccion}</p>
                    </div>

                    <div className="mb-2">
                      <p className="font-bold">
                        3. Fecha de Nac. / <span className="italic font-normal">Date of birth</span>
                      </p>
                      <p>
                        {titular.fechaNacimiento
                          ? format(titular.fechaNacimiento, "dd/MM/yyyy", { locale: es })
                          : "No especificada"}
                      </p>
                    </div>

                    <div className="flex">
                      <div className="w-1/2">
                        <p className="font-bold">
                          4a. Otorgamiento / <span className="italic font-normal">Date of issue</span>
                        </p>
                        <p>{format(fechaOtorgamiento, "dd/MM/yyyy", { locale: es })}</p>
                      </div>
                      <div className="w-1/2">
                        <p className="font-bold">
                          4b. Vencimiento / <span className="italic font-normal">Expires</span>
                        </p>
                        <p>{format(fechaVencimiento, "dd/MM/yyyy", { locale: es })}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pie de la licencia */}
                <div className="absolute bottom-0 left-0 w-full">
                  <div className="bg-blue-600 text-white p-2 flex justify-between items-center">
                    <div className="font-bold">SEGURIDAD VIAL</div>
                    <div className="text-xs text-right">
                      <div>Ministerio de Transporte</div>
                      <div>República Argentina</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 w-full">
              <Button onClick={generatePDF} className="w-full" disabled={isGenerating}>
                {isGenerating ? "Generando..." : "Descargar como PDF"}
              </Button>
              <Button onClick={() => setOpen(false)} variant="outline" className="w-full">
                Cerrar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
