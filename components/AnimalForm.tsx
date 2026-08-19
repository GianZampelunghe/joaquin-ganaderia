"use client"

import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { createAnimal, updateAnimal, uploadAnimalPhoto, AnimalWithRelations } from "@/app/actions/animal.actions"
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
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, Image as ImageIcon, Trash2, Edit2 } from "lucide-react"
import { ImageCropperModal } from "./ImageCropperModal"

const animalSchema = z.object({
  caravana_number: z.string().min(1, "El número de caravana es obligatorio"),
  boton: z.string().optional(),
  current_weight: z.string().optional(),
  birth_date: z.string().optional(),
  weight_birth: z.string().optional(),
  weight_weaning: z.string().optional(),
  observations: z.string().optional(),
  pelaje_padre: z.string().min(1, "Obligatorio"),
  pelaje_madre: z.string().min(1, "Obligatorio"),
  pelaje_abuelo: z.string().min(1, "Obligatorio"),
  genetica: z.string().min(1, "Obligatorio"),
  has_vaccine: z.boolean(),
  vaccine_type: z.string().optional(),
  vaccine_date: z.string().optional(),
  health_notes: z.string().optional(),
})

interface AnimalFormProps {
  initialData?: AnimalWithRelations
}

export function AnimalForm({ initialData }: AnimalFormProps) {
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
    // Si tenemos la imagen cruda guardada temporalmente, abrimos el cropper
    if (rawImageSrc) {
      setIsCropperOpen(true)
    } else if (previewUrl) {
      // Si la previewUrl es un object URL (o blob) de una foto ya recortada pero el usuario quiere volver a editarla
      // Para editar una URL existente (ej. animal ya guardado o subido), podemos descargar la imagen y mandarla
      // Para simplificar, la enviamos directamente. Si es de supabase, debemos tener cuidado con el CORS,
      // pero en `cropImage.ts` ya seteamos crossOrigin="anonymous".
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

  const genealogy = initialData?.genealogy as any || {}
  const healthData = initialData?.health_data as any || {}

  const form = useForm<z.infer<typeof animalSchema>>({
    resolver: zodResolver(animalSchema),
    defaultValues: {
      caravana_number: initialData?.caravana_number || "",
      boton: initialData?.boton || "",
      current_weight: "", // Sólo en alta, en edición los pesos se manejan aparte
      birth_date: initialData?.birth_date || "",
      weight_birth: initialData?.weight_birth?.toString() || "",
      weight_weaning: initialData?.weight_weaning?.toString() || "",
      observations: initialData?.observations || "",
      pelaje_padre: genealogy.pelaje_padre || "",
      pelaje_madre: genealogy.pelaje_madre || "",
      pelaje_abuelo: genealogy.pelaje_abuelo || "",
      genetica: genealogy.genetica || "",
      has_vaccine: initialData?.vaccines && initialData.vaccines.length > 0 ? true : false,
      vaccine_type: initialData?.vaccines?.[0]?.vaccine_type || "",
      vaccine_date: initialData?.vaccines?.[0]?.applied_at?.split("T")[0] || new Date().toISOString().split("T")[0],
      health_notes: healthData.notes || "",
    },
  })

  const hasVaccine = form.watch("has_vaccine")

  async function onSubmit(values: z.infer<typeof animalSchema>) {
    setIsSubmitting(true)
    
    const data = {
      caravana_number: values.caravana_number,
      boton: values.boton || null,
      birth_date: values.birth_date || null,
      weight_birth: values.weight_birth ? parseFloat(values.weight_birth.replace(",", ".")) : null,
      weight_weaning: values.weight_weaning ? parseFloat(values.weight_weaning.replace(",", ".")) : null,
      observations: values.observations || null,
      genealogy: {
        pelaje_padre: values.pelaje_padre,
        pelaje_madre: values.pelaje_madre,
        pelaje_abuelo: values.pelaje_abuelo,
        genetica: values.genetica,
      },
      health_data: {
        notes: values.health_notes || "",
      }
    }

    const birthDateValue = values.birth_date ? new Date(values.birth_date) : null;
    if (birthDateValue && values.has_vaccine && values.vaccine_date) {
      const vaccineDateValue = new Date(values.vaccine_date);
      if (vaccineDateValue < birthDateValue) {
        toast.error("⚠️ La fecha de vacunación no puede ser anterior a la fecha de nacimiento.");
        setIsSubmitting(false);
        return;
      }
    }

    let success = false
    let error = null
    let animalId = initialData?.id

    if (initialData?.id) {
      // Editar
      const result = await updateAnimal(initialData.id, data)
      success = result.success
      error = result.error as string | null
      animalId = result.data?.id || initialData.id
    } else {
      // Crear
      const result = await createAnimal({
        ...data,
        current_weight: values.current_weight ? parseFloat(values.current_weight.replace(",", ".")) : null,
        has_vaccine: values.has_vaccine,
        vaccine_type: values.vaccine_type,
        vaccine_date: values.vaccine_date,
      })
      success = result.success
      error = result.error as string | null
      animalId = result.data?.id
    }
    
    if (success && animalId && photoFile) {
      const formData = new FormData()
      formData.append("file", photoFile)
      const uploadResult = await uploadAnimalPhoto(animalId, formData)
      if (!uploadResult.success) {
        toast.error("Datos guardados, pero falló la foto: " + uploadResult.error)
      }
    }

    setIsSubmitting(false)

    if (success && animalId) {
      toast.success(initialData ? "Animal actualizado correctamente" : "Animal guardado correctamente")
      router.push(`/animales/${animalId}`)
    } else {
      toast.error(error || "No se pudo guardar el animal")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Foto del Animal */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold border-b pb-2">Foto del Animal</h3>
          
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

        {/* Identificación Básica */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold border-b pb-2">Identificación</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="caravana_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Número de Caravana *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ej: AR8921" 
                      {...field} 
                      type="text"
                      autoCapitalize="characters"
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      className="text-lg py-6 uppercase"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="boton"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Botón (Opcional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ej: XM524-A704-8" 
                      {...field} 
                      type="text"
                      autoCapitalize="characters"
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      className="text-lg py-6 uppercase"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {!initialData && (
              <FormField
                control={form.control}
                name="current_weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Peso Actual</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          placeholder="Ej: 250" 
                          {...field} 
                          type="text" 
                          inputMode="decimal" 
                          pattern="[0-9]*[.,]?[0-9]*"
                          className="text-lg py-6 pr-10" 
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold pointer-events-none">kg</span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
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
        </div>

        {/* Pesajes Base */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold border-b pb-2">Pesos Base</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="weight_birth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Peso al Nacer</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input placeholder="Ej: 35" {...field} type="text" inputMode="decimal" pattern="[0-9]*[.,]?[0-9]*" className="text-lg py-6 pr-10" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold pointer-events-none">kg</span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="weight_weaning"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Peso al Destete</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input placeholder="Ej: 180" {...field} type="text" inputMode="decimal" pattern="[0-9]*[.,]?[0-9]*" className="text-lg py-6 pr-10" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold pointer-events-none">kg</span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Genealogía */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold border-b pb-2">Árbol Genealógico</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="pelaje_padre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pelaje del Padre *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Negro" {...field} className="text-lg py-6" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pelaje_madre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pelaje de la Madre *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Colorado" {...field} className="text-lg py-6" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pelaje_abuelo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pelaje del Abuelo *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Pampa" {...field} className="text-lg py-6" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="genetica"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Genética *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Angus" {...field} className="text-lg py-6" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Control Sanitario */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold border-b pb-2">Control Sanitario</h3>
          <Card className="bg-gray-50 border-gray-200 shadow-none">
            <CardContent className="p-4 space-y-4">
              {!initialData && (
                <FormField
                  control={form.control}
                  name="has_vaccine"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg p-3 bg-white border">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">¿Se le aplicó alguna vacuna inicial?</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}

              {hasVaccine && !initialData && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4">
                  <FormField
                    control={form.control}
                    name="vaccine_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo / Nombre de Vacuna</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: Aftosa" {...field} className="text-lg py-6" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="vaccine_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha de Aplicación</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            min={form.watch("birth_date") || undefined}
                            {...field} 
                            className="text-lg py-6" 
                          />
                        </FormControl>
                        {form.watch("birth_date") && field.value && new Date(field.value) < new Date(form.watch("birth_date")!) && (
                          <p className="text-[13px] font-medium text-destructive mt-1">
                            ⚠️ La fecha seleccionada no puede ser anterior a la fecha de nacimiento del animal.
                          </p>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <FormField
                control={form.control}
                name="health_notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tratamientos Sanitarios / Detalle de Sanidad</FormLabel>
                    <FormControl>
                      <textarea
                        placeholder="Ej: Desparasitación, antibiótico, curaciones, estado general..."
                        className="flex min-h-[100px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
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
                    placeholder="Notas adicionales sobre el animal..."
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
          {isSubmitting ? "Guardando..." : (initialData ? "Actualizar Animal" : "Guardar Animal")}
        </Button>
      </form>

      {/* Cropper Modal */}
      <ImageCropperModal
        open={isCropperOpen}
        onOpenChange={setIsCropperOpen}
        imageSrc={rawImageSrc}
        onCropComplete={handleCropComplete}
      />
    </Form>
  )
}
