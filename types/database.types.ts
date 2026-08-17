export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      animals: {
        Row: {
          id: string
          caravana_number: string
          birth_date: string | null
          weight_birth: number | null
          weight_weaning: number | null
          weight_15_20_months: number | null
          observations: string | null
          photo_url: string | null
          genealogy: Json
          health_data: Json
          custom_fields: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          caravana_number: string
          birth_date?: string | null
          weight_birth?: number | null
          weight_weaning?: number | null
          weight_15_20_months?: number | null
          observations?: string | null
          photo_url?: string | null
          genealogy?: Json
          health_data?: Json
          custom_fields?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          caravana_number?: string
          birth_date?: string | null
          weight_birth?: number | null
          weight_weaning?: number | null
          weight_15_20_months?: number | null
          observations?: string | null
          photo_url?: string | null
          genealogy?: Json
          health_data?: Json
          custom_fields?: Json
          created_at?: string
          updated_at?: string
        }
      }
      weights: {
        Row: {
          id: string
          animal_id: string
          weight_kg: number
          recorded_at: string
          notes: string | null
        }
        Insert: {
          id?: string
          animal_id: string
          weight_kg: number
          recorded_at?: string
          notes?: string | null
        }
        Update: {
          id?: string
          animal_id?: string
          weight_kg?: number
          recorded_at?: string
          notes?: string | null
        }
      }
      vaccines: {
        Row: {
          id: string
          animal_id: string
          applied: boolean
          vaccine_type: string | null
          applied_at: string
        }
        Insert: {
          id?: string
          animal_id: string
          applied?: boolean
          vaccine_type?: string | null
          applied_at?: string
        }
        Update: {
          id?: string
          animal_id?: string
          applied?: boolean
          vaccine_type?: string | null
          applied_at?: string
        }
      }
      global_custom_columns: {
        Row: {
          id: string
          column_name: string
          column_type: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          column_name: string
          column_type: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          column_name?: string
          column_type?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
