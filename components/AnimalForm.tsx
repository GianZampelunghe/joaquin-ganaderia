"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { createAnimal } from "@/app/actions/animal.actions"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"

const animalSchema = z.object({
  caravana_number: z.string().min(1, "El número de caravana es obligatorio"),
  current_weight: z.string().optional(),
  birth_date: z.string().optional(),
  weight_birth: z.string().optional(),
  weight_weaning: z.string().optional(),
  weight_15_20_months: z.string().optional(),
  observations: z.string().optional(),
  pelaje_padre: z.string().min(1, "Obligatorio"),
  pelaje_madre: z.string().min(1, "Obligatorio"),
  pelaje_abuelo: z.string().min(1, "Obligatorio"),
  genetica: z.string().min(1, "Obligatorio"),
  has_vaccine: z.boolean().default(false),
  vaccine_type: z.string().optional(),
  vaccine_date: z.string().optional(),
})

export function AnimalForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof animalSchema>>({
    resolver: zodResolver(animalSchema),
    defaultValues: {
      caravana_number: "",
      current_weight: "",
      birth_date: "",
      weight_birth: "",
      weight_weaning: "",
      weight_15_20_months: "",
      observations: "",
      pelaje_padre: "",
      pelaje_madre: "",
      pelaje_abuelo: "",
      genetica: "",
      has_vaccine: false,
      vaccine_type: "",
      vaccine_date: new Date().toISOString().split("T")[0],
    },
  })

  const hasVaccine = form.watch("has_vaccine")

  async function onSubmit(values: z.infer<typeof animalSchema>) {
    setIsSubmitting(true)
    
    // Preparar datos para el server action
    const data = {
      ...values,
      current_weight: values.current_weight ? parseFloat(values.current_weight) : null,
      weight_birth: values.weight_birth ? parseFloat(values.weight_birth) : null,
      weight_weaning: values.weight_weaning ? parseFloat(values.weight_weaning) : null,
      weight_15_20_months: values.weight_15_20_months ? parseFloat(values.weight_15_20_months) : null,
      genealogy: {
        pelaje_padre: values.pelaje_padre,
        pelaje_madre: values.pelaje_madre,
        pelaje_abuelo: values.pelaje_abuelo,
        genetica: values.genetica,
      }
    }

    const { success, error, id } = await createAnimal(data)
    
    setIsSubmitting(false)

    if (success) {
      toast.success("Animal guardado correctamente")
      router.push(`/animales/${id}`)
    } else {
      toast.error(error || "No se pudo guardar el animal")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Identificación Básica */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold border-b pb-2">Identificación</h3>
          
          <FormField
            control={form.control}
            name="caravana_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">Número de Caravana *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Ej: 1234" 
                    {...field} 
                    inputMode="numeric" 
                    className="text-lg py-6"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="current_weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Peso Actual (kg)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: 250" {...field} inputMode="decimal" className="text-lg py-6" />
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
        </div>

        {/* Pesajes Históricos */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold border-b pb-2">Pesos Históricos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="weight_birth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Peso al Nacer</FormLabel>
                  <FormControl>
                    <Input placeholder="kg" {...field} inputMode="decimal" className="text-lg py-6" />
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
                    <Input placeholder="kg" {...field} inputMode="decimal" className="text-lg py-6" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="weight_15_20_months"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Peso 15-20 Meses</FormLabel>
                  <FormControl>
                    <Input placeholder="kg" {...field} inputMode="decimal" className="text-lg py-6" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Genealogía */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold border-b pb-2">Genealogía</h3>
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
              <FormField
                control={form.control}
                name="has_vaccine"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg p-3 bg-white border">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">¿Se le aplicó alguna vacuna?</FormLabel>
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

              {hasVaccine && (
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
                          <Input type="date" {...field} className="text-lg py-6" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Observaciones */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold border-b pb-2">Observaciones</h3>
          <FormField
            control={form.control}
            name="observations"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <textarea
                    placeholder="Notas adicionales..."
                    className="flex min-h-[120px] w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-lg shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-green-500 disabled:cursor-not-allowed disabled:opacity-50"
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
          className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-7 text-xl"
        >
          {isSubmitting ? "Guardando..." : "Guardar Animal"}
        </Button>
      </form>
    </Form>
  )
}
