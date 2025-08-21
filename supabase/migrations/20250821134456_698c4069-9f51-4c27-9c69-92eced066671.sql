-- Fix business analytics data exposure issue
-- Enable RLS on the booking_analytics view and add proper policies

-- First, enable RLS on the booking_analytics view
ALTER VIEW public.booking_analytics SET (security_barrier = true);
ALTER VIEW public.booking_summary SET (security_barrier = true);

-- Since views can't have RLS policies directly, we need to recreate them
-- as materialized views or use a different approach

-- Drop existing views
DROP VIEW IF EXISTS public.booking_analytics;
DROP VIEW IF EXISTS public.booking_summary;

-- Create a secure function to get booking analytics (admin only)
CREATE OR REPLACE FUNCTION public.get_booking_analytics()
RETURNS TABLE (
  id uuid,
  user_email text,
  service_type text,
  machine_id text,
  booking_date date,
  time_slot text,
  status text,
  cost numeric,
  created_at timestamptz,
  full_name text,
  room_number text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user is admin
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'::user_role
  ) THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  -- Return booking analytics data only for admins
  RETURN QUERY
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
  ORDER BY b.created_at DESC;
END;
$$;

-- Create a secure function to get booking summary (admin only)
CREATE OR REPLACE FUNCTION public.get_booking_summary()
RETURNS TABLE (
  service_type text,
  total_bookings bigint,
  total_revenue numeric,
  unique_users bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user is admin
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'::user_role
  ) THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  -- Return booking summary data only for admins
  RETURN QUERY
  SELECT 
    b.service_type,
    COUNT(*) as total_bookings,
    SUM(b.cost) as total_revenue,
    COUNT(DISTINCT b.user_id) as unique_users
  FROM public.bookings b
  GROUP BY b.service_type
  ORDER BY total_bookings DESC;
END;
$$;

-- Create secure views that use the functions (these will only work for admins)
CREATE VIEW public.booking_analytics AS
SELECT * FROM public.get_booking_analytics();

CREATE VIEW public.booking_summary AS  
SELECT * FROM public.get_booking_summary();

-- Grant execute permissions on the functions to authenticated users
-- The functions themselves will check for admin role
GRANT EXECUTE ON FUNCTION public.get_booking_analytics() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_booking_summary() TO authenticated;