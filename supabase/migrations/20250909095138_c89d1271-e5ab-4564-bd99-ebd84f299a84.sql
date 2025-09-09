-- Enable Row Level Security on booking_analytics table
ALTER TABLE public.booking_analytics ENABLE ROW LEVEL SECURITY;

-- Create policy to restrict access to admin users only
CREATE POLICY "Only admins can access booking analytics" 
ON public.booking_analytics 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'::user_role
  )
);

-- Enable Row Level Security on booking_summary table as well
ALTER TABLE public.booking_summary ENABLE ROW LEVEL SECURITY;

-- Create policy to restrict access to admin users only
CREATE POLICY "Only admins can access booking summary" 
ON public.booking_summary 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'::user_role
  )
);