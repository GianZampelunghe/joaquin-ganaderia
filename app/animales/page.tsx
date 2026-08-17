import { getAnimals, deleteAnimal } from "@/app/actions/animal.actions"
import { AnimalCard } from "@/components/AnimalCard"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { AnimalListClient } from "./AnimalListClient"

export const dynamic = "force-dynamic"
export const revalidate = 0

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

      {error ? (
        <div className="rounded-xl bg-red-50 p-4 text-red-800">
          <p>{error}</p>
        </div>
      ) : (
        <AnimalListClient animals={animals || []} />
      )}
    </div>
  )
}
