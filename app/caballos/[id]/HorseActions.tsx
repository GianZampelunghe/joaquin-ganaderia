"use client"

import { toast } from "sonner"
import { deleteHorse } from "@/app/actions/horse.actions"
import { useRouter } from "next/navigation"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Button } from "@/components/ui/button"
import { Trash2, Edit } from "lucide-react"
import Link from "next/link"

export function HorseActions({ horseId, rp }: { horseId: string, rp: string }) {
  const router = useRouter()

  const handleDelete = async () => {
    const { success, error } = await deleteHorse(horseId)
    if (success) {
      toast.success("Caballo eliminado correctamente")
      router.push("/caballos")
    } else {
      toast.error(error || "No se pudo eliminar el caballo")
    }
  }

  return (
    <div className="flex gap-2">
      <Link href={`/caballos/${horseId}/editar`}>
        <Button variant="outline" className="gap-2 bg-white text-gray-700 hover:bg-gray-50 active:scale-[0.98]">
          <Edit className="h-4 w-4" /> Editar
        </Button>
      </Link>
      <ConfirmDialog
        title="Eliminar Caballo"
        description={`¿Estás seguro de eliminar a ${rp}?`}
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
