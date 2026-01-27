-- Create proposals table
CREATE TABLE IF NOT EXISTS proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  client_name TEXT,
  status TEXT DEFAULT 'draft',
  score INTEGER,
  value DECIMAL(12, 2),
  industry TEXT,
  deadline TIMESTAMP WITH TIME ZONE,
  content TEXT,
  original_content TEXT,
  improved_content TEXT,
  score_breakdown JSONB,
  issues JSONB,
  improvements JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;

-- Users can view their own proposals
CREATE POLICY "Users can view own proposals" ON proposals
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own proposals
CREATE POLICY "Users can insert own proposals" ON proposals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own proposals
CREATE POLICY "Users can update own proposals" ON proposals
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own proposals
CREATE POLICY "Users can delete own proposals" ON proposals
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_proposals_user_id ON proposals(user_id);
CREATE INDEX IF NOT EXISTS idx_proposals_client_id ON proposals(client_id);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals(status);
CREATE INDEX IF NOT EXISTS idx_proposals_created_at ON proposals(created_at DESC);
