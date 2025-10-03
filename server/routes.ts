import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertHomeBannerSchema, 
  updateHomeBannerSchema,
  insertHomeWidgetSchema,
  updateHomeWidgetSchema
} from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Home Banners API
  app.get("/api/home-banners", async (_req, res) => {
    try {
      const banners = await storage.getHomeBanners();
      res.json(banners);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/home-banners/:id", async (req, res) => {
    try {
      const banner = await storage.getHomeBanner(req.params.id);
      if (!banner) {
        return res.status(404).json({ message: "Banner not found" });
      }
      res.json(banner);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/home-banners", async (req, res) => {
    try {
      const validatedData = insertHomeBannerSchema.parse(req.body);
      const banner = await storage.createHomeBanner(validatedData);
      res.status(201).json(banner);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/home-banners/:id", async (req, res) => {
    try {
      const validatedData = updateHomeBannerSchema.parse(req.body);
      const banner = await storage.updateHomeBanner(req.params.id, validatedData);
      if (!banner) {
        return res.status(404).json({ message: "Banner not found" });
      }
      res.json(banner);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/home-banners/:id", async (req, res) => {
    try {
      const success = await storage.deleteHomeBanner(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Banner not found" });
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

  const httpServer = createServer(app);

  return httpServer;
}
