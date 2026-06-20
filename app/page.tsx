"use client";

import { useState, type FormEvent } from "react";

type HeadersResult = {
  url: string;
  finalUrl: string;
  status: number;
  statusText: string;
  headers: Record<string, string>;
};

type ErrorResult = { error: string };

const SECURITY_HEADERS = new Set([
  "content-security-policy",
  "x-frame-options",
  "strict-transport-security",
  "x-content-type-options",
  "referrer-policy",
  "permissions-policy",
]);

export default function HomePage() {
  const [url, setUrl] = useState("https://example.com");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HeadersResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch(`/api/headers?url=${encodeURIComponent(url)}`);
      const body = (await response.json()) as HeadersResult | ErrorResult;
      if (!response.ok || "error" in body) {
        setError("error" in body ? body.error : "Request failed.");
      } else {
        setResult(body);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-10">
        <p className="text-xs uppercase tracking-widest text-slate-400">MVP scaffold</p>
        <h1 className="mt-1 text-4xl font-semibold">CSP Detective</h1>
        <p className="mt-3 text-slate-300">
          Inspect a URL&apos;s HTTP response headers. Highlights the security-relevant
          ones: <code>Content-Security-Policy</code>, <code>X-Frame-Options</code>,
          <code> Strict-Transport-Security</code>, and friends.
        </p>
      </header>

      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="flex-1 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm placeholder:text-slate-500 focus:border-slate-400 focus:outline-none"
          aria-label="Target URL"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 disabled:opacity-50"
        >
          {loading ? "Inspecting…" : "Inspect"}
        </button>
      </form>

      {error && (
        <p className="mt-6 rounded-md border border-red-800 bg-red-950 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      )}

      {result && (
        <section className="mt-8">
          <div className="mb-4 text-sm text-slate-300">
            <p>
              <span className="text-slate-500">Status:</span> {result.status} {result.statusText}
            </p>
            {result.finalUrl !== result.url && (
              <p>
                <span className="text-slate-500">Redirected to:</span>{" "}
                <code>{result.finalUrl}</code>
              </p>
            )}
          </div>

          <table className="w-full table-fixed border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="w-1/3 py-2 pr-4">Header</th>
                <th className="py-2">Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(result.headers)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([name, value]) => {
                  const isSecurity = SECURITY_HEADERS.has(name.toLowerCase());
                  return (
                    <tr
                      key={name}
                      className={`border-b border-slate-900 align-top ${
                        isSecurity ? "bg-emerald-950/30" : ""
                      }`}
                    >
                      <td className="break-words py-2 pr-4 font-mono text-xs text-slate-300">
                        {name}
                        {isSecurity && (
                          <span className="ml-2 rounded bg-emerald-900 px-1 py-0.5 text-[10px] uppercase text-emerald-200">
                            sec
                          </span>
                        )}
                      </td>
                      <td className="break-words py-2 font-mono text-xs text-slate-400">
                        {value}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </section>
      )}
    </main>
  );
}
