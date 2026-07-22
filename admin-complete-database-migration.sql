-- Complete Admin System Database Migration
-- Run this in your Supabase SQL Editor

-- Create system_settings table
CREATE TABLE IF NOT EXISTS public.system_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'warning', 'error', 'success')),
  target_audience TEXT NOT NULL CHECK (target_audience IN ('all', 'admins', 'users')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL
);

-- Create system_status table
CREATE TABLE IF NOT EXISTS public.system_status (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('online', 'offline', 'degraded')),
  last_check TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  response_time INTEGER,
  error_message TEXT,
  uptime_percentage DECIMAL(5,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_status ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for system_settings (admin only)
CREATE POLICY "Admins can view system settings" ON public.system_settings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update system settings" ON public.system_settings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert system settings" ON public.system_settings
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Create RLS policies for notifications
CREATE POLICY "Admins can view all notifications" ON public.notifications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage notifications" ON public.notifications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Create RLS policies for system_status (admin only)
CREATE POLICY "Admins can view system status" ON public.system_status
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update system status" ON public.system_status
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert system status" ON public.system_status
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_system_settings_category ON public.system_settings(category);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_target_audience ON public.notifications(target_audience);
CREATE INDEX IF NOT EXISTS idx_notifications_is_active ON public.notifications(is_active);
CREATE INDEX IF NOT EXISTS idx_system_status_service ON public.system_status(service);
CREATE INDEX IF NOT EXISTS idx_system_status_status ON public.system_status(status);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER system_settings_updated_at
  BEFORE UPDATE ON public.system_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER notifications_updated_at
  BEFORE UPDATE ON public.notifications
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER system_status_updated_at
  BEFORE UPDATE ON public.system_status
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Insert default system settings
INSERT INTO public.system_settings (key, value, description, category) VALUES
  ('site_name', 'ReboLabs', 'Name of the application', 'general'),
  ('site_description', 'Monetization platform for publishers', 'Description of the application', 'general'),
  ('maintenance_mode', 'false', 'Enable maintenance mode', 'general'),
  ('registration_enabled', 'true', 'Allow new user registrations', 'general'),
  ('two_factor_enabled', 'false', 'Enable two-factor authentication', 'security'),
  ('session_timeout', '3600', 'Session timeout in seconds', 'security'),
  ('max_login_attempts', '5', 'Maximum login attempts before lockout', 'security'),
  ('notifications_enabled', 'true', 'Enable system notifications', 'notifications'),
  ('email_notifications', 'true', 'Send email notifications', 'notifications'),
  ('push_notifications', 'false', 'Enable push notifications', 'notifications'),
  ('min_payout_amount', '100', 'Minimum payout amount', 'payments'),
  ('auto_approve_apps', 'false', 'Automatically approve new apps', 'payments'),
  ('api_rate_limit', '1000', 'API requests per hour limit', 'api'),
  ('api_timeout', '30', 'API request timeout in seconds', 'api'),
  ('log_level', 'info', 'System log level', 'system')
ON CONFLICT (key) DO NOTHING;

-- Insert default system status
INSERT INTO public.system_status (service, status, notes) VALUES
  ('Database', 'online', 'Supabase PostgreSQL database'),
  ('API', 'online', 'Main application API'),
  ('Email Service', 'online', 'Email delivery service'),
  ('Payment Gateway', 'online', 'Payment processing service')
ON CONFLICT (service) DO NOTHING;

-- Insert sample notification
INSERT INTO public.notifications (title, message, type, target_audience, created_by) VALUES
  ('Welcome to ReboLabs!', 'Thank you for joining our monetization platform. Start by creating your first app to begin earning.', 'info', 'all', (SELECT id FROM public.users WHERE role = 'admin' LIMIT 1))
ON CONFLICT DO NOTHING;
