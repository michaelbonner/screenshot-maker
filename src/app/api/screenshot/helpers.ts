import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import puppeteer, { ScreenshotOptions } from "puppeteer-core";

async function getBrowser(defaultViewport: { width: number; height: number }) {
  if (process.env.CHROMIUM_EXECUTABLE_PATH) {
    return await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      executablePath: process.env.CHROMIUM_EXECUTABLE_PATH,
      defaultViewport,
    });
  }

  return await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    channel: "chrome",
    defaultViewport,
  });
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
    await page.goto(url, { waitUntil: "networkidle2" });
    await new Promise((r) => setTimeout(r, 2000));
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
