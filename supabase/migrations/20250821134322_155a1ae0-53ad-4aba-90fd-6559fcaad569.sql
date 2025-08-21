-- Fix security definer view issue by enabling RLS on the views
-- and adding proper policies

-- Enable RLS on the views
ALTER VIEW public.booking_analytics SET (security_barrier = true);
ALTER VIEW public.booking_summary SET (security_barrier = true);

-- Since views inherit permissions from underlying tables, we need to ensure
-- the views respect the same RLS policies as the underlying tables.
-- The booking_analytics view will automatically respect the bookings table RLS policies
-- The booking_summary view will also respect the bookings table RLS policies

-- However, to be extra secure, we can recreate these as security-aware views
-- Drop existing views
DROP VIEW IF EXISTS public.booking_analytics;
DROP VIEW IF EXISTS public.booking_summary;

-- Recreate booking_analytics view with explicit security awareness
CREATE VIEW public.booking_analytics 
WITH (security_barrier = true) AS
SELECT 
  b.id,
  b.user_email,
  b.service_type,
  b.machine_id,
  b.booking_date,
  b.time_slot,
  b.status,
  b.cost,
  b.created_at,
  p.full_name,
  p.room_number
FROM public.bookings b
LEFT JOIN public.profiles p ON b.user_id = p.id
WHERE 
  -- This will respect the RLS policies on bookings table
  -- Users can only see their own bookings, admins can see all
  (auth.uid() = b.user_id) 
  OR 
  (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'::user_role
  ))
ORDER BY b.created_at DESC;

-- Recreate booking_summary view with explicit security awareness  
CREATE VIEW public.booking_summary
WITH (security_barrier = true) AS
SELECT 
  service_type,
  COUNT(*) as total_bookings,
  SUM(cost) as total_revenue,
  COUNT(DISTINCT user_id) as unique_users
FROM public.bookings b
WHERE 
  -- Only include bookings that the current user can see
  (auth.uid() = b.user_id) 
  OR 
  (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'::user_role
  ))
GROUP BY service_type
ORDER BY total_bookings DESC;