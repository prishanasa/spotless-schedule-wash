-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('student', 'admin');

-- Create enum for laundry order status  
CREATE TYPE public.order_status AS ENUM ('queued', 'washing', 'drying', 'ready_for_pickup', 'completed');

-- Create enum for machine types
CREATE TYPE public.machine_type AS ENUM ('washer', 'dryer');

-- Update profiles table to include role and additional fields
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role public.user_role DEFAULT 'student',
ADD COLUMN IF NOT EXISTS student_id TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS room_number TEXT;

-- Create laundry_orders table
CREATE TABLE public.laundry_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  machine_id TEXT NOT NULL,
  machine_type public.machine_type NOT NULL,
  status public.order_status NOT NULL DEFAULT 'queued',
  service_type TEXT NOT NULL,
  estimated_completion TIMESTAMP WITH TIME ZONE,
  actual_completion TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on laundry_orders
ALTER TABLE public.laundry_orders ENABLE ROW LEVEL SECURITY;

-- Create policies for laundry_orders
CREATE POLICY "Users can view their own orders" 
ON public.laundry_orders 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" 
ON public.laundry_orders 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders" 
ON public.laundry_orders 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders" 
ON public.laundry_orders 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can update all orders" 
ON public.laundry_orders 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Update machines table with better structure
DELETE FROM public.machines;
ALTER TABLE public.machines DROP COLUMN IF EXISTS status;
ALTER TABLE public.machines 
ADD COLUMN IF NOT EXISTS location TEXT DEFAULT 'Hostel Laundry Room',
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS current_order_id UUID REFERENCES public.laundry_orders(id);

-- Insert hostel machines
INSERT INTO public.machines (id, name, type, location, is_active) VALUES
('W001', 'Washer 1', 'washer', 'Ground Floor', true),
('W002', 'Washer 2', 'washer', 'Ground Floor', true),
('W003', 'Washer 3', 'washer', 'First Floor', true),
('W004', 'Washer 4', 'washer', 'First Floor', true),
('W005', 'Washer 5', 'washer', 'Second Floor', true),
('W006', 'Washer 6', 'washer', 'Second Floor', true),
('W007', 'Washer 7', 'washer', 'Third Floor', true),
('W008', 'Washer 8', 'washer', 'Third Floor', true),
('D001', 'Dryer 1', 'dryer', 'Ground Floor', true),
('D002', 'Dryer 2', 'dryer', 'First Floor', true),
('D003', 'Dryer 3', 'dryer', 'Second Floor', true),
('D004', 'Dryer 4', 'dryer', 'Third Floor', true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates on laundry_orders
CREATE TRIGGER update_laundry_orders_updated_at
BEFORE UPDATE ON public.laundry_orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for laundry_orders table
ALTER TABLE public.laundry_orders REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.laundry_orders;