const GITHUB_API_BASE = "https://api.github.com";

function buildHeaders() {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "RoastMyGithub",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  // Optional: lifts the unauthenticated rate limit (60/hr -> 5000/hr) if set.
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  return headers;
}

async function githubRequest(path) {
  const response = await fetch(`${GITHUB_API_BASE}${path}`, {
    headers: buildHeaders(),
  });

  if (response.status === 404) {
    const error = new Error("GitHub user not found");
    error.status = 404;
    throw error;
  }

  if (response.status === 403) {
    const error = new Error("GitHub API rate limit exceeded");
    error.status = 429;
    throw error;
  }

  if (!response.ok) {
    const error = new Error(`GitHub API request failed (${response.status})`);
    error.status = 502;
    throw error;
  }

  return response.json();
}

/**
 * Fetches a GitHub user's profile and their public repositories,
 * returning a trimmed payload suitable for roasting.
 *
 * @param {string} username
 */
export async function fetchGitHubProfile(username) {
  const [profile, repos] = await Promise.all([
    githubRequest(`/users/${encodeURIComponent(username)}`),
    githubRequest(
      `/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`
    ),
  ]);

  const repositories = repos.map((repo) => ({
    name: repo.name,
    description: repo.description,
    language: repo.language,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    openIssues: repo.open_issues_count,
    isFork: repo.fork,
    isArchived: repo.archived,
    topics: repo.topics ?? [],
    createdAt: repo.created_at,
    updatedAt: repo.updated_at,
    pushedAt: repo.pushed_at,
  }));

  return {
    username: profile.login,
    name: profile.name,
    bio: profile.bio,
    company: profile.company,
    location: profile.location,
    blog: profile.blog,
    publicRepos: profile.public_repos,
    followers: profile.followers,
    following: profile.following,
    accountCreatedAt: profile.created_at,
    repositories,
  };
}
