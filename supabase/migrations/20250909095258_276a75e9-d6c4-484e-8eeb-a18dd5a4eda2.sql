-- Drop the insecure views that cannot have RLS policies
DROP VIEW IF EXISTS public.booking_analytics;
DROP VIEW IF EXISTS public.booking_summary;

-- The secure functions get_booking_analytics() and get_booking_summary() 
-- already exist and have proper admin access controls built in.
-- Applications should use these functions instead of the views.