import { getHorseById } from "@/app/actions/horse.actions"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Info, Activity } from "lucide-react"
import { HorseActions } from "./HorseActions"
import Link from "next/link"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export const dynamic = 'force-dynamic'

export default async function CaballoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: horse, error } = await getHorseById(id)

  if (error || !horse) {
    return (
      <div className="flex flex-col gap-6 max-w-2xl mx-auto">
        <Link href="/caballos">
          <Button variant="ghost" className="gap-2">
            <ChevronLeft className="h-4 w-4" /> Volver
          </Button>
        </Link>
        <div className="rounded-xl bg-red-50 p-4 text-red-800">
          <p>{error || "Caballo no encontrado"}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/caballos" className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
          <ChevronLeft className="h-6 w-6 text-gray-700" />
        </Link>
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-gray-900 leading-none">{horse.rp}</h2>
          <span className="text-sm text-gray-500 mt-1">
            Actualizado el {format(new Date(horse.updated_at), "d MMM yyyy HH:mm", { locale: es })}
          </span>
        </div>
        <div className="ml-auto">
          <HorseActions horseId={horse.id} rp={horse.rp} />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {horse.photo_url && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-64 md:h-96 relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={horse.photo_url} alt={horse.rp} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold border-b pb-2 mb-4 flex items-center gap-2">
            <Info className="h-5 w-5 text-gray-400" /> Datos Generales
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Nacimiento</span>
              <span className="font-medium text-lg">
                {horse.birth_date ? format(new Date(horse.birth_date), "dd/MM/yyyy") : "--"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Sexo</span>
              <span className="font-medium text-lg">
                {horse.sex || "--"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Padre</span>
              <span className="font-medium text-lg">
                {horse.father || "--"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Madre</span>
              <span className="font-medium text-lg">
                {horse.mother || "--"}
              </span>
            </div>
          </div>
          
          {horse.service_notes && (
            <div className="mt-6 pt-4 border-t">
              <h3 className="text-lg font-bold border-b pb-2 mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-gray-400" /> Servicio / Sanidad
              </h3>
              <p className="text-gray-800 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border border-gray-100">
                {horse.service_notes}
              </p>
            </div>
          )}

          {horse.observations && (
            <div className="mt-6 pt-4 border-t">
              <span className="text-sm text-gray-500 block mb-1 font-semibold">Observaciones</span>
              <p className="text-gray-800 whitespace-pre-wrap">{horse.observations}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
