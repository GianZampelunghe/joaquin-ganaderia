import { getHorses } from "@/app/actions/horse.actions"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { HorseListClient } from "./HorseListClient"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function CaballosPage() {
  const horses = await getHorses()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Caballos</h2>
        <Link href="/caballos/nuevo" className="w-full sm:w-auto">
          <Button className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-6 text-lg sm:py-4 sm:text-base">
            <Plus className="h-5 w-5" />
            + Cargar Caballo
          </Button>
        </Link>
      </div>

      <HorseListClient horses={horses || []} />
    </div>
  )
}
