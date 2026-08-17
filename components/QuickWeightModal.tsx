"use client"

import { useState } from "react"
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

interface QuickWeightModalProps {
  animalId: string
  caravana: string
}

export function QuickWeightModal({ animalId, caravana }: QuickWeightModalProps) {
  const [open, setOpen] = useState(false)
  const [weight, setWeight] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!weight) return

    setIsSubmitting(true)
    const { success, error } = await addQuickWeight(animalId, parseFloat(weight))
    setIsSubmitting(false)

    if (success) {
      toast.success("Pesaje guardado correctamente")
      setOpen(false)
      setWeight("")
    } else {
      toast.error(error || "Error al guardar")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="outline" size="sm" className="w-full gap-2 text-green-700 hover:bg-green-50 hover:text-green-800">
          <Scale className="h-4 w-4" />
          Pesaje Rápido
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] w-[95vw] rounded-xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Nuevo Pesaje</DialogTitle>
            <DialogDescription className="text-base text-gray-600">
              Caravana: <strong className="text-black">{caravana}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-6">
            <div className="flex flex-col gap-3">
              <Label htmlFor="weight" className="text-lg">
                Peso actual (kg)
              </Label>
              <Input
                id="weight"
                type="number"
                inputMode="decimal"
                step="0.1"
                min="0"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Ej. 250.5"
                className="text-lg py-6"
                required
                autoFocus
              />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="text-lg py-6"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-green-500 hover:bg-green-600 text-lg py-6"
            >
              {isSubmitting ? "Guardando..." : "Guardar Pesaje"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
