
-- Habilitar RLS en la tabla courses (si no está ya habilitado)
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Política para que los usuarios puedan ver cursos publicados
CREATE POLICY "Anyone can view published courses" 
ON public.courses 
FOR SELECT 
USING (status = 'publicado');

-- Política para que los usuarios autenticados puedan crear sus propios cursos
CREATE POLICY "Authenticated users can create courses" 
ON public.courses 
FOR INSERT 
TO authenticated
WITH CHECK (creator_id = auth.uid());

-- Política para que los usuarios puedan actualizar sus propios cursos
CREATE POLICY "Users can update their own courses" 
ON public.courses 
FOR UPDATE 
TO authenticated
USING (creator_id = auth.uid());

-- Política para que los usuarios puedan eliminar sus propios cursos
CREATE POLICY "Users can delete their own courses" 
ON public.courses 
FOR DELETE 
TO authenticated
USING (creator_id = auth.uid());
