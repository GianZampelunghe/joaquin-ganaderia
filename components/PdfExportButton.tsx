'use client';

import { useState } from 'react';
import { jsPDF } from 'jspdf';
import { Download, Loader2 } from 'lucide-react';

interface PdfExportButtonProps {
  animal: {
    caravana_number: string;
    boton?: string | null;
    birth_date?: string | null;
    weight_birth?: number | null;
    weight_weaning?: number | null;
    pelaje_padre?: string | null;
    pelaje_madre?: string | null;
    pelaje_abuelo?: string | null;
    genetica?: string | null;
    observations?: string | null;
    photo_url?: string | null;
  };
}

export default function PdfExportButton({ animal }: PdfExportButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePdf = async () => {
    try {
      setIsGenerating(true);
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // 1. Encabezado institucional
      doc.setFillColor(16, 185, 129); // Verde esmeralda suave
      doc.rect(0, 0, 210, 24, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('ESTABLECIMIENTO LA CAÑADA', 15, 12);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Joaquín Castro - Ficha Técnica Oficial', 15, 18);

      const fechaHoy = new Date().toLocaleDateString('es-AR');
      doc.text(`Fecha de emisión: ${fechaHoy}`, 145, 18);

      // 2. Identificación Principal
      doc.setTextColor(20, 20, 20);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('IDENTIFICACIÓN DEL ANIMAL', 15, 36);

      doc.setDrawColor(220, 220, 220);
      doc.line(15, 38, 195, 38);

      doc.setFontSize(11);
      doc.text(`Caravana: ${animal.caravana_number || '-'}`, 15, 46);
      if (animal.boton) {
        doc.text(`Botón: ${animal.boton}`, 15, 53);
      }
      doc.text(`Fecha de Nacimiento: ${animal.birth_date ? new Date(animal.birth_date).toLocaleDateString('es-AR') : 'No registrada'}`, 15, animal.boton ? 60 : 53);
      doc.text(`Genética / Raza: ${animal.genetica || 'No especificada'}`, 15, animal.boton ? 67 : 60);

      let currentY = animal.boton ? 78 : 71;

      // 3. Cargar y dibujar foto si existe
      if (animal.photo_url) {
        try {
          const img = new Image();
          img.crossOrigin = 'Anonymous';
          img.src = animal.photo_url;
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
          });

          // Dibujar imagen a la derecha (65mm ancho x 50mm alto)
          doc.addImage(img, 'JPEG', 130, 32, 65, 50);
        } catch (imgError) {
          console.warn('No se pudo renderizar la foto en el PDF:', imgError);
        }
      }

      // 4. Pesos Clave
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text('PESOS CLAVE', 15, currentY);
      doc.line(15, currentY + 2, 195, currentY + 2);
      currentY += 10;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.text(`• Peso al Nacer: ${animal.weight_birth ? `${animal.weight_birth} kg` : '-'}`, 20, currentY);
      currentY += 7;
      doc.text(`• Peso al Destete: ${animal.weight_weaning ? `${animal.weight_weaning} kg` : '-'}`, 20, currentY);
      currentY += 14;

      // 5. Árbol Genealógico
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text('ÁRBOL GENEALÓGICO', 15, currentY);
      doc.line(15, currentY + 2, 195, currentY + 2);
      currentY += 10;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.text(`• Pelaje Padre: ${animal.pelaje_padre || '-'}`, 20, currentY);
      currentY += 7;
      doc.text(`• Pelaje Madre: ${animal.pelaje_madre || '-'}`, 20, currentY);
      currentY += 7;
      doc.text(`• Pelaje Abuelo: ${animal.pelaje_abuelo || '-'}`, 20, currentY);
      currentY += 14;

      // 6. Observaciones
      if (animal.observations) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.text('OBSERVACIONES', 15, currentY);
        doc.line(15, currentY + 2, 195, currentY + 2);
        currentY += 10;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        const splitObs = doc.splitTextToSize(animal.observations, 175);
        doc.text(splitObs, 20, currentY);
      }

      // 7. Pie de página
      doc.setFontSize(9);
      doc.setTextColor(130, 130, 130);
      doc.text('Documento generado automáticamente por el Sistema Ganadero La Cañada.', 15, 285);

      // Guardar PDF
      doc.save(`Ficha-${animal.caravana_number || 'Animal'}.pdf`);
    } catch (err) {
      console.error('Error generando PDF nativo:', err);
      alert('Ocurrió un error al generar el PDF. Por favor reintenta.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={generatePdf}
      disabled={isGenerating}
      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-medium rounded-xl shadow-sm transition-all duration-150 disabled:opacity-50"
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin"/>
          <span>Generando PDF...</span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4"/>
          <span>📄 Descargar Ficha PDF</span>
        </>
      )}
    </button>
  );
}
