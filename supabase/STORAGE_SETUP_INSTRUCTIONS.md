# Storage Bucket Setup Instructions

## Problem
You're getting "new row violates row-level security policy" errors when uploading images because the storage buckets don't have the proper RLS policies configured.

## Solution
Run the migration files to set up the storage buckets and their policies.

## How to Apply Migrations

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of each migration file:
   - `migrations/setup_recipe_images_storage.sql`
   - `migrations/setup_user_avatars_storage.sql`
5. Click **Run** to execute each migration

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
# Make sure you're logged in
supabase login

# Link your project (if not already linked)
supabase link --project-ref YOUR_PROJECT_REF

# Push the migrations
supabase db push
```

### Option 3: Manual Bucket Creation (Alternative)

If the migrations don't work, you can manually create the buckets:

1. Go to **Storage** in your Supabase dashboard
2. Click **New bucket**
3. Create a bucket named `recipe-images`:
   - Name: `recipe-images`
   - Public bucket: ✅ (checked)
   - File size limit: 5MB
   - Allowed MIME types: image/png, image/jpeg, image/jpg, image/gif, image/webp
4. After creating, go to **Policies** tab
5. Click **New Policy** and select **For full customization**
6. Create these 4 policies:
   - **INSERT**: Allow authenticated users (template: "Enable insert for authenticated users only")
   - **SELECT**: Allow public access (template: "Enable read access for all users")
   - **UPDATE**: Allow authenticated users (template: "Enable update for authenticated users only")
   - **DELETE**: Allow authenticated users (template: "Enable delete for authenticated users only")
7. Repeat steps 2-6 for `user-avatars` bucket

## What These Migrations Do

1. **Creates Storage Buckets**:
   - `recipe-images`: For recipe photos
   - `user-avatars`: For user profile pictures and weight room images

2. **Sets Up RLS Policies**:
   - **Authenticated users** can upload, update, and delete files
   - **Public users** can read/view files
   - Files are limited to 5MB
   - Only image files are allowed

## Verify Setup

After running the migrations, try uploading a recipe image again. The error should be resolved.

## Troubleshooting

If you still see errors:
1. Check that you're logged in (authenticated) when uploading
2. Verify the buckets exist in Supabase Dashboard → Storage
3. Check that the policies are created in the Policies tab
4. Make sure the bucket is set to "Public"

