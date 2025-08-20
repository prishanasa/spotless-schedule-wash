
-- Add email notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL, -- 'email', 'push', etc.
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add wallet system
CREATE TABLE public.user_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  balance DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add wallet transactions
CREATE TABLE public.wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  wallet_id UUID REFERENCES public.user_wallets(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL, -- 'credit', 'debit'
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add QR codes for machines
ALTER TABLE public.machines ADD COLUMN qr_code TEXT UNIQUE;

-- Update machines with QR codes
UPDATE public.machines SET qr_code = 'QR_' || id WHERE qr_code IS NULL;

-- Add cost to services
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS cost DECIMAL(10,2) DEFAULT 0.00;

-- Update services with costs
UPDATE public.services SET cost = 25.00 WHERE name = 'Quick Wash' AND cost = 0.00;
UPDATE public.services SET cost = 35.00 WHERE name = 'Heavy Duty' AND cost = 0.00;
UPDATE public.services SET cost = 20.00 WHERE name = 'Delicate' AND cost = 0.00;

-- Add cost to bookings for tracking
ALTER TABLE public.bookings ADD COLUMN cost DECIMAL(10,2) DEFAULT 0.00;

-- Enable RLS on new tables
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Wallet policies
CREATE POLICY "Users can view their own wallet" ON public.user_wallets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wallet" ON public.user_wallets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Transaction policies
CREATE POLICY "Users can view their own transactions" ON public.wallet_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions" ON public.wallet_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admin policies for all new tables
CREATE POLICY "Admins can view all notifications" ON public.notifications
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

CREATE POLICY "Admins can view all wallets" ON public.user_wallets
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

CREATE POLICY "Admins can view all transactions" ON public.wallet_transactions
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

-- Create wallet when user profile is created
CREATE OR REPLACE FUNCTION public.create_user_wallet()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_wallets (user_id, balance)
  VALUES (NEW.id, 100.00); -- Give new users ₹100 starting balance
  RETURN NEW;
END;
$$;

-- Create trigger for wallet creation
CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.create_user_wallet();

-- Function to send notification when laundry is ready
CREATE OR REPLACE FUNCTION public.notify_laundry_ready()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Only trigger when status changes to ready_for_pickup
  IF NEW.status = 'ready_for_pickup' AND OLD.status != 'ready_for_pickup' THEN
    INSERT INTO public.notifications (user_id, type, title, message)
    VALUES (
      NEW.user_id,
      'laundry_ready',
      'Laundry Ready for Pickup!',
      'Your ' || NEW.service_type || ' is ready for pickup from Machine ' || NEW.machine_id
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger for laundry notifications
CREATE TRIGGER on_laundry_status_change
  AFTER UPDATE ON public.laundry_orders
  FOR EACH ROW EXECUTE FUNCTION public.notify_laundry_ready();
