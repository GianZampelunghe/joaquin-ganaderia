"use client"

import { useState, useCallback } from "react"
import Cropper from "react-easy-crop"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import getCroppedImg from "@/lib/cropImage"
import { RotateCw, Check, X } from "lucide-react"

interface ImageCropperModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  imageSrc: string | null
  onCropComplete: (croppedFile: File) => Promise<void>
}

export function ImageCropperModal({ open, onOpenChange, imageSrc, onCropComplete }: ImageCropperModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  const handleApply = async () => {
    if (!imageSrc || !croppedAreaPixels) return

    setIsProcessing(true)
    try {
      const croppedImageFile = await getCroppedImg(imageSrc, croppedAreaPixels, rotation)
      if (croppedImageFile) {
        await onCropComplete(croppedImageFile)
      }
      onOpenChange(false)
    } catch (e) {
      console.error(e)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="relative w-full max-w-lg md:max-w-2xl bg-[#0F172A] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] p-0 border border-slate-800">
        <DialogHeader className="p-4 border-b border-slate-800 bg-[#0F172A] z-10 shrink-0">
          <DialogTitle className="text-xl font-bold text-white text-center">Editar Foto</DialogTitle>
        </DialogHeader>

        <div className="h-72 sm:h-96 w-full relative bg-black/50">
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={4 / 3}
              onCropChange={setCrop}
              onRotationChange={setRotation}
              onCropComplete={handleCropComplete}
              onZoomChange={setZoom}
              classes={{
                containerClassName: "absolute inset-0",
                mediaClassName: "max-w-none", 
              }}
            />
          )}
        </div>

        <DialogFooter className="flex flex-wrap sm:flex-row items-center justify-between gap-3 p-4 bg-[#0F172A] border-t border-slate-800 shrink-0">
          <Button
            type="button"
            variant="outline"
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-medium flex items-center gap-2 border-0"
            onClick={handleRotate}
          >
            <RotateCw className="h-5 w-5 mr-2" />
            Rotar 90°
          </Button>

          <div className="flex items-center gap-3 ml-auto">
            <Button
              type="button"
              variant="ghost"
              className="px-4 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800 text-sm font-medium rounded-xl"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg"
              onClick={handleApply}
              disabled={isProcessing}
            >
              <Check className="h-5 w-5 mr-2" />
              {isProcessing ? "Procesando..." : "Aplicar Recorte"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
