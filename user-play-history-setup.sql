-- Create user_play_history table
CREATE TABLE user_play_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  session_id UUID NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('started', 'completed')),
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_user_play_history_user_id ON user_play_history(user_id);
CREATE INDEX idx_user_play_history_session_id ON user_play_history(session_id);
CREATE INDEX idx_user_play_history_user_status ON user_play_history(user_id, status);
CREATE INDEX idx_user_play_history_user_created ON user_play_history(user_id, created_at DESC);

-- Function to cleanup old records (keep only last 5 per user)
CREATE OR REPLACE FUNCTION cleanup_user_play_history()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM user_play_history 
  WHERE user_id = NEW.user_id 
  AND id NOT IN (
    SELECT id FROM user_play_history 
    WHERE user_id = NEW.user_id 
    ORDER BY created_at DESC 
    LIMIT 5
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically cleanup old records
CREATE TRIGGER trigger_cleanup_user_play_history
  AFTER INSERT ON user_play_history
  FOR EACH ROW
  EXECUTE FUNCTION cleanup_user_play_history(); 