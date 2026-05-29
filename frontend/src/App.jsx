import { useEffect, useState } from 'react'

const ROAST_STYLES = [
  { value: 'savage', label: 'Savage' },
  { value: 'corporate', label: 'Corporate Jargon' },
  { value: 'pirate', label: 'Pirate' },
  { value: 'haiku', label: 'Haiku' },
  { value: 'chef', label: 'Gordon Ramsay' },
  { value: 'influencer', label: 'LinkedIn Influencer' },
]

// Full, static Tailwind class strings per style so the JIT compiler detects them.
const THEMES = {
  savage: {
    emoji: '🔥',
    tagline: 'No mercy. No survivors.',
    page: 'bg-gradient-to-b from-gray-950 via-gray-900 to-black text-gray-100',
    bodyFont: 'font-sans',
    title: 'text-red-500 font-extrabold tracking-tight',
    subtitle: 'text-gray-400',
    card: 'border border-red-900/60 bg-gray-900/70 shadow-lg shadow-red-950/30',
    input: 'border-gray-700 bg-gray-800/80 text-gray-100 placeholder-gray-500 focus:border-red-500 focus:ring-red-500/40',
    select: 'border-gray-700 bg-gray-800/80 text-gray-100 focus:border-red-500 focus:ring-red-500/40',
    button: 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/40',
    roastText: 'text-gray-100',
    roastAlign: 'text-left',
    loadingBox: 'border-red-900/60 bg-gray-900/70 text-red-300',
    spinner: 'border-red-500/30 border-t-red-500',
    tag: 'border-red-900/60 bg-gray-800/70 text-gray-200 hover:border-red-500 hover:text-white',
    ghostButton: 'text-gray-400 hover:text-white',
    titleGradient: 'from-orange-400 via-red-500 to-rose-600',
    badge: 'border-red-500/30 bg-red-500/10 text-red-300',
    badgeDot: 'bg-red-500',
    accent: 'text-orange-400',
    glow: 'bg-red-600/25',
  },
  corporate: {
    emoji: '📊',
    tagline: 'Synergizing your shortcomings since 2026.',
    page: 'bg-gradient-to-b from-slate-100 via-slate-100 to-slate-200 text-slate-800',
    bodyFont: 'font-sans',
    title: 'text-blue-700 font-semibold tracking-tight',
    subtitle: 'text-slate-500',
    card: 'border border-slate-300 bg-white shadow-sm',
    input: 'border-slate-300 bg-white text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500/30',
    select: 'border-slate-300 bg-white text-slate-800 focus:border-blue-500 focus:ring-blue-500/30',
    button: 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-200',
    roastText: 'text-slate-700 leading-relaxed',
    roastAlign: 'text-left',
    loadingBox: 'border-slate-300 bg-white text-blue-700',
    spinner: 'border-blue-500/30 border-t-blue-600',
    tag: 'border-slate-300 bg-white text-slate-700 hover:border-blue-500 hover:text-blue-700',
    ghostButton: 'text-slate-500 hover:text-blue-700',
    titleGradient: 'from-blue-600 via-indigo-600 to-sky-500',
    badge: 'border-blue-500/30 bg-blue-500/10 text-blue-700',
    badgeDot: 'bg-blue-500',
    accent: 'text-blue-600',
    glow: 'bg-blue-500/20',
  },
  pirate: {
    emoji: '🏴‍☠️',
    tagline: 'Yer code be walkin\u2019 the plank.',
    page: 'bg-gradient-to-b from-amber-950 via-yellow-950 to-stone-950 text-amber-100',
    bodyFont: 'font-serif',
    title: 'text-amber-400 font-bold tracking-wide',
    subtitle: 'text-amber-200/70',
    card: 'border border-amber-800/60 bg-stone-900/70 shadow-lg shadow-amber-950/40',
    input: 'border-amber-800/70 bg-stone-900/70 text-amber-100 placeholder-amber-200/40 focus:border-amber-400 focus:ring-amber-400/30',
    select: 'border-amber-800/70 bg-stone-900/70 text-amber-100 focus:border-amber-400 focus:ring-amber-400/30',
    button: 'bg-amber-600 hover:bg-amber-500 text-stone-950 shadow-amber-900/40',
    roastText: 'text-amber-100 italic',
    roastAlign: 'text-left',
    loadingBox: 'border-amber-800/60 bg-stone-900/70 text-amber-300',
    spinner: 'border-amber-500/30 border-t-amber-400',
    tag: 'border-amber-800/70 bg-stone-900/70 text-amber-100 hover:border-amber-400 hover:text-amber-300',
    ghostButton: 'text-amber-200/70 hover:text-amber-300',
    titleGradient: 'from-yellow-300 via-amber-400 to-orange-500',
    badge: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
    badgeDot: 'bg-amber-400',
    accent: 'text-amber-400',
    glow: 'bg-amber-500/25',
  },
  haiku: {
    emoji: '🍃',
    tagline: 'Three lines. Infinite shame.',
    page: 'bg-gradient-to-b from-emerald-50 via-teal-50 to-emerald-100 text-emerald-900',
    bodyFont: 'font-serif',
    title: 'text-emerald-800 font-medium tracking-wide',
    subtitle: 'text-emerald-700/70',
    card: 'border border-emerald-200 bg-white/80 shadow-sm',
    input: 'border-emerald-300 bg-white/80 text-emerald-900 placeholder-emerald-400 focus:border-emerald-500 focus:ring-emerald-500/30',
    select: 'border-emerald-300 bg-white/80 text-emerald-900 focus:border-emerald-500 focus:ring-emerald-500/30',
    button: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-200',
    roastText: 'text-emerald-900 italic text-lg leading-loose',
    roastAlign: 'text-center',
    loadingBox: 'border-emerald-200 bg-white/80 text-emerald-700',
    spinner: 'border-emerald-500/30 border-t-emerald-600',
    tag: 'border-emerald-300 bg-white/80 text-emerald-800 hover:border-emerald-500 hover:text-emerald-600',
    ghostButton: 'text-emerald-700/70 hover:text-emerald-600',
    titleGradient: 'from-emerald-500 via-teal-500 to-green-500',
    badge: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700',
    badgeDot: 'bg-emerald-500',
    accent: 'text-emerald-600',
    glow: 'bg-emerald-500/20',
  },
  chef: {
    emoji: '👨‍🍳',
    tagline: 'It\u2019s RAW! Shut it down.',
    page: 'bg-gradient-to-b from-zinc-950 via-neutral-900 to-red-950 text-zinc-100',
    bodyFont: 'font-sans',
    title: 'text-red-500 font-extrabold tracking-tight',
    subtitle: 'text-zinc-400',
    card: 'border border-red-700/50 bg-zinc-900/70 shadow-lg shadow-red-950/40',
    input: 'border-zinc-700 bg-zinc-800/80 text-zinc-100 placeholder-zinc-500 focus:border-red-500 focus:ring-red-500/40',
    select: 'border-zinc-700 bg-zinc-800/80 text-zinc-100 focus:border-red-500 focus:ring-red-500/40',
    button: 'bg-red-700 hover:bg-red-600 text-white shadow-red-900/40',
    roastText: 'text-zinc-100',
    roastAlign: 'text-left',
    loadingBox: 'border-red-700/50 bg-zinc-900/70 text-red-300',
    spinner: 'border-red-500/30 border-t-red-500',
    tag: 'border-red-700/50 bg-zinc-800/70 text-zinc-200 hover:border-red-500 hover:text-white',
    ghostButton: 'text-zinc-400 hover:text-white',
    titleGradient: 'from-rose-500 via-red-600 to-orange-500',
    badge: 'border-red-500/30 bg-red-500/10 text-red-300',
    badgeDot: 'bg-red-500',
    accent: 'text-red-400',
    glow: 'bg-red-600/25',
  },
  influencer: {
    emoji: '🚀',
    tagline: 'Grindset. Synergy. Value-add.',
    page: 'bg-gradient-to-b from-sky-50 via-white to-indigo-50 text-slate-800',
    bodyFont: 'font-sans',
    title: 'text-sky-700 font-bold tracking-tight',
    subtitle: 'text-slate-500',
    card: 'border border-sky-200 bg-white shadow-sm',
    input: 'border-sky-200 bg-white text-slate-800 placeholder-slate-400 focus:border-sky-500 focus:ring-sky-500/30',
    select: 'border-sky-200 bg-white text-slate-800 focus:border-sky-500 focus:ring-sky-500/30',
    button: 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-200',
    roastText: 'text-slate-700 leading-relaxed',
    roastAlign: 'text-left',
    loadingBox: 'border-sky-200 bg-white text-sky-700',
    spinner: 'border-sky-500/30 border-t-sky-600',
    tag: 'border-sky-200 bg-white text-slate-700 hover:border-sky-500 hover:text-sky-700',
    ghostButton: 'text-slate-500 hover:text-sky-700',
    titleGradient: 'from-sky-500 via-indigo-500 to-violet-500',
    badge: 'border-sky-500/30 bg-sky-500/10 text-sky-700',
    badgeDot: 'bg-sky-500',
    accent: 'text-sky-600',
    glow: 'bg-sky-500/20',
  },
}

const STYLE_LABELS = Object.fromEntries(
  ROAST_STYLES.map((s) => [s.value, s.label]),
)
const STYLE_EMOJI = {
  savage: '🔥',
  corporate: '📊',
  pirate: '🏴‍☠️',
  haiku: '🍃',
  chef: '👨‍🍳',
  influencer: '🚀',
}

// Style-specific copy for the "user exists but has no public repos" state.
const EMPTY_STATES = {
  savage: {
    emoji: '🦗',
    title: 'Zero repos. Zero effort.',
    message: (u) =>
      `@${u} has produced absolutely nothing public. There's more code in a digital wristwatch. We'd roast the repos, but you can't toast thin air.`,
  },
  corporate: {
    emoji: '📭',
    title: 'Empty public portfolio',
    message: (u) =>
      `@${u} currently has zero shippable deliverables in the public domain. We've identified significant whitespace and a clear opportunity to ideate net-new repositories moving forward.`,
  },
  pirate: {
    emoji: '🏴‍☠️',
    title: 'Empty treasure chest',
    message: (u) =>
      `Arrr! @${u}'s chest be bone dry — not a single repo to plunder on these public seas. Ye can't roast a ghost ship, matey.`,
  },
  haiku: {
    emoji: '🍃',
    title: 'A haiku of nothing',
    message: (u) => `Bare branches, no code\n@${u} has planted nothing\nthe void roasts itself`,
  },
  chef: {
    emoji: '🍽️',
    title: 'WHERE\u2019S THE FOOD?!',
    message: (u) =>
      `@${u}, you call THIS a profile?! There's NOTHING on the menu! An EMPTY kitchen, not a single repo to serve! You expect me to roast a plate of fresh AIR?! Get OUT of my restaurant, you donkey!`,
  },
  influencer: {
    emoji: '📉',
    title: 'We need to talk about this profile',
    message: (u) =>
      `I'm not gonna lie, @${u} — zero public repos is wild. 🙃 Everyone's out here shipping and you've got... an empty profile and a dream. "Building in stealth" isn't a personality, and a blank GitHub isn't a brand. Respectfully, do better.\nMake it make sense.`,
  },
}

const LOADING_MESSAGES = [
  'Analyzing indentation choices...',
  'Consulting the AI gods...',
  'Counting abandoned side projects...',
  'Judging your commit messages...',
  'Measuring fork-to-original ratio...',
  'Inspecting that empty bio...',
  'Cross-referencing your TODOs...',
  'Sharpening the comedic knives...',
  'Tallying unfinished READMEs...',
  'Decoding cryptic variable names...',
  'Scanning for "final_v2_FINAL" branches...',
  'Auditing your 3 AM commits...',
  'Calculating tabs-vs-spaces damage...',
  'Pretending to read your documentation...',
  'Detecting copy-pasted Stack Overflow...',
  'Weighing your star-to-substance ratio...',
  'Googling what your repo actually does...',
  'Counting the semicolons you forgot...',
  'Reviewing your forgotten pull requests...',
  'Summoning the spirit of clean code...',
  'Questioning your folder structure...',
  'Untangling your dependency tree...',
]

// Pick a random index, avoiding an immediate repeat of `prev`.
function randomMessageIndex(prev) {
  if (LOADING_MESSAGES.length <= 1) return 0
  let next = Math.floor(Math.random() * LOADING_MESSAGES.length)
  while (next === prev) {
    next = Math.floor(Math.random() * LOADING_MESSAGES.length)
  }
  return next
}

const HISTORY_KEY = 'roastHistory'
const HISTORY_LIMIT = 8

function readHistory() {
  try {
    const stored = JSON.parse(localStorage.getItem(HISTORY_KEY))
    return Array.isArray(stored) ? stored : []
  } catch {
    return []
  }
}

const compactNumber = new Intl.NumberFormat('en', {
  notation: 'compact',
  maximumFractionDigits: 1,
})
function formatStat(n) {
  return compactNumber.format(n ?? 0)
}

// Derive the headline profile stats from the API payload.
function computeStats(profile) {
  const repos = profile?.repositories ?? []
  return {
    repos: profile?.publicRepos ?? repos.length,
    stars: repos.reduce((sum, r) => sum + (r.stars || 0), 0),
    followers: profile?.followers ?? 0,
  }
}

function App() {
  const [username, setUsername] = useState('')
  // `style` is the dropdown selection (used for the NEXT roast); `activeStyle`
  // is the style of the roast currently shown / being generated, and drives the
  // theme so the UI never mismatches the displayed result.
  const [style, setStyle] = useState('savage')
  const [activeStyle, setActiveStyle] = useState('savage')
  // Discriminated result: null | { kind: 'roast', text }
  //   | { kind: 'notFound', username } | { kind: 'empty', username }
  //   | { kind: 'error', message }
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingIndex, setLoadingIndex] = useState(0)
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useState(readHistory)

  const hasRoast = result?.kind === 'roast'

  // While a roast is shown, lock the theme to that roast's style so they never
  // mismatch. Otherwise, live-preview the dropdown selection instead.
  const themeKey = hasRoast ? activeStyle : style
  const theme = THEMES[themeKey] ?? THEMES.savage
  // Empty-state copy follows the same key as the theme so they stay in sync.
  const emptyContent = EMPTY_STATES[themeKey] ?? EMPTY_STATES.savage

  // Flash a random funny loading message every 1.5s while a request is pending.
  useEffect(() => {
    if (!loading) return

    setLoadingIndex(randomMessageIndex(-1))
    const id = setInterval(() => {
      setLoadingIndex((prev) => randomMessageIndex(prev))
    }, 1500)

    return () => clearInterval(id)
  }, [loading])

  // Prepend a successful roast (including its text) to history, de-duplicating
  // identical username+style entries and capping the list. The cached text lets
  // us re-display past roasts instantly without another AI call.
  function saveToHistory(savedUsername, savedStyle, roastText, stats) {
    setHistory((prev) => {
      const deduped = prev.filter(
        (entry) =>
          entry.username.toLowerCase() !== savedUsername.toLowerCase() ||
          entry.style !== savedStyle,
      )
      const next = [
        { username: savedUsername, style: savedStyle, roast: roastText, stats },
        ...deduped,
      ].slice(0, HISTORY_LIMIT)
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(next))
      } catch {
        // Ignore storage errors (private mode, quota, etc.).
      }
      return next
    })
  }

  // Instantly re-display a cached roast from history without hitting the API.
  // Falls back to a fresh generation for legacy entries that predate caching.
  function showRecent(entry) {
    if (loading) return
    if (!entry.roast) {
      runRoast(entry.username, entry.style)
      return
    }
    setUsername(entry.username)
    setStyle(entry.style)
    setActiveStyle(entry.style)
    setResult({
      kind: 'roast',
      text: entry.roast,
      username: entry.username,
      stats: entry.stats,
    })
    setCopied(false)
  }

  async function runRoast(targetUsername, targetStyle) {
    const trimmed = targetUsername.trim()
    if (!trimmed || loading) return

    // Keep the inputs in sync (useful when re-running from a history tag).
    setUsername(trimmed)
    setStyle(targetStyle)

    // Commit the chosen style: theme + result now flip to it together.
    setActiveStyle(targetStyle)
    setLoading(true)
    setResult(null)
    setCopied(false)

    try {
      const response = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: trimmed, style: targetStyle }),
      })

      // 404 → user doesn't exist: distinct empty state, not a generic error.
      if (response.status === 404) {
        setResult({ kind: 'notFound', username: trimmed })
        return
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      // No public repos → nothing meaningful to roast: distinct empty state.
      const repos = data.profile?.repositories ?? []
      if (repos.length === 0) {
        setResult({ kind: 'empty', username: data.username || trimmed })
        return
      }

      const resolvedUsername = data.username || trimmed
      const stats = computeStats(data.profile)
      setResult({
        kind: 'roast',
        text: data.roast,
        username: resolvedUsername,
        stats,
      })
      saveToHistory(resolvedUsername, targetStyle, data.roast, stats)
    } catch (err) {
      setResult({ kind: 'error', message: err.message })
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    runRoast(username, style)
  }

  async function handleCopy() {
    if (!hasRoast) return
    try {
      await navigator.clipboard.writeText(result.text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // Clipboard API unavailable or blocked; silently ignore.
    }
  }

  return (
    <div
      className={`flex min-h-screen flex-col items-center px-4 py-16 transition-colors duration-500 ${theme.page} ${theme.bodyFont}`}
    >
      <div className="w-full max-w-xl">
        <header className="mb-10 text-center">
          <div
            className={`mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm ${theme.badge}`}
          >
            <span className="relative flex h-2 w-2">
              <span
                className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${theme.badgeDot}`}
              />
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${theme.badgeDot}`}
              />
            </span>
            AI-Powered Roasts
          </div>

          <div className="relative mb-4 flex items-center justify-center">
            <div
              className={`absolute h-28 w-72 -translate-y-2 rounded-full blur-3xl ${theme.glow}`}
              aria-hidden="true"
            />
            <h1 className="relative flex flex-wrap items-center justify-center gap-x-3 text-5xl font-black leading-tight tracking-tighter sm:text-6xl">
              <span className="drop-shadow-sm">{theme.emoji}</span>
              <span
                className={`bg-gradient-to-r bg-clip-text text-transparent ${theme.titleGradient}`}
              >
                Roast My GitHub
              </span>
            </h1>
          </div>

          <p className={`mx-auto max-w-md text-base sm:text-lg ${theme.subtitle}`}>
            Drop a GitHub username and let AI tear their public repos apart.
          </p>
          <p
            className={`mt-3 text-sm font-semibold uppercase tracking-[0.2em] ${theme.accent}`}
          >
            {theme.tagline}
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center"
        >
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. torvalds"
            disabled={loading}
            className={`flex-1 rounded-lg border px-3 py-2 outline-none transition focus:ring-2 ${theme.input}`}
          />
          <div className="relative w-full sm:w-48 sm:shrink-0">
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              disabled={loading}
              className={`w-full appearance-none rounded-lg border py-2 pl-3 pr-10 outline-none transition focus:ring-2 ${theme.select}`}
            >
              {ROAST_STYLES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span
              className={`pointer-events-none absolute inset-y-0 right-3 flex items-center ${theme.subtitle}`}
              aria-hidden="true"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 8l4 4 4-4" />
              </svg>
            </span>
          </div>

          {loading ? (
            <div
              className={`flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm sm:w-56 sm:shrink-0 ${theme.loadingBox}`}
              aria-live="polite"
            >
              <span
                className={`h-4 w-4 shrink-0 animate-spin rounded-full border-2 ${theme.spinner}`}
              />
              <span key={loadingIndex} className="animate-pulse">
                {LOADING_MESSAGES[loadingIndex]}
              </span>
            </div>
          ) : (
            <button
              type="submit"
              className={`w-full rounded-lg px-5 py-2 font-medium shadow transition active:scale-95 sm:w-auto ${theme.button}`}
            >
              Roast
            </button>
          )}
        </form>

        {!loading && hasRoast && style !== activeStyle && (
          <p className={`mb-4 text-sm italic ${theme.subtitle}`}>
            Press “Roast” to switch to the{' '}
            {ROAST_STYLES.find((s) => s.value === style)?.label} style.
          </p>
        )}

        {!loading && result?.kind === 'notFound' && (
          <div
            className={`flex flex-col items-center rounded-xl px-6 py-10 text-center ${theme.card}`}
          >
            <span className="mb-3 text-5xl">🔍</span>
            <h2 className={`mb-1 text-xl font-semibold ${theme.title}`}>
              No such GitHub user
            </h2>
            <p className={`${theme.subtitle}`}>
              We couldn’t find anyone named{' '}
              <span className="font-mono font-semibold">@{result.username}</span>.
              Double-check the spelling and try again.
            </p>
          </div>
        )}

        {!loading && result?.kind === 'empty' && (
          <div
            className={`flex flex-col items-center rounded-xl px-6 py-10 text-center ${theme.card}`}
          >
            <span className="mb-3 text-5xl">{emptyContent.emoji}</span>
            <h2 className={`mb-1 text-xl font-semibold ${theme.title}`}>
              {emptyContent.title}
            </h2>
            <p className={`whitespace-pre-line ${theme.roastText} ${theme.roastAlign}`}>
              {emptyContent.message(result.username)}
            </p>
          </div>
        )}

        {!loading && result?.kind === 'error' && (
          <div className="rounded-lg border border-red-700 bg-red-950/90 px-4 py-3 text-red-200">
            {result.message}
          </div>
        )}

        {!loading && hasRoast && result.stats && (
          <div
            className={`mb-3 flex items-stretch justify-around rounded-xl px-2 py-3 ${theme.card}`}
          >
            {[
              { label: 'Repos', value: result.stats.repos },
              { label: 'Stars', value: result.stats.stars },
              { label: 'Followers', value: result.stats.followers },
            ].map((stat, i) => (
              <div key={stat.label} className="flex flex-1 items-center">
                {i > 0 && (
                  <span className="h-8 w-px self-center bg-current opacity-10" />
                )}
                <div className="flex-1 px-2 text-center">
                  <div className={`text-2xl font-bold leading-none ${theme.accent}`}>
                    {formatStat(stat.value)}
                  </div>
                  <div
                    className={`mt-1 text-xs uppercase tracking-wider ${theme.subtitle}`}
                  >
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && hasRoast && (
          <div className={`rounded-xl px-5 py-4 ${theme.card}`}>
            <p
              className={`whitespace-pre-wrap ${theme.roastText} ${theme.roastAlign}`}
            >
              {result.text}
            </p>
            <div className="mt-3 flex justify-end gap-1">
              <button
                type="button"
                onClick={() => runRoast(username, activeStyle)}
                className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm transition ${theme.ghostButton}`}
                aria-label="Generate a fresh roast"
              >
                <span aria-hidden="true">↻</span> Regenerate
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm transition ${theme.ghostButton}`}
                aria-label="Copy roast to clipboard"
              >
                {copied ? (
                  <>
                    <span aria-hidden="true">✓</span> Copied!
                  </>
                ) : (
                  <>
                    <span aria-hidden="true">📋</span> Copy Roast
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {!loading && history.length > 0 && (
          <div className="mt-6">
            <p className={`mb-2 text-sm font-medium ${theme.subtitle}`}>
              Recent roasts
            </p>
            <div className="flex flex-wrap gap-2">
              {history.map((entry) => (
                <button
                  key={`${entry.username}-${entry.style}`}
                  type="button"
                  onClick={() => showRecent(entry)}
                  title={`Show saved roast for @${entry.username} (${STYLE_LABELS[entry.style] ?? entry.style})`}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition ${theme.tag}`}
                >
                  <span aria-hidden="true">{STYLE_EMOJI[entry.style] ?? '🔥'}</span>
                  <span className="font-mono">@{entry.username}</span>
                  <span className="opacity-60">
                    · {STYLE_LABELS[entry.style] ?? entry.style}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
