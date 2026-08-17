import { Calculator, PlusCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default function CuentasPage() {
  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300 max-w-4xl mx-auto">
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Cuentas y Registro de Ventas</h1>
        <p className="text-gray-600 font-medium">Gestioná los ingresos, gastos y remates</p>
      </div>

      <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-2xl border-2 border-dashed border-gray-200 shadow-sm">
        <div className="bg-gray-50 p-6 rounded-full mb-6">
          <Calculator className="h-16 w-16 text-gray-400" />
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2">Aún no hay movimientos registrados</h3>
        <p className="text-gray-500 max-w-sm mb-8">
          Próximamente podrás registrar ventas de animales, gastos de vacunas, alimentación y mantener el balance general de La Cañada.
        </p>

        <button 
          disabled
          className="flex items-center gap-2 bg-emerald-600 opacity-50 cursor-not-allowed text-white px-6 py-4 rounded-xl font-bold text-lg"
        >
          <PlusCircle className="h-6 w-6" />
          Registrar Movimiento / Venta
        </button>
      </div>
    </div>
  );
}
