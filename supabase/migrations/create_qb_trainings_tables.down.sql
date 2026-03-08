-- Migrate DOWN: revert QB Trainings tables
-- Drop in reverse order (trainings first due to FK, then categories)
DROP TABLE IF EXISTS qb_trainings;
DROP TABLE IF EXISTS qb_training_categories;
