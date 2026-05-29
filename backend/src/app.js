import express from "express";
import cors from "cors";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import roastRoutes from "./routes/roastRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// In production (e.g. Replit) the built frontend is served from here.
const frontendDist = path.resolve(__dirname, "../../frontend/dist");
const frontendIndex = path.join(frontendDist, "index.html");
const hasFrontendBuild = fs.existsSync(frontendIndex);

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", roastRoutes);

// Unmatched API routes always return JSON (never the SPA fallback).
app.use("/api", (_req, res) => {
  res.status(404).json({ error: "Not found" });
});

if (hasFrontendBuild) {
  // Serve the built frontend and fall back to index.html for client routing,
  // so the whole app runs on a single port/origin.
  app.use(express.static(frontendDist));
  app.get("*", (_req, res) => {
    res.sendFile(frontendIndex);
  });
} else {
  // API-only mode (e.g. local dev with the Vite dev server proxying /api).
  app.use((_req, res) => {
    res.status(404).json({ error: "Not found" });
  });
}

// Centralized error handler (handles the Gemini 429 rate limit, etc.).
app.use(errorHandler);

export default app;
