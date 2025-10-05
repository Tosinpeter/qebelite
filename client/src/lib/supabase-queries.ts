import { supabase } from './supabase';
import type {
  User,
  Huddle,
  NutritionPlan,
  TrainingVideo,
  HomeWidget,
  HomeSlide,
  HomeWidgetItem,
  WeightRoomCollection
} from '@shared/schema';

const mapUserFromDb = (dbUser: any): User => ({
  id: dbUser.id,
  email: dbUser.email,
  role: dbUser.role,
  age: dbUser.age,
  height: dbUser.height,
  weight: dbUser.weight,
  avatarUrl: dbUser.avatar_url,
  displayName: dbUser.display_name,
  recipePreference: dbUser.recipe_preference,
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
  if (user.recipePreference !== undefined) dbUser.recipe_preference = user.recipePreference;
  return dbUser;
};

export const userQueries = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data.map(mapUserFromDb);
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return mapUserFromDb(data);
  },

  create: async (user: Partial<User>) => {
    const dbUser = mapUserToDb(user);
    const { data, error } = await supabase
      .from('user_profiles')
      .insert(dbUser)
      .select()
      .single();
    
    if (error) throw error;
    return mapUserFromDb(data);
  },

  update: async (id: string, updates: Partial<User>) => {
    const dbUpdates = mapUserToDb(updates);
    const { data, error } = await supabase
      .from('user_profiles')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return mapUserFromDb(data);
  },

  delete: async (id: string) => {
    const { error } = await supabase.rpc('delete_user_and_auth', {
      user_id: id
    });
    
    if (error) throw error;
  }
};

export const huddleQueries = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('huddles')
      .select('*')
      .order('scheduled_at', { ascending: true });
    
    if (error) throw error;
    return data as Huddle[];
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('huddles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Huddle;
  },

  create: async (huddle: Partial<Huddle>) => {
    const { data, error } = await supabase
      .from('huddles')
      .insert(huddle)
      .select()
      .single();
    
    if (error) throw error;
    return data as Huddle;
  },

  update: async (id: string, updates: Partial<Huddle>) => {
    const { data, error } = await supabase
      .from('huddles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Huddle;
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('huddles')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

export const nutritionQueries = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('nutrition_plans')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as NutritionPlan[];
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('nutrition_plans')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as NutritionPlan;
  },

  create: async (plan: Partial<NutritionPlan>) => {
    const { data, error } = await supabase
      .from('nutrition_plans')
      .insert(plan)
      .select()
      .single();
    
    if (error) throw error;
    return data as NutritionPlan;
  },

  update: async (id: string, updates: Partial<NutritionPlan>) => {
    const { data, error } = await supabase
      .from('nutrition_plans')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as NutritionPlan;
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('nutrition_plans')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

export const trainingVideoQueries = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('training_videos')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as TrainingVideo[];
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('training_videos')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as TrainingVideo;
  },

  create: async (video: Partial<TrainingVideo>) => {
    const { data, error } = await supabase
      .from('training_videos')
      .insert(video)
      .select()
      .single();
    
    if (error) throw error;
    return data as TrainingVideo;
  },

  update: async (id: string, updates: Partial<TrainingVideo>) => {
    const { data, error } = await supabase
      .from('training_videos')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as TrainingVideo;
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('training_videos')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

export const homeSlideQueries = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('home_slider')
      .select('*')
      .order('position', { ascending: true });
    
    if (error) throw error;
    return data as HomeSlide[];
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('home_slider')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as HomeSlide;
  },

  create: async (slide: Partial<HomeSlide>) => {
    const { data, error } = await supabase
      .from('home_slider')
      .insert(slide)
      .select()
      .single();
    
    if (error) throw error;
    return data as HomeSlide;
  },

  update: async (id: string, updates: Partial<HomeSlide>) => {
    const { data, error } = await supabase
      .from('home_slider')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as HomeSlide;
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('home_slider')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

export const homeWidgetItemQueries = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('home_widget')
      .select('*')
      .order('position', { ascending: true });
    
    if (error) throw error;
    return data as HomeWidgetItem[];
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('home_widget')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as HomeWidgetItem;
  },

  create: async (widget: Partial<HomeWidgetItem>) => {
    const { data, error } = await supabase
      .from('home_widget')
      .insert(widget)
      .select()
      .single();
    
    if (error) throw error;
    return data as HomeWidgetItem;
  },

  update: async (id: string, updates: Partial<HomeWidgetItem>) => {
    const { data, error } = await supabase
      .from('home_widget')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as HomeWidgetItem;
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('home_widget')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

export const weightRoomQueries = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('weight_room_collections')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as WeightRoomCollection[];
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('weight_room_collections')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as WeightRoomCollection;
  },

  create: async (collection: Partial<WeightRoomCollection>) => {
    const { data, error } = await supabase
      .from('weight_room_collections')
      .insert(collection)
      .select()
      .single();
    
    if (error) throw error;
    return data as WeightRoomCollection;
  },

  update: async (id: string, updates: Partial<WeightRoomCollection>) => {
    const { data, error } = await supabase
      .from('weight_room_collections')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as WeightRoomCollection;
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('weight_room_collections')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

export const storageHelpers = {
  uploadFile: async (bucket: string, path: string, file: File) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) throw error;
    return data;
  },

  getPublicUrl: (bucket: string, path: string) => {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return data.publicUrl;
  },

  deleteFile: async (bucket: string, path: string) => {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);
    
    if (error) throw error;
  }
};
