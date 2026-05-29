import express from "express";
import cors from "cors";
import roastRoutes from "./routes/roastRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", roastRoutes);

// Catch-all 404 for unknown routes.
app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Centralized error handler (handles the Gemini 429 rate limit, etc.).
app.use(errorHandler);

export default app;
