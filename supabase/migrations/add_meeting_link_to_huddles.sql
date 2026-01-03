-- Add meeting_link column to huddles table
ALTER TABLE huddles 
ADD COLUMN IF NOT EXISTS meeting_link text;

-- Add comment
COMMENT ON COLUMN huddles.meeting_link IS 'Meeting link for the huddle (e.g., Zoom, Google Meet, Teams)';

