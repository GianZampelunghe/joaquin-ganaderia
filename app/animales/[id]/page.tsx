import { getAnimalById } from "@/app/actions/animal.actions"
import { QuickWeightModal } from "@/components/QuickWeightModal"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Weight, Syringe, Calendar, Info, Activity } from "lucide-react"
import { AnimalActions } from "./AnimalActions"
import { WeightItem } from "./WeightItem"
import Link from "next/link"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default async function AnimalDetailPage({ params }: { params: { id: string } }) {
  const { data: animal, error } = await getAnimalById(params.id)

  if (error || !animal) {
    return (
      <div className="flex flex-col gap-6 max-w-2xl mx-auto">
        <Link href="/animales">
          <Button variant="ghost" className="gap-2">
            <ChevronLeft className="h-4 w-4" /> Volver
          </Button>
        </Link>
        <div className="rounded-xl bg-red-50 p-4 text-red-800">
          <p>{error || "Animal no encontrado"}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/animales" className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
          <ChevronLeft className="h-6 w-6 text-gray-700" />
        </Link>
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-gray-900 leading-none">Caravana {animal.caravana_number}</h2>
          <span className="text-sm text-gray-500 mt-1">
            Actualizado el {format(new Date(animal.updated_at), "d MMM yyyy HH:mm", { locale: es })}
          </span>
        </div>
        <div className="ml-auto">
          <AnimalActions animalId={animal.id} caravana={animal.caravana_number} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold border-b pb-2 mb-4 flex items-center gap-2">
              <Info className="h-5 w-5 text-gray-400" /> Datos Generales
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Nacimiento</span>
                <span className="font-medium text-lg">
                  {animal.birth_date ? format(new Date(animal.birth_date), "dd/MM/yyyy") : "--"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Genética</span>
                <span className="font-medium text-lg">
                  {((animal.genealogy as unknown) as { genetica: string })?.genetica || "--"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Pelaje Padre</span>
                <span className="font-medium text-lg">
                  {((animal.genealogy as unknown) as { pelaje_padre: string })?.pelaje_padre || "--"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Pelaje Madre</span>
                <span className="font-medium text-lg">
                  {((animal.genealogy as unknown) as { pelaje_madre: string })?.pelaje_madre || "--"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Pelaje Abuelo</span>
                <span className="font-medium text-lg">
                  {((animal.genealogy as unknown) as { pelaje_abuelo: string })?.pelaje_abuelo || "--"}
                </span>
              </div>
            </div>
            
            {animal.observations && (
              <div className="mt-6 pt-4 border-t">
                <span className="text-sm text-gray-500 block mb-1">Observaciones</span>
                <p className="text-gray-800 whitespace-pre-wrap">{animal.observations}</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold border-b pb-2 mb-4 flex items-center gap-2">
              <Syringe className="h-5 w-5 text-gray-400" /> Plan Sanitario
            </h3>
            {!animal.vaccines || animal.vaccines.length === 0 ? (
              <p className="text-gray-500">No hay vacunas registradas.</p>
            ) : (
              <div className="flex flex-col gap-3 mb-4">
                {animal.vaccines.map((v) => (
                  <div key={v.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <span className="font-medium text-gray-900">{v.vaccine_type}</span>
                    <span className="text-sm text-gray-500">
                      {format(new Date(v.applied_at), "dd/MM/yyyy")}
                    </span>
                  </div>
                ))}
              </div>
            )}
            
            {((animal.health_data as any)?.notes) && (
              <div className="mt-4 pt-4 border-t">
                <span className="text-sm text-gray-500 block mb-1">Notas Sanitarias</span>
                <p className="text-gray-800 whitespace-pre-wrap">{(animal.health_data as any).notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar (Weights) */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 bg-emerald-50 border-b border-emerald-100">
              <QuickWeightModal animalId={animal.id} caravana={animal.caravana_number} birthDate={animal.birth_date} />
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold border-b pb-2 mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-gray-400" /> Historial de Peso
              </h3>
              
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-2 pb-4 border-b">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Al Nacer</span>
                    <span className="font-medium">{animal.weight_birth || "--"} kg</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Al Destete</span>
                    <span className="font-medium">{animal.weight_weaning || "--"} kg</span>
                  </div>
                </div>

                <div className="flex flex-col mt-2">
                  <h4 className="text-sm font-semibold text-gray-600 mb-2">Pesajes Registrados</h4>
                  {!animal.weights || animal.weights.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">Sin registros</p>
                  ) : (
                    animal.weights
                      .sort((a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime())
                      .map((w) => (
                        <WeightItem key={w.id} weight={w} animalId={animal.id} />
                      ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
