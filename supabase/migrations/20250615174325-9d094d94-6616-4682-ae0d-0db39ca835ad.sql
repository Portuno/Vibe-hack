
-- Add new columns to projects table
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS website_url TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS docs_url TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS repo_url TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS wants_updates BOOLEAN DEFAULT FALSE;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS open_to_feedback BOOLEAN DEFAULT FALSE;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS wants_to_monetize BOOLEAN DEFAULT FALSE;

-- Create storage bucket for project images
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

-- RLS for storage bucket
-- Drop existing policies if they exist, to avoid errors.
DROP POLICY IF EXISTS "Project images are publicly accessible." ON storage.objects;
CREATE POLICY "Project images are publicly accessible."
ON storage.objects FOR SELECT
USING ( bucket_id = 'project-images' );

DROP POLICY IF EXISTS "Anyone can upload a project image." ON storage.objects;
CREATE POLICY "Anyone can upload a project image."
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'project-images' );

-- Insert mock data
-- Using fixed UUIDs for creator_id for consistency in mock data.
-- Making sure not to insert duplicates by checking the name.
DO $$
BEGIN
   IF NOT EXISTS (SELECT 1 FROM public.projects WHERE name = 'Terreta Hub') THEN
      INSERT INTO public.projects (creator_id, name, description, vertical, status, problem, highlight_img, demo_url, category, website_url, repo_url)
      VALUES
      (
        'f2317142-17c1-4b12-817a-853b03645398',
        'Terreta Hub',
        'La plataforma que conecta a la comunidad de emprendedores y profesionales de Valencia. Un espacio para compartir proyectos, encontrar talento y acceder a recursos.',
        'Comunidad',
        'publicado',
        'Falta de un punto de encuentro centralizado para el ecosistema innovador de Valencia, dificultando la visibilidad de proyectos y la conexión entre profesionales.',
        'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=2020',
        'https://terretahub.com/demo',
        'Comunidad',
        'https://terretahub.com',
        'https://github.com/terretahub/plataforma'
      );
   END IF;
   IF NOT EXISTS (SELECT 1 FROM public.projects WHERE name = 'Chipi') THEN
      INSERT INTO public.projects (creator_id, name, description, vertical, status, problem, highlight_img, demo_url, category, website_url, repo_url)
      VALUES
      (
        'e2a7a24c-1e91-4d7a-a432-026880554129',
        'Chipi',
        'Una IA que te ayuda a encontrar el mejor chipi (calamar) de la ciudad. Usamos machine learning para analizar reseñas de restaurantes y predecir la calidad del chipirón.',
        'Tecnología',
        'publicado',
        'La difícil tarea de encontrar un buen plato de chipirones en una ciudad con miles de opciones. Chipi te ahorra tiempo y decepciones.',
        'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?q=80&w=2070',
        'https://chipi.app/demo',
        'App',
        'https://chipi.app',
        'https://github.com/chipi/app'
      );
   END IF;
END $$;
