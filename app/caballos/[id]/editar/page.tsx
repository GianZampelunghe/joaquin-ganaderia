import { getHorseById } from "@/app/actions/horse.actions"
import { HorseForm } from "@/components/HorseForm"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function EditarCaballoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: horse, error } = await getHorseById(id)

  if (error || !horse) {
    return (
      <div className="flex flex-col gap-6 max-w-2xl mx-auto">
        <Link href={`/caballos/${id}`}>
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
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href={`/caballos/${id}`}>
          <Button variant="ghost" className="gap-2">
            <ChevronLeft className="h-4 w-4" /> Volver
          </Button>
        </Link>
        <h2 className="text-2xl font-bold text-gray-900">Editar Caballo {horse.rp}</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <HorseForm initialData={horse} />
      </div>
    </div>
  )
}
