"use client"

import { toast } from "sonner"
import { deleteWeight } from "@/app/actions/animal.actions"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Trash2 } from "lucide-react"
import { format } from "date-fns"

export function WeightItem({ weight, animalId }: { weight: any, animalId: string }) {
  const handleDelete = async () => {
    const { success, error } = await deleteWeight(weight.id, animalId)
    if (success) {
      toast.success("Pesaje eliminado")
    } else {
      toast.error(error || "Error al eliminar")
    }
  }

  return (
    <div className="flex flex-col py-3 border-b border-dashed last:border-0 hover:bg-gray-50 rounded-lg px-2 transition-colors group">
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <span className="font-bold text-lg text-gray-900 leading-none mb-1">{weight.weight_kg} kg</span>
          {weight.notes && (
            <span className="text-sm font-medium text-emerald-700 bg-emerald-50 w-fit px-2 py-0.5 rounded">
              {weight.notes}
            </span>
          )}
          <span className="text-xs text-gray-500 mt-1">
            {format(new Date(weight.recorded_at), "dd/MM/yyyy")}
          </span>
        </div>
        <ConfirmDialog
          title="Eliminar Pesaje"
          description="¿Estás seguro de que deseas borrar este registro de peso?"
          onConfirm={handleDelete}
          trigger={
            <button className="text-gray-400 hover:text-rose-600 p-2 rounded-full hover:bg-rose-50 transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100">
              <Trash2 className="h-4 w-4" />
            </button>
          }
        />
      </div>
    </div>
  )
}
