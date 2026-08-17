import Link from "next/link";
import { getAnimals } from "@/app/actions/animal.actions";
import { PlusCircle, Search, FileText, Activity, Syringe, Scale } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const animals = await getAnimals();
  const animalCount = animals?.length || 0;
  
  const totalWeighings = animals?.reduce((acc, animal) => acc + (animal.weights?.length || 0), 0) || 0;
  const vaccinatedCount = animals?.filter(a => a.vaccines && a.vaccines.length > 0).length || 0;

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Resumen General</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 flex flex-col items-center text-center">
            <div className="bg-emerald-100 p-2 rounded-full mb-2">
              <Activity className="h-6 w-6 text-emerald-700" />
            </div>
            <span className="text-3xl font-black text-emerald-900">{animalCount}</span>
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mt-1">Animales</span>
          </div>
          
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 flex flex-col items-center text-center">
            <div className="bg-blue-100 p-2 rounded-full mb-2">
              <Scale className="h-6 w-6 text-blue-700" />
            </div>
            <span className="text-3xl font-black text-blue-900">{totalWeighings}</span>
            <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider mt-1">Pesajes</span>
          </div>

          <div className="bg-purple-50 rounded-xl p-4 border border-purple-100 flex flex-col items-center text-center col-span-2 md:col-span-1">
            <div className="bg-purple-100 p-2 rounded-full mb-2">
              <Syringe className="h-6 w-6 text-purple-700" />
            </div>
            <span className="text-3xl font-black text-purple-900">{vaccinatedCount}</span>
            <span className="text-xs font-semibold text-purple-700 uppercase tracking-wider mt-1">Vacunados</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link 
          href="/animales/nueva"
          className="flex items-center gap-4 p-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl shadow-sm transition-all duration-200 active:scale-[0.98] group"
        >
          <div className="bg-white/20 p-3 rounded-xl group-hover:scale-110 transition-transform">
            <PlusCircle className="h-8 w-8" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl">Cargar Nuevo Animal</span>
            <span className="text-emerald-100 text-sm">Registrar nueva caravana</span>
          </div>
        </Link>

        <Link 
          href="/animales"
          className="flex items-center gap-4 p-6 bg-white hover:bg-gray-50 border-2 border-gray-200 rounded-2xl shadow-sm transition-all duration-200 active:scale-[0.98] group hover:border-gray-300"
        >
          <div className="bg-gray-100 p-3 rounded-xl text-gray-600 group-hover:scale-110 transition-transform">
            <Search className="h-8 w-8" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl text-gray-900">Buscar por Caravana</span>
            <span className="text-gray-500 text-sm">Ver listado de mis animales</span>
          </div>
        </Link>

        <Link 
          href="/cuentas"
          className="flex items-center gap-4 p-6 bg-white hover:bg-gray-50 border-2 border-gray-200 rounded-2xl shadow-sm transition-all duration-200 active:scale-[0.98] group hover:border-gray-300 md:col-span-2"
        >
          <div className="bg-gray-100 p-3 rounded-xl text-gray-600 group-hover:scale-110 transition-transform">
            <FileText className="h-8 w-8" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl text-gray-900">Registro de Cuentas</span>
            <span className="text-gray-500 text-sm">Gestión de ventas y gastos</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
