import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase credentials for server');
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export async function initializeStorage() {
  try {
    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return;
    }

    const userAvatarsBucketExists = buckets?.some(bucket => bucket.name === 'user-avatars');

    if (!userAvatarsBucketExists) {
      console.log('Creating user-avatars bucket...');
      const { data, error } = await supabaseAdmin.storage.createBucket('user-avatars', {
        public: true,
        fileSizeLimit: 5242880,
        allowedMimeTypes: ['image/*']
      });

      if (error && !error.message.includes('already exists')) {
        console.error('Error creating user-avatars bucket:', error);
      } else {
        console.log('user-avatars bucket created successfully');
      }
    } else {
      console.log('user-avatars bucket already exists');
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
}
