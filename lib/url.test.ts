import { describe, it, expect } from "vitest";
import { validateTargetUrl } from "./url";

describe("validateTargetUrl", () => {
  it("accepts a clean https URL", () => {
    expect(validateTargetUrl("https://example.com/")).toEqual({
      ok: true,
      url: "https://example.com/",
    });
  });

  it("accepts http", () => {
    const r = validateTargetUrl("http://example.com");
    expect(r.ok).toBe(true);
  });

  it("adds https when scheme is missing", () => {
    expect(validateTargetUrl("example.com")).toEqual({
      ok: true,
      url: "https://example.com/",
    });
  });

  it("trims surrounding whitespace", () => {
    expect(validateTargetUrl("  example.com  ")).toEqual({
      ok: true,
      url: "https://example.com/",
    });
  });

  it("rejects an empty input", () => {
    expect(validateTargetUrl("")).toEqual({ ok: false, error: "URL is required." });
    expect(validateTargetUrl("   ")).toEqual({ ok: false, error: "URL is required." });
  });

  it("rejects non-http(s) schemes (SSRF guard)", () => {
    for (const bad of ["file:///etc/passwd", "javascript:alert(1)", "ftp://x.com", "gopher://x.com"]) {
      const r = validateTargetUrl(bad);
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error).toMatch(/only http and https|valid URL/i);
    }
  });

  it("rejects a string that cannot be parsed as a URL", () => {
    expect(validateTargetUrl("ht tp://broken").ok).toBe(false);
  });

  it("preserves a path and query string", () => {
    expect(validateTargetUrl("https://example.com/path?q=1")).toEqual({
      ok: true,
      url: "https://example.com/path?q=1",
    });
  });
});
