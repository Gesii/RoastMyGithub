import "dotenv/config";
import app from "./app.js";
import { GEMINI_MODEL } from "./config/gemini.js";

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`[server] Roast My GitHub backend listening on http://localhost:${PORT}`);
  console.log(`[server] Gemini model configured: ${GEMINI_MODEL}`);
});
