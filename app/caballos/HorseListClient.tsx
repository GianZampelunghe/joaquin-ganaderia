"use client"

import { useState } from "react"
import { HorseCard } from "@/components/HorseCard"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Horse } from "@/app/actions/horse.actions"

export function HorseListClient({ horses }: { horses: Horse[] }) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredHorses = horses.filter(horse => 
    horse.rp.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input 
          type="search" 
          placeholder="Buscar por RP o nombre..." 
          className="w-full pl-10 py-6 text-lg rounded-xl border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 uppercase"
          value={searchTerm}
          autoCapitalize="characters"
          onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
        />
      </div>

      {!filteredHorses?.length ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-white py-12 text-center">
          <p className="text-lg font-medium text-gray-900">
            {searchTerm ? "No se encontraron resultados" : "No hay caballos registrados"}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? "Intenta con otro RP." : "Comienza agregando tu primer caballo."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredHorses.map((horse) => (
            <HorseCard key={horse.id} horse={horse} />
          ))}
        </div>
      )}
    </div>
  )
}
