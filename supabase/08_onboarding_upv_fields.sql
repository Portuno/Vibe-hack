-- Agrega columnas para capturar si es estudiante de la UPV y su escuela/facultad
-- NO ejecutar automáticamente; el usuario correrá este script manualmente.

-- 1) Agregar columnas si no existen
alter table if exists public.hackathon_registrations
  add column if not exists is_upv_student boolean default false,
  add column if not exists upv_school text;

-- 2) Actualizar políticas (si es necesario) para permitir insertar/seleccionar estos campos
-- Nota: Asumimos que ya existen políticas permisivas para insert/select.
-- Si tu configuración requiere añadir columnas a las políticas explícitamente, ajusta aquí.

-- 3) Comentarios para documentación
comment on column public.hackathon_registrations.is_upv_student is 'Indica si la persona es estudiante de la UPV';
comment on column public.hackathon_registrations.upv_school is 'Escuela o facultad de la UPV a la que pertenece';


