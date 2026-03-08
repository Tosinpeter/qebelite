-- Migrate DOWN: revert workout plans tables (reverse FK order)
DROP TABLE IF EXISTS workout_plan_exercises;
DROP TABLE IF EXISTS workout_plan_days;
DROP TABLE IF EXISTS workout_plan_weeks;
DROP TABLE IF EXISTS workout_plans;
