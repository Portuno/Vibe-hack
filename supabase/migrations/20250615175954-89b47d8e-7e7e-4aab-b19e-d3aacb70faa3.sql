
-- Add columns for cost, image url and purchase url to the events table
ALTER TABLE public.events
ADD COLUMN cost_type TEXT CHECK (cost_type IN ('Gratuito', 'Pago')),
ADD COLUMN price NUMERIC(10, 2),
ADD COLUMN purchase_url TEXT,
ADD COLUMN highlight_img TEXT;

-- Enable Row Level Security on the events table
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to read published events
CREATE POLICY "Public can view published events"
ON public.events
FOR SELECT
USING (status = 'publicado');

-- Policy: Allow authenticated users to create events
CREATE POLICY "Authenticated users can create events"
ON public.events
FOR INSERT
WITH CHECK (auth.uid() = creator_id);

-- Policy: Allow event creators to update their own events
CREATE POLICY "Creators can update their own events"
ON public.events
FOR UPDATE
USING (auth.uid() = creator_id)
WITH CHECK (auth.uid() = creator_id);

-- Policy: Allow event creators to delete their own events
CREATE POLICY "Creators can delete their own events"
ON public.events
FOR DELETE
USING (auth.uid() = creator_id);
