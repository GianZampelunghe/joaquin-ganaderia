'use client';

import { useState } from 'react';
import { jsPDF } from 'jspdf';
import { Download, Loader2 } from 'lucide-react';

interface PdfExportButtonProps {
  animal: {
    caravana_number: string;
    boton?: string | null;
    birth_date?: string | null;
    sex?: string | null;
    scrotal_circumference?: string | null;
    gdr?: string | null;
    weight_birth?: number | null;
    weight_weaning?: number | null;
    father?: string | null;
    mother?: string | null;
    grandfather?: string | null;
    pelaje_padre?: string | null;
    pelaje_madre?: string | null;
    pelaje_abuelo?: string | null;
    genetica?: string | null;
    observations?: string | null;
    photo_url?: string | null;
  };
}

// Función auxiliar para reescalar y comprimir cualquier imagen a JPEG de bajo peso
async function getCompressedDataUrl(src: string, maxDimension: number = 600, quality: number = 0.75): Promise<{ dataUrl: string; width: number; height: number } | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = src;
    img.onload = () => {
      let { width, height } = img;
      if (width > height) {
        if (width > maxDimension) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        }
      } else {
        if (height > maxDimension) {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(null);

      // Fondo plano beige para el logo o blanco para fotos
      ctx.fillStyle = '#F9ECDE';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve({ dataUrl, width, height });
    };
    img.onerror = () => resolve(null);
  });
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
        compress: true,
      });

      // 1. Cabecera Institucional (#F9ECDE)
      doc.setFillColor(249, 236, 222);
      doc.rect(0, 0, 210, 36, 'F');

      // Cargar y procesar Logo comprimido
      try {
        const logoObj = await getCompressedDataUrl('/logo.la.cañada1.png', 300, 0.8);
        if (logoObj) {
          doc.addImage(logoObj.dataUrl, 'JPEG', 12, 4, 28, 28, undefined, 'FAST');
        }
      } catch (e) {
        console.warn('No se pudo cargar el logo:', e);
      }

      // Textos de Cabecera
      doc.setTextColor(30, 58, 43);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('ESTABLECIMIENTO LA CAÑADA', 44, 16);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10.5);
      doc.setTextColor(80, 70, 60);
      doc.text('Joaquín Castro - Ficha Técnica Oficial', 44, 23);

      const fechaHoy = new Date().toLocaleDateString('es-AR');
      doc.setFontSize(9);
      doc.setTextColor(100, 90, 80);
      doc.text(`Fecha de emisión: ${fechaHoy}`, 145, 23);

      // Línea divisoria
      doc.setDrawColor(217, 195, 176);
      doc.line(0, 36, 210, 36);

      // 2. Identificación del Animal
      doc.setTextColor(20, 20, 20);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text('IDENTIFICACIÓN DEL ANIMAL', 15, 46);

      doc.setDrawColor(220, 220, 220);
      doc.line(15, 48, 195, 48);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10.5);

      let currentY = 56;
      doc.text(`Caravana: ${animal.caravana_number || '-'}`, 15, currentY);
      if (animal.boton) {
        currentY += 7;
        doc.text(`Botón: ${animal.boton}`, 15, currentY);
      }
      currentY += 7;
      doc.text(`Fecha de Nacimiento: ${animal.birth_date ? new Date(animal.birth_date).toLocaleDateString('es-AR') : 'No registrada'}`, 15, currentY);
      currentY += 7;
      doc.text(`Sexo: ${animal.sex || 'No especificado'}`, 15, currentY);
      if (animal.sex === 'Macho' && animal.scrotal_circumference) {
        currentY += 7;
        doc.text(`Circunf. Escrotal: ${animal.scrotal_circumference}`, 15, currentY);
      } else if (animal.sex === 'Hembra' && animal.gdr) {
        currentY += 7;
        doc.text(`GDR: ${animal.gdr}`, 15, currentY);
      }
      currentY += 7;
      doc.text(`Genética / Raza: ${animal.genetica || 'Angus'}`, 15, currentY);

      // 3. Renderizado de Foto Comprimida
      if (animal.photo_url) {
        try {
          const photoObj = await getCompressedDataUrl(animal.photo_url, 600, 0.75);
          if (photoObj) {
            const ratio = photoObj.width / photoObj.height;
            let finalW = 65;
            let finalH = 65 / ratio;
            if (finalH > 50) {
              finalH = 50;
              finalW = 50 * ratio;
            }
            const finalX = 130 + (65 - finalW) / 2;
            const finalY = 48 + (50 - finalH) / 2;

            doc.addImage(photoObj.dataUrl, 'JPEG', finalX, finalY, finalW, finalH, undefined, 'FAST');
          }
        } catch (e) {
          console.warn('Error al incrustar foto del animal:', e);
        }
      }

      // 4. Pesos Clave
      const pesosY = 104;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('PESOS CLAVE', 15, pesosY);
      doc.line(15, pesosY + 2, 195, pesosY + 2);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10.5);
      doc.text(`• Peso al Nacer: ${animal.weight_birth ? `${animal.weight_birth} kg` : '-'}`, 20, pesosY + 9);
      doc.text(`• Peso al Destete: ${animal.weight_weaning ? `${animal.weight_weaning} kg` : '-'}`, 20, pesosY + 16);

      // 5. Árbol Genealógico
      const genealY = 132;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('ÁRBOL GENEALÓGICO', 15, genealY);
      doc.line(15, genealY + 2, 195, genealY + 2);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10.5);
      doc.text(`• Padre: ${animal.father || animal.pelaje_padre || '-'}`, 20, genealY + 9);
      doc.text(`• Madre: ${animal.mother || animal.pelaje_madre || '-'}`, 20, genealY + 16);
      doc.text(`• Abuelo: ${animal.grandfather || animal.pelaje_abuelo || '-'}`, 20, genealY + 23);

      // 6. Observaciones
      if (animal.observations) {
        const obsY = 168;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('OBSERVACIONES', 15, obsY);
        doc.line(15, obsY + 2, 195, obsY + 2);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        const splitObs = doc.splitTextToSize(animal.observations, 175);
        doc.text(splitObs, 20, obsY + 8);
      }

      // Pie de Página
      doc.setFontSize(8.5);
      doc.setTextColor(130, 130, 130);
      doc.text('Documento generado automáticamente por el Sistema Ganadero La Cañada.', 15, 285);

      // Descargar
      doc.save(`Ficha-${animal.caravana_number || 'Animal'}.pdf`);
    } catch (error) {
      console.error('Error generando PDF:', error);
      alert('Hubo un error al generar el PDF.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={generatePdf}
      disabled={isGenerating}
      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-sm font-medium rounded-xl shadow-sm transition-all disabled:opacity-50"
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin"/>
          <span>Generando...</span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4"/>
          <span>Descargar Ficha PDF</span>
        </>
      )}
    </button>
  );
}
