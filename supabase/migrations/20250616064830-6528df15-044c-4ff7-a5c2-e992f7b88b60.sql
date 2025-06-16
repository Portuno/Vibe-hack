
-- Agregar la columna 'vertical' a la tabla courses para que coincida con el formulario
ALTER TABLE public.courses ADD COLUMN vertical text;

-- Opcional: migrar datos existentes de category a vertical si es necesario
UPDATE public.courses SET vertical = category WHERE vertical IS NULL AND category IS NOT NULL;
