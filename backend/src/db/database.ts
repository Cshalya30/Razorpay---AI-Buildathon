import { DatabaseSync } from "node:sqlite";
import fs from "fs";
import path from "path";

const DB_PATH = process.env.DB_PATH || path.resolve(__dirname, "../../../recover.db");

export const db = new DatabaseSync(DB_PATH);

// Enable WAL mode & foreign keys
db.exec("PRAGMA journal_mode = WAL;");
db.exec("PRAGMA foreign_keys = ON;");

export function initDb(): void {
  let schemaPath = path.resolve(__dirname, "schema.sql");
  if (!fs.existsSync(schemaPath)) {
    schemaPath = path.resolve(__dirname, "../../src/db/schema.sql");
  }
  if (fs.existsSync(schemaPath)) {
    const schemaSql = fs.readFileSync(schemaPath, "utf-8");
    db.exec(schemaSql);
  }
}
