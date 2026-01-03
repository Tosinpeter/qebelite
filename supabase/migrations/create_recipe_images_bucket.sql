-- Setup storage bucket and policies for recipe-images
-- This migration creates the bucket and allows authenticated uploads, and public reads
-- Used for: Recipe images, athlete resources, and weight room collection images

-- Create the recipe-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'recipe-images',
  'recipe-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow authenticated uploads to recipe-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public reads from recipe-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes from recipe-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates to recipe-images" ON storage.objects;

-- Allow authenticated users to upload to recipe-images bucket
CREATE POLICY "Allow authenticated uploads to recipe-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'recipe-images');

-- Allow anyone to read from recipe-images bucket
CREATE POLICY "Allow public reads from recipe-images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'recipe-images');

-- Allow authenticated users to delete from recipe-images bucket
CREATE POLICY "Allow authenticated deletes from recipe-images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'recipe-images');

-- Allow authenticated users to update in recipe-images bucket
CREATE POLICY "Allow authenticated updates to recipe-images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'recipe-images')
WITH CHECK (bucket_id = 'recipe-images');

