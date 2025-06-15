
-- Función que crea un registro de perfil profesional al registrarse un usuario (en `auth.users`)
CREATE OR REPLACE FUNCTION public.handle_new_professional_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.professional_profiles (user_id, name, vertical, is_public)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'email', 'Sin nombre'),
    'Tecnología',      -- Ajusta este valor predeterminado si lo deseas
    true
  );
  RETURN NEW;
END;
$$;

-- Trigger para llamar a esa función al crear un nuevo usuario
DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_profile
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_professional_profile();
