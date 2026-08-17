import { describe, it, expect } from 'vitest'
import { z } from 'zod'

// Simulamos los schemas que se usan en el formulario
const animalSchema = z.object({
  caravana_number: z.string().min(1, "El número de caravana es obligatorio"),
  current_weight: z.string().optional().refine(val => !val || !isNaN(Number(val)), "Debe ser un número"),
  pelaje_padre: z.string().min(1, "Obligatorio"),
})

describe('Validaciones de Animal', () => {
  it('Debe fallar si falta el número de caravana', () => {
    const result = animalSchema.safeParse({
      caravana_number: "",
      pelaje_padre: "Negro"
    })
    
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.errors[0].message).toBe("El número de caravana es obligatorio")
    }
  })

  it('Debe validar correctamente un animal completo', () => {
    const result = animalSchema.safeParse({
      caravana_number: "1234",
      current_weight: "250.5",
      pelaje_padre: "Negro"
    })
    
    expect(result.success).toBe(true)
  })

  it('Debe fallar si el peso no es un número válido', () => {
    const result = animalSchema.safeParse({
      caravana_number: "1234",
      current_weight: "abc",
      pelaje_padre: "Negro"
    })
    
    expect(result.success).toBe(false)
  })
})

describe('Cálculos de Pesajes', () => {
  it('Debe encontrar el pesaje más reciente', () => {
    const weights = [
      { weight_kg: 200, recorded_at: "2024-01-01T10:00:00Z" },
      { weight_kg: 250, recorded_at: "2024-03-01T10:00:00Z" },
      { weight_kg: 220, recorded_at: "2024-02-01T10:00:00Z" },
    ]

    const latestWeight = weights.reduce((prev, current) => 
      (new Date(prev.recorded_at) > new Date(current.recorded_at) ? prev : current)
    )

    expect(latestWeight.weight_kg).toBe(250)
  })
})
