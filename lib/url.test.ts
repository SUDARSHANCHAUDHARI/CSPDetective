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

  it("rejects private, loopback, link-local and internal hosts (SSRF guard)", () => {
    for (const bad of [
      "http://127.0.0.1",
      "http://169.254.169.254/latest/meta-data/",
      "http://[::1]",
      "http://10.0.0.5",
      "http://172.16.0.1",
      "http://192.168.1.1",
      "http://100.64.0.1",
      "http://0.0.0.0",
      "http://0x7f.1",
      "http://[::ffff:127.0.0.1]",
      "http://[fd00::1]",
      "http://[fe80::1]",
      "http://localhost",
      "http://printer.local",
      "http://metadata.google.internal",
    ]) {
      expect(validateTargetUrl(bad).ok, bad).toBe(false);
    }
  });

  it("preserves a path and query string", () => {
    expect(validateTargetUrl("https://example.com/path?q=1")).toEqual({
      ok: true,
      url: "https://example.com/path?q=1",
    });
  });
});
