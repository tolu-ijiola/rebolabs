-- Set toluijiola01@gmail.com as admin
-- Run this in your Supabase SQL Editor

-- First, let's check if the user exists
SELECT id, email, role FROM public.users WHERE email = 'toluijiola01@gmail.com';

-- Update the user role to admin
UPDATE public.users 
SET role = 'admin', updated_at = NOW()
WHERE email = 'toluijiola01@gmail.com';

-- Verify the update
SELECT id, email, role, updated_at FROM public.users WHERE email = 'toluijiola01@gmail.com';

-- If the user doesn't exist in public.users table, we need to create them
-- This happens when a user signs up but hasn't been added to public.users yet
INSERT INTO public.users (id, email, full_name, role)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', au.email),
  'admin'
FROM auth.users au
WHERE au.email = 'toluijiola01@gmail.com'
AND NOT EXISTS (
  SELECT 1 FROM public.users pu WHERE pu.id = au.id
)
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  updated_at = NOW();
