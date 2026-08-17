"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface ConfirmDialogProps {
  title: string
  description?: string
  onConfirm: () => void
  trigger: React.ReactNode
  variant?: "danger" | "default"
}

export function ConfirmDialog({
  title,
  description = "¿Estás seguro de continuar con esta acción? Esta acción no se puede deshacer.",
  onConfirm,
  trigger,
  variant = "danger",
}: ConfirmDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent className="w-[90vw] max-w-md rounded-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4 flex-col gap-2 sm:flex-row sm:gap-0">
          <AlertDialogCancel className="mt-0 text-lg">Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={`text-lg font-medium ${
              variant === "danger" 
                ? "bg-red-500 hover:bg-red-600 text-white" 
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
