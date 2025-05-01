import chromium from "@sparticuz/chromium-min";
import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import puppeteer, { Browser } from "puppeteer-core";

const remoteExecutablePath =
  "https://github.com/Sparticuz/chromium/releases/download/v121.0.0/chromium-v121.0.0-pack.tar";

let browser: Browser | null = null;

async function getBrowser(defaultViewport: { width: number; height: number }) {
  if (browser) return browser;

  if (process.env.NODE_ENV === "production") {
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(remoteExecutablePath),
      headless: true,
    });
  } else {
    browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: true,
      channel: "chrome",
      defaultViewport,
    });
  }
  return browser;
}

export async function getScreenshotAsBase64(
  url: string,
  options: {
    width: number;
    height: number;
    scale: number;
    quality: number;
    fullPage: boolean;
  }
) {
  const { width, height, scale, quality, fullPage } = options;

  try {
    const browser = await getBrowser({
      width,
      height,
    });
    const page = await browser.newPage();
    await page.setViewport({ width, height });
    await page.goto(url, { waitUntil: "networkidle2" });
    await new Promise((r) => setTimeout(r, 2000));
    return page.screenshot({
      encoding: "base64",
      type: "webp",
      quality,
      clip: fullPage
        ? undefined
        : {
            scale,
            x: 0,
            y: 0,
            width,
            height,
          },
      optimizeForSpeed: true,
      fullPage,
    });
  } catch (error) {
    console.error("Error accessing page:", error);
    return false;
  }
}

export const checkAuth = (headersList: ReadonlyHeaders, key: string | null) => {
  if (process.env.BYPASS_AUTH_CHECK === "true") return true;

  if (isValidKey(key)) return true;

  if (isValidOrigin(headersList)) return true;

  return false;
};

const isValidOrigin = (headersList: ReadonlyHeaders) => {
  const referer = headersList.get("referer");

  if (!referer) {
    return false;
  }

  if (!process.env.ALLOWED_ORIGINS) {
    return false;
  }

  return JSON.parse(process.env.ALLOWED_ORIGINS).some(
    (allowedOrigin: string) => new URL(referer).hostname === allowedOrigin
  );
};

const isValidKey = (key: string | null) => {
  if (!key) {
    return false;
  }

  return key === process.env.API_KEY;
};
