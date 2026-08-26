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
    sex?: string | null;
    scrotal_circumference?: string | null;
    gdr?: string | null;
  };
}

const compressImageToDataUrl = (src: string, maxDim: number = 800, quality: number = 0.8): Promise<{ dataUrl: string, ratio: number } | null> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = src;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;
      const ratio = width / height;

      if (width > height) {
        if (width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        }
      } else {
        if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(null);

      // Fondo blanco para evitar transparencias rotas en JPEG
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      resolve({ dataUrl: canvas.toDataURL('image/jpeg', quality), ratio });
    };
    img.onerror = () => resolve(null);
  });
};

export default function PdfExportButton({ animal }: PdfExportButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const loadLogo = (): Promise<HTMLImageElement | null> => {
    return new Promise((resolve) => {
      const logo = new Image();
      logo.src = '/logo.la.cañada1.png';
      logo.onload = () => resolve(logo);
      logo.onerror = () => {
        console.warn('No se pudo cargar el archivo /logo.la.cañada1.png');
        resolve(null);
      };
    });
  };

  const generatePdf = async () => {
    try {
      setIsGenerating(true);
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // 1. Encabezado institucional
      doc.setFillColor(249, 236, 222); // #F9ECDE
      doc.rect(0, 0, 210, 36, 'F');
      
      const logoImg = await loadLogo();
      if (logoImg) {
        doc.addImage(logoImg, 'PNG', 12, 4, 28, 28);
      }
      
      doc.setTextColor(30, 58, 43);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('ESTABLECIMIENTO LA CAÑADA', 44, 16);
      
      doc.setFontSize(10.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 70, 60);
      doc.text('Joaquín Castro - Ficha Técnica Oficial', 44, 23);

      const fechaHoy = new Date().toLocaleDateString('es-AR');
      doc.setFontSize(9);
      doc.setTextColor(100, 90, 80);
      doc.text(`Fecha de emisión: ${fechaHoy}`, 145, 23);

      // Línea de separación en la base de la cabecera
      doc.setDrawColor(217, 195, 176);
      doc.line(0, 36, 210, 36);

      // 2. Identificación Principal
      doc.setTextColor(20, 20, 20);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('IDENTIFICACIÓN DEL ANIMAL', 15, 46);

      doc.setDrawColor(220, 220, 220);
      doc.line(15, 48, 195, 48);

      doc.setFontSize(11);
      doc.text(`Caravana: ${animal.caravana_number || '-'}`, 15, 56);
      if (animal.boton) {
        doc.text(`Botón: ${animal.boton}`, 15, 63);
      }
      doc.text(`Fecha de Nacimiento: ${animal.birth_date ? new Date(animal.birth_date).toLocaleDateString('es-AR') : 'No registrada'}`, 15, animal.boton ? 70 : 63);
      
      let nextLine = animal.boton ? 77 : 70;
      if (animal.sex) {
        doc.text(`Sexo: ${animal.sex}`, 15, nextLine);
        nextLine += 7;
      }
      doc.text(`Genética / Raza: ${animal.genetica || 'No especificada'}`, 15, nextLine);
      nextLine += 7;
      
      if (animal.sex === 'Macho' && animal.scrotal_circumference) {
        doc.text(`Circunf. Escrotal: ${animal.scrotal_circumference}`, 15, nextLine);
        nextLine += 7;
      } else if (animal.sex === 'Hembra' && animal.gdr) {
        doc.text(`GDR: ${animal.gdr}`, 15, nextLine);
        nextLine += 7;
      }

      // 3. Cargar y dibujar foto si existe
      if (animal.photo_url) {
        try {
          const compressed = await compressImageToDataUrl(animal.photo_url, 800, 0.8);
          if (compressed) {
            const { dataUrl, ratio } = compressed;

            let finalW = 65;
            let finalH = 65 / ratio;

            if (finalH > 50) {
              finalH = 50;
              finalW = 50 * ratio;
            }

            // Centrar dentro de la caja de 65x50mm
            const finalX = 130 + (65 - finalW) / 2;
            const finalY = 48 + (50 - finalH) / 2;

            doc.addImage(dataUrl, 'JPEG', finalX, finalY, finalW, finalH);
          }
        } catch (imgError) {
          console.warn('No se pudo renderizar la foto en el PDF:', imgError);
        }
      }

      // 4. Pesos Clave
      let currentY = 104;
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
      currentY = 135;

      // 5. Árbol Genealógico
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text('ÁRBOL GENEALÓGICO', 15, currentY);
      doc.line(15, currentY + 2, 195, currentY + 2);
      currentY += 10;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.text(`• Padre: ${animal.pelaje_padre || '-'}`, 20, currentY);
      currentY += 7;
      doc.text(`• Madre: ${animal.pelaje_madre || '-'}`, 20, currentY);
      currentY += 7;
      doc.text(`• Abuelo: ${animal.pelaje_abuelo || '-'}`, 20, currentY);
      currentY = 175;

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
      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-sm font-medium rounded-xl shadow-sm transition-all duration-150 disabled:opacity-50"
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin"/>
          <span>Generando...</span>
        </>
      ) : (
        <>
          <span>📄 Descargar Ficha PDF</span>
        </>
      )}
    </button>
  );
}
