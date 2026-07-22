-- ReboLabs Database Setup Script
-- Run this in your Supabase SQL Editor

-- Create users table
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table (publicly accessible)
CREATE TABLE public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  app_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  link TEXT NOT NULL,
  type TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'rejected')),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  revenue DECIMAL(10,2) DEFAULT 0,
  demo BOOLEAN DEFAULT true,
  currency_name TEXT NOT NULL,
  currency_value DECIMAL(10,2) DEFAULT 100,
  show_value BOOLEAN DEFAULT true,
  custom_logo TEXT,
  primary_color TEXT,
  secret_key UUID DEFAULT gen_random_uuid(),
  server_key UUID DEFAULT gen_random_uuid(),
  reward_callback TEXT,
  reconciliation_callback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payments table
CREATE TABLE public.payments (
  transaction_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  gross_amount DECIMAL(10,2) NOT NULL,
  payout DECIMAL(10,2) NOT NULL,
  reconciliation_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed')),
  payment_method TEXT NOT NULL,
  transaction_id TEXT,
  revenue_months TEXT[],
  reconciliation_months TEXT[],
  invoiced_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analytics table for survey tracking
CREATE TABLE public.analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  app_id TEXT NOT NULL,
  publisher_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  user_id TEXT NOT NULL, -- This is the survey user ID (text, not UUID)
  revenue_usd DECIMAL(10,2) NOT NULL,
  revenue_app_currency DECIMAL(10,2) NOT NULL,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL CHECK (year >= 2020),
  day INTEGER NOT NULL CHECK (day >= 1 AND day <= 31),
  full_date DATE NOT NULL,
  history_type TEXT NOT NULL CHECK (history_type IN ('reward', 'reconciliation')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Now enable RLS on all tables (after they're created)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Projects: Public read access, owner can manage
CREATE POLICY "Anyone can view projects" ON public.projects
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON public.projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON public.projects
  FOR DELETE USING (auth.uid() = user_id);

-- Payments: Users can view own payments
CREATE POLICY "Users can view own payments" ON public.payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payments" ON public.payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payments" ON public.payments
  FOR UPDATE USING (auth.uid() = user_id);

-- Analytics: Public read access for survey data
CREATE POLICY "Anyone can view analytics" ON public.analytics
  FOR SELECT USING (true);

CREATE POLICY "Users can insert analytics" ON public.analytics
  FOR INSERT WITH CHECK (true);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_projects_app_id ON public.projects(app_id);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_analytics_app_id ON public.analytics(app_id);
CREATE INDEX idx_analytics_full_date ON public.analytics(full_date);
CREATE INDEX idx_analytics_history_type ON public.analytics(history_type);
CREATE INDEX idx_payments_user_id ON public.payments(user_id);

-- Insert sample analytics data (optional)
-- This will help populate the charts with initial data
INSERT INTO public.analytics (app_id, publisher_id, user_id, revenue_usd, revenue_app_currency, month, year, day, full_date, history_type) VALUES
  ('app_001', '00000000-0000-0000-0000-000000000000', 'user_123', 5.00, 500, 1, 2024, 15, '2024-01-15', 'reward'),
  ('app_001', '00000000-0000-0000-0000-000000000000', 'user_124', 3.50, 350, 1, 2024, 16, '2024-01-16', 'reward'),
  ('app_002', '00000000-0000-0000-0000-000000000000', 'user_125', 4.00, 400, 1, 2024, 17, '2024-01-17', 'reward'),
  ('app_001', '00000000-0000-0000-0000-000000000000', 'user_126', 2.50, 250, 1, 2024, 18, '2024-01-18', 'reconciliation'),
  ('app_002', '00000000-0000-0000-0000-000000000000', 'user_127', 6.00, 600, 1, 2024, 19, '2024-01-19', 'reward'),
  ('app_001', '00000000-0000-0000-0000-000000000000', 'user_128', 4.50, 450, 2, 2024, 1, '2024-02-01', 'reward'),
  ('app_002', '00000000-0000-0000-0000-000000000000', 'user_129', 3.00, 300, 2, 2024, 2, '2024-02-02', 'reward'),
  ('app_001', '00000000-0000-0000-0000-000000000000', 'user_130', 5.50, 550, 2, 2024, 3, '2024-02-03', 'reconciliation');
