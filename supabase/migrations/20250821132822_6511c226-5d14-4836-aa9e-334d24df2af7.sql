-- Add admin policy to view all bookings
CREATE POLICY "Admins can view all bookings" 
ON public.bookings 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role = 'admin'::user_role
));

-- Create a view for booking analytics
CREATE VIEW public.booking_analytics AS
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

-- Create a summary view for total bookings by service type
CREATE VIEW public.booking_summary AS
SELECT 
  service_type,
  COUNT(*) as total_bookings,
  SUM(cost) as total_revenue,
  COUNT(DISTINCT user_id) as unique_users
FROM public.bookings
GROUP BY service_type
ORDER BY total_bookings DESC;