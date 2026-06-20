/**
 * Result of validating a user-supplied URL string for the headers endpoint.
 * Either a normalized URL (http/https only) or a human-readable error.
 */
export type UrlValidation =
  | { ok: true; url: string }
  | { ok: false; error: string };

/**
 * Validate and normalize a target URL. Rejects anything that isn't an http(s)
 * URL — this is the safety boundary for the headers fetch endpoint, which is
 * a network call from the server. SSRF-style misuse via file:, javascript:,
 * data:, ftp:, gopher: etc. is blocked here.
 *
 * Leading/trailing whitespace is trimmed. A scheme is added if missing
 * (treated as https) so users can paste "example.com" and have it work.
 */
export function validateTargetUrl(input: string): UrlValidation {
  const trimmed = input.trim();
  if (trimmed.length === 0) {
    return { ok: false, error: "URL is required." };
  }

  // Only prepend a scheme if the input has none at all. If it has a non-http(s)
  // scheme (file:, javascript:, ftp:, etc.) we MUST leave it alone so the
  // protocol check below rejects it — otherwise prepending https:// would
  // silently allow "file:///etc/passwd" through as "https://file:///etc/passwd".
  const hasScheme = /^[a-z][a-z0-9+.-]*:/i.test(trimmed);
  const withScheme = hasScheme ? trimmed : `https://${trimmed}`;

  let parsed: URL;
  try {
    parsed = new URL(withScheme);
  } catch {
    return { ok: false, error: "Not a valid URL." };
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { ok: false, error: "Only http and https URLs are supported." };
  }

  if (!parsed.hostname) {
    return { ok: false, error: "URL must include a hostname." };
  }

  return { ok: true, url: parsed.toString() };
}
