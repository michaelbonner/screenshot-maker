import chromium from "@sparticuz/chromium-min";
import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import puppeteer, { Browser, ScreenshotOptions } from "puppeteer-core";

const CHROMIUM_VERSION = "v138.0.2";

const remoteExecutablePath = `https://github.com/Sparticuz/chromium/releases/download/${CHROMIUM_VERSION}/chromium-${CHROMIUM_VERSION}-pack.x64.tar`;

let browser: Browser | null = null;

async function getBrowser(defaultViewport: { width: number; height: number }) {
  if (browser) return browser;

  if (process.env.NODE_ENV === "production") {
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath:
        process.env.CHROMIUM_EXECUTABLE_PATH ||
        (await chromium.executablePath(remoteExecutablePath)),
      headless: true,
      defaultViewport,
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
  } & ScreenshotOptions
) {
  const { width, height, scale, quality, fullPage, type } = options;

  try {
    const browser = await getBrowser({
      width,
      height,
    });
    const page = await browser.newPage();
    await page.setViewport({ width, height });
    await page.goto(url, { waitUntil: "networkidle2", timeout: 10000 });
    return page.screenshot({
      encoding: "base64",
      type,
      quality: type !== "png" ? quality : undefined,
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
