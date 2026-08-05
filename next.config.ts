import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Playwright drives a real Chromium installed into the image (see
  // Dockerfile); it must stay a plain runtime require rather than something
  // Next tries to bundle or trace.
  serverExternalPackages: ["playwright", "playwright-core"],
};

export default nextConfig;
