-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id character varying DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  user_id character varying NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  type text NOT NULL DEFAULT 'general',
  data jsonb,
  read boolean DEFAULT false NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Add user_id to coaching_sessions if it doesn't exist
ALTER TABLE coaching_sessions 
ADD COLUMN IF NOT EXISTS user_id character varying;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_coaching_sessions_user_id ON coaching_sessions(user_id);

-- Add comments
COMMENT ON TABLE notifications IS 'Push notifications and in-app notifications for users';
COMMENT ON COLUMN notifications.type IS 'Type of notification: general, booking, huddle, nutrition, training';
COMMENT ON COLUMN notifications.data IS 'Additional JSON data for the notification (e.g., booking details, deep links)';
COMMENT ON COLUMN coaching_sessions.user_id IS 'User ID of the person who booked the session';

