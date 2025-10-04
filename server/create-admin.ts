import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createDefaultAdmin() {
  const adminEmail = 'admin@qebelite.com';
  const adminPassword = 'admin123';

  console.log('Creating default admin user...');
  console.log(`Email: ${adminEmail}`);
  console.log(`Password: ${adminPassword}`);
  console.log('');

  try {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
    });

    if (error) {
      if (error.message.includes('already registered')) {
        console.log('✓ Admin user already exists');
      } else {
        console.error('Error creating admin user:', error.message);
        process.exit(1);
      }
    } else {
      console.log('✓ Admin user created successfully!');
      console.log(`User ID: ${data.user.id}`);
    }

    console.log('');
    console.log('You can now sign in with:');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log('');
    console.log('⚠️  Please change the password after first login!');
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(1);
  }
}

createDefaultAdmin();
