// Centralized Express error handler. Errors that carry a `clientMessage`
// (e.g. the Gemini 429 rate limit) are surfaced to the client as-is; anything
// else falls back to a safe message so internal details aren't leaked.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  const status = err.status ?? 500;

  if (status >= 500) {
    console.error("[error]", err);
  }

  const message =
    err.clientMessage ||
    (status >= 500 ? "Something went wrong on our end." : err.message) ||
    "Internal server error";

  res.status(status).json({ error: message });
}
