import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { chromium, Browser } from "playwright";

async function getBrowser() {
  if (process.env.NODE_ENV === "production") {
    return await chromium.launch({
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--single-process",
        "--disable-gpu",
      ],
      headless: true,
    });
  } else {
    return await chromium.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: true,
    });
  }
}

export async function getScreenshotAsBase64(
  url: string,
  options: {
    width: number;
    height: number;
    scale: number;
    quality: number;
    fullPage: boolean;
    type: "png" | "jpeg";
  }
) {
  const { width, height, scale, quality, fullPage, type } = options;

  try {
    const browser = await getBrowser();
    const page = await browser.newPage();
    await page.setViewportSize({ width, height });
    await page.goto(url, { waitUntil: "load", timeout: 10000 });

    console.log("type", type);

    const screenshotOptions: {
      format: "png" | "jpeg";
      quality?: number;
      fullPage: boolean;
    } = {
      format: type,
      quality: type !== "png" ? quality : undefined,
      fullPage,
    };

    if (!fullPage && scale !== 1) {
      // Set the viewport to the scaled size
      await page.setViewportSize({
        width: Math.round(width * scale),
        height: Math.round(height * scale),
      });
    }

    const screenshotBuffer = await page.screenshot(screenshotOptions);
    return screenshotBuffer.toString("base64");
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
