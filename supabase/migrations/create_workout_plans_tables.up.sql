-- Workout plans for the week/month (e.g. by age group: 8-10 yr old)
-- Structure: Plan → Weeks → Days → Exercises
-- Migrate UP

CREATE TABLE IF NOT EXISTS workout_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  period_type text NOT NULL DEFAULT 'week',
  created_at timestamptz DEFAULT NOW()
);

COMMENT ON TABLE workout_plans IS 'Workout plan templates (e.g. by age group: 8-10 yr old) for week/month';

CREATE TABLE IF NOT EXISTS workout_plan_weeks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid NOT NULL REFERENCES workout_plans(id) ON DELETE CASCADE,
  label text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0
);

COMMENT ON TABLE workout_plan_weeks IS 'Weeks within a plan (e.g. Week 1, Week 5)';

CREATE TABLE IF NOT EXISTS workout_plan_days (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  week_id uuid NOT NULL REFERENCES workout_plan_weeks(id) ON DELETE CASCADE,
  label text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0
);

COMMENT ON TABLE workout_plan_days IS 'Days within a week (Day 1, Day 2, Optional Running Day)';

CREATE TABLE IF NOT EXISTS workout_plan_exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_id uuid NOT NULL REFERENCES workout_plan_days(id) ON DELETE CASCADE,
  exercise_name text NOT NULL,
  sets text NOT NULL,
  reps text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0
);

COMMENT ON TABLE workout_plan_exercises IS 'Exercises per day: exercise name, sets, reps (e.g. 30 seconds, To Failure)';

CREATE INDEX IF NOT EXISTS idx_workout_plan_weeks_plan_id ON workout_plan_weeks(plan_id);
CREATE INDEX IF NOT EXISTS idx_workout_plan_days_week_id ON workout_plan_days(week_id);
CREATE INDEX IF NOT EXISTS idx_workout_plan_exercises_day_id ON workout_plan_exercises(day_id);
