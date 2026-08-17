-- 1. Add photo_url to animals table
ALTER TABLE public.animals 
ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- 2. Create the storage bucket for animal photos (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('animal-photos', 'animal-photos', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Set up Storage Policies to allow public access and anon uploads/updates
-- These policies apply to the 'storage.objects' table for the 'animal-photos' bucket.

CREATE POLICY "Public Access for animal photos"
ON storage.objects FOR SELECT
USING ( bucket_id = 'animal-photos' );

CREATE POLICY "Anon Uploads for animal photos"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'animal-photos' );

CREATE POLICY "Anon Updates for animal photos"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'animal-photos' );

CREATE POLICY "Anon Deletes for animal photos"
ON storage.objects FOR DELETE
USING ( bucket_id = 'animal-photos' );
