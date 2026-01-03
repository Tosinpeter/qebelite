-- Setup storage bucket and policies for weight-room
-- This migration creates the bucket and allows authenticated uploads, and public reads
-- Used for: Weight room collection images

-- Create the weight-room bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'weight-room',
  'weight-room',
  true,
  5242880, -- 5MB limit
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow authenticated uploads to weight-room" ON storage.objects;
DROP POLICY IF EXISTS "Allow public reads from weight-room" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes from weight-room" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates to weight-room" ON storage.objects;

-- Allow authenticated users to upload to weight-room bucket
CREATE POLICY "Allow authenticated uploads to weight-room"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'weight-room');

-- Allow anyone to read from weight-room bucket
CREATE POLICY "Allow public reads from weight-room"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'weight-room');

-- Allow authenticated users to delete from weight-room bucket
CREATE POLICY "Allow authenticated deletes from weight-room"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'weight-room');

-- Allow authenticated users to update in weight-room bucket
CREATE POLICY "Allow authenticated updates to weight-room"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'weight-room')
WITH CHECK (bucket_id = 'weight-room');

