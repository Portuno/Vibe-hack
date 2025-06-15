
-- Add new columns to professional_profiles table for enhanced profile information
ALTER TABLE public.professional_profiles
ADD COLUMN IF NOT EXISTS cover_photo_url TEXT,
ADD COLUMN IF NOT EXISTS headline TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS social_links JSONB,
ADD COLUMN IF NOT EXISTS what_i_am_looking_for TEXT,
ADD COLUMN IF NOT EXISTS notification_preferences JSONB,
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS display_name TEXT;

-- For existing profiles, set a default for display_name from the existing name
UPDATE public.professional_profiles SET display_name = name WHERE display_name IS NULL;

-- Enable RLS on the table
ALTER TABLE public.professional_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts and redefine them
DROP POLICY IF EXISTS "Public can view public professional profiles" ON public.professional_profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.professional_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.professional_profiles;
DROP POLICY IF EXISTS "Authenticated users can create their own profile" ON public.professional_profiles;

-- RLS Policies
-- 1. Allow public read access to public profiles
CREATE POLICY "Public can view public professional profiles"
ON public.professional_profiles
FOR SELECT
USING (is_public = true);

-- 2. Allow users to view their own profile regardless of public status
CREATE POLICY "Users can view their own profile"
ON public.professional_profiles
FOR SELECT
USING (auth.uid() = user_id);

-- 3. Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
ON public.professional_profiles
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 4. Allow authenticated users to create a profile if one doesn't exist
CREATE POLICY "Authenticated users can create their own profile"
ON public.professional_profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);
