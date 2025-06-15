
-- Crear bucket público para avatars (imágenes de perfil y cursos)
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true);

-- (Opcional) Puedes repetir la creación con diferentes nombres si quieres separar los buckets para cursos, eventos, etc., pero generalmente con uno es suficiente.

-- Asegurarse de que el bucket 'avatars' tenga permisos públicos (esto ya lo hace la propiedad 'public=true').
