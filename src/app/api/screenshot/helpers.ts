import chromium from "@sparticuz/chromium-min";
import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import puppeteer, { Browser } from "puppeteer-core";
import { z } from "zod";

export const inputSchema = z
  .object({
    url: z.string().url(),
    width: z.coerce.number().optional(),
    height: z.coerce.number().optional(),
    scale: z.coerce.number().max(1).optional(),
  })
  .superRefine((data, ctx) => {
    const hasWidth = data.width;
    const hasHeight = data.height;

    if (hasWidth && hasHeight) return;
    if (!hasWidth && !hasHeight) return;

    // If exactly one of width/height is supplied, error
    if (!hasWidth) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Width is required when height is provided",
        path: ["width"],
      });
    }
    if (!hasHeight) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Height is required when width is provided",
        path: ["height"],
      });
    }
  });

const remoteExecutablePath =
  "https://github.com/Sparticuz/chromium/releases/download/v121.0.0/chromium-v121.0.0-pack.tar";

let browser: Browser | null = null;

async function getBrowser() {
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
  }
) {
  const width = options.width;
  const height = options.height;
  const scale = options.scale;

  try {
    const browser = await getBrowser();
    const page = await browser.newPage();
    await page.setViewport({ width, height });
    await page.goto(url, { waitUntil: "networkidle2" });
    await new Promise((r) => setTimeout(r, 2000));
    return page.screenshot({
      encoding: "base64",
      type: "webp",
      quality: 50,
      clip: {
        scale,
        x: 0,
        y: 0,
        width,
        height,
      },
      optimizeForSpeed: true,
    });
  } catch (error) {
    console.error("Error accessing page:", error);
    return false;
  }
}

export const checkAuth = (headersList: ReadonlyHeaders, key: string | null) => {
  if (process.env.BYPASS_AUTH_CHECK === "true") return true;

  if (!isValidKey(key)) return false;

  if (!isValidOrigin(headersList)) return false;

  return true;
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
