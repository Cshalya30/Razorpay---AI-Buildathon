import express, { Request, Response, NextFunction } from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { mandatesRouter } from "./routes/mandates";
import { retriesRouter } from "./routes/retries";
import { complianceRouter } from "./routes/compliance";
import { evalRouter } from "./routes/eval";
import { socketService } from "./services/socketService";
import { initDb } from "./db/database";

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

// Initialize DB schema if needed
initDb();

// Security middleware
app.use(helmet());
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "10kb" }));

// Rate limiting (PRD Part 8: 100 req/min general, 20/min on writes)
const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: "Too many requests. Please try again in 1 minute." }
});

const writeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: "Rate limit exceeded on write route." }
});

app.use("/api/", generalLimiter);
app.post("/api/v1/mandates/:id/simulate-failure", writeLimiter);
app.post("/api/v1/mandates/:id/simulate-debit", writeLimiter);
app.post("/api/v1/eval/run", writeLimiter);

// Initialize Socket.io
socketService.init(server);

// Routes
app.use("/api/v1/mandates", mandatesRouter);
app.use("/api/v1/retries", retriesRouter);
app.use("/api/v1/compliance", complianceRouter);
app.use("/api/v1/eval", evalRouter);

// Health check
app.get("/api/v1/health", (_req: Request, res: Response) => {
  res.json({ success: true, status: "healthy", timestamp: new Date().toISOString() });
});

// 404 Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, error: "Resource not found" });
});

// Centralized error handler (no leaked stack traces)
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === "production" ? "Internal server error" : err.message
  });
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`RECOVER Backend running on http://localhost:${PORT}`);
  });
}

export { app, server };
