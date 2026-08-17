"use client"

import { useState } from "react"
import { AnimalCard } from "@/components/AnimalCard"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function AnimalListClient({ animals }: { animals: any[] }) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredAnimals = animals.filter(animal => 
    animal.caravana_number.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input 
          type="search" 
          placeholder="Buscar por número de caravana..." 
          className="w-full pl-10 py-6 text-lg rounded-xl border-gray-300 focus:border-green-500 focus:ring-green-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {!filteredAnimals?.length ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-white py-12 text-center">
          <p className="text-lg font-medium text-gray-900">
            {searchTerm ? "No se encontraron resultados" : "No hay animales registrados"}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? "Intenta con otro número de caravana." : "Comienza agregando tu primera caravana."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAnimals.map((animal) => (
            <AnimalCard key={animal.id} animal={animal} />
          ))}
        </div>
      )}
    </div>
  )
}
