import { getAnimals, deleteAnimal } from "@/app/actions/animal.actions"
import { AnimalCard } from "@/components/AnimalCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function AnimalesPage() {
  const { data: animals, error } = await getAnimals()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Mis Animales</h2>
        <Link href="/animales/nueva" className="w-full sm:w-auto">
          <Button className="w-full gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-6 text-lg sm:py-4 sm:text-base">
            <Plus className="h-5 w-5" />
            Nueva Caravana
          </Button>
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input 
          type="search" 
          placeholder="Buscar por número de caravana..." 
          className="w-full pl-10 py-6 text-lg rounded-xl border-gray-300 focus:border-green-500 focus:ring-green-500"
          // In a real app, this would be a client component or use URL search params
        />
      </div>

      {error ? (
        <div className="rounded-xl bg-red-50 p-4 text-red-800">
          <p>{error}</p>
        </div>
      ) : !animals?.length ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-white py-12 text-center">
          <p className="text-lg font-medium text-gray-900">No hay animales registrados</p>
          <p className="mt-1 text-sm text-gray-500">Comienza agregando tu primera caravana.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {animals.map((animal) => (
            <AnimalCard key={animal.id} animal={animal} />
          ))}
        </div>
      )}
    </div>
  )
}
