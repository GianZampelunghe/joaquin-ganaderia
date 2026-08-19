"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileDown, Loader2 } from "lucide-react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { toast } from "sonner"

export function PdfExportButton({ animalId, caravana }: { animalId: string, caravana: string }) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    const toastId = toast.loading("Generando PDF...")

    try {
      const element = document.getElementById(`pdf-template-${animalId}`)
      if (!element) throw new Error("Template no encontrado")

      // Temporalmente quitar la clase que lo oculta para que html2canvas pueda leerlo bien,
      // o bien ya asegurarnos que esté absolute y z-[-1]. html2canvas puede leer absolute/z-index negativos
      
      const canvas = await html2canvas(element, {
        scale: 2, // Alta calidad
        useCORS: true, // Para imágenes externas
        logging: false,
      })

      const imgData = canvas.toDataURL("image/png")
      
      // A4 format: 210x297 mm
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)
      pdf.save(`Ficha_Caravana_${caravana}.pdf`)

      toast.success("PDF generado exitosamente", { id: toastId })
    } catch (error) {
      console.error(error)
      toast.error("Error al generar el PDF", { id: toastId })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button 
      variant="outline" 
      onClick={handleExport} 
      disabled={isExporting}
      className="gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 active:scale-95 transition-transform"
    >
      {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
      Descargar Ficha PDF
    </Button>
  )
}
