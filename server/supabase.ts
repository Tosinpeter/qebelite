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
        return;
      } else {
        console.log('user-avatars bucket created successfully');
      }
    } else {
      console.log('user-avatars bucket already exists');
    }

    console.log('Setting up storage policies for user-avatars...');
    
    const policies = [
      {
        name: 'Allow public uploads',
        operation: 'INSERT',
        sql: `CREATE POLICY IF NOT EXISTS "Allow public uploads" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'user-avatars');`
      },
      {
        name: 'Allow public reads',
        operation: 'SELECT',
        sql: `CREATE POLICY IF NOT EXISTS "Allow public reads" ON storage.objects FOR SELECT TO public USING (bucket_id = 'user-avatars');`
      },
      {
        name: 'Allow public updates',
        operation: 'UPDATE',
        sql: `CREATE POLICY IF NOT EXISTS "Allow public updates" ON storage.objects FOR UPDATE TO public USING (bucket_id = 'user-avatars');`
      },
      {
        name: 'Allow public deletes',
        operation: 'DELETE',
        sql: `CREATE POLICY IF NOT EXISTS "Allow public deletes" ON storage.objects FOR DELETE TO public USING (bucket_id = 'user-avatars');`
      }
    ];

    for (const policy of policies) {
      try {
        const { error: policyError } = await supabaseAdmin.rpc('exec_sql', { sql: policy.sql });
        if (policyError) {
          console.log(`Note: Could not create ${policy.operation} policy - may need manual setup in Supabase dashboard`);
        }
      } catch (err) {
        console.log(`Note: Policies may need to be set manually in Supabase dashboard for ${policy.operation}`);
      }
    }
    
    console.log('Storage bucket initialization complete');
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
}
