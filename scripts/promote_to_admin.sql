-- Replace 'USER_EMAIL_HERE' with the email of the user you want to make an admin
UPDATE profiles 
SET role = 'admin' 
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'USER_EMAIL_HERE'
);
