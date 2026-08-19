"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { Database } from "@/types/database.types"

export type Horse = Database['public']['Tables']['horses']['Row']

export async function getHorses() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('horses')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error en getHorses:', error)
      return []
    }
    return (data as unknown as Horse[]) || []
  } catch (err) {
    console.error('Excepción en getHorses:', err)
    return []
  }
}

export async function getHorseById(id: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('horses')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error(`Error en getHorseById ${id}:`, error)
      return { data: null, error: "No se pudo cargar el caballo." }
    }
    return { data: data as unknown as Horse, error: null }
  } catch (err) {
    console.error(`Excepción en getHorseById ${id}:`, err)
    return { data: null, error: "Excepción al cargar el caballo." }
  }
}

export async function createHorse(data: {
  rp: string
  birth_date?: string | null
  father?: string | null
  mother?: string | null
  sex?: string | null
  service_notes?: string | null
  observations?: string | null
}) {
  try {
    const supabase = await createClient()

    const { data: newHorse, error } = await supabase
      .from('horses')
      .insert(data as any)
      .select()
      .single()

    if (error) throw error

    revalidatePath('/caballos')
    revalidatePath('/')
    return { success: true, data: newHorse as unknown as Horse }
  } catch (error: any) {
    console.error("Error creating horse:", error)
    return { success: false, error: error?.message || "Error al crear caballo." }
  }
}

export async function updateHorse(id: string, data: any) {
  try {
    const supabase = await createClient()
    const { error } = await (supabase.from('horses').update as any)(data).eq('id', id)

    if (error) throw error

    revalidatePath('/caballos')
    revalidatePath(`/caballos/${id}`)
    revalidatePath('/')
    return { success: true, data: { id } }
  } catch (error: any) {
    console.error("Error updating horse:", error)
    return { success: false, error: error?.message || "Error al actualizar caballo." }
  }
}

export async function deleteHorse(id: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('horses').delete().eq('id', id)

    if (error) throw error

    revalidatePath('/caballos')
    revalidatePath('/')
    return { success: true, error: null }
  } catch (error) {
    console.error(`Error deleting horse ${id}:`, error)
    return { success: false, error: "No se pudo eliminar el caballo." }
  }
}

export async function uploadHorsePhoto(horseId: string, formData: FormData) {
  try {
    const file = formData.get("file") as File
    if (!file) return { success: false, error: "No file provided" }

    const supabase = await createClient()
    
    const fileExt = file.name.split('.').pop()
    const fileName = `horse-${horseId}-${Date.now()}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('animal-photos') // reuse the same bucket
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('animal-photos')
      .getPublicUrl(filePath)

    const { error: updateError } = await (supabase.from('horses').update as any)({ photo_url: publicUrl }).eq('id', horseId)
    
    if (updateError) throw updateError

    revalidatePath("/caballos")
    revalidatePath(`/caballos/${horseId}`)
    return { success: true, photo_url: publicUrl }
  } catch (error: any) {
    console.error("Error uploading horse photo:", error)
    return { success: false, error: "No se pudo subir la foto." }
  }
}
