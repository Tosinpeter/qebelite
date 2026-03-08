-- Workouts table: name, collection (list), description, video_url
-- Migrate UP: create the workouts table
CREATE TABLE IF NOT EXISTS workouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  collection text[] DEFAULT '{}',
  description text,
  video_url text NOT NULL
);

COMMENT ON TABLE workouts IS 'Workout entries with name, collection tags, description and video URL';
COMMENT ON COLUMN workouts.collection IS 'List of collection/category tags (e.g. Strength, Cardio, HIIT)';
