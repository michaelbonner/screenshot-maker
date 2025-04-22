import chromium from "@sparticuz/chromium-min";
import { unstable_cache } from "next/cache";
import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { headers } from "next/headers";
import puppeteer, { Browser } from "puppeteer-core";
import { z } from "zod";

const remoteExecutablePath =
  "https://github.com/Sparticuz/chromium/releases/download/v121.0.0/chromium-v121.0.0-pack.tar";

let browser: Browser | null = null;

const DEFAULT_WIDTH = 1920;
const DEFAULT_HEIGHT = 1080;
const DEFAULT_SCALE = 0.25;

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

async function getScreenshotAsBase64(
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
    await new Promise((r) => setTimeout(r, 1000));
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
    });
  } catch (error) {
    console.error("Error accessing page:", error);
    return false;
  }
}

const inputSchema = z
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const headersList = await headers();

  const url = searchParams.get("url");
  const width = searchParams.get("width");
  const height = searchParams.get("height");
  const scale = searchParams.get("scale");
  const key = searchParams.get("key");

  // check key or host is valid
  if (!isValidKey(key) && !isValidOrigin(headersList)) {
    return Response.json({ message: `Unauthorized` }, { status: 401 });
  }

  const validationResult = inputSchema.safeParse({ url, width, height, scale });

  if (!validationResult.success) {
    return Response.json(
      {
        message: `Invalid query parameters`,
        error: validationResult.error,
      },
      { status: 400 }
    );
  }

  if (!url) {
    return Response.json(
      { message: `A ?url query-parameter is required` },
      {
        status: 400,
      }
    );
  }

  if (!url) {
    return new Response(
      JSON.stringify({ error: "URL parameter is required" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const getCachedScreenshot = unstable_cache(
    async (url: string, width: number, height: number, scale: number) =>
      getScreenshotAsBase64(url, {
        width,
        height,
        scale,
      }),
    [
      url,
      width || DEFAULT_WIDTH.toString(),
      height || DEFAULT_HEIGHT.toString(),
      scale || DEFAULT_SCALE.toString(),
    ],
    {
      tags: [url],
      // 1 hour
      revalidate: 3600,
    }
  );

  const screenshot = await getCachedScreenshot(
    url,
    +(width || DEFAULT_WIDTH),
    +(height || DEFAULT_HEIGHT),
    +(scale || DEFAULT_SCALE)
  );

  if (!screenshot) {
    return new Response(
      JSON.stringify({ error: "Failed to generate screenshot" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  //   convert the base64 string to a buffer we can return as an image response
  const buffer = Buffer.from(screenshot, "base64");
  return new Response(buffer, {
    status: 200,
    headers: { "Content-Type": "image/webp" },
  });
}
