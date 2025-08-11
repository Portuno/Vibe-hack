-- Función segura para obtener el conteo total de inscripciones
-- No expone datos sensibles; sólo devuelve un número
CREATE OR REPLACE FUNCTION public.get_hackathon_registrations_count()
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::integer FROM public.hackathon_registrations;
$$;

-- Conceder permisos de ejecución a los roles públicos
GRANT EXECUTE ON FUNCTION public.get_hackathon_registrations_count() TO anon, authenticated;
