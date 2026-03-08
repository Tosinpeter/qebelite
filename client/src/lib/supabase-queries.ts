import { supabase } from "./supabase";
import type {
  User,
  Huddle,
  NutritionPlan,
  TrainingVideo,
  HomeWidget,
  HomeSlide,
  HomeWidgetItem,
  WeightRoomCollection,
  WeightRoomVideo,
  Workout,
  QbTrainingCategory,
  QbTraining,
  WorkoutPlan,
  WorkoutPlanWeek,
  WorkoutPlanDay,
  WorkoutPlanExercise,
  Recipe,
  NutritionVideo,
  AthleteResource,
  CoachingAvailability,
  CoachingSession,
  Notification,
  UserPointsBalance,
  PointsTransaction,
  PointsConfigEntry,
  RedemptionOption,
} from "@shared/schema";

const mapUserFromDb = (dbUser: any): User => ({
  id: dbUser.id,
  email: dbUser.email || null,
  role: dbUser.role || "user",
  age: dbUser.age || null,
  height: dbUser.height || null,
  weight: dbUser.weight || null,
  avatarUrl: dbUser.avatar_url || null,
  displayName: dbUser.display_name || null,
  recipePreference: dbUser.recipe_preference || null,
  banned: false, // Default to false since column doesn't exist yet
  createdAt: dbUser.created_at,
  updatedAt: dbUser.updated_at,
});

const mapUserToDb = (user: Partial<User>): any => {
  const dbUser: any = {};
  if (user.id !== undefined) dbUser.id = user.id;
  if (user.email !== undefined) dbUser.email = user.email;
  if (user.role !== undefined) dbUser.role = user.role;
  if (user.age !== undefined) dbUser.age = user.age;
  if (user.height !== undefined) dbUser.height = user.height;
  if (user.weight !== undefined) dbUser.weight = user.weight;
  if (user.avatarUrl !== undefined) dbUser.avatar_url = user.avatarUrl;
  if (user.displayName !== undefined) dbUser.display_name = user.displayName;
  if (user.recipePreference !== undefined)
    dbUser.recipe_preference = user.recipePreference;
  // Note: banned field not included since column doesn't exist in profiles table yet
  return dbUser;
};

export const userQueries = {
  getAll: async () => {
    const timestamp = new Date().toISOString();
    console.log(`🔍 [${timestamp}] Fetching users from profiles table...`);

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    console.log(
      `📊 [${timestamp}] Found`,
      data?.length || 0,
      "users in database",
    );

    if (error) {
      console.error(`❌ [${timestamp}] Supabase error:`, error);
      throw error;
    }

    const mappedUsers = data.map(mapUserFromDb);
    console.log(`✅ [${timestamp}] Returning`, mappedUsers.length, "users");

    return mappedUsers;
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return mapUserFromDb(data);
  },

  create: async (user: Partial<User>) => {
    const dbUser = mapUserToDb(user);
    // Use upsert to handle cases where auth trigger already created profile
    const { data, error } = await supabase
      .from("profiles")
      .upsert(dbUser, { onConflict: "id" })
      .select()
      .single();

    if (error) throw error;
    return mapUserFromDb(data);
  },

  update: async (id: string, updates: Partial<User>) => {
    const dbUpdates = mapUserToDb(updates);
    const { data, error } = await supabase
      .from("profiles")
      .update(dbUpdates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return mapUserFromDb(data);
  },

  delete: async (id: string) => {
    const { error } = await supabase.rpc("delete_user_and_auth", {
      user_id: id,
    });

    if (error) throw error;
  },
};

const mapHuddleFromDb = (dbHuddle: any): Huddle => ({
  id: dbHuddle.id,
  title: dbHuddle.title,
  description: dbHuddle.description,
  scheduledAt: dbHuddle.scheduled_at,
  duration: dbHuddle.duration,
  status: dbHuddle.status,
  image: dbHuddle.image,
  meetingLink: dbHuddle.meeting_link,
});

const mapHuddleToDb = (huddle: Partial<Huddle>) => ({
  title: huddle.title,
  description: huddle.description,
  scheduled_at: huddle.scheduledAt,
  duration: huddle.duration,
  status: huddle.status,
  image: huddle.image,
  meeting_link: huddle.meetingLink,
});

export const huddleQueries = {
  getAll: async () => {
    const { data, error } = await supabase
      .from("huddles")
      .select("*")
      .order("scheduled_at", { ascending: true });

    if (error) throw error;
    return data.map(mapHuddleFromDb);
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from("huddles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return mapHuddleFromDb(data);
  },

  create: async (huddle: Partial<Huddle>) => {
    const dbHuddle = mapHuddleToDb(huddle);
    const { data, error } = await supabase
      .from("huddles")
      .insert(dbHuddle)
      .select()
      .single();

    if (error) throw error;
    return mapHuddleFromDb(data);
  },

  update: async (id: string, updates: Partial<Huddle>) => {
    const dbUpdates = mapHuddleToDb(updates);
    const { data, error } = await supabase
      .from("huddles")
      .update(dbUpdates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return mapHuddleFromDb(data);
  },

  delete: async (id: string) => {
    const { error } = await supabase.from("huddles").delete().eq("id", id);

    if (error) throw error;
  },
};

export const nutritionQueries = {
  getAll: async () => {
    const { data, error } = await supabase
      .from("nutrition_plans")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as NutritionPlan[];
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from("nutrition_plans")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as NutritionPlan;
  },

  create: async (plan: Partial<NutritionPlan>) => {
    const { data, error } = await supabase
      .from("nutrition_plans")
      .insert(plan)
      .select()
      .single();

    if (error) throw error;
    return data as NutritionPlan;
  },

  update: async (id: string, updates: Partial<NutritionPlan>) => {
    const { data, error } = await supabase
      .from("nutrition_plans")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as NutritionPlan;
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from("nutrition_plans")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};

export const trainingVideoQueries = {
  getAll: async () => {
    const { data, error } = await supabase
      .from("training_videos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as TrainingVideo[];
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from("training_videos")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as TrainingVideo;
  },

  create: async (video: Partial<TrainingVideo>) => {
    const { data, error } = await supabase
      .from("training_videos")
      .insert(video)
      .select()
      .single();

    if (error) throw error;
    return data as TrainingVideo;
  },

  update: async (id: string, updates: Partial<TrainingVideo>) => {
    const { data, error } = await supabase
      .from("training_videos")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as TrainingVideo;
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from("training_videos")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};

const mapHomeSlideFromDb = (dbSlide: any): HomeSlide => ({
  id: dbSlide.id,
  position: dbSlide.position,
  imageUrl: dbSlide.image_url,
  redirectUrl: dbSlide.redirect_url,
  text: dbSlide.text,
});

const mapHomeSlideToDb = (slide: Partial<HomeSlide>): any => {
  const dbSlide: any = {};
  if (slide.id !== undefined) dbSlide.id = slide.id;
  if (slide.position !== undefined) dbSlide.position = slide.position;
  if (slide.imageUrl !== undefined) dbSlide.image_url = slide.imageUrl;
  if (slide.redirectUrl !== undefined) dbSlide.redirect_url = slide.redirectUrl;
  if (slide.text !== undefined) dbSlide.text = slide.text;
  return dbSlide;
};

export const homeSlideQueries = {
  getAll: async () => {
    const { data, error } = await supabase
      .from("home_slider")
      .select("*")
      .order("position", { ascending: true });

    if (error) throw error;
    return data.map(mapHomeSlideFromDb);
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from("home_slider")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return mapHomeSlideFromDb(data);
  },

  create: async (slide: Partial<HomeSlide>) => {
    const dbSlide = mapHomeSlideToDb(slide);
    const { data, error } = await supabase
      .from("home_slider")
      .insert(dbSlide)
      .select()
      .single();

    if (error) throw error;
    return mapHomeSlideFromDb(data);
  },

  update: async (id: string, updates: Partial<HomeSlide>) => {
    const dbUpdates = mapHomeSlideToDb(updates);
    const { data, error } = await supabase
      .from("home_slider")
      .update(dbUpdates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return mapHomeSlideFromDb(data);
  },

  delete: async (id: string) => {
    const { error } = await supabase.from("home_slider").delete().eq("id", id);

    if (error) throw error;
  },
};

const mapHomeWidgetItemFromDb = (dbWidget: any): HomeWidgetItem => ({
  id: dbWidget.id,
  position: dbWidget.position,
  image: dbWidget.image,
  title: dbWidget.title,
  subtitle: dbWidget.subtitle,
  redirectUrl: dbWidget.redirect_url,
  ctaText: dbWidget.cta_text,
  createdAt: dbWidget.created_at,
});

const mapHomeWidgetItemToDb = (widget: Partial<HomeWidgetItem>): any => {
  const dbWidget: any = {};
  if (widget.id !== undefined) dbWidget.id = widget.id;
  if (widget.position !== undefined) dbWidget.position = widget.position;
  if (widget.image !== undefined) dbWidget.image = widget.image;
  if (widget.title !== undefined) dbWidget.title = widget.title;
  if (widget.subtitle !== undefined) dbWidget.subtitle = widget.subtitle;
  if (widget.redirectUrl !== undefined)
    dbWidget.redirect_url = widget.redirectUrl;
  if (widget.ctaText !== undefined) dbWidget.cta_text = widget.ctaText;
  if (widget.createdAt !== undefined) dbWidget.created_at = widget.createdAt;
  return dbWidget;
};

export const homeWidgetItemQueries = {
  getAll: async () => {
    const { data, error } = await supabase
      .from("home_widget")
      .select("*")
      .order("position", { ascending: true });

    if (error) throw error;
    return data.map(mapHomeWidgetItemFromDb);
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from("home_widget")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return mapHomeWidgetItemFromDb(data);
  },

  create: async (widget: Partial<HomeWidgetItem>) => {
    const dbWidget = mapHomeWidgetItemToDb(widget);
    const { data, error } = await supabase
      .from("home_widget")
      .insert(dbWidget)
      .select()
      .single();

    if (error) throw error;
    return mapHomeWidgetItemFromDb(data);
  },

  update: async (id: string, updates: Partial<HomeWidgetItem>) => {
    const dbUpdates = mapHomeWidgetItemToDb(updates);
    const { data, error } = await supabase
      .from("home_widget")
      .update(dbUpdates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return mapHomeWidgetItemFromDb(data);
  },

  delete: async (id: string) => {
    const { error } = await supabase.from("home_widget").delete().eq("id", id);

    if (error) throw error;
  },
};

const mapWeightRoomCollectionFromDb = (
  dbCollection: any,
): WeightRoomCollection => ({
  id: dbCollection.id,
  position: dbCollection.position,
  title: dbCollection.title,
  subtitle: dbCollection.subtitle,
  image: dbCollection.image,
});

const mapWeightRoomCollectionToDb = (
  collection: Partial<WeightRoomCollection>,
): any => {
  const dbCollection: any = {};
  if (collection.id !== undefined) dbCollection.id = collection.id;
  if (collection.position !== undefined)
    dbCollection.position = collection.position;
  if (collection.title !== undefined) dbCollection.title = collection.title;
  if (collection.subtitle !== undefined)
    dbCollection.subtitle = collection.subtitle;
  if (collection.image !== undefined) dbCollection.image = collection.image;
  return dbCollection;
};

export const weightRoomQueries = {
  getAll: async () => {
    const { data, error } = await supabase
      .from("weight_room_collections")
      .select("*")
      .order("position", { ascending: true });

    if (error) throw error;
    return data.map(mapWeightRoomCollectionFromDb);
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from("weight_room_collections")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return mapWeightRoomCollectionFromDb(data);
  },

  create: async (collection: Partial<WeightRoomCollection>) => {
    const dbCollection = mapWeightRoomCollectionToDb(collection);
    const { data, error } = await supabase
      .from("weight_room_collections")
      .insert(dbCollection)
      .select()
      .single();

    if (error) throw error;
    return mapWeightRoomCollectionFromDb(data);
  },

  update: async (id: string, updates: Partial<WeightRoomCollection>) => {
    const dbUpdates = mapWeightRoomCollectionToDb(updates);
    const { data, error } = await supabase
      .from("weight_room_collections")
      .update(dbUpdates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return mapWeightRoomCollectionFromDb(data);
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from("weight_room_collections")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};

const mapWeightRoomVideoFromDb = (dbVideo: any): WeightRoomVideo => ({
  id: dbVideo.id,
  collectionId: dbVideo.collection_id,
  title: dbVideo.title,
  description: dbVideo.description,
  videoUrl: dbVideo.video_url,
});

const mapWorkoutFromDb = (dbWorkout: any): Workout => ({
  id: dbWorkout.id,
  name: dbWorkout.name,
  collection: dbWorkout.collection ?? [],
  description: dbWorkout.description,
  videoUrl: dbWorkout.video_url,
});

const mapWorkoutToDb = (workout: Partial<Workout>): any => {
  const db: any = {};
  if (workout.name !== undefined) db.name = workout.name;
  if (workout.collection !== undefined) db.collection = workout.collection;
  if (workout.description !== undefined) db.description = workout.description;
  if (workout.videoUrl !== undefined) db.video_url = workout.videoUrl;
  return db;
};

export const workoutQueries = {
  getAll: async (): Promise<Workout[]> => {
    const { data, error } = await supabase
      .from("workouts")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;
    return (data ?? []).map(mapWorkoutFromDb);
  },

  getById: async (id: string): Promise<Workout> => {
    const { data, error } = await supabase
      .from("workouts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return mapWorkoutFromDb(data);
  },

  create: async (workout: Partial<Workout>): Promise<Workout> => {
    const db = mapWorkoutToDb(workout);
    const { data, error } = await supabase
      .from("workouts")
      .insert(db)
      .select()
      .single();

    if (error) throw error;
    return mapWorkoutFromDb(data);
  },

  update: async (id: string, updates: Partial<Workout>): Promise<Workout> => {
    const db = mapWorkoutToDb(updates);
    const { data, error } = await supabase
      .from("workouts")
      .update(db)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return mapWorkoutFromDb(data);
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase.from("workouts").delete().eq("id", id);
    if (error) throw error;
  },
};

const mapQbTrainingCategoryFromDb = (row: any): QbTrainingCategory => ({
  id: row.id,
  name: row.name,
  sortOrder: row.sort_order ?? 0,
});

const mapQbTrainingCategoryToDb = (c: Partial<QbTrainingCategory>): any => {
  const db: any = {};
  if (c.name !== undefined) db.name = c.name;
  if (c.sortOrder !== undefined) db.sort_order = c.sortOrder;
  return db;
};

export const qbTrainingCategoryQueries = {
  getAll: async (): Promise<QbTrainingCategory[]> => {
    const { data, error } = await supabase
      .from("qb_training_categories")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });
    if (error) throw error;
    return (data ?? []).map(mapQbTrainingCategoryFromDb);
  },

  getById: async (id: string): Promise<QbTrainingCategory> => {
    const { data, error } = await supabase
      .from("qb_training_categories")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return mapQbTrainingCategoryFromDb(data);
  },

  create: async (
    category: Partial<QbTrainingCategory>,
  ): Promise<QbTrainingCategory> => {
    const db = mapQbTrainingCategoryToDb(category);
    const { data, error } = await supabase
      .from("qb_training_categories")
      .insert(db)
      .select()
      .single();
    if (error) throw error;
    return mapQbTrainingCategoryFromDb(data);
  },

  update: async (
    id: string,
    updates: Partial<QbTrainingCategory>,
  ): Promise<QbTrainingCategory> => {
    const db = mapQbTrainingCategoryToDb(updates);
    const { data, error } = await supabase
      .from("qb_training_categories")
      .update(db)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return mapQbTrainingCategoryFromDb(data);
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from("qb_training_categories")
      .delete()
      .eq("id", id);
    if (error) throw error;
  },
};

const mapQbTrainingFromDb = (row: any): QbTraining => ({
  id: row.id,
  weekOfRelease: row.week_of_release,
  categoryId: row.category_id,
  title: row.title,
  videoLink: row.video_link,
});

const mapQbTrainingToDb = (t: Partial<QbTraining>): any => {
  const db: any = {};
  if (t.weekOfRelease !== undefined) db.week_of_release = t.weekOfRelease;
  if (t.categoryId !== undefined) db.category_id = t.categoryId;
  if (t.title !== undefined) db.title = t.title;
  if (t.videoLink !== undefined) db.video_link = t.videoLink;
  return db;
};

export const qbTrainingQueries = {
  getAll: async (): Promise<QbTraining[]> => {
    const { data, error } = await supabase
      .from("qb_trainings")
      .select("*")
      .order("week_of_release", { ascending: false })
      .order("title", { ascending: true });
    if (error) throw error;
    return (data ?? []).map(mapQbTrainingFromDb);
  },

  getById: async (id: string): Promise<QbTraining> => {
    const { data, error } = await supabase
      .from("qb_trainings")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return mapQbTrainingFromDb(data);
  },

  getByCategoryId: async (
    categoryId: string,
  ): Promise<QbTraining[]> => {
    const { data, error } = await supabase
      .from("qb_trainings")
      .select("*")
      .eq("category_id", categoryId)
      .order("week_of_release", { ascending: false })
      .order("title", { ascending: true });
    if (error) throw error;
    return (data ?? []).map(mapQbTrainingFromDb);
  },

  create: async (training: Partial<QbTraining>): Promise<QbTraining> => {
    const db = mapQbTrainingToDb(training);
    const { data, error } = await supabase
      .from("qb_trainings")
      .insert(db)
      .select()
      .single();
    if (error) throw error;
    return mapQbTrainingFromDb(data);
  },

  update: async (
    id: string,
    updates: Partial<QbTraining>,
  ): Promise<QbTraining> => {
    const db = mapQbTrainingToDb(updates);
    const { data, error } = await supabase
      .from("qb_trainings")
      .update(db)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return mapQbTrainingFromDb(data);
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from("qb_trainings")
      .delete()
      .eq("id", id);
    if (error) throw error;
  },
};

const mapWorkoutPlanFromDb = (row: any): WorkoutPlan => ({
  id: row.id,
  name: row.name,
  description: row.description,
  periodType: row.period_type ?? "week",
  createdAt: row.created_at,
});

const mapWorkoutPlanToDb = (p: Partial<WorkoutPlan>): any => {
  const db: any = {};
  if (p.name !== undefined) db.name = p.name;
  if (p.description !== undefined) db.description = p.description;
  if (p.periodType !== undefined) db.period_type = p.periodType;
  return db;
};

export const workoutPlanQueries = {
  getAll: async (): Promise<WorkoutPlan[]> => {
    const { data, error } = await supabase
      .from("workout_plans")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(mapWorkoutPlanFromDb);
  },

  getById: async (id: string): Promise<WorkoutPlan> => {
    const { data, error } = await supabase
      .from("workout_plans")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return mapWorkoutPlanFromDb(data);
  },

  create: async (plan: Partial<WorkoutPlan>): Promise<WorkoutPlan> => {
    const db = mapWorkoutPlanToDb(plan);
    const { data, error } = await supabase
      .from("workout_plans")
      .insert(db)
      .select()
      .single();
    if (error) throw error;
    return mapWorkoutPlanFromDb(data);
  },

  update: async (
    id: string,
    updates: Partial<WorkoutPlan>,
  ): Promise<WorkoutPlan> => {
    const db = mapWorkoutPlanToDb(updates);
    const { data, error } = await supabase
      .from("workout_plans")
      .update(db)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return mapWorkoutPlanFromDb(data);
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from("workout_plans")
      .delete()
      .eq("id", id);
    if (error) throw error;
  },
};

const mapWorkoutPlanWeekFromDb = (row: any): WorkoutPlanWeek => ({
  id: row.id,
  planId: row.plan_id,
  label: row.label,
  sortOrder: row.sort_order ?? 0,
});

const mapWorkoutPlanWeekToDb = (w: Partial<WorkoutPlanWeek>): any => {
  const db: any = {};
  if (w.planId !== undefined) db.plan_id = w.planId;
  if (w.label !== undefined) db.label = w.label;
  if (w.sortOrder !== undefined) db.sort_order = w.sortOrder;
  return db;
};

export const workoutPlanWeekQueries = {
  getByPlanId: async (planId: string): Promise<WorkoutPlanWeek[]> => {
    const { data, error } = await supabase
      .from("workout_plan_weeks")
      .select("*")
      .eq("plan_id", planId)
      .order("sort_order", { ascending: true })
      .order("label", { ascending: true });
    if (error) throw error;
    return (data ?? []).map(mapWorkoutPlanWeekFromDb);
  },

  getById: async (id: string): Promise<WorkoutPlanWeek> => {
    const { data, error } = await supabase
      .from("workout_plan_weeks")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return mapWorkoutPlanWeekFromDb(data);
  },

  create: async (
    week: Partial<WorkoutPlanWeek>,
  ): Promise<WorkoutPlanWeek> => {
    const db = mapWorkoutPlanWeekToDb(week);
    const { data, error } = await supabase
      .from("workout_plan_weeks")
      .insert(db)
      .select()
      .single();
    if (error) throw error;
    return mapWorkoutPlanWeekFromDb(data);
  },

  update: async (
    id: string,
    updates: Partial<WorkoutPlanWeek>,
  ): Promise<WorkoutPlanWeek> => {
    const db = mapWorkoutPlanWeekToDb(updates);
    const { data, error } = await supabase
      .from("workout_plan_weeks")
      .update(db)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return mapWorkoutPlanWeekFromDb(data);
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from("workout_plan_weeks")
      .delete()
      .eq("id", id);
    if (error) throw error;
  },
};

const mapWorkoutPlanDayFromDb = (row: any): WorkoutPlanDay => ({
  id: row.id,
  weekId: row.week_id,
  label: row.label,
  sortOrder: row.sort_order ?? 0,
});

const mapWorkoutPlanDayToDb = (d: Partial<WorkoutPlanDay>): any => {
  const db: any = {};
  if (d.weekId !== undefined) db.week_id = d.weekId;
  if (d.label !== undefined) db.label = d.label;
  if (d.sortOrder !== undefined) db.sort_order = d.sortOrder;
  return db;
};

export const workoutPlanDayQueries = {
  getByWeekId: async (weekId: string): Promise<WorkoutPlanDay[]> => {
    const { data, error } = await supabase
      .from("workout_plan_days")
      .select("*")
      .eq("week_id", weekId)
      .order("sort_order", { ascending: true })
      .order("label", { ascending: true });
    if (error) throw error;
    return (data ?? []).map(mapWorkoutPlanDayFromDb);
  },

  getById: async (id: string): Promise<WorkoutPlanDay> => {
    const { data, error } = await supabase
      .from("workout_plan_days")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return mapWorkoutPlanDayFromDb(data);
  },

  create: async (
    day: Partial<WorkoutPlanDay>,
  ): Promise<WorkoutPlanDay> => {
    const db = mapWorkoutPlanDayToDb(day);
    const { data, error } = await supabase
      .from("workout_plan_days")
      .insert(db)
      .select()
      .single();
    if (error) throw error;
    return mapWorkoutPlanDayFromDb(data);
  },

  update: async (
    id: string,
    updates: Partial<WorkoutPlanDay>,
  ): Promise<WorkoutPlanDay> => {
    const db = mapWorkoutPlanDayToDb(updates);
    const { data, error } = await supabase
      .from("workout_plan_days")
      .update(db)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return mapWorkoutPlanDayFromDb(data);
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from("workout_plan_days")
      .delete()
      .eq("id", id);
    if (error) throw error;
  },
};

const mapWorkoutPlanExerciseFromDb = (row: any): WorkoutPlanExercise => ({
  id: row.id,
  dayId: row.day_id,
  exerciseName: row.exercise_name,
  sets: row.sets,
  reps: row.reps,
  sortOrder: row.sort_order ?? 0,
});

const mapWorkoutPlanExerciseToDb = (e: Partial<WorkoutPlanExercise>): any => {
  const db: any = {};
  if (e.dayId !== undefined) db.day_id = e.dayId;
  if (e.exerciseName !== undefined) db.exercise_name = e.exerciseName;
  if (e.sets !== undefined) db.sets = e.sets;
  if (e.reps !== undefined) db.reps = e.reps;
  if (e.sortOrder !== undefined) db.sort_order = e.sortOrder;
  return db;
};

export const workoutPlanExerciseQueries = {
  getByDayId: async (
    dayId: string,
  ): Promise<WorkoutPlanExercise[]> => {
    const { data, error } = await supabase
      .from("workout_plan_exercises")
      .select("*")
      .eq("day_id", dayId)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []).map(mapWorkoutPlanExerciseFromDb);
  },

  getById: async (id: string): Promise<WorkoutPlanExercise> => {
    const { data, error } = await supabase
      .from("workout_plan_exercises")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return mapWorkoutPlanExerciseFromDb(data);
  },

  create: async (
    exercise: Partial<WorkoutPlanExercise>,
  ): Promise<WorkoutPlanExercise> => {
    const db = mapWorkoutPlanExerciseToDb(exercise);
    const { data, error } = await supabase
      .from("workout_plan_exercises")
      .insert(db)
      .select()
      .single();
    if (error) throw error;
    return mapWorkoutPlanExerciseFromDb(data);
  },

  update: async (
    id: string,
    updates: Partial<WorkoutPlanExercise>,
  ): Promise<WorkoutPlanExercise> => {
    const db = mapWorkoutPlanExerciseToDb(updates);
    const { data, error } = await supabase
      .from("workout_plan_exercises")
      .update(db)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return mapWorkoutPlanExerciseFromDb(data);
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from("workout_plan_exercises")
      .delete()
      .eq("id", id);
    if (error) throw error;
  },
};

const mapWeightRoomVideoToDb = (video: Partial<WeightRoomVideo>): any => {
  const dbVideo: any = {};
  if (video.id !== undefined) dbVideo.id = video.id;
  if (video.collectionId !== undefined)
    dbVideo.collection_id = video.collectionId;
  if (video.title !== undefined) dbVideo.title = video.title;
  if (video.description !== undefined) dbVideo.description = video.description;
  if (video.videoUrl !== undefined) dbVideo.video_url = video.videoUrl;
  return dbVideo;
};

export const weightRoomVideoQueries = {
  getAll: async () => {
    const { data, error } = await supabase
      .from("weight_room_videos")
      .select("*")
      .order("title", { ascending: true });

    if (error) throw error;
    return data.map(mapWeightRoomVideoFromDb);
  },

  getByCollectionId: async (collectionId: string) => {
    const { data, error } = await supabase
      .from("weight_room_videos")
      .select("*")
      .eq("collection_id", collectionId)
      .order("title", { ascending: true });

    if (error) throw error;
    return data.map(mapWeightRoomVideoFromDb);
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from("weight_room_videos")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return mapWeightRoomVideoFromDb(data);
  },

  create: async (video: Partial<WeightRoomVideo>) => {
    const dbVideo = mapWeightRoomVideoToDb(video);
    const { data, error } = await supabase
      .from("weight_room_videos")
      .insert(dbVideo)
      .select()
      .single();

    if (error) throw error;
    return mapWeightRoomVideoFromDb(data);
  },

  update: async (id: string, updates: Partial<WeightRoomVideo>) => {
    const dbUpdates = mapWeightRoomVideoToDb(updates);
    const { data, error } = await supabase
      .from("weight_room_videos")
      .update(dbUpdates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return mapWeightRoomVideoFromDb(data);
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from("weight_room_videos")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};

const mapRecipeFromDb = (dbRecipe: any): Recipe => ({
  id: dbRecipe.id,
  createdAt: dbRecipe.created_at,
  type: dbRecipe.type,
  meal: dbRecipe.meal,
  title: dbRecipe.title,
  description: dbRecipe.description,
  ingredients: dbRecipe.ingredients,
  instructions: dbRecipe.instructions,
  image: dbRecipe.image,
});

const mapRecipeToDb = (recipe: Partial<Recipe>): any => {
  const dbRecipe: any = {};
  if (recipe.id !== undefined) dbRecipe.id = recipe.id;
  if (recipe.createdAt !== undefined) dbRecipe.created_at = recipe.createdAt;
  if (recipe.type !== undefined) dbRecipe.type = recipe.type;
  if (recipe.meal !== undefined) dbRecipe.meal = recipe.meal;
  if (recipe.title !== undefined) dbRecipe.title = recipe.title;
  if (recipe.description !== undefined)
    dbRecipe.description = recipe.description;
  if (recipe.ingredients !== undefined)
    dbRecipe.ingredients = recipe.ingredients;
  if (recipe.instructions !== undefined)
    dbRecipe.instructions = recipe.instructions;
  if (recipe.image !== undefined) dbRecipe.image = recipe.image;
  return dbRecipe;
};

export const recipeQueries = {
  getAll: async () => {
    const { data, error } = await supabase
      .from("recipes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data.map(mapRecipeFromDb);
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from("recipes")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return mapRecipeFromDb(data);
  },

  getByMeal: async (meal: string) => {
    const { data, error } = await supabase
      .from("recipes")
      .select("*")
      .eq("meal", meal)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data.map(mapRecipeFromDb);
  },

  getByType: async (type: string) => {
    const { data, error } = await supabase
      .from("recipes")
      .select("*")
      .eq("type", type)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data.map(mapRecipeFromDb);
  },

  create: async (recipe: Partial<Recipe>) => {
    const dbRecipe = mapRecipeToDb(recipe);
    const { data, error } = await supabase
      .from("recipes")
      .insert(dbRecipe)
      .select()
      .single();

    if (error) throw error;
    return mapRecipeFromDb(data);
  },

  update: async (id: string, updates: Partial<Recipe>) => {
    const dbUpdates = mapRecipeToDb(updates);
    const { data, error } = await supabase
      .from("recipes")
      .update(dbUpdates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return mapRecipeFromDb(data);
  },

  delete: async (id: string) => {
    const { error } = await supabase.from("recipes").delete().eq("id", id);

    if (error) throw error;
  },
};

export const nutritionVideoQueries = {
  getAll: async () => {
    const { data, error } = await supabase
      .from("nutrition_videos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data.map((video) => ({
      id: video.id,
      createdAt: video.created_at,
      title: video.title,
      description: video.description,
      category: video.category,
      videoUrl: video.video_url,
      thumbnail: video.thumbnail,
      duration: video.duration,
    })) as NutritionVideo[];
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from("nutrition_videos")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return {
      id: data.id,
      createdAt: data.created_at,
      title: data.title,
      description: data.description,
      category: data.category,
      videoUrl: data.video_url,
      thumbnail: data.thumbnail,
      duration: data.duration,
    } as NutritionVideo;
  },

  create: async (video: Partial<NutritionVideo>) => {
    const dbVideo = {
      title: video.title,
      description: video.description,
      category: video.category,
      video_url: video.videoUrl,
      thumbnail: video.thumbnail,
      duration: video.duration,
    };

    const { data, error } = await supabase
      .from("nutrition_videos")
      .insert(dbVideo)
      .select()
      .single();

    if (error) throw error;
    return {
      id: data.id,
      createdAt: data.created_at,
      title: data.title,
      description: data.description,
      category: data.category,
      videoUrl: data.video_url,
      thumbnail: data.thumbnail,
      duration: data.duration,
    } as NutritionVideo;
  },

  update: async (id: string, updates: Partial<NutritionVideo>) => {
    const dbUpdates: any = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.description !== undefined)
      dbUpdates.description = updates.description;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.videoUrl !== undefined) dbUpdates.video_url = updates.videoUrl;
    if (updates.thumbnail !== undefined)
      dbUpdates.thumbnail = updates.thumbnail;
    if (updates.duration !== undefined) dbUpdates.duration = updates.duration;

    const { data, error } = await supabase
      .from("nutrition_videos")
      .update(dbUpdates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return {
      id: data.id,
      createdAt: data.created_at,
      title: data.title,
      description: data.description,
      category: data.category,
      videoUrl: data.video_url,
      thumbnail: data.thumbnail,
      duration: data.duration,
    } as NutritionVideo;
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from("nutrition_videos")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};

const mapAthleteResourceFromDb = (data: any): AthleteResource => ({
  id: data.id,
  createdAt: data.created_at,
  title: data.title,
  description: data.description,
  image: data.image,
  externalUrl: data.external_url,
});

const mapAthleteResourceToDb = (resource: Partial<AthleteResource>) => ({
  title: resource.title,
  description: resource.description,
  image: resource.image,
  external_url: resource.externalUrl,
});

export const athleteResourceQueries = {
  getAll: async () => {
    const { data, error } = await supabase
      .from("athlete_resources")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data?.map(mapAthleteResourceFromDb) || [];
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from("athlete_resources")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return mapAthleteResourceFromDb(data);
  },

  create: async (resource: Partial<AthleteResource>) => {
    const dbResource = mapAthleteResourceToDb(resource);
    const { data, error } = await supabase
      .from("athlete_resources")
      .insert(dbResource)
      .select()
      .single();

    if (error) throw error;
    return mapAthleteResourceFromDb(data);
  },

  update: async (id: string, resource: Partial<AthleteResource>) => {
    const dbResource = mapAthleteResourceToDb(resource);
    const { data, error } = await supabase
      .from("athlete_resources")
      .update(dbResource)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return mapAthleteResourceFromDb(data);
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from("athlete_resources")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};

const mapCoachingAvailabilityFromDb = (
  dbAvailability: any,
): CoachingAvailability => ({
  id: dbAvailability.id,
  dayOfWeek: dbAvailability.day_of_week,
  startTime: dbAvailability.start_time,
  endTime: dbAvailability.end_time,
  sessionDuration: dbAvailability.session_duration,
  active: dbAvailability.active,
});

const mapCoachingAvailabilityToDb = (
  availability: Partial<CoachingAvailability>,
): any => {
  const dbAvailability: any = {};
  if (availability.dayOfWeek !== undefined)
    dbAvailability.day_of_week = availability.dayOfWeek;
  if (availability.startTime !== undefined)
    dbAvailability.start_time = availability.startTime;
  if (availability.endTime !== undefined)
    dbAvailability.end_time = availability.endTime;
  if (availability.sessionDuration !== undefined)
    dbAvailability.session_duration = availability.sessionDuration;
  if (availability.active !== undefined)
    dbAvailability.active = availability.active;
  return dbAvailability;
};

export const coachingAvailabilityQueries = {
  getAll: async () => {
    const { data, error } = await supabase
      .from("coaching_availability")
      .select("*")
      .order("day_of_week", { ascending: true })
      .order("start_time", { ascending: true });

    if (error) throw error;
    return data.map(mapCoachingAvailabilityFromDb);
  },

  getActive: async () => {
    const { data, error } = await supabase
      .from("coaching_availability")
      .select("*")
      .eq("active", true)
      .order("day_of_week", { ascending: true })
      .order("start_time", { ascending: true });

    if (error) throw error;
    return data.map(mapCoachingAvailabilityFromDb);
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from("coaching_availability")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return mapCoachingAvailabilityFromDb(data);
  },

  create: async (availability: Partial<CoachingAvailability>) => {
    const dbAvailability = mapCoachingAvailabilityToDb(availability);
    const { data, error } = await supabase
      .from("coaching_availability")
      .insert(dbAvailability)
      .select()
      .single();

    if (error) throw error;
    return mapCoachingAvailabilityFromDb(data);
  },

  update: async (id: string, availability: Partial<CoachingAvailability>) => {
    const dbAvailability = mapCoachingAvailabilityToDb(availability);
    const { data, error } = await supabase
      .from("coaching_availability")
      .update(dbAvailability)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return mapCoachingAvailabilityFromDb(data);
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from("coaching_availability")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};

const mapCoachingSessionFromDb = (dbSession: any): CoachingSession => ({
  id: dbSession.id,
  createdAt: dbSession.created_at,
  userId: dbSession.user_id,
  clientName: dbSession.client_name,
  clientEmail: dbSession.client_email,
  clientPhone: dbSession.client_phone,
  sessionDate: dbSession.session_date,
  startTime: dbSession.start_time,
  endTime: dbSession.end_time,
  status: dbSession.status,
  notes: dbSession.notes,
});

const mapCoachingSessionToDb = (session: Partial<CoachingSession>): any => {
  const dbSession: any = {};
  if (session.userId !== undefined) dbSession.user_id = session.userId;
  if (session.clientName !== undefined)
    dbSession.client_name = session.clientName;
  if (session.clientEmail !== undefined)
    dbSession.client_email = session.clientEmail;
  if (session.clientPhone !== undefined)
    dbSession.client_phone = session.clientPhone;
  if (session.sessionDate !== undefined)
    dbSession.session_date = session.sessionDate;
  if (session.startTime !== undefined) dbSession.start_time = session.startTime;
  if (session.endTime !== undefined) dbSession.end_time = session.endTime;
  if (session.status !== undefined) dbSession.status = session.status;
  if (session.notes !== undefined) dbSession.notes = session.notes;
  return dbSession;
};

export const coachingSessionQueries = {
  getAll: async () => {
    const { data, error } = await supabase
      .from("coaching_sessions")
      .select("*")
      .order("session_date", { ascending: true })
      .order("start_time", { ascending: true });

    if (error) throw error;
    return data.map(mapCoachingSessionFromDb);
  },

  getUpcoming: async () => {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("coaching_sessions")
      .select("*")
      .gte("session_date", now)
      .order("session_date", { ascending: true })
      .order("start_time", { ascending: true });

    if (error) throw error;
    return data.map(mapCoachingSessionFromDb);
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from("coaching_sessions")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return mapCoachingSessionFromDb(data);
  },

  create: async (session: Partial<CoachingSession>) => {
    const dbSession = mapCoachingSessionToDb(session);
    const { data, error } = await supabase
      .from("coaching_sessions")
      .insert(dbSession)
      .select()
      .single();

    if (error) throw error;
    return mapCoachingSessionFromDb(data);
  },

  update: async (id: string, session: Partial<CoachingSession>) => {
    const dbSession = mapCoachingSessionToDb(session);
    const { data, error } = await supabase
      .from("coaching_sessions")
      .update(dbSession)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return mapCoachingSessionFromDb(data);
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from("coaching_sessions")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};

export const storageHelpers = {
  uploadFile: async (bucket: string, path: string, file: File) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) throw error;
    return data;
  },

  getPublicUrl: (bucket: string, path: string) => {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);

    return data.publicUrl;
  },

  deleteFile: async (bucket: string, path: string) => {
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) throw error;
  },
};

const mapNotificationFromDb = (dbNotification: any): Notification => ({
  id: dbNotification.id,
  userId: dbNotification.user_id,
  title: dbNotification.title,
  body: dbNotification.body,
  type: dbNotification.type,
  data: dbNotification.data,
  read: dbNotification.read,
  createdAt: dbNotification.created_at,
});

const mapNotificationToDb = (notification: Partial<Notification>): any => {
  const dbNotification: any = {};
  if (notification.userId !== undefined)
    dbNotification.user_id = notification.userId;
  if (notification.title !== undefined)
    dbNotification.title = notification.title;
  if (notification.body !== undefined) dbNotification.body = notification.body;
  if (notification.type !== undefined) dbNotification.type = notification.type;
  if (notification.data !== undefined) dbNotification.data = notification.data;
  if (notification.read !== undefined) dbNotification.read = notification.read;
  return dbNotification;
};

// Planned Workout and Meal Assignment Queries
export const plannedWorkoutQueries = {
  // Create a workout plan for a user
  createWorkoutForUser: async (workout: {
    userId: string;
    title: string;
    description?: string;
    date: string;
    assignedBy: string;
    exercises: Array<{
      videoId: string;
      exerciseName: string;
      sets?: number;
      reps?: number;
      weight?: string;
      time?: string;
      notes?: string;
      sortOrder: number;
    }>;
  }) => {
    // Insert the planned workout
    const { data: workoutData, error: workoutError } = await supabase
      .from("planned_workout")
      .insert({
        user_id: workout.userId,
        title: workout.title,
        description: workout.description || "",
        date: workout.date,
        assigned_by: workout.assignedBy,
      })
      .select()
      .single();

    if (workoutError) throw workoutError;

    // Insert exercises if provided
    if (workout.exercises && workout.exercises.length > 0) {
      const exercisesToInsert = workout.exercises.map((ex) => ({
        planned_workout_id: workoutData.id,
        video_id: ex.videoId,
        exercise_name: ex.exerciseName,
        sets: ex.sets || 0,
        reps: ex.reps || 0,
        weight: ex.weight || "",
        time: ex.time || "",
        notes: ex.notes || "",
        sort_order: ex.sortOrder,
      }));

      const { error: exercisesError } = await supabase
        .from("planned_workout_exercises")
        .insert(exercisesToInsert);

      if (exercisesError) throw exercisesError;
    }

    return workoutData;
  },

  // Bulk create workouts for multiple users
  bulkCreateWorkoutsForUsers: async (params: {
    userIds: string[];
    title: string;
    description?: string;
    date: string;
    assignedBy: string;
    exercises: Array<{
      videoId: string;
      exerciseName: string;
      sets?: number;
      reps?: number;
      weight?: string;
      time?: string;
      notes?: string;
      sortOrder: number;
    }>;
  }) => {
    const results = [];

    for (const userId of params.userIds) {
      try {
        const result = await plannedWorkoutQueries.createWorkoutForUser({
          userId,
          title: params.title,
          description: params.description,
          date: params.date,
          assignedBy: params.assignedBy,
          exercises: params.exercises,
        });
        results.push({ userId, success: true, data: result });
      } catch (error: any) {
        results.push({ userId, success: false, error: error.message });
      }
    }

    return results;
  },

  // Get all planned workouts (admin view)
  getAll: async () => {
    const { data, error } = await supabase
      .from("planned_workout")
      .select(
        `
        *,
        profiles:user_id (id, display_name, email),
        assigned_by_profile:assigned_by (id, display_name)
      `,
      )
      .order("date", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Delete a planned workout
  delete: async (id: number) => {
    const { error } = await supabase
      .from("planned_workout")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};

export const plannedMealQueries = {
  // Add a meal to a user's plan
  addMealForUser: async (params: {
    userId: string;
    recipeId: string;
    date: string;
  }) => {
    const { data, error } = await supabase
      .from("planned_meal")
      .insert({
        user_id: params.userId,
        recipe_id: params.recipeId,
        date: params.date,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Bulk add meals for multiple users
  bulkAddMealsForUsers: async (params: {
    userIds: string[];
    recipeId: string;
    date: string;
  }) => {
    const results = [];

    for (const userId of params.userIds) {
      try {
        const result = await plannedMealQueries.addMealForUser({
          userId,
          recipeId: params.recipeId,
          date: params.date,
        });
        results.push({ userId, success: true, data: result });
      } catch (error: any) {
        // Check for duplicate constraint
        if (error.message?.includes("duplicate") || error.code === "23505") {
          results.push({
            userId,
            success: false,
            error: "Meal already planned for this date",
          });
        } else {
          results.push({ userId, success: false, error: error.message });
        }
      }
    }

    return results;
  },

  // Get all planned meals (admin view)
  getAll: async () => {
    const { data, error } = await supabase
      .from("planned_meal")
      .select(
        `
        *,
        profiles:user_id (id, display_name, email),
        recipes:recipe_id (id, title, image)
      `,
      )
      .order("date", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Delete a planned meal
  delete: async (id: number) => {
    const { error } = await supabase.from("planned_meal").delete().eq("id", id);

    if (error) throw error;
  },
};

export const notificationQueries = {
  getAll: async () => {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data.map(mapNotificationFromDb);
  },

  getByUserId: async (userId: string) => {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data.map(mapNotificationFromDb);
  },

  getUnreadByUserId: async (userId: string) => {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .eq("read", false)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data.map(mapNotificationFromDb);
  },

  create: async (notification: Partial<Notification>) => {
    const dbNotification = mapNotificationToDb(notification);
    const { data, error } = await supabase
      .from("notifications")
      .insert(dbNotification)
      .select()
      .single();

    if (error) throw error;
    return mapNotificationFromDb(data);
  },

  markAsRead: async (id: string) => {
    const { data, error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return mapNotificationFromDb(data);
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};

export interface UserPointsWithProfile {
  userId: string;
  displayName: string | null;
  email: string | null;
  avatarUrl: string | null;
  totalPoints: number;
  lifetimePoints: number;
  updatedAt: string | null;
}

export const userPointsQueries = {
  getAllWithProfiles: async (): Promise<UserPointsWithProfile[]> => {
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, display_name, email, avatar_url")
      .order("display_name", { ascending: true });

    if (profilesError) throw profilesError;

    const { data: pointsData, error: pointsError } = await supabase
      .from("user_points")
      .select("*");

    if (pointsError) throw pointsError;

    const pointsMap = new Map(
      (pointsData || []).map((p: any) => [p.user_id, p]),
    );

    return (profiles || []).map((profile: any) => {
      const pts = pointsMap.get(profile.id);
      return {
        userId: profile.id,
        displayName: profile.display_name,
        email: profile.email,
        avatarUrl: profile.avatar_url,
        totalPoints: pts?.total_points ?? 0,
        lifetimePoints: pts?.lifetime_points ?? 0,
        updatedAt: pts?.updated_at ?? null,
      };
    });
  },

  getTransactionsByUser: async (userId: string) => {
    const { data, error } = await supabase
      .from("points_transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) throw error;
    return (data || []).map((t: any) => ({
      id: t.id,
      userId: t.user_id,
      points: t.points,
      transactionType: t.transaction_type,
      contentType: t.content_type,
      contentId: t.content_id,
      contentTitle: t.content_title,
      description: t.description,
      redemptionCode: t.redemption_code,
      createdAt: t.created_at,
    }));
  },

  /** All users who redeemed a reward (transaction_type = 'redeem'), with profile info. Optional filter by reward title. */
  getRedemptions: async (filterByRewardTitle?: string) => {
    let query = supabase
      .from("points_transactions")
      .select(
        "id, user_id, points, content_title, description, redemption_code, redemption_status, created_at",
      )
      .eq("transaction_type", "redeem")
      .order("created_at", { ascending: false });

    if (filterByRewardTitle?.trim()) {
      query = query.eq("content_title", filterByRewardTitle.trim());
    }

    const { data: rows, error } = await query;
    if (error) throw error;

    const userIds = [...new Set((rows || []).map((r: any) => r.user_id))];
    if (userIds.length === 0) {
      return (rows || []).map((r: any) => ({
        id: r.id,
        userId: r.user_id,
        displayName: null,
        email: null,
        rewardTitle: r.content_title,
        pointsSpent: Math.abs(r.points),
        redemptionCode: r.redemption_code,
        redemptionStatus: r.redemption_status ?? "pending",
        createdAt: r.created_at,
      }));
    }

    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, display_name, email")
      .in("id", userIds);

    const profileMap = new Map((profiles || []).map((p: any) => [p.id, p]));

    return (rows || []).map((r: any) => {
      const profile = profileMap.get(r.user_id);
      return {
        id: r.id,
        userId: r.user_id,
        displayName: profile?.display_name ?? null,
        email: profile?.email ?? null,
        rewardTitle: r.content_title,
        pointsSpent: Math.abs(r.points),
        redemptionCode: r.redemption_code,
        redemptionStatus: r.redemption_status ?? "pending",
        createdAt: r.created_at,
      };
    });
  },

  /** Update redemption status (pending | completed | cancelled). Sends notification only when completed. Refunds points when cancelled. */
  updateRedemptionStatus: async (
    transactionId: string,
    status: "pending" | "completed" | "cancelled",
    options?: { userId: string; rewardTitle: string },
  ) => {
    const { data: txRow, error: fetchErr } = await supabase
      .from("points_transactions")
      .select("user_id, points")
      .eq("id", transactionId)
      .eq("transaction_type", "redeem")
      .single();
    if (fetchErr) throw fetchErr;
    if (!txRow) throw new Error("Redemption transaction not found");

    const { error } = await supabase
      .from("points_transactions")
      .update({ redemption_status: status })
      .eq("id", transactionId)
      .eq("transaction_type", "redeem");
    if (error) throw error;

    const userId = options?.userId ?? txRow.user_id;
    const rewardTitle = options?.rewardTitle ?? "Reward";

    if (status === "cancelled") {
      const pointsRefund = Math.abs(Number(txRow.points));
      if (pointsRefund > 0) {
        const { data: currentRow, error: fetchError } = await supabase
          .from("user_points")
          .select("*")
          .eq("user_id", userId)
          .maybeSingle();
        if (fetchError) throw fetchError;

        const currentTotal = currentRow?.total_points ?? 0;
        const newTotal = currentTotal + pointsRefund;

        if (currentRow) {
          const { error: updateError } = await supabase
            .from("user_points")
            .update({
              total_points: newTotal,
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", userId);
          if (updateError) throw updateError;
        } else {
          const { error: insertError } = await supabase
            .from("user_points")
            .insert({
              user_id: userId,
              total_points: newTotal,
              lifetime_points: 0,
              updated_at: new Date().toISOString(),
            });
          if (insertError) throw insertError;
        }

        const { error: txError } = await supabase
          .from("points_transactions")
          .insert({
            user_id: userId,
            points: pointsRefund,
            transaction_type: "admin_adjustment",
            description: `Refund for cancelled redemption: ${rewardTitle}`,
          });
        if (txError) throw txError;
      }
    }

    if (status === "completed" && options?.userId) {
      try {
        const title = "Reward processed";
        const body = `Good news! Your redemption for "${rewardTitle}" has been processed successfully.`;
        const data = JSON.stringify({
          type: "reward_status",
          status,
          rewardTitle,
          transactionId,
        });
        const { error: notifError } = await supabase.rpc(
          "insert_notification_for_user",
          {
            p_user_id: options.userId,
            p_title: title,
            p_body: body,
            p_type: "general",
            p_data: data,
          },
        );
        if (notifError) throw notifError;
      } catch (e) {
        console.warn("Failed to send reward status notification:", e);
      }
    }
  },

  adjustPoints: async (params: {
    userId: string;
    points: number;
    description: string;
  }) => {
    const { data: currentRow, error: fetchError } = await supabase
      .from("user_points")
      .select("*")
      .eq("user_id", params.userId)
      .maybeSingle();

    if (fetchError) throw fetchError;

    const currentTotal = currentRow?.total_points ?? 0;
    const currentLifetime = currentRow?.lifetime_points ?? 0;
    const newTotal = Math.max(0, currentTotal + params.points);
    const newLifetime =
      params.points > 0 ? currentLifetime + params.points : currentLifetime;

    if (currentRow) {
      const { error: updateError } = await supabase
        .from("user_points")
        .update({
          total_points: newTotal,
          lifetime_points: newLifetime,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", params.userId);
      if (updateError) throw updateError;
    } else {
      const { error: insertError } = await supabase.from("user_points").insert({
        user_id: params.userId,
        total_points: newTotal,
        lifetime_points: newLifetime,
        updated_at: new Date().toISOString(),
      });
      if (insertError) throw insertError;
    }

    const { error: txError } = await supabase
      .from("points_transactions")
      .insert({
        user_id: params.userId,
        points: params.points,
        transaction_type: "admin_adjustment",
        description: params.description,
      });
    if (txError) throw txError;

    return { newTotal, newLifetime };
  },
};

export const pointsConfigQueries = {
  getAll: async (): Promise<PointsConfigEntry[]> => {
    const { data, error } = await supabase
      .from("points_config")
      .select("*")
      .order("activity_type", { ascending: true });

    if (error) throw error;
    return (data || []).map((c: any) => ({
      id: c.id,
      activityType: c.activity_type,
      pointsValue: c.points_value,
      label: c.label,
      updatedAt: c.updated_at,
    }));
  },

  upsert: async (entry: {
    activityType: string;
    pointsValue: number;
    label: string;
  }) => {
    const { data: existing } = await supabase
      .from("points_config")
      .select("id")
      .eq("activity_type", entry.activityType)
      .maybeSingle();

    if (existing) {
      const { data, error } = await supabase
        .from("points_config")
        .update({
          points_value: entry.pointsValue,
          label: entry.label,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from("points_config")
        .insert({
          activity_type: entry.activityType,
          points_value: entry.pointsValue,
          label: entry.label,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  },

  seedDefaults: async () => {
    const defaults = [
      { activity_type: "video", points_value: 10, label: "Video Completion" },
      { activity_type: "recipe", points_value: 15, label: "Recipe Completion" },
      {
        activity_type: "workout",
        points_value: 20,
        label: "Workout Completion",
      },
      { activity_type: "huddle", points_value: 25, label: "Huddle Attendance" },
    ];

    const { data: existing } = await supabase
      .from("points_config")
      .select("activity_type");

    const existingTypes = new Set(
      (existing || []).map((e: any) => e.activity_type),
    );
    const toInsert = defaults.filter(
      (d) => !existingTypes.has(d.activity_type),
    );

    if (toInsert.length > 0) {
      const { error } = await supabase
        .from("points_config")
        .insert(
          toInsert.map((d) => ({ ...d, updated_at: new Date().toISOString() })),
        );
      if (error) throw error;
    }
  },
};

const mapRedemptionOptionFromDb = (row: any): RedemptionOption => ({
  id: row.id,
  title: row.title,
  description: row.description ?? null,
  pointsCost: row.points_cost ?? 0,
  rewardType: row.reward_type ?? "",
  discountCode: row.discount_code ?? null,
  discountPercentage: row.discount_percentage ?? null,
  isActive: row.is_active ?? true,
  quantityAvailable: row.quantity_available ?? null,
  sortOrder: row.sort_order ?? 0,
  iconName: row.icon_name ?? null,
  createdAt: row.created_at ?? null,
  updatedAt: row.updated_at ?? null,
});

const mapRedemptionOptionToDb = (opt: Partial<RedemptionOption>): any => {
  const db: any = {};
  if (opt.title !== undefined) db.title = opt.title;
  if (opt.description !== undefined) db.description = opt.description;
  if (opt.pointsCost !== undefined) db.points_cost = opt.pointsCost;
  if (opt.rewardType !== undefined) db.reward_type = opt.rewardType;
  if (opt.discountCode !== undefined) db.discount_code = opt.discountCode;
  if (opt.discountPercentage !== undefined)
    db.discount_percentage = opt.discountPercentage;
  if (opt.isActive !== undefined) db.is_active = opt.isActive;
  if (opt.quantityAvailable !== undefined)
    db.quantity_available = opt.quantityAvailable;
  if (opt.sortOrder !== undefined) db.sort_order = opt.sortOrder;
  if (opt.iconName !== undefined) db.icon_name = opt.iconName;
  if (opt.updatedAt !== undefined) db.updated_at = opt.updatedAt;
  return db;
};

export const redemptionOptionsQueries = {
  getAll: async (): Promise<RedemptionOption[]> => {
    const { data, error } = await supabase
      .from("redemption_options")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("title", { ascending: true });
    if (error) throw error;
    return (data || []).map(mapRedemptionOptionFromDb);
  },

  getById: async (id: string): Promise<RedemptionOption> => {
    const { data, error } = await supabase
      .from("redemption_options")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return mapRedemptionOptionFromDb(data);
  },

  create: async (opt: Partial<RedemptionOption>): Promise<RedemptionOption> => {
    const db = mapRedemptionOptionToDb(opt);
    db.updated_at = new Date().toISOString();
    const { data, error } = await supabase
      .from("redemption_options")
      .insert(db)
      .select()
      .single();
    if (error) throw error;
    return mapRedemptionOptionFromDb(data);
  },

  update: async (
    id: string,
    opt: Partial<RedemptionOption>,
  ): Promise<RedemptionOption> => {
    const db = mapRedemptionOptionToDb(opt);
    db.updated_at = new Date().toISOString();
    const { data, error } = await supabase
      .from("redemption_options")
      .update(db)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return mapRedemptionOptionFromDb(data);
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from("redemption_options")
      .delete()
      .eq("id", id);
    if (error) throw error;
  },
};
