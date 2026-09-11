import { describe, expect, test } from "bun:test";
import { checkAuth, isPublicScreenshotUrl } from "./helpers.ts";

describe("isPublicScreenshotUrl", () => {
  test("allows bootpackdigital.com without authentication", () => {
    expect(
      checkAuth(new Headers(), null, "https://bootpackdigital.com")
    ).toBe(true);
    expect(isPublicScreenshotUrl("https://bootpackdigital.com")).toBe(true);
    expect(
      isPublicScreenshotUrl("https://bootpackdigital.com/work/example")
    ).toBe(true);
  });

  test("does not allow lookalike or subdomain hosts", () => {
    expect(isPublicScreenshotUrl("https://bootpackdigital.com.example.com")).toBe(
      false
    );
    expect(isPublicScreenshotUrl("https://www.bootpackdigital.com")).toBe(false);
  });
});
