"use client"

import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { createHorse, updateHorse, uploadHorsePhoto, Horse } from "@/app/actions/horse.actions"
import { compressImage } from "@/lib/image-utils"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ImageCropperModal } from "./ImageCropperModal"
import { Camera, Image as ImageIcon, Trash2, Edit2 } from "lucide-react"

const horseSchema = z.object({
  rp: z.string().min(1, "El RP es obligatorio"),
  birth_date: z.string().optional(),
  father: z.string().optional(),
  mother: z.string().optional(),
  sex: z.enum(["Macho", "Hembra"], { required_error: "Debes seleccionar un sexo" }),
  service_notes: z.string().optional(),
  observations: z.string().optional(),
})

interface HorseFormProps {
  initialData?: Horse
}

export function HorseForm({ initialData }: HorseFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.photo_url || null)
  const [isCropperOpen, setIsCropperOpen] = useState(false)
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null)
  
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const file = e.target.files[0]
        const reader = new FileReader()
        reader.onload = () => {
          setRawImageSrc(reader.result as string)
          setIsCropperOpen(true)
        }
        reader.readAsDataURL(file)
      } catch (err) {
        toast.error("Error al procesar la imagen")
      }
    }
  }

  const handleCropComplete = async (croppedFile: File) => {
    try {
      const compressedFile = await compressImage(croppedFile)
      setPhotoFile(compressedFile)
      setPreviewUrl(URL.createObjectURL(compressedFile))
    } catch (err) {
      toast.error("Error al procesar el recorte")
    }
  }

  const handleEditPreview = async () => {
    if (rawImageSrc) {
      setIsCropperOpen(true)
    } else if (previewUrl) {
      setRawImageSrc(previewUrl)
      setIsCropperOpen(true)
    }
  }

  const removePhoto = () => {
    setPhotoFile(null)
    setPreviewUrl(null)
    setRawImageSrc(null)
    if (cameraInputRef.current) cameraInputRef.current.value = ""
    if (galleryInputRef.current) galleryInputRef.current.value = ""
  }

  const form = useForm<z.infer<typeof horseSchema>>({
    resolver: zodResolver(horseSchema),
    defaultValues: {
      rp: initialData?.rp || "",
      birth_date: initialData?.birth_date || "",
      father: initialData?.father || "",
      mother: initialData?.mother || "",
      sex: (initialData?.sex as "Macho" | "Hembra") || "Macho",
      service_notes: initialData?.service_notes || "",
      observations: initialData?.observations || "",
    },
  })

  async function onSubmit(values: z.infer<typeof horseSchema>) {
    setIsSubmitting(true)
    
    const data = {
      rp: values.rp,
      birth_date: values.birth_date || null,
      father: values.father || null,
      mother: values.mother || null,
      sex: values.sex,
      service_notes: values.service_notes || null,
      observations: values.observations || null,
    }

    let success = false
    let error = null
    let horseId = initialData?.id

    if (initialData?.id) {
      const result = await updateHorse(initialData.id, data)
      success = result.success
      error = result.error as string | null
    } else {
      const result = await createHorse(data)
      success = result.success
      error = result.error as string | null
      horseId = result.data?.id
    }
    
    if (success && horseId && photoFile) {
      const formData = new FormData()
      formData.append("file", photoFile)
      const uploadResult = await uploadHorsePhoto(horseId, formData)
      if (!uploadResult.success) {
        toast.error("Datos guardados, pero falló la foto: " + uploadResult.error)
      }
    }

    setIsSubmitting(false)

    if (success && horseId) {
      toast.success(initialData ? "Caballo actualizado" : "Caballo guardado")
      router.push(`/caballos/${horseId}`)
    } else {
      toast.error(error || "No se pudo guardar el caballo")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Foto */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold border-b pb-2">Foto</h3>
          {previewUrl ? (
            <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-100 group">
              <img src={previewUrl} alt="Preview" className="w-full h-64 object-cover" />
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  type="button"
                  onClick={handleEditPreview}
                  className="bg-blue-50 text-blue-700 p-2 rounded-full hover:bg-blue-100 transition-colors shadow-sm active:scale-95"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={removePhoto}
                  className="bg-rose-50 text-rose-700 p-2 rounded-full hover:bg-rose-100 transition-colors shadow-sm active:scale-95"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <input 
                type="file" 
                accept="image/*" 
                capture="environment"
                ref={cameraInputRef}
                className="hidden" 
                onChange={handlePhotoChange}
              />
              <input 
                type="file" 
                accept="image/*" 
                ref={galleryInputRef}
                className="hidden" 
                onChange={handlePhotoChange}
              />
              <Button 
                type="button" 
                variant="outline"
                className="h-20 flex flex-col items-center justify-center gap-2 border-dashed border-2 active:scale-[0.98]"
                onClick={() => cameraInputRef.current?.click()}
              >
                <Camera className="h-6 w-6 text-gray-500" />
                <span className="text-xs font-semibold text-gray-700">Tomar Foto</span>
              </Button>
              <Button 
                type="button" 
                variant="outline"
                className="h-20 flex flex-col items-center justify-center gap-2 border-dashed border-2 active:scale-[0.98]"
                onClick={() => galleryInputRef.current?.click()}
              >
                <ImageIcon className="h-6 w-6 text-gray-500" />
                <span className="text-xs font-semibold text-gray-700">De Galería</span>
              </Button>
            </div>
          )}
        </div>

        {/* Datos Principales */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold border-b pb-2">Identificación</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="rp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">RP / Nombre *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ej: Zafiro / RP 104" 
                      {...field} 
                      type="text"
                      className="text-lg py-6"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="birth_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Fecha de Nacimiento</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} className="text-lg py-6" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="sex"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-base">Sexo *</FormLabel>
                <FormControl>
                  <div className="flex bg-gray-100 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => field.onChange("Macho")}
                      className={`flex-1 py-3 text-center rounded-lg font-medium transition-all ${
                        field.value === "Macho" 
                          ? "bg-white text-emerald-800 shadow-sm border border-gray-200" 
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      [ ♂ Macho ]
                    </button>
                    <button
                      type="button"
                      onClick={() => field.onChange("Hembra")}
                      className={`flex-1 py-3 text-center rounded-lg font-medium transition-all ${
                        field.value === "Hembra" 
                          ? "bg-white text-rose-800 shadow-sm border border-gray-200" 
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      [ ♀ Hembra ]
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Genealogía */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold border-b pb-2">Padres</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="father"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Padre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del padre" {...field} className="text-lg py-6" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mother"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Madre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre de la madre" {...field} className="text-lg py-6" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Servicio / Sanidad */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold border-b pb-2">Servicio / Sanidad</h3>
          <FormField
            control={form.control}
            name="service_notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Datos de Servicio</FormLabel>
                <FormControl>
                  <textarea
                    placeholder="Monta, padrillo asignado, inseminación..."
                    className="flex min-h-[100px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Observaciones Generales */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold border-b pb-2">Observaciones Generales</h3>
          <FormField
            control={form.control}
            name="observations"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <textarea
                    placeholder="Notas adicionales..."
                    className="flex min-h-[120px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-7 text-xl rounded-xl transition-all active:scale-[0.98] shadow-sm"
        >
          {isSubmitting ? "Guardando..." : (initialData ? "Actualizar Caballo" : "Guardar Caballo")}
        </Button>
      </form>

      <ImageCropperModal
        open={isCropperOpen}
        onOpenChange={setIsCropperOpen}
        imageSrc={rawImageSrc}
        onCropComplete={handleCropComplete}
      />
    </Form>
  )
}
