-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Templates Table
CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  content JSONB DEFAULT '{}'::jsonb,
  source_type TEXT DEFAULT 'created',
  metadata JSONB DEFAULT '{}'::jsonb,
  style JSONB DEFAULT '{}'::jsonb,
  version INTEGER DEFAULT 1,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Proposals Table (Ensure columns exist)
CREATE TABLE IF NOT EXISTS proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add missing columns to proposals
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'proposals' AND column_name = 'client_name') THEN
        ALTER TABLE proposals ADD COLUMN client_name TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'proposals' AND column_name = 'content') THEN
        ALTER TABLE proposals ADD COLUMN content JSONB DEFAULT '{}'::jsonb;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'proposals' AND column_name = 'source_type') THEN
        ALTER TABLE proposals ADD COLUMN source_type TEXT DEFAULT 'created';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'proposals' AND column_name = 'status') THEN
        ALTER TABLE proposals ADD COLUMN status TEXT DEFAULT 'draft';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'proposals' AND column_name = 'is_favorite') THEN
        ALTER TABLE proposals ADD COLUMN is_favorite BOOLEAN DEFAULT FALSE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'proposals' AND column_name = 'template_id') THEN
        ALTER TABLE proposals ADD COLUMN template_id UUID REFERENCES templates(id) ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'proposals' AND column_name = 'last_edited_at') THEN
        ALTER TABLE proposals ADD COLUMN last_edited_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'proposals' AND column_name = 'user_id') THEN
        ALTER TABLE proposals ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Media Assets Table
CREATE TABLE IF NOT EXISTS media_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  mime_type TEXT,
  data TEXT, -- Base64 or URL
  width INTEGER,
  height INTEGER,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Block Templates Table
CREATE TABLE IF NOT EXISTS block_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  content JSONB NOT NULL,
  category TEXT DEFAULT 'general',
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stock Images Table
CREATE TABLE IF NOT EXISTS stock_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url TEXT NOT NULL,
  alt TEXT,
  category TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies (Basic)
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE block_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own templates" ON templates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own templates" ON templates FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own templates" ON templates FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own templates" ON templates FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own proposals" ON proposals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own proposals" ON proposals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own proposals" ON proposals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own proposals" ON proposals FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own media" ON media_assets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own media" ON media_assets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own media" ON media_assets FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own blocks" ON block_templates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own blocks" ON block_templates FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own blocks" ON block_templates FOR DELETE USING (auth.uid() = user_id);
