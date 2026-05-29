import { useEffect, useState } from 'react'

const ROAST_STYLES = [
  { value: 'savage', label: 'Savage' },
  { value: 'corporate', label: 'Corporate Jargon' },
  { value: 'pirate', label: 'Pirate' },
  { value: 'haiku', label: 'Haiku' },
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
]

function App() {
  const [username, setUsername] = useState('')
  // `style` is the dropdown selection (used for the NEXT roast); `activeStyle`
  // is the style of the roast currently shown / being generated, and drives the
  // theme so the UI never mismatches the displayed result.
  const [style, setStyle] = useState('savage')
  const [activeStyle, setActiveStyle] = useState('savage')
  const [roast, setRoast] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingIndex, setLoadingIndex] = useState(0)

  // While a roast is shown, lock the theme to that roast's style so they never
  // mismatch. With nothing shown, live-preview the dropdown selection instead.
  const themeKey = roast ? activeStyle : style
  const theme = THEMES[themeKey] ?? THEMES.savage

  // Cycle the funny loading messages every 1.5s while a request is pending.
  useEffect(() => {
    if (!loading) return

    setLoadingIndex(0)
    const id = setInterval(() => {
      setLoadingIndex((i) => (i + 1) % LOADING_MESSAGES.length)
    }, 1500)

    return () => clearInterval(id)
  }, [loading])

  async function handleSubmit(event) {
    event.preventDefault()

    const trimmed = username.trim()
    if (!trimmed) return

    // Commit the chosen style: theme + result now flip to it together.
    setActiveStyle(style)
    setLoading(true)
    setError('')
    setRoast('')

    try {
      const response = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: trimmed, style }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      setRoast(data.roast)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className={`flex min-h-screen flex-col items-center px-4 py-16 transition-colors duration-500 ${theme.page} ${theme.bodyFont}`}
    >
      <div className="w-full max-w-xl">
        <h1 className={`mb-2 text-4xl ${theme.title}`}>
          <span className="mr-2">{theme.emoji}</span>
          Roast My GitHub
        </h1>
        <p className={`mb-1 ${theme.subtitle}`}>
          Enter a GitHub username and let the AI roast their public repos.
        </p>
        <p className={`mb-6 text-sm italic ${theme.subtitle}`}>{theme.tagline}</p>

        <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. torvalds"
            disabled={loading}
            className={`flex-1 rounded-lg border px-3 py-2 outline-none transition focus:ring-2 ${theme.input}`}
          />
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            disabled={loading}
            className={`rounded-lg border px-3 py-2 outline-none transition focus:ring-2 ${theme.select}`}
          >
            {ROAST_STYLES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {loading ? (
            <div
              className={`flex min-w-[14rem] items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm ${theme.loadingBox}`}
              aria-live="polite"
            >
              <span
                className={`h-4 w-4 animate-spin rounded-full border-2 ${theme.spinner}`}
              />
              <span key={loadingIndex} className="animate-pulse">
                {LOADING_MESSAGES[loadingIndex]}
              </span>
            </div>
          ) : (
            <button
              type="submit"
              className={`rounded-lg px-5 py-2 font-medium shadow transition active:scale-95 ${theme.button}`}
            >
              Roast
            </button>
          )}
        </form>

        {!loading && roast && style !== activeStyle && (
          <p className={`mb-4 text-sm italic ${theme.subtitle}`}>
            Press “Roast” to switch to the{' '}
            {ROAST_STYLES.find((s) => s.value === style)?.label} style.
          </p>
        )}

        {error && (
          <div className="rounded-lg border border-red-700 bg-red-950/90 px-4 py-3 text-red-200">
            {error}
          </div>
        )}

        {roast && (
          <div className={`rounded-xl px-5 py-4 ${theme.card}`}>
            <p
              className={`whitespace-pre-wrap ${theme.roastText} ${theme.roastAlign}`}
            >
              {roast}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
