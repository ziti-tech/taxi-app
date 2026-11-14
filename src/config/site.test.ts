import { describe, expect, it } from "vitest";
import { resolveSiteOrigin } from "./site";

describe("site origin configuration", () => {
  it("uses the real production origin when the optional override is empty", () => {
    expect(resolveSiteOrigin(undefined)).toBe("https://www.nammaonewaydroptaxi.com");
    expect(resolveSiteOrigin("  ")).toBe("https://www.nammaonewaydroptaxi.com");
  });

  it("normalizes trailing slashes, paths and queries to one consistent origin", () => {
    expect(resolveSiteOrigin(" https://www.nammaonewaydroptaxi.com/path?preview=1#book ")).toBe("https://www.nammaonewaydroptaxi.com");
    expect(resolveSiteOrigin("http://localhost:3000/")).toBe("http://localhost:3000");
  });

  it.each(["invalid-url", "javascript:alert(1)", "ftp://example.com", "https://user:password@example.com"])("rejects an invalid or credential-bearing origin", (value) => {
    expect(() => resolveSiteOrigin(value)).toThrow("NEXT_PUBLIC_SITE_URL must be");
  });
});
