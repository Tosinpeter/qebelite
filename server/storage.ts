import { db } from "./db";
import { eq } from "drizzle-orm";
import * as schema from "@shared/schema";
import type { 
  User, 
  InsertUser, 
  HomeWidget, 
  InsertHomeWidget,
  HomeSlide,
  InsertHomeSlide
} from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(id: string, user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;
  
  getHomeWidgets(): Promise<HomeWidget[]>;
  getHomeWidget(id: string): Promise<HomeWidget | undefined>;
  createHomeWidget(widget: InsertHomeWidget): Promise<HomeWidget>;
  updateHomeWidget(id: string, widget: Partial<InsertHomeWidget>): Promise<HomeWidget | undefined>;
  deleteHomeWidget(id: string): Promise<boolean>;
  
  getHomeSlides(): Promise<HomeSlide[]>;
  getHomeSlide(id: string): Promise<HomeSlide | undefined>;
  createHomeSlide(slide: InsertHomeSlide): Promise<HomeSlide>;
  updateHomeSlide(id: string, slide: Partial<InsertHomeSlide>): Promise<HomeSlide | undefined>;
  deleteHomeSlide(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(schema.users).where(eq(schema.users.id, id));
    return result[0];
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(schema.users);
  }

  async createUser(id: string, insertUser: InsertUser): Promise<User> {
    const result = await db.insert(schema.users).values({ ...insertUser, id }).returning();
    return result[0];
  }

  async updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined> {
    const result = await db.update(schema.users)
      .set({ ...user, updatedAt: new Date() })
      .where(eq(schema.users.id, id))
      .returning();
    return result[0];
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await db.delete(schema.users).where(eq(schema.users.id, id)).returning();
    return result.length > 0;
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

  async getHomeSlides(): Promise<HomeSlide[]> {
    return db.select().from(schema.homeSlider);
  }

  async getHomeSlide(id: string): Promise<HomeSlide | undefined> {
    const result = await db.select().from(schema.homeSlider).where(eq(schema.homeSlider.id, id));
    return result[0];
  }

  async createHomeSlide(slide: InsertHomeSlide): Promise<HomeSlide> {
    const result = await db.insert(schema.homeSlider).values(slide).returning();
    return result[0];
  }

  async updateHomeSlide(id: string, slide: Partial<InsertHomeSlide>): Promise<HomeSlide | undefined> {
    const result = await db.update(schema.homeSlider)
      .set(slide)
      .where(eq(schema.homeSlider.id, id))
      .returning();
    return result[0];
  }

  async deleteHomeSlide(id: string): Promise<boolean> {
    const result = await db.delete(schema.homeSlider).where(eq(schema.homeSlider.id, id)).returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
