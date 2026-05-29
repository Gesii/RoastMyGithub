import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Load backend/.env regardless of the current working directory (e.g. when
// started from the repo root via `npm start`). On hosts like Replit the real
// env vars/Secrets already exist and dotenv will not override them.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });
