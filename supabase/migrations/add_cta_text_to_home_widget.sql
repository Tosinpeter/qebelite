-- Add cta_text column to home_widget table
-- This migration adds a call-to-action text field to the home widget items

ALTER TABLE home_widget 
ADD COLUMN IF NOT EXISTS cta_text text;

-- Add a comment to describe the column
COMMENT ON COLUMN home_widget.cta_text IS 'Call-to-action button text for the widget';

