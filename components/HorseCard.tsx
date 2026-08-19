"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { deleteHorse, Horse } from "@/app/actions/horse.actions"
import { toast } from "sonner"
import { Trash2, ChevronRight, Image as ImageIcon } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface HorseCardProps {
  horse: Horse
}

export function HorseCard({ horse }: HorseCardProps) {
  const handleDelete = async () => {
    const { success, error } = await deleteHorse(horse.id)
    if (success) {
      toast.success("Caballo eliminado correctamente")
    } else {
      toast.error(error || "No se pudo eliminar el caballo")
    }
  }

  return (
    <Card className="flex flex-col justify-between overflow-hidden transition-all duration-200 hover:shadow-md hover:border-gray-300 animate-in fade-in zoom-in-95">
      {horse.photo_url ? (
        <div className="w-full h-48 bg-gray-200">
          <img src={horse.photo_url} alt={horse.rp} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
          <ImageIcon className="h-16 w-16 text-gray-300" />
        </div>
      )}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 bg-white pb-4 pt-5 border-b">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">RP / Nombre</span>
          <span className="text-2xl font-bold text-black">{horse.rp}</span>
        </div>
        <ConfirmDialog
          title="Eliminar Caballo"
          description={`¿Estás seguro de eliminar a ${horse.rp}?`}
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
            <span className="text-xs text-gray-500 mb-1">Sexo</span>
            <span className="text-sm font-semibold text-gray-900">
              {horse.sex || "--"}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 mb-1">Nacimiento</span>
            <span className="text-sm font-medium text-gray-900">
              {horse.birth_date ? format(new Date(horse.birth_date), "dd/MM/yyyy") : "--"}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 pt-4 bg-white border-t">
        <Link href={`/caballos/${horse.id}`} className="w-full">
          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-100 h-12 text-base font-semibold text-gray-900 hover:bg-gray-200 transition-all duration-150 border border-gray-200 active:scale-[0.98]">
            Ver Ficha Completa
            <ChevronRight className="h-5 w-5" />
          </button>
        </Link>
      </CardFooter>
    </Card>
  )
}
