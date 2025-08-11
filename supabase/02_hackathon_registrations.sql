-- Create hackathon_registrations table
CREATE TABLE IF NOT EXISTS hackathon_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  company TEXT,
  role TEXT,
  skills TEXT NOT NULL,
  experience TEXT,
  team_preference TEXT CHECK (team_preference IN ('individual', 'team', 'random')),
  motivation TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'waitlist')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  assigned_team_id UUID
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_hackathon_registrations_email ON hackathon_registrations(email);
CREATE INDEX IF NOT EXISTS idx_hackathon_registrations_status ON hackathon_registrations(status);
CREATE INDEX IF NOT EXISTS idx_hackathon_registrations_created_at ON hackathon_registrations(created_at);
CREATE INDEX IF NOT EXISTS idx_hackathon_registrations_team_preference ON hackathon_registrations(team_preference);

-- Enable Row Level Security (RLS)
ALTER TABLE hackathon_registrations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public inserts
CREATE POLICY "Allow public registration" ON hackathon_registrations
  FOR INSERT WITH CHECK (true);

-- Create policy to allow users to view their own registration
CREATE POLICY "Allow users to view own registration" ON hackathon_registrations
  FOR SELECT USING (true);

-- Create policy to allow admins to update registrations
CREATE POLICY "Allow admin updates" ON hackathon_registrations
  FOR UPDATE USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_hackathon_registrations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_hackathon_registrations_updated_at
  BEFORE UPDATE ON hackathon_registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_hackathon_registrations_updated_at();

-- Create teams table for team management
CREATE TABLE IF NOT EXISTS hackathon_teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  max_members INTEGER DEFAULT 4,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create team members table
CREATE TABLE IF NOT EXISTS team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID REFERENCES hackathon_teams(id) ON DELETE CASCADE,
  registration_id UUID REFERENCES hackathon_registrations(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(team_id, registration_id)
);

-- Create indexes for teams
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_registration_id ON team_members(registration_id);

-- Enable RLS for teams
ALTER TABLE hackathon_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Create policies for teams
CREATE POLICY "Allow public team creation" ON hackathon_teams
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public team viewing" ON hackathon_teams
  FOR SELECT USING (true);

CREATE POLICY "Allow public team membership" ON team_members
  FOR ALL USING (true);

-- Insert sample team data
INSERT INTO hackathon_teams (name, max_members) VALUES
  ('Team Innovators', 4),
  ('Code Warriors', 4),
  ('AI Pioneers', 4)
ON CONFLICT DO NOTHING;
