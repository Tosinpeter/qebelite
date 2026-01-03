-- Setup storage bucket and policies for user-avatars
-- This migration creates the bucket and allows authenticated uploads, and public reads

-- Create the user-avatars bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'user-avatars',
  'user-avatars',
  true,
  5242880, -- 5MB limit
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow authenticated uploads to user-avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow public reads from user-avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes from user-avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates to user-avatars" ON storage.objects;

-- Allow authenticated users to upload to user-avatars bucket
CREATE POLICY "Allow authenticated uploads to user-avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'user-avatars');

-- Allow anyone to read from user-avatars bucket
CREATE POLICY "Allow public reads from user-avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'user-avatars');

-- Allow authenticated users to delete from user-avatars bucket
CREATE POLICY "Allow authenticated deletes from user-avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'user-avatars');

-- Allow authenticated users to update in user-avatars bucket
CREATE POLICY "Allow authenticated updates to user-avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'user-avatars')
WITH CHECK (bucket_id = 'user-avatars');

