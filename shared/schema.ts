import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("user_profiles", {
  id: varchar("id").primaryKey(),
  email: varchar("email", { length: 255 }),
  age: varchar("age", { length: 10 }),
  height: varchar("height", { length: 20 }),
  weight: varchar("weight", { length: 20 }),
  avatarUrl: text("avatar_url"),
  displayName: varchar("display_name", { length: 255 }),
  recipePreference: varchar("recipe_preference", { length: 100 }),
  emailVerified: boolean("email_verified"),
  phoneVerified: boolean("phone_verified"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`NOW()`),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().default(sql`NOW()`),
});

export const huddles = pgTable("huddles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  scheduledAt: timestamp("scheduled_at").notNull(),
  duration: integer("duration").notNull(),
  status: text("status").notNull().default("upcoming"),
});

export const nutritionPlans = pgTable("nutrition_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  meals: text("meals").array(),
  day: text("day"),
});

export const trainingVideos = pgTable("training_videos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  category: text("category").notNull(),
  url: text("url").notNull(),
  duration: integer("duration").notNull(),
  thumbnail: text("thumbnail"),
});

export const homeWidgets = pgTable("home_widgets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(),
  position: integer("position").notNull(),
  visible: boolean("visible").notNull().default(true),
  config: text("config"),
});

export const homeSlider = pgTable("home_slider", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  position: integer("position").notNull(),
  imageUrl: text("image_url").notNull(),
  redirectUrl: text("redirect_url").notNull(),
  text: text("text"),
});

export const homeWidget = pgTable("home_widget", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  position: integer("position").notNull(),
  image: text("image").notNull(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  redirectUrl: text("redirect_url").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`NOW()`),
});

export const weightRoomCollections = pgTable("weight_room_collections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  exercises: text("exercises").array(),
  videoIds: text("video_ids").array(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });
export const updateUserSchema = insertUserSchema.partial();
export const insertHuddleSchema = createInsertSchema(huddles).omit({ id: true });
export const insertNutritionPlanSchema = createInsertSchema(nutritionPlans).omit({ id: true });
export const insertTrainingVideoSchema = createInsertSchema(trainingVideos).omit({ id: true });
export const insertHomeWidgetSchema = createInsertSchema(homeWidgets).omit({ id: true });
export const updateHomeWidgetSchema = insertHomeWidgetSchema.partial();
export const insertHomeSliderSchema = createInsertSchema(homeSlider).omit({ id: true });
export const updateHomeSliderSchema = insertHomeSliderSchema.partial();
export const insertHomeWidgetItemSchema = createInsertSchema(homeWidget).omit({ id: true, createdAt: true });
export const updateHomeWidgetItemSchema = insertHomeWidgetItemSchema.partial();
export const insertWeightRoomCollectionSchema = createInsertSchema(weightRoomCollections).omit({ id: true });

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
export type InsertWeightRoomCollection = z.infer<typeof insertWeightRoomCollectionSchema>;
