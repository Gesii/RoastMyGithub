import { fetchGitHubProfile } from "../services/githubService.js";
import { generateRoast, ROAST_STYLE_KEYS } from "../services/roastService.js";

export async function roastUser(req, res) {
  const { username, style } = req.body ?? {};

  if (!username || typeof username !== "string" || !username.trim()) {
    return res.status(400).json({ error: "A GitHub 'username' is required." });
  }

  // Default to "savage" when no/unknown style is provided.
  const selectedStyle = ROAST_STYLE_KEYS.includes(style) ? style : "savage";

  try {
    const payload = await fetchGitHubProfile(username.trim());

    console.log(`[roast] Fetched GitHub payload for "${payload.username}" (${payload.publicRepos} repos)`);

    const roast = await generateRoast(payload, selectedStyle);

    console.log(`[roast] Generated "${selectedStyle}" roast for "${payload.username}".`);

    return res.status(200).json({
      username: payload.username,
      style: selectedStyle,
      roast,
      profile: payload,
    });
  } catch (error) {
    const status = error.status ?? 500;
    console.error(`[roast] Failed for "${username}":`, error.message);
    return res.status(status).json({ error: error.message });
  }
}
