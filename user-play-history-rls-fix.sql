-- Fix RLS policy for user_play_history table
-- This allows users to read their own play history records

-- Enable RLS on the table (if not already enabled)
ALTER TABLE user_play_history ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own records
CREATE POLICY "Users can read their own play history" ON user_play_history
FOR SELECT
USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own records (if not already exists)
CREATE POLICY "Users can insert their own play history" ON user_play_history
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own records (if not already exists)
CREATE POLICY "Users can update their own play history" ON user_play_history
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id); 