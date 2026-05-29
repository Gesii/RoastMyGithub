import { geminiModel } from "../config/gemini.js";

// Shared rules that apply to every roast, regardless of style.
const BASE_RULES = `You roast developers based on their public GitHub profile.
Universal rules (always apply):
- Be funny and clever. Punch at the code/habits, not protected characteristics.
- Keep it playful, not genuinely mean-spirited. No slurs, no harassment.
- Reference concrete details from the data (repo names, languages, star counts, stale repos, fork ratios, empty bios, follower/following ratios, etc.).
- Output plain text only. No markdown headers or bullet lists.`;

// Per-style persona + format. The style instruction is authoritative for tone
// and format, and the model must adhere to it strictly.
const ROAST_STYLES = {
  savage: {
    label: "Savage",
    instruction: `STYLE: Savage stand-up comedian.
- Be sharp, brutal, and hilarious. No mercy.
- 4-7 punchy sentences. End with a backhanded compliment.`,
  },
  corporate: {
    label: "Corporate Jargon",
    instruction: `STYLE: Passive-aggressive corporate performance review.
- Drench every sentence in corporate buzzwords: synergy, leverage, circle back, low-hanging fruit, move the needle, bandwidth, action items, stakeholders, deliverables, paradigm shift.
- Sound like a smiling middle manager delivering bad news in a "growth opportunity" framing.
- 4-7 sentences. End with a fake-positive "action item" for the developer.`,
  },
  pirate: {
    label: "Pirate",
    instruction: `STYLE: Salty old pirate captain.
- Write entirely in pirate speak: "Arrr", "matey", "ye", "yer", "scallywag", "landlubber", "Davy Jones' locker", nautical metaphors.
- 4-7 sentences. End with a grudging pirate's compliment.`,
  },
  haiku: {
    label: "Haiku",
    instruction: `STYLE: Haiku.
- Output EXACTLY three lines forming a traditional haiku (5-7-5 syllables), each line on its own line.
- It must still be a roast referencing their GitHub data.
- Do NOT add any text before or after the three lines. No title, no explanation.`,
  },
};

const DEFAULT_STYLE = "savage";

export const ROAST_STYLE_KEYS = Object.keys(ROAST_STYLES);

/**
 * Condenses the GitHub payload into a compact, prompt-friendly summary.
 * Keeps token usage down and focuses Gemini on roast-worthy signals.
 *
 * @param {object} profile - payload from githubService.fetchGitHubProfile
 */
function summarizeProfile(profile) {
  const topRepos = [...profile.repositories]
    .sort((a, b) => b.stars - a.stars)
    .slice(0, 10)
    .map((repo) => {
      const tags = [
        repo.language || "no language",
        `${repo.stars}★`,
        `${repo.forks} forks`,
        repo.isFork ? "fork" : null,
        repo.isArchived ? "archived" : null,
      ]
        .filter(Boolean)
        .join(", ");
      const desc = repo.description ? ` — "${repo.description}"` : " — (no description)";
      return `- ${repo.name} (${tags})${desc}`;
    })
    .join("\n");

  const forkCount = profile.repositories.filter((r) => r.isFork).length;
  const noDescCount = profile.repositories.filter((r) => !r.description).length;
  const languages = [
    ...new Set(profile.repositories.map((r) => r.language).filter(Boolean)),
  ];

  return `GitHub user: ${profile.username}${profile.name ? ` (${profile.name})` : ""}
Bio: ${profile.bio || "(empty)"}
Company: ${profile.company || "(none)"} | Location: ${profile.location || "(none)"}
Account created: ${profile.accountCreatedAt}
Followers: ${profile.followers} | Following: ${profile.following}
Public repos: ${profile.publicRepos} (${forkCount} are forks, ${noDescCount} have no description)
Languages used: ${languages.length ? languages.join(", ") : "(none detected)"}

Top repositories:
${topRepos || "(no public repositories at all)"}`;
}

/**
 * Generates a roast for the given GitHub profile payload using Gemini.
 *
 * @param {object} profile - payload from githubService.fetchGitHubProfile
 * @param {string} [style] - one of ROAST_STYLE_KEYS; defaults to "savage"
 * @returns {Promise<string>} the roast text
 */
export async function generateRoast(profile, style = DEFAULT_STYLE) {
  const selected = ROAST_STYLES[style] ?? ROAST_STYLES[DEFAULT_STYLE];
  const summary = summarizeProfile(profile);

  const prompt = `${BASE_RULES}

${selected.instruction}

You must strictly adhere to the requested style above. Do not blend in other styles.

Roast this developer based on the following GitHub data:

${summary}`;

  let result;
  try {
    result = await geminiModel.generateContent(prompt);
  } catch (err) {
    // Surface Gemini quota/rate-limit errors with a clean, user-facing message.
    if (isGeminiRateLimit(err)) {
      const error = new Error("Gemini rate limit exceeded");
      error.status = 429;
      error.clientMessage =
        "The AI is overheated from all these terrible repos! Please wait a few seconds before roasting again.";
      throw error;
    }
    throw err;
  }

  const roast = result.response.text().trim();

  if (!roast) {
    const error = new Error("Gemini returned an empty roast");
    error.status = 502;
    throw error;
  }

  return roast;
}

// The @google/generative-ai SDK throws a fetch error carrying the HTTP status;
// fall back to inspecting the message for environments where it's absent.
export function isGeminiRateLimit(err) {
  if (err?.status === 429) return true;
  return /\b429\b|quota|rate limit|too many requests/i.test(err?.message ?? "");
}
