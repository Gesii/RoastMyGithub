import { fetchGitHubProfile } from "../services/githubService.js";
import { generateRoast, ROAST_STYLE_KEYS } from "../services/roastService.js";

export async function roastUser(req, res, next) {
  const { username, style } = req.body ?? {};

  if (!username || typeof username !== "string" || !username.trim()) {
    return res.status(400).json({ error: "A GitHub 'username' is required." });
  }

  // Default to "savage" when no/unknown style is provided.
  const selectedStyle = ROAST_STYLE_KEYS.includes(style) ? style : "savage";

  try {
    const payload = await fetchGitHubProfile(username.trim());

    console.log(`[roast] Fetched GitHub payload for "${payload.username}" (${payload.publicRepos} repos)`);

    // No public repos: nothing to roast. Skip the Gemini call and let the
    // frontend render its empty state immediately.
    if (payload.repositories.length === 0) {
      console.log(`[roast] "${payload.username}" has no public repos; skipping roast.`);
      return res.status(200).json({
        username: payload.username,
        style: selectedStyle,
        roast: null,
        profile: payload,
      });
    }

    const roast = await generateRoast(payload, selectedStyle);

    console.log(`[roast] Generated "${selectedStyle}" roast for "${payload.username}".`);

    return res.status(200).json({
      username: payload.username,
      style: selectedStyle,
      roast,
      profile: payload,
    });
  } catch (error) {
    console.error(`[roast] Failed for "${username}":`, error.message);
    // Hand off to the centralized error middleware for the client response.
    return next(error);
  }
}
