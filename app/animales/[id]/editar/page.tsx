import { getAnimalById } from "@/app/actions/animal.actions"
import { AnimalForm } from "@/components/AnimalForm"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditarAnimalPage({ params }: PageProps) {
  const { id } = await params
  const { data: animal, error } = await getAnimalById(id)

  if (error || !animal) {
    return (
      <div className="flex flex-col gap-6 max-w-2xl mx-auto">
        <Link href="/animales">
          <Button variant="ghost" className="gap-2">
            <ChevronLeft className="h-4 w-4" /> Volver a mis animales
          </Button>
        </Link>
        <div className="rounded-xl bg-red-50 p-4 text-red-800">
          <p>{error || "Animal no encontrado"}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-300">
      <div className="flex items-center gap-4 border-b pb-4">
        <Link href={`/animales/${animal.id}`} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
          <ChevronLeft className="h-6 w-6 text-gray-700" />
        </Link>
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-gray-900 leading-none">Editar Ficha</h1>
          <span className="text-sm text-gray-500 mt-1">Caravana {animal.caravana_number}</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <AnimalForm initialData={animal} />
      </div>
    </div>
  )
}
