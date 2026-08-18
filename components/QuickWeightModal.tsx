"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { addQuickWeight } from "@/app/actions/animal.actions"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Scale } from "lucide-react"
import { differenceInMonths } from "date-fns"

interface QuickWeightModalProps {
  animalId: string
  caravana: string
  birthDate?: string | null
  lastWeightDate?: string | null
}

export function QuickWeightModal({ animalId, caravana, birthDate, lastWeightDate }: QuickWeightModalProps) {
  const [open, setOpen] = useState(false)
  const [weight, setWeight] = useState("")
  const [notes, setNotes] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [suggestion, setSuggestion] = useState("")
  const [autoCompleteNote, setAutoCompleteNote] = useState("")

  useEffect(() => {
    if (open) {
      setWeight("")
      setDate(new Date().toISOString().split("T")[0])
      setNotes("")
    }
  }, [open])

  useEffect(() => {
    if (!date) return;
    
    const selectedDate = new Date(date)
    const referenceDateStr = lastWeightDate || birthDate
    
    if (referenceDateStr) {
      const referenceDate = new Date(referenceDateStr)
      
      // Validation: block if date is before birthDate
      if (birthDate && selectedDate < new Date(birthDate)) {
        setSuggestion("⚠️ La fecha seleccionada no puede ser anterior a la fecha de nacimiento.")
        setAutoCompleteNote("")
        return
      }

      const diffTime = Math.abs(selectedDate.getTime() - referenceDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays >= 30) {
        const months = Math.round(diffDays / 30.4)
        setSuggestion(`💡 Pasaron ${months} meses desde el ${lastWeightDate ? "último pesaje" : "nacimiento"} (${referenceDate.toLocaleDateString('es-AR')}).`)
        setAutoCompleteNote(`Pesaje a los ${months} meses`)
      } else {
        setSuggestion(`💡 Pasaron ${diffDays} días desde el ${lastWeightDate ? "último pesaje" : "nacimiento"} (${referenceDate.toLocaleDateString('es-AR')}).`)
        setAutoCompleteNote(`Control tras ${diffDays} días`)
      }
    } else {
      setSuggestion("")
      setAutoCompleteNote("")
    }
  }, [date, lastWeightDate, birthDate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!weight) return

    if (birthDate && new Date(date) < new Date(birthDate)) {
      toast.error("⚠️ La fecha de pesaje no puede ser anterior a la fecha de nacimiento.")
      return
    }

    setIsSubmitting(true)
    const formattedWeight = parseFloat(weight.replace(",", "."))
    const formattedDate = new Date(date).toISOString()
    
    // Autocompletar nota si está vacía
    const finalNotes = notes.trim() === "" ? autoCompleteNote : notes

    const { success, error } = await addQuickWeight(animalId, formattedWeight, finalNotes, formattedDate)
    setIsSubmitting(false)

    if (success) {
      toast.success("Pesaje guardado correctamente")
      setOpen(false)
    } else {
      toast.error(error || "Error al guardar")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="outline" size="sm" className="w-full gap-2 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 border-emerald-200 h-12 rounded-xl active:scale-[0.98]">
          <Scale className="h-5 w-5" />
          + Nuevo Pesaje
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] w-[95vw] rounded-2xl bg-white p-6">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-bold text-gray-900">Registrar Nuevo Pesaje</DialogTitle>
            <DialogDescription className="text-base text-gray-600 mt-1">
              Caravana: <strong className="text-gray-900 font-bold bg-gray-100 px-2 py-1 rounded">{caravana}</strong>
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-5 py-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="weight" className="text-sm font-semibold text-gray-700">
                Peso actual
              </Label>
              <div className="relative">
                <Input
                  id="weight"
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9]*[.,]?[0-9]*"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Ej. 250"
                  className="text-lg py-6 pr-12 focus-visible:ring-emerald-500"
                  required
                  autoFocus
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold pointer-events-none">kg</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="date" className="text-sm font-semibold text-gray-700">
                Fecha del Pesaje
              </Label>
              <Input
                id="date"
                type="date"
                min={birthDate ? new Date(birthDate).toISOString().split("T")[0] : undefined}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="text-lg py-6 focus-visible:ring-emerald-500"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="notes" className="text-sm font-semibold text-gray-700">
                Etiqueta / Notas (Opcional)
              </Label>
              <Input
                id="notes"
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej. Destete, Ingreso..."
                className="text-base py-6 focus-visible:ring-emerald-500"
              />
              {suggestion && (
                <div 
                  className={`mt-1 p-2 rounded-lg text-sm cursor-pointer transition-colors ${suggestion.includes('⚠️') ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'}`}
                  onClick={() => {
                    if (autoCompleteNote && !suggestion.includes('⚠️')) {
                      setNotes(autoCompleteNote)
                    }
                  }}
                >
                  {suggestion}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-3 mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="text-base py-6 rounded-xl border-gray-200 w-full sm:w-auto text-gray-600 hover:bg-gray-50 active:scale-[0.98]"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="text-base py-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto active:scale-[0.98] shadow-sm"
            >
              {isSubmitting ? "Guardando..." : "Guardar Pesaje"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
