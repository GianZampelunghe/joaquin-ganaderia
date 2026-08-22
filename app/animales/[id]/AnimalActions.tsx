"use client"

import { toast } from "sonner"
import { deleteAnimal } from "@/app/actions/animal.actions"
import { useRouter } from "next/navigation"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Button } from "@/components/ui/button"
import { Trash2, Edit } from "lucide-react"
import Link from "next/link"

export function AnimalActions({ animalId, caravana }: { animalId: string, caravana: string }) {
  const router = useRouter()

  const handleDelete = async () => {
    const { success, error } = await deleteAnimal(animalId)
    if (success) {
      toast.success("Animal eliminado correctamente")
      router.push("/animales")
    } else {
      toast.error(error || "No se pudo eliminar el animal")
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Link href={`/animales/${animalId}/editar`}>
        <Button variant="outline" className="px-3 py-2 text-sm border rounded-xl gap-2 bg-white text-gray-700 hover:bg-gray-50 active:scale-[0.98]">
          ✏️ Editar
        </Button>
      </Link>
      <ConfirmDialog
        title="Eliminar Animal"
        description={`¿Estás seguro de eliminar la caravana ${caravana}? Se borrará todo su historial y pesajes.`}
        onConfirm={handleDelete}
        trigger={
          <Button variant="outline" className="p-2 text-rose-600 bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100 hover:text-rose-800 active:scale-[0.98]">
            🗑️
          </Button>
        }
      />
    </div>
  )
}
