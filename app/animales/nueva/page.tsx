import { AnimalForm } from "@/components/AnimalForm"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function NuevaCaravanaPage() {
  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/animales" className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
          <ChevronLeft className="h-6 w-6 text-gray-700" />
        </Link>
        <h2 className="text-2xl font-bold text-gray-900">Alta de Animal</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 sm:p-6">
          <AnimalForm />
        </div>
      </div>
    </div>
  )
}
