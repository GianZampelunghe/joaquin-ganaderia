"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { Database } from "@/types/database.types"

export type AnimalWithRelations = Database['public']['Tables']['animals']['Row'] & {
  weights?: { id?: string, weight_kg: number; recorded_at: string, notes?: string | null }[] | null,
  vaccines?: { id: string; applied: boolean; vaccine_type: string | null; applied_at: string }[] | null
}

/**
 * Obtiene la lista completa de animales ordenados por fecha de actualización
 */
export async function getAnimals() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('animals')
      .select(`
        *,
        weights (*),
        vaccines (*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error en Supabase getAnimals:', error.message, error.details);
      // Fallback a consulta plana simple si falla el join
      const { data: fallbackData } = await supabase.from('animals').select('*');
      return (fallbackData as unknown as AnimalWithRelations[]) || [];
    }

    return (data as unknown as AnimalWithRelations[]) || [];
  } catch (err) {
    console.error('Excepción en getAnimals:', err);
    return [];
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
          recorded_at,
          notes
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

    if (error) {
      console.error(`Error en Supabase getAnimalById ${id}:`, error.message, error.details)
      // Fallback a consulta plana simple si falla el join
      const { data: fallbackData } = await supabase.from('animals').select('*').eq('id', id).single()
      return { data: (fallbackData as unknown as AnimalWithRelations) || null, error: null }
    }

    return { data: data as unknown as AnimalWithRelations, error: null }
  } catch (error) {
    console.error(`Excepción en getAnimalById ${id}:`, error)
    return { data: null, error: "No se pudo cargar el animal." }
  }
}

/**
 * Agrega un nuevo pesaje a un animal
 */
export async function addQuickWeight(animalId: string, weightKg: number, notes?: string, recordedAt?: string) {
  try {
    const supabase = await createClient()
    const { data, error } = (await supabase
      .from("weights")
      .insert({
        animal_id: animalId,
        weight_kg: weightKg,
        notes: notes || null,
        recorded_at: recordedAt || new Date().toISOString()
      } as any)
      .select()
      .single()) as any

    if (error) throw error
    
    // Actualizar updated_at del animal
    await (supabase.from("animals").update as any)({ updated_at: new Date().toISOString() }).eq("id", animalId)

    revalidatePath("/animales")
    revalidatePath(`/animales/${animalId}`)
    revalidatePath("/")
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
    revalidatePath("/")
    return { success: true, error: null }
  } catch (error) {
    console.error(`Error deleting animal ${id}:`, error)
    return { success: false, error: "No se pudo eliminar el animal." }
  }
}

export async function deleteWeight(id: string, animalId: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from("weights").delete().eq("id", id)
    if (error) throw error
    revalidatePath(`/animales/${animalId}`)
    revalidatePath("/animales")
    revalidatePath("/")
    return { success: true, error: null }
  } catch (error) {
    console.error("Error deleting weight:", error)
    return { success: false, error: "Error al eliminar pesaje." }
  }
}

export async function updateAnimal(id: string, data: any) {
  try {
    const supabase = await createClient()
    const { error } = await (supabase.from("animals").update as any)(data).eq("id", id)

    if (error) throw error
    revalidatePath("/animales")
    revalidatePath(`/animales/${id}`)
    revalidatePath("/")
    return { success: true, data: { id } }
  } catch (error: any) {
    console.error("Error updating animal:", error)
    return { success: false, error: error?.message || "Error al actualizar." }
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
      .maybeSingle()
      
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
    revalidatePath("/")
    return { success: true, data: newAnimal }
  } catch (error: any) {
    console.error("Error creating animal:", error)
    return { success: false, error: error?.message || "Ocurrió un error al crear el animal." }
  }
}

export async function uploadAnimalPhoto(animalId: string, formData: FormData) {
  try {
    const file = formData.get("file") as File
    if (!file) return { success: false, error: "No file provided" }

    const supabase = await createClient()
    
    const fileExt = file.name.split('.').pop()
    const fileName = `${animalId}-${Date.now()}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('animal-photos')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('animal-photos')
      .getPublicUrl(filePath)

    // Update animal record
    const { error: updateError } = await (supabase.from('animals').update as any)({ photo_url: publicUrl }).eq('id', animalId)
    
    if (updateError) throw updateError

    revalidatePath("/animales")
    revalidatePath(`/animales/${animalId}`)
    revalidatePath("/")
    return { success: true, photo_url: publicUrl }
  } catch (error: any) {
    console.error("Error uploading photo:", error)
    return { success: false, error: "No se pudo subir la foto." }
  }
}
