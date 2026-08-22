import Link from "next/link"
import { ChevronLeft, CircleDashed, ArrowRight } from "lucide-react"

// Definimos algunos íconos SVG para darle un toque temático
function CowIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 11c0 3.866 3 7 3 7h12s3-3.134 3-7V8.5C21 7.12 19.88 6 18.5 6A2.5 2.5 0 0 0 16 8.5V9" />
      <path d="M8 8.5A2.5 2.5 0 0 0 5.5 6C4.12 6 3 7.12 3 8.5V11" />
      <path d="M12 2v2" />
      <path d="M8 18v3" />
      <path d="M16 18v3" />
      <path d="M12 14v4" />
      <path d="M6 14v4" />
      <path d="M18 14v4" />
    </svg>
  )
}

function HorseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2c-3.31 0-6 2.69-6 6v4H4v3h2v7h3v-7h2v5h3v-5h2v7h3v-7h2v-3h-2V8c0-3.31-2.69-6-6-6z" />
    </svg>
  )
}


export default function CargarAnimalPage() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center gap-4 mb-4">
        <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
          <ChevronLeft className="h-6 w-6 text-gray-700" />
        </Link>
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">¿Qué deseas cargar?</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tarjeta Bovino */}
        <Link href="/animales/nueva" className="block group">
          <div className="flex flex-col h-full rounded-3xl border-2 border-emerald-200 bg-emerald-50 p-8 transition-all duration-200 hover:bg-emerald-100 hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-900/5 active:scale-[0.98]">
            <div className="flex items-center justify-between mb-8">
              <div className="bg-emerald-200/50 p-4 rounded-2xl">
                <CowIcon className="w-10 h-10 text-emerald-800" />
              </div>
              <ArrowRight className="w-6 h-6 text-emerald-400 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all" />
            </div>
            
            <div className="mt-auto">
              <h3 className="text-2xl font-bold text-emerald-950 mb-2">Cargar Bovino</h3>
              <p className="text-emerald-800/80 text-lg font-medium leading-snug">
                Registra un nuevo vacuno con su caravana, genealogía y datos sanitarios.
              </p>
            </div>
          </div>
        </Link>

        {/* Tarjeta Caballo */}
        <Link href="/caballos/nuevo" className="block group">
          <div className="flex flex-col h-full rounded-3xl border-2 border-[#BD6E3C]/30 bg-[#BD6E3C]/10 p-8 transition-all duration-200 hover:bg-[#BD6E3C]/20 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#BD6E3C]/10 active:scale-[0.98]">
            <div className="flex items-center justify-between mb-8">
              <div className="bg-[#BD6E3C]/20 p-4 rounded-2xl">
                <HorseIcon className="w-10 h-10 text-[#a05a2e]" />
              </div>
              <ArrowRight className="w-6 h-6 text-[#BD6E3C]/50 group-hover:text-[#904b20] group-hover:translate-x-1 transition-all" />
            </div>
            
            <div className="mt-auto">
              <h3 className="text-2xl font-bold text-[#7a3b16] mb-2">Cargar Caballo</h3>
              <p className="text-[#8c4921]/80 text-lg font-medium leading-snug">
                Registra un nuevo equino con su RP, pelaje, padres y servicio.
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
