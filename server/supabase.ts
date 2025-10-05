import { createClient } from '@supabase/supabase-js';
import { client as pgClient } from './db';

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
        return;
      } else {
        console.log('user-avatars bucket created successfully');
      }
    } else {
      console.log('user-avatars bucket already exists');
    }

    console.log('Setting up storage policies for user-avatars...');
    
    const policies = [
      { name: 'Allow public uploads', sql: `CREATE POLICY "Allow public uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'user-avatars');` },
      { name: 'Allow public reads', sql: `CREATE POLICY "Allow public reads" ON storage.objects FOR SELECT USING (bucket_id = 'user-avatars');` },
      { name: 'Allow public updates', sql: `CREATE POLICY "Allow public updates" ON storage.objects FOR UPDATE USING (bucket_id = 'user-avatars') WITH CHECK (bucket_id = 'user-avatars');` },
      { name: 'Allow public deletes', sql: `CREATE POLICY "Allow public deletes" ON storage.objects FOR DELETE USING (bucket_id = 'user-avatars');` }
    ];

    for (const policy of policies) {
      try {
        await pgClient.unsafe(
          `DROP POLICY IF EXISTS "${policy.name}" ON storage.objects;`
        );
        
        await pgClient.unsafe(policy.sql);
        console.log(`✓ Policy created: ${policy.name}`);
      } catch (err: any) {
        console.log(`Policy note (${policy.name}):`, err.message || 'May need manual setup');
      }
    }
    
    console.log('Storage bucket initialization complete');
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
}
