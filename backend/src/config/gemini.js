import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_MODEL = "gemini-2.5-flash";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  // Fail loudly at startup rather than on the first request.
  console.warn(
    "[gemini] GEMINI_API_KEY is not set. Roast generation will fail until it is provided in your .env file."
  );
}

const genAI = new GoogleGenerativeAI(apiKey ?? "");

export const geminiModel = genAI.getGenerativeModel({ model: GEMINI_MODEL });

export { GEMINI_MODEL };
