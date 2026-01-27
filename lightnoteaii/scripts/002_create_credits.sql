-- Create credits table to track user credit balance and transactions
CREATE TABLE IF NOT EXISTS credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  balance DECIMAL(10, 2) NOT NULL DEFAULT 20.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create credit_transactions table for history
CREATE TABLE IF NOT EXISTS credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  feature TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- Users can view their own credits
CREATE POLICY "Users can view own credits" ON credits
  FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own credits
CREATE POLICY "Users can update own credits" ON credits
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can insert their own credits (on signup)
CREATE POLICY "Users can insert own credits" ON credits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can view their own transactions
CREATE POLICY "Users can view own transactions" ON credit_transactions
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own transactions
CREATE POLICY "Users can insert own transactions" ON credit_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to initialize credits for new user
CREATE OR REPLACE FUNCTION public.handle_new_user_credits()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.credits (user_id, balance)
  VALUES (NEW.id, 20.00);
  
  INSERT INTO public.credit_transactions (user_id, amount, feature, description)
  VALUES (NEW.id, 20.00, 'signup_bonus', 'Welcome bonus credit');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create credits on signup
DROP TRIGGER IF EXISTS on_auth_user_created_credits ON auth.users;
CREATE TRIGGER on_auth_user_created_credits
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_credits();
