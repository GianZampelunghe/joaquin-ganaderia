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
      <DialogContent className="sm:max-w-[500px] w-[95vw] h-[90vh] max-h-[800px] p-0 flex flex-col rounded-2xl bg-gray-950 border-gray-800 overflow-hidden">
        <DialogHeader className="p-4 border-b border-gray-800 bg-gray-900/50 z-10 shrink-0">
          <DialogTitle className="text-xl font-bold text-white text-center">Editar Foto</DialogTitle>
        </DialogHeader>

        <div className="relative flex-1 w-full bg-black">
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

        <DialogFooter className="p-4 sm:p-6 border-t border-gray-800 bg-gray-900 flex-col gap-3 shrink-0">
          <Button
            type="button"
            variant="outline"
            className="w-full h-12 bg-gray-800 hover:bg-gray-700 text-white border-gray-700 hover:text-white transition-colors active:scale-[0.98]"
            onClick={handleRotate}
          >
            <RotateCw className="h-5 w-5 mr-2" />
            Rotar 90°
          </Button>

          <div className="grid grid-cols-2 gap-3 w-full">
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 bg-transparent text-gray-300 hover:text-white border-gray-700 hover:bg-gray-800 active:scale-[0.98]"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-5 w-5 mr-2" />
              Cancelar
            </Button>
            <Button
              type="button"
              className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold active:scale-[0.98]"
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
