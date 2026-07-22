-- Admin System Database Updates
-- Run this in your Supabase SQL Editor

-- Create activity logs table
CREATE TABLE public.activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL, -- 'user', 'project', 'payment', 'system'
  resource_id TEXT,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create system status table
CREATE TABLE public.system_status (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  status TEXT NOT NULL CHECK (status IN ('online', 'offline', 'maintenance')),
  message TEXT,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add user status to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'banned', 'suspended'));

-- Add ban reason and dates
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS ban_reason TEXT,
ADD COLUMN IF NOT EXISTS banned_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS banned_by UUID REFERENCES auth.users(id);

-- Create payment methods table
CREATE TABLE public.payment_methods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('crypto', 'wire')),
  name TEXT NOT NULL,
  details TEXT NOT NULL, -- e.g., wallet address or bank name - account number
  is_default BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payouts table
CREATE TABLE public.payouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  payment_method_id UUID REFERENCES public.payment_methods(id) ON DELETE SET NULL,
  month TEXT NOT NULL, -- e.g., "January 2024"
  total_revenue DECIMAL(10,2) NOT NULL,
  reconciliation DECIMAL(10,2) DEFAULT 0,
  total_payout DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed')),
  paid_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payment approvals table
CREATE TABLE public.payment_approvals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method_id UUID REFERENCES public.payment_methods(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'sent', 'failed')),
  admin_notes TEXT,
  processed_by UUID REFERENCES auth.users(id),
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user app stats view
CREATE OR REPLACE VIEW public.user_app_stats AS
SELECT 
  u.id as user_id,
  u.email,
  u.full_name,
  p.id as project_id,
  p.app_id,
  p.name as app_name,
  p.status as app_status,
  COUNT(DISTINCT ss.id) as total_sessions,
  COUNT(DISTINCT CASE WHEN ss.status = 'completed' THEN ss.id END) as completed_surveys,
  COUNT(DISTINCT CASE WHEN ss.status = 'disqualified' THEN ss.id END) as disqualified_surveys,
  COALESCE(SUM(CASE WHEN ss.status = 'completed' THEN ss.revenue ELSE 0 END), 0) as total_earnings,
  COALESCE(SUM(CASE WHEN ss.status = 'completed' THEN ss.revenue * 0.7 END), 0) as user_earnings,
  COALESCE(SUM(CASE WHEN ss.status = 'completed' THEN ss.revenue * 0.3 END), 0) as platform_earnings
FROM public.users u
LEFT JOIN public.projects p ON u.id = p.user_id
LEFT JOIN public.survey_sessions ss ON p.app_id = ss.app_id
GROUP BY u.id, u.email, u.full_name, p.id, p.app_id, p.name, p.status;

-- Insert initial system status
INSERT INTO public.system_status (status, message) 
VALUES ('online', 'System is operational') 
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_activity_logs_resource ON public.activity_logs(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users(status);
CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON public.payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_payouts_user_id ON public.payouts(user_id);
CREATE INDEX IF NOT EXISTS idx_payouts_status ON public.payouts(status);
CREATE INDEX IF NOT EXISTS idx_payment_approvals_status ON public.payment_approvals(status);
CREATE INDEX IF NOT EXISTS idx_payment_approvals_user_id ON public.payment_approvals(user_id);

-- RLS Policies
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_approvals ENABLE ROW LEVEL SECURITY;

-- Activity logs policies
CREATE POLICY "Admins can view all activity logs" ON public.activity_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can view their own activity logs" ON public.activity_logs
  FOR SELECT USING (user_id = auth.uid());

-- System status policies
CREATE POLICY "Admins can manage system status" ON public.system_status
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Everyone can view system status" ON public.system_status
  FOR SELECT USING (true);

-- Payment methods policies
CREATE POLICY "Users can manage their own payment methods" ON public.payment_methods
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Admins can view all payment methods" ON public.payment_methods
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Payouts policies
CREATE POLICY "Users can view their own payouts" ON public.payouts
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all payouts" ON public.payouts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Payment approvals policies
CREATE POLICY "Admins can manage payment approvals" ON public.payment_approvals
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can view their own payment approvals" ON public.payment_approvals
  FOR SELECT USING (user_id = auth.uid());
