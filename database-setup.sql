-- Create collection_themes table
CREATE TABLE collection_themes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add theme_id foreign key to courses table
ALTER TABLE courses ADD COLUMN theme_id UUID REFERENCES collection_themes(id);

-- Insert sample theme data
INSERT INTO collection_themes (name, display_name) VALUES
  ('performance', 'Performance'),
  ('recovery', 'Recovery'),
  ('mindset', 'Mindset'),
  ('focus', 'Focus');

-- Update existing courses to reference themes
UPDATE courses SET theme_id = (SELECT id FROM collection_themes WHERE name = 'performance') 
WHERE title IN ('Focus', 'Performance');

UPDATE courses SET theme_id = (SELECT id FROM collection_themes WHERE name = 'recovery') 
WHERE title IN ('Sleep', 'Recovery');

UPDATE courses SET theme_id = (SELECT id FROM collection_themes WHERE name = 'mindset') 
WHERE title IN ('Emotional Control', 'Visualisation');

-- Set default theme for any remaining courses
UPDATE courses SET theme_id = (SELECT id FROM collection_themes WHERE name = 'focus') 
WHERE theme_id IS NULL; 