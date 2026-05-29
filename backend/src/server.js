import "./loadEnv.js";
import app from "./app.js";
import { GEMINI_MODEL } from "./config/gemini.js";

const PORT = process.env.PORT || 3001;
// Bind to all interfaces so the app is reachable on hosts like Replit.
const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`[server] Roast My GitHub backend listening on http://${HOST}:${PORT}`);
  console.log(`[server] Gemini model configured: ${GEMINI_MODEL}`);
});
