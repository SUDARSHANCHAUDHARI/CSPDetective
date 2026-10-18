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

  if (isBlockedHost(parsed.hostname)) {
    return { ok: false, error: "Local, private and internal hosts are not allowed." };
  }

  return { ok: true, url: parsed.toString() };
}

/**
 * True for loopback/private/link-local/CGNAT/metadata IP literals and
 * local-only names. Expects a WHATWG URL hostname, which is already
 * canonical: IPv4 in dotted form (0x7f.1 -> 127.0.0.1), IPv6 in brackets.
 * shortcut: name/literal check only — Cloudflare Workers have no DNS API, so a
 * public name that resolves to a private address is not caught here.
 */
export function isBlockedHost(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/\.$/, "").replace(/^\[|\]$/g, "");
  if (host === "localhost" || /\.(localhost|local|internal)$/.test(host)) return true;
  return isPrivateIp(host);
}

function isPrivateIpv4(ip: string): boolean {
  const m = ip.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!m) return false;
  const a = Number(m[1]);
  const b = Number(m[2]);
  return (
    a === 0 || a === 10 || a === 127 || a >= 224 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 100 && b >= 64 && b <= 127)
  );
}

function isPrivateIp(ip: string): boolean {
  if (isPrivateIpv4(ip)) return true;
  if (!ip.includes(":")) return false;
  if (ip === "::" || ip === "::1") return true;
  if (/^f[cd]/.test(ip) || /^fe[89ab]/.test(ip)) return true;
  // IPv4-mapped: ::ffff:1.2.3.4 or the URL-normalized ::ffff:102:304
  const mapped = ip.match(/^::ffff:(.+)$/);
  if (mapped) {
    const tail = mapped[1];
    if (tail.includes(".")) return isPrivateIpv4(tail);
    const hex = tail.match(/^([0-9a-f]{1,4}):([0-9a-f]{1,4})$/);
    if (hex) {
      const hi = parseInt(hex[1], 16);
      const lo = parseInt(hex[2], 16);
      return isPrivateIpv4(`${hi >> 8}.${hi & 255}.${lo >> 8}.${lo & 255}`);
    }
    return true;
  }
  return false;
}
