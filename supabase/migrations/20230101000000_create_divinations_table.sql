-- Create a table for storing divination results
CREATE TABLE divinations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  character TEXT NOT NULL,
  interpretation TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE divinations ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows users to see only their own divinations
CREATE POLICY "Users can view their own divinations" ON divinations
  FOR SELECT USING (auth.uid() = user_id);

-- Create a policy that allows users to insert their own divinations
CREATE POLICY "Users can insert their own divinations" ON divinations
  FOR INSERT WITH CHECK (auth.uid() = user_id);