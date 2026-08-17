"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { QuickWeightModal } from "@/components/QuickWeightModal"
import { deleteAnimal } from "@/app/actions/animal.actions"
import { toast } from "sonner"
import { Trash2, ChevronRight, Weight, Image as ImageIcon } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { es } from "date-fns/locale"

import { AnimalWithRelations } from "@/app/actions/animal.actions"

interface AnimalCardProps {
  animal: AnimalWithRelations
}

export function AnimalCard({ animal }: AnimalCardProps) {
  const latestWeight = animal.weights && animal.weights.length > 0 
    ? animal.weights.reduce((prev, current) => 
        (new Date(prev.recorded_at) > new Date(current.recorded_at) ? prev : current)
      ) 
    : null

  const handleDelete = async () => {
    const { success, error } = await deleteAnimal(animal.id)
    if (success) {
      toast.success("Animal eliminado correctamente")
    } else {
      toast.error(error || "No se pudo eliminar el animal")
    }
  }

  return (
    <Card className="flex flex-col justify-between overflow-hidden transition-all duration-200 hover:shadow-md hover:border-gray-300 animate-in fade-in zoom-in-95">
      {animal.photo_url ? (
        <div className="w-full h-48 bg-gray-200">
          <img src={animal.photo_url} alt={`Caravana ${animal.caravana_number}`} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
          <ImageIcon className="h-16 w-16 text-gray-300" />
        </div>
      )}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 bg-white pb-4 pt-5 border-b">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Caravana</span>
          <span className="text-2xl font-bold text-black">{animal.caravana_number}</span>
        </div>
        <ConfirmDialog
          title="Eliminar Animal"
          description={`¿Estás seguro de eliminar la caravana ${animal.caravana_number}? Se borrará todo su historial y pesajes.`}
          onConfirm={handleDelete}
          trigger={
            <button className="h-12 w-12 rounded-full flex items-center justify-center text-rose-700 hover:bg-rose-100 transition-all duration-150 bg-rose-50 border border-rose-200 active:scale-[0.98]">
              <Trash2 className="h-6 w-6" />
            </button>
          }
        />
      </CardHeader>
      
      <CardContent className="pt-4 pb-2">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 mb-1">Último Peso</span>
            <span className="text-lg font-semibold text-gray-900">
              {latestWeight ? `${latestWeight.weight_kg} kg` : "--"}
            </span>
            {latestWeight && (
              <span className="text-xs text-gray-400 mt-0.5">
                {format(new Date(latestWeight.recorded_at), "d MMM yyyy", { locale: es })}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 mb-1">Actualizado</span>
            <span className="text-sm font-medium text-gray-900 mt-1">
              {format(new Date(animal.updated_at), "d MMM yyyy", { locale: es })}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 pt-4 bg-white border-t">
        <QuickWeightModal animalId={animal.id} caravana={animal.caravana_number} />
        
        <Link href={`/animales/${animal.id}`} className="w-full">
          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-100 h-12 text-base font-semibold text-gray-900 hover:bg-gray-200 transition-all duration-150 border border-gray-200 active:scale-[0.98]">
            Ver Ficha Completa
            <ChevronRight className="h-5 w-5" />
          </button>
        </Link>
      </CardFooter>
    </Card>
  )
}
