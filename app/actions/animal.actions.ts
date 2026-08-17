"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { Database } from "@/types/database.types"

export type AnimalWithRelations = Database['public']['Tables']['animals']['Row'] & {
  weights?: { id?: string, weight_kg: number; recorded_at: string }[] | null,
  vaccines?: { id: string; applied: boolean; vaccine_type: string | null; applied_at: string }[] | null
}

/**
 * Obtiene la lista completa de animales ordenados por fecha de actualización
 */
export async function getAnimals() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("animals")
      .select(`
        *,
        weights (
          weight_kg,
          recorded_at
        )
      `)
      .order('updated_at', { ascending: false })

    if (error) throw error
    return { data: data as unknown as AnimalWithRelations[], error: null }
  } catch (error) {
    console.error("Error fetching animals:", error)
    return { data: null, error: "No se pudieron cargar los animales." }
  }
}

/**
 * Obtiene un animal por ID
 */
export async function getAnimalById(id: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("animals")
      .select(`
        *,
        weights (
          id,
          weight_kg,
          recorded_at
        ),
        vaccines (
          id,
          applied,
          vaccine_type,
          applied_at
        )
      `)
      .eq("id", id)
      .single()

    if (error) throw error
    return { data: data as unknown as AnimalWithRelations, error: null }
  } catch (error) {
    console.error(`Error fetching animal ${id}:`, error)
    return { data: null, error: "No se pudo cargar el animal." }
  }
}

/**
 * Agrega un pesaje rápido a un animal
 */
export async function addQuickWeight(animalId: string, weightKg: number) {
  try {
    const supabase = await createClient()
    const { data, error } = (await supabase
      .from("weights")
      .insert({
        animal_id: animalId,
        weight_kg: weightKg,
      } as any)
      .select()
      .single()) as any

    if (error) throw error
    
    // Actualizar updated_at del animal
    await (supabase.from("animals").update as any)({ updated_at: new Date().toISOString() }).eq("id", animalId)

    revalidatePath("/animales")
    revalidatePath(`/animales/${animalId}`)
    return { success: true, error: null }
  } catch (error) {
    console.error("Error adding quick weight:", error)
    return { success: false, error: "Hubo un error al guardar el pesaje." }
  }
}

/**
 * Elimina un animal y todos sus registros asociados
 */
export async function deleteAnimal(id: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from("animals")
      .delete()
      .eq("id", id)

    if (error) throw error
    
    revalidatePath("/animales")
    return { success: true, error: null }
  } catch (error) {
    console.error(`Error deleting animal ${id}:`, error)
    return { success: false, error: "No se pudo eliminar el animal." }
  }
}

export async function createAnimal(data: {
  caravana_number: string;
  birth_date?: string | null;
  weight_birth?: number | null;
  weight_weaning?: number | null;
  weight_15_20_months?: number | null;
  observations?: string | null;
  genealogy?: { pelaje_padre: string; pelaje_madre: string; pelaje_abuelo: string; genetica: string };
  health_data?: any;
  custom_fields?: any;
  current_weight?: number | null;
  has_vaccine?: boolean;
  vaccine_type?: string;
  vaccine_date?: string;
}) {
  try {
    const supabase = await createClient()

    // 1. Verificar si la caravana ya existe
    const { data: existing } = await supabase
      .from("animals")
      .select("id")
      .eq("caravana_number", data.caravana_number)
      .single()
      
    if (existing) {
      return { success: false, error: "El número de caravana ya existe." }
    }

    // 2. Insertar animal
    const { data: newAnimal, error: animalError } = (await supabase
      .from("animals")
      .insert({
        caravana_number: data.caravana_number,
        birth_date: data.birth_date || null,
        weight_birth: data.weight_birth || null,
        weight_weaning: data.weight_weaning || null,
        weight_15_20_months: data.weight_15_20_months || null,
        observations: data.observations || null,
        genealogy: data.genealogy || { pelaje_padre: "", pelaje_madre: "", pelaje_abuelo: "", genetica: "" },
        health_data: data.health_data || {},
        custom_fields: data.custom_fields || {}
      } as any)
      .select()
      .single()) as any

    if (animalError) throw animalError

    // 3. Insertar pesaje actual si se proporcionó
    if (data.current_weight) {
      const { error: weightError } = await supabase
        .from("weights")
        .insert({
          animal_id: newAnimal.id,
          weight_kg: data.current_weight
        } as any)
      if (weightError) console.error("Error saving initial weight:", weightError)
    }

    // 4. Insertar vacuna si se aplicó
    if (data.has_vaccine && data.vaccine_type) {
      const { error: vaccineError } = await supabase
        .from("vaccines")
        .insert({
          animal_id: newAnimal.id,
          applied: true,
          vaccine_type: data.vaccine_type,
          applied_at: data.vaccine_date || new Date().toISOString()
        } as any)
      if (vaccineError) console.error("Error saving initial vaccine:", vaccineError)
    }

    revalidatePath("/animales")
    return { success: true, error: null, id: newAnimal.id }
  } catch (error: any) {
    console.error("Error creating animal:", error)
    return { success: false, error: error?.message || "Ocurrió un error al crear el animal." }
  }
}

