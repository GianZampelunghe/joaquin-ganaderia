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
    <div className="flex gap-2">
      <Link href={`/animales/${animalId}/editar`}>
        <Button variant="outline" className="gap-2 bg-white text-gray-700 hover:bg-gray-50 active:scale-[0.98]">
          <Edit className="h-4 w-4" /> Editar
        </Button>
      </Link>
      <ConfirmDialog
        title="Eliminar Animal"
        description={`¿Estás seguro de eliminar la caravana ${caravana}? Se borrará todo su historial y pesajes.`}
        onConfirm={handleDelete}
        trigger={
          <Button variant="outline" className="gap-2 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:text-rose-800 border-rose-200 active:scale-[0.98]">
            <Trash2 className="h-4 w-4" /> Eliminar
          </Button>
        }
      />
    </div>
  )
}
