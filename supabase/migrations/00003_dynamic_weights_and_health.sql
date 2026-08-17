-- Agregar columna 'notes' a la tabla weights
ALTER TABLE public.weights 
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Opcional: Eliminar la columna weight_15_20_months de animals 
-- (Comentado para evitar pérdida accidental de datos en producción sin respaldo)
-- ALTER TABLE public.animals DROP COLUMN IF EXISTS weight_15_20_months;
