// Cloudflare Pages Function — serves GET /api/headers.
// Ported from the former Next.js route handler (app/api/headers/route.ts) so the
// app can be a static export + Functions on Cloudflare Pages. Uses only Web APIs.
import { validateTargetUrl } from "../../lib/url";

const FETCH_TIMEOUT_MS = 10_000;
const MAX_REDIRECTS = 5;

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export const onRequestGet = async (context: { request: Request }): Promise<Response> => {
  const { searchParams } = new URL(context.request.url);
  const rawUrl = searchParams.get("url") ?? "";

  const validation = validateTargetUrl(rawUrl);
  if (!validation.ok) {
    return json({ error: validation.error }, 400);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    // Follow redirects by hand so every hop goes through validateTargetUrl.
    let currentUrl = validation.url;
    let response: Response;
    for (let hop = 0; ; hop++) {
      response = await fetch(currentUrl, {
        method: "GET",
        redirect: "manual",
        signal: controller.signal,
        headers: {
          // Identify ourselves so site owners can see who's probing.
          "user-agent": "CSP-Detective/0.1 (+https://github.com/SUDARSHANCHAUDHARI/CSPDetective)",
        },
      });
      const location = response.headers.get("location");
      if (response.status < 300 || response.status >= 400 || !location) break;
      if (hop >= MAX_REDIRECTS) {
        return json({ error: `Too many redirects (more than ${MAX_REDIRECTS}).` }, 502);
      }
      const next = validateTargetUrl(new URL(location, currentUrl).toString());
      if (!next.ok) {
        return json({ error: `Redirect blocked: ${next.error}` }, 400);
      }
      currentUrl = next.url;
    }

    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    return json({
      url: validation.url,
      finalUrl: currentUrl,
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  } catch (error) {
    const message =
      error instanceof Error && error.name === "AbortError"
        ? `Request timed out after ${FETCH_TIMEOUT_MS}ms.`
        : error instanceof Error
          ? error.message
          : "Failed to fetch URL.";
    return json({ error: message }, 502);
  } finally {
    clearTimeout(timeout);
  }
};
