import { NextResponse } from "next/server";
import { validateTargetUrl } from "@/lib/url";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FETCH_TIMEOUT_MS = 10_000;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get("url") ?? "";

  const validation = validateTargetUrl(rawUrl);
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(validation.url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        // Identify ourselves so site owners can see who's probing.
        "user-agent": "CSP-Detective/0.1 (+https://github.com/SUDARSHANCHAUDHARI/CSPDetective)",
      },
    });

    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    return NextResponse.json({
      url: validation.url,
      finalUrl: response.url,
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
    return NextResponse.json({ error: message }, { status: 502 });
  } finally {
    clearTimeout(timeout);
  }
}
