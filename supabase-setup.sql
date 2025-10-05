-- Run this in your Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → Paste and Run

-- Create home_banners table
CREATE TABLE IF NOT EXISTS home_banners (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  position INTEGER NOT NULL,
  image_url TEXT NOT NULL,
  redirect_url TEXT NOT NULL
);

-- Create home_slider table
CREATE TABLE IF NOT EXISTS home_slider (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  position INTEGER NOT NULL,
  image_url TEXT NOT NULL,
  redirect_url TEXT NOT NULL,
  title TEXT,
  description TEXT
);

-- Seed home_banners with 5 banners
INSERT INTO home_banners (position, image_url, redirect_url) VALUES
(0, 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48', 'https://qebelite.com/programs'),
(1, 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438', 'https://qebelite.com/nutrition'),
(2, 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b', 'https://qebelite.com/training'),
(3, 'https://images.unsplash.com/photo-1574680096145-d05b474e2155', 'https://qebelite.com/huddles'),
(4, 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2', 'https://qebelite.com/join')
ON CONFLICT (id) DO NOTHING;

-- Seed home_slider with 5 slides
INSERT INTO home_slider (position, image_url, redirect_url, title, description) VALUES
(0, 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438', 'https://qebelite.com/welcome', 'Welcome to QEB Elite', 'Transform your fitness journey'),
(1, 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48', 'https://qebelite.com/programs', 'Elite Training Programs', 'Customized for your goals'),
(2, 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b', 'https://qebelite.com/coaching', 'Expert Coaching', 'Guidance every step of the way'),
(3, 'https://images.unsplash.com/photo-1574680096145-d05b474e2155', 'https://qebelite.com/nutrition', 'Nutrition Plans', 'Fuel your performance'),
(4, 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2', 'https://qebelite.com/community', 'Join Our Community', 'Train with the best')
ON CONFLICT (id) DO NOTHING;
