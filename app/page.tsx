import Link from "next/link";
import { getAnimals } from "@/app/actions/animal.actions";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { data: animals } = await getAnimals();

  return (
    <main className="min-h-screen bg-white text-black p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="border-b pb-4">
          <h1 className="text-3xl font-bold text-black">La Cañada</h1>
          <p className="text-gray-600 font-medium">Joaquín Castro - Gestión Ganadera</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link className="p-6 bg-emerald-100 hover:bg-emerald-200 border-2 border-emerald-500 rounded-xl text-black font-semibold text-xl text-center shadow-sm transition-all" href="/animales/nueva">
            + Cargar Nuevo Animal
          </Link>
          <Link className="p-6 bg-gray-100 hover:bg-gray-200 border-2 border-gray-400 rounded-xl text-black font-semibold text-xl text-center shadow-sm transition-all" href="/animales">
            📋 Ver Mis Animales ({animals?.length || 0})
          </Link>
        </div>
      </div>
    </main>
  );
}
