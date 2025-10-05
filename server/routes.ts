import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertHomeSliderSchema, 
  updateHomeSliderSchema,
  insertHomeWidgetSchema,
  updateHomeWidgetSchema,
  insertHomeWidgetItemSchema,
  updateHomeWidgetItemSchema,
  insertUserSchema,
  updateUserSchema
} from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Users API
  app.get("/api/users", async (_req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const { id, ...userData } = req.body;
      if (!id) {
        return res.status(400).json({ message: "User ID is required" });
      }
      const validatedData = insertUserSchema.parse(userData);
      const user = await storage.createUser(id, validatedData);
      res.status(201).json(user);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const validatedData = updateUserSchema.parse(req.body);
      const user = await storage.updateUser(req.params.id, validatedData);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/users/:id", async (req, res) => {
    try {
      const success = await storage.deleteUser(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Home Slider API
  app.get("/api/home-slider", async (_req, res) => {
    try {
      const slides = await storage.getHomeSlides();
      res.json(slides);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/home-slider/:id", async (req, res) => {
    try {
      const slide = await storage.getHomeSlide(req.params.id);
      if (!slide) {
        return res.status(404).json({ message: "Slide not found" });
      }
      res.json(slide);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/home-slider", async (req, res) => {
    try {
      const validatedData = insertHomeSliderSchema.parse(req.body);
      const slide = await storage.createHomeSlide(validatedData);
      res.status(201).json(slide);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/home-slider/:id", async (req, res) => {
    try {
      const validatedData = updateHomeSliderSchema.parse(req.body);
      const slide = await storage.updateHomeSlide(req.params.id, validatedData);
      if (!slide) {
        return res.status(404).json({ message: "Slide not found" });
      }
      res.json(slide);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/home-slider/:id", async (req, res) => {
    try {
      const success = await storage.deleteHomeSlide(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Slide not found" });
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Home Widgets API
  app.get("/api/home-widgets", async (_req, res) => {
    try {
      const widgets = await storage.getHomeWidgets();
      res.json(widgets);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/home-widgets/:id", async (req, res) => {
    try {
      const widget = await storage.getHomeWidget(req.params.id);
      if (!widget) {
        return res.status(404).json({ message: "Widget not found" });
      }
      res.json(widget);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/home-widgets", async (req, res) => {
    try {
      const validatedData = insertHomeWidgetSchema.parse(req.body);
      const widget = await storage.createHomeWidget(validatedData);
      res.status(201).json(widget);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/home-widgets/:id", async (req, res) => {
    try {
      const validatedData = updateHomeWidgetSchema.parse(req.body);
      const widget = await storage.updateHomeWidget(req.params.id, validatedData);
      if (!widget) {
        return res.status(404).json({ message: "Widget not found" });
      }
      res.json(widget);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/home-widgets/:id", async (req, res) => {
    try {
      const success = await storage.deleteHomeWidget(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Widget not found" });
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Home Widget Items API
  app.get("/api/home-widget-items", async (_req, res) => {
    try {
      const items = await storage.getHomeWidgetItems();
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/home-widget-items/:id", async (req, res) => {
    try {
      const item = await storage.getHomeWidgetItem(req.params.id);
      if (!item) {
        return res.status(404).json({ message: "Widget item not found" });
      }
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/home-widget-items", async (req, res) => {
    try {
      const validatedData = insertHomeWidgetItemSchema.parse(req.body);
      const item = await storage.createHomeWidgetItem(validatedData);
      res.status(201).json(item);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/home-widget-items/:id", async (req, res) => {
    try {
      const validatedData = updateHomeWidgetItemSchema.parse(req.body);
      const item = await storage.updateHomeWidgetItem(req.params.id, validatedData);
      if (!item) {
        return res.status(404).json({ message: "Widget item not found" });
      }
      res.json(item);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/home-widget-items/:id", async (req, res) => {
    try {
      const success = await storage.deleteHomeWidgetItem(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Widget item not found" });
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
