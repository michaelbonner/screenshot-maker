import chromium from "@sparticuz/chromium-min";
import puppeteer, { Browser } from "puppeteer-core";
import { z } from "zod";

const remoteExecutablePath =
  "https://github.com/Sparticuz/chromium/releases/download/v121.0.0/chromium-v121.0.0-pack.tar";

let browser: Browser | null = null;

async function getBrowser() {
  if (browser) return browser;

  if (process.env.NEXT_PUBLIC_VERCEL_ENVIRONMENT === "production") {
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

async function getScreenshot(
  url: string,
  options: {
    width: number;
    height: number;
    scale: number;
  }
) {
  const width = options.width || 1920;
  const height = options.height || 1080;
  const scale = options.scale || 0.25;

  try {
    const browser = await getBrowser();
    const page = await browser.newPage();
    await page.setViewport({ width, height });
    await page.goto(url, { waitUntil: "domcontentloaded" });
    return page.screenshot({
      type: "jpeg",
      quality: 80,
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
    width: z.coerce.number().optional().default(1920),
    height: z.coerce.number().optional().default(1080),
    scale: z.coerce.number().max(1).optional().default(0.25),
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  const width = searchParams.get("width");
  const height = searchParams.get("height");
  const scale = searchParams.get("scale");

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
  const screenshot = await getScreenshot(url, {
    width: +width,
    height: +height,
    scale: +scale,
  });

  if (!screenshot) {
    return new Response(
      JSON.stringify({ error: "Failed to generate screenshot" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  return new Response(screenshot, {
    status: 200,
    headers: { "Content-Type": "image/jpeg" },
  });
}
