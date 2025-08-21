-- Add user_email column to bookings table to track user email for each booking
ALTER TABLE public.bookings ADD COLUMN user_email TEXT;

-- Update existing bookings with user emails from profiles
UPDATE public.bookings 
SET user_email = profiles.email 
FROM profiles 
WHERE bookings.user_id = profiles.id AND bookings.user_email IS NULL;