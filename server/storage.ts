import { db } from "./db";
import { eq } from "drizzle-orm";
import * as schema from "@shared/schema";
import type { 
  User, 
  InsertUser, 
  HomeWidget, 
  InsertHomeWidget,
  HomeBanner,
  InsertHomeBanner
} from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getHomeWidgets(): Promise<HomeWidget[]>;
  getHomeWidget(id: string): Promise<HomeWidget | undefined>;
  createHomeWidget(widget: InsertHomeWidget): Promise<HomeWidget>;
  updateHomeWidget(id: string, widget: Partial<InsertHomeWidget>): Promise<HomeWidget | undefined>;
  deleteHomeWidget(id: string): Promise<boolean>;
  
  getHomeBanners(): Promise<HomeBanner[]>;
  getHomeBanner(id: string): Promise<HomeBanner | undefined>;
  createHomeBanner(banner: InsertHomeBanner): Promise<HomeBanner>;
  updateHomeBanner(id: string, banner: Partial<InsertHomeBanner>): Promise<HomeBanner | undefined>;
  deleteHomeBanner(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(schema.users).where(eq(schema.users.id, id));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(schema.users).where(eq(schema.users.email, email));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(schema.users).values(insertUser).returning();
    return result[0];
  }

  async getHomeWidgets(): Promise<HomeWidget[]> {
    return db.select().from(schema.homeWidgets);
  }

  async getHomeWidget(id: string): Promise<HomeWidget | undefined> {
    const result = await db.select().from(schema.homeWidgets).where(eq(schema.homeWidgets.id, id));
    return result[0];
  }

  async createHomeWidget(widget: InsertHomeWidget): Promise<HomeWidget> {
    const result = await db.insert(schema.homeWidgets).values(widget).returning();
    return result[0];
  }

  async updateHomeWidget(id: string, widget: Partial<InsertHomeWidget>): Promise<HomeWidget | undefined> {
    const result = await db.update(schema.homeWidgets)
      .set(widget)
      .where(eq(schema.homeWidgets.id, id))
      .returning();
    return result[0];
  }

  async deleteHomeWidget(id: string): Promise<boolean> {
    const result = await db.delete(schema.homeWidgets).where(eq(schema.homeWidgets.id, id)).returning();
    return result.length > 0;
  }

  async getHomeBanners(): Promise<HomeBanner[]> {
    return db.select().from(schema.homeBanners);
  }

  async getHomeBanner(id: string): Promise<HomeBanner | undefined> {
    const result = await db.select().from(schema.homeBanners).where(eq(schema.homeBanners.id, id));
    return result[0];
  }

  async createHomeBanner(banner: InsertHomeBanner): Promise<HomeBanner> {
    const result = await db.insert(schema.homeBanners).values(banner).returning();
    return result[0];
  }

  async updateHomeBanner(id: string, banner: Partial<InsertHomeBanner>): Promise<HomeBanner | undefined> {
    const result = await db.update(schema.homeBanners)
      .set(banner)
      .where(eq(schema.homeBanners.id, id))
      .returning();
    return result[0];
  }

  async deleteHomeBanner(id: string): Promise<boolean> {
    const result = await db.delete(schema.homeBanners).where(eq(schema.homeBanners.id, id)).returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
