import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  timestamp,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("user_profiles", {
  id: varchar("id").primaryKey(),
  email: varchar("email", { length: 255 }),
  role: varchar("role", { length: 20 }),
  age: varchar("age", { length: 10 }),
  height: varchar("height", { length: 20 }),
  weight: varchar("weight", { length: 20 }),
  avatarUrl: text("avatar_url"),
  displayName: varchar("display_name", { length: 255 }),
  recipePreference: varchar("recipe_preference", { length: 100 }),
  banned: boolean("banned").default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .default(sql`NOW()`),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .default(sql`NOW()`),
});

export const huddles = pgTable("huddles", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  scheduledAt: timestamp("scheduled_at").notNull(),
  duration: integer("duration").notNull(),
  status: text("status").notNull().default("upcoming"),
  image: text("image"),
  meetingLink: text("meeting_link"),
});

export const nutritionPlans = pgTable("nutrition_plans", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  type: text("type").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  meals: text("meals").array(),
  day: text("day"),
});

export const trainingVideos = pgTable("training_videos", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  category: text("category").notNull(),
  url: text("url").notNull(),
  duration: integer("duration").notNull(),
  thumbnail: text("thumbnail"),
});

export const homeWidgets = pgTable("home_widgets", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(),
  position: integer("position").notNull(),
  visible: boolean("visible").notNull().default(true),
  config: text("config"),
});

export const homeSlider = pgTable("home_slider", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  position: integer("position").notNull(),
  imageUrl: text("image_url").notNull(),
  redirectUrl: text("redirect_url").notNull(),
  text: text("text"),
});

export const homeWidget = pgTable("home_widget", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  position: integer("position").notNull(),
  image: text("image").notNull(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  redirectUrl: text("redirect_url").notNull(),
  ctaText: text("cta_text"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .default(sql`NOW()`),
});

export const weightRoomCollections = pgTable("weight_room_collections", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  position: integer("position").notNull(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  image: text("image").notNull(),
});

export const weightRoomVideos = pgTable("weight_room_videos", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  collectionId: varchar("collection_id")
    .notNull()
    .references(() => weightRoomCollections.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  videoUrl: text("video_url").notNull(),
});

export const recipes = pgTable("recipes", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  createdAt: timestamp("created_at", { withTimezone: true }).default(
    sql`NOW()`,
  ),
  type: text("type").notNull(),
  meal: text("meal").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  ingredients: text("ingredients").array().notNull(),
  instructions: text("instructions").array().notNull(),
  image: text("image").notNull(),
});

export const nutritionVideos = pgTable("nutrition_videos", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  createdAt: timestamp("created_at", { withTimezone: true }).default(
    sql`NOW()`,
  ),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  videoUrl: text("video_url").notNull(),
  thumbnail: text("thumbnail"),
  duration: integer("duration"),
});

export const athleteResources = pgTable("athlete_resources", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  createdAt: timestamp("created_at", { withTimezone: true }).default(
    sql`NOW()`,
  ),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  externalUrl: text("external_url").notNull(),
});

export const coachingAvailability = pgTable("coaching_availability", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  dayOfWeek: integer("day_of_week").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  sessionDuration: integer("session_duration").notNull().default(60),
  active: boolean("active").notNull().default(true),
});

export const coachingSessions = pgTable("coaching_sessions", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  createdAt: timestamp("created_at", { withTimezone: true }).default(
    sql`NOW()`,
  ),
  userId: varchar("user_id"),
  clientName: text("client_name").notNull(),
  clientEmail: text("client_email").notNull(),
  clientPhone: text("client_phone"),
  sessionDate: timestamp("session_date").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  status: text("status").notNull().default("pending"),
  notes: text("notes"),
});

export const notifications = pgTable("notifications", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  type: text("type").notNull().default("general"),
  data: text("data"),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .default(sql`NOW()`),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const updateUserSchema = insertUserSchema.partial();
export const insertHuddleSchema = createInsertSchema(huddles).omit({
  id: true,
});
export const insertNutritionPlanSchema = createInsertSchema(
  nutritionPlans,
).omit({ id: true });
export const insertTrainingVideoSchema = createInsertSchema(
  trainingVideos,
).omit({ id: true });
export const insertHomeWidgetSchema = createInsertSchema(homeWidgets).omit({
  id: true,
});
export const updateHomeWidgetSchema = insertHomeWidgetSchema.partial();
export const insertHomeSliderSchema = createInsertSchema(homeSlider).omit({
  id: true,
});
export const updateHomeSliderSchema = insertHomeSliderSchema.partial();
export const insertHomeWidgetItemSchema = createInsertSchema(homeWidget).omit({
  id: true,
  createdAt: true,
});
export const updateHomeWidgetItemSchema = insertHomeWidgetItemSchema.partial();
export const insertWeightRoomCollectionSchema = createInsertSchema(
  weightRoomCollections,
).omit({ id: true });
export const insertWeightRoomVideoSchema = createInsertSchema(
  weightRoomVideos,
).omit({ id: true });
export const insertRecipeSchema = createInsertSchema(recipes).omit({
  id: true,
  createdAt: true,
});
export const insertNutritionVideoSchema = createInsertSchema(
  nutritionVideos,
).omit({ id: true, createdAt: true });
export const insertAthleteResourceSchema = createInsertSchema(
  athleteResources,
).omit({ id: true, createdAt: true });
export const insertCoachingAvailabilitySchema = createInsertSchema(
  coachingAvailability,
).omit({ id: true });
export const insertCoachingSessionSchema = createInsertSchema(
  coachingSessions,
).omit({ id: true, createdAt: true });
export const userPointsBalance = pgTable("user_points", {
  userId: varchar("user_id").primaryKey(),
  totalPoints: integer("total_points").notNull().default(0),
  lifetimePoints: integer("lifetime_points").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true }).default(
    sql`NOW()`,
  ),
});

export const pointsTransactions = pgTable("points_transactions", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  points: integer("points").notNull(),
  transactionType: text("transaction_type").notNull(),
  contentType: text("content_type"),
  contentId: text("content_id"),
  contentTitle: text("content_title"),
  description: text("description"),
  redemptionCode: text("redemption_code"),
  createdAt: timestamp("created_at", { withTimezone: true }).default(
    sql`NOW()`,
  ),
});

export const pointsConfig = pgTable("points_config", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  activityType: text("activity_type").notNull(),
  pointsValue: integer("points_value").notNull(),
  label: text("label").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).default(
    sql`NOW()`,
  ),
});

export const workouts = pgTable("workouts", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  collection: text("collection").array(),
  description: text("description"),
  videoUrl: text("video_url").notNull(),
});

export const qbTrainingCategories = pgTable("qb_training_categories", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const qbTrainings = pgTable("qb_trainings", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  weekOfRelease: text("week_of_release").notNull(),
  categoryId: varchar("category_id")
    .notNull()
    .references(() => qbTrainingCategories.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  videoLink: text("video_link").notNull(),
});

// Workout plans for the week/month (e.g. by age group: 8-10 yr old)
// Structure: Plan → Weeks (Week 1, Week 5, ...) → Days (Day 1, Day 2, Day 3, Optional Running) → Exercises
export const workoutPlans = pgTable("workout_plans", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  periodType: text("period_type").notNull().default("week"), // "week" | "month"
  createdAt: timestamp("created_at", { withTimezone: true }).default(
    sql`NOW()`,
  ),
});

export const workoutPlanWeeks = pgTable("workout_plan_weeks", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  planId: varchar("plan_id")
    .notNull()
    .references(() => workoutPlans.id, { onDelete: "cascade" }),
  label: text("label").notNull(), // e.g. "Week 1", "Week 5"
  sortOrder: integer("sort_order").notNull().default(0),
});

export const workoutPlanDays = pgTable("workout_plan_days", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  weekId: varchar("week_id")
    .notNull()
    .references(() => workoutPlanWeeks.id, { onDelete: "cascade" }),
  label: text("label").notNull(), // e.g. "Day 1", "Day 2", "Optional Running Day"
  sortOrder: integer("sort_order").notNull().default(0),
});

export const workoutPlanExercises = pgTable("workout_plan_exercises", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  dayId: varchar("day_id")
    .notNull()
    .references(() => workoutPlanDays.id, { onDelete: "cascade" }),
  exerciseName: text("exercise_name").notNull(),
  sets: text("sets").notNull(), // "1", "2", "1- Singles"
  reps: text("reps").notNull(), // "30 seconds", "To Failure", "6-8", "10 yds"
  sortOrder: integer("sort_order").notNull().default(0),
});

export const redemptionOptions = pgTable("redemption_options", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  pointsCost: integer("points_cost").notNull().default(0),
  rewardType: text("reward_type").notNull(),
  discountCode: text("discount_code"),
  discountPercentage: integer("discount_percentage"),
  isActive: boolean("is_active").notNull().default(true),
  quantityAvailable: integer("quantity_available"),
  sortOrder: integer("sort_order").notNull().default(0),
  iconName: text("icon_name"),
  createdAt: timestamp("created_at", { withTimezone: true }).default(
    sql`NOW()`,
  ),
  updatedAt: timestamp("updated_at", { withTimezone: true }).default(
    sql`NOW()`,
  ),
});

export const insertWorkoutSchema = createInsertSchema(workouts).omit({
  id: true,
});
export const updateWorkoutSchema = insertWorkoutSchema.partial();
export const insertQbTrainingCategorySchema = createInsertSchema(
  qbTrainingCategories,
).omit({ id: true });
export const updateQbTrainingCategorySchema =
  insertQbTrainingCategorySchema.partial();
export const insertQbTrainingSchema = createInsertSchema(qbTrainings).omit({
  id: true,
});
export const updateQbTrainingSchema = insertQbTrainingSchema.partial();
export const insertWorkoutPlanSchema = createInsertSchema(workoutPlans).omit({
  id: true,
  createdAt: true,
});
export const updateWorkoutPlanSchema = insertWorkoutPlanSchema.partial();
export const insertWorkoutPlanWeekSchema = createInsertSchema(
  workoutPlanWeeks,
).omit({ id: true });
export const updateWorkoutPlanWeekSchema = insertWorkoutPlanWeekSchema.partial();
export const insertWorkoutPlanDaySchema = createInsertSchema(
  workoutPlanDays,
).omit({ id: true });
export const updateWorkoutPlanDaySchema = insertWorkoutPlanDaySchema.partial();
export const insertWorkoutPlanExerciseSchema = createInsertSchema(
  workoutPlanExercises,
).omit({ id: true });
export const updateWorkoutPlanExerciseSchema =
  insertWorkoutPlanExerciseSchema.partial();

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});
export const updateNotificationSchema = insertNotificationSchema.partial();

export type UserPointsBalance = typeof userPointsBalance.$inferSelect;
export type PointsTransaction = typeof pointsTransactions.$inferSelect;
export type PointsConfigEntry = typeof pointsConfig.$inferSelect;
export type RedemptionOption = typeof redemptionOptions.$inferSelect;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Huddle = typeof huddles.$inferSelect;
export type InsertHuddle = z.infer<typeof insertHuddleSchema>;
export type NutritionPlan = typeof nutritionPlans.$inferSelect;
export type InsertNutritionPlan = z.infer<typeof insertNutritionPlanSchema>;
export type TrainingVideo = typeof trainingVideos.$inferSelect;
export type InsertTrainingVideo = z.infer<typeof insertTrainingVideoSchema>;
export type HomeWidget = typeof homeWidgets.$inferSelect;
export type InsertHomeWidget = z.infer<typeof insertHomeWidgetSchema>;
export type HomeSlide = typeof homeSlider.$inferSelect;
export type InsertHomeSlide = z.infer<typeof insertHomeSliderSchema>;
export type HomeWidgetItem = typeof homeWidget.$inferSelect;
export type InsertHomeWidgetItem = z.infer<typeof insertHomeWidgetItemSchema>;
export type WeightRoomCollection = typeof weightRoomCollections.$inferSelect;
export type InsertWeightRoomCollection = z.infer<
  typeof insertWeightRoomCollectionSchema
>;
export type WeightRoomVideo = typeof weightRoomVideos.$inferSelect;
export type InsertWeightRoomVideo = z.infer<typeof insertWeightRoomVideoSchema>;
export type Recipe = typeof recipes.$inferSelect;
export type InsertRecipe = z.infer<typeof insertRecipeSchema>;
export type NutritionVideo = typeof nutritionVideos.$inferSelect;
export type InsertNutritionVideo = z.infer<typeof insertNutritionVideoSchema>;
export type AthleteResource = typeof athleteResources.$inferSelect;
export type InsertAthleteResource = z.infer<typeof insertAthleteResourceSchema>;
export type CoachingAvailability = typeof coachingAvailability.$inferSelect;
export type InsertCoachingAvailability = z.infer<
  typeof insertCoachingAvailabilitySchema
>;
export type CoachingSession = typeof coachingSessions.$inferSelect;
export type InsertCoachingSession = z.infer<typeof insertCoachingSessionSchema>;
export type Workout = typeof workouts.$inferSelect;
export type InsertWorkout = z.infer<typeof insertWorkoutSchema>;
export type QbTrainingCategory = typeof qbTrainingCategories.$inferSelect;
export type InsertQbTrainingCategory = z.infer<
  typeof insertQbTrainingCategorySchema
>;
export type QbTraining = typeof qbTrainings.$inferSelect;
export type InsertQbTraining = z.infer<typeof insertQbTrainingSchema>;
export type WorkoutPlan = typeof workoutPlans.$inferSelect;
export type InsertWorkoutPlan = z.infer<typeof insertWorkoutPlanSchema>;
export type WorkoutPlanWeek = typeof workoutPlanWeeks.$inferSelect;
export type InsertWorkoutPlanWeek = z.infer<typeof insertWorkoutPlanWeekSchema>;
export type WorkoutPlanDay = typeof workoutPlanDays.$inferSelect;
export type InsertWorkoutPlanDay = z.infer<typeof insertWorkoutPlanDaySchema>;
export type WorkoutPlanExercise = typeof workoutPlanExercises.$inferSelect;
export type InsertWorkoutPlanExercise = z.infer<
  typeof insertWorkoutPlanExerciseSchema
>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
