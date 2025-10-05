import { supabase } from './supabase';
import type {
  User,
  Huddle,
  NutritionPlan,
  TrainingVideo,
  HomeWidget,
  HomeSlide,
  HomeWidgetItem,
  WeightRoomCollection,
  WeightRoomVideo
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
    // Use upsert to handle cases where auth trigger already created profile
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert(dbUser, { onConflict: 'id' })
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
      .from('home_slider')
      .select('*')
      .order('position', { ascending: true });
    
    if (error) throw error;
    return data.map(mapHomeSlideFromDb);
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('home_slider')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return mapHomeSlideFromDb(data);
  },

  create: async (slide: Partial<HomeSlide>) => {
    const dbSlide = mapHomeSlideToDb(slide);
    const { data, error } = await supabase
      .from('home_slider')
      .insert(dbSlide)
      .select()
      .single();
    
    if (error) throw error;
    return mapHomeSlideFromDb(data);
  },

  update: async (id: string, updates: Partial<HomeSlide>) => {
    const dbUpdates = mapHomeSlideToDb(updates);
    const { data, error } = await supabase
      .from('home_slider')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return mapHomeSlideFromDb(data);
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('home_slider')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

const mapHomeWidgetItemFromDb = (dbWidget: any): HomeWidgetItem => ({
  id: dbWidget.id,
  position: dbWidget.position,
  image: dbWidget.image,
  title: dbWidget.title,
  subtitle: dbWidget.subtitle,
  redirectUrl: dbWidget.redirect_url,
  createdAt: dbWidget.created_at,
});

const mapHomeWidgetItemToDb = (widget: Partial<HomeWidgetItem>): any => {
  const dbWidget: any = {};
  if (widget.id !== undefined) dbWidget.id = widget.id;
  if (widget.position !== undefined) dbWidget.position = widget.position;
  if (widget.image !== undefined) dbWidget.image = widget.image;
  if (widget.title !== undefined) dbWidget.title = widget.title;
  if (widget.subtitle !== undefined) dbWidget.subtitle = widget.subtitle;
  if (widget.redirectUrl !== undefined) dbWidget.redirect_url = widget.redirectUrl;
  if (widget.createdAt !== undefined) dbWidget.created_at = widget.createdAt;
  return dbWidget;
};

export const homeWidgetItemQueries = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('home_widget')
      .select('*')
      .order('position', { ascending: true });
    
    if (error) throw error;
    return data.map(mapHomeWidgetItemFromDb);
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('home_widget')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return mapHomeWidgetItemFromDb(data);
  },

  create: async (widget: Partial<HomeWidgetItem>) => {
    const dbWidget = mapHomeWidgetItemToDb(widget);
    const { data, error } = await supabase
      .from('home_widget')
      .insert(dbWidget)
      .select()
      .single();
    
    if (error) throw error;
    return mapHomeWidgetItemFromDb(data);
  },

  update: async (id: string, updates: Partial<HomeWidgetItem>) => {
    const dbUpdates = mapHomeWidgetItemToDb(updates);
    const { data, error } = await supabase
      .from('home_widget')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return mapHomeWidgetItemFromDb(data);
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('home_widget')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

const mapWeightRoomCollectionFromDb = (dbCollection: any): WeightRoomCollection => ({
  id: dbCollection.id,
  position: dbCollection.position,
  title: dbCollection.title,
  subtitle: dbCollection.subtitle,
  image: dbCollection.image,
});

const mapWeightRoomCollectionToDb = (collection: Partial<WeightRoomCollection>): any => {
  const dbCollection: any = {};
  if (collection.id !== undefined) dbCollection.id = collection.id;
  if (collection.position !== undefined) dbCollection.position = collection.position;
  if (collection.title !== undefined) dbCollection.title = collection.title;
  if (collection.subtitle !== undefined) dbCollection.subtitle = collection.subtitle;
  if (collection.image !== undefined) dbCollection.image = collection.image;
  return dbCollection;
};

export const weightRoomQueries = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('weight_room_collections')
      .select('*')
      .order('position', { ascending: true });
    
    if (error) throw error;
    return data.map(mapWeightRoomCollectionFromDb);
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('weight_room_collections')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return mapWeightRoomCollectionFromDb(data);
  },

  create: async (collection: Partial<WeightRoomCollection>) => {
    const dbCollection = mapWeightRoomCollectionToDb(collection);
    const { data, error } = await supabase
      .from('weight_room_collections')
      .insert(dbCollection)
      .select()
      .single();
    
    if (error) throw error;
    return mapWeightRoomCollectionFromDb(data);
  },

  update: async (id: string, updates: Partial<WeightRoomCollection>) => {
    const dbUpdates = mapWeightRoomCollectionToDb(updates);
    const { data, error } = await supabase
      .from('weight_room_collections')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return mapWeightRoomCollectionFromDb(data);
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('weight_room_collections')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

const mapWeightRoomVideoFromDb = (dbVideo: any): WeightRoomVideo => ({
  id: dbVideo.id,
  collectionId: dbVideo.collection_id,
  title: dbVideo.title,
  description: dbVideo.description,
  videoUrl: dbVideo.video_url,
});

const mapWeightRoomVideoToDb = (video: Partial<WeightRoomVideo>): any => {
  const dbVideo: any = {};
  if (video.id !== undefined) dbVideo.id = video.id;
  if (video.collectionId !== undefined) dbVideo.collection_id = video.collectionId;
  if (video.title !== undefined) dbVideo.title = video.title;
  if (video.description !== undefined) dbVideo.description = video.description;
  if (video.videoUrl !== undefined) dbVideo.video_url = video.videoUrl;
  return dbVideo;
};

export const weightRoomVideoQueries = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('weight_room_videos')
      .select('*')
      .order('title', { ascending: true });
    
    if (error) throw error;
    return data.map(mapWeightRoomVideoFromDb);
  },

  getByCollectionId: async (collectionId: string) => {
    const { data, error } = await supabase
      .from('weight_room_videos')
      .select('*')
      .eq('collection_id', collectionId)
      .order('title', { ascending: true });
    
    if (error) throw error;
    return data.map(mapWeightRoomVideoFromDb);
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('weight_room_videos')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return mapWeightRoomVideoFromDb(data);
  },

  create: async (video: Partial<WeightRoomVideo>) => {
    const dbVideo = mapWeightRoomVideoToDb(video);
    const { data, error } = await supabase
      .from('weight_room_videos')
      .insert(dbVideo)
      .select()
      .single();
    
    if (error) throw error;
    return mapWeightRoomVideoFromDb(data);
  },

  update: async (id: string, updates: Partial<WeightRoomVideo>) => {
    const dbUpdates = mapWeightRoomVideoToDb(updates);
    const { data, error } = await supabase
      .from('weight_room_videos')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return mapWeightRoomVideoFromDb(data);
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('weight_room_videos')
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
