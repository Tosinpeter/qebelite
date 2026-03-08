-- QB Training Categories and QB Trainings tables
-- Migrate UP: create category table first, then trainings with FK

-- Categories for QB Trainings (e.g. Fundamentals, Advanced, etc.)
CREATE TABLE IF NOT EXISTS qb_training_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0
);

COMMENT ON TABLE qb_training_categories IS 'Categories for QB training videos';
COMMENT ON COLUMN qb_training_categories.sort_order IS 'Display order in admin and app';

-- QB Trainings: week of release, category, title, video link
CREATE TABLE IF NOT EXISTS qb_trainings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  week_of_release text NOT NULL,
  category_id uuid NOT NULL REFERENCES qb_training_categories(id) ON DELETE CASCADE,
  title text NOT NULL,
  video_link text NOT NULL
);

COMMENT ON TABLE qb_trainings IS 'QB training entries with week of release, category, title and video link';
COMMENT ON COLUMN qb_trainings.week_of_release IS 'Week of release (e.g. Week 1, 2025-01-06)';
COMMENT ON COLUMN qb_trainings.video_link IS 'URL to the training video';

CREATE INDEX IF NOT EXISTS idx_qb_trainings_category_id ON qb_trainings(category_id);
CREATE INDEX IF NOT EXISTS idx_qb_trainings_week_of_release ON qb_trainings(week_of_release);
