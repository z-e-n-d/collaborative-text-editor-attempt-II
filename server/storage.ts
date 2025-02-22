import { documents, type Document, type InsertDocument } from "@shared/schema";

export interface IStorage {
  getDocument(id: number): Promise<Document | undefined>;
  createDocument(doc: InsertDocument): Promise<Document>;
  updateDocument(id: number, doc: InsertDocument): Promise<Document>;
}

export class MemStorage implements IStorage {
  private documents: Map<number, Document>;
  currentId: number;

  constructor() {
    this.documents = new Map();
    // Initialize with empty document
    const initialDoc = { id: 1, content: "" };
    this.documents.set(1, initialDoc);
    this.currentId = 2;
  }

  async getDocument(id: number): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async createDocument(doc: InsertDocument): Promise<Document> {
    const id = this.currentId++;
    const document = { ...doc, id };
    this.documents.set(id, document);
    return document;
  }

  async updateDocument(id: number, doc: InsertDocument): Promise<Document> {
    const document = { ...doc, id };
    this.documents.set(id, document);
    return document;
  }
}

export const storage = new MemStorage();
