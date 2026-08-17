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
          <div className="flex items-center gap-3 mb-1">
            <span className="font-bold text-lg text-gray-900 leading-none">{weight.weight_kg} kg</span>
            {weight.gain !== undefined && weight.gain !== null && (
              <span className={`text-sm font-semibold px-2 py-0.5 rounded ${weight.gain > 0 ? 'bg-emerald-100 text-emerald-800' : weight.gain < 0 ? 'bg-rose-100 text-rose-800' : 'bg-gray-100 text-gray-800'}`}>
                {weight.gain > 0 ? '+' : ''}{weight.gain.toFixed(2)} kg
                {weight.gdp !== null && weight.gdp !== undefined && (
                  <span className="ml-1 text-xs opacity-80">({weight.gdp.toFixed(3)} kg/d)</span>
                )}
              </span>
            )}
            {(weight.gain === null || weight.gain === undefined) && (
              <span className="text-sm font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
                -
              </span>
            )}
          </div>
          {weight.notes && (
            <span className="text-sm font-medium text-emerald-700 bg-emerald-50 w-fit px-2 py-0.5 rounded mb-1">
              {weight.notes}
            </span>
          )}
          <span className="text-xs text-gray-500 mt-1">
            {format(new Date(weight.recorded_at), "dd/MM/yyyy HH:mm")}
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
