# Roast My GitHub

A full-stack web app that fetches a user's public GitHub activity and roasts it
with Google Gemini (`gemini-2.5-flash`) in one of six comedic styles.

- **Backend:** Node.js + Express (ES modules) — fetches GitHub data and generates roasts.
- **Frontend:** React + Vite + Tailwind CSS — a themed UI that re-skins per roast style.

> [!WARNING]
> **Heads-up on the live demo / API limits.** This app currently runs on a
> **free Google Gemini API key**, which has strict usage quotas. After a handful
> of requests in a short window, Gemini returns a **429 rate-limit error** and
> roasting will temporarily stop working. If you're testing the deployed
> (Replit) URL and see *"The AI is overheated from all these terrible repos!
> Please wait a few seconds before roasting again"*, that's the quota — just wait
> a bit and try again. Previously generated roasts remain viewable from the
> **Recent Roasts** history (they're cached locally), so they keep working even
> while the quota is exhausted. For heavier use, swap in a paid Gemini key.

## Features

- Roast any public GitHub user by username.
- **Six roast styles:** Savage, Corporate Jargon, Pirate, Haiku, Gordon Ramsay,
  and LinkedIn Influencer. The entire UI (colors, fonts, gradient header, slogan)
  re-themes to match the chosen style.
- **Custom loading state:** randomized, cycling funny status messages.
- **Distinct empty states:** friendly, per-style messages for non-existent users
  (404) and users with no public repositories.
- **Copy Roast** button and **Regenerate** for a fresh take.
- **Recent Roasts** history (saved in `localStorage`) with cached responses —
  click a tag to instantly re-display a past roast without another API call.
- **Profile stats strip** — repos, total stars, and followers shown in a themed
  card above the roast (cached in history too).
- Graceful error handling, including a clean message for Gemini rate limits.

## Project structure

```
.
├── backend/                   # Express API (+ serves the built frontend in prod)
│   ├── src/
│   │   ├── config/gemini.js          # @google/generative-ai client (gemini-2.5-flash)
│   │   ├── controllers/roastController.js
│   │   ├── middleware/errorHandler.js # Centralized errors (e.g. Gemini 429)
│   │   ├── routes/roastRoutes.js      # POST /api/roast
│   │   ├── services/githubService.js  # Fetches public GitHub profile + repos
│   │   ├── services/roastService.js   # Builds the prompt + calls Gemini
│   │   ├── loadEnv.js                 # Loads backend/.env (cwd-independent)
│   │   ├── app.js                     # Express app, static serving, routes
│   │   └── server.js                  # Entry point (binds 0.0.0.0)
│   ├── .env.example
│   └── package.json
├── frontend/                  # React + Vite + Tailwind app
│   ├── src/App.jsx            # Entire UI (themes, history, states)
│   ├── vite.config.js         # Tailwind plugin + dev proxy to /api
│   └── package.json
├── package.json               # Root scripts for build/start (used by Replit)
├── docs/development-log.md    # Full Cursor chat transcript (show your work)
└── .replit                    # Replit run/deploy config
```

## Local development

Run the backend and frontend separately (the Vite dev server proxies `/api` to
the backend, so you get hot reload on both).

**1. Backend** (terminal 1):

```bash
cd backend
npm install
cp .env.example .env   # then add your GEMINI_API_KEY
npm run dev            # http://localhost:3001 (auto-restart via node --watch)
```

**2. Frontend** (terminal 2):

```bash
cd frontend
npm install
npm run dev            # http://localhost:5173 (proxies /api → :3001)
```

Open http://localhost:5173.

## Production / single-port build

In production the Express server serves the built frontend **and** the API on a
single port. From the repo root:

```bash
npm run build   # installs deps and builds frontend → frontend/dist
npm start       # serves everything on $PORT (default 3001)
```

## Deploying to Replit

1. Add your keys under **Secrets** (not as a `PORT` — Replit injects that):
   - `GEMINI_API_KEY` (required)
   - `GITHUB_TOKEN` (optional, raises the GitHub rate limit)
2. The included `.replit` builds the frontend and starts the server, which serves
   both the UI and the API on one port. Click **Run**, or use
   **Deploy → Autoscale** for a public URL.

See the rate-limit warning above before sharing the live URL widely.

## API

`POST /api/roast`

Request:

```json
{ "username": "torvalds", "style": "savage" }
```

`style` is optional and must be one of `savage` (default), `corporate`, `pirate`,
`haiku`, `chef` (Gordon Ramsay), or `influencer` (LinkedIn Influencer).
Unknown/missing values fall back to `savage`.

Response:

```json
{
  "username": "torvalds",
  "style": "savage",
  "roast": "A savage, witty roast generated by Gemini...",
  "profile": { "username": "torvalds", "followers": 304966, "repositories": [] }
}
```

Notes:

- A user with **no public repos** returns `200` with `roast: null` (the frontend
  shows a per-style empty state) — no Gemini call is made.
- A non-existent user returns `404 { "error": "GitHub user not found" }`.
- A Gemini rate limit returns `429` with the friendly "overheated" message.

`GET /health` → `{ "status": "ok" }`

## Environment variables

| Variable         | Required | Description                                                        |
| ---------------- | -------- | ------------------------------------------------------------------ |
| `GEMINI_API_KEY` | Yes      | Google Gemini API key (free tier is rate-limited — see warning).   |
| `GITHUB_TOKEN`   | No       | Raises GitHub rate limit (60/hr → 5000/hr). Public scopes suffice. |
| `PORT`           | No       | Server port (default `3001`). On Replit this is injected for you.  |

## How this was built (prompts used)

This app was built iteratively with **Cursor** (Claude). Below are the prompts I
gave the assistant, in order, verbatim. The full transcript — including the
assistant's reasoning, tool calls, and responses — is preserved in
[`docs/development-log.md`](docs/development-log.md).

1. I'm building a full-stack app called 'Roast My GitHub'. Let's start by initializing a Node.js Express backend. Create a clean server structure that uses the @google/generative-ai SDK (configured for the gemini-2.5-flash model) and reads the API key from process.env.GEMINI_API_KEY. Set up a POST route /api/roast that accepts a GitHub username, fetches their public repository data from the public GitHub API, and logs the payload so we can test it
2. i provided the keys in the .env file, and after running npm run dev in the console, i got this error: *(shared the terminal output — port 3001 EADDRINUSE)*
3. now i am getting this output in the console: *(shared the clean boot log)* — Are we ready to move on to the frontend parts now? (Wait for me to give you extra instructions before you begin, if so)
4. ok, finish what is remaining for the backend first
5. Now that the backend logic is ready, let's create the frontend using Vite, React, and Tailwind CSS. Build a simple layout with a single text input for the GitHub username and a submit button. Connect it to our backend POST route using Axios/Fetch and render the raw text output from the roast model on the screen. Don't worry about polished styling or animations yet; let's just make sure the data transfers properly.
6. is that error you got from gemini concerning?
7. Lets not do that yet. Instead, follow the instructions: Now, let's implement the Roast Style feature. Update the backend prompt logic to accept a style parameter. Modify the frontend to include a Tailwind dropdown menu allowing users to choose between: Corporate Jargon, Pirate, Haiku, or Savage. Update the backend LLM system prompt so that it strictly adheres to the requested comedic style
8. Yes, move on to polishing the UI now. Make the UI stylized based on whatever roast style is chosen, with the savage style being the default one. Also, create a custom loading state. While the backend API request is pending, replace the submit button with a funny, cycling loading sequence that flashes messages like 'Analyzing indentation choices...' or 'Consulting the AI gods...' every 1.5 seconds.
9. when you enter a user, choose a roast style (for example pirate), and then after the response i change the roast style, the old response from the other style still remains there, with the css styling of another roast style. What do you think we should do about this?
10. ok, good change, but if there is no roast currently being shown, i think that even by changing the roast style the css styling should also change in this case
11. add, commit and push all these changes you have made thus far
12. Let's add the final layer of user experience polish. First, implement robust error handling on the frontend: if the backend returns a 404 (user doesn't exist) or if the repository list is empty, show a distinct, user-friendly empty state.
13. can you give a different response for the "no public repo" scenario, depending on the roast style that is chosen?
14. can you make the text that appears while waiting for the roast response randomized, because right now it seems to always show the same lines of text each 1.5 seconds, in the same order. Because of this, also try to add more lines of text similar to what we already have
15. Let's fill out the empty space below the main card by adding two features. First, add a 'Copy Roast' button inside the bottom right of the response container that copies the text to the user's clipboard and shows a brief success checkmark. Second, right below the main roast container, implement a 'Recent Roasts' history row using localStorage. Every time a roast is successful, save the username and roast style, and display them as small, clickable tag components so a user can quickly re-run them.
16. Lets just save the responses as well, instead of asking the AI everytime to generate a roast when we click a previous user in the Recent roasts section. Or do you have another suggestion for this part.
17. Our backend hit a Google API 429 quota rate limit error. Let's update the Express backend error middleware so that if the Gemini API returns a 429, we catch it gracefully and send a clean response to the frontend saying: 'The AI is overheated from all these terrible repos! Please wait a few seconds before roasting again'
18. The dropdown arrow on the select element is too close to the right edge and looks unaligned. Let's fix it by hiding the native browser arrow and providing proper right padding
19. when you press the roast button, the select element is momentarily shrunken down and noticably smaller than the username element and the randomized text element
20. Look at the input form container. When the loading state triggers, the username input and dropdown select elements are stretching vertically and losing their uniform height. Additionally, the roast button is now for some reason wider compared to before, which I don't want.
21. Let's give the header area (the title, subtitle, and slogan) a massive visual upgrade so it looks like a premium, modern SaaS web app.
22. commit and push the changes we've made
23. now, what are the next steps i should take, if i want to publish this in replit? I already have an account, and have added the GEMINI_API_KEY and GITHUB_TOKEN in the secrets part of my account details. Should i also add the port there? are there any other fixes you need to make for this to work on replit?
24. before you commit and push, update the README.md file to accurately describe the current state of the app, and also add a warning in there that i am currently using free Gemini Api keys, and that rate limits get exceeded after some requests. I am assuming this could be a problem if users test the app through the live replit URL
25. before i publish to replit, i want to add two more roast styles. One is The "Gordon Ramsay of Code" (The Kitchen Nightmare), which should have the vibe of an aggressive, screaming celebrity chef who treats your GitHub profile like a failing restaurant serving raw, disgusting code. The other style should be the "Over-Enthusiastic Tech Influencer" (LinkedIn Mode), which should have the vibe of a hustle-culture tech bro on LinkedIn who tries to turn every single line of terrible code into an inspirational life lesson about networking and synergy. For this one, always end the roast with a fake-deep question like "Agree?"
26. I want to add one more feature. Let's show the Github profile stats (Number of repos, stars, followers) somewhere in the page as well, and make it fit in.

## What I'd do with more time

- **A better API-key / quota setup so it runs out less.** The biggest limitation
  today is the free Gemini tier — it hits a 429 after a handful of requests, which
  is rough for a public demo. With more time I'd move to a paid key (or rotate a
  small pool of keys), add **retry with exponential backoff** for transient
  `429`/`503` responses, and put a short **server-side cache** in front of Gemini
  so identical username+style requests reuse a recent roast instead of spending
  quota. A lightweight per-IP rate limit would also stop a single visitor from
  burning the whole quota.
- **More roast styles.** The style system is already data-driven (a `ROAST_STYLES`
  map on the backend + a matching theme/empty-state map on the frontend), so new
  personas are cheap to add — e.g. Shakespearean, Gen-Z/brainrot, passive-aggressive
  ex, film-noir detective, or a "your mom" mode. I'd also consider letting users
  write a **custom style prompt**.
- **Streaming responses.** Stream the roast token-by-token (`generateContentStream`)
  so the text types out live instead of the user waiting on a spinner — a nicer
  feel and it makes long roasts feel faster.
