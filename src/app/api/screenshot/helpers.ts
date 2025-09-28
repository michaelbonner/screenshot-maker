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
    type: "png" | "jpeg" | "webp" | "avif";
  }
) {
  const { width, height, scale, quality, fullPage, type } = options;

  try {
    const browser = await getBrowser();
    const page = await browser.newPage();
    await page.setViewportSize({ width, height });
    await page.goto(url, { waitUntil: "load", timeout: 10000 });

    const screenshotOptions: {
      format: "png";
      fullPage: boolean;
    } = {
      format: "png",
      fullPage,
    };

    const screenshotBuffer = await page.screenshot(screenshotOptions);

    // If the requested type is not PNG, convert it using Sharp
    let processedBuffer = screenshotBuffer;
    if (type !== "png") {
      processedBuffer = await convertImageFormat(
        screenshotBuffer,
        type,
        quality
      );
    }

    if (scale !== 1) {
      const resizedBuffer = await resizeImage(
        processedBuffer,
        scale,
        type,
        quality
      );
      return resizedBuffer.toString("base64");
    }

    return processedBuffer.toString("base64");
  } catch (error) {
    console.error("Error accessing page:", error);
    return false;
  }
}

async function convertImageFormat(
  imageBuffer: Buffer,
  targetType: "jpeg" | "webp" | "avif",
  quality: number
): Promise<Buffer> {
  const sharpInstance = sharp(imageBuffer);

  switch (targetType) {
    case "jpeg":
      return await sharpInstance.jpeg({ quality }).toBuffer();
    case "webp":
      return await sharpInstance.webp({ quality }).toBuffer();
    case "avif":
      return await sharpInstance.avif({ quality }).toBuffer();
    default:
      return imageBuffer;
  }
}

async function resizeImage(
  imageBuffer: Buffer,
  scale: number,
  type: "png" | "jpeg" | "webp" | "avif",
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
  } else if (type === "webp") {
    resized = resized.webp({ quality });
  } else if (type === "avif") {
    resized = resized.avif({ quality });
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
