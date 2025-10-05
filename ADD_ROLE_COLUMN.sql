-- Add role column to user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';

-- Update existing users to have 'user' role if NULL
UPDATE user_profiles 
SET role = 'user' 
WHERE role IS NULL;
