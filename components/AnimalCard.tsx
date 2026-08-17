"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { QuickWeightModal } from "@/components/QuickWeightModal"
import { deleteAnimal } from "@/app/actions/animal.actions"
import { toast } from "sonner"
import { Trash2, ChevronRight, Weight } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface AnimalCardProps {
  animal: any
}

export function AnimalCard({ animal }: AnimalCardProps) {
  const latestWeight = animal.weights?.length > 0 
    ? animal.weights.reduce((prev: any, current: any) => 
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
    <Card className="flex flex-col justify-between overflow-hidden transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 bg-gray-50 pb-4 pt-5">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Caravana</span>
          <span className="text-2xl font-bold text-black">{animal.caravana_number}</span>
        </div>
        <ConfirmDialog
          title="Eliminar Animal"
          description={`¿Estás seguro de eliminar la caravana ${animal.caravana_number}? Se borrará todo su historial y pesajes.`}
          onConfirm={handleDelete}
          trigger={
            <button className="rounded-full p-2 text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors">
              <Trash2 className="h-5 w-5" />
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
          <button className="flex w-full items-center justify-center gap-2 rounded-md bg-gray-100 py-3 text-sm font-medium text-gray-900 hover:bg-gray-200 transition-colors">
            Ver Ficha Completa
            <ChevronRight className="h-4 w-4" />
          </button>
        </Link>
      </CardFooter>
    </Card>
  )
}
