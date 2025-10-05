-- Supabase Schema Export
-- Generated: 2025-10-05T11:26:45.935Z
-- Database: QEB Elite Admin Dashboard

-- Table: home_slider
CREATE TABLE IF NOT EXISTS home_slider (
  id character varying DEFAULT gen_random_uuid() NOT NULL,
  position integer NOT NULL,
  image_url text NOT NULL,
  redirect_url text NOT NULL,
  text text
);

-- Table: home_widgets
CREATE TABLE IF NOT EXISTS home_widgets (
  id character varying DEFAULT gen_random_uuid() NOT NULL,
  name text NOT NULL,
  type text NOT NULL,
  position integer NOT NULL,
  visible boolean DEFAULT true NOT NULL,
  config text
);

-- Table: user_profiles
CREATE TABLE IF NOT EXISTS user_profiles (
  id character varying NOT NULL,
  age character varying(10),
  height character varying(20),
  weight character varying(20),
  avatar_url text,
  display_name character varying(255),
  recipe_preference character varying(100),
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Storage Buckets
-- Bucket: media (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Bucket: home-slides (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('home-slides', 'home-slides', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
-- Policy: Allow public uploads on objects
CREATE POLICY IF NOT EXISTS "Allow public uploads"
ON storage.objects FOR INSERT
WITH CHECK ((bucket_id = 'home-slides'::text))
;

-- Policy: Allow public reads on objects
CREATE POLICY IF NOT EXISTS "Allow public reads"
ON storage.objects FOR SELECT
USING ((bucket_id = 'home-slides'::text))
;

-- Policy: Allow public deletes on objects
CREATE POLICY IF NOT EXISTS "Allow public deletes"
ON storage.objects FOR DELETE
USING ((bucket_id = 'home-slides'::text))
;

-- Policy: Anyone can view media files on objects
CREATE POLICY IF NOT EXISTS "Anyone can view media files"
ON storage.objects FOR SELECT
USING ((bucket_id = 'media'::text))
;

-- Policy: Authenticated users can upload media files on objects
CREATE POLICY IF NOT EXISTS "Authenticated users can upload media files"
ON storage.objects FOR INSERT
WITH CHECK (((bucket_id = 'media'::text) AND (auth.role() = 'authenticated'::text)))
;

-- Policy: Users can update their own media files on objects
CREATE POLICY IF NOT EXISTS "Users can update their own media files"
ON storage.objects FOR UPDATE
USING (((bucket_id = 'media'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])))
;

-- Policy: Users can delete their own media files on objects
CREATE POLICY IF NOT EXISTS "Users can delete their own media files"
ON storage.objects FOR DELETE
USING (((bucket_id = 'media'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])))
;

