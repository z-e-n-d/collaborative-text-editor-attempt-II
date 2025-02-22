import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertDocumentSchema } from "@shared/schema";

export async function registerRoutes(app: Express) {
  // Get document content
  app.get("/api/document/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const doc = await storage.getDocument(id);
    if (!doc) {
      res.status(404).json({ message: "Document not found" });
      return;
    }
    res.json(doc);
  });

  // Update document content
  app.post("/api/document/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const result = insertDocumentSchema.safeParse(req.body);
    
    if (!result.success) {
      res.status(400).json({ message: "Invalid document data" });
      return;
    }

    const doc = await storage.updateDocument(id, result.data);
    res.json(doc);
  });

  return createServer(app);
}
