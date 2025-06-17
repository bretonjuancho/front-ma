"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Titular, Licencia } from "@/lib/types"

interface ComprobantePreviewProps {
  titular: Titular
  licencia: Licencia
}

export function ComprobantePreview({ titular, licencia }: ComprobantePreviewProps) {
  const [open, setOpen] = useState(false)
  const comprobanteRef = useRef<HTMLDivElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handlePrint = () => {
    setOpen(true)
  }

  const generatePDF = async () => {
    setIsGenerating(true)
    try {
      // Verificar si las librerías están disponibles
      const html2canvas = await import("html2canvas").catch(() => null)
      const jsPDF = await import("jspdf").catch(() => null)

      if (!html2canvas || !jsPDF || !comprobanteRef.current) {
        alert("Las librerías para generar PDF no están instaladas. Por favor instala: npm install html2canvas jspdf")
        setIsGenerating(false)
        return
      }

      const canvas = await html2canvas.default(comprobanteRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: "#ffffff",
      })

      const imgData = canvas.toDataURL("image/png")

      // Crear PDF con orientación vertical para el comprobante
      const pdf = new jsPDF.jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      // Calcular dimensiones para centrar el comprobante
      const imgWidth = 80
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      const x = (210 - imgWidth) / 2 // Centrar en A4

      // Añadir la imagen al PDF
      pdf.addImage(imgData, "PNG", x, 20, imgWidth, imgHeight)

      // Descargar el PDF
      pdf.save(`comprobante_${titular.apellido}_${titular.nombre}.pdf`)
    } catch (error) {
      console.error("Error al generar PDF:", error)
      alert("Error al generar el PDF. Asegúrate de que las dependencias estén instaladas correctamente.")
    }
    setIsGenerating(false)
  }

  const handlePrintWindow = () => {
    if (comprobanteRef.current) {
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Comprobante de Pago</title>
              <style>
                body { 
                  margin: 0; 
                  padding: 20px; 
                  font-family: 'Courier New', monospace; 
                  background: white;
                }
                .comprobante { 
                  width: 300px; 
                  margin: 0 auto; 
                  background: white;
                }
                @media print {
                  body { padding: 0; }
                  .comprobante { margin: 0; }
                }
              </style>
            </head>
            <body>
              <div class="comprobante">
                ${comprobanteRef.current.innerHTML}
              </div>
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.print()
      }
    }
  }

  // Generar datos del comprobante
  const numeroComprobante = `${Math.floor(Math.random() * 90000000) + 10000000}`
  const numeroComercio = "08177834"
  const codigoAutorizacion = `${Math.floor(Math.random() * 900000) + 100000}`
  const numeroTarjeta = `....${Math.floor(Math.random() * 9000) + 1000}`
  const fechaActual = new Date()
  const numeroCuenta = `207${Math.floor(Math.random() * 100000000)}`

  // Calcular importe basado en el tipo de licencia
  const importes = {
    A: 2500,
    B: 3500,
    C: 4500,
    D: 5500,
    E: 6000,
    F: 4000,
    G: 3000,
  }
  const importe = importes[licencia.tipo as keyof typeof importes] || 3500

  return (
    <>
      <Button onClick={handlePrint} className="w-full" variant="outline">
        Imprimir
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Comprobante de Pago</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center space-y-4">
            <div
              ref={comprobanteRef}
              className="w-[300px] bg-white p-4 border border-gray-300 font-mono text-sm"
              style={{ fontFamily: "Courier New, monospace" }}
            >
              {/* Encabezado */}
              <div className="text-center mb-4">
                <div className="font-bold text-lg">Pago de cuenta</div>
                <div className="text-base">{numeroCuenta}</div>
              </div>

              {/* Línea divisoria */}
              <div className="border-t border-dashed border-gray-400 my-4"></div>

              {/* Fecha y Hora */}
              <div className="text-center mb-4">
                <div className="font-bold">Fecha y Hora</div>
                <div>{format(fechaActual, "dd/MM/yyyy HH:mm", { locale: es })}</div>
              </div>

              {/* Línea divisoria */}
              <div className="border-t border-dashed border-gray-400 my-4"></div>

              {/* Detalles del comprobante */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>N° de comprobante</span>
                  <span className="font-bold">{numeroComprobante}</span>
                </div>

                <div className="flex justify-between">
                  <span>N° de comercio</span>
                  <span>{numeroComercio}</span>
                </div>

                <div className="flex justify-between">
                  <span>Cod. de autorización</span>
                  <span>{codigoAutorizacion}</span>
                </div>

                <div className="flex justify-between">
                  <span>Concepto</span>
                  <span>Licencia Tipo {licencia.tipo}</span>
                </div>

                <div className="flex justify-between font-bold text-lg">
                  <span>Importe</span>
                  <span>${importe.toLocaleString("es-AR")}</span>
                </div>

                <div className="flex justify-between">
                  <span>Debitado de Tarjeta VISA</span>
                  <span>{numeroTarjeta}</span>
                </div>
              </div>

              {/* Línea divisoria */}
              <div className="border-t border-dashed border-gray-400 my-4"></div>

              {/* Información del titular */}
              <div className="text-xs text-center mb-4">
                <div>
                  Titular: {titular.nombre} {titular.apellido}
                </div>
                <div>DNI: {titular.documento}</div>
              </div>

              {/* Línea divisoria */}
              <div className="border-t border-dashed border-gray-400 my-4"></div>

              {/* Mensaje de validez */}
              <div className="text-center text-xs mb-4">
                <div className="font-bold">COMPROBANTE VÁLIDO DE PAGO. CONSÉRVALO.</div>
              </div>

              {/* Logo y ministerio */}
              <div className="flex items-center justify-center space-x-2 mt-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                  🛡️
                </div>
                <div className="text-xs">
                  <div className="font-bold">Ministerio de Transporte</div>
                  <div>Argentina</div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 w-full">
              <Button onClick={generatePDF} className="flex-1" disabled={isGenerating}>
                {isGenerating ? "Generando..." : "Descargar PDF"}
              </Button>
              <Button onClick={handlePrintWindow} variant="outline" className="flex-1">
                Imprimir
              </Button>
              <Button onClick={() => setOpen(false)} variant="outline" className="flex-1">
                Cerrar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
