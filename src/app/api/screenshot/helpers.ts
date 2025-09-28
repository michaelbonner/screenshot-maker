import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { chromium } from "playwright";
import sharp from "sharp";

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

    const screenshotOptions: {
      format: "png" | "jpeg";
      quality?: number;
      fullPage: boolean;
    } = {
      format: type,
      quality: type !== "png" ? quality : undefined,
      fullPage,
    };

    const screenshotBuffer = await page.screenshot(screenshotOptions);

    if (scale !== 1) {
      const resizedBuffer = await resizeImage(
        screenshotBuffer,
        scale,
        type,
        quality
      );
      return resizedBuffer.toString("base64");
    }

    return screenshotBuffer.toString("base64");
  } catch (error) {
    console.error("Error accessing page:", error);
    return false;
  }
}

async function resizeImage(
  imageBuffer: Buffer,
  scale: number,
  type: "png" | "jpeg",
  quality: number
): Promise<Buffer> {
  const sharpInstance = sharp(imageBuffer);

  // Get original dimensions
  const metadata = await sharpInstance.metadata();
  const originalWidth = metadata.width || 0;
  const originalHeight = metadata.height || 0;

  // Calculate new dimensions
  const newWidth = Math.round(originalWidth * scale);
  const newHeight = Math.round(originalHeight * scale);

  // Resize with high-quality algorithm
  let resized = sharpInstance.resize(newWidth, newHeight, {
    kernel: sharp.kernel.lanczos3, // High-quality resampling
    withoutEnlargement: false, // Allow enlarging if scale > 1
  });

  // Apply format-specific options
  if (type === "jpeg") {
    resized = resized.jpeg({ quality });
  } else {
    resized = resized.png();
  }

  return await resized.toBuffer();
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
